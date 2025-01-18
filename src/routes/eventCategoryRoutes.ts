import { FastifyInstance } from "fastify";
import { createEventCategoryRoute, deleteEventCategoryRoute, getEventCategoryByIdRoute, listEventCategoryRoute } from "../controllers/eventCategoryController.js";

export async function eventCategoryRoutes(server:FastifyInstance) {
    server.post("/", createEventCategoryRoute)
    server.get("/", listEventCategoryRoute)
    server.get("/:id", getEventCategoryByIdRoute)
    server.delete("/:id", deleteEventCategoryRoute)
    server.put("/:id", upda)
}