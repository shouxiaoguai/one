var myMap = echarts2.init(document.getElementById('map'));
var	myoption = {
    backgroundColor: 'rbga(0,0,0,0)',
    color: ['gold','aqua','lime'],
    title : {
    },
    tooltip : {
        trigger: 'item',
        formatter: '{b}'
    },
    legend: {
    	show:false,
        orient: 'vertical',
        x:'left',
        data:['长沙'],
        selectedMode: 'single',
        selected:{
        },
        textStyle : {
            color: '#fff'
        }
    },
    toolbox: {
        show : false,
        orient : 'vertical',
        x: 'right',
        y: 'center',
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    dataRange: {
    	show:false,
        min : 0,
        max : 100,
        calculable : true,
        color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
        textStyle:{
            color:'#fff'
        }
    },
    series : [
        {
            name: '湖南',
            type: 'map',
            roam: false,
            hoverable: false,
            mapType: '湖南',
            itemStyle:{
                normal:{
                    borderColor:'rgba(255,255,255,1)',
                    borderWidth:0.5,
                    areaStyle:{
                        color: 'transparent'
                    }
                }
            },
            data:[],
            markLine : {
                smooth:true,
                symbol: ['none', 'star0'],  
                symbolSize : 1,
                itemStyle : {
                    normal: {
                        color:'#fff',
                        borderWidth:1,
                        borderColor:'rgba(30,144,255,0.5)'
                    }
                },
                data : [
                    [{name:'长沙'},{name:'张家界'}],
                    [{name:'长沙'},{name:'吉首'}],
                    [{name:'长沙'},{name:'怀化'}],
                    [{name:'长沙'},{name:'常德'}],
                    [{name:'长沙'},{name:'益阳'}],
                    [{name:'长沙'},{name:'长沙'}],
                    [{name:'长沙'},{name:'岳阳'}],
                    [{name:'长沙'},{name:'湘潭'}],
                    [{name:'长沙'},{name:'株洲'}],
                    [{name:'长沙'},{name:'娄底'}],
                    [{name:'长沙'},{name:'邵阳'}],
                    [{name:'长沙'},{name:'永州'}],
                    [{name:'长沙'},{name:'郴州'}],
                    [{name:'长沙'},{name:'衡阳'}]
                    
                ],
            },
            geoCoord: {
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
        },
        {
            name: '长沙',
            type: 'map',
            mapType: '湖南',
            data:[],
            markLine : {
                smooth:true,
                effect : {
                    show: true,
                    scaleSize: 1,
                    period: 30,
                    color: '#fff',
                    shadowBlur: 10
                },
                itemStyle : {
                    normal: {
                        borderWidth:1,
                        lineStyle: {
                            type: 'solid',
                            shadowBlur: 1
                        }
                    }
                },
                data : [
                         [{name:'长沙'}, {name:'张家界',value:95}],
                         [{name:'长沙'}, {name:'吉首',value:90}],
                         [{name:'长沙'}, {name:'怀化',value:80}],
                         [{name:'长沙'}, {name:'常德',value:70}],
                         [{name:'长沙'}, {name:'益阳',value:60}],
                         [{name:'长沙'}, {name:'长沙',value:80}],
                         [{name:'长沙'}, {name:'岳阳',value:50}],
                         [{name:'长沙'}, {name:'湘潭',value:40}],
                         [{name:'长沙'}, {name:'株洲',value:77}],
                         [{name:'长沙'}, {name:'娄底',value:20}],
                         [{name:'长沙'}, {name:'邵阳',value:31}],
                         [{name:'长沙'}, {name:'永州',value:42}],
                         [{name:'长沙'}, {name:'郴州',value:62}],
                         [{name:'长沙'}, {name:'衡阳',value:8}]
                ]
            },
            markPoint : {
                symbol:'emptyCircle',
                symbolSize : function (v){
                    return 5 + v/20
                },
                effect : {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle:{
                    normal:{
                        label:{show:false}
                    },
                    emphasis: {
                        label:{position:'top'}
                    }
                },
                data : [
                    {name:'张家界',value:95},
                    {name:'吉首',value:90},
                    {name:'怀化',value:80},
                    {name:'常德',value:70},
                    {name:'益阳',value:60},
                    {name:'长沙',value:80},
                    {name:'岳阳',value:50},
                    {name:'湘潭',value:40},
                    {name:'株洲',value:77},
                    {name:'娄底',value:20},
                    {name:'邵阳',value:31},
                    {name:'永州',value:42},
                    {name:'郴州',value:62},
                    {name:'衡阳',value:8}
                ]
            }
        }
    ]
};
myMap.setOption(myoption);
