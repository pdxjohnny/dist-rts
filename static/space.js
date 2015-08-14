window.unit_types = {};
window.units_loaded = false;

var space = function space(canvas_div_id) {
  this.set_canvas(canvas_div_id);
  this.full_screen();
  this.all = {};
  this.front = {};
  this.middle = {};
  this.back = {};
  this.updates = {
    'adjust_to_player': this.adjust_to_player.bind(this)
  };
  this.player = false;
  this.back['background'] = new space_background(this);
  this.back['background'].color = '#0B173B';
  this.back['stars'] = new star_field(this);
  return this;
}

space.prototype = new game();
space.prototype.constructor = space;

space.prototype.api_setup = function () {
  api.startsender();
  api.Update = function (data) {
    if (typeof this.all[data["Id"]] === "undefined") {
      this.add_player(data["Id"]);
    }
    this.all[data["Id"]].update_stats(data);
  }.bind(this);
}

space.prototype.stop = function () {
  this.running = false;
  if (this.player) {
    this.player.stop_movement();
  }
}

space.prototype.adjust_to_player = function () {
  if (this.player) {
    for (var object in this.middle) {
      this.middle[object].x = (this.middle[object].stats.x - this.player.stats.x) + this.player.x;
      this.middle[object].y = (this.middle[object].stats.y - this.player.stats.y) + this.player.y;
    }
  }
}

space.prototype.control = function (name) {
  if (this.player) {
    this.player.stop_movement();
  }
  this.player = this.all[name];
  this.player.start_movement(this.canvas_div);
}

space.prototype.add_player = function (name) {
  var add = new player(name);
  this.all[name] = add;
  this.middle[name] = add;
  return add;
}

space.prototype.add_camera = function (name) {
  var add = new camera(name);
  this.all[name] = add;
  this.middle[name] = add;
  return add;
}

space.prototype.create_unit = function (unit) {
  console.log(window.unit_types[unit.type]);
  // var add = new camera(name);
  // this.all[name] = add;
  // this.middle[name] = add;
  // return add;
}

space.prototype.load_units = function (url) {
  var unit_scripts_include = document.getElementById("unit_scripts_include");
  this.load_url = url;
  window.load_url = this.load_url;
  unit_scripts_include.src = this.load_url  + "include.js";
}




var space_background = function space_background(game) {
  this.game = game;
}

space_background.prototype.draw = function (ctx) {
  if (this.game.canvas_div && this.color) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(0, 0, this.game.canvas_div.width, this.game.canvas_div.height);
    ctx.fill();
  }
}
