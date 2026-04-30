import { Telegraf, Markup } from "telegraf";
import mongoose from "mongoose";
import "dotenv/config";
import http from "http";
import { ClothingStyle } from "./types/index.js";
import { Product } from "./models/product.js";
import { Cart } from "./models/cart.js";

const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is live!");
});
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Port ${PORT} tinglanmoqda...`);
});

const ADMIN_ID = Number(process.env.ADMIN_ID) || 123456789;
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

const catalogStylesMenu = Markup.keyboard([
    ...Object.values(ClothingStyle).reduce((acc: string[][], curr, i) => {
        if (i % 2 === 0) acc.push([curr]);
        else acc[acc.length - 1].push(curr);
        return acc;
    }, []),
    ["⬅️ Ortga"],
]).resize();

const classicSubMenu = Markup.keyboard([
    ["🤵 Kostyum-shim", "Oq Klassik ko'ylak"],
    ["👗 Silk Dress"],
    ["⬅️ Ortga"],
]).resize();
bot.start((ctx) => {
    ctx.reply(
        `Assalomu alaykum ${ctx.from.first_name}! 👋\nOnline do'konimizga xush kelibsiz.`,
        mainMenu,
    );
});

bot.hears("⬅️ Ortga", (ctx) => {
    ctx.reply("Asosiy menyuga qaytdingiz:", mainMenu);
});

bot.hears("🛍 Katalog", (ctx) => {
    ctx.reply("Kiyim uslubini tanlang:", catalogStylesMenu);
});

bot.hears(ClothingStyle.CLASSIC, (ctx) => {
    ctx.reply("Klassik kiyimlar turini tanlang:", classicSubMenu);
});
bot.hears(
    [
        ClothingStyle.CASUAL,
        ClothingStyle.SPORTY,
        ClothingStyle.ELEGANT,
        ClothingStyle.KPOP,
        ClothingStyle.ETHNIC,
    ],
    async (ctx) => {
        const style = ctx.message.text as ClothingStyle;
        const products = await Product.find({ style: style });

        if (products.length === 0) {
            return ctx.reply(`Hozircha ${style} bo'limida mahsulotlar yo'q.`);
        }

        const productButtons = products.map((p) => [p.name]);
        productButtons.push(["⬅️ Ortga"]);

        await ctx.reply(
            `${style} mahsulotlarimizdan birini tanlang:`,
            Markup.keyboard(productButtons).resize(),
        );
    },
);
Object.values(ClothingStyle).forEach((style) => {
    if (
        style === ClothingStyle.CLASSIC ||
        style === ClothingStyle.CASUAL ||
        style === ClothingStyle.SPORTY ||
        style === ClothingStyle.ELEGANT ||
        style === ClothingStyle.KPOP ||
        style === ClothingStyle.ETHNIC
    )
        return;

    bot.hears(style, async (ctx) => {
        const products = await Product.find({ style: style });
        await showProducts(ctx, products, style);
    });
});

const classicSubStyles = [
    "🤵 Kostyum-shim",
    "Oq Klassik ko'ylak",
    "👗 Silk Dress",
];

classicSubStyles.forEach((subStyle) => {
    bot.hears(subStyle, async (ctx) => {
        const products = await Product.find({ subStyle: subStyle });
        await showProducts(ctx, products, subStyle);
    });
});
bot.on("text", async (ctx, next) => {
    const text = ctx.message.text;
    const product = await Product.findOne({
        name: text,
        style: {
            $in: [
                ClothingStyle.CASUAL,
                ClothingStyle.SPORTY,
                ClothingStyle.ELEGANT,
                ClothingStyle.KPOP,
                ClothingStyle.ETHNIC,
            ],
        },
    });

    if (product) {
        await showProducts(ctx, [product], product.name);
    } else {
        return next();
    }
});

bot.on("photo", async (ctx) => {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    await ctx.reply(`📸 Rasm ID-si: \n<code>${fileId}</code>`, {
        parse_mode: "HTML",
    });
});

