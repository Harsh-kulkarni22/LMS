require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
async function run() {
  try {
    const key = process.env.GEMINI_API_KEY.trim();
    if (!key) throw new Error("No API key");
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const res = await model.generateContent('hello');
    console.log("SUCCESS");
  } catch(e) {
    console.log("ERR:", e.message);
  }
}
run();
