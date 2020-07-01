﻿//display empty Graphs
var ctx = document.getElementById("myChart").getContext("2d");
window.myChart = new Chart(ctx, { type: "line" });

var ctxx = document.getElementById("myChart2").getContext("2d");
window.myChart2 = new Chart(ctxx, { type: "line" });

//on click create graphs with data from services
$(document).ready(function () {
    $("#btn_line_chart").on("click",
        function () {
            //cumulative or not
            var chkd;
            if (document.getElementById("cumulative").checked) {
                chkd = "true";
            } else {
                chkd = "false";
            }

            var aLabels;
            var jhuCountry1;
            var jhuCountry2;

            var ecdcLabels;
            var ecdcCountry1;
            var ecdcCountry2;

            //on click get values from html
            var cntryOne = $("#MainContent_ddl_one").val();
            var cntryTwo = $("#MainContent_ddl_two").val();
            var opt = $("#ddlOption").val();
            var src = $("#ddl_Source").val();

            //values to JSON
            var jsonData = JSON.stringify({
                countryOne: cntryOne,
                countryTwo: cntryTwo,
                option: opt,
                source: src,
                isChecked: chkd
            });

            //send JSON values to the Graph services and call get*Data Method
            $.ajax({
                type: "POST",
                url: "ECDCservice.asmx/GetEcdcData",
                data: jsonData, //JSON data to be send to the server
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: onSuccessEcdc,
                error: onErrorCall
            });

            $.ajax({
                type: "POST",
                url: "JHUService.asmx/getJHUData",
                data: jsonData, //JSON data to be send to the server
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: onSuccessJhu,
                error: onErrorCall
            });

            function onSuccessEcdc(response) {
                var ecdcData = response.d; //response.d to get jquery ajax response
                ecdcLabels = ecdcData[0];
                ecdcCountry1 = ecdcData[1];
                ecdcCountry2 = ecdcData[2];

                //add corrective number for ECDC only
                var slider = document.getElementById("correctCountry1");
                var slValue = slider.value;
                doCorrectCountry1(slValue);

                var scndSlider = document.getElementById("correctCountry2");
                var scndSlValue = scndSlider.value;
                doCorrectCountry2(scndSlValue);
            }

            function onSuccessJhu(response) {
                var aData = response.d;
                aLabels = aData[0];
                jhuCountry1 = aData[1];
                jhuCountry2 = aData[2];

                drawGraph();
            }

            function doCorrectCountry1(sliderValue) {
                if (sliderValue > 0) {
                    for (var i = 0; i < sliderValue; i++) {
                        ecdcCountry1.unshift("0");
                    }
                    drawGraph();
                } else if (sliderValue < 0) {
                    for (var y = 0; y >= sliderValue; y--) {
                        ecdcCountry1.shift();
                    }
                    drawGraph();
                } else
                    drawGraph();
            }
            function doCorrectCountry2(sliderValue) {
                if (sliderValue > 0) {
                    for (var i = 0; i < sliderValue; i++) {
                        ecdcCountry2.unshift("0");
                    }
                    drawGraph();
                } else if (sliderValue < 0) {
                    for (var y = 0; y >= sliderValue; y--) {
                        ecdcCountry2.shift();
                    }
                    drawGraph();
                } else
                    drawGraph();
            }

            function drawGraph() {
                if (window.myChart instanceof Chart) {
                    window.myChart.destroy();
                }
                var ctx = document.getElementById("myChart").getContext("2d");

                window.myChart = new Chart(ctx,
                    {
                        type: "line",
                        data: {
                            labels: aLabels,
                            datasets: [
                                {
                                    label: "JHU " + cntryOne,
                                    data: jhuCountry1,
                                    borderColor: [
                                        "#1b9e77"
                                    ],
                                    borderWidth: 1
                                },
                                {
                                    label: "ECDC " + cntryOne,
                                    data: ecdcCountry1,
                                    borderColor: [
                                        "#d95f02"
                                    ],
                                    borderWidth: 1
                                }
                            ]
                        }
                    });
                myChart.update();

                if (window.myChart2 instanceof Chart) {
                    window.myChart2.destroy();
                }

                var ctxx = document.getElementById("myChart2").getContext("2d");

                window.myChart2 = new Chart(ctxx,
                    {
                        type: "line",
                        data: {
                            labels: aLabels,
                            datasets: [
                                {
                                    label: "JHU " + cntryTwo,
                                    data: jhuCountry2,
                                    borderColor: [
                                        "#1b9e77"
                                    ],
                                    borderWidth: 1
                                },
                                {
                                    label: "ECDC " + cntryTwo,
                                    data: ecdcCountry2,
                                    borderColor: [
                                        "#d95f02"
                                    ],
                                    borderWidth: 1
                                }
                            ]
                        }
                    });
            }

            document.getElementById('hideEcdc').addEventListener('click', function () {
                myChart.data.datasets.forEach(function (ds) {
                    console.log(ds);
                    if (ds.label.search(/ecdc/i) === 0) {
                        //                        alert("success");
                        ds.hidden = !ds.hidden;
                    }
                });
                myChart2.data.datasets.forEach(function (ds) {
                    console.log(ds);
                    if (ds.label.search(/ecdc/i) === 0) {
                        //                        alert("success");
                        ds.hidden = !ds.hidden;
                    }
                });
                myChart.update();
                myChart2.update();
            });

            document.getElementById('hideJhu').addEventListener('click', function () {
                myChart.data.datasets.forEach(function (ds) {
                    console.log(ds);
                    if (ds.label.search("JHU") === 0) {
                        //                        alert("success");
                        ds.hidden = !ds.hidden;
                    }
                });
                myChart2.data.datasets.forEach(function (ds) {
                    console.log(ds);
                    if (ds.label.search("JHU") === 0) {
                        //                        alert("success");
                        ds.hidden = !ds.hidden;
                    }
                });
                myChart.update();
                myChart2.update();
            });

            function onErrorCall(repo) {
                alert("Woops something went wrong, pls try later !");
            }
        });
});