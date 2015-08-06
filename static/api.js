var make_api = function () {
  this.connected = false;
  this.ws = false;
  // Set the default server
  this.change_server(location.origin.split("//")[1]);
  // Handlers for messages
  return this;
}

make_api.prototype.change_server = function (url) {
  this.origin = "ws://" + location.origin.split("//")[1] + "/ws";
}

make_api.prototype.connect = function () {
  this.ws = new WebSocket(this.origin);
  this.ws.onopen = this.onopen.bind(this)
  this.ws.onclose = this.onclose.bind(this)
  this.ws.onmessage = this.onmessage.bind(this)
}

make_api.prototype.onopen = function (data) {
  this.connected = true;
}

make_api.prototype.onclose = function (data) {
  this.connected = false;
}

make_api.prototype.onmessage = function (data) {
  try {
    data = JSON.parse(data["data"])
  } catch (err) {
    console.error("Could not decode", data["data"]);
  }
  if (typeof data["Method"] !== "undefined" &&
    typeof this[data["Method"]] === "function") {
    this[data["Method"]](data);
  }
}

make_api.prototype.send = function (data) {
  if (this.connected) {
    data = JSON.stringify(data)
    this.ws.send(data)
  }
}
