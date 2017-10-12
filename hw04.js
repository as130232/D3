window.onload = init;


function init() {
    /*
        week 4-1
    */
    //class test1:
    var xScale = d3.scale.linear()
        .domain([0, 1000]) //input
        .range([0, 100]) //output
        .clamp(true); //若值超過1000 or 小於 0 將值控制在0~100

    console.log(xScale(645));
    console.log(xScale(2455)); //.clamp(true)將最大值限制在100

    //class test 
    function randomNum(min, max) {
        var randomScale = d3.scale.linear()
            .domain([0, 1])
            .rangeRound([min, max]);
        return randomScale(Math.random());
    }

    console.log('ranYear:', randomNum(1911, 2017));

    //class test2: 依據input data中最小值及最大值為最小、最大範圍
    /*
        ex: d3.max(dataArr) 
    */
    var dataSetTest = [{
            name: "Andy",
            tall: 180,
            age: 32
        },
        {
            name: "Allen",
            tall: 150,
            age: 14
        },
        {
            name: "Peter",
            tall: 170,
            age: 19
        }
                  ];
    var getMaxTall = d3.max(dataSetTest, function (data) {
        return data.tall;
    });
    console.log('getMaxTall By dataSetTest:', getMaxTall); //180

    /*
        用ordinal:
        ordinal 的 domain 內所帶入的值，與 linear 有所不同，linear 帶入的是一個數字範圍，而 ordinal.domain 內所帶入的是一串陣列值，陣列的第一個值會對應到第一個元素的的輸出範圍，第二個則會對應到第二個範圍，依此類推。
    */

    //class test3
    //    var colorInder = [0,1,2,3,4];
    //    var color = ['red', 'blue', 'yellow', 'green', 'black']; 
    //    var colorScale = d3.scale.ordinal()
    //        .domain(colorInder)
    //        .range(color);
    //    console.log('colorScale', colorScale(1));


    //class test4: 用ordinal()秀出各政黨顏色
    var politicalName = ['國民黨', '民進黨', '親民黨', '時代力量', '白色力量', '無黨籍聯盟'];
    var politicalColor = ['blue', 'green', 'orange', 'yellow', 'white', 'gray'];
    var politicalScale = d3.scale.ordinal()
        .domain(politicalName)
        .range(politicalColor);

    console.log('politicalScale', politicalScale('無黨籍聯盟'));
    //額外補充: d3.range(min, max)
    console.log('politicalScale', d3.range(1, 9)); //range: 快速產生1~9數字 的陣列(size:8)


    //class test5: 內建填塞序數
    var colorScale = d3.scale.category10();
    var colorScale2 = d3.scale.category20();
    //console.log(colorScale(0));
    //console.log(d3.scale.category20()(10));
    //console.log(d3.scale.category20b());    
    //console.log(d3.scale.category20c());
    //將所有的顏色色碼取出來
    //console.log(colorScale2(???));
    //    for(var i = 0 ; i < 20 ; i++){  
    //        console.log(colorScale2(i));    //若超過20將會重新開始
    //    }


    //class test6: 利用比例尺做範圍變換 - 時間對應
    var timeScale = d3.time.scale()
        .domain([ //D:輸入
            new Date("2013-01-01"),
            new Date("2016-01-01")
        ])
        //.range([0, 100]);   //R:輸出
        .rangeRound([0, 100]); //R:輸出 (四捨五入)
    console.log('timeScale:', timeScale(new Date("2015-03-14")));








    //class test7: 來畫畫2D散佈圖(無軸線版)
    let svgAttr = {};

    function drawInvoiceInfoScatterDiagram() {

        //1. 宣告svgAttr,定義width, height, padding, letterList變數
        svgAttr.width = 900;
        svgAttr.height = 600;
        svgAttr.padding = 60;
        svgAttr.id = 'invoiceInfo';

        var letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "M", "N", "O", "P", "Q", "T", "U", "V", "W", "X", "Z"];

        //2. 建立svg()畫布環境並取得對應的svg
        createSvg(svgAttr.id);

        //3. 用d3讀取csv
        d3.csv("hw04_invoice.csv",
            function (data) {
                //先將原本資料型態String convert to int
                data.number = +data.number;
                data.amount = parseInt(data.amount);
                return data;
            },
            function (dataArray) {
                //console.table(dataArray);

                //4. 建立bind()
                bind(dataArray, svgAttr.id);

                //5. 定義xScale,yScale,rScale, fScale比例尺(range目的在決定在svg上位置)
                renderForInvoiceInfo(dataArray, svgAttr.id);

                //6. 產生各塞選資料按鈕
                btnList(dataArray, svgAttr.id);
            });

    }

    //共用:產生Svg畫布
    function createSvg(svgId) {
        d3.select("body")
            .append("svg")
            .attr({
                width: svgAttr.width,
                height: svgAttr.height,
                id: svgAttr.id,
            });

        d3.select("svg#" + svgId)
//            .append("g") //add group
//            .append("rect")
//            .attr({
//                width: "100%",
//                height: "100%",
//                fill: "white"
//            });
    }

    //共用:綁定資料
    function bind(dataArray, svgId) {
        var id = 'invoiceInfo';
        var selection = d3.select("svg#" + svgId)
            .selectAll("circle")
            .data(dataArray);

        selection.enter().append("circle");
        selection.exit().remove();
    }

    //個別:用於渲染發票資訊，取得對應資料屬性
    function renderForInvoiceInfo(dataArray, svgId) {

        //get Min and Max date
        let minDate = d3.min(dataArray, function (data) {
            return data.date;
        });
        let maxDate = d3.max(dataArray, function (data) {
            return data.date;
        });
        console.log('minDate', minDate, ', maxDate', maxDate);

        //get Min and Max number
        let minNumber = d3.min(dataArray, function (data) {
            return data.number;
        });
        let maxNumber = d3.max(dataArray, function (data) {
            return data.number;
        });
        console.log('minNumber', minNumber, ', maxNumber', maxNumber);

        //get Min and Max amount
        let minAmount = d3.min(dataArray, function (data) {
            return data.amount;
        });
        let maxAmount = d3.max(dataArray, function (data) {
            return data.amount;
        });
        console.log('minAmount', minAmount, ', maxAmount', maxAmount);

        //定義xScale,yScale,rScale, fScale比例尺
        var xScale = d3.time.scale()
            .domain([new Date(minDate), new Date(maxDate)])
            .range([svgAttr.padding, (svgAttr.width - svgAttr.padding)]);


        var yScale = d3.scale.linear()
            .domain([minNumber, maxNumber])
            //注意:高度的起始原點在左上角(0,0)位置，
            //最小值位置在 (svgAttr.height - svgAttr.padding)
            //最大值位置在 (svgAttr.padding)
            .range([(svgAttr.height - svgAttr.padding), svgAttr.padding]);

        //發票金額越大，圓球越大
        var rScale = d3.scale.linear()
            .domain([minAmount, maxAmount])
            .range([5, 30]);
        //.range([0, 1]);    

        //輪巡顏色
        var fScale = d3.scale.category20();

        //1.先清除原本的X軸線、Y軸線
        d3.select("svg#" + svgId).select('g#axisX').remove();
        d3.select("svg#" + svgId).select('g#axisY').remove();

        //1.劃出x軸線
        var xAxis = d3.svg.axis()
            .scale(xScale) //指定軸線的比例尺為xScale
            .orient("bottom") //設定刻度在右:表示垂直，刻度朝底下(用以表示x軸)
            .ticks(10); //x軸上間距為5個刻度
        //1.劃出y軸線
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        //2.將x軸畫在svg上，並增加axis定義的css 調整軸線及文字樣式
        d3.select("svg#" + svgId)
            .append("g")
            .attr({
                id: "axisX",
                class: "axis",
                //將軸線作位移 (將x軸移到最下方) translate(x, y);
                transform: "translate(" + 0 + "," + parseInt(svgAttr.height - svgAttr.padding + 10) + ")",
            })
            .call(xAxis);
        //2.將y軸畫在svg上
        d3.select("svg#" + svgId)
            .append("g")
            .attr({
                id: "axisY",
                class: "axis",
                //將軸線作位移 (將y軸移到最左方)
                transform: "translate(" + parseInt(svgAttr.padding - 7) + "," + 0 + ")",
            })
            .call(yAxis);

        //3.render()繪圖
        d3.select("svg#" + svgId).selectAll("circle")
            //增加轉場動畫，注意必須和事件(on 'click'、'mouseover'..)等分離開來
            .transition()
            .attr({
                cx: function (d) {
                    var date = new Date(d.date); // String convert to date
                    return xScale(date);
                },
                cy: function (d) {
                    //console.log(d);
                    return yScale(d.number); // +: String convert to int
                },
                r: function (d) {
                    //console.log(d);
                    var convertNum = parseInt(d.amount);
                    return rScale(d.amount);
                },
                fill: function (d, index) {
                    //return fScale(index);
                    return fScale(d.cid);
                    //return colorScale(d.cid);
                }
            });
        //增加圓球的title顯示
        // 1.傳統title顯示
        //                .append("title")
        //                .text(function (d) {
        //                    //console.log(d);
        //                    return '地區:' + d.city + '\r\n行業名稱:' + d.industry + '\r\n發票金額:' + d.amount;
        //                });

        // 2.自己繪畫div(增加mouseover事件)
        d3.select("svg#" + svgId).selectAll("circle")
            .on("mouseover", function (d) {
                var cx = d3.select(this).attr("cx");
                var cy = d3.select(this).attr("cy");
                //console.log('cx', cx, ' ,cy', cy);
                //將提示框移到滑鼠對應位置
                d3.select("#tool2p")
                    .style({
                        left: (+cx + 20) + "px",
                        top: (+cy + 20) + "px",
                    });

                d3.select("#tool2p").classed("hidden", false);
                //將資料更新至提示框中
                d3.select("#tool2p #city").html('地區: ' + d.city);
                d3.select("#tool2p #industry").html('行業名稱: ' + d.industry + '<br>發票金額: ' + d.amount);
            })
            .on("mouseout", function (d) {
                d3.select("#tool2p").classed("hidden", true);
            });
        clearLoader();
    }

    //--------------------------------------------------------------------------------------


    //用於渲染癌症資訊
    function renderForCancerInfo(dataArray, svgId) {
        //將欄位中文屬性轉換成英文字屬性

        //morbidity	gender counties cancerClass ageStandardization cancerCount avgAge medianAge probability

        // 1.get All min And Max DataInfo
        let minMorbidity = d3.min(dataArray, function (data) {
            return data.morbidity;
        });
        let maxMorbidity = d3.max(dataArray, function (data) {
            return data.morbidity;
        });
        console.log('minMorbidity', minMorbidity, ', maxMorbidity', maxMorbidity);

        let minAvgAge = d3.min(dataArray, function (data) {
            return data.avgAge;
        });
        let maxAvgAge = d3.max(dataArray, function (data) {
            return data.avgAge;
        });
        console.log('minAvgAge', minAvgAge, ', maxAvgAge', maxAvgAge);

        let minCancerCount = d3.min(dataArray, function (data) {
            return data.cancerCount;
        });
        let maxCancerCount = d3.max(dataArray, function (data) {
            return data.cancerCount;
        });
        console.log('minCancerCount', minCancerCount, ', maxCancerCount', maxCancerCount);


        //2.有了資料要開始定義資料範圍:xScale,yScale,rScale, fScale比例尺
        //根據年份，控制X軸
        let xScale = d3.time.scale()
            .domain([new Date(minMorbidity), new Date(maxMorbidity)])
            .range([svgAttr.padding, (svgAttr.width - svgAttr.padding)]);
        //根據年齡，控制Y軸   
        let yScale = d3.scale.linear()
            .domain([minAvgAge, maxAvgAge])
            //注意:高度的起始原點在左上角(0,0)位置，
            .range([(svgAttr.height - svgAttr.padding), svgAttr.padding]);
        //根據案例數，控制半徑   
        let rScale = d3.scale.linear()
            .domain([minCancerCount, maxCancerCount])
            .range([5, 30]);

        //根據縣市別，控制顏色
        let fScale = d3.scale.category20();

        //1.先清除原本的X軸線、Y軸線
        d3.select("svg#" + svgId).select('g#axisX').remove();
        d3.select("svg#" + svgId).select('g#axisY').remove();

        //劃出x軸線
        var xAxis = d3.svg.axis()
            .scale(xScale) //指定軸線的比例尺為xScale
            .orient("bottom") //設定刻度在右:表示垂直，刻度朝底下(用以表示x軸)
            .ticks(10); //x軸上間距為8個刻度
        //劃出y軸線
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(12);

        //2.將x軸畫在svg上，並增加axis定義的css 調整軸線及文字樣式
        d3.select("svg#" + svgId)
            .append("g")
            .attr({
                id: "axisX",
                class: "axis",
                //將軸線作位移 (將x軸移到最下方) translate(x, y);
                transform: "translate(" + 0 + "," + parseInt(svgAttr.height - svgAttr.padding + 10) + ")",
            })
            .call(xAxis);
        //2.將y軸畫在svg上
        d3.select("svg#" + svgId)
            .append("g")
            .attr({
                id: "axisY",
                class: "axis",
                //將軸線作位移 (將y軸移到最左方)
                transform: "translate(" + parseInt(svgAttr.padding - 7) + "," + 0 + ")",
            })
            .call(yAxis);

        //3.render畫出圖形
        d3.select("svg#" + svgId).selectAll("circle")
            .transition()
            .attr({
                cx: function (data) {
                    //String covert to date
                    var morbidity = new Date(data.morbidity)
                    return xScale(morbidity);
                },
                cy: function (data) {
                    return yScale(data.avgAge);
                },
                r: function (data) {
                    return rScale(data.cancerCount);
                },
                fill: function (data) {
                    return fScale(data.counties);
                }
            });

        d3.select("svg#" + svgId).selectAll("circle")
            .on("mouseover", function (d) {
                var cx = d3.select(this).attr("cx");
                var cy = d3.select(this).attr("cy");
                //console.log('cx', cx, ' ,cy', cy);
                //將提示框移到滑鼠對應位置
                d3.select("#tool2p")
                    .style({
                        left: (+cx + 20) + "px",
                        top: (+cy + 20) + "px",
                    });

                d3.select("#tool2p").classed("hidden", false);
                //將資料更新至提示框中
                d3.select("#tool2p #city").html('地區: ' + d.counties);
                d3.select("#tool2p #industry").html( d.cancerClass + '<br>癌症發生數: ' + d.cancerCount + '<br>平均年齡: ' + d.avgAge + '<br>癌症診斷年:' + d.morbidity);
            })
            .on("mouseout", function (d) {
                d3.select("#tool2p").classed("hidden", true);
            });

        clearLoader();
    }


    function btnList(dataArray, svgId) {
        //industryArr: 行業別陣列(包含重複項目)           
        var selectQueryArr = dataArray.map(function (d) {
            //若存在industry屬性，回傳物件中的industry(行業名稱)
            if (typeof d.industry !== "undefined") {
                return d.industry;

            } else if (typeof d.cancerClass !== "undefined") {
                return d.cancerClass;
            }
        });
        //uniqueIndustryArr: 行業別陣列(去除重複項目) 
        var uniqueSelectQueryArr = unique(selectQueryArr);

        //filterIndustryArr: 行業別陣列(去除空白項目) 
        var filterSelectQueryArr = uniqueSelectQueryArr.filter(function (d) {
            //去除掉空值的value
            return d != "";
        });

        //新增下拉式選單
        var selection = d3.select("body")
            .append("p")
            //原本:劃出按鈕
            //.append("div")
            //.selectAll("input")
            //劃出下拉式選單
            .append("select")
            .selectAll("option")
            .data(filterSelectQueryArr);

        selection.enter()
            //select
            .append("option")
            //原attr > property (進行參數傳遞)
            .property({
                value: function (d) {
                    return d;
                },
            })
            .text(function (d) {
                return d;
            });

        d3.select("select")
            .on("change", function () {
                let value = d3.select("select").property("value");
                console.log('select value:', value);

                update(dataArray, value, svgId);
            });

    }

    //更新資料 value 即 whereCondition
    function update(dataArray, value, svgId) {
        //過濾行業別符合者 (塞選出只符合傳遞進來的參數:value)
        var newDataSet = dataArray.filter(function (d) {
            //判斷傳進來的行業名稱 要等於原陣列dataArray 的各筆industry
            if (typeof d.industry !== "undefined") {
                return value === d.industry;

            } else if (typeof d.cancerClass !== "undefined") {
                return value === d.cancerClass
            }
        });
        //console.table(newDataSet);
        //重新整理bind,render 重新綁定新資料、及重新渲染一次
        bind(newDataSet, svgId);

        //
        if (svgId == "invoiceInfo") {
            renderForInvoiceInfo(newDataSet, svgId);

        } else if (svgId == "cancerInfo") {
            renderForCancerInfo(newDataSet, svgId);
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

    function clearLoader() {
        d3.select("#loadFont").remove();
    }

    //class test unique Array
    //    var arr1 = ["A", "B", "A", "C"];
    //    var uniArr = unique(arr1);
    //    console.log('uniArr', uniArr);
    //
    //    function unique(array) {
    //        var n = [];
    //        let setArray = new Set();
    //        //去看每個array，如果沒出現過就加到n中      
    //        //use Set
    //        array.forEach(function (data) {
    //            setArray.add(data);
    //        });
    //        //iterator
    //        array.forEach(function (data, index) {
    //            if (n.indexOf(data) == -1) {
    //                n.push(array[index]);
    //            }
    //        });
    //        //return setArray;
    //        return n;
    //    }
    //    var arr2 = [{
    //            city: "台北市",
    //            cid: "A"
    //        },
    //        {
    //            city: "台中市",
    //            cid: "B"
    //        },
    //        {
    //            city: "台北市",
    //            cid: "A"
    //        },
    //        {
    //            city: "基隆市",
    //            cid: "C"
    //        }
    //               ];
    //    //map:組合資料成為新的陣列
    //    var arr3 = arr2.map(function (d) {
    //        return d.cid;
    //    });
    //    console.log('arr3', arr3);
    //    //filter:過濾
    //    let arr4 = arr3.filter(function (d) {
    //        //過濾掉A
    //        return d != 'A';
    //    });


    //hw04

    function drawCancerInfoScatterDiagram() {

        //1. 宣告svgAttr,定義width, height, padding, letterList變數
        svgAttr.width = 900;
        svgAttr.height = 600;
        svgAttr.padding = 60;
        svgAttr.id = 'cancerInfo';

        createSvg(svgAttr.id);

        //3. 用d3讀取csv
        d3.csv("hw04_cancer_data2.csv",
            function (data) {
                //將中文欄位屬性替換成英文屬性
                for (var key in data) {
                    let value = data[key];
                    if (key.indexOf("癌症診斷年") != (-1)) {
                        data.morbidity = value;
                    } else if (key.indexOf("性別") != (-1)) {
                        data.gender = value;
                    } else if (key.indexOf("縣市別") != (-1)) {
                        data.counties = value;
                    } else if (key.indexOf("癌症別") != (-1)) {
                        data.cancerClass = value;
                    } else if (key.indexOf("年齡標準化發生率") != (-1)) {
                        data.ageStandardization = value;
                    } else if (key.indexOf("癌症發生數") != (-1)) {
                        data.cancerCount = value;
                    } else if (key.indexOf("平均年齡") != (-1)) {
                        data.avgAge = value;
                    } else if (key.indexOf("年齡中位數") != (-1)) {
                        data.medianAge = value;
                    } else if (key.indexOf("粗率(每10萬人口)") != (-1)) {
                        data.probability = value;
                    }
                    delete data[key];
                }

                //先將原本資料型態String convert to int
                data.avgAge = +data.avgAge;
                data.cancerCount = parseInt(data.cancerCount);
                return data;
            },
            function (dataArray) {
                //console.table(dataArray);
                
                //4. 建立bind()
                bind(dataArray, svgAttr.id);

                //5. 定義xScale,yScale,rScale, fScale比例尺(range目的在決定在svg上位置)
                renderForCancerInfo(dataArray, svgAttr.id);

                //6. 產生各塞選資料按鈕
                btnList(dataArray, svgAttr.id);

            });
    }




    d3.select("#createInvoiceInfo").on("click", function () {
        d3.select("#loading").append("text")
            .attr({
                id: "loadFont"
            })
            .style({
                "font-family": "微軟正黑體",
                "font-size": "34px",
            })
            .text("Loading.Please wait.")
        drawInvoiceInfoScatterDiagram();
        d3.select("#createInvoiceInfo").style({
            display: 'none',
        })
    });

    d3.select("#createCancerInfo").on("click", function () {
        d3.select("#loading").append("text")
            .attr({
                id: "loadFont"
            })
            .style({
                "font-family": "微軟正黑體",
                "font-size": "34px",
            })
            .text("Loading.Please wait.")
        drawCancerInfoScatterDiagram();
        d3.select("#createCancerInfo").style({
            display: 'none',
        })
    });

}