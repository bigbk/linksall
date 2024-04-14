function copyToClipboard(text) {
//    var dummy = document.createElement("textarea");
//    // to avoid breaking orgain page when copying more words
//    // cant copy when adding below this code
//    // dummy.style.display = 'none'
//    document.body.appendChild(dummy);
//    // Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
//    dummy.value = text;
//    dummy.select();
//    document.execCommand("copy");
//    document.body.removeChild(dummy);

    navigator.clipboard.writeText(text).then(function() {
        console.log('Copying to clipboard was successful!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });

}


function Call() {
    vin = document.getElementById("VINbar").value;
    //var wmidata = $.getJSON("vin.json");
    var wmidata;
    aMake = ""

    if (vin.length >= 3) {

        vin = vin.replace(/ +/g, "");
        vin = vin.replace(/{/g, "");
        vin = vin.replace(/}/g, "");

        vin = vin.toUpperCase();
        document.getElementById("VINbar").value = vin;


        console.log(vin.length);


        document.getElementById("txt_results").value = "Click on Search icon to retrieve details";
        document.getElementById("output").innerText = "Click on Search icon to retrieve details. " + "VIN number should be 17 digits long, currently " + vin.length + " digits entered.";
        document.getElementById("outputbox").style.display = 'block';

        var secondmake = vin.substring(1, 2);
        var onetwomake = vin.substring(0, 2);
        var onethree = vin.substring(0, 3);
        var twothree = vin.substring(1, 3);
        console.log(secondmake);
        console.log(onetwomake);
        console.log(onethree);

        fetch("vin.json")
        .then(response => response.json()) 
        .then (data => {
            //console.log(data);
            wmidata = data;
            //console.log("wmidata " + wmidata);


        var wmisearch = onethree;
        for (var i = 0; i < wmidata.length; i++) { // look for the entry with a matching `code` value
            //console.log(i);
            if (wmidata[i].WMI == wmisearch) { // we found it
                aMake = wmidata[i].Manufacturer;
                console.log("found using json data " + aMake);
                updatedisplay();
            }
        }
        });

        console.log("typed " + aMake);
        updatedisplay();
        console.log(vin.length);
        if (vin.length === 17) {
            copyToClipboard(vin);

            var copyText = document.getElementById("VINbar");

            copyText.focus();

            getNHTSADataByVIN(vin);
        };
    };
};

function getNHTSADataByVIN(param_vin) {
    $.ajax({
        url: "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/",
        type: "POST",
        data: {
            format: "json",
            data: param_vin
        },
        dataType: "json",
        success: function (result) {
            console.log(result);


            if (result.Results[0].ModelYear !== "") {
                aYear = result.Results[0].ModelYear
            } else {
                aYear = ""
            };
            if (result.Results[0].Make !== "") {
                aMake = result.Results[0].Make
            } else {
                aMake = ""
            };
            if (result.Results[0].Model !== "") {
                aModel = result.Results[0].Model
            } else {
                aModel = ""
            };
            if (result.Results[0].Series !== "") {
                aSeries = result.Results[0].Series
            } else {
                aSeries = ""
            };
            if (result.Results[0].Trim !== "") {
                aTrim = result.Results[0].Trim
            } else {
                aTrim = ""
            };
            if (result.Results[0].DisplacementL !== "") {
                aDisp = result.Results[0].DisplacementL;
                aDisp = parseFloat(aDisp);
                aDisp = aDisp.toFixed(1);
                aDisp = aDisp + "L";
            } else {
                aDisp = ""
            };
            if (result.Results[0].FuelTypePrimary !== "") {
                aFuel = result.Results[0].FuelTypePrimary
            } else {
                aFuel = ""
            };
            if (result.Results[0].EngineCylinders !== "") {
                aCyl = result.Results[0].EngineCylinders + "cyl"
            } else {
                aCyl = ""
            };
            if (result.Results[0].DriveType !== "") {
                aDrive = result.Results[0].DriveType
            } else {
                aDrive = ""
            };
            if (result.Results[0].Doors !== "") {
                aDoor = result.Results[0].Doors + "D"
            } else {
                aDoor = ""
            };
            if (result.Results[0].BodyCabType !== "") {
                aCab = result.Results[0].BodyCabType
            } else {
                aCab = ""
            };
            if (result.Results[0].BodyClass !== "") {
                aBody = result.Results[0].BodyClass
            } else {
                aBody = ""
            };

            console.log("pulled " + aMake);
            document.getElementById("iyear").value = aYear;
            document.getElementById("imake").value = aMake;
            document.getElementById("imodel").value = aModel;
            if (result.Results[0].EngineCylinders !== "") {
                document.getElementById("icyl").value = result.Results[0].EngineCylinders;

            } else {
                document.getElementById("icyl").value = ""
            };


            document.getElementById("output").innerText = aYear + " " + aMake + " " + aModel + " " + aSeries + " " + aTrim + ", " + aDisp + " " + aFuel + ", " + aCyl + " \n " + aDoor + aCab + " " + aBody + ", " + aDrive + " \r\n " + "(Please note that this information is sourced from NHTSA and should not be relied upon as the sole source of trim data.)";
            document.getElementById("outputbox").style.display = 'block';

            displayNHTSAResults(result);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
};


function displayNHTSAResults(param_data) {
    var output_text = "";
    for (var i = 0; i < param_data.Results.length; i++) {
        var result = param_data.Results[i];
        for (var prop in result) {
            if (result.hasOwnProperty(prop) && result[prop] !== "") {
                output_text += prop + ": " + result[prop] + "\n";
            }
        }
    }

    document.getElementById("txt_results").value = output_text;

    document.getElementById("nhtsa_data").style.display = 'block';
    updatedisplay();


};

function getnissansticker2() {
    if (vincheckin()) {
        window.open(piserv + "/nissan?vin=" + vin);
    };
};

function getnissansticker3() {
    if (vincheckin()) {
        window.open("https://www.carsonnissan.com/api/legacy/pse/windowsticker/nissan?vin=" + vin);
        //This one still works -> window.open("https://nissan-services.web-aws.dealersocket.com/production/sticker/" + vin);
        //window.open("https://www.autonationnissanchandler.com/api/legacy/pse/windowsticker/nissan?vin=" + vin);
    };
};

function getnissansticker4() {
    if (vincheckin()) {
        //window.open("https://www.carsonnissan.com/api/legacy/pse/windowsticker/nissan?vin=" + vin);
        window.open(awsserv + "/ps?url=" + "https://nissan-services.web-aws.dealersocket.com/production/sticker/" + vin);
        //window.open("https://www.autonationnissanchandler.com/api/legacy/pse/windowsticker/nissan?vin=" + vin);
    };
};

function toyotasticker() {
    if (vincheckin()) {
        window.open("https://api.toyotainventory.com/VEHICLES/" + vin + "/monroney");
    };
};

function toyotasticker3() {
    if (vincheckin()) {
        window.open("https://api-windowsticker.web-aws.dealersocket.com/toyota/" + vin);
    };
};

function velocitysticker() {
    if (vincheckin()) {
        window.open("https://windowsticker.velocityengage.com/vin/" + vin + "/account/landmarkmotors");
    };
};


function tytspecs() {
    if (vincheckin()) {
        window.open(awsserv + "/toyota?vin=" + vin);
    };
};
function lxsspecs() {
    if (vincheckin()) {
        window.open(awsserv + "/lexus?vin=" + vin);
    };
};
function invoice() {
    if (vincheckin()) {
        window.open(awsserv + "/invoice?vin=" + vin);
    };
};
function wclutch() {
    if (vincheckin()) {
        window.open("https://www.withclutch.com//window-stickers");
        // window.open(awsserv + "/clutch2?vin=" + vin);
    };
};
function hclutch() {
    if (vincheckin()) {
        window.open(awsserv + "/hclutch?vin=" + vin);
    };
};



// Function to show or hide divs based on the car make
function displayDivsForMake(aMake) {
// Define an object mapping car makes to their corresponding div IDs
const makeDivMap = {
    "HYUK": ["hyundai_div", "kia_div"],
    "INNIS": ["infiniti_div", "nissan_div"],
    "LETOY": ["lexus_div", "toyota_div"],
    "AUDI": ["audi_div"],
    "VOLKSWAGEN": ["audi_div"],
    "BENTLEY": ["audi_div"],
    "BMW": ["bmw_div"],
    "MINI": ["bmw_div"],
    "ALPINA": ["bmw_div"],
    "CHRYSLER": ["chrysler_div"],
    "DODGE": ["chrysler_div"],
    "JEEP": ["chrysler_div"],
    "RAM": ["chrysler_div"],
    "ALFA ROMEO": ["chrysler_div"],
    "FIAT": ["chrysler_div"],
    "FORD": ["ford_div"],
    "LINCOLN": ["ford_div"],
    "MERCURY": ["ford_div"],
    "CHEVROLET": ["gm_div"],
    "BUICK": ["gm_div"],
    "CADILLAC": ["gm_div"],
    "GMC": ["gm_div"],
    "HONDA": ["honda_div"],
    "ACURA": ["honda_div"],
    "HYUNDAI": ["hyundai_div"],
    "GENESIS": ["hyundai_div"],
    "INFINITI": ["nissaninfiniti_div"],
    "NISSAN": ["nissaninfiniti_div"],
    "KIA": ["kia_div"]
    "LAND ROVER": ["lr_div"],
    "JAGUAR": ["lr_div"],
    "LEXUS": ["lexus_div"],
    "LETOY": ["lexus_div", "toyota_div"],
    "MASERATI": ["maserati_div"],
    "MAZDA": ["mazda_div"],
    "MERCEDES-BENZ": ["mb_div"],
    "SMART": ["mb_div"],
    "MITSUBISHI": ["mitsubishi_div"],
    "SUZUKI": ["mitsubishi_div"],
    "PORSCHE": ["porsche_div"],
    "SUBARU": ["subaru_div"],
    "TESLA": ["tesla_div"],
    "TOYOTA": ["toyota_div"],
    "VOLVO": ["volvo_div"]
};
    // Always display common_div
    document.getElementById("common_div").classList.remove('d-none');

    // Hide all divs first
    Object.values(makeDivMap).flat().forEach(divId => {
        if (divId !== "common_div") { // Skip hiding common_div
            document.getElementById(divId).classList.add('d-none');
        }
    });

    // Show divs for the selected make
    if (makeDivMap[aMake]) {
        makeDivMap[aMake].forEach(divId => {
            document.getElementById(divId).classList.remove('d-none');
        });
    }
}


function updatedisplay(manu) {

    if (manu !== "" && typeof manu !== 'undefined') {
        aMake = manu;
        document.getElementById("txt_results").valUnexpectedue = "Search VIN to retrieve details";
        document.getElementById("output").innerText = "Search VIN to retrieve details";
    };

    console.log("updating divs " + aMake);
// Call the function with the current make
    displayDivsForMake(aMake);
};

// <!-- MANUFACTURER LINKS  -->

// Function to check if the browser is authenticated
function checkAuthentication(url) {
  // Create a new XMLHttpRequest
  var xhr = new XMLHttpRequest();

  // Define the type of request and the URL of the server endpoint
  xhr.open('GET', url, true);

  // Set up a function that is called when the request status changes
  xhr.onreadystatechange = function() {
    // Check if the request is complete
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // If the status code is 200, the browser is authenticated
      if (xhr.status === 200) {
        console.log('Browser is authenticated.');
        // Handle the case where the browser is authenticated
      } else {
        console.log('Browser is not authenticated.');
        // Handle the case where the browser is not authenticated
      }
    }
  };

  // Send the request
  xhr.send();
}

// Example usage
//checkAuthentication('https://your-apache-server.com/protected-resource');


function isAuthorized() {
    //try {
    //    const isAuthorizedResponse = $.ajax({
    //        url: awsserv + "/auth",
    //        async: false, // Make the request synchronous
    //    });

   //     const isAuthorizedStatus = isAuthorizedResponse.status;

    const isAuthorizedStatus = checkAuthentication(awsserv + "/auth");
    
        if (isAuthorizedStatus === 401) {
            return false;
        } else {
            return true;
        }
    //} catch (error) {
    //    console.error('Error fetching URL:', error);
    //}
}

function vincheckin() {
    if (vin.length === 17) {
                if (isAuthorized()) {
                    return true;
                } else {
                    alert("Please Login");
                    window.open(awsserv);
                }
        
    } else {
        alert("VIN number should be 17 digits long, currently " + vin.length + " digits entered.");
        return false;
    };
};


function autobrochures() {
    if (aMake !== "" && typeof aMake !== 'undefined') {
        window.open(" http://www.auto-brochures.com/" + aMake + ".html");
    } else {
        window.open(" http://www.auto-brochures.com/");
    };
};

function bimmerbtn() {
    if (vincheckin()) {
        window.open("https://www.mdecoder.com/decode/" + vin.slice(-7));
    };
};

function bmwlane() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "http://windowsticker-prod.awsmdotcom.manheim.com/windowsticker/BMW/" + vin);
    };
};

function chrysler() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "https://www.chrysler.com/hostd/windowsticker/getWindowStickerPdf.do?vin=" + vin);
    };
};

