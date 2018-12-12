// 立即执行，判断本地token是否存在，不存在去登录界面
storage = window.localStorage;
token = storage.getItem("token") ? storage.getItem("token") : "";
if (token == "") {
    window.location = "login.html"
}