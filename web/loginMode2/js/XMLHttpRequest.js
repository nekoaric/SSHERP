    var XMLHttpReq;
    function createXMLHttpRequest() {
        try {
            XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP
        }
        catch(E) {
            try {
                XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP
            }
            catch(E) {
                XMLHttpReq = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象
            }
        }

    }
    function sendAjaxRequest(url,params,backfun) {
        createXMLHttpRequest();                                //创建XMLHttpRequest对象
        XMLHttpReq.open("post", url, true);
        XMLHttpReq.onreadystatechange = backfun; //指定响应函数
        XMLHttpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");    //想要发送数据必须设置http头
        XMLHttpReq.send(params);
    }