import express, { Request, Response } from "express";
const { initializeFabric } = require("../fabricClient");
import { TextDecoder } from "util";
// import { verifyAuth } from '../lib/auth'; // You'll need to implement this

const router = express.Router();
const utf8Decoder = new TextDecoder();

// GET /api/medicines - Get all medicines (bc.ts)
router.get("/", async (req: Request, res: Response) => {
  try {
    const contract = await initializeFabric();
    const resultBytes = await contract.evaluateTransaction("GetAllMedicines");
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// GET /api/medicines/all - Get all medicines with auth (queryAll.ts)
router.get("/all", async (req: Request, res: Response) => {
  try {
    // TODO: Implement auth verification
    // const user = await verifyAuth(req, res);
    // if (!user) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    const now = new Date();
    const contract = await initializeFabric();
    const resultBytes = await contract.evaluateTransaction("GetAllMedicines");
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log(`*** Query All Assets committed successfully at ${now.toLocaleString()}`);
    
    res.status(200).json({
      message: 'Query successful',
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   name: user.name,
      //   hospitalName: user.hospitalName
      // },
      result
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/medicines/create - Create new medicine (createMed.ts)
router.post("/create", async (req: Request, res: Response) => {
  try {
    const assetId = `asset${String(Date.now())}`;
    const {
      postingDate,
      postingHospital,
      medicineName,
      quantity,
      unit,
      batchNumber,
      manufacturer,
      manufactureDate,
      expiryDate,
      currentLocation,
      status,
    } = req.body;

    const contract = await initializeFabric();
    await contract.submitTransaction(
      "CreateMedicine",
      assetId,
      postingDate,
      postingHospital,
      medicineName,
      quantity,
      unit,
      batchNumber,
      manufacturer,
      manufactureDate,
      expiryDate,
      currentLocation,
      status
    );
    
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      assetId: assetId,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/medicines/query-by-id - Query medicine by ID (queryById.ts)
router.post("/query-by-id", async (req: Request, res: Response) => {
  try {
    const { assetId } = req.body;
    const contract = await initializeFabric();
    
    const resultBytes = await contract.evaluateTransaction("ReadAssetById", assetId);
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log("*** Transaction committed successfully");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/medicines/borrow - Borrow medicine (borrowMed.ts)
router.post("/borrow", async (req: Request, res: Response) => {
  try {
    const borrowDate = `${String(Date.now())}`;
    const borrowID = `borrow${String(Date.now())}`;
    const { medicineID, borrowHospital, borrowQty } = req.body;

    const contract = await initializeFabric();
    const commit = await contract.submitAsync("BorrowMedicine", {
      arguments: [medicineID, borrowID, borrowHospital, String(borrowQty), borrowDate],
    });
    
    const previousMedData = utf8Decoder.decode(commit.getResult());
    console.log(`*** Successfully submitted transaction to borrow ${previousMedData}`);
    
    const status = await commit.getStatus();
    if (!status.successful) {
      throw new Error(
        `Transaction ${status.transactionId} failed to commit with status code ${String(status.code)}`
      );
    }
    
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      assetId: medicineID,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// DELETE /api/medicines/:id - Delete medicine (deleteMed.ts)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medicineName } = req.body;

    console.log("*** Deleting medicine", id, medicineName);
    
    const contract = await initializeFabric();
    await contract.submitTransaction("DeleteMedicine", id);
    
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Error deleting medicine" });
  }
});

// POST /api/medicines/update-ticket-status
router.post("/update-ticket-status", async (req: Request, res: Response) => {
  try {
    const { id, status, updatedAt } = req.body;
    console.log('req.body', req.body);
    const contract = await initializeFabric();
    await contract.submitTransaction("UpdateTicketStatus", id, status, updatedAt);
    res.status(200).json({ message: "Ticket status updated successfully" });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Error updating ticket status" });
  }
})

export default router; 