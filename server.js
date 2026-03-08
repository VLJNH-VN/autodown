const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const NodeCache = require("node-cache")
const ytdlp = require("yt-dlp-exec")

const app = express()

const cache = new NodeCache({ stdTTL: 600 })

app.use(cors())
app.use(morgan("dev"))

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.json({
    status: "Auto Downloader API",
    support: "1000+ websites",
    endpoint: "/api?url="
  })
})

app.get("/api", async (req, res) => {
  try {

    const url = req.query.url
    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" })
    }

    if (!url.startsWith("http")) {
      return res.status(400).json({ error: "Invalid url" })
    }

    const cacheData = cache.get(url)
    if (cacheData) {
      return res.json({
        cached: true,
        ...cacheData
      })
    }

    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      socketTimeout: 15000
    })

    if (!info || !info.formats) {
      return res.status(404).json({
        error: "Cannot extract video info"
      })
    }

    const formats = info.formats
      .filter(f => f.url)
      .map(f => ({
        quality: f.format_note || (f.height ? f.height + "p" : "unknown"),
        ext: f.ext || "mp4",
        url: f.url
      }))
      .filter((v, i, a) => a.findIndex(t => t.url === v.url) === i)
      .slice(0, 10)

    const result = {
      title: info.title || "Unknown",
      duration: info.duration || 0,
      uploader: info.uploader || "Unknown",
      thumbnail: info.thumbnail || null,
      formats
    }

    cache.set(url, result)

    res.json(result)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: true,
      message: "Download extraction failed"
    })
  }
})

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})noCheckCertificates:true,
preferFreeFormats:true
})

const formats = info.formats
.filter(f=>f.url)
.map(f=>({
quality:f.format_note || f.height+"p",
ext:f.ext,
url:f.url
}))

const result = {
title:info.title,
duration:info.duration,
uploader:info.uploader,
thumbnail:info.thumbnail,
formats:formats.slice(0,10)
}

cache.set(url,result)

res.json(result)

}catch(err){

res.json({
error:true,
message:err.message
})

}

})

app.listen(PORT,()=>{
console.log("Server running "+PORT)
})
