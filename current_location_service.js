import {PRESENT_LOCATION} from '../API/apiEndpoints.js';


export async function getDefaultCountryCode() {
    try {
        const response = await fetch(PRESENT_LOCATION);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const locationData = await response.json();
        return locationData.country_name;
    } catch (error) {
        console.error('Error fetching location data:', error);
        return '';
    }
}