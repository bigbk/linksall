// Improved JavaScript code for image navigation
function nxt() {
    if (stocknum) {
      countimg++;
      displayimg();
    }
  }
  
  function prvs() {
    if (stocknum && countimg > 1) {
      countimg--;
      displayimg();
    }
  }
  
  function thumbbtn(ordern) {
    // Directly display the image corresponding to the thumbnail clicked
    if (stocknum && ordern >= 1) {
      countimg = ordern;
      displayimg();
    }
  }
  
  function displayimg() {
    // Exit early if stocknum is not set
    if (!stocknum) return;
  
    // Simplify element selection using a helper function
    const getElement = (id) => document.getElementById(id);
  
    console.log(countimg);
    getElement("instructions").style.display = 'none';
    getElement("kmxpg").style.display = 'block';
  
    // Update main image
    const mainImage = getElement("dispframe");
    mainImage.src = `https://img2.carmax.com/img/vehicles/${stocknum}/${countimg}.jpg`;
    mainImage.alt = `Image ${countimg}`;
    mainImage.style.objectFit = 'cover';
  
    // Show spinner modal while loading the main image
    if (!mainImage.complete) {
      $('#spinnerModal').modal('show');
    }
  
    mainImage.onload = function() {
      // Hide spinner modal after the main image has loaded
      setTimeout(() => $('#spinnerModal').modal('hide'), 500);
  
      // Update thumbnails
      for (let i = 1; i <= 8; i++) {
        const thumb = getElement(`thumb${i}`);
        thumb.src = `https://img2.carmax.com/img/vehicles/${stocknum}/${countimg + i}.jpg`;
      }
    };
  
    // Update links only if stocknum has changed
    const carMaxLink = getElement("kmxlink");
    const carMaxFrame = getElement("kmxfrm");
    if (typeof stocknumchk === 'undefined' || stocknumchk !== stocknum) {
      stocknumchk = stocknum;
      carMaxLink.href = `https://www.carmax.com/car/${stocknum}`;
      carMaxFrame.src = `https://www.carmax.com/car/${stocknum}`;
    }
  }
  
