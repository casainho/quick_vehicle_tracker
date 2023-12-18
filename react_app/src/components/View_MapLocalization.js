import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Make sure to import Leaflet library

function View_MapLocalization() {

  // This await fetch the data from the server that has the EScooter data like GPS lat and lon  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const parentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/gps_data_records');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (parentRef.current) {
      const { clientWidth, clientHeight } = parentRef.current;
      console.log(clientWidth);
      console.log(clientHeight);
    }

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  // This react component will be called again when data is fetched and will not enter this if
  if (data === null) {
    return <div>Loading...</div>;
  }

  let last_record = data[data.length - 1];
  let time = last_record.time;
  let lat = last_record.gps.lat;
  let lon = last_record.gps.lon;

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

  // Calculate the div size, where the map will be placed
  // This values adjust to the window size, but if window is changed, a manual refrest need to be done
  let windowInnerWidthStr = window.innerWidth - 290 + 'px';
  let windowInnerHeightStr = window.innerHeight - 180 + 'px';

  return (
    <div style={{ width: windowInnerWidthStr, height: windowInnerHeightStr }}>
      <MapContainer center={[lat, lon]} zoom={18} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
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
            <a href={`https://maps.google.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
          </Popup>
          
        </Marker>
      </MapContainer>
    </div>
  );
}

export default View_MapLocalization;
