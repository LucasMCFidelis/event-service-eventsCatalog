import axios from "axios";
import { Address } from "../interfaces/addressInterface.js";
import { formatterFullAddress } from "./formatters/formatterFullAddress.js";

const MAPBOX_API_KEY = process.env.MAPBOX_ACCESS_TOKEN;

export async function getCoordinates({
  street,
  number,
  neighborhood,
  complement,
}: Address) {
  const fullAddress = formatterFullAddress({
    street,
    number,
    neighborhood,
    complement,
  });

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    fullAddress
  )}.json?access_token=${MAPBOX_API_KEY}`;

  const response = await axios.get(url);
  const [longitude, latitude] = response.data.features[0]?.center || [
    null,
    null,
  ];

  return { latitude, longitude };
}
