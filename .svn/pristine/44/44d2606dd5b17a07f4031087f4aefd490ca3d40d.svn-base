/**
 * @author zhouww
 * @since 2014年9月10日 
 * 功能：详细显示操作人员的姓名，联系电话，操作数量
 */
 
var dayListDetailInfoWindow;
/**
 * 日进度一个流程的相信信息
 * @return {}
 */
function DaylistDetailInfoWindow(){
    if(!Ext.isEmpty(dayListDetailInfoWindow)){
    	return dayListDetailInfoWindow;
    }
    var winHeight = 300;
    var winWidth = 620;
    
    //=========================================================Store数据=====================================//
    var dayListStore = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : './ordSche.ered?reqCode=queryOrdDayList4detailData'
        }),
    	reader : new Ext.data.JsonReader({
    	    totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        },['seq_no','order_id','style_no','nature','amount','submit_name'
            ,'sure_name','submit_mbl','sure_mbl','nature_name'])
    })
    
    //=========================================================Store数据结束=================================//
    
    //=========================================================组件=====================================//
    // 顶部信息
    var headPanel = new Ext.FormPanel({
    	region : 'north',
        title : '',
        html : '<div style="border:0px;height:3px"></div>'
            +'<div align="center"><span id="headTitle">订单数</span></div>'
            +'<div style="border:0px;height:3px"></div>'
    })
    //~列模型
    var columnMode = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),{
                            header : '送货人',
                            dataIndex : 'submit_name',
                            width : 80
                        },{
                        	header : '送货人电话',
                        	dataIndex : 'submit_mbl',
                            width : 120
                        },{
                            header : '收货人',
                            dataIndex : 'sure_name',
                            width : 80
                        },{
                            header : '收货人电话',
                            dataIndex : 'sure_mbl',
                            width : 120
                        },{
                            header : '数量性质',
                            dataIndex : 'nature_name',
                            width : 100
                        },{
                            header : '完成数量',
                            dataIndex : 'amount',
                            width : 100
                        }])
                        
    
    
    
    var centerPanel = new Ext.grid.GridPanel({
    	region : 'center',
        name : 'centerPanel',
        title : '',
        store : dayListStore,
        cm : columnMode
    })
    
    var ordDayListDetailWindow = new Ext.Window({
    	title : '订单流水详细数据',
    	id : 'ordDayListDetailWindow',
    	width : winWidth,
    	height : winHeight,
    	resizable : false,
    	closable : false,
    	closeAction : 'hide',
        layout : 'border',
        buttons : [{
        text : '隐藏',
        handler : function(){
            hideWindow();
        }
       }],
        items : [centerPanel,headPanel]
    })
    //=========================================================组件结束==================================//
 
    //=========================================================window控制器=====================================//
    /**
     * 隐藏窗口
     */
    function hideWindow(){
    	// 清除数据
        dayListStore.removeAll();
        setElementTextById('headTitle','');
        // 隐藏窗口
        ordDayListDetailWindow.hide();
    }
    /**
     * 显示窗口
     */
    function showWindow(showWinParams){
    	hideWindow4timeout();
    	ordDayListDetailWindow.show();
    	parseChartParams(showWinParams);
    } /**
     * 解析显示窗口传入的参数
     * @param {} queryParams
     * @param {} showWinParams
     * @param {} mouseParams
     */
    function parseChartParams(showWinParams){
        var width = showWinParams.width;
        var height = showWinParams.height;
        var moveX = 0;
        var moveY = 0;
        if(width>winWidth){
            moveX = width-winWidth;
        }
        if(height>winHeight){
            moveY = height-winHeight;
        }
        moveWindow(moveX,moveY,'ordDayListDetailWindow');
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
     * 设置id元素的值
     */
    function setElementTextById(id,value){
    	if(Ext.isEmpty(id)){
    		return;
    	}
    	value = value || '';
    	document.getElementById(id).innerText = value;
    }
    /**
     * 需要加载数据的参数
     */
    function requestOrderInfo(params){
    	//处理头信息
    	var order_id = params.order_id;
    	var tr_date = params.tr_date;
    	var titleInfo = "完单号:"+order_id+"   交易日期:"+tr_date
    	setElementTextById("headTitle",titleInfo);
    	//处理中间数据
        dayListStore.load({
            params : params
        })
    }
    
    var timeoutId;
    /**
     * 设置一段时间后隐藏界面
     */
    function hideWindow4timeout(num){
        if(!Ext.isEmpty(timeoutId)){
            clearTimeout(timeoutId);
        }
        num = num || 30000;    //默认消失时间
        timeoutId = setTimeout(hideWindow,num);
    }
    
    
    
    /**
     * 控制器
     */
    function Control(){
        this.showWindow = showWindow;
        this.requestOrderInfo = requestOrderInfo;
        this.hideWindow = hideWindow;
    }
    dayListDetailInfoWindow = new Control();
    return dayListDetailInfoWindow;
    //=========================================================window控制器=====================================//
}