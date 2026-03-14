const axios = require("axios")
const qs = require("qs")

async function y2mate(url){

 const headers = {
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  "user-agent": "Mozilla/5.0"
 }

 // bước 1: phân tích video
 const analyze = await axios.post(
  "https://www.y2mate.com/mates/analyze/ajax",
  qs.stringify({
   url: url,
   q_auto: 0,
   ajax: 1
  }),
  { headers }
 )

 if(!analyze.data.result){
  throw new Error("analyze failed")
 }

 const html = analyze.data.result

 // lấy id video
 const id = html.match(/var k__id = "(.*?)"/)

 if(!id) throw new Error("cannot get id")

 const videoId = id[1]

 // bước 2: convert
 const convert = await axios.post(
  "https://www.y2mate.com/mates/convert",
  qs.stringify({
   type: "youtube",
   _id: videoId,
   v_id: url.split("v=")[1],
   ajax: "1",
   token: "",
   ftype: "mp4",
   fquality: "720"
  }),
  { headers }
 )

 return convert.data
}

module.exports = { y2mate }
