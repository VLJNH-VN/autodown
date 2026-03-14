const express = require("express")
const axios = require("axios")

const app = express()

async function y2mate(url) {
    try {

        const id = url.split("v=")[1].split("&")[0]

        const analyze = await axios.post(
            "https://www.y2mate.com/mates/analyzeV2/ajax",
            `k_query=${url}&k_page=home&hl=en&q_auto=0`,
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "Mozilla/5.0"
                }
            }
        )

        const data = analyze.data

        const videoId = data.vid
        const token = data.token

        const convert = await axios.post(
            "https://www.y2mate.com/mates/convertV2/index",
            `vid=${videoId}&k=${token}`,
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }
        )

        return {
            title: data.title,
            thumb: data.t,
            link: convert.data.dlink
        }

    } catch (e) {
        return null
    }
}

app.get("/api/y2", async (req, res) => {

    const url = req.query.url

    if (!url) {
        return res.json({ error: "missing url" })
    }

    const data = await y2mate(url)

    if (!data) {
        return res.json({ error: "download failed" })
    }

    res.json({
        status: true,
        result: data
    })

})

app.listen(3000, () => {
    console.log("Y2 API running")
})
