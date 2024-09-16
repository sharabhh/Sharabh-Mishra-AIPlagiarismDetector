import express from "express";
import { config } from "dotenv";
import { Anthropic } from "@anthropic-ai/sdk";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import { log } from "console";

config();
const app = express();
app.use(express.urlencoded({ extended: false }));
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const PORT = process.env.PORT || 3000;
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|docx|doc/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("file type not supported"));
    }
  },
});

app.get("/", async (req, res) => {
  try {
    const readPdfFile = fs.readFileSync(
      "./uploads/1726468708127-SHARABH_MISHRA_RESUME.pdf"
    );
    const extracted = await pdfParse(readPdfFile);
    const harryPotter = `Mr. and Mrs. Dursley, of number four, Privet Drive, were
proud to say that they were perfectly normal, thank
you very much. They were the last people you’d expect to be involved in anything strange or mysterious, because they just didn’t
hold with such nonsense.
Mr. Dursley was the director of a firm called Grunnings, which
made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin
and blonde and had nearly twice the usual amount of neck, which
came in very useful as she spent so much of her time craning over
garden fences, spying on the neighbors. The Dursleys had a small
son called Dudley and in their opinion there was no finer boy anywhere.
The Dursleys had everything they wanted, but they also had a
secret, and their greatest fear was that somebody would discover it.
M`;
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Parse the following data for plagiarism, and only return either true for plagiarised and false for original content : ${harryPotter}`,
        },
      ],
    });

    console.log(response);
    res.send("Hello, I am working");
  } catch (e) {
    console.log(e);
  }
});

app.post("/upload", upload.single("document"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  res.send("received");
});

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
