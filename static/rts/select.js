"use strict";

class selector {
  constructor(parent_player) {
    // Current destination
    this.dest = {};
    // Units selected
    this.selected = {};
    // The player using this selector
    this.player = parent_player;
    // Use the game and extra to get mouse position functions
    this.get_real_pos = this.player.game.get_real_pos.bind(this.player.game);
    this.get_mouse_pos = extra.get_mouse_pos.bind(extra);
    this.on_cords = extra.on_cords.bind(extra);
    this.in_cords = extra.in_cords.bind(extra);
    // For select box
    this.selectBoxStart = {};
    this.selectBoxEnd = {};
    // Make the Id so this has a name
    this.stats = {
      Id: this.player.Id,
      x: 0,
      y: 0,
    };
    // Add to the game so we can draw the box
    this.player.add_unit(this);
    // Need an x and y to be drawn
    this.x = 0;
    this.y = 0;
  }
  bind_clicks() {
    document.addEventListener("mousedown",
      this.select_mousedown.bind(this));
  }
  set_dest() {
    if (Object.keys(this.dest).length > 0) {
      var dest = extra.clone(this.dest);
      for (var i in this.selected) {
        this.selected[i].set_dest(dest);
      }
    }
  }
  single_select(event) {
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
      this.dest = this.get_real_pos(mouseAt);
      this.set_dest();
      this.unselect_all();
    } else {
      this.dest = {};
    }
  }

  select(unit) {
    unit.select(true);
    this.selected[unit.stats.Id] = unit;
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

  draw(ctx) {
    if (Object.keys(this.selectBoxStart).length > 0 &&
      Object.keys(this.selectBoxEnd).length > 0) {
      // Draw the rectange
      ctx.beginPath();
      ctx.rect(this.selectBoxStart.x,
        this.selectBoxStart.y,
        this.selectBoxEnd.x - this.selectBoxStart.x,
        this.selectBoxEnd.y - this.selectBoxStart.y);
      ctx.stroke();
    }
  }
}
