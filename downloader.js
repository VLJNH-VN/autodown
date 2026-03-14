const { exec } = require("child_process")

function downloadVideo(url){
 return new Promise((resolve,reject)=>{

  exec(`yt-dlp -j "${url}"`, (err, stdout, stderr)=>{

   if(err){
     console.log(stderr)
     return reject(stderr)
   }

   const data = JSON.parse(stdout)

   const formats = data.formats
   .filter(v => v.url)
   .slice(0,10)
   .map(v => ({
     quality: v.format_note || v.height,
     ext: v.ext,
     url: v.url
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
