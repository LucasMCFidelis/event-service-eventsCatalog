import { FastifyInstance } from "fastify";
import {
  createEventRoute,
  deleteEventRoute,
  getEventByIdRoute,
  listEventsRoute,
  updateEventRoute,
} from "../controllers/eventController.js";

export async function eventRoutes(server: FastifyInstance) {
  server.post("/", createEventRoute); // POST /events
  server.get("/", listEventsRoute); // GET /events
  server.get("/:id", getEventByIdRoute); // GET /events/:id
  server.delete("/:id", deleteEventRoute); // DELETE /events/:id
  server.put("/:id", updateEventRoute); // UPDATE /events/:id
}
