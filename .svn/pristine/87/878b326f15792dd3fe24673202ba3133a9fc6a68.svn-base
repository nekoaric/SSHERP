/**
 * 分厂管理员管理与授权
 *
 * @author cnnct
 * @since 2010-04-20
 */
Ext.onReady(function () {
    var indepd_cwa_ctrl = 0;// 初始化-0
    var match_deptid, deptid;
    var belong_grpname;
    var apps;
    var re = '<span style="color:red">*</span>';

    var root = new Ext.tree.AsyncTreeNode({
        text: '根部门',
        expanded: true,
        id: '001'
    });
    var deptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            baseAttrs: {},
            dataUrl: './sysGrps.ered?reqCode=belongGrpsTreeInit'
        }),
        root: root,
        title: '',
        applyTo: 'deptTreeDiv',
        autoScroll: false,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible:false
    });

    deptTree.root.select();
    deptTree.on('click', function (node) {
        Ext.getCmp('queryParam').setValue('');
        deptid = node.attributes.match_deptid;
        apps = node.attributes.apps;
        match_deptid = node.attributes.match_deptid;
        belong_grpname = node.attributes.text;

        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                deptid: deptid,
                usertype: '5'
            }
        });
    });

    var pwdStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './sysGrps.ered?reqCode=randomPwd' // 后台请求地址
        }),
        reader: new Ext.data.JsonReader({}, [
            { // 定义后台返回数据格式
                name: 'newpassword'
            }
        ])
    });

    var sm = new Ext.grid.CheckboxSelectionModel();

    /** 定义列头 */
    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
        header: '人员编号',
        dataIndex: 'userid',
        hidden: true
    }, {
        header: '管理员编号',
        dataIndex: 'account',
        align: 'center',
        width: 80
    }, {
        header: '管理员姓名',
        dataIndex: 'username',
        align: 'center',
        width: 80
    }, {
        header: '分管企业',
        align: 'center',
        dataIndex: 'managegrpname',
        width: 120
    }, {
        id: 'deptname',
        header: '所属部门',
        align: 'left',
        dataIndex: 'deptname',
        width: 80
    }, {
        id: 'usertype',
        header: '员工类型',
        dataIndex: 'usertype',
        align: 'center',
        width: 80,
        hidden: true,
        renderer: USERTYPERender
    }, {
        header: '菜单角色',
        dataIndex: 'rolename',
        hidden: true,
        align: 'center',
        width: 110
    }, {
        header: '数据角色',
        dataIndex: 'datarolename',
        align: 'center',
        width: 110
    }, {
        header: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 40,
        renderer: function (value) {
            if (value == '1')
                return '男';
            else if (value == '2')
                return '女';
            else if (value == '0')
                return '未知';
            else
                return value;
        }
    }, {
        header: '人员状态',
        dataIndex: 'locked',
        align: 'center',
        width: 60,
        renderer: function (value) {
            if (value == '1')
                return '锁定';
            else if (value == '0')
                return '正常';
            else
                return value;
        }
    }, {
        id: 'id_crd',
        header: '身份证号',
        dataIndex: 'id_crd',
        hidden: true,
        align: 'center',
        width: 120
    }, {
        header: '手机号码',
        dataIndex: 'mbl_no',
        align: 'center',
        width: 85
    }, {
        header: '电子邮件',
        dataIndex: 'email',
        align: 'center',
        width: 85
    }, {
        id: 'birthday',
        header: '出生日期',
        dataIndex: 'birthday',
        hidden: true,
        width: 85
    }, {
        header: '固定电话',
        dataIndex: 'tel_no',
        hidden: true,
        width: 85
    }, {
        header: '是否有特殊数据权限',
        dataIndex: 'userperm',
        align: 'center',
        hidden:true,
        width: 120,
        renderer: function (value) {
            if (value == 0) {
                return '否';
            } else if (value > 0) {
                return '是';
            }
        }
    }, {
        header: '状态',
        width: 40,
        align: 'center',
        dataIndex: 'state',
        renderer: function (value) {
            if (value == '0')
                return '启用';
            else if (value == '1')
                return '停用';
        }
    }, {
        id: 'tmp_crd',
        header: '暂住证号',
        hidden: true,
        dataIndex: 'tmp_crd'
    }, {
        id: 'nat_plc',
        header: '籍贯',
        hidden: true,
        dataIndex: 'nat_plc'
    }, {
        id: 'duty_name',
        header: '职务',
        hidden: true,
        dataIndex: 'duty_name',
        width: 150
    }, {
        id: 'remark',
        header: '备注',
        hidden: true,
        dataIndex: 'remark'
    }, {
        header: '所属部门编号',
        dataIndex: 'deptid',
        hidden: true
    }, {
        id: 'duty',
        dataIndex: 'duty',
        hidden: true
    }, {
        id: 'bank_no',
        dataIndex: 'bank_no',
        hidden: true
    }, {
        dataIndex: 'grp_city',
        hidden: true
    }, {
        id: 'roleid',
        hidden: true
    }, {
        dataIndex: 'dataroleid',
        hidden: true
    }, {
        dataIndex: 'apps',
        hidden: true
    }
    ]);

    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './user.ered?reqCode=queryUsersForManage'
        }),
		baseParams:{usertype:'5'},
		reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'userid'
            },
            {
                name: 'username'
            },
            {
                name: 'sex'
            },
            {
                name: 'account'
            },
            {
                name: 'locked'
            },
            {
                name: 'deptid'
            },
            {
                name: 'deptname'
            },
            {
                name: 'remark'
            },
            {
                name: 'usertype'
            },
            {
                name: 'id_crd'
            },
            {
                name: 'tmp_crd'
            },
            {
                name: 'mbl_no'
            },
            {
                name: 'birthday'
            },
            {
                name: 'nat_plc'
            },
            {
                name: 'carrer'
            },
            {
                name: 'duty_name'
            },
            {
                name: 'tech_post'
            },
            {
                name: 'wedlock'
            },
            {
                name: 'post_code'
            },
            {
                name: 'address'
            },
            {
                name: 'email'
            },
            {
                name: 'tel_no'
            },
            {
                name: 'mbl_no'
            },
            {
                name: 'vir_no'
            },
            {
                name: 'carrier'
            },
            {
                name: 'duty'
            },
            {
                name: 'bank_no'
            },
            {
                name: 'grp_city'
            },
            {
                name: 'roleid'
            },
            {
                name: 'dataroleid'
            },
            {
                name: 'rolename'
            },
            {
                name: 'datarolename'
            },
            {
                name: 'state'
            },
            {
                name: 'userperm'
            },
            {
                name: 'managegrpname'
            },
            {
                name: 'apps'
            }
        ])
    });

    var pagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        hiddenName: 'pagesize',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
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
                limit: bbar.pageSize,
                usertype: '5'
            }
        });
    });
    var bbar = new Ext.PagingToolbar({
        pageSize: number,
        store: store,
        displayInfo: true,
        plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
        displayMsg: '显示{0}条到{1}条,共{2}条',
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', pagesize_combo]
    });
    var grid = new Ext.grid.GridPanel({
        title: '<img src="./resource/image/ext/group.png" align="top" class="IEPNG"><span style="font-weight:normal">人员信息表</span>',
        renderTo: 'userGridDiv',
        height: 500,
        // width:600,
        autoScroll: true,
        region: 'center',
        store: store,
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
                    addInit();
                }
            },
            '-',
            {
                text: '修改',
                iconCls: 'page_edit_1Icon',
                handler: function () {
                    editInit();
                }
            },
            '-',
            {
                text: '停用',
                iconCls: 'page_delIcon',
                handler: function () {
                    shutoractiveSysGrpZG("shut");
                }
            },
            '-',
            {
                text: '启用',
                iconCls: 'page_delIcon',
                handler: function () {
                    shutoractiveSysGrpZG("open");
                }
            },
            '-',
            {
                text: '刷新',
                iconCls: 'page_refreshIcon',
                handler: function () {
                    queryUserItem();
                }
            },
            {
                text: '新增特殊数据权限',
                iconCls: 'page_addIcon',
                hidden:true,
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();
                    if (Ext.isEmpty(record)) {
                        Ext.Msg.alert('提示', '请选择用户数据!');
                        return;
                    }

                    userid = record.get('userid');
                    //加载授权部门树信息
                    userPermDeptTree.root.reload();

                    roleGrantWindow.show();

                }
            },
            '->',
            new Ext.form.TextField({
                id: 'per_no',
                name: 'per_no',
                emptyText: '管理员编号',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserItem();
                        }
                    }
                },
                width: 80
            }),
            '-',
            new Ext.form.TextField({
                id: 'queryParam',
                name: 'queryParam',
                emptyText: '姓名',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserItem();
                        }
                    }
                },
                width: 80
            }),
            {
                text: '查询',
                iconCls: 'page_findIcon',
                handler: function () {
                    queryUserItem();
                }
            }
        ],
        bbar: bbar
    });

    store.load({
        params: {
            start: 0,
            limit: bbar.pageSize,
            usertype: '5'

        }
    });

    store.on('beforeload', function () {
        this.baseParams = {
            deptid: deptid,
            usertype: '5'
        };
    });

    grid.on('rowdblclick', function (grid, rowIndex, event) {
        editInit();
    });
    grid.on('sortchange', function () {
        grid.getSelectionModel().selectFirstRow();
    });


    var sexStore = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: [
            ['1', '1 男'],
            ['2', '2 女']
        ]
    });
    var sexCombo = new Ext.form.ComboBox({
        name: 'sex',
        hiddenName: 'sex',
        store: sexStore,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        value: '1',
        fieldLabel: '性别',
        emptyText: '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "95%"
    });

    var lockedStore = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: [
            ['0', '0 正常'],
            ['1', '1 锁定']
        ]
    });

    var lockedCombo = new Ext.form.ComboBox({
        name: 'locked',
        hiddenName: 'locked',
        store: lockedStore,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        value: '0',
        fieldLabel: '人员状态',
        emptyText: '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "95%"
    });

    /** 职务下拉框定义 */
    var dutyStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './duty.ered?reqCode=queryAllDuty'
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
    var dutyCombo = new Ext.form.ComboBox({
        name: 'duty',
        hiddenName: 'duty',
        id: 'duty_id',
        value: '0',
        store: dutyStore,
        mode: 'remote',
        fieldLabel: '职务',
        emptyText: '请选择...',
        triggerAction: 'all',
        displayField: 'text',
        valueField: 'value',
        loadingText: '正在加载数据...',
        forceSelection: true,
        typeAhead: true,
        resizable: true,
        editable: false,
        anchor: "95%"
    });

    var belognGrpsRoot = new Ext.tree.AsyncTreeNode({
        text: '根部门',
        id: '001',
        expanded: true
    });

    var belognGrpsTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            dataUrl: './sysGrps.ered?reqCode=belongGrpsTreeInit'
        }),
        root: belognGrpsRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible:false
    });

    // 监听下拉树的节点单击事件
    belognGrpsTree.on('click', function (node) {
        belognGrpsCombo.setValue(node.text);
        match_deptid = node.attributes.match_deptid;
        var apps = node.attributes.apps;
        Ext.getCmp('apps').setValue(apps);

		Ext.getCmp('deptid').setValue(match_deptid);
        belognGrpsCombo.collapse();
    });

    var belognGrpsCombo = new Ext.form.ComboBox({
        id: 'match_deptid',
        store: new Ext.data.SimpleStore({
            fields: [],
            data: [
                []
            ]
        }),
        fieldLabel: '所属分厂' + re,
        editable: false,
        value: ' ',
        emptyText: '请选择...',
        anchor: '95%',
        mode: 'local',
        triggerAction: 'all',
        maxHeight: 390,
        // 下拉框的显示模板,belognGrpsTreeDiv作为显示下拉树的容器
        tpl: "<tpl for='.'><div style='height:390px'><div id='belognGrpsTreeDiv'></div></div></tpl>",
        allowBlank: false,
        onSelect: Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    belognGrpsCombo.on('expand', function () {
        // 将UI树挂到treeDiv容器
        belognGrpsTree.render('belognGrpsTreeDiv');
        belognGrpsTree.root.expand(); //只是第一次下拉会加载数据
    });

    var addUserFormPanel = new Ext.form.FormPanel({
        id: 'addUserFormPanel',
        name: 'addUserFormPanel',
        width: 480,
        height: 380,
        labelAlign: 'right', // 标签对齐方式
        bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign: 'center',
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: .5,
                        layout: 'form',
                        labelWidth: 80, // 标签宽度
                        defaultType: 'textfield',
                        border: false,
                        items: [
                            {
                                fieldLabel: '管理员编号' + re,
                                regex: /^[A-Za-z0-9]+$/,
                                regexText: '管理员编号只能为数字或字母',
                                maxLength: 20, // 可输入的最大文本长度,不区分中英文字符
                                name: 'account',
                                id: 'account',
                                allowBlank: false,
                                anchor: '95%' // 根据窗口，自动调整文本框的宽度
                            },
                            belognGrpsCombo,
                            sexCombo,
                            {
                                fieldLabel: '电子邮件',
                                regex: /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,// 验证电子邮件格式的正则表达式
                                regexText: '电子邮件格式不合法', // 验证错误之后的提示信息
                                name: 'email',
                                id: 'email',
                                allowBlank: true,
                                anchor: '95%'
                            },
                            {
                                xtype: 'datefield',
//                                fieldLabel: '出生日期', // 标签
                                name: 'birthday', // name:后台根据此name属性取值
                                id: 'birthday', // name:后台根据此name属性取值
                                format: 'Y-m-d', // 日期格式化
                                value: new Date(),
                                hidden: true,
                                anchor: '95%' // 宽度百
                            },
                            {
//                                fieldLabel: '通讯地址',
                                name: 'address',
                                id: 'address',
                                hidden: true,
                                allowBlank: true,
                                anchor: '95%'
                            },
                            {
                                fieldLabel: '',
                                name: 'id_crd',
                                hidden: true,
                                id: 'id_crd',
                                anchor: '95%'
                            },
                            {
//                                fieldLabel: '籍贯',
                                name: 'nat_plc',
                                id: 'nat_plc',
                                hidden: true,
                                allowBlank: true,
                                anchor: '95%'
                            }
                        ]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        labelWidth: 80, // 标签宽度
                        defaultType: 'textfield',
                        border: false,
                        items: [
                            {
                                fieldLabel: '管理员姓名' + re,
                                name: 'username',
                                id: 'username',
                                allowBlank: false, // 是否允许为空
                                anchor: '95%'
                            },
                            {
                                fieldLabel: '密   码' + re,
                                name: 'password',
                                id: 'newpwd',
                                allowBlank: false,
                                regex: /^[A-Za-z0-9]+$/,
                                regexText: "密码只能为数字或字符",
                                anchor: '95%'
                            },
                            lockedCombo,
                            {
                                fieldLabel: '手机号码',
                                regex: /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/,
                                regexText: '手机号码格式不合法',
                                name: 'mbl_no',
                                allowBlank: true,
                                id: 'mbl_no',
                                anchor: '95%'
                            },
                            {
//                                fieldLabel: '固定电话',
                                regex: /^\d{3}-\d{8}|\d{4}-\d{7}/,
                                regexText: "固定电话格式不合法！格式:0000-0000000",
                                name: 'tel_no',
                                hidden: true,
                                id: 'tel_no',
                                allowBlank: true,
                                anchor: '95%'
                            },
                            {
                                xtype: "numberfield",
//                                fieldLabel: '邮政编码',
                                regex: /[1-9]\d{5}(?!\d)/,// 验证邮政编码格式的正则表达式
                                regexText: '邮政编码格式不合法', // 验证错误之后的提示信息
                                name: 'post_code',
                                id: 'post_code',
                                hidden: true,
                                maxLength: 6,
                                minLength: 6,
                                allowBlank: true,
                                anchor: '95%'
                            },
                            {
//                                fieldLabel: '暂住证号',
                                name: 'tmp_crd',
                                id: 'tmp_crd',
                                hidden: true,
                                allowBlank: true,
                                anchor: '95%'
                            },
                            {
                                name: 'usertype',
                                id: 'usertype',
                                value: "5",
                                hidden: true
                            },
                            {
                                name: 'techpost',
                                id: 'techpost',
                                value: "0",
                                hidden: true
                            },
                            {
                                name: 'wedlock',
                                id: 'wedlock',
                                value: "1",
                                hidden: true
                            },
                            {
                                id: 'windowmode',
                                name: 'windowmode',
                                hidden: true
                            },
                            {
                                id: 'userid',
                                name: 'userid',
                                hidden: true
                            },
                            {
                                id: 'roleid_old',
                                name: 'roleid_old',
                                hidden: true
                            },
                            {
                                id: 'deptid',
                                name: 'deptid',
                                hidden: true
                            },
                            {
                                id: 'deptid_old',
                                name: 'deptid_old',
                                hidden: true
                            },
                            {
                                id: 'apps',
                                name: 'apps',
                                hidden: true
                            }
                        ]
                    }
                ]
            }
        ]
    });

    var addUserWindow = new Ext.Window({
        layout: 'fit',
        width: 500,
        height: 250,
        resizable: false,
        draggable: true,
        closeAction: 'hide',
        title: '新增管理员(*为必填项)',
        iconCls: 'page_addIcon',
        modal: false,
        collapsible: true,
        titleCollapse: true,
        maximizable: false, // 窗口最大化
        buttonAlign: 'right',
        border: false,
        animCollapse: true,
        pageY: 20,
        pageX: document.body.clientWidth / 2 - 420 / 2,
        animateTarget: Ext.getBody(),
        constrain: true,
        items: [addUserFormPanel],
        buttons: [
            {
                text: '保存',
                iconCls: 'acceptIcon',
                handler: function () {
                    var mode = Ext.getCmp('windowmode').getValue();
                    if (mode == 'add')
                        saveUserItem('save');
                    if (mode == 'edit')
                        updateUserItem('save');

                }
            },
            {
                text: '重置',
                id: 'btnReset',
                iconCls: 'tbar_synchronizeIcon',
                handler: function () {
                    Ext.getCmp("account").setValue("");
                    Ext.getCmp("username").setValue("");
                    Ext.getCmp("newpwd").setValue("");
                    Ext.getCmp("id_crd").setValue("");
                    Ext.getCmp("tmp_crd").setValue("");
                    Ext.getCmp("birthday").setValue("");
                    Ext.getCmp("nat_plc").setValue("");
                    Ext.getCmp("post_code").setValue("");
                    Ext.getCmp("address").setValue("");
                    Ext.getCmp("email").setValue("");
                    Ext.getCmp("tel_no").setValue("");
                    Ext.getCmp("mbl_no").setValue("");
                    Ext.getCmp("remark").setValue("");
                    belognGrpsCombo.setValue('');
                    match_deptid = '';
                }
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                handler: function () {
                    addUserWindow.hide();
                }
            }
        ]
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
                width: 210,
                minSize: 160,
                maxSize: 280,
                split: true,
                region: 'west',
                autoScroll: true,
                items: [ deptTree ]
            },
            {
                region: 'center',
                layout: 'fit',
                items: [grid]
            }
        ]
    });

    /**
     * 根据条件查询人员
     */
    function queryUserItem() {
        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                deptid: deptid,
                queryParam: Ext.getCmp('queryParam').getValue(),
                per_no: Ext.getCmp('per_no').getValue(),
                usertype: '5'
            }
        });
    }

    function randomPwd() {
        Ext.getCmp('newpwd').setValue('');
        pwdStore.load();
    }

    pwdStore.on('load', function (obj) {
        if (obj != null) {
            Ext.getCmp('newpwd').setValue(obj.getAt(0)
                .get('newpassword'));
        }
    });

    /**
     * 新增人员初始化
     */
    function addInit() {
        var flag = Ext.getCmp('windowmode').getValue();
        if (typeof(flag) != 'undefined') {
            addUserFormPanel.form.getEl().dom.reset();
        } else {
            clearForm(addUserFormPanel.getForm());
        }

        addUserWindow.show();

        //新增窗口初始设置
        Ext.getCmp('account').setReadOnly(false);

        Ext.getCmp('windowmode').setValue('add');
        addUserWindow.setTitle('新增分厂管理员<span style="color:Red">(*为必填项)</span>');

        if(!Ext.isEmpty(belong_grpname)&&match_deptid!='00100015'){
            belognGrpsCombo.setValue(belong_grpname);
            belognGrpsCombo.setReadOnly(true);
        }else{
			belognGrpsCombo.setReadOnly(false);
		}
        // 为下拉框赋初始值
        lockedCombo.setValue('0');
        Ext.getCmp('usertype').setValue('5');
        sexCombo.setValue('1');
        Ext.getCmp('techpost').setValue('0');
        Ext.getCmp('wedlock').setValue('0'); // 婚姻状况下拉框
        Ext.getCmp('btnReset').show();

        Ext.getCmp('apps').setValue(apps);
    }

    /**
     * 保存人员数据
     */
    function saveUserItem(flag) {
        if (!addUserFormPanel.form.isValid()) {
            return;
        }

        var msg;
        if (flag == "save") {
            msg = '<span style="color:red">确认保存所添加的分厂管理员信息吗?</span>'
        }

        Ext.Msg.confirm('确认', msg, function (btn, text) {
            if (btn == 'yes') {
                save(flag);
            } else {
                return;
            }
        });

    }

    function save(flag) {
        addUserFormPanel.form.submit({
            url: './user.ered?reqCode=saveUserItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                addUserWindow.hide();
                store.reload();
                form.reset();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure: function (form, action) {
                var msg = action.result.msg;
                Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
            },
            params: {
                flag: flag,
                usertype: '5'
            }
        });
    }

    /**
     * 删除人员
     */
    function deleteUserItems() {
        var rows = grid.getSelectionModel().getSelections();
        var fields = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get('usertype') == '3' && root_usertype != '9'
                && root_usertype != '8') {
                fields = fields + rows[i].get('username') + '<br>';
            }
            if (rows[i].get('usertype') == '8'
                && rows[i].get('account') == 'admin') {
                fields = fields + rows[i].get('username') + '<br>';
            }
        }
        if (fields != '') {
            Ext.Msg.alert('提示', '<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields
                + '<font color=red>系统内置人员不能删除!</font>');
            return;
        }
        if (Ext.isEmpty(rows)) {
            Ext.Msg.alert('提示', '请先选中要删除的项目!');
            return;
        }
        var strChecked = jsArray2JsString(rows, 'userid');
        Ext.Msg.confirm('请确认',
            '<span style="color:red"><b>提示:</b>删除人员将同时删除和人员相关的权限信息,请慎重.</span><br>继续删除吗?',
            function (btn, text) {
                if (btn == 'yes') {
                    showWaitMsg('请等待');
                    Ext.Ajax.request({
                        url: './user.ered?reqCode=deleteUserItems',
                        success: function (response) {
                            var resultArray = Ext.util.JSON
                                .decode(response.responseText);
                            store.reload();
                            Ext.Msg.alert('提示', resultArray.msg);
                        },
                        failure: function (response) {
                            var resultArray = Ext.util.JSON
                                .decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);
                        },
                        params: {
                            strChecked: strChecked
                        }
                    });
                }
            });
    }

    /**
     * 修改人员初始化
     */
    function editInit() {
        addUserFormPanel.form.reset();
        var record = grid.getSelectionModel().getSelected();
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: '警告',
                msg: "请先选择一条记录..",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        var recs = grid.getSelectionModel().getSelections(); // 把所有选中项放入
        if (recs.length > 1) {
            Ext.MessageBox.show({
                title: '警告',
                msg: "请选择一条记录..",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        belognGrpsCombo.setValue(record.get('managegrpname'));
        match_deptid = record.get('deptid');

        addUserFormPanel.getForm().loadRecord(record);
        addUserWindow.show();
        addUserWindow.setTitle('修改管理员信息<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('edit');
        Ext.getCmp('account').setReadOnly(true);
        Ext.getCmp('roleid_old').setValue(record.get('roleid'));
        Ext.getCmp('deptid_old').setValue(record.get('deptid'));
        Ext.getCmp('userid').setValue(record.get('userid'));
        Ext.getCmp('tel_no').setValue(record.get('tel_no'));
        Ext.getCmp('usertype').setValue('5');
        Ext.getCmp('btnReset').hide();
        belognGrpsCombo.setReadOnly(true);
        addUserFormPanel.form.load({
            waitTitle: '提示',
            waitMsg: '正在读取用户信息,请稍候...',
            url: 'user.ered?reqCode=loadUserInfo',
            success: function (form, action) {
            },
            failure: function (form, action) {
                Ext.Msg.alert('提示', '数据读取失败:' + action.failureType);
            },
            params: {
                userid: record.get('userid')
            }
        });
    }

    /**
     * 修改人员数据
     */
    function updateUserItem(flag) {
        if (!addUserFormPanel.form.isValid()) {
            return;
        }

        var duty_id = Ext.getCmp('duty_id').getValue();
        Ext.getCmp('usertype').setValue('5');
        if (duty_id == null) {
            Ext.getCmp('duty_id').setValue('');
        }
        var msg;
        if (flag == "save") {
            msg = '<span style="color:red">确认保存所修改的分厂管理员信息吗?</span>'
        }
        Ext.Msg.confirm('确认', msg, function (btn, text) {
            if (btn == 'yes') {
                update(flag);
            } else {
                return;
            }
        });

    }

    /**
     * 更新
     */
    function update(flag) {
        addUserFormPanel.form.submit({
            url: './user.ered?reqCode=updateUserItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                addUserWindow.hide();
                store.reload();
                form.reset();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure: function (form, action) {
                var msg = action.result.msg;
                Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
            },
            params: {
                flag: flag,
                usertype: '5',
                match_deptid:match_deptid
            }
        });
    }

    /**
     * 停用启用管理员信息
     */
    function shutoractiveSysGrpZG(flag) {
        var rows = grid.getSelectionModel().getSelections();
        if (Ext.isEmpty(rows)) {
            Ext.Msg.alert('提示', '请先选中单位主管信息!');
            return;
        }
        var rows = grid.getSelectionModel().getSelections();
        var record = grid.getSelectionModel().getSelected();
        var msg;
        if (flag == "open") {
            if (Ext.isEmpty(rows)) {
                Ext.Msg.alert('提示', '请先选中您要进行启用的管理员信息!');
                return;
            } else {

                if (record.get('state') == '0') {
                    Ext.Msg.alert('提示', '该管理员已经启用,无需再进行启用操作!');
                    return;
                }
                msg = '确认启用选中的管理员吗?';
            }
        }
        if (flag == "shut") {
            if (Ext.isEmpty(rows)) {
                Ext.Msg.alert('提示', '请先选中您要进行停用的管理员!');
                return;
            } else {
                if (record.get('state') == '1') {
                    Ext.Msg.alert('提示', '该管理员已经停用,无需再进行停用操作!');
                    return;
                }
                msg = '确认停用选中的管理员吗?';
            }
        }
        Ext.Msg.confirm('请确认', msg, function (btn, text) {
            if (btn == 'yes') {
                showWaitMsg('请等待');
                Ext.Ajax.request({
                    url: './sysGrps.ered?reqCode=shurOrActiveSysGrpsZGItem',
                    success: function (response) {
                        var resultArray = Ext.util.JSON
                            .decode(response.responseText);
                        store.reload();
                        Ext.Msg.alert('提示', resultArray.msg);
                    },
                    failure: function (response) {
                        var resultArray = Ext.util.JSON
                            .decode(response.responseText);
                        Ext.Msg.alert('提示', resultArray.msg);
                    },
                    params: {
                        userid: record.get('userid'),
                        grp_id: record.get('grp_city'),
                        state: record.get('state'),
                        flag: flag
                    }
                });
            }
        });
    }

    /**
     * 密码发送
     */
    function sendPwd() {
        var rows = grid.getSelectionModel().getSelections();
        var record = grid.getSelectionModel().getSelected();
        if (Ext.isEmpty(rows)) {
            Ext.Msg.alert('提示', '请先选中您要进行发送密码的管理员信息!');
            return;
        }
        Ext.Msg.confirm('请确认',
            '<span style="color:red"><b>提示:</b>确认给该企业管理员发送密码信息吗?</span><br>',
            function (btn, text) {
                if (btn == 'yes') {
                    showWaitMsg('请等待!');
                    Ext.Ajax.request({
                        url: './user.ered?reqCode=sendPwd',
                        success: function (response) {
                            var resultArray = Ext.util.JSON
                                .decode(response.responseText);
                            store.reload();
                            Ext.Msg.alert('提示',
                                resultArray.msg);
                        },
                        failure: function (response) {
                            var resultArray = Ext.util.JSON
                                .decode(response.responseText);
                            Ext.Msg.alert('提示',
                                resultArray.msg);
                        },
                        params: {
                            userid: record.get('userid'),
                            account: record.get('account')

                        }
                    });
                }
            });
    }


    //角色删除确认窗口
    var win = new Ext.Window({
        layout: 'fit',
        width: 310,
        height: 110,
        modal: true,
        draggable: true,
        closeAction: 'hide',
        pageY: 100,
        pageX: document.body.clientWidth / 2 - 200 / 2,
        title: '角色删除',
        buttonAlign: 'right',
        border: false,
        animateTarget: Ext.getBody(),
        items: [
            {
                id: 'winHtml',
                html: '<span style="color:red"> 删除菜单角色：删除该人员对应的菜单角色;' +
                    '</br>删除数据角色：删除该人员对应的数据角色;' +
                    '</br>全部删除：删除该人员对应的所有角色;</span>'
            }
        ],
        buttons: [
            {
                text: '删除菜单角色',
                iconCls: 'deleteIcon',
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();

                    if (Ext.isEmpty(record.get('roleid'))) {
                        Ext.Msg.alert('提示', '该用户没有对应菜单角色信息!');
                        return;
                    }

                    Ext.Msg.confirm('确认', "确认删除该用户菜单角色信息吗?", function (btn, text) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: './user.ered?reqCode=delEaUserAuthorize',
                                success: function (response) {
                                    var resultArray = Ext.util.JSON.decode(response.responseText);
                                    store.reload();
                                    win.hide();
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                failure: function (response) {
                                    var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                params: {
                                    userid: record.get('userid')
                                }
                            });
                        } else {
                            return;
                        }
                    });
                }
            },
            {
                text: '删除数据角色',
                iconCls: 'deleteIcon',
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();
                    if (Ext.isEmpty(record.get('dataroleid'))) {
                        Ext.Msg.alert('提示', '该用户没有对应数据角色信息!');
                        return;
                    }

                    Ext.Msg.confirm('确认', "确认删除该用户数据角色信息吗?", function (btn, text) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: './dataPerm.ered?reqCode=delEauserRoleMap',
                                success: function (response) {
                                    var resultArray = Ext.util.JSON.decode(response.responseText);
                                    store.reload();
                                    win.hide();
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                failure: function (response) {
                                    var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                params: {
                                    userid: record.get('userid')
                                }
                            });
                        } else {
                            return;
                        }
                    });
                }
            },
            {
                text: '全部删除',
                iconCls: 'deleteIcon',
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();

                    var flag = '1';
                    Ext.Msg.confirm('确认', "确认删除该用户全部角色信息吗?", function (btn, text) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: './user.ered?reqCode=delEaUserAuthorize',
                                success: function (response) {
                                    flag = '1'
                                },
                                failure: function (response) {
                                    flag = '0';
                                    var resultArray = Ext.util.JSON.decode(response.responseText);
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                params: {
                                    userid: record.get('userid')
                                }
                            });

                            Ext.Ajax.request({
                                url: './dataPerm.ered?reqCode=delEauserRoleMap',
                                success: function (response) {
                                    flag = '1';
                                },
                                failure: function (response) {
                                    flag = '0';
                                    var resultArray = Ext.util.JSON
                                        .decode(response.responseText);
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                params: {
                                    userid: record.get('userid')
                                }
                            });

                            if (flag == '1') {
                                Ext.Msg.alert('提示', '角色删除成功!');
                                store.reload();
                                win.hide();
                            }

                        } else {
                            return;
                        }
                    });

                }
            }
        ]
    });

    var deptTreeRoot = new Ext.tree.AsyncTreeNode({
        text: '根部门',
        id: '001',
        expanded: true,
        iconCls: 'folder_userIcon'
    });

    var deptTreeLoader = new Ext.tree.TreeLoader({
        dataUrl: './dataPerm.ered?reqCode=departmentTree4UserGrantInit'
    });

    deptTreeLoader.on("beforeload", function (treeLoader, node) {
        treeLoader.baseParams.userid = userid;
    }, this);

    var userPermDeptTree = new Ext.tree.TreePanel({
        loader: deptTreeLoader,
        root: deptTreeRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    var selectDeptTab = new Ext.Panel({
        title: '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">部门权限',
        titleCollapse: false,
        floating: false,
        layout: 'border',
        region: 'center',
        items: [
            {
                region: 'center',
                layout: 'fit',
                autoScroll: true,
                items: [userPermDeptTree]
            }
        ]
    });

    function cascadeParent() {
        var pn = this.parentNode;
        if (!pn || !Ext.isBoolean(this.attributes.checked))
            return;
        if (this.attributes.checked) {// 级联选中
            pn.getUI().toggleCheck(true);
        } else {// 级联未选中
            var b = true;
            Ext.each(pn.childNodes, function (n) {
                if (n.getUI().isChecked()) {
                    return b = false;
                }
                return true;
            });
            if (b)
                pn.getUI().toggleCheck(false);
        }
        pn.cascadeParent();
    }

    function cascadeChildren() {
        var ch = this.attributes.checked;
        if (!Ext.isBoolean(ch))
            return;
        Ext.each(this.childNodes, function (n) {
            n.getUI().toggleCheck(ch);
            n.cascadeChildren();
        });
    }

    // 为TreeNode对象添加级联父节点和子节点的方法
    Ext.apply(Ext.tree.TreeNode.prototype, {
        cascadeParent: cascadeParent,
        cascadeChildren: cascadeChildren
    });
    // Checkbox被点击后级联父节点和子节点
    Ext.override(Ext.tree.TreeEventModel, {
        onCheckboxClick: Ext.tree.TreeEventModel.prototype.onCheckboxClick.createSequence(function (e, node) {
            node.cascadeParent();
            node.cascadeChildren();
        })
    });

    var select_deptid = deptid;

    var select_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    /** 定义列表显示区块 */
    var select_cm = new Ext.grid.ColumnModel([ select_sm, {
        header: '',
        align: 'center',
        dataIndex: 'account',
        width: 99,
        hidden: true
    }, {
        header: '部门编号',
        align: 'center',
        dataIndex: 'deptid',
        width: 99,
        hidden: true
    }, {
        align: 'right',
        dataIndex: 'deptname1',
        width: 120,
        sortable: true
    }, {
        header: '部门',
        align: 'center',
        dataIndex: 'deptname2',
        width: 100,
        sortable: true
    }, {
        align: 'left',
        dataIndex: 'deptname3',
        width: 100,
        sortable: true
    }, {
        header: '工号',
        align: 'center',
        dataIndex: 'per_no',
        width: 99,
        sortable: true
    }, {
        header: '姓名',
        align: 'center',
        dataIndex: 'username',
        width: 99,
        sortable: true
    }]);

    /**
     * 数据存储
     */
    var select_store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './dataPerm.ered?reqCode=queryUserInfo4UserGrant'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'deptid'
            },
            {
                name: 'deptname1'
            },
            {
                name: 'deptname2'
            },
            {
                name: 'deptname3'
            },
            {
                name: 'account'
            },
            {
                name: 'per_no'
            },
            {
                name: 'username'
            },
            {
                name: 'crd_no'
            },
            {
                name: 'id_crd'
            }
        ]),
        remoteSort: true
    });

    select_store.on('beforeload', function () {
        this.baseParams = {
            start: 0,
            limit: select_bbar.pageSize,
            selectModel: '',
            deptid: select_deptid,
            userid: userid,
            perno: Ext.getCmp("select_perno").getValue(),
            username: Ext.getCmp("select_username").getValue(),
            id_crd: Ext.getCmp("select_id_crd").getValue()
        };
    });

    var select_pagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        hiddenName: 'pagesize',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
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
        value: '50',
        editable: false,
        width: 85
    });

    var select_number = parseInt(select_pagesize_combo.getValue());
    select_pagesize_combo.on("select", function (comboBox) {
        select_bbar.pageSize = parseInt(comboBox.getValue());
        select_number = parseInt(comboBox.getValue());
        select_store.reload({
            params: {
                start: 0,
                limit: select_bbar.pageSize
            }
        });
    });
    var select_bbar = new Ext.PagingToolbar({
        pageSize: select_number,
        store: select_store,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', select_pagesize_combo]
    });

    var select_addRoot = new Ext.tree.AsyncTreeNode({
        text: '',
        id: '001',
        expanded: true
    });

    var select_addDeptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            dataUrl: './user.ered?reqCode=deptTreeInit'
        }),
        root: select_addRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    // 监听下拉树的节点单击事件
    select_addDeptTree.on('click', function (node) {
        select_comboxWithTree.setValue(node.text);
        select_deptid = node.id;
        select_comboxWithTree.collapse();
    });

    var select_comboxWithTree = new Ext.form.ComboBox({
        id: 'select_deptid',
        store: new Ext.data.SimpleStore({
            fields: [],
            data: [
                []
            ]
        }),
        editable: false,
        value: ' ',
        emptyText: '请选择...',
        anchor: '100%',
        mode: 'local',
        triggerAction: 'all',
        maxHeight: 390,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl: "<tpl for='.'><div style='height:390px'><div id='select_addDeptTreeDiv'></div></div></tpl>",
        allowBlank: false,
        onSelect: Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    select_comboxWithTree.on('expand', function () {
        // 将UI树挂到treeDiv容器
        select_addDeptTree.render('select_addDeptTreeDiv');
        select_addDeptTree.root.expand(); //只是第一次下拉会加载数据
        //						addDeptTree.root.reload(); // 每次下拉都会加载数据

    });
    var selectUserGrid = new Ext.grid.GridPanel({
        store: select_store,
        id: 'select_usergrid',
        border: true,
        title: "人员信息",
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        },
        stripeRows: true,
        frame: true,
        cm: select_cm,
        sm: select_sm,
        bbar: select_bbar,
        tbar: ['-', "<SPAN STYLE='font:normal 10pt Arial'>部门：</SPAN>",
            select_comboxWithTree,
            '-', "<SPAN STYLE='font:normal 10pt Arial'>工号：</SPAN>",
            new Ext.form.TextField({
                name: 'perno',
                id: 'select_perno',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            querySelectUserInfo();
                        }
                    }
                },
                width: 60
            }),
            '-', "<SPAN STYLE='font:normal 10pt Arial'>姓名：</SPAN>",
            new Ext.form.TextField({
                name: 'username',
                id: 'select_username',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            querySelectUserInfo();
                        }
                    }
                },
                width: 60
            }) ,
            '-', "<SPAN STYLE='font:normal 10pt Arial'>身份证号:</SPAN>",
            new Ext.form.TextField({
                name: 'id_crd',
                id: 'select_id_crd',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            querySelectUserInfo();
                        }
                    }
                },
                width: 100
            }),
            '->', {
                text: '查询',
                iconCls: 'previewIcon',
                handler: function () {
                    querySelectUserInfo();
                }},
            '-', {
                text: '重置',
                iconCls: 'tbar_synchronizeIcon',
                handler: function () {
                    select_comboxWithTree.reset();
                    deptid = '';
                    Ext.getCmp('select_perno').setValue("");
                    Ext.getCmp('select_username').setValue("");
                    Ext.getCmp('select_id_crd').setValue("");
                }
            }
        ]
    });

    function querySelectUserInfo() {
        select_store.load({
            params: {
                start: 0,
                limit: select_bbar.pageSize,
                deptid: select_deptid,
                userid: userid,
                selectModel: '',
                perno: Ext.getCmp("select_perno").getValue(),
                username: Ext.getCmp("select_username").getValue(),
                id_crd: Ext.getCmp("select_id_crd").getValue()
            }
        });
    };

    var check_deptid = deptid;

    var s_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    /** 定义列表显示区块 */
    var s_cm = new Ext.grid.ColumnModel([ s_sm, {
        header: '',
        align: 'center',
        dataIndex: 'account',
        width: 99,
        hidden: true
    }, {
        header: '部门编号',
        align: 'center',
        dataIndex: 'deptid',
        width: 99,
        hidden: true
    }, {
        align: 'right',
        dataIndex: 'deptname1',
        width: 120,
        sortable: true
    }, {
        header: '部门',
        align: 'center',
        dataIndex: 'deptname2',
        width: 100,
        sortable: true
    }, {
        align: 'left',
        dataIndex: 'deptname3',
        width: 100,
        sortable: true
    }, {
        header: '工号',
        align: 'center',
        dataIndex: 'per_no',
        width: 99,
        sortable: true
    }, {
        header: '姓名',
        align: 'center',
        dataIndex: 'username',
        width: 99,
        sortable: true
    }]);

    /**
     * 数据存储
     */
    var s_store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './dataPerm.ered?reqCode=queryUserInfo4UserGrant'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'deptid'
            },
            {
                name: 'deptname1'
            },
            {
                name: 'deptname2'
            },
            {
                name: 'deptname3'
            },
            {
                name: 'account'
            },
            {
                name: 'per_no'
            },
            {
                name: 'username'
            },
            {
                name: 'crd_no'
            },
            {
                name: 'id_crd'
            }
        ]),
        remoteSort: true
    });

    s_store.on('beforeload', function () {
        this.baseParams = {
            start: 0,
            limit: s_bbar.pageSize,
            selectModel: 'notNull',
            deptid: check_deptid,
            userid: userid,
            perno: Ext.getCmp("check_perno").getValue(),
            username: Ext.getCmp("check_username").getValue(),
            id_crd: Ext.getCmp("check_id_crd").getValue()
        };
    });

    var s_pagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        hiddenName: 'pagesize',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
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
        value: '50',
        editable: false,
        width: 85
    });

    var s_number = parseInt(s_pagesize_combo.getValue());
    s_pagesize_combo.on("select", function (comboBox) {
        s_bbar.pageSize = parseInt(comboBox.getValue());
        s_number = parseInt(comboBox.getValue());
        s_store.reload({
            params: {
                start: 0,
                limit: s_bbar.pageSize
            }
        });
    });
    var s_bbar = new Ext.PagingToolbar({
        pageSize: s_number,
        store: s_store,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', s_pagesize_combo]
    });

    var addRoot = new Ext.tree.AsyncTreeNode({
        text: '',
        id: '001',
        expanded: true
    });

    var addDeptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            dataUrl: './user.ered?reqCode=deptTreeInit'
        }),
        root: addRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    // 监听下拉树的节点单击事件
    addDeptTree.on('click', function (node) {
        comboxWithTree.setValue(node.text);
        check_deptid = node.id;
        comboxWithTree.collapse();
    });

    var comboxWithTree = new Ext.form.ComboBox({
        id: 'check_deptid',
        store: new Ext.data.SimpleStore({
            fields: [],
            data: [
                []
            ]
        }),
        editable: false,
        value: ' ',
        emptyText: '请选择...',
        anchor: '100%',
        mode: 'local',
        triggerAction: 'all',
        maxHeight: 390,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl: "<tpl for='.'><div style='height:390px'><div id='check_addDeptTreeDiv'></div></div></tpl>",
        allowBlank: false,
        onSelect: Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    comboxWithTree.on('expand', function () {
        // 将UI树挂到treeDiv容器
        addDeptTree.render('check_addDeptTreeDiv');
        addDeptTree.root.expand(); //只是第一次下拉会加载数据
        //						addDeptTree.root.reload(); // 每次下拉都会加载数据

    });
    var checkUserGrid = new Ext.grid.GridPanel({
        store: s_store,
        id: 'check_usergrid',
        border: true,
        title: "已选择人员",
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        },
        stripeRows: true,
        frame: true,
        cm: s_cm,
        sm: s_sm,
        bbar: s_bbar,
        tbar: ['-', "<SPAN STYLE='font:normal 10pt Arial'>部门：</SPAN>",
            comboxWithTree,
            '-', "<SPAN STYLE='font:normal 10pt Arial'>工号：</SPAN>",
            new Ext.form.TextField({
                name: 'perno',
                id: 'check_perno',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserInfo();
                        }
                    }
                },
                width: 60
            }),
            '-', "<SPAN STYLE='font:normal 10pt Arial'>姓名：</SPAN>",
            new Ext.form.TextField({
                name: 'username',
                id: 'check_username',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserInfo();
                        }
                    }
                },
                width: 60
            }) ,
            '-', "<SPAN STYLE='font:normal 10pt Arial'>身份证号:</SPAN>",
            new Ext.form.TextField({
                name: 'id_crd',
                id: 'check_id_crd',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserInfo();
                        }
                    }
                },
                width: 100
            }),
            '->', {
                text: '查询',
                iconCls: 'previewIcon',
                handler: function () {
                    queryUserInfo();
                }},
            '-', {
                text: '重置',
                iconCls: 'tbar_synchronizeIcon',
                handler: function () {
                    comboxWithTree.reset();
                    deptid = '';
                    Ext.getCmp('check_perno').setValue("");
                    Ext.getCmp('check_username').setValue("");
                    Ext.getCmp('check_id_crd').setValue("");
                }
            }, '-', {
                text: '人员权限删除',
                iconCls: 'page_delIcon',
                handler: function () {
                    Ext.MessageBox.confirm('请确认', '确认删除这些人员权限吗?', function (btn, text) {
                        if (btn == 'yes') {
                            //获取要删除的人员信息
                            var records = checkUserGrid.getSelectionModel().getSelections();
                            var perids = jsArray2JsString(records, 'account');

                            showWaitMsg("删除中,请等待!");
                            //更新权限
                            Ext.Ajax.request({
                                url: './dataPerm.ered?reqCode=delUserInfo4UserData',
                                success: function (response) {
                                    hideWaitMsg();
                                    var resultArray = Ext.util.JSON.decode(response.responseText);
                                    Ext.Msg.alert('提示', resultArray.msg);
                                    s_store.reload();
                                },
                                failure: function (response) {
                                    hideWaitMsg();
                                    var resultArray = Ext.util.JSON.decode(response.responseText);
                                    Ext.Msg.alert('提示', resultArray.msg);
                                },
                                params: {
                                    perids: perids,
                                    userid: userid
                                }
                            })
                        }
                    });
                }
            }]
    });

    function queryUserInfo() {
        s_store.load({
            params: {
                start: 0,
                limit: s_bbar.pageSize,
                selectModel: 'notNull',
                userid: userid,
                deptid: check_deptid,
                perno: Ext.getCmp("check_perno").getValue(),
                username: Ext.getCmp("check_username").getValue(),
                id_crd: Ext.getCmp("check_id_crd").getValue()
            }
        });
    };

    var userTab = new Ext.TabPanel({
        activeTab: 0,
        width: 500,
        height: 200,
        plain: true,// True表示为不渲染tab候选栏上背景容器图片
        defaults: {
            autoScroll: true
        },
        items: [selectUserGrid, checkUserGrid]
    });

    var selectUserTab = new Ext.Panel({
        title: '<img src="./resource/image/ext/group.png" align="top" class="IEPNG">人员权限',
        titleCollapse: false,
        layout: 'border',
        region: 'center',
        items: [
            {
                region: 'center',
                layout: 'fit',
                border: false,
                autoScroll: true,
                items: [userTab]
            }
        ]
    });

    var roleGrantTabPanel = new Ext.TabPanel({
        activeTab: 0,
        width: 600,
        height: 250,
        plain: true,// True表示为不渲染tab候选栏上背景容器图片
        defaults: {
            autoScroll: true
        },
        items: [selectDeptTab, selectUserTab]
    });

    var roleGrantWindow = new Ext.Window({
        layout: 'fit',
        width: 400,
        height: document.body.clientHeight,
        resizable: true,
        draggable: true,
        closeAction: 'hide',
        title: '用户授权',
        iconCls: 'award_star_silver_3Icon',
        modal: true,
        pageY: 15,
        pageX: document.body.clientWidth / 2 - 420 / 2,
        collapsible: true,
        maximizable: true,
        buttonAlign: 'right',
        constrain: true,
        items: [roleGrantTabPanel],
        buttons: [
            {
                text: '保存',
                handler: function () {
                    //获取部门选中的数据
                    var checked = userPermDeptTree.getChecked('id');
                    var deptids = '' + checked;
                    //获取人员选择的数据
                    var userRecords = selectUserGrid.getSelectionModel().getSelections();
                    var perids = jsArray2JsString(userRecords, 'account');

                    showWaitMsg("正在授权请等待!");
                    //更新权限
                    Ext.Ajax.request({
                        url: './dataPerm.ered?reqCode=saveDataUserGrant',
                        success: function (response) {
                            hideWaitMsg();
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);

                            select_store.removeAll();
                            s_store.removeAll();
                            store.reload();
//                            roleGrantWindow.hide();
                        },
                        failure: function (response) {
                            hideWaitMsg();
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);
                        },
                        params: {
                            deptids: deptids,
                            perids: perids,
                            userid: userid
                        }
                    })
                }
            },
            {
                text: '关闭',
                handler: function () {
                    roleGrantWindow.hide();
                }
            }
        ]
    });

});