import express, { Request, Response } from "express";
const { initializeFabric } = require("../fabricClient");
import { TextDecoder } from "util";

const router = express.Router();
const utf8Decoder = new TextDecoder();

// POST /api/returns/create - Create medicine return (createReturn.tsx)
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { responseId, returnData, selectedHospital } = req.body;
    
    const contract = await initializeFabric();
    await contract.submitTransaction(
      "CreateMedicineReturn",
      responseId,
      JSON.stringify(returnData)
    );
    
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      returnId: returnData.id,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

export default router; 