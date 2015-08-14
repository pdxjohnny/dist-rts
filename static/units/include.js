var scripts = [
  "structure/base.js",
];

var have_scripts = 0;

function unit_loaded() {
  have_scripts++;
  if (have_scripts >= scripts.length) {
    window.units_loaded = true;
    console.log("All units loaded");
  }
}

var unit_scripts_div = document.getElementById("unit_scripts");
for (var i = 0; i < scripts.length; i++) {
  var script_el = document.createElement("script");
  script_el.type = "text/javascript";
  script_el.src = window.load_url + scripts[i];
  unit_scripts_div.appendChild(script_el);
}
