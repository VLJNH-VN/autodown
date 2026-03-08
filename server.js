const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const NodeCache = require("node-cache")
const ytdlp = require("youtube-dl-exec")

const app = express()

app.use(cors())
app.use(morgan("dev"))

const cache = new NodeCache({ stdTTL: 600 })

const PORT = process.env.PORT || 3000


// ================= HOME =================

app.get("/", (req,res)=>{
res.json({
status:"Ultimate Downloader API",
support:"1200+ websites",
endpoints:{
universal:"/api?url=",
tiktok:"/tiktok?url=",
youtube:"/youtube?url=",
instagram:"/instagram?url="
}
})
})


// ================= CORE EXTRACT =================

async function extract(url){

const cacheData = cache.get(url)
if(cacheData) return cacheData

const info = await ytdlp(url,{
dumpSingleJson:true,
noWarnings:true,
noCheckCertificates:true,
preferFreeFormats:true
})

const formats = (info.formats || [])
.filter(f => f.url && f.ext)
.map(f => ({
quality: f.format_note || (f.height ? f.height + "p" : "auto"),
ext: f.ext,
url: f.url
}))
.slice(0,10)

const result = {
title: info.title || "Unknown",
duration: info.duration || 0,
uploader: info.uploader || "Unknown",
thumbnail: info.thumbnail || null,
formats: formats
}

cache.set(url,result)

return result
}


// ================= UNIVERSAL API =================

app.get("/api", async (req,res)=>{
try{

const url = req.query.url

if(!url){
return res.json({
error:true,
message:"missing url"
})
}

const data = await extract(url)

res.json(data)

}catch(e){

res.json({
error:true,
message:e.message
})

}
})


// ================= TIKTOK FAST =================

app.get("/tiktok", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const info = await ytdlp(url,{
dumpSingleJson:true,
format:"best"
})

res.json({
title: info.title || "TikTok Video",
thumbnail: info.thumbnail || null,
video: info.url || null
})

}catch(e){

res.json({
error:true,
message:e.message
})

}
})


// ================= YOUTUBE =================

app.get("/youtube", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const data = await extract(url)

res.json(data)

}catch(e){

res.json({
error:true,
message:e.message
})

}
})


// ================= INSTAGRAM =================

app.get("/instagram", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const info = await ytdlp(url,{
dumpSingleJson:true
})

res.json({
title: info.title || "Instagram Video",
thumbnail: info.thumbnail || null,
video: info.url || null
})

}catch(e){

res.json({
error:true,
message:e.message
})

}
})


// ================= SERVER START =================

app.listen(PORT,()=>{
console.log("Downloader API running on port " + PORT)
})
