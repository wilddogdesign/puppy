// see https://www.npmjs.com/package/scroll-to-element
import scrollToElement from 'scroll-to-element';

export default function () {
  Array.from(document.querySelectorAll('.js-scroll-to')).forEach((link) => {
    // Setting defaults here (the same as the defaults on the plugin).
    // Seems easier to do this than to try and exclude include options based on their presence?
    // Please correct me if I'm wrong.
    const duration = link.dataset.duration
      ? parseInt(link.dataset.duration, 10)
      : 1000;
    const offset = link.dataset.offset ? parseInt(link.dataset.offset, 10) : 0;
    const align = link.dataset.align ? link.dataset.align : 'top';
    const ease = link.dataset.ease ? link.dataset.ease : 'out-circ';

    link.addEventListener('click', (ev) => {
      ev.preventDefault();

      scrollToElement(`#${link.href.split('#')[1]}`, {
        offset,
        ease,
        duration,
        align,
      });
    });
  });
}
