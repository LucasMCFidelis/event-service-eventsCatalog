import { FastifyInstance } from "fastify";
import { createEventOrganizerRoute, getEventOrganizerByIdRoute, listEventOrganizerRoute } from "../controllers/eventOrganizerController.js";

export async function eventOrganizerRoutes(server:FastifyInstance) {
    server.post("/", createEventOrganizerRoute)
    server.get("/", listEventOrganizerRoute)
    server.get("/:id", getEventOrganizerByIdRoute)
}