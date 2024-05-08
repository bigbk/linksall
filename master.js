/**
 * Copies the provided text to the clipboard.
 * @param {string} text - The text to be copied to the clipboard.
 */
function copyToClipboard(text) {
    // Use the Clipboard API to write text
    navigator.clipboard.writeText(text)
        .then(function() {
            // Log success message to the console
            console.log('Copying to clipboard was successful!');
        }, function(err) {
            // Log error message to the console if the copy fails
            console.error('Could not copy text: ', err);
        });
}

/**
 * Updates the display with the manufacturer information.
 * @param {string} manufacturer - The manufacturer name to display.
 */
function updateDisplaynew(manufacturer) {
   // Update the display with the manufacturer information
    console.log(`Display updated with: ${manufacturer}`);
    // Add additional display update logic here
}
    
    
 /**
 * Initiates a call to retrieve vehicle information based on the VIN entered.
 */
function Call() {
    // Retrieve the VIN number entered by the user
    vin = document.getElementById("VINbar").value.trim().toUpperCase().replace(/[{}]/g, "");
    document.getElementById("VINbar").value = vin;

    // Display a message to click on the search icon to retrieve details
    document.getElementById("txt_results").value = "Click on Search icon to retrieve details";
    document.getElementById("output").innerText = `Click on Search icon to retrieve details. VIN number should be 17 digits long, currently ${vin.length} digits entered.`;
    document.getElementById("outputbox").style.display = 'block';

    // Log the length of the VIN for debugging
    console.log(`VIN length: ${vin.length}`);

    // Fetch the VIN data from a local JSON file
    fetch("vin.json")
        .then(response => response.json())
        .then(data => {
            // Search for the manufacturer using the WMI (World Manufacturer Identifier)
            let wmisearch = vin.substring(0, 3);
            let aMake = data.find(entry => entry.WMI === wmisearch)?.Manufacturer || '';

            // Log the manufacturer found and update the display
            if (aMake) {
                console.log(`Manufacturer found using JSON data: ${aMake}`);
                updateDisplay(aMake);
            }
        });

    // If the VIN is 17 characters long, copy it to the clipboard and fetch additional data
    if (vin.length === 17) {
        copyToClipboard(vin);
        document.getElementById("VINbar").focus();
        getNHTSADataByVIN(vin);
    }
}

