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
    let storage = window.localStorage;
    let token = storage.getItem("token") ? storage.getItem("token") : "";
    if (token) {
        return token
    } else {
        $.ajax({
            type: "post",
            url: TokenUrl,
            dataType: "json",
            async: false,
            data: {},
            success: function (res) {
                if (res["e"] == RES_SUCCESS) {
                    token = res["data"];
                }
            },
        });
        storage.setItem("token", token);
    }
    return token
}

/**
 * 获取encrypt
 */
function get_encrypt(action, timestamp) {
    let encrypt = "";
    $.ajax({
        type: "post",
        url: EncryptUrl,
        dataType: "json",
        async: false,
        data: {
            action: action,
            timestamp: timestamp,
        },
        success: function (res) {
            if (res["e"] == RES_SUCCESS) {
                encrypt = res["data"];
            }
        },
    });
    return encrypt
}

/*
 * 获取sing
 */
function get_singn(param) {
    let sign = "";
    $.ajax({
        type: "post",
        url: SignUrl,
        dataType: "json",
        async: false,
        data: {
            param: param,
        },
        success: function (res) {
            if (res["e"] == RES_SUCCESS) {
                sign = res["data"];
            }
        },
    });
    return sign
}

/*
 * 加密参数
 */
function encrypt_param(action, param) {
    let timestamp = now_time();
    // 获取token
    let token = get_token();
    // 获取encrypt
    let encrypt = get_encrypt(action, timestamp);
    // 获取sing
    param += "&timestamp=" + timestamp;
    let sign = get_singn(param);
    // 加密参数
    param += "&sign=" + sign;
    let en_param = "";
    $.ajax({
        type: "post",
        url: EncryptParamUrl,
        dataType: "json",
        async: false,
        data: {
            param: param,
        },
        success: function (res) {
            if (res["e"] == RES_SUCCESS) {
                en_param = res["data"];
            }
        },
    });

    return {
        "token": token,
        "encrypt": encrypt,
        "sign": sign,
        "param": en_param,
    };
}
