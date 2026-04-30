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
                name: "Ayollar Klassik Kostyumi",
                style: ClothingStyle.CLASSIC,
                subStyle: "🤵 Kostyum-shim",
                price: 1200000,
                sizes: ["48", "50", "52"],
                image: "AgACAgIAAxkBAAIClWnyOT6fmnhL6U21eto9ckvml04aAALoFGsbEa-YS6nCPZhdm416AQADAgADeQADOwQ",
            },
            {
                name: "Oq Klassik Ko'ylak",
                style: ClothingStyle.CLASSIC,
                subStyle: "👔 Klassik ko'ylak",
                price: 250000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIClWnyOT6fmnhL6U21eto9ckvml04aAALoFGsbEa-YS6nCPZhdm416AQADAgADeQADOwQ",
            },
            {
                name: "Klassik Silk Dress",
                style: ClothingStyle.CLASSIC,
                subStyle: "👗 Ayollar klassikasi",
                price: 550000,
                sizes: ["S", "M"],
                image: "AgACAgIAAxkBAAIClWnyOT6fmnhL6U21eto9ckvml04aAALoFGsbEa-YS6nCPZhdm416AQADAgADeQADOwQ",
            },
            {
                name: "Casual Streetwear Pants",
                style: ClothingStyle.CASUAL,
                price: 280000,
                sizes: ["S", "M", "L", "XL"],
                image: "AgACAgIAAxkBAAICl2nyOT7pJ3p5xy9v45XaLyEw7CIAA-oUaxsRr5hLxaSYcvcTdaABAAMCAAN5AAM7BA",
            },
            {
                name: "Sporty Windbreaker",
                style: ClothingStyle.SPORTY,
                price: 420000,
                sizes: ["L", "XL"],
                image: "AgACAgIAAxkBAAICmGnyOT5XbaU7Ixn_3-zoMwnWS43GAALrFGsbEa-YS7xJ6J0h6EK6AQADAgADeQADOwQ",
            },
            {
                name: "K-Pop Oversize Hoodie",
                style: ClothingStyle.KPOP,
                price: 350000,
                sizes: ["M", "L", "XL"],
                image: "AgACAgIAAxkBAAIClmnyOT5WLCn_ZYHWNbh7nEphdcsRAALpFGsbEa-YS3kWqKd9qdd5AQADAgADeQADOwQ",
            },
            {
                name: "Elegant Evening Gown",
                style: ClothingStyle.ELEGANT,
                price: 850000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAICmmnyOT4Wlk90QLW5texfrlxlqVuyAALtFGsbEa-YSyMfd_IYpqLUAQADAgADeQADOwQ",
            },
            {
                name: "Traditional Ethnic Kaftan",
                style: ClothingStyle.ETHNIC,
                price: 450000,
                sizes: ["M", "L", "XL", "XXL"],
                image: "AgACAgIAAxkBAAICm2nyOT5r0O0uiQgKqu-HFOcY_FF-AALuFGsbEa-YS6BTxvHVf9lQAQADAgADeAADOwQ",
            },
        ];

        await Product.insertMany(testProducts);
        console.log(
            `✅ Bazaga ${testProducts.length} ta mahsulot muvaffaqiyatli qo'shildi!`,
        );
        process.exit(0);
    } catch (err) {
        console.error("❌ Xatolik:", err);
        process.exit(1);
    }
};

seed();
