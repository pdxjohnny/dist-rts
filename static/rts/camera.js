"use strict";

class camera extends controllable {
  constructor(options) {
    super(options);
    this.show = false;
    this.stats.acceleration = false;
    this.stats.rate_of_turn = 100;
  }
}
