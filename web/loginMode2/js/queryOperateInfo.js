window.onload = function(){
    
    // 页面请求URL
    var loginOutUrl = './loginMobile.mobile?reqCode=loginOut';
    var requestMenuUrl = './menuMobile.mobile?reqCode=initView';
    var initLoginUrl = './loginMobile.mobile?reqCode=init';
    var queryOrddaylistUrl = './accountMobile.mobile?reqCode=queryOrdDayListInfo';
    
    // 主键树元素
    var rootTree = getElementById('rootTree');
    
    // 退出
    var quitButton = getElementById('quitButton');
    // 返回菜单
    var requestMenu = getElementById('requestMenu');
    
    quitButton.onclick = function(){
         sendAjaxRequest(loginOutUrl,'',loginOut_callBack)
    }
    
    function loginOut_callBack(){
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                // 退出成功后跳转到登录界面
                window.location.href = initLoginUrl;
             }
         }
    }
    requestMenu.onclick = function(){
        window.location.href = requestMenuUrl;
    }
    // 查询操作的流水记录
    function queryOrdDayListInfo(){
        sendAjaxRequest(queryOrddaylistUrl,'',queryODLInfo_callBack)
    }
    
    function queryODLInfo_callBack(){
        
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                 text = eval('('+text+')');
                 if(text.success){
                    var resList  = text.result;
                    parseResult2Tree(resList);
                 }
             }
         }
    
    }
    /**
     * 解析结果生成树
     */
    function parseResult2Tree(list){
        rootTree.innerHTML = '';
        // 获取不同款号
        var styleArr = getDistinctStyle(list);
        if(styleArr.length==0){
            rootTree.innerHTML = '当天没有操作数据';
            return;
        }
        // 为款号获取不同的订单号
        for(var styIdx=0; styIdx<styleArr.length; styIdx++){
            var styleNo = styleArr[styIdx];
            
            var styleLi = document.createElement('li');
            var styleChildUl = document.createElement('ul');
            styleLi.innerHTML = '<div style="background-color:#0d7ae7">' +
                    styleNo + '</div>';
            styleLi.appendChild(styleChildUl);
            
            var orderArr = getDistinctOrder4Style(list, styleNo);
            for(var ordIdx=0;ordIdx<orderArr.length;ordIdx++){
                var orderNo = orderArr[ordIdx].order_id;
                var mark = orderArr[ordIdx].ribbon_color;
                
                var orderLi = document.createElement('li');
                var orderChildUl = document.createElement('ul');
                orderLi.innerHTML = '<div style="background-color:#429cf5">' + orderNo +' / ' + mark + '</div>';
                orderLi.appendChild(orderChildUl);
                
                var ordList = getDistinctNum4order(list,orderNo);
                for(var beanIdx=0;beanIdx<ordList.length;beanIdx++){
                    var bean = ordList[beanIdx];
                    var showInfo = bean.tr_date + ' / ' + bean.natureName + ' / ' + bean.amount;
                    
                    var natureLi = document.createElement('li');
                    natureLi.innerHTML = '<div style="background-color:#8ac2f9">' + showInfo + '</div>';
                    orderChildUl.appendChild(natureLi);
                }
                styleChildUl.appendChild(orderLi);
            }
            rootTree.appendChild(styleLi);
        }
    }
    // 获取订单下的数量性质信息
    function getDistinctNum4order(arr,orderNo){
        var orderArr = [];
        for(var idx=0;idx<arr.length;idx++) {
            var bean = arr[idx];
            var beanOrderNo = bean.ord_seq_no;
            if(beanOrderNo==orderNo){
                orderArr.push(bean);
            }
        }
        return orderArr;
    
    }
    // 获取款号下的不同订单号信息
    function getDistinctOrder4Style(arr,styleNo){
        var orderArr = [];
        var orderNoArr = [];
        for(var idx=0;idx<arr.length;idx++) {
            var bean = arr[idx];
            var orderNo = bean.ord_seq_no;
            var beanStyleNo = bean.style_no;
            if(beanStyleNo==styleNo && orderNoArr.indexOf(orderNo)<0){
                var resultB = {};
                resultB.order_id = orderNo;
                resultB.ribbon_color = bean.ribbon_color;
                orderArr.push(resultB);
                orderNoArr.push(orderNo);
            }
        }
        return orderArr;
    }
    // 获取不同的款号信息
    function getDistinctStyle(arr){
        var styleArr = [];
        for(var idx=0;idx<arr.length;idx++){
            var bean = arr[idx];
            var styleNo = bean.style_no;
            if(styleArr.indexOf(styleNo)<0){
                styleArr.push(styleNo);
            }
        }
        return styleArr;
    }
    
    
    function getElementById(eId){
        return document.getElementById(eId);
    };
    
    queryOrdDayListInfo();
}