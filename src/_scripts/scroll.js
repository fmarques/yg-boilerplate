app.scroll = {
  init: function() {
    app.log('--- APP - scroll - init ---');
    var $win = $(window),
        winH = $win.height();

    $win.scroll(function () {
      app.scroll.scroll( $(this) );
    });
  },
  scroll: function(e) {
    var posTop = e.scrollTop();
    app.log(posTop);
  },
  scrollTo: function ($elm) {
    app.log('--- APP - scroll - scrollTo --- ');
    var headerH = $('.app-header').height(),
        elmPos;
    elmPos = $elm.offset().top - (headerH + 105);

    $('html, body').animate({
      scrollTop: elmPos
    }, 1200);
  }
};
