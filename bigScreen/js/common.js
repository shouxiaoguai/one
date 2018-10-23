var _commonFun ={
    getDay:function () {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var mon = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1);
      var day = myDate.getDate();
      var time = year + "年" + mon + "月" + day +"日";
      return time;
    }
};
var common = {
  getTime:function () {
    var curTime = new Date();
    $('.h_time .hour').text(parseInt(curTime.getHours() / 10));
    $('.h_time .hours').text(parseInt(curTime.getHours() % 10));
    $('.h_time .min').text(parseInt(curTime.getMinutes() / 10));
    $('.h_time .mins').text(parseInt(curTime.getMinutes() % 10));
    $('.h_time .second').text(parseInt(curTime.getSeconds() / 10));
    $('.h_time .seconds').text(parseInt(curTime.getSeconds() % 10));
  },
  splitNum:function (num) {
    var data = num+"";
    var data1 = data.split("");
    var data2 = '';
    while (data1.length < 9 ) {
      data1.unshift('0')
    };
    for (var i = 0; i < data1.length; i++) {
      data2 += data1[i]
    }
    var a1  = data2.slice(0,3);
    var a2  = data2.slice(3,6);
    var a3  = data2.slice(6,9);
    return {
      a1:a1,
      a2:a2,
      a3:a3
    }
  },
 toThousands:function(num) {
      var result = [ ], counter = 0;
      num = (num || 0).toString().split('');
      for (var i = num.length - 1; i >= 0; i--) {
          counter++;
          result.unshift(num[i]);
          if (!(counter % 3) && i != 0) { result.unshift(','); }
      }
      return result.join('');
  }
};
var serverUrl="/hunan/";
if (location.href.indexOf("file:///") != -1) {
	serverUrl = "http://47.92.142.23:8080/hunan/";
}