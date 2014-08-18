/**
 * Created by zhongxiao.yzx on 14-8-16.
 */

function include(js){
    document.head.insertAdjacentHTML("beforeEnd","<script type='text/javascript' src=" + js + "></script>")
}

include("lib/glMatrix-0.9.5.js");
include("lib/glShader.js");

var glProgram = function(){};
//glProgram.prototype = {}
// glProgram类型决定了该glProgram可以完成的功能
// 由glProgram所使用的vertex shader 和 fragment shader类型决定
glProgram.type = {
    Normal_PureColor : 1 , // 顶点 + 纯色渲染
    Normal_Texture: 2,     // 顶点 + 纹理渲染
    Matrix_PureColor:3,   // 顶点变换 + 纯色渲染
    Matrix_Texture:4,     // 顶点变换 + 纹理渲染
    default:0
}
glProgram.prototype={
    vs_shader:0,
    fs_shader:0,
    _program:0
}

glProgram.prototype.makeCurrentProgram = function(webgl_context){
    webgl_context.useProgram(this._program);
}

glProgram.createProgram = function(webgl_context, type){
    var vs_sourceCode = "";
    var fs_sourceCode = "";
    switch (type){
        case glProgram.type.default: {
            vs_sourceCode = glShader.getVertexSourceCode(glShader.VertexType.default);
            fs_sourceCode = glShader.getFragmentSourceCode(glShader.FragmentType.default);
            break;
        }
        case glProgram.type.Normal_PureColor:{
            vs_sourceCode = glShader.getVertexSourceCode(glShader.VertexType.Vertex_Color);
            fs_sourceCode = glShader.getFragmentSourceCode(glShader.FragmentType.Fragment_PureColor);
                break;
            }
        case defautl:
            break
        }

    var _glVertexShader = glShader.createShader(webgl_context, webgl_context.VERTEX_SHADER, vs_sourceCode);
    var _glFragmentShader = glShader.createShader(webgl_context, webgl_context.FRAGMENT_SHADER, fs_sourceCode);

    var _program = webgl_context.createProgram();

    var _glprogram = new glProgram();
    _glprogram.vs_shader = _glVertexShader;
    _glprogram.fs_shader = _glFragmentShader;
    _glprogram._program = _program;

    webgl_context.attachShader(_program, _glVertexShader);
    webgl_context.attachShader(_program, _glFragmentShader);

    webgl_context.linkProgram(_program);

    if( !webgl_context.getProgramParameter(_program, webgl_context.LINK_STATUS)){
        alert("error: program link error");
    }

    return _glprogram;
}

glProgram.prototype.setVertexArray = function(webgl_context, VertexArray, VertexSize){
    var vbo = webgl_context.createBuffer();
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER,vbo);
    webgl_context.bufferData(webgl_context.ARRAY_BUFFER, VertexArray, webgl_context.STATIC_DRAW);

    var gl_Position_ID = webgl_context.getAttribLocation(this._program,glShader.VertexParameter.gl_Position);
    webgl_context.enableVertexAttribArray(gl_Position_ID);
    webgl_context.vertexAttribPointer(gl_Position_ID,VertexSize,webgl_context.FLOAT,true,0,0);
}

glProgram.prototype.setColorArray = function(webgl_context, ColorArray, ColorSize){
    var colorArrayObject = webgl_context.getAttribLocation(this._program, glShader.VertexParameter.gl_Color);
    webgl_context.enableVertexAttribArray(colorArrayObject);
    webgl_context.vertexAttribPointer(colorArrayObject,ColorSize,webgl_context.FLOAT,true,0,ColorArray)
}

glProgram.prototype.setColor = function(webgl_context, jsColor){
    var v_color = vec3.create(jsColor);
    var v_color_id = webgl_context.getAttribLocation(this._program, glShader.VertexParameter.gl_Color);
    webgl_context.vertexAttrib3fv(v_color_id,v_color);
}

glProgram.prototype.draw = function(webgl_context, first, count){
    webgl_context.drawArrays(webgl_context.TRIANGLES, first, count);
}