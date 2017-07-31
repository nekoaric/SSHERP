window.onload = function(){
    
    var maxSelectNum = 100; // 设置最大的查询结果数据为100条 否则需要完善查询条件
    
    //  查询的PO号保存
    var resultOrders = {};
    
    // URL
    var queryOrderUrl = './accountMobile.mobile?reqCode=queryOrder';
    var updateMyOrderUrl = './accountMobile.mobile?reqCode=updateMyOrder';
    var ordNumUrl = './ordNumMobile.mobile?reqCode=init';
    
//    var saveMyOrders = './prodOrd.ered?reqCode=saveMyOrder';    // 保存我的订单，多订单操作
    var saveMyOrders = './accountMobile.mobile?reqCode=saveMyOrders'
    
    
    // 按钮
    var queryButton = getElementById('queryButton');
    var style = getElementById('style');
    var orderId = getElementById('orderId');
    var resultOrdersSelect = getElementById('resultOrders');
    var saveMyOrderButton = getElementById('saveMyOrderButton');    // 保存我的订单按钮 
    
    var addMyOrderButton = getElementById('addMyOrder');
    var cancelMyOrderButton = getElementById('cancelMyOrder');
    // 反馈信息
    var fbOrderInfoButton = getElementById('fbOrderInfoButton');
    
    //  树结构
    var selectMyOrderTree = getElementById('selectMyOrderTree'); 
    
    // 返回
    var backButton = getElementById('backButton');
    
    // 事件
    
    backButton.onclick = function(){
        window.location.href = ordNumUrl;
    }
    // 添加按钮的点击事件
    addMyOrderButton.onclick = function(){
        // flag=1是添加  0：是取消
        updateMyOrder('1');
    };
    // 取消按钮的点击事件
    cancelMyOrderButton.onclick = function(){
        updateMyOrder('0');
    };
    /**
     * 订单反馈按钮点击事件
     */
    fbOrderInfoButton.onclick = function(){
        showOrderFB();
    }
    // 保存我的订单 点击按钮
    saveMyOrderButton.onclick = function(){
        // 选取所有选中的订单
        // 封装为请求参数
        // 保存我的订单信息
        //TODO
        // 获取选择的订单的id集合
        var myOrderIds = [];
        var checkboxs = document.getElementsByName('myOrder');
        for(var idx=0;idx<checkboxs.length;idx++){
            var inpBean = checkboxs[idx];
            if(inpBean.checked){
                myOrderIds.push(inpBean.getAttribute('data-id'));
            }
        }
        // 遍历所有的查询结果
        var myorder = [];
        var myprodord = []; // myorder 和myprodord数组是一一对应的关系
        var myorderInOrder = [];    // 生产通知单号的集合
        for(var key in resultOrders) {
            var orderInfo = resultOrders[key];
            myorderInOrder.push(orderInfo.prod_ord_seq);
            if(myOrderIds.indexOf(key) >= 0 ){
                myorder.push(orderInfo.ord_seq_no);
                myprodord.push(orderInfo.prod_ord_seq);
            }
        }
        var params = {
            'myorder' : myorder.join(','),
            'myprodord' : myprodord.join(','),
            'myorderInOrder' : myorderInOrder.join(',')
        }
        var paramStr = parseObj2Str(params);
        sendAjaxRequest(saveMyOrders,paramStr,saveMyOrders_callBack);
    }
    /**
     * 保存我的订单的回调函数
     */
    function saveMyOrders_callBack(){
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('('+text+')');
                
                if(text.success){   // 成功查询
                    // 操作成功
                    alert('操作成功')
                }else { 
                }
            }
         }
    }
    
    /**
     * 更新我的订单
     */
    function updateMyOrder(flag){
        var resultObj = getSelectOption('resultOrders');
        var orderObj = resultOrders[resultObj.value];
        var params = 'flag=' + flag + '&ord_seq_no=' + orderObj.ord_seq_no 
            + '&prod_ord_seq=' + orderObj.prod_ord_seq;
        // 修改orderObj的我的订单信息
        if(flag=='1'){
            orderObj.myorder = 'on';
        }else {
            orderObj.myorder = null;
        }
        sendAjaxRequest(updateMyOrderUrl,params,updateMyOrder_callBack);
    
    }
    
    /**
     * 跟新我的订单的回调函数
     */
    function updateMyOrder_callBack(){
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('('+text+')');
                
                if(text.success){   // 成功查询
                    // 操作成功
                    changeOptionButtons();
                }else { // 查询失败
                }
            }
         }
    
    }
    
    // 查询按钮的点击事件
    queryButton.onclick = function(){
        if(!style.value && !orderId.value){
            alert('请填写款号，或者PO#查询')
            return;
        }
        // 先初始化树数据
        initMyOrderTree();
        
        queryOrderInfo();
    };
    /**
     * 初始化树信息
     */
    function initMyOrderTree(){
        // 初始化数据
        resultOrders = {};
        // 初始化树
        selectMyOrderTree.innerHTML = '';
    }
    
    // 下拉框修改后的数据
    resultOrdersSelect.onchange = function(event){
        changeOptionButtons();
    }
    /**
     * 修改操作的按钮
     */
    function changeOptionButtons(){
        var resultObj = getSelectOption('resultOrders');
        if(!resultObj) {
            return;
        }
        var orderInfo = resultOrders[resultObj.value];
        if(orderInfo.myorder){
            // 是我的订单
            addMyOrderButton.style.display = 'none';
            cancelMyOrderButton.style.display = 'block';
        }else {
            // 不是我的订单
            addMyOrderButton.style.display = 'block';
            cancelMyOrderButton.style.display = 'none';
        }
    }
    
    function initOptionButtons(){
        addMyOrderButton.style.display = 'block';
        cancelMyOrderButton.style.display = 'none';
    }
    
    /**
     * 查询PO号
     */
    function queryOrderInfo(){
        var styleVal = style.value;
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
                    // 将seq_no作为键保存查询结果对象
                    for(var idx=0;idx<orders.length;idx++){
                        resultOrders[orders[idx].seq_no] = orders[idx];
                    }
                    setMyOrderTree();
                    addMyOrderTreeListener(); // 为树添加事件
                    initMyOrderSelect();    // 我的订单选择初始化
//                    setSelectEle('resultOrders',orders,'seq_no','ord_seq_no')
                }else { // 查询失败
                    alert('查询结果过多，请更加完善款号或者PO#')
                    return;
                }
                // 初始化按钮
                initOptionButtons();
            }
         }
    }
    
    /**
     * 初始化我的订单选择
     */
    function initMyOrderSelect(){
        for(var key in resultOrders){
            var orderInfo = resultOrders[key];
            if(orderInfo.myorder){
                var inpEle = getElementById('order'+orderInfo.seq_no);
                inpEle.checked = 'checked';
                var parentid = inpEle.getAttribute('data-parentid');
                selectParent(parentid);
            }
        }
        
    }
    
    /**
     * 添加树的事件 
     */
    function addMyOrderTreeListener(){
        var selectArr = document.getElementsByName('myOrder');
        for(var idx=0;idx<selectArr.length;idx++) {
            var beanEle = selectArr[idx];
            beanEle.onchange = selectChangeListener;
        }
    }
    
    function selectChangeListener(event){
        var targetEle = event.target || event.srcElement;
        var checked = targetEle.checked;
        
        if(checked){
            selectChangeListener_checked(targetEle);
        }else {
            selectChangeListener_unChecked(targetEle);
        }
    }
    /**
     * 选中事件处理
     */
    function selectChangeListener_checked(node){
        var orderArr = document.getElementsByName('myOrder');
        var id = node.id;
        var parentId = node.getAttribute('data-parentid');
        selectChildren(id);
        selectParent(parentId);
        
    }
    
    // 选择子节点
    function selectChildren(id){
        var orderArr = document.getElementsByName('myOrder');
        // 处理的子节点
        var doChildren = [];
        for(var idx=0;idx<orderArr.length;idx++){
            var beanEle = orderArr[idx];
            if(beanEle.getAttribute('data-parentid')==id){
                beanEle.checked = 'checked';
                doChildren.push(beanEle.id)
            }
        }
        for(var idx=0;idx<doChildren.length;idx++) {
            selectChildren(doChildren[idx]);
        }
    }
    // 选择父节点
    function selectParent(parentId){
        var orderArr = document.getElementsByName('myOrder');
        var pId = '';
        for(var idx=0;idx<orderArr.length;idx++) {
            var beanEle = orderArr[idx];
            if(beanEle.id == parentId){
                beanEle.checked = 'checked';
                pId = beanEle.getAttribute('data-parentid');
                break;
            }
        }
        if(pId){
            selectParent(pId);
        }
    }
    
    /**
     * 取消事件处理
     */
    function selectChangeListener_unChecked(node){
        
        var orderArr = document.getElementsByName('myOrder');
        var id = node.id;
        unSelectChildren(id);
        
        // 选择子节点
        function unSelectChildren(id){
            // 处理的子节点
            var doChildren = [];
            for(var idx=0;idx<orderArr.length;idx++){
                var beanEle = orderArr[idx];
                if(beanEle.getAttribute('data-parentid')==id){
                    beanEle.checked = null;
                    doChildren.push(beanEle.id)
                }
            }
            for(var idx=0;idx<doChildren.length;idx++) {
                selectChildren(doChildren[idx]);
            }
        }
    }
    
    /**
     * 设置树的节点信息 
     */
    function setMyOrderTree(){
        selectMyOrderTree.innerHTML = '';
        // 查找出所有不同的款号，作为一级
        var styleArr = [];
        for(var orderKey in resultOrders){
            var orderInfo = resultOrders[orderKey];
            var style_no = orderInfo.style_no;
            if(styleArr.indexOf(style_no)<0){
                styleArr.push(style_no);
            }
        }
        
        if(styleArr.length==0){
            selectMyOrderTree.innerHTML = '<span style="color:red">没有订单信息<span>';
            return;
        }
        
        // 查找款号对应的PO#，作为二级
        for(var idx=0;idx < styleArr.length;idx++){
            var style_no = styleArr[idx];
            var lev1 = document.createElement('li');
            lev1.innerHTML = '<div>' + '<input type="checkbox" name="myOrder"'
                + 'id="style' + idx 
                +'"/>' + style_no
                + '</div>';
            var ul = document.createElement('ul');
            lev1.appendChild(ul)
            selectMyOrderTree.appendChild(lev1);
            
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
                    var showInfo = ord_seq_no + '/' + mark + '/' + ins_num;
                    //  ~~
                    var myorderFlag = orderInfo.myorder;
                    
                    var seq_no = orderInfo.seq_no;
                    var li = document.createElement('li');
                    var colorD=orderInfo.prodstatus=='2'?'<div style="color:red">':'<div>';
                    li.innerHTML = colorD+'<input type="checkBox" name="myOrder" '
                            + ' data-parentid="style' +idx 
                            + '" id="order' + seq_no
                            + '" data-id=' + orderInfo.seq_no 
                            + ' data-type=order'
                            + '/>' + showInfo +'</div>';
                            
                    ul.appendChild(li);
                }
            }
        }
    }
    
    /**
     * 设置下拉框的值
     * @param selectId: 设置下拉框的Id
     * @param arr : 添加数据的数组
     * @param value : 作为值的属性
     * @param text : 作为显示的属性
     */
    function setSelectEle(selectId,arr,value,text){
        var itemEle = document.getElementById(selectId);
        itemEle.options.length = 0;
        var length = arr.length;
        // 添加空选项
        itemEle.options.add(new Option('请选择',''));
        for(var idx=0;idx<length;idx++){
            var optionValue = arr[idx][value];
            var optionText = arr[idx][text];
            itemEle.options.add(new Option(optionText,optionValue));
        }
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
    
        /**
     * 将对象转换为post字符串格式
     */
    function parseObj2Str(obj){
        var resultStr = '';
        for(var key in obj){
            resultStr += '&' + key + '=' + obj[key];
        }
        if(resultStr.length>1){
            resultStr = resultStr.substring(1);
        }
        return resultStr;
    }
}