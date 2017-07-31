/**
 * 创建时间：2013-11-20 创建作者：zhouww 功能：我的工作台的显示内容 最后修改时间： 最后修改功能：
 */
Ext.onReady(function() {

    var info_type = "0";
    // 订单动态
    var ordInfoPanel = new Ext.Panel({
                id : 'ordInfoPanel',
                title : '<span style="font-weight:normal">订单动态 </span>'

            });

    var filesm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : true
            });
    var filecm = new Ext.grid.ColumnModel([filesm, new Ext.grid.RowNumberer(),
            {
                header : '序号',
                dataIndex : 'seq_no',
                width : 140,
                hidden : true
            }, {
                header : '标题',
                dataIndex : 'info_title',
                width : 200
            }, {
                header : '文件名',
                dataIndex : 'file_name',
                width : 250
            }, {
                header : '文件大小',
                dataIndex : 'info_detail',
                width : 140
            }, {
                header : '备注',
                dataIndex : 'remark',
                width : 280
            }, {
                header : '上传日期',
                dataIndex : 'pub_time',
                width : 140,
                sortable : true
            }, {
                header : '上传人',
                dataIndex : 'opr_name',
                width : 140,
                sortable : true
            }

    ]);

    var fileStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './qaInfo.ered?reqCode=queryFileInfo'
                        }),
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT',
                            root : 'ROOT'
                        }, ['seq_no', 'info_title', 'file_name', 'info_detail',
                                'remark', 'pub_time', 'opr_name'])
            })
    // 上传pannel
    var addPanel = new Ext.form.FormPanel({
                id : 'formpanel4Imp',
                name : 'formpanel4Imp',
                defaultType : 'textfield',
                labelWidth : 99,
                frame : true,
                labelAlign : 'right',
                fileUpload : true,
                items : [{
                            xtype : 'textfield',
                            fieldLabel : '标题',
                            id : 'info_title',
                            name : 'info_title',
                            width : 290,
                            allowBlank : false
                        }, {
                            xtype : 'textarea',
                            fieldLabel : '备注',
                            id : 'info_remark',
                            name : 'info_remark',
                            width : 290,
                            height : 100,
                            allowBlank : true
                        }, new Ext.ux.form.FileUploadField({
                                    fieldLabel : '请选择上传文件',
                                    buttonText : '上传',
                                    name : 'theFile',
                                    id : 'EmpInfoTheFile',
                                    blankText : "上传文件",
                                    anchor : '94%'
                                }), {
                            name : 'file_type',
                            id : 'file_type',
                            hidden : true,
                            allowBlank : true,
                            anchor : '99%'
                        }]
            });

    // 文件上传窗口
    var addWindow = new Ext.Window({
        id : 'addWindow',
        layout : 'fit',
        width : 480,
        height : 280,
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
        items : [addPanel],
        buttons : [{
            text : '导入',
            iconCls : 'acceptIcon',
            handler : function() {
                var theFile = Ext.getCmp('EmpInfoTheFile').getValue();
                if (Ext.isEmpty(theFile)) {
                    Ext.Msg.alert('提示', '请先选择您要导入文件。');
                    return;
                }

                addPanel.getForm().submit({
                            url : './qaInfo.ered?reqCode=uploadFile',
                            waitTitle : '提示',
                            method : 'POST',
                            waitMsg : '正在处理数据,请稍候...',
                            success : function(form, action) {
                                fileStore.reload();
                                Ext.MessageBox.alert('提示', action.result.msg);
                                addWindow.hide();
                            },
                            failure : function(form, action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.alert('提示', '文件上传失败:<br>' + msg);
                            },
                            params : {
                                file_name : EmpInfoTheFile,
                                info_title : Ext.getCmp('info_title')
                                        .getValue(),
                                remark : Ext.getCmp('info_remark').getValue()
                            }
                        });

            }
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
                addWindow.hide();
            }
        }]
    });

    var tbar = new Ext.Toolbar({
        items : [{
                    id : 'upload_file',
                    text : '上传',
                    xtype : 'button',
                    handler : function() {
                        Ext.getCmp('addWindow').show();
                    }
                }, '-', {
                    id : 'download_file',
                    text : '下载',
                    xtype : 'button',
                    handler : function() {
                        var record = filePanel.getSelectionModel()
                                .getSelected();
                        if (Ext.isEmpty(record)) {
                            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
                            return;
                        }
                        var downUrl = './qaInfo.ered?reqCode=downFileInfo'
                                + '&seq_no=' + record.get('seq_no');
                        window.location.href = downUrl;
                    }
                }, '-', {
                    id : 'delete_file',
                    text : '删除',
                    iconCls : 'deleteIcon',
                    xtype : 'button',
                    handler : function() {
                        var record = filePanel.getSelectionModel()
                                .getSelected();
                        var seq_no = record.get("seq_no");
                        if (Ext.isEmpty(record)) {
                            Ext.MessageBox.alert('提示', '您没有选中任何数据!');
                            return;
                        }
                        Ext.Msg.confirm('确认', '你确定要删除文件吗?',
                                function(btn, text) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url : './qaInfo.ered?reqCode=deleteFileInfo',
                                            success : function(response) { // 回调函数有1个参数
                                                var resultArray = Ext.util.JSON
                                                        .decode(response.responseText);
                                                if (!resultArray.success) {
                                                    Ext.MessageBox.alert(
                                                            "提示信息", '删除失败');
                                                    return;
                                                }
                                                Ext.MessageBox.alert('提示信息',
                                                        '删除成功');
                                                fileStore.reload();
                                            },
                                            failure : function(response) {
                                                Ext.Msg.alert('文件删除失败!');
                                            },
                                            params : {
                                                seq_no : seq_no
                                            }
                                        });
                                    }
                                });
                    }
                }]
    });

    var pagesize_combo = new Ext.form.ComboBox({
                name : 'pagesize',
                triggerAction : 'all',
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

    var bbar = new Ext.PagingToolbar({
                pageSize : parseInt(pagesize_combo.getValue()),
                store : fileStore,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', pagesize_combo]
            });

    // 标准格式文件 --基本表格
    var filePanel = new Ext.grid.GridPanel({
                id : 'fileInfoGrid',
                title : '<span style="font-weight:normal">标准文件管理</span>',
                region : 'center',
                store : fileStore,
                loadMask : {
                    msg : '正在加载表格数据，请稍等...'
                },
                frame : true,
                stripeRows : true,
                cm : filecm,
                sm : filesm,
                tbar : tbar,
                bbar : bbar
            });

    // -----------------------------标准格式文件-基本表格结束

    // 知识分享
    // var lessonPanel=new new Ext.panel({});
    // 系统帮助--------------------
    var qasm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : true
            });
    var qaColumnModel = new Ext.grid.ColumnModel([qasm,
            new Ext.grid.RowNumberer(), {
                header : '编号',
                dataIndex : 'seq_no',
                hidden : true
            }, {
                header : '标题',
                dataIndex : 'info_title',
                width : 200
            }, {
                header : '内容',
                dataIndex : 'info_detail',
                width : 400
            }, {
                header : '备注',
                dataIndex : 'remark',
                width : 200
            }, {
                header : '发布时间',
                dataIndex : 'pub_time',
                width : 200
            }, {
                header : '发布人',
                dataIndex : 'opr_name',
                width : 100
            }])
    var qaStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './qaInfo.ered?reqCode=queryQAInfo'
                        }),
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT',
                            root : "ROOT"
                        }, ['seq_no', 'info_title', 'info_detail', 'remark',
                                'pub_time', 'opr_name'])
            });

    // // 翻页排序时带上查询条件
    // qaStore.on('beforeload', function () {
    // this.baseParams = {
    // queryParam: Ext.getCmp('queryParam').getValue()
    // };
    // });
    var qaComboBox = new Ext.form.ComboBox({
                name : 'pagesize',
                hiddenName : 'pagesize',
                typeAhead : true,
                triggerAction : 'all',
                lazyRender : true,
                mode : 'local',
                store : new Ext.data.ArrayStore({
                            fields : ['value', 'text'],
                            data : [[10, '10条/页'], [20, '20条/页'],
                                    [30, '30条/页'], [40, '40条/页'], [50, '50条/页']]
                        }),
                valueField : 'value',
                displayField : 'text',
                value : '20',
                editable : false,
                width : 85
            });
    qaComboBox.on("select", function(comboBox) {
                qa_bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                qaStore.reload({
                            params : {
                                start : 0,
                                limit : qa_bbar.pageSize
                            }
                        });
            });
    var qa_bbar = new Ext.PagingToolbar({
                pageSize : qaComboBox.getValue(),
                store : qaStore,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', qaComboBox]
            })

    // Q&A form
    var qaForm = new Ext.form.FormPanel({
                labelAlign : 'right',
                height : 150,
                padding : '5,5,5,5',
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                items : [{
                            xtype : 'textfield',
                            fieldLabel : '标题',
                            id : 'qa_title',
                            name : 'qa_title',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '内容',
                            id : 'qa_detail',
                            name : 'qa_detail',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textarea',
                            fieldLabel : '备注',
                            id : 'qa_remark',
                            name : 'qa_remark',
                            width : 400,
                            height : 80,
                            allowBlank : true
                        }]
            })

    // Q&A Window
    var qaWindow = new Ext.Window({
                id : 'qaWindow',
                layout : "fit",
                title : '帮助信息',
                width : 600,
                height : 200,
                resizable : false,
                draggable : true,
                closeAction : 'hide',
                modal : true,
                collapsible : true,
                titleCollapse : true,
                maximizable : false,
                buttonAlign : 'right',
                border : false,
                animCollapse : true,
                animateTarget : Ext.getBody(),
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                constrain : true,
                padding : '5,5,5,5',
                items : [qaForm],
                bbar : ['->', {
                            id : 'saveButton_qa',
                            xtype : 'button',
                            text : '保存',
                            handler : function() {
                                if (mode == 'add')
                                    saveRoleItem();
                                if (mode == 'edit')
                                    updateRoleItem();
                            }
                        }, {
                            id : 'consoleButton_qa',
                            xtype : 'button',
                            text : '关闭',
                            handler : function() {
                                Ext.getCmp('qa_title').setValue("");
                                Ext.getCmp('qa_detail').setValue("");
                                Ext.getCmp('qa_remark').setValue("");
                                Ext.getCmp('qaWindow').hide();
                            }
                        }]
            })

    /**
     * 增加问题
     */

    function saveRoleItem() {

        var qa_title = Ext.getCmp('qa_title').getValue();
        var qa_detail = Ext.getCmp('qa_detail').getValue();
        var qa_remark = Ext.getCmp('qa_remark').getValue();
        if (Ext.isEmpty(qa_title)) {
            Ext.Msg.alert("提示信息", "请填写标题");
            return;
        }
        if (Ext.isEmpty(qa_detail)) {
            Ext.Msg.alert("提示信息", "请填写内容");
            return;
        }
        Ext.Ajax.request({
                    url : './qaInfo.ered?reqCode=addQAInfo',
                    success : function(value) {
                        var result = Ext.util.JSON.decode(value.responseText);
                        if (result.success) {
                            Ext.Msg.alert("提示信息", "保存成功");
                            Ext.getCmp('qaWindow').hide();
                            qaStore.reload();
                            qaform.reset();
                        } else {
                            Ext.Msg.alert("提示信息", "保存失败");
                        }
                    },
                    failure : function() {
                        Ext.Msg.alert("提示信息", "保存失败");
                    },
                    params : {
                        info_title : qa_title,
                        info_detail : qa_detail,
                        remark : qa_remark,
                        info_type : info_type
                    }
                })
    }

    /**
     * 删除问题
     */
    function deleteQaInfo() {
        var record;
        if (info_type == "3") {
            record = expGrid.getSelectionModel().getSelected();
        }
        if (info_type == "4") {
            record = qaGrid.getSelectionModel().getSelected();
        }
        if (info_type == "5") {
            record = sysGrid.getSelectionModel().getSelected();
        }

        if (Ext.isEmpty(record)) {
            Ext.Msg.alert('提示', '请先选中要删除的问题!');
            return;
        }

        Ext.Msg
                .confirm(
                        '请确认',
                        '<span style="color:red"><b>提示:</b>删除选中的问题,请慎重.</span><br>继续删除吗?',
                        function(btn, text) {
                            if (btn == 'yes') {
                                Ext.Ajax.request({
                                            url : './qaInfo.ered?reqCode=deleteQAInfo',
                                            success : function(response) {
                                                var resultArray = Ext.util.JSON
                                                        .decode(response.responseText);
                                                qaStore.reload();
                                                sysStore.reload();
                                                expStroe.reload();
                                                Ext.Msg.alert('提示',
                                                        resultArray.msg);
                                            },
                                            failure : function(response) {
                                                var resultArray = Ext.util.JSON
                                                        .decode(response.responseText);
                                                Ext.Msg.alert('提示',
                                                        resultArray.msg);
                                            },
                                            params : {
                                                seq_no : record.get('seq_no')
                                            }
                                        });
                            }
                        });
    }

    /**
     * 
     * by问题查询
     * 
     */
    function queryByAnswer() {
        qaStore.load({
                    params : {
                        start : 0,
                        limit : qa_bbar.pageSize,
                        queryParam : Ext.getCmp('queryParam').getValue()

                    }
                });
    }

    var qaGrid = new Ext.grid.GridPanel({
                title : '问题解决方案',
                region : 'center',
                store : qaStore,
                stripeRows : true,
                allowscroll:true,
                frame : true,
                cm : qaColumnModel,
                sm : qasm,
                bbar : qa_bbar,
                tbar : [{
                            xtype : 'button',
                            text : '增加',
                            iconCls : 'page_addIcon',
                            handler : function() {
                                mode = 'add';
                                qaWindow.show();
                            }
                        }, '-', {
                            xtype : 'button',
                            text : '修改',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                var record = qaGrid.getSelectionModel().getSelected();
                                if (Ext.isEmpty(record)) {
                                    Ext.Msg.alert('提示', '请选择一行有效记录！');
                                    return;
                                }
                                detail_info();
                            }
                        }, '-', {
                            xtype : 'button',
                            text : '删除',
                            iconCls : 'deleteIcon',
                            handler : function() {
                                deleteQaInfo();
                            }
                        }, '->', new Ext.form.TextField({
                                    id : 'queryParam',
                                    name : 'queryParam',
                                    emptyText : '请输入问题名称',
                                    enableKeyEvents : true,
                                    listeners : {
                                        specialkey : function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER) {
                                                queryByAnswer();
                                            }
                                        }
                                    },
                                    width : 130
                                }), {
                            text : '查询',
                            iconCls : 'page_findIcon',
                            handler : function() {
                                queryByAnswer();
                            }
                        }

                ]
            })
    // -----------------------------系统帮助窗体结束

    // 知识分享
    // var lessonPanel=new new Ext.panel({});
    // 系统帮助--------------------
    var syssm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : true
            });
    var syscm = new Ext.grid.ColumnModel([qasm, new Ext.grid.RowNumberer(), {
                header : '编号',
                dataIndex : 'seq_no',
                hidden : true
            }, {
                header : '标题',
                dataIndex : 'info_title',
                width : 300
            }, {
                header : '内容',
                dataIndex : 'info_detail',
                width : 400
            }, {
                header : '备注',
                dataIndex : 'remark',
                width : 200
            }, {
                header : '发布时间',
                dataIndex : 'pub_time',
                width : 200
            }, {
                header : '发布人',
                dataIndex : 'opr_name',
                width : 100
            }])
    var sysStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './qaInfo.ered?reqCode=querySysInfo'
                        }),
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT',
                            root : "ROOT"
                        }, ['seq_no', 'info_title', 'info_detail', 'remark',
                                'pub_time', 'opr_name'])
            });
    var sysComboBox = new Ext.form.ComboBox({
                name : 'pagesize',
                hiddenName : 'pagesize',
                typeAhead : true,
                triggerAction : 'all',
                lazyRender : true,
                mode : 'local',
                store : new Ext.data.ArrayStore({
                            fields : ['value', 'text'],
                            data : [[10, '10条/页'], [20, '20条/页'],
                                    [30, '30条/页'], [40, '40条/页'], [50, '50条/页']]
                        }),
                valueField : 'value',
                displayField : 'text',
                value : '20',
                editable : false,
                width : 85
            });
    sysComboBox.on("select", function(comboBox) {
                qa_bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                sysStore.reload({
                            params : {
                                start : 0,
                                limit : qa_bbar.pageSize
                            }
                        });
            });
    var sys_bbar = new Ext.PagingToolbar({
                pageSize : qaComboBox.getValue(),
                store : sysStore,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', sysComboBox]
            })

    // Q&A form
    var sysForm = new Ext.form.FormPanel({
                labelAlign : 'right',
                height : 150,
                padding : '5,5,5,5',
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                items : [{
                            xtype : 'textfield',
                            fieldLabel : '标题',
                            id : 'sys_title',
                            name : 'sys_title',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '内容',
                            id : 'sys_detail',
                            name : 'sys_detail',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textarea',
                            fieldLabel : '备注',
                            id : 'sys_remark',
                            name : 'sys_remark',
                            width : 400,
                            height : 80,
                            allowBlank : true
                        }]
            })

    // Q&A Window
    var sysWindow = new Ext.Window({
                id : 'sysWindow',
                layout : "fit",
                title : '帮助信息',
                width : 600,
                height : 200,
                resizable : false,
                draggable : true,
                closeAction : 'hide',
                modal : true,
                collapsible : true,
                titleCollapse : true,
                maximizable : false,
                buttonAlign : 'right',
                border : false,
                animCollapse : true,
                animateTarget : Ext.getBody(),
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                constrain : true,
                padding : '5,5,5,5',
                items : [sysForm],
                bbar : ['->', {
                    id : 'saveButton_qa',
                    xtype : 'button',
                    text : '保存',
                    handler : function() {
                        var title = Ext.getCmp('sys_title').getValue();
                        var detail = Ext.getCmp('sys_detail').getValue();
                        var remark = Ext.getCmp('sys_remark').getValue();
                        if (Ext.isEmpty(title)) {
                            Ext.Msg.alert("提示信息", "请填写标题");
                            return;
                        }
                        if (Ext.isEmpty(detail)) {
                            Ext.Msg.alert("提示信息", "请填写内容");
                            return;
                        }
                        Ext.Ajax.request({
                                    url : './qaInfo.ered?reqCode=addQAInfo',
                                    success : function(value) {
                                        var result = Ext.util.JSON
                                                .decode(value.responseText);
                                        if (result.success) {
                                            Ext.Msg.alert("提示信息", "保存成功");
                                            Ext.getCmp('sysWindow').hide();
                                            sysStore.reload();
                                            sysform.reset();
                                        } else {
                                            Ext.Msg.alert("提示信息", "保存失败");
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert("提示信息", "保存失败");
                                    },
                                    params : {
                                        info_title : title,
                                        info_detail : detail,
                                        remark : remark,
                                        info_type : info_type
                                    }
                                })
                    }
                }, {
                    id : 'consoleButton_sys',
                    xtype : 'button',
                    text : '关闭',
                    handler : function() {
                        Ext.getCmp('sys_title').setValue("");
                        Ext.getCmp('sys_detail').setValue("");
                        Ext.getCmp('sys_remark').setValue("");
                        Ext.getCmp('sysWindow').hide();
                    }
                }]
            })

    var sysGrid = new Ext.grid.GridPanel({
                title : '系统公告',
                region : 'center',
                store : sysStore,
                stripeRows : true,
                autoScroll : true,
                autoEncode : true,
                frame : true,
                cm : syscm,
                sm : syssm,
                bbar : sys_bbar,

                tbar : [{
                            xtype : 'button',
                            text : '增加',
                            iconCls : 'page_addIcon',
                            handler : function() {
                                mode = 'add';
                                sysWindow.show();
                            }
                        }, '-', {
                            xtype : 'button',
                            text : '修改',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                var record = qaGrid.getSelectionModel().getSelected();
                                if (Ext.isEmpty(record)) {
                                    Ext.Msg.alert('提示', '请选择一行有效记录！');
                                    return;
                                }
                                detail_info();
                            }
                        }, '-', {
                            xtype : 'button',
                            text : '删除',
                            iconCls : 'deleteIcon',
                            handler : function() {
                                deleteQaInfo();
                            }
                        }

                ]
            })
    // -----------------------------系统公告窗体结束

    // 经验分享--------------------
    var expsm = new Ext.grid.CheckboxSelectionModel({
                singleSelect : true
            });
    var expcm = new Ext.grid.ColumnModel([qasm, new Ext.grid.RowNumberer(), {
                header : '编号',
                dataIndex : 'seq_no',
                hidden : true
            }, {
                header : '标题',
                dataIndex : 'info_title',
                width : 300
            }, {
                header : '内容',
                dataIndex : 'info_detail',
                width : 400
            }, {
                header : '备注',
                dataIndex : 'remark',
                width : 200
            }, {
                header : '发布时间',
                dataIndex : 'pub_time',
                width : 200
            }, {
                header : '发布人',
                dataIndex : 'opr_name',
                width : 100
            }])
    var expStore = new Ext.data.Store({
                proxy : new Ext.data.HttpProxy({
                            url : './qaInfo.ered?reqCode=queryExpInfo'
                        }),
                reader : new Ext.data.JsonReader({
                            totalProperty : 'TOTALCOUNT',
                            root : "ROOT"
                        }, ['seq_no', 'info_title', 'info_detail', 'remark',
                                'pub_time', 'opr_name'])
            });
    var expComboBox = new Ext.form.ComboBox({
                name : 'pagesize',
                hiddenName : 'pagesize',
                typeAhead : true,
                triggerAction : 'all',
                lazyRender : true,
                mode : 'local',
                store : new Ext.data.ArrayStore({
                            fields : ['value', 'text'],
                            data : [[10, '10条/页'], [20, '20条/页'],
                                    [30, '30条/页'], [40, '40条/页'], [50, '50条/页']]
                        }),
                valueField : 'value',
                displayField : 'text',
                value : '20',
                editable : false,
                width : 85
            });
    expComboBox.on("select", function(comboBox) {
                qa_bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                expStore.reload({
                            params : {
                                start : 0,
                                limit : qa_bbar.pageSize
                            }
                        });
            });
    var exp_bbar = new Ext.PagingToolbar({
                pageSize : expComboBox.getValue(),
                store : expStore,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', expComboBox]
            })

    // Q&A form
    var expForm = new Ext.form.FormPanel({
                labelAlign : 'right',
                height : 150,
                padding : '5,5,5,5',
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                items : [{
                            xtype : 'textfield',
                            fieldLabel : '标题',
                            id : 'exp_title',
                            name : 'exp_title',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '内容',
                            id : 'exp_detail',
                            name : 'exp_detail',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textarea',
                            fieldLabel : '备注',
                            id : 'exp_remark',
                            name : 'exp_remark',
                            width : 400,
                            height : 80,
                            allowBlank : true
                        }]
            })

    // 经验分享新增窗口
    var expWindow = new Ext.Window({
                id : 'expWindow',
                layout : "fit",
                title : '经验分享',
                width : 600,
                height : 200,
                resizable : false,
                draggable : true,
                closeAction : 'hide',
                modal : true,
                collapsible : true,
                titleCollapse : true,
                maximizable : false,
                buttonAlign : 'right',
                border : false,
                animCollapse : true,
                animateTarget : Ext.getBody(),
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                constrain : true,
                padding : '5,5,5,5',
                items : [expForm],
                bbar : ['->', {
                    id : 'saveButton_qa',
                    xtype : 'button',
                    text : '保存',
                    handler : function() {
                        var title = Ext.getCmp('exp_title').getValue();
                        var detail = Ext.getCmp('exp_detail').getValue();
                        var remark = Ext.getCmp('exp_remark').getValue();
                        if (Ext.isEmpty(title)) {
                            Ext.Msg.alert("提示信息", "请填写标题");
                            return;
                        }
                        if (Ext.isEmpty(detail)) {
                            Ext.Msg.alert("提示信息", "请填写内容");
                            return;
                        }
                        Ext.Ajax.request({
                                    url : './qaInfo.ered?reqCode=addQAInfo',
                                    success : function(value) {
                                        var result = Ext.util.JSON
                                                .decode(value.responseText);
                                        if (result.success) {
                                            Ext.Msg.alert("提示信息", "保存成功");
                                            Ext.getCmp('expWindow').hide();
                                            expStore.reload();
                                            expform.reset();
                                        } else {
                                            Ext.Msg.alert("提示信息", "保存失败");
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert("提示信息", "保存失败");
                                    },
                                    params : {
                                        info_title : title,
                                        info_detail : detail,
                                        remark : remark,
                                        info_type : info_type
                                    }
                                })
                    }
                }, {
                    id : 'consoleButton_exp',
                    xtype : 'button',
                    text : '关闭',
                    handler : function() {
                        Ext.getCmp('exp_title').setValue("");
                        Ext.getCmp('exp_detail').setValue("");
                        Ext.getCmp('exp_remark').setValue("");
                        Ext.getCmp('expWindow').hide();
                    }
                }]
            })

    var expGrid = new Ext.grid.GridPanel({
                title : '经验分享',
                region : 'center',
                store : expStore,
                stripeRows : true,
                frame : true,
                overflow : 'auto',
                cm : expcm,
                sm : expsm,
                tbar : [{
                            xtype : 'button',
                            text : '增加',
                            iconCls : 'page_addIcon',
                            handler : function() {
                                mode = 'add';
                                expWindow.show();
                            }
                        }, '-', {
                            xtype : 'button',
                            text : '修改',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                var record = expGrid.getSelectionModel().getSelected();
                                if (Ext.isEmpty(record)) {
                                    Ext.Msg.alert('提示', '请选择一行有效记录！');
                                    return;
                                }
                                detail_info();
                            }
                        }, '-', {
                            xtype : 'button',
                            text : '删除',
                            iconCls : 'deleteIcon',
                            handler : function() {
                                deleteQaInfo();
                            }
                        }

                ],
                bbar : exp_bbar
            })
    // -----------------------------经验分享窗体结束
    // 信息详细窗口
    var detailWindow = new Ext.Window({
                id : 'detailWindow',
                layout : "fit",
                title : '',
                width : 680,
                height : 480,
                resizable : false,
                draggable : true,
                closeAction : 'hide',
                modal : true,
                collapsible : true,
                titleCollapse : true,
                maximizable : false,

                border : false,
                animCollapse : true,
                animateTarget : Ext.getBody(),
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                constrain : true,
                padding : '5,5,5,5',
                items : [new Ext.form.FormPanel({
                            labelAlign : 'right',
                            height : 450,
                            padding : '5,5,5,5',
                            defaults : {
                                bodyStyle : 'padding-top:5'
                            },
                            items : [{
                                        xtype : 'textfield',
                                        id : 'seq_no',
                                        hidden:true
                                    }, {
                                        xtype : 'textfield',
                                        style:'font-size:20px',
                                        fieldLabel : '标题',
                                        id : 'title',
                                        width : 500,
                                        height : 30
                                    }, {
                                        xtype : 'textarea',
                                        fieldLabel : '内容',
                                        id : 'detail',
                                        style:'font-size:20px',
                                        width : 500,
                                        height : 280
                                    }, {
                                        xtype : 'textarea',
                                        style:'font-size:20px',
                                        fieldLabel : '备注',
                                        id : 'remark',
                                        width : 500,
                                        height : 60
                                    }]
                        })],
                buttons : [{
                            id : 'enditBtn',
                            text : '修改',
                            iconCls : 'page_edit_1Icon',
                            handler : function() {
                                var seq_no= Ext.getCmp('seq_no').getValue();
                                var title = Ext.getCmp('title').getValue();
                                var detail = Ext.getCmp('detail').getValue();
                                var remark = Ext.getCmp('remark').getValue();
                                if (Ext.isEmpty(title)) {
                                    Ext.Msg.alert("提示信息", "请填写标题");
                                    return;
                                }
                                if (Ext.isEmpty(detail)) {
                                    Ext.Msg.alert("提示信息", "请填写内容");
                                    return;
                                }
                                Ext.Ajax.request({
                                            url : './qaInfo.ered?reqCode=editQAInfo',
                                            success : function(value) {
                                                var result = Ext.util.JSON
                                                        .decode(value.responseText);
                                                if (result.success) {
                                                    Ext.Msg.alert("提示信息", "修改成功");
                                                    expStore.reload();
                                                    qaStore.reload();
                                                    sysStore.reload();
                                                    Ext.getCmp('seq_no').setValue('');
                                                    Ext.getCmp('title').setValue('');
                                                    Ext.getCmp('detail').setValue('');
                                                    Ext.getCmp('remark').setValue('');
                                                    Ext.getCmp('detailWindow').hide();
                                                } 
                                            },
                                            failure : function() {
                                                Ext.Msg.alert("提示信息", "保存失败");
                                            },
                                            params : {
                                                seq_no:seq_no,
                                                info_title : title,
                                                info_detail : detail,
                                                remark : remark,
                                                info_type : info_type
                                            }
                                        })
                            
                                
                            }},'-',
                                {
                            id : 'consoleButton_sys',
                            text : '关闭',
                            handler : function() {
                                Ext.getCmp('title').setValue("");
                                Ext.getCmp('detail').setValue("");
                                Ext.getCmp('remark').setValue("");
                                Ext.getCmp('detailWindow').hide();
                            }
                        }]
            })

    // 增加gird listeners double click function
    qaGrid.addListener('rowdblclick', detail_info);
    sysGrid.addListener('rowdblclick', detail_info);
    expGrid.addListener('rowdblclick', detail_info);
    // 详细信息窗口
    function detail_info(rowindex, e) {
        var grid;
        var record;
        switch (info_type) {
            case "3" :
                detailWindow.setTitle('经验分享');
                grid = expGrid;
                break;
            case "4" :
                detailWindow.setTitle('系统帮助');
                grid = qaGrid;
                break;
            case "5" :
                detailWindow.setTitle('系统公告');
                grid = sysGrid;
                break;
        }
        grid.getSelectionModel().each(function(rec) {
                    record = rec;
                });
        detailWindow.show();
        // 初始化
        Ext.getCmp('seq_no').setValue(record.get('seq_no'));
        Ext.getCmp('title').setValue(record.get('info_title'));
        Ext.getCmp('detail').setValue(record.get('info_detail'));
        Ext.getCmp('remark').setValue(record.get('remark'));
    }
    
    // 业务员登录情况
    /**
     * @author zhouweiwei
     * @since 2014.11.14
     * 业务员登录情况查询
     * 功能 : 
     * 1)一周内(按照7天判断或者按照自然周判断(可能不满7天))
     * 2)按照月
     * 3)有次数条件
     * 4)可以指定查询的日期
     * 5)指定登录操作人员
     * 6)指定人员操作时间    
     */
    // Store
    var accountLoginStore = new Ext.data.Store({
       proxy : new Ext.data.HttpProxy({
           url : './sessionManage.ered?reqCode=queryAccountLogin'
       }),
       reader : new Ext.data.JsonReader({
                totalProperty : 'TOTALCOUNT',
                root : 'ROOT'
            }, ['seq_no', 'opr_date', 'logintime', 'account',
                    'user_name', 'count'])
    })
    
    //Toolbar
    var accountLogin_tbar = new Ext.Toolbar({
        items : ['工号:',{
            xtype : 'textfield',
            id : 'al_tbar_account'
        },'姓名:',{
            xtype : 'textfield',
            id : 'al_tbar_username'
        },'开始日期:',{
            xtype : 'datefield',
            id : 'al_tbar_startdate',
            width : 140,
            value : new Date().add(Date.DAY,-6),
            format : 'Y-m-d',
            editable : true
        },'-','结束日期:',{
            xtype : 'datefield',
            id : 'al_tbar_enddate',
            width : 140,
            value : new Date(),
            format : 'Y-m-d',
            editable : true
        }
        ]
    })
    
    var accountLogin_tbar2 = new Ext.Toolbar({
        items : ['-',{
            text : '查询登录情况',
            iconCls : 'page_findIcon',
            handler : function(){
                queryLoginAccount();
            }
        },{
            text : '查询未登录情况',
            iconCls : 'page_findIcon',
            handler : function(){
                queryUnLoginAccount();
            }
        },{
            text : '导出登陆信息',
            iconCls : 'page_excelIcon',
            handler : function() {
              var url='./sessionManage.ered?reqCode=exportAllAccountLogin'
              		  +'&startdate='+Ext.getCmp('al_tbar_startdate').value
              		  +'&enddate='+Ext.getCmp('al_tbar_enddate').value;
              exportExcel(url);
             }
            }]
    })
    
    //cm
    var accountLogin_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),{
        header : '序号',
        hidden : true,
        dataIndex : 'seq_no'
    },{
        header : '工号',
        dataIndex : 'account'
    },{
        header : '姓名',
        dataIndex : 'user_name'
    },{
        header : '登录日期',
        dataIndex : 'opr_date'
    },{
        header : '登录次数',
        dataIndex : 'count'
    },{
        header : '总计时间(分)',
        dataIndex : 'logintime'
    }])
    
    // page
     var accountLogin_combo = new Ext.form.ComboBox({
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
    accountLogin_combo.on("select", function (comboBox) {
        accountLogin_bbar.pageSize = parseInt(comboBox.getValue());
        loadStore4alStore();
    });
    
    var accountLogin_bbar = new Ext.PagingToolbar({
        pageSize: 50,
        store: accountLoginStore,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', accountLogin_combo]
    });
    
    // Panel
    var accountLoginPanel = new Ext.grid.GridPanel({
        autoScroll: true,
       region: 'center',
       title: '业务人员登录信息',
       loadMask: {
           msg: '正在加载表格数据,请稍等...'
       },
       stripeRows: true,
       id : 'accountLoginPanel',
       store : accountLoginStore,
       tbar : accountLogin_tbar,
       bbar : accountLogin_bbar,
       cm : accountLogin_cm,
       listeners : {
            render : function() {
                accountLogin_tbar2.render(this.tbar);
            }
        }
    })
    // 订单反馈
    var orderFBPanel = new Ext.form.FormPanel({
        title : '订单反馈',
        frame : true,
        bodyStyle :'left :30%',
        labelAlign : 'right',
        items : [{
            xtype : 'textfield',
            id : 'fb_orderNo',
            fieldLabel : 'PO#'            
        },{
            xtype : 'label',
            fieldLabel : '或'
        },{
            xtype : 'textfield',
            id : 'fb_styleNo',
            fieldLabel : '款号'
        },{
            xtype : 'textfield',
            id : 'fb_ribbon_color',
            fieldLabel : '丝带色号'
        },{
            layout : 'column',
            items :[{
                layout : 'form',
                columnWidth : .1,
                bodyStyle  : 'width : 100%;',
                items :[{
                    xtype : 'button',
                    width : '100%',
                    text : '提交',
                    handler : function(){
                        submitFbInfo();
                    }
                }]
            },{
                layout : 'form',
                columnWidth : .1,
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '重置',
                    handler : function(){
                        initFbInfo();
                    }
                }]
            }]
        }]
    })
    /**
     * 提交反馈信息
     */
    function submitFbInfo(){
        var orderNo = Ext.getCmp('fb_orderNo').getValue();
        var styleNo = Ext.getCmp('fb_styleNo').getValue();
        var ribbon_color = Ext.getCmp('fb_ribbon_color').getValue();
        if(Ext.isEmpty(orderNo) && (Ext.isEmpty(styleNo) || Ext.isEmpty(ribbon_color) )){
            Ext.Msg.alert('提示','请输入订单号(PO#) 或者 款号和丝带色号');
            return;
        }
        Ext.Ajax.request({
            url : './orderFeedback.ered?reqCode=saveFeedbackInfo',
            success : function(response) { // 回调函数有1个参数
                var resultMsg = Ext.util.JSON
                        .decode(response.responseText);
                if(resultMsg.success){
                    Ext.Msg.alert('提示','订单信息反馈成功');
                    initFbInfo();
                }else {
                    Ext.Msg.alert('提示','订单信息反馈出现错误')
                }
            },
            failure : function(response) {
                Ext.Msg.alert('提交失败');
            },
            params : {
                order_id : orderNo,
                style_no : styleNo,
                ribbon_color : ribbon_color
            }
        })
    }
    
    /**
     * 重置反馈信息
     */
    function initFbInfo(){
        Ext.getCmp('fb_orderNo').setValue('');
        Ext.getCmp('fb_styleNo').setValue('');
        Ext.getCmp('fb_ribbon_color').setValue('');
    }
    /**
     * 查询登录人员信息
     */
    function queryLoginAccount(){
       loadStore4alStore(addQueryParams());    //加载数据信息
    }
    
    /**
     * 查询未登录人员信息
     */
    function queryUnLoginAccount(){
        // 添加查询未登录情况的标识
       var unlogin = {
              loginFlag : 1
       }
       loadStore4alStore(addQueryParams(unlogin));
    }
    /**
     * 添加查询条件
     */
    function addQueryParams(params){
        params = params || {};
        params.account = Ext.getCmp('al_tbar_account').getValue();
        params.user_name = Ext.getCmp('al_tbar_username').getValue();
        params.startdate = Ext.getCmp('al_tbar_startdate').value;
        params.enddate = Ext.getCmp('al_tbar_enddate').value;
        return params;
    }
    // 查询
      var old_params = {};   //保存首次查询的参数
     function loadStore4alStore(/**传入特定参数*/params){
        //保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        
        // 添加分页参数
        params.start = 0;
        params.limit = accountLogin_bbar.pageSize;
        
        //加载数据
        accountLoginStore.baseParams = params;   // 查询条件赋值给store 在翻页查询中使用
        accountLoginStore.load({
            params: params
        });
    }
    
    //~~ 业务员登录情况结束
    
    
    
    
    
    
    var wdgztTab = new Ext.TabPanel({
        id : 'wdgztTab',
        region : 'center',
        // layout: 'fit',
        border : true,
        margins : '1 1 1 1',
        collapsed : false,
        deferredRender : false,
        layoutOnTabChange : true,
        activeTab : 0,
        autoScroll : true,
        listeners : {
            tabchange : function(tp, p) {
                if (p.title == '问题解决方案') {
                    qaStore.load();
                    info_type = "4";
                }
                if (p.title == '<span style="font-weight:normal">标准文件管理</span>') {
                    fileStore.load();
                    info_type = "0";
                }
                if (p.title == '系统公告') {
                    sysStore.load();
                    info_type = "5";
                }
                if (p.title == '经验分享') {
                    expStore.load();
                    info_type = "3";
                }
            }
        },
        items : [filePanel,sysGrid,   expGrid, qaGrid,ordInfoPanel,accountLoginPanel, orderFBPanel]
    });

    var panel = new Ext.Panel({
                id : 'cPanel',
                renderTo : 'qsInfoDiv',
                region : 'center',
                autoScroll : true,
                layout : 'fit',
                bodyStyle : 'height:100%',
                title : '',
                items : [wdgztTab]
            })
    /**
     * 调整组件界面大小
     */
    function reSize() {
        var cPanel = Ext.getCmp('cPanel');
        var tabPanel = Ext.getCmp('wdgztTab');
        tabPanel.setHeight(cPanel.getHeight());
        tabPanel.setWidth(cPanel.getWidth());
    }
    //监听窗口大小调整事件
    Ext.EventManager.onWindowResize(function() {
        //需要延时处理 否则获取不到窗口大小
        reSize();
        })

})

