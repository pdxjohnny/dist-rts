"use strict";

class structure_example extends structure {
  constructor(options) {
    super(options);
    // This has to be called after everything else in the constructor
    // so that the stats are up to date before broadcasting the unit
    this.send_update();
  }
}
window.unit_types.structure_example = structure_example;
unit_loaded();
