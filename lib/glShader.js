/**
 * Created by zhongxiao.yzx on 14-8-17.
 */

var glShader = function(){}
glShader.createShader =  function (webgl_context, type, sourceCode){
    var _shader = webgl_context.createShader(type);
    webgl_context.shaderSource(_shader, sourceCode);
    webgl_context.compileShader(_shader);
    if( !webgl_context.getShaderParameter(_shader,webgl_context.COMPILE_STATUS) ){
        alert("error: shader compile error with type = 0x" + type.toString(16));
    }
    return _shader;
}
////////////////////////////////////////////////////////////////////////////
// Vertex Shader
glShader.VertexType = {
    Vertex_Color : 1,     //顶点 + 纯色渲染
    Vertex_Matrix: 2,    // 顶点变换 + 纯色渲染
    default:0             // 顶点
}

glShader.VertexParameter ={
    gl_Position:"v_Position",
    gl_Color:"v_color"
}

glShader.VertexSourceCode = [];

glShader.getVertexSourceCode = function(type){
    return glShader.VertexSourceCode[type];
}

glShader.VertexSourceCode[glShader.VertexType.default] = "\
    attribute vec3 v_Position;                  \
    void main(void)                             \
    {                                           \
        gl_Position = vec4(v_Position, 1.0);    \
    }"

glShader.VertexSourceCode[glShader.VertexType.Vertex_Color] = "\
    varying vec4 f_Color;                         \n\
    attribute vec3 v_Position;                    \n\
    attribute vec3 v_color;                       \n\
    void main(void)                               \n\
    {                                             \n\
        gl_Position = vec4(v_Position, 1.0);      \n\
        f_Color = vec4(v_color,1.0);              \n\
    }"


glShader.VertexSourceCode[glShader.VertexType.Vertex_Matrix] = "\
    attribute vec3 v_Position;                  \
    attribute mat4 mvp_Matrix;                  \
    void main(void)                             \
    {                                           \
        vec4 position = vec4(v_Position, 1.0);  \
        gl_Position = mvp_Matrix * position;    \
    }";

////////////////////////////////////////////////////////////////////////////
// fragment shader
glShader.FragmentType = {
    Fragment_PureColor : 1 , // 顶点 + 纯色渲染
    Fragment_Texture:2,   // 顶点变换 + 纯色渲染
    default:0
}
glShader.FragmentParameter ={
    gl_FragColor:"f_Color"
}
glShader.FragmentSourceCode =  [];

glShader.getFragmentSourceCode = function(type){
    return glShader.FragmentSourceCode[type];
}

glShader.FragmentSourceCode[glShader.FragmentType.default] = "\
    void main(void)                                  \
    {                                                \
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);     \
    }";

// varying需要加上精度修饰符,否则编译错误
glShader.FragmentSourceCode[glShader.FragmentType.Fragment_PureColor] = "\
    varying highp vec4 f_Color;                      \n\
    void main(void)                                  \n\
    {                                                \n\
        gl_FragColor = f_Color;                      \n\
    }";

glShader.FragmentSourceCode[glShader.FragmentType.Fragment_Texture] = "\
    varying vec4 f_Color;                            \
    uniform sampler2D texture;                       \
    void main(void)                                  \
    {                                                \
        gl_FragColor = f_Color;                      \
    }";