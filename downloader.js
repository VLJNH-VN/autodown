const { exec } = require("child_process")
const axios = require("axios")

// resolve short link
async function resolveUrl(url){
 try{
  const res = await axios.head(url, { maxRedirects: 5 })
  return res.request.res.responseUrl || url
 }catch{
  return url
 }
}

// detect tiktok
function isTikTok(url){
 return url.includes("tiktok.com")
}

// tiktok downloader
async function downloadTikTok(url){

 const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`

 const res = await axios.get(api)

 if(!res.data || !res.data.data){
  throw new Error("TikTok download failed")
 }

 const data = res.data.data

 return {
  platform:"tiktok",
  title:data.title,
  thumbnail:data.cover,
  duration:data.duration,
  formats:[
   {
    quality:"no-watermark",
    ext:"mp4",
    url:data.play
   }
  ]
 }
}

// yt-dlp downloader
function downloadYTDLP(url){

 return new Promise((resolve,reject)=>{

  exec(`yt-dlp -j --no-playlist --user-agent "Mozilla/5.0" "${url}"`,
  (err, stdout, stderr)=>{

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
    platform:data.extractor,
    title:data.title,
    thumbnail:data.thumbnail,
    duration:data.duration,
    formats
   })

  })

 })
}

// main function
async function downloadVideo(url){

 const realUrl = await resolveUrl(url)

 if(isTikTok(realUrl)){
  return await downloadTikTok(realUrl)
 }

 return await downloadYTDLP(realUrl)

}

module.exports = { downloadVideo }
