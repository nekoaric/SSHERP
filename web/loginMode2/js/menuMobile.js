window.onload = function(){
    
    
    // 请求URL
    var requestOrdNumURL = './menuMobile.mobile?reqCode=requestOrdNum';
    var requestOrdNumProductURL = './menuMobile.mobile?reqCode=requestOrdNum4product';
    var requestMyMenuURL = './accountMobile.mobile?reqCode=queryMenuInfo';
    var requestQueryViewURL = './menuMobile.mobile?reqCode=requestOperateView';
    var requestQCManageURL = './menuMobile.mobile?reqCode=initQCView';    // QC界面请求
    var requestBProductUrl = './menuMobile.mobile?reqCode=requestOrdNum4bp';    // 出运B品
    var requestBDepotUrl='./menuMobile.mobile?reqCode=requestOrdNum4bd';//B品库管理
    var requestDepotCheckUrl='./menuMobile.mobile?reqCode=requestDepotCheck';//B品库管理
    // 菜单DIV
    var menuDiv = getElementById('menuDiv');
    
    var ordNumView = getElementById('ordNumView');
    var qcManage = getElementById('qcManage');
    var block21 = getElementById('block21');
    var ordNumPorductView = getElementById('ordNumPorductView');
    var queryOprInfoView = getElementById('queryOprInfoView');  // 查询当天操作数量信息
    var ordNumBPorductView = getElementById('ordNumBPorductView');  // 出运B品
    var ordNumBDepotView=getElementById('ordNumBDepotView');//b品库管理
    var depotCheckView=getElementById('depotCheckView');
    
    ordNumView.onclick = function(){
        window.location.replace(requestOrdNumURL);
    }
    block21.onclick = function(){
        alert('功能正在开发中.....');
    }
    qcManage.onclick = function(){
        window.location.href = requestQCManageURL;
    }
    
    ordNumBPorductView.onclick = function(){
        window.location.replace(requestBProductUrl);
    }
    
    ordNumBDepotView.onclick = function(){
        window.location.replace(requestBDepotUrl);
    }
    
    depotCheckView.onclick = function(){
        window.location.replace(requestDepotCheckUrl);
    }
    
    ordNumPorductView.onclick = function(){
        window.location.replace(requestOrdNumProductURL);
    }
    
    queryOprInfoView.onclick = function(){
        window.open(requestQueryViewURL);
    }
    
    /**
     * 初始化界面显示
     */ 
    function initView(){
        // 请求我的菜单权限
        sendAjaxRequest(requestMyMenuURL,'rootMenu=0109',requestMyMenu_callBack);
    }
    
    /**
     * 设置我的菜单的权限
     */
    function requestMyMenu_callBack(){
        try{
            if (XMLHttpReq.readyState == 4) {
                if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                    text = eval('('+text+')');
                    
                    if(text.success){
                        parseMenuView(text);
                    }else { // 失败
                        alert('操作失败')
                        return;
                    }
                }
             }
        }catch(e){
            console.log(e);
        }
    }
    /**
     * 处理菜单界面
     */
    function parseMenuView(text){
       // 成功查询
        var allowMenu = [];
        var menuauth = text.menus;
        // 处理合规的菜单
        for(var idx=0;idx<menuauth.length;idx++){
            allowMenu.push(menuauth[idx].menu_id);
        }
        var menus = menuDiv.childNodes;
        for(var idx=0;idx<menus.length;idx++){
            var beanMenu = menus[idx];
            if(beanMenu.nodeType == '1'){ // 元素
                var muneId = beanMenu.getAttribute('data-menuid');
                if(allowMenu.indexOf(muneId)<0){
                    menuDiv.removeChild(beanMenu);
                }
            }
        
        }
    }
    
    function CloseWebPage(){
        return;
         if (navigator.userAgent.indexOf("MSIE") > 0) {
              if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                   window.opener = null;
                   window.close();
              } else {
                   window.open('', '_top');
                   window.top.close();
              }
         }
         else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
         } else {
              window.opener = null;
              window.open('', '_self', '');
              window.close();
         }
    }
    
    function getElementById(eId){
        return document.getElementById(eId);
    };
    
    
    initView();
}