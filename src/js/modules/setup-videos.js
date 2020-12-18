import Player from '@vimeo/player';
import throttle from 'lodash.throttle';
import { elementIsVisible } from './utils';

export default function setupVideos() {
  Array.from(document.querySelectorAll('.js-video')).forEach((video) => {
    const player = new Player(video, {
      muted: true,
    });

    const isHero = video.classList.contains('js-hero-video');

    let isPlaying = false;

    player.on('play', () => {
      isPlaying = true;
    });

    player.on('pause', () => {
      isPlaying = false;
    });

    const forcePlayHero = throttle(() => {
      if (!isPlaying && window.scrollY < window.innerHeight) {
        player.play();
      }
    }, 1000);

    function triggerVideo() {
      if (elementIsVisible(video)) {
        if (!isPlaying) {
          player.play();
        }
      } else if (isPlaying) {
        player.pause();
      }

      if (isHero) {
        forcePlayHero();
      }
    }

    window.addEventListener('scroll', throttle(triggerVideo, 200));
  });
}
