import { FastifyInstance } from "fastify";
import { createEventOrganizerRoute, deleteEventOrganizerRoute, getEventOrganizerByIdRoute, listEventOrganizerRoute, updateEventOrganizerRoute } from "../controllers/eventOrganizerController.js";

export async function eventOrganizerRoutes(server:FastifyInstance) {
    server.post("/", createEventOrganizerRoute)
    server.get("/", listEventOrganizerRoute)
    server.get("/:id", getEventOrganizerByIdRoute)
    server.delete("/:id", deleteEventOrganizerRoute)
    server.put("/:id", updateEventOrganizerRoute)
}