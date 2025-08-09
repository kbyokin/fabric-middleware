import express, { Request, Response } from "express";
const { initializeFabric } = require("../fabricClient");
import { TextDecoder } from "util";

const router = express.Router();
const utf8Decoder = new TextDecoder();

// POST /api/services/status-by-ticket-type - Get status by ticket type (statusService.tsx)
router.post("/status-by-ticket-type", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status, ticketType } = req.body;
    
    const contract = await initializeFabric();
    let resultBytes;
    
    if (ticketType === "sharing") {
      resultBytes = await contract.submitTransaction(
        "QuerySharingStatus",
        loggedInHospital,
        status
      );
    } else {
      resultBytes = await contract.evaluateTransaction(
        "QueryRequestStatus",
        loggedInHospital,
        status
      );
    }
    
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching status by ticket type:", error);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// POST /api/services/medicine-responses-in-transfer - Get medicine responses in transfer (transferService.tsx)
router.post("/medicine-responses-in-transfer", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital } = req.body;
    
    const contract = await initializeFabric();
    const resultBytes = await contract.evaluateTransaction(
      "QueryRequestToHospital",
      loggedInHospital,
      "to-transfer"
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching medicine responses in transfer:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

// POST /api/services/medicine-sharing - Get medicine sharing (sharingService.tsx)
router.post("/medicine-sharing", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status } = req.body;
    
    const contract = await initializeFabric();
    const resultBytes = await contract.submitTransaction(
      "QuerySharingStatusToHospital",
      loggedInHospital,
      "pending"
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching medicine sharing:", error);
    res.status(500).json({ error: "Failed to fetch sharing" });
  }
});

// Utility endpoint for complex request operations (requestService.tsx functionality)
// POST /api/services/fetch-asset-by-id - Fetch specific asset by ID
router.post("/fetch-asset-by-id", async (req: Request, res: Response) => {
  try {
    const { assetId } = req.body;
    
    const contract = await initializeFabric();
    const resultBytes = await contract.evaluateTransaction("ReadAssetById", assetId);
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    res.status(500).json({ error: "Failed to fetch asset" });
  }
});

// POST /api/services/requests-with-assets - Get medicine requests with their associated assets
router.post("/requests-with-assets", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital, status } = req.body;
    
    const contract = await initializeFabric();
    
    // First get the filtered requests
    const requestBytes = await contract.evaluateTransaction(
      "QueryRequestToHospital",
      loggedInHospital,
      status || "pending"
    );
    const requestJson = utf8Decoder.decode(requestBytes);
    const filteredRequests = JSON.parse(requestJson);
    
    // Then fetch assets for each requestId
    const requestsWithAssets = await Promise.all(
      filteredRequests.map(async (item: any) => {
        try {
          const assetBytes = await contract.evaluateTransaction("ReadAssetById", item.requestId);
          const assetJson = utf8Decoder.decode(assetBytes);
          const asset = JSON.parse(assetJson);
          return { ...item, asset };
        } catch (error) {
          console.error(`Error fetching asset for ${item.requestId}:`, error);
          return { ...item, asset: null };
        }
      })
    );
    
    res.status(200).json(requestsWithAssets);
  } catch (error) {
    console.error("Error fetching medicine requests with assets:", error);
    res.status(500).json({ error: "Failed to fetch requests with assets" });
  }
});

router.post("/query-remaining-amount", async (req: Request, res: Response) => {
  try {
    const { queryTicketId } = req.body;
    console.log('queryTicketId', queryTicketId);
    
    const contract = await initializeFabric();
    const resultBytes = await contract.evaluateTransaction(
      "GetRemainingAmount",
      queryTicketId
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching remaining amount:", error);
    res.status(500).json({ error: "Failed to fetch remaining amount" });
  }
})

router.post("/query-history", async (req: Request, res: Response) => {
  try {
    const { loggedInHospital } = req.body;
    console.log('loggedInHospital', loggedInHospital);
    
    const contract = await initializeFabric();
    const resultBytes = await contract.submitTransaction(
      "GetHistoryTransactions",
      loggedInHospital
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('result', result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
})

export default router; 