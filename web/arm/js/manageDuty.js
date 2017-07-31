Ext.onReady(function() {
    var check_duty_id,check_deptperm,updateFlag,check_duty_name;

	var re = '<span style="color:red">*</span>'
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
            header : '职务编号',
            dataIndex : 'duty_id',
            hidden : true,
            width : 80,
            align : 'center',
            sortable : true
        }, {
            header : '职务名称',
            dataIndex : 'duty_name',
            align : 'center',
            width : 180
        }, {
            header : '工资类型',
            width : 80,
            align : 'center',
            dataIndex : 'remark',
            renderer : function(value) {
                if (value == '0') {
                    return '计件工资';
                }
                if (value == '1') {
                    return '计时工资';
                }
                if(value=='2')
                {
                    return '管理层工资'
                }
            }
        }, {
            header : '是否具有查询本部门权限',
            dataIndex : 'deptperm',
            align : 'center',
            width : 180,
            renderer : function(value) {
                if (value == '0') {
                    return '否';
                }
                if (value == '1') {
                    return '是';
                }
            }
        }]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './duty.ered?reqCode=queryDutyList'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'duty_id'
								}, {
									name : 'duty_name'
								}, {
									name : 'remark'
								}, {
                                    name : 'deptperm'
                                }])
			});

	var pagesize_combo = new Ext.form.ComboBox({
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
				value : '20',
				editable : false,
				width : 85
			});
	var number = parseInt(pagesize_combo.getValue());
	pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				number = parseInt(comboBox.getValue());
				store.reload({
							params : {
								start : 0,
								limit : bbar.pageSize
							}
						});
			});

	var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});

	var grid = new Ext.grid.GridPanel({
		title : '<img src="./resource/image/ext/config.png" align="top" class="IEPNG"><span style="font-weight:normal">职务信息维护</span>',
		renderTo : 'dutyGridDiv',
		height : 200,
		autoScroll : false,
		region : 'center',
		store : store,
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		},
		stripeRows : true,
		frame : true,
		cm : cm,
		sm : sm,
		tbar : [{
					text : '新增',
					id : 'new_button',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					id : 'modify_button',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					id : 'delete_button',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteDutyItems();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'page_refreshIcon',
					handler : function() {
						queryDutyItem();
					}
				},'->',{
                    text : '权限同步',
                    iconCls : 'page_refreshIcon',
                    handler : function() {
                        var rows = grid.getSelectionModel().getSelections();
                        updateFlag='0';
                        if (rows.length>1) {
                            Ext.Msg.alert('提示', '只能同步一条记录!');
                            return;
                        }
                        var record = grid.getSelectionModel().getSelected();
                        if(Ext.isEmpty(record)){
                            Ext.Msg.alert('提示', '请先选中一条记录!');
                            return;
                        }
                        win.show();
                        check_duty_id = record.get('duty_id');
                        check_duty_name = record.get('duty_name');
                        check_deptperm = record.get('deptperm');

                    }
                }],
		bbar : bbar
	});

    //权限同步确认窗口
    var win = new Ext.Window({
        layout : 'fit',
        width : 320,
        height : 140,
        resizable : true,
        draggable : true,
        closeAction : 'hide',
        pageY : 100,
        pageX : document.body.clientWidth/ 2 - 200 / 2,
        title : '权限同步请确认!',
        buttonAlign : 'right',
        border : false,
        animateTarget : Ext.getBody(),
        items : [{
            id:'winHtml',
            html :''
        }],
        buttons : [{
            text : '全部同步',
            iconCls : 'acceptIcon',
            handler : function() {
                var flag ='1';
                updateUserPerm4DutyUpdate(flag);
            }
        },{
            text : '部分同步',
            iconCls : 'acceptIcon',
            handler : function() {
                var flag ='0';
                updateUserPerm4DutyUpdate(flag);
            }
        }, {
            text : '放弃同步',
            iconCls : 'deleteIcon',
            handler : function() {
                win.hide();
                if(updateFlag=='1'){
                    store.reload();
                    addParamFormPanel.getForm().reset();
                    Ext.MessageBox.alert('提示', '职务修改成功!');
                }
            }
        }]
    });

    win.on('show',function(){
        var str = '<div style="color:red;padding:10 5 0;">' +
            '全部同步:将同步所有职务为"'+check_duty_name+'"的人员</br>' +
            '部分同步:将不同步"'+check_duty_name+'"部分已经分配特殊权限的人员</br>' +
            '放弃同步:将不进行数据权限同步</div>';
        Ext.getCmp('winHtml').update(str);
    })
    function updateUserPerm4DutyUpdate(flag,record){
        Ext.Ajax.request({
            url : './duty.ered?reqCode=updateUserPerm4DutyUpdate',
            waitTitle : '提示',
            method : 'POST',
            waitMsg : '正在处理数据,请稍候...',
            success : function(response) {
                if(updateFlag=='1'){
                    store.reload();
                    addParamFormPanel.getForm().reset();
                    Ext.MessageBox.alert('提示', '职务修改成功!');
                }else{
                    var resultArray = Ext.util.JSON.decode(response.responseText);
                    Ext.Msg.alert('提示', resultArray.msg);
                }
                win.hide();
            },
            failure : function(response) {
                if(updateFlag=='1'){
                    store.reload();
                    addParamFormPanel.getForm().reset();
                    Ext.MessageBox.alert('提示', '职务修改失败!');
                }else{
                    var resultArray = Ext.util.JSON.decode(response.responseText);
                    Ext.Msg.alert('提示', "更新权限失败!");
                }
            },
            params:{
                flag:flag,
                duty_id:check_duty_id,
                deptperm:check_deptperm
            }
        });
    }
	store.load({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});
	grid.on('rowdblclick', function(grid, rowIndex, event) {
				editInit();
			});

    var addParamFormPanel = new Ext.form.FormPanel({
        id: 'addParamFormPanel',
        name: 'addParamFormPanel',
        defaultType: 'textfield',
        labelAlign: 'right',
        labelWidth: 70,
        frame: true,
        items: [
            {
                fieldLabel: '职务名称' + re,
                name: 'duty_name',
                id: 'duty_name',
                allowBlank: false,
                xtype: 'textfield',
                anchor: '99%'
            },
            {
                xtype: 'combo',
                name: 'remark',
                anchor: '99%',
                hiddenName: 'remark',
                fieldLabel: '工资类型' + re,
                emptyText: '请选择',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                mode: 'local',
                allowBlank: false,
                readonly: true,
                store: new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [
                        ['0', '计件工资'],
                        ['1', '计时工资'],
                        ['2', '管理层工资']
                    ]
                })

            },
            {
                xtype: 'checkbox',
                fieldLabel: '',
                inputValue: '1',
                id: 'deptperm',
                name: 'deptperm',
                boxLabel: '具有查看本部门权限'
            },
            /* {
             fieldLabel : '备注',
             name : 'remark',
             xtype : 'textarea',
             allowBlank : true,
             anchor : '99%'
             },*/ {
                id: 'duty_id',
                name: 'duty_id',
                hidden: true
            },
            {
                id: 'windowmode',
                name: 'windowmode',
                hidden: true
            },
            {
                name: 'old_duty_name',
                id: 'old_duty_name',
                hidden: true
            }
        ]
    });

    var addParamWindow = new Ext.Window({
        layout: 'fit',
        width: 250,
        height: 180,
        resizable: false,
        draggable: true,
        closeAction: 'hide',
        title: '新增职务信息',
        iconCls: 'page_addIcon',
        modal: false,
        collapsible: true,
        titleCollapse: true,
        maximizable: false,
        buttonAlign: 'right',
        border: false,
        animCollapse: true,
        pageY: 20,
        pageX: document.body.clientWidth / 2 - 420 / 2,
        animateTarget: Ext.getBody(),
        constrain: true,
        items: [addParamFormPanel],
        buttons: [
            {
                text: '保存',
                iconCls: 'acceptIcon',
                handler: function () {
                    var mode = Ext.getCmp('windowmode').getValue();
                    if (mode == 'edit') {
                        updateParamItem();
                    } else {
                        saveParamItem();
                    }

                }
            },
            {
                text: '重置',
                id: 'btnReset',
                iconCls: 'tbar_synchronizeIcon',
                hidde: true,
                handler: function () {
                    clearForm(addParamFormPanel.getForm());
                }
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                handler: function () {
                    addParamWindow.hide();
                }
            }
        ]
    });

    /**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	function queryDutyItem() {
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize
						
					}
				});
	}

	/**
	 * 新增参数初始化
	 */
	function addInit() {
		var flag = Ext.getCmp('windowmode').getValue();
		if (typeof(flag) != 'undefined') {
			addParamFormPanel.form.getEl().dom.reset();
		} else {
			clearForm(addParamFormPanel.getForm());
		}
		addParamWindow.show();
		addParamWindow.setTitle('新增职务<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('windowmode').setValue('add');
		Ext.getCmp('btnReset').show();
	}

	/**
	 * 保存职务数据
	 */
	function saveParamItem() {
		if (!addParamFormPanel.form.isValid()) {
			return;
		}
		addParamFormPanel.form.submit({
					url : './duty.ered?reqCode=saveDutyItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addParamWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示',  msg);
						clearForm(addParamFormPanel.getForm());
					}
				});
	}

	/**
	 * 删除职务
	 */
	function deleteDutyItems() {
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'duty_id');
		Ext.Msg.confirm('请确认', '确认删除选中的职务信息吗?', function(btn, text) {
					if (btn == 'yes') {
						if (runMode == '0') {
							Ext.Msg.alert('提示',
									'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
							return;
						}
						showWaitMsg();
						Ext.Ajax.request({
									url : './duty.ered?reqCode=deleteDutyItems',
									success : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										store.reload();
										Ext.Msg.alert('提示', resultArray.msg);
									},
									failure : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										Ext.Msg.alert('提示', resultArray.msg);
									},
									params : {
										strChecked : strChecked
									}
								});
					}
				});
	}

	/**
	 * 修改职务信息初始化
	 */
	function editInit() {
		var record = grid.getSelectionModel().getSelected();
		var recs = grid.getSelectionModel().getSelections()
		if (recs.length > 1 || Ext.isEmpty(record)) {
			Ext.MessageBox.show({
						title : '警告',
						msg : "请选择一条记录..",
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
			return;
		}
		addParamFormPanel.getForm().loadRecord(record);
		addParamWindow.show();
		addParamWindow.setTitle('修改职务信息<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('windowmode').setValue('edit');
		Ext.getCmp('duty_id').setValue(record.get('duty_id'));
		Ext.getCmp('old_duty_name').setValue(record.get('duty_name'));
		Ext.getCmp('btnReset').hide();
	}

	/**
	 * 修改职务信息
	 */
	function updateParamItem() {
		if (!addParamFormPanel.form.isValid()) {
			return;
		}
		update();
	}

	/**
	 * 更新
	 */
	function update() {
        check_duty_id = Ext.getCmp('duty_id').getValue();
        check_duty_name = Ext.getCmp('duty_name').getValue();
        var deptperm = Ext.getCmp('deptperm').getValue();
        if(deptperm){
            check_deptperm='1';
        }else{
            check_deptperm='0';
        }

		addParamFormPanel.form.submit({
					url : './duty.ered?reqCode=updateDutyItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addParamWindow.hide();
                        updateFlag='1';
                        win.show();
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示',  msg);
					}
				});
	}
});