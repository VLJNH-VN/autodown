const express = require("express")
const { exec } = require("child_process")

const app = express()

app.get("/", (req,res)=>{
 res.json({
   status:"DOWNALL API RUNNING"
 })
})

app.get("/api", (req,res)=>{

 const url = req.query.url
 if(!url) return res.json({error:"missing url"})

 exec(`yt-dlp -j "${url}"`, (err, stdout)=>{

  if(err) return res.json({error:"download failed"})

  const data = JSON.parse(stdout)

  res.json({
   title:data.title,
   thumbnail:data.thumbnail,
   duration:data.duration,
   formats:data.formats
     .filter(v=>v.url)
     .slice(0,10)
     .map(v=>({
       quality:v.format_note || v.height,
       ext:v.ext,
       url:v.url
     }))
  })

 })

})

app.listen(process.env.PORT || 3000)
