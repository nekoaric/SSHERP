window.onload = function(){
    // 参数
    var resultOrders = {};
    
    
    //URL
    var queryMyGrpsUrl = './accountMobile.mobile?reqCode=queryMyGrps';
    var queryOrderUrl = './accountMobile.mobile?reqCode=queryOrder';
    var saveProductNumUrl = './ordNumMobile.mobile?reqCode=saveProductNum';
    var requestMenuUrl = './menuMobile.mobile?reqCode=initView';    // 菜单界面
    var loginOutUrl = './loginMobile.mobile?reqCode=loginOut'; // 退出
    var initGrpsUrl = './accountMobile.mobile?reqCode=init'; // 设置我的工厂
    var initLoginUrl = './loginMobile.mobile?reqCode=init'; // 初始化登录界面
    
    
    // 头功能按钮
    var setFacButton = getElementById('setFacButton');
    var requestMenuButton = getElementById('requestMenu');
    var quitButton = getElementById('quitButton');
    
    // 保存出运数量
    var saveProductNumsButton = getElementById('saveProductNums');
    
    // 查询按钮
    var queryPOButton = getElementById('queryPOButton');
    // 款号(查询)
    var styleNo = getElementById('styleNo');
    // 订单号(查询)
    var orderId = getElementById('orderId');
    // 订单反馈
    var fbOrderInfoButton = getElementById('fbOrderInfoButton');
    
    // 备注
    var ordNumRemark = getElementById('ordNumRemark');
    
    // 订单数元素
    var productTreeDiv = getElementById('productTreeDiv')
    
    // 操作日期组件
    var opr_date = getElementById('opr_date');
    
    // ~~~~~~~~~~~~~~~~~~添加事件
    // 订单反馈点击事件
    fbOrderInfoButton.onclick = function(){
        showOrderFB();
    }
    // 保存数量的按钮
    saveProductNumsButton.onclick = function(){
        if(valideProductNumInfo()){
            saveProductNums();
        };
        
    }
    // 设置工厂按钮-单击事件
    setFacButton.onclick = function(event){
        window.location.href = initGrpsUrl;
    }
    // 返回菜单按钮-单击事件
    requestMenuButton.onclick = function(event){
        window.location.href = requestMenuUrl;
    }
    // 退出按钮-单击事件
    quitButton.onclick = function(){
        // 判断是否有填写数量
        var isExists = false;
        var eles = document.getElementsByName('productNum');
        for(var idx=0;idx<eles.length;idx++){
            var beanEle = eles[idx];
            if(beanEle.value){
               isExists = true;
               break;
            }
        }
        // 如果存在则增加提示
        if(isExists){
            var quitFlag = confirm('已经有数量存在，是否继续退出?');
            if(!quitFlag){
                return;
            }
        }
        
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
    //~~~~~~~~~~~~~~~~~0,1,2,3,4,5,6,7,8,9,-(PC端),-(移动端),回退
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
    //~~~~~~~~~~~~~~~~~0,1,2,3,4,5,6,7,8,9,-(PC端),-(移动端),回退(safari)回退(android)
    var allowKeyArr = ['U+0030','U+0031','U+0032','U+0033','U+0034','U+0035','U+0036','U+0037','U+0038','U+0039','U+00BD','U+002D','U+0008','U+00007F'];
    /**
     * 操作日期文本框键盘按下事件
     */
//    opr_date.onkeydown = function(event){
//        //  当按钮不是数字或者‘-’时不做响应
//        var keyCode = event.keyIdentifier;
//        // 如果不包含则无响应
//        if(allowKeyArr.indexOf(keyCode) < 0){
//            return false;
//        }
//    }
    
    opr_date.onblur = function(){
        //  当按钮不是数字或者‘-’时不做响应
        var date = opr_date.value;
        if(date.indexOf('-')==-1){
        date= date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6);
        }
        var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;     
        var r = date.match(reg);     
        if(r==null){    
            alert('对不起，您输入的日期格式不正确!'); //请将“日期”改成你需要验证的属性名称! 
            opr_date.onfocus;
        }
        opr_date.value=date;
    }
    
    
    //~~~~~~~~~~~~~~~~函数
    // 请求保存数量的标志
    var reqFlag = false;
    // 保存出运的数量
    function saveProductNums(){
        var resultNumsArr = [];
        var resultObj = {};
        var eles = document.getElementsByName('productNum');
        for(var idx=0;idx<eles.length;idx++){
            var beanEle = eles[idx];
            if(beanEle.value){
                var key = beanEle.getAttribute('data-id');
                var orderInfo = resultOrders[key];
                var beanObj = {};
                beanObj.order_id = orderInfo.ord_seq_no;
                beanObj.mark = orderInfo.mark;
                beanObj.style_no = orderInfo.style_no;
                beanObj.amount = beanEle.value;
                resultNumsArr.push(beanObj);
            }
        }
        var selectFacObj = getSelectOption('myGrpsSelect');
        // 工厂，交易日期，备注信息
        var generObj = {};
        generObj.grp_id = selectFacObj.value;
        generObj.tr_date = opr_date.value;
        generObj.remark = ordNumRemark.value;
        
        resultObj.baseInfo = generObj;
        resultObj.nums = resultNumsArr;
        if(!reqFlag){
            reqFlag = true;
            sendAjaxRequest(saveProductNumUrl,'natureFlag=' + natureFlag + '&numInfo=' + JSON.stringify(resultObj),saveProductNum_callBack);
        }
    }
    /**
     * 保存出运回调函数
     */
    function saveProductNum_callBack(){
        try{
            if (XMLHttpReq.readyState == 4) {
                if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                    text = eval('('+text+')');
                    
                    if(text.success){   // 成功查询
                        var unValideInfo = text.unValideInfo;
                        var unValideArr = eval(unValideInfo);
                        var showInfo = '处理成功';
                        if(unValideArr.length > 0){
                            showInfo = ' 数量超出订单数1.2倍的订单：' + unValideInfo;
                            var eles = document.getElementsByName('productNum');
                            for(var idx=0;idx<eles.length;idx++){
                                var beanEle = eles[idx];
                                var key = beanEle.getAttribute('data-id');
                                var orderInfo = resultOrders[key];      
                                var order_id = orderInfo.ord_seq_no;
                                if(unValideArr.indexOf(order_id) < 0){  // 处理合规的数据
                                    beanEle.value = '';
                                }
                            }
                        }else {
                            initView();
                        }
                        alert(showInfo);
                    }else { // 失败
                        alert('操作失败')
                        return;
                    }
                }
             }
        }catch(e){
            console.log(e);
        }
        reqFlag = false;
        
    }
    
    // 验证出运的数据
    function valideProductNumInfo(){
        var selectFacObj = getSelectOption('myGrpsSelect');
        if(!selectFacObj.value){
            alert("请选择工厂,或者设置工厂");
            return false;
        }
        var dateVal = opr_date.value;
        if(!valideDate(dateVal)){
            alert("请使用标准格式的日期");
            return false;
        };
        var isExists = false;
        var eles = document.getElementsByName('productNum');
        for(var idx=0;idx<eles.length;idx++){
            var beanEle = eles[idx];
            if(beanEle.value){
               isExists = true;
               break;
            }
        }
        if(!isExists){
            alert('请输入出运数量');
            return false;
        }
        return true;
    }
    
    
    function initMyOrderTree(){
        // 初始化数据
        resultOrders = {};
        // 初始化树
        productTreeDiv.innerHTML = '';
    }
    
    
       /**
     * 查询PO号
     */
    function queryOrderInfo(){
        var maxSelectNum = 100;
        var styleVal = styleNo.value;
        var ordVal = orderId.value;
        var product_flag='true';
        var params = 'style_no=' + styleVal +'&order_id=' + ordVal + '&maxNum=' + maxSelectNum + '&natureFlag=' + natureFlag+ '&product_flag=' + product_flag;
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
                    addListener4Tree()
                }else { // 查询失败
                    alert('查询结果过多，请更加完善款号或者PO#')
                    return;
                }
            }
         }
    }
    /**
     * 为树添加事件
     */
    function addListener4Tree(){
        var eles = document.getElementsByName('productNum');
        for(var idx=0;idx<eles.length;idx++){
             eles[idx].onkeydown = listenerFun;
        }
    }
    //~~~~~~~~~~~~~~~~~0,1,2,3,4,5,6,7,8,9
     var numArr = ['U+0030','U+0031','U+0032','U+0033','U+0034','U+0035','U+0036','U+0037','U+0038','U+0039','U+0008'];
    /**
     * 数字按钮判断
     */
    function listenerFun(event){
        var keyCode = event.keyIdentifier;
//        alert(keyCode + " " + event.keyLocation + " " + event.keyIdentifier) ;
        // 如果不包含则无响应
        if(numArr.indexOf(keyCode) < 0){
            return false;
        }
        return true;
    }
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
        var expandFlag = getExpandFlag();
        
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
                + ' id="style' + idx 
                +'">' + style_no
                + '</div>';
            var ul = document.createElement('ul');
            lev1.appendChild(ul)
            productTreeDiv.appendChild(lev1);
            
            for(var orderKey in resultOrders){
                var orderInfo = resultOrders[orderKey];
                var beanStyle = orderInfo.style_no;
                if(beanStyle == style_no){  // 符合款号的订单
                    var ord_seq_no = orderInfo.ord_seq_no;
                    ord_seq_no = parseFormatInfo(ord_seq_no,10);
                    
                    var mark = orderInfo.mark;
                    mark = parseFormatInfo(mark,5);
                    
                    var ins_num = orderInfo.ins_num;
                    ins_num = parseFormatInfo(ins_num,6);
                    
                    var cust_name = orderInfo.cust_name;
                    cust_name = parseFormatInfo(cust_name,8);
                    
                    var sendout_product = orderInfo.sendout_product;
                    sendout_product = parseFormatInfo(sendout_product,6);
                    
                    var showInfo = ord_seq_no + ' / ' + mark + ' / ' + cust_name + ' / ' 
                            + ins_num + ' / ' + sendout_product;
                            
                    //  ~~
                    var myorderFlag = orderInfo.myorder;
                    
                    var seq_no = orderInfo.seq_no;
                    var li = document.createElement('li');
                    li.innerHTML = '<div style="background-color:#a3ebfa">'
                            + showInfo
                            +' <input name="productNum" '
                            + ' data-parentid="style' +idx 
                            + '" id="order' + seq_no
                            + '" data-id=' + orderInfo.seq_no 
                            + ' data-type=order' 
                            + ' style="text-align:center"'
                            + 'type="text" placeholder="输入出运数量"/>'
                            +'</div>';
                            
                    ul.appendChild(li);
                }
            }
        }
    
    }
    
    /**
     * 获取订单树中订单是否展开标识
     * true : 展开
     * false : 不展开
     */
    function getExpandFlag(){
        return true;
    }
    
    function initView(){
        sendAjaxRequest(queryMyGrpsUrl,'',initMyGrps_callBack);
        // 设置默认的操作日期
        var defaultDate = getDate(0);
        opr_date.value = defaultDate;
        // 清空备注
        ordNumRemark.value = '';
        
        // 清空数量信息
        productTreeDiv.innerHTML = '';
    }
    /**
     * 请求我的工厂返回信息
     */
    function initMyGrps_callBack(){
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                     text = eval('('+text+')');
                     var myGrps = text.myGrps;
                     
                     var myGrpsSItemEle = document.getElementById('myGrpsSelect');
                     myGrpsSItemEle.options.length = 0;
                     var length = myGrps.length;
                     // 添加空选项
                     myGrpsSItemEle.options.add(new Option('请选择',''))
                     for(var idx=0;idx<length;idx++){
                        // id 等于 13位的为地区， 10位的为工厂 大于13位的为工厂 
                        var grp_id = myGrps[idx].grp_id;
                        if(grp_id.length > 13){ // 增加工厂判断 
                             var optionValue = grp_id;
                             var optionText = myGrps[idx].name;
                             myGrpsSItemEle.options.add(new Option(optionText,optionValue));
                        }
                     }
             }
         }
    }
    
    /**
     * 获取当前日期的相对days日期
     */
    function getDate(days){
        var curD = new Date();
        var dayOfMonth = curD.getDate();
        var resultDay = (+dayOfMonth) + days;
        curD.setDate(resultDay);
        var year = curD.getFullYear();
        var month = curD.getMonth()+1;
        month += '';
        month = month.length==1 ? '0'+month : month;
        
        var day = curD.getDate();
        day += '';
        day = day.length==1 ? '0'+day : day;
        
        return year + '-' + month + '-' + day;
    }
    
   /**
     * 检验日期规范
     * 日期为 yyyy-mm-dd/yyyymmdd
     */
    function valideDate(date){
        var valDate = '';
        // 如果长度不是10或者8的话就不是指定的格式长度
        if(!(date.length==10 || date.length==8)){
            return false;
        }
        // 含有‘-’符号的作为yyyy-mm-dd日期处理
        var parseDate = date;
        if(parseDate.indexOf('-') < 0){
            parseDate = date.substr(0,4) + '-' + date.substr(4,2) + '-' + date.substr(6,2);
        }
        valDate = new Date(parseDate);
        if(isNaN(valDate.valueOf())){
            return false;
        }
        return true;
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
     * 格式化显示信息
     * 如果没有value值 用--代替
     * 不足位数用空格代替
     */
    function parseFormatInfo(value,length){
        if(!value){return '--';}
//        if(value.length < length){
//            for(var idx=value.length; idx<length;idx++){
//                value += ' ';
//            }
//        }
        return value;
    }
    
    initView();
}