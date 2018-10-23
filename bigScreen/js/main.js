var myChart = echarts.init(document.getElementById('now'));
var myBar = echarts.init(document.getElementById('monitor'));
var dataBarIn = [];
var dataBarOut = [];
var timeBar = [];
var dataLineX = [];
var dataLineY = [];
var dataLineY1 = [];
var mychart_legend = true;
var line_now_index = 0;
var dataLine_now;
var channelId;
var bar_topIn = [];
var bar_topOut = [];
window.timer = null;
window.line_loop = null;
var num = 0;
var now_index = 0;
var bar_info = {
	categoryData: [],
	data1: [],
	data2: [],
	data3: [],
}
// var xhrurl = "../data/data.json";
// var xhrurl = "http://47.92.142.23:8080/hunan/real/getRealData";
var li_height = $('#rank_list li:eq(0)').outerHeight();
var list_length = 10,dateTime="",status=true,currentIndex=0,typeName="实时收视率";
$(function () {
	//图表初始化
	ajax.init();
	//图表初始化
	ajax.channelLoad();
	//改变频道
	ajax.channelClick();
	//获取时间
	setInterval(function () {
		common.getTime();
	}, 500);
	window.onresize = function () {
		myChart.resize();
		myBar.resize();
	};
//每一分钟重新获取列表数据
//     window.channelLoop = setInterval(function () {
//       now_index = now_index + 1;
//       if (now_index > list_length - 1) {
//         now_index = 0;
//       };
//       ajax.channelReLoad(now_index);
//     },60000)
})


