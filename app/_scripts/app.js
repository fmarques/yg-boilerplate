var app = {
  debug: true,
  root: $('#app-root'),
  mq: { // in em
    onepx_em: 0.0625,
    xs: 20,  // 320px
    sm: 48,  // 768px
    md: 64,  // 1024px
    lg: 75,  // 1200px
    xl: 90,  // 1440px
    xxl: 120 // 1920px
  },
  init: function() {
    app.log('--- APP - init ---');
    var isRetina = app.isRetina();
    if ( isRetina ) {
      app.root.attr('data-retina', true)
    }
    app.resize.init();
    app.scroll.init();
  },
  log: function(what)   { if(app.debug) { console.log(what); } },
  exists: function(el)  { if($(el).length > 0) { return true; } },
  matchMedia: function(media) { return window.matchMedia(media).matches; },
  winWidthEM: function(winW) { return winW / parseFloat($('body').css('font-size')); },
  viewPortW: function () {
    return document.documentElement.clientWidth < window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
  },
  viewPortH: function () {
    return document.documentElement.clientHeight < window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
  },
  isRetina: function() {
    if (window.matchMedia) {
      var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
      return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  },
  detectOrientation: function() {
    return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
  }
} || {};

;(function ($, window, undefined) {
  'use strict';

  $(document).ready(function() {
    app.init();
  });

})(jQuery, this);
