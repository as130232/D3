window.onload = function () {
    /*
    var startBtn = document.getElementById("startBtn");
    var showNumber = document.getElementById("showNumber");

    startBtn.addEventListener("click", function () {
        var number = createRandomNumber(1911, 2016);
        showNumber.innerHTML = number;

        function createRandomNumber(max, min) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    });
    var squareBtn = document.getElementById("squareBtn");
    var inputNumber = document.getElementById("inputNumber");
    squareBtn.addEventListener("click", function () {
        var squareNumber = Math.pow(inputNumber.value, 2);
        inputNumber.value = squareNumber;

    });
    */

    /* D3寫法 */
    var showNumber = d3.select("#showNumber");
    var d3_startBtn = d3.select("#startBtn");
    d3_startBtn.on("click", function () {
        showNumber.text(function () {
            var max = 2016;
            var min = 1911;
            return Math.floor(Math.random() * (max - min + 1) + min)
        })
    });

    d3.select("#squareBtn").on("click", function () {
        var inputNumber = d3.select("#inputNumber");
        inputNumber[0][0].value = (function () {
            return Math.pow(inputNumber[0][0].value, 2)
        })();
    });


    //draw musicNote
    d3.select("#musicNote")
        .attr({
            width: 300,
            height: 200,
        })
        .style({
            "background-color": "#FFFFF0"
        })
        .append("circle")
        .attr({
            cx: 150,
            cy: 120,
            r: 15,
            fill: "#ccc",
        });


    d3.select("#musicNote")
        .append("rect")
        .attr({
            x: 160,
            y: 45,
            width: 5,
            height: 78,
            fill: "#ccc",
        });

    for (var i = 0; i < 6; i++) {
        var interval = 45 + 30 * (i);
        //add Text
        if (i == 5) {
            d3.select("#musicNote")
                .append("text")
                .text("A")
                .attr({
                    x: function () {
                        return d3.select("#musicNote circle")[0][0].cx.baseVal.value - 10;
                    },
                    y: interval,
                })
                .style({
                    //if have dash,plz add "",or throws exception.
                    "font-size": "40px",
                    "font-family": "arial",
                });
        } else {
            //add line
            d3.select("#musicNote")
                .append("line")
                .attr({
                    x1: 0,
                    y1: interval,
                    x2: 300,
                    y2: interval,
                    stroke: "black",
                });
        }
    }
    //create random values
    function createRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    var valuesArray = function () {
        var array = [];
        for (var i = 0; i < 20; i++) {
            var value = createRandomValue(20, 300);
            array.push(value);
        }
        return array;
    }();

    /*
    //test1: according to the data dynamically generated graphics
    d3.select("#barGraph")
        .selectAll("span")
        .data(valuesArray)
        .enter()
        .append("span")
        .style({
            width: (function (d, i) {
                return d + 'px';
            }),
            height: '10px',
            color: 'black',
            "margin": '2px',
            background: '#FF1493',
        })
        .html("<br/>");
    
    d3.select("#barGraph")
        .selectAll("span")
        .append("text")
        .text(function (d) {
            return d;
        })
        .style({
            "font-size": "12px",
            "font-family": "arial",
            "padding-left": (function (d) {
                return (d) + 'px';
            }),
        });
    */

    //test2: use svg draw the pic.
    d3.select("#barGraph2 svg").selectAll("rect")
        .data(valuesArray)
        .enter()
        .append("g")
        .append("rect")
        .attr({
            x: 10,
            y: (function (d, i) {
                return 10 + 12 * i;
            }),
            width: (function (d) {
                return d;
            }),
            height: 10,
            fill: "#00BFFF"
        })
        .transition()
        .duration(createRandomValue(1, 1000))
        .delay(createRandomValue(1, 300))
        .attr({
            width: (function (d) {
                return d;
            }),
        });
    d3.select("#barGraph2 svg")
        .selectAll("g")
        .append("text")
        .attr({
            x: (function (d) {
                return d + 15;
            }),
            y: (function (d, i) {
                return 20 + 12 * i;
            }),
            "font-size": 12
        })
        .text(function (d) {
            return d;
        });

    drawBtn.addEventListener("click", function () {
        //empty svg
        d3.select("#drawBarGraph svg").html('');
        var r = createRandomValue(0,255);
        var g = createRandomValue(0,255);
        var b = createRandomValue(0,255);
        for (var i = 0; i < 20; i++) {
            r = r-5;
            g = g-5;
            b = b-5;
            var randomValue = createRandomValue(20, 300);
            d3.select("#drawBarGraph svg")
                .append("rect")
                .attr({
                    x: 10,
                    y: 10 + 12 * i,
                    width: 0,
                    height: 10,
                    fill: 'rgb('+ r + ','+ g  + ',' + b +')',
                   
                })
                .transition()
                .duration(createRandomValue(1, 1000))
                .delay(createRandomValue(1, 400))
                .attr({
                    width: randomValue,
                });

            d3.select("#drawBarGraph svg")
                .append("text")
                .attr({
                    x: randomValue + 15,
                    y: 20 + 12 * i,
                    "font-size": 12
                }).text(randomValue);
        }
    });
}