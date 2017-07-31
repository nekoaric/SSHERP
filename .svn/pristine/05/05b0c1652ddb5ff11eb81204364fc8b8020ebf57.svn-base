/**
 * @author zhouww
 * @since 2014年9月9日
 * 作用：订单损耗分析图
 * 功能：
 * 1)显示窗口，传入参数param1：显示查询信息(完单报告号，订单号).param2,窗口的信息（宽，高），param3点击鼠标的位置（x,y）
 * 2)隐藏窗口
*/
var srChartWindow;
function OrdReportSRChartWindow(){
	if(!Ext.isEmpty(srChartWindow)){
		return srChartWindow;
	}
	// 数量对应的名字 
	var fieldNameValueMap = {
	   ly_num : '良余',
	   jp_num : '剪破',
	   sxbl_num : '水洗不良',
	   zjly_num : '中间领用',
	   zzdp_num : '撞针打破',
	   sxpd : '水洗破洞',
	   cpys_num : '成品遗失',
	   wj_num : '污迹',
	   sxsc_num : '水洗色差',
	   hzys_num : '后整遗失',
	   fzpd_num : '缝制破洞',
	   sxys_num : '水洗遗失',
	   fzbl_num : '缝制不良',
	   fzys_num : '缝制遗失',
	   sgyz_num : '色光严重',
	   ml_num : '面料',
	   bc_num : '布疵'
	};
    //================================================参数处理完毕=================================================//
    
    
    //================================================数据查询处理=================================================//
    //创建MODE
    /**
     * 完单报告MODE构造器
     */
    function ReportModeConstruct() {
        /**
         * 如果需要同时保存一个信息的显示信息和保存信息，将信息独立处理保存，
         * 当一个信息和同类的信息需要分开处理（只读权限和可编辑权限），将信息分开处理，
         * 将需要显示的信息独立出来显示信息,
         */
        var ord_report_no = '';   //完单报告号
        var loginid = '';
        
        var reportOrdInfo = []; // 完单报告基本信息中的客户，PO，款号,订单数,指令数
        var reportFacInfo = [];   //完单报告基本信息-->工厂信息
        
        var reportBaseInfo = {};  // 完单报告基本信息 -->显示信息
        var reportNumInfo = {};   // 完单报告数量信息 -->显示信息
        
        var reportRemarkInfo = {};   // 除登录人备注信息
        var reportLogRemarkInfo = {}; //登录人的备注信息
        var reportShowRemarkInfo = {};    //备注信息：所有的备注信息-->显示信息
        
        var reportSurePor = {};   //确认人信息   分类：确认人数组 
        var reportSureporInfo = {}; //显示信息
        var sewSure = false;   // 确认人是否已确认，默认为未确认-->登录人的确认信息
        var washSure = false;
        var packageSure = false;
        var qcSure = false;
        
        //mode数据的改变马上映射到界面，界面数据的改变将在操作后更新到mode
        
        /**
         * 根据序号加载完单报告
         */
        function requestReport(params){
            if(Ext.isEmpty(params)){
                return;
            }
            //请求数据
            Ext.Ajax.request({
              url : './orderReport.ered?reqCode=queryOrderReport4showSrInfo',
              success : loadOrderReport4success,
              failure : loadOrderReport4failure,
              params : params
            })
        }
        /**
         * 加载完单报告的回调函数-成功
         * @param {} response
         */
        function loadOrderReport4success(response){
            var orderReport = Ext.util.JSON.decode(response.responseText);
            if(orderReport.success){  // 成功请求数据下解析数据
                parseLoadData(orderReport); //解析请求数据
                queryOrdersInfo();
            }else {
            	showErrorDataInfo(orderReport.msg,orderReport.msg2);
            }
        }
        /**
         *  窗口显示错误信息
         */
        function showErrorDataInfo(msg,msg2){
        	var chartSeriesData = [];
        	redrawOrdScheChart4Param( chartSeriesData, msg, '原因可能为:<br/>'+msg2)
        }
        /**
         * 查询订单的额外信息
         */
        function queryOrdersInfo(){
        	var dbOrders = []
        	for(var idx in reportOrdInfo){
        		dbOrders.push(reportOrdInfo[idx].order_id)
        	}
            requestOrderInfoList(dbOrders.join(','));
        }
        
        /**
         * 请求订单的额外信息
         * @param {} orders
         * 请求工厂编号，出货数，损耗率%,实裁数
         * 实际数据
         */
        function requestOrderInfoList(orders){
            Ext.Ajax.request({
             url : './orderReport.ered?reqCode=requestOrderInfo',
              success : function(response){
                var responseData = Ext.util.JSON.decode(response.responseText);
                if(responseData.success){    //解析额外信息
                    var facNameArr = [];   // 所有的工厂信息
                    var totalProductNum = 0;   //出运成品数据
                    var totalSewNum = 0;   //实裁数 
                    var orderInfo = responseData.resultList;
                    if(!Ext.isEmpty(orderInfo)){
                        for(var idx=0;idx<orderInfo.length;idx++){
                            var beanInfo = orderInfo[idx];
                            if(facNameArr.indexOf(beanInfo.name)<0)facNameArr.push(beanInfo.name);
                            totalProductNum += Ext.isEmpty(beanInfo.product_num)?0:parseInt(beanInfo.product_num);
                            totalSewNum += Ext.isEmpty(beanInfo.sew_num)?0:parseInt(beanInfo.sew_num);
                        }
                    }
                    //为基础数据添加新数据
                    reportBaseInfo.fac_name_real = facNameArr.join(',');
                    reportBaseInfo.product_num_real = totalProductNum;
                    reportBaseInfo.sr_num_real = totalSewNum=='0'?'0':parseFloat(((totalSewNum-totalProductNum)/totalSewNum*100).toFixed(4));
                    reportBaseInfo.sew_num_real = totalSewNum;
                    
                  parseNewData2pieChartData();    // 新数据解析为饼图显示的数据
                  parseOrderInfo(); // 解析订单信息 
                }
              },
              failure : function(response){},
              params : {order_id : orders}
            })
        }
        
        // 将完单报告号设计的订单信息显示到界面
        function parseOrderInfo(){
             var eleRoot = $('#ordersInfo')[0];
             for(var idx=0;idx<reportOrdInfo.length;idx++) {
                var beanOrder = reportOrdInfo[idx];
                var childDiv = document.createElement('div');
                childDiv.setAttribute('style','background-color:#94c7fa;margin-top:2px;');
                
                childDiv.innerHTML = (idx+1) + ') ' + beanOrder.order_id;
                eleRoot.appendChild(childDiv);
             }
        }
        /**
         * 清空订单号信息
         */
        function clearOrdersInfo(){
            var eles = $('#ordersInfo')
            if(eles.length>0){
                var ele = eles[0];
                ele.innerHTML = '';
            }
        
        }
        /**
         * 新数据解析为饼图显示数据
         */
        function parseNewData2pieChartData(){
        	var pieChartSeriesData = [];
        	//分析数量信息
            for(var key in reportNumInfo){
                //处理所有'_name'结尾的信息
            	var matchResult =key.match('\^(.*)_name\$') 
            	if(matchResult!=null){
            		fieldNameValueMap[matchResult[1]] = reportNumInfo[key];
            		delete reportNumInfo[key];    //删除标示名字的数据
            	}
            }
            // 处理显示的数据
            var totalNum = 0;
            var idx = 0;
            for(var key in reportNumInfo){
                if(Ext.isEmpty(key) || Ext.isEmpty(reportNumInfo[key])){
                	continue;
                }
                totalNum += parseInt(reportNumInfo[key]);
            	pieChartSeriesData[idx++] = {
            	   num : reportNumInfo[key],
            	   name : fieldNameValueMap[key]
            	}
            }
            // 处理显示的百分比
            for(var arrIdx in pieChartSeriesData){
                pieChartSeriesData[arrIdx].y = parseFloat((parseInt(pieChartSeriesData[arrIdx].num) / totalNum * 100)
                        .toFixed(2))
            }
            var chartSeriesData = [];
            chartSeriesData.push({
                data : pieChartSeriesData,
                name : '损耗'
            })
            // 处理主标题      完单号+款号
            var title = "款号:"+parseEmptyData(reportBaseInfo.style_no,'')
            +"   完单登记号:"+parseEmptyData(ord_report_no,'')
            // 处理子标题   指令数，出货数，损耗
            var subTitle = "实裁数:"+ parseEmptyData(reportBaseInfo.sew_num_real,'0')
//                +"  出货数:"+ parseEmptyData(reportBaseInfo.product_num,'0')
                +"  损耗数:"+ parseEmptyData(totalNum,'0')
                +"  损耗:"+ parseEmptyData(reportBaseInfo.sr_num,'0')+"%"
                +"<br/>"
                +"  实际出货数:"+ parseEmptyData(reportBaseInfo.product_num_real,'0')
                +"  实际损耗:"+ parseEmptyData(reportBaseInfo.sr_num_real+"%",'0')
                
            redrawOrdScheChart4Param( chartSeriesData, title, subTitle)
        }
        /**
         * 过滤空数据
         * @param {} data
         * @param {} defData
         */
        function parseEmptyData(data,defData){
        	if(Ext.isEmpty(data)){
        		return defData || '';
        	}
        	return data;
        }
        /**
         * 加载完单报告的回调函数-失败
         * @param {} response
         */
        function loadOrderReport4failure(response){
//            Ext.Msg.alert('提示','后台加载数据失败');
        }
        /**
         * 解析加载的数据
         */
        function parseLoadData(orderReport){
                //获取后台传输的数据
                var baseinfo = orderReport.baseinfo;
                var numinfo = orderReport.numinfo;
                var orderinfo = orderReport.orderinfo;
                var remark = orderReport.remark;
                var sureinfo = orderReport.sureinfo;
                var ord_report_no2 = orderReport.ord_report_no;
                loginid = orderReport.account;
                ord_report_no = ord_report_no2;
                // 将数据解析，处理
                //~基础信息
                reportBaseInfo = baseinfo;
                //~数量信息
                reportNumInfo = numinfo; 
                //~PO号信息
                if(!Ext.isEmpty(orderinfo)){
                    var orderinfolength = orderinfo.length;
                    for(var idx=0;idx<orderinfolength;idx++){
                        var orderinfobean = orderinfo[idx];
                        var addOrderBean ={
                           order_id : orderinfobean.order_id,
                           style_no : orderinfobean.style_no,
                           cust_name : orderinfobean.cust_name,
                           ins_num : orderinfobean.ins_num,
                           ord_num : orderinfobean.ord_num
                        }
                        reportOrdInfo.push(addOrderBean);
                    }
                }
                //备注信息
                for(var key in remark){  //遍历所有备注的类型
                    var value = remark[key];
                    var valueLength = value.length;
                    for(var idx=0;idx<valueLength;idx++){   //遍历一个类型的所有备注
                        var remarkbean = value[idx];
                        if(remarkbean.opr_id == loginid){  // 区分备注是否是登录人
                            //如果登录人没有此备注，则新增，如果已经有备注，则添加备注信息
                            var remarkValue = reportLogRemarkInfo[key];
                            reportLogRemarkInfo[key] = Ext.isEmpty(remarkValue)?remarkbean[key]:remarkValue+","+remarkbean[key]
                        }else {
                            //如果非登录人没有此备注，则新增，如果已经有备注，则添加备注信息
                            var remarkValue = reportRemarkInfo[key];
                            reportRemarkInfo[key] = Ext.isEmpty(remarkValue)?remarkbean[key]:remarkValue+","+remarkbean[key]
                        }
                    }
                }
                //~ 将处理后的备注加工为显示的备注信息
                for(var key in reportRemarkInfo){
                    reportShowRemarkInfo[key+'_read'] = reportRemarkInfo[key];
                }
                for(var key in reportLogRemarkInfo){
                    reportShowRemarkInfo[key+'_write'] = reportLogRemarkInfo[key];
                }
                
                //确认人
                var logSureOpr = [];
                for(var key in sureinfo){
                    var sureArray = sureinfo[key];
                    var sureArraySize = sureArray.length;
                    var showSureinfo = '';
                    for(var idx=0;idx<sureArraySize;idx++){
                        var surebean = sureArray[idx];
                        surebean.id = surebean.opr_id;
                        surebean.name = surebean.opr_name;
                        showSureinfo += ','+surebean.opr_name;
                        if(surebean.opr_id==loginid){
                            logSureOpr.push(key);
                        }
                    }
                    reportSureporInfo[key] = showSureinfo;
                }
                reportSurePor = sureinfo;
                sewSure = logSureOpr.indexOf('sewSure')>=0? true : false;
                washSure = logSureOpr.indexOf('washSure')>=0? true : false;
                packageSure = logSureOpr.indexOf('packageSure')>=0? true : false;
                qcSure = logSureOpr.indexOf('qcSure')>=0? true : false;
        }
        
        
        /**
         * 将现有MODE初始化
         */
        function initReportFormData(){ // 初始化MODE的数据 界面数据清空的操作有界面的监听器处理
            ord_report_no = ''; 
            reportOrdInfo = []; // 完单报告基本信息中的客户，PO，款号等信息 ，record包含name和id,后台只保存PO号
            reportFacInfo = [];   //完单报告基本信息-->工厂信息
            
            reportBaseInfo = {};  // 完单报告基本信息 -->显示信息
            reportNumInfo = {};   // 完单报告数量信息 -->显示信息
            
            reportRemarkInfo = {};   // 除登录人备注信息
            reportLogRemarkInfo = {}; //登录人的备注信息
            reportShowRemarkInfo = {};    //备注信息：所有的备注信息-->显示信息
            
            reportSurePor = {};   //确认人信息   分类：确认人数组 
            reportSureporInfo = {}; //显示信息
            sewSure = false;   // 确认人是否已确认，默认为未确认-->登录人的确认信息
            washSure = false;
            packageSure = false;
            qcSure = false;
            
            // 清空定时任务
            clearTrigger();
            // 清空订单信息
            clearOrdersInfo();
        }
        
        
        //~~去掉所有的对外提供的方法   采用观察者模式 ,并且主动传递数据

        /**
         * mode构造函数
         */
        function Construct(){
            this.requestReport = requestReport;
            this.initReportFormData = initReportFormData;
        }
        return new Construct();
    }
    //~MODE　   END
    
    //~~~~~~~~~~~~~~~~~~~~处理数据加载完的数据~~~~~~~~~~~~~~~~~~~~~~~~~~//
    function parseLoadStore(store,records){
    	
    }
    //================================================数据查询处理结束=============================================//
    
    //================================================窗口组件定义================================================//
    // 饼图区域
    var ordSchePanel = new Ext.Panel({
        	region : 'center',
        	title : '',
            html : '<div id="ordReportChart_pie" style="width:100%;height:100%" ></div>'
        });
    
    // 完单报告的订单信息
    var orderInfoPanel = new Ext.Panel({
        region : 'east',
        title : '',
        width: '25%',
        html : '<div align="center" style="background-color:#fadb94">登记订单号</div>' +
                '<div id="ordersInfo" style="width:100%;height:100%"></div>'
    })
    
    
    var charWindow = new Ext.Window({
       name : 'charWindow',
       id : 'charWindow_id',
       title : '完单报告损耗分析',
       layout : 'border',
       width : 500,
       height : 400,
       resizable : false,
       closable : false,
       closeAction : 'hide',
       buttons : [{
        text : '隐藏',
        handler : function(){
            hideChartWindow();
        }
       }],
       items : [orderInfoPanel,ordSchePanel]
    })
    /**
     * 颜色的定义
     */
    var colors = ['#AA4643', '#BBBBBB', '#4572A7', '#CCCCCC', '#DDDDDD',
            '#AAAAAA', '#89A54E', '#EEEEEE', '#111111', '#80699B', '#225522',
            '#333333', '#3D96AE', '#446644', '#555555', '#DB843D', '#667766',
            '#777777', '#92A8CD', '#889988', '#999999', '#A47D7C', '#112233',
            '#112244', '#B5CA92', '#112255', '#324355'];
     /**
      * 饼图对象
      * @type 
      */
      var ordReportChart = {
        chart : {
            type : 'pie'
        },
        colors : colors,
        title : {
            text : '完单报告损耗分析图'
        },
        subtitle : {
            text : '完单号'
        },
        yAxis : {
            allowDecimals : false,
            min : 0,
            title : {
                text : '百分比(%)'
            },
            stackLabels : {
                enabled : true,
                style : {
                    fontWeight : 'bold'
                },
                formatter : function() {
                    return this.total + "%"
                }
            }

        },
        tooltip : {
            pointFormat : '{series.name}'
                    + ':<b>{point.num}</b><br/>'
                    + '损耗百分比:<b>{point.y:.2f}%</b>'
        },
        plotOptions : {
            pie : {
                allowPointSelect : true,
                cursor : 'pointer',
                dataLabels : {
                    enabled : true,
                    color : '#000000',
                    connectorColor : '#000000',
                    format : '<b>{point.name}</b>: {point.y:.1f} %'
                }
            }

        },
        series : [],
        credits : {
            enabled : false
        },
        exporting : {
            enabled : false
        }
    }
    
    var ordScheChart;
    /**
     * 从新绘制 
     */
    function redrawOrdScheChart4Param(series, title, subTitle) {
    	if(!Ext.isEmpty(ordScheChart)){
	       ordScheChart.destroy();
    	}
        ordScheChart = $('#ordReportChart_pie').highcharts(ordReportChart)
                .highcharts();
        ordScheSeriesLength = series.length;
        for (var i = 0; i < ordScheSeriesLength; i++) {
            ordScheChart.addSeries(series[parseInt(i)], false);
        }
        ordScheChart.setTitle({
            text : title
        }, {
            text : subTitle
        });
        ordScheChart.redraw();
    }
    //================================================窗口组件定义结束============================================//
    
    //================================================窗口提供的方法==============================================//
    var dataCont = new ReportModeConstruct();   // 实例化模型
    /**
     * 显示损耗窗口
     * @param {} queryParams    显示数据的订单号或者完单报告
     * @param {} showWinParams  显示窗口的数据
     * @param {} mouseParams    鼠标点击的信息，传输x,y轴信息
     */
    function showChartWindow(showWinParams,mouseParams){
    	hideWindow4timeout();
    	charWindow.show();
    	parseChartParams(showWinParams,mouseParams);
    }
    /**
     * 解析显示窗口传入的参数
     * @param {} queryParams
     * @param {} showWinParams
     * @param {} mouseParams
     */
    function parseChartParams(showWinParams,mouseParams){
    	var width = showWinParams.width;
    	var height = showWinParams.height;
    	var moveX = 0;
    	var moveY = 0;
    	if(width>500){
    		moveX = width-500;
    	}
    	if(height>400){
    		moveY = height-400;
    	}
    	moveWindow(moveX,moveY,'charWindow_id');
    }
    function moveWindow(x,y,id){
    	var ele1 = Ext.getCmp(id).getEl().dom;
    	var ele2 = Ext.getCmp(id).getEl().dom.previousSibling;
    	var style1 = ele1.style;
    	var style2 = ele2.style;
    	style1.setProperty('left',x);
    	style1.setProperty('top',y);
    	style2.setProperty('left',x);
    	style2.setProperty('top',y);
    }
    /**
     * 修改或增加样式
     * @param {} oldStyle
     * @param {} key
     * @param {} value
     */
    function replaceStyle(oldStyle,key,value){
    	if(Ext.isEmpty(oldStyle)){
    		return key+":"+value;
    	}
    	var styleArr = oldStyle.split(';');
    	var isExist = false;
        for(var idx in styleArr){
        	var styleBean = styleArr[idx];
        	if(Ext.isEmpty(styleBean)){
        		continue;
        	}
        	var beanArr = styleBean.split(':');
        	if(beanArr[0]==key){
        		styleArr[idx] = key+":"+value;
        		isExist = true;
        		break;
        	}
        }
        if(!isExist){
        	styleArr.push(key+":"+value);
        }
        return styleArr.join(';');
    }
    
    /**
     * 隐藏窗口
     */
    function hideChartWindow(){
    	//初始化数据
    	if(!Ext.isEmpty(ordScheChart)){
    		ordScheChart.destroy();
    		ordScheChart = null;  //设置为空
    	}
    	dataCont.initReportFormData();
    	charWindow.hide();
    }
    /**
     * 请求数据
     * @param {} params
     */
    function requestReport(params){
        dataCont.initReportFormData();   // 初始化界面数据
    	hideWindow4timeout();
    	dataCont.requestReport(params);
    }
    
    var timeoutId;
    /**
     * 设置一段时间后隐藏界面
     */
    function hideWindow4timeout(num){
        clearTrigger();
    	num = num || 30000;    //默认30S
    	timeoutId = setTimeout(hideChartWindow,num);
    }
    /**
     * 取消定时器
     */
    function clearTrigger(){
        if(!Ext.isEmpty(timeoutId)){
            clearTimeout(timeoutId);
        }
    }
    
    
    
    /**
     * 损耗完单报告信息
     */
    function ChartWindowControl(){
    	this.showChartWindow = showChartWindow;
    	this.hideChartWindow = hideChartWindow;
    	this.requestReport = requestReport;
    }
    //================================================窗口提供方法结束============================================//
    
    // 给srChartWindow赋予组件操作方法
    srChartWindow = new ChartWindowControl();
    return srChartWindow;
}