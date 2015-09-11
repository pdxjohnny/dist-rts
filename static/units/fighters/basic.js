"use strict";

class fighter_basic extends unit {
  constructor(options) {
    super(options);
    // This has to be called after everything else in the constructor
    // so that the stats are up to date before broadcasting the unit
    this.send_update();
  }
}
window.unit_types.fighter_basic = fighter_basic;
unit_loaded();