function getNHTSADataByVIN(param_vin) {
    if (!param_vin) {
        console.error('No VIN provided');
        return;
    }

    $.ajax({
        url: "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/",
        type: "POST",
        data: { format: "json", data: param_vin },
        dataType: "json",
        success: function (result) {
            console.log(result);
            var vehicleData = result.Results[0];
            var displayData = {
                aYear: vehicleData.ModelYear || "",
                aMake: vehicleData.Make || "",
                aModel: vehicleData.Model || "",
                aSeries: vehicleData.Series || "",
                aTrim: vehicleData.Trim || "",
                aDisp: vehicleData.DisplacementL ? parseFloat(vehicleData.DisplacementL).toFixed(1) + "L" : "",
                aFuel: vehicleData.FuelTypePrimary || "",
                aCyl: vehicleData.EngineCylinders ? vehicleData.EngineCylinders + "cyl" : "",
                aDrive: vehicleData.DriveType || "",
                aDoor: vehicleData.Doors ? vehicleData.Doors + "D" : "",
                aCab: vehicleData.BodyCabType || "",
                aBody: vehicleData.BodyClass || ""
            };

            console.log("pulled " + displayData.aMake);
            console.log('full data: ' + formatOutputText(displayData))
            updateInputFields(displayData);
            document.getElementById("output").innerText = formatOutputText(displayData);
            document.getElementById("outputbox").style.display = 'block';
//            if (aMake) {
//                console.log(`Manufacturer found using NHTSA data: ${aMake}`);
//                updateDisplay(aMake);
//            };
            displayNHTSAResults(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error('Error fetching data: ' + xhr.status);
            console.error(thrownError);
        }
    });
}

function updateInputFields(data) {
    document.getElementById("iyear").value = data.aYear;
    document.getElementById("imake").value = data.aMake;
    document.getElementById("imodel").value = data.aModel;
    document.getElementById("icyl").value = data.aCyl || "";
}

function formatOutputText(data) {
    return `${data.aYear} ${data.aMake} ${data.aModel} ${data.aSeries} ${data.aTrim}, ${data.aDisp} ${data.aFuel}, ${data.aCyl} \n ${data.aDoor}${data.aCab} ${data.aBody}, ${data.aDrive} \r\n (Please note that this information is sourced from NHTSA and should not be relied upon as the sole source of trim data.)`;
}

function displayNHTSAResults(param_data) {
    var output_text = "";
    param_data.Results.forEach(function(result) {
        for (var prop in result) {
            if (result.hasOwnProperty(prop) && result[prop] !== "") {
                output_text += `${prop}: ${result[prop]}\n`;
            }
        }
    });

    document.getElementById("txt_results").value = output_text;
    document.getElementById("nhtsa_data").style.display = 'block';
//    updateDisplay(aMake);
    console.log(`Manufacturer found using NHTSA data: ` + param_data.Results[0].Make);
    updateDisplay(param_data.Results[0].Make);
}

// Function to open a window with the vehicle sticker or specs
function openWindowWithVin(url) {
    vincheckin(function(isValidAndAuthorized) {
        if (isValidAndAuthorized) {
            window.open(url);
        }
    });
}

function openWindowWithVin2(url) {
    vincheckin(function(isValidAndAuthorized) {
        if (isValidAndAuthorized) {
            // Encode the VIN
            var encodedURL = encodeURIComponent(url);
            // Obfuscate the encoded VIN
            var obfuscatedURL = btoa(encodedURL); // Base64 encode
            // Construct the URL with the obfuscated VIN
            var finalurl = awsserv + "/ps?url=" + obfuscatedURL;
            // Open the window with the obfuscated URL
            window.open(finalurl);
        }
    });
}

// Refactored functions using openWindowWithVin
function getnissansticker2() {
    openWindowWithVin(`${piserv}/nissan?vin=${vin}`);
}

function getnissansticker3() {
    openWindowWithVin2(`https://www.carsonnissan.com/api/legacy/pse/windowsticker/nissan?vin=${vin}`);
}

function getnissansticker4() {
    openWindowWithVin2(`https://nissan-services.web-aws.dealersocket.com/production/sticker/${vin}`);
    //This one still works -> window.open("https://nissan-services.web-aws.dealersocket.com/production/sticker/" + vin);
    //window.open("https://www.autonationnissanchandler.com/api/legacy/pse/windowsticker/nissan?vin=" + vin);
}

function toyotasticker() {
    //openWindowWithVin2(`https://api.toyotainventory.com/VEHICLES/${vin}/monroney`);
    openWindowWithVin2(`https://www.royalsouthtoyota.com/api/OEMProgramsCommon/ToyotaDDOAWindowSticker?vin=${vin}`);
}

function toyotasticker3() {
    openWindowWithVin2(`https://api-windowsticker.web-aws.dealersocket.com/toyota/${vin}`);
}

function velocitysticker() {
    openWindowWithVin2(`https://windowsticker.velocityengage.com/vin/${vin}/account/landmarkmotors`);
}

function tytspecs() {
    openWindowWithVin(`${awsserv}/toyota?vin=${vin}`);
}

function lxsspecs() {
    openWindowWithVin(`${awsserv}/lexus?vin=${vin}`);
}

function invoice() {
    openWindowWithVin(`${awsserv}/invoice?vin=${vin}`);
}

function wclutch() {
    openWindowWithVin2(`https://www.withclutch.com/window-stickers`);
}

function hclutch() {
    openWindowWithVin(`${awsserv}/hclutch?vin=${vin}`);
}
    

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
        "KIA": ["kia_div"],
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
    
    
/**
 * Updates the display with the provided manufacturer's information.
 * @param {string} manu - The manufacturer's name.
 */
function updateDisplay(manu) {
    // Check if the manufacturer's name is provided and not undefined
    if (manu && typeof manu !== 'undefined') {
        // Update the global variable aMake with the manufacturer's name
        aMake = manu;

        // Update the text results and output elements with a message to search VIN
//        document.getElementById("txt_results").value = "Search VIN to retrieve details";
//        document.getElementById("output").innerText = "Search VIN to retrieve details";

        // Log the update action with the manufacturer's name
        console.log(`Updating divs with manufacturer: ${aMake}`);

        // Call the function to display divs for the current manufacturer
        displayDivsForMake(aMake);
    }
}

// <!-- MANUFACTURER LINKS  -->
    
/**
 * Checks if the browser is authenticated by making a GET request to the provided URL.
 * @param {string} url - The URL to check for authentication.
 * @param {function} callback - The callback function to execute with the result.
 */
function checkAuthentication(url, callback) {
    // Create a new XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // Define the type of request and the URL of the server endpoint
    xhr.open('GET', url, true);

    // Set up a function that is called when the request status changes
    xhr.onreadystatechange = function() {
        // Check if the request is complete
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // Call the callback function with the status code
            callback(xhr.status);
        }
    };

    // Send the request
    xhr.send();
}

