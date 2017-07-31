/************************************************
 * 创建日期: 2013-08-06
 * 创建作者：may
 * 功能：产品动向(产品在哪里)
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {

    var showFlag, check_prod_ord_seq = '', check_column_value = '';
    //是否填充数据标志
    var isFill = 'no';
    Ext.data.Store.prototype.applySort = function () {
        if (this.sortInfo && !this.remoteSort) {
            var s = this.sortInfo, f = s.field;
            var st = this.fields.get(f).sortType;
            var fn = function (r1, r2) {
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                if (typeof(v1) == "string" && typeof(v2) == "string") {
                    var i1 = v1.indexOf("汇总信息:");
                    var i2 = v2.indexOf("汇总信息:");
                    if (i1 != -1) {
                        return 1;
                    } else if (i2 != -1) {
                        return -1;
                    }
                    return v1.localeCompare(v2);
                }
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(s.direction, fn);
            if (this.snapshot && this.snapshot != this.data) {
                this.snapshot.sort(s.direction, fn);
            }
        }
    };

    // 定义自动当前页行号
    var cm_prod = new Ext.grid.ColumnModel([
        {
            header: '产品归属',
            dataIndex: 'belong_grp_name',
            align: 'center',
            width: 120
        },
        {
            header: '状态',
            dataIndex: 'remark',
            width: 60
        },
        {
            header: '客户',
            dataIndex: 'cust_name',
            width: 100
        },
        {
            header: '订单号',
            dataIndex: 'ord_seq_no',
            width: 100
        },
        {
            header: '完单号',
            dataIndex: 'prod_ord_seq',
            width: 70
        },
        {
            header: '款号',
            dataIndex: 'style_no',
            width: 70
        },
        {
            header: '国家',
            dataIndex: 'country',
            width: 60
        },
        {
            header: '颜色',
            dataIndex: 'color',
            width: 60
        },
        {
            header: '腰围',
            dataIndex: 'waist',
            width: 60
        },
        {
            header: '内长',
            dataIndex: 'in_length',
            width: 60
        },
        {
            header: '品名',
            dataIndex: 'article',
            width: 80
        },
        {
            header: '数量性质',
            dataIndex: 'nature',
            width: 80,
            renderer: transformNatureValue
        },
        {
            header: '数量(件)',
            dataIndex: 'amount',
            width: 60
        }
    ]);
    var cm_prod_ord = new Ext.grid.ColumnModel([
        {
            header: '产品归属',
            dataIndex: 'belong_grp_name',
            width: 120
        },
        {
            header: '状态',
            dataIndex: 'remark',
            width: 90
        },
        {
            header: '客户',
            dataIndex: 'cust_name',
            width: 100
        },
        {
            header: '交货日期',
            dataIndex: 'deli_date',
            width: 100
        },
        {
            header: '完单号',
            dataIndex: 'prod_ord_seq',
            width: 100
        },
        {
            header: '品名',
            dataIndex: 'article',
            width: 80
        },
        {
            header: '数量',
            dataIndex: 'amount',
            width: 80
        }
    ]);

    var cm_ord = new Ext.grid.ColumnModel([
        {
            header: '产品归属',
            dataIndex: 'belong_grp_name',
            width: 120
        },
        {
            header: '状态',
            dataIndex: 'remark',
            width: 90
        },
        {
            header: '客户',
            dataIndex: 'cust_name',
            width: 100
        },
        {
            header: '订单号',
            dataIndex: 'ord_seq_no',
            width: 100
        },
        {
            header: '交货日期',
            dataIndex: 'deli_date',
            width: 100
        },
        {
            header: '品名',
            dataIndex: 'article',
            width: 80
        },
        {
            header: '数量',
            dataIndex: 'amount',
            width: 80
        },
        {
            header: '备注',
            dataIndex: 'remark',
            width: 120
        }
    ]);

    var cm_detail = new Ext.grid.ColumnModel([
        {
            header: '工厂',
            dataIndex: 'belong_grp_name',
            width: 100
        },
        {
            header: '国家',
            dataIndex: 'country',
            width: 140
        },
        {
            header: '颜色',
            dataIndex: 'color',
            width: 140
        },
        {
            header: '内长',
            dataIndex: 'in_length',
            width: 120
        }
    ]);

    /**
     * 数据存储
     */
    var store_detail = new Ext.data.Store({
        // 获取数据的方式
        proxy: new Ext.data.HttpProxy({
            url: './manageEpc.ered?reqCode=queryProdDetailInfoByProdOrd'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            'belong_grp_name', 'country', 'color', 'in_length', 'waist1', 'waist2', 'waist3',
            'waist4', 'waist5', 'waist6', 'waist7', 'waist8', 'waist9', 'waist10', 'waist11',
            'waist12', 'waist13', 'waist14', 'waist15', 'waist16', 'nature', 'remark'
        ])
    });
    store_detail.on('load',function(){
        if(store_detail.getRange().length<=1) {
            Ext.Msg.alert('提示信息','<span style="color:red">非RFID订单请到<b>订单运作情况中</b>查询</span>')
        }
    });
    var store = new Ext.data.Store({
        // 获取数据的方式
        proxy: new Ext.data.HttpProxy({
            url: './manageEpc.ered?reqCode=queryProdDetailInfo'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            "product_id", "nature", "last_trm_no", "ord_seq_no", "prod_ord_seq", "deli_date", "style_no",
            "article", "color", "in_length", "waist", "country", "cust_name", "belong_grp",
            "belong_grp_name", "amount", "remark"
        ])
    });

    store.on('beforeload', function () {
        this.baseParams = {
            belong_grp_id: click_grp_id,
            click_cust_id: click_cust_id,
            style_no: Ext.getCmp('style_no_combo').getValue(),
            country: Ext.getCmp('country_combo').getValue(),
            color: Ext.getCmp('color_combo').getValue(),
            cloth_size: Ext.getCmp('cloth_size_combo').getValue(),
            epc: Ext.getCmp('epc').getValue(),
            showFlag: showFlag
        }
    });

    var pagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        triggerAction: 'all',
        mode: 'local',
        store: new Ext.data.ArrayStore({
            fields: ['value', 'text'],
            data: [
                [10, '10条/页'],
                [20, '20条/页'],
                [50, '50条/页'],
                [100, '100条/页'],
                [250, '250条/页'],
                [500, '500条/页']
            ]
        }),
        valueField: 'value',
        displayField: 'text',
        value: 50,
        editable: false,
        width: 85
    });


    var number = parseInt(pagesize_combo.getValue());

    pagesize_combo.on("select", function (comboBox) {
        bbar.pageSize = parseInt(comboBox.getValue());
        number = parseInt(comboBox.getValue());
        store.reload({
            params: {
                start: 0,
                limit: bbar.pageSize,
                belong_grp_id: click_grp_id,
                click_cust_id: click_cust_id,
                showFlag: showFlag
            }
        });
    });

    // 分页工具栏
    var bbar = new Ext.PagingToolbar({
        pageSize: number,
        store: store,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', pagesize_combo]
    });

    var styleNoStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './prodOrd.ered?reqCode=getProdBasInfoCombo'
        }),
        reader: new Ext.data.JsonReader({}, [
            {
                name: 'value'
            },
            {
                name: 'text'
            }
        ])
    });

    var countryStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './prodOrd.ered?reqCode=getProdBasInfoCombo'
        }),
        reader: new Ext.data.JsonReader({}, [
            {
                name: 'value'
            },
            {
                name: 'text'
            }
        ])
    });
    var colorStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './prodOrd.ered?reqCode=getProdBasInfoCombo'
        }),
        reader: new Ext.data.JsonReader({}, [
            {
                name: 'value'
            },
            {
                name: 'text'
            }
        ])
    });
    var clothSizeStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './prodOrd.ered?reqCode=getProdBasInfoCombo'
        }),
        reader: new Ext.data.JsonReader({}, [
            {
                name: 'value'
            },
            {
                name: 'text'
            }
        ])
    });

    var tbar = new Ext.Toolbar({
        items: [
            '显示类型:', {
                xtype: 'combo',
                id: 'showFlag',
                name: '',
                hiddenName: '',
                store: new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [
                        ['1', '显示具体产品'],
                        ['2', '显示生产通知单'],
                        ['3', '显示订单']
                    ]
                }),
                value: '1',
                mode: 'local',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                forceSelection: true,
                editable: false,
                typeAhead: true,
                width: 100,
                listeners: {
                    'select': function (combo) {
                        showFlag = combo.getValue();
                        changShowFlag(showFlag);
                        if (showFlag == '1') {
                            grid.reconfigure(store, cm_prod);
                        } else if (showFlag == '2') {
                            grid.reconfigure(store, cm_prod_ord);
                        } else if (showFlag == '3') {
                            grid.reconfigure(store, cm_ord);
                        }


                        if (click_cust_id != '' || click_grp_id != '') {
                            queryProdDetailInfo();
                        }
                    }
                }
            }, {
                xtype: 'tbtext',
                id: 'style_no_name',
                text: '款号:'
            }, {
                xtype: 'combo',
                id: 'style_no_combo',
                name: 'style_no',
                hiddenName: 'style_no',
                store: styleNoStore,
                mode: 'local',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                forceSelection: true,
                editable: false,
                typeAhead: true,
                width: 150
            }, {
                xtype: 'tbtext',
                id: 'country_name',
                text: '国家:'
            }, {
                xtype: 'combo',
                id: 'country_combo',
                name: 'country',
                hiddenName: 'country',
                store: countryStore,
                mode: 'local',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                forceSelection: true,
                editable: false,
                typeAhead: true,
                width: 100
            }, {
                xtype: 'tbtext',
                id: 'color_name',
                text: '颜色:'
            }, {
                xtype: 'combo',
                id: 'color_combo',
                name: 'color',
                hiddenName: 'color',
                store: colorStore,
                mode: 'local',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                forceSelection: true,
                editable: false,
                typeAhead: true,
                width: 100
            }, {
                xtype: 'tbtext',
                id: 'cloth_size_name',
                text: '尺码:'
            }, {
                xtype: 'combo',
                id: 'cloth_size_combo',
                name: 'cloth_size',
                hiddenName: 'cloth_size',
                store: clothSizeStore,
                mode: 'local',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                forceSelection: true,
                editable: false,
                typeAhead: true,
                width: 100
            }, '->', {
                xtype: 'textfield',
                name: 'epc',
                hidden:true,
                id: 'epc',
                emptyText: 'EPC'
            },
            {
                text: '查询',
                iconCls: 'page_findIcon',
                handler: function () {
                    queryProdDetailInfo();
                }
            },
            {
                text: '重置',
                iconCls: 'tbar_synchronizeIcon',
                handler: function () {
                    Ext.getCmp('style_no_combo').reset();
                    Ext.getCmp('style_no_combo').setValue();
                    Ext.getCmp('country_combo').reset();
                    Ext.getCmp('country_combo').setValue();
                    Ext.getCmp('color_combo').reset();
                    Ext.getCmp('color_combo').setValue();
                    Ext.getCmp('cloth_size_combo').reset();
                    Ext.getCmp('cloth_size_combo').setValue();
                    Ext.getCmp('epc').setValue();
                }
            },
            {
                text:'导出',
                id: 'import_button',
                iconCls: 'page_excelIcon',
                handler: function () {
                    exportExcel('./manageEpc.ered?reqCode=prodStateExport');
                }
            }
        ]
    });

    // 表格实例
    var grid = new Ext.grid.GridPanel({
        // 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
        height: 480,
        frame: true,
        store: store, // 数据存储
        stripeRows: true, // 斑马线
        cm: cm_prod, // 列模型
        tbar: tbar, // 表格工具栏
        bbar: bbar,// 分页工具栏
        viewConfig: {
            // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
            // forceFit : true
        },
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        }
    });

    /**详细数量信息(类似生产通知单)显示*/
    var grid_detail = new Ext.grid.GridPanel({
        title: '产品位置及数量',
        height: 480,
        frame: true,
        hidden: true,
        store: store_detail,
        stripeRows: true, // 斑马线
        cm: cm_detail, // 列模型
        viewConfig: {
// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
            forceFit: true
        },
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        }
    });
    /**
     * 订单状态下拉框
     */
    var orderStatusCombo = new Ext.form.ComboBox({
        anchor:"98%",
        width:90,
        fieldLabel:'订单状态',
        name:'orderstatus',
        id:'orderstatus',
        triggerAction:'all',
        store:new Ext.data.ArrayStore({
            fields:["value","text"],
            data:[
                  [9,"所有订单"],
                  [0,"未排产"],
                  [1,"在产中"],
                  [2,"已交货"]]
        }),
        displayField:'text',
        valueField:'value',
        mode:'local',
        value:9,
        emptyText:'选择订单状态',
        editable:false
    });
    orderStatusCombo.on('select',function(combo,record,idx){
       queryProdById();
    })
    var tbar2 = new Ext.Toolbar({
       items:['-','订单状态:',orderStatusCombo,'-',{
                anchor:"45%",
                xtype:'checkbox',
                boxLabel:'我的订单',
                name:'myorder',
                inputValue:'1',
                checked:false,
                id:'myorder',
                listeners:{
                    check:function(checkbox,checked){
                        queryProdById();
                    }
                }
           }]
    })
    var formPanel = new Ext.form.FormPanel({
        collapsible: false,
        border: false,
        region: 'north',
        labelWidth: 70, // 标签宽度
        frame: false, //是否渲染表单面板背景色
        labelAlign: 'right', // 标签对齐方式
        bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign: 'center',
        name: 'codeForm',
        height: 80,
        tbar: [
            '订单编号：',
            {
                fieldLabel: '订单编号',
                name: 'id',
                id: 'id',
                width: 100,
                xtype: 'textfield', //
                allowBlank: true, // 是否允许为空
                maxLength: 50, // 可输入的最大文本长度,不区分中英文字符
                anchor: '100%', // 宽度百分比
                listeners:{
                    specialkey:function(field,e){
                        if(e.getKey() == e.ENTER){
                            queryProdById();
                        }
                    }
                }
            }, '-',
            {
                text: '查询',
                iconCls: 'previewIcon',
                xtype: "button",
                handler: function () {
                    queryProdById();    
                }
            }],
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        border: false,
                        items: [
                        {
                                xtype: 'radiogroup',
                                id: 'leavRadio',
                                name: 'leavRadio',
                                columns: [.50, .50],
                                hideLabel: true,
                                listeners: {
                                    'change': function (radiogroup) {
                                        var value = formPanel.getForm().getValues()["leavRadio"];
                                        if (value == 0) {
                                            detaiQueryPanel.getLayout().setActiveItem(0);
                                            centerPanel.getLayout().setActiveItem(0);

                                            detaiQueryPanel.setTitle('工厂信息');
                                        } else if (value == 1) {
                                            detaiQueryPanel.getLayout().setActiveItem(1);
                                            centerPanel.getLayout().setActiveItem(0);
                                            detaiQueryPanel.setTitle('客户信息');
                                        }
                                    }
                                },
                                items: [
                                    {
                                        inputValue: '0',
                                        boxLabel: '按工厂',
                                        name: 'leavRadio',
                                        disabledClass: 'x-item'
                                    },
                                    {
                                        inputValue: '1',
                                        name: 'leavRadio',
                                        boxLabel: '按客户',
                                        checked: true,
                                        disabledClass: 'x-item'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        listeners:{
            render:function(component){
                tbar2.render(this.tbar);
            }
        }
    });

    var click_grp_id='';

    var grp_root = new Ext.tree.AsyncTreeNode({
        text: '分厂',
        expanded: true,
        id: 'root001'
    });
    var grpTreeLoader = new Ext.tree.TreeLoader({
        dataUrl: './sysGrps.ered?reqCode=belongGrpsOrdTreeInit'
    })
    grpTreeLoader.on('beforeload', function (treeLoader, node) {
        var os = Ext.getCmp("orderstatus").getValue();
        var isChecked = Ext.getCmp("myorder").checked;
        var myorder = isChecked?"yes":"";
        treeLoader.baseParams.order_id = Ext.getCmp('id').getValue();
        treeLoader.baseParams.orderstatus = os;
        treeLoader.baseParams.ismyorder = myorder;
    }, this);
    var grp_tree = new Ext.tree.TreePanel({
        animate: false,
        height: 400,
        margins: '3 0 3 3',
        root: grp_root,
        loader: grpTreeLoader,
        hidden: true,
        autoScroll: true,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    grp_tree.on('click', function (node) {
        showFlag = Ext.getCmp('showFlag').getValue();
        initFlag();
        click_grp_id = node.attributes.id;//点击的分厂编号
        click_cust_id = '';
        if (click_grp_id.indexOf('root') != -1) {
            return;
        } else if (click_grp_id.indexOf('prod') != -1) {
            check_column_value = node.attributes.value
            showDetailGridInfo(check_column_value);
            check_prod_ord_seq = click_grp_id.substring(4, click_grp_id.indexOf("_ord"));
            store_detail.reload({
                params: {
                    start: 0,
                    limit: bbar.pageSize,
                    prod_ord_seq: check_prod_ord_seq
                }
            });
            ordShortageDetail_store.reload({
                params:{
                    prod_ord_seq:check_prod_ord_seq,
                    flag:'prod_ord_seq'
                }
            })
            loadShortInfo();
        } else if (click_grp_id.indexOf('grps') != -1 || click_grp_id.indexOf('ord') != -1) {
            //因click_grp_id中包含'prod'时肯定包含'ord' 所以本判断放到'prod'后
            if (!grid.isVisible()) {
                centerPanel.getLayout().setActiveItem(0);
            }

            loadProdBasInfoStore();

            queryProdDetailInfo();

        }
    });

    var click_cust_id='';

    var cust_root = new Ext.tree.AsyncTreeNode({
        text: '客户',
        expanded: true,
        id: '001'
    });

    var custTreeLoader = new Ext.tree.TreeLoader({
        dataUrl: './custBas.ered?reqCode=getCustOrdInfoTree'
    });

    custTreeLoader.on("beforeload", function (treeLoader, node) {
        var os = Ext.getCmp("orderstatus").getValue();
        var isChecked = Ext.getCmp("myorder").checked;
        var myorder = isChecked?"yes":"";
        treeLoader.baseParams.order_id = Ext.getCmp('id').getValue();
        treeLoader.baseParams.orderstatus = os;
        treeLoader.baseParams.ismyorder = myorder;
    }, this);
    var cust_tree = new Ext.tree.TreePanel({
        animate: false,
        height: 400,
        margins: '3 0 3 3',
        root: cust_root,
        loader: custTreeLoader,
        autoScroll: true,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    cust_tree.on('click', function (node) {
        showFlag = Ext.getCmp('showFlag').getValue();
        initFlag();
        click_cust_id = node.attributes.id;//点击的id
        click_grp_id = '';
        if (click_cust_id.indexOf('area') != -1) {
            return;
        } else if (click_cust_id.indexOf('cust') != -1 || click_cust_id.indexOf('ord') != -1) {
            if (!grid.isVisible()) {
                centerPanel.getLayout().setActiveItem(0);
            }

            loadProdBasInfoStore();

            queryProdDetailInfo();
        } else if (click_cust_id.indexOf('prod') != -1) {

            check_column_value = node.attributes.value
            showDetailGridInfo(check_column_value);
            check_prod_ord_seq = click_cust_id.substring(4);
            store_detail.reload({
                params: {
                    start: 0,
                    limit: bbar.pageSize,
                    prod_ord_seq: check_prod_ord_seq
                }
            });
            ordShortageDetail_store.reload({
                params:{
                    prod_ord_seq:check_prod_ord_seq,
                    flag:'prod_ord_seq'
                }
            })
            loadShortInfo();
        }

    });

    var detaiQueryPanel = new Ext.Panel({
        title: "客户信息",
        layout: 'card',
        activeItem: 1,
        region: 'center',
        labelAlign: "right",
        labelWidth: 70,
        height: 800,
        frame: false,
        border : false,
        items: [
            grp_tree, cust_tree
        ]
    });

    var queryPanel = new Ext.Panel({
        title: "查询选择窗口",
        region: 'west',
        layout: 'border',
        border: true,
        margins : '3 3 3 3',
        labelAlign: "right",
        collapsible:true,
        labelWidth: 70,
        height: 500,
        width: 300,
        frame: false,
        items: [formPanel, detaiQueryPanel]
    });

    var short_detail_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });
    var short_detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), short_detail_sm,
        {
            header: '订单号',
            dataIndex: 'ord_seq_no',
            width: 100
        }, {
            header: '完单号',
            dataIndex: 'prod_ord_seq',
            width: 100
        }]);

    var short_detail_store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './ordSche.ered?reqCode=getDetailShortInfo'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [{
                name:'shortFac'
            },
            {
                name: 'nature'
            },
            {
                name: 'nature_value'
            },
            {
                name: 'color'
            },
            {
                name: 'country'
            },
            {
                name: 'in_length'
            },
            {
                name: 'waist1'
            },
            {
                name: 'waist2'
            },
            {
                name: 'waist3'
            },
            {
                name: 'waist4'
            },
            {
                name: 'waist5'
            },
            {
                name: 'waist6'
            },
            {
                name: 'waist7'
            },
            {
                name: 'waist8'
            },
            {
                name: 'waist9'
            },
            {
                name: 'waist10'
            },
            {
                name: 'waist11'
            },
            {
                name: 'waist12'
            },
            {
                name: 'waist13'
            },
            {
                name: 'waist14'
            },
            {
                name: 'waist15'
            },
            {
                name: 'waist16'
            }
        ])
    });
    // 翻页排序时带上查询条件
    short_detail_store.on('beforeload', function () {
        this.baseParams = {
            prod_ord_seq: check_prod_ord_seq
        };
    });
    short_detail_store.on('load', function (store) {
        short_back_store.removeAll();
        short_back_store.add(store.getRange());
    });
    
    var short_nature_combo = new Ext.ux.form.LovCombo({
        name: 'value',
        id: 'nature_combo',
        hiddenName: 'value',
        store: new Ext.data.ArrayStore({
            fields: ['value', 'text'],
            data: [
                ['sew_short_num', '缝制短缺'],
                ['sew_delivery_short','缝制交短缺'],
                ['bach_accept_short_num', '水洗收短缺'],
                ['bach_delivery_short_num', '水洗交短缺'],
                ['pack_accept_short_num', '后整收短缺'],
                ['product_short_num', '后整交短缺'], 
                ['receive_f_product_short','收成品短缺'],
                ['receive_b_product_short','收B品短缺'],
                ['sendout_f_short','成品短缺'],
                ['sendout_b_short','B品短缺']
            ]
        }),
        mode: 'local',
        hideTrigger: false,
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        emptyText: '请选择...',
        allowBlank: true,
        editable: false,
        anchor: "99%"
    });

    var short_back_store = new Ext.data.Store();
    var short_detail_grid = new Ext.grid.GridPanel({
        title: '短缺详情',
        height: 510,
        store: short_detail_store,
        region: 'center',
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        },
        viewConfig: {
            forceFit: true
        },
        stripeRows: true,
        frame: true,
        border: true,
        cm: short_detail_cm,
        sm: short_detail_sm,
        tbar: ['短缺类型:', short_nature_combo, '-', {
            text: '查询',
            id:'query4Shortdetail',
            iconCls: 'page_findIcon',
            handler: function () {
                query4Shortdetail();
            }
        },'-',{
            text:'数据填补',
            iconCls:'page_findIcon',
            handler:function(){
                isFill = 'yes';
                short_detail_store.load({
                    params:{
                        isFill:'yes'
                    }
                });
                ordShortageDetail_store.reload({
                    params:{
                        isFill:'yes',
                        flag:'prod_ord_seq',
                        prod_ord_seq:check_prod_ord_seq
                    }
                });
               short_nature_combo.clearValue();
            }
        },{
            text:'数据恢复',
            iconCls:'page_findIcon',
            handler:function(){
                 isFill = 'no';
                 short_detail_store.load({
                    params:{
                        isFill:'no'
                    }
                });
                ordShortageDetail_store.reload({
                    params:{
                        isFill:'no',
                        flag:'prod_ord_seq',
                        prod_ord_seq:check_prod_ord_seq
                    }
                });
                short_nature_combo.clearValue();
            }
        }, '->', {
            text: '导出',
            iconCls: 'page_excelIcon',
            handler: function () {
                var url = './ordSche.ered?reqCode=exportProdDetailShortInfo' +
                    '&shortNatures=' + short_nature_combo.getValue() +
                    '&columnValue=' + check_column_value + '&prod_ord_seq=' + check_prod_ord_seq+
                    '&isFill='+isFill;
                exportExcel(url);
            }
        }]
    });
    
    var view_panel = new Ext.Panel({
        title: '订单进度短缺图',
        html:'<div id="prodDetail_ordShortChart"></div>',
        region: 'center'
    });

    var tabPabel = new Ext.TabPanel({
        region: 'center',
        border: false,
        collapsed: false,
        deferredRender: true,
        layoutOnTabChange: true,
        activeTab: 0,
        autoScroll: true,
        items: [grid_detail, short_detail_grid, view_panel]
    });
    
    tabPabel.on('tabchange', function (tab, panel) {
        if (check_prod_ord_seq != '') {
            if (panel.title.indexOf("订单进度短缺图") != -1) {
                redrawOrdShortChart();

            } else if (panel.title.indexOf("短缺详情") != -1) {
                
            }
        }
    });

    var centerPanel = new Ext.Panel({
        title: "产品信息",
        region: 'center',
        layout: 'card',
        activeItem: 0,
        labelAlign: "right",
        labelWidth: 70,
        frame: false,
        border : false,
        margins : '3 3 3 0',
        items: [
            grid, tabPabel
        ]
    });

    /**
     * 布局
     */
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
            queryPanel, centerPanel
        ]
    });

    function showDetailGridInfo(columnValue) {
        var columnsIns = [];
        columnsIns.push({
            header: '产品性质',
            dataIndex: 'remark',
            align: 'center',
            width: 100
        });
        columnsIns.push({
            header: '数量性质',
            dataIndex: 'nature',
            align: 'center',
            width: 40,
            renderer: transformNatureValue
        });
        columnsIns.push({
            header: '产品归属',
            dataIndex: 'belong_grp_name',
            align: 'center',
            width: 80
        });
        columnsIns.push({
            header: '国家',
            dataIndex: 'country',
            align: 'center',
            width: 40
        });
        columnsIns.push({
            header: '颜色',
            dataIndex: 'color',
            align: 'center',
            width: 40
        });
        columnsIns.push({
            header: '内长',
            dataIndex: 'in_length',
            align: 'center',
            width: 40,
            sortable: true
        });
        var columns = columnValue.split(",");
        for (var i = 0; i < columns.length; i++) {
            columnsIns.push({
                header: columns[i],
                dataIndex: 'waist' + (i + 1),
                align: 'center',
                width: 40
            });
        }

        grid_detail.getColumnModel().setConfig(columnsIns);

        centerPanel.getLayout().setActiveItem(1);
    }

    /**载入下拉框信息*/
    function loadProdBasInfoStore() {

        Ext.getCmp('style_no_combo').reset();
        Ext.getCmp('style_no_combo').setValue();
        Ext.getCmp('country_combo').reset();
        Ext.getCmp('country_combo').setValue();
        Ext.getCmp('color_combo').reset();
        Ext.getCmp('color_combo').setValue();
        Ext.getCmp('cloth_size_combo').reset();
        Ext.getCmp('cloth_size_combo').setValue();
        
        var os = Ext.getCmp("orderstatus").getValue();
        var isChecked = Ext.getCmp("myorder").checked;
        var myorder = isChecked?"yes":"";
        
        styleNoStore.load({
            params: {
                click_cust_id: click_cust_id,
                click_grp_id: click_grp_id,
                flag: 'style_no',
                orderstatus:os,
                ismyorder:myorder
            }
        });
        countryStore.load({
            params: {
                click_cust_id: click_cust_id,
                click_grp_id: click_grp_id,
                flag: 'country',
                orderstatus:os,
                ismyorder:myorder
            }
        });
        colorStore.load({
            params: {
                click_cust_id: click_cust_id,
                click_grp_id: click_grp_id,
                flag: 'color',
                orderstatus:os,
                ismyorder:myorder
            }
        });
        clothSizeStore.load({
            params: {
                click_cust_id: click_cust_id,
                click_grp_id: click_grp_id,
                flag: 'cloth_size',
                orderstatus:os,
                ismyorder:myorder
            }
        });

    }

    function changShowFlag(showFlag) {
        if (showFlag != '1') {
            Ext.getCmp('style_no_combo').hide();
            Ext.getCmp('country_combo').hide();
            Ext.getCmp('color_combo').hide();
            Ext.getCmp('cloth_size_combo').hide();
            Ext.getCmp('style_no_name').hide();
            Ext.getCmp('country_name').hide();
            Ext.getCmp('color_name').hide();
            Ext.getCmp('cloth_size_name').hide();
            Ext.getCmp('epc').hide()
        } else {
            Ext.getCmp('style_no_combo').show();
            Ext.getCmp('country_combo').show();
            Ext.getCmp('color_combo').show();
            Ext.getCmp('cloth_size_combo').show();
            Ext.getCmp('style_no_name').show();
            Ext.getCmp('country_name').show();
            Ext.getCmp('color_name').show();
            Ext.getCmp('cloth_size_name').show();
            Ext.getCmp('epc').show()
        }
    }

    function queryProdDetailInfo() {
        var os = Ext.getCmp("orderstatus").getValue();
        var isChecked = Ext.getCmp("myorder").checked;
        var myorder = isChecked?"yes":"no";
        store.reload({
            params: {
                start: 0,
                limit: bbar.pageSize,
                belong_grp_id: click_grp_id,
                click_cust_id: click_cust_id,
                style_no: Ext.getCmp('style_no_combo').getValue(),
                country: Ext.getCmp('country_combo').getValue(),
                color: Ext.getCmp('color_combo').getValue(),
                cloth_size: Ext.getCmp('cloth_size_combo').getValue(),
                epc: Ext.getCmp('epc').getValue(),
                showFlag: showFlag,
                queryParams:Ext.getCmp('id').getValue(),
                orderstatus:os,
                ismyorder:myorder
            }
        });
    }

    function transformNatureValue(value) {
        if (value == '0') {
            return '标签入库';
        } else if (value == '1') {
            return '裁出数量';
        } else if (value == '2') {
            return '缝制领片';
        } else if (value == '3') {
            return '缝制下线';
        } else if (value == '4') {
            return '水洗收货';
        } else if (value == '5') {
            return '水洗移交';
        } else if (value == '6') {
            return '后整收货';
        } else if (value == '7') {
            return '移交成品';
        } else if (value == '8') {
            return '移交B品';
        } else if (value == '9') {
            return '标签解绑';
        }else if (value == '10'){
            return '收成品';
        } else if (value == '11'){
            return '收B品';
        } else if (value == '12'){
            return '中间领用';
        } else if (value == '13'){
            return '送水洗';
        }
    }
    function queryProdById(){
        var id = Ext.getCmp('id').getValue();
        if(id==null || id==''){
            cust_tree.root.reload();
            grp_tree.root.reload();
        }else {
            grp_tree.root.reload();
            grp_tree.expandAll();
            cust_tree.root.reload();
            cust_tree.expandAll();
        }
    };
    /**
     * 订单进度短缺图
     */
     var ordShortageDetail_store = new Ext.data.Store({
         proxy: new Ext.data.HttpProxy({
            url: 'ordSche.ered?reqCode=getPordShortInfo'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'TOTALCOUNT',
                root: 'ROOT'
            }, ['ord_seq_no', 'prod_ord_seq', 'column_value',
                'ins_num', 'order_id', 'article', 'brand', 'order_date', 'cust_id', 'order_num',
                'real_cut_num', 'draw_short_num', 'sew_short_num', 'bach_accept_short_num',
                'bach_delivery_short_num', 'pack_accept_short_num', 'product_short_num',
                'receive_f_product_short','receive_b_product_short','middle_take_short',
                'sew_delivery_short','sendout_f_short','sendout_b_short',
                'real_cut_fac','draw_fac','sew_fac','bach_accept_fac','bach_delivery_fac',
                'pack_accept_fac','f_product_fac','b_product_fac','receive_f_fac',
                'receive_b_fac','middle_take_fac','sew_delivery_fac','sendout_f_fac','sendout_b_fac'
        ])
    })
    var xAxisCategories = []
    var ordShortChartSeries = [];
    var ordShortChartTitle ='生产通知单短缺图';
    var ordShortChartSubTitle = '订单号,指令数,实裁数';
    var ordShortChartStr = ['sew_short_num','sew_delivery_short','bach_accept_short_num','bach_delivery_short_num',
                'pack_accept_short_num','product_short_num','receive_f_product_short','receive_b_product_short','sendout_f_short','sendout_b_short'];
    var shortName = ['缝制短缺','缝制交短缺','水洗收短缺','水洗交短缺','后整收短缺','后整交短缺','收成品短缺','收B品短缺','成品短缺','B品短缺']
    var facName = ['real_cut_fac','sew_delivery_fac','bach_accept_fac','bach_delivery_fac',
                    'pack_accept_fac','pack_delivery_fac','receive_f_fac','receive_b_fac','sendout_f_fac','sendout_b_fac'];
    //store加载结束重新画图
    ordShortageDetail_store.on('load',function(){
        //数据清零
        xAxisCategories = [];
        ordShortChartSeries = [];
        var ranges = ordShortageDetail_store.getRange();
        rangesLength = ranges.length;
        ordShortChartStrLength = ordShortChartStr.length;
        if(rangesLength==1){
            ordShortChartTitle = ranges[0].get('prod_ord_seq')+' 生产通知单短缺图';
            ordShortChartSubTitle = '订单号:'+ranges[0].get('ord_seq_no')+' 指令数:'+
                                        ranges[0].get('ins_num')+' 实裁数:'+ranges[0].get('real_cut_num')
        }else if(rangesLength>1){
            ordShortChartSubTitle='';
        }else if(rangesLength==0){
            ordShortChartTitle = '生产通知单短缺图';
            ordShortChartSubTitle = '没有短缺信息';
        }
        for(var k=0;k<rangesLength;k++){
            ordShortChartDate = [];
            record = ranges[k];
            for(var i=0;i<ordShortChartStrLength;i++){
                ordShortChartDate[i]=record.get(ordShortChartStr[i]);
            }
            ordShortChartSeries[k] = {data:ordShortChartDate,name:record.get('ord_seq_no')}
        }
        var record4xAjis = ordShortageDetail_store.getAt(0);
        for(var k=0;k<facName.length;k++){
            
            if(facName[k]=='pack_delivery_fac'){
                //处理后整交短缺
                var tempX = shortName[k]+'<br/>'+(record4xAjis.get('f_product_fac')==null?'':record4xAjis.get('f_product_fac'))+
                                    "<br/>" +(record4xAjis.get('b_product_fac')==null?'':record4xAjis.get('b_product_fac'));
                xAxisCategories[k] = tempX;
                
            }else{
                xAxisCategories[k] = shortName[k]+'<br/>'+record4xAjis.get(facName[k])
            }
        }
        
    });
     var ordShortObj = {
        chart:{
            type:'column'
        },
        colors: [
            '#4572A7', '#AAAAAA','#BBBBBB',
            '#AA4643', '#CCCCCC','#DDDDDD',
            '#89A54E', '#EEEEEE','#111111',
            '#80699B', '#225522','#333333',
            '#3D96AE', '#446644','#555555',
            '#DB843D', '#667766','#777777',
            '#92A8CD', '#889988','#999999',
            '#A47D7C', '#112233','#112244',
            '#B5CA92','#112255','#324355'
        ],
        title:{
            text:'生产通知单短缺图'
        },
        subtitle:{
            text:'订单号,指令数,实裁数'
        },
        xAxis:{
            categories:['缝制短缺','缝制交短缺','水洗收短缺','水洗交短缺','后整收短缺','后整交短缺','收成品短缺','收B品短缺','成品短缺','B品短缺']
        },
        yAxis:{
            allowDecimals:false,
            title:{
                text:'数量'
            },
            stackLabels:{
                enabled:true,
                style:{
                    fontWeight:'bold'
                },
                formatter:function(){
                    return this.total;
                }
            }
        },
        tooltip:{
            formatter:function(){
                 return this.x+":"+this.y;
            }
        },
        plotOptions:{
            column:{
                stacking:'normal',
                formatter:function(){
                    return this.y;
                }
            }
            
        },
        series:[],
        credits:{
            enabled:false
        },
        exporting:{
            enabled:false
        }
    }
    var ordShortChart = $('#prodDetail_ordShortChart').highcharts(ordShortObj).highcharts();
    function redrawOrdShortChart(){
        if(!Ext.isEmpty(ordShortChart)){
            ordShortChart.destroy();            
        }
        ordShortChart = $('#prodDetail_ordShortChart').highcharts(ordShortObj).highcharts();
        //TODO
        ordShortChart.xAxis[0].setCategories(xAxisCategories);
        ordShortSeriesLength = ordShortChartSeries.length;
        for(var k=0;k<ordShortSeriesLength;k++){
            ordShortChart.addSeries(ordShortChartSeries[k],false);
        }
        ordShortChart.setTitle({text:ordShortChartTitle},{text:ordShortChartSubTitle});
        ordShortChart.redraw();
    }
    
    function loadShortInfo(){
        var columnsIns = [];
        columnsIns.push({
            header:'短缺位置',
            dataIndex:'shortFac',
            width:70
        });
        columnsIns.push({
            header: '短缺性质',
            dataIndex: 'nature_value',
            align: 'center',
            width: 100
        });
        columnsIns.push({
            header: '国家',
            dataIndex: 'country',
            align: 'center',
            width: 40
        });
        columnsIns.push({
            header: '颜色',
            dataIndex: 'color',
            align: 'center',
            width: 40
        });
        columnsIns.push({
            header: '内长',
            dataIndex: 'in_length',
            align: 'center',
            width: 40,
            sortable: true
        });
        var columns = check_column_value.split(",");
        for (var i = 0; i < columns.length; i++) {
            columnsIns.push({
                header: columns[i],
                dataIndex: 'waist' + (i + 1),
                align: 'center',
                width: 40
            });
        }
        columnsIns.push({
            dataIndex: 'nature',
            align: 'center',
            hidden: true,
            width: 40
        });

        short_detail_grid.getColumnModel().setConfig(columnsIns);

        short_detail_store.load({
            params: {
                start: 0,
                limit: 9999,
                prod_ord_seq: check_prod_ord_seq
            }
        });
    }
        
    /**
     * 标志变量状态重置
     */
    function initFlag(){
        isFill = 'no';
    }
    /**
     * 短缺详情->查询
     */
    function query4Shortdetail(){
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
});