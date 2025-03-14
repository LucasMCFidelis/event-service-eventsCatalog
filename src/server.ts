import fastify from "fastify";
import { eventRoutes } from "./routes/eventRoutes.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import path from "path";
import { fileURLToPath } from "url";
import cors from "@fastify/cors";
import { eventCategoryRoutes } from "./routes/eventCategoryRoutes.js";
import { eventOrganizerRoutes } from "./routes/eventOrganizerRoutes.js";
import { mapHandler } from "./controllers/mapController.js";

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

// Configurar o CORS
server.register(cors, {
  origin: "*", // Libera totalmente para testes
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

// Registrar o Swagger
server.register(swagger, {
  mode: "static",
  specification: {
    path: path.join(__dirname, "swagger.yaml"),
    baseDir: __dirname,
  },
});

// Registrar o Swagger UI
server.register(swaggerUi, {
  routePrefix: "/docs", // Prefixo para acessar a UI da documentação
  uiConfig: {
    docExpansion: "none",
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecificationClone: true,
});

// Registrar rotas de usuários com prefixo
server.register(eventRoutes, { prefix: "/events" });
server.register(eventCategoryRoutes, { prefix: "/events-categories" });
server.register(eventOrganizerRoutes, {prefix: "events-organizers"})
server.get("/map", mapHandler);

// Configurar a porta e host
const PORT = Number(process.env.PORT) || 3131;
const HOST = process.env.HOST || "localhost";

server
  .listen({ port: PORT, host: HOST })
  .then(() =>
    console.log(`
        Events service rodando em http://${HOST}:${PORT}
        Documentação Swagger em http://${HOST}:${PORT}/docs
        `)
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
