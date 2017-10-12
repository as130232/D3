window.onload = function () {

    //createSvg
    var svg = d3.select("body #test").append("svg").attr({
        width: "340",
        height: "340"
    });

    //append group
    svg.append("g").append("rect").attr({
        fill: "white",
        width: "100%",
        height: "100%"
    });

    //--------------------------------

    var arr = [120, 200, 240, 175, 80];

    bind(arr);
    render();

    function bind(arr) {
        var selection = d3.select("#test svg").selectAll("rect#bar").data(arr);
        // 初始化設定
        selection.enter().append("rect").attr({
            id: "bar",
            x: 20,
            y: function (d, i) {
                return 20 + i * 35;
            },
            height: 30,
            width: 30,
            fill: "rgb(255,0,0)"
        });
        selection.exit().remove();
    }

    function render() {


        //不需要動畫的設定
        d3.select("#test svg").selectAll("rect#bar").on("click", render);


        //需要動畫的設定
        d3.selectAll("rect#bar")
            .transition()
            .duration(1000) //在一秒內完成
            .delay(function (data, index) {
                return index * 1000;
            })
            .attr({
                //width: 10,
                x: 300
            })
            .transition()
            .duration(2000)
            .attr({
                fill: "gold",
            })
            .transition()
            .duration(1000)
            .attr({
                x: 0,
                fill: "blue",
            });;
    }



}