
@@@@@@文件接收类型
<input type="files" accept=".xls,.doc,.txt,.pdf,......">
Extension MIME Type
.xlsx   application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
.xltx   application/vnd.openxmlformats-officedocument.spreadsheetml.template
.potx   application/vnd.openxmlformats-officedocument.presentationml.template
.ppsx   application/vnd.openxmlformats-officedocument.presentationml.slideshow
.pptx   application/vnd.openxmlformats-officedocument.presentationml.presentation
.sldx   application/vnd.openxmlformats-officedocument.presentationml.slide
.docx   application/vnd.openxmlformats-officedocument.wordprocessingml.document
.dotx   application/vnd.openxmlformats-officedocument.wordprocessingml.template
.xlsm   application/vnd.ms-excel.addin.macroEnabled.12
.xlsb   application/vnd.ms-excel.sheet.binary.macroEnabled.12



@@@@@@阻止冒泡和其他相同事件监听器
e.stopImmediatePropagation();



@@@@@@事件委托
<p>点击某个单元格</p>
<table border="1">
    <tr>
        <td>row 1 col 1</td>
        <td>row 1 col 2</td>
    </tr> 
    <tr>
        <td>row 2 col 1</td>
        <td>row 2 col 2</td>
    </tr> 
    <tr>
        <td>row 3 col 1</td>
        <td>row 3 col 2</td>
    </tr> 
    <tr>
        <td>row 4 col 1</td>
        <td>row 4 col 2</td>
    </tr>
</table>
< script >
    document.querySelector('table').addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() == 'td') {
            alert(event.target.textContent);
        }
    }); 
</script>



@@@@@@图片上传预览：
function preview(file) {
    var name=file.value;
    var fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
    if(fileName !="png" && fileName !="jpeg" && fileName !="jpg"){
      alert("请选择正确的格式文件上传！");
      file.value="";
      return
    }
    var fileSize = 0;         
    if(file.files && file.files[0]){
      fileSize = file.files[0].size;
    }
    var size = fileSize / 1024;
    if(size>200){  
      alert("图片不能大于200KB");
      file.value="";
      return
    }
    if(file.files && file.files[0]){
      var reader = new FileReader();
      reader.onload = function(evt) {
        document.getElementById(file.id).previousSibling.previousSibling.src = evt.target.result;
        //uploadimg.innerHTML = '<img src="' + evt.target.result + '" />';
      }
      reader.readAsDataURL(file.files[0]);
    } else{
      alert('图片不存在！');
    }
}



@@@@@@获取地址栏参数
function GetUrlParm(parm){
    var paraArr = location.search.substring(1).split('&');
    for(var i = 0;i < paraArr.length;i++){
        if(parm == paraArr[i].split('=')[0]){
            return decodeURI(paraArr[i].split('=')[1]);
        }
    }
    return null;
}



@@@@@@设置Cookie
function SetCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
@@@@@@读取Cookie
function GetCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
}



@@@@@@@@@@@@@@
var a = document.documentElement.scrollTop || document.body.scrollTop;//滚动条y轴上的距离
var b = document.documentElement.clientHeight || document.body.clientHeight;//可视区域的高度
var c = document.documentElement.scrollHeight || document.body.scrollHeight;//可视化的高度与溢出的距离（总高度）



@@@@@@身份证校验
function recard(value){
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var num = value.toUpperCase();
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        alert('身份证位数格式错误！');
        return false;
    }
    if (aCity[parseInt(num.substr(0, 2))] == null){
        alert('身份证格式错误！');
        return false;
    }
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(
            arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            alert('身份证日期格式错误');
            return false;
        } else {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 14; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) ==
            Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            alert('身份证日期格式错误');
            return false;
        } else {
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                alert('身份证格式错误！');
                return false;
            }
            return true;
        }
    }
}



