/**
 * 饼图显示时间
 * @since 2014年9月28日
 * @author zhouww 
 * 注：此组件图表的按钮组件是硬编码到代码中，后续可考虑动态生成图表按钮
 */

 var pieChartWindow;
 // 饼图
 function PieChartWindow(){
 	if(!Ext.isEmpty(pieChartWindow)){
 		return pieChartWindow;
 	}
 	
 	//=========================数据
 	var windowHeight = 500;   //最高
 	var windowWidth = 500;    //最宽
 	/**
 	 * 绘图变量
 	 * @type 
 	 */
 	var pieChart;
 	/**
 	 * 绘图数据
 	 * @type 
 	 */
 	var series;
 	/**
 	 * 标题
 	 * @type String
 	 */
 	var title = '';
 	
 	/**
 	 * 子标题
 	 * @type String
 	 */
 	var subTitle = '';
 	/**
 	 * 初始化按钮显示的信息
 	 * @type 
 	 */
 	var initButtonText = {
 		button1_pieChart : '图标1',
 		button2_pieChart : '图标2',
 		button3_pieChart : '图标3',
 		button4_pieChart : '图标4',
 		button5_pieChart : '图标5'
 	}
 	/**
 	 * 注册的图表按钮组件
 	 * @type 
 	 */
 	var regiestButtons = ['button1_pieChart','button2_pieChart','button3_pieChart'
 	                  ,'button4_pieChart','button5_pieChart']
    /**
     * 显示的图标数据
     * @type 
     */ 	                  
 	var pieChartDatas = {}    // 操作结束需要初始化
 	//=========================数据结束
 	
 	
 	//=========================组件
 	/**
 	 * 绘图组件容器
 	 */
 	var piePanel = new Ext.Panel({
            region : 'center',
            title : '',
            autoScroll : true,
            html : '<div id="ordReportChart_pie" width="100%" height="100%"></div>'
    });
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
            title : {
                text : ''
            },
            stackLabels : {
                enabled : true,
                style : {
                    fontWeight : 'bold'
                },
                formatter : function() {
                    return this.total
                }
            }

        },
        tooltip : {
            pointFormat : '百分比:<b>{point.y:.1f}%</b>'
                    + '<br/>数量:<b>{point.num}</b>'
        },
        plotOptions : {
            pie : {
                allowPointSelect : true,
                cursor : 'pointer',
                dataLabels : {
                    enabled : true,
                    color : '#000000',
                    connectorColor : '#000000',
                    format : '<b>{point.name}</b>: {point.y:.1f}%(<span style="color:red">{point.num}</span>)'
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
    
    /**
     * 饼图组件信息
     */
    var chartWindow = new Ext.Window({
    	title : '饼图',
        layout : 'border',
        width : windowWidth,
        height : windowHeight,
        closeAction :'hide',
        closable : false,
        items : [piePanel],
        buttons : [{
            text : '图表1',
            iconCls : 'theme2Icon',
            id : 'button1_pieChart',
            hidden : true
        },{
            text : '图表2',
            iconCls : 'theme2Icon',
            id : 'button2_pieChart',
            hidden : true
        },{
            text : '图表3',
            iconCls : 'theme2Icon',
            id : 'button3_pieChart',
            hidden : true
        },{
            text : '图表4',
            iconCls : 'theme2Icon',
            id : 'button4_pieChart',
            hidden : true
        },{
            text : '图表5',
            iconCls : 'theme2Icon',
            id : 'button5_pieChart',
            hidden : true
        },{
            text : '隐藏',
            iconCls : 'deleteIcon',
            id : 'hideButtonPieChart'
        }]
    })
 	//=========================组件结束
 	
 	//=========================组件事件
    /**
     * 隐藏按钮点击事件
     */
    Ext.getCmp('hideButtonPieChart').addListener('click',function(){
        hideWindow();
    })
    /**
     * 以下一组事件为图表按钮点击
     */
    Ext.getCmp('button1_pieChart').addListener('click',function(){
        darwPieChart(pieChartDatas['button1_pieChart']);
    })
    Ext.getCmp('button2_pieChart').addListener('click',function(){
        darwPieChart(pieChartDatas['button2_pieChart']);
    })
    Ext.getCmp('button3_pieChart').addListener('click',function(){
        darwPieChart(pieChartDatas['button3_pieChart']);
    })
    Ext.getCmp('button4_pieChart').addListener('click',function(){
        darwPieChart(pieChartDatas['button4_pieChart']);
    })
    Ext.getCmp('button5_pieChart').addListener('click',function(){
        darwPieChart(pieChartDatas['button5_pieChart']);
    })
    
    chartWindow.addListener('hide',function(){
    	clearData4Init();  //隐藏清空数据
    })
 	//=========================事件结束
 	
 	//=========================组件函数
    /**
     * 隐藏组件
     */
    function hideWindow(){
        chartWindow.hide();
    }
    /**
     * 清空数据
     */
    function clearData4Init(){
        pieChartDatas = {}; //图表数据
        // 隐藏所有按钮并将按钮名字初始化
        var buttonLength = regiestButtons.length;
        for(var idx=0;idx<buttonLength;idx++) {
        	var buttonId = regiestButtons[idx];
        	var buttonBean = Ext.getCmp(buttonId);
        	
        	if(! Ext.isEmpty(buttonBean)){
        		buttonBean.setText(initButtonText[buttonId]);
        		buttonBean.hide();
        	}
        }
    }
     /**
     * 重新绘制 
     */
    function redrawPieChart4Param() {
        if(!Ext.isEmpty(pieChart)){
           pieChart.destroy();
        }
        pieChart = $('#ordReportChart_pie').highcharts(ordReportChart)
                .highcharts();
        pieSeriesLength = series.length;
        for (var i = 0; i < pieSeriesLength; i++) {
            pieChart.addSeries(series[i], false);
        }
        pieChart.setTitle({
            text : title
        }, {
            text : subTitle
        });
        pieChart.redraw();
    }
    
    /**
     * 设置新的参数
     */
    function setNewParam(params){
        title = params.title;
        subTitle = params.subTitle;
        series = params.series;
        redrawPieChart4Param();
    }
 	//=========================组件函数结束
 	
 	//=========================控制器
    
    /**
     * 显示饼图界面
     * @param height：界面高， width：界面宽
     */
    function showWindow(params){
        chartWindow.show();
        params = params || {};
        var height = params.height || windowHeight;
        var width = params.width || windowWidth;
        if(height>windowHeight){
        	height = windowHeight;
        }
        if(width>windowWidth){
        	width = windowWidth;
        }
        chartWindow.setHeight(height);
        chartWindow.setWidth(width)
    }
    /**
     * 绘图
     * @param {} params 绘图所需的数据
     */
    function darwPieChart(params){
    	setNewParam(params);
    }
    /**
     * 处理多个图表
     * @param params 显示图表的参数数据
     */
    function showPieChartArr(params){
    	// 过滤不合规范参数的请求
        if(Ext.isEmpty(params) || Ext.isEmpty(params.length) || params.length<=0){
        	return;
        }
        var paramsLength = params.length;
        if(paramsLength>5){ // 如果数量大于5个 则不处理，由调用者来控制数量
        	return ;
        }
        if(paramsLength==1){    //数量如果为0 则直接调用单个画图方式
        	darwPieChart(params[0]);
        	return ;
        }
        for(var idx=0;idx<paramsLength;idx++){
        	// 注册数据
        	var buttonId = regiestButtons[idx];
        	var paramBean = params[idx];
        	pieChartDatas[buttonId] = paramBean; 
        	// 修改按钮信息
        	var paramBeanName = paramBean['name'] 
        	//如果图表没有指定名字则采用默认名字
        	var buttonText = paramBeanName ? paramBeanName : initButtonText[buttonId];
        	// 设置名字
        	// 显示按钮
        	var buttonCmp = Ext.getCmp(buttonId);
        	buttonCmp.setText(buttonText);
        	buttonCmp.show();
        }
        
        // 默认显示第一个图表
        var firstParams = pieChartDatas[regiestButtons[0]]; 
        darwPieChart(firstParams);
    }
    
    /**
     * 饼图界面控制器
     */
 	function PieChartWindowControl(){
 	      this.showWindow = showWindow;
 	      this.darwPieChart = darwPieChart;
 	      this.showPieChartArr = showPieChartArr;
 	}
 	pieChartWindow = new PieChartWindowControl();
 	return pieChartWindow;
 	//=========================控制器结束
 	
 }