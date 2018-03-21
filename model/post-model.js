const AV = require("../utils/av-webapp-min")
class post extends AV.Object {}

//向SDK注册post表
AV.Object.register(post, "post")
module.exports = post