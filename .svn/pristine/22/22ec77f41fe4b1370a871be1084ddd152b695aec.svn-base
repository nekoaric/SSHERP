/**************
 * 分管企业管理
 *
 * @author may
 */
Ext.onReady(function () {
    var grpid, match_deptid;
    var flag;
    var belong_grpid, belong_grpname, belong_deptid, belong_deptname;
    var old_belong_deptid, old_belong_deptname;

	var firstLoad = true;
    var re = '<span style="color:red">*</span>';

    var root = new Ext.tree.AsyncTreeNode({
        text: '根部门',
        expanded: true,
        id: '001'
    });

    root.on('expand', function (node) {
        if (node.hasChildNodes&&firstLoad) {
			firstLoad = false;
            node.firstChild.fireEvent('click', node.firstChild);
        }
    })
    var deptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            baseAttrs: {},
            dataUrl: './sysGrps.ered?reqCode=belongGrpsTreeInit'
        }),
        root: root,
        title: '',
        autoScroll: false,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    deptTree.on('click', function (node) {
        grpid = node.attributes.id;
        belong_grpid = node.attributes.id;
        belong_grpname = node.attributes.text;
        belong_deptid = node.attributes.match_deptid;
        belong_deptname = node.attributes.match_deptname;

        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                grpid: grpid
            }
        });
    });

    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });
    var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
        header: '企业代码',
        dataIndex: 'grp_id',
        width: 70,
        hidden: true,
        sortable: true
    }, {
        header: '企业名称',
        dataIndex: 'name',
        width: 160
    }, {
        header: '企业简称',
        dataIndex: 'abbr',
        width: 80
    }, {
        header: '所属企业',
        dataIndex: 'belong_grpname',
        width: 120
    }, {
        header: '关联部门',
        dataIndex: 'match_deptname',
        width: 100
    }, {
        header: '所属城市',
        width: 55,
        hidde: true,
        dataIndex: 'city_code'
    }, {
        header: '企业状态',
        width: 60,
        hidden: true,
        dataIndex: 'access_state',
        renderer: function (value) {
            if (value == '0')
                return '待审核';
            else if (value == '1')
                return '待接入';
            else if (value == '2')
                return '待上线';
            else if (value == '3')
                return '正式上线';
        }
    }, {
        header: '企业规模',
        dataIndex: 'grp_size',
        width: 60
    }, {
        header: '企业地址',
        hidden: true,
        dataIndex: 'addr'
    }, {
        header: '邮政编码',
        width: 60,
        hidden: true,
        dataIndex: 'post_code'
    }, {
        header: '联系人',
        width: 50,
        dataIndex: 'lnk_name'
    }, {
        header: '联系电话',
        width: 90,
        hidden: true,
        dataIndex: 'lnk_telno'
    }, {
        header: '传真号码',
        width: 90,
        hidden: true,
        dataIndex: 'fax_no'
    }, {
        header: '电子邮箱',
        width: 90,
        hidden: true,
        dataIndex: 'email'
    }, {
        header: '持卡人数',
        width: 60,
        dataIndex: 'issu_num'
    }, {
        header: '卡户终端数',
        width: 70,
        dataIndex: 'dev1_num'
    }, {
        header: '消费终端数',
        width: 70,
        dataIndex: 'dev2_num'
    }, {
        header: '充值终端数',
        width: 70,
        dataIndex: 'dev3_num'
    }, {
        header: '考勤终端数',
        width: 70,
        dataIndex: 'dev4_num'
    }, {
        header: '门禁终端数',
        width: 70,
        dataIndex: 'dev5_num'
    }, {
        width: 70,
        hidden: true,
        dataIndex: 'match_deptid'
    }, {
        width: 70,
        hidden: true,
        dataIndex: 'belong_grpid'
    }, {
        width: 70,
        hidden: true,
        dataIndex: 'apps'
    }]);

    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './sysGrps.ered?reqCode=queryBelongGrpsInfo'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'grp_id'
            },
            {
                name: 'name'
            },
            {
                name: 'abbr'
            },
            {
                name: 'grp_size'
            },
            {
                name: 'type'
            },
            {
                name: 'apl_type'
            },
            {
                name: 'addr'
            },
            {
                name: 'post_code'
            },
            {
                name: 'prv_code'
            },
            {
                name: 'city_code'
            },
            {
                name: 'lnk_name'
            },
            {
                name: 'lnk_telno'
            },
            {
                name: 'ceo_name'
            },
            {
                name: 'ceo_telno'
            },
            {
                name: 'biz_lcns'
            },
            {
                name: 'crp_name'
            },
            {
                name: 'crp_telno'
            },
            {
                name: 'fax_no'
            },
            {
                name: 'email'
            },
            {
                name: 'mng_opr_id'
            },
            {
                name: 'mng_telno'
            },
            {
                name: 'mng_email'
            },
            {
                name: 'ptl_num'
            },
            {
                name: 'issu_num'
            },
            {
                name: 'dev1_num'
            },
            {
                name: 'dev2_num'
            },
            {
                name: 'dev3_num'
            },
            {
                name: 'dev4_num'
            },
            {
                name: 'dev5_num'
            },
            {
                name: 'ptl_opn_date'
            },
            {
                name: 'opn_date'
            },
            {
                name: 'ptl_end_date'
            },
            {
                name: 'access_state'
            },
            {
                name: 'match_deptid'
            },
            {
                name: 'match_deptname'
            },
            {
                name: 'belong_grpid'
            },
            {
                name: 'belong_grpname'
            },
            {
                name: 'apps'
            }
        ])
    });

    store.on('beforeload', function () {
        this.baseParams = {
            grpid: grpid
        };
    });

    var pagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        hiddenName: 'pagesize',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        store: new Ext.data.ArrayStore(
            {
                fields: [ 'value', 'text' ],
                data: [
                    [ 10, '10条/页' ],
                    [ 20, '20条/页' ],
                    [ 50, '50条/页' ],
                    [ 100, '100条/页' ],
                    [ 250, '250条/页' ],
                    [ 500, '500条/页' ]
                ]
            }),
        valueField: 'value',
        displayField: 'text',
        value: '20',
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
                limit: bbar.pageSize
            }
        });
    });

    var bbar = new Ext.PagingToolbar({
        pageSize: number,
        store: store,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg: "没有符合条件的记录",
        items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
    });

    var grid = new Ext.grid.GridPanel(
        {
            renderTo: 'codeTableGrid',
            height: 510,
            store: store,
            region: 'center',
            loadMask: {
                msg: '正在加载表格数据,请稍等...'
            },
            stripeRows: true,
            frame: true,
            cm: cm,
            sm: sm,
            tbar: [
                {
                    text: '新增',
                    iconCls: 'page_addIcon',
                    handler: function () {
                        ininAddCodeWindow();
                    }
                },
                '-',
                {
                    text: '关联现有部门',
                    iconCls: 'page_addIcon',
                    handler: function () {
                        ininRelativeCodeWindow();
                    }
                },
                '-',
                {
                    text: '修改',
                    iconCls: 'page_edit_1Icon',
                    handler: function () {
                        ininEditCodeWindow();
                    }
                },
                '-',
                {
                    text: '删除',
                    iconCls: 'page_delIcon',
                    handler: function () {
                        deleteCodeItem();
                    }
                },
                '-',
                {
                    text: '详细',
                    iconCls: 'page_edit_1Icon',
                    handler: function () {
                        ininDetailCodeWindow();
                    }
                }
            ],
            bbar: bbar
        });

    grid.addListener('rowdblclick', ininEditCodeWindow);

    grid.on('sortchange', function () {
        grid.getSelectionModel().selectFirstRow();
    });

    bbar.on("change", function () {
        grid.getSelectionModel().selectFirstRow();
    });

    /**
     * 布局
     */
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
            {
                title: '<span style="font-weight:normal">集团企业信息</span>',
                iconCls: 'chart_organisationIcon',
                tools: [
                    {
                        id: 'refresh',
                        handler: function () {
                            deptTree.root.reload()
                        }
                    }
                ],
                collapsible: true,
                width: 200,
                minSize: 140,
                maxSize: 280,
                split: true,
                region: 'west',
                autoScroll: true,
                // collapseMode:'mini',
                items: [ deptTree ]
            },
            {
                region: 'center',
                layout: 'fit',
                items: [ grid ]
            }
        ]
    });

    /**
     * 根据条件查询企业信息表
     */
    function queryCodeItem() {
        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                grpid: grpid
            }
        });
    }

    /** ******************详细************************ */
