// script.js
var countimg = 1;
var stocknum;
var stocknumchk;

function thumbbtn ( ordern ) { 
	countimg = countimg + ordern - 1;
	nxt();
}
	
function prvs() { 
	if (stocknum !== "" && typeof stocknum !== 'undefined') {
	if (countimg > 1) {
		countimg = countimg - 1;
		countimg1 = countimg + 1;
		countimg2 = countimg1 + 1;
		countimg3 = countimg2 + 1;
		countimg4 = countimg3 + 1;

	};
		displayimg();
	};
};

function nxt() {
	if (stocknum !== "" && typeof stocknum !== 'undefined') {
	countimg = countimg + 1;
	countimg1 = countimg + 1;
	countimg2 = countimg1 + 1;
	countimg3 = countimg2 + 1;
	countimg4 = countimg3 + 1;

	displayimg();
	};
};
function updateImageCounters() {
  for (var i = 1; i <= 8; i++) {
    window['countimg' + i] = countimg + i;
  }
}

document.getElementById("btn_submit").onclick = function () {
  stocknum = document.getElementById("VINbar").value;
  if (stocknum.length === 8) {
    countimg = 1;
    updateImageCounters();
    displayimg();
  } else {
    alert("Stock number should be 8 digits long, currently " + stocknum.length + " digits entered.");
  }
};

document.getElementById("btn_submit2").onclick = function () {
  stocknum = document.getElementById("LINKbar").value;
  stocknum = stocknum.replace("https:", "").replace(/\//g, "").replace("img2.carmax.comimgvehicles", "").replace("1.jpg?width=400&ratio=43", "");
  countimg = 1;
  document.getElementById("VINbar").value = stocknum;
  updateImageCounters();
  displayimg();
};

function thumbbtn(ordern) {
  countimg += ordern - 1;
  displayimg();
}

function displayimg() {
  console.log(countimg);
  document.getElementById("instructions").style.display = 'none';
  var x = document.getElementById("dispframe");
  var klink = document.getElementById("kmxlink");
  	
  klink.setAttribute("href", "https://www.carmax.com/car/"  + stocknum);
  x.setAttribute("src", "https://img2.carmax.com/img/vehicles/" + stocknum + "/" + countimg + ".jpg");
  x.setAttribute("alt", countimg);
  x.setAttribute("object-fit", "cover");

  if (!x.complete) {
    $('.modal').modal('show');
  }

  x.onload = function() {
    setTimeout(function () { $('.modal').modal('hide'); }, 500);
    for (var i = 1; i <= 4; i++) {
      document.getElementById("thumb" + i).setAttribute("src", "https://img2.carmax.com/img/vehicles/" + stocknum + "/" + window['countimg' + (i + 1)] + ".jpg");
    }
  };
}

// Event listeners for Enter key on input fields
var inputFields = ["VINbar", "LINKbar"];
inputFields.forEach(function(fieldId) {
  var input = document.getElementById(fieldId);
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById(fieldId === "VINbar" ? "btn_submit" : "btn_submit2").click();
    }
  });
});
