import axios from "axios";
import NodeCache from "node-cache";
import { Coordinates } from "../interfaces/coordinates.js";
import { Address } from "../interfaces/addressInterface.js";
import { formatterFullAddress } from "../utils/formatters/formatterFullAddress.js";
import { GetMapImageProps } from "../interfaces/GetMapImageProps.js";

const cache = new NodeCache({ stdTTL: 3600 }); // Cache de 1 hora
const MAPBOX_API_KEY = process.env.MAPBOX_ACCESS_TOKEN;

async function getMapImage({latitude, longitude, eventPrice}: GetMapImageProps) {
  const cacheKey = `${latitude},${longitude}`;
  const cachedImage = cache.get(cacheKey);

  if (cachedImage) {
    console.log("🔄 Retornando do cache");
    return cachedImage;
  }

  console.log("🆕 Buscando no Mapbox...");
  const pinColor = eventPrice ? 
  (parseFloat(eventPrice.toString()) > 0 ? "761AB3" : "1AB393") : 
  "808080";  // Caso o eventPrice não seja informado, a cor será vermelha (FF0000)

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+${pinColor}(${longitude},${latitude})/${longitude},${latitude},15/600x600?access_token=${MAPBOX_API_KEY}`;

  try {
    const response = await axios.get(mapUrl, { responseType: "arraybuffer" });

    // Armazena no cache
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao carregar o mapa");
  }
}

async function getCoordinates({
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

async function validateCoordinates({
  latitude,
  longitude,
}: Coordinates): Promise<boolean> {
  let reverseResponse
  try {
    // Reverso geocoding para obter o nome do lugar
    const reverseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}`;

    reverseResponse = await axios.get(reverseUrl);
  } catch (error) {
    console.error("Erro ao validar coordenadas com Mapbox:", error);
    throw {
      status: 500,
      message: "Erro ao validar coordenadas com Mapbox",
      error: "Erro no servidor",
    };
  }

  // Extrair o nome do local a partir da resposta da API
  const placeName = reverseResponse.data.features?.[0]?.place_name;

  // Se o nome do local for encontrado, verificar se contém "João Pessoa"
  if (placeName && placeName.toLowerCase().includes("joão pessoa")) {
    return true; // Coordenada está dentro de João Pessoa
  } else {
    console.log('aqui ó');
    
    throw {
      status: 400,
      message: "As coordenadas do evento estão fora dos limites de João Pessoa.",
      error: "Coordenadas inválidas",
    };
  }
}

export const mapService = {
  getCoordinates,
  getMapImage,
  validateCoordinates,
};