//    //省份
//    var prvCodeStore = new Ext.data.Store({
//        proxy: new Ext.data.HttpProxy({
//            url: './sysGrps.ered?reqCode=queryPrvCodeDatas'
//        }),
//        reader: new Ext.data.JsonReader({}, [
//            {
//                name: 'value'
//            },
//            {
//                name: 'text'
//            }
//        ])
//    });
//    prvCodeStore.load();
//    var prvCodeCombo_E = new Ext.form.ComboBox({
//        hiddenName: 'prv_code',
//        name: 'prv_code',
//        store: prvCodeStore,
//        mode: 'local',
//        triggerAction: 'all',
//        valueField: 'value',
//        displayField: 'text',
//        fieldLabel: '所属省份',
//        emptyText: '请选择所属省份...',
//        //allowBlank : false,
//        forceSelection: true,
//        editable: false,
//        fieldClass: 'x-custom-field-disabled',
//        typeAhead: true,
//        anchor: '100%'
//    });
    //城市
//    var cityCodeStore = new Ext.data.Store({
//        proxy: new Ext.data.HttpProxy({
//            url: './sysGrps.ered?reqCode=queryCityCodeDatas'
//        }),
//        reader: new Ext.data.JsonReader({}, [
//            {
//                name: 'value'
//            },
//            {
//                name: 'text'
//            }
//        ])
//    });
//    cityCodeStore.load();
//    var cityCodeCombo_E = new Ext.form.ComboBox({
//        hiddenName: 'city_code',
//        name: 'city_code',
//        store: cityCodeStore,
//        mode: 'local',
//        triggerAction: 'all',
//        valueField: 'value',
//        displayField: 'text',
//        fieldLabel: '所属城市',
//        emptyText: '请选择所属城市...',
//        allowBlank: false,
//        forceSelection: true,
//        editable: false,
//        fieldClass: 'x-custom-field-disabled',
//        typeAhead: true,
//        anchor: '100%'
//    });

    var addRoot = new Ext.tree.AsyncTreeNode({
        text: '根节点',
        id: '001',
        expanded: true
    });
	var addDeptLoader = new Ext.tree.TreeLoader({
		dataUrl: './sysGrps.ered?reqCode=matchDeptTreeInit'
	});

	addDeptLoader.on("beforeload", function(treeLoader, node) {
		treeLoader.baseParams.belong_deptid = belong_deptid;
		treeLoader.baseParams.belong_deptname = belong_deptname;
	}, this);

    var addDeptTree = new Ext.tree.TreePanel({
        loader: addDeptLoader,
        root: addRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
		rootVisible:false
    });

    // 监听下拉树的节点单击事件
    addDeptTree.on('click', function (node) {
        match_deptid = node.id;
		if(belong_deptid==match_deptid){
			Ext.Msg.alert('提示','不能选择根节点作为关联部门!');
			match_deptid='';
			comboxWithTree.setValue('');
			comboxWithTree.collapse();
			return;
		}
		comboxWithTree.setValue(node.text);
        comboxWithTree.collapse();
    });

    var comboxWithTree = new Ext.form.ComboBox({
        id: 'match_deptid',
        name: 'match_deptname',
        hiddenName: 'match_deptname',
        store: new Ext.data.SimpleStore({
            fields: [],
            data: [
                []
            ]
        }),
        fieldLabel: '关联部门' + re,
        editable: false,
        value: ' ',
        emptyText: '请选择...',
        anchor: '100%',
        mode: 'local',
        triggerAction: 'all',
        maxHeight: 390,
        listWidth: 200,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl: "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
        allowBlank: false,
        onSelect: Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    comboxWithTree.on('expand', function () {
        // 将UI树挂到treeDiv容器
        addDeptTree.render('addDeptTreeDiv');
		if(old_belong_deptid!=belong_deptid){
			old_belong_deptid = belong_deptid;
			addDeptTree.root.reload(); // 每次下拉都会加载数据
		}else{
			addDeptTree.root.expand();
		}


    });

    var editCodeWindow, editCodeFormPanel;
    editCodeFormPanel = new Ext.form.FormPanel(
        {
            id: 'editCodeFormPanel',
            name: 'editCodeFormPanel',
            collapsible: false,
            border: true,
            labelWidth: 75, // 标签宽度
            // frame : true, //是否渲染表单面板背景色
            labelAlign: 'right', // 标签对齐方式
            bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
            buttonAlign: 'center',
            height: 250,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '所属企业',
                                    name: 'belong_grpname',
                                    id: 'belong_grpname',
                                    anchor: '100%',
                                    allowBlank: false,
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            columnWidth: .66,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '企业名称' + re,
                                    name: 'name',
                                    id: 'name2',
                                    allowBlank: false,
                                    maxLength: 128,
                                    anchor: '100%'
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            id:'matchDeptColumn',
                            items: [comboxWithTree]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            id: 'deptnameColumn',
                            items: [
                                {
                                    fieldLabel: '部门名称' + re,
                                    name: 'deptname',
                                    id: 'dept_name',
                                    maxLength: 128,
                                    allowBlank: false,
                                    anchor: '100%'
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '企业简称',
                                    name: 'abbr',
                                    id: 'abbr2',
                                    maxLength: 16,
                                    anchor: '100%'
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    xtype: 'numberfield', // 设置为数字输入框类型
                                    allowDecimals: false, // 是否允许输入小数
                                    allowNegative: false, // 是否允许输入负数
                                    fieldLabel: '企业规模',
                                    name: 'grp_size',
                                    minValue: 1,
                                    anchor: '100%'
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .66,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '企业地址',
                                    name: 'addr',
                                    anchor: '100%',
									maxLength: 64
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '传真号码',
                                    name: 'fax_no',
                                    regex: /^\d{3}-\d{8}|\d{4}-\d{7}/,
                                    regexText: "传真号码格式不合法！格式:0000-0000000",
                                    maxLength: 12,
                                    anchor: '100%'
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '所属省份',
                                    name: 'prv_code',
                                    anchor: '100%',
									maxLength: 20
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '所属城市',
                                    name: 'city_code',
                                    anchor: '100%',
									maxLength: 20
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '负责人',
                                    maxLength: 32,
                                    name: 'ceo_name',
                                    anchor: '100%'
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '邮政编码',
                                    regex: /^[0-9]\d{5}(?!\d)/,
                                    regexText: '邮政编码格式不合法',
                                    name: 'post_code',
                                    maxLength: 6,
                                    anchor: '100%'
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '电子邮箱',
                                    name: 'email',
                                    regex: /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,// 验证电子邮件格式的正则表达式
                                    regexText: '电子邮件格式不合法', // 验证错误之后的提示信息
                                    anchor: '100%'
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: '联系电话', // 标签
                                    name: 'ceo_telno', // name:后台根据此name属性取值
                                    regex: /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(13[0-9]|15[0-9]|18[0-9])\d{8}/,
                                    regexText: '联系电话格式不合法',
                                    maxLength: 32,
                                    anchor: '100%' // 宽度百分比
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    xtype: 'numberfield', // 设置为数字输入框类型
                                    allowDecimals: false, // 是否允许输入小数
                                    allowNegative: false, // 是否允许输入负数
                                    fieldLabel: '消费终端数', // 标签
                                    maxValue: 100000,
                                    name: 'dev2_num', // name:后台根据此name属性取值
                                    anchor: '100%' // 宽度百分比
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    xtype: 'numberfield', // 设置为数字输入框类型
                                    allowDecimals: false, // 是否允许输入小数
                                    allowNegative: false, // 是否允许输入负数
                                    fieldLabel: '充值终端数', // 标签
                                    maxValue: 100000,
                                    name: 'dev3_num', // name:后台根据此name属性取值
                                    id: 'dev3_num',
                                    anchor: '100%' // 宽度百分比
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    xtype: 'numberfield', // 设置为数字输入框类型
                                    allowDecimals: false, // 是否允许输入小数
                                    allowNegative: false, // 是否允许输入负数
                                    fieldLabel: '考勤终端数', // 标签
                                    maxValue: 100000,
                                    name: 'dev4_num', // name:后台根据此name属性取值
                                    anchor: '100%' // 宽度百分比
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    xtype: 'numberfield', // 设置为数字输入框类型
                                    allowDecimals: false, // 是否允许输入小数
                                    allowNegative: false, // 是否允许输入负数
                                    fieldLabel: '门禁终端数', // 标签
                                    maxValue: 100000,
                                    name: 'dev5_num', // name:后台根据此name属性取值
                                    anchor: '100%' // 宽度百分比
                                }
                            ]
                        },
                        {
                            columnWidth: .33,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    xtype: 'numberfield', // 设置为数字输入框类型
                                    allowDecimals: false, // 是否允许输入小数
                                    allowNegative: false, // 是否允许输入负数
                                    fieldLabel: '持卡人数',
                                    name: 'issu_num',
                                    anchor: '100%'
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            labelWidth: 75, // 标签宽度
                            border: false,
                            items: [
                                {
                                    xtype: 'checkboxgroup',
                                    itemCls: 'x-check-group-alt',
                                    id: 'appCheckGroup',
                                    fieldLabel: '平台功能',
                                    items: [
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '人事档案',
                                            disabledClass: 'x-item',
                                            name: 'emp',
                                            id: 'emp'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '人事工资',
                                            disabledClass: 'x-item',
                                            name: 'wage',
                                            id: 'wage'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '卡务管理',
                                            disabledClass: 'x-item',
                                            name: 'crd',
                                            id: 'crd'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '人事考勤',
                                            disabledClass: 'x-item',
                                            name: 'cwa',
                                            id: 'cwa'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '门禁管理',
                                            disabledClass: 'x-item',
                                            name: 'aeg',
                                            id: 'aeg'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '访客管理',
                                            disabledClass: 'x-item',
                                            name: 'vst',
                                            id: 'vst'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '消费管理',
                                            disabledClass: 'x-item',
                                            name: 'cns',
                                            id: 'cns'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '场馆管理',
                                            disabledClass: 'x-item',
                                            name: 'gym',
                                            id: 'gym'
                                        },
                                        {
                                            inputValue: '1',
                                            checked: true,
                                            boxLabel: '系统配置',
                                            hidden:true,
                                            disabledClass: 'x-item',
                                            name: 'arm',
                                            id: 'arm'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'dev2_num', // name:后台根据此name属性取值
                            hidden: true,
                            id: 'pre_dev2_num',
                            anchor: '100%' // 宽度百分比
                        },
                        {
                            xtype: 'numberfield',
                            name: 'dev4_num', // name:后台根据此name属性取值
                            hidden: true,
                            id: 'pre_dev4_num',
                            anchor: '100%' // 宽度百分比
                        },
                        {
                            xtype: 'textfield',
                            name: 'belong_grpid', // name:后台根据此name属性取值
                            hidden: true,
                            id: 'belong_grpid',
                            anchor: '100%' // 宽度百分比
                        },
                        {
                            xtype: 'textfield',
                            name: 'grp_id', // name:后台根据此name属性取值
                            hidden: true,
                            anchor: '100%' // 宽度百分比
                        },
                        {
                            xtype: 'textfield',
                            name: 'old_apps',
                            id: 'old_apps',
                            hidden: true,
                            anchor: '100%' // 宽度百分比
                        }
                    ]
                }
            ]
        });
    editCodeWindow = new Ext.Window({
        layout: 'fit',
        width: 780, // 窗口宽度
        height: 300, // 窗口高度
        resizable: false,
        draggable: false,
        closeAction: 'hide',
        title: '企业信息详情',
        iconCls: 'page_addIcon',
        modal: true,
        collapsible: true,
        maximizable: false,
        buttonAlign: 'right',
        border: false,
        animCollapse: true,
        animateTarget: Ext.getBody(),
        constrain: true,
        items: [ editCodeFormPanel ],
        buttons: [
            {
                text: '保存',
                iconCls: 'acceptIcon',
                id: 'grpSaveButton',
                handler: function () {
                    if (flag == 'update') {//修改企业信息
                        updateCodeItem();
                    } else {//新增企业信息||关联企业信息
                        saveCodeItem();
                    }

                }
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                handler: function () {
                    editCodeWindow.hide();
                }
            }
        ]
    });

    /**
     * 新增企业信息初始化
     */
    function ininAddCodeWindow() {
        if (Ext.isEmpty(belong_grpid)) {
            Ext.Msg.alert('提示', '请先选择所属企业信息!');
            return;
        }
        flag = 'save';
        clearFormPanel(editCodeFormPanel);
        Ext.getCmp('belong_grpname').setValue(belong_grpname);
        Ext.getCmp('belong_grpid').setValue(belong_grpid);

        setFormPanelReadOnly(editCodeFormPanel, false);
        Ext.getCmp("appCheckGroup").setDisabled(false);
        Ext.getCmp('belong_grpname').setReadOnly(true);
        Ext.getCmp('grpSaveButton').show();

        editCodeWindow.show();
        editCodeWindow.setTitle("企业信息新增");
        Ext.getCmp('matchDeptColumn').hide();
        Ext.getCmp('match_deptid').allowBlank = true;
        Ext.getCmp('dept_name').allowBlank = false;
        match_deptid = '';
        Ext.getCmp('deptnameColumn').show();
    }

    /**
     *
     */
    function ininRelativeCodeWindow() {
        if (Ext.isEmpty(belong_grpid)) {
            Ext.Msg.alert('提示', '请先选择所属企业信息!');
            return;
        }
        flag = 'relate';
        clearFormPanel(editCodeFormPanel);
        Ext.getCmp('belong_grpname').setValue(belong_grpname);
        Ext.getCmp('belong_grpid').setValue(belong_grpid);

        setFormPanelReadOnly(editCodeFormPanel, false);
        Ext.getCmp("appCheckGroup").setDisabled(false);
        Ext.getCmp('belong_grpname').setReadOnly(true);
        Ext.getCmp('grpSaveButton').show();

        editCodeWindow.show();
        editCodeWindow.setTitle("企业信息关联新增");
        Ext.getCmp('matchDeptColumn').show();
        Ext.getCmp('match_deptid').allowBlank = false;
        Ext.getCmp('deptnameColumn').hide();
        Ext.getCmp('dept_name').allowBlank = true;
    }

    /**
     * 修改企业信息初始化
     */
    function ininEditCodeWindow() {
        flag = 'update';
        var record = grid.getSelectionModel().getSelected();


        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: '警告',
                msg: "请先选择一条企业信息..",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        editCodeWindow.show();

        setFormPanelReadOnly(editCodeFormPanel, false);

        //初始话表单中元素状态
        Ext.getCmp('match_deptid').setReadOnly(true);
        Ext.getCmp('belong_grpname').setReadOnly(true);
        Ext.getCmp("appCheckGroup").setDisabled(false);
        editCodeFormPanel.getForm().loadRecord(record);

        loadAppsInfo(record);
        Ext.getCmp('old_apps').setValue(record.get('apps'));

        match_deptid = record.get('match_deptid');
        editCodeWindow.setTitle("企业信息修改");
        Ext.getCmp('grpSaveButton').show();
        Ext.getCmp('matchDeptColumn').show();
        Ext.getCmp('match_deptid').allowBlank = true;
        Ext.getCmp('dept_name').allowBlank = true;
        Ext.getCmp('deptnameColumn').hide();
    }

    /**
     * 企业详细信息初始化
     */
    function ininDetailCodeWindow() {
        var record = grid.getSelectionModel().getSelected();
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: '警告',
                msg: "请先选择一条企业信息..",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        editCodeWindow.show();

        setFormPanelReadOnly(editCodeFormPanel, true);

        editCodeFormPanel.getForm().loadRecord(record);
        loadAppsInfo(record);
        Ext.getCmp("appCheckGroup").setDisabled(true);
        editCodeWindow.setTitle("企业信息详细");
        Ext.getCmp('grpSaveButton').hide();
        Ext.getCmp('deptnameColumn').hide();
        Ext.getCmp('matchDeptColumn').show();
    }

    /**
     * 企业信息新增
     */
    function saveCodeItem() {
        if (!editCodeFormPanel.form.isValid()) {
            return;
        }
        editCodeFormPanel.form.submit({
            url: './sysGrps.ered?reqCode=saveSysGrpsItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                editCodeWindow.hide();
                store.reload();
                deptTree.root.reload();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure: function (form, action) {
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            params: {
                match_deptid: match_deptid,
                flag: flag,
                belong_deptid: belong_deptid
            }
        });
    }

    /**
     * 企业信息修改
     */
    function updateCodeItem() {
        if (!editCodeFormPanel.form.isValid()) {
            return;
        }
        var record = grid.getSelectionModel().getSelected();
        editCodeFormPanel.form.submit({
            url: './sysGrps.ered?reqCode=updateSysGrpsItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                editCodeWindow.hide();
                store.reload();
				deptTree.root.reload();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure: function (form, action) {
                Ext.MessageBox.alert('提示', action.result.msg);
            }, params: {
                match_deptid: match_deptid,
                pre_dev2_num: record.get('dev2_num'),
                pre_dev4_num: record.get('dev4_num')
            }
        });
    }

    //所属企业删除确认窗口
    var delWin = new Ext.Window({
        layout: 'fit',
        width: 320,
        height: 140,
        resizable: true,
        draggable: true,
        closeAction: 'hide',
        pageY: 100,
        modal: true,
        pageX: document.body.clientWidth / 2 - 200 / 2,
        title: '确定要删除该企业信息吗?',
        buttonAlign: 'right',
        border: false,
        animateTarget: Ext.getBody(),
        items: [
            {
                id: 'winHtml',
                html: '<div style="padding:10 5 0;">' +
                    '<span style="color:red">全部删除</span>:删除对应的企业信息及<span style="color:red">部门信息</span></br>' +
                    '<span style="color:red">删除企业</span>:删除对应的企业信息</br>' +
                    '<span style="color:red">放弃删除</span>:不进行删除操作</div>'
            }
        ],
        buttons: [
            {
                text: '全部删除',
                iconCls: 'deleteIcon',
                handler: function () {
                    delGrpInfo('all');
                }
            },
            {
                text: '删除企业',
                iconCls: 'deleteIcon',
                handler: function () {
                    delGrpInfo('grps');
                }
            },
            {
                text: '放弃删除',
                iconCls: 'page_delIcon',
                handler: function () {
                    delWin.hide();
                }
            }
        ]
    });

    /**
     * 企业信息删除
     */
    function deleteCodeItem() {
        var record = grid.getSelectionModel().getSelected();
        if (Ext.isEmpty(record)) {
            Ext.Msg.alert('提示', '请先选择企业信息!');
            return;
        }
        delWin.show();
    }

    function delGrpInfo(flag) {
        var record = grid.getSelectionModel().getSelected();
        Ext.Ajax.request({
            url: './sysGrps.ered?reqCode=deleteSysGrpsItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (response) {
                var resultArray = Ext.util.JSON.decode(response.responseText);
                //删除成功后初始化各个变量
                grpid = '';
                belong_grpid = '';
                belong_grpname = '';
				old_belong_deptid ='notnull';//设置旧的关联部门和选择的部门不同
                deptTree.root.reload();
                store.reload();
                Ext.MessageBox.alert('提示', resultArray.msg);
                delWin.hide();
            },
            failure: function (response) {
                var resultArray = Ext.util.JSON
                    .decode(response.responseText);
                Ext.MessageBox.alert('提示', resultArray.msg);
            },
            params: {
                grp_id: record.get('grp_id'),
                match_deptid: record.get('match_deptid'),
                flag: flag
            }
        });
    }

    /**
     * 解析record中的apps字段
     * @param record
     */
    function loadAppsInfo(record) {
        var apps = record.get('apps').split(",");
        var keys = ["emp", "wage", "crd", "cwa", "aeg", "vst", "gym", "cns", "arm"];
        Ext.getCmp("appCheckGroup").reset();
        for (var i = 0; i < apps.length; i++) {
            var value = apps[i];
            if (value == '0')
                Ext.getCmp(keys[i]).setValue(false);
        }
    }

    /**
     * 设置表单元素只读属性
     * @param formpanel 表单
     * @param value 是否只读 false|true
     */
    function setFormPanelReadOnly(formpanel, value) {
        var typeArray = ['textfield', 'combo', 'datefield', 'textarea', 'numberfield', 'htmleditor', 'timefield'];
        for (var i = 0; i < typeArray.length; i++) {
            var typeName = typeArray[i];
            var itemArray = formpanel.findByType(typeName);
            for (var j = 0; j < itemArray.length; j++) {
                var element = itemArray[j];
                element.setReadOnly(value);
            }
        }
    }
});