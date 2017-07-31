/*******************************************************************************
 * 创建日期: 2013-05-13 创建作者：tangfh|may 功能：生产通知单管理 最后修改时间： 修改记录：
 ******************************************************************************/
Ext.onReady(function() {

    var re = '<span style="color:red">*</span>';
    var rs = '<span style="color:Red">(*为必填项)</span>';
    var myorder = "";    //订单号‘，’分隔
    var myprodord = "";
    var myorderInOrder = "";    //我的订单的选择范围（本次查询分页）
    var account=window.parent.account;
    var isPageQuery = true;  //标识是否为翻页查询，false为重新查询（不是翻页查询），true为翻页查询
    var isHistory = false;

    // 定义列模型
    var sm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });
    var cm = new Ext.grid.ColumnModel([sm, new Ext.grid.RowNumberer(), {
                header : '序号',
                dataIndex : 'seq_no',
                align : 'center',
                hidden : true,
                width : 140
            }, {
                header : '完单号',
                dataIndex : 'prod_ord_seq',
                align : 'center',
                width : 140
            }, {
                header : '订单号PO#',
                dataIndex : 'order_id',
                align : 'center',
                width : 140,
                sortable : true
            },{
                 header:'我的订单',
                    dataIndex:'myorder',
                    width:70,
                    align:'center',
                    renderer:function(value,metaData,record){
                        // 在选择的订单中判断是否是我的订单，如果没有选择过则判断传入的值是否为我的订单
                       var myorderArr = Ext.isEmpty(myorder)?[]:myorder.split(',');
                       var myprodordArr = Ext.isEmpty(myprodord)?[]:myprodord.split(',');
                       var myorderInOrderArr = Ext.isEmpty(myorderInOrder)?[]:myorderInOrder.split(',');
                       var prodord = record.get('prod_ord_seq');
                        var resoult;
                        if((myorderInOrderArr.indexOf(prodord)>-1) && (myprodordArr.indexOf(prodord)>-1)){
                            resoult = '<input type="checkbox" checked=true align="center" name="ismyordername" id="ismyorderid" >';
                        }else if((myorderInOrderArr.indexOf(prodord)>-1) && !(myprodordArr.indexOf(prodord)>-1)){
                            resoult = '<input type="checkbox" align="center" name="ismyordername" id="ismyorderid" >';
                        }else if(value>0 || value=="true"){
                            resoult = '<input type="checkbox" checked=true align="center" name="ismyordername" id="ismyorderid" >';
                        }else {
                            resoult = '<input type="checkbox" align="center" name="ismyordername" id="ismyorderid" >';
                        }
                        
                        return resoult;
                }
            },{
                header : '订单状态',
                dataIndex : 'prodstatus',
                align : 'center',
                sortable : true,
                renderer : function(value) {
                    if (value == "0") {
                        return '未排产';
                    } else if (value == '1') {
                        return '在产中';
                    } else if (value == '2') {
                        return '已交货';
                    } else {
                        return value;
                    }
                }
            }, {
                header : '区域',
                dataIndex : 'area_no',
                align : 'center',
                width : 80
            }, {
                header : '客户编号',
                dataIndex : 'cust_id',
                hidden : true,
                align : 'center',
                width : 100
            }, {
                header : '客户/品牌',
                dataIndex : 'cust_name',
                align : 'center',
                width : 120
            }, {
                header : '款号',
                dataIndex : 'style_no',
                align : 'center',
                width : 120
            }, {
                header : '丝带色号',
                dataIndex : 'ribbon_color',
                align : 'center',
                sortable : true,
                width : 90
            }, {
                header : '合同号',
                dataIndex : 'contract_id',
                align : 'center',
                width : 60
            }, {
                header : '指令数',
                dataIndex : 'ins_num',
                align : 'center',
                width : 60,
                sortable : true
            }, {
                header : '国家',
                dataIndex : 'country',
                align : 'center',
                width : 60,
                sortable : true
            }, {
                header : '订单数',
                dataIndex : 'order_num',
                hidden:true,
                width : 60,
                sortable : true
            }, {
                header : '品名',
                dataIndex : 'article',
                align : 'center',
                width : 90,
                sortable : true
            }, {
                header : '产品分类',
                dataIndex : 'classify',
                align : 'center',
                width : 90,
                sortable : true
            }, {
                header : '洗水方式',
                dataIndex : 'wash',
                align : 'center',
                width : 80,
                sortable : true
            },{
                header : 'FOB交期',
                dataIndex : 'fob_deal_date',
                align : 'center',
                sortable : true,
                width : 90
            },{
                header : '面料',
                dataIndex : 'material',
                align : 'center',
                width : 80,
                sortable : true
            }, {
                header : '加裁比例%',
                dataIndex : 'add_proportion',
                align : 'center',
                width : 80,
                sortable : true,
                renderer:function(value){
                    if(value!=""){
                        return toFixedForNumber(value*100,2);
                    }
                    return value;
                }
            }, {
                header : '面料缩率J%',
                dataIndex : 'percent_j',
                align : 'center',
                width : 80,
                sortable : true,
                renderer:function(value){
                    if(value!=""){
                        return toFixedForNumber(value*100,2);
                    }
                    return value;
                }
            }, {
                header : '短装%',
                dataIndex : 'less_clause',
                align : 'center',
                width : 80,
                sortable : true,
                renderer:function(value){
                    if(value!=""){
                        return toFixedForNumber(value*100,2);
                    }
                    return value;
                }
            }, {
                header : '溢装%',
                dataIndex : 'more_clause',
                align : 'center',
                width : 80,
                sortable : true,
                renderer:function(value){
                    if(value!=""){
                        return toFixedForNumber(value*100,2);
                    }
                    return value;
                }
            }, {
                header : '面料缩率W%',
                dataIndex : 'percent_w',
                align : 'center',
                width : 80,
                sortable : true,renderer:function(value){
                    if(value!=""){
                        return toFixedForNumber(value*100,2);
                    }
                    return value;
                }
            }, {
                header : '通知日期',
                dataIndex : 'notity_date',
                align : 'center',
                sortable : true,
                width : 90
            }, {
                header : '导入时间',
                dataIndex : 'order_date',
                align : 'center',
                sortable : true,
                width : 90
            }, {
                header : '生产计划',
                dataIndex : 'prod_plan_seq',
                align : 'center',
                width : 60,
                sortable : true
            }, {
                header : '状态',
                dataIndex : 'status',
                align : 'center',
                hidden : true,
                width : 60,
                sortable : true
            }, {
                header : '标志',
                dataIndex : 'state',
                align : 'center',
                width : 60,
                sortable : true,
                renderer : function(value) {
                    if (value == '0')
                        return '正常';
                    else if (value == '1')
                        return '撤销';
                }
            }, {
                header : '缝制工厂',
                dataIndex : 'sew_fac',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '水洗工厂',
                dataIndex : 'bach_fac',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '后整工厂',
                dataIndex : 'pack_fac',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '缝制工厂',
                dataIndex : 'sew_fac_name',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '水洗工厂',
                dataIndex : 'bach_fac_name',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '后整工厂',
                dataIndex : 'pack_fac_name',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '交货时间',
                dataIndex : 'sew_delivery_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '交货时间',
                dataIndex : 'bach_delivery_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '交货时间',
                dataIndex : 'pack_delivery_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '计划审批',
                dataIndex : 'plan_check',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '采购审批',
                dataIndex : 'purchase_check',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '贸易审批',
                dataIndex : 'trade_check',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '技术审批',
                dataIndex : 'trade_check',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '计划审批时间',
                dataIndex : 'plan_check_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '采购审批时间',
                dataIndex : 'purchase_check_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '技术审批时间',
                dataIndex : 'tech_check_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '贸易审批时间',
                dataIndex : 'trade_check_date',
                hidden : true,
                align : 'center',
                width : 60
            }, {
                header : '重要通知',
                dataIndex : 'remark',
                align : 'center',
                width : 100
            }, {
                header : '',
                dataIndex : 'is_used',
                hidden : true,
                align : 'center',
                width : 100
            }]);
    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
                // 获取数据的方式
                proxy : new Ext.data.HttpProxy({
                            url : './prodOrd.ered?reqCode=queryProdOrdInfo'
                        }),
                // 数据读取器
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT', // 记录总数
                            root : 'ROOT' // Json中的列表数据根节点
                        }, ['seq_no', 'prod_ord_seq', 'area_no', 'cust_id',
                                'cust_name', 'order_date', 'brand', 'batch',
                                'add_proportion', 'style_no', 'contract_id',
                                'ord_seq_no', 'order_id', 'article',
                                'classify', 'wash', 'material', 'order_num',
                                'percent_j', 'percent_w', 'less_clause',
                                'more_clause', 'delivery_date', 'ribbon_color',
                                'notity_date','order_date', 'prod_ord_file',
                                'orig_contract', 'box_ins', 'pack_ins',
                                'style_drawing', 'size_chart', 'process_quota',
                                'process_desc', 'pattern_code', 'opr_name',
                                'opr_date', 'prod_plan_seq', 'status', 'state',
                                'sew_fac', 'bach_fac', 'pack_fac',
                                'sew_fac_name', 'bach_fac_name',
                                'pack_fac_name', 'sew_start_date',
                                'sew_delivery_date', 'bach_delivery_date',
                                'pack_delivery_date', 'plan_check',
                                'purchase_check', 'tech_check', 'trade_check',
                                'plan_check_date', 'purchase_check_date',
                                'tech_check_date', 'trade_check_date',
                                'remark', 'wash_stream', 'is_used', 'ins_num','country',
                                'opr_merchandiser', 'transportation_way',
                                'check_prod_date', 'fob_deal_date',
                                'production_certificate', 'prodstatus','myorder'])
            });
            
