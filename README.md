

### **📌 Media Downloader - Hướng Dẫn Sử Dụng**  

**Media Downloader** là một package **Node.js** giúp lấy thông tin video, audio và các liên kết tải xuống từ nhiều nền tảng như **TikTok, YouTube, Facebook, Twitter, v.v.** (dựa trên API `j2-down.onrender.com`).  

---

## **📥 Cài Đặt**
Cài đặt package bằng npm:  
```bash
npm install media-downloader
```

---

## **🚀 Cách Sử Dụng**
### **1️⃣ Import và Khởi Tạo**
Trong file **Node.js**, bạn có thể sử dụng package như sau:  

```javascript
const MediaDownloader = require('media-downloader');

// Khởi tạo downloader (có thể truyền URL API tùy chỉnh nếu cần)
const downloader = new MediaDownloader();
```

---

### **2️⃣ Lấy Thông Tin Video**
```javascript
async function getVideoInfo() {
    try {
        const data = await downloader.fetchMediaInfo("https://www.tiktok.com/@yeuphimzz/video/7237370304337628442");
        console.log(data);
    } catch (error) {
        console.error(error.message);
    }
}

getVideoInfo();
```
📌 **Kết Quả Trả Về (Ví Dụ)**
```json
{
  "url": "https://www.tiktok.com/@yeuphimzz/video/7237370304337628442",
  "source": "tiktok",
  "author": "yeuphimzz",
  "title": "Shin godzilla #movie #yeuphimzz",
  "thumbnail": "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-p-0037-aiso/... .webp",
  "duration": 88,
  "medias": [
    {
      "url": "https://v39e-as.tiktokcdn.com/8a886f884a36e6a2cd43... .mp4",
      "quality": "hd_no_watermark",
      "extension": "mp4",
      "type": "video"
    },
    {
      "url": "https://sf16-ies-music.tiktokcdn.com/obj/ies-music-aiso/72373706... .mp3",
      "duration": 88,
      "quality": "audio",
      "extension": "mp3",
      "type": "audio"
    }
  ],
  "type": "multiple",
  "error": false
}
```

---

### **3️⃣ Tích Hợp API Express**
Bạn có thể tạo một API để tải video bằng cách kết hợp với **Express.js**:

📌 **Tạo file `server.js`**
```javascript
const express = require('express');
const MediaDownloader = require('media-downloader');

const app = express();
const port = 3000;
const downloader = new MediaDownloader();

app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, message: 'Bạn cần nhập URL video!' });
    }

    try {
        const data = await downloader.fetchMediaInfo(url);
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
```

📌 **Chạy Server**
```bash
node server.js
```
Bây giờ bạn có thể truy cập API tại:  
`http://localhost:3000/download?url=VIDEO_URL`

Ví dụ:  
```bash
http://localhost:3000/download?url=https://www.tiktok.com/@yeuphimzz/video/7237370304337628442
```

---

## **📌 Các Tính Năng Chính**
✅ **Hỗ trợ nhiều nền tảng** (TikTok, YouTube, Facebook, Twitter, v.v.)  
✅ **Trả về danh sách link tải có chất lượng khác nhau** (HD, watermark, audio-only, v.v.)  
✅ **Tích hợp dễ dàng với Express để tạo API**  
✅ **Xử lý lỗi và kiểm tra dữ liệu tự động**  

---

## **🔄 Cập Nhật Phiên Bản**
Khi có bản cập nhật mới, bạn có thể nâng cấp bằng lệnh:
```bash
npm update media-downloader
```

---

## **📜 Giấy Phép**
MIT License - **Miễn phí sử dụng và tùy chỉnh.**  

---

### **📞 Liên Hệ & Đóng Góp**
Nếu bạn muốn đóng góp hoặc báo lỗi, vui lòng mở issue trên GitHub hoặc liên hệ qua email! 🚀
