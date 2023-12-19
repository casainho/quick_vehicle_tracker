import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Make sure to import Leaflet library

function View_MapLocalization() {
  const viewRef = useRef(null);

  // This await fetch the data from the server that has the EScooter data like GPS lat and lon  
  const [data, setData] = useState(null);

  const [refVisible, setRefVisible] = useState(false)
  const [availableWidthHeight, setAvailableWidthHeight] = useState([null, null]);
  const [addressGEO, setAddress] = useState(false)

  // Function to perform reverse geocoding using OpenStreetMap Nominatim
  async function reverseGeocode(lat, lon) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.display_name) {
        // Extract the formatted address
        const formattedAddress = data.display_name;
        console.log('Formatted Address:', formattedAddress);
        setAddress(formattedAddress)
        return formattedAddress;
      } else {
        console.error('Geocoding error:', data.error || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/gps_data_records');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  useEffect(() => {
    if (!refVisible) { 
      return
    }

    if (viewRef.current) {
      const parentWidth = viewRef.current.offsetWidth;
      const parentOffsetLeft = viewRef.current.offsetLeft;
      const newAvailableWidth = window.innerWidth - parentOffsetLeft - parentWidth;

      const parentHeight = viewRef.current.parentElement.offsetHeight;
      const parentOffsetTop = viewRef.current.parentElement.offsetTop;
      const newAvailableHeight = window.innerHeight - parentOffsetTop - parentHeight;
      setAvailableWidthHeight([newAvailableWidth, newAvailableHeight]);
    }
  }, [refVisible]); // Run when refVisible changes

  // This react component will be called again when data is fetched and will not enter this if
  if (!data) {
    return <div>Loading...</div>;
  }

  let last_record = data[data.length - 1];
  let time = last_record.time;
  let lat = last_record.gps.lat;
  let lon = last_record.gps.lon;

  let address = ''
  reverseGeocode(lat, lon);
  if (addressGEO !== false) {
    address = addressGEO;
  } else {
    return <div>Loading...</div>;
  }


  // Costum icon of an EScooter
  var iconEScooter = new L.icon({
    iconUrl: require('../icon_escooter.png'),
    iconSize: [32, 46], // size of the icon
    className: 'leaflet-div-icon',
    shadowUrl: require('../icon_escooter.png'),
    shadowSize: 32,
    shadowAnchor: 0,
    iconAnchor: [23, 46], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -23] // point from which the popup should open relative to the iconAnchor
  });

  // Calculate the date and time
  // Linux time to string
  const date = new Date(time * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let formatedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      ref={el => { viewRef.current = el; setRefVisible(true); }}
      style={{ width: availableWidthHeight[0] + 'px', height: availableWidthHeight[1] + 'px', border: '1px solid #000'}} >

      {/* Show the Map only when availableWidthHeight values are not null */}
      {availableWidthHeight[0] && (
        <MapContainer center={[lat, lon]} zoom={18} scrollWheelZoom={true} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Use the custom icon */}
          <Marker position={[lat, lon]} icon={iconEScooter}>

            {/* Use this Popup to show to user, the position and time details */}
            <Popup>
              Date: {formatedDate}<br></br>
              Latitute: {lat}, Longitude: {lon}<br></br>
              Address: {address}<br></br>
              <a href={`https://maps.google.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </Popup>
            
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default View_MapLocalization;
