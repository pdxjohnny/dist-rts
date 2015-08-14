"use strict";

class structure_base extends structure {
  constructor(name) {
    name += "_base";
    super(name);
  }
}
window.unit_types.structure_base = structure_base;
unit_loaded();
