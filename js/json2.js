if (typeof JSON !== 'object') {JSON = {};}
(function () {'use strict';function f(n) {return n < 10 ? '0' + n : n;}
  if (typeof Date.prototype.toJSON !== 'function') {Date.prototype.toJSON = function (key) {return isFinite(this.valueOf())? this.getUTCFullYear()+'-'+f(this.getUTCMonth() + 1) + '-' +f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON = function (key){return this.valueOf();};}
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent, meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"' : '\\"','\\': '\\\\'},rep;
  function quote(string) {escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function(a){var c = meta[a];return typeof c === 'string'? c: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
  function str(key, holder) { var i,k,v,length,mind = gap,partial,value = holder[key];if (value && typeof value==='object' && typeof value.toJSON==='function') {value = value.toJSON(key);}if (typeof rep === 'function') {value = rep.call(holder, key, value);}switch (typeof value) { case 'string':return quote(value);case 'number': return isFinite(value) ? String(value) : 'null';case 'boolean':case 'null':return String(value);case 'object': if (!value){return 'null';}gap += indent;partial = [];if (Object.prototype.toString.apply(value) === '[object Array]') {length = value.length;for (i = 0; i < length; i += 1) {partial[i] = str(i, value) || 'null';}v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';gap = mind;return v;}if (rep && typeof rep === 'object') {length=rep.length;for (i=0; i<length;i+=1){if (typeof rep[i] === 'string') {k = rep[i];v = str(k, value);if(v){partial.push(quote(k) + (gap ? ': ' : ':') + v);}}}}else{for(k in value){if (Object.prototype.hasOwnProperty.call(value, k)){v = str(k, value);if(v){partial.push(quote(k) + (gap ? ': ' : ':') + v);}}}}v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';gap = mind;return v;}}
  if (typeof JSON.stringify !== 'function') {JSON.stringify = function (value, replacer, space) { var i;gap = '';indent = '';if (typeof space === 'number') {for (i = 0; i < space; i += 1) {indent += ' ';}}else if (typeof space === 'string') {indent = space;}rep = replacer;if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {throw new Error('JSON.stringify');} return str('', {'': value});};}
  if (typeof JSON.parse !== 'function') {JSON.parse = function (text, reviver) { var j;function walk(holder, key) {var k, v, value = holder[key];if (value && typeof value === 'object') {for (k in value) {if (Object.prototype.hasOwnProperty.call(value, k)) {v = walk(value, k);if (v !== undefined) {value[k] = v;}else{delete value[k];}}}}return reviver.call(holder, key, value);}text = String(text);cx.lastIndex = 0; if (cx.test(text)) {text = text.replace(cx, function (a) {return '\\u' +('0000' + a.charCodeAt(0).toString(16)).slice(-4);});}if (/^[\],:{}\s]*$/ .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {j = eval('(' + text + ')');return typeof reviver === 'function' ? walk({'': j}, ''): j; } throw new SyntaxError('JSON.parse');};}
}());
Element.prototype.p = function () { return this.parentNode; }
String.prototype.Id=function(){return document.getElementById(this);}
Element.prototype.addEn = function (parent) {
  if (parent.lastChild) {
    parent.insertBefore(this, this.nextSibling);
  } else {
    parent.appendChild(this);
  }
}
Element.prototype.addIn = function (parent) {
  if (parent.firstChild) {
    parent.insertBefore(this, parent.firstChild);
  } else {
    parent.appendChild(this);
  }
}/* new Date().pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2019-08-02 08:09:04.423 
* new Date().pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2019-08-10 周六 08:09:04       
* new Date().pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2019-08-10 星期六 08:09:04       
* 其他格式 MM/dd/yyyy HH  MM/dd/yyyy */          
Date.prototype.pattern=function(fmt) { 
  var o = {"M+" : this.getMonth()+1,"d+" : this.getDate(),
  "h+" : this.getHours()%12 === 0 ? 12 : this.getHours()%12,
  "H+" : this.getHours(),"m+" : this.getMinutes(),
  "s+" : this.getSeconds(),"q+" : Math.floor((this.getMonth()+3)/3),
  "S" : this.getMilliseconds()};
  var week = {"0" : "/u65e5","1" : "/u4e00","2" : "/u4e8c",
  "3" : "/u4e09","4" : "/u56db","5" : "/u4e94","6" : "/u516d"};
  if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));}
  if(/(E+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,((RegExp.$1.length>1) ?
    (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")
    +week[this.getDay()+""]);}
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ?
      (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }return fmt;
}
String.prototype.trim=function(){return this.replace(/(^\s+)|(\s+$)/,'')};
String.prototype.id=function(){return document.getElementById(this)};
String.prototype.url=function(){return this.replace(/(^(http|https):\/\/)?((\w+\.)+|(\w+))(\w+)(\.|\:)?(\w+)\/{1}/g,'')};
String.prototype.J2T=function(){return this.replace(/(\\|\\'|\\"|\n)/g,"\\\$1")};
String.prototype.getLast=function(f){return this.substring(this.lastIndexOf(f) + 1, str.length);};
Element.prototype.del=function(){this.parentNode.removeChild(this)};
Element.prototype.first=function(){return this.firstElementChild ? this.firstElementChild : this.firstChild};
Element.prototype.last=function(){return this.lastElementChild ? this.lastElementChild : this.lastChild};
Element.prototype.setCenter=function(){
	this.style.left=(document.documentElement.clientWidth-this.offsetWidth) / 2+"px";
	this.style.top=(document.documentElement.clientHeight-this.offsetHeight) / 2+"px";
};
Element.prototype.prev=function(){return this.previousElementSibling||this.previousSibling;}
Element.prototype.next=function(){return this.nextElementSibling||this.nextSibling;}
//this.mouseMove(event,false)为不超出边框，true为可以超出
Element.prototype.X=0;Element.prototype.H=0;Element.prototype.W=0;Element.prototype.Y=0;Element.prototype.x=0;Element.prototype.y=0;Element.prototype.C="";
Element.prototype.moveBox=function(e,b,d){e=e||window.event;if(d)d.style.display="block";
  this.parentNode.X=e.pageX-this.parentNode.offsetLeft;this.parentNode.Y=e.pageY-this.parentNode.offsetTop;
  (function(c,b){
    document.onmousemove=function(e){e=e||window.event;c.style.zIndex=3;
      if(b){c.style.left=Math.min(Math.max(e.clientX-c.X,-c.X),(this.documentElement.clientWidth||this.body.clientWidth)-c.X)+"px";c.style.top=Math.min(Math.max(e.clientY-c.Y,-c.Y),(this.documentElement.clientHeight||this.body.clientHeight)-c.Y)+"px";}
      else{c.style.left=Math.min(Math.max(e.pageX-c.X,0),(this.documentElement.clientWidth||this.body.clientWidth)-c.offsetWidth)+"px";c.style.top=Math.min(Math.max(e.pageY-c.Y,0),(this.documentElement.clientHeight||this.body.clientHeight)-c.offsetHeight)+"px";}
    };
    document.onmouseup=function(){c.X=c.Y=this.onmousemove=this.onmouseup=null;c.style.zIndex=2;if(d)d.style.display="none";};
  })(this.parentNode,b);
};
Element.prototype.dashedBox=function(e){e=e||window.event;
  if(e.target ===e.currentTarget){this.C="";
    if(e.offsetY<9){this.C='n'}else if(e.offsetY>this.offsetHeight-10){this.C='s'};
    if(e.offsetX<8){this.C=this.C+'w'}else if(e.offsetX>this.offsetWidth-9){this.C=this.C+'e'};this.style.cursor=this.C+'-resize'
  }else this.style.cursor='auto'}
Element.prototype.dragBox=function(e,d){e=e||window.event;
  if(e.target ===e.currentTarget){this.onmousemove=null;if(d)d.style.display="block";
    this.X=this.offsetLeft;this.x=e.clientX;this.W=this.offsetWidth-8;this.Y=this.offsetTop;this.y=e.clientY;this.H=this.offsetHeight-8;
    (function(c){
      document.onmousemove=function(e){e=e||window.event;
        switch(c.style.cursor){
          case'n-resize':c.style.left=c.X+'px';c.style.top=Math.max(Math.min(c.Y+e.clientY-c.y,c.H+c.Y-210),0)+'px';c.style.height=Math.max(210,(c.H+c.Y-Math.max(c.Y+e.clientY-c.y,0)))+'px';break;
          case's-resize':c.style.height=Math.max(210,Math.min(window.innerHeight-c.Y-4,e.clientY-c.Y-4))+'px';break;
          case'w-resize':c.style.left=Math.max(Math.min(c.X+e.clientX-c.x,c.W+c.X-210),0)+'px';c.style.top=c.Y+'px';c.style.width=Math.max(210,(c.W+c.X-Math.max(c.X+e.clientX-c.x,0)))+'px';break;
          case'e-resize':c.style.width=Math.max(210,Math.min(window.innerWidth-c.X-4,e.clientX-c.X-4))+"px";break;
          case'ne-resize':c.style.left=c.X+'px';c.style.top=Math.max(Math.min(c.Y+e.clientY-c.y,c.H+c.Y-210),0)+'px';c.style.width=Math.max(210,Math.min(window.innerWidth-c.X-4,e.clientX-c.X-4))+"px";c.style.height=Math.max(210,(c.H+c.Y-Math.max(c.Y+e.clientY-c.y,0)))+'px';break;
          case'sw-resize':c.style.left=Math.max(Math.min(c.X+e.clientX-c.x,c.W+c.X-210),0)+'px';c.style.top=c.Y+'px';c.style.width=Math.max(210,(c.W+c.X-Math.max(c.X+e.clientX-c.x,0)))+'px';c.style.height=Math.max(210,Math.min(window.innerHeight-c.Y-4,e.clientY-c.Y-4))+'px';break;
          case'nw-resize':c.style.left=Math.max(Math.min(c.X+e.clientX-c.x,c.W+c.X-210),0)+'px';c.style.top=Math.max(Math.min(c.Y+e.clientY-c.y,c.H+c.Y-210),0)+'px';c.style.width=Math.max(210,(c.W+c.X-Math.max(c.X+e.clientX-c.x,0)))+'px';c.style.height=Math.max(210,(c.H+c.Y-Math.max(c.Y+e.clientY-c.y,0)))+'px';break;
          case'se-resize':c.style.width=Math.max(210,Math.min(window.innerWidth-c.X-4,e.clientX-c.X-4))+"px";c.style.height=Math.max(210,Math.min(window.innerHeight-c.Y-4,e.clientY-c.Y-4))+'px';
        }
      }
      document.onmouseup=function(){c.X=c.Y=c.W=c.H=c.x=c.y=c.C=this.onmousemove=this.onmouseup=null;c.onmousemove=c.dashedBox;if(d)d.style.display="none";};
    })(this);
  }
}