function chryslerlist() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "http://www.jeep.com/webselfservice/BuildSheetServlet?vin=" + vin);
    };
};

function chryslerlist2() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "http://www.chrysler.com/webselfservice/BuildSheetServlet?vin=" + vin);
    };
};

function chryslerlist3() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "http://www.dodge.com/webselfservice/BuildSheetServlet?vin=" + vin);
    };
};

function decoderz() {
    if (vincheckin()) {
        window.open("https://www.vindecoderz.com/EN/check-lookup/" + vin);
    };
};
function siriusxm() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "https://care.siriusxm.com/vinlookup_findVin.action?vin=" + vin);
    };
};

function bidhistory() {
    if (vincheckin()) {
        window.open("https://en.bidhistory.org/search/?search=" + vin);
    };
};

function ford() {
    if (vincheckin()) {
        window.open("https://www.etis.ford.com/selectedVehicleDetails.do#vin=" + vin);
    };
};

function fordsticker() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "http://www.windowsticker.forddirect.com/windowsticker.pdf?vin=" + vin);
    };
};

function fordstickerkey() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "https://imola.adesa.com/auction-engine-web-api/encryptVin.json?cgId=947&sellerOrgId=201721&isRunList=1&vin=" + vin);
    };
};

function fordstickerkey2() {
    if (document.getElementById("mkey").value !== "") {
        var keyme = document.getElementById("mkey").value;
        window.open(awsserv + "/ps?url=" + "https://windowsticker.concentrix.com/windowsticker/auction_ws/index.htm?sProgramCode=FORD_VR&loginId=1&quic_param=" + keyme);
    };
};


