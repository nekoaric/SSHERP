/************************************************
 * 创建日期: 2015-2-3
 * 创建作者：xutj
 * 功能：qc报表
 * 导入
 * 增删改查
 * 最后修改时间：
 * 修改记录：
 *************************************************/
 Ext.onReady(function () {
	var pieparams=[];
	var infoHtml='';
    //订单查询第二栏
    var  ordstateCombo = new Ext.form.ComboBox({
                id:'orderState',
                hiddenName:'orderStateName',
                name:'orderStateName',
                width:85,
                mode:'local',
                store:new Ext.data.ArrayStore({
                    fields:['value','text'],
                    data:[['','全部'],['0','未排产'],
                            ['1','在产中'],['2','已交货']]
                    }),
                displayField:'text',
                valueField:'value',
                triggerAction:'all',
                value:'',
                editable:false
            });
    ordstateCombo.on('select',function(combo,record,idx){
        loadStore4ordStore();
    });
    var tbar4Query2 = new Ext.Toolbar({
        items:['-','订单状态:',ordstateCombo,
        		'-',
        		{   xtype : 'checkbox',
                    boxLabel : '我的订单',
                    name : 'myorder',
                    inputValue : '1',
                    checked : true,
                    id : 'myorder',
                    listeners:{
                        check:function(checkbox,checked){
                            loadStore4ordStore();
                        }
                    }
                }]
    })
    
    
    var formPanel = new Ext.form.FormPanel({
                collapsible : false,
                border : false,
                region : 'north',
                labelWidth : 70, // 标签宽度
                frame : false, // 是否渲染表单面板背景色
                labelAlign : 'right', // 标签对齐方式
                bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
                buttonAlign : 'center',
                name : 'codeForm',
                height : 80,
                tbar : [{
                    xtype : 'datefield',
                    id : 'startdate',
                    name : 'startdate',
                    format : 'Y-m-d',
                    emptyText : '起始日期',
                    editable : true,
                    width : 120,
                    listeners:{
                        select:function(){
                            loadStore4ordStore();
                        }
                    }
                }, '-', {
                    xtype : 'datefield',
                    id : 'enddate',
                    name : 'enddate',
                    format : 'Y-m-d',
                    emptyText : '结束日期',
                    editable : true,
                    width : 120,
                    listeners:{
                        select:function(){
                            loadStore4ordStore();
                        }
                    }
                }, '-', {
                	xtype : 'combo',
                	id:'dateTypeCombo',
               	 	hiddenName:'orderStateName',
                	name:'orderStateName',
                	width:85,
                	mode:'local',
                	store:new Ext.data.ArrayStore({
                    fields:['value','text'],
                    data:[
                    	  ['0','日期类型'],
                          ['1','FOB交期'],
                          ['2','开裁日期'],
                          ['3','生产日期']
                          ]
                    }),
                	displayField:'text',
                	valueField:'value',
                	triggerAction:'all',
                	value:'0',
                	editable:false,
                	listeners:{
                        select:function(){
                            loadStore4ordStore();
                        }
                    }
                }],
                items : [{
                    layout : 'column',
                    border : false,
                    items : [{
                        columnWidth : 1,
                        layout : 'form',
                        border : false,
                        items : [{
                            xtype : 'radiogroup',
                            id : 'leavRadio',
                            name : 'leavRadio',
                            columns : [.18, .18, .27],
                            hideLabel : true,
                            listeners : {
                                'change' : function(radiogroup) {
                                    var value = formPanel.getForm().getValues()["leavRadio"];
                                    if (value == 0) {
                                        detaiQueryPanel.getLayout()
                                                .setActiveItem(0);
                                        detaiQueryPanel.setTitle('工厂信息');
                                    } else if (value == 1) {
                                        detaiQueryPanel.getLayout()
                                                .setActiveItem(1);
                                        detaiQueryPanel.setTitle('客户信息');
                                    } else if (value == 2) {
                                        detaiQueryPanel.getLayout()
                                                .setActiveItem(2);
                                        detaiQueryPanel
                                                .setTitle('订单基本信息(支持模糊·)');
                                    }
                                }
                            },
                            items : [{
                                inputValue : '0',
                                boxLabel : '按工厂',
                                name : 'leavRadio',
                                disabledClass : 'x-item'
                            }, {
                                inputValue : '1',
                                name : 'leavRadio',
                                boxLabel : '按客户',
                                checked : true,
                                disabledClass : 'x-item'
                            }, {
                                inputValue : '2',
                                name : 'leavRadio',
                                boxLabel : '按订单号,款号',
                                disabledClass : 'x-item'
                            }]
                        }]
                    }]
                }],
                listeners:{
                    render:function(component){
                        tbar4Query2.render(this.tbar);
                    }
                }
            });

    var click_grp_id;

    var grp_root = new Ext.tree.AsyncTreeNode({
        text : '分厂',
        expanded : true,
        id : '001'
    });

    var grp_tree = new Ext.tree.TreePanel({
        animate : false,
        root : grp_root,
        loader : new Ext.tree.TreeLoader({
            dataUrl : './sysGrps.ered?reqCode=belongGrpsTreeInit'
        }),
        width : 400,
        autoScroll : true,
        useArrows : false,
        border : false,
        rootVisible : false
    });

    grp_tree.on('click', function(node) {
        click_grp_id = node.attributes.id;// 点击的分厂编号
        loadStore4ordStore({belong_grp:click_grp_id});
    });

    var click_cust_id;

    var cust_root = new Ext.tree.AsyncTreeNode({
        text : '客户',
        expanded : true,
        id : '001'
    });

    var cust_tree = new Ext.tree.TreePanel({
        animate : false,
        width : 400,
        root : cust_root,
        loader : new Ext.tree.TreeLoader({
            dataUrl : './custBas.ered?reqCode=getCustBasInfoTreeAction'
        }),
        autoScroll : true,
        useArrows : false,
        border : false,
        rootVisible : false
    });
    var queryCustPanelType = '';
    cust_tree.on('click', function(node) {
        var id = node.attributes.id;// 点击的客户编号
        queryCustPanelType = id.substring(0, 4);
        click_cust_id = id.substring(4);

        if (queryCustPanelType == 'area') {
            loadStore4ordStore({country:click_cust_id});
        } else {
            loadStore4ordStore({cust_id : click_cust_id});
        }

    });

    var ord_query_panel = new Ext.form.FormPanel({
        collapsible : false,
        border : false,
        region : 'center',
        labelWidth : 70, // 标签宽度
        frame : false, // 是否渲染表单面板背景色
        labelAlign : 'right', // 标签对齐方式
        bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign : 'right',
        items : [{
            xtype : 'textfield',
            fieldLabel : '订单号',
            name : 'order_id',
            id : 'order_id',
            anchor : '100%',
            listeners : {
                specialkey : function(field, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        loadStore4ordStore();
                    }
                }
            }
        }, {
            xtype : 'textfield',
            fieldLabel : '款号',
            name : 'style_no',
            id : 'style_no',
            anchor : '100%',
            listeners : {
                specialkey : function(field, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        loadStore4ordStore();
                    }
                }
            }
        }],
        buttons : [{
            text : '查询',
            iconCls : 'page_findIcon',
            handler : function() {
                loadStore4ordStore();
            }
        }, {
            text : '重置',
            iconCls : 'tbar_synchronizeIcon',
            handler : function() {
                Ext.getCmp('order_id').setValue('');
                Ext.getCmp('startdate').setValue('');
                Ext.getCmp('enddate').setValue('');
                Ext.getCmp('style_no').setValue('');
            }
        }]
    });

    // 卡片布局的显示信息
    var detaiQueryPanel = new Ext.Panel({
        title : "客户信息",
        layout : 'card',
        activeItem : 1,
        region : 'center',
        labelAlign : "right",
        labelWidth : 70,
        frame : false,
        margins : '3 3 3 3',
        items : [grp_tree, cust_tree, ord_query_panel]
    });

    var queryPanel = new Ext.Panel({
        title : "查询选择窗口",
        region : 'west',
        layout : 'border',
        border : true,
        labelAlign : "right",
        collapsible : true,
        labelWidth : 70,
        width : 400,
        minSize : 160,
        maxSize : 580,
        split : true,
        frame : false,
        items : [formPanel, detaiQueryPanel]
    });

    var ordSm = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });

    var ordCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), ordSm, {
        header : '订单号',
        dataIndex : 'order_id',
        width : 80
    }, {
        header : '交货日期',
        dataIndex : 'deli_date',
        width : 90
    }, {
        header : '款号',
        dataIndex : 'style_no'
    }, {
        header : '丝带色号',
        dataIndex : 'ribbon_color'
    }, {
       header:'订单数',
       dataIndex:'ins_num'
    },{
        header : '客户',
        dataIndex : 'cust_name',
        width : 80
    }, {
        header : '品名',
        dataIndex : 'article',
        width : 80
    }, {
        header : '开始生产日期',
        dataIndex : 'start_date',
        width : 80
    }, {
        header : '订单标志',
        dataIndex : 'flag',
        width : 80
    }, {
        hidden : true,
        dataIndex : 'seq_no',
        width : 180
    }]);

    var ordStore = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : './ordBas.ered?reqCode=queryOrdBasInfo'
        }),
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT',
            root : 'ROOT'
        }, ['seq_no', 'order_id', 'article', 'deli_date', 'order_date',
                'cust_name', 'start_date', 'style_no', 'ribbon_color','ins_num'])
    });

    ordStore.on('beforeload', function() {
        var ismyorder = Ext.getCmp('myorder').checked;
        var prodstatus = ordstateCombo.getValue();
        this.baseParams = {
            startdate : Ext.getCmp('startdate').getValue(),
            enddate : Ext.getCmp('enddate').getValue(),
            ismyorder : ismyorder ? "yes" : "no", // 1表示我的订单
            prodstatus : prodstatus
        };
        var radioValue;
        if(Ext.getCmp('leavRadio').getValue()!=null){
        radioValue = Ext.getCmp('leavRadio').getValue().inputValue;
        }else
        radioValue = 2;
        if (radioValue == 0) {
            this.baseParams.belong_grp = click_grp_id;
        } else if (radioValue == 1) {
            if (queryCustPanelType == 'area') {
                this.baseParams.country = click_cust_id;
            } else {
                this.baseParams.cust_id = click_cust_id;
            }
        } else if (radioValue == 2) {
            this.baseParams.order_name = getValueNoNullById('order_id');
            this.baseParams.style_no = getValueNoNullById('style_no');
        }
    });
    

    var ordPagesize_combo = new Ext.form.ComboBox({
        name : 'pagesize',
        hiddenName : 'pagesize',
        typeAhead : true,
        triggerAction : 'all',
        lazyRender : true,
        mode : 'local',
        store : new Ext.data.ArrayStore({
                    fields : ['value', 'text'],
                    data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'],
                            [100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
                }),
        valueField : 'value',
        displayField : 'text',
        value : '50',
        editable : false,
        width : 85
    });

    var ordNumber = parseInt(ordPagesize_combo.getValue());
    ordPagesize_combo.on("select", function(comboBox) {
        ordBbar.pageSize = parseInt(comboBox.getValue());
        ordNumber = parseInt(comboBox.getValue());
        loadStore4ordStore();
    });

    var ordBbar = new Ext.PagingToolbar({
        pageSize : ordNumber,
        store : ordStore,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', ordPagesize_combo]
    });

    var ordGrid = new Ext.grid.GridPanel({
        autoScroll : true,
        region : 'center',
        store : ordStore,
        border : true,
        title : '订单信息',
        loadMask : {
            msg : '正在加载表格数据,请稍等...'
        },
        stripeRows : true,
        cm : ordCm,
        sm : ordSm,
        bbar : ordBbar
    });
    ordGrid.on('rowdblclick', function() {
        queryWindowConfirm();
    });

    var codePanel = new Ext.Panel({
        layout : 'border',
        border : false,
        height : 500,
        width : 400,
        minSize : 160,
        maxSize : 580,
        split : true,
        frame : false,
        items : [queryPanel, ordGrid]
    });
    var check_column_value = '';
    var codeWindow = new Ext.Window({
        layout : 'fit',
        width : 1000, // 窗口宽度
        height : 422, // 窗口高度
        resizable : true,
        draggable : false,
        closeAction : 'hide',
        title : '订单查询窗口',
        modal : true,
        collapsible : true,
        titleCollapse : true,
        maximizable : true,
        buttonAlign : 'right',
        border : false,
        animCollapse : true,
        animateTarget : Ext.getBody(),
        constrain : true,
        items : [codePanel],
        listeners : {
            "beforehide" : function() {
                codeWindow.restore();
            }
        },
        buttons : [{
            text : '确认',
            iconCls : 'acceptIcon',
            handler : function() {
                queryWindowConfirm();
            }
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
                codeWindow.hide();
                codeWindow.restore();
                Ext.getCmp('order_id').setValue('');
                Ext.getCmp('startdate').setValue('');
                Ext.getCmp('enddate').setValue('');
                Ext.getCmp('style_no').setValue('');
                ordStore.removeAll();
            }
        }]
    });
    
	/**
 	 * 绘图组件容器
 	 */
 	var piePanel = new Ext.Panel({
            region : 'center',
            id:'piePanel',
            tbar : [{
                    text : '查询窗口',
                    iconCls : 'page_findIcon',
                    handler : function(){
                        codeWindow.show();
                    }
        			}],
            title : 'QC饼图',
            autoScroll : true,
            html : ''
    });
    
	var colors = ['#AA4643', '#BBBBBB', '#4572A7', '#CCCCCC', '#DDDDDD',
            '#AAAAAA', '#89A54E', '#EEEEEE', '#111111', '#80699B', '#225522',
            '#333333', '#3D96AE', '#446644', '#555555', '#DB843D', '#667766',
            '#777777', '#92A8CD', '#889988', '#999999', '#A47D7C', '#112233',
            '#112244', '#B5CA92', '#112255', '#324355'];
     /**
      * 饼图对象
      * @type 
      */
    //创建饼图
    function showPies(div_id,title_name,print_date){
    	$(document).ready(function() {
          pieChart = $('#'+div_id).highcharts({
        chart : {
            type : 'pie'
        },
        colors : colors,
        title : {
            text : title_name
        },
        subtitle : {
            text : infoHtml
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
        series : print_date,
        credits : {
            enabled : false
        },
        exporting : {
            enabled : false
        }
    }).highcharts();
    pieChart.redraw();
    	});
    }
    
	function queryWindowConfirm() {
    	var record = ordGrid.getSelectionModel().getSelected();
    	
        if (Ext.isEmpty(record)) {
            Ext.Msg.alert('提示', '请选择一条记录!');
            return;
        }
        check_ord_seq_no = record.get('order_id');
        var params = {   
		order_id: check_ord_seq_no
        };
        //更新饼图
        queryPieInfo(params,record);
        codeWindow.hide();
    }
    /**
     * 请求饼图信息
     */ 
    function queryPieInfo(/**传入特定参数*/params,record){
    	infoHtml='';
        var acticle=record.get("acticle");
		var cust_name=record.get("cust_name");
		var ins_num=record.get("ins_num");
		var order_id=record.get("order_id");
		var ribbon_color=record.get("ribbon_color");
		var style_no =record.get("style_no");
		infoHtml=' 订单号:'+order_id+'   款号:'+style_no+'   丝带色号:'+ribbon_color
					+'   品名:'+acticle+'    指令数:'+ins_num;
    	
         Ext.Ajax.request({
                              url : './manageQC.ered?reqCode=getQCSchePie',
                              success : queryPieInfo4Ajax_success,
                              failure : queryPieInfo4Ajax_failure,
                              params : params
                        });
    	
    }
    /**
     * 请求失败
     */
    function queryPieInfo4Ajax_failure(response){
    	 Ext.Msg.alert('提示', '不能加载显示数据');
    }
    
    
    /**
     * 请求成功，进行数据解析
     */
    function queryPieInfo4Ajax_success(response){
    	var data = Ext.util.JSON.decode(response.responseText);
    	//饼图panel
    	var pieHtml='<table width="100%" height="100%" border="1px solid red"><tr>';
    	//获得检查位置信息
    	var ps=data.pDtos;
    	if(Ext.isEmpty(ps)){
    		Ext.getCmp('piePanel').update("<div style='margin:auto auto;color:red;text-align:center;'>没有qc记录</div>");
    		return
    	}
    	pieparams=[];
    	
    	//位置信息
    	for(var idx=0;idx<ps.length;idx++){
    		//检查项信息
    		var qcis=ps[idx].positionNumInfo;
    		var seriesData = [];
    		var totalNum = 0; 
    		//处理位置信息
    		for(var i=0;i<qcis.length;i++){
    			var inum=qcis[i];
    			seriesData.push({
                                    num : inum.amount,
                                    name : inum.qc_item_name
                              })
               totalNum += inum.amount;               
    		}
    		totalNum = !totalNum ? 0 : totalNum;
            // 处理y轴 百分比数据  -- 饼图分配区域的数据     
    		if (!Ext.isEmpty(totalNum) && totalNum > 0) {
                  var dataLength = seriesData.length;
                  for (var j = 0; j < dataLength; j++) {
                        seriesData[j].y = parseFloat((parseInt(seriesData[j].num)
                                    / totalNum * 100).toFixed(2));
                  }
            }
    		//组装每个饼图的参数
    		 var series=[];
             series.push({
                				data:seriesData,
                				name:ps[idx].position_name
                			})
             var params = {
                  title : '损耗信息饼图',
                  subTitle : ps[idx].position_name,
                  series : series
            	}
            pieparams.push(params);
           	//新建饼图panel
            pieHtml=pieHtml+'<td height="20%" width="25%"><div  id="'+idx+'_pie" >'+idx+'</div></td>';
            if(idx==3){pieHtml+='</tr><tr>'; }
            if(idx==ps.length-1){pieHtml+='</tr>';}
    	}
    	pieHtml+='</table>';
    	Ext.getCmp('piePanel').update(pieHtml);
    	//绘制饼图
    	for(var i=0;i<pieparams.length;i++){
    		showPies(i+'_pie',pieparams[i].subTitle,pieparams[i].series);
    	}
    	
    }
    /**
     * 获取我的订单的信息
     * @return {}
     */
    function addmyorderQuery(){
        var ischecked = Ext.getCmp('myorder').checked;
        var myorder = ischecked?"yes":"";    //1表示我的订单
        return myorder;
    }
      /**
     * 通过id获取值
     * @param {} idval 传入的id
     */
    var getValueNoNullById = function(idval){
        var value = Ext.getCmp(idval).getValue();
        return value?value:'';
    }
	
	
	
	var loadStore=function (){
		var params = {   
        //添加一般参数
		order_id: Ext.getCmp("order_id").getValue(),
		class_name : Ext.getCmp("classParam").getValue(),
        start : 0,
        limit : bbar.pageSize
        };
		store.load({
		params:params
		});
	}
	 /**
     * 查询Store的数据
     */
    function queryStore(params){
        // 保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        
        params.start = 0;
        params.limit = bbar.pageSize;
        //加载数据
        store.baseParams = params;   // 查询条件赋值给store 在翻页查询中使用
        store.load({
            params: params
        });
    }
    
	 /**
     * 查询生产通知单,查询条件由详细查询得来
     */
    function queryOrder4detail(recordArr){
        isPageQuery = false;
        var prodordArr = [];
        for(var idx=0;idx<recordArr.length;idx++){
            var record = recordArr[idx];
            prodordArr.push(record.get('order_id'));
        }
        var params = {
            prodords : prodordArr.join(','),
            fromFlag : '1'  // 标记此查询是来之详细查询的
        };
        queryStore(params);
    }

	  // 按照指定的订单信息来查询
    function loadStore4ordStore(/**传入特定参数*/params){
        var prodstatus = ordstateCombo.getValue();
        params = params || {};   //如果为空 则构建一个空对象
        //添加一般参数
        params.start = 0;
        params.limit = ordBbar.pageSize;
        params.order_name = getValueNoNullById('order_id');
        params.startdate =  Ext.getCmp('startdate')==null?'':Ext.getCmp('startdate').getValue();
        params.enddate =  Ext.getCmp('enddate')==null?'':Ext.getCmp('enddate').getValue();
        params.style_no = getValueNoNullById('style_no');
        params.ismyorder = addmyorderQuery();
        params.prodstatus = prodstatus;
        //添加日期定义参数  0： FOB交期 1：缝制起始日期 2：生产范围日期 
        params.dateType=Ext.getCmp("dateTypeCombo").value;
        //加载数据
        ordStore.load({
            params: params
        });
        
    }
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [piePanel]
	});
	
	});