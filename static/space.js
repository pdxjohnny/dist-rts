window.unit_types = {};
window.units_loaded = false;
window.on_units_loaded = false;

var space = function space(canvas_div_id) {
  this.set_canvas(canvas_div_id);
  this.full_screen();
  this.all = {};
  this.front = {};
  this.middle = {};
  this.back = {};
  this.updates = {
    'adjust_to_controlling': this.adjust_to_controlling.bind(this)
  };
  this.player = false;
  this.controlling = false;
  this.back['background'] = new space_background(this);
  this.back['background'].color = '#0B173B';
  this.back['stars'] = new star_field(this);
  return this;
}

space.prototype = new game();
space.prototype.constructor = space;

space.prototype.api_setup = function () {
  api.startsender();
  api.Update = this.Update.bind(this);
}

space.prototype.stop = function () {
  this.running = false;
  if (this.controlling) {
    this.controlling.stop_movement();
  }
}

space.prototype.adjust_to_controlling = function () {
  if (this.controlling) {
    for (var object in this.middle) {
      this.middle[object].x = (this.middle[object].stats.x - this.controlling.stats.x) + this.controlling.x;
      this.middle[object].y = (this.middle[object].stats.y - this.controlling.stats.y) + this.controlling.y;
    }
  }
}

space.prototype.get_real_pos = function (object) {
  object.x = (object.x - this.controlling.x) + this.controlling.stats.x;
  object.y = (object.y - this.controlling.y) + this.controlling.stats.y;
  return object;
}

space.prototype.control = function (name) {
  if (this.controlling) {
    this.controlling.stop_movement();
  }
  this.controlling = this.all[name];
  this.controlling.start_movement(this.canvas_div);
}

space.prototype.start_player = function (name) {
  var create_and_spawn = function () {
    this.player = new player(name, this);
    this.player.spawn();
  }
  create_and_spawn = create_and_spawn.bind(this);
  if (window.units_loaded) {
    create_and_spawn();
  } else {
    window.on_units_loaded = create_and_spawn;
  }
}

space.prototype.add_unit = function (add) {
  this.all[add.stats.Id] = add;
  this.middle[add.stats.Id] = add;
  return add;
}

space.prototype.create_unit = function (name, type) {
  var add = new type(name);
  return this.add_unit(add);
}

space.prototype.Update = function (unit) {
  if (typeof this.all[data["Id"]] === "undefined") {
    this.create_unit(data["Id"], window.unit_types[unit.type]);
  }
  this.all[data["Id"]].update_stats(data);
}

space.prototype.load_units = function (url) {
  var unit_scripts_include = document.getElementById("unit_scripts_include");
  this.load_url = url;
  window.load_url = this.load_url;
  unit_scripts_include.src = this.load_url + "include.js";
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
