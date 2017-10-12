window.onload = function () {


    let lat = 25.143271;
    let lng = 121.548725;


        // 產生 Google Map…
        var map = new google.maps.Map(
            d3.select("#map").node(), {
                zoom: 12,    //放大顯示的倍率
                center: new google.maps.LatLng( lat, lng),    //定位
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

    // 讀取外部資料，讀完後建立一個overlay，注意路徑的反斜線 > "/" not > "\"

    d3.csv("taipei-toilets/taipei-toilets/taipei-toilets.csv", function (dataSet) {

        //console.table(dataSet);

        var overlay = new google.maps.OverlayView();

        // 當overlay加入後，增加一個分層layer

        overlay.onAdd = function () {
            var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                .attr("class", "stations");

            // 畫出獨立的每一個資料點
            overlay.draw = function () {
                var projection = this.getProjection(),
                    padding = 10;

                var marker = layer.selectAll("svg")
                    //entries，變成key value的資料結構，
                    //所以69行d需先取出value再取name
                    .data(d3.entries(dataSet))
                    .each(transform)
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker");

                // 增加圓點，並打開滑鼠事件，讓文字在滑鼠移入時出現
                marker.append("circle")
                    .attr("r", 7)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    //此this為資料圓球
                    .on("mouseover", function (d) {
                        //選擇這顆球的parent在選擇其同階層的text
                        //並打透明度調高為1 (並非直接修改圓球透明度)
                        d3.select(this.parentNode).select("text").attr({
                            opacity: 1
                        });
                    })
                    //滑鼠移開再將透明度調為0
                    .on("mouseout", function (d) {
                        d3.select(this.parentNode).select("text").attr({
                            opacity: 0
                        });
                    });

                // 增加文字說明
                marker.append("text")
                    .attr({
                        x: padding + 20,
                        y: padding,
                        "font-size": "13px",
                        opacity: 0
                    })
                    .text(function (d) {
                        //
                        return d.value.name ;
                    })


                function transform(d) {
                    //將資料中的經緯度，轉換為對應地方的圓球
                    //console.log(d);
                    d = new google.maps.LatLng( d.value.lat, d.value.lng);
                    //換轉換到畫面位置
                    d = projection.fromLatLngToDivPixel(d);
                    
                    return d3.select(this)
                    //css 已經設定為position: absolute;
                    //利用left、top調整到圓球位置
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };

        // 綁定overlay到地圖中
        overlay.setMap(map);
    });



}