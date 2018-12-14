// 立即执行，判断本地token是否存在，不存在去登录界面
storage = window.localStorage;
token = storage.getItem("token") ? storage.getItem("token") : "";
if (token == "") {
    window.location = "login.html"
}
// 检查服务器是否登录状态
$.when(encrypt_param(ACTION_CHECK_TOKEN_LOGIN, "")).done(function (data) {
    console.log(data);
    $.ajax({
        type: "post",
        url: AppUrl,
        dataType: "json",
        data: {
            action: ACTION_CHECK_TOKEN_LOGIN,
            token: data.token,
            encrypt: data.encrypt,
            param: data.param,
        },
    }).done(function (res) {
        if (res["e"] != 0) {
            alert(res["msg"]);
        } else {
            if (res["data"]["is_login"] != 1) {
                window.location = "login.html"
            }
        }
    });
});