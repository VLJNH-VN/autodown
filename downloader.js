const { exec } = require("child_process")
const axios = require("axios")

// resolve short link
async function resolveUrl(url){
 try{
  const res = await axios.head(url,{
   maxRedirects:5,
   timeout:10000
  })
  return res.request.res.responseUrl || url
 }catch{
  return url
 }
}

// detect platform
function detectPlatform(url){

 if(url.includes("tiktok.com")) return "tiktok"
 if(url.includes("douyin.com")) return "douyin"
 if(url.includes("facebook.com") || url.includes("fb.watch")) return "facebook"
 if(url.includes("instagram.com")) return "instagram"
 if(url.includes("threads.net")) return "threads"
 if(url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
 if(url.includes("twitter.com") || url.includes("x.com")) return "twitter"
 if(url.includes("soundcloud.com")) return "soundcloud"

 return "generic"
}

// TikTok / Douyin API
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
   },
   {
    quality:"watermark",
    ext:"mp4",
    url:data.wmplay
   }
  ]
 }
}

// universal yt-dlp
function downloadYTDLP(url){

 return new Promise((resolve,reject)=>{

  exec(
   `yt-dlp -j --no-playlist --no-warnings --user-agent "Mozilla/5.0" "${url}"`,
  { maxBuffer: 1024 * 1024 * 20 },
  (err, stdout, stderr)=>{

   if(err){
    return reject(stderr || err.message)
   }

   try{

    const data = JSON.parse(stdout)

    const formats = data.formats
     .filter(v => v.url)
     .slice(0,15)
     .map(v => ({
      quality:v.format_note || v.height || "unknown",
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

   }catch(e){
    reject("parse failed")
   }

  })

 })
}

// main function
async function downloadVideo(url){

 const realUrl = await resolveUrl(url)

 const platform = detectPlatform(realUrl)

 if(platform === "tiktok" || platform === "douyin"){
  return await downloadTikTok(realUrl)
 }

 return await downloadYTDLP(realUrl)

}

module.exports = { downloadVideo }
