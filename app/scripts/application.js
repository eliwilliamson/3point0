$(function() {
  'use strict';

  if ($('body').hasClass('lifestream')) {
    var feed = new Instafeed({
      get: 'user',
      userId: 5426996,
      template: '<article class="col-md-3 instagram-image"><img src="{{image}}" alt="instagram picture"></article>',
      clientId: '6730b5366a4e4e918d903d3e9314cdf1',
      accessToken: '5426996.1677ed0.da901553a3c944dbbcdb1cb907171ef2',
      template: '<article class="col-md-3 instagram-image"><img src="{{image}}" alt="instagram picture"></article>',
      resolution: 'standard_resolution',
      limit: 32
    });
    return feed.run();
  }
});
