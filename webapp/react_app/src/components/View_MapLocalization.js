import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Make sure to import Leaflet library
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toPng } from 'html-to-image';

function View_MapLocalization() {
  const viewRef = useRef(null);

  // This await fetch the data from the server that has the EScooter data like GPS lat and lon  
  const [data, setData] = useState(null);
  const [refVisible, setRefVisible] = useState(false)
  const [availableWidthHeight, setAvailableWidthHeight] = useState([null, null]);
  const [addressGEO, setAddress] = useState(false)
  const [waitAddressGEO, setWaitAddress] = useState(false)
  const [gPSDataRecords, setGPSDataRecords] = useState(null)
  const [isExportButtonDisabled, setIsExportButtonDisabled] = useState(false)
  const [exportButtonText, setExportButtonText] = useState('Export PNG')

  // onClick button action to export the map to PNG
  function onClickButtonExport() {
    // Disable the button while exporting
    setIsExportButtonDisabled(true)
    setExportButtonText('Exporting...')

    if (viewRef.current) {
      toPng(viewRef.current)
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          window.open().document.write(img.outerHTML);

          // re-enable the button after exporting
          setExportButtonText('Export PNG')
          setIsExportButtonDisabled(false)
        })
        .catch((error) => {
          console.error('Error exporting image:', error);
        });
    }
  }

  function closeDialogGPSDataRecords() {
    setGPSDataRecords(false)
  }

  // Read the previous map data, on the local cache
  useEffect(() => {
    const storedData = localStorage.getItem('quick_vehicle_tracker');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  // Function to perform reverse geocoding using OpenStreetMap
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
        console.log('Geocoding error:', data.error || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.log('Error during geocoding:', error);
      return null;
    }
  }

  // GET the map data from the server: ForAPI_REST
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/gps_data_records');
        const result = await response.json();

        // Store the data locally
        localStorage.setItem('qvt_gps_data_records', JSON.stringify(result));
        setGPSDataRecords(false)

        setData(result);
      } catch (error) {
        
        // Let's recover the previous data in cache
        const storedData = localStorage.getItem('qvt_gps_data_records');
        if (storedData) {
          setData(JSON.parse(storedData));
          setGPSDataRecords(true)
          console.log('setGPSDataRecords: true')
        }
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  // Calculate the window size
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

  // This react component will be called again when data is fetched
  if (!data) {
    return <div>Loading...</div>;
  }

  // Get the last GPS data record
  let last_record = data[data.length - 1];
  let time = last_record.time;
  let lat = last_record.gps.lat;
  let lon = last_record.gps.lon;
  let battery_soc = last_record.battery_soc;

  // Calculate the date and time from last GPS data record
  // Linux time to string
  const date = new Date(time * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let formatedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Try to male the ReverseGeocode only once
  let address = ''
  if (waitAddressGEO === false) {
    setWaitAddress(true);
    reverseGeocode(lat, lon);
  } else if (addressGEO !== false) {
    address = addressGEO;
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

  return (
    <div
      ref={el => { viewRef.current = el; setRefVisible(true); }}
      style={{ width: availableWidthHeight[0] + 'px', height: availableWidthHeight[1] + 'px', border: '1px solid #000'}} >

      <Dialog open={gPSDataRecords} onClose={closeDialogGPSDataRecords} >
        <DialogTitle>Map data from local cache</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Error getting data from the server!<br></br>
          The data on the map is from local cache.
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Show the Map only when availableWidthHeight values are not null */}
      {availableWidthHeight[0] && (
        <MapContainer center={[lat, lon]} zoom={18} scrollWheelZoom={true} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Export button on top of the map */}
          <div style={{ position: 'absolute', top: '85px', left: '10px', zIndex: 1000 }}>
            <button id='idButtonExport' onClick={onClickButtonExport} disabled={isExportButtonDisabled}>{exportButtonText}</button>
          </div>

          {/* Use the custom icon */}
          <Marker position={[lat, lon]} icon={iconEScooter}>

            {/* Use this Popup to show to user, the position and time details */}
            <Popup>
              Date: {formatedDate}<br></br>
              Latitute: {lat}, Longitude: {lon}<br></br>
              Battery SOC: {battery_soc} %<br></br>
              <br></br>
              Address:<br></br>
              {address}<br></br>
              <br></br>
              <a href={`https://maps.google.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </Popup>
            
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default View_MapLocalization;
