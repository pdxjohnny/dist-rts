"use strict";

class structure_base extends structure {
  constructor(options) {
    super(options);
    this.send_update();
  }
}
window.unit_types.structure_base = structure_base;
unit_loaded();
