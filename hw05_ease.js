window.onload = function () {


    var svg = d3.select("body").append("svg").attr({
        width: "340",
        height: "340"
    });

    svg.append("g").append("rect").attr({
        fill: "white",
        width: "100%",
        height: "100%"
    });

    //--------------------------------

    var easeArr = ["linear", "quad", "cubic", "sin", "exp", "circle", "elastic", "back", "bounce"];

    bind(easeArr);
    render();

    function bind(dataSet) {
        var selection_circle = d3.select("svg").selectAll("circle").data(dataSet);
        var selection_text = d3.select("svg").selectAll("text").data(dataSet);
        var selection_line = d3.select("svg").selectAll("line").data(dataSet);

        // 初始化設定
        selection_line.enter().append("line").attr({
            x1: 100,
            y1: function (d, i) {
                return 20 + i * 35;
            },
            x2: 300,
            y2: function (d, i) {
                return 20 + i * 35;
            },
            stroke: "lightgreen"
        }).text(function (d) {
            return d;
        });
        selection_line.exit().remove();

        selection_circle.enter().append("circle").attr({
            cx: 100,
            cy: function (d, i) {
                return 20 + i * 35;
            },
            r: 15,
            fill: "gold"
        });
        selection_circle.exit().remove();

        selection_text.enter().append("text").attr({
            x: 5,
            y: function (d, i) {
                return 25 + i * 35;
            },
            fill: "black"
        }).text(function (d) {
            return d;
        });
        selection_text.exit().remove();

    }

    function render() {

        //需要動畫的設定
        d3.select("svg").selectAll("circle").on("click", function (d) {
            /*
                這裡的d為 easeArr = ["linear", "quad", "cubic", "sin", "exp", "circle", "elastic", "back", "bounce"];
                ease()直接根據字串參數進行對應的數度函式效果
            */
            d3.select(this)
                .transition()
                .duration(1000) //在一秒內完成
                .delay(function (data, index) {
                    return index * 1000;
                })
                .ease(d)
                .attr({
                    cx: 300,
                    fill: "lightpink",
                })
            

            //                .transition()
            //                .duration(2000)
            //                .attr({
            //                    fill: "gold",
            //                })
            //                .transition()
            //                .duration(1000)
            //                .attr({
            //                    x: 0,
            //                    fill: "blue",
            //                });;
        });


    }





}