/*******************************************************************************
 * 创建日期: 2013-05-08 创建作者：may 功能：订单日进度 最后修改时间： 修改记录：
 ******************************************************************************/
Ext.onReady(function() {
    // 用来标志标签的激活状态
    var changeFlag = true;
    

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
            dataUrl: './custBas.ered?reqCode=getCustBasInfoTreeActionWithChecked'
        }),
        autoScroll : true,
        useArrows : false,
        border : false,
        rootVisible : false
    });
    var queryCustPanelType = '';
    cust_tree.on('click', function(node) {
        var custArr = cust_tree.getChecked();
        // 封装查询的工厂信息
        var custs = [];
        for(var idx=0;idx<custArr.length;idx++){
            if(custArr[idx].leaf){
                var custBean = custArr[idx];
                custs.push(custBean.id.substr(4,custBean.length))
            }
        }
        var params = {
            cust_ids : custs.join(',')
        }
        loadStore4ordStore(params);
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
    
    ordStore.on('load', function() {
    	if(typeof(window.parent.directOrdIndex)=="number"&&typeof(window.parent.directOrdIndex)!="string"){
       	var record=window.parent.directOrdList[window.parent.directOrdIndex];
       	check_ord_seq_no = record.json.ord_seq_no;
    	updateOrdScheData();
        updateProdOrdShortData();
        updateChartData();
        //跳转后清除跳转记录，方便正常使用查询框
        //window.parent.directOrdIndex='';
    	}
    })

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

//    var ordGrid = new Ext.grid.GridPanel({
//        autoScroll : true,
//        region : 'center',
//        store : ordStore,
//        border : true,
//        title : '订单信息',
//        loadMask : {
//            msg : '正在加载表格数据,请稍等...'
//        },
//        stripeRows : true,
//        cm : ordCm,
//        sm : ordSm,
//        bbar : ordBbar
//    });
//    ordGrid.on('rowdblclick', function() {
//        queryWindowConfirm();
//    });
/**
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
    */
    function queryWindowConfirm(records) {
    	if(records.length>1){
    		alert('请选择单条记录');
    		return;
    	}
        check_ord_seq_no = records[0].get('order_id');
        updateOrdScheData();
        updateProdOrdShortData();
        updateChartData();
        codeWindow.hide();
    }
    
    var check_ord_seq_no;
    var check_prod_ord_seq;
    // isProdOrd:true 利用订单号查询完单号,订单号-完单号界面
    // false：利用完单号查询详细短缺情况，完单号短缺详细信息界面
    var isProdOrd = false;

    /**
     * 更新进度短缺详情信息
     */
    function updateProdOrdShortData() {
        ordShortageDetail_store.reload({
            params : {
                start : 0,
                limit : ordShortageDetail_bbar.pageSize,
                flag : 'prod_ord_seq',
                startdate : Ext.getCmp('startdate').getValue(),
                enddate : Ext.getCmp('enddate').getValue(),
                ord_seq_no : check_ord_seq_no,
                isFill:'yes' //默认为填充数据
            }
        });
    }
    // ~短缺信息更新任务结束
    var detail_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });
    var detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
        header : '订单号',
        dataIndex : 'ord_seq_no',
        width : 100
    }, {
        header : '款号',
        dataIndex : 'style_no',
        width : 100
    }, {
        header : '日期',
        dataIndex : 'tr_date',
        width : 100
    }, {
        header : '订单数',
        dataIndex : 'order_num',
        width : 60
    }, {
        header : '指令数',
        dataIndex : 'ins_num',
        width : 60
    }, {
        header : '实裁数',
        dataIndex : 'real_cut_num',
        width : 60,
        renderer : function(text,param2,record){
        	var nature = '1';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '领片数',
        dataIndex : 'draw_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '2';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '下线数',
        dataIndex : 'sew_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '3';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '送水洗',
        dataIndex : 'sew_delivery_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '13';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '水洗收数',
        dataIndex : 'bach_accept_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '4';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '水洗交数',
        dataIndex : 'bach_delivery_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '5';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '后整收数',
        dataIndex : 'pack_accept_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '6';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '交成品数',
        dataIndex : 'f_product_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '7';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '交B品数',
        dataIndex : 'b_product_num',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '8';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '收成品',
        dataIndex : 'receive_f_product',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '10';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '收B品',
        dataIndex : 'receive_b_product',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '11';
            return addListeners4cm(text,nature,record)
        }
    },{
       header:'出运成品',
       dataIndex:'sendout_f_product',
       width:60,
        renderer : function(text,param2,record){
            var nature = '14';
            return addListeners4cm(text,nature,record)
        }
    },{
       header:'出运B品',
       dataIndex:'sendout_b_product',
       width:60,
        renderer : function(text,param2,record){
            var nature = '15';
            return addListeners4cm(text,nature,record)
        }
    }, {
        header : '中间领用',
        dataIndex : 'middle_take',
        width : 60,
        renderer : function(text,param2,record){
            var nature = '12';
            return addListeners4cm(text,nature,record)
        }
    }]);

    var detail_store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : './ordSche.ered?reqCode=getOrdDaySche'
        }),
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT',
            root : 'ROOT'
        }, ['ord_seq_no','cust_name','opr_merchandiser', 'tr_date', 'fob_deal_date', 'ins_num', 'order_num',
                'real_cut_num', 'draw_num', 'sew_num', 'bach_accept_num',
                'bach_delivery_num', 'pack_accept_num', 'f_product_num',
                'b_product_num', 'receive_f_product', 'receive_b_product',
                'middle_take', 'sew_delivery_num', 'sendout_f_product',
                'sendout_b_product','style_no','real_cut_fac',
                'draw_fac', 'sew_fac', 'bach_accept_fac', 'bach_delivery_fac',
                'pack_accept_fac', 'f_product_fac', 'b_product_fac',
                'receive_f_fac', 'receive_b_fac', 'middle_take_fac',
                'sew_delivery_fac','sendout_f_fac','sendout_b_fac'])
    });

    // 翻页排序时带上查询条件
    detail_store.on('beforeload', function() {
        this.baseParams = {
            startdate : Ext.getCmp('startdate').getValue(),
            enddate : Ext.getCmp('enddate').getValue()
        };
    });

    /**
     * 加载完成后重置图片
     */
    var ordStreamData = ['real_cut_num', 'draw_num','sew_num', 'sew_delivery_num',
            'bach_accept_num', 'bach_delivery_num', 'pack_accept_num',
            'f_product_num', 'b_product_num', 'receive_f_product',
            'receive_b_product', 'sendout_f_product','sendout_b_product','middle_take'];
    var natureName = ['实裁数', '领片数','下线数', '送水洗', '水洗收数', '水洗交数', '后整收数', '交成品数',
            '交B品数', '收成品', '收B品','出运成品','出运B品', '中间领用']
    var facName = ['real_cut_fac','draw_fac', 'sew_fac', 'sew_delivery_fac',
            'bach_accept_fac', 'bach_delivery_fac', 'pack_accept_fac',
            'f_product_fac', 'b_product_fac', 'receive_f_fac', 'receive_b_fac',
            'sendout_f_fac','sendout_b_fac','middle_take_fac'];
    var ordStreamDataSize = ordStreamData.length;
    var everyDayInfo = [];
    var ordDayChartTitle = '订单日进度图';
    var ordDayChartSubTitle = '款号:指令数：  ';
    var ordScheChartSeries = [];
    var ordScheChartPiesSeries = [];
    var ordScheChartData = [];
    // 饼图的数据
    var ordScheChartPieData = [];
    var ordScheChartNum = [];
    // 中和的数据
    var neutralizeSeries = [];
    // 回退的数据
    var backData = [];
    var backSeries = [];
    // 补齐的数据
    var fillData = [];
    var fillDataSeries = [];
    // x轴信息
    var xAjisCategories = [];
    var ordScheChartTitle = '订单完成进度图';
    var ordScheChartSubTitle = '款号:指令数:';
    detail_store.on('load', function() {
        // 重置数据
        everyDayInfo = [];
        ordScheChartSeries = [];
        ordScheChartData = [];
        ordScheChartPiesSeries = [];
        ordScheChartPieData = [];
        ordScheChartNum = [];
        neutralizeSeries = [];
        backData = [];
        backSeries = [];
        fillData = [];
        fillDataSeries = [];
        xAjisCategories = [];
        // 重置图标标题信息
        storeSize = detail_store.getRange().length;
        if (storeSize <= 0) {
            ordDayChartTitle = check_ord_seq_no + '  订单日进度图';
            ordDayChartSubTitle = '没有订单流程数据';
            ordScheChartTitle = check_ord_seq_no + ' 订单完成进度图';
            ordScheChartSubTitle = '没有订单流程数据';
            redrawOrdDayChart(everyDayInfo, ordDayChartTitle,
                    ordDayChartSubTitle);
            return;
        }
        var chart_ins_num = detail_store.getAt(0).get('ins_num');
        var style_no = detail_store.getAt(0).get('style_no');
        var fob_deal_date = detail_store.getAt(0).get('fob_deal_date');
        var cust_name=detail_store.getAt(0).get('cust_name');
        var opr_merchandiser=detail_store.getAt(0).get('opr_merchandiser');
        ordDayChartTitle = check_ord_seq_no + '  订单日进度图';
        ordDayChartSubTitle = '款号:' + style_no + '  FOB日期  ' + fob_deal_date
                + '  指令数：' + chart_ins_num+'   客户:'+cust_name+'   跟单员:'+opr_merchandiser;
        ordScheChartTitle = check_ord_seq_no + ' 订单完成进度图';
        ordScheChartSubTitle = '款号:' + style_no + '  FOB日期:' + fob_deal_date
                + '  指令数：' + chart_ins_num+'   客户:'+cust_name+'   跟单员:'+opr_merchandiser;

        // 处理x轴数据
        for (var i = 0; i < storeSize; i++) {
            oneDayInfo = [];
            ordDayBean = detail_store.getAt(i).json;
            for (var k = 0; k < ordStreamDataSize; k++) {
                var nature_num = parseInt(ordDayBean[ordStreamData[k]]);
                oneDayInfo[k] = nature_num;
                if (ordScheChartNum.length <= k) {
                    ordScheChartNum[k] = nature_num;
                } else {
                    ordScheChartNum[k] += nature_num;
                }
            }
            everyDayInfo[i] = {
                data : oneDayInfo,
                name : ordDayBean.tr_date
            };
        };	
		
        //对日期进行排序
        everyDayInfo = orderByOrdDaySche(everyDayInfo);
        
        var record4xAjis = detail_store.getAt(0);
        for (var k = 0; k < facName.length; k++) {
            xAjisCategories[k] = natureName[k] + "<br/>"
                    + record4xAjis.get(facName[k]) + "<br/>数量："
                    + ordScheChartNum[k];
        }
        // 处理负数数据
        var index4BackData = 0;
        for (var i = 0; i < storeSize; i++) {
            backData = [];
            var hasBackData = false;
            ordDayBean = detail_store.getAt(i).json;
            for (var k = 0; k < ordStreamDataSize; k++) {
                var nature_num = parseInt(ordDayBean[ordStreamData[k]]);
                if (nature_num < 0) {
                    backData[k] = nature_num;
                    hasBackData = true;
                } else {
                    backData[k] = 0;
                }
            }
            if (hasBackData) {
                backSeries[index4BackData] = {
                    data : backData,
                    name : ordDayBean.tr_date
                }
                index4BackData += 1;
            }
        }

        // 处理订单完成进度图的数据
        for (var k = 0; k < ordStreamDataSize; k++) {
            ordScheChartData[k] = {
                y : parseFloat((ordScheChartNum[k] / chart_ins_num * 100)
                        .toFixed(2)),
                num : ordScheChartNum[k]
            };
            ordScheChartPieData[k] = {
                y : parseFloat((ordScheChartNum[k] / chart_ins_num * 100)
                        .toFixed(2)),
                num : ordScheChartNum[k],
                name : natureName[k],
                facname : record4xAjis.get(facName[k])
            };
        }
        ordScheChartPiesSeries[0] = {
            data : ordScheChartPieData,
            name : '流程饼图'
        }
        ordScheChartSeries[0] = {
            data : ordScheChartData,
            name : '数据'
        };
        // 中和的数据
        neutralizeSeries[0] = {
            data : ordScheChartNum,
            name : '数据'
        }
        // 填补的数据
        for (var k = 0; k < ordScheChartNum.length; k++) {
            fillData[k] = ordScheChartNum[k];
        }
        fillDataF(fillData);
        // 重新画图
        redrawOrdDayChart(everyDayInfo, ordDayChartTitle, ordDayChartSubTitle);
    });

    function fillDataF(resouseData) {
        var streamObj = {
            real_cut_num : 0,
            draw_num : 1,
            sew_num : 2,
            sew_delivery_num : 3,
            bach_accept_num : 4,
            bach_delivery_num : 5,
            pack_accept_num : 6,
            f_product_num : 7,
            b_product_num : 8,
            receive_f_product : 9,
            receive_b_product : 10,
            middle_take : 11
        }
        if (resouseData.length == 0) {
            return;
        }
        // 数据填补
        if ((resouseData[10] - resouseData[8]) > 0) {
            resouseData[8] = resouseData[10];
        }
        if ((resouseData[9] - resouseData[7]) > 0) {
            resouseData[7] = resouseData[7];
        }
        if ((resouseData[8] - resouseData[6] + resouseData[7]) > 0) {
            resouseData[6] = resouseData[8] + resouseData[7];
        }
        if ((resouseData[5] != 0 || resouseData[4] != 0 || resouseData[3] != 0)) {
            if ((resouseData[6] - resouseData[5]) > 0) {
                resouseData[5] = resouseData[6];
            }
            if ((resouseData[5] - resouseData[4]) > 0) {
                resouseData[4] = resouseData[5];
            }
            if ((resouseData[4] - resouseData[3]) > 0) {
                resouseData[3] = resouseData[4];
            }
            if ((resouseData[3] - resouseData[2]) > 0) {
                resouseData[2] = resouseData[3];
            }
        } else {
            if ((resouseData[6] - resouseData[2]) > 0) {
                resouseData[2] = resouseData[6];
            }
            resouseData[3] = 0;
            resouseData[4] = 0;
            resouseData[5] = 0
        }
        if ((resouseData[2] - resouseData[1]) > 0) {
            resouseData[1] = resouseData[2];
        }
        if ((resouseData[1] - resouseData[0]) > 0) {
            resouseData[0] = resouseData[1];
        }
        for (var k = 0; k < resouseData.length; k++) {
            fillData[k] = resouseData[k];
        }
        fillDataSeries[0] = {
            data : fillData,
            name : '填补数据'
        }
    }

    // ~图片重置数据处理结束
    var detail_pagesize_combo = new Ext.form.ComboBox({
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
        value : 50,
        editable : false,
        width : 85
    });

    var detail_number = parseInt(detail_pagesize_combo.getValue());
    detail_pagesize_combo.on("select", function(comboBox) {
        detail_bbar.pageSize = parseInt(comboBox.getValue());
        detail_number = parseInt(comboBox.getValue());
        detail_store.reload({
            params : {
                start : 0,
                limit : detail_bbar.pageSize,
                ord_seq_no : check_ord_seq_no
            }
        });
    });

    var detail_bbar = new Ext.PagingToolbar({
        pageSize : detail_number,
        store : detail_store,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', detail_pagesize_combo]
    });

    var summary = new Ext.ux.grid.GridSummary();

    var detail_grid = new Ext.grid.GridPanel({
        height : 510,
        border : true,
        store : detail_store,
        plugins : [summary], // 合计
        title : '日进度详情',
        region : 'center',
        loadMask : {
            msg : '正在加载表格数据,请稍等...'
        },
        viewConfig : {
            forceFit : true
        },
        stripeRows : true,
        border : false,
        margins : '3 3 3 3',
        cm : detail_cm,
        tbar : ['->', {
            text : '导出记录',
            id : 'import_button',
            iconCls : 'page_excelIcon',
            handler : function() {
                exportExcel('./ordSche.ered?reqCode=exportOrdDaySche');
            }
        }]
    });
    var ordShortPanel = new Ext.Panel({
        title : '订单进度短缺图',
        tbar : [{
            text : "<SPAN STYLE='font:normal 10pt Arial'>数据填充</SPAN>",
            iconCls : 'page_findIcon',
            xtype : "button",
            handler : function() {
                ordShortageDetail_store.load({
                    params : {
                        start : 0,
                        limit : ordShortageDetail_bbar.pageSize,
                        flag : 'prod_ord_seq',
                        ord_seq_no : check_ord_seq_no,
                        isFill : 'yes'
                    }
                });
            }
        }, {
            text : "<SPAN STYLE='font:normal 10pt Arial'>数据还原</SPAN>",
            iconCls : 'page_findIcon',
            xtype : 'button',
            handler : function() {
                ordShortageDetail_store.load({
                    params : {
                        start : 0,
                        limit : ordShortageDetail_bbar.pageSize,
                        flag : 'prod_ord_seq',
                        ord_seq_no : check_ord_seq_no
                    }
                });
            }
        }],
        html : '<div id="ordShortChart"></div>',
        region : 'center'
    });
    var ordSchePanel = new Ext.Panel({
                title : '订单完成进度图',
                tbar : [{
                    xtype : 'button',
                    text : '显示柱状图',
                    handler : function() {
                        redrawOrdScheChart4Param(ordScheChartSeries,
                                ordScheChartTitle, ordScheChartSubTitle, 0);
                    }
                }, '-', {
                    xtype : 'button',
                    text : '显示饼图',
                    handler : function() {
                        redrawOrdScheChart4Param(ordScheChartPiesSeries,
                                ordScheChartTitle, ordScheChartSubTitle, 1);
                    }
                }],
                html : '<div id="ordScheChart" width="100%" height="100%"></div>',
                region : 'center'
            });

    var panel = new Ext.Panel({
                title : '订单日进度图',
                tbar : ['-', {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>查询窗口</SPAN>",
                    iconCls : 'page_findIcon',
                    xtype : "button",
                    handler : function() {
                    	showQueryWindow();
//                        codeWindow.show();
//                        loadStore4ordStore();
                    }
                },'-', {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>上一订单</SPAN>",
                    id : "pre",
                    iconCls : 'page_findIcon',
                    xtype : "button",
                    disabled : true,
                    handler : function() {
						window.parent.directOrdIndex=window.parent.directOrdIndex==0?0:window.parent.directOrdIndex-1;
                    	loadStore4forward();
                    	Ext.getCmp("next").setDisabled(false);
                    	if(window.parent.directOrdIndex==0)
                    	Ext.getCmp("pre").setDisabled(true);
                    }
                },'-', {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>下一订单</SPAN>",
                    iconCls : 'page_findIcon',
                    id : "next",
                    xtype : "button",
                    disabled : true,
                    handler : function() {
                        window.parent.directOrdIndex=window.parent.directOrdIndex+1;
                        loadStore4ordStore();
                        Ext.getCmp("pre").setDisabled(false);
                        if(window.parent.directOrdIndex==window.parent.directOrdList.length-1)
                        Ext.getCmp("next").setDisabled(true);
                    }
                },'->', {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>显示回退数据</SPAN>",
                    iconCls : 'page_findIcon',
                    xtype : "button",
                    handler : function() {
                        if (backSeries.length == 0) {
                            backSeriesSubTitle = ordDayChartSubTitle
                                    + '<br/>没有回退数据'
                        }
                        redrawOrdDayChart(backSeries, ordDayChartTitle,
                                ordDayChartSubTitle);
                    }
                }, {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>显示详细数据</SPAN>",
                    iconCls : 'page_findIcon',
                    xtype : "button",
                    handler : function() {
                        redrawOrdDayChart(everyDayInfo, ordDayChartTitle,
                                ordDayChartSubTitle);
                    }
                }, {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>显示结果数据</SPAN>",
                    iconCls : 'page_findIcon',
                    xtype : "button",
                    handler : function() {
                        redrawOrdDayChart(neutralizeSeries, ordDayChartTitle,
                                ordDayChartSubTitle);
                    }
                }, {
                    text : "<SPAN STYLE='font:normal 10pt Arial'>补齐数据</SPAN>",
                    iconCls : 'page_findIcon',
                    xtype : "button",
                    handler : function() {
                        if (fillDataSeries.length == 0) {
                            var fillDataSubTitle = ordDayChartSubTitle
                                    + '<br/>没有填补数据';
                        }
                        redrawOrdDayChart(fillDataSeries, ordDayChartTitle,
                                fillDataSubTitle);
                    }
                }],
                html : '<div id="ordDayScheChart"  width="100%" height="100%"></div>',
                region : 'center'
            });

    /**
     * 短缺详情
     */
    var short_detail_store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : './ordSche.ered?reqCode=getDetailShortInfo'
        }),
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT',
            root : 'ROOT'
        }, [{
            name : 'ord_seq_no'
        }, {
            name : 'prod_ord_seq'
        }, {
            name : 'columnvalues'
        }, {
            name : 'nature'
        }, {
            name : 'nature_value'
        }, {
            name : 'color'
        }, {
            name : 'country'
        }, {
            name : 'in_length'
        }, {
            name : 'waist1'
        }, {
            name : 'waist2'
        }, {
            name : 'waist3'
        }, {
            name : 'waist4'
        }, {
            name : 'waist5'
        }, {
            name : 'waist6'
        }, {
            name : 'waist7'
        }, {
            name : 'waist8'
        }, {
            name : 'waist9'
        }, {
            name : 'waist10'
        }, {
            name : 'waist11'
        }, {
            name : 'waist12'
        }, {
            name : 'waist13'
        }, {
            name : 'waist14'
        }, {
            name : 'waist15'
        }, {
            name : 'waist16'
        }])
    });
    short_detail_store.on('load', function(store) {
        if (!isProdOrd) {
            short_back_store.removeAll();
            short_back_store.add(store.getRange());
        }
    });
    // --创建存放record的容器
    var short_back_store = new Ext.data.Store();
    var short_detail_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });
    var short_detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            short_detail_sm, {
                header : '订单号',
                dataIndex : 'ord_seq_no',
                width : 100
            }, {
                header : '完单号',
                dataIndex : 'prod_ord_seq',
                width : 100
            }, {
                header : '',
                hidden : true,
                dataIndex : 'columnvalues',
                width : 100
            }]);
    var short_nature_combo = new Ext.ux.form.LovCombo({
        name : 'value',
        id : 'nature_combo',
        hiddenName : 'value',
        store : new Ext.data.ArrayStore({
            fields : ['value', 'text'],
            data : [['draw_short_num', '领片短缺'], ['sew_short_num', '缝制短缺'],
                    ['sew_delivery_short', '缝制交短缺'],
                    ['bach_accept_short_num', '水洗收短缺'],
                    ['bach_delivery_short_num', '水洗交短缺'],
                    ['pack_accept_short_num', '后整收短缺'],
                    ['product_short_num', '后整交短缺'],
                    ['receive_f_product_short', '收成品短缺'],
                    ['receive_b_product_short', '收B品短缺']]
        }),
        mode : 'local',
        hideTrigger : false,
        triggerAction : 'all',
        valueField : 'value',
        displayField : 'text',
        emptyText : '请选择...',
        allowBlank : true,
        editable : false,
        anchor : "99%"
    });
    short_nature_combo.on('');
    var short_detail_grid = new Ext.grid.GridPanel({
                title : '短缺详情',
                height : 510,
                store : short_detail_store,
                region : 'center',
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                viewConfig : {
                    forceFit : true
                },
                stripeRows : true,
                // frame: true,
                border : false,
                cm : short_detail_cm,
                sm : short_detail_sm,
                tbar : ['短缺类型:', short_nature_combo, '-', {
                    text : '查询',
                    iconCls : 'page_findIcon',
                    handler : filterShortInfo
                }, '->', {
                    text : '导出',
                    id : 'ordScheInfo_import',
                    iconCls : 'page_excelIcon',
                    handler : function() {
                        var url = './ordSche.ered?reqCode=exportProdDetailShortInfo'
                                + '&shortNatures='
                                + short_nature_combo.getValue()
                                + '&columnValue='
                                + check_column_value
                                + '&prod_ord_seq=' + check_ord_seq_no;
                        exportExcel(url);
                    }
                }]
            });
    // ~短缺详情结束
    /**
     * 订单短缺详情 增加:zhouww
     */
    var ordShortageDetail_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });

    var ordShortageDetail_cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(), ordShortageDetail_sm, {
                header : '订单号',
                dataIndex : 'ord_seq_no',
                width : 100
            }, {
                header : '完单号',
                dataIndex : 'prod_ord_seq',
                width : 100
            }, {
                header : '客户',
                dataIndex : 'cust_name',
                width : 100
            }, {
                header : '品名',
                dataIndex : 'article',
                width : 80
            }, {
                header : '订单数',
                dataIndex : 'order_num',
                width : 60
            }, {
                header : '指令数',
                dataIndex : 'ins_num',
                width : 60
            }, {
                header : '实裁数',
                dataIndex : 'real_cut_num',
                width : 60
            }, {
                 header:'领片短缺',
                 dataIndex:'draw_short_num'
            },{
                header : '缝制短缺',
                dataIndex : 'sew_short_num',
                width : 90
            }, {
                header : '缝制交短缺',
                dataIndex : 'sew_delivery_short',
                width : 90
            }, {
                header : '水洗收短缺',
                dataIndex : 'bach_accept_short_num',
                width : 90
            }, {
                header : '水洗交短缺',
                dataIndex : 'bach_delivery_short_num',
                width : 90
            }, {
                header : '后整收短缺',
                dataIndex : 'pack_accept_short_num',
                width : 90
            }, {
                header : '后整交短缺',
                dataIndex : 'product_short_num',
                width : 90
            }, {
                header : '收成品短缺',
                dataIndex : 'receive_f_product_short',
                width : 90
            }, {
                header : '收B品短缺',
                dataIndex : 'receive_b_product_short',
                width : 90
            }, {
                 header:'成品短缺(成品应余)',
                 dataIndex:'sendout_f_short',
                 width:90
            },{
                 header:'B品短缺(B品应余)',
                 dataIndex:'sendout_b_short',
                 width:90
            },{
                dataIndex : 'column_value',
                hidden : true,
                width : 60
            }]);

    var ordShortageDetail_store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : 'ordSche.ered?reqCode=getOrdShortInfo'
        }),
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT',
            root : 'ROOT'
        }, ['ord_seq_no', 'prod_ord_seq', 'column_value', 'ins_num',
                'order_id', 'article', 'brand', 'order_date', 'cust_id',
                'cust_name', 'order_num', 'real_cut_num', 'draw_short_num',
                'sew_short_num', 'bach_accept_short_num',
                'bach_delivery_short_num', 'pack_accept_short_num',
                'product_short_num', 'receive_f_product_short',
                'receive_b_product_short', 'middle_take_short',
                'sew_delivery_short', 'style_no','sendout_f_short','sendout_b_short'])
    });
    ordShortageDetail_store.on('beforeload', function() {
        this.baseParams = {
            flag : 'prod_ord_seq'
        };
    });
    var ordShortChartSeries = [];
    var ordShortChartTitle = '生产通知单短缺图';
    var ordShortChartSubTitle = '款式号,订单号,指令数,实裁数';
    var ordShortChartStr = ['draw_short_num','sew_short_num', 'sew_delivery_short',
            'bach_accept_short_num', 'bach_delivery_short_num',
            'pack_accept_short_num', 'product_short_num',
            'receive_f_product_short', 'receive_b_product_short',
            'sendout_f_short','sendout_b_short'];
    // store加载结束重新画图
    ordShortageDetail_store.on('load', function() {
        ordShortChartSeries = [];
        var ranges = ordShortageDetail_store.getRange();
        rangesLength = ranges.length;
        ordShortChartStrLength = ordShortChartStr.length;
        if (rangesLength == 1) {
            ordShortChartTitle = ranges[0].get('prod_ord_seq') + ' 生产通知单短缺图';
            ordShortChartSubTitle = '款式:' + ranges[0].get('style_no') + ' 订单号:'
                    + ranges[0].get('ord_seq_no') + ' 指令数:'
                    + ranges[0].get('ins_num') + ' 实裁数:'
                    + ranges[0].get('real_cut_num');
        } else if (rangesLength > 1) {
            ordShortChartTitle = '生产通知单短缺图';
            ordShortChartSubTitle = '';
        } else if (rangesLength == 0) {
            ordShortChartTitle = ' 生产通知单短缺图';
            ordShortChartSubTitle = '没有短缺信息';
        }
        for (var k = 0; k < rangesLength; k++) {
            ordShortChartDate = [];
            record = ranges[k];
            for (var i = 0; i < ordShortChartStrLength; i++) {
                ordShortChartDate[i] = record.get(ordShortChartStr[i]);
            }
            ordShortChartSeries[k] = {
                data : ordShortChartDate,
                name : record.get('ord_seq_no')
            };
        }
        redrawOrdShortChart();
    });
    var ordShortage_pagesize_combo = new Ext.form.ComboBox({
        name : 'ordShortage_pagesize',
        hiddenName : 'orddShortage_pagesize',
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
    var ordShortageDetail_number = parseInt(ordShortage_pagesize_combo
            .getValue());
    ordShortage_pagesize_combo.on('select', function(comboBox) {
        ordShortageDetail_bbar.pageSize = parseInt(comboBox.getValue());
        ordShortageDetail_number = parseInt(comboBox.getValue());
        ordShortageDetail_store.load({
            params : {
                start : 0,
                limit : ordShortageDetail_bbar.pageSize
            // startdate:Ext.getCmp('ordShortageDetail_startdate').getValue(),
            // enddate:Ext.getCmp('ordShortageDetail_enddate').getValue()
            }
        });
    });
    var ordShortageDetail_bbar = new Ext.PagingToolbar({
        pageSize : ordShortageDetail_number,
        store : ordShortageDetail_store,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页工具显示的进度条
        emptyMsg : '没有符合条件的记录',
        items : ['-', '&nbsp;&nbsp;', ordShortage_pagesize_combo]
    });
    var ordShortageDetail_grid = new Ext.grid.GridPanel({
                title : '进度短缺详情',
                height : 510,
                store : ordShortageDetail_store,
                region : 'center',
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                stripeRows : true,
                // frame:true,
                border : false,
                cm : ordShortageDetail_cm,
                sm : ordShortageDetail_sm,
                tbar : [
                        // {
                        // xtype:'datefield',
                        // id:'ordShortageDetail_startdate',
                        // name:'ordShortageDetail_startdate',
                        // format:'Y-m-d',
                        // emptyText:'订单交货起始日期',
                        // editable:false,
                        // width:120
                        // },'-',{
                        // xtype:'datefield',
                        // id:'ordShortageDetail_enddate',
                        // name:'ordShortageDetail_enddate',
                        // format:'Y-m-d',
                        // emptyText:'订单交货结束日期',
                        // editable:false,
                        // width:120
                        // },{
                        // text:'查询',
                        // iconCls:'page_findIcon',
                        // handler:function(){
                        // ordShortageDetail_store.reload({
                        // params:{
                        // start:0,
                        // limit:ordShortageDetail_bbar.pageSize,
                        // flag:'prod_ord_seq',
                        // startdate:Ext.getCmp('ordShortageDetail_startdate').getValue(),
                        // enddate:Ext.getCmp('ordShortageDetail_enddate').getValue()
                        // }
                        // });
                        // }
                        // },
                        '->', {
                            text : '原始数据导出',
                            id : 'ordShortageImport_button',
                            iconCls : 'page_excelIcon',
                            handler : function() {
                                exportExcel('./ordSche.ered?reqCode=exportOrdShortInfo&flag=cur');
                            }
                        }, '-', {
                            text : '填充数据导出',
                            id : 'ordShortageFillImport_button',
                            iconCls : 'page_excelIcon',
                            handler : function() {
                                exportExcel('./ordSche.ered?reqCode=exportOrdShortInfo&flag=cur&isFill=yes');
                            }
                        }]
            });
    // ~ 订单短缺详情
    /**
     * 布局
     */
    var tabPabel = new Ext.TabPanel({
        region : 'center',
        border : false,
        collapsed : false,
        deferredRender : false,
        layoutOnTabChange : true,
        activeTab : 0,
        autoScroll : true,
        items : [panel, ordSchePanel, ordShortPanel, detail_grid,
                ordShortageDetail_grid]

    });
    tabPabel.on('tabchange', function(tab, panel) {
        if (check_ord_seq_no != '') {
            if (panel.title.indexOf("订单完成进度图") != -1) {
                redrawOrdScheChart();
                changeFlag = false;
            } else if (panel.title.indexOf('短缺详情') != -1
                    && panel.title.indexOf("进度短缺详情") == -1) {

            } else if (panel.title.indexOf("订单日进度图") != -1 && !changeFlag) {
                // 切换到订单日进度图的时候重新
                redrawOrdDayChart(everyDayInfo, ordDayChartTitle,
                        ordDayChartSubTitle);
                changeFlag = true;
            } else if (panel.title.indexOf('订单进度短缺图') != -1) {
                redrawOrdShortChart();
                changeFlag = false;
            }
        }
    });

    var viewport = new Ext.Viewport({
        layout : 'border',
        items : [tabPabel]
    });

    /**
     * 更新chart数据
     */
    function updateChartData() {
        changeFlag = true;
        detail_store.reload({
            params : {
                start : 0,
                limit : 9999,
                ord_seq_no : check_ord_seq_no
            },
            callback : fnSumInfo
        });

    }

    /**
     * 汇总表格
     */
    function fnSumInfo() {
        var n = detail_grid.getStore().getCount();// 获得总行数

        var sumObject = {
            ord_seq_no : '',
            ins_num : 0,
            order_num : 0,
            real_cut_num : 0,
            draw_num : 0,
            sew_num : 0,
            bach_accept_num : 0,
            bach_delivery_num : 0,
            pack_accept_num : 0,
            f_product_num : 0,
            b_product_num : 0,
            receive_f_product : 0,
            receive_b_product : 0,
            middle_take : 0,
            sew_delivery_num : 0,
            sendout_f_product : 0,
            sendout_b_product : 0
        };
        var ins_num, order_num, real_cut_num, draw_num, sew_num, bach_accept_num, bach_delivery_num, pack_accept_num, f_product_num, b_product_num, receive_f_product, receive_b_product, middle_take, sew_delivery_num;
        for (var i = 0; i < n; i++) {
            var record = detail_store.getAt(i);
            sumObject.ord_seq_no = '汇总信息';
            sumObject.tr_date = '订单号:' + record.get('ord_seq_no');
            sumObject.ins_num = record.get('ins_num');
            sumObject.order_num = record.get('order_num');
            sumObject.real_cut_num = sumObject.real_cut_num
                    + record.get('real_cut_num');
            sumObject.draw_num = sumObject.draw_num + record.get('draw_num');
            sumObject.sew_num = sumObject.sew_num + record.get('sew_num');
            sumObject.bach_accept_num = sumObject.bach_accept_num
                    + record.get('bach_accept_num');
            sumObject.bach_delivery_num = sumObject.bach_delivery_num
                    + record.get('bach_delivery_num');
            sumObject.pack_accept_num = sumObject.pack_accept_num
                    + record.get('pack_accept_num');
            sumObject.f_product_num = sumObject.f_product_num
                    + record.get('f_product_num');
            sumObject.b_product_num = sumObject.b_product_num
                    + record.get('b_product_num');
            sumObject.receive_f_product = sumObject.receive_f_product
                    + record.get('receive_f_product');
            sumObject.receive_b_product = sumObject.receive_b_product
                    + record.get('receive_b_product');
            sumObject.middle_take = sumObject.middle_take
                    + record.get('middle_take');
            sumObject.sew_delivery_num = sumObject.sew_delivery_num
                    + record.get('sew_delivery_num');
            sumObject.sendout_f_product = sumObject.sendout_f_product
                    + record.get('sendout_f_product');
          sumObject.sendout_b_product = sumObject.sendout_b_product
                    + record.get('sendout_b_product');

        }

        // summary.toggleSummary(true);
        summary.setSumValue(sumObject);
    }

    // 初始化状态
    summary.toggleSummary(true);

    // 显示查询窗口 xtj增加跳转
    var task2 = function() {
    	if(typeof(window.parent.directOrdIndex)=='number'){
        //进入跳转用数据加载启用“上一条，下一条”
    	Ext.getCmp("pre").setDisabled(false);
    	Ext.getCmp("next").setDisabled(false);
        loadStore4forward();
    	}else{
    	showQueryWindow();
        // 第一显示窗口的时候显示数据
        //loadStore4ordStore();
    	}
    };

    /**
     * 短缺详细信息的操作
     */
    function detailScheFun() {
        if (!isProdOrd) {
            return;
        }
        var record = short_detail_grid.getSelectionModel().getSelected();
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.alert('提示信息', "没有选择一个完单号");
            return false;
        }
        check_column_value = record.get('columnvalues');
        if (check_column_value == null || check_column_value == '') {
            Ext.MessageBox.alert('提示信息', "完单没有产品信息");
            return false;
        }
        isProdOrd = false;
        check_prod_ord_seq = record.get('prod_ord_seq');

        var columnsIns = [];
        columnsIns.push({
            header : '短缺性质',
            dataIndex : 'nature_value',
            align : 'center',
            width : 40
        });
        columnsIns.push({
            header : '国家',
            dataIndex : 'country',
            align : 'center',
            width : 40
        });
        columnsIns.push({
            header : '颜色',
            dataIndex : 'color',
            align : 'center',
            width : 40
        });
        columnsIns.push({
            header : '内长',
            dataIndex : 'in_length',
            align : 'center',
            width : 40,
            sortable : true
        });
        var columns = check_column_value.split(",");
        for (var i = 0; i < columns.length; i++) {
            columnsIns.push({
                header : columns[i],
                dataIndex : 'waist' + (i + 1),
                align : 'center',
                width : 40
            });
        }
        columnsIns.push({
            dataIndex : 'nature',
            align : 'center',
            hidden : true,
            width : 40
        });
        // 短缺详细信息下隐藏‘详细信息’钮，显示导出按钮
        Ext.getCmp('ordScheInfo_import').show();
        short_detail_grid.getColumnModel().setConfig(columnsIns);
        short_detail_grid.setTitle(check_prod_ord_seq + '完单号 短缺详情');
        short_detail_store.load({
            params : {
                start : 0,
                limit : 9999,
                prod_ord_seq : check_prod_ord_seq
            }
        });
        // 修改界面状态
        isProdOrd = false;
        return true;
    }
    /**
     * 更新短缺详情的订单号和完单号
     */
    function updateOrdScheData() {

        if (!Ext.isEmpty('check_ord_seq_no')) {
            if (!isProdOrd) {
                short_detail_grid.setTitle('短缺详情');
                var columnsProd = [];
                columnsProd.push(new Ext.grid.RowNumberer());
                columnsProd.push(short_detail_sm);
                columnsProd.push({
                    header : '订单号',
                    dataIndex : 'ord_seq_no',
                    width : 100,
                    sortable : true
                });
                columnsProd.push({
                    header : '完单号',
                    dataIndex : 'prod_ord_seq',
                    width : 100,
                    sortable : true
                });
                columnsProd.push({
                    header : '',
                    hidden : true,
                    dataIndex : 'columnvalues'
                })
                short_detail_grid.getColumnModel().setConfig(columnsProd);
                isProdOrd = true;
            }
            short_detail_store.reload({
                params : {
                    ord_seq_no : check_ord_seq_no,
                    flag : 'queryProdOrd'
                }
            });
            // 订单完单显示下隐藏‘导出’按钮，显示‘详细信息’按钮
            Ext.getCmp("ordScheInfo_import").hide();
        }
    }
    /**
     * 查询按钮的功能
     */
    function filterShortInfo() {
        var hasSelect = detailScheFun();
        if (!hasSelect) {
            return;
        }
        var size = short_back_store.getCount();
        var short_natures = short_nature_combo.getValue();
        if (short_natures != '') {
            var removeRecords = [];
            for (var i = 0; i < size; i++) {
                var record = short_back_store.getAt(i);
                if (short_natures.indexOf(record.get('nature').toString()) != -1) {
                    removeRecords.push(record);
                }
            }
            short_detail_store.removeAll();
            short_detail_store.add(removeRecords);
        } else {
            short_detail_store.removeAll();
            short_detail_store.add(short_back_store.getRange());
        }
    }

    /**
     * 颜色的定义
     */
    var colors = ['#AA4643', '#BBBBBB', '#4572A7', '#CCCCCC', '#DDDDDD',
            '#AAAAAA', '#89A54E', '#EEEEEE', '#111111', '#80699B', '#225522',
            '#333333', '#3D96AE', '#446644', '#555555', '#DB843D', '#667766',
            '#777777', '#92A8CD', '#889988', '#999999', '#A47D7C', '#112233',
            '#112244', '#B5CA92', '#112255', '#324355'];
    /**
     * 订单生产情况-订单日进度图
     */
    var ordDayChartObj = {
        chart : {
            type : 'column'
        },
        colors : colors,
        title : {
            text : '订单日进度图'
        },
        subtitle : {
            text : '款式号,指令数'
        },
        xAxis : {
            categories : ['实裁数', '领片数','下线数', '送水洗', '水洗收数', '水洗交数', '后整收数', '交成品数',
                    '交B品数', '收成品', '收B品', '出运成品','出运B品','中间领用']
        },
        yAxis : {
            allowDecimals : false,
            title : {
                text : '数量'
            },
            stackLabels : {
                enabled : true,
                style : {
                    fontWeight : 'bold'
                }
            }
        },
        tooltip : {
            formatter : function() {
                return this.series.name + "  " + this.x + ":" + this.y;
            }
        },
        plotOptions : {
            column : {
                stacking : 'normal',
                formatter : function() {
                    return this.y;
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
    var ordDayChart = $('#ordDayScheChart').highcharts(ordDayChartObj)
            .highcharts();
    function redrawOrdDayChart(series, title, subTitle) {
        ordDayChart.destroy();
        ordDayChartObj2 = {};
        $.extend(ordDayChartObj2, ordDayChartObj);
        ordDayChart = $('#ordDayScheChart').highcharts(ordDayChartObj2)
                .highcharts();
        everyDayInfoLength = series.length;
        for (var i = 0; i < everyDayInfoLength; i++) {
            ordDayChart.addSeries(series[parseInt(i)], false);
        }
        ordDayChart.setTitle({
            text : title
        }, {
            text : subTitle
        });
        ordDayChart.redraw();
    }

    var ordScheChartObj1 = {
        chart : {
            type : 'column'
        },
        colors : colors,
        title : {
            text : '订单完成进度图'
        },
        subtitle : {
            text : '款式号,指令数'
        },
        xAxis : {
            // categories:['实裁数','领片数','下线数','送水洗','水洗收数','水洗交数','后整收数','交成品数','交B品数',
            // '收成品','收B品','中间领用']
            categories : ['实裁数', '领片数','下线数', '送水洗', '水洗收数', '水洗交数', '后整收数', '交成品数',
                    '交B品数', '收成品', '收B品', '出运成品','出运B品','中间领用']
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
            formatter : function() {
                // return this.x + ":" + this.point.num + " 完成进度:" + this.y +
                // "%";
                return this.x + " 完成进度:" + this.y + "%";
            }
        },
        plotOptions : {
            column : {
                stacking : 'normal',
                formatter : function() {
                    return this.y;
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
    };
    var ordScheChartObj1_pie = {
        chart : {
            type : 'pie'
        },
        colors : colors,
        title : {
            text : '订单完成进度图'
        },
        subtitle : {
            text : '款式号,指令数'
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
            pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b><br/>'
                    + '工厂:{point.facname}<br/>' + '完成量:<b>{point.num}</b><br/>'
                    + '完成百分比:<b>{point.y:.1f}%</b>'
        },
        plotOptions : {
            pie : {
                allowPointSelect : true,
                cursor : 'pointer',
                dataLabels : {
                    enabled : true,
                    color : '#000000',
                    connectorColor : '#000000',
                    format : '<b>{point.name}</b>: {point.percentage:.1f} %'
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
    var ordScheChart = $('#ordScheChart').highcharts(ordScheChartObj1)
            .highcharts();
    function redrawOrdScheChart() {
        ordScheChart.destroy();
        ordScheChart = $('#ordScheChart').highcharts(ordScheChartObj1)
                .highcharts();
        ordScheSeriesLength = ordScheChartSeries.length;
        for (var i = 0; i < ordScheSeriesLength; i++) {
            ordScheChart.addSeries(ordScheChartSeries[parseInt(i)], false);
        }
        ordScheChart.setTitle({
            text : ordScheChartTitle
        }, {
            text : ordScheChartSubTitle
        });
        ordScheChart.redraw();
    }
    // 生产通知单画图 flag 标志1为饼图，0为柱状图
    function redrawOrdScheChart4Param(series, title, subTitle, flag) {
        ordScheChart.destroy();
        if (flag == 1) {
            ordScheChart = $('#ordScheChart').highcharts(ordScheChartObj1_pie)
                    .highcharts();
        } else if (flag == 0) {
            ordScheChart = $('#ordScheChart').highcharts(ordScheChartObj1)
                    .highcharts();
        }
        ordScheChart.xAxis[0].setCategories(xAjisCategories);
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
    var ordShortObj = {
        chart : {
            type : 'column'
        },
        colors : colors,
        title : {
            text : '生产通知单短缺图'
        },
        subtitle : {
            text : '款式,订单号,指令数,实裁数'
        },
        xAxis : {
            categories : ['领片短缺','缝制短缺', '缝制交短缺', '水洗收短缺', '水洗交短缺', '后整收短缺', '后整交短缺',
                    '收成品短缺', '收B品短缺','成品短缺(成品应余)','B品短缺(B品应余)']
        },
        yAxis : {
            allowDecimals : false,
            title : {
                text : '数量'
            },
            stackLabels : {
                enabled : true,
                styel : {
                    fontWeight : 'bold'
                }
            }
        },
        tooltip : {
            formatter : function() {
                return this.x + ":" + this.y;
            }
        },
        plotOptions : {
            column : {
                stacking : 'normal',
                formatter : function() {
                    return this.y;
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
    var ordShortChart = $('#ordShortChart').highcharts(ordShortObj)
            .highcharts();
    function redrawOrdShortChart() {
        ordShortChart.destroy();
        ordShortChart = $('#ordShortChart').highcharts(ordShortObj)
                .highcharts();
        ordShortSeriesLength = ordShortChartSeries.length;
        for (var k = 0; k < ordShortSeriesLength; k++) {
            ordShortChart.addSeries(ordShortChartSeries[k], false);
        }
        ordShortChart.setTitle({
            text : ordShortChartTitle
        }, {
            text : ordShortChartSubTitle
        });
        ordShortChart.redraw();
    }
    /**
     * 添加我的订单查询
     * 
     * @return
     */
    function addmyorderQuery() {
        var ischecked = Ext.getCmp('myorder').checked;
        var myorder = ischecked ? "yes" : ""; // 1表示我的订单
        return myorder;
    }
    
    /**
     * 数据按照日期排序
     * 冒泡排序
     * @param dataList 对象数组
     */
    function orderByOrdDaySche(dataList){
    	var formatStr = 'Y-m-d';
    	var dataSize = dataList.length;
    	for(var i=1;i<dataSize;i++){
    		//初始化判断
    		var initData = dataSize[0];
    		for(var k=0;k<(dataSize-i);k++){
    			var date1 = dataList[k];
    			var date2 = dataList[k+1];
    			if(Date.parseDate(date1.name,formatStr)<Date.parseDate(date2.name,formatStr)){
    				var tempDate = date1;
    				dataList[k] = date2;
    				dataList[k+1] = tempDate;
    			}
    		}
    	}
    	return dataList;
    }
//    // 按照指定的订单信息来查询
//    function loadStore4ordStore(/**传入特定参数*/params){
//        var prodstatus = ordstateCombo.getValue();
//        params = params || {};   //如果为空 则构建一个空对象
//        //添加一般参数
//        params.start = 0;
//        params.limit = ordBbar.pageSize;
//        params.order_name = getValueNoNullById('order_id');
//        params.startdate =  Ext.getCmp('startdate').getValue();
//        params.enddate =  Ext.getCmp('enddate').getValue();
//        params.style_no = getValueNoNullById('style_no');
//        params.ismyorder = addmyorderQuery();
//        params.prodstatus = prodstatus;
//        //添加日期定义参数  0： FOB交期 1：缝制起始日期 2：生产范围日期 
//        params.dateType=Ext.getCmp("dateTypeCombo").value;
//        //加载数据
//        ordStore.load({
//            params: params
//        });
//        
//    }
    /**
     * 将text封装为span 增加点击事件
     */
    function addListeners4cm(text,nature,record){
    	var order_id = record.get('ord_seq_no');
    	var date = record.get('tr_date');
    	var resultStr = '';
    	if(Ext.isEmpty(text) || text=='0'){
    		resultStr = text;
    	}else {
            resultStr = '<span onclick="queryDetailNum('+"'"+order_id+"','"+date+"','"+nature+"'"+')">'
            +text+'</span>';
    	}
        return resultStr;
    }
    /**
     * 查询单个数量的详细信息
     */
    function queryDetailNum(order_id,date,nature){
    	var height = document.documentElement.clientHeight || document.body.clientHeight;
        var width = document.documentElement.clientWidth || document.body.clientWidth;
    	var detailWindow = new DaylistDetailInfoWindow();
    	detailWindow.showWindow({width : width,height:height});
    	detailWindow.requestOrderInfo({order_id:order_id,tr_date:date,nature:nature});
    }
    
    window.queryDetailNum = queryDetailNum; //window上注册queryDetailNum方法
    
    // 按照跳转信息来查询
    function loadStore4forward(){
        var order_id = window.parent.directOrdList[window.parent.directOrdIndex];
        var params = {};  
        //添加一般参数
        params.start = 0;
        params.order_name = order_id.json.ord_seq_no;
        params.ismyorder = 'no';
        params.prodstatus = '';
        //加载数据
        ordStore.load({
            params: params
        });
        
    }
    
    /**
       * 查询订单窗口 
       */
      function showQueryWindow(){
            var windowCon = new QueryWindowConstruct(); //详细查询控制器
            //        windowCon.addListener('872',queryOrdderSrInfo);
            windowCon.addListener('161', queryWindowConfirm);
            //添加事件
            windowCon.showQueryWindow();
            // 设置初始状态 参数设置要在显示之后， 需要等到组件渲染
            windowCon.setOrderState('2');
            windowCon.setMyOrderState(false);   // true值 选择我的订单，false值不选择我的订单
      }
    /**
     * 通过id获取值
     * 
     * @param {}
     *            idval 传入的id
     */
    var getValueNoNullById = function(idval) {
        var value = Ext.getCmp(idval).getValue();
        return value ? value : '';
    }
    //显示查询窗口
    task2();
    
});

	
	