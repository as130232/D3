window.onload = function () {
    
    
    
    let svgObj = {};
    svgObj.w = 900;
    svgObj.h = 600
    svgObj.padding = 90;
    
    var letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "M", "N", "O", "P", "Q", "T", "U", "V", "W", "X", "Z"];

    svg();

    d3.csv("hw03_invoice-taipei.csv", row, function (dataSet) {
        //console.table(dataSet);
        
        //TODO-找出符合城市名===臺北市、日期同2016/8/1的前6個???
        var sorted_dataSet = [];
        
        //1.舊寫法利用forEach
//        dataSet.forEach(function(data, index){
//            if(data.city == "台北市" && data.date == "2016/8/1"){
//                sorted_dataSet.push(data);
//            }
//            if(index == 6){
//                break;
//            }
//        });
        
        //2.利用filter過濾
        sorted_dataSet = dataSet.filter(function(data, index){
            return data.city === "臺北市" && data.date === "2016/8/1";
        });
        //再藉由sort排序，按照金額由大排到小
        //升序 由小排到大 d3.ascending(a, b);
        //降序 由大排到小 d3.descending(a, b);
        sorted_dataSet.sort( function(a , b){
            return d3.descending(a.amount , b.amount);
        });
        //設定資料長度，只保留前六筆data
        sorted_dataSet.length = 6;
        
        console.table(sorted_dataSet);
        
        bind(sorted_dataSet);
        render(sorted_dataSet);
        listItems(dataSet);
    });

    function row(d) {
        //將字串轉回數字，利用(+)
        d.amount = +d.amount;
        d.number = +d.number;

        return d;
    }

    function svg() {
        d3.select("body").append("svg").attr({
            width: svgObj.w,
            height: svgObj.h
        });
        d3.select("svg").append("g").append("rect").attr({
            width: "100%",
            height: "100%",
            fill: "white"
        });

    }

    function bind(dataSet) {

        var pie = d3.layout.pie()
            .value(function (d) {
                return d.amount;
            });

        var selection = d3.select("svg")
            .selectAll("g.arc") //select G group 底下的 arc class
            .data(pie(dataSet));
        var g_arc = selection.enter().append("g").attr("class", "arc");
        g_arc.append("path");
        g_arc.append("text");
        //離開可視化圖
        selection.exit().remove();
    }

    function render(dataSet) {
        //外圓 半徑
        var outerR = 300;
        //內心圓 半徑(like donutes)
        var innerR = 50;
        var arc = d3.svg.arc()
            .outerRadius(outerR)
            .innerRadius(innerR);

        var fScale = d3.scale.category20();

        d3.selectAll("g.arc")
            //TODO-好像缺了什麼，位置怪怪，藉由svg的範圍各一半移到中心點位置
            .attr("transform", "translate(" + svgObj.w/2 + "," + svgObj.h/2 + ")")
            .select("path")
            .attr("d", arc)
            .style("fill", function (d, i) {
                return fScale(i);
            });

        d3.selectAll("g.arc")
            .select("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            }) //arc.centroid 計算並回傳此arc中心位置
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.data.industry;
            })

    }

    function listItems(dataSet) {

        //TODO-如何產生城市名按鈕???
        var cityArr = [];

        var uniqueIndustryArr = unique(cityArr);
        var filterIndustryArr = uniqueIndustryArr.filter(function (d) {
            return d != "";
        });

        var selection = d3.select("body")
            .append("div")
            .attr("id", "city")
            .selectAll("input")
            .data(filterIndustryArr)
            .attr({
                type: "button",
                value: function (d) {
                    return d;
                }
            });
        selection.enter()
            .append("input")
            .attr({
                type: "button",
                value: function (d) {
                    return d;
                }
            })
            .on("click", function (d) {
                update(d);
            });

        function update(filteredName) {
            //TODO-找出符合城市名、日期同2016/8/1???
            var sorted_dataSet = [];

            bind(sorted_dataSet);
            render(sorted_dataSet);
        }

    }

    function unique(array) {
        var n = [];
        for (var i = 0; i < array.length; i++) {
            if (n.indexOf(array[i]) == -1) {
                n.push(array[i]);
            }
        }
        return n;
    }





}