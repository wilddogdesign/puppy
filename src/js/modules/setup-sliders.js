import Glide from '@glidejs/glide';

/**
 * Initialise Glide sliders
 *
 * @export
 */
export function setupSliders() {
  Array.from(document.querySelectorAll('.js-slider')).forEach((slider) => {
    const autoplay = slider.dataset.autoplay
      ? parseInt(slider.dataset.autoplay, 10)
      : false;
    const tabletSlides = slider.dataset.tabletSlides
      ? parseInt(slider.dataset.tabletSlides, 10)
      : 1;

    const initialisedSlider = new Glide(slider, {
      gap: 0,
      autoplay: autoplay,
      perView: tabletSlides,
      breakpoints: {
        767: { perView: 1 },
      },
    });

    setTimeout(() => {
      initialisedSlider.mount();
    }, 200);
  });
}

export default { setupSliders };
