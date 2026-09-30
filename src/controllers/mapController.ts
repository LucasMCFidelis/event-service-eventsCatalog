import { FastifyRequest, FastifyReply } from "fastify";
import { handleError } from "../utils/handlers/handleError.js";
import { mapService } from "../services/mapService.js";
import { GetMapImageProps } from "../interfaces/GetMapImageProps.js";

export async function mapHandler(
  request: FastifyRequest<{ Querystring: GetMapImageProps }>,
  reply: FastifyReply
) {  
  const { latitude, longitude, eventPrice } = request.query;
  const scenarioHeader = request.headers["x-mock-mapbox-scenario"];

  const scenario =
    process.env.ACTIVE_MOCK === "true" && typeof scenarioHeader === "string"
      ? scenarioHeader
      : undefined;


  try {
    const imageData = await mapService.getMapImage({latitude, longitude, eventPrice}, scenario);
    reply.header("Content-Type", "image/png").send(imageData);
  } catch (error) {
    handleError(error, reply);
  }
}