//     翻页排序时带上查询条件
    store.on('beforeload', function() {
        if(!isPageQuery){
            clearMyOrdersHis(); //重新查询清空我的订单信息
        }else {
        	saveMyOrdersInfo(); //如果是不是重新查询（翻页查询）
        }
    });
    store.on('load',function(){
        store.sort('myorder','desc');   //排序
        //每次加载完设置状态为翻页查询，重新查询的方法中会设置isPageQuery状态为false
        isPageQuery = true;		//
    });
    // 每页显示条数下拉选择框
    var pagesize_combo = new Ext.form.ComboBox({
                name : 'pagesize',
                triggerAction : 'all',
                mode : 'local',
                store : new Ext.data.ArrayStore({
                            fields : ['value', 'text'],
                            data : [[10, '10条/页'], [20, '20条/页'],
                                    [50, '50条/页'], [100, '100条/页'],
                                    [250, '250条/页'], [500, '500条/页'], [1000, '1000条/页']]
                        }),
                valueField : 'value',
                displayField : 'text',
                value : '50',
                editable : false,
                width : 85
            });
    var number = parseInt(pagesize_combo.getValue());
    // 改变每页显示条数reload数据
    pagesize_combo.on("select", function(comboBox) {
                bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                queryOrdItem();
            });
    // 分页工具栏
    var bbar = new Ext.PagingToolbar({
                pageSize : number,
                store : store,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', pagesize_combo]
            });
    /**
     * 订单状态下拉框
     */
    var prodStatusLovCombo = new Ext.ux.form.LovCombo({
        name:'prodStatusLovCombo',
        id:'prodStatusLovCombo',
        hiddenName:'ordStatus',
        fieldLabel:'订单状态',
        store:new Ext.data.ArrayStore({
            fields:['value','text'],
            data:[['0','未排产'],['1','在产中'],['2','已交货']]
        }),
        mode: 'local',
        hideTrigger: false,
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        emptyText: '请选择...',
        allowBlank: true,
        editable: false,
        width:150
    });
    // 表格工具栏
    var tbar = new Ext.Toolbar({
        items : ['-','订单状态:',prodStatusLovCombo,'完单号:', {
                    id : 'prod_ord_seq_query',
                    name : 'prod_ord_seq_query',
                    xtype : 'textfield',
                    emptyText : '请输入完单号',
                    width:100,
                    enableKeyEvents : true,
                    listeners : {
                        specialkey : function(field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                queryOrdItem();
                            }
                        }
                    }
                }, '订单号:', {
                    id : 'ord_seq_no_query',
                    name : 'ord_seq_no_query',
                    xtype : 'textfield',
                    emptyText : '请输入订单号',
                    width:100,
                    enableKeyEvents : true,
                    listeners : {
                        specialkey : function(field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                queryOrdItem();
                            }
                        }
                    }
                }, '款号:', {
                    id : 'style_no_query',
                    name : 'style_no_query',
                    xtype : 'textfield',
                    emptyText : '请输入款号',
                    width:100,
                    enableKeyEvents : true,
                    listeners : {
                        specialkey : function(field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER) {
                                queryOrdItem();
                            }
                        }
                    }
                }, {
                    text : '查询',
                    iconCls : 'page_findIcon',
                    handler : function() {
                        isHistory = false;
                        queryOrdItem();
                    }
                },{
                    text:'历史查询',
                    iconCls:'page_findIcon',
                    handler:function(){
                        isHistory = true;
                        queryOrdItem();
                    }
                },{
                    text:'保存我的订单',
                    iconCls:'page_findIcon',
                    handler:function(){
                        saveMyOrder();
                    }
                },{
                    text : '详细查询',
                    iconCls : 'page_findIcon',
                    handler : function(){
                        var queryWin = new QueryWindowConstruct();
                        queryWin.addListener('231',queryOrder4detail);
                        queryWin.showQueryWindow();
                    }
                }]
    });
    var tbar2 = new Ext.Toolbar({
       items:['-',{
                    text : '新增',
                    id : 'new_button',
                    iconCls : 'page_addIcon',
                    handler : function() {
                        addProdOrdDataInit();
                    }
                }, '-', {
                    text : '修改',
                    id : 'modify_button',
                    iconCls : 'page_edit_1Icon',
                    handler : function() {
                        updateProdOrdDataInit();
                    }
                }, '-',new Ext.Button({
                    text:'删除',
                    iconCls : 'page_delIcon',
                    hidden : false,
                    menu:[{
                        text : '删除',
                        id : 'delete_button',
                        iconCls : 'page_delIcon',
                        handler : function() {
                            deleteProdOrdData();
                        }
                        },{
                            text : '彻底删除',
                            id : 'delete_all_button',
                            iconCls : 'page_delIcon',
                            handler : function() {
                                deleteAllData();
                            }
                        }]
                }),'-', {
                    text : '导入',
                    iconCls : 'page_refreshIcon',
                    handler : function() {
                    	Ext.Ajax.request({
			                url: './qaInfo.ered?reqCode=findLatestProdFile',
			                method: 'GET',
			                success: function (response, options) {
			                	var msgJ = Ext.util.JSON.decode(response.responseText);
			                    Ext.MessageBox.show({
                                            title : '提示',
                                            msg : msgJ.msg,
                                            buttons : Ext.MessageBox.OK,
                                            icon : Ext.MessageBox.INFO,
                                            fn:  function(btn,txt){    
   											 importwindow.show();
                                            }
                                        });
			                },
			                failure: function (response, options) {
			                    //Ext.MessageBox.alert('失败', '获取文件信息失败' + response.status);
			                	importwindow.show();
			                }
			            });
			            
                    	
                     
                    }
                }, '-',new Ext.Button({
                    text:'导出',
                    menu:[{
                    text : '全部导出',
                    id : 'excel_all_button',
                    iconCls : 'page_edit_1Icon',
                    handler : function() {
                        exportExcel('./prodOrd.ered?reqCode=excleProdOrderInfo');
                    }
                }, '-', {
                    text : '导出选中信息',
                    id : 'excel_select_button',
                    iconCls : 'page_edit_1Icon',
                    handler : function() {
                        var records = grid.getSelectionModel().getSelections();

                        if (records.length == 0) {
                            Ext.Msg.alert('提示', '请选中要导出的数据');
                            return;
                        }

                        Ext.Msg.confirm('确认', '确认要导出选择的信息吗?', function(btn,
                                text) {
                            if (btn == 'yes') {
                                var prod_ord_seqs = ""
                                        + jsArray2JsString(records,
                                                "prod_ord_seq");
                                Ext.Ajax.request({
                                    url : './prodOrd.ered?reqCode=doExportExcel',
                                    success : function(response) { // 回调函数有1个参数
                                        exportExcel('./prodOrd.ered?reqCode=excleSelectProdOrderInfo');
                                    },
                                    failure : function() {
                                    },
                                    params : {
                                        prod_ord_seqs : prod_ord_seqs,
                                        query_key : 'QUERYSELECTPRODORDINFO_DTO'
                                    }
                                });
                            }
                        });
                    }
                }]
                }),'-', {
                    text : '刷新',
                    iconCls : 'page_refreshIcon',
                    handler : function() {
                        store.reload();
                    }
                },'-',{
                    text : '全选为我的订单',
                    iconCls : 'page_addIcon',
                    handler : function(){
                        selectAllOrder();
                    }
                },'-',{
                    text : '添加数量修改备注',
                    iconCls : 'page_addIcon',
                    handler : function(){
                        updateNumeditRemark();
                    }
                }]
    })
    var grid = new Ext.grid.GridPanel({
                id : 'prodOrdGrid',
                title : '<span style="font-weight:normal">生产通知单管理</span>',
                height : 590,
                store : store,
                region : 'center',// 和VIEWPORT布局模型对应，充当center区域布局
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                stripeRows : true,// 斑马线 True表示为显示行的分隔符（默认为true）。
                // frame: true,// True表示为面板的边框外框可自定义的
                border : false,
                cm : cm,
                sm : sm,
                tbar : tbar,
                bbar : bbar,
                listeners : {
                    render : function() {
                        setColumn(cm);
                        tbar2.render(this.tbar);
                    }
                }
            });

    grid.on('rowdblclick', function(grid, rowIndex, event) {
                updateProdOrdDataInit();
            });
	//数量修改备注
    var numeditRemarkPanel= new Ext.form.FormPanel({
    	id:'numeditRemarkPanel',
    	name:'numeditRemarkPanel',
    	labelWidth : 105,
        width : 280,
        height : 220,
        frame : true,
        items:[{
        		xtype:'textarea',
                name : 'numeditRemark',
                id : 'numeditRemark',
                fieldLabel : '数量修改备注',
                anchor : '94%',
                xtype : 'textarea',
				height : 60, // 设置多行文本框的高度
				emptyText : '' // 设置默认初始值
        }]
    })
    
    var numeditRemarkPanelW= new Ext.Window({
    	layout : 'fit',
        width : 400,
        height : 170,
        resizable : false,
        draggable : false,
        closeAction : 'hide',
        title : '添加/修改数量备注',
        modal : true,
        collapsible : true,
        titleCollapse : true,
        maximizable : false,
        buttonAlign : 'right',
        border : false,
        animCollapse : true,
        animateTarget : Ext.getBody(),
        constrain : true,
        items : [numeditRemarkPanel],
        buttons:[
        	{
            text : '保存',
            id : 'remark_save',
            iconCls : 'page_addIcon',
            handler : function() {
                Ext.Ajax.request({
					url: './prodOrd.ered?reqCode=updateNumeditRemark',
					success: function (response) {
						var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
						Ext.MessageBox.alert('提示', resultArray.msg);
						numeditRemarkPanelW.hide();
					},
					failure: function (response) {
						var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
						numeditRemarkPanelW.hide();
						Ext.MessageBox.alert('提示', resultArray.msg);
					},
					params: {
						numeditRemark: Ext.getCmp("numeditRemark").getValue(),
						ord_seq_no: grid.getSelectionModel().getSelected().get("ord_seq_no").toString()
					}
				});
            }
        },{
            text : '关闭',
            id : 'remark_close',
            iconCls : 'deleteIcon',
            handler : function() {
                numeditRemarkPanelW.hide();
            }
        }]
    });
    // 导入
    var importpanel = new Ext.form.FormPanel({
        id : 'importpanel',
        name : 'importpanel',
        defaultType : 'textfield',
        labelAlign : 'right',
        labelWidth : 105,
        width : 280,
        height : 220,
        frame : true,
        fileUpload : true,
        items : [{
                    fieldLabel : '导入文件(Excel)' + re,
                    name : 'theFile',
                    id : 'theFile',
                    inputType : 'file',
                    allowBlank : false,
                    blankText : "请选择导入文件",
                    anchor : '94%'
                }, {
                    xtype : "",
                    labelStyle : 'color:red;',
                    fieldLabel : 'Excel格式',
                    html : "<SPAN STYLE='COLOR:red'>第一行为中文标题,文件中请不要出现空行。</SPAN>",
                    anchor : '95%'
                }, {
                    xtype : "label",
                    labelStyle : 'color:red;width=160px;',
                    html :"",
                    anchor : '99%'
                }]
    });
    

    var importwindow = new Ext.Window({
        layout : 'fit',
        width : 400,
        height : 170,
        resizable : false,
        draggable : false,
        closeAction : 'hide',
        title : '导入生产通知单信息',
        modal : true,
        collapsible : true,
        titleCollapse : true,
        maximizable : false,
        buttonAlign : 'right',
        border : false,
        animCollapse : true,
        animateTarget : Ext.getBody(),
        constrain : true,
        items : [importpanel],
        buttons : [{
            text : '导入',
            iconCls : 'acceptIcon',
            handler : function() {
                var theFile = Ext.getCmp('theFile').getValue();
                if (Ext.isEmpty(theFile)) {
                    Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
                    return;
                }

                if (theFile.substring(theFile.length - 4, theFile.length) != ".xls"
                        && theFile
                                .substring(theFile.length - 5, theFile.length) != ".xlsx") {
                    Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
                    return;
                }
                importpanel.getForm().submit({
                            url : './prodOrd.ered?reqCode=importProdOrdInfo',
                            waitTitle : '提示',
                            method : 'POST',
                            waitMsg : '正在处理数据,请稍候...',
                            success : function(form, action) {
                                importwindow.hide();
                                importpanel.form.reset();
                                Ext.MessageBox.show({
                                            title : '提示',
                                            msg : action.result.msg,
                                            buttons : Ext.MessageBox.OK,
                                            icon : Ext.MessageBox.INFO
                                        });
                                store.reload();
                            },
                            failure : function(form, action) {
                            	importwindow.hide();
                                importpanel.form.reset();
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                            title : '提示',
                                            msg : action.result.msg,
                                            buttons : Ext.MessageBox.OK,
                                            icon : Ext.MessageBox.INFO
                                        });
                                store.reload();
                            }
                        });
            }
        }, {
            text : '关闭',
            id : 'client_btnReset',
            iconCls : 'deleteIcon',
            handler : function() {
                importwindow.hide();
            }
        }]
    });
    
    
    //===========================================函数=============================================//
    /**
     * 新增生产通知单
     */
    function addProdOrdDataInit(){
    	var prodordCon = new ProdordManageWindow();
    	prodordCon.newProdordInfo();
    }
    
    /**
     * 修改生产通知单
     */
    function updateProdOrdDataInit(){
    	var selectProdord = grid.getSelectionModel().getSelected();
    	var prodords = grid.getSelectionModel().getSelections();
    	if(Ext.isEmpty(selectProdord)){
    		Ext.Msg.alert('提示','请选择修改数据!');
    		return;
    	}
    	if(prodords.length>1){
    		Ext.Msg.alert('提示','请选择一条数据!');
    		return;
    	}
    	var prodordCon = new ProdordManageWindow();
    	var prodordseq = selectProdord.get('prod_ord_seq');
        prodordCon.editProdordInfo(prodordseq);
    }
    //===========================================函数结束=============================================//
    
    
    
    
    
    /**
     * 布局
     */
    var viewport = new Ext.Viewport({
                layout : 'border',
                items : [{
                            region : 'center',
                            layout : 'fit',
                            margins : '3 3 3 3',
                            items : [grid]
                        }]
            });


    /** 修改窗口 初始化 */

    // 删除数据
    function deleteProdOrdData() {
        var record = grid.getSelectionModel().getSelected();
        if(account!='1000'){
        	Ext.MessageBox.alert('提示', '没有权限进行该操作!');
        	return;
        }
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        // 获得选中数据后则可以传入后台继续处理
        Ext.Msg.confirm('请确认', '确认删除选中的生产通知单信息吗?', function(btn, text) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                            url : 'prodOrd.ered?reqCode=deleteProdOrdInfoAction',
                            success : function(response) {
                                var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                Ext.Msg.alert('提示', resultArray.msg);
                                store.reload();
                            },
                            failure : function(response) {
                                var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                Ext.MessageBox.alert('提示', resultArray.msg);
                            },
                            params : {
                                prod_ord_seq : record.get('prod_ord_seq')
                                        .toString(),
                                seq_no : record.get('seq_no').toString(),
                                ord_seq_no : record.get('ord_seq_no')
                                        .toString()
                            }
                        });
            }
        });
    }
    
    /** 根据条件查询生产通知单 */
    function queryOrdItem() {
        isPageQuery = false;  //设置查询不是翻页查询
        var  params = {
                    isManageProdOrd : 'yes',
                    isHistory:isHistory?'yes':'no',
                    ord_seq_no : Ext.getCmp('ord_seq_no_query').getValue(),
                    style_no : Ext.getCmp('style_no_query').getValue(),
                    prod_ord_seq : Ext.getCmp('prod_ord_seq_query').getValue(),
                    prodstatus:Ext.getCmp('prodStatusLovCombo').getValue()
                };
        queryStore(params);
    }
    
    var old_params = {};
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
    
    function fillBrowser(obj) {
        if (obj != null) {
            obj.setWidth(document.body.clientWidth);
            obj.setHeight(document.body.clientHeight);
        }
    }
    // ~end
    /**
     * 小数转化：data传入的参数，num指定的小数点后位置(默认2位)
     */
    function toFixedForNumber(data,num){
        if(!Ext.isEmpty(num)){
            return data.toFixed(num); 
        }
        return data.toFixed(2);
    }
    
    // 彻底删除数据
    function deleteAllData() {
    	if(account.toString()!='1000'){
        	Ext.MessageBox.alert('提示', '没有权限进行该操作!');
        	return;
        }
        var record = grid.getSelectionModel().getSelected();
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        // 获得选中数据后则可以传入后台继续处理
        Ext.Msg.confirm('请确认', '此操作将删除生产通知单所有信息：基础信息和流程数据',
                function(btn, text) {
                    if (btn == 'yes') {
                        Ext.Ajax.request({
                            url : 'prodOrd.ered?reqCode=deleteProdOrdInfoAction',
                            success : function(response) {
                                var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                Ext.Msg.alert('提示', resultArray.msg);
                                store.reload();
                            },
                            failure : function(response) {
                                var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                Ext.MessageBox.alert('提示', resultArray.msg);
                            },
                            params : {
                                prod_ord_seq : record.get('prod_ord_seq')
                                        .toString(),
                                seq_no : record.get('seq_no').toString(),
                                ord_seq_no : record.get('ord_seq_no')
                                        .toString(),
                                isAll : 'yes'
                            }
                        });
                    }
                });
    }
    
    
    
    //选择保存我的订单：
    function saveMyOrder(){
        saveMyOrdersInfo(); //在保存我的订单前，做最后一次保存选择信息
        parseProdordData();
        Ext.Ajax.request({
            url:'./prodOrd.ered?reqCode=saveMyOrder',
            success:function(value){
                if(value){
                    Ext.Msg.alert('提示', '保存成功');
                }else {
                    Ext.Msg.alert('提示','保存失败');
                }
            },
            failure:function(value){
                if(value.length>0){
                    Ext.Msg.alert("提示",value);
                }else {
                    Ext.Msg.alert("提示","保存失败");
                }
            },
            params:{
                myprodord : myprodord,
                myorder : myorder,
                myorderInOrder : myorderInOrder
            }
        });
        // 重新加载数据
        queryOrdItem();
    }
    /**
     * 处理操作的数据，去掉第一个逗号
     */
    function parseProdordData(){
    	var p = myprodord.match(',.*'); 
    	if(!Ext.isEmpty(p) && p.length>0){
            myprodord = myprodord.substring(1,myprodord.length);
        }
        var p1 = myorder.match(',.*'); 
        if(!Ext.isEmpty(p1) && p1.length>0){
            myorder = myorder.substring(1,myorder.length);
        }
        var p2 = myorderInOrder.match(',.*'); 
        if(!Ext.isEmpty(p2) && p2.length>0){
            myorderInOrder = myorderInOrder.substring(1, myorderInOrder.length)
        }
    }
     
    
    //当分页查询的时候，保存当前选择的订单信息
    function saveMyOrdersInfo(){
        //遍历grid片段ismyorder字段是否为选择，操作seq_no
        var myorderArr = Ext.isEmpty(myorder)?[]:myorder.split(',');
        var myprodordArr = Ext.isEmpty(myprodord)?[]:myprodord.split(',');
        var myorderInOrderArr = Ext.isEmpty(myorderInOrder)?[]:myorderInOrder.split(',');
        
        var store = grid.getStore();
        var ranges = store.getRange(); 
        var myorders = document.getElementsByName('ismyordername');
        var rangesLength = ranges.length;
        for(var i=0;i<rangesLength;i++){
            var ordItem = myorders[i];
            var record = ranges[i];
            ordno = record.get('ord_seq_no');
            prodord = record.get('prod_ord_seq');
            //如果已经存在则不添加
            if(myorderInOrderArr.indexOf(prodord)<0){
                myorderInOrder = myorderInOrder+","+prodord;
                myorderInOrderArr.push(prodord);
            }
            if(ordItem.checked && myprodordArr.indexOf(prodord)<0){
                //下面两个数据是一一对应
                myprodord = myprodord+","+prodord;
                myorder = myorder+","+ordno;
                myprodordArr.push(prodord);
                myorderArr.push(ordno);
            }
        }
    }
    /**
     * 选择当前也所有订单
     */
    function selectAllOrder(){
        var myorders = document.getElementsByName('ismyordername');
        var rangesLength = myorders.length;
        for(var i=0;i<rangesLength;i++){
            var ordItem = myorders[i];
            ordItem.checked = true;
        }
    }
    
    /**
     * 数量修改备注信息
     */
    function updateNumeditRemark(){
    	//todo
    	var selectProdord = grid.getSelectionModel().getSelected();
    	var prodords = grid.getSelectionModel().getSelections();
    	if(Ext.isEmpty(selectProdord)){
    		Ext.Msg.alert('提示','请选择修改数据!');
    		return;
    	}
    	if(prodords.length>1){
    		Ext.Msg.alert('提示','请选择一条数据!');
    		return;
    	}
    	Ext.Ajax.request({
					url: './prodOrd.ered?reqCode=queryNumeditRemark',
					success: function (response) {
						var resultArray = Ext.util.JSON
							.decode(response.responseText);
						Ext.getCmp("numeditRemark").setValue(resultArray.numedit_remark);
						numeditRemarkPanelW.show();
					},
					failure: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.MessageBox.alert('提示', resultArray.msg);
					},
					params: {
						ord_seq_no: selectProdord.get("ord_seq_no").toString()
					}
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
            prodordArr.push(record.get('prod_ord_seq'));
        }
        var params = {
            prodords : prodordArr.join(','),
            fromFlag : '1'  // 标记此查询是来之详细查询的
        };
        queryStore(params);
    }
    
    //初始化重新查询时候我的订单信息
    function clearMyOrdersHis(){
        myprodord = "";
        myorder = "";
        myorderInOrder = "";
    };
    // 加载事件最后执行的函数
    var A = function(){
        queryOrdItem();
    }();
});