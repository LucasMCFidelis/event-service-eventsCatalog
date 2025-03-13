import axios from "axios";
import NodeCache from "node-cache";
import { Coordinates } from "../interfaces/coordinates.js";
import { Address } from "../interfaces/addressInterface.js";
import { formatterFullAddress } from "../utils/formatters/formatterFullAddress.js";

const cache = new NodeCache({ stdTTL: 3600 }); // Cache de 1 hora
const MAPBOX_API_KEY = process.env.MAPBOX_ACCESS_TOKEN;

async function getMapImage({ latitude, longitude }: Coordinates) {
  const cacheKey = `${latitude},${longitude}`;
  const cachedImage = cache.get(cacheKey);

  if (cachedImage) {
    console.log("🔄 Retornando do cache");
    return cachedImage;
  }

  console.log("🆕 Buscando no Mapbox...");
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+FF0000(${longitude},${latitude})/${longitude},${latitude},15/600x600?access_token=${MAPBOX_API_KEY}`;

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
  try {
    // Reverso geocoding para obter o nome do lugar
    const reverseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}`;

    const reverseResponse = await axios.get(reverseUrl);

    // Extrair o nome do local a partir da resposta da API
    const placeName = reverseResponse.data.features?.[0]?.place_name;

    // Se o nome do local for encontrado, verificar se contém "João Pessoa"
    if (placeName && placeName.toLowerCase().includes("joão pessoa")) {
      return true; // Coordenada está dentro de João Pessoa
    } else {
      return false; // Coordenada não está em João Pessoa
    }
  } catch (error) {
    console.error("Erro ao validar coordenadas com Mapbox:", error);
    return false; // Em caso de erro, retornar falso
  }
}

export const mapService = {
  getCoordinates,
  getMapImage,
  validateCoordinates,
};
