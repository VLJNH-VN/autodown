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


// =======================
// HOME
// =======================

app.get("/", (req,res)=>{
res.json({
name:"Ultimate Downloader API",
support:"1200+ websites",
endpoints:[
"/tiktok?url=",
"/youtube?url=",
"/instagram?url=",
"/facebook?url=",
"/api?url="
]
})
})


// =======================
// CORE FUNCTION
// =======================

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
.filter(f=>f.url && f.ext)
.map(f=>({
quality:f.format_note || (f.height ? f.height+"p":"auto"),
ext:f.ext,
url:f.url
}))
.slice(0,10)

const result = {
title:info.title,
duration:info.duration,
uploader:info.uploader,
thumbnail:info.thumbnail,
formats
}

cache.set(url,result)

return result
}


// =======================
// UNIVERSAL API
// =======================

app.get("/api", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const data = await extract(url)

res.json(data)

}catch(e){
res.json({error:true,message:e.message})
}
})


// =======================
// TIKTOK FAST API
// =======================

app.get("/tiktok", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const info = await ytdlp(url,{
dumpSingleJson:true,
noWarnings:true,
format:"best"
})

res.json({
title:info.title,
thumbnail:info.thumbnail,
video:info.url
})

}catch(e){
res.json({error:true})
}
})


// =======================
// YOUTUBE API
// =======================

app.get("/youtube", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const info = await extract(url)

res.json(info)

}catch(e){
res.json({error:true})
}
})


// =======================
// INSTAGRAM API
// =======================

app.get("/instagram", async (req,res)=>{
try{

const url = req.query.url
if(!url) return res.json({error:"missing url"})

const info = await ytdlp(url,{
dumpSingleJson:true
})

res.json({
title:info.title,
thumbnail:info.thumbnail,
video:info.url
})

}catch(e){
res.json({error:true})
}
})


// =======================

app.listen(PORT,()=>{
console.log("Downloader API running on "+PORT)
})      thumbnail: info.thumbnail || null,
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
