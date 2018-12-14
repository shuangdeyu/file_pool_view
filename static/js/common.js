// 请求路径
const BaseUrl = "http://192.168.111.113:6001/";     // 请求基本路径
const AppUrl = BaseUrl + "app";                     // 入口接口
const TokenUrl = BaseUrl + "get_token";             // 获取token
const EncryptUrl = BaseUrl + "get_encrypt";         // 获取encrypt
const SignUrl = BaseUrl + "get_sign";               // 获取sign
const EncryptParamUrl = BaseUrl + "encrypt_param"; // 加密参数

// 接口号
const ACTION_LOGIN = 100; // 登录 100
const ACTION_REGISTER = 101; // 注册 101
const ACTION_LOGIN_OUT = 102; // 退出登录 102
const ACTION_LUSER_INFO = 103; // 用户信息 103
const ACTION_CHECK_TOKEN_LOGIN = 400; // 检查客户端登录状态 400

// 状态码
const RES_SUCCESS = 0; // 成功
const RES_UN_LOGIN = 100005; // 未登录

// 获取当前时间戳
function now_time() {
    nowtime = new Date();
    stamp = Math.round(nowtime / 1000);
    return stamp
}

/**
 * 获取token
 */
function get_token() {
    let defer = $.Deferred();
    let storage = window.localStorage;
    let token = storage.getItem("token") ? storage.getItem("token") : "";
    if (token != "") {
        defer.resolve(token);
    } else {
        $.ajax({
            type: "post",
            url: TokenUrl,
            dataType: "json",
            // async: false,
            data: {},
        }).done(function (res) {
            if (res["e"] == RES_SUCCESS) {
                token = res["data"];
                storage.setItem("token", token);
                defer.resolve(token);
            }
        });
    }
    return defer.promise();
}

/**
 * 获取encrypt
 */
function get_encrypt(action, timestamp) {
    let defer = $.Deferred();
    let encrypt = "";
    $.ajax({
        type: "post",
        url: EncryptUrl,
        dataType: "json",
        // async: false,
        data: {
            action: action,
            timestamp: timestamp,
        },
    }).done(function (res) {
        if (res["e"] == RES_SUCCESS) {
            encrypt = res["data"];
            defer.resolve(encrypt);
        }
    });
    return defer.promise();
}

/*
 * 获取sign
 */
function get_sign(param) {
    let defer = $.Deferred();
    let sign = "";
    $.ajax({
        type: "post",
        url: SignUrl,
        dataType: "json",
        // async: false,
        data: {
            param: param,
        },
    }).done(function (res) {
        if (res["e"] == RES_SUCCESS) {
            sign = res["data"];
            defer.resolve(sign);
        }
    });
    return defer.promise();
}

/*
 * 加密参数
 */
function encrypt_param(action, param) {
    let defer = $.Deferred();

    let timestamp = now_time();
    let token = "";
    let encrypt = "";
    let sign = "";
    let en_param = "";
    if (param == "") {
        param = "timestamp=" + timestamp;
    } else {
        param += "&timestamp=" + timestamp;
    }
    $.when(get_token(), get_encrypt(action, timestamp), get_sign(param))
        .done(function (d1, d2, d3) {
            token = d1;
            encrypt = d2;
            sign = d3;
            param += "&sign=" + d3;
            $.ajax({
                type: "post",
                url: EncryptParamUrl,
                dataType: "json",
                // async: false,
                data: {
                    param: param,
                },
            }).done(function (res) {
                if (res["e"] == RES_SUCCESS) {
                    en_param = res["data"];
                }
                defer.resolve({
                    "token": token,
                    "encrypt": encrypt,
                    "sign": sign,
                    "param": en_param,
                });
            });
        });
    return defer.promise();
}
