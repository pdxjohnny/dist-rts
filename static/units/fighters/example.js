"use strict";

class fighter_example extends unit {
  constructor(options) {
    super(options);
    // This has to be called after everything else in the constructor
    // so that the stats are up to date before broadcasting the unit
    this.send_update();
  }
}
window.unit_types.fighter_example = fighter_example;
unit_loaded();
