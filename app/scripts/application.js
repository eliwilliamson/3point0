// instagram feed
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


// cta particles

(function() {

  if (document.getElementById("particles")) {
    var Particle;

    window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      return window.setTimeout(function() {
        return callback(+new Date());
      }, 1000 / 60);
    });

    window.onmousemove = function(e) {
      return this.mouse = {
        x: e.x * this.pixelDensity,
        y: e.y * this.pixelDensity
      };
    };

    Particle = (function() {
      function Particle() {
        var velocityMax;
        velocityMax = 0.4;
        this.x = ~~(Math.random() * width);
        this.y = ~~(Math.random() * height);
        this.xVel = velocityMax * Math.random() * (~~(Math.random() * 2) ? -1 : 1);
        this.yVel = velocityMax * Math.random() * (~~(Math.random() * 2) ? -1 : 1);
        this.radius = 2.5 * window.pixelDensity;
      }

      Particle.prototype.tick = function() {
        if (this.x + this.xVel <= 0 || this.x + this.xVel >= window.width) {
          this.xVel *= -0.8;
        }
        if (this.y + this.yVel <= 0 || this.y + this.yVel >= window.height) {
          this.yVel *= -0.8;
        }
        this.x += this.xVel;
        this.y += this.yVel;
        return this;
      };

      Particle.prototype.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 6.283185307179586, 0);
        ctx.fill();
        ctx.closePath();
        return this;
      };

      return Particle;

    })();

    window.onload = function() {
      var clock, connectNearParticles, ctx, drawParticles, elm, particles, pixelDensity, run, tick, xOffset, yOffset;
      ctx = void 0;
      elm = void 0;
      pixelDensity = void 0;
      clock = 0;
      xOffset = 100;
      yOffset = 100;
      divHeight = document.getElementById("particles").clientHeight;
      particles = [];
      run = function() {
        var height, i, width, _i;
        elm = document.createElement('canvas');
        this.pixelDensity = pixelDensity = window.devicePixelRatio || 1;
        this.width = width = window.innerWidth * this.pixelDensity;
        this.height = height = divHeight * this.pixelDensity;
        elm.style.width = width / this.pixelDensity + "px";
        elm.style.height = height / this.pixelDensity + "px";
        xOffset = width * pixelDensity / 2;
        elm.setAttribute('width', width);
        elm.setAttribute('height', height);
        ctx = elm.getContext('2d');
        ctx.lineWidth = 1;
        document.getElementById("particles").appendChild(elm);
        for (i = _i = 0; _i <= 100; i = ++_i) {
          particles.push(new Particle);
        }
        return tick();
      };
      drawParticles = function() {
        var i, _i, _ref, _results;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        _results = [];
        for (i = _i = 0, _ref = particles.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(particles[i].draw(ctx).tick());
        }
        return _results;
      };
      connectNearParticles = function() {
        var i, j, _i, _ref, _results;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        _results = [];
        for (i = _i = 0, _ref = particles.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (j = _j = 0, _ref1 = particles.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
              if (particles[i] !== particles[j]) {
                if (Math.abs(particles[i].x - particles[j].x) < 120 && Math.abs(particles[i].y - particles[j].y) < 200) {
                  ctx.beginPath();
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(particles[j].x, particles[j].y);
                  ctx.stroke();
                  _results1.push(ctx.closePath());
                } else {
                  _results1.push(void 0);
                }
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        }
        return _results;
      };
      tick = function() {
        ctx.clearRect(0, 0, width * pixelDensity, height * pixelDensity);
        drawParticles();
        connectNearParticles();
        return requestAnimationFrame(tick);
      };
      return run();
    };
  }
}).call(this);
