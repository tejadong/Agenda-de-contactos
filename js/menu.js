document.addEventListener("DOMContentLoaded", main);

function main() {

  function menuMovil() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  
  var icono = document.getElementsByClassName("icon");
  icono[0].addEventListener("click", menuMovil);
}
