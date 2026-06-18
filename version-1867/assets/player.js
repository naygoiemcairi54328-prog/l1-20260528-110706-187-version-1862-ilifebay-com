import { H as Hls } from './hls.js';

export function startPlayer(source) {
  const box = document.getElementById('movie-player');
  if (!box) {
    return;
  }

  const video = box.querySelector('video');
  const trigger = box.querySelector('.play-trigger');
  const cover = box.querySelector('.player-cover');
  let hls = null;
  let loaded = false;

  function attachSource() {
    if (loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  async function play() {
    attachSource();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    try {
      await video.play();
    } catch (error) {
      if (cover) {
        cover.classList.remove('is-hidden');
      }
      video.setAttribute('controls', 'controls');
    }
  }

  if (trigger) {
    trigger.addEventListener('click', play);
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (!loaded || video.paused) {
      play();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
