const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const port = 7474;

app.get('/download', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL not provided.');
    }

    const youtubeBaseURL = 'https://youtube.com/watch?v=';
    if (!url.startsWith('http')) {
        url = youtubeBaseURL + url;
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        const stream = ytdl(url, { quality: 'highestaudio' });

        ffmpeg(stream).audioBitrate(128).toFormat('mp3').pipe(res, { end: true });

    } catch (error) {
        res.status(500).send('Error downloading the video');
    }
})

app.listen(port, () => {
    console.log('running!')
})