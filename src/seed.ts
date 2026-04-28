import mongoose from "mongoose";
import "dotenv/config";
import { ClothingStyle } from "./types/index.js";
import { Product } from "./models/product.js";

const seed = async () => {
    try {
        console.log("⏳ MongoDB-ga ulanish...");
        await mongoose.connect(process.env.MONGO_URI!);
        await Product.deleteMany({});
        console.log("🗑 Eski mahsulotlar o'chirildi.");

        const testProducts = [
            {
                name: "K-Pop Oversize Hoodie",
                style: ClothingStyle.KPOP,
                price: 350000,
                sizes: ["M", "L", "XL"],
                image: "AgACAgIAAxkBAAIBM2nw6WMNi-iCRCAGhvuqnGCy4exWAAKyF2sbFE2JS0SGrQ9ziTIlAQADAgADeQADOwQ",
            },
            {
                name: "Classic Silk Dress",
                style: ClothingStyle.CLASSIC,
                price: 550000,
                sizes: ["S", "M"],
                image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=400&h=600&fit=crop",
            },
            {
                name: "Casual Streetwear Pants",
                style: ClothingStyle.CASUAL,
                price: 280000,
                sizes: ["S", "M", "L", "XL", "XXL"],
                image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&h=600&fit=crop",
            },
            {
                name: "Sporty Windbreaker",
                style: ClothingStyle.SPORTY,
                price: 420000,
                sizes: ["L", "XL"],
                image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&h=600&fit=crop",
            },
        ];

        await Product.insertMany(testProducts);
        console.log("✅ Bazaga mahsulotlar muvaffaqiyatli qo'shildi!");

        process.exit(0);
    } catch (err) {
        console.error("❌ Xatolik:", err);
        process.exit(1);
    }
};

seed();
