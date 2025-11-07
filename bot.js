const fs = require('fs');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
dotenv.config();

const { askOpenAI } = require('./utils/openai');
const ANALYTICS_FILE = './analytics.json';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN missing');

const bot = new Telegraf(BOT_TOKEN);

function loadData() {
  if (!fs.existsSync('data.json')) return {};
  return JSON.parse(fs.readFileSync('data.json', 'utf-8'));
}

function saveAnalytics(entry) {
  let analytics = [];
  if (fs.existsSync(ANALYTICS_FILE)) analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
  analytics.push({ ...entry, timestamp: new Date() });
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
}

async function answer(query) {
  const data = loadData();
  query = query.toLowerCase();
  for (let key in data) {
    if (query.includes(key.toLowerCase())) return { text: data[key], source: 'local' };
  }
  // fallback GPT-5
  if (process.env.OPENAI_API_KEY) {
    const gptReply = await askOpenAI("Siz maktab AI botsiz, foydalanuvchining savoliga lokal ma’lumot va GPT fallback orqali javob bering.", query);
    if (gptReply) return { text: gptReply, source: 'gpt' };
  }
  return { text: "Savolga javob topilmadi", source: 'none' };
}

bot.start(ctx => ctx.reply("Assalomu alaykum! Savolingizni yozing."));
bot.command('help', ctx => ctx.reply("/help, /ask <savol>"));
bot.command('ask', async ctx => {
  const query = ctx.message.text.replace('/ask', '').trim();
  if (!query) return ctx.reply("Savol yozing.");
  const result = await answer(query);
  ctx.reply(result.text);
  saveAnalytics({ userId: ctx.from.id, query, answeredBy: result.source, snippet: result.text.slice(0,50) });
});
bot.on('text', async ctx => ctx.reply("Savolingizni /ask bilan yuboring."));

bot.launch().then(() => console.log('Bot ishga tushdi'));
