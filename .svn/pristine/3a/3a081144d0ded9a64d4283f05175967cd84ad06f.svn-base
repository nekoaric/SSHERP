/**
 * @author zhouww
 * @since 2014年9月12日
 * 功能： 生产通知单组件
 */
var prodordManageWindow;

function ProdordManageWindow(){
	if(!Ext.isEmpty(prodordManageWindow)) {
		return prodordManageWindow;
	}
	//=========================基础信息=========================
	/**
	 * 初始化按钮id
	 * @type String
	 */
	var initButtonNameId = "baseInfo_prodord";
    /**
     * 记录功能按钮的上一个按钮id，用于改变颜色
     * @type String
     */	
	var oldButtonNameId = "";
	
	/**
	 * 文件名集合
	 * @type 
	 */
	var filenames = [];
	/**
	 * 文件管理的参数
	 * @type 
	 */
	var fileParams = {};
	/**
	 * 界面操作状态： 新增，修改
	 * @type String
	 */
	var prod_ord_flag = '';  
	/**
	 * 生产状态 ： 已生产，未生产
	 * @type String
	 */
	var is_used = ''; // 编辑状态下的标识，1：已经生产，0：未生产
	
	/**
	 * 标识
	 * @type String
	 */
    var re = '<span style="color:red">*</span>';
    var rs = '<span style="color:Red">(*为必填项)</span>';
    
    /**
     * 保存下拉框的的id值
     * @type 
     */
    var baseParams_comboid = {};
    /**
     * 设置的腰围信息
     * @type String
     */
    var colValue = '';
    /**
     * 固定列信息
     * @type 
     */
    var constantCol = ['country','color','in_length'];
    
    /**
     * 可操作显示或者隐藏的组件
     * @type 
     */
    var items_prodord = ['exceprotButton_prodord','saveButton_prodord','resetButton_prodord','closeButton_prodord',
        'orig_contract_prodord','style_drawing_prodord','size_chart_prodord','process_desc_prodord','production_certificate_prodord',
        'pack_ins_prodord','box_ins_prodord','process_quota_prodord','pattern_code_prodord','yangka_prodord',
        'prod_ord_file_prodord'];
    /**
     * 新增显示的组件
     * @type 
     */
    var showItems_newProdord = ['saveButton_prodord','resetButton_prodord','closeButton_prodord'];
    /**
     * 编辑显示的组件
     * @type 
     */
    var showItems_editProdord = ['exceprotButton_prodord','saveButton_prodord','closeButton_prodord',
     'orig_contract_prodord','style_drawing_prodord','size_chart_prodord','process_desc_prodord','production_certificate_prodord',
        'pack_ins_prodord','box_ins_prodord','process_quota_prodord','pattern_code_prodord','yangka_prodord','prod_ord_file_prodord'];
    
    
	//=========================基础信息结束=====================
	
	
	//================================================Store数据===================//
        
    /**
     * 指令数量信息
     */
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
       
    /**
     * 订单数量信息
     */
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
    /** 订单数* */
    var ordStore = new Ext.data.Store({});
    
    var insOrdStore = new Ext.data.Store({});
	//================================================Store数据结束===============//
    //==================================================组件信息=========================================//
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
    //~~~~~ 订单基本信息头信息
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
                                        fieldLabel : 'FOB交期'+re,
                                        format : 'Y-m-d',
                                        id : 'fob_deal_date',
                                        name : 'fob_deal_date',
                                        editable:false,
                                        allowBlank : false,
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
                                        fieldLabel : '跟单员'+re,
                                        allowBlank : false,
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
    //~~~~~ 订单基本信息头信息结束
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
                                                    editable : false,
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
                        },{
                            layout : 'column',
                            border : false,
                            items : [{
                                columnWidth : .5,
                                layout : 'form',
                                border : false,
                                items : [{
                                    xtype : 'numberfield',
                                    fieldLabel : '水洗允许损耗%',
                                    allowDecimals : true,
                                    allowNegative : false,
                                    id : 'sxyxsh',
                                    name : 'sxyxsh',
                                    anchor : '90%'
                                }]
                            },{
                                columnWidth : .5,
                                layout : 'form',
                                border : false,
                                items : [{
                                    xtype : 'numberfield',
                                    fieldLabel : '缝制允许损耗%',
                                    allowDecimals : true,
                                    allowNegative : false,
                                    id : 'fzyxsh',
                                    name : 'fzyxsh',
                                    anchor : '90%'
                                }]
                            }]
                        },{
                            layout : 'column',
                            border : false,
                            items : [{
                                columnWidth : .5,
                                layout : 'form',
                                border : false,
                                items : [{
                                    xtype : 'textfield',
                                    fieldLabel : '面料分类',
                                    allowDecimals : true,
                                    allowNegative : false,
                                    id : 'mlfl',
                                    name : 'mlfl',
                                    anchor : '90%'
                                }]
                            },{
                                columnWidth : .5,
                                layout : 'form',
                                border : false,
                                items : [{
                                    xtype : 'textfield',
                                    fieldLabel : '款式分类',
                                    allowDecimals : true,
                                    allowNegative : false,
                                    id : 'ksfl',
                                    name : 'ksfl',
                                    anchor : '90%'
                                }]
                            }]
                        },{
                            layout : 'column',
                            border : false,
                            items : [{
                                columnWidth : .5,
                                layout : 'form',
                                border : false,
                                items : [{
                                    xtype : 'textfield',
                                    fieldLabel : '水洗方法',
                                    allowDecimals : true,
                                    allowNegative : false,
                                    id : 'sxff',
                                    name : 'sxff',
                                    anchor : '90%'
                                }]
                            },{
                                 layout : 'form',
                                columnWidth : 0.5,
                                border : false,
                                items : [{
                                            xtype : 'numberfield',
                                            fieldLabel : '许可损耗%',
                                            id : 'allow_loss_per',
                                            name : 'allow_loss_per',
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
                                                    xtype : 'radiogroup',
                                                    id : 'prodstatus',
                                                    name : 'prodstatus',
                                                    value : '0',
                                                    columns : [.33, .33, .33],
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
                baseParams_comboid.sew_fac = node.attributes.id;

                sewGrpsCombo.collapse();
            });

    var sewGrpsCombo = new Ext.form.ComboBox({
        name : 'sew_fac_name',
        id : 'sew_fac_name',
        fieldLabel : '缝制工厂' + re,
        allowBlank : false,
        editable : false,
        store : new Ext.data.ArrayStore({
                    fields : [],
                    data : [[]]
                }),
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
                baseParams_comboid.bach_fac = node.attributes.id;

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
                baseParams_comboid.pack_fac = node.attributes.id;

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
                                                    fieldLabel : '后整收货日',
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
        height : 130,
        defaults : {
            labelAlign : 'right'
        },
        autoScroll : false,
        items : [{
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
                        heigth : 60,
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
                                                height : 60,
                                                width : '100%',
                                                autoScroll : true
                                            }]
                                    }]
                            }]
                    })]
    });

	 /**
     * 生产通知单基本信息panel
     */
    var prodOrdInfoPanel = new Ext.form.FormPanel({
                id : 'prodOrdInfoPanel_prodord',
                title : '订单信息',
                defaults : {
                    frame : false,
                    labelAlign : 'right'
                },
                autoScroll : true,
                items : [{
                            // 上，顶部
                            border : false,
                            height : 32,
                            labelAlign : 'right',
                            items : [ordPersonInfoPanel]
                        }, {
                            // 中
                            layout : 'column',
                            height : 405,
                            items : [{
                                        // 中左
                                        columnWidth : 0.5,
                                        border : false,
                                        autoScroll : true,
                                        layout : 'form',
                                        height : 410,
                                        items : [ordBasInfoPanel]
                                    }, {
                                        columnWidth : 0.5,
                                        layout : 'form',
                                        height : 410,
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
                            height : 130,
                            labelAlign : 'right',
                            frame : true,
                            items : [prodOrdInfoFootPanel]
                        }]
            })
            //~订单基本信息结束
            //================订单数量数量明细==============//
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
                                                    id : 'prod_ord_seq_numInfo',
                                                    name : 'prod_ord_seq_numInfo'
                                                }]
                                    }, {
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '订单号',
                                                    readOnly : true,
                                                    id : 'ord_seq_no_numInfo',
                                                    name : 'ord_seq_no_numInfo'
                                                }]
                                    }, {
                                        columnWidth : 0.2,
                                        layout : 'form',
                                        items : [{
                                                    xtype : 'textfield',
                                                    fieldLabel : '款号',
                                                    readOnly : true,
                                                    id : 'style_no_numInfo',
                                                    name : 'style_no_numInfo'
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
                var ordsm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });

    var ordcm = new Ext.grid.ColumnModel([ordsm, {
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
                            id : 'addOrdInfoButton_prodord',
                            iconCls : 'page_edit_1Icon'
                        }, '-', {
                            text : '取消订单数量信息',
                            id : 'cancelOrdInfoButton_prodord',
                            iconCls : 'page_edit_1Icon'
                        }, '-', '重要提示：修改结束后请<b>按回车键确认输入</b>']
            });

             // 表格实例
    var ordGrid = new Ext.grid.EditorGridPanel({
                id : 'ordGrid_prodord',
                title : '订单数量信息',
                height : 150,
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
            
    // 表格工具栏
    var insOrdtbar = new Ext.Toolbar({
                items : [{
                	        hidden : true,
                            text : '添加指令数量信息',
                            id : 'addInsInfoButton_prodord',
                            iconCls : 'page_edit_1Icon'
                        }, '-', {
                        	hidden : true,
                            text : '取消指令数量信息',
                            id : 'cancelInsInfoButton_prodord',
                            iconCls : 'page_edit_1Icon'
                        }, '-', '重要提示：修改结束后请<b>按回车键确认输入</b>']
            });


             /** 指令数* */
    var insOrdsm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : false
            });

    var insOrdcm = new Ext.grid.ColumnModel([insOrdsm, {
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

    // 表格实例
    var insOrdGrid = new Ext.grid.EditorGridPanel({
    	        id : 'insGrid_prodord',
                title : '指令数量信息',
                height : 150,
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
        /**
         * 腰围设置Panel
         */
        var columnInfoPanel = new Ext.Panel({
            title : '腰围设置信息',
            id : 'columnInfoPanel_prodord',
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
                                            id : 'setSizeButton_prodord',
                                            width : "90%"
                                        }]
                            }]
                }]
        })
        var ordDetailNumPanel = new Ext.FormPanel({
                title : '订单数量数量明细',
                id : 'ordDetailNumPanel_prodord',
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
                        },columnInfoPanel, ordGrid, insOrdGrid]

            })
          //~ 订单数量数量明细 
    //=======文件管理组件==================//
    /**
     * 单个文件显示信息，操作按钮
     */
    function BeanFile_fileManagepanel(params){
    	//params 包含的数据必须是删除，下载等操作所必须的参数
    	//参数提取
    	params.prod_ord_flag = prod_ord_flag;
    	var seq_no = params.seq_no;
    	var file_name = params.filename;
    	var file_type = params.filetype;
    	var file_name_alias = params.filenamealias;
    	
    	// 组件生成
        return new Ext.FormPanel({
        	id : seq_no+"<>"+file_type+"<>"+file_name_alias,
            width : 110,
            defaults : {
                frame : false,
                border : false
            },
            items : [{
                xtype : 'button',
                width :110,
                text : file_name,
                handler : function(){
                	previousFile_fileManagePanel(params);
                }
            },{
                layout : 'column',
                defaults : {
                    border : false,
                    frame : false,
                    style : 'marginBottom : 3px;marginTop : 1px;marginLeft : 1px;marginRight : 1px'
                },
                items : [{
                    columnWidth : .33,
                    layout : 'form',
                    items : [{
                        xtype : 'button',
                        text : '下载',
                        handler : function(){
                            downloadFile_fileManagePanel(params);
                        }
                    }]
                },{
                    columnWidth : .33,
                    layout : 'form',
                    items : [{
                        xtype : 'button',
                        text : '预览',
                        handler : function(){
                        	previousFile_fileManagePanel(params);
                        }
                    }]
                },{
                    columnWidth : .33,
                    layout : 'form',
                    items : [{
                        xtype : 'button',
                        text : '删除',
                        handler : function(){
                        	delFile_fileManagepanel(params);
                        }
                    }]
                }]
            }]
        })
    }
    
    /**
     * 单个文件管理组件左边文件列表 
     */
    var buttonsPanel_fileManagePanel = new Ext.Panel({
    	region : 'west',
        title : '文件列表',
        width : 114,
        id : 'buttonsPanel_fileManagePanel_prodord',
        autoScroll : true,
        defaults : {
            style : 'marginTop : 5px;marginLeft : 1px;marginRight:1px'
        },
        items : [{
            xtype : 'button',
            width : 110,
            text : '上传文件',
            id : 'uploadFile_fileManagePanel',
            handler : function(){
                uploadProdOrdFile();
            }
        }]
    })
    /**
     * 单个文件管理组件中间预览信息
     */
    var previewViewPanel_fileManagepanel = new Ext.Panel({
    	region : 'center',
        title : '文件预览',
        id : 'previewViewPanel_fileManagepanel_prodord',
        bodyStyle : 'widht : 100%;height:100%',
        html : '<div id="documentViewer" class="flexpaper_viewer" ' +
        		'style="position:absolute;left:10px;top:10px;width:98%;height:95%"></div>'
    })  
    /**
     * 单个文件管理组件
     */
    var fileManagePanel = new Ext.Panel({
    	title : '文件列表',
    	id : 'fileManagePanel_prodord',
    	layout : 'border',
        items : [buttonsPanel_fileManagePanel,previewViewPanel_fileManagepanel]
    })
    //=======文件管理组件结束==============//
    //====中间区域组件
	/**
     * 订单详细信息
     */
    var prodOrdPanel = new Ext.Panel({
	        layout : 'card',
	        id : 'prodOrdPanelCard_prodord',
            region : 'center',
            activeItem : 0,
            items : [prodOrdInfoPanel, ordDetailNumPanel, fileManagePanel]
        });
    //~====中间区域组件结束
    // 创建右边按钮组
    var buttonsPanel = new Ext.Panel({
    	region : 'west',
    	title : '功能按钮',
    	id : 'buttonsPanel_prodord',
    	width : 114,
    	items : [{
		   xtype : 'button',
	       text : '订单基本信息',
	       id : 'baseInfo_prodord',
           width : 110,
           height : 25,
           style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
    	},{
    	   xtype : 'button',
    	   text : '订单数量数量明细',
    	   id : 'detailNumInfo_prodord',
           width : 110,
           height : 25,
           style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
    	}
//    	,new Ext.Button({
//    	   id : 'manageFileButton_prodord',
//    	   text : '文件管理',
//    	   height : 25,
//    	   width : 110,
//    	   style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px',
//    	   menu : [
    	   	,{
               xtype : 'button',
               text : '原始合同',
               id : 'orig_contract_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '款式图',
               id : 'style_drawing_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '尺寸表',
               id : 'size_chart_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '工艺说明书',
               id : 'process_desc_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '生产许可证',
               id : 'production_certificate_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '包装指示',
               id : 'pack_ins_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '装箱指示',
               id : 'box_ins_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
               xtype : 'button',
               text : '工序定额表',
               id : 'process_quota_prodord',
               width : 110,
               height : 25
            },{
               xtype : 'button',
               text : '纸样推码',
               id : 'pattern_code_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            },{
                xtype : 'button',
                text : '样卡',
                id : 'yangka_prodord',
                width : 110,
                height : 25,
                sytle : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            
            },{
               xtype : 'button',
               text : '生产通知单',
               id : 'prod_ord_file_prodord',
               width : 110,
               height : 25,
               style : 'marginBottom : 3px;marginTop : 3px;marginLeft : 1px;marginRight : 1px'
            }
//        ]})
        ]
    })
    //~ ====左边按钮组结束
    
    // 生产通知单组件开始
    var codeWindow = new Ext.Window({
        layout : 'border',
        id : 'prodOrdWindow',
        width : 1360,
        height : 400,
        resizable : false,
        draggable : true,
        title : '<span style="font-weight:normal">生产通知单 <span>' + rs,
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
        items : [buttonsPanel,prodOrdPanel],
        buttons : [{
            text : '导出',
            id : 'exceprotButton_prodord',
            iconCls : 'page_excelIcon'
        }, {
            text : '保存',
            id : 'saveButton_prodord',
            iconCls : 'acceptIcon'
        }, {
            text : '重置',
            id : 'resetButton_prodord',
            iconCls : 'tbar_synchronizeIcon'
        }, {
            text : '关闭',
            id : 'closeButton_prodord',
            iconCls : 'deleteIcon'
        }]
    });
    
   //==========================================文件上传组件=============================
        var fileUploadPanel = new Ext.form.FormPanel({
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
                            id : 'file_type_fileUpload',
                            hidden : true,
                            allowBlank : true
                        }, {
                            name : 'prod_ord_seq',
                            id : 'prod_ord_seq_fileUpload',
                            hidden : true,
                            allowBlank : true
                        },{
                            name : 'filenames',
                            id : 'filenames_fileUpload',
                            hidden : true,
                            allowBlank : true
                        }]
            });
     var fileUploadWindow = new Ext.Window({
     	id : 'fileUploadWindow_prodord',
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
        items : [fileUploadPanel],
        buttons : [{
            text : '导入',
            iconCls : 'acceptIcon',
            id : 'fileimportButton_fileImport_prodord'
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            id : 'cloaseButton_fileImport_prodord'
        }]
    });
    

	//==================================================组件结束=========================================//
	
    
    
    
    
    
    
    
    
    
	//==================================================事件=========================================//
    /**
     * 文件导入窗口关闭的事件
     */
    Ext.getCmp('fileUploadWindow_prodord').addListener('hide',function(){
        clearFormPanel4empty(fileUploadPanel);
    })
    /**
     * 文件导入窗口的关闭事件
     */
    Ext.getCmp('cloaseButton_fileImport_prodord').addListener('click',function(){
        fileUploadWindow.hide();
    })
    /**
     * 导入按钮点击事件
     */
    Ext.getCmp('fileimportButton_fileImport_prodord').addListener('click',function(){
            var theFile = Ext.getCmp('EmpInfoTheFile').getValue();
            if (Ext.isEmpty(theFile)) {
                Ext.Msg.alert('提示', '请先选择您要导入文件。');
                return;
            }
            var file_type = Ext.getCmp('file_type_fileUpload').getValue();

            var file_name = Ext.getCmp('filenames_fileUpload').getValue();

            fileUploadPanel.getForm().submit({
                url : './prodOrd.ered?reqCode=uploadFile',
                waitTitle : '提示',
                method : 'POST',
                waitMsg : '正在处理数据,请稍候...',
                success : function(form, action) {
//                    Ext.MessageBox.alert('提示', action.result.msg);
                    fileUploadWindow.hide();
                    queryFileInfo4prodord();
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
    })
    /**
     * 修改款号事件
     */
    Ext.getCmp('style_no').addListener('change',function(){
        var value = Ext.getCmp('style_no').getValue();
        Ext.getCmp('style_no_numInfo').setValue(value);
    })
    /**
     * 修改订单号事件
     */
    Ext.getCmp('ord_seq_no').addListener('change',function(){
        var value = Ext.getCmp('ord_seq_no').getValue();
        Ext.getCmp('ord_seq_no_numInfo').setValue(value);
    })
    /**
     * 修改完单号事件
     */
    Ext.getCmp('prod_ord_seq').addListener('change',function(){
        var value = Ext.getCmp('prod_ord_seq').getValue();
        Ext.getCmp('prod_ord_seq_numInfo').setValue(value);
    })
    /**
     * 订单数store移除数据事件
     */
    ordStore.on('remove',function(){
        updateOrdNumInfo();
    })
    /**
     * 指令数store移除数据事件
     */
    insOrdStore.on('remove',function(){
        updateInsNumInfo();
    });
    /**
     * 指令数数量信息数据改变事件
     */
    insOrdStore.on('add',function(){
        updateInsNumInfo();
    })
    /**
     * 订单数数量信息数据改变事件
     */
    ordStore.on('add',function(){
        updateOrdNumInfo();
    })
    /**
     * 数据加载事件
     */
    prodInsNumStore.on('load',function(){
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
    })
    /**
     * 数据加载事件
     */
    ordNumStore.on('load',function(){
    	var recordCount = ordNumStore.getCount();
        for (var i = 0; i < recordCount; i++) {
            var record = ordNumStore.getAt(i);
            var columnValue = record.get("ord_num").split(',');
            var column = record.get("num").split(',');
            for (var j = 0; j < column.length; j++) {
                record.set("num" + column[j], columnValue[j]);
            }
            ordStore.add(record);
        }
    })
    
    /**
     * 界面隐藏事件
     * 隐藏清空所有的数据 
     */
    Ext.getCmp('prodOrdWindow').addListener('hide',function(){
    	clearProdordWindowData();  
    })
    /**
     * 设置尺码按钮点击事件
     */
    Ext.getCmp('setSizeButton_prodord').addListener('click',function(){
    	//设置腰围信息
        colValue = Ext.getCmp('column').getValue();   //必须放在第一步，其他关于列的操作的数据使用colVal参数
    	//检测腰围合规性
    	if(valideColumnInfoProdord('1')){ //输出提示信息
    	    // 设置列的模型
            setColumnsData();
//            updateShowNumInfo();    //更新数量信息
    	};  
    })
    /**
     * 添加订单数量信息按钮点击事件
     */
    Ext.getCmp('addOrdInfoButton_prodord').addListener('click',function(){
    	if(Ext.isEmpty(colValue)){
    		Ext.Msg.alert('提示','请设置腰围(尺码)信息');
    		return;
    	}
        addRow4grid();
    });
    /**
     * 取消订单数量信息按钮点击事件
     */
    Ext.getCmp('cancelOrdInfoButton_prodord').addListener('click',function(){
    	var records = ordGrid.getSelectionModel().getSelections();
    	var rows = [];
    	var length = records.length;
    	var store = ordGrid.getStore();
    	for(var idx=0;idx<length;idx++){
    		rows.push(store.indexOf(records[idx]));
    	}
        delRow4grid(rows);
    });
   /**
     * 添加指令数量信息按钮点击事件
     */
    Ext.getCmp('addInsInfoButton_prodord').addListener('click',function(){
        addRow4grid();
    });
    /**
     * 取消指令数量信息按钮点击事件
     */
    Ext.getCmp('cancelInsInfoButton_prodord').addListener('click',function(){
        var records = insOrdGrid.getSelectionModel().getSelections();
        var rows = [];
        var length = records.length;
        var store = insOrdGrid.getStore();
        for(var idx=0;idx<length;idx++){
            rows.push(store.indexOf(records[idx]));
        }
        delRow4grid(rows);
    });
    /**
     * 生产通知单导出按钮点击事件
     */
    Ext.getCmp('exceprotButton_prodord').addListener('click',function(){
        exportProdordInfo();
    });
    /**
     * 生产通知单保存按钮点击事件
     */
    Ext.getCmp('saveButton_prodord').addListener('click',function(){
        saveProdordInfo();
    });
    /**
     * 生产通知单重置按钮点击事件
     */
    Ext.getCmp('resetButton_prodord').addListener('click',function(){
        clearProdordWindowData();
    });
    /**
     * 生产通知单关闭按钮点击事件
     */
    Ext.getCmp('closeButton_prodord').addListener('click',function(){
        hideWindow();
    });
    /**
     * 订单基本信息按钮点击事件
     */
    Ext.getCmp('baseInfo_prodord').addListener('click',function(){
        changeCardItemActive('prodOrdInfoPanel_prodord','baseInfo_prodord');
    });
    /**
     * 订单数量数量明细按钮点击事件
     */
    Ext.getCmp('detailNumInfo_prodord').addListener('click',function(){
        changeCardItemActive('ordDetailNumPanel_prodord','detailNumInfo_prodord');
    });
    /**
     * 原始合同按钮点击事件
     */
    Ext.getCmp('orig_contract_prodord').addListener('click',function(){
        queryFileInfo4prodord('orig_contract','orig_contract_prodord');
    });
    /**
     * 款式图按钮点击事件
     */
    Ext.getCmp('style_drawing_prodord').addListener('click',function(){
    	queryFileInfo4prodord('style_drawing','style_drawing_prodord');
    });
    /**
     * 尺寸表按钮点击事件
     */
    Ext.getCmp('size_chart_prodord').addListener('click',function(){
        queryFileInfo4prodord('size_chart','size_chart_prodord');
    });
    /**
     * 工艺说明书按钮点击事件
     */
    Ext.getCmp('process_desc_prodord').addListener('click',function(){
        queryFileInfo4prodord('process_desc','process_desc_prodord');
    });
    /**
     * 生产许可证按钮点击事件
     */
    Ext.getCmp('production_certificate_prodord').addListener('click',function(){
        queryFileInfo4prodord('production_certificate','production_certificate_prodord');
    });
    /**
     * 包装指示按钮点击事件
     */
    Ext.getCmp('pack_ins_prodord').addListener('click',function(){
        queryFileInfo4prodord('pack_ins','pack_ins_prodord');
    });

    /**
     * 装箱指示按钮点击事件
     */
    Ext.getCmp('box_ins_prodord').addListener('click',function(){
        queryFileInfo4prodord('box_ins','box_ins_prodord');
    });
    /**
     * 工序定额表按钮点击事件
     */
    Ext.getCmp('process_quota_prodord').addListener('click',function(){
        queryFileInfo4prodord('process_quota','process_quota_prodord');
    });
    /**
     * 纸样推码按钮点击事件
     */
    Ext.getCmp('pattern_code_prodord').addListener('click',function(){
        queryFileInfo4prodord('pattern_code','pattern_code_prodord');
    });
    /**
     * 纸样推码按钮点击事件
     */
    Ext.getCmp('yangka_prodord').addListener('click',function(){
        queryFileInfo4prodord('yangka','yangka_prodord');
    });
   /**
     * 生产通知单按钮点击事件
     */
    Ext.getCmp('prod_ord_file_prodord').addListener('click',function(){
    	queryFileInfo4prodord('prod_ord_file','prod_ord_file_prodord');
    });
    /**
     * 订单数编辑完成监听事件
     */
    Ext.getCmp('ordGrid_prodord').addListener('afteredit',function(e){
        updateInsNumInfo4ordNumChange(e);
        updateShowNumInfo();
    })
    /**
     * 指令数编辑完成监听事件
     */
    Ext.getCmp('insGrid_prodord').addListener('afteredit',function(){
        updateShowNumInfo();
    })
    //==================================================事件结束=========================================//
    
    //==================================================界面内操作处理函数=================================//
    /**
     * 修改按钮颜色 注意按钮的text不能设置嵌套标签
     * @param {} oldButton
     * @param {} newButton
     */
    function changeButtonColor(oldButtonid,newButtonid){
        // 更新按钮id
    	oldButtonNameId = newButtonid;
    	// 相同id不处理
    	if(oldButtonid == newButtonid){
            return;
        }
    	
    	if(!Ext.isEmpty(oldButtonid)){
    		var oldButton = Ext.getCmp(oldButtonid);
    		var oldText = oldButton.getText();
    		
    		if(oldText.indexOf(">") != -1){
                oldText = oldText.substring(oldText.indexOf('>')+1,oldText.indexOf('</'));
                oldButton.setText(oldText);
            }
    	}
    	
    	if(!Ext.isEmpty(newButtonid)){
            var newButton = Ext.getCmp(newButtonid);
            var newText = newButton.getText();
    		if(newText.indexOf(">") != -1){    // 删除text的外层标签
                newText = newText.substring(newText.indexOf('>')+1,newText.indexOf('</'));
            }
            newText = '<span style="color:red">' + newText + "</span>";
            newButton.setText(newText);
    	}
    	
    	
    }
    
    /**
     * 导出生产通知单
     */
    function exportProdordInfo(){
        var prod_ord_seq = Ext.getCmp('prod_ord_seq').getValue();
        exportExcel('./prodOrd.ered?reqCode=prodPlanExport&prod_ord_seq='
                + prod_ord_seq);
    }
    /**
     * 加载上传窗口 
     * @param {} file_type
     */
    function uploadProdOrdFile() {
        Ext.getCmp('prod_ord_seq_fileUpload').setValue(Ext
                .getCmp('prod_ord_seq').getValue());// 上传的表单中加入生产通知单编号
        Ext.getCmp("file_type_fileUpload").setValue(fileParams.filetype);
        Ext.getCmp('filenames_fileUpload').setValue(filenames.join(','));
        fileUploadWindow.show();
    }
    /**
     * 清空文件块的信息
     */
    function clearFileinfo4filepanel(){
        var filePanelButtons = Ext.getCmp('buttonsPanel_fileManagePanel_prodord')
        var uploadbutton = filePanelButtons.findById('uploadFile_fileManagePanel');
        filePanelButtons.removeAll();
        filePanelButtons.add(uploadbutton);
        filePanelButtons.doLayout();
    }
    /**
     * 查询生产通知单的文件信息
     */
    function queryFileInfo4prodord(filetype,buttonid){
        // 判断是否改变了按钮  是否用来清空预览 此功能要在清空数据之前完成
        if(oldButtonNameId != buttonid){
            clearViewerDiv();
        }
        
        
    	//查询前清空现有的数据
    	clearFileinfo4filepanel();
    	// 保存参数
        var seq_no = Ext.getCmp('seq_no').getValue();
        var queryParams = {};
        if(!Ext.isEmpty(filetype)){
            fileParams = {
                seq_no : seq_no,
                filetype : filetype
            } 
        }
        Ext.apply(queryParams,fileParams);
        
        //设置标签
        buttonid = buttonid || oldButtonNameId;
        changeCardItemActive('fileManagePanel_prodord',buttonid);
        if(!Ext.isEmpty(seq_no)){   // 如果生产通知单序号不为空则请求对应文件类型的信息
        	Ext.Ajax.request({
        	   url : './prodOrd.ered?reqCode=queryProdordFile',
        	   success : queryFileInfo_ajax_success,
        	   failure : queryFileInfo_ajax_failure,
        	   params : fileParams
        	})
        }
    }
    /**
     * 查询文件信息成功的回调函数
     * @param {} response
     */
    function queryFileInfo_ajax_success(response){
    	
    	var resultData = Ext.util.JSON.decode(response.responseText);
    	var length = resultData.length;
    	filenames = [];
    	for(var idx=0;idx<length;idx++){
    	   var bean  = resultData[idx];
    	   //保存文件的名字
    	   filenames.push(bean.filename)
           addBeanFileManagePanel(bean);   //增加一个文件信息
    	}
    	
    }
    /**
     * 查询文件信息失败的回调函数
     * @param {} response
     */
    function queryFileInfo_ajax_failure(response){
    }
    
    /**
     * 删除订单数量和指令数量行
     */
    function delRow4grid(rows){
        delRow4ordGrid(rows);
        delRow4insGrid(rows);
    }
    /**
     * 删除订单数量信息
     */
    function delRow4ordGrid(rows){
        if (Ext.isEmpty(rows)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        // 重要：降序排序
        rows.sort(function(d1,d2){
            return d2-d1;
        })
        var length = rows.length;
        for(var idx=0;idx<length;idx++){
        	ordStore.removeAt(rows[idx]);
        }
    }
    /**
     * 删除指令数量信息
     */
    function delRow4insGrid(rows){
        if (Ext.isEmpty(rows)) {
            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
            return;
        }
        // 重要：降序排序
        rows.sort(function(d1,d2){
            return d2-d1;
        })
        var length = rows.length;
        for(var idx=0;idx<length;idx++){
            insOrdStore.removeAt(rows[idx]);
        }
    }
    /**
     * 更新订单数量数量明细中的订单数信息
     */
    var allowChageIfExists = false; //如果指令数已经存在false：不能修改，ture能够修改  增加一种变化的可能性
    function updateInsNumInfo4ordNumChange(e){
            var value = e.value;
            var field = e.field;
            var row = e.row;

            if (constantCol.indexOf(field)<0) {
                if (Ext.isEmpty(insOrdStore.getAt(row).get(field)) || allowChageIfExists) {
                    var add_proportion = Ext.getCmp('add_proportion')
                            .getValue();// 加裁比例
                    add_proportion = add_proportion || 0;
                    var add_num = toFixedForNumber(((1 + add_proportion / 100) * value));
                    insOrdStore.getAt(row).set(field,
                            Math.round(parseFloat(add_num)));
                }
            } else {
            	//设置信息
                insOrdStore.getAt(row).set(field, value);
            }
    }
    /**
     * 处理产品信息的订单数和指令数
     * <br/> 界面显示的时候执行一次 修改订单数量和指令数量 调用此函数<br/>
     */
    function updateShowNumInfo() {
       updateInsNumInfo();
       updateOrdNumInfo();
    }
    
    /**
     * 更新订单数
     */
    function updateOrdNumInfo(){
    	var ord_num = 0;
        //获取除制定列之外的其他列信息
        var ordGridCM = ordGrid.getColumnModel();
        var colNum = ordGridCM.getColumnCount();
        var colNumDataIndex = [];
        for(var idx=0;idx<colNum;idx++) {
        	var dataIndx = ordGridCM.getDataIndex(idx);
        	if(constantCol.indexOf(dataIndx)>=0 || Ext.isEmpty(dataIndx)){
        		continue; //指定的列跳过处理
        	}
        	colNumDataIndex.push(dataIndx);
        }
        //统计数据
        var records = ordGrid.getStore().getRange();
        var recordsLength = records.length;
        var dataIndexLength = colNumDataIndex.length;
        for(var idx=0;idx<recordsLength;idx++){
        	for(var k=0;k<dataIndexLength;k++){
        		var numData = records[idx].get(colNumDataIndex[k].trim());
        		ord_num += Ext.isEmpty(numData) ? 0 : parseInt(numData);
        	}
        }
        Ext.getCmp('ord_num_prod').setValue(ord_num);
    }
    
    /**
     * 更新指令数 
     */
    function updateInsNumInfo(){
        var ins_num = 0;
        //获取除制定列之外的其他列信息
        var insGridCM = insOrdGrid.getColumnModel();
        var colNum = insGridCM.getColumnCount();
        var colNumDataIndex = [];
        for(var idx=0;idx<colNum;idx++) {
            var dataIndx = insGridCM.getDataIndex(idx);
            if(constantCol.indexOf(dataIndx)>=0 || Ext.isEmpty(dataIndx)){
                continue; //指定的列跳过处理
            }
            colNumDataIndex.push(dataIndx);
        }
        //统计数据
        var records = insOrdGrid.getStore().getRange();
        var recordsLength = records.length;
        var dataIndexLength = colNumDataIndex.length;
        for(var idx=0;idx<recordsLength;idx++){
            for(var k=0;k<dataIndexLength;k++){
                var numData = records[idx].get(colNumDataIndex[k].trim());
                ins_num += Ext.isEmpty(numData) ? 0 : parseInt(numData);
            }
        }
        Ext.getCmp('ins_num_prod').setValue(ins_num);
    }
    
    /**
     * 添加新的数量信息行
     * 说明：订单数和指令数同时增加
     */
     function addRow4grid() {
     	var ordGridCM = ordGrid.getColumnModel();
     	var insGridCM = insOrdGrid.getColumnModel();
     	
     	var ordGridCount = ordGridCM.getColumnCount();
     	var insOrdGridCount = insGridCM.getColumnCount();
     	
     	var ordRecord = new Ext.data.Record({});
     	for(var idx=0;idx<ordGridCount;idx++){
     		var dataIndex = ordGridCM.getDataIndex(idx);
     		ordRecord.set(dataIndex,'');
     	}
     	
     	var insRecord = new Ext.data.Record({});
        for(var idx=0;idx<insOrdGridCount;idx++){
            var dataIndex = insGridCM.getDataIndex(idx);
            insRecord.set(dataIndex,'');
        }
        
        ordStore.add(ordRecord);
        insOrdStore.add(insRecord);
    }
    /**
     * 改变界面显示
     */
    function changeCardItemActive(item,buttonid){
    	// 修改按钮颜色
    	changeButtonColor(oldButtonNameId,buttonid);
        var v = Ext.getCmp('prodOrdPanelCard_prodord').getLayout().setActiveItem(item);
    }
    /**
     * 文件管理里添加一个基本文件管理panel
     */
    function addBeanFileManagePanel(params){
        var newFile = new BeanFile_fileManagepanel(params);
        var filesPanel = Ext.getCmp('buttonsPanel_fileManagePanel_prodord');
        filesPanel.add(newFile);
        filesPanel.doLayout();
    }
    /**
     * 上传文件
     */
    function addFile_fileManagePanel(){
    	
    }
    /**
     * 下载文件
     */
    function downloadFile_fileManagePanel(params){
                var checkUrl = './prodOrd.ered?reqCode=checkDownFile4alias'+ 
                        '&prod_ord_seq=' + params.prod_ord_seq+
                        '&file_type='+ params.filetype + 
                        '&seq_no='+ params.seq_no + 
                        '&file_name='+ params.filename+
                        '&file_name_alias=' + params.filenamealias
                var downUrl = './prodOrd.ered?reqCode=downFileInfo4alias'+ 
                        '&prod_ord_seq=' + params.prod_ord_seq+
                        '&file_type='+ params.filetype + 
                        '&seq_no='+ params.seq_no + 
                        '&file_name='+ params.filename +
                        '&file_name_alias=' + params.filenamealias
                Ext.Ajax.request({
                    url:encodeURI(checkUrl),
                    success:function(value){
                        var result = Ext.util.JSON.decode(value.responseText);
                        if(result.success){
                        	exportExcel(downUrl);
                        }else if(!result.success){
                            Ext.Msg.alert("提示信息","文件下载失败");
                        }
                    },
                    failure:function(){
                        Ext.Msg.alert("提示信息","文件下载失败");
                    }
                });
        
    }
    /**
     * 预览文件
     */
    function previousFile_fileManagePanel(params){
    	// 保存预览文件信息
        Ext.Ajax.request({
                url : './prodOrd.ered?reqCode=viewProdordFile4valide',
                success : function(response) { // 回调函数有1个参数
                    var resultArray = Ext.util.JSON
                            .decode(response.responseText);
                    if (resultArray.success) {
                        viewFile();
                    }else { 
                        Ext.MessageBox.alert('提示信息', '未找到这个文件')
                    }
                },
                failure : function(response) {
                    Ext.Msg.alert('提示','文件删除失败!');
                },
                params : params
            });
    
    
    }
    /**
     * 请求预览文件信息
     */
    function viewFile(){
        var url = './prodOrd.ered?reqCode=viewProdordFile4alias' +
             "&format={format}";
        $('#documentViewer').FlexPaperViewer( {
            config : {
                DOC : escape(url),
                Scale : 0.6, 
                ZoomTransition : 'easeOut',
                ZoomTime : 0.5,
                ZoomInterval : 0.1,
                FitPageOnLoad : false,      
                FitWidthOnLoad : true,
                FullScreenAsMaxWindow : false,
                ProgressiveLoading : false,
                MinZoomSize : 0.2,
                MaxZoomSize : 5,
                SearchMatchAll : false,
                
                ViewModeToolsVisible : true,
                ZoomToolsVisible : true,
                NavToolsVisible : true,
                CursorToolsVisible : true,
                SearchToolsVisible : true,
                jsDirectory : './flexpaper/js/',
                localeDirectory : './flexpaper/locale/',
                WMode : 'window',
                localeChain: 'zh_CN'
            }}
        );
    }
    
    /**
     * 删除文件
     */
    function delFile_fileManagepanel(params){
        Ext.Ajax.request({
                url : './prodOrd.ered?reqCode=deleteFileInfo4alias',
                success : function(response) { // 回调函数有1个参数
                    var resultArray = Ext.util.JSON
                            .decode(response.responseText);
                    if (!resultArray.success) {
                        Ext.MessageBox.alert("提示信息", '删除失败');
                        return;
                    }
                    Ext.MessageBox.alert('提示信息', '删除成功')
                    queryFileInfo4prodord();    //重新加载文件信息
                },
                failure : function(response) {
                    Ext.Msg.alert('提示','文件删除失败!');
                },
                params : params
            });
    
    }
    
    /**
     * 提取生产通知单的数据
     */
    function getProdordInfo4Save(){

        // 判断并获取服装的数量信息
        var ordRecords = ordStore.getRange();
        var insOrdRecords = insOrdStore.getRange();
        var ordRecordStr = "[", insOrdRecordStr = "[";
        
        //获取列的dataIndex
        var gridCm = ordGrid.getColumnModel();
        var dataIdxLength = gridCm.getColumnCount();
        
        var colNames = [];
        //遍历列 过滤空数据
        for(var idx=0;idx<dataIdxLength;idx++){
        	var dataIndex = gridCm.getDataIndex(idx);
        	if(Ext.isEmpty(dataIndex)){
        		continue;
        	}
        	if(colNames.indexOf(dataIndex)<0){
        		colNames.push(dataIndex); //不重复添加列信息 
        	}
        }
        
        for (var i = 0; i < ordRecords.length; i++) {
            ordRecordStr = ordRecordStr + "{";
            insOrdRecordStr = insOrdRecordStr + "{";

            var ordRecord = ordRecords[i];
            var insOrdRecord = insOrdRecords[i];
            
            for (var j = 0; j < colNames.length; j++) {
                var key = colNames[j];
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

        var params = prodOrdInfoPanel.getForm().getValues();
        
        params.cust_id = custCombo.getValue();
        params.ordRecordStr = ordRecordStr;
        params.insOrdRecordStr = insOrdRecordStr;
        params.colValue = colValue;
        params.flag = prod_ord_flag;
        params.is_used = is_used;
        
        // 添加下拉框id
        Ext.apply(params,baseParams_comboid);
        
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
        //许可损耗
        var allow_loss_num = Ext.getCmp('allow_loss_per').getValue();
        if(!Ext.isEmpty(allow_loss_num)){
            allow_loss_num = toFixedForNumber(allow_loss_num/100,4);
        }
        var percent_jNum = Ext.getCmp('percent_j').getValue();
        if(!Ext.isEmpty(percent_jNum)){
            percent_jNum = toFixedForNumber(percent_jNum/100,4);
        }
        var percent_wNum = Ext.getCmp('percent_w').getValue();
        if(!Ext.isEmpty(percent_wNum)){
            percent_wNum = toFixedForNumber(percent_wNum/100,4);
        }
        var sxyxshNum = Ext.getCmp('sxyxsh').getValue();
        if(!Ext.isEmpty(sxyxshNum)){
            sxyxshNum = toFixedForNumber(sxyxshNum/100,4);
        }
        var fzyxshNum = Ext.getCmp('fzyxsh').getValue();
        if(!Ext.isEmpty(fzyxshNum)){
            fzyxshNum = toFixedForNumber(fzyxshNum/100,4);
        }
        
        params.percent_w=percent_wNum;
        params.percent_j=percent_jNum;
        params.add_proportion=add_proportionNum;
        params.allow_loss_per=allow_loss_num;
        params.less_clause=less_clauseNum;
        params.more_clause=more_clauseNum;
        params.sxyxsh = sxyxshNum;
        params.fzyxsh = fzyxshNum;
        
        return params;
    }
    /**
     * 保存生产通知单
     */
    function saveProdordInfo() {
    	if(!valideProdordInfo('1')){
    	   return false;   //检测不合格的返回
    	}
    	
        // 处理提示信息数据
    	var ins_num_prod_show = Ext.getCmp('ins_num_prod').getValue();
    	var ord_num_pord_show = Ext.getCmp('ord_num_prod').getValue(); 
        var opr_name_show = Ext.getCmp('opr_name').getValue();
        var ord_seq_no_show = Ext.getCmp('ord_seq_no').getValue();
        var prod_ord_seq_show = Ext.getCmp('prod_ord_seq').getValue();
        var order_num_show = Ext.getCmp('order_num').getValue();
        var add_proportion_show = Ext.getCmp('add_proportion').getValue();
        
        var subProdNum = ins_num_prod_show - ord_num_pord_show;
        var real_add_proportion_show = ((subProdNum / parseFloat(ord_num_pord_show)) * 100).toFixed(2)
        Ext.MessageBox.show({
                    title : '信息提示',
                    msg : '制单员:' + opr_name_show
                            + '<br/>订单号:' + ord_seq_no_show
                            + '<br/>通知单号:' + prod_ord_seq_show
                            + '<br/>订单总数:' + order_num_show
                            + '<br/>指令总数:' + ins_num_prod_show
                            + '<br/>要求加裁:' + add_proportion_show + '%'
                            + '<br/>实际加裁:' + real_add_proportion_show + '%',
                    buttons : {
                        ok : '确认',
                        cancel : '取消'
                    },
                    fn : function(buttionId, text) {
                        if (buttionId == 'cancel') {
                            return;
                        } else if (buttionId == 'ok') {
                        	var params = getProdordInfo4Save();
                            saveProdordInfo_ajax(params,saveProdordInfo_ajax_success,saveProdordInfo_ajax_failure);
                        }
                    }
                });

    }
    
    /**
     * 异步请求保存生产通知单
     * @param {} params 请求的参数
     * @param {} successFun 成功回调函数
     * @param {} failureFun 失败回调函数
     */
    function saveProdordInfo_ajax(params,successFun,failureFun){
        Ext.MessageBox.show({
            title:'提示信息',
            msg:'正在保存信息............'
        });
        Ext.Ajax.request({
            url : './prodOrd.ered?reqCode=saveProdOrdInfo',
            success : successFun,
            failure : failureFun,
            params : params
        });
    }
    
    /**
     * 请求成功回调函数
     * @param {} response
     */
    function saveProdordInfo_ajax_success(response){
    	 // 回调函数有1个参数
                var resultArray = Ext.util.JSON
                        .decode(response.responseText);
                if (resultArray.success) {
                    Ext.Msg.alert('提示',
                            resultArray.msg);
                    hideWindow();
                } else {
                    Ext.Msg.alert('提示',
                            resultArray.msg);
                }
            
    }
    
    /**
     *  请求失败回调函数
     * @param {} response
     */
    function saveProdordInfo_ajax_failure(response){
                Ext.Msg.alert('提示通知单保存失败');
            
    }
    
    /**
     * 校验生产通知单数据
     * @param flag 1：输出提示信息 0：不输出提示信息
     */
    function valideProdordInfo(flag){
    	flag = flag || '0';
    	var msgInfo = '';
    	var isValide = true;
    	try{
        	//检测数据合法性
            if (!prodOrdInfoPanel.form.isValid()) {
                throw '数据不完整，请检查必填数据(带<span color:"red">*</span>为必填项)';
            }
            
            if(Ext.isEmpty(colValue)){
            	throw '请设置尺寸信息';
            }
            // 数据检查
            var order_num = Ext.getCmp('order_num').getValue();
            var order_num_prod = Ext.getCmp('ord_num_prod').getValue();
            if (order_num != order_num_prod) {
                throw '订单数和总数不一致 请检查';
            }
            //判断客户是否正确  支持填写客户编号
            var comboValue = custCombo.getValue();
            var cust_id = '';
            if(Ext.isEmpty(comboValue)){
                throw '请选择客户/品牌';
            }
            // 直接写客户会自动匹配custid
            if(!isNaN(comboValue)){ //判断获取的值是数值的情况 防止手动写入数值  不是数值的客户都是错误的数据
                custStore.each(function(record){
                    var custValue = record.get('value');
                    if(custValue==comboValue){
                        cust_id = custValue;
                        return; 
                    }
                 })
            }
            if(Ext.isEmpty(cust_id)){
                throw '请选择正确的客户/品牌';
            }
            // 判断订单数和指令数数量
            var ordRecords = ordStore.getRange();
            var insOrdRecords = insOrdStore.getRange();
            if (ordRecords.length != insOrdRecords.length) {
                throw '数量数据不对应!请修改!';
            }
            
            // 判断固定列数据对应关系
            var ordValideRecords = ordGrid.getStore().getRange();
            var insValideRecords = insOrdGrid.getStore().getRange();
            var ordValideLength = ordValideRecords.length;
            var insValideLength = insValideRecords.length;
            if(ordValideLength!=insValideLength){
            	throw '订单数量信息和指令数量信息行数不一致';
            }
            
            var colLength = constantCol.length;
            for(var idx=0;idx<ordValideLength;idx++){
            	var ordRecord = ordValideRecords[idx];
            	var insRecord = insValideRecords[idx];
            	for(var k=0;k<colLength;k++){
            		var ordColName = ordRecord.get(constantCol[k]);
            		var insColName = insRecord.get(constantCol[k]); 
            		if(ordColName != insColName){
            			throw '常规列信息不匹配<'+"订单数名字："+ordColName+"-  指令数名字:"+insColName+">";
            		}
            	}
            }
            
    	}catch(e){
    		console.info(e);
    		msgInfo = e;
    		isValide = false;
    	}
    	
        if(flag==='1' && !isValide) {
        	Ext.Msg.alert('提示',msgInfo);
        }
        
        return isValide;
    }
    
    /**
     * 检测腰围的信息是否正确
     * @param {} flag   1：输出提示信息，0：不输出提示信息
     */
    function valideColumnInfoProdord(flag){
    	flag = flag || '0';    //默认为不输出提示信息
    	var msgInfo = '';
    	var isValide = true;
    	try{
            // 监测数据存在
            var column = colValue;
            if (Ext.isEmpty(column)) {
                throw '请设置列信息';
            }
            var columns = column.split(',');
            var columnsLength = columns.length;
            // 检测逗号合规性
            for(var idx=0;idx<columnsLength;idx++){
                var colBean = columns[idx].trim();
                if(Ext.isEmpty(colBean)){
                    throw '请检查输入格式，<br/>1)不能连续输入逗号.<br/>2)不能用逗号开头或者结尾';
                }
            }
            // 检测数据不能重复
            columns.sort();
            for(var idx=0;idx<(columnsLength-1);idx++){
            	if(columns[idx]==columns[idx+1]){  //判断两个数据是否相等 
            		throw '腰围数据不能重复';
            	}
            }
    	}catch(e){
    		console.info(e);
    		msgInfo = e;
    		isValide = false;
    	}
    	if(flag==='1' && !isValide){   //允许输出数据并且是不合法的情况
    		Ext.Msg.alert('提示',msgInfo)
    	}
    	return isValide;
    }
    /**
     * 添加列信息，不能修改
     */
    function setColumnsData4nochange(){
        var column = colValue;
        
        ordStore.removeAll();
        insOrdStore.removeAll();
        var columnKeyList = [];
        columnKeyList.push('country');
        columnKeyList.push('color');
        columnKeyList.push('in_length');

        columnsValue = column.split(',');

        var ordColumn = [];
        var insColumn = [];
        ordColumn.push(new Ext.grid.RowNumberer());
        ordColumn.push(new Ext.grid.CheckboxSelectionModel({
                    singleSelect : false
                }));
        ordColumn.push({
                    header : '国家',
                    dataIndex : 'country',
                    align : 'center',
                    width : 100
                });
        ordColumn.push({
                    header : '颜色',
                    dataIndex : 'color',
                    align : 'center',
                    width : 100
                });
        ordColumn.push({
                    header : '内长',
                    dataIndex : 'in_length',
                    align : 'center',
                    width : 100,
                    sortable : true
                });
        for (var i = 0; i < columnsValue.length; i++) {
            var colBean = columnsValue[i].trim();
            ordColumn.push({
                        header : colBean,
                        dataIndex : 'num' + colBean,
                        align : 'center',
                        width : 60,
                        sortable : true
                    });
        }
        
        insColumn.push(new Ext.grid.RowNumberer());
        insColumn.push(new Ext.grid.CheckboxSelectionModel({
                    singleSelect : false
                }));
        insColumn.push({
                    header : '国家',
                    dataIndex : 'country',
                    align : 'center',
                    width : 100
                });
        insColumn.push({
                    header : '颜色',
                    dataIndex : 'color',
                    align : 'center',
                    width : 100
                });
        insColumn.push({
                    header : '内长',
                    dataIndex : 'in_length',
                    align : 'center',
                    width : 100,
                    sortable : true
                });
        for (var i = 0; i < columnsValue.length; i++) {
            var colBean = columnsValue[i].trim();
            insColumn.push({
                        header : colBean,
                        dataIndex : 'num' + colBean,
                        align : 'center',
                        width : 60,
                        sortable : true
                    });
        }
        
        ordGrid.getColumnModel().setConfig(ordColumn);
        insOrdGrid.getColumnModel().setConfig(insColumn);
    }
    
    /**
     * 设置腰围信息
     */
    function setColumnsData() {
        var column = colValue;
        
        ordStore.removeAll();
        insOrdStore.removeAll();
        var columnKeyList = [];
        columnKeyList.push('country');
        columnKeyList.push('color');
        columnKeyList.push('in_length');

        columnsValue = column.split(',');

        var ordColumn = [];
        var insColumn = [];
        ordColumn.push(new Ext.grid.RowNumberer());
        ordColumn.push(new Ext.grid.CheckboxSelectionModel({
                    singleSelect : false
                }));
        ordColumn.push({
                    header : '国家',
                    dataIndex : 'country',
                    align : 'center',
                    width : 100,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        ordColumn.push({
                    header : '颜色',
                    dataIndex : 'color',
                    align : 'center',
                    width : 100,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        ordColumn.push({
                    header : '内长',
                    dataIndex : 'in_length',
                    align : 'center',
                    width : 100,
                    sortable : true,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        for (var i = 0; i < columnsValue.length; i++) {
        	var colBean = columnsValue[i].trim();
            ordColumn.push({
                        header : colBean,
                        dataIndex : 'num' + colBean,
                        align : 'center',
                        width : 60,
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
        
        insColumn.push(new Ext.grid.RowNumberer());
        insColumn.push(new Ext.grid.CheckboxSelectionModel({
                    singleSelect : false
                }));
        insColumn.push({
                    header : '国家',
                    dataIndex : 'country',
                    align : 'center',
                    width : 100,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        insColumn.push({
                    header : '颜色',
                    dataIndex : 'color',
                    align : 'center',
                    width : 100,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        insColumn.push({
                    header : '内长',
                    dataIndex : 'in_length',
                    align : 'center',
                    width : 100,
                    sortable : true,
                    editor : new Ext.form.TriggerField({
                                allowBlank : false
                            })
                });
        for (var i = 0; i < columnsValue.length; i++) {
        	var colBean = columnsValue[i].trim();
            insColumn.push({
                        header : colBean,
                        dataIndex : 'num' + colBean,
                        align : 'center',
                        width : 60,
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
        
        ordGrid.getColumnModel().setConfig(ordColumn);
        insOrdGrid.getColumnModel().setConfig(insColumn);

    }
    
    /**
     *  清空界面数据
     */
    function clearProdordWindowData(){
    	//清空界面数据
        clearBaseInfo_prodord();
       
        //重置 数量数量明细
        clearNumInfo_prodord();
        
        //处理文件管理界面
        clearFilePanel_prodord();
        
        //   重置默认显示的标签页(基础信息为默认页)
        prodOrdPanel.getLayout().setActiveItem(0);
        
        changeButtonColor(oldButtonNameId,initButtonNameId);
        
        // 隐藏界面的时候清除预览信息
        clearViewerDiv();
        
    }
    /**
     * 清楚预览元素
     */
    function clearViewerDiv(){
    	// flexpaper 预览的时候会创建一个object对象，清除此元素
    	var viewer = $('#documentViewer');
    	if(viewer.length > 0) {
    		var viewerDiv = viewer[0];
            var childs = viewerDiv.childNodes;
            var childsLength = childs ? childs.length : 0;
            for(var idx=0;idx<childsLength;idx++){  // 移除所有的预览div的子元素
                viewerDiv.removeChild(childs[0]);
            }
    	}
    }
    
    /**
     * 清空基础数据
     */
    function clearBaseInfo_prodord(){
    	clearFormPanel4empty(prodOrdInfoPanel); //清空 订单基本信息的信息
    	baseParams_comboid = {};
    	prod_ord_flag = '';
    	is_used = '';
    }
    
    /**
     * 清空订单数量数量明细
     */
    function clearNumInfo_prodord(){
    	Ext.getCmp('column').setValue('');
    	colValue = '';
        insOrdStore.removeAll();    //清空订单数数量信息
        ordStore.removeAll();   //清空订单数数量信息
        // 清空原始数据
        clearFormPanel4empty(ordDetailNumPanel);
        //重置表格头信息
        setColumnsData();
    }
    
    /**
     * 清空文件块界面
     */
    function clearFilePanel_prodord(){
    	fileParams = {};
    	filenames = [];
    }
    /**
     * 后台请求加载数据
     */
    function requestProdord4loadData(params,successFun,failureFun){
    	Ext.Ajax.request({
    	   url : './prodOrd.ered?reqCode=queryProdOrdInfo',
    	   success : successFun,
    	   failure : failureFun,
    	   params : params
    	})
    }
    
    /**
     * 请求成功回调函数
     */
    function requestProdord_ajax_success(response){
    	var resultData = Ext.util.JSON.decode(response.responseText)
    	if(Ext.isEmpty(resultData)){
    		Ext.Msg.alert('提示','操作失败');
    		return;
    	}
    	var root = resultData.ROOT;
    	if(root.length!=1){
    		Ext.Msg.alert('提示','无法确定一个生产通知单');
    		return;
    	}
    	var record = new Ext.data.Record(root[0]);
    	loadRecord4prodordInfo(record);
    }
    /**
     * 请求失败回调函数
     * @param {} response
     */
    function requestProdord_ajax_failure(response){
    }
    /**
     * 为修改加载数据
     * @param {} record
     */
    function loadRecord4prodordInfo(recordO){
    	var record = recordO.copy();
    	//处理显示的数据 百分比数据
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
        var allow_loss_perNum = record.get('allow_loss_per');
        if(!Ext.isEmpty(allow_loss_perNum)){
            allow_loss_perNum = toFixedForNumber(allow_loss_perNum*100,2);
        }
        var sxyxshNum = record.get('sxyxsh');
        if(!Ext.isEmpty(sxyxshNum)){
            sxyxshNum = toFixedForNumber(sxyxshNum*100,2);
        }
        var fzyxshNum = record.get('fzyxsh');
        if(!Ext.isEmpty(fzyxshNum)){
            fzyxshNum = toFixedForNumber(fzyxshNum*100,2);
        }
        
        
        
        record.set('percent_w',percent_wNum);
        record.set('percent_j',percent_jNum);
        record.set('add_proportion',add_proportionNum);
        record.set('allow_loss_per',allow_loss_perNum);
        record.set('less_clause',less_clauseNum);
        record.set('more_clause',more_clauseNum);
        record.set('sxyxsh',sxyxshNum);
        record.set('fzyxsh',fzyxshNum);
        
        // 设置基本信息
        prodOrdInfoPanel.getForm().loadRecord(record);
        // 设置订单数量数量明细
        record.set('prod_ord_seq_numInfo',record.get('prod_ord_seq'));
        record.set('ord_seq_no_numInfo',record.get('ord_seq_no'));
        record.set('style_no_numInfo',record.get('style_no'));
        ordDetailNumPanel.getForm().loadRecord(record);
        
        // 处理标识数据，变量数据
        is_used = record.get('is_used');
        baseParams_comboid.sew_fac = record.get('sew_fac');
        baseParams_comboid.bach_fac = record.get('bach_fac');
        baseParams_comboid.pack_fac = record.get('pack_fac');
        //设置腰围(尺寸)信息
        colValue = record.get('column_value');
        colValue = !colValue ? '' : colValue;
        Ext.getCmp('column').setValue(colValue);
        
        //载入的时候组装列头信息
        if(is_used=='1')    {   //已生产中设置不能修改的头信息
        	setColumnsData4nochange();
        	setNumInfoFieldState4allowEdit(false);
        }else { // 其他情况下设置能修改的头信息
        	setColumnsData();
        	setNumInfoFieldState4allowEdit(true);
        }
        
        // 载入生产通知单订单数,指令数
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
    }
    
    //==================================================操作处理函数结束=================================//
    
    
    
    
    
    
    
    
    
    
    
    
    
    //==================================================工具函数========================================//
        /**
     * 小数转化：data传入的参数，num指定的小数点后位置(默认2位)
     */
    function toFixedForNumber(data,num){
        if(!Ext.isEmpty(num)){
            return data.toFixed(num); 
        }
        return data.toFixed(2);
    }
    /**
     * 仿照eredg4的clearFormPanel取消reset
     * @param {} form
     */
    function clearFormPanel4empty(form) {
        //只对表单中的一些类型进行清除
        var typeArray = ['textfield', 'combo', 'datefield', 'textarea',
            'numberfield', 'htmleditor', 'timefield', 'checkboxgroup'];
        for (var i = 0; i < typeArray.length; i++) {
            var typeName = typeArray[i];
            var itemArray = form.findByType(typeName);
            for (var j = 0; j < itemArray.length; j++) {
                var element = itemArray[j];
                element.setValue('');
            }
        }
    }
	//==================================================工具函数结束========================================//
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //==================================================功能方法========================================//
    /**
     * 设置某些输入框输入状态
     * @param {} flag
     */
    function setSomeFieldState(flag){
    	Ext.getCmp('ord_seq_no').setReadOnly(flag);
        Ext.getCmp('prod_ord_seq').setReadOnly(flag);
    }
    /**
     * 订单数量数量明细中设置编辑状态和非编辑状态下组件的状态
     * @param {} flag
     */
    function setNumInfoFieldState4allowEdit(flag){
    	Ext.getCmp('column').setReadOnly(!flag);
        if(flag){
    	   Ext.getCmp('setSizeButton_prodord').show();
    	   Ext.getCmp('addOrdInfoButton_prodord').show();
    	   Ext.getCmp('cancelOrdInfoButton_prodord').show();
        }else {
            Ext.getCmp('setSizeButton_prodord').hide();
            Ext.getCmp('addOrdInfoButton_prodord').hide();
           Ext.getCmp('cancelOrdInfoButton_prodord').hide();
        }
        
        
    }
    /**
     * 显示窗口
     */
    function showWindow() {
    	//新增时处理按钮颜色
    	changeButtonColor("",initButtonNameId);
        codeWindow.show();
    }
    
    /**
     * 新增生产通知单
     */
    function newProdordInfo() {
    	// 设置新增组件显示
    	hideActionButtons();
    	var itemsLength = showItems_newProdord.length;
        for(var idx=0;idx<itemsLength;idx++){
            Ext.getCmp(showItems_newProdord[idx]).show();
        }
        // 设置新增状态信息
        prod_ord_flag = 'add';
        
        // 设置输入框的输入状态 
        setSomeFieldState(false);
        
        // 设置数量信息状态
        setNumInfoFieldState4allowEdit(true);
        showWindow();
    }
    /**
     * 隐藏所有的操作按钮
     */
    function hideActionButtons(){
    	var itemsLength = items_prodord.length;
    	for(var idx=0;idx<itemsLength;idx++){
    		Ext.getCmp(items_prodord[idx]).hide();
    	}
    }
    
    /**
     * 编辑生产通知单 
     * @param {} prodordseq  生产通知单号
     */
    function editProdordInfo(prodordseq) {
    	// 设置编辑显示组件
    	hideActionButtons();
    	var itemsLength = showItems_editProdord.length;
        for(var idx=0;idx<itemsLength;idx++){
            Ext.getCmp(showItems_editProdord[idx]).show();
        }
        //设置编辑状态
        prod_ord_flag = 'update';
        
        // 设置输入框的输入状态        
        setSomeFieldState(true);
        // 后台请求数据填充界面
        var params = {
            prod_ord_seq : prodordseq
        }
        requestProdord4loadData(params,requestProdord_ajax_success,requestProdord_ajax_failure);
        
        showWindow();
    }
    
    /**
     * 隐藏界面
     */
    function hideWindow(){
    	codeWindow.hide();
    }
    //==================================================功能方法结束====================================//
            
    
            
	//==================================================接口方法=========================================//
    /**
     * 控制器
     */
	function WindowControl(){
	   this.newProdordInfo = newProdordInfo;
	   this.editProdordInfo = editProdordInfo;
	   this.hideWindow = hideWindow;
	}
	prodordManageWindow = new WindowControl();
	return prodordManageWindow;
	//==================================================接口方法结束=========================================//
	
	
}
