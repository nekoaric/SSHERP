/************************************************
 * 创建日期: 2013-05-28
 * 创建作者：may|tangfh
 * 功能：用户管理(操作员管理)
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
    var dept_id;// 初始化-0

    var root = new Ext.tree.AsyncTreeNode({
        text: root_deptname,
        expanded: true,
        iconCls: 'folder_userIcon',
        id: root_deptid
    });

    var deptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            baseAttrs: {},
            dataUrl: './sysUser.ered?reqCode=departmentTreeInit'
        }),
        root: root,
        title: '',
        autoScroll: false,
        animate: false,
        useArrows: false,
        border: false
    });
    deptTree.on('click', function (node) {
        Ext.getCmp('user_name').setValue('');
        dept_id = node.attributes.id;
        store.load({
            params: {
                start: 0,
                limit: bbar.pageSize,
                dept_id: dept_id
            }
        });
    });

    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });

    /** 定义列头 */
    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
        header: '人员编号',
        dataIndex: 'user_id',
        hidden: true
    }, {
        header: '工号',
        dataIndex: 'account',
        align: 'center',
        width: 80
    }, {
        header: '姓名',
        dataIndex: 'user_name',
        align: 'center',
        width: 80
    }, {
        header: '部门',
        align: 'left',
        dataIndex: 'dept_name',
        width: 200
    }, {
        header: '卡片编号',
        align: 'left',
        dataIndex: 'csn',
        width: 200
    },{
        header: '员工类型',
        dataIndex: 'user_type',
        align: 'center',
        width: 80,
        hidden: true
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
        header: '手机号码',
        dataIndex: 'mbl_no',
        align: 'center',
        width: 100
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
        header: '职务',
        hidden: true,
        dataIndex: 'duty_name',
        width: 150
    }, {
        header: '备注',
        hidden: true,
        dataIndex: 'remark'
    }, {
        dataIndex: 'dept_id',
        hidden: true
    }, {
        dataIndex: 'duty',
        hidden: true
    }, {
        dataIndex: 'grp_id',
        hidden: true
    }]);

    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './ordRecord.ered?reqCode=queryUserInfo'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, [
            {
                name: 'user_id'
            },
            {
                name: 'user_name'
            },
            {
                name: 'sex'
            },
            {
                name: 'account'
            },
            {
                name: 'dept_id'
            },
            {
                name: 'dept_name'
            },
            {
                name: 'remark'
            },
            {
                name: 'user_type'
            },
            {
                name: 'id_crd'
            },
            {
                name: 'csn'
            },
            {
                name: 'mbl_no'
            },
            {
                name: 'birthday'
            },
            {
                name: 'duty_name'
            },
            {
                name: 'address'
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
                name: 'duty'
            },
            {
                name: 'grp_id'
            },
            {
                name: 'state'
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
                limit: bbar.pageSize
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
        height: 500,
        autoScroll: true,
        region: 'center',
        store: store,
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        },
        stripeRows: true,
        border: false,
        cm: cm,
        sm: sm,
        tbar: [
            {
                text: '发卡绑定',
                iconCls: 'acceptIcon',
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();
                    if (Ext.isEmpty(record)) {
                        Ext.Msg.alert('提示', '请选择人员记录!');
                        return;
                    }
                    writeCrdForm.getForm().loadRecord(record);
                    writeCrdWindow.show();
                }
            },'-',
            {
                text: '解绑',
                iconCls: 'acceptIcon',
                handler: function () {
                    var record = grid.getSelectionModel().getSelected();
                    if (Ext.isEmpty(record)) {
                        Ext.Msg.alert('提示', '请选择人员记录!');
                        return;
                    }
                    Ext.Ajax.request({
                        url: './ordRecord.ered?reqCode=unbindUserAndCsn',
                        success: function (response) {
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            if (resultArray.success) {
                                Ext.Msg.alert("提示", resultArray.msg);
                                store.reload();
                            } else {
                                Ext.Msg.alert('提示', '操作失败!');
                            }
                        },
                        failure: function (response) {
                            var resultArray = Ext.util.JSON.decode(response.responseText);
                            Ext.Msg.alert('提示', resultArray.msg);
                        },
                        params: {
                            user_id:record.get('user_id')
                        }
                    });
                }
            },
            '->',
            new Ext.form.TextField({
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
            }),
            '-',
            new Ext.form.TextField({
                id: 'user_name',
                name: 'user_name',
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
            limit: bbar.pageSize
        }
    });

    store.on('beforeload', function () {
        this.baseParams = {
            dept_id: dept_id
        };
    });

    grid.on('rowdblclick', function (grid, rowIndex, event) {

    });
    grid.on('sortchange', function () {
        grid.getSelectionModel().selectFirstRow();
    });


    var writeCrdForm = new Ext.form.FormPanel({
        collapsible: false,
        border: true,
        xtype: 'form',
        labelWidth: 70, // 标签宽度
        labelAlign: 'left', // 标签对齐方式
        bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign: 'center',
        items: [
            {
                fieldLabel: "卡片编号",
                name: "csn",
                id: 'csn',
                allowBlank: false, // 是否允许为空
                xtype: "textfield",
//                readOnly: true,
                anchor: '99%',
                fieldClass: 'x-custom-field-disabled'
            },
            {
                name: "user_id",
                hidden: true,
                xtype: "textfield"
            }
        ]
    });

    var writeCrdWindow = new Ext.Window({
        title: '<span style="font-weight:normal">绑定EPC<span>', // 窗口标题
        layout: 'fit', // 设置窗口布局模式
        width: 550, // 窗口宽度
        height: 120, // 窗口高度
        closable: false, // 是否可关闭
        collapsible: true, // 是否可收缩
        maximizable: true, // 设置是否可以最大化
        border: false, // 边框线设置
        constrain: true, // 设置窗口是否可以溢出父容器
        animateTarget: Ext.getBody(),
        items: [writeCrdForm],
        buttons: [
            {
                text: '读卡并确认关联',
                iconCls: 'acceptIcon',
                handler: function () {
                    var card = getCardCSN();
                    if (card.state != '0') {
                        Ext.Msg.alert('提示', card.returnMsg);
                        return;
                    }
                    Ext.getCmp('csn').setValue(card.csn);

                    writeCrdForm.getForm().submit({
                        url: './ordRecord.ered?reqCode=bindUserAndCsn',
                        waitTitle: '提示',
                        method: 'POST',
                        waitMsg: '正在处理数据,请稍候...',
                        success: function (form, action) { // 回调函数有2个参数
                            Ext.Msg.alert("提示", action.result.msg);
                            store.reload();
                            writeCrdWindow.hide();
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert('提示', action.result.msg);
                        }
                    });
                }
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                handler: function () {
                    writeCrdWindow.hide();
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
                margins: '3 0 3 3',
                autoScroll: true,
                items: [ deptTree ]
            },
            {
                region: 'center',
                layout: 'fit',
                margins: '3 3 3 0',
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
                dept_id: dept_id,
                user_name: Ext.getCmp('user_name').getValue(),
                per_no: Ext.getCmp('per_no').getValue()
            }
        });
    }

});