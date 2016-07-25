/**
 * Created by taorongaa on 16/6/17.
 */
//存储cookie
function setCookie (name, value) {
    //设置名称为name,值为value的Cookie
    var expdate = new Date();   //初始化时间
    expdate.setTime(expdate.getTime() + 30 * 60 * 1000);   //时间,半小时之后cookie失效;
    document.cookie = name+"="+value+";expires="+expdate.toGMTString()+";path=/";
    //即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
}
//获取cookie
function getCookie(){
    var cookie = {};
    var all = document.cookie;
    if (all ===""){
        return cookie;
    }
       var list=all.split("; ");
        for(var i=0;list.length>i;i++){
            var item = list[i];
            var p = item.indexOf("=");
            var name = item.substring(0, p);
            name = decodeURIComponent(name);
            var value = item.substring(p + 1);
            value = encodeURIComponent(value);
            cookie[name] = value;
        }
        return cookie;
}


//notice提示栏
function notice(){
    var click = document.getElementById("n-nts");
    var element = document.getElementById("nts");
    if(getCookie()["notice"]=="true"){
        element.style.display = "none";
    }
    click.addEventListener("click",function(){

        element.style.display = "none";
        setCookie("notice","true");
    })
}

notice();
//      getElementByClassName兼容
function getElementByClassName(root,className){
    if(root.getElementsByClassName){
        return root.getElementsByClassName(className);
    }else{
        var result = [];
        var elements = root.getElementById("*");
        for(var i= 0,element;element = elements[i];i++){
            if(hasClassName(element,className)){
                result.push(element);
            }
        }
        return result;
    }
}

/**
 * 轮播图,图片5S渐显循环.
 * @param imgClass 图片类名
 * @param num 控制按钮的父元素类名
 */
function banner(imgClass,num) {
    var images = document.getElementsByClassName(imgClass);     //获取轮播图图片
    var nums = document.getElementsByClassName(num)[0].children;    //获取控制按钮
    var ul = document.getElementsByClassName("ban-picBox")[0];  //轮播图父元素
    //图片显影效果函数,0.5秒完成循环
    function opacity(ele) {
        var v = 0, temp = 0.2;
        for (var i = 0; images.length > i; i++) {
            images[i].style.opacity = 0;
        }
        ele.style.display = "block";
        var timer = setInterval(step1, 100);

        function step1() {
            if (v + temp <= 1) {
                v += temp;
                ele.style.opacity = v;
            } else {
                clearInterval(timer);
                v = 0;
            }
        }
    }

    //轮播图切换方法.
    function step() {
        for (var i = 0; images.length > i; i++) {
            if (images[i].style.display == "block") {
                //如果图片的display为block时将其改为none;
                images[i].style.display = "none";
                if (i == images.length - 1) {
                    //判断当图片为最后一张图时,改变第一张图的display值
                    clear();
                    opacity(images[0]);
                    nums[0].className = "active";
                } else {
                    clear();
                    opacity(images[i + 1]);
                    nums[i + 1].className = "active";
                }
                break;
            }
        }
    }

    //清除初始图片display值以及控制钮class
    function clear() {
        for (var i = 0; nums.length > i; i++){
            images[i].style.display = "none";
            nums[i].className = '';
        }
    }
    //轮播图控制钮点击变换class方法
    for (var j = 0; nums.length > j; j++) {
        nums[j].id = j;
        nums[j].addEventListener("click", function () {
            clear();
            opacity(images[this.id]);
            nums[this.id].className = "active";
        })
    }
    //使用时间触发器调用step函数
    var intervalID = setInterval(step, 5000);
    //鼠标悬停清除时间控制
    ul.addEventListener("mouseover", function () {
        clearInterval(intervalID);
    });
    //鼠标移出重新调用
    ul.addEventListener("mouseout", function () {
        intervalID = setInterval(step, 5000);
    });
}
banner("ban-pic","imgNum");
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}
/**
 * ajax请求参数对象转换成所需格式
 * @param data 请求参数对象
 * @returns {*}
 */
function serialize(data) {
    if (!data) return '';
    var parse = [];
    for (name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === "function") continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        parse.push(name + "=" + value);
    }
    return parse.join('&');
}
/**
 * ajax请求通用函数
 * @param url 请求地址
 * @param method 请求方法
 * @param success 成功后的回调函数
 */
