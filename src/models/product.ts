import { Schema, model, Document } from "mongoose";
import type { IProduct } from "../types/index.js";
import { ClothingStyle } from "../types/index.js";

export interface IProductDocument extends IProduct, Document {}

export const Product = model<IProductDocument>(
    "Product",
    new Schema({
        name: { type: String, required: true },
        style: {
            type: String,
            enum: Object.values(ClothingStyle),
            required: true,
        },
        price: { type: Number, required: true },
        sizes: [{ type: String, required: true }],
        image: { type: String, required: true },
    }),
);
