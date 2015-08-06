var star_field = function star_field(game) {
  this.game = game;
  this.create();
}

star_field.prototype.create = function () {
  this.stars = [];
  for (var n = 0; n < this.game.canvas_div.width / 10; ++n) {
    this.stars.push({
      x: parseInt(Math.random() * this.game.canvas_div.width),
      y: parseInt(Math.random() * this.game.canvas_div.height),
      blink_rate: Math.random() * 3,
      max_radius: Math.random() * 5,
      radius: Math.random() * 3,
      increasing: Math.round(Math.random()),
      color: this.random_color()
    });
  }
}

star_field.prototype.draw = function (ctx) {
  for (var star in this.stars) {
    ctx.beginPath();
    ctx.arc(this.stars[star].x, this.stars[star].y,
      this.stars[star].radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = this.stars[star].color;
    ctx.fill();
  }
}

star_field.prototype.update = function (modifier) {
  this.blink(modifier);
  if ((this.game.canvas_div && this.game.player &&
      typeof this.game.player.stats.speed !== 'undefined' &&
      typeof this.game.player.stats.x !== 'undefined' &&
      typeof this.game.player.stats.y !== 'undefined') &&
    ((this.game.player.angle_of() &&
      Object.keys(this.game.player.stats.keys_down).length > 0) || this.game.player.stats.speed > 0)) {
    for (var star in this.stars) {
      this.stars[star].x -= Math.cos(this.game.player.angle * Math.PI / 180) * this.game.player.stats.speed * modifier;
      this.stars[star].y -= Math.sin(this.game.player.angle * Math.PI / 180) * this.game.player.stats.speed * modifier;
      var prev_x = this.stars[star].x,
        prev_y = this.stars[star].y;
      if (this.stars[star].x < 0) {
        this.stars[star].x += this.game.canvas_div.width - Math.random() * 30;
      }
      if (this.stars[star].x > this.game.canvas_div.width) {
        this.stars[star].x -= this.game.canvas_div.width - Math.random() * 30;
      }
      if (this.stars[star].y < 0) {
        this.stars[star].y += this.game.canvas_div.height - Math.random() * 30;
      }
      if (this.stars[star].y > this.game.canvas_div.height) {
        this.stars[star].y -= this.game.canvas_div.height - Math.random() * 30;
      }
      if (this.stars[star].x != prev_x || this.stars[star].y != prev_y) {
        this.stars[star] = {
          x: this.stars[star].x,
          y: this.stars[star].y,
          blink_rate: Math.random() * 3,
          max_radius: Math.random() * 5,
          radius: Math.random() * 3,
          increasing: Math.round(Math.random()),
          color: this.random_color()
        }
      }
    }
  }
}

star_field.prototype.blink = function (modifier) {
  for (var star in this.stars) {
    if (this.stars[star].radius + (this.stars[star].blink_rate * modifier) >= this.stars[star].max_radius) {
      this.stars[star].increasing = false;
    }
    if (this.stars[star].increasing && this.stars[star].radius < this.stars[star].max_radius) {
      this.stars[star].radius += this.stars[star].blink_rate * modifier;
    } else if (this.stars[star].radius - (this.stars[star].blink_rate * modifier) < 0) {
      this.stars[star].increasing = true;
    } else {
      this.stars[star].radius -= this.stars[star].blink_rate * modifier;
    }
  }
}

star_field.prototype.random_color = function random_color() {
  if (Math.random() > 0.7)
    return "#FFFF4D";
  else if (Math.random() < 0.3)
    return "#EB5833";
  else
    return "white";
}
