/**
 * 用户权限分配
 * @author may
 * @since 2012-12
 */
Ext.onReady(function () {
    var re = '<span style="color:red">*</span>'

    var userid;
    var deptid;
    var managedeptid;

    var validateAccStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './user.ered?reqCode=validateAcc' // 后台请求地址
        }),
        reader: new Ext.data.JsonReader({}, [
            { // 定义后台返回数据格式
                name: 'cnt' // 数量
            }
        ])
    });
    var treedeptid = root_deptid;
    var root = new Ext.tree.AsyncTreeNode({
        text: root_deptname,
        expanded: true,
        iconCls: 'folder_userIcon',
        id: root_deptid
    });
    var deptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            baseAttrs: {},
            dataUrl: './user.ered?reqCode=departmentTreeInit'
        }),
        root: root,
        title: '',
        applyTo: 'deptTreeDiv',
        autoScroll: false,
        animate: false,
        useArrows: false,
        border: false
    });

    deptTree.root.select();
    deptTree.on('click', function (node) {
        Ext.getCmp('queryParam').setValue('');
        deptid = node.attributes.id;
        treedeptid = node.attributes.id;
        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                deptid: deptid,
                usertype: '2'
            }
        });
    });

    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});

    /** 定义列头 */
    var cm = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(), sm, {
            header: '人员编号',
            dataIndex: 'userid',
            hidden: true
        }, {
            header: '系统号',
            dataIndex: 'account',
            width: 75
        }, {
            header: '工号',
            dataIndex: 'per_no',
            width: 75
        }, {
            header: '姓名',
            dataIndex: 'username',
            width: 80
        }, {
            header: '部门',
            dataIndex: 'deptname',
            width: 120
        }, {
            header: '所属角色',
            dataIndex: 'roleid',
            width: 120
        }, {
            header: '角色名称',
            dataIndex: 'rolename',
            width: 120
        }, {
            header: '角色类型',
            dataIndex: 'roletype',
            hidden:true,
            width: 120
        }
    ]);

    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './dataPerm.ered?reqCode=queryEaUsersRoleMap'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'userid'
            },
            {
                name: 'per_no'
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
                name: 'deptid'
            },
            {
                name: 'deptname'
            },
            {
                name: 'roleid'
            },
            {
                name: 'rolename'
            },
            {
                name: 'roletype'
            }
        ])
    });

    // 翻页排序时带上查询条件
    store.on('beforeload', function () {
        this.baseParams = {
            queryParam: Ext.getCmp('queryParam').getValue(),
            deptid: treedeptid,
            usertype: '2'

        };
    });
    var pagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        hiddenName: 'pagesize',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        store: new Ext.data.ArrayStore({
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
                limit: bbar.pageSize,
                deptid: treedeptid,
                usertype: '2'
            }
        });
    });

    var bbar = new Ext.PagingToolbar({
        pageSize: number,
        store: store,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        emptyMsg: "没有符合条件的记录",
        items: [ '-', '&nbsp;&nbsp;', pagesize_combo, '<span style="color:red"></span>' ]
    });

    var grid = new Ext.grid.GridPanel({
        title: '<img src="./resource/image/ext/group.png" align="top" class="IEPNG"><span style="font-weight:normal">一卡通账户信息表</span>',
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
                text: '角色分配',
                iconCls: 'page_addIcon',
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();
                    addUserFormPanel.getForm().loadRecord(record);
                    addUserWindow.show();

                    if (record.get('roleid') == manageDeptRoleId) {
                        manageComboxWithTree.setValue('');
                        addUserFormPanel.findById('managedeptid').show();
                        addUserFormPanel.findById('managedeptid').getEl().up('.x-form-item').setDisplayed(true);
                    } else {
                        addUserFormPanel.findById('managedeptid').hide();
                        addUserFormPanel.findById('managedeptid').getEl().up('.x-form-item').setDisplayed(false);
                    }
                }
            },
            '-',
            {
                text: '角色删除',
                iconCls: 'page_delIcon',
                hidde: true,
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();
                    if (Ext.isEmpty(record)) {
                        Ext.Msg.alert('提示', '请选择用户数据!');
                        return;
                    }
                    if (Ext.isEmpty(record.get('roleid'))) {
                        Ext.Msg.alert('提示', '该用户没有对应角色信息!');
                        return;
                    }
                    Ext.Msg.confirm('确认', "确认删除该用户角色数据吗?", function (btn, text) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: './dataPerm.ered?reqCode=delEauserRoleMap',
                                success: function (response) {
                                    var resultArray = Ext.util.JSON.decode(response.responseText);
                                    store.reload();
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
            '-',
            {
                text: '新增特殊权限',
                iconCls: 'page_addIcon',
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
            '-',
            {
                text: '刷新',
                iconCls: 'page_refreshIcon',
                handler: function () {
                    queryUserItem();
                }
            },
            '->',
            new Ext.form.TextField({
                id: 'queryParam',
                name: 'queryParam',
                emptyText: '请输入人员名称',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserItem();
                        }
                    }
                },
                width: 130
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

    grid.on('rowdblclick', function (grid, rowIndex, event) {

    });

    store.load({
        params: {
            start: 0,
            limit: bbar.pageSize,
            queryParam: Ext.getCmp('queryParam').getValue(),
            deptid: treedeptid
        }
    });

    // 角色下拉框
    var roleStore = new Ext.data.Store({
        autoLoad: true,
        proxy: new Ext.data.HttpProxy({
            url: './dataPerm.ered?reqCode=queryAllDataRole'
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
    roleStore.load();

    var roleCombo = new Ext.form.ComboBox({
        name: 'roleid',
        hiddenName: 'roleid',
        store: roleStore,
        mode: 'remote',
        fieldLabel: '角色' + re,
        emptyText: '请选择...',
        allowBlank: false,
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

    roleCombo.on('select', function (obj) {
        var value = obj.getValue();
        if (value == manageDeptRoleId) {
            addUserFormPanel.findById('managedeptid').show();
            addUserFormPanel.findById('managedeptid').getEl().up('.x-form-item').setDisplayed(true);
        } else {
            addUserFormPanel.findById('managedeptid').hide();
            addUserFormPanel.findById('managedeptid').getEl().up('.x-form-item').setDisplayed(false);
        }
    })

    //分管部门
    var manageRoot = new Ext.tree.AsyncTreeNode({
        text: '部门树',
        id: '001',
        checked: false,
        expanded: true
    });

    var manageDeptLoader = new Ext.tree.TreeLoader({
        baseAttrs: {},
        dataUrl: './dataPerm.ered?reqCode=manageDepartmentInfoInit'
    });

    manageDeptLoader.on("beforeload", function (addDoorTreeLoader, node) {
        var account = Ext.getCmp('account').getValue();
        addDoorTreeLoader.baseParams.account = account;
    }, this);

    manageDeptLoader.on("load", function (addDoorTreeLoader, node) {
        manageComboxWithTree.setValue('' + manageDeptTree.getChecked('text'));
        managedeptid = '' + manageDeptTree.getChecked('id');
    }, this);

    var manageDeptTree = new Ext.tree.TreePanel({
        loader: manageDeptLoader,
        root: manageRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible: false
    });


// 监听下拉树的节点单击事件
    manageDeptTree.on('checkchange', function (node) {

        manageComboxWithTree.setValue('' + manageDeptTree.getChecked('text'));

        managedeptid = '' + manageDeptTree.getChecked('id');

//        manageComboxWithTree.collapse();
    });

    var manageComboxWithTree = new Ext.form.ComboBox({
        name: 'managedeptname',
        hiddenName: 'managedeptname',
        typeAhead: false,
        id: 'managedeptid',
        fieldLabel: '分管部门',
        store: new Ext.data.SimpleStore({
            fields: [],
            data: [
                []
            ]
        }),
        editable: false,
        value: '',
        emptyText: '请选择...',
        anchor: '95%',
        mode: 'local',
        triggerAction: 'all',
        listWidth: 220,
        resizable: true,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl: "<tpl for='.'><div style='height:390px'><div id='manageDeptTreeDiv'></div></div></tpl>",
        onSelect: Ext.emptyFn
    });
// 监听下拉框的下拉展开事件
    manageComboxWithTree.on('expand', function () {
        // 将UI树挂到treeDiv容器
        manageDeptTree.render('manageDeptTreeDiv');
        manageDeptTree.root.reload();
    });

    var addUserFormPanel = new Ext.form.FormPanel({
        id: 'addUserFormPanel',
        name: 'addUserFormPanel',
        width: 180,
        height: 140,
        labelAlign: 'right', // 标签对齐方式
        bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign: 'center',
        border: false,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        labelWidth: 70, // 标签宽度
                        defaultType: 'textfield',
                        border: false,
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '工号',
                                name: 'per_no',
                                id: 'per_no',
                                readOnly: true,
                                anchor: '95%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '姓名',
                                name: 'username',
                                readOnly: true,
                                id: 'username',
                                anchor: '95%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '部门',
                                name: 'deptname',
                                id: 'deptname',
                                readOnly: true,
                                anchor: '95%'
                            },
                            roleCombo ,
                            manageComboxWithTree,
                            {
                                name: 'userid',
                                id: 'userid',
                                hidden: true
                            },
                            {
                                name: 'account',
                                id: 'account',
                                hidden: true
                            }
                        ]
                    }
                ]
            }
        ]
    });

    var addUserWindow = new Ext.Window(
        {
            layout: 'fit',
            width: 270,
            height: 220,
            resizable: false,
            draggable: true,
            closeAction: 'hide',
            title: '新增人员(*为必填项)',
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
            items: [ addUserFormPanel ],
            buttons: [
                {
                    text: '保存',
                    iconCls: 'acceptIcon',
                    handler: function () {
                        addUserFormPanel.form.submit({
                            url: './dataPerm.ered?reqCode=saveEauserRoleMap',
                            waitTitle: '提示',
                            method: 'POST',
                            waitMsg: '正在处理数据,请稍候...',
                            success: function (form, action) {
                                addUserWindow.hide();
                                store.reload();
                                Ext.MessageBox.alert('提示', action.result.msg);
                            },
                            failure: function (form, action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
                            },
                            params: {
                                managedeptid: managedeptid
                            }
                        });
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
                title: '<span style="font-weight:normal">部门信息</span>',
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
                items: [ grid ]
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
                queryParam: Ext.getCmp('queryParam').getValue(),
                deptid: treedeptid,
                usertype: '2'
            }
        });
    }


    var deptTreeRoot = new Ext.tree.AsyncTreeNode({
        text : '根部门',
        id : '001',
        expanded : true,
        iconCls : 'folder_userIcon'
    });

    var deptTreeLoader = new Ext.tree.TreeLoader( {
        dataUrl : './dataPerm.ered?reqCode=departmentTree4UserGrantInit'
    });

    deptTreeLoader.on("beforeload", function(treeLoader, node) {
        treeLoader.baseParams.userid = userid;
    }, this);

    var userPermDeptTree = new Ext.tree.TreePanel({
        loader :deptTreeLoader,
        root : deptTreeRoot,
        autoScroll : true,
        animate : false,
        useArrows : false,
        border : false,
        rootVisible:false
    });

    var selectDeptTab = new Ext.Panel({
        title : '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">部门权限',
        titleCollapse : false,
        floating : false,
        layout : 'border',
        region : 'center',
        items : [{
            region : 'center',
            layout : 'fit',
            autoScroll : true,
            items : [userPermDeptTree]
        }]
    });

    function cascadeParent() {
        var pn = this.parentNode;
        if (!pn || !Ext.isBoolean(this.attributes.checked))
            return;
        if (this.attributes.checked) {// 级联选中
            pn.getUI().toggleCheck(true);
        } else {// 级联未选中
            var b = true;
            Ext.each(pn.childNodes, function(n) {
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
        Ext.each(this.childNodes, function(n) {
            n.getUI().toggleCheck(ch);
            n.cascadeChildren();
        });
    }
    // 为TreeNode对象添加级联父节点和子节点的方法
    Ext.apply(Ext.tree.TreeNode.prototype, {
        cascadeParent : cascadeParent,
        cascadeChildren : cascadeChildren
    });
    // Checkbox被点击后级联父节点和子节点
    Ext.override(Ext.tree.TreeEventModel, {
        onCheckboxClick : Ext.tree.TreeEventModel.prototype.onCheckboxClick.createSequence(function(e, node) {
            node.cascadeParent();
            node.cascadeChildren();
        })
    });

    var select_deptid =deptid;

    var select_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect:false
    });

    /** 定义列表显示区块 */
    var select_cm = new Ext.grid.ColumnModel([ select_sm,{
        header : '',
        align : 'center',
        dataIndex : 'account',
        width : 99,
        hidden : true
    },{
        header : '部门编号',
        align : 'center',
        dataIndex : 'deptid',
        width : 99,
        hidden : true
    },{
        align : 'right',
        dataIndex : 'deptname1',
        width : 120,
        sortable : true
    },{
        header : '部门',
        align : 'center',
        dataIndex : 'deptname2',
        width : 100,
        sortable : true
    },{
        align : 'left',
        dataIndex : 'deptname3',
        width : 100,
        sortable : true
    },{
        header : '工号',
        align : 'center',
        dataIndex : 'per_no',
        width : 99,
        sortable : true
    },{
        header : '姓名',
        align : 'center',
        dataIndex : 'username',
        width : 99,
        sortable : true
    }]);

    /**
     * 数据存储
     */
    var select_store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : './dataPerm.ered?reqCode=queryUserInfo4UserGrant'
        }),
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT',
            root : 'ROOT'
        }, [{
            name : 'deptid'
        },{
            name : 'deptname1'
        },{
            name : 'deptname2'
        },{
            name : 'deptname3'
        },{
            name : 'account'
        },{
            name : 'per_no'
        },{
            name : 'username'
        },{
            name : 'crd_no'
        },{
            name : 'id_crd'
        }]),
        remoteSort:true
    });

    select_store.on('beforeload', function() {
        this.baseParams = {
            start : 0,
            limit :select_bbar.pageSize,
            selectModel:'',
            deptid:select_deptid,
            userid:userid,
            perno:Ext.getCmp("select_perno").getValue(),
            username:Ext.getCmp("select_username").getValue(),
            id_crd:Ext.getCmp("select_id_crd").getValue()
        };
    });

    var select_pagesize_combo = new Ext.form.ComboBox({
        name : 'pagesize',
        hiddenName : 'pagesize',
        typeAhead : true,
        triggerAction : 'all',
        lazyRender : true,
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

    var select_number = parseInt(select_pagesize_combo.getValue());
    select_pagesize_combo.on("select", function(comboBox) {
        select_bbar.pageSize = parseInt(comboBox.getValue());
        select_number = parseInt(comboBox.getValue());
        select_store.reload({
            params : {
                start : 0,
                limit :select_bbar.pageSize
            }
        });
    });
    var select_bbar = new Ext.PagingToolbar({
        pageSize : select_number,
        store : select_store,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', select_pagesize_combo]
    });

    var select_addRoot = new Ext.tree.AsyncTreeNode({
        text : '',
        id : '001',
        expanded : true
    });

    var select_addDeptTree = new Ext.tree.TreePanel({
        loader : new Ext.tree.TreeLoader({
            dataUrl : './user.ered?reqCode=deptTreeInit'
        }),
        root : select_addRoot,
        autoScroll : true,
        animate : false,
        useArrows : false,
        border : false,
        rootVisible:false
    });

    // 监听下拉树的节点单击事件
    select_addDeptTree.on('click', function(node) {
        select_comboxWithTree.setValue(node.text);
        select_deptid = node.id;
        select_comboxWithTree.collapse();
    });

    var select_comboxWithTree = new Ext.form.ComboBox({
        id : 'select_deptid',
        store : new Ext.data.SimpleStore({
            fields : [],
            data : [[]]
        }),
        editable : false,
        value : ' ',
        emptyText : '请选择...',
        anchor : '100%',
        mode : 'local',
        triggerAction : 'all',
        maxHeight : 390,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl : "<tpl for='.'><div style='height:390px'><div id='select_addDeptTreeDiv'></div></div></tpl>",
        allowBlank : false,
        onSelect : Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    select_comboxWithTree.on('expand', function() {
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

    function querySelectUserInfo(){
        select_store.load({
            params : {
                start : 0,
                limit : select_bbar.pageSize,
                deptid:select_deptid,
                userid:userid,
                selectModel:'',
                perno:Ext.getCmp("select_perno").getValue(),
                username:Ext.getCmp("select_username").getValue(),
                id_crd:Ext.getCmp("select_id_crd").getValue()
            }
        });
    };


    var check_deptid =deptid;

    var s_sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect:false
    });

    /** 定义列表显示区块 */
    var s_cm = new Ext.grid.ColumnModel([ s_sm,{
        header : '',
        align : 'center',
        dataIndex : 'account',
        width : 99,
        hidden : true
    },{
        header : '部门编号',
        align : 'center',
        dataIndex : 'deptid',
        width : 99,
        hidden : true
    },{
        align : 'right',
        dataIndex : 'deptname1',
        width : 120,
        sortable : true
    },{
        header : '部门',
        align : 'center',
        dataIndex : 'deptname2',
        width : 100,
        sortable : true
    },{
        align : 'left',
        dataIndex : 'deptname3',
        width : 100,
        sortable : true
    },{
        header : '工号',
        align : 'center',
        dataIndex : 'per_no',
        width : 99,
        sortable : true
    },{
        header : '姓名',
        align : 'center',
        dataIndex : 'username',
        width : 99,
        sortable : true
    }]);

    /**
     * 数据存储
     */
    var s_store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : './dataPerm.ered?reqCode=queryUserInfo4UserGrant'
        }),
        reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT',
            root : 'ROOT'
        }, [{
            name : 'deptid'
        },{
            name : 'deptname1'
        },{
            name : 'deptname2'
        },{
            name : 'deptname3'
        },{
            name : 'account'
        },{
            name : 'per_no'
        },{
            name : 'username'
        },{
            name : 'crd_no'
        },{
            name : 'id_crd'
        }]),
        remoteSort:true
    });

    s_store.on('beforeload', function() {
        this.baseParams = {
            start : 0,
            limit :s_bbar.pageSize,
            selectModel:'notNull',
            deptid:check_deptid,
            userid:userid,
            perno:Ext.getCmp("check_perno").getValue(),
            username:Ext.getCmp("check_username").getValue(),
            id_crd:Ext.getCmp("check_id_crd").getValue()
        };
    });

    var s_pagesize_combo = new Ext.form.ComboBox({
        name : 'pagesize',
        hiddenName : 'pagesize',
        typeAhead : true,
        triggerAction : 'all',
        lazyRender : true,
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

    var s_number = parseInt(s_pagesize_combo.getValue());
    s_pagesize_combo.on("select", function(comboBox) {
        s_bbar.pageSize = parseInt(comboBox.getValue());
        s_number = parseInt(comboBox.getValue());
        s_store.reload({
            params : {
                start : 0,
                limit :s_bbar.pageSize
            }
        });
    });
    var s_bbar = new Ext.PagingToolbar({
        pageSize : s_number,
        store : s_store,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', s_pagesize_combo]
    });

    var addRoot = new Ext.tree.AsyncTreeNode({
        text : '',
        id : '001',
        expanded : true
    });

    var addDeptTree = new Ext.tree.TreePanel({
        loader : new Ext.tree.TreeLoader({
            dataUrl : './user.ered?reqCode=deptTreeInit'
        }),
        root : addRoot,
        autoScroll : true,
        animate : false,
        useArrows : false,
        border : false,
        rootVisible:false
    });

    // 监听下拉树的节点单击事件
    addDeptTree.on('click', function(node) {
        comboxWithTree.setValue(node.text);
        check_deptid = node.id;
        comboxWithTree.collapse();
    });

    var comboxWithTree = new Ext.form.ComboBox({
        id : 'check_deptid',
        store : new Ext.data.SimpleStore({
            fields : [],
            data : [[]]
        }),
        editable : false,
        value : ' ',
        emptyText : '请选择...',
        anchor : '100%',
        mode : 'local',
        triggerAction : 'all',
        maxHeight : 390,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl : "<tpl for='.'><div style='height:390px'><div id='check_addDeptTreeDiv'></div></div></tpl>",
        allowBlank : false,
        onSelect : Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    comboxWithTree.on('expand', function() {
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

    function queryUserInfo(){
        s_store.load({
            params : {
                start : 0,
                limit : s_bbar.pageSize,
                selectModel:'notNull',
                userid:userid,
                deptid:check_deptid,
                perno:Ext.getCmp("check_perno").getValue(),
                username:Ext.getCmp("check_username").getValue(),
                id_crd:Ext.getCmp("check_id_crd").getValue()
            }
        });
    };

    var userTab =new Ext.TabPanel({
        activeTab : 0,
        width : 500,
        height : 200,
        plain : true,// True表示为不渲染tab候选栏上背景容器图片
        defaults : {
            autoScroll : true
        },
        items : [selectUserGrid, checkUserGrid]
    });

    var selectUserTab = new Ext.Panel({
        title : '<img src="./resource/image/ext/group.png" align="top" class="IEPNG">人员权限',
        titleCollapse : false,
        layout : 'border',
        region : 'center',
        items : [{
            region : 'center',
            layout : 'fit',
            border:false,
            autoScroll : true,
            items : [userTab]
        }]
    });

    var roleGrantTabPanel = new Ext.TabPanel({
        activeTab : 0,
        width : 600,
        height : 250,
        plain : true,// True表示为不渲染tab候选栏上背景容器图片
        defaults : {
            autoScroll : true
        },
        items : [selectDeptTab, selectUserTab]
    });

    var roleGrantWindow = new Ext.Window({
        layout : 'fit',
        width : 400,
        height : document.body.clientHeight,
        resizable : true,
        draggable : true,
        closeAction : 'hide',
        title : '用户授权',
        iconCls : 'award_star_silver_3Icon',
        modal : false,
        pageY : 15,
        pageX : document.body.clientWidth / 2 - 420 / 2,
        collapsible : true,
        maximizable : true,
        buttonAlign : 'right',
        constrain : true,
        items : [roleGrantTabPanel],
        buttons : [{
            text : '保存',
            handler : function() {
                //获取部门选中的数据
                var checked = userPermDeptTree.getChecked('id');
                var deptids = ''+checked;
                //获取人员选择的数据
                var userRecords = selectUserGrid.getSelectionModel().getSelections();
                var perids = jsArray2JsString(userRecords, 'account');

                showWaitMsg("正在授权请等待!");
                //更新权限
                Ext.Ajax.request({
                    url : './dataPerm.ered?reqCode=saveDataUserGrant',
                    success : function(response) {
                        hideWaitMsg();
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        Ext.Msg.alert('提示', resultArray.msg);

//                            groupCombo.setValue("0;1;2");//默认设置
                        select_store.removeAll();
                        s_store.removeAll();

//                            roleGrantWindow.hide();
                    },
                    failure : function(response) {
                        hideWaitMsg();
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        Ext.Msg.alert('提示', resultArray.msg);
                    },
                    params : {
                        deptids : deptids,
                        perids : perids,
                        userid:userid
                    }
                })
            }
        },{
            text : '关闭',
            handler : function() {
                roleGrantWindow.hide();
            }
        }]
    });

});