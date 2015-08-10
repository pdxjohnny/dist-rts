var game = function game() {
  this.all = {};
  this.front = {};
  this.middle = {};
  this.back = {};
  this.updates = {};
  this.running = false;
  this.then = Date.now();
  return this;
}

game.prototype.api_setup = function () {
  api.startsender();
  api.Update = function (data) {
    this.all[data["Id"]].stats = data;
  }.bind(this);
}

game.prototype.set_canvas = function (canvas_div_id) {
  this.canvas_div = document.getElementById(canvas_div_id);
  if (this.canvas_div) {
    this.ctx = this.canvas_div.getContext("2d");
  }
}

game.prototype.full_screen = function () {
  if (this.canvas_div) {
    this.canvas_div.style.position = 'absolute';
    this.canvas_div.style.top = '0px';
    this.canvas_div.style.left = '0px';
    this.canvas_div.width = window.innerWidth;
    this.canvas_div.height = window.innerHeight;
  }
}

game.prototype.reset_size = function () {
  this.canvas_div.style.position = 'relative';
  this.canvas_div.width = this.canvas_div.parentElement.width;
  this.canvas_div.height = this.canvas_div.parentElement.height;
}

game.prototype.update = function (modifier) {
  for (var i in this.updates) {
    if (typeof this.updates[i] === 'function') {
      this.updates[i](this);
    }
  }
  for (var i in this.back) {
    if (typeof this.back[i].update === 'function') {
      this.back[i].update(modifier);
    }
  }
  for (var i in this.middle) {
    if (typeof this.middle[i].update === 'function') {
      this.middle[i].update(modifier);
    }
  }
  for (var i in this.front) {
    if (typeof this.front[i].update === 'function') {
      this.front[i].update(modifier);
    }
  }
}

game.prototype.draw = function () {
  if (this.canvas_div) {
    this.ctx.clear(this.canvas_div);
    for (var i in this.back) {
      if (this.should_draw(this.back[i])) {
        this.back[i].draw(this.ctx);
      }
    }
    for (var i in this.middle) {
      if (this.should_draw(this.middle[i])) {
        this.middle[i].draw(this.ctx);
      }
    }
    for (var i in this.front) {
      if (this.should_draw(this.front[i])) {
        this.front[i].draw(this.ctx);
      }
    }
  }
}

game.prototype.should_draw = function (object) {
  if (typeof object.draw === 'function') {
    if (typeof object.x === 'undefined' &&
      typeof object.y === 'undefined') {
      return true;
    } else if (typeof object.x !== 'undefined' &&
      typeof object.y !== 'undefined' &&
      object.x > 0 &&
      object.x < this.canvas_div.width &&
      object.y > 0 &&
      object.y < this.canvas_div.height) {
      return true;
    }
  }
  return false;
}

game.prototype.start = function () {
  this.running = true;
  this.main();
}

game.prototype.stop = function () {
  this.running = false;
}

game.prototype.main = function () {
  if (this.running) {
    var now = Date.now();
    var delta = now - this.then;
    var modifier = delta / 1000;
    this.update(modifier);
    this.draw();
    this.then = Date.now();
    this.requestAnimationFrame(this.main.bind(this));
  }
}

game.prototype.requestAnimationFrame = function requestAnimationFrame(call_this) {
  this.requestAnimationFrame = (window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) ||
    (window.webkitRequestAnimationFrame && window.webkitRequestAnimationFrame.bind(window)) ||
    (window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window)) ||
    (window.mozRequestAnimationFrame && window.mozRequestAnimationFrame.bind(window)) ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  this.requestAnimationFrame(call_this);
}
