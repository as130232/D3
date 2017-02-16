window.onload = init;

function init() {
    //1.地理資料檔: topoTaiwan.json
    d3.json("d3-topoTaiwan/topoTaiwan.json", function (topoData) {

        drawTaiwanMapByTopoTaiwan(topoData);

    });

    function drawTaiwanMapByTopoTaiwan(topoData) {
        bind(topoData);
        render();
    }

    function render() {
        //紀錄原本地區顏色
        let colorTmp;

        //產生不同顏色
        var fScale = d3.scale.category20c();

        //從這裡開始修改
        d3.selectAll("path")
            .attr({
                fill: (function (d, i) {
                    return fScale(i);
                })
            })
            .on("mouseover", function (data) {
                console.log(data);
                //先將原本顏色讓colorTmp變數取著
                colorTmp = d3.select(this).attr("fill");
                d3.select(this).attr({
                    fill: "gold",
                })
                var cooridinates = d3.mouse(this);
                var cx = cooridinates[0];
                var cy = cooridinates[1];
                //console.log('cx', cx, ' ,cy', cy);
                //將提示框移到滑鼠對應位置
                d3.select("#tool2p")
                    .style({
                        left: (+cx + 10) + "px",
                        top: (+cy + 10) + "px",
                    });
                d3.select("#tool2p").classed("hidden", false);
                //將資料更新至提示框中
                d3.select("#tool2p #city").html('地區: ' + data.properties.C_Name);
                d3.select("#tool2p #content").html('Id: ' + data.properties.County_ID + '<br>面積: ' + data.properties.Area);

            })
            .on("mouseout", function (data) {
                d3.select(this).attr({
                    fill: colorTmp,
                })
                d3.select("#tool2p").classed("hidden", true);
            })
            .on("click", function (data) {
                alert(data.properties.C_Name);
            });

    }

    function bind(topoData) {
        // 2.地理投影器: 設定投影方式(麥卡托)、定位點([經,緯度])、縮放(scale)
        var projection = d3.geo.mercator().center([121, 24]).scale(6000);

        // 3.路徑產生器: d3.geo.path()
        var path = d3.geo.path().projection(projection);

        // 4.地理資料檔: 使用topojson.js載入地理資料
        var topo = topojson.feature(topoData, topoData.objects["county"]);

        // 綁定path與載入的地理資料(features:每一地理區劃)
        var selection = d3.select("svg").selectAll("path").data(topo.features);
        //            console.log(topo.features);   
        selection.enter().append("path");
        selection.exit().remove();
        //?????
        selection.classed("map-boundary", true).attr("d", path);
    }


    function emptySvg() {
        d3.select("svg").remove();
    }

    //unfinish
    function drawByPopulation() {
        d3.json("d3-topoTaiwan/population.json", function (dataArray) {
            var population = {};

            dataArray.forEach(function (data, index) {
                //set key and value
                population[data.COUNTYNAME] = data.population

            });

            d3.json("d3-topoTaiwan/topoTaiwan.json", function(topoData) {
                bind(topoData, population);

                render(dataArray);
            });
        });
    }
}