function fordwiki() {
    if (vincheckin()) {
        window.open(awsserv + "/ford?vin=" + vin);
    };
};

function gmlink() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "https://windowsticker-prod.aws.manheim.com/showGmWs?auctionID=&workOrderNumber=7055030&sblu=11546249&vin=" + vin);
    };
};
function gmlink2() {
    if (vincheckin()) {
        //window.open("https://www.koonswhitemarshchevy.com/api/legacy/pse/windowsticker/gm?bac=113645&vin=" + vin);
        window.open(awsserv + "/ps?url=" + "https://www.henrybrowngmc.com/services/gm/windowSticker.do?dealerCode=210275&cs:o=%window_sticker%&cs:o=%27WindowSticker%27&vin=" + vin);
    };
};


function hyunwiki() {
    if (vincheckin()) {
        //window.open("http://www.mikemillerhyundai.com/services/hyundai/windowSticker.do?vin=" + vin);
        window.open(awsserv + "/ps?url=" + "https://hyundai-sticker.dealerfire.com/new/" + vin);
        //window.open("https://www.nashuahyundai.com/services/hyundai/windowSticker.do?make=Hyundai&cs:o=%27windowsticker%27&vin=" + vin);
    };
};

function infiniti() {
    if (vincheckin()) {
        window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
        setTimeout(function () {
            window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
        }, 2000);
    };
};

