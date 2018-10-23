$(function () {

    //top 时间
    (function () {
        function realTime() {
            var time = (new Date + '').split(':')
            $('.hour').text(time[0].substr(-2, 1))
            $('.hours').text(time[0].substr(-1, 1))
            $('.min').text(time[1].substr(0, 1))
            $('.mins').text(time[1].substr(1, 1))
            $('.second').text(time[2].substr(0, 1))
            $('.seconds').text(time[2].substr(1, 1))
        };
        realTime();
        setInterval(() => {
            realTime()
        }, 1000);
    })();


    //input 按回车、点击事件
    (function () {
        $('.log_input div input:eq(0)').keydown((key) => {
            if (key.keyCode === 13) $('.log_input div input:eq(1)').focus();
        })
        $('.log_input div input:eq(1)').keydown((key) => {
            if (key.keyCode === 13) login();
        })
        $('#login').on('click', login)
    })()


    //登录
    function login() {
        var user = $('.log_input div input:eq(0)').val()
        var pass = $('.log_input div input:eq(1)').val()
        window.clearTimeout(clearText)
		var clearText=window.setTimeout(() => {
			$('#error').text('');
		}, 2000);
        if (user === '' || pass === '') return $('#error').text('账号或密码不能为空');
        $.ajax({
            type: "post",
            url: serverUrl+'/system/login',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "name": user, "passwd": pass }),
            success: data => {
                if (data.success) {
                    $('#error').text('');
					window.location.href="./main";
                } else {
                    $('#error').text(data.errorMessage)
                }
            }
        });
    }
})