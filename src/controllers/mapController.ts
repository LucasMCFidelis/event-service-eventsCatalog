import { FastifyRequest, FastifyReply } from "fastify";
import { Coordinates } from "../interfaces/coordinates.js";
import { handleError } from "../utils/handlers/handleError.js";
import { mapService } from "../services/mapService.js";

export async function mapHandler(
  request: FastifyRequest<{ Querystring: Coordinates }>,
  reply: FastifyReply
) {
  const { latitude, longitude } = request.query;

  try {
    const imageData = await mapService.getMapImage({ latitude, longitude });
    reply.header("Content-Type", "image/png").send(imageData);
  } catch (error) {
    handleError(error, reply);
  }
}
