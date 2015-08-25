"use strict";

class controllable extends sprite {
  constructor(name) {
    super(name);
    this.stats.Id = name;
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
}
