import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // TODO: persist file to disk or cloud; mock response for now
  return res.json({ url: `/meme/${Date.now()}.png` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`BE running on http://localhost:${PORT}`));


