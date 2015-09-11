"use strict";

class structure_base extends structure {
  constructor(options) {
    super(options);
    this.send_update();
  }
  on_select() {
    
  }
  display_options() {
    var options = this.create_options();
    this.game.set_options(options);
  }
  create_options() {

  }
}
window.unit_types.structure_base = structure_base;
unit_loaded();
