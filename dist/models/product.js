import { Schema, model } from "mongoose";
import { ClothingStyle } from "../types/index.js";
export const Product = model("Product", new Schema({
    name: { type: String, required: true },
    style: {
        type: String,
        enum: Object.values(ClothingStyle),
        required: true,
    },
    price: { type: Number, required: true },
    sizes: [{ type: String, required: true }],
    image: { type: String, required: true },
}));
