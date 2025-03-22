import { FastifyRequest, FastifyReply } from "fastify";
import { handleError } from "../utils/handlers/handleError.js";
import { mapService } from "../services/mapService.js";
import { GetMapImageProps } from "../interfaces/GetMapImageProps.js";

export async function mapHandler(
  request: FastifyRequest<{ Querystring: GetMapImageProps }>,
  reply: FastifyReply
) {  
  const { latitude, longitude, eventPrice } = request.query;

  try {
    const imageData = await mapService.getMapImage({latitude, longitude, eventPrice});
    reply.header("Content-Type", "image/png").send(imageData);
  } catch (error) {
    handleError(error, reply);
  }
}
