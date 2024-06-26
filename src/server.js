const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 7474;
app.use(cors());

app.get('/download', async (req, res) => {
    let url = req.query.url;

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
        const stream = ytdl(url, { quality: 'highestaudio' });
        
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition'); 
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        ffmpeg(stream).audioBitrate(128).toFormat('mp3').pipe(res, { end: true });

    } catch (error) {
        res.status(500).send(`Error downloading the audio, ${error}`);
    }
})

app.listen(port, () => {
    console.log('running!')
})