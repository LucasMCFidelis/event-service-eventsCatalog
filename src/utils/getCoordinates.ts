import axios from "axios";

const MAPBOX_API_KEY = process.env.MAPBOX_ACCESS_TOKEN;

export async function getCoordinates(address: string) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${MAPBOX_API_KEY}`;

  const response = await axios.get(url);
  const [longitude, latitude] = response.data.features[0]?.center || [null, null];

  return { latitude, longitude };
}