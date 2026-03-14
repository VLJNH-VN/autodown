const express = require("express")
const { downloadVideo } = require("./downloader")

const app = express()

app.get("/", (req,res)=>{
 res.json({status:"DOWNALL API RUNNING"})
})

app.get("/api", async (req,res)=>{

 const url = req.query.url
 if(!url) return res.json({error:"missing url"})

 try{

  const data = await downloadVideo(url)
  res.json(data)

 }catch(e){

  res.json({error:"download failed"})

 }

})

app.listen(process.env.PORT || 3000)
