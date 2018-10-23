//获取图表dom 折线图
var myLine2 = echarts3.init(document.getElementById('main_user2'), 'customed');

var myLine3 = echarts3.init(document.getElementById('main_user3'), 'customed');
//环形图
var bootRate = echarts3.init(document.getElementById('indicatorContainer'));
var topCircle1 = echarts3.init(document.getElementById('circle1'));
var topCircle2 = echarts3.init(document.getElementById('circle2'));
var topCircle3 = echarts3.init(document.getElementById('circle3'));
// 柱状图
var myVbar2 = echarts3.init(document.getElementById('v_bar2'));
var myMap = echarts2.init(document.getElementById('map'));
var userNum, barData, vBarData, mapData, countList = {}, rateList = {}, onlineUser = {}, xData = [], areaList = [],
    kaijilv = [],
    maxVal, totalOpenRate, totalCount, addRate, addCont, barMax = 0, totalRate;
var realStateType = ["LIVE", "VOD", "TIME_SHIFT", "LOOK_BACK"];
var ownFlag = true;
if (ownFlag) {
    serverUrl = "http://172.19.112.11:8080/StarV3Plus/";
} else {
    serverUrl = "../GXXMTDPZS/data/";
}
$(function () {
    var newDate = $ajax.currentTime();
    $(".f_bg p span:eq(1)").html(newDate);
    $ajax.bgAnimation();
    //图表初始化
    $ajax.loadechart();
    //折线初次载入后,默认显示第一条折线
    $ajax.loadLine();
    //获取数据后渲染
    $ajax.getUserOnline();
    $ajax.getChannelTop();
    $ajax.getdataChannel();
    $ajax.getdataMap();
    $ajax.getRealtimeRtg();
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
    topCircle1.resize();
    topCircle2.resize();
    topCircle3.resize();
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
        topCircle1.resize();
        topCircle2.resize();
        topCircle3.resize();
    };

});
var $ajax = {
    //排序
    compare: function (prop) {
        return function (obj1, obj2) {
            if (obj1 && obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }

        }
    },
    //获取本地日期时间
    getDate: function () {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();
        var clock = "";
        if (hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm + ":";
        if (ss < 10) clock += '0';
        clock += ss;
        return (clock);
    },
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

        if (day < 10)
            clock += "0";

        clock += day;
        //clock += ":" + clock;
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
    //频道数据对比请求
    getdataChannel: function () {
        var _that = this, channelUrl = "";
        var date = new Date();
        var startDay = "2018-1-2:2018-1-2";
        //多个折现图
        var allOption = {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',//背景色
            //图例颜色
            animation:false,
            color: ['#F06000', '#1689ff', '#52d168', '#fff'],
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
                    animation: true
                }
            ]
        };
        myLine3.setOption(allOption);
        if (ownFlag) channelUrl = serverUrl + "realtime/getVodTop.do";
        else channelUrl = serverUrl + "program.json";
        $.ajax({
            type: 'POST',
            url: channelUrl,
            data: "",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            beforeSend: function (x) {
                x.setRequestHeader("Content-Type", "application/json;");
            },
            success: function (data) {
                if (!data)return;
                _that.refreshData3(data.filmTop);
            }
        });
    },
    //地图数据请求
    getdataMap: function () {
        var _that = this, mapUrl = "";
        if (ownFlag) mapUrl = serverUrl + "realtime/getCountByArea.do";
        else mapUrl = serverUrl + "areaUser.json";
        $.ajax({
            type: 'POST',
            data: "",
            url: mapUrl,
            async: false,
            dataType: "json",
            success: function (data) {
                data = data.data;
                if (data.length == 0){
                    if(myMap.clear)myMap.clear();
                    $("#rank_list").html("");
                    return;
                };
                _that.setMap(data);
                _that.renderLeftList(data);
            }
        });
    },
    createPieOption: function (data, totalData) {
        topCircle1.setOption({
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
                            value: data.data?((data.data.liveCount / totalData) * 100).toFixed(2):0,
                            name: '占有率',
                            // center:['50%,50%'],
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        return params.percent + "%";
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
                                        fontSize: 15,
                                    }
                                }
                            },
                            hoverAnimation: false
                        },
                        {
                            value: data.data?100 - Number(((data.data.liveCount / totalData) * 100).toFixed(2)):100,
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
        topCircle2.setOption({
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
                            value: data.data?((data.data.VodCount / totalData) * 100).toFixed(2):0,
                            name: '占有率',
                            // center:['50%,50%'],
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        return params.percent + "%";
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
                                        fontSize: 15,
                                    }
                                }
                            },
                            hoverAnimation: false
                        },
                        {
                            value: data.data?100 - Number(((data.data.VodCount / totalData) * 100).toFixed(2)):100,
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
        topCircle3.setOption({
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
                            value: data.data?(((data.data.LookBackCount+data.data.TimeShiftCount) / totalData) * 100).toFixed(2):0,
                            name: '占有率',
                            // center:['50%,50%'],
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        return params.percent + "%";
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
                                        fontSize: 15,
                                    }
                                }
                            },
                            hoverAnimation: false
                        },
                        {
                            value: data.data?100 - Number(((data.data.LookBackCount / totalData) * 100).toFixed(2)):100,
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
    },
    //在线用户数,

    getUserOnline: function () {
        var _that = this, userUrl = "";
        if (ownFlag) userUrl = serverUrl + "realtime/getCountByType.do";
        else userUrl = serverUrl + "userOnline.json";
        $.ajax({
            type: 'get',
            data: "",
            url: userUrl,
            dataType: "json",
            async: false,
            success: function (data) {
                if(data.data)totalCount = Number(data.data.liveCount) + Number(data.data.VodCount) + Number(data.data.TimeShiftCount) + Number(data.data.OtherCount) + Number(data.data.PageViewCount) + Number(data.data.LookBackCount);
                else totalCount=0;
                userNum = common.splitNum(totalCount ? totalCount : "");
                $(".n_1").text(userNum.a1 ? userNum.a1 : "");
                $(".n_2").text(userNum.a2 ? userNum.a2 : "");
                $(".n_3").text(userNum.a3 ? userNum.a3 : "");
                $(".total_num div.t_left:eq(0) span").html(data.data?data.data.StbCount:0);
                $(".total_num div.t_left:eq(1) span").html(totalCount?totalCount:0);
                $(".total_num div.t_left:eq(2) span").html(data.data?data.data.liveCount:0);
                $(".total_num div.t_left:eq(3) span").html(data.data?data.data.VodCount:0);
                $(".total_num div.t_left:eq(4) span").html(data.data?(data.data.LookBackCount+data.data.TimeShiftCount):0);
                $ajax.createPieOption(data, totalCount);
            }
        });
    },
    //实时开机率
    getRealtimeRtg: function () {
        var _that = this, userUrl = "";
        if (ownFlag) userUrl = serverUrl + "realtime/getOnlineData.do";
        else userUrl = serverUrl + "kaijilv.json";
        $.ajax({
            type: 'POST',
            data: "",
            url: userUrl,
            async: false,
            dataType: "json",
            success: function (data) {
                if (!data.data ||data.length == 0){
                    if(myLine2.clear)myLine2.clear();
                    return;
                };
                _that.refreshData(data, "kaijilv");
            }
        });
    },
    //频道TOP请求
    getChannelTop: function () {
        var _that = this, topUrl = "";
        if (ownFlag) topUrl = serverUrl + "realtime/getChannelTop.do";
        else topUrl = serverUrl + "channelTop.json";
        $.ajax({
            type: 'POST',
            url: topUrl,
            data: "",
            async: false,
            dataType: "json",
            success: function (data) {
                if (!data)return;
                _that.refreshData(data, "top");
            }
        });
    },
    //初始化数据处理
    init: function (data) {
        setInterval(function () {
            this.$ajax.getUserOnline();
            this.$ajax.getChannelTop();
            this.$ajax.getdataChannel();
            this.$ajax.getdataMap();
            this.$ajax.getRealtimeRtg();
        }, 20000)
    },
    //渲染图表
    loadechart: function () {
        //区域开机率(环形图)
        var bootRateOption = {
            color: ["#fff"],
            tooltip: {
                show: false,
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
                    radius: ['80%', '85%'],
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
                                    show: false,
                                    // position: "center",
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
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    labelLine: {
                                        show: false
                                    },
                                },
                                emphasis: {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    labelLine: {
                                        show: false
                                    },
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
            color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed'],
            title: {},
            legend: {
                show: false,
                data: ['实时开机率', "直播开机率", "回看开机率", "时移开机率", "页面浏览"]
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        res += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
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
            xAxis: [
                {
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
                        interval: 140,
                        textStyle: {
                            color: 'rgba(255,255,255,0.4)'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: '开机率%',
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
                        formatter: "{value} %",
                        textStyle: {
                            color: 'rgba(255,255,255,0.4)'
                        }
                    },
                }
            ],
            series: [],
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
            color: ["#FFCC00"],
            animation:false,
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
                    animation: true
                }
            ]
        };
        bootRate.setOption(bootRateOption);
        topCircle1.setOption(bootRateOption);
        topCircle2.setOption(bootRateOption);
        topCircle3.setOption(bootRateOption);
        myLine2.setOption(openRateOption);
        myVbar2.setOption(vBarOption);
    },
    renderLeftList: function (data) {
        var datas = data;
        var listString = '';
        var className = "";
        for (var i = 0; i < datas.length; i++) {
            var orderStatusClass = "up";
            if (datas[i].trend > 0) {
                orderStatusClass = "up"
            } else if (datas[i].trend < 0) {
                orderStatusClass = "down"
            } else {
                orderStatusClass = "up"
            }
            if (i == 0) {
                className = "active"
            } else {
                className = "";
            }
            if (datas[i].name == '-1')continue;
            listString += '<li  class ="up ' + className + '" channelId = "">'
                + '<div class="r_name">'
                + '<p><em>' + ((i + 1) < 10 ? "0" + (i + 1) : i + 1) + '</em>'
                + '<span class="city">' + datas[i].name + '</span></p>'
                + '</div>'
                + '<div class="r_number">'
                + '<em>' + datas[i].value + '</em> <p class="' + orderStatusClass + '"><span class="iconfont icon-jiantou-copy"></span></p>'
                + '</div>'
                + '</li>'
            // }
        }
        $("#rank_list").html(listString);
    },
    //多频道的
    refreshData3: function (data) {
        var xData = [];
        var maxData = 0;
        var valueData = [], valueData2 = [];
        for (var i = 0; i < data.data.length; i++) {
            if (i > 9)continue;
            maxData = data.data[i] > maxData ? data.data[i] : maxData;
            valueData2.push(maxData);
            xData.push((i + 1) + " " + data.xdata[i] + ":" + data.data[i]);
            valueData.push(data.data[i]);
        }
        myLine3.setOption({
            yAxis: {
                data: xData,
                textStyle: {
                    fontSize: "12"
                }
            },
            series: [
                {
                    data: valueData2,
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
                    data: valueData,
                    label: {
                        normal: {
                            show: false,
                            position: 'inside',
                            fontSize: "14",
                            formatter: function (params) {
                                var aa = data[params.dataIndex].programName;
                                if (aa.indexOf("未匹配") == -1) {
                                    aa = data[params.dataIndex].programName;
                                } else {
                                    aa = "";
                                }
                                return aa;
                            }
                        }
                    },
                    itemStyle: {normal: {color: 'rgba(234,100,38,1.0)'}}
                }
            ]
        });
    },
    refreshData: function (data, type) {
        areaList = [];
        barData = [];
        maxVal = 0;
        mapData = [];
        vBarData = [];
        function convert_rank(vbar, type) {
            var res = [];
            var item;
            if (type != "top") {
                for (var i = 0; i < vbar.length; i++) {
                    if (i < 10) {
                        vbar[i].audienceRating = (vbar[i].audienceRating).toFixed(2);
                        item = vbar[i].orderNo + "  " + vbar[i].channelName + " : " + vbar[i].audienceRating + "%";
                        res.push(item);
                    }
                }
            } else {
                for (var i = 0; i < vbar.xdata.length; i++) {
                    if (i < 10) {
                        item = (i + 1) + "  " + vbar.xdata[i] + " : " + vbar.data[i];
                        res.push(item);
                    }
                }
            }
            return res
        }

        function dataShadow(a, num) {
            barMax = a[0];
            var res = [];
            for (var i = 0; i < a.length; i++) {
                res.push(Number(barMax));
            }
            return res;
        }

        var date = $ajax.getDate();
        if (xData.length < 6) {
            xData.push(date);
        } else {
            xData.shift();
            xData.push(date);
        }
        if (type == "kaijilv") {
            var axisData = [], value = [], rate = [];
            data.data.sort($ajax.compare("time"));
            for (var i = 0; i < data.data.length; i++) {
                axisData.push((data.data[i].time).substring(0, 5));
            }
            var list = [], typeName = ["powerCount", "liveCount", "LookBackCount", "TimeShiftCount", "OtherCount"];
            for (var j = 0; j < typeName.length; j++) {
                var s = [];
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i][typeName[j]] == "0.0" && data.data[i - 1] && data.data[i - 1][typeName[j]] != "0.0") {
                        if (data.data[i + 1] && data.data[i + 1][typeName[j]] == "0.0")break;
                        else continue;
                    } else s.push((data.data[i][typeName[j]] * 100).toFixed(3));
                    if (typeName[j] == "powerCount" && data.data[i][typeName[j]] != "0.0")totalRate = Number(data.data[i][typeName[j]]*100).toFixed(2);
                }
                list.push(s)
            }
            myLine2.setOption({
                xAxis: {
                    data: axisData
                },
                series: [
                    {
                        name: '实时开机率',
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        data: list[0]
                    }
                    , {
                        name: '直播开机率',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        data: list[1]
                    }, {
                        name: '回看开机率',
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        data: list[2]
                    }, {
                        name: '时移开机率',
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        data: list[3]
                    }, {
                        name: '页面浏览开机率',
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        data: list[4]
                    }
                ]
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
                                value: totalRate,
                                name: '占有率',
                                label: {
                                    normal: {
                                        formatter: function (params) {
                                            return params.percent + "%";
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
                                value: 100 - Number(totalRate),
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
        }
        else {
            $.each(data.gx001Data.data, function (index, value, array) {//频道,节目排名
                if (index < 10) vBarData.push((value));
            });
            myVbar2.setOption({
                yAxis: {
                    data: convert_rank(data.gx001Data, "top"),
                    textStyle: {
                        fontSize: "12"
                    }
                },
                color: ["#FFCC00"],
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
                                    var aa = data[params.dataIndex].programName;
                                    if (aa.indexOf("未匹配") == -1) {
                                        aa = data[params.dataIndex].programName;
                                    } else {
                                        aa = "";
                                    }
                                    return aa;
                                }
                            }
                        },
                        itemStyle: {normal: {color: "#FF9900"}}
                    }
                ]
            });
        }
    },
    setMap: function (data) {
        //地图配置项
        var maxValue = 2000;
        var geoCoords = {
            "南宁市": [108.479,23.1152],
            "玉林市": [110.2148,22.3792],
            "贵港市": [109.9402,23.3459],
            "柳州市": [109.3799,24.9774],
            "桂林市": [110.5554,25.318],
            "百色市": [106.6003,23.9227],
            "钦州市": [109.0283,22.0935],
            "崇左市": [107.3364,22.4725],
            "河池市": [107.8638,24.5819],
            "北海市": [109.314,21.6211],
            "来宾市": [109.7095,23.8403],
            "梧州市": [110.9949,23.5052],
            "贺州市": [111.3135,24.4006],
            "防城港市": [108.0505,21.9287]
        };
        var valueList = data.map(function (cur) {
            return cur.value
        });
        maxValue = Math.max.apply(null, valueList);
        function convertData(value) {
            var res = [];
            for (var i = 0; i < value.length; i++) {
                maxValue = maxValue > value[i].value ? maxValue : value[i].value;
                var geoCoord = geoCoords[value[i].name];
                if (geoCoord) {
                    res.push({
                        name: value[i].name,
                        value: value[i].value
                    });
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
                data: ['广西'],
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
                max: Math.floor(maxValue / 100) * 100 + 100,
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
                    name: '广西',
                    type: 'map',
                    roam: false,
                    hoverable: false,
                    mapType: '广西',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: function (prames, ticket, callback) {
                                    var name = "";
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
                    name: '南宁',
                    type: 'map',
                    mapType: '广西',
                    data: [],
                    markPoint: {
                        symbol: 'emptyCircle',
                        symbolSize: function (v) {
                            return 10 + v / 200000
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
                        data: convertData(data)
                    }
                }
            ]
        };
        myMap.setOption(myoption);
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