function ajax(url,method,success,data){
    if (method == 'GET'){
        url = url + serialize(data);
    }
    var xhr = createCORSRequest(method,url);
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if((xhr.status >=200 && xhr.status < 300) || xhr.status == 304){
                success(xhr);
            }else{
                console.log(xhr.status);
            }
        }
    };
    if(method == 'GET'){
        xhr.send();
    }else {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(serialize(data));
    }
}
//登录关注
function login(){
    var follow_btn = document.getElementsByClassName("follow-btn")[0];
    var login_btn = document.getElementsByClassName("login-btn")[0];
    var lgn = document.getElementsByClassName("login")[0];
    var remove = document.getElementsByClassName('remove-define')[0];
    var url ='http://study.163.com/webDev/login.htm?';

    //关注后存储cookie;改变关注按钮样式;
    function follow(){
        setCookie('followSuc',true);
        follow_btn.setAttribute('class','followed-btn');
        follow_btn.firstElementChild.innerHTML = '已关注';
        remove.style.display = 'block';
    }
    //刷新页面判断用户是否已关注,如果已关注,调用follow
    if(getCookie()['followSuc'] == "true"){
        follow();
    }
    remove.addEventListener('click',function(){
        console.log(remove);
        setCookie('followSuc','');
        remove.style.display = 'none';
        follow_btn.setAttribute('class','follow-btn');
    });
   //关注按钮点击事件
    follow_btn.addEventListener('click',function(){
        //判断是否用户登录,如果未登录,调出登录界面
        if(!getCookie()['loginSuc']){
            lgn.style.display = 'block';
            //登录按钮点击事件,登陆成功
            login_btn.addEventListener("click",function(){
                var name = document.getElementsByClassName("login-text")[0].value;
                var value =document.getElementsByClassName("login-text")[1].value;
                var obj = {userName : hex_md5(name),password :hex_md5(value)};
                function loginSuc(xhr){
                    if(xhr.responseText == 1){
                        setCookie('loginSuc',true);
                        lgn.style.display = 'none';
                    }
                }
                ajax(url,'GET',loginSuc,obj);
            });
        }else {
            follow();
        }
    });
    var close = document.getElementsByClassName('login-close')[0];
    close.onclick = function(){
        lgn.style.display = 'none';
    }
}
login();


function couse(){
    var tags = document.getElementsByClassName('cous-tag')[0].getElementsByTagName('span');
    var type = 0;
    var typeNum = 10;
    for(var j = 0;tags.length>j;j++){
        tags[j].onclick = function(){
            if(this.innerHTML == '产品设计'){
                type = 1;typeNum = 10;
                this.className = 'tag-act';
                tags[1].className = '';
                couselist();
            }else if(this.innerHTML == '编程语言'){
                type = 2;typeNum = 20;
                this.className = 'tag-act';
                tags[0].className = '';
                couselist();
            }
        };
    }
    /**
     * 页码切换部分.
     */
    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    var psizeNumber = 20;
    if (clientWidth <= 1205) {
        psizeNumber = 15;
    } else {
        psizeNumber = 20;
    }
    // 页码大小限制
    var totalPage;
    var paginationUP = document.getElementsByClassName("arrow")[0];
    var paginationDOWN = document.getElementsByClassName("arrow")[1];
    var pageNoNumber = 1;
    //数字切换页码
    var page_temp = document.getElementsByClassName("g-page-num")[0];
    var page = page_temp.getElementsByTagName("i");
    for (var i = 0; i < page.length; i++) {
        page[i].onclick = function () {
            for (var j = 0; j < page.length; j++) {
                page[j].className = "";
            }
            //当前高亮
            this.className = "page-active";
            //从服务器获取的页码
            pageNoNumber = parseInt(this.innerHTML);
            couselist();
        };
    }
    //向上向下切换页码
//默认为false表示向下增加
    var UpOrDown = true;
//向上向下点击时执行的事件.
    function upDown() {
        for (var i = 0; i < page.length; i++) {
            //当向下翻页时传入页码不为8的倍数时,根据条件翻页,处理传入为8时,直接翻页导致最后的8和8的倍数取不到的情况
            if (UpOrDown && parseInt(pageNoNumber % 8) !== 0) {
                page[i].innerHTML = parseInt(pageNoNumber / 8) * 8 + i + 1;
            } else {
                //当向上时,如果传入为8的倍数时,直接翻页,不这样处理的话总是会出现要比8的倍数少1才翻页的情况
                if (parseInt(pageNoNumber % 8) == 0) {
                    page[i].innerHTML = (parseInt(pageNoNumber / 8) - 1) * 8 + i + 1;
                } else {
                    //向上翻页的普通情况
                    page[i].innerHTML = parseInt(pageNoNumber / 8) * 8 + i + 1;

                }
            }
            page[i].className = "";
        }
        if (parseInt(pageNoNumber % 8) == 0) {
            page[page.length - 1].className = "page-active";

        } else {
            page[parseInt(pageNoNumber % 8) - 1].className = "page-active";
        }
    }
//向上翻页点击事件
    paginationUP.addEventListener ("click", function () {
        pageNoNumber--;
        //边界处理
        if (pageNoNumber <= 1) {
            pageNoNumber = 1;
            couselist();
        }
        UpOrDown = false;
        upDown();
        couselist();
    });
//向下翻页点击事件
    paginationDOWN.addEventListener("click", function () {
        pageNoNumber++;
        //边界处理
        if (pageNoNumber >= totalPage) {
            pageNoNumber = totalPage;
            couselist();
        }
        UpOrDown = true;
        upDown();
        couselist();
    });

    function couselist(){
        var obj = {pageNo:pageNoNumber,psize:psizeNumber,type:typeNum};
        var cous = document.getElementsByClassName('cous-row');
        var img = document.getElementsByClassName('cous-img');
        var name = document.getElementsByClassName('cous-name');
        var provider = document.getElementsByClassName('cous-pvder');
        var learnerCount = document.getElementsByClassName('c-icon');
        var price = document.getElementsByClassName('cost');
        var big_name = document.getElementsByClassName('big-cous-name');
        var big_count = document.getElementsByClassName('big-count');
        var big_pvder = document.getElementsByClassName('big-pvder');
        var big_category = document.getElementsByClassName('big-category');
        var description = document.getElementsByClassName('description');
        var cous_link = document.getElementsByClassName('cous-ctain');
        var big_link = document.getElementsByClassName('big-ctain');
        ajax('http://study.163.com/webDev/couresByCategory.htm?','GET',corseSuc,obj);
        /**
         *
         * @param xhr
         */
        function corseSuc(xhr){
            var data = JSON.parse(xhr.responseText);
            totalPage = data["totalPage"];
            var list = data['list'];
            for(var i = 0;list.length>i;i++){
                img[i].setAttribute('src',list[i]['bigPhotoUrl']);
                cous[i].setAttribute('id',list[i]['id']);
                name[i].innerHTML = list[i]['name'];
                provider[i].innerHTML = list[i]['provider'];
                learnerCount[i].innerHTML = list[i]['learnerCount'];
                price[i].innerHTML = '¥'+list[i]['price'];
                big_name[i].innerHTML = list[i]['name'];
                big_count[i].innerHTML = list[i]['learnerCount'] + '人在学';
                big_pvder[i].innerHTML = '发布人:' + list[i]['provider'];
                big_category[i].innerHTML = '分类:' + list[i]['categoryName'];
                description[i].innerHTML =  list[i]['description'];
                cous[i].firstElementChild.href = list[i].providerLink;
                cous_link[i].firstElementChild.href = list[i].providerLink;
                big_link[i].firstElementChild.href = list[i].providerLink;
            }
        }
        for(var i=0;img.length>i;i++){
            img[i].addEventListener('mouseenter',function(){
                var bigCous=this.parentNode.parentNode.lastElementChild;
                bigCous.style.display = 'block';
                this.parentNode.style.zIndex = 10;
            });
            cous[i].addEventListener('mouseleave',function(){
                var thisImg = this.firstElementChild;
                this.lastElementChild.style.display = 'none';
                thisImg.style.zIndex = 0;
            })
        }

    }
    couselist()

}
couse();


