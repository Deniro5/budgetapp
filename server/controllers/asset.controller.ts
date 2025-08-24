import { Request, Response } from "express";
import { assetService } from "../services/assetService";

export const assetController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const asset = await assetService.create(req.body);
      res.status(201).json(asset);
    } catch (err) {
      res.status(400).json({ error: "Failed to create asset" });
    }
  },

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const assets = await assetService.findAll();
      res.status(200).json(assets);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const asset = await assetService.findById(req.params.id);
      if (!asset) {
        res.status(404).json({ error: "Asset not found" });
        return;
      }
      res.json(asset);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const asset = await assetService.update(req.params.id, req.body);
      if (!asset) {
        res.status(404).json({ error: "Asset not found" });
        return;
      }
      res.json(asset);
    } catch (err) {
      res.status(400).json({ error: "Failed to update asset" });
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const asset = await assetService.remove(req.params.id);
      if (!asset) {
        res.status(404).json({ error: "Asset not found" });
        return;
      }
      res.json({ message: "Asset deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete asset" });
    }
  },
};