function infinititrm() {
    if (vincheckin()) {
        window.open("https://www.infinitiusa.com/recalls-vin/#/#/Results/" + vin);
    };
};

function kiabtn2() {
    if (vincheckin()) {
        // window.open("https://www.kia.com/us/services/us/windowsticker/load/" + vin);
        //window.open("https://www.commonwealthkia.com/Api/api/pdf/kia-oem-windows-sticker?accountid=56177&vin=" + vin);
        //window.open("https://www.ourismankia.com/api/legacy/pse/windowsticker/kia?vin=" + vin);
        //window.open("https://www.lehightonkia.com/api/pdf/kia-oem-windows-sticker?accountid=43339&vin=" + vin);
        window.open(awsserv + "/ps?url=" + "https://www.freedomkia.net/Api/api/pdf/kia-oem-windows-sticker?vin=" + vin + "&accountid=37593");
    };
};

function kiabtn3() {
    if (vincheckin()) {
        //var xhttp = new XMLHttpRequest();
        //xhttp.open("GET", "https://www.kia.com", true);
        //xhttp.send();
        
        var winkia = window.open("https://www.kia.com", '_blank');
        setTimeout(function () {
            winkia.close();
            window.open("https://www.kia.com/us/en/data/dealerinventory/windowsticker/" + vin);
        }, 3000);
    };
};

