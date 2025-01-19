import { FastifyInstance } from "fastify";
import {
  createEventCategoryRoute,
  deleteEventCategoryRoute,
  getEventCategoryByIdRoute,
  listEventCategoryRoute,
  updateEventCategoryRoute,
} from "../controllers/eventCategoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import { EventCategory } from "@prisma/client";

export async function eventCategoryRoutes(server: FastifyInstance) {
  server.post<{ Body: EventCategory }>(
    "/",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    createEventCategoryRoute
  );
  server.get("/", listEventCategoryRoute);
  server.get("/:id", getEventCategoryByIdRoute);
  server.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    deleteEventCategoryRoute
  );
  server.put<{ Params: { id: string }; Body: Partial<EventCategory> }>(
    "/:id",
    { preHandler: [authMiddleware, checkRole("Admin")] },
    updateEventCategoryRoute
  );
}
