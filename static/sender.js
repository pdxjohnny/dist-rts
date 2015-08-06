importScripts("api.js")

onmessage = function(event) {
  api[event.data[0]](event.data[1])
}
