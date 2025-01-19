import { FastifyInstance } from "fastify";
import {
  createEventRoute,
  deleteEventRoute,
  getEventByIdRoute,
  listEventsRoute,
  updateEventRoute,
} from "../controllers/eventController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import { Event } from "@prisma/client";

export async function eventRoutes(server: FastifyInstance) {
  server.post<{ Body: Event }>(
    "/",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    createEventRoute
  ); // POST /events
  server.get("/", listEventsRoute); // GET /events
  server.get("/:id", getEventByIdRoute); // GET /events/:id
  server.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    deleteEventRoute
  ); // DELETE /events/:id
  server.put<{ Params: { id: string }; Body: Partial<Event> }>(
    "/:id",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    updateEventRoute
  ); // UPDATE /events/:id
}
