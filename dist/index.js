import { Telegraf, Markup } from "telegraf";
import mongoose from "mongoose";
import "dotenv/config";
import { ClothingStyle } from "./types/index.js";
import { Product } from "./models/product.js";
if (!process.env.BOT_TOKEN)
    throw new Error("BOT_TOKEN topilmadi!");
const bot = new Telegraf(process.env.BOT_TOKEN);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("🔥 MongoDB muvaffaqiyatli ulandi"))
    .catch((err) => console.error("❌ MongoDB xatosi:", err));
const mainMenu = Markup.keyboard([
    ["🛍 Katalog", "🛒 Savatcha"],
    ["📍 Filiallar", "📞 Aloqa"],
    ["🕒 Ish vaqti", "🏷 Chegirmalar"],
]).resize();
bot.start((ctx) => {
    ctx.reply(`Assalomu alaykum ${ctx.from.first_name}! 👋\nOnline do'konimizga xush kelibsiz.`, mainMenu);
});
bot.hears("🛍 Katalog", (ctx) => {
    const styleButtons = Object.values(ClothingStyle).map((style) => [
        Markup.button.callback(style, `style_${style}`),
    ]);
    ctx.reply("Kiyim uslubini tanlang:", Markup.inlineKeyboard(styleButtons));
});
bot.action(/style_(.+)/, async (ctx) => {
    const selectedStyle = ctx.match[1];
    await ctx.answerCbQuery();
    const products = await Product.find({ style: selectedStyle });
    if (products.length === 0) {
        return ctx.reply("Hozircha bu bo'limda mahsulotlar yo'q.");
    }
    for (const prod of products) {
        const caption = `<b>👗 ${prod.name}</b>\n\n` +
            `💰 Narxi: ${prod.price.toLocaleString()} so'm\n` +
            `📏 O'lchamlar: ${prod.sizes.join(", ")}`;
        const sizeButtons = prod.sizes.map((size) => Markup.button.callback(size, `buy_${prod._id}_${size}`));
        const rows = [];
        for (let i = 0; i < sizeButtons.length; i += 3) {
            rows.push(sizeButtons.slice(i, i + 3));
        }
        await ctx.replyWithPhoto(prod.image, {
            caption,
            parse_mode: "HTML",
            ...Markup.inlineKeyboard(rows),
        });
    }
});
bot.hears("📍 Filiallar", (ctx) => {
    ctx.reply("🏠 <b>Bizning filiallarimiz:</b>\n\n1. Toshkent sh., Chilonzor 1-kvartal.\n2. Samarqand sh., Registon ko'chasi.", { parse_mode: "HTML" });
});
bot.hears("🕒 Ish vaqti", (ctx) => {
    ctx.reply("⏰ <b>Ish tartibi:</b>\n\nDushanba - Shanba: 09:00 - 20:00\nYakshanba: 10:00 - 18:00", { parse_mode: "HTML" });
});
bot.hears("📞 Aloqa", (ctx) => {
    ctx.reply("☎️ <b>Biz bilan bog'lanish:</b>\n\nAdmin: @sizning_admin_useringiz\nTelefon: +998 90 123 45 67\nKarta: 8600 **** **** ****", { parse_mode: "HTML" });
});
bot.hears("🏷 Chegirmalar", (ctx) => {
    ctx.reply("🎁 Hozirda barcha K-POP uslubidagi kiyimlarga 10% chegirma mavjud!");
});
bot.catch((err, ctx) => {
    console.error(`Bot xatosi: ${ctx.updateType}`, err);
});
bot.launch().then(() => console.log("🤖 Bot pishillab ishlayapti..."));
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
