import axios from 'axios';
// BOT_TOKEN and VERCEL_URL are not used directly in this file's logic

export default async function handler(req, res) {
    try {
        const { filename, file_url } = req.query;

        if (!file_url) {
            return res.status(400).json({ error: "Missing file_url parameter" });
        }

        // Decode the file URL
        const decodedFileUrl = decodeURIComponent(file_url);

        // Get file from Telegram
        const response = await axios.get(decodedFileUrl, {
            responseType: 'stream',
            [span_27](start_span)timeout: 50000, // Longer timeout for downloads[span_27](end_span)
        });

        // Set headers for download
        const sanitizedFilename = filename ? filename.replace(/[^\w\s\.\-]/g, '') : 'download'; // Basic sanitation
        
        [span_28](start_span)res.setHeader("Content-Type", "application/octet-stream");[span_28](end_span)
        [span_29](start_span)res.setHeader("Content-Disposition", `attachment; filename="${sanitizedFilename}"`);[span_29](end_span)
        [span_30](start_span)res.setHeader("Access-Control-Allow-Origin", "*");[span_30](end_span)
        [span_31](start_span)res.setHeader("Cache-Control", "no-cache");[span_31](end_span)

        // Set Content-Length header
        if (response.headers['content-length']) {
            [span_32](start_span)res.setHeader("Content-Length", response.headers['content-length']);[span_32](end_span)
        }

        // Stream the file for download
        response.data.pipe(res);

    } catch (error) {
        console.error("Download error:", error.message);
        res.status(500).json({
            error: "Failed to download file",
            details: error.message
        });
    }
}
