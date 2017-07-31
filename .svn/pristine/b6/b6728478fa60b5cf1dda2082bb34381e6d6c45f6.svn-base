/**
 * @author zhouww
 * @since  2015-02-03
 * 功能： qc信息查询，订单查询，样式选择
 */
 
 window.onload = function(){
    // 参数
    var resultOrders = {};
    var qcInfo = {};
    
    // 订单数元素
    var productTreeDiv = getElementById('productTreeDiv')
    // 款号(查询)
    var styleNo = getElementById('styleNo');
    // 订单号(查询)
    var orderId = getElementById('orderId');
    // 查询按钮
    var queryPOButton = getElementById('queryPOButton');
    // 下一步按钮
    var nextStepButton = getElementById('nextStep');
    // 样式
    var qcClassSelect = getElementById('qcClass');
    // 订单反馈
    var fbOrderInfoButton = getElementById('fbOrderInfoButton');
    
    // URL
    var queryOrderUrl = './accountMobile.mobile?reqCode=queryOrder'; // 查询订单信息URL
    var queryClassURL = './manageQC.mobile?reqCode=queryClassInfo';   // 查询样式信息
    var queryQCNumViewURL = './manageQC.mobile?reqCode=qcNumView';    // QC数量操作界面请求 
    
    
    
    
    // 事件
    // 订单反馈点击事件
    fbOrderInfoButton.onclick = function(){
        showOrderFB();
    }
    queryPOButton.onclick = function(){
        if(!styleNo.value && !orderId.value){
            alert('请填写款号，或者PO#查询')
            return;
        }
        
        // 先初始化树数据
        initMyOrderTree();
        // 查询PO#
        queryOrderInfo();
    }
    /**
     * 下一步点击事件
     * localStorage.qcInfo 对象用来保存操作qc的信息，qcInfo.ords订单信息,qcInfo.qcClass 样式信息
     * qcInfo.qcOpsition qc位置。
     * 当跳转到这个界面那么初始化qcInfo.ords和qcInfo.qcClass 信息
     * 此处处理是用localStorage来保存数据，如果手机端浏览器不支持那么传递参数到后台，服务器保存数据
     */
    nextStepButton.onclick = function(){
        // 获取订单信息
        var ords = getSelectedInfo();   // 获取选择的信息
        var qcClass = getSelectOption('qcClass');
        
        if(ords.length==0){
            alert('请选择订单信息');
            return;
        }
        
        // 保存订单信息到localStorage  待下一步获取
        if(ords.length > 0){
            qcInfo.ords = ords.join(',');
        }
        
        // 样式
        
        qcInfo.qcClass = qcClass.value;
        qcInfo.qcClassName = qcClass.text;
        
        localStorage.qcInfo = JSON.stringify(qcInfo);
        
        //TODO  跳转到数量输入
        window.location.href = queryQCNumViewURL;
    }
    //===================================AJAX请求
    /**
     * 查询PO号
     */
    function queryOrderInfo(){
        var maxSelectNum = 100;
        var styleVal = styleNo.value;
        var ordVal = orderId.value;
        var params = 'style_no=' + styleVal +'&order_id=' + ordVal + '&maxNum=' + maxSelectNum;
        sendAjaxRequest(queryOrderUrl,params,queryOrderInfo_callBack);
    }
    /**
     * 查询PO号的回调函数
     */
    function queryOrderInfo_callBack(){
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('('+text+')');
                
                if(text.success){   // 成功查询
                    // 处理查询成功的数据
                    var orders = text.orders;
                    parseOrderInfo4Tree(orders);

                    setOrderTree();
                    addListener4tree();
                }else { // 查询失败
                    alert('查询结果过多，请更加完善款号或者PO#')
                    return;
                }
            }
         }
    }
  /**
     * 查询样式信息
     */
    function queryClassInfo(param){
        sendAjaxRequest(queryClassURL,param,queryClassInfo_callBack);
    }
    /**
     * 查询PO号的回调函数
     */
    function queryClassInfo_callBack(){
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('('+text+')');
                
                if(text.success){   // 成功查询
                    // 处理查询成功的数据
                    var qcClass = text.qcClass;
                    parseClassInfo2SelectEle(eval(qcClass));
                }else { // 查询失败
                    alert('查询结果过多，请更加完善款号或者PO#')
                    return;
                }
            }
         }
    }
    /**
     * 解析数据信息到下拉框中
     */
    function parseClassInfo2SelectEle(arr){
        var qcClassItemEle = document.getElementById('qcClass');
        qcClassItemEle.options.length = 0;
        var length = arr.length;
        // 添加空选项
        if(length == 0){
            qcClassItemEle.options.add(new Option('请选择',''))
        }else {
            for(var idx=0;idx<length;idx++){
                var calssid = arr[idx].seq_no;
                var optionValue = calssid;
                var optionText = arr[idx].short_name;
                qcClassItemEle.options.add(new Option(optionText,optionValue));
             }
         }
    }
    
    //~==============================AJAX请求结束
    
     /**
     * 处理查询结束的订单信息
     */
    function parseOrderInfo4Tree(orders){
        // 将seq_no作为键保存查询结果对象
        for(var idx=0;idx<orders.length;idx++){
            resultOrders[orders[idx].seq_no] = orders[idx];
        }
    }
       /**
     * 设置订单树
     */
    function setOrderTree(){
        // 设置PO号展开标识
        // 设置款号
        // 设置PO号
        var expandFlag = true;
        
        productTreeDiv.innerHTML = '';
        
        // 查找出所有不同的款号，作为一级
        var styleArr = [];
        for(var orderKey in resultOrders){
            var orderInfo = resultOrders[orderKey];
            var style_no = orderInfo.style_no;
            if(styleArr.indexOf(style_no)<0){
                styleArr.push(style_no);
            }
        }
        // 如果没有结果数据
        if(styleArr.length==0){
            productTreeDiv.innerHTML = '<span style="color:red">没有数据</span>';
            return;
        }
        
        // 查找款号对应的PO#，作为二级
        for(var idx=0;idx < styleArr.length;idx++){
            var style_no = styleArr[idx];
            var lev1 = document.createElement('li');
            lev1.innerHTML = '<div style="background-color:#dbb20f"  name="myOrder"'
                + ' id="style' + idx + '">'
                + '<input type="checkbox" name="ords" data-id="ord' + idx + '" data-parentid=""/>'
                + style_no
                + '</div>';
            var ul = document.createElement('ul');
            lev1.appendChild(ul)
            productTreeDiv.appendChild(lev1);
            
            for(var orderKey in resultOrders){
                var orderInfo = resultOrders[orderKey];
                var beanStyle = orderInfo.style_no;
                if(beanStyle == style_no){  // 符合款号的订单
                    var ord_seq_no = orderInfo.ord_seq_no;
                    ord_seq_no = ord_seq_no ? ord_seq_no : '--';
                    var mark = orderInfo.mark;
                    mark = mark ? mark : '--';
                    var ins_num = orderInfo.ins_num;
                    ins_num = ins_num ? ins_num : '--';
                    
                    var showInfo = ord_seq_no + ' / ' + mark + ' / ' + ins_num 
                    //  ~~
                    var myorderFlag = orderInfo.myorder;
                    
                    var seq_no = orderInfo.seq_no;
                    var li = document.createElement('li');
                    li.innerHTML = '<div style="background-color:#a3ebfa">'
                            + '<input type="checkBox" name="ords" data-parentid="ord' + idx + '" data-id="'+ ord_seq_no +'" data-type="order"/>'
                            + showInfo
                            +'</div>';
                            
                    ul.appendChild(li);
                }
            }
        }
    }
    /**
     * 获取选择的信息
     */
    function getSelectedInfo(){
        var orders = [];
        var sels = document.getElementsByName('ords');
        for(var idx=0; idx<sels.length; idx++){
            var beanEle = sels[idx];
            var dataType = beanEle.getAttribute('data-type');
            if(dataType=='order' && beanEle.checked){  // 如果data-type的值是order那么这个订单的数据,则保存订单信息
                var order_id = beanEle.getAttribute('data-id');
                orders.push(order_id);
            }
        }
        return orders;
    }
    
     /**
     * 为树添加级联事件
     */
    function addListener4tree(){
        // 添加事件
        var eleArr = document.getElementsByName('ords');
        for(var idx=0;idx<eleArr.length;idx++){
            eleArr[idx].onchange = treeCheckedChange;
        }
    }
    /**
     * 树选择发生改变时
     */
    function treeCheckedChange(node){
        // 取消时的操作
        // 选择时的操作
        var eleTarget = node.target || node.srcElement;
        if(eleTarget.checked){
            treeCheckedChange_checked(eleTarget);
        }else {
            treeCheckedChange_unChecked(eleTarget);
        }
    }
    
     /**
     * 选中时事件操作 
     */
    function treeCheckedChange_checked(eleNode){
        var arrs = document.getElementsByName('ords');
        
        // 选中所有的上级， 选中所有的下级
        var id = eleNode.getAttribute('data-id');
        var parentId = eleNode.getAttribute('data-parentid');
        selectChildren(id);
        selectParent(parentId);
        
        // 选择父节点
        function selectParent(nodeId){
            var pId = '';
            for(var idx=0;idx<arrs.length;idx++){
                if(arrs[idx].getAttribute('data-id') == nodeId) {
                    arrs[idx].checked = 'checked';
                    pId = arrs[idx].getAttribute('data-parentid');
                    break;
                }
            }
            if(pId){
                selectParent(pId);
            }
        }
        // 选择子节点
        function selectChildren(nodeId){
            //记录处理节点信息
            var doEleArr = [];
            
            for(var idx=0;idx<arrs.length;idx++){
                if(arrs[idx].getAttribute('data-parentid') == nodeId) {
                    arrs[idx].checked = 'checked';
                    doEleArr.push(arrs[idx].getAttribute('data-id'))
                }
            }
            
            for(var idx=0;idx<doEleArr.length;idx++) {
                selectChildren(doEleArr[idx])
            }
        }
    }
     /**
     * 取消选择事件操作
     */
    function treeCheckedChange_unChecked(eleNode){
        // 取消所有的下级，不处理上级
        var arrs = document.getElementsByTagName('input');
         var id = eleNode.getAttribute('data-id');
        unSelectChildren(id);
        
        function unSelectChildren(nodeId){
            //记录处理节点信息
            var doEleArr = [];
            
            for(var idx=0;idx<arrs.length;idx++){
                if(arrs[idx].getAttribute('data-parentid') == nodeId) {
                    arrs[idx].checked = null;
                    doEleArr.push(arrs[idx].getAttribute('data-id'))
                }
            }
            
            for(var idx=0;idx<doEleArr.length;idx++) {
                unSelectChildren(doEleArr[idx])
            }
        }
    }
    
    function initMyOrderTree(){
        // 初始化数据
        resultOrders = {};
        // 初始化树
        productTreeDiv.innerHTML = '';
    }
    
    function getElementById(eId){
        return document.getElementById(eId);
    };
    
    /**
     * 获取下拉组件的选择信息
     * 返回对象
     */
    function getSelectOption(sId){
        var resultObj = {};
        var myGrpsItem = document.getElementById(sId);
        // 如果没有这个id的组件，那么返回结果对象(空对象)
        if(!myGrpsItem){
            return resultObj;
        }
        var option = myGrpsItem.options[myGrpsItem.selectedIndex];
        resultObj.value = option.value;
        resultObj.text = option.text;
        return resultObj;
    }
    
    //===================
    /**
     * 界面初始化设置
     */
    function init(){
        // 查询样式信息
        var position = qcInfo.qcPosition;
        
        var param = 'qc_position=' + position; 
        queryClassInfo(param);
    }
    
    /**
     * 初始化保存数据
     */
    (function(){
        //  初始化 查询的记录信息
        var qcInfoStr = localStorage.qcInfo
        if(qcInfoStr){
           qcInfo = JSON.parse(qcInfoStr);
           qcInfo.qcClass = '';
           qcInfo.ords = '';
           qcInfo.qcClassName = '';
        }
        localStorage.qcInfo = JSON.stringify(qcInfo);
        
        init();
    })();
    
 }