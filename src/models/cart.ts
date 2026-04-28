import { Schema, model, Document, Types } from "mongoose";

export interface ICart extends Document {
    userId: number;
    productId: Types.ObjectId;
    size: string;
    quantity: number;
}

export const Cart = model<ICart>(
    "Cart",
    new Schema({
        userId: { type: Number, required: true },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        size: { type: String, required: true },
        quantity: { type: Number, default: 1 },
    }),
);
