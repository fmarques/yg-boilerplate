app.resize = {
  init: function() {
    app.log('--- APP - resize - init ---');

    $(window).resize(function () {
      app.resize.setOrientation();
      app.resize.setMediaQueries();
    }).resize();
  },
  setMediaQueries: function() {
    app.log('--- APP - resize - setMediaQueries ---');
    var mq,
        $root = app.root,
        $rootMq = $root.attr('data-mq'),
        xs_max = app.mq.sm-app.mq.onepx_em,
        sm_max = app.mq.md-app.mq.onepx_em,
        md_max = app.mq.lg-app.mq.onepx_em,
        lg_max = app.mq.xl-app.mq.onepx_em;
        xl_max = app.mq.xxl-app.mq.onepx_em;

    if (app.matchMedia('(max-width: '+xs_max+'em)')) {
      mq = 'xs';
    }
    else if (app.matchMedia('(max-width: '+sm_max+'em)')) {
      mq = 'sm';
    }
    else if (app.matchMedia('(max-width: '+md_max+'em)')) {
      mq = 'md';
    }
    else if (app.matchMedia('(max-width: '+lg_max+'em)')) {
      mq = 'lg';
    }
    else if (app.matchMedia('(max-width: '+xl_max+'em)')) {
      mq = 'xl';
    }
    else {
      mq = 'xxl';
    }
    $root.attr('data-mq', mq);

  },
  setOrientation: function() {
    app.log('--- APP - resize - setOrientation ---');
    var $root = app.root,
        orientation = app.detectOrientation();
    $root.attr('data-orientation', orientation);
  }
};
