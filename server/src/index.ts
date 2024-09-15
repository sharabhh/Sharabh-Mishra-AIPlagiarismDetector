import express from "express";
import { config } from "dotenv";
import {OpenAI} from "openai";

config();
const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 3000;



app.get("/", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
  });

    console.log(response);
    res.send("Hello, I am working");
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
