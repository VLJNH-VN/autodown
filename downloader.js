const { exec } = require("child_process")
const axios = require("axios")

async function resolveUrl(url){
 try{
  const res = await axios.head(url, { maxRedirects: 5 })
  return res.request.res.responseUrl || url
 }catch{
  return url
 }
}

async function downloadVideo(url){

 const realUrl = await resolveUrl(url)

 return new Promise((resolve,reject)=>{

  exec(`yt-dlp -j --no-playlist "${realUrl}"`, (err, stdout, stderr)=>{

   if(err) return reject(stderr)

   const data = JSON.parse(stdout)

   const formats = data.formats
   .filter(v => v.url)
   .slice(0,10)
   .map(v => ({
     quality:v.format_note || v.height,
     ext:v.ext,
     url:v.url
   }))

   resolve({
    title:data.title,
    thumbnail:data.thumbnail,
    duration:data.duration,
    formats
   })

  })

 })
}

module.exports = { downloadVideo }
