var player = function player(name) {
  this.stats._id = name;
  this.image = new Image();
  this.load();
  this.key_down_event = this.create_key_down_event();
  this.key_up_event = this.create_key_up_event();
}

player.prototype = new sprite();
player.prototype.constructor = player;

player.prototype.center = function (canvas_div) {
  this.x = canvas_div.width / 2;
  this.y = canvas_div.height / 2;
}

player.prototype.start_movement = function (canvas_div) {
  this.moving = true;
  this.center(canvas_div);
  document.addEventListener('keydown', this.key_down_event);
  document.addEventListener('keyup', this.key_up_event);
}

player.prototype.stop_movement = function () {
  this.moving = false;
  document.removeEventListener('keydown', this.key_down_event);
  document.removeEventListener('keyup', this.key_up_event);
}

player.prototype.create_key_down_event = function () {
  return function (player) {
    var handler = function (event) {
      player.key_down(event);
    }
    return handler;
  }(this);
}

player.prototype.create_key_up_event = function () {
  return function (player) {
    var handler = function (event) {
      player.key_up(event);
    }
    return handler;
  }(this);
}

player.prototype.save = function () {
  db[stats_database].put(this.stats, function (player) {
    return function (error, result) {
      if (!error) {
        console.log('Successfully saved stats');
        player.load(false);
      } else {
        console.log(error, result);
      }
    }
  }(this));
}

player.prototype.load = function (load_image) {
  db[stats_database].get(this.stats._id).catch(function (player) {
    return function (err) {
      if (err.status === 404) {
        return {
          _id: player.stats._id,
          ship: 'default',
          keys_down: {},
          x: 0,
          y: 0,
          max_speed: 200,
          speed: 0,
          acceleration: 30,
          max_warp: 500,
          warp: false,
          rate_of_turn: 30
        };
      } else {
        throw err;
      }
    }
  }(this)).then(function (player) {
    return function (stats) {
      if (typeof load_image === 'undefined' || load_image) {
        db[ships_database].get(stats.ship).catch(function (err) {
          if (err.status === 404) {
            return {
              _id: 'default',
              image: 'default'
            };
          } else {
            throw err;
          }
        }).then(function (player) {
          return function (image) {
            stats.image = image.image;
            player.update_stats(stats);
          };
        }(player));
      } else {
        player.update_stats(stats);
      }
    }
  }(this)).catch(function (err) {
    // handle any errors
  });
}

player.prototype.update_stats = function (stats) {
  this.stats = stats;
  if (typeof this.stats.image !== 'undefined') {
    this.image.src = this.stats.image;
    this.show = true;
  }
  delete this.stats.image;
  console.log(this.stats._id + ' loaded stats', this);
}
