const express = require("express")
const cors = require("cors")
const { exec } = require("child_process")

const app = express()
app.use(cors())

app.get("/api/down", (req, res) => {

  const url = req.query.url
  if (!url) return res.json({ error: "missing url" })

  exec(`yt-dlp -j "${url}"`, (err, stdout) => {

    if (err) return res.json({ error: "download failed" })

    const data = JSON.parse(stdout)

    res.json({
      title: data.title,
      duration: data.duration,
      thumbnail: data.thumbnail,
      video: data.url
    })

  })

})

app.listen(3000, () => {
  console.log("DownAll API running")
})
