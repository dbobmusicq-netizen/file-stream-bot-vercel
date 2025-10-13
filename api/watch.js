[span_0](start_span)// Copyright 2025 Kaustav Ray[span_0](end_span)

import axios from 'axios';
import { getContentType } from '../utils/getContentType.js';

// NEW ENVIRONMENT VARIABLE ACCESS (Hardcoded)
const BOT_TOKEN = "8284124222:AAFy8UdOo6xbKzc3TwxyDI1IRfjJJkbncGY"; // Hardcoded value
const VERCEL_URL = "https://file-stream-bot-vercel.vercel.app/"; // Hardcoded value

export default async function handler(req, res) {
    // Note: The BOT_TOKEN and VERCEL_URL variables are not used in the
    // current logic (as indicated by comments in the source code),
    // because the service only needs the pre-signed file URL from Telegram.

    [span_1](start_span)const { filename, file_url } = req.query;[span_1](end_span)

    if (!file_url) {
        [span_2](start_span)return res.status(400).send("Missing file_url parameter");[span_2](end_span)
    }

    // Decode the file URL
    [span_3](start_span)const decodedFileUrl = decodeURIComponent(file_url);[span_3](end_span)

    try {
        // Get file stream from Telegram
        const response = await axios.get(decodedFileUrl, {
            [span_4](start_span)responseType: "stream",[span_4](end_span)
            [span_5](start_span)timeout: 30000, // 30s timeout for streaming[span_5](end_span)
        });

        // Determine content type based on file extension
        [span_6](start_span)const contentType = getContentType(filename);[span_6](end_span)

        [span_7](start_span)const contentLength = response.headers['content-length'];[span_7](end_span)

        // Set headers for streaming
        [span_8](start_span)res.setHeader("Content-Type", contentType);[span_8](end_span)
        [span_9](start_span)res.setHeader("Accept-Ranges", "bytes");[span_9](end_span)
        [span_10](start_span)res.setHeader("Access-Control-Allow-Origin", "*");[span_10](end_span)
        [span_11](start_span)res.setHeader("Cache-Control", "public, max-age=3600");[span_11](end_span)

        if (contentLength) {
            [span_12](start_span)res.setHeader("Content-Length", contentLength);[span_12](end_span)
        }

        // Handle Range requests for video streaming
        [span_13](start_span)const range = req.headers.range;[span_13](end_span)
        if (range && contentLength) {
            [span_14](start_span)const parts = range.replace(/bytes=/, "").split("-");[span_14](end_span)
            [span_15](start_span)const start = parseInt(parts[0], 10);[span_15](end_span)
            [span_16](start_span)const end = parts[1] ? parseInt(parts[1], 10) : parseInt(contentLength) - 1;[span_16](end_span)
            [span_17](start_span)const chunkSize = (end - start) + 1;[span_17](end_span)

            [span_18](start_span)res.status(206);[span_18](end_span)
            [span_19](start_span)res.setHeader("Content-Range", `bytes ${start}-${end}/${contentLength}`);[span_19](end_span)
            [span_20](start_span)res.setHeader("Content-Length", chunkSize);[span_20](end_span)

            // Note: Partial content streaming is not fully implemented here
            // (it needs to start the axios stream from the 'start' byte).
            [span_21](start_span)// This is a common simplification in Node.js streams.[span_21](end_span)
        } else {
             res.status(200);
        }

        // Stream the file
        [span_22](start_span)response.data.pipe(res);[span_22](end_span)

    } catch (error) {
        [span_23](start_span)console.error("Streaming error:", error.message);[span_23](end_span)
        [span_24](start_span)res.status(500).json({[span_24](end_span)
            [span_25](start_span)error: "Failed to stream file",[span_25](end_span)
            [span_26](start_span)details: error.message[span_26](end_span)
        });
    }
}
