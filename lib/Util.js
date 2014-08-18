/**
 * Created by zhongxiao.yzx on 14-8-16.
 */
function include(js){
    document.head.insertAdjacentHTML("beforeEnd","<script type='text/javascript' src=" + js + ".js></script>")
}

glUtils.ShaderSourceFromScriptElement =  function( scriptID){
    var srouceCode = "";
    var shaderScript = document.getElementById(scriptID);
    if(shaderScript != null){
        var child = shaderScript.firstChild;
        while(child){
            if(child.nodeType == child.TEXT_NODE){
                srouceCode += child.textContent;
            }
            child = child.nextSibling;
        }
    }
    return srouceCode;
}