import express from "express";
import { MongooseError } from "mongoose";
import { productController } from "../controllers/products";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    // const user = req.user;
    // if (!user) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }
    const products = await productController.getByQuery(query as string);
    return res.json(products);
  } catch (err) {
    if (err instanceof MongooseError) {
      return res
        .status(400)
        .json({ error: `Database Error`, message: err.message });
    }
    return res
      .status(500)
      .json({ error: `Internal Server Error`, message: err });
  }
});

export { router as ProductRoutes };