function manheimmmr() {
    if (vincheckin()) {
        window.open("https://mmr.manheim.com/?WT.svl=m_hdr_mnav_buy_mmr&country=US&popup=true&source=man&vin=" + vin);
    };
};

function manheimsearch() {
    if (vincheckin()) {
        window.open("https://www.manheim.com/members/powersearch/keywordSearchResults.do?searchTerms=" + vin);
    };
};
function maserati() {
    if (vincheckin()) {
        //window.open("https://www.maseratimarin.com/api/legacy/pse/windowsticker/maserati?vin=" + vin + "&country=US&language=en");
        window.open(awsserv + "/ps?url=" + "https://www.herbchambers.com/api/legacy/pse/windowsticker/maserati?country=US&language=en&vin=" + vin );
    };
};

function mazdabtn() {
    if (vincheckin()) {
        window.open("https://www.mazdausa.com/MusaWeb/displayDealerWindowSticker.action?vin=" + vin + "&dealerId=51622");
    };
};

function mazdabtn2() {
    if (vincheckin()) {
        window.open("https://windowsticker.minacs.com/generate/ws_print_caller.cfm?request_type=IP&vin=" + vin + "&pc=SIMULCAST_MZ&ari=&lane_num=&run_num=&param2=56cee0f6e93cd16f9aa1d1ca8cfe73e1");
    };
};

function miniog() {
    if (document.getElementById("myear").value === "") {
        if (aYear !== "" && aModel !== "" && typeof aModel !== 'undefined' && typeof aYear !== 'undefined') {
            var srch = aYear + " +" + aModel;
            window.open("https://www.google.com/search?q=" + srch + " +ordering+guide+site%3Aminimedia.iconicweb.com");
        } else {
            aYear = prompt("What year is the vehicle?");
            aModel = prompt("What model is the vehicle?");
            var srch = aYear + " +" + aModel;
            window.open("https://www.google.com/search?q=" + srch + " +ordering+guide+site%3Aminimedia.iconicweb.com");
        };
    } else {
        var srch = document.getElementById("myear").value + " +" + document.getElementById("mmodel").value;
        window.open("https://www.google.com/search?q=" + srch + " +ordering+guide+site%3Aminimedia.iconicweb.com");
    };

};

function mitsbtn() {
    if (vincheckin()) {
        window.open(awsserv + "/ps?url=" + "https://www.yorkmitsubishi.com/api/OEMProgramsCommon/MitsubishiWindowStickerUrl?vin=" + vin);
        //window.open("https://www.fitzgeraldmitsubishi.com/api/legacy/pse/windowsticker/mitsubishi?vin=" + vin);
        //window.open("https://www.mitsubishicars.com/rs/file/monroney?vin=" + vin);
    };
};

function nissan() {
    if (vincheckin()) {
        window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
        setTimeout(function () {
            window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
        }, 2000);
    };
};

function nissantrm() {
    if (vincheckin()) {
        window.open("https://www.nissanusa.com/recalls-vin/#/#/Results/" + vin);
    };
};

function porwiki() {
    if (vincheckin()) {
        window.open("https://vinanalytics.com/car/" + vin + "/" + vin + ".pdf");
    };
};

