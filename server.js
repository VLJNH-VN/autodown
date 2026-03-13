const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const ytdlp = require("yt-dlp-exec")
const NodeCache = require("node-cache")

const app = express()
const cache = new NodeCache({ stdTTL: 3600 })

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.json({
    name: "DownAll API",
    version: "1.0",
    endpoints: [
      "/api/down?url=",
      "/api/info?url="
    ]
  })
})


// ===============================
// Download API
// ===============================

app.get("/api/down", async (req, res) => {

  const url = req.query.url
  if (!url) return res.json({ error: "Missing url" })

  const cached = cache.get(url)
  if (cached) return res.json(cached)

  try {

    const data = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true
    })

    const result = {
      status: true,
      platform: data.extractor,
      title: data.title,
      duration: data.duration,
      thumbnail: data.thumbnail,
      video: data.url
    }

    cache.set(url, result)

    res.json(result)

  } catch (err) {

    res.json({
      status: false,
      error: "Unsupported or private video"
    })

  }

})


// ===============================
// Video Info
// ===============================

app.get("/api/info", async (req, res) => {

  const url = req.query.url
  if (!url) return res.json({ error: "Missing url" })

  try {

    const data = await ytdlp(url, {
      dumpSingleJson: true
    })

    res.json({
      title: data.title,
      uploader: data.uploader,
      duration: data.duration,
      views: data.view_count,
      thumbnail: data.thumbnail
    })

  } catch (e) {

    res.json({
      error: "Cannot fetch info"
    })

  }

})

app.listen(PORT, () => {
  console.log("DownAll API running on port " + PORT)
})
