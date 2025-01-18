import { FastifyInstance } from "fastify";
import { createEventCategoryRoute, getEventCategoryByIdRoute, listEventCategoryRoute } from "../controllers/eventCategoryController.js";

export async function eventCategoryRoutes(server:FastifyInstance) {
    server.post("/", createEventCategoryRoute)
    server.get("/", listEventCategoryRoute)
    server.get("/:id", getEventCategoryByIdRoute)
}