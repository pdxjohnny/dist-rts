"use strict";

class controllable extends sprite {
  constructor(name) {
    super(name);
    this.stats.Id = name;
    this.load();
    this.key_down_event = this.bind_key_down_event.bind(this);
    this.key_up_event = this.bind_key_up_event.bind(this);
  }
  center(canvas_div) {
    this.x = canvas_div.width / 2;
    this.y = canvas_div.height / 2;
  }
  start_movement(canvas_div) {
    this.moving = true;
    this.center(canvas_div);
    document.addEventListener("keydown", this.key_down_event);
    document.addEventListener("keyup", this.key_up_event);
  }
  stop_movement() {
    this.moving = false;
    document.removeEventListener("keydown", this.key_down_event);
    document.removeEventListener("keyup", this.key_up_event);
  }
  bind_key_down_event(event) {
    this.key_down(event);
  }
  bind_key_up_event(event) {
    this.key_up(event);
  }
  save() {}
  load(load_image) {
    var stats = {
      Id: this.stats.Id,
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
      rate_of_turn: 30
    };
    this.update_stats(stats);
    return stats;
  }
  update_stats(stats) {
    this.stats = stats;
    if (typeof this.stats.image !== "undefined" &&
      this.stats.image != false) {
      this.image.src = this.stats.image;
      this.show = true;
    }
    delete this.stats.image;
    // console.log(this.stats.Id + " loaded stats", this);
  }
}
