const express = require("express");
const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

const DOWNLOAD_DIR = path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// API download
app.post("/downall", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    const filePath = path.join(DOWNLOAD_DIR, "%(title)s.%(ext)s");

    await youtubedl(url, {
      output: filePath,
      format: "best"
    });

    res.json({
      status: "success",
      message: "Download completed"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
