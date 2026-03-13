const youtubedl = require("youtube-dl-exec")
const path = require("path")

async function downloadVideo(url) {

  const output = path.join(__dirname, "downloads/%(title)s.%(ext)s")

  await youtubedl(url, {
    exec: "yt-dlp",
    output: output,
    format: "best"
  })

}

module.exports = { downloadVideo }