@@@@@@计算两点之间距离，误差2米  //实例:getRange()(120.157837,30.17038,120.156693,30.17683)
function getRange() {
    var DEF_PI = 3.14159265359; // PI
    var DEF_2PI = 6.28318530712; // 2*PI
    var DEF_PI180 = 0.01745329252; // PI/180.0
    var DEF_R = 6370693.5; // radius of earth
    function getShortDistance(lon1, lat1, lon2, lat2) {
        var ew1, ns1, ew2, ns2;
        var dx, dy, dew;
        var distance;
        // 角度转换为弧度
        ew1 = lon1 * DEF_PI180;
        ns1 = lat1 * DEF_PI180;
        ew2 = lon2 * DEF_PI180;
        ns2 = lat2 * DEF_PI180;
        // 经度差
        dew = ew1 - ew2;
        // 若跨东经和西经180 度，进行调整
        if (dew > DEF_PI)
            dew = DEF_2PI - dew;
        else if (dew < -DEF_PI)
            dew = DEF_2PI + dew;
        dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
        dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
        // 勾股定理求斜边长
        distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
        console.log(distance)
        return distance;
    }
}



@@@@@@花里胡哨body
!function(){function o(w,v,i){return w.getAttribute(v)||i}function j(i){return document.getElementsByTagName(i)}function l(){var i=j("script"),w=i.length,v=i[w-1];return{l:w,z:o(v,"zIndex",-1),o:o(v,"opacity",0.5),c:o(v,"color","0,0,0"),n:o(v,"count",99)}}function k(){r=u.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,n=u.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function b(){e.clearRect(0,0,r,n);var w=[f].concat(t);var x,v,A,B,z,y;t.forEach(function(i){i.x+=i.xa,i.y+=i.ya,i.xa*=i.x>r||i.x<0?-1:1,i.ya*=i.y>n||i.y<0?-1:1,e.fillRect(i.x-0.5,i.y-0.5,1,1);for(v=0;v<w.length;v++){x=w[v];if(i!==x&&null!==x.x&&null!==x.y){B=i.x-x.x,z=i.y-x.y,y=B*B+z*z;y<x.max&&(x===f&&y>=x.max/2&&(i.x-=0.03*B,i.y-=0.03*z),A=(x.max-y)/x.max,e.beginPath(),e.lineWidth=A/2,e.strokeStyle="rgba("+s.c+","+(A+0.2)+")",e.moveTo(i.x,i.y),e.lineTo(x.x,x.y),e.stroke())}}w.splice(w.indexOf(i),1)}),m(b)}var u=document.createElement("canvas"),s=l(),c="c_n"+s.l,e=u.getContext("2d"),r,n,m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(i){window.setTimeout(i,1000/45)},a=Math.random,f={x:null,y:null,max:20000};u.id=c;u.style.cssText="position:fixed;top:0;left:0;z-index:"+s.z+";opacity:"+s.o;j("body")[0].appendChild(u);k(),window.onresize=k;window.onmousemove=function(i){i=i||window.event,f.x=i.clientX,f.y=i.clientY},window.onmouseout=function(){f.x=null,f.y=null};for(var t=[],p=0;s.n>p;p++){var h=a()*r,g=a()*n,q=2*a()-1,d=2*a()-1;t.push({x:h,y:g,xa:q,ya:d,max:6000})}setTimeout(function(){b()},100)}();


@@@@@@压缩图片
<script>
function aaa(file){
  var file = file.files[0];
  var img = new Image();
  var canvas = document.createElement('canvas');;
  var context = canvas.getContext('2d');;
  var fr = new FileReader();
  fr.readAsDataURL(file); 
  fr.onload = function (e) {
    console.log(e.target.result)
    img.src = e.target.result
    img.alt = '原图'
    img.title = '原图'
  }
  img.onload = function () {
    // 图片原始尺寸
    var originWidth = this.width;
    var originHeight = this.height;
    // 最大尺寸限制
    var maxWidth = 700, maxHeight = 700;
    // 目标尺寸
    var targetWidth = originWidth, targetHeight = originHeight;
    // 图片尺寸超过400x400的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更宽，按照宽度限定尺寸
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    // canvas对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    document.body.appendChild(canvas); //压缩后
    document.body.appendChild(img); //原图
    canvas.toBlob(function (blob) { //或者使用canvas.toDataURL()转成base64
      console.log(blob); //ajax可上传blob图片
    })
  }
}
</script>