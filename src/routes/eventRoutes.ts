import { FastifyInstance } from "fastify";
import {
  createEventRoute,
} from "../controllers/eventController.js";

export async function eventRoutes(server: FastifyInstance) {
  server.post("/", createEventRoute); // POST /events
}
