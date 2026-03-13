const express = require("express")
const youtubedl = require("youtube-dl-exec")
const NodeCache = require("node-cache")

const app = express()
const cache = new NodeCache({ stdTTL: 3600 })

app.get("/api/down", async (req, res) => {

  const url = req.query.url
  if (!url) return res.json({ error: "Missing url" })

  const cached = cache.get(url)
  if (cached) return res.json(cached)

  try {

    const data = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true
    })

    const result = {
      title: data.title,
      duration: data.duration,
      thumbnail: data.thumbnail,
      video: data.url
    }

    cache.set(url, result)

    res.json(result)

  } catch (err) {

    res.json({
      error: "Download failed"
    })

  }

})

app.listen(3000, () => console.log("API running"))
