import { FastifyInstance } from "fastify";
import {
  createEventOrganizerRoute,
  deleteEventOrganizerRoute,
  getEventOrganizerByIdRoute,
  listEventOrganizerRoute,
  updateEventOrganizerRoute,
} from "../controllers/eventOrganizerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import { EventOrganizer } from "@prisma/client";

export async function eventOrganizerRoutes(server: FastifyInstance) {
  server.post<{ Body: EventOrganizer }>(
    "/",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    createEventOrganizerRoute
  );
  server.get("/", listEventOrganizerRoute);
  server.get("/:id", getEventOrganizerByIdRoute);
  server.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    deleteEventOrganizerRoute
  );
  server.put<{ Params: { id: string }; Body: Partial<EventOrganizer> }>(
    "/:id",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    updateEventOrganizerRoute
  );
}
