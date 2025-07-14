import express, { Request, Response } from "express";
const { initializeFabric } = require("../fabricClient");
import { TextDecoder } from "util";

const router = express.Router();
const utf8Decoder = new TextDecoder();

// POST /api/requests/create - Create medicine request (createRequest.tsx)
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { requestData, selectedHospitals } = req.body;
    
    const contract = await initializeFabric();
    await contract.submitTransaction(
      "CreateMedicineRequest",
      JSON.stringify(requestData),
      JSON.stringify(selectedHospitals)
    );
    console.log('requestData', requestData);
    console.log('selectedHospitals', selectedHospitals);
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      requestId: requestData.id,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/requests/query-by-status - Query requests by status (queryRequestByStatus.tsx)
router.post("/query-by-status", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status } = req.body;
    
    const contract = await initializeFabric();
    console.log('loggedInHospital', loggedInHospital, 'status', status);
    
    const resultBytes = await contract.evaluateTransaction(
      "QueryRequestToHospital",
      loggedInHospital,
      status
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log("*** QueryRequestToHospital Transaction committed successfully");
    // console.log('*** Result', result);
    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/requests/query - Query requests (queryRequests.tsx)
router.post("/query", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status } = req.body;
    const contract = await initializeFabric();
    
    console.log('loggedInHospital ================', loggedInHospital);
    
    const resultBytes = await contract.evaluateTransaction(
      "QueryRequestStatus",
      loggedInHospital,
      status
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    console.log("*** QueryRequestStatus Transaction committed successfully");
    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

// POST /api/requests/update - Update request (updateRequest.tsx)
router.post("/update", async (req: Request, res: Response) => {
  try {
    const updatedAt = Date.now().toString();
    const { responseId, offeredMedicine, status } = req.body;
    
    const responseAsset = {
      responseId: responseId,
      updatedAt: updatedAt,
      status: status,
      offeredMedicine: offeredMedicine
    };
    
    const contract = await initializeFabric();
    await contract.submitTransaction(
      "CreateMedicineResponse",
      JSON.stringify(responseAsset)
    );
    
    console.log("*** Transaction committed successfully");
    res.status(200).json({
      message: "Transaction committed successfully",
      assetId: responseId,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ error: "Failed to initialize Fabric" });
  }
});

export default router; 