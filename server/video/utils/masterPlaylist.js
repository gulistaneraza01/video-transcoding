import resolutions from "./resolutions.js";
import fs from "node:fs";

async function masterPlaylist(hslPath) {
  try {
    const masterPath = `${hslPath}/master.m3u8`;
    let masterContent = "#EXTM3U\n#EXT-X-VERSION:3\n";

    for (const res of resolutions) {
      const videoBps = parseInt(res.bitrate) * 1000;
      const audioBps = parseInt(res.audioBitrate) * 1000;
      const bandwidth = videoBps + audioBps;
      masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${res.width}x${res.height}\n${res.name}/${res.name}.m3u8\n`;
    }

    fs.writeFileSync(masterPath, masterContent);
    console.log("✅Master playlist created");
  } catch (error) {
    console.log("❌", error.message);
  }
}

export default masterPlaylist;