function subarusticker() {
    if (vincheckin()) {
        window.open("https://www.wilkinssubaru.com/api/legacy/pse/windowsticker/subaru?vin=" + vin);
    };
};
function subaru() {
    if (vincheckin()) {
        window.open("https://www.subaru.com/owners/vehicle-resources/equipment.html?modelCode=" + vin);
    };
};
function honda2() {
    if (vincheckin()) {
        window.open(awsserv + "/honda?vin=" + vin);
    };
};
function acura() {
    if (vincheckin()) {
        window.open(awsserv + "/acura?vin=" + vin);
    };
};
function subaru2() {
    if (vincheckin()) {
        window.open(awsserv + "/subaru?vin=" + vin);
    };
};
function tesla() {

    if (aModel !== "" && typeof aModel !== 'undefined' && aMake !== "" && typeof aMake !== 'undefined' && aYear !== "" && typeof aYear !== 'undefined') {
        if (aModel.substring(0, 5) === "MODEL" || aModel.substring(0, 5) === "Model") {

            var mdlad = aModel.replace(/ /g, "_");
            mdlad = mdlad.toLowerCase();
            window.open("https://www.cars.com/research/" + aMake.toLowerCase() + "-" + mdlad + "-" + aYear + "/trims/");
        } else {
            alert("Click on search icon to retrieve VIN details first");
        };
    } else {
        aYear = prompt("What year is the vehicle?");
        aModel = prompt("What model is the vehicle? (Enter only X, 3, S, ...");
        aModel = "MODEL " + aModel;
        var mdlad = aModel.replace(/ /g, "_");
        mdlad = mdlad.toLowerCase();
        window.open("https://www.cars.com/research/" + "tesla" + "-" + mdlad + "-" + aYear + "/trims/");
    };
};
function tesla2() {
    if (vincheckin()) {
        window.open("https://tesla-info.com/inventory.php?country=US&state=&sale=All&min=&max=9999999&milemin=&milemax=&ap=All&model=All&variant=All&title=undefined&minyear=2008&maxyear=2022&colour=All&interior=All&seats=All&wheels=0&titlestat=All&minrange=&search=" + vin);
        //window.open("https://tesla-info.com/car/US-" + vin);
    };
};
function teslam() {
    if (aModel !== "" && typeof aModel !== 'undefined') {
        if (aModel.substring(0, 5) === "MODEL" || aModel.substring(0, 5) === "Model") {

            var mdlad = aModel.replace(/ /g, "_");
            mdlad = mdlad.toLowerCase();
            if (mdlad === "model_s") {
                window.open("https://www.tesla.com/sites/default/files/" + mdlad + "_owners_manual_north_america_en_us.pdf");
            } else {
                window.open("https://www.tesla.com/sites/default/files/" + mdlad + "_owners_manual_north_america_en.pdf");
            }
        } else {
            alert("Click on search icon to retrieve VIN details first");
        };
    } else {
        aModel = prompt("What model is the vehicle? (Enter only X, 3, S, ...");
        aModel = "MODEL " + aModel;
        var mdlad = aModel.replace(/ /g, "_");
        mdlad = mdlad.toLowerCase();
        window.open("https://www.tesla.com/sites/default/files/" + mdlad + "_owners_manual_north_america_en.pdf");
    };
};

function volvosticker() {
    if (vincheckin()) {
        //window.open("https://www.koonsvolvocarswhitemarsh.com/api/legacy/pse/windowsticker/volvo?vin=" + vin);
        window.open("https://volvocars.niello.com/api/legacy/pse/windowsticker/volvo?vin=" + vin);
    };
};

function vwaudilane() {
    if (vincheckin()) {
        //window.open("http://windowsticker-prod.aws.manheim.com/windowsticker/" + vin + "/4905414");
        window.open(awsserv + "/ps?url=" + "http://windowsticker-prod.awsmdotcom.manheim.com/windowsticker/" + vin + "/4905414");
    };

};

function hitcher() {
    if (aModel !== "" && typeof aModel !== 'undefined') {
        console.log("pulling hitch")
        window.open("https://www.etrailer.com/hitch-" + aYear + "_" + aMake + "_" + aModel + ".htm");
    };
};
