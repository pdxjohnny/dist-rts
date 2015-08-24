"use strict";

class player {
  constructor(name, running_game) {
    this.Id = name;
    // The cameras the player has
    this.cameras = {};
    // The players units
    this.units = {};
    // The game
    this.game = running_game;
    // Manages selected units
    this.select = new selector(this);
  }
  spawn() {
    // Create the player's first camera
    var first_camera = this.add_camera();
    // Create the players base
    this.create_unit("main_base", "structure_base");
    // Initialize the selector
    this.select.bind_clicks();
  }
  add_camera(name) {
    if (typeof name === "undefined") {
      name = this.Id + "_cam_" + (Object.keys(this.cameras).length + 1);
    }
    var add = new camera(name);
    this.cameras[name] = add;
    this.game.add_unit(add);
    this.game.control(name);
    return add;
  }
  switch_camera(index) {
    if (typeof this.cameras[this.Id + "_cam_" + index] !== "undefined") {
      this.game.control(this.Id + "_cam_" + index);
    }
  }
  add_unit(add) {
    this.units[add.stats.Id] = add;
    this.game.add_unit(add);
    return add;
  }
  create_unit(name, type) {
    name = this.Id + "_" + name;
    type = window.unit_types[type];
    var add = new type(name);
    return this.add_unit(add);
  }
}
