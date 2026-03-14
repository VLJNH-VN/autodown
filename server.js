const express = require("express")
const { y2mate } = require("./downloader")

const app = express()

app.get("/api", async (req,res)=>{

 const url = req.query.url

 if(!url){
  return res.json({error:"missing url"})
 }

 try{

  const data = await y2mate(url)

  res.json({
   status:true,
   data
  })

 }catch(e){

  res.json({
   error:"download failed"
  })

 }

})

app.listen(3000,()=>{
 console.log("API running")
})
