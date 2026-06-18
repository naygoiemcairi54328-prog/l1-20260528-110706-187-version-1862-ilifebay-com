
import { H as Hls } from './hls-vendor-dru42ct7.js';

function initPlayers() {
  const videos = document.querySelectorAll('video[data-m3u8]');
  videos.forEach((video) => {
    const url = video.dataset.m3u8;
    if (!url) return;
    const attach = () => {
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.dataset.ready = 'true';
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error('HLS error:', data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      }
    };
    attach();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlayers);
} else {
  initPlayers();
}
