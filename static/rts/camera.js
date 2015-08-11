"use strict";

class camera extends player {
  constructor(name) {
    super(name);
    this.show = false;
    this.stats.acceleration = false;
    this.stats.rate_of_turn = 100;
  }
}
