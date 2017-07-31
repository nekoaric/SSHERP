window.onload = function(){
    new uploadPreview({ UpBtn: "up_img", DivShow: "imgdiv", ImgShow: "imgShow" });
    // 参数
    var myOrders = {};
    
    // 隐藏信息
    var ordNumFlag = getElementById('ordNumFlag');
    // 工厂设置页面
    var initGrpsUrl = './accountMobile.mobile?reqCode=init';
    var loginOutUrl = './loginMobile.mobile?reqCode=loginOut';
    var initLoginUrl = './loginMobile.mobile?reqCode=init';
    var queryMyGrpsUrl = './accountMobile.mobile?reqCode=queryMyGrps';
    var queryMyOrdersUrl = './accountMobile.mobile?reqCode=queryMyOrder';
    var setMyOrdersUrl = './accountMobile.mobile?reqCode=initMyOrderView';
    var queryNaturesUrl = './ordNumMobile.mobile?reqCode=queryNatures';
    var queryCountNumUrl = './ordNumMobile.mobile?reqCode=queryCountNum';
    var saveOrdNumUrl = './ordNumMobile.mobile?reqCode=saveOrdNum';
    var requestMenuUrl = './menuMobile.mobile?reqCode=initView';
    
    // 设置工厂
    var setFacButton = getElementById('setFacButton');
    // 退出
    var quitButton = getElementById('quitButton');
    // 设置我的工厂
    var setMyOrders = getElementById('setMyOrders');
    // 返回菜单
    var requestMenu = getElementById('requestMenu');
    
    // 上下界面操作
    var firstStepNext = getElementById('firstStepNext');
    var secondStepPrevious = getElementById('secondStepPrevious');
    var secondStepNext = getElementById('secondStepNext');
    var thirdStepPrevious = getElementById('thirdStepPrevious');
    var submitButton = getElementById('submitButton');
    var cust_name_show = getElementById('cust_name_show');
    
    // 第二步的组件
    var style_no_readText = getElementById('style_no_read');
    var mark_readText = getElementById('mark_read');
    var orderSelect = getElementById('orderSelect');
    var fob_deal_date = getElementById('fob_deal_date');
    var cust_name = getElementById('cust_name');
    
    // 操作步骤
    var selectFacAndDateDivEle = getElementById('selectFacAndDateDiv');
    var selectPODivEle = getElementById('selectPODiv');
    var ordNumDivEle = getElementById('ordNumDiv');
    
    // 数量操作界面组件
    var cur_date_show = getElementById('cur_date_show');
    var opr_date_show = getElementById('opr_date_show');    // 操作日期
    var mark_show = getElementById('mark_show');    // 丝带色号
    var ins_num_show = getElementById('ins_num_show');  // 开单数
    var order_id_show = getElementById('order_id_show');    // PO号信息
    var style_no_show = getElementById('style_no_show');    // 款号信息
    var ordNumRemark = getElementById('ordNumRemark');  // 备注信息
    var styleSelect = getElementById('styleSelect');    // 选择
    var article_show=getElementById('article_show');//品名
    var pic_file=getElementById('up_img');
    // 流程线提示信息 
    var selectFacAndDateInfo = getElementById('selectFacAndDateInfo');
    var selectPOInfo = getElementById('selectPOInfo');
    var ordNumInfo = getElementById('ordNumInfo');
    
    
    // 操作日期
    var cur_date=getElementById('cur_date');
    // 颜色
    var initColor = '#999999';
    var selectColor = '#00CC66';
//    var unSelectedColor = '#000000';
    var unSelectedColor = '#999999';
    
    //~~~~~~~~~~~~~~~~~0,1,2,3,4,5,6,7,8,9,-(PC端),-(移动端),回退(safari),回退(U+00007F)
    var allowKeyArr = ['U+0030','U+0031','U+0032','U+0033','U+0034','U+0035','U+0036','U+0037','U+0038','U+0039','U+00BD','U+002D','U+0008','U+00007F'];
    
    requestMenu.onclick = function(){
        window.location.href = requestMenuUrl;
    }
    
    
    orderSelect.onchange = function(){
        var optionObj = getSelectOption('orderSelect');
        var orderInfo = myOrders[optionObj.value];
        var fob_date = orderInfo.fob_deal_date;
        fob_date = fob_date ? fob_date : '';
        fob_deal_date.value = fob_date;
        
        var cust_nameVal = orderInfo.cust_name;
        cust_nameVal = cust_nameVal ? cust_nameVal : '';
        cust_name.value = cust_nameVal;
        style_no_readText.value = orderInfo.style_no;
        mark_readText.value = orderInfo.mark;
    }
    
    // 设置我的订单按钮单击事件
    setMyOrders.onclick = function(){
        window.location.href = setMyOrdersUrl;
    };
    
    /**
     * 操作日期文本框键盘按下事件
     */
    opr_date.onkeydown = function(event){
//        alert(event.keyIdentifier);
        //  当按钮不是数字或者‘-’时不做响应
        var keyCode = event.keyIdentifier;
//        alert(keyCode + " " + event.keyLocation + " " + event.keyIdentifier) ;
        // 如果不包含则无响应
        if(allowKeyArr.indexOf(keyCode) < 0){
            return false;
        }
    }
    /**
     * 设置工厂按钮，点击事件
     */
    setFacButton.onclick = function(){
        window.location.href = initGrpsUrl;
    };
    
    /**
     * 退出
     */
    quitButton.onclick = function(){
        sendAjaxRequest(loginOutUrl,'',loginOut_callBack)
    }
    
    styleSelect.onchange = function(){
        setOrderSelect();
    }
    
    function loginOut_callBack(){
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                // 退出成功后跳转到登录界面
                window.location.href = initLoginUrl;
             }
         }
    }
    
    
    /**
     * 选择工厂日期，'下一步'按钮点击事件
     */
    firstStepNext.onclick = function(){
        // 验证填充数据的合规性
        if(!valideFirstStep()){
            // 如果不合规则不处理
            return ;
        };
        // 改变流程条的显示：改变下一流程颜色和改变当前流程颜色
        selectPODivEle.style.display = 'block';
        selectFacAndDateDivEle.style.display = 'none';
        
        selectFacAndDateInfo.style.color = unSelectedColor;
        selectPOInfo.style.color = selectColor;
        
        // 查询PO号，信息
        queryMyOrderInfo();
    };
    
    
    /**
     * 查询我的订单信息
     */
    function queryMyOrderInfo(){
        sendAjaxRequest(queryMyOrdersUrl,'',queryMyOrderInfo_callBack);
        // 将款号和标记号清空
        style_no_readText.value = '';
        mark_readText.value = '';
        fob_deal_date.value = '';
        cust_name.value = '';
        article='';
        orderSelect.options.length =0;
    }
    
    /**
     * 查询我的订单信息 回调函数
     */
    function queryMyOrderInfo_callBack(){
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                     text = eval('('+text+')');
                     if(text.success){
                        var orders  = text.myorders;
                        for(var idx=0;idx<orders.length;idx++) {
                            myOrders[orders[idx].seq_no] = orders[idx];
                        }
                        setStyleSelect();
                     }
             }
         }
    
    }
    /**
     * 设置款号信息 
     */
    function setStyleSelect(){
        // 处理所有不同的款号信息
        var styleArr = [];
        for(var orderKey in myOrders){
            var orderInfo = myOrders[orderKey];
            var style_no = orderInfo.style_no;
            if(styleArr.indexOf(style_no)<0){
                styleArr.push(style_no);
            }
        }
        // 设置下拉框
        var itemEle = styleSelect;
        itemEle.options.length = 0;
        // 添加空选项
        itemEle.options.add(new Option('请选择:款号',''));
        for(var idx=0;idx<styleArr.length;idx++){
            var optionValue = styleArr[idx];
            var optionText = styleArr[idx];
            itemEle.options.add(new Option(optionText,optionValue));
        }
    }
    
    /**
     * 选择PO，'上一步’按钮点击事件
     */
    secondStepPrevious.onclick = function(){
        // 保存当前操作的数据
        // 改变流程条的显示
        // 改变界面显示
        selectPODivEle.style.display = 'none';
        selectFacAndDateDivEle.style.display = 'block';
        
        selectFacAndDateInfo.style.color = selectColor;
        selectPOInfo.style.color = unSelectedColor;
    };
    
    /**
     * 选择PO，'下一步'按钮点击事件
     */
    secondStepNext.onclick = function(){
        // 验证数据
        if(!valideOrderDate()){
            return;
        }
        // 改变流程条的显示
        // 改变界面显示
        selectPODivEle.style.display = 'none';
        ordNumDivEle.style.display = 'block';
        
        selectPOInfo.style.color = unSelectedColor;
        ordNumInfo.style.color = selectColor;
        
        // 初始化第三步界面的数据
        initOrdNumView();
        // 查询此订单号的数量性质和累计数
        queryNaturesInfo();
    };
    /**
     * 查询此订单号的数量性质和累计数
     */
    function queryNaturesInfo(){
//        sendAjaxRequest(queryNaturesUrl,'',queryNaturesInfo_callBack);
        queryNatureNum(); 
    }
    /**
     * 查询数量性质回调函数
     */
    function queryNaturesInfo_callBack(){
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                     text = eval('('+text+')');
                     if(text.success){
                        var arr = text.natures;
                        createNaturesEle(arr);
                        // 加载完数量性质，查询数量信息
                        queryNatureNum();
                     }
                     
             }
         }
    }
    /**
     * 查询数量信息
     */
    function queryNatureNum(){
        var optionObj = getSelectOption('orderSelect');
        var orderInfo = myOrders[optionObj.value];
        var params = 'ord_seq_no=' + orderInfo.ord_seq_no +'&prod_ord_seq=' + orderInfo.prod_ord_seq;
        sendAjaxRequest(queryCountNumUrl,params,queryCountNum_callBack);
    }
    /**
     * 查询数量的回调函数
     */
    function queryCountNum_callBack(){
        if (XMLHttpReq.readyState == 4) {
             if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                 text = eval('('+text+')');
                 if(text.success){
                    qcn_callBack_success(text);
                 }
             }
         }
    }
    
    function qcn_callBack_success(text){
        var arr = text.countNums;
        for(var idx=0;idx<arr.length;idx++){
            var beanEle = getElementById(arr[idx].natureEn+'count');
            if(beanEle){
                beanEle.innerText = arr[idx].amount;
                var detailEle=getElementById(arr[idx].natureEn+'_a')
                if(detailEle){
                	detailEle.innerText=arr[idx].a;
                }
                detailEle=getElementById(arr[idx].natureEn+'_b')
                if(detailEle){
                	detailEle.innerText=arr[idx].b;
                }
                detailEle=getElementById(arr[idx].natureEn+'_c')
                if(detailEle){
                	detailEle.innerText=arr[idx].c;
                }
            }
        }
    }
    
    /**
     * 创建数量性质元素
     */
    function createNaturesEle(darr){
        var numTbody = getElementById('numTbody');
        numTbody.innerHTML = '';
        arr = sortArr(darr);
        for(var idx=0;idx<arr.length;idx++){
            var bean = arr[idx];
//            alert(bean.ordNum);
            var trEle = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var textInput = document.createElement('input');
            td1.innerText = bean.natureZh;
            td2.id = bean.natureEn+'count';
            textInput.type = 'text';
            textInput.id = bean.natureEn;
            textInput.name = 'curnum';
            td3.appendChild(textInput);
            trEle.appendChild(td1);
            trEle.appendChild(td2);
            trEle.appendChild(td3);
            numTbody.appendChild(trEle);
        }
    }
    
    /**
     * 对数组进行排序
     */
    function sortArr(arr){
        var varr = arr.sort(function(a1,a2){
            return -(a1.ordNum - a2.ordNum);
        });
        return varr;
    }
    
    /**
     * 设置数量信息界面的数据 
     */
    function initOrdNumView(){
        opr_date_show.innerText = opr_date.value;
        var optionObj = getSelectOption('orderSelect');
        var orderInfo = myOrders[optionObj.value];
        if(orderInfo){
            mark_show.innerText = '丝带:' + orderInfo.mark;
            ins_num_show.innerText = orderInfo.ins_num;
            order_id_show.innerText = orderInfo.ord_seq_no;
            style_no_show.innerText = orderInfo.style_no;
            cust_name_show.innerText = orderInfo.cust_name;
            article_show.innerText=orderInfo.article;
        }
        // 清空数量
        var curNums = document.getElementsByName('curnum');
        for(var idx=0;idx < curNums.length;idx++){
            curNums[idx].value = '';
        }
    }
    
    /**
     * 验证订单号数据
     * 必须选择PO#
     */
    function valideOrderDate(){
        var optionObj = getSelectOption('orderSelect');
        if(!optionObj.value){
            alert('请选择PO#');
            return false;
        }
        return true;
    }
    
    /**
     * 数量输入，'上一步'按钮点击事件
     */
    thirdStepPrevious.onclick = function(){
        // 改变流程条的显示
        // 改变界面显示
        selectPODivEle.style.display = 'block';
        ordNumDivEle.style.display = 'none';
        
        selectPOInfo.style.color = selectColor;
        ordNumInfo.style.color = unSelectedColor;
    };
    
    /**
     * 数量输入,’提交'按钮点击事件
     */
    submitButton.onclick = function(){
        // 验证数据的规范性
        if(!valideFirstStep() || !valideOrderDate()){
            // 只要有一处没有验证通过，就不继续处理
            return;
        }
        // 提取数量信息
        var eles = document.getElementsByName('curnum');
        var resultObj = {};
        var isExists = false;
        for(var idx=0;idx<eles.length;idx++){
            var eleBean = eles[idx];
            var value = eleBean.value;
            if(value){
                // 检查数量合规性
               if((value-parseInt(value))!=0){
                   alert('请填写正确的数字，不能有字母和小数');
                   return false;
               }
               resultObj[eleBean.id] = value; 
               isExists = true;
            }
        }
        if(isExists){
            submitOrdNum(resultObj);
        }
    };
    // 请求标志，当发送请求后设置为true，请求返回时设置为false
    var reqFlag = false;
    /**
     * 提交数量信息
     */
    function submitOrdNum(numObj){
        // 添加 操作日期，PO号，工厂，款号，标记等信息
        var optionGrpObj = getSelectOption('myGrpsSelect');
        var optionOrderObj = getSelectOption('orderSelect');
        var orderInfo = myOrders[optionOrderObj.value];
        numObj.grp_id = optionGrpObj.value;
        numObj.order_id = orderInfo.ord_seq_no;
        numObj.mark = orderInfo.mark;
        numObj.style_no = orderInfo.style_no;
        numObj.tr_date = opr_date.value;
        numObj.remark = ordNumRemark.value;
        numObj.cust_name=cust_name.value;
        numObj.article= article_show.value;
        var params = parseObj2Str(numObj);
        if(!reqFlag){
            reqFlag = true;
            sendAjaxRequest(saveOrdNumUrl,params,submitOrdNum_callBack);
        }
        
        var img=getElementById("up_img");
        if(img.value!=''){
         $.ajaxFileUpload({
            url: './ordNumMobile.mobile?reqCode=saveStyleImgInfo', 
            type: 'post',
            secureuri: false, //一般设置为false
            fileElementId: 'up_img', // 上传文件的id、name属性名
            dataType: 'json', //返回值类型，一般设置为json、application/json
            elementIds: style_no_show.value, //传递参数到服务器
            success: function(data, status){  
                alert(data);
            },
            error: function(data, status, e){ 
                alert(e);
            }
        });
        }
    }
    /**
     * 提交数量回调函数
     */
    function submitOrdNum_callBack(){
        try{
            if (XMLHttpReq.readyState == 4) {
                 if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                     text = eval('('+text+')');
                     
                     if(text.success){
                        alert('操作成功，处理下一条');
                      
                        // 操作成功后初始化界面
                        initView(); 
                     }else {
                        
                     }
                 }
             }
        }catch(e){
            console.log(e);
        }
        reqFlag = false;
    
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
    
    
    /**
     * 第一步的数据监测
     */
    function valideFirstStep(){
        // 验证选择的工厂
        var optionObj = getSelectOption('myGrpsSelect');
        var optionValue = optionObj.value;
        if(!optionValue){
            alert('请选择工厂！如果没有工厂请先设置工厂');
            return false;
        }
        // 验证日期
        var vDate = opr_date.value;
        if(!valideDate(vDate)){
            alert('请填写标准的日期格式');
            return false;
        }
        return true;
    }
    
    /**
     * 初始化界面
     */
    function initView(){
        //添加清空数据操作
        initOrdNumInfo();
        // 设置界面显示
        selectFacAndDateDivEle.style.display = 'block';
        selectPODivEle.style.display = 'none';
        ordNumDivEle.style.display = 'none';
        
        //设置流程线显示
        selectFacAndDateInfo.style.color = selectColor;
        selectPOInfo.style.color = initColor;
        ordNumInfo.style.color = initColor;
        
        // 设置默认的操作日期
        var defaultDate = getDate(-1);
        opr_date.value = defaultDate;
        //清空预览图
        //$("#imgShow").attr("src","img/"+a+".jpg");
        // 请求工厂信息
        initMyGrps();
        
        // 初始化显示的数量信息
        selectNatures();
    };
    // 所有的选项
    var allNature = ['trNature1','trNature2','trNature3','trNature4','trNature5','trNature6'
        ,'trNature7','trNature8','trNature10','trNature12','trNature9','trNature11','trNature14','trNature13','trNature15','trNature16'];
    // 模式一
    var ordNumMode = ['trNature1','trNature2','trNature3','trNature4','trNature5','trNature6'
        ,'trNature7','trNature8','trNature10','trNature12'];
    // 工厂出运B品的模式
    var bProductMode=['trNature14'];
    //B品库收发模式
    var bDepotMode = ['trNature15','trNature16'];
    // 出运成品模式
    var fProductMode = ['trNature13'];
    /**
     * 初始化显示的信息
     */
    function selectNatures(){
        var onfVal = ordNumFlag.value;
        var curMode = [];
        if(onfVal=='ordNum'){   //出运外的其他操作
            curMode = ordNumMode;
        } else if(onfVal=='bProduct') { // 出运b品模式
            curMode = bProductMode;
            addElementDisplay(curMode);
        }else if(onfVal=='bdepot'){ //b品库管理模式
            curMode = bDepotMode;
            addElementDisplay(curMode);
        }else { // 出运成品模式
            curMode = fProductMode;// 出运成品模式
        }
        setElementDisplay(allNature, 'none');
        setElementDisplay(curMode, '');
        if(onfVal=='bdepot'){
        	$("#imgRow").show();
        }else{
        	$("#imgRow").hide();
        }
    }
    /**
     * 设置元素显示/不显示
     */
    function setElementDisplay(arr, dp){
        for(var idx=0;idx<arr.length;idx++) {
            var beanId = arr[idx];
            var ele = getElementById(beanId);
            if(ele.style){
                ele.style.display = dp;
            }
        }
    }
   
    /**
     * 在b品相关的数量性质后添加详细数量的输入框
     */
    function addElementDisplay(arr){
    	//创建之前先移除详细数量框
        $("tr[id*=detail]").remove();
    	var detail_ele_id;
        var detail_num_id;
        var detail_input_id;
        var lable_name;
        var detailarr=[];
        for(var idx=0;idx<arr.length;idx++) {
            var beanId = arr[idx];
            var input_id;
            if(beanId=="trNature14"){
            	input_id="sendout_b_product";
            }else if(beanId=="trNature15"){
            	input_id="receive_b_depot";
            }else if(beanId=="trNature16"){
            	input_id="sendout_b_depot";
            }
            	detail_ele_id=beanId+"_detail_c";
            	detail_num_id=input_id+"_c";
            	detail_input_id=input_id+"_input_c";
            	lable_name="C类数:";
            	detailarr.push(detail_ele_id);
            	var detailTr="<tr id="+detail_ele_id+"><td>"+lable_name+"</td><td id="+detail_num_id+"></td><td><input type='text' id="+detail_input_id+" name='curnum' class='ordnumInp'/></td></tr>"
            	$("#"+beanId).after(detailTr);
            	detail_ele_id=beanId+"_detail_b";
            	detail_num_id=input_id+"_b";
            	detail_input_id=input_id+"_input_b";
            	lable_name="B类数:";
            	detailarr.push(detail_ele_id);
            	var detailTr="<tr id="+detail_ele_id+"><td>"+lable_name+"</td><td id="+detail_num_id+"></td><td><input type='text' id="+detail_input_id+" name='curnum' class='ordnumInp'/></td></tr>"
            	$("#"+beanId).after(detailTr);
            	detail_ele_id=beanId+"_detail_a";
            	detail_num_id=input_id+"_a";
            	detail_input_id=input_id+"_input_a";
            	lable_name="A类数:";
            	detailarr.push(detail_ele_id);
            	var detailTr="<tr id="+detail_ele_id+"><td>"+lable_name+"</td><td id="+detail_num_id+"></td><td><input type='text' id="+detail_input_id+" name='curnum' class='ordnumInp'/></td></tr>"
            	$("#"+beanId).after(detailTr);
        }
        //数据计算事件
	    $("input[id*=input]").change(function(){ 
	    var sum=0; 
	    var natureInId=this.id.substring(0,this.id.indexOf('_input'));
	    $("input[id^="+natureInId+"_]").each(function(){ 
	      var r = /^-?\d+$/ ;//正整数 
	      if($(this).val() !=''&&!r.test($(this).val())){ 
	       $(this).val("");  //正则表达式不匹配置空 
	      }else if($(this).val() !=''){ 
	       sum+=parseInt($(this).val()); 
	      } 
	      var nature=this.id.substring(0,this.id.indexOf('_input'));
	      	document.getElementById(nature).value=sum; 
	      }); 
	    }); 
    
    }
    
    function initOrdNumInfo(){
        // 清空显示数据
        opr_date_show.innerText = '';
        mark_show.innerText = '';
        ins_num_show.innerText = '';
        order_id_show.innerText = '';
        style_no_show.innerText = '';
        // 清空备份信息
        ordNumRemark.value = '';
        // 清空数量性质 
//        var numTbody = getElementById('numTbody');
//        numTbody.innerHTML = '';
        
    }
    
    /**
     * 查询设置我的工厂信息
     */
    function initMyGrps(){
        sendAjaxRequest(queryMyGrpsUrl,'',initMyGrps_callBack);
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
    
    /**
     * 初始化工厂的回调函数
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
                             var optionText = myGrps[idx].addr;
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
     * 设置下拉框的值
     * @param selectId: 设置下拉框的Id
     * @param arr : 添加数据的数组
     * @param value : 作为值的属性
     * @param text : 作为显示的属性
     */
    function setOrderSelect(){
        // 获取款号信息
        var optionObj = getSelectOption('styleSelect');
        var style_no = optionObj.value;
        
        // 清空下拉框 
        var itemEle = orderSelect;
        itemEle.options.length = 0;
        // 添加空选项
        itemEle.options.add(new Option('请选择:PO号/标记/开单数',''));
        for(var orderKey in myOrders){
            var orderInfo = myOrders[orderKey];
            if(orderInfo.style_no == style_no){ //款号相同添加信息
                var mark = orderInfo.mark;
                mark = mark ? mark : '--';
                var ins_num = orderInfo.ins_num;
                ins_num = ins_num ? ins_num : 0;
                var optionValue = orderInfo.seq_no;
                var optionText = orderInfo['ord_seq_no'] + '/' + mark + '/' + ins_num;
                itemEle.options.add(new Option(optionText,optionValue));
            }
        }
        style_no_readText.value = '';
        fob_deal_date.value = '';
        cust_name.value = '';
        mark_readText.value = '';
    }
    initView();
    
}


