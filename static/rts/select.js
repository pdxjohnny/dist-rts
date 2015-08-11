game.prototype.single_select = function (event) {
  var mouseAt = this.get_mouse_pos(event);
  var none = true;
  for (var i in this.all) {
    if (this.on_cords(mouseAt, this.all[i])) {
      if (this.all[i].selected) {
        this.all[i].selected = false;
        this.all[i].dest = {};
        if (typeof this.all[i].show_options === "function")
          this.all[i].show_options();
      } else if (none) {
        this.all[i].selected = true;
        if (typeof this.all[i].show_options === "function")
          this.all[i].show_options();
        none = false;
      }
    }
  }
  if (none) {
    var atLeastOne = false;
    for (var i in this.all) {
      if (this.all[i].selected) atLeastOne = true;
    }
    if (atLeastOne) {
      this.dest = mouseAt;
      for (var i in this.all) {
        if (this.all[i].selected &&
          typeof this.dest.x !== "undefined" &&
          typeof this.dest.y !== "undefined") {
          this.all[i].dest = {};
          this.all[i].dest.x = this.dest.x;
          this.all[i].dest.y = this.dest.y;
          delete this.all[i].path;
        }
      }
    } else this.dest = {};
  }
}

game.prototype.select_structure = function (event) {
  var mouseAt = this.get_mouse_pos(event);
  var none = true;
  for (var i in this.structuresL) {
    if (this.on_cords(mouseAt, this.structuresL[i])) {
      if (this.structuresL[i].selected) {
        this.structuresL[i].selected = false;
      } else if (none) {
        this.structuresL[i].selected = true;
        this.structuresL[i].show_options();
        none = false;
      }
    }
  }
  if (none) {
    for (var i in this.structuresL) {
      this.structuresL[i].selected = false;
    }
    //for ( var i in this.all ){
    //this.all[i].selected = false;
    //	}
  }
}

game.prototype.unselect_all = function () {
  for (var i in this.all) {
    this.all[i].selected = false;
  }
  for (var i in this.structuresL) {
    this.structuresL[i].selected = false;
  }
  this.dest = {};
}

game.prototype.multi_select = function (event) {
  this.selectBoxStart = this.get_mouse_pos(event);
  // Register multi_select listeners
  document.addEventListener("mousemove",
    this.multi_select_mousemove.bind(this));
  document.addEventListener("mouseup",
    this.multi_select_mouseup.bind(this));
}

game.prototype.multi_select_mouseup = function (event) {
  for (var i in this.all) {
    if (this.in_cords(this.selectBoxStart, this.selectBoxEnd, this.all[i])) {
      if (this.all[i].selected) {
        this.all[i].dest = {};
      } else {
        this.all[i].selected = true;
        delete this.all[i].path;
      }
    }
  }
  this.selectBoxStart = false;
  this.selectBoxEnd = false;
  // Remove multi_select listeners
  document.removeEventListener("mousemove",
    this.multi_select_mousemove.bind(this));
  document.removeEventListener("mouseup",
    this.multi_select_mouseup.bind(this));
  return false;
}

game.prototype.multi_select_mousemove = function (event) {
  this.selectBoxEnd = this.get_mouse_pos(event);
}

game.prototype.select_mousedown = function (event) {
  switch (event.which) {
  case 1:
    this.single_select(event);
    this.multi_select(event);
    this.select_structure(event);
    break;
  case 2:
    console.log('Middle Mouse button pressed.');
    break;
  case 3:
    this.unselect_all();
    break;
  default:
    console.log('You have a strange Mouse!');
  }
}
