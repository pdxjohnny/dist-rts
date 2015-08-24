"use strict";

class selector {
  constructor(parent_player) {
    // Current destination
    this.dest = {};
    // Units selected
    this.selected = {};
    // The player using this selector
    this.player = parent_player;
    // Use the games get mouse position functions
    this.get_mouse_pos = this.player.game.get_mouse_pos;
    this.get_real_pos = this.player.game.get_real_pos;
    this.on_cords = this.player.game.on_cords;
    this.in_cords = this.player.game.in_cords;
    // For select box
    this.selectBoxStart = {};
    this.selectBoxEnd = {};
  }
  bind_clicks() {
    document.addEventListener("mousedown",
      this.select_mousedown.bind(this));
  }
  set_dest() {
    var dest = clone(this.dest);
    for (var i in this.selected) {
      console.log("Setting destination");
      this.selected[i].stats.dest = dest;
    }
  }
  single_select(event) {
    this.set_dest();
    this.unselect_all();
    this.multi_select(event);
    var any_selected = false;
    var mouseAt = this.get_mouse_pos(event);
    for (var i in this.player.units) {
      if (this.on_cords(mouseAt, this.player.units[i])) {
        this.select(this.player.units[i]);
        any_selected = true;
      }
    }
    if (!any_selected) {
      // this.dest = this.get_real_pos(mouseAt);
    }
  }

  select(unit) {
    unit.select(true);
    this.selected[i] = unit;
  }

  unselect_all() {
    for (var i in this.selected) {
      this.selected[i].select(false);
      delete this.selected[i];
    }
    this.dest = {};
  }

  multi_select(event) {
    this.selectBoxStart = this.get_mouse_pos(event);
    // Register multi_select listeners
    document.addEventListener("mousemove",
      this.multi_select_mousemove.bind(this));
    document.addEventListener("mouseup",
      this.multi_select_mouseup.bind(this));
  }

  multi_select_mouseup(event) {
    for (var i in this.player.units) {
      if (this.in_cords(this.selectBoxStart, this.selectBoxEnd, this.player.units[i])) {
        this.select(this.player.units[i]);
      }
    }
    this.selectBoxStart = {};
    this.selectBoxEnd = {};
    // Remove multi_select listeners
    document.removeEventListener("mousemove",
      this.multi_select_mousemove.bind(this));
    document.removeEventListener("mouseup",
      this.multi_select_mouseup.bind(this));
    return false;
  }

  multi_select_mousemove(event) {
    this.selectBoxEnd = this.get_mouse_pos(event);
  }

  select_mousedown(event) {
    switch (event.which) {
    case 1:
      this.single_select(event);
      break;
    case 2:
      console.log("Middle Mouse button pressed.");
      break;
    case 3:
      this.unselect_all();
      break;
    default:
      console.log("You have a strange Mouse!");
    }
  }
}
