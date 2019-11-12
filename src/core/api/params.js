
import qs from "qs";
var query=qs.parse(location.search.slice(1));

var params={
    userType:query.userType||"",
    token:query.token||"",
    // 将接口中的通用参数进行管理
    v:new Date().getTime()
}

export default params;