import { Telegraf, Markup } from "telegraf";
import mongoose from "mongoose";
import "dotenv/config";
import { ClothingStyle } from "./types/index.js";
import { Product } from "./models/product.js";
import { Cart } from "./models/cart.js";

const ADMIN_ID = 123456789;

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN topilmadi!");

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log("🔥 MongoDB muvaffaqiyatli ulandi"))
    .catch((err) => console.error("❌ MongoDB xatosi:", err));

const mainMenu = Markup.keyboard([
    ["🛍 Katalog", "🛒 Savatcha"],
    ["📍 Filiallar", "📞 Aloqa"],
    ["🕒 Ish vaqti", "🏷 Chegirmalar"],
]).resize();

bot.start((ctx) => {
    ctx.reply(
        `Assalomu alaykum ${ctx.from.first_name}! 👋\nOnline do'konimizga xush kelibsiz.`,
        mainMenu,
    );
});
bot.hears("🛒 Savatcha", async (ctx) => {
    const userId = ctx.from.id;
    const items = await Cart.find({ userId }).populate("productId");
    if (items.length === 0) {
        return ctx.reply("Savatchangiz hozircha bo'sh. 🛒");
    }

    let total = 0;
    let text = "<b>🛒 Sizning savatchangiz:</b>\n\n";

    items.forEach((item: any, index) => {
        const subtotal = item.productId.price * item.quantity;
        total += subtotal;
        text += `${index + 1}. <b>${item.productId.name}</b>\n`;
        text += `   📐 O'lcham: ${item.size} | 🔢 ${item.quantity} dona\n`;
        text += `   💰 Narx: ${subtotal.toLocaleString()} so'm\n\n`;
    });

    text += `────────────────────\n`;
    text += `💵 <b>Jami: ${total.toLocaleString()} so'm</b>`;

    await ctx.reply(text, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            [Markup.button.callback("🗑 Savatni tozalash", "clear_cart")],
            [Markup.button.callback("✅ Buyurtmani tasdiqlash", "checkout")],
        ]),
    });
});

bot.action("checkout", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
        "Buyurtmani rasmiylashtirish uchun telefon raqamingizni yuboring:",
        Markup.keyboard([
            [Markup.button.contactRequest("📱 Telefon raqamni yuborish")],
        ])
            .resize()
            .oneTime(),
    );
});
bot.on("contact", async (ctx) => {
    await ctx.reply(
        "Rahmat! Endi mahsulot yetkazib berilishi kerak bo'lgan manzilni (lokatsiya) yuboring:",
        Markup.keyboard([
            [Markup.button.locationRequest("📍 Lokatsiyani yuborish")],
        ])
            .resize()
            .oneTime(),
    );
});
bot.on("location", async (ctx) => {
    const userId = ctx.from.id;
    const location = ctx.message.location;
    const items = await Cart.find({ userId }).populate("productId");

    if (items.length === 0) return ctx.reply("Savat bo'sh.");

    let total = 0;
    let orderList = "";
    items.forEach((item: any, i) => {
        total += item.productId.price * item.quantity;
        orderList += `${i + 1}. ${item.productId.name} (${item.size}) - ${item.quantity} dona\n`;
    });

    const adminMsg =
        `📦 <b>YANGI BUYURTMA!</b>\n\n` +
        `👤 Mijoz: ${ctx.from.first_name}\n` +
        `🆔 ID: ${userId}\n` +
        `📝 Mahsulotlar:\n${orderList}\n` +
        `💰 Jami: <b>${total.toLocaleString()} so'm</b>`;
    await bot.telegram.sendMessage(ADMIN_ID, adminMsg, { parse_mode: "HTML" });
    await bot.telegram.sendLocation(
        ADMIN_ID,
        location.latitude,
        location.longitude,
    );
    await Cart.deleteMany({ userId });

    await ctx.reply(
        "Tabriklaymiz! Buyurtmangiz qabul qilindi. Tez orada operatorimiz bog'lanadi. ✅",
        mainMenu,
    );
});
bot.action(/buy_(.+)_(.+)/, async (ctx) => {
    const productId = ctx.match[1];
    const size = ctx.match[2];
    const userId = ctx.from!.id;
    try {
        let cartItem = await Cart.findOne({ userId, productId, size });
        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            await Cart.create({ userId, productId, size, quantity: 1 });
        }
        await ctx.answerCbQuery("Savatga qo'shildi! ✅");
        await ctx.reply(`✅ <b>${size}</b> o'lcham savatga qo'shildi.`, {
            parse_mode: "HTML",
        });
    } catch (error) {
        await ctx.answerCbQuery("Xatolik! ❌");
    }
});

bot.action("clear_cart", async (ctx) => {
    await Cart.deleteMany({ userId: ctx.from!.id });
    await ctx.answerCbQuery("Savat tozalandi 🗑");
    await ctx.editMessageText("Savatchangiz bo'shatildi.");
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

    if (products.length === 0)
        return ctx.reply("Hozircha bu bo'limda mahsulotlar yo'q.");

    for (const prod of products) {
        const caption = `<b>👗 ${prod.name}</b>\n\n💰 Narxi: ${prod.price.toLocaleString()} so'm\n📏 O'lchamlar: ${prod.sizes.join(", ")}`;
        const sizeButtons = prod.sizes.map((size) =>
            Markup.button.callback(size, `buy_${prod._id}_${size}`),
        );
        const rows = [];
        for (let i = 0; i < sizeButtons.length; i += 3)
            rows.push(sizeButtons.slice(i, i + 3));

        await ctx.replyWithPhoto(prod.image, {
            caption,
            parse_mode: "HTML",
            ...Markup.inlineKeyboard(rows),
        });
    }
});

bot.hears("📍 Filiallar", (ctx) => {
    ctx.reply(
        "🏠 <b>Bizning filiallarimiz:</b>\n\n1. Sirdaryo V., Guliston Shahar 1-mavze.\n2. Guliston sh., Bunyodkor ko'chasi.",
        { parse_mode: "HTML" },
    );
});

bot.hears("🕒 Ish vaqti", (ctx) => {
    ctx.reply(
        "⏰ <b>Ish tartibi:</b>\n\nDushanba - Shanba: 09:00 - 20:00\nYakshanba: 10:00 - 18:00",
        { parse_mode: "HTML" },
    );
});

bot.hears("📞 Aloqa", (ctx) => {
    ctx.reply(
        "☎️ <b>Biz bilan bog'lanish:</b>\n\nAdmin: @sizning_admin_useringiz\nTelefon: +998 90 123 45 67",
        { parse_mode: "HTML" },
    );
});

bot.hears("🏷 Chegirmalar", (ctx) => {
    ctx.reply(
        "🎁 Hozirda barcha K-POP uslubidagi kiyimlarga 10% chegirma mavjud!",
    );
});

bot.catch((err: any, ctx) =>
    console.error(`Bot xatosi: ${ctx.updateType}`, err),
);

bot.launch().then(() => console.log("🤖 Bot ishlayapti..."));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
