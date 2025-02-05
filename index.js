/*const axios = require('axios');

class MediaDownloader {
  constructor(apiBaseUrl = "https://j2-down.onrender.com/media/url") {
    this.apiBaseUrl = apiBaseUrl;
  }

  async fetchMediaInfo(url) {
    if (!url) {
      throw new Error("Bạn cần nhập URL video!");
    }

    try {
      const response = await axios.get(`${this.apiBaseUrl}?url=${encodeURIComponent(url)}`);
      
      // Nếu API trả về dữ liệu dạng { data: { ... } } thì dùng response.data.data,
      // ngược lại nếu trả về trực tiếp object mẫu thì dùng response.data.
      const data = response.data.data || response.data;

      if (!data || !data.url) {
        throw new Error("Không lấy được thông tin video!");
      }

      return {
        url: data.url,
        source: data.source || "unknown",
        author: data.author || "unknown",
        title: data.title || "No Title",
        thumbnail: data.thumbnail || "",
        duration: data.duration || 0,
        medias: Array.isArray(data.medias)
          ? data.medias.map(media => ({
              url: media.url,
              quality: media.quality || "unknown",
              extension: media.extension || "unknown",
              type: media.type || "unknown",
              // Chỉ thêm duration nếu media là audio
              duration: media.type === "audio" ? media.duration : undefined
            }))
          : [],
        type: data.type || "multiple",
        error: data.error || false
      };

    } catch (error) {
      throw new Error(error.message || "Đã có lỗi xảy ra. Kiểm tra lại URL hoặc API của j2-down!");
    }
  }
}

module.exports = MediaDownloader;*/
const axios = require('axios');

class MediaDownloader {
  constructor(apiBaseUrl = "https://j2-down.onrender.com/media/url") {
    this.apiBaseUrl = apiBaseUrl;
  }

  async fetchMediaInfo(url) {
    if (!url) {
      throw new Error("Bạn cần nhập URL video!");
    }

    try {
      const response = await axios.get(`${this.apiBaseUrl}?url=${encodeURIComponent(url)}`);
      const data = response.data.data || response.data;

      if (!data || !data.url) {
        throw new Error("Không lấy được thông tin video!");
      }

      // Lấy danh sách video và kiểm tra tốc độ tải
      const mediaList = await Promise.all(
        data.medias.map(async (media) => {
          if (media.type === "video") {
            const speed = await this.measureDownloadSpeed(media.url);
            return { ...media, downloadSpeed: speed };
          }
          return media;
        })
      );

      return {
        url: data.url,
        source: data.source || "unknown",
        author: data.author || "unknown",
        title: data.title || "No Title",
        thumbnail: data.thumbnail || "",
        duration: data.duration || 0,
        medias: mediaList,
        type: data.type || "multiple",
        error: data.error || false
      };

    } catch (error) {
      throw new Error(error.message || "Đã có lỗi xảy ra. Kiểm tra lại URL hoặc API của j2-down!");
    }
  }

  async measureDownloadSpeed(fileUrl) {
    try {
      const startTime = Date.now();
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const endTime = Date.now();

      const fileSizeInBytes = response.data.length;
      const timeTakenInSeconds = (endTime - startTime) / 1000;
      const speedInKbps = (fileSizeInBytes * 8) / 1024 / timeTakenInSeconds;
      const speedInMbps = speedInKbps / 1024;

      return `${speedInMbps.toFixed(2)} Mbps`;
    } catch (error) {
      return "Không đo được";
    }
  }
}

module.exports = MediaDownloader;