/**
 * Determines if the current session is authorized based on the authentication check.
 * @param {function} callback - The callback function to execute with the authorization status.
 */
function isAuthorized(callback) {
    // Perform the authentication check
    // checkAuthentication(awsserv + "/auth", function(status) {
    checkAuthentication("https://www.google.com", function(status) {
        // Call the callback function with the result of the authorization check
        callback(status !== 401);
    });
}

// Example usage
isAuthorized(function(authorized) {
    if (authorized) {
        console.log('User is authorized.');
    } else {
        console.log('User is not authorized.');
    }
});

/**
 * Checks if the VIN is valid and if the user is authorized.
 * @param {function} callback - A callback function that receives the check result.
 */
function vincheckin(callback) {
    // Check if the VIN number is 17 digits long
    if (vin.length === 17) {
        // Perform the authorization check
        isAuthorized(function(authorized) {
            if (authorized) {
                console.log('User is authorized.');
                callback(true); // Call the callback with true to indicate success
            } else {
                console.log('User is not authorized.');
                alert("Please Login");
                window.open(awsserv); // Open the AWS service login page
                callback(false); // Call the callback with false to indicate failure
            }
        });
    } else {
        console.log(`VIN length: ${vin.length}`);
        alert("VIN number should be 17 digits long, currently " + vin.length + " digits entered.");
        callback(false); // Call the callback with false since the VIN is not valid
    }
}

// Example usage of vincheckin
// vincheckin(function(isValidAndAuthorized) {
//    if (isValidAndAuthorized) {
//        console.log('VIN is valid and user is authorized.');
//        // Proceed with the next steps
//    } else {
//        console.log('VIN is invalid or user is not authorized.');
//        // Handle the error case
//    }
//});  


function autobrochures() {
    if (aMake !== "" && typeof aMake !== 'undefined') {
        openWindowWithVin("http://www.auto-brochures.com/" + aMake + ".html");
    } else {
        openWindowWithVin("http://www.auto-brochures.com/");
    }
}

function bimmerbtn() {
    openWindowWithVin("https://www.mdecoder.com/decode/" + vin.slice(-7));
}

function bmwlane() {
    openWindowWithVin2("http://windowsticker-prod.awsmdotcom.manheim.com/windowsticker/BMW/" + vin);
}

function chrysler() {
    openWindowWithVin2("https://www.chrysler.com/hostd/windowsticker/getWindowStickerPdf.do?_ga=2.123817667.856222938.1715011172-964708610.1715011172&vin=" + vin);
}

function chryslerlist() {
    openWindowWithVin2("http://www.jeep.com/webselfservice/BuildSheetServlet?vin=" + vin);
}

function chryslerlist2() {
    openWindowWithVin2("http://www.chrysler.com/webselfservice/BuildSheetServlet?vin=" + vin);
}

function chryslerlist3() {
    openWindowWithVin2("http://www.dodge.com/webselfservice/BuildSheetServlet?vin=" + vin);
}

function decoderz() {
    openWindowWithVin("https://www.vindecoderz.com/EN/check-lookup/" + vin);
}

function siriusxm() {
    openWindowWithVin2("https://care.siriusxm.com/vinlookup_findVin.action?vin=" + vin);
}

function bidhistory() {
    openWindowWithVin("https://en.bidhistory.org/search/?search=" + vin);
}

function ford() {
    openWindowWithVin("https://www.etis.ford.com/selectedVehicleDetails.do#vin=" + vin);
}

function fordsticker() {
    openWindowWithVin2("http://www.windowsticker.forddirect.com/windowsticker.pdf?vin=" + vin);
}

function fordstickerkey() {
    openWindowWithVin2("https://imola.adesa.com/auction-engine-web-api/encryptVin.json?cgId=947&sellerOrgId=201721&isRunList=1&vin=" + vin);
}

function fordstickerkey2() {
    var keyme = document.getElementById("mkey").value;
    if (keyme !== "") {
        openWindowWithVin2("https://windowsticker.concentrix.com/windowsticker/auction_ws/index.htm?sProgramCode=FORD_VR&loginId=1&quic_param=" + keyme);
    }
}

function fordwiki() {
    openWindowWithVin(awsserv + "/ford?vin=" + vin);
}

function gmlink() {
    openWindowWithVin2("https://windowsticker-prod.aws.manheim.com/showGmWs?auctionID=&workOrderNumber=7055030&sblu=11546249&vin=" + vin);
}

