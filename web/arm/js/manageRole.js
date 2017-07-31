/**
 * 角色管理与授权
 *
 * @author cnnct
 * @since 2010-04-20
 */
Ext.onReady(function () {
    var re = '<span style="color:red">*</span>'
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });
    var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
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
        hidden: true,
        width: 90,
        renderer: function (value) {
            if (value == '2')
                return '企业人员';
            else if (value == '3')
                return '企业管理员';
            else if (value == '4')
                return '企业操作员';
            else if (value == '6')
                return '地市客户经理';
            else if (value == '7')
                return '省级管理员';
            else if (value == '8')
                return '地市管理员';
            else
                return value;
        }
    }, {
        header: '角色状态',
        dataIndex: 'locked',
        width: 60,
        hidden: true,
        renderer: function (value) {
            if (value == '1')
                return '锁定';
            else if (value == '0')
                return '正常';
            else
                return value;
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
    } ]);
    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './role.ered?reqCode=queryRolesForManage'
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
            }
        ])
    });
    // 翻页排序时带上查询条件
    store.on('beforeload', function () {
        this.baseParams = {
            queryParam: Ext.getCmp('queryParam').getValue()
            //deptid:treedeptid
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
                //deptid:treedeptid
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
        items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
    });
    var grid = new Ext.grid.GridPanel(
        {
            title: '<img src="./resource/image/ext/award_star_silver_3.png" align="top" class="IEPNG"><span style="font-weight:normal">角色信息表</span>',
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
                '->',
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
        fields: [ 'value', 'text' ],
        data: [
            [ '0', '0 正常' ],
            [ '1', '1 锁定' ]
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
    var roletypeStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './role.ered?reqCode=queryAllRoleType'
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
    roletypeStore.load();
    var roletypeCombo = new Ext.form.ComboBox({
        name: 'roletype',
        hiddenName: 'roletype',
        store: roletypeStore,
        mode: 'remote',
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        fieldLabel: '角色类型' + re,
        emptyText: '请选择...',
        allowBlank: false,
        forceSelection: true,
        editable: false,
        typeAhead: true,
        anchor: "80%"
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
                listeners: { // 监听注册onblur事件
                    'blur': function (obj) {
                        // 获取数据
                        validateNameofLength(obj.getValue());
                    }
                },
                allowBlank: false,
                anchor: '80%'
            },
            roletypeCombo,
            //lockedCombo,
            {
                fieldLabel: '备注',
                name: 'remark',
                id: 'remark',
                allowBlank: true,
                anchor: '80%'
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
        width: 320,
        height: 210,
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
        items: [ addRoleFormPanel ],
        buttons: [
            {
                text: '保存',
                iconCls: 'acceptIcon',
                handler: function () {
                    if (runMode == '0') {
                        Ext.Msg.alert('提示',
                            '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
                        return;
                    }
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
                    //clearForm(addRoleFormPanel.getForm());
                    Ext.getCmp("rolename").setValue("");
                    Ext.getCmp("remark").setValue("");
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
                queryParam: Ext.getCmp('queryParam').getValue()
            }
        });
    }

    /**
     * 新增角色初始化
     */
    function addInit() {
        var flag = Ext.getCmp('windowmode').getValue();
        if (typeof (flag) != 'undefined') {
            addRoleFormPanel.form.getEl().dom.reset();
        } else {
            clearForm(addRoleFormPanel.getForm());
        }
        addRoleWindow.show();
        addRoleWindow.setTitle('新增角色<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('add');
        lockedCombo.setValue('0');
        Ext.getCmp('btnReset').show();
    }

    /**
     * 保存角色数据
     */
    function saveRoleItem() {
        if (!addRoleFormPanel.form.isValid()) {
            return;
        }
        addRoleFormPanel.form.submit({
            url: './role.ered?reqCode=saveRoleItem',
            waitTitle: '提示',
            method: 'POST',
            waitMsg: '正在处理数据,请稍候...',
            success: function (form, action) {
                addRoleWindow.hide();
                deptid = Ext.getCmp('deptid').getValue();
                store.reload();
                form.reset();
                //Ext.MessageBox.alert('提示', action.result.msg);
                var roleid = action.result.roleid;
                var deptid = root_deptid;
                var roletype = action.result.roletype;
                roleGrantInit(roleid, deptid, roletype);
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
        var rows = grid.getSelectionModel().getSelections();
        var record = grid.getSelectionModel().getSelected();
        var fields = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get('roletype') == '3' && root_usertype != '9'
                && root_usertype != '8') {
                fields = fields + rows[i].get('rolename') + '<br>';
            }
        }
        if (fields != '') {
            Ext.Msg.alert('提示',
                    '<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields + '<font color=red>系统内置角色不能删除!</font>');
            return;
        }
        if (Ext.isEmpty(rows)) {
            Ext.Msg.alert('提示', '请先选中要删除的项目!');
            return;
        }
        Ext.Msg.confirm('请确认',
            '<span style="color:red"><b>提示:</b>删除角色将同时删除和角色相关的权限信息,请慎重.</span><br>继续删除吗?',
            function (btn, text) {
                if (btn == 'yes') {
                    if (runMode == '0') {
                        Ext.Msg
                            .alert('提示',
                                '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
                        return;
                    }
                    showWaitMsg();
                    Ext.Ajax
                        .request({
                            url: './role.ered?reqCode=deleteRoleItems',
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
        if (record.get('roletype') == '7' && root_usertype != '9'
            && root_usertype != '8') {
            Ext.MessageBox.alert('提示', '系统内置角色,不能修改!');
            return;
        }
        addRoleFormPanel.getForm().loadRecord(record);
        addRoleWindow.show();
        addRoleWindow.setTitle('修改角色<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('edit');
        Ext.getCmp('deptid_old').setValue(record.get('deptid'));
        Ext.getCmp('roleid').setValue(record.get('roleid'));
        Ext.getCmp('btnReset').hide();
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

    function validateNameofLength(obj) {
        var strlen = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj.charCodeAt(i) > 20) {
                strlen += 2;
            } else {
                strlen++;
            }
        }
        if (strlen > 20) {
            Ext.Msg.alert('提示', '角色名称不能超过20个字符!');
            Ext.getCmp('rolename').setValue('');
        }

    }

    /**
     * 更新
     */
    function update() {
        addRoleFormPanel.form.submit({
            url: './role.ered?reqCode=updateRoleItem',
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
        if (record.get('roletype') == '7' && root_usertype != '9'
            && root_usertype != '8') {
            Ext.MessageBox.alert('提示', '系统内置角色,无权更改权限!');
            return;
        }
        var roleid = record.get('roleid');
        var deptid = record.get('deptid');
        var roletype = record.get('roletype');
        //alert(roletype);
        roleGrantInit(roleid, deptid, roletype);
    }

    /**
     * 角色授权窗口初始化
     */
    function roleGrantInit(roleid, deptid, roletype) {
        var operatorTab = new Ext.Panel(
            {
                title: '<img src="./resource/image/ext/config.png" align="top" class="IEPNG"> 授权菜单',
                // iconCls: 'user_femaleIcon',
                autoLoad: {
                    url: './role.ered?reqCode=operatorTabInit',
                    scripts: true,
                    text: '模板引擎正在驱动页面,请等待...',
                    params: {
                        roleid: roleid,
                        deptid: deptid,
                        roletype: roletype
                    }
                }
            });
        var selectUserTab = new Ext.Panel(
            {
                title: '<img src="./resource/image/ext/group.png" align="top" class="IEPNG"> 选择人员',
                // iconCls:'chart_organisationIcon',
                autoLoad: {
                    url: './role.ered?reqCode=selectUserTabInit',
                    scripts: true,
                    text: '模板引擎正在驱动页面,请等待...',
                    params: {
                        roleid: roleid,
                        deptid: deptid,
                        roletype: roletype
                    }
                }
            });
        var managerTab = new Ext.Panel(
            {
                title: '<img src="./resource/image/ext/wrench.png" align="top" class="IEPNG"> 授权权限授权',
                // iconCls: 'status_onlineIcon',
                autoLoad: {
                    url: './role.ered?reqCode=managerTabInit',
                    scripts: true,
                    text: '模板引擎正在驱动页面,请等待...',
                    params: {
                        roleid: roleid,
                        deptid: deptid,
                        roletype: roletype
                    }
                }
            });
        var roleGrantTabPanel = new Ext.TabPanel({
            activeTab: 0,
            width: 600,
            height: 250,
            plain: true,// True表示为不渲染tab候选栏上背景容器图片
            defaults: {
                autoScroll: true
            },
            //items : [operatorTab, managerTab, selectUserTab]
            //items : [operatorTab, selectUserTab]
            items: [ operatorTab ]
        });
        var roleGrantWindow = new Ext.Window({
            layout: 'fit',
            width: 400,
            height: document.body.clientHeight,
            resizable: true,
            draggable: true,
            closeAction: 'close',
            title: '角色授权',
            iconCls: 'award_star_silver_3Icon',
            modal: false,
            pageY: 15,
            pageX: document.body.clientWidth / 2 - 420 / 2,
            collapsible: true,
            maximizable: true,
            // animateTarget: document.body,
            // //如果使用autoLoad,建议不要使用动画效果
            buttonAlign: 'right',
            constrain: true,
            /*tools : [{
             id : 'help',
             handler : function() {
             Ext.Msg.alert('提示', '显示在线帮助');
             }
             }],*/
            items: [ roleGrantTabPanel ],
            buttons: [
                {
                    text: '关闭',
                    handler: function () {
                        roleGrantWindow.close();
                    }
                }
            ]
        });
        roleGrantWindow.show();
        if (roletype == '2') {
            // operatorTab.disable();
        } else if (roletype == '1') {
            managerTab.disable();
        }
    }
});