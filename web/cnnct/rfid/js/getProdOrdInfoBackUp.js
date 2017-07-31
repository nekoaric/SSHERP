/*******************************************************************************
 * 创建日期: 2013-05-13 创建作者：tangfh|may 功能：生产通知单管理 最后修改时间： 修改记录：
 ******************************************************************************/
Ext.onReady(function() {

    var re = '<span style="color:red">*</span>';
    var rs = '<span style="color:Red">(*为必填项)</span>';
    var myorder = "";    //订单号‘，’分隔
    var myprodord = "";
    var myorderInOrder = "";    //我的订单的选择范围（本次查询分页）
    
    var isPageQuery = true;  //标识是否为翻页查询，false为重新查询（不是翻页查询），true为翻页查询
    var isHistory = false;
    var columnsValue;
    var file;
    var colValue = '';
    var prod_ord_flag, is_used;// 生产通知单有没有开始加工
    var ordColumnModel = [], insColumnModel = [];// 修改时的列数据

    // 定义列模型
    var sm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });
    //我的订单复选框
    var myOrd_sm = new Ext.grid.CheckboxSelectionModel({
        
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
            }, {
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
            }, {
                header : '总数',
                dataIndex : 'order_num',
                hidden:true
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
                                'notity_date', 'prod_ord_file',
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
                                'remark', 'wash_stream', 'is_used', 'ins_num',
                                'opr_merchandiser', 'transportation_way',
                                'check_prod_date', 'fob_deal_date',
                                'production_certificate', 'prodstatus','myorder'])
            });
            
    /**
     * 生产通知单修改时的查询
     */
    var changeProdStore = new Ext.data.Store({
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
                                'notity_date', 'prod_ord_file',
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
                                'remark', 'wash_stream', 'is_used', 'ins_num',
                                'opr_merchandiser', 'transportation_way',
                                'check_prod_date', 'fob_deal_date',
                                'production_certificate', 'prodstatus'])
            });
    // 翻页排序时带上查询条件
    store.on('beforeload', function() {
    	//默认状态为翻页查询，如果是重新查询的话 设置状态为false
        if(!isPageQuery){
            clearMyOrdersHis(); //重新查询清空我的订单信息
        }else {
        	saveMyOrdersInfo(); //如果是不是重新查询（翻页查询）
        }
        this.baseParams = {
            isManageProdOrd : 'yes',
            isHistory:isHistory?'yes':'no',
            ord_seq_no : Ext.getCmp('ord_seq_no_query').getValue(),
            style_no : Ext.getCmp('style_no_query').getValue(),
            prod_ord_seq : Ext.getCmp('prod_ord_seq_query').getValue()
        };
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
                                    [250, '250条/页'], [500, '500条/页']]
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
                        importwindow.show();
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
                updateProdOrdDataInit(grid.getStore().getRange()[rowIndex]);
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
                    labelStyle : 'color:red;width=60px;',
                    html : "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/prodOrd.xlsx' target='_blank'>生产通知单Excel模板文件</a></SPAN>",
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
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                            title : '错误',
                                            msg : action.result.msg,
                                            buttons : Ext.MessageBox.OK,
                                            icon : Ext.MessageBox.ERROR
                                        });
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

    // 指令数量信息的查询
    var prodInsNumStore = new Ext.data.Store({
                // 获取数据的方式
                proxy : new Ext.data.HttpProxy({
                            url : './prodOrd.ered?reqCode=queryProdInsInfo'
                        }),
                // 数据读取器
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT', // 记录总数
                            root : 'ROOT' // Json中的列表数据根节点
                        }, ['country', 'color', 'in_length', 'ins_num', 'num'])
            });

    // 订单数量信息的查询
    var ordNumStore = new Ext.data.Store({
                // 获取数据的方式
                proxy : new Ext.data.HttpProxy({
                            url : './prodOrd.ered?reqCode=queryProdOrdBasInfo'
                        }),
                // 数据读取器
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT', // 记录总数
                            root : 'ROOT' // Json中的列表数据根节点
                        }, ['country', 'color', 'in_length', 'ord_num', 'num'])
            });

    /** 在生产通知单订单数量加载时载入一些基本参数如列头信息 */
    ordNumStore.on('load', function() {
                ordStore.removeAll();
                var recordCount = ordNumStore.getCount();

                columnKeyList.length = 0;
                columnKeyList.push('country');
                columnKeyList.push('color');
                columnKeyList.push('in_length');
                if (Ext.isEmpty(ordNumStore.getAt(0))) {
                    // 如果没有产品信息 则判断is_used为0（为了纠正后台出现误判的现象）
                    is_used = 0;
                    showProdDetailInfo();
                    return;
                }
                var value = ordNumStore.getAt(0).get("num");// 列头 腰围信息
                Ext.getCmp('column').setValue(value);// 腰围设置处设置值
                colValue = value;

                columnsValue = value.split(',');

                // 列信息开始组装
                ordColumnModel = [];
                insColumnModel = [];
                if (is_used == 0) {// 没有绑定记录的设置为可编辑的
                    // 列头数组组装数据
                    ordColumnModel.push(new Ext.grid.CheckboxSelectionModel({
                                singleSelect : false
                            }));
                    ordColumnModel.push({
                                header : '国家',
                                dataIndex : 'country',
                                align : 'center',
                                width : 40,
                                editor : new Ext.form.TriggerField({
                                            allowBlank : false
                                        })
                            });
                    ordColumnModel.push({
                                header : '颜色',
                                dataIndex : 'color',
                                align : 'center',
                                width : 40,
                                editor : new Ext.form.TriggerField({
                                            allowBlank : false
                                        })
                            });
                    ordColumnModel.push({
                                header : '内长',
                                dataIndex : 'in_length',
                                align : 'center',
                                width : 40,
                                sortable : true,
                                editor : new Ext.form.TriggerField({
                                            allowBlank : false
                                        })
                            });
                    for (var i = 0; i < columnsValue.length; i++) {
                        ordColumnModel.push({
                                    header : columnsValue[i],
                                    dataIndex : 'num' + columnsValue[i],
                                    align : 'center',
                                    width : 40,
                                    sortable : true,
                                    editor : {
                                        xtype : "spinnerfield",
                                        minValue : 0,
                                        allowDecimals : true,
                                        decimalPrecision : 0,
                                        incrementValue : 1
                                    }
                                });
                        columnKeyList.push('num' + columnsValue[i]);
                    }
                    insColumnModel.push(new Ext.grid.CheckboxSelectionModel({
                                singleSelect : false
                            }));
                    insColumnModel.push({
                                header : '国家',
                                dataIndex : 'country',
                                align : 'center',
                                width : 40,
                                editor : new Ext.form.TriggerField({
                                            allowBlank : false
                                        })
                            });
                    insColumnModel.push({
                                header : '颜色',
                                dataIndex : 'color',
                                align : 'center',
                                width : 40,
                                editor : new Ext.form.TriggerField({
                                            allowBlank : false
                                        })
                            });
                    insColumnModel.push({
                                header : '内长',
                                dataIndex : 'in_length',
                                align : 'center',
                                width : 40,
                                sortable : true,
                                editor : new Ext.form.TriggerField({
                                            allowBlank : false
                                        })
                            });

                    for (var i = 0; i < columnsValue.length; i++) {
                        insColumnModel.push({
                                    header : columnsValue[i],
                                    dataIndex : 'num' + columnsValue[i],
                                    align : 'center',
                                    width : 40,
                                    sortable : true,
                                    editor : {
                                        xtype : "spinnerfield",
                                        minValue : 0,
                                        allowDecimals : true,
                                        decimalPrecision : 0,
                                        incrementValue : 1
                                    }
                                });
                    }

                } else if (is_used == '1') {
                    // 列头数组组装数据
                    ordColumnModel.push({
                                header : '国家',
                                dataIndex : 'country',
                                align : 'center',
                                width : 40
                            });
                    ordColumnModel.push({
                                header : '颜色',
                                dataIndex : 'color',
                                align : 'center',
                                width : 40
                            });
                    ordColumnModel.push({
                                header : '内长',
                                dataIndex : 'in_length',
                                align : 'center',
                                width : 40,
                                sortable : true
                            });
                    for (var i = 0; i < columnsValue.length; i++) {
                        ordColumnModel.push({
                                    header : columnsValue[i],
                                    dataIndex : 'num' + columnsValue[i],
                                    align : 'center',
                                    width : 40,
                                    sortable : true
                                });
                        columnKeyList.push('num' + columnsValue[i]);
                    }
                    insColumnModel.push({
                                header : '国家',
                                dataIndex : 'country',
                                align : 'center',
                                width : 40
                            });
                    insColumnModel.push({
                                header : '颜色',
                                dataIndex : 'color',
                                align : 'center',
                                width : 40
                            });
                    insColumnModel.push({
                                header : '内长',
                                dataIndex : 'in_length',
                                align : 'center',
                                width : 40,
                                sortable : true
                            });
                    for (var i = 0; i < columnsValue.length; i++) {
                        insColumnModel.push({
                                    header : columnsValue[i],
                                    dataIndex : 'num' + columnsValue[i],
                                    align : 'center',
                                    width : 40,
                                    sortable : true
                                });
                    }

                }

                for (var i = 0; i < recordCount; i++) {
                    var record = ordNumStore.getAt(i);
                    var columnValue = record.get("ord_num").split(',');
                    var column = record.get("num").split(',');
                    for (var j = 0; j < column.length; j++) {
                        record.set("num" + column[j], columnValue[j]);
                    }
                    ordStore.add(record);
                }
                showProdDetailInfo();

            });
    /**
     * 显示订单生产通知单主界面
     */
    function showProdDetailInfo() {
        // 当列头及数量信息加载完成时显示窗口
        Ext.getCmp('ordPlanExceprot').show();
        codeWindow.setTitle('修改生产通知单');
        codeWindow.show();

        if (is_used == '1') {
            ordtbar.hide();
            insOrdtbar.hide();
            Ext.getCmp('columnplan').hide();
        } else {
            ordtbar.show();
            insOrdtbar.show();
            Ext.getCmp('columnplan').show();
        }
    }
    prodInsNumStore.on('load', function() {
                insOrdStore.removeAll();
                var recordCount = prodInsNumStore.getCount();
                for (var i = 0; i < recordCount; i++) {
                    var record = prodInsNumStore.getAt(i);
                    var columnValue = record.get("ins_num").split(',');
                    var column = record.get("num").split(',');
                    for (var j = 0; j < column.length; j++) {
                        record.set("num" + column[j], columnValue[j]);
                    }
                    insOrdStore.add(record);
                }
            });

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

    Ext.override(Ext.grid.RowSelectionModel, {
        onEditorKey : function(field, e) {
            var k = e.getKey(), newCell, g = this.grid, last = g.lastEdit, ed = g.activeEditor, ae, last, r, c;
            var shift = e.shiftKey;
            if (k == e.RIGHT || k == e.TAB) {
                e.stopEvent();
                newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav,
                        this);
            } else if (k == e.LEFT) {
                e.stopEvent();
                newCell = g.walkCells(ed.row, ed.col - 1, 1, this.acceptsNav,
                        this);
            } else if (k == e.UP) {
                e.stopEvent();
                newCell = g.walkCells(ed.row - 1, ed.col, 1, this.acceptsNav,
                        this);
            } else if (k == e.DOWN) {
                e.stopEvent();
                newCell = g.walkCells(ed.row + 1, ed.col, 1, this.acceptsNav,
                        this);
            }

            if (newCell) {
                r = newCell[0];
                c = newCell[1];

                if (r < 0) {
                    return;
                }
                ed.completeEdit();

                if (last.row != r) {
                    this.selectRow(r);
                }

                if (g.isEditor && g.editing) {
                    ae = g.activeEditor;
                    if (ae && ae.field.triggerBlur) {

                        ae.field.triggerBlur();
                    }
                }
                g.startEditing(r, c);
            }
        }
    });

    /**
     * 客户下拉框
     */
    var custStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './ordBas.ered?reqCode=getCustIdCombox'
                        }),
                reader : new Ext.data.JsonReader({}, [{
                                    name : 'value'
                                }, {
                                    name : 'text'
                                }])
            });
    custStore.load();

    var custCombo = new Ext.form.ComboBox({
                name : 'cust_id',
                hiddenName : 'cust_id',
                store : custStore,
                mode : 'local',
                valueField : 'value',
                displayField : 'text',
                fieldLabel : '客户/品牌' + re,
                emptyText : '请选择...',
                allowBlank : false,
                forceSelection : false,
                editable : true,
                typeAhead : false,
                anchor : "90%"
            });
    custCombo.on('blur',{
        //判断客户是否是合规的
    })
    /**
     * 订单下拉框
     */
    var ordSeqNoStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './prodOrd.ered?reqCode=getOrdIdCombox'
                        }),
                reader : new Ext.data.JsonReader({}, [{
                                    name : 'value'
                                }, {
                                    name : 'text'
                                }])
            });
    ordSeqNoStore.load();

    var ordCombo = new Ext.form.ComboBox({
                name : 'ord_seq_no',
                hiddenName : 'ord_seq_no',
                id : 'order_ids',
                store : ordSeqNoStore,
                mode : 'local',
                valueField : 'value',
                displayField : 'text',
                fieldLabel : '订单号PO' + re,
                emptyText : '请选择...',
                allowBlank : false,
                forceSelection : false,
                editable : true,
                typeAhead : false,
                anchor : "90%"
            });

    var ordBasStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './ordBas.ered?reqCode=queryOrdBasInfo'
                        }),
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT', // 记录总数
                            root : 'ROOT' // Json中的列表数据根节点
                        }, ['seq_no', 'order_date', 'cust_id', 'cust_name',
                                'brand', 'contract_id', 'order_id', 'style_no',
                                'article', 'classify', 'material', 'order_num',
                                'percent', 'deli_date', 'merchandier',
                                'approved', 'assign_num', 'box_ins',
                                'point_notes', 'style_drawing', 'size_chart',
                                'accessory_list', 'process_quota',
                                'process_desc', 'pattern_code', 'verify',
                                'prod_plan', 'num_detail_list', 'state'])
            });

    ordCombo.on('select', function() {
                var value = ordCombo.getValue();
                ordBasStore.load({
                            params : {
                                seq_no : value,
                                start : 0,
                                limit : 999
                            }
                        });
            });

    // 选择订单的时候加载订单信息
    ordBasStore.on('load', function() {
                var recoder = ordBasStore.getAt(0);
                custCombo.setValue(recoder.get('cust_id'));
                Ext.getCmp('style_no').setValue(recoder.get('style_no'));
                Ext.getCmp('brand').setValue(recoder.get('brand'));
                Ext.getCmp('classify').setValue(recoder.get('classify'));
                Ext.getCmp('order_num').setValue(recoder.get('order_num'));
                Ext.getCmp('ribbon_color')
                        .setValue(recoder.get('ribbon_color'));
                Ext.getCmp('contract_id').setValue(recoder.get('contract_id'));
                Ext.getCmp('batch').setValue(recoder.get('batch'));
                Ext.getCmp('article').setValue(recoder.get('article'));
                Ext.getCmp('add_proportion').setValue(recoder.get('percent'));
                Ext.getCmp('material').setValue(recoder.get('material'));
                Ext.getCmp('notity_date').setValue(recoder.get('order_date'));
            });

    /** 订单数* */
    var ordStore = new Ext.data.Store({});

    var ordsm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });

    var ordcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),ordsm, {
                header : '国家',
                dataIndex : 'country',
                align : 'center',
                width : 40,
                editor : new Ext.form.TextField({
                            allowBlank : false
                        })
            }, {
                header : '颜色',
                dataIndex : 'color',
                align : 'center',
                width : 40,
                editor : new Ext.form.TriggerField({
                            allowBlank : false
                        })
            }, {
                header : '内长',
                dataIndex : 'in_length',
                align : 'center',
                width : 40,
                sortable : true,
                editor : new Ext.form.TriggerField({
                            allowBlank : false
                        })
            }]);

    // 表格工具栏
    var ordtbar = new Ext.Toolbar({
                items : [{
                            text : '添加订单数量信息',
                            id : 'prodOrd_submit_button2',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                enterAddForm();
                            }
                        }, '-', {
                            text : '取消订单数信息',
                            id : 'prodOrd_cancel_button2',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                deleteOrdData();
                            }
                        }, '-', '重要提示：修改结束后请<b>按回车键确认输入</b>']
            });

    // 表格实例
    var ordGrid = new Ext.grid.EditorGridPanel({
                id : 'ordGrid',
                title : '订单数量信息',
                height : 170,
                border : true,
                frame : true,
                autoEncode : true,
                autoScroll : true,
                region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
                store : ordStore, // 数据存储
                stripeRows : true, // 斑马线
                cm : ordcm, // 列模型
                sm : ordsm,
                pruneModifiedRecords : true,
                tbar : ordtbar, // 表格工具栏
                viewConfig : {
                    forceFit : true
                },
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                }
            });

    ordGrid.on('afteredit', function(e) {
                var value = e.value;
                var field = e.field;
                var row = e.row;

                if (field != 'country' && field != 'color'
                        && field != 'in_length') {
                    if (Ext.isEmpty(insOrdStore.getAt(row).get(field))) {
                        var add_proportion = Ext.getCmp('add_proportion')
                                .getValue();// 加裁比例
                        var add_num = (1 + add_proportion / 100) * value + '';
                        var add_nums = add_num.split('.');
                        if (add_nums.length > 1) {
                            add_num = add_num.substring(0, add_nums[0].length
                                            + 2);
                        }
                        insOrdStore.getAt(row).set(field,
                                Math.round(parseFloat(add_num)));
                    }
                } else {
                    insOrdStore.getAt(row).set(field, value);
                }
                updatePordNum();
            });

    /** 指令数* */
    var insOrdsm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });

    var insOrdcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),insOrdsm, {
                header : '国家',
                dataIndex : 'country',
                align : 'center',
                width : 40,
                editor : new Ext.form.TextField({
                            allowBlank : false
                        })
            }, {
                header : '颜色',
                dataIndex : 'color',
                align : 'center',
                width : 40,
                editor : new Ext.form.TextField({
                            allowBlank : false
                        })
            }, {
                header : '内长',
                dataIndex : 'in_length',
                align : 'center',
                width : 40,
                sortable : true,
                editor : new Ext.form.TextField({
                            allowBlank : false
                        })
            }]);

    var insOrdStore = new Ext.data.Store({});

    // 表格工具栏
    var insOrdtbar = new Ext.Toolbar({
                items : [{
                            text : '添加指令数量信息',
                            id : 'prodOrd_submit_button1',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                enterAddForm();
                            }
                        }, '-', {
                            text : '取消指令数量信息',
                            id : 'prodOrd_cancel_button1',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                deleteInsData();
                            }
                        }, '-', '重要提示：修改结束后请<b>按回车键确认输入</b>']
            });

    // 表格实例
    var insOrdGrid = new Ext.grid.EditorGridPanel({
                title : '指令数量信息',
                height : 170,
                frame : true,
                border : true,
                autoEncode : true,
                autoScroll : true,
                region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
                store : insOrdStore, // 数据存储
                stripeRows : true, // 斑马线
                cm : insOrdcm, // 列模型
                sm : insOrdsm,
                pruneModifiedRecords : true,
                tbar : insOrdtbar, // 表格工具栏
                viewConfig : {
                    forceFit : true
                },
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                }
            });

    insOrdGrid.on('afteredit', function(e) {
                var value = e.value;
                var field = e.field;
                var row = e.row;

                if (Ext.isEmpty(ordStore.getAt(row).get(field))) {
                    ordStore.getAt(row).set(field, value);
                }
                updatePordNum();
            });
    /**
     * 订单数量明细
     */
    var prodBasInfo_prodOrdInfo = new Ext.Panel({
                layout : 'form',
                id : 'prodBasInfo_prodOrdInfo',
                title : '',
                defaults : {
                    frame : false,
                    border : false,
                    heigth : 30
                },
                items : [{
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '完单号',
                                                    readOnly : true,
                                                    id : 'prod_ord_seq_prod',
                                                    name : 'prod_ord_seq_prod'
                                                }]
                                    }, {
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '订单号',
                                                    readOnly : true,
                                                    id : 'ord_seq_no_prod',
                                                    name : 'ord_seq_no_prod'
                                                }]
                                    }, {
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '款号',
                                                    readOnly : true,
                                                    id : 'style_no_prod',
                                                    name : 'style_no_prod'
                                                }]
                                    }, {
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '订单数',
                                                    allowDecimals : false,
                                                    allowNegative : false,
                                                    id : 'ord_num_prod',
                                                    name : 'ord_num_prod',
                                                    readOnly : true
                                                }]
                                    }, {
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '指令数',
                                                    allowDecimals : false,
                                                    allowNegative : false,
                                                    id : 'ins_num_prod',
                                                    name : 'ins_num_prod',
                                                    readOnly : true
                                                }]
                                    }]
                        }]
            })
    /**
     * 处理产品信息的订单数和指令数<br/> 界面显示的时候执行一次 修改订单数量和指令数量 调用此函数<br/>
     */
    function updatePordNum() {
        var ins_num = 0;
        var ord_num = 0;
        var ins_numLength = insOrdStore.getRange().length;
        var ord_numLength = ordStore.getRange().length;
        var columnsValue = colValue.split(',');
        var columnsValueLength = columnsValue.length;
        for (var i = 0; i < columnsValueLength; i++) {
            if (columnsValue[i] == '') {
                continue;
            }
            for (var k = 0; k < ins_numLength; k++) {
                ins_num += insOrdStore.getAt(k).get('num' + columnsValue[i]) == ''
                        ? 0
                        : parseInt(insOrdStore.getAt(k).get('num'
                                + columnsValue[i]));
                ord_num += ordStore.getAt(k).get('num' + columnsValue[i]) == ''
                        ? 0
                        : parseInt(ordStore.getAt(k).get('num'
                                + columnsValue[i]));
            }
        }
        // 重置订单数和指令数
        Ext.getCmp('ins_num_prod').setValue(ins_num);
        Ext.getCmp('ord_num_prod').setValue(ord_num);
    }

    var filePanel = new Ext.FormPanel({
        title : "相关文件",
        border : false,
        region : 'center',
        labelAlign : "right",
        labelWidth : 70,
        height : 500,
        frame : true,
        items : [{
                    layout : 'column',
                    border : false,
                    items : [{
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "原始合同",
                                            allowBlank : true,
                                            id : 'orig_contract',
                                            name : 'orig_contract',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("orig_contract");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("orig_contract");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "包装指示",
                                            allowBlank : true,
                                            id : 'pack_ins',
                                            name : 'pack_ins',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("pack_ins");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("pack_ins");
                                            }
                                        }]
                            }]
                }, {
                    layout : 'column',
                    border : false,
                    items : [{
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "款式图",
                                            allowBlank : true,
                                            id : 'style_drawing',
                                            name : 'style_drawing',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("style_drawing");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("style_drawing");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "装箱指示",
                                            allowBlank : true,
                                            id : 'box_ins',
                                            name : 'box_ins',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("box_ins");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("box_ins");
                                            }
                                        }]
                            }]
                }, {
                    layout : 'column',
                    border : false,
                    items : [{
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "尺寸表",
                                            allowBlank : true,
                                            id : 'size_chart',
                                            name : 'size_chart',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("size_chart");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("size_chart");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "工序定额表",
                                            allowBlank : true,
                                            id : 'process_quota',
                                            name : 'process_quota',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("process_quota");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("process_quota");
                                            }
                                        }]
                            }]
                }, {
                    layout : 'column',
                    border : false,
                    items : [{
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "工艺说明书",
                                            allowBlank : true,
                                            id : 'process_desc',
                                            name : 'process_desc',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("process_desc");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("process_desc");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "纸样推码",
                                            allowBlank : true,
                                            id : 'pattern_code',
                                            name : 'pattern_code',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "上传文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                uploadProdOrdFile("pattern_code");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "管理文件",
                                            allowBlank : false,
                                            anchor : "84%",
                                            handler : function() {
                                                enterOrdDownForm("pattern_code");
                                            }
                                        }]
                            }]
                }, {

                    layout : 'column',
                    border : false,
                    items : [{
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : "生产许可证",
                                            allowBlank : true,
                                            id : 'production_certificate',
                                            name : 'production_certificate',
                                            readOnly : true,
                                            anchor : "94%"
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                    xtype : "button",
                                    text : "上传文件",
                                    allowBlank : false,
                                    anchor : "84%",
                                    handler : function() {
                                        uploadProdOrdFile("production_certificate");
                                    }
                                }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1, // 标签宽度
                                border : false,
                                items : [{
                                    xtype : "button",
                                    text : "管理文件",
                                    allowBlank : false,
                                    anchor : "84%",
                                    handler : function() {
                                        enterOrdDownForm("production_certificate");
                                    }
                                }]
                            }, {
                                columnWidth : 0.3,
                                layout : 'form',
                                labelWidth : 75,
                                border : false,
                                items : [{
                                            xtype : 'textfield',
                                            readOnly : true,
                                            fieldLabel : '生产通知单',
                                            id : 'prod_ord_file',
                                            name : 'prod_ord_file',
                                            anchor : '94%'
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1,
                                border : false,
                                items : [{
                                            xtype : 'button',
                                            text : '上传文件',
                                            anchor : '84%',
                                            allowBlank : false,
                                            handler : function() {
                                                uploadProdOrdFile("prod_ord_file");
                                            }
                                        }]
                            }, {
                                columnWidth : 0.1,
                                layout : 'form',
                                labelWidth : 1,
                                border : false,
                                items : [{
                                            xtype : 'button',
                                            text : '管理文件',
                                            anchor : '84%',
                                            allowBlank : false,
                                            handler : function() {
                                                enterOrdDownForm("prod_ord_file");
                                            }
                                        }]
                            }]
                }

        ]
    });

    var sew_grp_id = '', bach_grp_id = '', pack_grp_id = '';
    /** 缝制工厂下拉树 */
    var sewGrpsTree = new Ext.tree.TreePanel({
                loader : new Ext.tree.TreeLoader({
                            dataUrl : './sysGrps.ered?reqCode=belongGrpsTreeInit'
                        }),
                root : new Ext.tree.AsyncTreeNode({
                            text : '根部门',
                            id : '001',
                            expanded : true
                        }),
                autoScroll : true,
                animate : false,
                useArrows : false,
                border : false,
                rootVisible : false
            });

    // 监听下拉树的节点单击事件
    sewGrpsTree.on('click', function(node) {
                sewGrpsCombo.setValue(node.text);
                sew_grp_id = node.attributes.id;

                sewGrpsCombo.collapse();
            });

    var sewGrpsCombo = new Ext.form.ComboBox({
        store : new Ext.data.SimpleStore({
                    fields : [],
                    data : [[]]
                }),
        name : 'sew_fac_name',
        id : 'sew_fac_name',
        fieldLabel : '缝制工厂' + re,
        allowBlank : false,
        editable : false,
        value : ' ',
        anchor : '95%',
        mode : 'local',
        triggerAction : 'all',
        maxHeight : 390,
        listWidth : 200,
        // 下拉框的显示模板,belognGrpsTreeDiv作为显示下拉树的容器
        tpl : "<tpl for='.'><div style='height:390px'><div id='sewGrpsTreeDiv'></div></div></tpl>",
        onSelect : Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    sewGrpsCombo.on('expand', function() {
                // 将UI树挂到treeDiv容器
                sewGrpsTree.render('sewGrpsTreeDiv');
                sewGrpsTree.root.expand(); // 只是第一次下拉会加载数据
            });

    /** 水洗工厂下拉树 */
    var bachGrpsTree = new Ext.tree.TreePanel({
                loader : new Ext.tree.TreeLoader({
                            dataUrl : './sysGrps.ered?reqCode=belongGrpsTreeInit'
                        }),
                root : new Ext.tree.AsyncTreeNode({
                            text : '根部门',
                            id : '001',
                            expanded : true
                        }),
                autoScroll : true,
                animate : false,
                useArrows : false,
                border : false,
                rootVisible : false
            });

    // 监听下拉树的节点单击事件
    bachGrpsTree.on('click', function(node) {
                bachGrpsCombo.setValue(node.text);
                bach_grp_id = node.attributes.id;

                bachGrpsCombo.collapse();
            });

    var bachGrpsCombo = new Ext.form.ComboBox({
        store : new Ext.data.SimpleStore({
                    fields : [],
                    data : [[]]
                }),
        fieldLabel : '水洗工厂',
        editable : false,
        value : ' ',
        name : 'bach_fac_name',
        id : 'bach_fac_name',
        anchor : '95%',
        mode : 'local',
        triggerAction : 'all',
        maxHeight : 390,
        listWidth : 200,
        // 下拉框的显示模板,belognGrpsTreeDiv作为显示下拉树的容器
        tpl : "<tpl for='.'><div style='height:390px'><div id='bachGrpsTreeDiv'></div></div></tpl>",
        onSelect : Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    bachGrpsCombo.on('expand', function() {
                // 将UI树挂到treeDiv容器
                bachGrpsTree.render('bachGrpsTreeDiv');
                bachGrpsTree.root.expand(); // 只是第一次下拉会加载数据
            });

    /** 后整工厂下拉树 */
    var packGrpsTree = new Ext.tree.TreePanel({
                loader : new Ext.tree.TreeLoader({
                            dataUrl : './sysGrps.ered?reqCode=belongGrpsTreeInit'
                        }),
                root : new Ext.tree.AsyncTreeNode({
                            text : '根部门',
                            id : '001',
                            expanded : true
                        }),
                autoScroll : true,
                animate : false,
                useArrows : false,
                border : false,
                rootVisible : false
            });

    // 监听下拉树的节点单击事件
    packGrpsTree.on('click', function(node) {
                packGrpsCombo.setValue(node.text);
                pack_grp_id = node.attributes.id;

                packGrpsCombo.collapse();
            });

    var packGrpsCombo = new Ext.form.ComboBox({
        store : new Ext.data.SimpleStore({
                    fields : [],
                    data : [[]]
                }),
        fieldLabel : '后整工厂',
        name : 'pack_fac_name',
        id : 'pack_fac_name',
        editable : false,
        value : ' ',
        anchor : '95%',
        mode : 'local',
        triggerAction : 'all',
        maxHeight : 390,
        listWidth : 200,
        // 下拉框的显示模板,belognGrpsTreeDiv作为显示下拉树的容器
        tpl : "<tpl for='.'><div style='height:390px'><div id='packGrpsTreeDiv'></div></div></tpl>",
        onSelect : Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    packGrpsCombo.on('expand', function() {
                // 将UI树挂到treeDiv容器
                packGrpsTree.render('packGrpsTreeDiv');
                packGrpsTree.root.expand(); // 只是第一次下拉会加载数据
            });
    //产品分类下拉框
    var classifyCombo = new Ext.form.ComboBox({
        id : 'classifyCombo',
        hiddenName : 'classify',
        name:'classify',
        fieldLabel:'产品分类',
        anchor:'90%',
        mode:'local',
        triggerAction:'all',
        store:new Ext.data.ArrayStore({
            fields:['text'],
            data:[['牛仔'],['色布'],['染色']]
        }),
        displayField:'text',
        valueField:'text',
        editable:false,
        value:''
    })
    /**
     * 第一行信息：区域，跟单员，制单员，制单日期
     */
    var ordPersonInfoPanel = new Ext.Panel({
                layout : 'column',
                defaults : {
                    labelAlign : 'right',
                    frame : false,
                    border : false,
                    bodyStyle : 'padding-top:3',
                    labelWidth : 65
                },
                border : false,
                items : [{
                            columnWidth : 0.1,
                            layout : 'form',
                            items : [{
                                        xtype : 'textfield',
                                        fieldLabel : '区域' + re,
                                        id : 'area_no',
                                        name : 'area_no',
                                        allowBlank : false,
                                        anchor : '95%'
                                    }]
                        }, {
                            columnWidth : 0.15,
                            layout : 'form',
                            items : [{
                                        xtype : 'datefield',
                                        fieldLabel : 'FOB交期',
                                        format : 'Y-m-d',
                                        id : 'fob_deal_date',
                                        name : 'fob_deal_date',
                                        editable:false,
                                        anchor : '95%'
                                    }]
                        }, {
                            columnWidth : 0.15,
                            layout : 'form',
                            items : [{
                                        xtype : 'datefield',
                                        fieldLabel : '尾查期',
                                        format : 'Y-m-d',
                                        id : 'check_prod_date',
                                        name : 'check_prod_date',
                                        editable:false,
                                        anchor : '95%'
                                    }]
                        }, {
                            columnWidth : 0.15,
                            layout : 'form',
                            items : [{
                                        xtype : 'textfield',
                                        fieldLabel : '出运方式',
                                        id : 'transportation_way',
                                        name : 'transportation_way',
                                        anchor : '95%'
                                    }]
                        }, {
                            columnWidth : 0.15,
                            layout : 'form',
                            items : [{
                                        xtype : 'textfield',
                                        fieldLabel : '跟单员',
                                        id : 'opr_merchandiser',
                                        name : 'opr_merchandiser',
                                        anchor : '95%'
                                    }]
                        }, {
                            columnWidth : 0.15,
                            layout : 'form',
                            items : [{
                                        xtype : "textfield",
                                        fieldLabel : '制单员',
                                        id : "opr_name",
                                        name : 'opr_name',
                                        anchor : '95%'

                                    }]
                        }, {
                            columnWidth : 0.15,
                            layout : 'form',
                            items : [{
                                        xtype : 'datefield',
                                        fieldLabel : '制单日期',
                                        format : 'Y-m-d',
                                        id : 'opr_date',
                                        name : 'opr_date',
                                        editable:false,
                                        anchor : '95%'
                                    }]
                        }]
            });

    /**
     * 订单基本信息
     */
    var ordBasInfoPanel = new Ext.Panel({
                layout : 'form',
                title : '订单基本信息',
                id : 'ordBasInfoPanel',
                defaults : {
                    labelAlign : 'right',
                    frame : false,
                    border : false,
                    height : 29,
                    bodyStyle : 'padding-top:5'
                },
                width : '100%',
                height : '100%',
                autoScroll : true,
                items : [{
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '完单号' + re,
                                                    allowBlank : false,
                                                    id : 'prod_ord_seq',
                                                    name : 'prod_ord_seq',
                                                    anchor : "90%"
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '面料',
                                                    id : 'material',
                                                    name : 'material',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '合同号',
                                                    id : 'contract_id',
                                                    name : 'contract_id',
                                                    anchor : "90%"
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '面料缩率J%',
                                                    id : 'percent_j',
                                                    name : 'percent_j',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '分单号(批次)',
                                                    id : 'batch',
                                                    name : 'batch',
                                                    anchor : "90%"
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '面料缩率W%',
                                                    id : 'percent_w',
                                                    name : 'percent_w',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : "textfield",
                                                    fieldLabel : '订单号PO' + re,
                                                    id : 'ord_seq_no',
                                                    name : 'ord_seq_no',
                                                    anchor : '90%'
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '加裁比例%',
                                                    id : 'add_proportion',
                                                    name : 'add_proportion',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [custCombo]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '丝带色号',
                                                    id : 'ribbon_color',
                                                    name : 'ribbon_color',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '款号',
                                                    id : "style_no",
                                                    name : 'style_no',
                                                    anchor : "90%"
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        border : false,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '通知日期',
                                                    format : 'Y-m-d',
                                                    id : "notity_date",
                                                    name : 'notity_date',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '品名',
                                                    id : 'article',
                                                    name : 'article',
                                                    anchor : "90%"
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '总数',
                                                    allowDecimals : false,
                                                    allowNegative : false,
                                                    id : 'order_num',
                                                    name : 'order_num',
                                                    anchor : "90%"
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [classifyCombo]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '溢装%',
                                                    allowDecimals : true,
                                                    allowNegative : false,
                                                    id : 'more_clause',
                                                    name : 'more_clause',
                                                    anchor : "90%",
                                                    renderer:function(value){
                                                        if(value!=""){
                                                            return value*100;
                                                        }
                                                        return value;
                                                    }
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '洗水工艺',
                                                    id : 'wash',
                                                    name : 'wash',
                                                    anchor : "90%"
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'numberfield',
                                                    fieldLabel : '短装%',
                                                    allowDecimals : true,
                                                    allowNegative : false,
                                                    id : 'less_clause',
                                                    name : 'less_clause',
                                                    anchor : "90%",
                                                    renderer:function(value){
                                                        if(value!=""){
                                                            return value*100;
                                                        }
                                                        return value;
                                                    }
                                                }, {
                                                    xtype : 'textfield',
                                                    hidden : true,
                                                    id : 'prod_plan_seq',
                                                    name : 'prod_plan_seq'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 1,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'radiogroup',
                                                    id : 'prodstatus',
                                                    name : 'prodstatus',
                                                    columns : [.18, .18, .18],
                                                    fieldLabel : '订单状态',
                                                    items : [{
                                                                inputValue : '0',
                                                                name : 'prodstatus',
                                                                boxLabel : '未排产'
                                                            }, {
                                                                inputValue : '1',
                                                                name : 'prodstatus',
                                                                boxLabel : '在产中'
                                                            }, {
                                                                inputValue : '2',
                                                                name : 'prodstatus',
                                                                boxLabel : '已交货'
                                                            }]
                                                }]
                                    }]
                        }]
            })
    /**
     * 生产进度计划
     */
    var ordPlanInfoPanel = new Ext.Panel({
                layout : 'form',
                title : '生产进度计划',
                id : 'ordPlanInfoPanel',
                defaults : {
                    frame : false,
                    labelAlign : 'right',
                    border : false,
                    height : 30,
                    bodyStyle : 'padding-top:5'
                },
                autoScroll : true,
                items : [{
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [sewGrpsCombo]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '缝制起始日期',
                                                    format : 'Y-m-d',
                                                    id : 'sew_start_date',
                                                    name : 'sew_start_date'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    border : false,
                                                    height : 26
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '缝制交货日',
                                                    format : 'Y-m-d',
                                                    id : 'sew_delivery_date',
                                                    name : 'sew_delivery_date'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [bachGrpsCombo]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '水洗交货日',
                                                    format : 'Y-m-d',
                                                    id : 'bach_delivery_date',
                                                    name : 'bach_delivery_date'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [packGrpsCombo]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '后整收获日',
                                                    format : 'Y-m-d',
                                                    id : 'pack_delivery_date',
                                                    name : 'pack_delivery_date'
                                                }]
                                    }]
                        }]
            });

    /**
     * 审核记录
     */
    var planCheckInfoPanel = new Ext.Panel({
                layout : 'form',
                title : '审核记录',
                id : 'planCheckInfoPanel',
                border : false,
                defaults : {
                    labelAlign : 'right',
                    frame : false,
                    height : 29,
                    bodyStyle : 'padding-top:5'
                },
                autoScroll : true,
                items : [{
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '计划审批',
                                                    id : 'plan_check',
                                                    name : 'plan_check',
                                                    anchor : '95%'
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '计划审批日期',
                                                    format : 'Y-m-d',
                                                    id : 'plan_check_date'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '采购审批',
                                                    id : 'purchase_check',
                                                    name : 'purchase_check',
                                                    anchor : '95%'
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '采购审批日期',
                                                    format : 'Y-m-d',
                                                    id : 'purchase_check_date',
                                                    name : 'purchase_check_date'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '技术审批',
                                                    id : 'tech_check',
                                                    name : 'tech_check',
                                                    anchor : '95%'
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '技术审批日期',
                                                    format : 'Y-m-d',
                                                    id : 'tech_check_date',
                                                    name : 'tech_check_date'
                                                }]
                                    }]
                        }, {
                            layout : 'column',
                            border : false,
                            items : [{
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '贸易审批',
                                                    id : 'trade_check',
                                                    name : 'trade_check',
                                                    anchor : '95%'
                                                }]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        border : false,
                                        items : [{
                                                    xtype : 'datefield',
                                                    fieldLabel : '贸易审批日期',
                                                    format : 'Y-m-d',
                                                    id : 'trade_check_date',
                                                    name : 'trade_check_date'
                                                }]
                                    }, {
                                        xtype : "textfield",
                                        hidden : true,
                                        id : 'seq_no',
                                        name : 'seq_no',// 生产通知单序号
                                        anchor : "100%"
                                    }]
                        }]
            })
    /**
     * 生产通知单底部信息：尺寸，大货洗水流程，重要提示
     */
    var prodOrdInfoFootPanel = new Ext.Panel({
        layout : 'form',
        title : '',
        height : 200,
        defaults : {
            labelAlign : 'right'
        },
        autoScroll : false,
        items : [{
                    id : 'columnplan',
                    layout : 'column',
                    anchor : '100%',
                    border : false,
                    bodyStyle : 'padding:5',
                    items : [{
                                columnWidth : 0.7,
                                layout : 'form',
                                labelWidth : 80, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "textfield",
                                            fieldLabel : '腰围' + re,
                                            emptyText : '尺码格式请分别用逗号隔开',
                                            allowBlank : false,
                                            id : 'column',
                                            name : 'column',
                                            anchor : "90%"
                                        }]
                            }, {
                                columnWidth : 0.2,
                                layout : 'form',
                                labelWidth : 15, // 标签宽度
                                border : false,
                                items : [{
                                            xtype : "button",
                                            text : "设置尺码",
                                            id : 'setSizeButton',
                                            allowBlank : false,
                                            anchor : "90%",
                                            handler : function() {
                                                setColumnsData();
                                            }
                                        }]
                            }]
                }, {
                    layout : 'column',
                    border : false,
                    items : [{
                                columnWidth : 0.7,
                                layout : 'form',
                                border : false,
                                bodyStyle : 'padding:5',
                                items : [{
                                            xtype : 'textfield',
                                            fieldLabel : '大货洗水流程',
                                            emptyText : '洗水厂填',
                                            labelWidth : 80,
                                            anchor : '90%',
                                            id : 'wash_stream',
                                            name : 'wash_stream'
                                        }]
                            }]
                }, new Ext.Panel({
                            layout : 'form',
                            title : '重要提示(可多项提示)',
                            heigth : 90,
                            items : [{
                                        layout : 'column',
                                        items : [{
                                                    columnWidth : 1,
                                                    layout : 'form',
                                                    items : [{
                                                                xtype : 'textarea',
                                                                hideLabel : true,
                                                                id : 'remark',
                                                                name : 'remark',
                                                                height : 80,
                                                                width : '100%'
                                                            }]
                                                }]
                                    }]
                        })]
    });
    /**
     * 生产通知单基本信息panel
     */
    var prodOrdInfoPanel = new Ext.form.FormPanel({
                id : 'prodOrdInfoPanel',
                title : '订单基本信息',
                defaults : {
                    frame : false,
                    labelAlign : 'right'
                },
                autoScroll : true,
                items : [{
                            // 顶部
                            border : false,
                            height : 32,
                            labelAlign : 'right',
                            items : [ordPersonInfoPanel]
                        }, {
                            // 中
                            layout : 'column',
                            height : 318,
                            items : [{
                                        // 中左
                                        columnWidth : 0.5,
                                        border : false,
                                        autoScroll : true,
                                        layout : 'form',
                                        height : 350,
                                        items : [ordBasInfoPanel]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        height : 350,
                                        items : [{
                                                    // 中右上
                                                    border : false,
                                                    autoScroll : true,
                                                    items : [ordPlanInfoPanel]
                                                }, {
                                                    // 中右下
                                                    border : false,
                                                    autoScroll : true,
                                                    items : [planCheckInfoPanel]
                                                }]
                                    }]
                        }, {
                            // 下
                            height : 200,
                            labelAlign : 'right',
                            frame : true,
                            items : [prodOrdInfoFootPanel]
                        }]
            })
    // ~订单基本信息结束

    var ordDetailNumPanel = new Ext.FormPanel({
                title : '订单数量数量明细',
                id : 'ordDetailNumPanel',
                labelAlign : "right",
                labelWidth : 70,
                frame : true,
                defaults : {
                    border : false,
                    frame : false
                },
                autoScroll : true,
                items : [{
                            height : 30,
                            border : false,
                            items : [prodBasInfo_prodOrdInfo]
                        }, ordGrid, insOrdGrid]

            })
    // ~订单数量数量明细结束

    /**
     * 订单详细信息
     */
    var prodOrdPanel = new Ext.TabPanel({
                title : '订单详细信息',
                region : 'center',
                items : [prodOrdInfoPanel, ordDetailNumPanel, filePanel]
            });
    prodOrdPanel.on('tabchange', function(tabPanel, panel) {
        if (panel.id.indexOf('ordDetailNumPanel') != -1) {
            var prod_ordBasInfoStr = ['prod_ord_seq', 'ord_seq_no', 'style_no'];
            var prod_ordBasInfoRecord = new Ext.data.Record();
            var prod_ordBasInfoLength = prod_ordBasInfoStr.length;
            for (var k = 0; k < prod_ordBasInfoLength; k++) {
                if (Ext.isEmpty(Ext.getCmp(prod_ordBasInfoStr[k]))) {
                    continue;
                }
                prod_ordBasInfoRecord.set(prod_ordBasInfoStr[k] + '_prod', Ext
                                .getCmp(prod_ordBasInfoStr[k]).getValue())
            }
            ordDetailNumPanel.getForm().loadRecord(prod_ordBasInfoRecord);
        }
    });

    var codeWindow = new Ext.Window({
        layout : 'fit',
        id : 'prodOrdWindow',
        width : 1360,
        height : 400,
        resizable : false,
        draggable : true,
        title : '<span style="font-weight:normal">新增生产通知单 <span>' + rs,
        iconCls : 'page_addIcon',
        modal : true,
        closeAction : 'hide',
        closable : true,
        collapsible : false,
        titleCollapse : true,
        maximizable : false,
        maximized : true,
        labelAlign : 'center',
        buttonAlign : 'right',
        border : false,
        animCollapse : true,
        animateTarget : Ext.getBody(),
        constrain : true,
        items : [prodOrdPanel],
        buttons : [{
            text : '导出',
            id : 'ordPlanExceprot',
            iconCls : 'page_excelIcon',
            handler : function() {
                var prod_ord_seq = Ext.getCmp('prod_ord_seq').getValue();
                exportExcel('./prodOrd.ered?reqCode=prodPlanExport&prod_ord_seq='
                        + prod_ord_seq);
            }
        }, {
            text : '保存',
            iconCls : 'acceptIcon',
            handler : function() {
                if (!prodOrdInfoPanel.form.isValid()) {
                    Ext.Msg
                            .alert('数据不完整，请检查必填数据(带<span color:"red">*</span>为必填项)');
                    return;
                }
                enterOrdAddForm();
            }
        }, {
            text : '重置',
            id : 'resetButton',
            iconCls : 'tbar_synchronizeIcon',
            handler : function() {
                clearForm(prodOrdInfoPanel.getForm());
                // 清空3个数量
                ordStore.removeAll();
                insOrdStore.removeAll();
            }
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
                if (prodOrdInfoPanel.form.isDirty()) {
                    Ext.Msg.confirm("提示信息",
                            "是否返回保存信息(如果点'否!'则可能修改或者填写的信息会丢失)<br/>'", function(
                                    btn, text) {
                                if (btn == 'no') {
                                    codeWindow.hide();
                                }
                            });
                } else {
                    codeWindow.hide();
                }
            }
        }]
    });

    codeWindow.on('show', function() {

                // 当窗口开始显示的时候重新设置列头信息
                ordGrid.getColumnModel().setConfig(ordColumnModel);

                insOrdGrid.getColumnModel().setConfig(insColumnModel);
                // 重置数据
                prodOrdPanel.setActiveTab(0);
                updatePordNum();
            });

    window.onresize = function(event) {
        // insOrdGrid.setHeight(document.body.clientHeight-290-87);
        // ordGrid.setHeight(document.body.clientHeight-290-87);
    }

    codeWindow.on('hide', function() {// 关闭的时候重现设置标签页展示
                prodOrdPanel.setActiveTab(0);
            });

    // 增加行记录
    function enterAddForm() {
        var insOrd = new Ext.data.Record({
                    country : "",
                    color : "",
                    in_length : ""
                });
        var ord = new Ext.data.Record({
                    country : "",
                    color : "",
                    in_length : ""
                });
        if (Ext.isEmpty(columnsValue)) {
            for (var i = 1; i < 11; i++) {
                insOrd.set("num" + i, "");
                ord.set("num" + i, "");
            }
        } else {
            for (var i = 0; i < columnsValue.length; i++) {
                insOrd.set("num" + columnsValue[i], "");
                ord.set("num" + columnsValue[i], "");
            }
        }
        ordStore.add(ord);
        insOrdStore.add(insOrd);
    }

    // 删除数据
    function deleteOrdData() {
        var rows = ordGrid.getSelectionModel().getSelections();

        if (Ext.isEmpty(rows)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        // 删除其他列表中的对应行
        for (var i = 0; i < rows.length; i++) {
            var record = rows[i];
            var rownum = ordStore.indexOf(record);
            ordStore.removeAt(rownum);
            insOrdStore.removeAt(rownum);
        }
    }

    var columnKeyList = new Array("country", "color", "in_length");

    // 设置列头信息
    function setColumnsData() {
        if (Ext.isEmpty(Ext.getCmp('column').getValue())) {
            Ext.MessageBox.alert('提示', '请输入列的设置信息');
            return;
        }
        var column = Ext.getCmp('column').getValue();
        if (colValue == column) {//
            return;
        } else {
            colValue = column;
        }

        ordStore.removeAll();
        insOrdStore.removeAll();
        columnKeyList.length = 0;
        columnKeyList.push('country');
        columnKeyList.push('color');
        columnKeyList.push('in_length');

        columnsValue = colValue.split(',');

        if (columnsValue[columnsValue.length - 1] == ',') {
            Ext.Msg.alert('提示', '最后不能以\",\"结尾!');
            return;
        }
        var ordColumn = [];
        var insColumn = [];
        ordColumn.push(new Ext.grid.CheckboxSelectionModel({
                    singleSelect : false
                }));
        ordColumn.push({
                    header : '国家',
                    dataIndex : 'country',
                    align : 'center',
                    width : 40,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        ordColumn.push({
                    header : '颜色',
                    dataIndex : 'color',
                    align : 'center',
                    width : 40,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        ordColumn.push({
                    header : '内长',
                    dataIndex : 'in_length',
                    align : 'center',
                    width : 40,
                    sortable : true,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        for (var i = 0; i < columnsValue.length; i++) {
            ordColumn.push({
                        header : columnsValue[i],
                        dataIndex : 'num' + columnsValue[i],
                        align : 'center',
                        width : 40,
                        sortable : true,
                        editor : {
                            xtype : "spinnerfield",
                            minValue : 0,
                            allowDecimals : true,
                            decimalPrecision : 0,
                            incrementValue : 1
                        }
                    });
            columnKeyList.push('num' + columnsValue[i]);
        }
        insColumn.push(new Ext.grid.CheckboxSelectionModel({
                    singleSelect : false
                }));
        insColumn.push({
                    header : '国家',
                    dataIndex : 'country',
                    align : 'center',
                    width : 40,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        insColumn.push({
                    header : '颜色',
                    dataIndex : 'color',
                    align : 'center',
                    width : 40,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        insColumn.push({
                    header : '内长',
                    dataIndex : 'in_length',
                    align : 'center',
                    width : 40,
                    sortable : true,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        for (var i = 0; i < columnsValue.length; i++) {
            insColumn.push({
                        header : columnsValue[i],
                        dataIndex : 'num' + columnsValue[i],
                        align : 'center',
                        width : 40,
                        sortable : true,
                        editor : {
                            xtype : "spinnerfield",
                            minValue : 0,
                            allowDecimals : true,
                            decimalPrecision : 0,
                            incrementValue : 1
                        }
                    });
            columnKeyList.push('num' + columnsValue[i]);
        }
        ordGrid.getColumnModel().setConfig(ordColumn);

        insOrdGrid.getColumnModel().setConfig(insColumn);

    }

    // 删除数据
    function deleteInsData() {
        var rows = insOrdGrid.getSelectionModel().getSelections();
        if (Ext.isEmpty(rows)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        // 删除其他列表中的对应行
        for (var i = 0; i < rows.length; i++) {
            var record = rows[i];
            var rownum = insOrdStore.indexOf(record);
            ordStore.removeAt(rownum);
            insOrdStore.removeAt(rownum);
        }
    }

    // 确认增加
    function enterOrdAddForm() {
        // 数据检查
        var order_num = Ext.getCmp('order_num').getValue();
        var order_num_prod = Ext.getCmp('ord_num_prod').getValue();
        if (order_num != order_num_prod) {
            Ext.MessageBox.alert('信息提示', '订单数和总数不一致 请检查');
            return;
        }
        //判断客户是否正确  支持填写客户编号
        var comboValue = custCombo.getValue();
        var cust_id = '';
        if(Ext.isEmpty(comboValue)){
            Ext.Msg.alert('提示','请选择客户/品牌');
            return;
        }
        if(!isNaN(comboValue)){ //判断获取的值是数值的情况 防止手动写入数值  不是数值的客户都是错误的数据
            custStore.each(function(record){
                var custValue = record.get('value');
                if(custValue==comboValue){
                    cust_id = custValue;
                    return false;
                }
             })
        }
        if(Ext.isEmpty(cust_id)){
            Ext.Msg.alert('提示','请选择正确的客户/品牌');
            return;
        }
        
        // ~数据检查结束

        // 获取文件
        var orig_contract = getFile('orig_contract');
        var style_drawing = getFile('style_drawing');
        var size_chart = getFile('size_chart');
        var process_desc = getFile('process_desc');
        var pack_ins = getFile('pack_ins');
        var box_ins = getFile('box_ins');
        var process_quota = getFile('process_quota');
        var pattern_code = getFile('pattern_code');
        var production_certificate = getFile('production_certificate');
        var prod_ord_file = getFile('prod_ord_file');

        // 判断并获取服装的数量信息
        var ordRecords = ordStore.getRange();
        var insOrdRecords = insOrdStore.getRange();
        var ordRecordStr = "[", insOrdRecordStr = "[";
        if (ordRecords.length != insOrdRecords.length) {
            Ext.Msg.alert('提示', '数量数据不对应!请修改!');
            return;
        } else {
            for (var i = 0; i < ordRecords.length; i++) {
                ordRecordStr = ordRecordStr + "{";
                insOrdRecordStr = insOrdRecordStr + "{";

                var ordRecord = ordRecords[i];
                var insOrdRecord = insOrdRecords[i];
                for (var j = 0; j < columnKeyList.length; j++) {
                    var key = columnKeyList[j];
                    if (key == 'color' || key == 'in_length') {
                        if (ordRecord.get(key) != insOrdRecord.get(key)) {
                            Ext.Msg.alert('提示', '数量数据不对应!请修改!');
                            return;
                        }
                    }
                    ordRecordStr = ordRecordStr + "'" + key + "':'"
                            + ordRecord.get(key) + "',";
                    insOrdRecordStr = insOrdRecordStr + "'" + key + "':'"
                            + insOrdRecord.get(key) + "',";
                }
                if (ordRecordStr.length > 1) {
                    ordRecordStr = ordRecordStr.substring(0,
                            ordRecordStr.length - 1);
                }
                ordRecordStr = ordRecordStr + "},";

                if (insOrdRecordStr.length > 1) {
                    insOrdRecordStr = insOrdRecordStr.substring(0,
                            insOrdRecordStr.length - 1);
                }
                insOrdRecordStr = insOrdRecordStr + "},";
            }
            if (ordRecordStr.length > 1) {
                ordRecordStr = ordRecordStr.substring(0, ordRecordStr.length
                                - 1);
            }
            ordRecordStr = ordRecordStr + "]";

            if (insOrdRecordStr.length > 1) {
                insOrdRecordStr = insOrdRecordStr.substring(0,
                        insOrdRecordStr.length - 1);
            }
            insOrdRecordStr = insOrdRecordStr + "]";
        }

        var params = prodOrdInfoPanel.getForm().getValues();
        params.cust_id = custCombo.getValue();
        params.orig_contract = orig_contract;
        params.style_drawing = style_drawing;
        params.size_chart = size_chart;
        params.process_desc = process_desc;
        params.pack_ins = pack_ins;
        params.box_ins = box_ins;
        params.process_quota = process_quota;
        params.pattern_code = pattern_code;
        params.production_certificate = production_certificate;
        params.prod_ord_file = prod_ord_file;
        params.ordRecordStr = ordRecordStr;
        params.insOrdRecordStr = insOrdRecordStr;
        params.colValue = colValue;
        params.flag = prod_ord_flag;
        params.is_used = is_used;
        params.sew_fac = sew_grp_id;
        params.bach_fac = bach_grp_id;
        params.pack_fac = pack_grp_id;
        //显示的数据和保存的数据的转换：溢装和短装,加载比例,面料缩率J，面料缩率W
        var less_clauseNum = Ext.getCmp('less_clause').getValue();
        if(!Ext.isEmpty(less_clauseNum)){
            less_clauseNum = toFixedForNumber(less_clauseNum/100,4);
        }
        var more_clauseNum = Ext.getCmp('more_clause').getValue();
        if(!Ext.isEmpty(more_clauseNum)){
            more_clauseNum = toFixedForNumber(more_clauseNum/100,4);
        }
        var add_proportionNum = Ext.getCmp('add_proportion').getValue();
        if(!Ext.isEmpty(add_proportionNum)){
            add_proportionNum = toFixedForNumber(add_proportionNum/100,4);
        }
        var percent_jNum = Ext.getCmp('percent_j').getValue();
        if(!Ext.isEmpty(percent_jNum)){
            percent_jNum = toFixedForNumber(percent_jNum/100,4);
        }
        var percent_wNum = Ext.getCmp('percent_w').getValue();
        if(!Ext.isEmpty(percent_wNum)){
            percent_wNum = toFixedForNumber(percent_wNum/100,4);
        }
        params.percent_w=percent_wNum;
        params.percent_j=percent_jNum;
        params.add_proportion=add_proportionNum;
        params.less_clause=less_clauseNum;
        params.more_clause=more_clauseNum;
        
        // 提交信息提示
        var subProdNum = Ext.getCmp('ins_num_prod').getValue()
                - parseFloat(Ext.getCmp('ord_num_prod').getValue());
        Ext.MessageBox.show({
                    title : '信息提示',
                    msg : '制单员:'
                            + Ext.getCmp('opr_name').getValue()
                            + '<br/>订单号:'
                            + Ext.getCmp('ord_seq_no').getValue()
                            + '<br/>通知单号:'
                            + Ext.getCmp('prod_ord_seq').getValue()
                            + '<br/>订单总数:'
                            + Ext.getCmp('order_num').getValue()
                            + '<br/>指令总数:'
                            + Ext.getCmp('ins_num_prod').getValue()
                            + '<br/>要求加裁:'
                            + Ext.getCmp('add_proportion').getValue()
                            + '%'
                            + '<br/>实际加裁:'
                            + ((subProdNum / parseFloat(Ext
                                    .getCmp('ord_num_prod').getValue())) * 100)
                                    .toFixed(2) + '%',
                    buttons : {
                        ok : '确认',
                        cancel : '取消'
                    },
                    fn : function(buttionId, text) {
                        if (buttionId == 'cancel') {
                            return;
                        } else if (buttionId == 'ok') {
                            Ext.MessageBox.show({
                                title:'提示信息',
                                msg:'正在保存信息............'
                            });
                            Ext.Ajax.request({
                                url : './prodOrd.ered?reqCode=saveProdOrdInfo',
                                success : function(response) { // 回调函数有1个参数
                                    var resultArray = Ext.util.JSON
                                            .decode(response.responseText);
                                    if (resultArray.success) {
                                        Ext.Msg.alert('提示',
                                                resultArray.msg);
                                        insOrdStore.removeAll();
                                        ordStore.removeAll();
                                        clearForm(prodOrdInfoPanel
                                                .getForm());
                                        Ext.getCmp('prodOrdWindow')
                                                .hide();
                                        Ext.getCmp('prodOrdGrid')
                                                .getStore().reload();

                                    } else {
                                        Ext.Msg.alert('提示',
                                                resultArray.msg);
                                    }
                                },
                                failure : function(response) {
                                    Ext.Msg.alert('提示通知单保存失败');
                                },
                                params : params
                            });
                        }
                    }
                });

    }

    var addPanel = new Ext.form.FormPanel({
                id : 'formpanel4Imp',
                name : 'formpanel4Imp',
                defaultType : 'textfield',
                labelWidth : 99,
                frame : true,
                labelAlign : 'right',
                fileUpload : true,
                items : [new Ext.ux.form.FileUploadField({
                                    fieldLabel : '请选择上传文件',
                                    buttonText : '上传',
                                    name : 'theFile',
                                    id : 'EmpInfoTheFile',
                                    blankText : "上传文件",
                                    anchor : '94%'
                                }), {
                            name : 'file_type',
                            id : 'file_type',
                            hidden : true,
                            allowBlank : true,
                            anchor : '99%'
                        }, {
                            name : 'prod_ord_seq',
                            hidden : true,
                            allowBlank : true,
                            anchor : '99%'
                        }]
            });

    var addWindow = new Ext.Window({
        layout : 'fit',
        width : 380,
        height : 160,
        resizable : false,
        draggable : true,
        closeAction : 'hide',
        title : '上传文件',
        modal : true,
        collapsible : true,
        titleCollapse : true,
        maximizable : false,
        buttonAlign : 'right',
        border : false,
        animCollapse : true,
        animateTarget : Ext.getBody(),
        constrain : true,
        items : [addPanel],
        buttons : [{
            text : '导入',
            iconCls : 'acceptIcon',
            handler : function() {
                var theFile = Ext.getCmp('EmpInfoTheFile').getValue();
                if (Ext.isEmpty(theFile)) {
                    Ext.Msg.alert('提示', '请先选择您要导入文件。');
                    return;
                }
                var file_type = Ext.getCmp('file_type').getValue();

                var file_name = Ext.getCmp(file_type).getValue();// 对应表单中的已存在的文件的名字

                addPanel.getForm().submit({
                    url : './prodOrd.ered?reqCode=uploadFile',
                    waitTitle : '提示',
                    method : 'POST',
                    waitMsg : '正在处理数据,请稍候...',
                    success : function(form, action) {
                        Ext.MessageBox.alert('提示', action.result.msg);
                        addWindow.hide();
                        var string = file_name == ""
                                ? getFile('EmpInfoTheFile')
                                : (file_name + "," + getFile('EmpInfoTheFile'));
                        Ext.getCmp(file_type).setValue(string);

                        if ('update' == prod_ord_flag) {// 修改模式下刷新单元格
                            queryOrdItem();
                        }
                    },
                    failure : function(form, action) {
                        var msg = action.result.msg;
                        Ext.MessageBox.alert('提示', '文件上传失败:<br>' + msg);
                    },
                    params : {
                        exist_file_name : file_name,
                        prod_ord_flag : prod_ord_flag
                        // 生产通知单所处状态
                    }
                });

            }
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
                addWindow.hide();
            }
        }]
    });

    var file_sm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });

    var file_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            file_sm, {
                header : '文件类别',
                align : 'left',
                dataIndex : 'file_type',
                width : 130,
                renderer : function(value) {
                    if (value == 'orig_contract') {
                        return '原始合同'
                    } else if (value == 'process_quota') {
                        return '工序定额'
                    } else if (value == 'pattern_code') {
                        return '纸样推码'
                    } else if (value == 'style_drawing') {
                        return '款式图'
                    } else if (value == 'size_chart') {
                        return '尺寸表'
                    } else if (value == 'process_desc') {
                        return '工艺说明书'
                    } else if (value == 'pack_ins') {
                        return '包装指示'
                    } else if (value == 'box_ins') {
                        return '装箱指示'
                    } else if (value == 'production_certificate') {
                        return '生产许可证'
                    } else if (value == 'prod_ord_file') {
                        return '生产通知单'
                    }
                }
            }, {
                header : '文件名称',
                align : 'left',
                dataIndex : 'file_name',
                width : 100
            }, {
                header : '删除文件',
                dataIndex : 'delete',
                align : 'center',
                width : 80,
                renderer : function(value) {
                    return "<a href='javascript:void(0);'><img src='"
                            + webContext
                            + "/resource/image/ext/delete.png'/></a>";
                }
            }, {
                header : '下载文件',
                dataIndex : 'download',
                align : 'center',
                width : 80,
                renderer : function(value) {
                    return "<a href='javascript:void(0);'><img src='"
                            + webContext
                            + "/resource/image/ext/accept.png'/></a>";
                }
            }]);
    var file_store = new Ext.data.Store();

    var file_grid = new Ext.grid.GridPanel({
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                height : 200,
                stripeRows : true,
                frame : true,
                cm : file_cm,
                sm : file_sm,
                viewConfig : {
                    forceFit : true
                },
                // tbar: [
                // {
                // text: '删除',
                // iconCls: 'deleteIcon',
                // xtype: "button",
                // handler: function () {
                //
                // }
                // },
                // {
                // text: '载',
                // iconCls: 'acceptIcon',
                // xtype: "button",
                // handler: function () {
                //
                // }
                // }
                // ],
                store : file_store,
                autoScroll : true
            });

    file_grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
        var file_store = grid.getStore();
        var record = file_store.getAt(rowIndex);
        var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
        if (fieldName == 'delete') {
            var file_name = record.get('file_name');
            var file_type = record.get('file_type');
            var seq_no = record.get('seq_no');
            Ext.Msg.confirm('确认', '你确定要删除' + file_name + '文件吗?', function(btn,
                    text) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                                url : './prodOrd.ered?reqCode=deleteFileInfo',
                                success : function(response) { // 回调函数有1个参数
                                    var resultArray = Ext.util.JSON
                                            .decode(response.responseText);
                                    if (!resultArray.success) {
                                        Ext.MessageBox.alert("提示信息", '删除失败');
                                        return;
                                    }
                                    Ext.MessageBox.alert('提示信息', '删除成功')
                                    // 替换名字
                                    var name = Ext.getCmp(file_type).getValue();
                                    var length = name.split(",").length;
                                    if (length == 1) {
                                        Ext.getCmp(file_type).setValue();
                                    } else {
                                        if (seq_no == 1) {
                                            Ext.getCmp(file_type).setValue(name
                                                    .replace((file_name + ","),
                                                            ""));
                                        } else {
                                            Ext.getCmp(file_type).setValue(name
                                                    .replace(("," + file_name),
                                                            ""));
                                        }
                                    }

                                    file_store.remove(record);

                                    if ('update' == prod_ord_flag) {// 修改模式下刷新单元格
                                        queryOrdItem();
                                    }

                                },
                                failure : function(response) {
                                    Ext.Msg.alert('文件删除失败!');
                                },
                                params : {
                                    prod_ord_flag : prod_ord_flag,// 生产通知单的模式
                                    prod_ord_seq : record.get('prod_ord_seq'),
                                    file_type : file_type,
                                    seq_no : seq_no,
                                    file_name : file_name
                                }
                            });
                }
            });
        } else if (fieldName == 'download') {
            if (prod_ord_flag == 'add') {// 新增模式下
                Ext.Msg.alert('提示', '新增模式下不能下载!');
            } else {
                var checkUrl = './prodOrd.ered?reqCode=checkDownFile'+ 
                        '&prod_ord_seq=' + record.get('prod_ord_seq')+
                        '&file_type='+ record.get('file_type') + 
                        '&seq_no='+ record.get('seq_no') + 
                        '&file_name='+ record.get('file_name');
                var downUrl = './prodOrd.ered?reqCode=downFileInfo'+ 
                        '&prod_ord_seq=' + record.get('prod_ord_seq')+
                        '&file_type='+ record.get('file_type') + 
                        '&seq_no='+ record.get('seq_no') + 
                        '&file_name='+ record.get('file_name');
                Ext.Ajax.request({
                    url:checkUrl,
                    success:function(value){
                        var result = Ext.util.JSON.decode(value.responseText);
                        if(result.success){
                            window.location.href = downUrl; //文件下载
                        }else if(!result.success){
                            Ext.Msg.alert("提示信息","文件下载失败");
                        }
                    },
                    failure:function(){
                        Ext.Msg.alert("提示信息","文件下载失败");
                    }
                });
            };
        }
    });

    // 批量登记窗口
    var file_window = new Ext.Window({
                layout : 'fit',
                width : 800,
                height : 400,
                shadow : false,
                closeAction : 'hide',
                resizable : false,
                draggable : false,
                title : '文件管理',
                modal : true,
                collapsible : false,
                titleCollapse : false,
                maximizable : false,
                buttonAlign : 'right',
                border : false,
                animCollapse : false,
                animateTarget : Ext.getBody(),
                constrain : true,
                items : [file_grid]
            });

    function uploadProdOrdFile(file_type) {
        addPanel.getForm().findField('prod_ord_seq').setValue(Ext
                .getCmp('prod_ord_seq').getValue());// 上传的表单中加入生产通知单编号
        Ext.getCmp("file_type").setValue(file_type);
        addWindow.show();
    }

    /** 管理文件 */
    function enterOrdDownForm(file_type) {
        if (prod_ord_flag == 'add') {
            Ext.MessageBox.alert('提示', '新增时无法管理文件!');
            return;
        }
        var fileNames = Ext.getCmp(file_type).getValue();
        if (Ext.isEmpty(fileNames)) {
            Ext.Msg.alert('信息提示', '没有文件进行管理');
            return;
        }
        var prod_ord_seq = Ext.getCmp('prod_ord_seq').getValue();
        if (!Ext.isEmpty(fileNames) || fileNames.split(",").length > 1) {
            file_window.show();
            file_store.removeAll();
            var arr = fileNames.split(",");
            for (var i = 0; i < arr.length; i++) {
                var p = new Ext.data.Record({
                            seq_no : (i + 1),
                            file_name : arr[i],
                            prod_ord_seq : prod_ord_seq,
                            file_type : file_type
                        });
                file_store.add(p);
            }
        } else {
            window.location.href = './prodOrd.ered?reqCode=downFileInfo&prod_ord_seq='
                    + prod_ord_seq + "&file_type=" + file_type + "&seq_no=1";
        }
    }

    /** 获取文件名 */
    function getFile(String) {
        var string = '';
        var data = Ext.getCmp(String).getValue();
        if (!Ext.isEmpty(data)) {
            var name = data.split("\\");
            if (name.length > 0) {
                string = name[name.length - 1];
            }
        }
        return string;
    }

    function addProdOrdDataInit() {
        prod_ord_flag = 'add';
        is_used = '0';// 没有使用
        colValue = '';// 列信息为空

        ordStore.removeAll();
        insOrdStore.removeAll();

        var obj1 = prodOrdInfoPanel.getForm().getFieldValues();
        for (var a in obj1) {
            prodOrdInfoPanel.getForm().findField(a).setValue('');
        }
        var obj1 = ordDetailNumPanel.getForm().getFieldValues();
        for (var a in obj1) {
            ordDetailNumPanel.getForm().findField(a).setValue('');
        }
        var obj1 = filePanel.getForm().getFieldValues();
        for (var a in obj1) {
            filePanel.getForm().findField(a).setValue('');
        }

        // 显示更改数量信息的组件
        // 数据重置
        ordColumnModel = [];
        insColumnModel = [];

        ordtbar.show();
        insOrdtbar.show();
        codeWindow.show();

        Ext.getCmp('columnplan').show();
        Ext.getCmp('resetButton').show();
        Ext.getCmp('ordPlanExceprot').hide();
        Ext.getCmp("prodOrdWindow")
                .setTitle('<span style="font-weight:normal">新增生产通知单 <span>'
                        + rs);
        //设置新增模式下的按钮属性
        Ext.getCmp('ord_seq_no').setReadOnly(false);
        Ext.getCmp('prod_ord_seq').setReadOnly(false);

    }

    /** 修改窗口 初始化 */
    function updateProdOrdDataInit(recordBean) {
        // 数据清空
        clearFormPanel(prodOrdInfoPanel);
        clearFormPanel(ordDetailNumPanel);
        clearFormPanel(filePanel);

        prod_ord_flag = 'update';
        var records = grid.getSelectionModel().getSelections();

        if (records.length > 1) {
            Ext.MessageBox.alert("提示", "不能选择多条生产通知单修改");
            return;
        }
        if (Ext.isEmpty(records)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        var recordO = records[0];
        //需要修改的时候查询订单号
        changeProdStore.reload({
            params:{
               prod_ord_seq: recordO.get("prod_ord_seq")
            },
            callback:function(){
                 if(changeProdStore.getRange().length>0){
                   recordO = changeProdStore.getRange()[0];
                   loadChangeData(recordO);
                   changeProdStore.removeAll();
                 }else{
                   Ext.Msg.alert("提示信息","生产通知单不存在");
                   return;
                }
            }
        })
       
    }

    // 删除数据
    function deleteProdOrdData() {
        var record = grid.getSelectionModel().getSelected();
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
        store.load({
                    params : {
                        start : 0,
                        limit : bbar.pageSize,
                        isManageProdOrd : 'yes',
                        isHistory:isHistory?'yes':'no',
                        ord_seq_no : Ext.getCmp('ord_seq_no_query').getValue(),
                        style_no : Ext.getCmp('style_no_query').getValue(),
                        prod_ord_seq : Ext.getCmp('prod_ord_seq_query').getValue(),
                        prodstatus:Ext.getCmp('prodStatusLovCombo').getValue()
                    }
                });
    }
    // 添加页面变换时的监听
    Ext.EventManager.onWindowResize(function() {
                fillBrowser(prodOrdPanel);
            });

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
        // ~彻底删除数据
    //加载修改的数据
    function loadChangeData(recordO){
        var record = recordO.copy();
        //处理显示的数据
        var less_clauseNum = record.get('less_clause');
        if(!Ext.isEmpty(less_clauseNum)){
            less_clauseNum = toFixedForNumber(less_clauseNum*100,2);
        }
        var more_clauseNum = record.get('more_clause');
        if(!Ext.isEmpty(more_clauseNum)){
            more_clauseNum = toFixedForNumber(more_clauseNum*100,2);
        }
        var percent_wNum = record.get('percent_w');
        if(!Ext.isEmpty(percent_wNum)){
            percent_wNum = toFixedForNumber(percent_wNum*100,2);
        }
        var percent_jNum = record.get('percent_j');
        if(!Ext.isEmpty(percent_jNum)){
            percent_jNum = toFixedForNumber(percent_jNum*100,2);
        }
        var add_proportionNum = record.get('add_proportion');
        if(!Ext.isEmpty(add_proportionNum)){
            add_proportionNum = toFixedForNumber(add_proportionNum*100,2);
        }
        record.set('percent_w',percent_wNum);
        record.set('percent_j',percent_jNum);
        record.set('add_proportion',add_proportionNum);
        record.set('less_clause',less_clauseNum);
        record.set('more_clause',more_clauseNum);
        
        is_used = record.get('is_used');
        sew_grp_id = record.get('sew_fac');
        bach_grp_id = record.get('bach_fac');
        pack_grp_id = record.get('pack_fac');
        // 载入生产通知单订单数,指令数(载入的时候组装列头信息)
        ordNumStore.load({
                    params : {
                        ord_seq_no : record.get('ord_seq_no').toString(),
                        prod_ord_seq : record.get('prod_ord_seq').toString()
                    }
                });

        prodInsNumStore.load({
                    params : {
                        ord_seq_no : record.get('ord_seq_no').toString(),
                        prod_ord_seq : record.get('prod_ord_seq').toString()
                    }
                });

        Ext.getCmp('resetButton').hide();
        prodOrdInfoPanel.getForm().loadRecord(record);
        filePanel.getForm().loadRecord(record);
        //修改模式下的按钮设置        
        Ext.getCmp('ord_seq_no').setReadOnly(true);
        Ext.getCmp('prod_ord_seq').setReadOnly(true);
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
        //处理完初始化数据，重新加载数据
        clearMyOrdersHis();
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
        //处理毛坯数据
//        if(myprodord.match(',.*').length>0){
//            myprodord = myprodord.substring(1,myprodord.length);
//        }
//        if(myorder.match(',.*').length>0){
//            myorder = myorder.substring(1,myorder.length);
//        }
//        if(myorderInOrder.match(',.*').length>0){
//            myorderInOrder = myorderInOrder.substring(1, myorderInOrder.length)
//        }
    }
    //初始化重新查询时候我的订单信息
    function clearMyOrdersHis(){
        myprodord = "";
        myorder = "";
        myorderInOrder = "";
    }
    //加载完毕执行初始化数据的函数
    queryOrdItem();
});