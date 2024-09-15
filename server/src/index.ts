import express from "express";
import { config } from "dotenv";
// import { Anthropic } from "@anthropic-ai/sdk";
import multer from "multer"
import path from "path"

config();
const app = express();
app.use(express.urlencoded({extended: false}))
// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// });

const PORT = process.env.PORT || 3000;
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req,file,cb)=>{
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: (req,file, cb)=> {
    const fileTypes = /pdf|docx|doc/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if(extname && mimetype){
      return cb(null, true)
    } else{
      cb(new Error('file type not supported'))
    }
  }
})

app.get("/", async (req, res) => {
  try {
    // const response = await anthropic.messages.create({
    //   model: "claude-3-opus-20240229",
    //   max_tokens: 1000,
    //   messages: [
    //     { role: "user", content: "Hello, Claude! How are you today?" },
    //   ],
    // });

    // console.log(response);
    res.send("Hello, I am working");
  } catch (e) {
    console.log(e);
  }
});

app.post('/upload',upload.single("document") ,async(req,res) => {
  console.log(req.body);
  console.log(req.file);
  
  res.send("received")
})

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
