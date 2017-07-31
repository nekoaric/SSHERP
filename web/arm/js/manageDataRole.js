/**
 * 数据角色管理与授权
 *
 * @author may
 * @since 2012-12
 */
Ext.onReady(function () {
    var roleid;//角色编号
    var dutyGridOnReady = 0;

    var deptid, belong_grpname;

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
        autoScroll: false,
        animate: false,
        useArrows: false,
        border: false,
        rootVisible: false
    });

    deptTree.on('click', function (node) {
        deptid = node.attributes.match_deptid;
        belong_grpname = node.attributes.text;

        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                deptid: deptid,
                roleType:typeCombo.getValue()
            }
        });
    });

    var re = '<span style="color:red">*</span>'
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });
    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
        header: '角色编号',
        dataIndex: 'roleid',
        hidden: false,
        width: 80,
        sortable: true
    }, {
        header: '角色名称',
        dataIndex: 'rolename',
        width: 120
    }, {
        header: '角色类型',
        dataIndex: 'roletype',
        width: 90,
        renderer : function(value) {
            if (value == '2')
                return '系统角色';
            else if (value == '3')
                return '企业管理员角色';
            else if (value == '5')
                return '分厂管理员角色';
            else
                return value;
        }
    }, {
        header: '角色属性',
        dataIndex: 'flag',
        width: 90,
        renderer: function (value) {
            if (value == '3')
                return '对应权限';
            else if (value == '4')
                return '具体权限';
            else
                return value;
        }
    }, {
        header: '角色状态',
        dataIndex: 'locked',
        width: 60,
        renderer: function (value) {
            if (value == '1')
                return '锁定';
            else
                return '正常';
        }
    }, {
        id: 'deptname',
        header: '所属部门',
        dataIndex: 'deptname',
        width: 150
    }, {
        id: 'remark',
        header: '备注',
        dataIndex: 'remark'
    }, {
        id: 'deptid',
        header: '所属部门编号',
        dataIndex: 'deptid',
        hidden: true
    }, {
        header: '所属类型',
        dataIndex: 'roletype',
        hidden: true
    }
    ]);
    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './dataPerm.ered?reqCode=queryDataRole'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'roleid'
            },
            {
                name: 'rolename'
            },
            {
                name: 'locked'
            },
            {
                name: 'roletype'
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
                name: 'flag'
            }
        ])
    });
    // 翻页排序时带上查询条件
    store.on('beforeload', function () {
        this.baseParams = {
            queryParam: Ext.getCmp('queryParam').getValue(),
            roleType:typeCombo.getValue()
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
                limit: bbar.pageSize
                // deptid:treedeptid
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

    var typeStore = new Ext.data.SimpleStore({
        fields: [ 'value', 'text' ],
        data: [
            [ '2', '系统角色' ],
            [ '3', '企业管理员角色' ],
            [ '5', '分厂管理员角色' ],
            [ '', '所有角色' ]
        ]
    });

    var typeCombo = new Ext.form.ComboBox({
        name: 'type',
        hiddenName: 'type',
        store: typeStore,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        fieldLabel: '角色类型',
        emptyText: '角色类型',
        forceSelection: true,
        editable: false,
        typeAhead: true,
        width: 110
    });
    var grid = new Ext.grid.GridPanel({
        title: '<img src="./resource/image/ext/award_star_silver_3.png" align="top" class="IEPNG"><span style="font-weight:normal">数据角色信息表</span>',
        renderTo: 'roleGridDiv',
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
        autoExpandColumn: 'remark',
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
                text: '授权',
                iconCls: 'page_excelIcon',
                handler: function () {
                    window4GrantInit();
                }
            },
            '-',
            {
                text: '删除',
                iconCls: 'page_delIcon',
                handler: function () {
                    deleteRoleItems();
                }
            },
            '-',
            {
                text: '刷新',
                iconCls: 'page_refreshIcon',
                handler: function () {
                    queryRoleItem();
                }
            },
            '->',typeCombo,
            new Ext.form.TextField({
                id: 'queryParam',
                name: 'queryParam',
                emptyText: '请输入角色名称',
                enableKeyEvents: true,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryRoleItem();
                        }
                    }
                },
                width: 130
            }),
            {
                text: '查询',
                iconCls: 'page_findIcon',
                handler: function () {
                    queryRoleItem();
                }
            }
        ],
        bbar: bbar
    });

    store.load({
        params: {
            start: 0,
            limit: bbar.pageSize,
            firstload: 'true'
        }
    });
    grid.on('rowdblclick', function (grid, rowIndex, event) {
        editInit();
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
        fieldLabel: '角色状态',
        emptyText: '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "80%"
    });

    var flagStore = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: [
            ['3', '对应权限'],
            ['4', '具体权限']
        ]
    });
    var flagCombo = new Ext.form.ComboBox({
        name: 'flag',
        hiddenName: 'flag',
        store: flagStore,
        id: 'flagCombo',
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        fieldLabel: '角色属性',
        emptyText: '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "99%"
    });

	var roleTypeStore = new Ext.data.SimpleStore({
        fields: [ 'value', 'text' ],
        data: [
            [ '2', '系统角色' ],
            [ '3', '企业管理员角色' ]
        ]
    });
    var roleTypeCombo = new Ext.form.ComboBox({
        name: 'roleType',
        hiddenName: 'roleType',
        id: 'roleTypeId',
        store: roleTypeStore,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        fieldLabel: '角色类型',
        emptyText: '角色类型新增后不能更改',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "99%"
    });

    var addRoleFormPanel = new Ext.form.FormPanel({
        id: 'addRoleFormPanel',
        name: 'addRoleFormPanel',
        defaultType: 'textfield',
        labelAlign: 'right',
        labelWidth: 65,
        frame: true,
        items: [
            {
                fieldLabel: '角色名称' + re,
                name: 'rolename',
                id: 'rolename',
                allowBlank: false,
                maxLength:20,
                anchor: '99%'
            },
            roleTypeCombo,flagCombo,
            {
                fieldLabel: '备注',
                name: 'remark',
                id: 'remark',
                allowBlank: true,
                anchor: '99%'
            },
            {
                id: 'windowmode',
                name: 'windowmode',
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
                id: 'roleid',
                name: 'roleid',
                hidden: true
            }
        ]
    });
    var addRoleWindow = new Ext.Window({
        layout: 'fit',
        width: 260,
        height: 190,
        resizable: false,
        draggable: true,
        closeAction: 'hide',
        title: '新增角色',
        iconCls: 'page_addIcon',
        modal: false,
        collapsible: true,
        titleCollapse: true,
        maximizable: false,
        buttonAlign: 'right',
        border: false,
        animCollapse: true,
        pageY: 100,
        pageX: document.body.clientWidth / 2 - 590 / 2,
        animateTarget: Ext.getBody(),
        constrain: true,
        items: [addRoleFormPanel],
        buttons: [
            {
                text: '保存',
                iconCls: 'acceptIcon',
                handler: function () {
                    var mode = Ext.getCmp('windowmode').getValue();
                    if (mode == 'add')
                        saveRoleItem();
                    if (mode == 'edit')
                        updateRoleItem();
                }
            },
            {
                text: '重置',
                id: 'btnReset',
                iconCls: 'tbar_synchronizeIcon',
                handler: function () {
                    Ext.getCmp("rolename").setValue("");
                    Ext.getCmp("remark").setValue("");
					roleTypeCombo.reset();
                }
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                handler: function () {
                    addRoleWindow.hide();
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
     * 根据条件查询角色
     */
    function queryRoleItem() {
        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                queryParam: Ext.getCmp('queryParam').getValue(),
                deptid:deptid,
                roleType:typeCombo.getValue()
            }
        });
    }

    /**
     * 新增角色初始化
     */
    function addInit() {
        var flag = Ext.getCmp('windowmode').getValue();
        if (typeof(flag) != 'undefined') {
            addRoleFormPanel.form.getEl().dom.reset();
        } else {
            clearForm(addRoleFormPanel.getForm());
        }
        flagCombo.setValue('4');//默认详细授权
        addRoleWindow.show();
        addRoleWindow.setTitle('新增角色<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('add');
        lockedCombo.setValue('0');
        Ext.getCmp('btnReset').show();

        addRoleFormPanel.findById("roleTypeId").getEl().up('.x-form-item').setDisplayed(true);
        roleTypeCombo.show();
        Ext.getCmp('roleTypeId').allowBlank = false;
    }

    /**
     * 保存角色数据
     */
    function saveRoleItem() {
        if (!addRoleFormPanel.form.isValid()) {
            return;
        }
        addRoleFormPanel.form.submit({
            url: './dataPerm.ered?reqCode=saveDataRoleItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                addRoleWindow.hide();
                deptid = Ext.getCmp('deptid').getValue();
                store.reload();

                // Ext.MessageBox.alert('提示', action.result.msg);
                roleid = action.result.roleid;

                if (flagCombo.getValue() == '4') {
                    roleGrantWindow.show();
                } else if (flagCombo.getValue() == '3') {
                    otherWindow.show();
                }
                form.reset();
            },
            failure: function (form, action) {
                var msg = action.result.msg;
                Ext.MessageBox.alert('提示', '角色数据保存失败:<br>' + msg);
            }
        });
    }

    /**
     * 删除角色
     */
    function deleteRoleItems() {
        var record = grid.getSelectionModel().getSelected();

        if (Ext.isEmpty(record)) {
            Ext.Msg.alert('提示', '请先选中要删除的项目!');
            return;
        }

		if(record.get('locked')=='1'){
			Ext.Msg.alert('提示','锁定的角色不能删除!');
			return;
		}
		if(record.get('roletype')=='2'){
			if(root_usertype==5){//分厂管理员不能操作系统角色
				Ext.Msg.alert('提示','系统角色不能删除!');
				return;
			}
		}

		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>删除角色将同时删除和角色相关的权限信息,请慎重.</span><br>继续删除吗?',
			function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg();
					Ext.Ajax.request({
						url: './dataPerm.ered?reqCode=deleteDataRoleItems',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							store.reload();
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							roleid: record.get('roleid')
						}
					});
				}
			});
    }

    /**
     * 修改角色初始化
     */
    function editInit() {
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
		if(record.get('locked')=='1'){
			Ext.Msg.alert('提示','锁定的角色不能修改!');
			return;
		}
		if(record.get('roletype')=='2'){
			if(root_usertype==5){//分厂管理员不能操作系统角色
				Ext.Msg.alert('提示','系统角色不能修改!');
				return;
			}
		}

        addRoleFormPanel.getForm().loadRecord(record);
		var roletype = record.get("roletype");
        addRoleWindow.show();
        addRoleWindow.setTitle('修改角色<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('edit');
        Ext.getCmp('deptid_old').setValue(record.get('deptid'));
        Ext.getCmp('roleid').setValue(record.get('roleid'));
        Ext.getCmp('btnReset').hide();

		addRoleFormPanel.findById("roleTypeId").getEl().up('.x-form-item').setDisplayed(false);
		Ext.getCmp('roleTypeId').allowBlank = true;
		roleTypeCombo.hide();

    }

    /**
     * 修改角色数据
     */
    function updateRoleItem() {
        if (!addRoleFormPanel.form.isValid()) {
            return;
        }
        update();
    }

    /**
     * 更新
     */
    function update() {
        addRoleFormPanel.form.submit({
            url: './dataPerm.ered?reqCode=updateDataRoleItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                addRoleWindow.hide();
                store.reload();
                form.reset();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure: function (form, action) {
                var msg = action.result.msg;
                Ext.MessageBox.alert('提示', '角色数据修改失败:<br>' + msg);
            }
        });
    }

    var groupStore2 = new Ext.data.SimpleStore({
        fields: [ 'value', 'text' ],
        data: [
            ['0', '东腾'],
            ['1', '东奥'],
            ['2', '惠满']
        ]
    });

    var groupCombo2 = new Ext.ux.form.LovCombo({
        name: 'group2',
        id: 'groupStore2',
        //id : 'xxfs1',
        hiddenName: 'group2',
        store: groupStore2,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        value: '0;1;2',
        fieldLabel: '集团' + re,
        //emptyText : '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "90%"
    });

    var flagTypeStore = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: [
//            ['1', '当前人员'],
            ['2', '当前部门'],
            ['3', '分管分厂'],
            ['4', '分管部门'],
            ['5', '东奥所有']
        ]
    });

    var flagTypeCombo = new Ext.form.ComboBox({
        name: 'flagtype',
        hiddenName: 'flagtype',
        store: flagTypeStore,
        id: 'flagTypeComboId',
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        fieldLabel: '授权类型',
        emptyText: '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "90%"
    });

    var otherForm = new Ext.form.FormPanel({
        labelAlign: 'right',
        labelWidth: 60,
        frame: true,
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        defaultType: 'textfield',
                        items: [flagTypeCombo, groupCombo2]
                    }
                ]
            }
        ]
    });

    var otherWindow = new Ext.Window({
        layout: 'fit',
        width: 280,
        height: 150,
        resizable: false,
        draggable: true,
        closeAction: 'hide',
        title: '权限授权',
        iconCls: 'page_addIcon',
        modal: false,
        collapsible: true,
        titleCollapse: true,
        maximizable: false,
        buttonAlign: 'right',
        border: false,
        animCollapse: true,
        pageY: 100,
        pageX: document.body.clientWidth / 2 - 590 / 2,
        animateTarget: Ext.getBody(),
        constrain: true,
        items: [otherForm],
        buttons: [
            {
                text: '保存',
                iconCls: 'acceptIcon',
                handler: function () {
                    //获取集团
                    var group = groupCombo2.getValue();

                    if (group == '') {
                        Ext.Msg.alert('提示', '请至少选择一个集团权限');
                        return;
                    }

                    Ext.Ajax.request({
                        url: './dataPerm.ered?reqCode=saveDataRoleGrant4Classify',
                        success: function (response) {
                            hideWaitMsg();
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);
                        },
                        failure: function (response) {
                            hideWaitMsg();
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);
                        },
                        params: {
                            other: flagTypeCombo.getValue(),
                            group: group,
                            roleid: roleid
                        }
                    })
                }
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                handler: function () {
                    otherWindow.hide();
                }
            }
        ]
    });

    /**
     * 授权初始化
     */
    function window4GrantInit() {
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

		if(record.get('locked')=='1'){
			Ext.Msg.alert('提示','锁定的角色不能授权!');
			return;
		}
		if(record.get('roletype')=='2'){
			if(root_usertype==5){//分厂管理员不能操作系统角色
				Ext.Msg.alert('提示','系统角色不能授权!');
				return;
			}
		}

        if (record.get('flag') == '4') {
            //设置全局变量roleid
            roleid = record.get('roleid');

            var deptid = record.get('deptid');
            var flag = record.get('flag');

            //加载授权部门树信息
            deptTree.root.reload();

            if (dutyGridOnReady == 1) {
                dutystore.reload({
                    params: {
                        roleid: roleid
                    }
                });
            }
            //加载 集团信息
            otherTab.getForm().load({
                url: './dataPerm.ered?reqCode=queryGroupInfo4RoleGrant',
                method: 'post',// 请求方式
                success: function (form, action) {// 加载成功的处理函数
                    var group = action.result.data.group;
                    groupCombo1.setValue(group);
                },
                failure: function (form, action) {// 加载失败的处理函数
                    Ext.Msg.alert('提示', action.result.msg);
                },
                params: {
                    roleid: roleid
                }
            });

            roleGrantWindow.show();
        } else if (record.get('flag') == '3') {
            roleid = record.get('roleid');

            //加载 分类授权信息
            otherForm.getForm().load({
                url: './dataPerm.ered?reqCode=queryClassifyInfo4RoleGrant',
                method: 'post',// 请求方式
                success: function (form, action) {// 加载成功的处理函数
                    var group = action.result.data.group;
                    groupCombo2.setValue(group);
                },
                failure: function (form, action) {// 加载失败的处理函数
                    Ext.Msg.alert('提示', action.result.msg);
                },
                params: {
                    roleid: roleid
                }
            });
            otherWindow.show();
        }
    }

    var deptTreeRoot = new Ext.tree.AsyncTreeNode({
        text: '根部门',
        id: '001',
        expanded: true,
        iconCls: 'folder_userIcon'
    });

    var deptTreeLoader = new Ext.tree.TreeLoader({
        dataUrl: './dataPerm.ered?reqCode=departmentTreeInit'
    });

    deptTreeLoader.on("beforeload", function (treeLoader, node) {
        treeLoader.baseParams.roleid = roleid;
    }, this);

	Ext.override(Ext.tree.TreeNodeUI, {
		onDblClick : function(e) {
			e.preventDefault();
			if (this.disabled) {
				return;
			}
			if (this.checkbox) {

			}
			if (!this.animating && this.node.hasChildNodes()) {
				var isExpand = this.node.ownerTree.doubleClickExpand;
				if (isExpand) {
					this.node.toggle();
				}
			}
			this.fireEvent("dblclick", this.node, e);
		}
	});

    var deptTree = new Ext.tree.TreePanel({
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
                items: [deptTree]
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
            url: './dataPerm.ered?reqCode=queryUserInfo4RoleGrant'
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
            roleid: roleid,
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
        text: '根节点',
        id: '001',
        expanded: true
    });

    var select_addDeptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            dataUrl: './dataPerm.ered?reqCode=departmentInfoInit'
        }),
        root: select_addRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
		rootVisible:false
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
                roleid: roleid,
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
            url: './dataPerm.ered?reqCode=queryUserInfo4RoleGrant'
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
            roleid: roleid,
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
        text: '根节点',
        id: '001',
        expanded: true
    });

    var addDeptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            dataUrl: './dataPerm.ered?reqCode=departmentInfoInit'
        }),
        root: addRoot,
        autoScroll: true,
        animate: false,
        useArrows: false,
        border: false,
		rootVisible:false
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
                                url: './dataPerm.ered?reqCode=delUserInfo4RoleData',
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
                                    roleid: roleid
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
                roleid: roleid,
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

    var dutysm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    var dutycm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), dutysm,
        {
            header: '职务ID',
            dataIndex: 'duty_id',
            hidden: true
        }, {
            header: '职务名称',
            dataIndex: 'duty_name',
            id: 'duty_name',
            width: 80,
            sortable: true
        }, {
            header: '是否具有查询本部门权限',
            dataIndex: 'deptperm',
            align: 'center',
            width: 180,
            renderer: function (value) {
                if (value == '0') {
                    return '否';
                }
                if (value == '1') {
                    return '是';
                }
            }
        }, {
            header: '工资类型',
            dataIndex: 'remark',
            width: 200,
            hidden: true,
            sortable: true,
            renderer: function (value) {
                if (value == '0')
                    return '员工计件工资';
                else if (value == '1')
                    return '员工计时工资';
                else if (value == '2')
                    return '管理员工资';
            }
        }]);

    // 数据存储
    var dutystore = new Ext.data.Store({
        // 获取数据的方式
        proxy: new Ext.data.HttpProxy({
            url: './dataPerm.ered?reqCode=queryDutyInfo4RoleGrant'
        }),
        // 数据读取器
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',// 记录总数
            root: 'ROOT'// Json中的列表数据根节点
        }, [
            {name: 'remark'},
            {name: 'duty_id'},
            {name: 'duty_name'},
            {name: 'deptperm'},
            {name: 'checked'}
        ])
    });

    /**
     * 表格实例
     */
    var dutygrid = new Ext.grid.GridPanel({
        //renderTo : 'dutygriddiv',
        store: dutystore,
        title: '<img src="./resource/image/ext/wrench.png" align="top" class="IEPNG">职务权限',
        height: 300,
        //width : 260,
        //region : 'center',
        anchor: '100%',
        autoExpandColumn: 'duty_name',
        stripeRows: true,
        frame: true,
        cm: dutycm,
        sm: dutysm
    });

    dutygrid.on('activate', function () {
        if (dutyGridOnReady == 0) {
            dutystore.reload({
                params: {
                    roleid: roleid
                }
            });
        }
        dutyGridOnReady = 1;
    });

    dutystore.on('load', function (obj) {

//        alert(dutyGridOnReady);

        for (var i = 0; i < obj.getCount(); i++) {
            var record = obj.getAt(i);

            if (record.get('checked') == '1') {
                dutysm.selectRow(i, true);
            }
        }
    });

    var groupStore1 = new Ext.data.SimpleStore({
        fields: [ 'value', 'text' ],
        data: [
            ['0', '东腾'],
            ['1', '东奥'],
            ['2', '惠满']
        ]
    });

    var groupCombo1 = new Ext.ux.form.LovCombo({
        name: 'group',
        id: 'groupStore',
        //id : 'xxfs1',
        hiddenName: 'evt',
        store: groupStore1,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        value: '0;1;2',
        fieldLabel: '集团' + re,
        //emptyText : '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "100%"
    });

