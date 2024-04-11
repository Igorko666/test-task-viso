import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, remove, update } from "firebase/database";

const MapContainer = ({ apiKey }) => {

    const firebaseConfig = {
        apiKey: "AIzaSyBlILimKU_nZHdmMe47R4YoiLp4rmXip_0",
        authDomain: "testtask-viso-419913.firebaseapp.com",
        projectId: "testtask-viso-419913",
        storageBucket: "testtask-viso-419913.appspot.com",
        messagingSenderId: "1001502495723",
        appId: "1:1001502495723:web:88bb89c7cd598abd3f7fae",
        measurementId: "G-S2VFKKET35"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getDatabase(app);
    

    const mapStyles = {
        height: '100vh',
        width: '100%'
    };

    const defaultCenter = {
        lat: -34.397,
        lng: 150.644
    }

    const [markers, setMarkers] = useState([]);
    
    const handleMapClick = (event) => {
        const latLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
    
        const newMarkerRef = push(ref(db, 'markers'), latLng);
        const markerKey = newMarkerRef.key;
    
        setMarkers([...markers, { ...latLng, key: markerKey }]);
    };
    
    const handleMarkerClick = (index) => {
        const markerKey = markers[index].key;
    
        remove(ref(db, `markers/${markerKey}`));
    
        const updatedMarkers = markers.filter((marker, i) => i !== index);
        setMarkers(updatedMarkers);
    };

    const handleClearMarkers = () => {
        remove(ref(db, "markers"));
    
        setMarkers([]);
    };

    const handleMarkerDragEnd = (event, index) => {
        const latLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
    
        const updatedMarkers = markers.map((marker, i) => {
            if (i === index) {
                return latLng;
            }
            return marker;
        });
    
        setMarkers(updatedMarkers);
    
        const markerKey = index;
    
        update(ref(db, `markers/${markerKey}`), latLng);
    };

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={10}
                center={defaultCenter}
                onClick={handleMapClick}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        label={`${index + 1}`} 
                        onClick={() => handleMarkerClick(index)} 
                        draggable={true} 
                        onDragEnd={(event) => handleMarkerDragEnd(event, index)} 
                    />
                ))}
            </GoogleMap>
            <button onClick={handleClearMarkers}>Clear All Markers</button> 
        </LoadScript>
    );
};

export default MapContainer;
