import $ from 'cash-dom';
import widok from 'widok';

class Lightbox {
  constructor(options) {
    this.prepareOption(options);
    this.findSources();
    this.prepareLightbox();

    this.isShown = false;
  }

  prepareOption(options) {
    this.options = {
      wrap: undefined,
      source: '.lightbox-source',
      close: undefined,
      prev: undefined,
      next: undefined,
      transition: 0,
    };
    Object.assign(this.options, options);
  }

  findSources() {
    this.sources = [];
    $(this.options.source).each((id, element) =>
      this.sources.push(new Source(element, id, this))
    );

    if (this.sources.length <= 1) {
      if (this.options.prev !== undefined) {
        $(this.options.prev).addClass('disabled');
      }
      if (this.options.next !== undefined) {
        $(this.options.next).addClass('disabled');
      }
    }
  }

  prepareLightbox() {
    if (this.options.wrap === undefined) {
      this.wrap = $('<div class="lightbox-wrap"></div>').appendTo('body');
    } else this.wrap = $(this.options.wrap);
    this.wrap.on('click', () => this.hide());

    this.sizer = $('<div class="lightbox-sizer"></div>').appendTo(this.wrap);
    this.image = $('<img class="lightbox-image">')
      .appendTo(this.sizer)
      .on('click', event => event.stopPropagation());

    // find ratio of the image if it was not set
    this.image.on('load', () => {
      if (this.sources[this.currentImage].ratio !== undefined) return;
      this.image.css({
        width: 'auto',
        height: 'auto',
      });
      this.sources[this.currentImage].ratio = this.image.width() / this.image.height();
      this.resize();

    });

    if (this.options.close !== undefined) {
      this.close = $(this.options.close).on('click', () => this.hide());
    }

    if (this.options.prev !== undefined) {
      $(this.options.prev).on('click', event => {
        event.stopPropagation();
        this.prev();
      });
    }

    if (this.options.next !== undefined) {
      $(this.options.next).on('click', event => {
        event.stopPropagation();
        this.next();
      });
    }
  }

  prev() {
    this.show(
      this.sources[
      (this.currentImage - 1 + this.sources.length) % this.sources.length
      ]
    );
  }

  next() {
    this.show(this.sources[(this.currentImage + 1) % this.sources.length]);
  }

  show(source) {
    if (!this.isShown) {
      this.wrap.addClass('shown');
      this.isShown = true;
    }
    if (this.options.transition) this.wrap.addClass('transition');

    setTimeout(() => {
      if (this.options.transition) {
        this.image.on('load', () => {
          this.wrap.removeClass('transition');
        });
      }
      this.image.attr({
        src: source.url,
      });
      this.currentImage = source.id;
      this.resize();
    }, this.options.transition);
  }

  hide() {
    if (this.isShown) {
      this.wrap.removeClass('shown');
      this.isShown = false;
    }
  }

  resize() {
    if (this.isShown) {
      const ratio = this.sources[this.currentImage].ratio;
      if (ratio > widok.w / widok.h) {
        this.image.css({
          width: '100%',
          height: (widok.w / widok.h / ratio) * 100 + '%',
        });
      } else {
        this.image.css({
          width: (ratio / widok.w) * widok.h * 100 + '%',
          height: '100%',
        });
      }
    }
  }
}

class Source {
  constructor(element, id, lightbox) {
    this.element = $(element);
    this.id = id;
    this.lightbox = lightbox;

    this.url = this.element.data('full-src');
    this.ratio = this.element.data('ratio');

    this.element.on('click', () => {
      this.lightbox.show(this);
    });
  }
}

const lightboxes = [];

window.addEventListener('afterLayoutChange', () => {
  lightboxes.forEach(lightbox => lightbox.resize());
});

window.addEventListener('keyup', event => {
  if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
    lightboxes.forEach(lightbox => {
      if (lightbox.isShown) {
        if (event.code === 'ArrowLeft') {
          lightbox.prev();
        }
        if (event.code === 'ArrowRight') {
          lightbox.next();
        }
      }
    });
  }
});

function createLightbox(options) {
  const lightbox = new Lightbox(options);
  lightboxes.push(lightbox);
  return lightbox;
}

export default createLightbox;
