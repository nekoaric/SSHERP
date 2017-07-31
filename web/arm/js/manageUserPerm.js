/**
 * 人员权限管理
 * @author may
 */
Ext.onReady(function() {
	var re = '<span style="color:red">*</span>'
	var showCount =0;
    var deptid,managedeptid,userid;

	var validateAccStore = new Ext.data.Store( {
		proxy : new Ext.data.HttpProxy( {
			url : './user.ered?reqCode=validateAcc' // 后台请求地址
			}),
		reader : new Ext.data.JsonReader( {}, [ { // 定义后台返回数据格式
					name : 'cnt' // 数量
			} ])
	});
	var treedeptid = root_deptid;
	var root = new Ext.tree.AsyncTreeNode( {
		text : root_deptname,
		expanded : true,
        iconCls:'folder_userIcon',
		id : root_deptid
	});
	var deptTree = new Ext.tree.TreePanel( {
		loader : new Ext.tree.TreeLoader( {
			baseAttrs : {},
			dataUrl : './user.ered?reqCode=departmentTreeInit'
		}),
		root : root,
		title : '',
		applyTo : 'deptTreeDiv',
		autoScroll : false,
		animate : false,
		useArrows : false,
		border : false
	});

	deptTree.root.select();
	deptTree.on('click', function(node) {
		Ext.getCmp('per_no').setValue('');
		Ext.getCmp('username').setValue('');
		deptid = node.attributes.id;
		treedeptid = node.attributes.id;
		store.load( {
			params : {
				start : 0,
				limit : bbar.pageSize,
				deptid : deptid
			}
		});
	});

	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	/** 定义列头 */
	var cm = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),sm,{
            header : '人员编号',
            dataIndex : 'userid',
            hidden : true
        },{
            header : '系统号',
            dataIndex : 'account',
            hidden:true,
            width : 75
        },{
            header : '工号',
            dataIndex : 'per_no',
            align:'center',
            width : 75
        },{
            header : '姓名',
            dataIndex : 'username',
            align:'center',
            width : 80
        },{
            header : '部门',
            dataIndex : 'deptname',
            width : 120
        },{
            header : '菜单角色',
            dataIndex : 'roleid',
            align:'center',
            width : 80
        },{
            header : '菜单角色名称',
            dataIndex : 'rolename',
            align:'center',
            width : 100
        },{
            header : '数据角色',
            dataIndex : 'dataroleid',
            align:'center',
            width : 80
        },{
            header : '数据角色名称',
            dataIndex : 'datarolename',
            align:'center',
            width : 100
        },{
            header : '是否有特殊数据权限',
            dataIndex : 'userperm',
            align:'center',
            width : 120,
            renderer : function(value) {
                if (value == 0) {
                    return '否';
                }else if (value >0) {
                    return '是';
                }
            }
        }
    ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store( {
		proxy : new Ext.data.HttpProxy( {
			url : './user.ered?reqCode=queryEaUserAuthorize'
		}),
		reader : new Ext.data.JsonReader( {
			totalProperty : 'TOTALCOUNT',
			root : 'ROOT'
		}, [ {
			name : 'userid'
		},{
			name : 'per_no'
		},{
			name : 'username'
		}, {
			name : 'sex'
		}, {
			name : 'account'
		}, {
			name : 'deptid'
		}, {
			name : 'deptname'
		}, {
            name : 'roleid'
        }, {
            name : 'rolename'
        }, {
            name : 'dataroleid'
        }, {
            name : 'datarolename'
        }, {
            name : 'userperm'
        }])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
            username : Ext.getCmp('username').getValue(),
            per_no : Ext.getCmp('per_no').getValue(),
			deptid : treedeptid
		};
	});
	var pagesize_combo = new Ext.form.ComboBox( {
		name : 'pagesize',
		hiddenName : 'pagesize',
		typeAhead : true,
		triggerAction : 'all',
		lazyRender : true,
		mode : 'local',
		store : new Ext.data.ArrayStore( {
			fields : [ 'value', 'text' ],
			data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
					[ 100, '100条/页' ], [ 250, '250条/页' ],
					[ 500, '500条/页' ] ]
		}),
		valueField : 'value',
		displayField : 'text',
		value : '20',
		editable : false,
		width : 85
	});
	var number = parseInt(pagesize_combo.getValue());
	pagesize_combo.on("select", function(comboBox) {
		bbar.pageSize = parseInt(comboBox.getValue());
		number = parseInt(comboBox.getValue());
		store.reload( {
			params : {
				start : 0,
				limit : bbar.pageSize,
				deptid : treedeptid
			}
		});
	});

	var bbar = new Ext.PagingToolbar( {
		pageSize : number,
		store : store,
		displayInfo : true,
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
		displayMsg : '显示{0}条到{1}条,共{2}条',
		emptyMsg : "没有符合条件的记录",
		items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
	});

    var grid = new Ext.grid.GridPanel({
        title: '<img src="./resource/image/ext/group.png" align="top" class="IEPNG">' +
            '<span style="font-weight:normal">人员信息</span>',
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

                    if (record.get('dataroleid') == manageDeptRoleId) {
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
                    win.show();
                }
            },
            '-',
            {
                text: '特殊数据权限维护',
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
                text: '权限查询',
                iconCls: 'page_findIcon',
                handler: function () {
					var record = grid.getSelectionModel().getSelected();
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请选择用户数据!');
						return;
					}
					userid = record.get('userid');
					userPermWindow.show();
//					userMenuPermTree.root.reload();
//					userDataPermTree.root.reload();
                }
            },
            '->',new Ext.form.TextField({
                id: 'per_no',
                name: 'per_no',
                emptyText: '工号',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryUserItem();
                        }
                    }
                },
                width: 80
            }),'-',new Ext.form.TextField({
                id: 'username',
                name: 'username',
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
            }),{
                text: '查询',
                iconCls: 'page_findIcon',
                handler: function () {
                    queryUserItem();
                }
            }
        ],
        bbar: bbar
    });

	grid.on('rowdblclick', function(grid, rowIndex, event) {

	});

    store.load( {
        params : {
            start : 0,
            limit : bbar.pageSize,
            username : Ext.getCmp('username').getValue(),
            per_no : Ext.getCmp('per_no').getValue(),
            deptid : treedeptid
        }
    });

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

    // 角色下拉框
    var roleStore = new Ext.data.Store({
        autoLoad : true,
        proxy : new Ext.data.HttpProxy({
            url : './user.ered?reqCode=queryAllRole'
        }),
        reader : new Ext.data.JsonReader({}, [{
            name : 'value'
        }, {
            name : 'text'
        }]),
        baseParams : {
            roletype : '4'
        }
    });
    roleStore.load();

    var roleCombo = new Ext.form.ComboBox({
        name : 'roleid',
        hiddenName : 'roleid',
        store : roleStore,
        mode : 'local',
        fieldLabel : '菜单角色' + re,
        emptyText : '请选择...',
        allowBlank : false,
        triggerAction : 'all',
        displayField : 'text',
        valueField : 'value',
        loadingText : '正在加载数据...',
        forceSelection : true,
        typeAhead : true,
        resizable : true,
        editable : false,
        anchor : "95%"
    });

    // 角色下拉框
    var dataRoleStore = new Ext.data.Store({
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
    dataRoleStore.load();

    var dataRoleCombo = new Ext.form.ComboBox({
        name: 'dataroleid',
        hiddenName: 'dataroleid',
        store: dataRoleStore,
        mode: 'local',
        fieldLabel: '数据角色',
        emptyText:'数据角色为空默认个人权限',
        allowBlank: true,
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

    dataRoleCombo.on('select', function (obj) {
        var value = obj.getValue();
        if (value == manageDeptRoleId) {
            addUserFormPanel.findById('managedeptid').show();
            addUserFormPanel.findById('managedeptid').getEl().up('.x-form-item').setDisplayed(true);
        } else {
            addUserFormPanel.findById('managedeptid').hide();
            addUserFormPanel.findById('managedeptid').getEl().up('.x-form-item').setDisplayed(false);
        }
    });

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
                id : 'addUserFormPanel',
                name : 'addUserFormPanel',
                width : 180,
                height : 130,
                labelAlign : 'right', // 标签对齐方式
                bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
                buttonAlign : 'center',
                border:false,
                items : [{
                    layout : 'column',
                    border:false,
                    items : [{
                        columnWidth : 1,
                        layout : 'form',
                        labelWidth : 70, // 标签宽度
                        defaultType : 'textfield',
                        border : false,
                        items : [{
                            xtype:'textfield',
                            fieldLabel:'工号',
                            name:'per_no',
                            readOnly:true,
                            anchor : '95%'
                        },{
                            xtype:'textfield',
                            fieldLabel:'姓名',
                            name:'username',
                            readOnly:true,
                            anchor : '95%'
                        },{
                            xtype:'textfield',
                            fieldLabel:'部门',
                            name:'deptname',
                            readOnly:true,
                            anchor : '95%'
                        },roleCombo ,dataRoleCombo,manageComboxWithTree,{
                            name : 'userid',
                            id : 'userid',
                            hidden : true
                        },{
                            name : 'account',
                            id : 'account',
                            hidden : true
                        }]
                    }]
                }]
            });

    var addUserWindow = new Ext.Window(
        {
            layout : 'fit',
            width : 300,
            height : 230,
            resizable : false,
            draggable : true,
            closeAction : 'hide',
            title : '角色分配(*为必填项)',
            iconCls : 'page_addIcon',
            modal : true,
            collapsible : true,
            titleCollapse : true,
            maximizable : false, // 窗口最大化
            buttonAlign : 'right',
            border : false,
            animCollapse : true,
            pageY : 20,
            pageX : document.body.clientWidth / 2 - 420 / 2,
            animateTarget : Ext.getBody(),
            constrain : true,
            items : [ addUserFormPanel ],
            buttons : [{
                    text : '保存',
                    iconCls : 'acceptIcon',
                    handler : function() {
                        if(!Ext.isEmpty(managedeptid)&&managedeptid.split(',').length>50){
                            Ext.MessageBox.alert('提示', '最多支持50个分管部门!');
                            return;
                        }
                        addUserFormPanel.form.submit( {
                            url : './user.ered?reqCode=saveEaUserAuthorize',
                            waitTitle : '提示',
                            method : 'POST',
                            waitMsg : '正在处理数据,请稍候...',
                            success : function(form, action) {
                                addUserWindow.hide();
                                store.reload();
                                Ext.MessageBox.alert('提示', action.result.msg);
                            },
                            failure : function(form, action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
                            },
                            params: {
                                managedeptid: managedeptid
                            }
                        });

                    }
                }, {
                    text : '关闭',
                    iconCls : 'deleteIcon',
                    handler : function() {
                        addUserWindow.hide();
                    }
                } ]
        });

    /**
     * 布局
     */
    var viewport = new Ext.Viewport( {
        layout : 'border',
        items : [ {
            title : '<span style="font-weight:normal">部门信息</span>',
            iconCls : 'chart_organisationIcon',
            tools : [ {
                id : 'refresh',
                handler : function() {
                    deptTree.root.reload()
                }
            } ],
            collapsible : true,
            width : 210,
            minSize : 160,
            maxSize : 280,
            split : true,
            region : 'west',
            autoScroll : true,
            items : [ deptTree ]
        }, {
            region : 'center',
            layout : 'fit',
            items : [ grid ]
        } ]
    });

    /**
     * 根据条件查询人员
     */
    function queryUserItem() {
        store.load( {
            params : {
                start : 0,
                limit : bbar.pageSize,
                username : Ext.getCmp('username').getValue(),
                per_no : Ext.getCmp('per_no').getValue(),
                deptid : treedeptid
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
                        } });
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
        modal : true,
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

                        select_store.removeAll();
                        s_store.removeAll();
                        store.reload();
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

	var userMenuPermTreeRoot = new Ext.tree.AsyncTreeNode({
		text : '根部门',
		id : '001',
		expanded : true,
		iconCls : 'folder_userIcon'
	});

	var userMenuPermTreeLoader = new Ext.tree.TreeLoader( {
		dataUrl : './dataPerm.ered?reqCode=userMenuTreeInit'
	});

	userMenuPermTreeLoader.on("beforeload", function(treeLoader, node) {
		treeLoader.baseParams.userid = userid;
	}, this);

	var userMenuPermTree = new Ext.tree.TreePanel({
		loader :userMenuPermTreeLoader,
		root : userMenuPermTreeRoot,
		autoScroll : true,
		animate : false,
		useArrows : false,
		border : false,
		rootVisible:false
	});

	var userMenuPermPanel =  new Ext.Panel({
		title : '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">菜单权限',
		titleCollapse : false,
		floating : false,
		layout : 'border',
		region : 'center',
		id:'userMenuPermPanel',
		items : [{
			region : 'center',
			layout : 'fit',
			autoScroll : true,
			items : [userMenuPermTree]
		}]
	});


	var userDataPermTreeRoot = new Ext.tree.AsyncTreeNode({
		text : '根部门',
		id : 'root001',
		expanded : true,
		iconCls : 'folder_userIcon'
	});

	var userDataPermTreeLoader = new Ext.tree.TreeLoader( {
		dataUrl : './dataPerm.ered?reqCode=userDataTreeInit'
	});

	userDataPermTreeLoader.on("beforeload", function(treeLoader, node) {
		treeLoader.baseParams.userid = userid;
	}, this);

	var userDataPermTree = new Ext.tree.TreePanel({
		loader :userDataPermTreeLoader,
		root : userDataPermTreeRoot,
		autoScroll : true,
		animate : false,
		useArrows : false,
		border : false,
		rootVisible:false
	});

	var userDataPermPanel =  new Ext.Panel({
		title : '<img src="./resource/image/ext/group.png" align="top" class="IEPNG">数据权限',
		titleCollapse : false,
		floating : false,
		id:'userDataPermPanel',
		layout : 'border',
		region : 'center',
		items : [{
			region : 'center',
			layout : 'fit',
			autoScroll : true,
			items : [userDataPermTree]
		}]
	});

	var userPermTabPanel =  new Ext.TabPanel({
		activeTab : 1,
		width : 600,
		height : 250,
		plain : true,// True表示为不渲染tab候选栏上背景容器图片
		defaults : {
			autoScroll : true
		},
		items : [userMenuPermPanel,userDataPermPanel]
	});

	var userPermWindow = new Ext.Window({
		layout : 'fit',
		width : 400,
		height : document.body.clientHeight,
		resizable : true,
		draggable : true,
		closeAction : 'hide',
		title : '用户权限信息',
		iconCls : 'award_star_silver_3Icon',
		modal : true,
		pageY : 15,
		pageX : document.body.clientWidth / 2 - 420 / 2,
		collapsible : true,
		maximizable : true,
		buttonAlign : 'right',
		constrain : true,
		items : [userPermTabPanel],
		buttons : [{
			text : '关闭',
			handler : function() {
				userPermWindow.hide();
			}
		}]
	});

	userPermWindow.on('show',function(){
		showCount++;
		if(showCount>1){
			userDataPermTree.root.reload();
			userMenuPermTree.root.reload();
		}
	})
});