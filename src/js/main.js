import './../scss/base.scss';
import createLightbox from './../../widok-lightbox';

createLightbox({
  wrap: '#lightbox',
  close: '#lightbox .lightbox-close',
  prev: '#lightbox .lightbox-prev',
  next: '#lightbox .lightbox-next',
  source: '.source',
  transition: 300,
});