var ajax = {
	channelLoad: function (channelId) {
		var _that = this;
		chart_ajax(channelId);
		window.line_loop = setInterval(function () {
			chart_ajax(channelId);
		}, 5000);
		function chart_ajax(channelId) {
			$.ajax({
				type: "get",
				async: true,
				url: serverUrl,
				cache: false,
				dataType: "json",
				success: function (data) {
					$('#rank_list').empty();
					$("#channel_info").empty();
					var data_r = data.data;
					dateTime="00:00 - "+data_r.currentTime.substring(11,16);
					if (!data_r.hasData)return;
					channelId = channelId || data_r.realLiveChannelCountList[0].channelId;
					for (var i = 0; i < data_r.realLiveChannelCountList.length; i++) {
						//左侧列表渲染
						if (data_r.realLiveChannelCountList[i].orderNo < 10) {
							data_r.realLiveChannelCountList[i].orderNo = '0' + data_r.realLiveChannelCountList[i].orderNo
						}
						var up = '';
						if (data_r.realLiveChannelCountList[i].orderStatus == 'DOWN') {
							up = "r_down";
						}
						if (data_r.realLiveChannelCountList[i].orderStatus == 'UNCHANGED') {
							up = "r_nochange";
						}
						$('#rank_list').append('<li  class =' + up + ' channelId = "' + data_r.realLiveChannelCountList[i].channelId + '"><div class="r_name"><p><em>' + data_r.realLiveChannelCountList[i].orderNo + '</em><span class="label">&nbsp;' + data_r.realLiveChannelCountList[i].channelName + '</span></p></div><div class="r_number">' + data_r.realLiveChannelCountList[i].audienceRating + '%</div></li>');
						//右侧列表渲染
						var item = data_r.realLiveChannelCountList[i];
						var programName = item.programName.length > 8 ? item.programName.substring(0, 8) + "..." : item.programName;
						$('#channel_info').append('<li><p class="l_time">' + data_r.currentTime.slice(11, 19) + '</p><p class="l_con">' + programName + '</p><div class="rate"><span>' + item.audienceRating + '%</span><progress class="mypro" value="' + Number(item.audienceRating) + '" max="1"></progress></div></li>')
						// 中间图表的渲染
						if (data_r.realLiveChannelCountList[i].channelId == channelId) {
							dataLineY.push(data_r.realLiveChannelCountList[i].audienceRating);
							dataLineY1.push(data_r.realLiveChannelCountList[i].stbNum);
							dataLineX.push(data_r.currentTime.slice(11, 19));
							//bar的数据获取
							timeBar.push(data_r.currentTime.slice(11, 19));
							//barin barout listin listout 的数据的获取
							var inData = [];
							var outData = [];
							var a_dataBarIn = 0;
							var a_dataBarOut = 0;
							inData.push(data_r.currentTime.slice(11, 19));
							outData.push(data_r.currentTime.slice(11, 19));
							for (var k = 0; k < (data_r.realLiveChannelCountList[i].inList.length>5?5:data_r.realLiveChannelCountList[i].inList.length); k++) {
								inData.push(data_r.realLiveChannelCountList[i].inList[k]);
								a_dataBarIn += data_r.realLiveChannelCountList[i].inList[k].count;
							};
							for (var j = 0; j < (data_r.realLiveChannelCountList[i].outList.length>5?5:data_r.realLiveChannelCountList[i].outList.length); j++) {
								outData.push(data_r.realLiveChannelCountList[i].outList[j]);
								a_dataBarOut -= data_r.realLiveChannelCountList[i].outList[j].count;
							};
							bar_topIn.push(inData);
							bar_topOut.push(outData);
							dataBarIn.push(a_dataBarIn);
							dataBarOut.push(a_dataBarOut);
							//数据bar的渲染
							if (dataBarOut.length > 60) {
								dataBarIn.shift();
								dataBarOut.shift();
								timeBar.shift();
								bar_topIn.shift();
								bar_topOut.shift();
								_that.refreshBar();
							} else {
								if (dataBarOut.length > 2) {
									_that.refreshBar();
								}
							}
							//数据line的渲染
							if (dataLineY.length > 10) {
								dataLineY.shift();
								dataLineY1.shift();
								dataLineX.shift();
								if (line_now_index == 0) {
									dataLine_now = dataLineY;
								}else{
									dataLine_now = dataLineY1;
								}
								_that.refreshData();
							} else {
								if (dataLineY.length > 2) {
									if (line_now_index == 0) {
										dataLine_now = dataLineY;
									}else{
										dataLine_now = dataLineY1;
									}
									_that.refreshData();

								}
							}
						}
					}
					list_length = data_r.realLiveChannelCountList.length;
					var realtimeData=(mychart_legend?data_r.realLiveChannelCountList[currentIndex].audienceRating+"%":(data_r.realLiveChannelCountList[currentIndex].stbNum?data_r.realLiveChannelCountList[currentIndex].stbNum:""));
					$('.t_now .number span').html(realtimeData);
					$('.c_header .data').text(_commonFun.getDay());
					var c_leader = $(this).find('.label').text();
					$('.c_header .time').text(dateTime);
					var $li = $('#rank_list li').eq(currentIndex);
					$('#rank_list').find("li").removeClass('focus');
					$li.addClass('focus');
				}
			});
		}

	},
	channelClick: function () {
		var _that = this;
		// var one = 0;

		$(".c_right").on("click", "div",function(){
			if ($(this).index() == 0) {
			 		mychart_legend = true;
			 		$(".number p").html("实时收视率");
			 		myChart.dispatchAction({
			 			type: 'legendSelect',
			 			name:"收视率"
			 		})
			 }else{
			 		mychart_legend = false;
			 		$(".number p").html("实时用户数");
			 		myChart.dispatchAction({
			 		 type: 'legendSelect',
			 			name:"用户数"
			 		})
			 }
			// myChart.setOption({
			// 	legend:{
			// 	  selected: {
			// 	      '实时收视率': mychart_legend,
			// 	      "实时用户数": !mychart_legend,
			// 	  },
			// 	}
			// });
			$(".c_right div").css({"color":"rgba(255, 255, 255, 0.4)","border-top":"0px"});
			$(this).css({"color":"#fff","border-top":"3px solid #585A6F"});
			$('.t_now .number span').html("");
			// if(one !==0){ajax.resetOption()}
			// one =1;
		});
		$(".c_right div:eq(0)").trigger("click");
		$('#rank_list').on('click', 'li', function () {
			status=false;
			$('.t_now .number span').text($(this).find('.r_number').text());
			channelId = $(this).attr('channelId');
			currentIndex = $(this).index();
			//当前增加类名
			$('#rank_list').find("li").removeClass('focus');
			$(this).addClass('focus');
			// 右侧文字跟随
			$('.c_header .data').text(_commonFun.getDay());
			var c_leader = $(this).find('.label').text();
			// $('.c_header .label').text(c_leader);
			$('.c_header .time').text(dateTime);
			// 滚动
			var li_top = $('#rank_list li').eq(now_index).offset().top;
			var contain_h = $('.rank_list').height();
			var lp_top = $('#rank_list').offset().top;
			var scrollH = Math.floor((now_index - 3) * li_height);
			if (now_index > 3) {
				$(".rank_list").animate({
					scrollTop: scrollH
				}, 1000);
			}
			//点击事件发生是,清空缓存,图表重置,定时器重置
			window.clearInterval(window.line_loop)
			myChart.clear();
			myBar.clear();
			_that.init();
			dataBarIn = [];
			dataBarOut = [];
			timeBar = [];
			dataLineX = [];
			dataLineY = [];
			dataLineY1 = [];
			bar_topIn = [];
			bar_topOut = []
			//重新开始渲染列表
			_that.channelLoad(channelId);
		})
	},

	init: function () {
		var optionL = {
			noDataLoadingOption: {
				text: '暂无数据',
				effect: 'bubble',
				effectOption: {
					effect: {
						n: 0
					}
				}
			},
			legend: {
			    data:['收视率','用户数'],
			    show:false,
			    selectedMode : 'single'
			},
			backgroundColor: 'rgba(0, 0, 0, 0.4)', //背景色
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},
			//图例
			// legend: {
			//     data:['实时收视率']
			// },
			//表单定位
			grid: {
				left: '1%',
				top: '3%',
				right: '3%',
				bottom: '4%',
				containLabel: true
			},
			//x轴
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				// data: dataLineX,
				data: [],
				splitLine: {show: false},
				axisTick: false,
				axisLine: false,
				//刻度文字的颜色
				axisLabel: {
					show: true,
					textStyle: {
						color: 'rgba(255,255,255,0.8)',
						animation: false
					}
				}
			}],
			yAxis: [{
				type: 'value',
				show: true,
				splitLine: {show: false},
				axisLine: false,
				axisTick: false,
				//刻度文字的颜色
				axisLabel: {
					formatter: function(value,index){
						if (mychart_legend) {
							value = value + '%'
						}
						return value;
					},
					textStyle: {
						color: 'rgba(255,255,255,0.8)',
						animation: false
					}
				},
			}],
			series: [{
				name: '实时收视率',
				type: 'line',
				stack: '总量',
				// data:[87, 65, 66, 78,69, 71, 65,69],
				//data: dataLineY,
				data: [],
				itemStyle: {
					normal: {
						color: 'rgb(0,136,212)',
						borderWidth: 3,
						lineStyle: {
							color: 'rgb(0,136,212)'

						}
					}
				},
				lineStyle: {
					normal: {
						width: "2"
					}
				},
				symbolSize: 9,
				symbol: 'emptyCircle',
				smooth: true,
				hoverAnimation:false,
				//填充区域颜色渐变
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(0, 136, 212, 0.3)'
						}, {
							offset: 0.8,
							color: 'rgba(0, 136, 212, 0)'
						}], false),
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 10
					}
				}
			},
			{
							name: '实时收视率',
							type: 'line',
							stack: '总量',
							// data:[87, 65, 66, 78,69, 71, 65,69],
							//data: dataLineY,
							data: [],
							itemStyle: {
								normal: {
									color: 'rgb(0,136,212)',
									borderWidth: 3,
									lineStyle: {
										color: 'rgb(0,136,212)'

									}
								}
							},
							lineStyle: {
								normal: {
									width: "2"
								}
							},
							symbolSize: 9,
							symbol: 'emptyCircle',
							smooth: true,
							hoverAnimation:false,
							//填充区域颜色渐变
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(0, 136, 212, 0.3)'
									}, {
										offset: 0.8,
										color: 'rgba(0, 136, 212, 0)'
									}], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							}
						}
			]
		};
		var optionB = {
			noDataLoadingOption: {
				text: '暂无数据',
				effect: 'bubble',
				effectOption: {
					effect: {
						n: 0
					}
				}
			},
			backgroundColor: 'rgba(0, 0, 0, 0.4)', //背景色
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter: function (params) {
					var res = '<div style="display:flex;justify-content:space-around;align-items:center;width:230px;height:140px;background-color: rgba(0,0,0,0.5);color:rgba(255,255,255,0.6);font-size: 12px;line-height:16px;">' +
						'<div><h3 style="color:rgba(255,255,255,0.8);font-size:12px">流入排行</h3>';
					 for (var i = 0; i < bar_topIn.length; i++) {
					 if (params[0].name == bar_topIn[i][0]) {
					 	for(var j=1;j<bar_topIn[i].length;j++){
							res += '<p><span>' + bar_topIn[i][j].channelName + '  </span><span>' + bar_topIn[i][j].count + ' </span></p>';
							}
						 }
					 }
					 res+= '</div><div><h3 style="color:rgba(255,255,255,0.8);font-size:12px">流出排行</h3>';
					for (var i = 0; i < bar_topIn.length; i++) {
						if (params[0].name == bar_topOut[i][0]) {
							for(j=1;j<bar_topOut[i].length;j++){
								res+='<p><span>' + bar_topOut[i][j].channelName + '  </span><span>' + bar_topOut[i][j].count + ' </span></p>'
							}
						}
					}
					res+="</div></div>";
					return res;
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '5%',
				bottom: '44%',
				animation: false
			},
			xAxis: {
				type: 'category',
				data: [],
				scale: true,
				boundaryGap: true,
				silent: false,
				axisLine: {onZero: true},
				splitLine: {show: false},
				splitArea: {show: false},
				axisTick: false,
				axisLabel: {
					show: true,
					rotate: 90,
					interval: 0,
					margin: 16,
					textStyle: {
						color: 'rgba(255,255,255,0.4)',
						fontSize: 12,
						fontFamily: 'Microsoft YaHei',
					},
				},
			},
			yAxis: [{
				splitArea: {show: false},
				axisline: {onZero: true},
				type: 'value',
				name: '流入量',
				position: 'left',
				splitLine: {show: false},
				axisTick: false,
				//刻度文字的颜色
				axisLabel: {
					show: true,
					textStyle: {
						color: 'rgba(255,255,255,0.4)'
					}
				}
			},
				{
					axisline: {onZero: true},
					splitLine: {show: false},
					axisTick: false,
					type: 'value',
					name: '流入比率',
					position: 'right',
					max: 0.3,
					min: 0.1,
					//刻度文字的颜色
					axisLabel: {
						show: true,
						textStyle: {
							color: 'rgba(255,255,255,0.4)'
						}
					}
				},
			],
			//用来实现数据区间选择
			dataZoom: [
				{
					type: 'inside',
					start: 0,
					end: 100
				},
				{
					//滑动的
					show: true,
					type: 'slider',
					left: 0,
					right: 0,
					bottom: 0,
					height: 42,
					start: 94,
					end: 100,
					handleSize: 40,
					borderColor: 'transparent',
					backgroundColor: 'rgba(0,0,0,0.8)',

					showDetail: true,
					textStyle: {
						color: 'rgba(255,255,255,0.8)'
					},
					dataBackgroundColor: 'rgba(156,153,159,1.0)',
				},
			],
			series: [
				{
					name: 'bar',
					type: 'bar',
					stack: 'one',
					barMaxWidth: '30',
					//data: bar_info.data1,
					data: [],
					itemStyle: {
						normal: {
							color: '#f46404'
						},
						emphasis: {
							barBorderWidth: 1,
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowColor: 'rgba(0,0,0,0.2)'
						}
					}
				},
				{
					name: 'bar2',
					type: 'bar',
					stack: 'one',
					itemStyle: {
						normal: {
							color: '#5ce571'
						},
						emphasis: {
							barBorderWidth: 1,
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowColor: 'rgba(0,0,0,0.2)'
						}
					},
					// data: bar_info.data2
					data: []
				},
				{
					name: '流入比率',
					type: 'line',
					yAxisIndex: 1,
					itemStyle: {
						normal: {
							color: '#fff'
						},
					},
					//data: bar_info.data3,
					data: [],
					symbol: 'none',
					itemStyle: {
						normal: {
							color: "transparent",
							lineStyle: {
								color: 'transparent'
							}
						}
					}
				}]
		};
		myBar.setOption(optionB);
		myChart.setOption(optionL);
	},
	refreshData: function () {
		//图表数据加入
		myChart.setOption({
			// legend:{
			//   selected: {
			//       '收视率': mychart_legend,
			//       "用户数": !mychart_legend,
			//   },
			// },
			xAxis: {
				data: dataLineX
			},
			series: [{
				name: "收视率",
				data: dataLineY
			},
			{
				name: "用户数",
				data: dataLineY1
			}
			]
		});
	},
	refreshBar: function () {
		myBar.setOption({
			xAxis: {
				data: timeBar
			},
			series: [{
				name: 'bar',
				data: dataBarIn
			},
				{
					name: 'bar2',
					data: dataBarOut
				},
				{
					name: '流入比率',
					data: []
				}]
		});
	}
}
