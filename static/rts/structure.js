"use strict";

class structure extends unit {
  constructor(name) {
    super(name);
    this.stats.acceleration = 0;
    this.stats.image = "assets/basestructure.png";
    this.update_stats(this.stats);
  }
}
