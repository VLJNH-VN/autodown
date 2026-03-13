const express = require("express")
const cors = require("cors")
const { execSync, exec } = require("child_process")

const app = express()
app.use(cors())

// ==============================
// AUTO INSTALL yt-dlp
// ==============================

function installYTDLP(){

try{

execSync("yt-dlp --version",{stdio:"ignore"})
console.log("yt-dlp already installed")

}catch{

console.log("Installing yt-dlp...")

try{
execSync("pip install yt-dlp",{stdio:"inherit"})
console.log("yt-dlp installed")
}catch{
console.log("Failed to install yt-dlp")
}

}

}

installYTDLP()

// ==============================
// Downloader API
// ==============================

app.get("/api/down",(req,res)=>{

const url = req.query.url

if(!url) return res.json({error:"missing url"})

exec(`yt-dlp -j "${url}"`,(err,stdout)=>{

if(err){
return res.json({
error:"download failed",
detail:err.message
})
}

try{

const data = JSON.parse(stdout)

res.json({
title:data.title,
duration:data.duration,
thumbnail:data.thumbnail,
video:data.url
})

}catch{

res.json({error:"parse error"})

}

})

})

app.listen(process.env.PORT || 3000,()=>{
console.log("DownAll API running")
})
  /*const express = require("express")
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
*_
