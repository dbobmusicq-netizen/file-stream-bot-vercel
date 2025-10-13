// file-stream-bot-vercel/utils/getContentType.js

import mime from 'mime-types'; [span_39](start_span)// Dependency from package.json[span_39](end_span)
import path from 'path';

export function getContentType(filename) {
    if (!filename) {
        return 'application/octet-stream';
    }
    
    // Get file extension
    const extension = path.extname(filename).toLowerCase();

    // Look up mime type
    const mimeType = mime.lookup(extension);

    // Return mime type or a default if not found
    return mimeType || 'application/octet-stream';
}
