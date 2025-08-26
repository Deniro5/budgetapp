import { Request, Response } from "express";
import * as assetService from "../services/assetService";

interface CustomRequest extends Request {
  userId?: string;
  investments?: any;
}

export async function createAsset(req: Request, res: Response): Promise<void> {
  try {
    const asset = await assetService.createAsset(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: "Failed to create asset" });
  }
}

export async function getAllAssets(req: Request, res: Response): Promise<void> {
  try {
    const assets = await assetService.getAssets();
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assets" });
  }
}

export async function getAssetById(req: Request, res: Response): Promise<void> {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch asset" });
  }
}

export async function updateAsset(req: Request, res: Response): Promise<void> {
  try {
    const asset = await assetService.updateAssetById(req.params.id, req.body);
    if (!asset) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: "Failed to update asset" });
  }
}

export async function deleteAsset(req: Request, res: Response): Promise<void> {
  try {
    const asset = await assetService.deleteAssetById(req.params.id);
    if (!asset) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete asset" });
  }
}

export async function searchAsset(
  req: CustomRequest,
  res: Response
): Promise<void> {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Please provide a search query" });
      return;
    }

    const results = await assetService.searchAsset(q);
    res.status(201).json(results);
  } catch (err) {
    console.error("Error searching stocks:", err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
}
