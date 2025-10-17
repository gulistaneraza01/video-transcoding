import ffmpeg from "fluent-ffmpeg";
import resolutions from "./resolutions.js";
import path from "node:path";
import fs from "node:fs";

async function transcode(videoPath, hslPath) {
  console.log("Video Transcoding Strated");

  try {
    fs.mkdirSync(hslPath, { recursive: true });

    for (const res of resolutions) {
      const folder = path.join(hslPath, res.name);
      console.log({ folder });
      fs.mkdirSync(folder, { recursive: true });

      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .outputOptions([
            "-profile:v baseline",
            "-level 3.0",
            `-vf scale=w=${res.width}:h=${res.height}:force_original_aspect_ratio=decrease`,
            `-b:v ${res.bitrate}`,
            `-c:v libx264`,
            "-c:a aac",
            `-b:a ${res.audioBitrate}`,
            "-hls_time 10",
            "-hls_playlist_type vod",
            `-hls_segment_filename ${folder}/segment_%03d.ts`,
            `-vf scale=w=${res.width}:h=${res.height}:force_original_aspect_ratio=decrease:eval=frame,scale=trunc(iw/2)*2:trunc(ih/2)*2`,
          ])
          .output(`${folder}/${res.name}.m3u8`)
          .on("start", (cmd) => console.log(`[${res.name}] Started:`, cmd))
          .on("progress", (p) =>
            console.log(`[${res.name}] ${p.percent?.toFixed(2)}%`)
          )
          .on("end", () => {
            console.log(`[${res.name}] ✅ Transcode complete`);
            resolve();
          })
          .on("error", (err) => reject(err))
          .run();
      });
    }
  } catch (error) {
    console.log("❌", error.message);
  }
}

export default transcode;
