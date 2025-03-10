import axios from "axios";

const MAPBOX_API_KEY = process.env.MAPBOX_ACCESS_TOKEN;

export async function validateCoordinatesWithMapbox(
  latitude: number,
  longitude: number
): Promise<boolean> {
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
