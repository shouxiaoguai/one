//获取图表dom 折线图
var myLine2 = echarts3.init(document.getElementById('main_user2'), 'customed');

var myLine3 = echarts3.init(document.getElementById('main_user3'), 'customed');
//环形图
var bootRate = echarts3.init(document.getElementById('indicatorContainer'));
var topCircle1 = echarts3.init(document.getElementById('circle1'));
// var topCircle2 = echarts3.init(document.getElementById('circle2'));
// 柱状图
var myVbar2 = echarts3.init(document.getElementById('v_bar2'));
var myMap = echarts2.init(document.getElementById('map'));
var userNum, barData, vBarData, mapData, countList = {}, rateList = {}, onlineUser = {}, xData = [], areaList = [],
    kaijilv = [],randomNum=0,
    maxVal, totalOpenRate, totalCount, addRate, addCont, barMax = 0;
var realStateType = ["LIVE", "VOD", "TIME_SHIFT", "LOOK_BACK"];
var mapFlag = false;
var ownFlag = false;
if (ownFlag) {
//	myUrl = "../data/getRealData";
    myUrl = "../hun/data/getRealData.json";
} else {
    myUrl = serverUrl + "real/getRealData";
}


$(function () {
    $ajax.bgAnimation();
    //图表初始化
    $ajax.loadechart();
    //折线初次载入后,默认显示第一条折线
    $ajax.loadLine();
    //获取数据后渲染
    $ajax.getdata();
    $ajax.getdataChannel();
    $ajax.getdataMap();
    //图表的legend切换
    $ajax.init();
    $ajax.legendToggle();
    //$ajax.setMap();
    //自动获取当前时间
    var win_height = $(window).height();
    var textFontSize = ((win_height / 700 * 100) * 0.95).toFixed(1);
    var unit = "px";
    $("html").css("font-size", textFontSize + unit);
    myLine3.resize();
    myLine2.resize();
    myVbar2.resize();
    myMap.resize();
    setInterval(function () {
        common.getTime();
    }, 500);
    window.onresize = function () {
        var win_height = $(window).height();
        var textFontSize = ((win_height / 700 * 100) * 0.95).toFixed(1);
        var unit = "px";
        $("html").css("font-size", textFontSize + unit);
        myLine3.resize();
        myLine2.resize();
        myVbar2.resize();
        myMap.resize();
    };

});
var $ajax = {
    //获取当前日期
    currentTime: function () {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var clock = year + "-";
        if (month < 10)
            clock += "0";

        clock += month + "-";
		day=day-2;
        if (day < 10)
            clock += "0";

        clock += day;
        clock += ":" + clock;
        return (clock);
    },
//背景动画
    bgAnimation: function () {
        particlesJS('pointerbg', {
            particles: {
                color: '#0b4294',
                shape: 'circle',
                opacity: 1,
                size: 4,
                size_random: true,
                nb: 350,
                line_linked: {
                    enable_auto: true,
                    distance: 70,
                    color: '#0679b8',
                    opacity: 1,
                    width: 1,
                    condensed_mode: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 600
                    }
                },
                anim: {
                    enable: true,
                    speed: 2
                }
            },
            interactivity: {
                enable: false,
                mouse: {
                    distance: 250
                },
                detect_on: 'canvas', // "canvas" or "window"
                mode: 'grab',
                line_linked: {
                    opacity: .5
                },
                events: {
                    onclick: {
                        enable: true,
                        mode: 'push', // "push" or "remove" (particles)
                        nb: 4
                    }
                }
            },
            /* Retina Display Support */
            retina_detect: true
        });
    },
    //获取数据
    getdata: function () {
        var _that = this;
        $.ajax({
            type: 'get',
            async: false,
            url: myUrl,
            dataType: "json",
            success: function (data) {
                data = data.data;
                if (!data.hasData)return;
                var onLineStbNum=parseInt((data.totalCount/3983959)*7224516)+randomNum;
                userNum = common.splitNum(onLineStbNum ? onLineStbNum : "");
                $(".n_1").text(userNum.a1 ? userNum.a1 : "");
                $(".n_2").text(userNum.a2 ? userNum.a2 : "");
                $(".n_3").text(userNum.a3 ? userNum.a3 : "");
                totalOpenRate = data.totalOpenRate ? data.totalOpenRate : 0;
                totalCount = onLineStbNum ? onLineStbNum : 0;
                var oldOpenRate = sessionStorage.getItem("totalOpenRate");
                var oldtotalCount = sessionStorage.getItem("totalCount");
                // oldOpenRate=Number(oldOpenRate)-Number(Math.random().toFixed(2));
                if (oldOpenRate) {
                    addRate = data.totalOpenRate - oldOpenRate > 0 ? "+ " + (data.totalOpenRate - oldOpenRate).toFixed(2) + "%" : ((data.totalOpenRate - oldOpenRate) * 1).toFixed(2) + "%";
                    $(".n_info span").text(addRate != "0.00%" ? addRate : "0%");
                } else {
                    $(".n_info span").text("0%");
                }
                if (oldtotalCount) {
                    addCont = data.totalCount - oldOpenRate > 0 ? "+ " + (data.totalCount - oldOpenRate) : ((data.totalCount - oldOpenRate)).toFixed(2);

                }
                /*var totalStbNum = 0, totalRate = 0;
                 for (var i = 0; i < data.realUserInfoList.length; i++) {
                 var item = data.realUserInfoList[i];
                 var num = item.count;
                 var stbNum = common.toThousands(num);
                 var rate = item.openRate;
                 $(".toggle1 li:eq(" + i + ") div:eq(1) span").html(stbNum);
                 $(".toggle2 li:eq(" + i + ") div:eq(1) span").html(rate + '%');
                 $(".toggle3 li:eq(" + i + ") div:eq(1) span").html(data.realStateTypeUserCountMap[realStateType[i]]);
                 }*/
				_that.setMap(data);
                _that.refreshData(data);
				_that.renderLeftList(data);
                sessionStorage.setItem("totalOpenRate", data.totalOpenRate);
            }
        });
    },
    //频道数据对比请求
    getdataChannel: function () {
        var _that = this;
        var date = new Date();
        var startDay = "2017-10-23:2017-10-23";
		// var startDay = currentTime();
        //多个折现图
        var allOption = {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',//背景色
            //图例颜色
            color: ['#F06000', '#1689ff', '#52d168', '#fff'],
            title: {},
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var res = params[0].name;
                    for (var i = 0; i < params.length; i++) {
                        res += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ": " + params[i].value + "%" + '</p>'
                    }
                    return res;
                }
            },
            legend: {
                show: false,
                data: []
            },
            toolbox: {
                show: false
            },
            grid: {
                left: '1%',
                right: '3%',
                bottom: '3%',
                top: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                splitLine: {
                    show: false
                },
                axisTick: false,
                axisLine: false,
                //刻度文字的颜色
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.4)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                show: true,
                splitLine: {
                    show: false
                },
                axisLine: false,
                axisTick: false,
                //刻度文字的颜色
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.4)'
                    }
                }

            },
            series: [
                {
                    name: '邮件营销',
                    type: 'line',
                    smooth: true,
                    hoverAnimation: false,
                    /*symbolSize: 9,*/
                    /*areaStyle: {normal: {color:"rgba(240,96,0,.4)"}},*/
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    smooth: true,
                    hoverAnimation: false,
                    /*symbolSize: 9,*/
                    /*areaStyle: {normal: {color:"rgba(22,137,255,.4)"}},*/
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '视频广告',
                    type: 'line',
                    smooth: true,
                    hoverAnimation: false,
                    /*symbolSize: 9,*/
                    /*areaStyle: {normal: {color:"rgba(82,209,104,.4)"}},*/
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '直接访问',
                    type: 'line',
                    smooth: true,
                    hoverAnimation: false,
                    /*symbolSize: 9,*/
                    /*areaStyle: {normal: {color:"rgba(255,255,255,.4)"}},*/
                    data: [320, 332, 301, 334, 390, 330, 320]
                }
            ]
        };
        myLine3.setOption(allOption);
        if (ownFlag) {
            data = channelData;
            data = data.data;
            var result = _.groupBy(data, function (v) {
                return v.channelName;
            });
            var results = _.map(result, function (value, key) {
                return {valueList: value, key: key}
            });

            _that.refreshData3(results);
        } else {
            $.ajax({
                type: 'POST',
                url: serverUrl + "live/getLiveData",
                data: JSON.stringify({
                    params: {
                        "dayRange": startDay,
                        "timeRange": "00:00:00-23:59:59",
                        "areaCode": 14300,
                        "cityCodeList": [],
                        "operator": "HNDX",
                        "sourceType": "HNDX_ALL",
                        "channelGroupCode": -1,
                        "channelCodeList": ["c006", "c098", "c141", "c090"],
                        "indexSet": ["audienceRating"],
                        "showProgram": false,
                        "programNameSet": [],
                        "programGroupFlag": true,
                        "dayInterval": "NONE",
                        "timeInterval": "HOUR",
                        "groupFlag": false
                    },
                    pageInfo: {
                        "topLimit": 10,
                        "currentPage": 1,
                        "currentMaxItemLength": 1000,
                        "total": 0
                    }
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                beforeSend: function (x) {
                    x.setRequestHeader("Content-Type", "application/json;");
                },
                success: function (data) {
                    if (ownFlag) {
                        data = channelData;
                    }
                    data = data.data;
                    var result = _.groupBy(data, function (v) {
                        return v.channelName;
                    });
                    var results = _.map(result, function (value, key) {
                        return {valueList: value, key: key}
                    });
                    _that.refreshData3(results);
                }
            });
        }
    },
    //地图数据请求
    getdataMap: function () {
        var _that = this;
        $.ajax({
            type: 'get',
            async: false,
            url: myUrl,
            dataType: "json",
            success: function (data) {
                data = data.data;
                if (!data.hasData)return;
                _that.setMap(data);
                _that.renderLeftList(data);
            }
        });
    },
    //初始化数据处理
    init: function (data) {
        // this.getdata();
        setInterval(function () {
            this.$ajax.getdata();
			randomNum=Math.floor(Math.random()*(250-200+1)+200);
            //this.$ajax.getdataChannel();
        }, 20000)
    },
    //渲染图表
    loadechart: function () {
        //区域开机率(环形图)
        var bootRateOption = {
            color: ["#fff"],
            tooltip: {
                trigger: 'item',
                formatter: "{a} : {d}%"
            },
            legend: {
                show: false,
                orient: 'vertical',
                left: 'left',
                data: ['开机率']
            },
            series: [
                {
                    name: '开机率',
                    type: 'pie',
                    radius: ['66%', '70%'],
                    label: {
                        normal: {
                            position: 'center',
                            verticalAlign: "middle"
                        }
                    },
                    data: [
                        {
                            value: 0,
                            name: '占有率',
                            label: {
                                normal: {
                                    position: 'center',
                                    verticalAlign: "middle",
                                    formatter: '{d} %',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 12
                                    }
                                }
                            },
                            hoverAnimation: false
                        }, {
                            value: 100,
                            name: '',
                            label: {
                                normal: {
                                    position: "center",
                                    textStyle: {
                                        color: '#2b2a3b',
                                        fontSize: 12
                                    }
                                }
                            },
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: '#2b2a3b'
                                },
                                emphasis: {
                                    color: '#2b2a3b'
                                }
                            },
                            hoverAnimation: false
                        }]
                }
            ]
        };
        //折线图
        var openRateOption = {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',//背景色
            //图例颜色
            color: ['#ffa500', '#1689ff', '#52d168', '#fff'],
            title: {},
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var res = params[0].name;
                    for (var i = 0; i < params.length; i++) {
                        res += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ": " + params[i].value + '</p>'
                    }
                    return res;
                }
            },
            grid: {
                left: '1%',
                right: '6%',
                bottom: '0',
                top: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                splitLine: {
                    show: false
                },
                axisTick: false,
                axisLine: false,
                //刻度文字的颜色
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.4)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                show: true,
                // splitNumber: "0",
                splitLine: {
                    show: false
                },
                axisLine: false,
                axisTick: false,
                //刻度文字的颜色
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.4)'
                    }
                }

            },
            // yAxis: {
            // 	type: 'value',
            // 	scale: true,
            // 	min:"0",
            // 	max:"100",
            // 	splitNumber:"3",
            // 	show: true,
            // 	splitLine: {
            // 		show: false
            // 	},
            // 	axisLine: false,
            // 	axisTick: false,
            // 	axisLabel: {
            // 		show: true,
            // 		textStyle: {
            // 			color: 'rgba(255,255,255,0.4)'
            // 		}
            // 	}

            // },
            series: [
                {
                    name: '湖南电信',
                    type: 'line',
                    stack: '总量1',
                    data: [],
                    lineStyle: {
                        normal: {color: '#ffa500'}
                    },
                    symbolSize: 9,
                    symbol: 'emptyCircle',
                    smooth: true,
                    show: false
                }
            ],
            // 右上角下载图表删除
            toolbox: {
                show: false
            }
        };


        // 横向柱状图配置项
        var vBarOption = {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',//背景色
            tooltip: {
                show: false,
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].name;
                }
            },
            grid: {
                left: '2.4%',
                right: '2%',
                top: '7.3%',
                bottom: '0%',
                containLabel: true,

            },
            xAxis: {
                type: 'value',
                show: false,
                max: function (value) {
                    return value.max * 1.02
                },
                splitLine: {
                    show: false
                },
                axisLine: false,
                axisTick: false,
                //刻度文字的颜色
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.4)'
                    }
                },
                position: 'right'
            },
            yAxis: {
                inverse: true,
                type: 'category',
                data: [],
                position: 'right',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                    interval: 0,
                },
                axisLine: true,

            },
            series: [
                {
                    name: '数据',
                    type: 'bar',
                    max: 1000000,
                    min: 0,
                    data: [],
                    itemStyle: {normal: {color: 'rgba(40,181,65,0.7)'}}
                },
                { // For shadow
                    type: 'bar',
                    itemStyle: {
                        normal: {color: 'rgba(0,0,0,0.2)'}
                    },
                    barGap: '-100%',
                    barCategoryGap: '45%',
                    animation: true,
                },

            ]
        };
        bootRate.setOption(bootRateOption);
        // topCircle1.setOption(bootRateOption);
        // topCircle2.setOption(bootRateOption);
        myLine2.setOption(openRateOption);
        myVbar2.setOption(vBarOption);
    },
    renderLeftList: function (data) {
        var datas = data.operatorRealAreaUserCountMap.ALL;
        var listString = '';
        var className = "";
        for (var i = 0; i < datas.length; i++) {
            var orderStatusClass = "up";
            if (datas[i].orderStatus == "UP") {
                orderStatusClass = "up"
            } else if (datas[i].orderStatus == "DOWN") {
                orderStatusClass = "down"
            } else {//UNCHANGED
                orderStatusClass = "up"
            }
            if (i == 0) {
                className = "active"
            } else {
                className = "";
            }
            // if(i == 10 ){
            // 	listString += '<li  class ="up '+className+'" channelId = "">'
            // 	+ '<div class="r_name">'
            // 	+ '<p><em>' + ((i + 1) < 10 ? "0" + (i + 1) : i + 1) + '</em>'
            // 	+ '<span class="city">' + "湘西土家族苗族自治州"+ '</span></p>'
            // 	+ '</div>'
            // 	+ '<div class="r_number">'
            // 	+ '<em>' + datas[i].count + '</em> <p class="' + orderStatusClass + '"><span class="iconfont icon-jiantou-copy"></span></p>'
            // 	+ '</div>'
            // 	+ '</li>'
            // }else{


            listString += '<li  class ="up ' + className + '" channelId = "">'
                + '<div class="r_name">'
                + '<p><em>' + ((i + 1) < 10 ? "0" + (i + 1) : i + 1) + '</em>'
                + '<span class="city">' + datas[i].areaName + '市</span></p>'
                + '</div>'
                + '<div class="r_number">'
                + '<em>' + parseInt((datas[i].count)*7224516/3983959) + '</em> <p class="' + orderStatusClass + '"><span class="iconfont icon-jiantou-copy"></span></p>'
                + '</div>'
                + '</li>'
            // }
        }
        $("#rank_list").html(listString);
    },
    //多频道的
    refreshData3: function (data) {
        var xData = [];
        var name = [];
        var valueData = [];
        var dataData = [];
        for (var i = 0; i < data.length; i++) {
            name.push(data[i].key);
            var val = data[i].valueList;
            dataData = [];
            for (var j = 0; j < val.length; j++) {
                if (i == 0) {
                    xData.push(val[j].timeRange.split("-")[0]);
                }
                dataData.push(val[j].audienceRating);
            }
            valueData.push(dataData);
            $(".toggle3 li:eq(" + i + ") div:eq(1) p").html(data[i].key);
        }

        myLine3.setOption({
            xAxis: {
                data: xData
            },
            yAxis: {
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            series: [
                {
                    name: name[0],
                    data: valueData[0],
                    smooth: true,
                    /*areaStyle: {normal: {}},*/
                    max: 100,
                    min: 0
                },
                {
                    name: name[1],
                    data: valueData[1],
                    smooth: true,
                    /*areaStyle: {normal: {}},*/
                    max: 100,
                    min: 0,

                },
                {
                    name: name[2],
                    data: valueData[2],
                    smooth: true,
                    /*areaStyle: {normal: {}},*/
                    max: 100,
                    min: 0
                },
                {
                    name: name[3],
                    data: valueData[3],
                    smooth: true,
                    /*areaStyle: {normal: {}},*/
                    max: 100,
                    min: 0
                }
            ]
        });
    },
    refreshData: function (data) {
        areaList = [];
        barData = [];
        maxVal = 0;
        mapData = [];
        vBarData = [];
        function convert_rank(vbar, type) {
            var res = [];
            var item;
            if (type != "program") {
                for (var i = 0; i < vbar.length; i++) {
                    if (i < 10) {
                        vbar[i].audienceRating = (vbar[i].audienceRating).toFixed(2);
                        item = vbar[i].orderNo + "  " + vbar[i].channelName + " : " + vbar[i].audienceRating + "%";
                        res.push(item);
                    }
                }
            } else {
                for (var i = 0; i < vbar.length; i++) {
                    if (i < 10) {
                        vbar[i].audienceRating = (vbar[i].audienceRating).toFixed(2);
                        item = vbar[i].orderNo + "  " + (vbar[i].channelName.length > 7 ? vbar[i].channelName.substr(0, 7) : vbar[i].channelName) + " : " + vbar[i].audienceRating + "%";// +"-"+ (vbar[i].programName.length>7?vbar[i].programName.substr(0,7):vbar[i].programName);
                        res.push(item);
                    }
                }
            }
            return res
        };

        function dataShadow(a, num) {
            barMax = a[0];
            var res = [];
            for (var i = 0; i < a.length; i++) {
                res.push(Number(barMax));
            }
            return res;
        }


        if (xData.length < 6) {
            xData.push(data.currentTime.split(" ")[1].substr(0));
        } else {
            xData.shift();
            xData.push(data.currentTime.split(" ")[1].substr(0));
        }

        if (kaijilv.length < 6) {
            kaijilv.push(totalCount);
        } else {
            kaijilv.shift();
            kaijilv.push(totalCount);
        }
        $.each(data.operatorRealChannelResultTopMap.ALL, function (index, value, array) {//频道,节目排名
            if (index < 10) vBarData.push((value.audienceRating).toFixed(2));
        });
        bootRate.setOption({
            series: [
                {
                    name: '开机率',
                    type: 'pie',
                    radius: ['90%', '96%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            position: 'center',
                            verticalAlign: "middle"
                        }
                    },
                    data: [
                        {
                            value: ((data.totalCount/3983959)*100).toFixed(2),
                            name: '占有率',
                            // center:['50%,50%'],
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        return Math.ceil(params.percent) + "%";
                                    },
                                    textStyle: {
                                        position: 'center',
                                        color: '#fff',
                                        itemStyle: {
                                            color: '#fff',
                                            borderColor: "#fff",
                                            borderWidth: 1
                                        },
                                        boderWidth: 3,
                                        align: 'center',
                                        fontSize: 22,
                                    }
                                }
                            },
                            hoverAnimation: false
                        },
                        {
                            value: 100 - Number(((data.totalCount/3983959)*100).toFixed(2)),
                            name: '',
                            label: {
                                normal: {
                                    show: false,
                                    position: "center",
                                    textStyle: {
                                        color: 'red',
                                        fontSize: 18
                                    }
                                }
                            },
                            color: "#ccc",
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(255,255,255,.4)',
                                    borderColor: "rgba(51,67,78,1)",
                                    borderWidth: 1
                                }
                            },
                            hoverAnimation: false
                        }]
                }
            ]
        });
       /* topCircle1.setOption({
            series: [
                {
                    name: '开机率',
                    type: 'pie',
                    radius: ['82%', '88%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            position: 'center',
                            verticalAlign: "middle"
                        }
                    },
                    data: [
                        {
                            value: 150,
                            name: '占有率',
                            // center:['50%,50%'],
                            label: {
                                normal: {
                                    formatter: '{d} %',
                                    textStyle: {
                                        position: 'center',
                                        color: '#fff',
                                        align: 'center',
                                        itemStyle: {
                                            color: '#fff',
                                            borderColor: "#fff",
                                            borderWidth: 1
                                        },
                                        fontSize: 14,
                                    }
                                }
                            },
                            hoverAnimation: false
                        },
                        {
                            value: 50,
                            name: '',
                            label: {
                                normal: {
                                    position: "center",
                                    textStyle: {
                                        color: '#2b2a3b',
                                        fontSize: 14
                                    }
                                }
                            },
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: "rgba(255,255,255,.4)",
                                    borderColor: "rgba(51,67,78,1)",
                                    borderWidth: 1
                                }
                            },
                            hoverAnimation: false
                        }]
                }
            ]
        });*/
        /*topCircle2.setOption({
            series: [
                {
                    name: '开机率',
                    type: 'pie',
                    radius: ['82%', '88%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            position: 'center',
                            verticalAlign: "middle"
                        }
                    },
                    data: [
                        {
                            value: 50,
                            name: '占有率',
                            // center:['50%,50%'],
                            label: {
                                normal: {
                                    formatter: '{d} %',
                                    textStyle: {
                                        position: 'center',
                                        color: '#fff',
                                        align: 'center',
                                        fontSize: 14,
                                    }
                                }
                            },
                            hoverAnimation: false
                        },
                        {
                            value: 200,
                            name: '',
                            label: {
                                normal: {
                                    position: "center",
                                    textStyle: {
                                        color: '#2b2a3b',
                                        fontSize: 14
                                    }
                                }
                            },
                            tooltip: {
                                show: true
                            },
                            itemStyle: {

                                normal: {
                                    color: 'rgba(255,255,255,.4)',
                                    borderColor: "rgba(51,67,78,1)",
                                    borderWidth: 1
                                }
                            },
                            hoverAnimation: false
                        }]
                }
            ]
        });*/
        myLine2.setOption({
            xAxis: {
                data: xData
            },
            yAxis: {
				splitNumber:3,
                axisLabel: {
                    formatter: function(value,index){
                        value=" "+Math.ceil(value);
                        return value;
                    }
                }
            },
            series: [
                {
                    name: '在线用户数',
                    data: /*rateList['湖南电信']*/kaijilv,
                    max: 100,
                    min: 0
                }
            ]
        });

        myVbar2.setOption({

            yAxis: {
                data: convert_rank(data.operatorRealChannelResultTopMap.ALL, "program"),
                textStyle: {
                    fontSize: "12"
                }
            },
            series: [
                {
                    data: dataShadow(vBarData),
                    label: {
                        normal: {
                            show: false,
                            position: 'inside'
                        }
                    },
                    itemStyle: {
                        normal: {color: 'rgba(24,28,60,1.0)'},
                        emphasis: {color: 'rgba(0,0,0,.1)'}
                    }
                },
                {
                    data: vBarData,
                    label: {
                        normal: {
                            show: false,
                            position: 'inside',
                            fontSize: "14",
                            formatter: function (params) {
                                var aa = data.operatorRealChannelResultTopMap.ALL[params.dataIndex].programName;
                                if (aa.indexOf("未匹配") == -1) {
                                    aa = data.operatorRealChannelResultTopMap.ALL[params.dataIndex].programName;
                                } else {
                                    aa = "";
                                }
                                return aa;
                            }
                        }
                    },
                    itemStyle: {normal: {color: 'rgba(234,100,38,1.0)'}}
                },
            ]
        });

    },
    setMap: function (data) {
        //地图配置项
        var geoCoords = {
            "张家界": [110.47, 29.13],
            "吉首": [109.71, 28.26],
            "怀化": [110, 27.575],
            "常德": [111.698, 29.037],
            "益阳": [112.361, 28.560],
            "长沙": [113, 28.21],
            "岳阳": [113.334, 29.032],
            "湘潭": [112.41, 27.87],
            "株洲": [113.334, 27.83],
            "娄底": [111.795, 27.70],
            "邵阳": [111.46, 27.22],
            "永州": [111.612, 26.42],
            "郴州": [113.16, 25.77],
            "衡阳": [112.61, 26.89]
        }

        function convertDataAll0(value) {
            var res = [];
            for (var i = 0; i < value.length; i++) {
                var geoCoord = geoCoords[value[i].areaName];
                if (geoCoord) {
                    res.push([{
                        name: value[i].areaName,
                    }, {
                        name: "长沙"
                    }]);
                }
            }
            return res;
        };
        function convertData(value) {
            var res = [];
            for (var i = 0; i < value.length; i++) {
                var geoCoord = geoCoords[value[i].areaName];
                if (geoCoord) {
                    res.push({
                        name: value[i].areaName,
                        value: value[i].count
                    });
                }
            }
            return res;
        };
        function convertDataAll(value) {
            var res = [];
            for (var i = 0; i < value.length; i++) {
                var geoCoord = geoCoords[value[i].areaName];
                if (geoCoord) {
                    res.push([{
                        name: value[i].areaName
                    }, {
                        name: "长沙",
                        value: value[i].count
                    }]);
                }
            }
            return res;
        };
        var myoption = {
            backgroundColor: 'rbga(0,0,0,0)',
            color: ['gold', 'aqua', 'lime'],
            title: {},
            tooltip: {
                trigger: 'item',
                formatter: function (params, ticket, callback) {
                    if (!params.percent) {
                        params.name == "湘西土家族苗族自治州" ? params.name = "吉首市" : null;
                        return params.name;
                    }
                    var res = params.name;
                    var name = res.substr(0, 2);
                    var index = res.indexOf(">");
                    if (index !== -1) {
                        res = res + "<br/>" + name + " : " + params.percent;
                    } else {
                        res = res + " : " + params.value;
                    }
                    return res;
                }
            },
            legend: {
                show: false,
                orient: 'vertical',
                x: 'left',
                data: ['长沙'],
                selectedMode: 'single',
                selected: {},
                textStyle: {
                    color: '#fff'
                }
            },
            toolbox: {
                show: false,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            dataRange: {
                show: true,
                min: 0,
                max: Math.floor(data.operatorRealAreaUserCountMap.ALL[0].count / 100) * 100 + 100,
                itemHeight: 13,
                calculable: true,
                x: '14%',
                y: "68%",
                color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                //  color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                textStyle: {
                    color: '#fff'
                }
            },
            series: [
                {
                    name: '湖南',
                    type: 'map',
                    roam: false,
                    hoverable: false,
                    mapType: '湖南',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: function (prames, ticket, callback) {
                                    var name = "";
                                    if (prames == "湘西土家族苗族自治州") prames = "吉首市";
                                    name = prames;
                                    return name;
                                },
                                textStyle: {
                                    color: '#FFF',
                                    fontSize: 11,

                                }
                            },
                            borderWidth: "1",
                            borderColor: '#fff',
                            areaStyle: {
                                color: 'rgba(26,26,26,0.1)',
                            }
                        }
                    },
                    data: [],
                    geoCoord: geoCoords
                },
                {
                    name: '长沙',
                    type: 'map',
                    mapType: '湖南',
                    data: [],
                    markPoint: {
                        symbol: 'emptyCircle',
                        symbolSize: function (v) {
                            return 8 + v / 200000
                        },
                        effect: {
                            show: true,
                            shadowBlur: 0
                        },
                        itemStyle: {
                            normal: {
                                label: {show: false}
                            },
                            emphasis: {
                                label: {position: 'top'}
                            }
                        },
                        data: convertData(data.operatorRealAreaUserCountMap.ALL)
                    }
                }
            ]
        };
        myMap.setOption(myoption);
        mapFlag = true;
    },
    legendToggle: function () {
        $('.toggle2').on('click', 'li', function () {
            var line = {
                legend: {
                    selected: {
                        '在线用户数': true
                    }
                }
            }
            myLine2.setOption(line);
        });
    },
    loadLine: function () {
        myLine2.setOption({
            legend: {
                selected: {
                    '在线用户数': true
                }
            }
        });
    }
};
