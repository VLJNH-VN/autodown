const express = require("express")
const { downloadVideo } = require("./downloader")

const app = express()

app.get("/downall", async (req, res) => {

  try {

    const url = req.query.url

    if (!url) {
      return res.json({
        error: "url required"
      })
    }

    await downloadVideo(url)

    res.json({
      status: "download complete"
    })

  } catch (err) {

    res.json({
      error: err.message
    })

  }

})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Server running")
})