function gmlink2() {
    openWindowWithVin2("https://www.henrybrowngmc.com/services/gm/windowSticker.do?dealerCode=210275&cs:o=%window_sticker%&cs:o=%27WindowSticker%27&vin=" + vin);
    //window.open("https://www.koonswhitemarshchevy.com/api/legacy/pse/windowsticker/gm?bac=113645&vin=" + vin);
}

function hyunwiki() {
    openWindowWithVin2("https://hyundai-sticker.dealerfire.com/new/" + vin);
    //window.open("http://www.mikemillerhyundai.com/services/hyundai/windowSticker.do?vin=" + vin);
    //window.open("https://www.nashuahyundai.com/services/hyundai/windowSticker.do?make=Hyundai&cs:o=%27windowsticker%27&vin=" + vin);
}

function infiniti() {
    vincheckin(function(isValidAndAuthorized) {
        if (isValidAndAuthorized) {
            window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
            setTimeout(function () {
                window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
            }, 2000);
        }
    });
}

function infinititrm() {
    openWindowWithVin("https://www.infinitiusa.com/recalls-vin/#/#/Results/" + vin);
}

function kiabtn2() {
    // window.open("https://www.kia.com/us/services/us/windowsticker/load/" + vin);
    // window.open("https://www.commonwealthkia.com/Api/api/pdf/kia-oem-windows-sticker?accountid=56177&vin=" + vin);
    // window.open("https://www.ourismankia.com/api/legacy/pse/windowsticker/kia?vin=" + vin);
    // window.open("https://www.lehightonkia.com/api/pdf/kia-oem-windows-sticker?accountid=43339&vin=" + vin);
    openWindowWithVin2("" + "https://www.freedomkia.net/Api/api/pdf/kia-oem-windows-sticker?vin=" + vin + "&accountid=37593");
}

function kiabtn3() {
    vincheckin(function(isValidAndAuthorized) {
        if (isValidAndAuthorized) {
            var winkia = window.open("https://www.kia.com", '_blank');
            setTimeout(function () {
                winkia.close();
                window.open("https://www.kia.com/us/en/data/dealerinventory/windowsticker/" + vin);
            }, 3000);
        }
    });
}

function manheimmmr() {
    openWindowWithVin("https://mmr.manheim.com/?WT.svl=m_hdr_mnav_buy_mmr&country=US&popup=true&source=man&vin=" + vin);
}

function manheimsearch() {
    openWindowWithVin("https://www.manheim.com/members/powersearch/keywordSearchResults.do?searchTerms=" + vin);
}

function maserati() {
    // window.open("https://www.maseratimarin.com/api/legacy/pse/windowsticker/maserati?vin=" + vin + "&country=US&language=en");
    openWindowWithVin2("https://www.herbchambers.com/api/legacy/pse/windowsticker/maserati?country=US&language=en&vin=" + vin);
}

function mazdabtn() {
    openWindowWithVin("https://www.mazdausa.com/MusaWeb/displayDealerWindowSticker.action?vin=" + vin + "&dealerId=51622");
}

function mazdabtn2() {
    openWindowWithVin("https://windowsticker.minacs.com/generate/ws_print_caller.cfm?request_type=IP&vin=" + vin + "&pc=SIMULCAST_MZ&ari=&lane_num=&run_num=&param2=56cee0f6e93cd16f9aa1d1ca8cfe73e1");
}

function miniog() {
    // Get the year and model values from the input fields or prompt the user if they are empty
    var yearInput = document.getElementById("myear");
    var modelInput = document.getElementById("mmodel");
    var aYear = yearInput && yearInput.value ? yearInput.value.trim() : prompt("What year is the vehicle?");
    var aModel = modelInput && modelInput.value ? modelInput.value.trim() : prompt("What model is the vehicle?");

    // Check if the year and model are provided
    if (aYear && aModel) {
        // Construct the search query
        var srch = encodeURIComponent(aYear + " " + aModel + " ordering guide site:minimedia.iconicweb.com");
        // Open the Google search results in a new window
        window.open("https://www.google.com/search?q=" + srch);
    } else {
        // Alert the user if the year or model is missing
        alert("Please provide both the year and the model of the vehicle.");
    }
}


function mitsbtn() {
    // window.open("https://www.fitzgeraldmitsubishi.com/api/legacy/pse/windowsticker/mitsubishi?vin=" + vin);
    // window.open("https://www.mitsubishicars.com/rs/file/monroney?vin=" + vin);
    openWindowWithVin2("https://www.yorkmitsubishi.com/api/OEMProgramsCommon/MitsubishiWindowStickerUrl?vin=" + vin);
}

