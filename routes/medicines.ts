import express, { Request, Response } from "express";
const { initializeFabric } = require("../fabricClient");
import { TextDecoder } from "util";
// import { verifyAuth } from '../lib/auth'; // You'll need to implement this

const router = express.Router();
const utf8Decoder = new TextDecoder();

// GET /api/medicines - Get all medicines
router.get("/", async (req: Request, res: Response) => {
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

export default router; 