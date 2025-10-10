FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y curl ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

CMD ["bash"]


# ffmpeg -i input.mp4 -vf "scale=w=640:h=360:force_original_aspect_ratio=decrease" -c:v libx264 -preset fast -b:v 800k -maxrate 856k -bufsize 1200k -c:a aac -b:a 96k -hls_time 10 -hls_playlist_type vod -hls_segment_filename "hls/360p/segment%03d.ts" -start_number 0 hls/360p/360.m3u8 && ffmpeg -i input.mp4 -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" -c:v libx264 -preset fast -b:v 2800k -maxrate 2996k -bufsize 4200k -c:a aac -b:a 128k -hls_time 10 -hls_playlist_type vod -hls_segment_filename "hls/720p/segment%03d.ts" -start_number 0 hls/720p/720.m3u8 && ffmpeg -i input.mp4 -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease" -c:v libx264 -preset fast -b:v 5000k -maxrate 5350k -bufsize 7500k -c:a aac -b:a 192k -hls_time 10 -hls_playlist_type vod -hls_segment_filename "hls/1080p/segment%03d.ts" -start_number 0 hls/1080p/1080.m3u8 && echo -e '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n360p/360.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n720p/720.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n1080p/1080.m3u8' > hls/master.m3u8
