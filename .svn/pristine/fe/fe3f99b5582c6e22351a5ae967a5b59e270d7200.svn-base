/************************************************
 * 创建日期: 2013-05-28
 * 创建作者：may|tangfh
 * 功能：用户管理(操作员管理)
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var dept_id, managedeptid;// 初始化-0

	var mode ;
	var showCount = 0, user_id;
	var re = '<span style="color:red">*</span>';

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
		Ext.getCmp('queryParam').setValue('');
		dept_id = node.attributes.id;
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				dept_id: dept_id
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
	var validateAccStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './sysUser.ered?reqCode=validateAcc' // 后台请求地址
		}),
		reader: new Ext.data.JsonReader({}, [
			{ // 定义后台返回数据格式
				name: 'cnt' // 数量
			}
		])
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
		header: '操作员编号',
		dataIndex: 'account',
		align: 'center',
		width: 80
	}, {
		header: '操作员姓名',
		dataIndex: 'user_name',
		align: 'center',
		width: 80
	}, {
		header: '角色信息',
		dataIndex: 'role_name',
		align: 'center',
		width: 110
	}, {
		header: '部门',
		align: 'left',
		dataIndex: 'dept_name',
		width: 200
	}, {
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
	},  {
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
		header: '所属部门编号',
		dataIndex: 'dept_id',
		hidden: true
	}, {
		dataIndex: 'duty',
		hidden: true
	}, {
		dataIndex: 'bank_no',
		hidden: true
	}, {
		dataIndex: 'grp_id',
		hidden: true
	}, {
		dataIndex: 'role_id',
		hidden: true
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './sysUser.ered?reqCode=queryUsersForManage'
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
				name: 'tmp_crd'
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
				name: 'role_id'
			},
			{
				name: 'role_name'
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
		//frame: true,
        border : false,
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
				text: '角色删除',
				iconCls: 'page_delIcon',
				hidde: true,
				handler: function () {
					var record = grid.getSelectionModel().getSelected();
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请选择用户数据!');
						return;
					}
					if (Ext.isEmpty(record.get('role_id'))) {
						Ext.Msg.alert('提示', '该用户没有对应角色权限信息!');
						return;
					}

					Ext.Msg.confirm('确认', "确认删除该用户角色权限信息吗?", function (btn, text) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url: './sysUser.ered?reqCode=delSysUserRoleMap',
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
									user_id: record.get('user_id')
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
				text: '绑定EPC',
				iconCls: 'acceptIcon',
				handler: function () {
					var record = grid.getSelectionModel().getSelected();
					if(Ext.isEmpty(record)){
						Ext.Msg.alert('提示','请选择人员记录!');
						return;
					}
					writeCrdForm.getForm().loadRecord(record);
					writeCrdWindow.show();
				}
			},'-',
			{
				text: '导入权限',
				iconCls: 'page_excelIcon',
				xtype:'button',
				handler: function () {
					importrolewindow.show();
				}
			},
			'->',
			new Ext.form.TextField({
				id: 'per_no',
				name: 'per_no',
				emptyText: '操作员编号',
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
			limit: bbar.pageSize
		}
	});

	store.on('beforeload', function () {
		this.baseParams = {
			dept_id: dept_id
		};
	});

	grid.on('rowdblclick', function (grid, rowIndex, event) {
		editInit();
	});
	grid.on('sortchange', function () {
		grid.getSelectionModel().selectFirstRow();
	});

	var addRoot = new Ext.tree.AsyncTreeNode({
		text: root_deptname,
		expanded: true,
		iconCls: 'folder_userIcon',
		id: root_deptid
	});
	var addDeptTree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			baseAttrs: {},
			dataUrl: './sysUser.ered?reqCode=departmentTreeInit'
		}),
		root: addRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false
	});

	// 监听下拉树的节点单击事件
	addDeptTree.on('click', function (node) {
		comboxWithTree.setValue(node.text);
		addUserFormPanel.findById('dept_id').setValue(node.attributes.id);
		comboxWithTree.collapse();
	});

	var comboxWithTree = new Ext.form.ComboBox({
		id: 'dept_name',
		store: new Ext.data.SimpleStore({
			fields: [],
			data: [
				[]
			]
		}),
		editable: false,
		value: ' ',
		emptyText: '请选择...',
		fieldLabel: '部门' + re,
		anchor: '95%',
		mode: 'local',
		allowBlank: false,
		triggerAction: 'all',
		maxHeight: 390,
		// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
		tpl: "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
		onSelect: Ext.emptyFn
	});
	// 监听下拉框的下拉展开事件
	comboxWithTree.on('expand', function () {
		// 将UI树挂到treeDiv容器
		addDeptTree.render('addDeptTreeDiv');
		addDeptTree.root.reload(); // 每次下拉都会加载数
	});

	var sexStore = new Ext.data.SimpleStore({
		fields: ['value', 'text'],
		data: [
			['1', '男'],
			['2', '女']
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

	var stateStore = new Ext.data.SimpleStore({
		fields: ['value', 'text'],
		data: [
			['0', '启用'],
			['1', '停用']
		]
	});
	var stateCombo = new Ext.form.ComboBox({
		name: 'state',
		hiddenName: 'state',
		store: stateStore,
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

	// 角色下拉框
	var roleStore = new Ext.data.Store({
		autoLoad: true,
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
		]),
		baseParams: {
			roletype: '4'
		}
	});
	roleStore.load();

	var roleCombo = new Ext.form.ComboBox({
		name: 'role_id',
		hiddenName: 'role_id',
		store: roleStore,
		mode: 'local',
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
								fieldLabel: '操作员编号' + re,
								regex: /^[A-Za-z0-9]+$/,
								regexText: '操作员编号只能为数字或字母',
								maxLength: 20, // 可输入的最大文本长度,不区分中英文字符
								name: 'account',
								id: 'account',
								allowBlank: false,
								anchor: '95%' // 根据窗口，自动调整文本框的宽度
							},
							comboxWithTree,
							roleCombo,
							sexCombo,
							{
								xtype: 'datefield',
								name: 'birthday', // name:后台根据此name属性取值
								id: 'birthday', // name:后台根据此name属性取值
								format: 'Y-m-d', // 日期格式化
								hidden: true,
								anchor: '95%' // 宽度百
							},
							{
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
								fieldLabel: '操作员姓名' + re,
								name: 'user_name',
								id: 'user_name',
								allowBlank: false, // 是否允许为空
								anchor: '95%'
							},
							{
								fieldLabel: '密   码' + re,
								name: 'password',
								id: 'newpwd',
								inputType : 'password',
								allowBlank: false,
								regex: /^[A-Za-z0-9]+$/,
								regexText: "密码只能为数字或字符",
								anchor: '95%'
							},
							stateCombo,
							{
								fieldLabel: '手机号码',
								name: 'mbl_no',
								allowBlank: true,
								id: 'mbl_no',
								anchor: '95%'
							},
							{
								regex: /^\d{3}-\d{8}|\d{4}-\d{7}/,
								regexText: "固定电话格式不合法！格式:0000-0000000",
								name: 'tel_no',
								hidden: true,
								id: 'tel_no',
								allowBlank: true,
								anchor: '95%'
							},
							{
								name: 'user_type',
								id: 'user_type',
								hidden: true
							},
							{
								id: 'user_id',
								name: 'user_id',
								hidden: true
							},
							{
								id: 'role_id_old',
								name: 'role_id_old',
								hidden: true
							},
							{
								id: 'dept_id',
								name: 'dept_id',
								hidden: true
							},
							{
								id: 'dept_id_old',
								name: 'dept_id_old',
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
		title: '新增操作员(*为必填项)',
		iconCls: 'page_addIcon',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false, // 窗口最大化
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [addUserFormPanel],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					if (mode == 'add')
						saveUserItem();
					if (mode == 'edit')
						updateUserItem();

				}
			},
			{
				text: '重置',
				id: 'btnReset',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearFormPanel(addUserFormPanel);
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
	var writeCrdForm = new Ext.form.FormPanel({
		collapsible: false,
		border: true,
		labelWidth: 70, // 标签宽度
		labelAlign: 'left', // 标签对齐方式
		bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign: 'center',
		items: [
			{
				fieldLabel: "标签编号",
				name: "epc",
				id: 'epc',
				allowBlank: false, // 是否允许为空
				xtype: "textfield",
				readOnly:true,
				anchor: '99%',
				fieldClass: 'x-custom-field-disabled'
			},{
				name: "user_id",
				hidden:true,
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
		items: [writeCrdForm], // 嵌入的表单面板
		buttons: [
			{
				text: '读卡并确认关联',
				iconCls: 'acceptIcon',
				handler: function () {
					var rfid = ReadEpcCode();
					if (rfid.state != '0') {
						Ext.Msg.alert('提示', rfid.returnCode);
						return;
					}
					Ext.getCmp('epc').setValue(rfid.returnCode);

					writeCrdForm.getForm().submit({
						url: './sysUser.ered?reqCode=bindEpc4User',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) { // 回调函数有2个参数
							Ext.Msg.alert("提示", action.result.msg);
							store.reload();
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
					writeCrdForm.getForm().reset();
					writeCrdWindow.hide();
					store.reload();
				}
			}
		]
	});

	//导入权限excel 1.8xtj
	var importformpanel = new Ext.form.FormPanel({
		id: 'importformpanel',
		name: 'importformpanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 105,
		width: 280,
		height: 220,
		frame: true,
		fileUpload: true,
		items: [
			{
				fieldLabel: '导入文件(Excel)',
				name: 'theFile',
				id: 'theFile',
				inputType: 'file',
				allowBlank: false,
				blankText: "请选择导入文件",
				anchor: '94%'
			},
			{
				xtype: "label",
				labelStyle: 'color:red;width=60px;',
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/ordDayList.xlsx' target='_blank'>Excel模板文件</a></SPAN>",
				anchor: '99%'
			}
		]
	});

	var importrolewindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 200,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '导入Excel',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [importformpanel],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('theFile').getValue();
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls" &&
						theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}

					importformpanel.getForm().submit({
						url: 'sysUser.ered?reqCode=importRoleList',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							importrolewindow.hide();
							clearFormPanel(importformpanel);
							Ext.Msg.alert('提示', action.result.msg);
						},
						failure: function (form, action) {
							Ext.Msg.alert('提示', action.result.msg);
						}
					});
				}
			},
			{
				text: '关闭',
				id: 'btnReset',
				iconCls: 'deleteIcon',
				handler: function () {
					importrolewindow.hide();
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
                margins : '3 0 3 3',
				autoScroll: true,
				items: [ deptTree ]
			},
			{
				region: 'center',
				layout: 'fit',
                margins : '3 3 3 0',
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
				queryParam: Ext.getCmp('queryParam').getValue(),
				per_no: Ext.getCmp('per_no').getValue()
			}
		});
	}

	function randomPwd() {
		Ext.getCmp('newpwd').setValue('');
		pwdStore.load();
	}

	pwdStore.on('load', function (obj) {
		if (obj != null) {
			Ext.getCmp('newpwd').setValue(obj.getAt(0).get('newpassword'));
		}
	});

	/**
	 * 新增人员初始化
	 */
	function addInit() {
		clearFormPanel(addUserFormPanel);

		addUserWindow.setTitle('新增人员<span style="color:Red">(*为必填项)</span>');
		addUserWindow.show();

		// 为下拉框赋初始值
		stateCombo.setValue('0');
		sexCombo.setValue('1');
		Ext.getCmp('account').setReadOnly(false);
		Ext.getCmp('btnReset').show();

		mode= 'add';
	}

	/**
	 * 保存人员数据
	 */
	function saveUserItem() {
		if (!addUserFormPanel.form.isValid()) {
			return;
		}

		var msg = '<span style="color:red">确认保存所添加的企业操作员信息吗?</span>'
		Ext.Msg.confirm('确认', msg, function (btn, text) {
			if (btn == 'yes') {
				addUserFormPanel.getForm().submit({
					url: './sysUser.ered?reqCode=saveUserItem',
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
					}
				});
			} else {
				return;
			}
		});
	}

	/**
	 * 修改人员初始化
	 */
	function editInit() {
		clearFormPanel(addUserFormPanel);
		mode = 'edit';

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

		addUserFormPanel.getForm().loadRecord(record);

		addUserWindow.show();
		addUserWindow.setTitle('修改操作员信息<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('account').setReadOnly(true);
		Ext.getCmp('role_id_old').setValue(record.get('role_id'));
		Ext.getCmp('dept_id_old').setValue(record.get('dept_id'));
		Ext.getCmp('user_id').setValue(record.get('user_id'));

		Ext.getCmp('btnReset').hide();

		addUserFormPanel.form.load({
			waitTitle: '提示',
			waitMsg: '正在读取用户信息,请稍候...',
			url: 'sysUser.ered?reqCode=loadUserInfo',
			success: function (form, action) {
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', '数据读取失败:' + action.failureType);
			},
			params: {
				user_id: record.get('user_id')
			}
		});
	}

	/**
	 * 修改人员数据
	 */
	function updateUserItem() {
		if (!addUserFormPanel.form.isValid()) {
			return;
		}

		var msg = '<span style="color:red">确认保存所修改的企业操作员信息吗?</span>'
		Ext.Msg.confirm('确认', msg, function (btn, text) {
			if (btn == 'yes') {
				addUserFormPanel.getForm().submit({
					url: './sysUser.ered?reqCode=updateUserItem',
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
					}
				});
			} else {
				return;
			}
		});

	}

	/**
	 * 停用启用操作员信息
	 */
	function shutoractiveSysGrpZG(flag) {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中管理员信息!');
			return;
		}

		var msg, state;
		if (flag == "open") {
			if (record.get('state') == '0') {
				Ext.Msg.alert('提示', '该操作员已经启用,无需再进行启用操作!');
				return;
			}
			state = '0';//启用
			msg = '确认启用选中的操作员吗?';
		}
		if (flag == "shut") {
			if (record.get('state') == '1') {
				Ext.Msg.alert('提示', '该操作员已经停用,无需再进行停用操作!');
				return;
			}
			state = '1';//注销
			msg = '确认停用选中的操作员吗?';
		}
		Ext.Msg.confirm('请确认', msg, function (btn, text) {
			if (btn == 'yes') {
				showWaitMsg('请等待');
				Ext.Ajax.request({
					url: './sysUser.ered?reqCode=updateUserItem',
					success: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						if (resultArray.success) {
							store.reload();
							Ext.Msg.alert('提示', '操作成功!');
						} else {
							Ext.Msg.alert('提示', '操作失败!');
						}
					},
					failure: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params: {
						user_id: record.get('user_id'),
						state: state
					}
				});
			}
		});
	}

	function validateAcc() {
		if (Ext.getCmp('account').getValue() == '') {
			Ext.Msg.alert('提示', '请输入系统号!');
			return;
		}
		validateAccStore.load({
			params: {
				account: Ext.getCmp('account').getValue()
			}
		});
	}

	validateAccStore.on('load', function (obj) {
		if (obj.getAt(0) != null) { // 如果返回的数据非空
			Ext.Msg.alert('提示', '该系统号已存在,请重新输入!');
			Ext.getCmp('account').setValue('');
		} else {
		}
	});


	var userMenuPermTreeRoot = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		id: '001',
		expanded: true,
		iconCls: 'folder_userIcon'
	});

	var userMenuPermTreeLoader = new Ext.tree.TreeLoader({
		dataUrl: './dataPerm.ered?reqCode=userMenuTreeInit'
	});

	userMenuPermTreeLoader.on("beforeload", function (treeLoader, node) {
		treeLoader.baseParams.user_id = user_id;
	}, this);

	var userMenuPermTree = new Ext.tree.TreePanel({
		loader: userMenuPermTreeLoader,
		root: userMenuPermTreeRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	var userMenuPermPanel = new Ext.Panel({
		title: '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">菜单权限',
		titleCollapse: false,
		floating: false,
		layout: 'border',
		region: 'center',
		items: [
			{
				region: 'center',
				layout: 'fit',
				autoScroll: true,
				items: [userMenuPermTree]
			}
		]
	});


	var userDataPermTreeRoot = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		id: 'root001',
		expanded: true,
		iconCls: 'folder_userIcon'
	});

	var userDataPermTreeLoader = new Ext.tree.TreeLoader({
		dataUrl: './dataPerm.ered?reqCode=userDataTreeInit'
	});

	userDataPermTreeLoader.on("beforeload", function (treeLoader, node) {
		treeLoader.baseParams.user_id = user_id;
	}, this);

	var userDataPermTree = new Ext.tree.TreePanel({
		loader: userDataPermTreeLoader,
		root: userDataPermTreeRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	var userDataPermPanel = new Ext.Panel({
		title: '<img src="./resource/image/ext/group.png" align="top" class="IEPNG">数据权限',
		titleCollapse: false,
		floating: false,
		layout: 'border',
		region: 'center',
		items: [
			{
				region: 'center',
				layout: 'fit',
				autoScroll: true,
				items: [userDataPermTree]
			}
		]
	});

	var userPermTabPanel = new Ext.TabPanel({
		activeTab: 0,
		width: 600,
		height: 250,
		plain: true,// True表示为不渲染tab候选栏上背景容器图片
		defaults: {
			autoScroll: true
		},
		items: [userMenuPermPanel, userDataPermPanel]
	});

	var userPermWindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: document.body.clientHeight,
		resizable: true,
		draggable: true,
		closeAction: 'hide',
		title: '用户权限信息',
		iconCls: 'award_star_silver_3Icon',
		modal: true,
		pageY: 15,
		pageX: document.body.clientWidth / 2 - 420 / 2,
		collapsible: true,
		maximizable: true,
		buttonAlign: 'right',
		constrain: true,
		items: [userPermTabPanel],
		buttons: [
			{
				text: '关闭',
				handler: function () {
					userPermWindow.hide();
				}
			}
		]
	});

	userPermWindow.on('show', function () {
		showCount++;
		if (showCount > 1) {
			userDataPermTree.root.reload();
			userMenuPermTree.root.reload();
		}
	})

});