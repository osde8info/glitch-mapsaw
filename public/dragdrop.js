function odrag(ev) {
  console.log("drag");
}

function odragstart(ev) {
  console.log("start");
  ev.dataTransfer.setData("id", ev.target.id);
}

function odragenter(ev) {
  console.log("enter");
}

function odragover(ev) {
  ev.preventDefault();
}

function odrop(ev) {
  console.log("drop");
  ev.preventDefault();
  var id = ev.dataTransfer.getData("id");
  var source = document.getElementById(id);
  ev.target.src=source.src;
  source.src='';
  
}
