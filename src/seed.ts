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
                image: "AgACAgIAAxkBAAICm2nyOT5r0O0uiQgKqu-HFOcY_FF-AALuFGsbEa-YS6BTxvHVf9lQAQADAgADeAADOwQ",
            },
            {
                name: "Oq Klassik Ko'ylak",
                style: ClothingStyle.CLASSIC,
                subStyle: "Oq Klassik ko'ylak",
                price: 250000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIClWnyOT6fmnhL6U21eto9ckvml04aAALoFGsbEa-YS6nCPZhdm416AQADAgADeQADOwQ",
            },
            {
                name: "Klassik Silk Dress",
                style: ClothingStyle.CLASSIC,
                subStyle: "👗 Silk Dress",
                price: 550000,
                sizes: ["S", "M"],
                image: "AgACAgIAAxkBAAICnWnyOT6HcgcFy01B6Uk1SxbS0EThAALxFGsbEa-YS6uX1VVgUNoFAQADAgADeQADOwQ",
            },
            {
                name: "Oq Puff-sleeved Bluzka",
                style: ClothingStyle.CASUAL,
                price: 320000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIDxWny-yyV6RiQ5x0MGe4HGd2XiMhyAALaFmsbEa-YS6_D8jHl6HFAAQADAgADeQADOwQ",
            },
            {
                name: "Jigarrang Casual Kostyum-shim (Nimcha bilan)",
                style: ClothingStyle.CASUAL,
                price: 750000,
                sizes: ["M", "L", "XL"],
                image: "AgACAgIAAgkBAAID3Wny-1PzW5YaWIakXGMvIhxQuPE1AALdFmsbEa-YS2hq7dQsAyPCAQADAgADeQADOwQ",
            },
            {
                name: "Chiziqli Casual To'plam",
                style: ClothingStyle.CASUAL,
                price: 480000,
                sizes: ["S", "M", "L", "XL"],
                image: "AgACAgIAAxkBAAID4Gny-4XZrmd4o1oEnG2mw6bJLpc3AALgFmsbEa-YS_nKTR7zSGHyAQADAgADeQADOwQ",
            },
            {
                name: "Moviy Oversize Sport To'plam",
                style: ClothingStyle.SPORTY,
                price: 450000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIEGWnzAnggcIejBKyyuRZqSYXuWZRaAAL6FmsbEa-YSxVYV6aTee2gAQADAgADeQADOwQ",
            },
            {
                name: "USA Oversize Sport To'plam",
                style: ClothingStyle.SPORTY,
                price: 280000,
                sizes: ["S", "M"],
                image: "AgACAgIAAxkBAAIENmnzA-hac0ac2ii9LBEMm6RaiWVVAAIGF2sbEa-YS0T8e5GfDoVZAQADAgADeQADOwQ",
            },
            {
                name: "Adidas Retro Sport Kostyum",
                style: ClothingStyle.SPORTY,
                price: 520000,
                sizes: ["M", "L", "XL"],
                image: "AgACAgIAAxkBAAIEHWnzAr-31VufPH0-2E3wGIXWowfoAAL-FmsbEa-YS_a5gO2skOi_AQADAgADeQADOwQ",
            },
            {
                name: "K-Pop Graffiti Baggy Pants",
                style: ClothingStyle.KPOP,
                price: 550000,
                sizes: ["S", "M", "L", "XL"],
                image: "AgACAgIAAxkBAAIER2nzHQfhvMgKfxj5IoFEQw21WKuqAAKHFWsbEa-gSw9f3SCQf8tKAQADAgADeAADOwQ",
            },
            {
                name: "Silver Flash Crop Jacket",
                style: ClothingStyle.KPOP,
                price: 680000,
                sizes: ["S", "M"],
                image: "AgACAgIAAxkBAAIESWnzHQ0AAR-CPZx4Da03xgc7AAHy8GAAAogVaxsRr6BLesXZLdwZb0gBAAMCAAN4AAM7BA",
            },
            {
                name: "Ninja Style Techwear Set",
                style: ClothingStyle.KPOP,
                price: 720000,
                sizes: ["M", "L", "XL"],
                image: "AgACAgIAAxkBAAIES2nzHRei4WenhESrQG_G_BtJ6IEeAAKKFWsbEa-gS8MbaBSnoSAMAQADAgADeAADOwQ",
            },
            {
                name: "To'q Ko'k Shoyi Bluzka",
                style: ClothingStyle.ELEGANT,
                price: 420000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIEQWnzGpCV0GzolyLY2pkr2Mw5tM9PAAJ-FWsbEa-gSx6xldVvv3GQAQADAgADeQADOwQ",
            },
            {
                name: "Pushti Tweed To'plam",
                style: ClothingStyle.ELEGANT,
                price: 850000,
                sizes: ["S", "M"],
                image: "AgACAgIAAxkBAAIEQ2nzGvQEUCLR_HAckzG7TZ8uEjoLAAKBFWsbEa-gS8eQ4uf2ihpwAQADAgADeQADOwQ",
            },
            {
                name: "Oq Shoyi Kechki Ko'ylak",
                style: ClothingStyle.ELEGANT,
                price: 1200000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIERWnzGxBkL9Bo27G1nDGa0Jlxel5mAAKCFWsbEa-gS0Sl2axqN2EcAQADAgADeQADOwQ",
            },
            {
                name: "Adras Wedding Special",
                style: ClothingStyle.ETHNIC,
                price: 1500000,
                sizes: ["S", "M", "L"],
                image: "AgACAgIAAxkBAAIETWnzHm997MmIoV2HH5Q1sL5VwxkCAAKjFWsbEa-gS2ulcwvfTtP2AQADAgADeAADOwQ",
            },
            {
                name: "Kelin Style Red Cape",
                style: ClothingStyle.ETHNIC,
                price: 1200000,
                sizes: ["S", "M"],
                image: "AgACAgIAAxkBAAIET2nzHnRyhArErfAR_T5kfO6qsfwsAAKkFWsbEa-gS_rv7cnb4WHEAQADAgADeQADOwQ",
            },
            {
                name: "Royal Black Ikat Dress",
                style: ClothingStyle.ETHNIC,
                price: 1800000,
                sizes: ["M", "L", "XL"],
                image: "AgACAgIAAxkBAAIEUWnzHnmmeL7zj-s11hroDszg8SLrAAKlFWsbEa-gSzvH0bpLPMALAQADAgADeQADOwQ",
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
