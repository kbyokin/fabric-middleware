import express, { Request, Response } from "express";
import cors from "cors";
const { initializeFabric } = require("./fabricClient");
import medicinesRoutes from "./routes/medicines";

async function startServer() {
  const contract = await initializeFabric();
  
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/medicines", medicinesRoutes);

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch(console.error);