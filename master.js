
    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        // Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }



    function Call() {
        vin = document.getElementById("VINbar").value;
        var wmidata = $.getJSON("https://bigbk.github.io/links2/vin.json");
        console.log("wmidata "+ wmidata);
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

            var wmisearch = onethree;
            for (var i = 0; i < wmidata.length; i++) { // look for the entry with a matching `code` value
                if (wmidata[i].WMI == wmisearch) { // we found it
                    aMake = wmidata[i].Manufacturer
                }
            }

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


                document.getElementById("output").innerText = aYear + " " + aMake + " " + aModel + " " + aSeries + " " + aTrim + ", " + aDisp + " " + aFuel + ", " + aCyl + " \n " + aDoor + aCab + " " + aBody + ", " + aDrive + " \r\n " + "(This information is provided by NHTSA. Do not solely rely on trim data)";
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
            //window.open(awsserv + "/clutch2?vin=" + vin);
        };
    };
    function hclutch() {
        if (vincheckin()) {
            window.open(awsserv + "/hclutch?vin=" + vin);
        };
    };

    function updatedisplay(manu) {

        if (manu !== "" && typeof manu !== 'undefined') {
            aMake = manu;
            document.getElementById("txt_results").valUnexpectedue = "Search VIN to retrieve details";
            document.getElementById("output").innerText = "Search VIN to retrieve details";
        };

        console.log("updating divs " + aMake);
        if (aMake !== "") {
            document.getElementById("common_div").style.display = 'block';
            // document.getElementById("kmxsearch").style.display = 'block';
        } else {
            document.getElementById("common_div").style.display = 'none';
            // document.getElementById("kmxsearch").style.display = 'none';
        }

        if (aMake == "HYUK") {
            document.getElementById("hyundai_div").style.display = 'block';
            document.getElementById("kia_div").style.display = 'block';
        } else {
            document.getElementById("hyundai_div").style.display = 'none';
            document.getElementById("kia_div").style.display = 'none';
        }

        if (aMake == "INNIS") {
            document.getElementById("infiniti_div").style.display = 'block';
            document.getElementById("nissan_div").style.display = 'block';
        } else {
            document.getElementById("infiniti_div").style.display = 'none';
            document.getElementById("nissan_div").style.display = 'none';
        }

        if (aMake == "LETOY") {
            document.getElementById("lexus_div").style.display = 'block';
            document.getElementById("toyota_div").style.display = 'block';
        } else {
            document.getElementById("lexus_div").style.display = 'none';
            document.getElementById("toyota_div").style.display = 'none';
        }


        if (aMake == "AUDI" || aMake == "VOLKSWAGEN" || aMake == "BENTLEY") {
            document.getElementById("audi_div").style.display = 'block';
        } else {
            document.getElementById("audi_div").style.display = 'none';
        }

        if (aMake == "BMW" || aMake == "MINI" || aMake == "ALPINA") {
            document.getElementById("bmw_div").style.display = 'block';
        } else {
            document.getElementById("bmw_div").style.display = 'none';
        }

        if (aMake == "CHRYSLER" || aMake == "DODGE" || aMake == "JEEP" || aMake == "RAM" || aMake == "ALFA ROMEO" || aMake == "FIAT") {
            document.getElementById("chrysler_div").style.display = 'block';
        } else {
            document.getElementById("chrysler_div").style.display = 'none';
        }

        if (aMake == "FORD" || aMake == "LINCOLN" || aMake == "MERCURY") {
            document.getElementById("ford_div").style.display = 'block';
        } else {
            document.getElementById("ford_div").style.display = 'none';
        }

        if (aMake == "CHEVROLET" || aMake == "BUICK" || aMake == "CADILLAC" || aMake == "GMC") {
            document.getElementById("gm_div").style.display = 'block';
        } else {
            document.getElementById("gm_div").style.display = 'none';
        }

        if (aMake == "HONDA") {
            document.getElementById("honda_div").style.display = 'block';
        } else {
            document.getElementById("honda_div").style.display = 'none';
        }

        if (aMake == "HYUNDAI" || aMake == "GENESIS" || aMake == "HYUK") {
            document.getElementById("hyundai_div").style.display = 'block';
        } else {
            document.getElementById("hyundai_div").style.display = 'none';
        }

        if (aMake == "INFINITI" || aMake == "INNIS" || aMake == "NISSAN") {
            document.getElementById("nissaninfiniti_div").style.display = 'block';
        } else {
            document.getElementById("nissaninfiniti_div").style.display = 'none';
        }

        if (aMake == "KIA" || aMake == "HYUK") {
            document.getElementById("kia_div").style.display = 'block';
        } else {
            document.getElementById("kia_div").style.display = 'none';
        }

        if (aMake == "LAND ROVER" || aMake == "JAGUAR") {
            document.getElementById("lr_div").style.display = 'block';
        } else {
            document.getElementById("lr_div").style.display = 'none';
        }

        if (aMake == "LEXUS" || aMake == "LETOY") {
            document.getElementById("lexus_div").style.display = 'block';
        } else {
            document.getElementById("lexus_div").style.display = 'none';
        }

        if (aMake == "MASERATI") {
            document.getElementById("maserati_div").style.display = 'block';
        } else {
            document.getElementById("maserati_div").style.display = 'none';
        }

        if (aMake == "MAZDA") {
            document.getElementById("mazda_div").style.display = 'block';
        } else {
            document.getElementById("mazda_div").style.display = 'none';
        }

        if (aMake == "MERCEDES-BENZ" || aMake == "SMART") {
            document.getElementById("mb_div").style.display = 'block';
        } else {
            document.getElementById("mb_div").style.display = 'none';
        }

        if (aMake == "MITSUBISHI" || aMake == "SUZUKI") {
            document.getElementById("mitsubishi_div").style.display = 'block';
        } else {
            document.getElementById("mitsubishi_div").style.display = 'none';
        }

        //                if (aMake == "NISSAN" || aMake == "INNIS") {
        //                    document.getElementById("nissaninfiniti_div").style.display = 'block';
        //                } else {
        //                    document.getElementById("nissaninfiniti_div").style.display = 'none';
        //                }

        if (aMake == "PORSCHE") {
            document.getElementById("porsche_div").style.display = 'block';
        } else {
            document.getElementById("porsche_div").style.display = 'none';
        }

        if (aMake == "SUBARU") {
            document.getElementById("subaru_div").style.display = 'block';
        } else {
            document.getElementById("subaru_div").style.display = 'none';
        }

        if (aMake == "TESLA") {
            document.getElementById("tesla_div").style.display = 'block';
        } else {
            document.getElementById("tesla_div").style.display = 'none';
        }

        if (aMake == "TOYOTA" || aMake == "LETOY") {
            document.getElementById("toyota_div").style.display = 'block';
        } else {
            document.getElementById("toyota_div").style.display = 'none';
        }


    };

    // <!-- MANUFACTURER LINKS  -->
    function vincheckin() {
        if (vin.length === 17) {
            return true;
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
            window.open("http://windowsticker-prod.aws.manheim.com/windowsticker/BMW/" + vin);
        };
    };

    function chrysler() {
        if (vincheckin()) {
            window.open("https://www.chrysler.com/hostd/windowsticker/getWindowStickerPdf.do?vin=" + vin);
        };
    };

    function chryslerlist() {
        if (vincheckin()) {
            window.open(" http://www.chrysler.com/webselfservice/BuildSheetServlet?vin=" + vin);
        };
    };

    function decoderz() {
        if (vincheckin()) {
            window.open("https://www.vindecoderz.com/EN/check-lookup/" + vin);
        };
    };
    function siriusxm() {
        if (vincheckin()) {
            window.open("https://care.siriusxm.com/vinlookup_findVin.action?vin=" + vin);
        };
    };

    function ford() {
        if (vincheckin()) {
            window.open("https://www.etis.ford.com/selectedVehicleDetails.do#vin=" + vin);
        };
    };

    function fordsticker() {
        if (vincheckin()) {
            window.open("http://www.windowsticker.forddirect.com/windowsticker.pdf?vin=" + vin);
        };
    };

    function fordstickerkey() {
        if (vincheckin()) {
            window.open("https://imola.adesa.com/auction-engine-web-api/encryptVin.json?cgId=947&sellerOrgId=201721&isRunList=1&vin=" + vin);
        };
    };

    function fordstickerkey2() {
        if (document.getElementById("mkey").value !== "") {
            var keyme = document.getElementById("mkey").value;
            window.open("https://windowsticker.concentrix.com/windowsticker/auction_ws/index.htm?sProgramCode=FORD_VR&loginId=1&quic_param=" + keyme);
        };
    };


    function fordwiki() {
        if (vincheckin()) {
            window.open(awsserv + "/ford?vin=" + vin);
        };
    };

    function gmlink() {
        if (vincheckin()) {
            window.open("https://windowsticker-prod.aws.manheim.com/showGmWs?auctionID=&workOrderNumber=7055030&sblu=11546249&vin=" + vin);
        };
    };
    function gmlink2() {
        if (vincheckin()) {
            window.open("https://www.koonswhitemarshchevy.com/api/legacy/pse/windowsticker/gm?bac=113645&vin=" + vin);
        };
    };


    function hyunwiki() {
        if (vincheckin()) {
            window.open("http://www.mikemillerhyundai.com/services/hyundai/windowSticker.do?vin=" + vin);
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
            window.open("https://www.kia.com/us/en/data/dealerinventory/windowsticker/" + vin)
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
            window.open("https://www.maseratimarin.com/api/legacy/pse/windowsticker/maserati?vin=" + vin + "&country=US&language=en");
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
            window.open("https://www.mitsubishicars.com/rs/file/monroney?vin=" + vin);
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
            window.open("https://tesla-info.com/car/US-" + vin);
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


    function vwaudilane() {
        if (vincheckin()) {
            window.open("http://windowsticker-prod.aws.manheim.com/windowsticker/" + vin + "/4905414");
        };

    };

    function hitcher() {
        if (aModel !== "" && typeof aModel !== 'undefined') {
            console.log("pulling hitch")
            window.open("https://www.etrailer.com/hitch-" + aYear + "_" + aMake + "_" + aModel + ".htm");
        };
    };

 
