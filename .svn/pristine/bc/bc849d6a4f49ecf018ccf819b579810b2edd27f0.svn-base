/************************************************
 * 创建日期: 2013-05-28
 * 创建作者：may|lingm
 * 功能：人员管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var dept_id = root_dept_id;
	var click_dept_id,click_dept_name;
	var mode;

	var re = '<span style="color:red">*</span>';

	var root = new Ext.tree.AsyncTreeNode({
		text: root_dept_name,
		expanded: true,
		iconCls: 'folder_userIcon',
		id: root_dept_id
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
	// 节点左键单机事件
	deptTree.on('click', function (node) {
		dept_id = node.attributes.id;
		if(node.isLeaf()){
			click_dept_id = node.attributes.id;
			click_dept_name = node.attributes.text;
		}else{
			click_dept_id = '';
			click_dept_name = '';
		}
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
	var cm = new Ext.grid.ColumnModel([sm, new Ext.grid.RowNumberer(),
		{
			header: '人员编号',
			dataIndex: 'user_id',
			hidden: true,
			width: 80,
			sortable: true
		},{
			header: '姓名',
			dataIndex: 'user_name',
			width: 80
		}, {
			header: '工号',
			dataIndex: 'per_no',
			width: 130
		}, {
			id: 'user_type',
			header: '人员类型',
			hidden: true,
			dataIndex: 'user_type',
			width: 80
		}, {
			id: 'dept_name',
			header: '所属部门',
			dataIndex: 'dept_name',
			width: 130
		}, {
			header: '性别',
			dataIndex: 'sex',
			width: 60
		},{
			header: '通讯地址',
			dataIndex: 'address',
			width: 95
		}, {
			header: '身份证号',
			dataIndex: 'id_crd',
			width: 95
		},{
			header: '出生年月',
			dataIndex: 'birthday',
			width: 95
		}, {
			header: '联系电话',
			dataIndex: 'tel_no',
			width: 95
		}, {
			header: '手机号码',
			dataIndex: 'mbl_no',
			width: 95
		}, {
			id: 'remark',
			header: '备注',
			dataIndex: 'remark'
		}, {
			id: 'dept_id',
			header: '所属部门编号',
			dataIndex: 'dept_id',
			hidden: true
		} ]);

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
				name: 'locked'
			},
			{
				name: 'dept_id'
			},
			{
				name: 'dept_name'
			},
			{
				name: 'password'
			},
			{
				name: 'id_crd'
			},
			{
				name: 'birthday'
			},
			{
				name: 'photo'
			},
			{
				name: 'duty'
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
				name: 'user_type'
			},
			{
				name: 'err_num'
			},
			{
				name: 'opn_opr_id'
			},
			{
				name: 'opn_date'
			},
			{
				name: 'cls_opr_id'
			},
			{
				name: 'cls_date'
			},
			{
				name: 'remark'
			},
			{
				name: 'state'
			},
			{
				name: 'per_no'
			}
		])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		this.baseParams = {
			queryParam: Ext.getCmp('queryParam').getValue()
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
				[ 95, '95条/页' ],
				[ 250, '250条/页' ],
				[ 500, '500条/页' ]
			]
		}),
		valueField: 'value',
		displayField: 'text',
		value: '50',
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
		emptyMsg: "没有符合条件的记录",
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
	});

	var grid = new Ext.grid.GridPanel({
		title: '<span class="commoncss">人员信息表</span>',
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
				text: '删除',
				iconCls: 'page_delIcon',
				handler: function () {
					deleteUserItems();
				}
			},
			'-',
			{
				id: 'user_batch_import',
				text: '批量导入',
				iconCls: 'page_addIcon',
				handler: function () {
					userInfoImpWindow.show();
				}
			},
			'-',
			{
				text: '导出',
				iconCls: 'page_refreshIcon',
				handler: function () {
					exportExcel('./sysUser.ered?reqCode=excleUserInfoAction');
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
				iconCls: 'previewIcon',
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
			firstload: 'true'
		}
	});
	grid.on('rowdblclick', function (grid, rowIndex, event) {
		editInit();
	});

	var addRoot = new Ext.tree.AsyncTreeNode({
		text: root_dept_name,
		expanded: true,
		iconCls: 'folder_userIcon',
		id: root_dept_id
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
		if(node.isLeaf()){
			comboxWithTree.setValue(node.text);
			Ext.getCmp('dept_id').setValue(node.attributes.id);
			comboxWithTree.collapse();
		}else{
			comboxWithTree.collapse();
			Ext.Msg.alert('提示','只能在根部门下新增人员!');
			return;
		}

	});
	var comboxWithTree = new Ext.form.ComboBox(
		{
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
			fieldLabel: '所属部门'+re,
			anchor: '95%',
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
		// addDeptTree.root.expand(); //只是第一次下拉会加载数据
		addDeptTree.root.reload(); // 每次下拉都会加载数据

	});

	var addUserFormPanel = new Ext.form.FormPanel({
		id: 'addUserFormPanel',
		name: 'addUserFormPanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 65,
		frame: true,
		bodyStyle: 'padding:5 5 0',
		items: [
			{
				layout: 'column',
				border: false,
				xtype: 'panel',
				items: [
					{
						layout: 'form',
						border: false,
						columnWidth: .5,
						items: [
							{
								fieldLabel: '人员名称'+re,
								name: 'user_name',
								id: 'user_name',
								allowBlank: false,
								xtype: 'textfield',
								anchor: '95%'
							}
						]
					},
					{
						columnWidth: .2,
						layout: 'form',
						border: false,
						items: [
							{
								xtype: 'label',
								fieldLabel: '性别' + re
							}
						]
					},
					{
						columnWidth: .3,
						layout: 'form',
						items: [
							{
								xtype: 'radiogroup',
								anchor: '100%',
								id: 'sex',
								hideLabel: true,
								items: [
									{
										boxLabel: '男',
										name: 'sex',
										inputValue: '1', // 映射的值
										checked: true
									},
									{
										boxLabel: '女',
										name: 'sex',
										inputValue: '2'
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
				xtype: 'panel',
				items: [
					{
						layout: 'form',
						border: false,
						columnWidth: .5,
						items: [
							{
								fieldLabel: '工号',
								name: 'per_no',
								id: 'per_no',
								xtype: 'textfield',
								anchor: '95%'
							},
							{
								fieldLabel: '身份证号',
								name: 'id_crd',
								id: 'id_crd',
								xtype: 'textfield',
								anchor: '95%'
							},{
								fieldLabel: '联系电话',
								name: 'tel_no',
								id: 'tel_no',
								xtype: 'textfield',
								anchor: '95%'
							}
						]
					},
					{
						layout: 'form',
						border: false,
						columnWidth: .5,
						items: [comboxWithTree,
							{
								fieldLabel: '出生年月',
								name: 'birthday',
								id: 'birthday',
								xtype: 'datefield',
								format:'Y-m-d',
								anchor: '95%'
							},{
								fieldLabel: '手机号码',
								name: 'mbl_no',
								id: 'mbl_no',
								xtype: 'textfield',
								anchor: '95%'
							}
						]
					}
				]
			},
				{
								fieldLabel: '地址',
								name: 'address',
								id: 'age',
								xtype: 'textfield',
								anchor: '97%'
							},
			{
				fieldLabel: '备注',
				name: 'remark',
				allowBlank: true,
				anchor: '97%'
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
			},
			{
				id: 'user_id',
				name: 'user_id',
				hidden: true
			}
		]
	});

	var addUserWindow = new Ext.Window({
		layout: 'fit',
		width: 600,
		height: 280,
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '<span class="commoncss">新增人员</span>',
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		items: [ addUserFormPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					if (mode == 'add')
						saveUserItem();
					else
						updateUserItem();
				}
			},
			{
				text: '重置',
				id: 'btnReset',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(addUserFormPanel.getForm());
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


	var userInfoImpForm = new Ext.form.FormPanel({
		id: 'formpanel4Imp',
		name: 'formpanel4Imp',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 99,
		frame: true,
		labelAlign: 'right',
		fileUpload: true,
		items: [
			{
				fieldLabel: '请选择导入文件',
				name: 'theFile',
				id: 'EmpInfoTheFile',
				inputType: 'file',
				allowBlank: true,
				anchor: '99%'
			},
			{
				xtype: "label",
				fieldLabel: '说明',
				id: 'impId',
				html: "第一行标题请勿改动;<br/>中间不要有空行;<br/>红色的列为必填项" +
					"<br/><span style='color:red'>当前导入需要验证身份证状态,如果港澳台及其他人员请选择对应导入功能</span>",
				anchor: '99%'
			},
			{
				xtype: "label",
				labelStyle: 'color:red;width=60px;',
				id: 'download_id',
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/userInfo.xls' target='_blank'>下载Excel导入模板</a></SPAN>",
				anchor: '99%'
			}
		]
	});

	var userInfoImpWindow = new Ext.Window({
		layout: 'fit',
		width: 380,
		height: 260,
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '导入用户信息',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ userInfoImpForm ],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('EmpInfoTheFile').getValue();
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls" &&
						theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}
					userInfoImpForm.getForm().submit({
						url: './sysUser.ered?reqCode=importUserInfo',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							store.reload();
							Ext.MessageBox.alert('提示', action.result.msg);
							userInfoImpWindow.hide();
						},
						failure: function (form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示', '人员导入失败:<br>' + msg);
						}
					});

				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					userInfoImpWindow.hide();
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
				title: '<span class="commoncss">部门</span>',
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
				border: false,
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
				dept_id: dept_id
			}
		});
	}

	/**
	 * 新增人员初始化
	 */
	function addInit() {
		mode = 'add';
		Ext.getCmp('btnReset').show();
		clearFormPanel(addUserFormPanel);
		Ext.getCmp('sex').setValue("1");

		Ext.getCmp('dept_name').setValue(click_dept_name);
		Ext.getCmp('dept_id').setValue(click_dept_id);

		addUserWindow.show();
		addUserWindow.setTitle('<span class="commoncss">新增人员</span>');

		comboxWithTree.setDisabled(false);
	}

	/**
	 * 保存人员数据
	 */
	function saveUserItem() {
		if (!addUserFormPanel.form.isValid()) {
			return;
		}
		addUserFormPanel.getForm().submit({
			url: './sysUser.ered?reqCode=saveSysUserInfo',
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
	}

	/**
	 * 删除人员
	 */
	function deleteUserItems() {
		var rows = grid.getSelectionModel().getSelections();

		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'user_id');
		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>删除人员将同时删除和人员相关的权限信息,请慎重.</span><br>继续删除吗?',
			function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg('正在删除请等待!');
					Ext.Ajax.request({
						url: './sysUser.ered?reqCode=deleteUserItems',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							store.reload();
							Ext.Msg.alert('提示',resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示',resultArray.msg);
						},
						params: {
							strChecked: strChecked
						}
					});
				}
			});
	}

	/**
	 * 人员初始化
	 */
	function editInit() {
		mode = 'edit';

		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
			return;
		}

		addUserFormPanel.getForm().loadRecord(record);
		addUserWindow.show();
		addUserWindow.setTitle('<span class="commoncss">修改人员</span>');
		Ext.getCmp('dept_id_old').setValue(record.get('dept_id'));
		if(record.get('sex')=='男'){
			Ext.getCmp('sex').setValue('1');
		}else{
			Ext.getCmp('sex').setValue('2');
		}

		Ext.getCmp('btnReset').hide();
	}

	/**
	 * 修改人员数据
	 */
	function updateUserItem() {
		if (!addUserFormPanel.form.isValid()) {
			return;
		}

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
	}

});