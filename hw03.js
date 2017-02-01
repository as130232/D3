window.onload = function () {
    //var createMyShoesBtn = document.getElementById("createMyShoesBtn");
    createMyShoesBtn.addEventListener("click", function () {
        var myShoes = {
                brand: 'reeBok',
                size: 9,
                price: 3000,
                forMale: true,
            }
            //add Array attr 
        myShoes.color = [];
        (myShoes.color).push("black", "yellow");

        myShoes.prevShoes = {};

        var tmp = function (num) {
            return this.price * num / 10;
        }

        //得先定義tmp在reference to discount
        myShoes.discount = tmp;

        d3.select('#myShoes').text("-My shoes:-")
            .append('div').text("brand:" + myShoes.brand)
            .append('div').text("On Sale(30%):" + myShoes.discount(7));
    });


    createInvoiceBtn.addEventListener("click", function () {
        //csv formate
        var displayBtn = d3.select("#invoice").append('button');
        displayBtn.html('display');
        displayBtn.on("click", function () {
            var invoiceVable = d3.select("#invoice table");
            if (invoiceVable[0][0].style.display == 'none') {
                d3.select("#invoice table").style({
                    display: 'block',
                });
                displayBtn.html('display');
            } else {
                d3.select("#invoice table").style({
                    display: 'none',
                });
                displayBtn.html('show');
            }

        });

        d3.csv("hw03_invoice-taipei.csv", function (dataArray) {
            //console.table(dataArray);            
            var table = d3.select("#invoice").append("table").style({
                border: '1px solid #ccc',
            });
            var tr = table.append("tr").style({
                border: '1px solid #ccc',
                'text-align': 'center',
            });
            tr.append("td").text("名稱");
            tr.append("td").text("金額");
            dataArray.forEach(function (data) {
                var tr = table.append("tr").style({
                    border: '1px solid #ccc',
                    'text-align': 'center',
                });
                if (data.amount > 10000000) {
                    tr.append("td").text(data.industry);
                    tr.append("td").text(data.amount);
                }
            });
        });
    });


    //xml formate,佔用空間資源，建議轉成csv
    d3.xml("hw03_invoice-taipei.xml", function (dataArray) {
        //console.log(dataArray);
    });

    //xml json, undefined、null
    d3.json("hw03_invoice-taipei.json", function (dataArray) {
        var resultArray = [];
        dataArray.forEach(function (data) {
            //QuerySelect
            if (+data.amount > 1000000000 && data.city == '臺北市' && data.date === "2016/8/1") {
                resultArray.push(data);
            }
        });

        d3.select("#invoiceSvg")
            .selectAll("rect")
            .data(resultArray)
            .enter()
            .append("g")
            .append("rect")
            .attr({
                x: 200,
                y: (function (d, i) {
                    return 10 + 12 * i;
                }),
                width: 0,
                height: 10,
                fill: "red",
            })
            .transition()
            .duration(createRandomValue(100, 1000))
            .delay(createRandomValue(100, 600))
            .attr({
                width: (function (data) {
                    return data.amount / 100000000;
                }),
            });


        d3.select("#invoiceSvg")
            .selectAll("g")
            .append("text")
            .attr({
                x: 0,
                y: (function (d, i) {
                    return 20 + 12 * i;
                }),
                "font-size": 12,
            })
            .text(function (data) {
                return data.industry;
            });
    });

    function createRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }



    var arr = [50, 80, 88, 60, 11, 30];
    //1.選擇Dom物件並綁定資料
    var selection = d3.select("#test")
        .selectAll("div")
        .data(arr);
    //2.增加足量的可視化元件以符合資料綁定
    selection.enter()
        .append("div")
        .text(function (d) {
            return d;
        })
        .style({
            color: (function (d) {
                if (d < 70) {
                    return "red";
                } else {
                    return "black";
                };
            }),
        });

    //3.離開可視化元素，並移除多餘的元素物件
    selection.exit().remove();

    //--作業未完回家寫





    var barGraphArray = [62, 51, 88, 92, 30, 74];
    var svgWidth = 900;
    var svgHeight = 300;
    var padding = 100;

    var drawBarGraphObj = d3.select("#drawBarGraph");
    drawBarGraphObj = drawSvg(drawBarGraphObj);
    drawBarGraphObj = bind(barGraphArray, drawBarGraphObj);
    bindText(barGraphArray);
    render(drawBarGraphObj);
    renderText(barGraphArray);

    function drawSvg(bindObject) {
        bindObject.append("svg")
            .attr({
                width: svgWidth,
                height: svgHeight,
                x: padding,
                y: svgHeight - padding,
            });
        //增加完要選擇該svg已給後續操作
        return bindObject.select("svg");
    }

    function bind(dataArray, bindObject) {
        bindObject.selectAll("rect")
            .data(dataArray)
            .enter()
            .append("rect");

        //bindObject.exit().remove();
        return bindObject.selectAll("rect");
    }

    function bindText(dataArray) {
        d3.select("#drawBarGraph svg")
            .selectAll("text")
            .data(dataArray)
            .enter()
            .append("text");
    };

    function render(bindObject) {
        bindObject.attr({
            x: (function (d, i) {
                return padding + 42 * i;
            }),
            y: (function (d) {
                return svgHeight - padding - d;
            }),
            width: 40,
            height: (function (d) {
                return d;
            }),
            fill: function (d) {
                if (d < 70) {
                    return "red";
                } else {
                    return "lightgreen";
                }
            },
        });
    }

    function renderText() {
        d3.select('#drawBarGraph svg')
            .selectAll("text")
            .attr({
                x: (function (d, i) {
                    return 4 + padding + 43 * i;
                }),
                y: (function (d) {
                    return svgHeight - padding + 20;
                }),
                "font-size": 20,
            }).text(function (d) {
                return d;
            });
    }

    insertDataBtn.addEventListener("click", function () {
        var randomValue = createRandomValue(0, 100);
        barGraphArray.push(randomValue);
        d3.select("#drawBarGraph svg").html('');
        var drawBarGraphObj = d3.select("#drawBarGraph");
        drawBarGraphObj = drawBarGraphObj.selectAll("svg");
        drawBarGraphObj = bind(barGraphArray, drawBarGraphObj);
        bindText(barGraphArray);
        render(drawBarGraphObj);
        renderText(barGraphArray);
    });
    
    
    deleteDataBtn.addEventListener("click", function(){
        barGraphArray.shift();
        d3.select("#drawBarGraph svg").html('');
        var drawBarGraphObj = d3.select("#drawBarGraph");
        drawBarGraphObj = drawBarGraphObj.selectAll("svg");
        drawBarGraphObj = bind(barGraphArray, drawBarGraphObj);
        bindText(barGraphArray);
        render(drawBarGraphObj);
        renderText(barGraphArray);
    });
}