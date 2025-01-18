import { FastifyInstance } from "fastify";
import {
  createEventRoute,
  getEventByIdRoute,
  listEventsRoute,
} from "../controllers/eventController.js";

export async function eventRoutes(server: FastifyInstance) {
  server.post("/", createEventRoute); // POST /events
  server.get("/", listEventsRoute); // GET /events
  server.get("/:id", getEventByIdRoute); // GET /events/:id
}
