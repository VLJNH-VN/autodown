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

            if (!response.data || !response.data.data) {
                throw new Error("Không lấy được thông tin video!");
            }

            const videoData = response.data.data;

            return {
                url: videoData.url,
                source: videoData.source || "unknown",
                author: videoData.author || "unknown",
                title: videoData.title || "No Title",
                thumbnail: videoData.thumbnail || "",
                duration: videoData.duration || 0,
                medias: videoData.medias.map(media => ({
                    url: media.url,
                    quality: media.quality || "unknown",
                    extension: media.extension || "unknown",
                    type: media.type || "unknown",
                    duration: media.type === "audio" ? media.duration : undefined
                })),
                type: "multiple",
                error: false
            };
        } catch (error) {
            throw new Error(error.message || "Đã có lỗi xảy ra. Kiểm tra lại URL hoặc API của j2-down!");
        }
    }
}

module.exports = MediaDownloader;
