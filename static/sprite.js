"use strict";

class sprite {
  constructor() {
    this.image = new Image();
    this.show = false;
    this.no_acceleration = false;
    this.stats = {
      Id: "",
      type: this.constructor.name,
      image: "assets/unit.png",
      keys_down: {},
      dest: {},
      x: 0,
      y: 0,
      max_speed: 200,
      speed: 0,
      acceleration: 30,
      max_warp: 500,
      warp: false,
      rate_of_turn: 30,
    };
    this.update_stats();
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.angle_to_dest = false;
    this.selected = false;
  }
  key_down(event) {
    this.stats.keys_down[event.keyCode] = true;
    this.send_update();
  }
  key_up(event) {
    if (event.keyCode in this.stats.keys_down) {
      delete this.stats.keys_down[event.keyCode];
    }
    this.send_update();
  }
  send_update() {
    if (this.show) {
      this.stats.Method = "Update";
      api.send(this.stats);
    }
  }
  draw(ctx) {
    if (this.show && this.image.src.length != 0 &&
      typeof this.x !== 'undefined' &&
      typeof this.y !== 'undefined') {
      ctx.drawRotatedImage(this.image, this.x,
        this.y, this.angle);
      this.draw_shields(ctx);
      if (this.selected) {
        ctx.drawRotatedRect(this.x,
          this.y,
          this.image.width,
          this.image.height,
          this.angle); // ,
        // "#33CC33");
      }
    }
  }
  update(modifier) {
    if (typeof this.stats.speed !== 'undefined' &&
      typeof this.stats.x !== 'undefined' &&
      typeof this.stats.y !== 'undefined' &&
      this.angle_of()) {
      if (this.stats.speed < 0) {
        this.stats.speed = 0;
      }
      if (this.stats.acceleration == false) {
        this.stats.speed = this.stats.max_speed;
      } else if (this.stats.warp && this.stats.speed + this.stats.acceleration <= this.stats.max_warp) {
        this.stats.speed += this.stats.acceleration;
      } else if (this.stats.speed + this.stats.acceleration <= this.stats.max_speed) {
        this.stats.speed += this.stats.acceleration * 2 * modifier;
      }
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
      if (this.stats.warp) {
        this.stats.speed -= this.stats.acceleration;
      } else if (this.stats.acceleration == false) {
        this.stats.speed = 0;
      } else {
        this.stats.speed -= this.stats.acceleration * 2 * modifier;
      }
      this.stats.x += Math.cos(this.angle * Math.PI / 180) * this.stats.speed * modifier;
      this.stats.y += Math.sin(this.angle * Math.PI / 180) * this.stats.speed * modifier;
      return true;
    } else {
      return false;
    }
  }
  angle_of() {
    // Player controlling sprite
    if (Object.keys(this.stats.keys_down).length > 0) {
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
      }
    } else if (Object.keys(this.stats.dest).length > 0 &&
      this.angle_to_dest != false) {
      var check_cords = {
        x: this.stats.x,
        y: this.stats.y,
        image: this.image,
      };
      // Check if we are at the destination
      if (extra.on_cords(this.stats.dest, check_cords)) {
        this.angle_to_dest = false;
      }
      return this.angle_to_dest;
    }
    return false;
  }
  draw_shields(ctx) {
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
  shield_color() {
    if (this.stats.shield / this.stats.max_shield >= 0.7) {
      return "107, 169, 76";
    } else if (this.stats.shield / this.stats.max_shield > 0.3) {
      return "255, 247, 100";
    } else {
      return "217, 108, 85";
    }
  }
  select(is_selected) {
    if (typeof is_selected !== "undefined") {
      this.selected = is_selected;
    }
    return this.selected;
  }
  set_angle() {
    if (Object.keys(this.stats.dest).length > 0) {
      var x = this.stats.x - this.stats.dest.x;
      var y = this.stats.y - this.stats.dest.y;
      var angle = Math.atan(y / x) / Math.PI * 180;
      if (this.stats.dest.x <= this.stats.x) {
        angle += 180;
      }
      this.angle_to_dest = angle;
    }
  }
  set_dest(dest) {
    this.stats.dest = dest;
    this.set_angle();
    this.send_update();
  }
  update_stats(stats) {
    if (typeof stats !== "undefined") {
      this.stats = stats;
    }
    if (typeof this.stats.image !== "undefined" &&
      this.stats.image != false) {
      this.image.src = this.stats.image;
      this.show = true;
    }
    delete this.stats.image;
    this.set_angle();
    // console.log(this.stats.Id + " loaded stats", this);
  }
}
