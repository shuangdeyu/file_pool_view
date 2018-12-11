const BaseUrl = "http://192.168.111.113:6001/";     // 请求基本路径
const AppUrl = BaseUrl + "app";                     // 入口接口
const TokenUrl = BaseUrl + "get_token";             // 获取token
const EncryptUrl = BaseUrl + "get_encrypt";         // 获取encrypt
const SignUrl = BaseUrl + "get_sign";               // 获取sign
const EncryptParamUrl = BaseUrl + "encrypt_param"; // 加密参数

const RES_SUCCESS = 0;

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