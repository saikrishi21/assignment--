import { API_KEY } from './config';

export async function getNearbyHospitals(location) {

  const lat = location.coords.latitude;
  const lng = location.coords.longitude;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.results.map(place => {
    return {
      id: place.place_id,
      name: place.name,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
    };
  });

}