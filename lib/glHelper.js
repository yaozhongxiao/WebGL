/**
 * Created by zhongxiao.yzx on 14-8-16.
 */
GLUtils.checkGlError = function (webgl, op) {
    var ret = false;
    var error = 0;
    for (error = webgl.getError(); error; error = webgl.getError()) {
        alert("GL ERROR - after operation " + ps  +" "+ error);
    }
}
