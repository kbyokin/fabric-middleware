import express, { Request, Response } from "express";
import cors from "cors";
const { initializeFabric } = require("./fabricClient");
import medicinesRoutes from "./routes/medicines";
import requestsRoutes from "./routes/requests";
import sharingRoutes from "./routes/sharing";
import returnsRoutes from "./routes/returns";
import mailRoutes from "./routes/mail";
import servicesRoutes from "./routes/services";

async function startServer() {
  const contract = await initializeFabric();
  
  const app = express();
  const port = 8000;

  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/medicines", medicinesRoutes);
  app.use("/api/requests", requestsRoutes);
  app.use("/api/sharing", sharingRoutes);
  app.use("/api/returns", returnsRoutes);
  app.use("/api/mail", mailRoutes);
  app.use("/api/services", servicesRoutes);

  app.get("/", (req: Request, res: Response) => {
    res.send("Fabric Middleware API - All routes available");
  });

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      routes: [
        "/api/medicines",
        "/api/requests", 
        "/api/sharing",
        "/api/returns",
        "/api/mail",
        "/api/services"
      ]
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Available routes:`);
    console.log(`- GET  /api/medicines`);
    console.log(`- GET  /api/medicines/all`);
    console.log(`- POST /api/medicines/create`);
    console.log(`- POST /api/medicines/query-by-id`);
    console.log(`- POST /api/medicines/borrow`);
    console.log(`- DELETE /api/medicines/:id`);
    console.log(`- POST /api/requests/create`);
    console.log(`- POST /api/requests/query-by-status`);
    console.log(`- POST /api/requests/query`);
    console.log(`- POST /api/requests/update`);
    console.log(`- POST /api/sharing/create`);
    console.log(`- POST /api/sharing/query`);
    console.log(`- POST /api/sharing/query-by-status`);
    console.log(`- POST /api/sharing/update`);
    console.log(`- POST /api/returns/create`);
    console.log(`- POST /api/mail/send`);
    console.log(`- POST /api/services/*`);
  });
}

startServer().catch(console.error);