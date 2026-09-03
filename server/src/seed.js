import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Credit from "./models/Credit.js";

// Returns a YYYY-MM-DD string N days before today, in local time.
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

// Mahalla oziq-ovqat do'koni uchun namunaviy nasiya ro'yxati.
const seedCredits = [
  { name: "Abdulaziz Rahmonov",     daysAgo: 2,   price: 145000, phone: "+998901234567" },
  { name: "Dilnoza Karimova",       daysAgo: 4,   price: 87500,  phone: "+998935567812" },
  { name: "Sherzod Toshmatov",      daysAgo: 5,   price: 312000, phone: "+998977845621" },
  { name: "Gulnora Yusupova",       daysAgo: 8,   price: 64000,  phone: "+998913324578" },
  { name: "Bekzod Ergashev",        daysAgo: 11,  price: 528000, phone: "+998946612390" },
  { name: "Nilufar Sobirova",       daysAgo: 13,  price: 96500,  phone: "+998998871245" },
  { name: "Jasur Xolmatov",         daysAgo: 16,  price: 235000, phone: "+998889934502" },
  { name: "Malika Ibragimova",      daysAgo: 19,  price: 58000,  phone: "+998903217788" },
  { name: "Otabek Qodirov",         daysAgo: 22,  price: 419000, phone: "+998974456123" },
  { name: "Zulfiya Nazarova",       daysAgo: 25,  price: 172500, phone: "+998935598034" },
  { name: "Sanjar Umarov",          daysAgo: 28,  price: 640000, phone: "+998912276549" },
  { name: "Feruza Sharipova",       daysAgo: 31,  price: 73000,  phone: "+998999123847" },
  { name: "Aziz Tursunov",          daysAgo: 34,  price: 288000, phone: "+998946789012" },
  { name: "Kamola Yo'ldosheva",     daysAgo: 38,  price: 51500,  phone: "+998901178456" },
  { name: "Rustam Ismoilov",        daysAgo: 42,  price: 755000, phone: "+998977012389" },
  { name: "Nodira Abdullayeva",     daysAgo: 45,  price: 124000, phone: "+998933445671" },
  { name: "Farrux Mirzayev",        daysAgo: 49,  price: 367500, phone: "+998889012345" },
  { name: "Mohira Saidova",         daysAgo: 53,  price: 89000,  phone: "+998914567823" },
  { name: "Ulug'bek Jo'rayev",      daysAgo: 58,  price: 445000, phone: "+998998234501" },
  { name: "Sevara Tojiyeva",        daysAgo: 63,  price: 67500,  phone: "+998905643218" },
  { name: "Doniyor Ochilov",        daysAgo: 68,  price: 512000, phone: "+998971189234" },
  { name: "Nargiza Hakimova",       daysAgo: 74,  price: 158000, phone: "+998936778901" },
  { name: "Shohrux Xudoyberdiyev",  daysAgo: 81,  price: 693000, phone: "+998887456012" },
  { name: "Dilorom Ravshanova",     daysAgo: 89,  price: 102500, phone: "+998918823490" },
  { name: "Akmal Sultonov",         daysAgo: 97,  price: 384000, phone: "+998992345678" },
];

async function seed() {
  await connectDB();

  const existing = await Credit.countDocuments();
  if (existing > 0) {
    console.log(`⚠️  Bazada allaqachon ${existing} ta yozuv bor. Tozalanmoqda...`);
    await Credit.deleteMany({});
  }

  const docs = seedCredits.map(({ name, daysAgo: ago, price, phone }) => {
    const created = new Date();
    created.setDate(created.getDate() - ago);
    return { name, date: daysAgo(ago), price, phone, createdAt: created, updatedAt: created };
  });

  const inserted = await Credit.insertMany(docs);
  const total = inserted.reduce((sum, c) => sum + c.price, 0);

  console.log(`✅ ${inserted.length} ta nasiya qo'shildi`);
  console.log(`💰 Umumiy qarz: ${total.toLocaleString("uz-UZ").replace(/,/g, " ")} so'm`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("❌ Seed xatosi:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
