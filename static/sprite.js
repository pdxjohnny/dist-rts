var sprite = function sprite() {
  this.image = new Image();
  this.show = false;
  this.stats = {
    keys_down: {},
    x: 0,
    y: 0
  };
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.selected = false;
}

sprite.prototype.key_down = function (event) {
  this.stats.keys_down[event.keyCode] = true;
  this.stats.Method = "Update";
  if (this.show) {
    api.send(this.stats);
  }
}

sprite.prototype.key_up = function (event) {
  if (event.keyCode in this.stats.keys_down) {
    delete this.stats.keys_down[event.keyCode];
  }
  this.stats.Method = "Update";
  if (this.show) {
    api.send(this.stats);
  }
}

sprite.prototype.draw = function (ctx) {
  if (this.show && this.image.src.length != 0 &&
    typeof this.x !== 'undefined' &&
    typeof this.y !== 'undefined') {
    ctx.drawRotatedImage(this.image, this.x,
      this.y, this.angle);
    this.draw_shields(ctx);
  }
  if (this.selected) {
    ctx.drawRotatedRect(this.x - this.image.width / 2,
      this.y - this.image.height / 2,
      this.image.width,
      this.image.height,
      "#33CC33");
  }
}

sprite.prototype.update = function (modifier) {
  if (typeof this.stats.speed !== 'undefined' &&
    typeof this.stats.x !== 'undefined' &&
    typeof this.stats.y !== 'undefined' &&
    Object.keys(this.stats.keys_down).length > 0 &&
    this.angle_of()) {
    if (this.stats.speed < 0)
      this.stats.speed = 0;
    if (this.stats.warp && this.stats.speed + this.stats.acceleration <= this.stats.max_warp)
      this.stats.speed += this.stats.acceleration;
    else if (this.stats.speed + this.stats.acceleration <= this.stats.max_speed)
      this.stats.speed += this.stats.acceleration * 2 * modifier;
    var to_angle = this.angle_of() - this.angle;
    if (to_angle < 0) {
      if (to_angle <= -360) {
        this.angle += to_angle;
      }
      if (to_angle < -180) {
        this.angle += this.stats.rate_of_turn / 10;
      } else {
        this.angle -= this.stats.rate_of_turn / 10;
      }
    } else if (to_angle > 0) {
      if (to_angle >= 360) {
        this.angle += to_angle;
      }
      if (to_angle > 180) {
        this.angle -= this.stats.rate_of_turn / 10;
      } else {
        this.angle += this.stats.rate_of_turn / 10;
      }
    }
    this.stats.x += Math.cos(this.angle * Math.PI / 180) * this.stats.speed * modifier;
    this.stats.y += Math.sin(this.angle * Math.PI / 180) * this.stats.speed * modifier;
    return true;
  } else if (this.stats.speed > 0) {
    if (this.stats.warp)
      this.stats.speed -= this.stats.acceleration;
    else
      this.stats.speed -= this.stats.acceleration * 2 * modifier;
    this.stats.x += Math.cos(this.angle * Math.PI / 180) * this.stats.speed * modifier;
    this.stats.y += Math.sin(this.angle * Math.PI / 180) * this.stats.speed * modifier;
    return true;
  } else {
    return false;
  }
}

sprite.prototype.angle_of = function () {
  // Player holding up and right
  if ((38 in this.stats.keys_down || 87 in this.stats.keys_down) &&
    (39 in this.stats.keys_down || 68 in this.stats.keys_down)) {
    return 315;
  }
  // Player holding up and left
  else if ((38 in this.stats.keys_down || 87 in this.stats.keys_down) &&
    (37 in this.stats.keys_down || 65 in this.stats.keys_down)) {
    return 225;
  }
  // Player holding left and down
  else if ((37 in this.stats.keys_down || 65 in this.stats.keys_down) &&
    (40 in this.stats.keys_down || 83 in this.stats.keys_down)) {
    return 135;
  }
  // Player holding down and right
  else if ((40 in this.stats.keys_down || 83 in this.stats.keys_down) &&
    (39 in this.stats.keys_down || 68 in this.stats.keys_down)) {
    return 45;
  }
  // Player holding up
  else if (38 in this.stats.keys_down || 87 in this.stats.keys_down) {
    return 270;
  }
  // Player holding down
  else if (40 in this.stats.keys_down || 83 in this.stats.keys_down) {
    return 90;
  }
  // Player holding left
  else if (37 in this.stats.keys_down || 65 in this.stats.keys_down) {
    return 180;
  }
  // Player holding right
  else if (39 in this.stats.keys_down || 68 in this.stats.keys_down) {
    return 360;
  } else return false;
}

sprite.prototype.draw_shields = function draw_shields(ctx) {
  if (this.stats.max_shield && this.stats.shield) {
    var size = this.image.width;
    if (this.image.height > this.image.width) {
      size = this.image.height;
    }
    ctx.beginPath();
    ctx.arc(this.x,
      this.y,
      size / 1.5,
      0,
      Math.PI * 2,
      false);
    ctx.closePath();
    var color = this.shield_color();
    ctx.fillStyle = "rgba( " + color + ", 0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgb( " + color + " )";
    ctx.stroke();
  }
}

sprite.prototype.shield_color = function shield_color() {
  if (this.stats.shield / this.stats.max_shield >= 0.7)
    return "107, 169, 76";
  else if (this.stats.shield / this.stats.max_shield > 0.3)
    return "255, 247, 100";
  else
    return "217, 108, 85";
}
