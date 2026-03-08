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

app.get("/", (req,res)=>{
res.json({
status: "Auto Downloader API",
support: "1000+ websites",
endpoint: "/api?url="
})
})

app.get("/api", async (req,res)=>{

try{

const url = req.query.url
if(!url) return res.json({error:"Missing url"})

const cacheData = cache.get(url)
if(cacheData) return res.json(cacheData)

const info = await ytdlp(url,{
dumpSingleJson:true,
noWarnings:true,
noCheckCertificates:true,
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