async function showProducts(ctx: any, products: any[], title: string) {
    if (products.length === 0)
        return ctx.reply("Hozircha bu bo'limda mahsulotlar yo'q.");

    ctx.reply(`${title} yuklanmoqda...`);
    for (const prod of products) {
        const caption = `<b>👗 ${prod.name}</b>\n\n💰 Narxi: ${prod.price.toLocaleString()} so'm\n📏 O'lchamlar: ${prod.sizes.join(", ")}`;
        const sizeButtons = prod.sizes.map((size: string) =>
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
}
bot.hears("🛒 Savatcha", async (ctx) => {
    const userId = ctx.from.id;
    const items = await Cart.find({ userId }).populate("productId");
    if (items.length === 0) return ctx.reply("Savatchangiz hozircha bo'sh. 🛒");

    let total = 0;
    let text = "<b>🛒 Sizning savatchangiz:</b>\n\n";
    items.forEach((item: any, index) => {
        if (item.productId) {
            const subtotal = item.productId.price * item.quantity;
            total += subtotal;
            text += `${index + 1}. <b>${item.productId.name}</b>\n   📐 O'lcham: ${item.size} | 🔢 ${item.quantity} dona\n   💰 Narx: ${subtotal.toLocaleString()} so'm\n\n`;
        }
    });
    text += `────────────────────\n💵 <b>Jami: ${total.toLocaleString()} so'm</b>`;

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
        "Telefon raqamingizni yuboring:",
        Markup.keyboard([
            [Markup.button.contactRequest("📱 Telefon yuborish")],
            ["⬅️ Ortga"],
        ])
            .resize()
            .oneTime(),
    );
});

bot.on("contact", async (ctx) => {
    await ctx.reply(
        "Rahmat! Endi manzilni (lokatsiya) yuboring:",
        Markup.keyboard([
            [Markup.button.locationRequest("📍 Lokatsiyani yuborish")],
            ["⬅️ Ortga"],
        ])
            .resize()
            .oneTime(),
    );
});

bot.on("location", async (ctx) => {
    const userId = ctx.from.id;
    const location = ctx.message.location;
    try {
        const items = await Cart.find({ userId }).populate("productId");
        let orderList = "";
        let total = 0;
        items.forEach((item: any, i) => {
            if (item.productId) {
                total += item.productId.price * item.quantity;
                orderList += `${i + 1}. ${item.productId.name} (${item.size})\n`;
            }
        });

        const adminMsg = `📦 <b>YANGI BUYURTMA!</b>\n\n👤 Mijoz: ${ctx.from.first_name}\n📝 Mahsulotlar:\n${orderList}\n💰 Jami: ${total.toLocaleString()} so'm`;

        await bot.telegram.sendMessage(ADMIN_ID, adminMsg, {
            parse_mode: "HTML",
        });
        await bot.telegram.sendLocation(
            ADMIN_ID,
            location.latitude,
            location.longitude,
        );

        await Cart.deleteMany({ userId });
        await ctx.reply("Rahmat! Buyurtmangiz qabul qilindi. ✅", mainMenu);
    } catch (e) {
        await ctx.reply(
            "Xatolik yuz berdi. Iltimos, qaytadan urunib ko'ring. ⚠️",
            mainMenu,
        );
    }
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
bot.hears("📍 Filiallar", (ctx) =>
    ctx.reply(
        "🏠 <b>Bizning filiallarimiz:</b>\n\n1. Sirdaryo V., Guliston Shahar 1-mavze.",
        { parse_mode: "HTML" },
    ),
);
bot.hears("🕒 Ish vaqti", (ctx) =>
    ctx.reply("⏰ <b>Ish tartibi:</b> 09:00 - 20:00", { parse_mode: "HTML" }),
);
bot.hears("📞 Aloqa", (ctx) =>
    ctx.reply("☎️ <b>Admin:</b> @papina_dochka", { parse_mode: "HTML" }),
);
bot.hears("🏷 Chegirmalar", (ctx) =>
    ctx.reply("🎁 Mavsumiy chegirmalar mavjud!"),
);

bot.launch().then(() => console.log("🤖 Bot ishlayapti..."));
