export default function handler (req, res) {
    res.status(200).json({
        [span_33](start_span)message: "Telegram File Streaming Service.",[span_33](end_span)
        [span_34](start_span)version: "1.0.0",[span_34](end_span)
        [span_35](start_span)endpoints: {[span_35](end_span)
            [span_36](start_span)streaming: "/watch/{filename}?file_url={encoded_telegram_url}",[span_36](end_span)
            [span_37](start_span)download: "/download/{filename}?file_url={encoded_telegram_url}"[span_37](end_span)
        },
        [span_38](start_span)status: "Active"[span_38](end_span)
    });
}
