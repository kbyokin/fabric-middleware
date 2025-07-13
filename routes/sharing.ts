import express, { Request, Response } from "express";
const { initializeFabric } = require("../fabricClient");
import { TextDecoder } from "util";

const router = express.Router();
const utf8Decoder = new TextDecoder();

// POST /api/sharing/create - Create medicine sharing (createSharing.tsx)
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { sharingMedicine, selectedHospitals } = req.body;
    
    const contract = await initializeFabric();
    await contract.submitTransaction(
      "CreateMedicineSharing",
      JSON.stringify(sharingMedicine),
      JSON.stringify(selectedHospitals)
    );
    
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      requestId: sharingMedicine.id,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/sharing/query - Query sharing (querySharing.tsx)
router.post("/query", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status } = req.body;
    
    const contract = await initializeFabric();
    const resultBytes = await contract.submitTransaction(
      "QuerySharingStatus",
      loggedInHospital,
      status
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log("*** QuerySharingStatusToHospital Transaction committed successfully");
    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/sharing/query-by-status - Query sharing by status (querySharingByStatus.tsx)
router.post("/query-by-status", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status } = req.body;
    
    const contract = await initializeFabric();
    const resultBytes = await contract.submitTransaction(
      "QuerySharingStatusToHospital",
      loggedInHospital,
      status
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log("*** QuerySharingStatusToHospital Transaction committed successfully");
    console.log('*** Result', result);
    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/sharing/update - Update sharing (updateSharing.tsx)
router.post("/update", async (req: Request, res: Response) => {
  try {
    const updatedAt = new Date().toString();
    const { sharingId, returnTerm, acceptOffer, status } = req.body;
    
    const acceptOfferAsset = {
      sharingId: sharingId,
      returnTerm: returnTerm,
      acceptOffer: acceptOffer,
      updatedAt: updatedAt,
      status: status,
    };
    
    console.log('acceptOfferAsset', acceptOfferAsset);
    
    const contract = await initializeFabric();
    await contract.submitTransaction(
      "AcceptSharing",
      JSON.stringify(acceptOfferAsset)
    );
    
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      assetId: sharingId,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

export default router; 