// Copyright 2025 Kaustav Ray

import axios from 'axios';
import { getContentType } from '../utils/getContentType.js';

// NEW ENVIRONMENT VARIABLE ACCESS (Hardcoded)
const BOT_TOKEN = "6833588542:AAHfb-kNUmT9PVL9EMyqaKD9PjSFjAfgbrA"; // Hardcoded Telegram Bot Token
const VERCEL_URL = "https://file-stream-bot-vercel-one.vercel.app"; // Hardcoded Vercel URL

export default async function handler(req, res) {
    const { filename, file_url } = req.query;

    if (!file_url) {
        return res.status(400).send("Missing file_url parameter");
    }

    // Decode the file URL
    const decodedFileUrl = decodeURIComponent(file_url);

    try {
        // Get file stream from Telegram
        const response = await axios.get(decodedFileUhttps://file-stream-bot-vercel.vercel.app/rl, {
            responseType: "stream",
            timeout: 30000, // 30s timeout for streaming
        });

        // Determine content type based on file extension
        const contentType = getContentType(filename);

        const contentLength = response.headers['content-length'];

        // Set headers for streaming
        res.setHeader("Content-Type", contentType);
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=3600");

        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }

        // Handle Range requests for video streaming (206 Partial Content)
        const range = req.headers.range;
        if (range && contentLength) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : parseInt(contentLength) - 1;
            const chunkSize = (end - start) + 1;

            res.status(206);
            res.setHeader("Content-Range", `bytes ${start}-${end}/${contentLength}`);
            res.setHeader("Content-Length", chunkSize);
        } else {
             res.status(200);
        }

        // Stream the file
        response.data.pipe(res);

    } catch (error) {
        console.error("Streaming error:", error.message);
        res.status(500).json({
            error: "Failed to stream file",
            details: error.message
        });
    }
}

