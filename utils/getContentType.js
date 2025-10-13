// This file is required by api/watch.js to determine the correct MIME type for streaming.

import mime from 'mime-types';
import path from 'path';

/**
 * Determines the MIME content type based on the file's extension.
 * @param {string} filename The name of the file.
 * @returns {string} The MIME type or 'application/octet-stream' if not found.
 */
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