function nissan() {
    vincheckin(function(isValidAndAuthorized) {
        if (isValidAndAuthorized) {
            window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
            setTimeout(function () {
                window.open("https://www.oemstickers.com/WindowSticker.php?vin=" + vin);
            }, 2000);
        }
    });
}

function nissantrm() {
    openWindowWithVin("https://www.nissanusa.com/recalls-vin/#/#/Results/" + vin);
}

function porwiki() {
    openWindowWithVin("https://vinanalytics.com/car/" + vin + "/" + vin + ".pdf");
}

function subarusticker() {
    openWindowWithVin("https://www.wilkinssubaru.com/api/legacy/pse/windowsticker/subaru?vin=" + vin);
}

function subaru() {
    openWindowWithVin("https://www.subaru.com/owners/vehicle-resources/equipment.html?modelCode=" + vin);
}

function honda2() {
    openWindowWithVin(awsserv + "/honda?vin=" + vin);
}

function acura() {
    openWindowWithVin(awsserv + "/acura?vin=" + vin);
}

function subaru2() {
    openWindowWithVin(awsserv + "/subaru?vin=" + vin);
}


function tesla(aModel, aMake = 'tesla', aYear) {
    // Trim the input strings to remove any leading/trailing whitespace
    aModel = aModel.trim();
    aMake = aMake.trim();
    aYear = aYear.trim();

    // Check if the model starts with 'MODEL' or 'Model', and if all parameters are provided
    if (aModel.toLowerCase().startsWith('model') && aMake && aYear) {
        // Replace spaces with underscores and convert to lowercase
        const modelSlug = aModel.replace(/ /g, '_').toLowerCase();
        const makeSlug = aMake.toLowerCase();
        // Construct the URL using template literals
        const url = `https://www.cars.com/research/${makeSlug}-${modelSlug}-${aYear}/trims/`;
        window.open(url);
    } else {
        // Prompt the user for missing details
        aYear = aYear || prompt('What year is the vehicle?');
        aModel = aModel || prompt('What model is the vehicle? (Enter only X, 3, S, ...');
        // Prepend 'MODEL' if not present
        aModel = aModel.toUpperCase().startsWith('MODEL') ? aModel : `MODEL ${aModel}`;
        // Repeat the process after getting the input
        openTeslaTrimPage(aModel, aMake, aYear);
    }
}


function tesla2() {
    openWindowWithVin("https://tesla-info.com/inventory.php?country=US&state=&sale=All&min=&max=9999999&milemin=&milemax=&ap=All&model=All&variant=All&title=undefined&minyear=2008&maxyear=2022&colour=All&interior=All&seats=All&wheels=0&titlestat=All&minrange=&search=" + vin);
}

function teslam(aModel) {
    // Trim the input to remove any leading/trailing whitespace and ensure it's a string
    aModel = String(aModel).trim();

    // Check if the model is not empty and is defined
    if (aModel) {
        // Convert the model string to uppercase for consistency
        aModel = aModel.toUpperCase();

        // Check if the model starts with 'MODEL'
        if (aModel.startsWith('MODEL')) {
            // Replace spaces with underscores and convert to lowercase for the URL
            var mdlad = aModel.replace(/ /g, "_").toLowerCase();

            // Determine the correct owner's manual URL based on the model
            var manualUrl = "https://www.tesla.com/sites/default/files/" + mdlad + "_owners_manual_north_america_en.pdf";
            if (mdlad === "model_s") {
                manualUrl = "https://www.tesla.com/sites/default/files/" + mdlad + "_owners_manual_north_america_en_us.pdf";
            }

            // Open the owner's manual URL
            window.open(manualUrl);
        } else {
            alert("Please enter a valid Tesla model starting with 'MODEL'.");
        }
    } else {
        // Prompt the user for the model if it's not provided
        aModel = prompt("What model is the vehicle? (Enter only X, 3, S, ...");
        // Prepend 'MODEL' if not present and retry
        teslam("MODEL " + aModel);
    }
}


function volvosticker() {
    openWindowWithVin("https://volvocars.niello.com/api/legacy/pse/windowsticker/volvo?vin=" + vin);
}

function vwaudilane() {
    openWindowWithVin2("http://windowsticker-prod.awsmdotcom.manheim.com/windowsticker/" + vin + "/4905414");
}

function hitcher() {
    aYear = document.getElementById("iyear").value;
    aMake = document.getElementById("imake").value;
    aModel = document.getElementById("imodel").value;
    if (aModel !== "" && typeof aModel !== 'undefined') {
        console.log("pulling hitch");
        window.open("https://www.etrailer.com/hitch-" + aYear + "_" + aMake + "_" + aModel + ".htm");
    }
}

    