//热门排行
ajax('http://study.163.com/webDev/hotcouresByCategory.htm','GET',rankSuc,'');
function rankSuc(xhr){
    var data = JSON.parse(xhr.responseText);
    console.log(data);
    var rank = document.getElementsByClassName('rank-row');
    var rank_name = document.getElementsByClassName('rank-row-name');
    var rank_img = document.getElementsByClassName('rank-img');
    var rank_count = document.getElementsByClassName('r-icon');
    console.log(rank_img);
    for(var i = 0;rank.length>i;i++){
        rank[i].firstElementChild.href = data[i].providerLink;
        rank_name[i].parentNode.href = data[i].providerLink;
        rank[i].id = data[i].id;
        rank_name[i].innerHTML = data[i].name;
        rank_img[i].src = data[i].smallPhotoUrl;
        rank_count[i].innerHTML = data[i].learnerCount;

    }
}
/**
 *获取实际样式函数
 * @param   {Object} obj  需要获取样式的对象
 * @param   {String} attr 获取的样式名
 * @returns {String} 获取到的样式值
 */
function getStyle(obj, attr) {
    //IE写法
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
        //标准
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}
function showHide(obj) {
    var objDisplay = getStyle(obj, "display");
    if (objDisplay == "none") {
        obj.style.display = "block";
    } else {
        obj.style.display = "none";

    }
}
function movie() {
    var moviePlayer =document.getElementsByClassName("mov")[0].getElementsByTagName("img")[0];
    var playerWrap = document.getElementsByClassName("video")[0];
    var closemovie =document.getElementsByClassName("movie-close")[0];
    var movie = document.getElementById('movie');
    console.log(movie);
    function playPause() {
        if (movie.paused)
            setTimeout(function () {
                movie.play();

            }, 500);
        else
            movie.pause();
    }

    function play() {
        showHide(playerWrap);
        playPause();

    }
    moviePlayer.onclick = play;
    closemovie.onclick = play;
}
movie();

