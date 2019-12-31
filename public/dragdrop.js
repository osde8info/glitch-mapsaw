function on_dragstart(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function on_dragover(ev) {
  ev.preventDefault();
}

function on_drop(ev) {
  ev.preventDefault();
  var id = ev.dataTransfer.getData("text/plain");
  if (id) {
    var source = document.getElementById(id);
    if (source) {
      ev.target.src = source.src;
      source.src = "";
    }
  }
}