//    groupCombo.setValue("DA;DT;SM");

    var otherTab = new Ext.form.FormPanel({
        title: '<img src="./resource/image/ext/layout.png" align="top" class="IEPNG">集团权限',
        labelAlign: 'right',
        labelWidth: 60,
        frame: true,
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        defaultType: 'textfield',
                        items: [groupCombo1]
                    }
                ]
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
        items: [selectDeptTab, selectUserTab, otherTab, dutygrid]
    });

    var roleGrantWindow = new Ext.Window({
        layout: 'fit',
        width: 400,
        height: document.body.clientHeight,
        resizable: true,
        draggable: true,
        closeAction: 'hide',
        title: '角色授权',
        iconCls: 'award_star_silver_3Icon',
        modal: false,
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
                    var checked = deptTree.getChecked('id');
                    var deptids = '' + checked;
                    //获取人员选择的数据
                    var userRecords = selectUserGrid.getSelectionModel().getSelections();
                    var perids = jsArray2JsString(userRecords, 'account');
                    //获取集团
                    var group = groupCombo1.getValue();
                    //获取选择的职务数据
                    var dutyRecords = dutygrid.getSelectionModel().getSelections();
                    var dutys = jsArray2JsString(dutyRecords, 'duty_id');

                    if (group == '') {
                        Ext.Msg.alert('提示', '请至少选择一个集团权限');
                        return;
                    }
                    showWaitMsg("正在授权请等待!");
                    //更新权限
                    Ext.Ajax.request({
                        url: './dataPerm.ered?reqCode=saveDataRoleGrant',
                        success: function (response) {
                            hideWaitMsg();
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);

//                            groupCombo.setValue("0;1;2");//默认设置
                            select_store.removeAll();
                            s_store.removeAll();

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
                            group: group,
                            dutys: dutys,
                            roleid: roleid
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

    //页面载入时初始化
    if (root_usertype == '5') {
        flagTypeStore.removeAt(1);
        flagTypeStore.removeAt(2);
        typeStore.removeAt(1);
    }

    addRoleWindow.on('show',function(){
        if(root_usertype == '5'){
            addRoleFormPanel.findById("roleTypeId").getEl().up('.x-form-item').setDisplayed(false);
            roleTypeCombo.hide();
            Ext.getCmp('roleTypeId').allowBlank = true;
        }
    })
});