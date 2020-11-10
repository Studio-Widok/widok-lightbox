import './../scss/base.scss';
const createLightbox = require('./../../widok-lightbox');

createLightbox({
  wrap: '#lightbox',
  close: '#lightbox .lightbox-close',
  prev: '#lightbox .lightbox-prev',
  next: '#lightbox .lightbox-next',
  source: '.source',
  transition: 300,
});
