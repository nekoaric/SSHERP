/************************************************
 * 创建日期: 2013-06-17
 * 创建作者：may
 * 功能：客户信息管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/

Ext.onReady(function () {
	var state = '';
	var cust_id, cust_name;
	// 定义必填项 * 样式
	var re = '<span style="color:red">*</span>'

	var tbar = new Ext.Toolbar({
		items: [
			{
				text: '新增',
				iconCls: 'page_addIcon',
				id: 'client_new_button',
				handler: function () {
					addCustBasListInit();
				}
			},
			'-',
			{
				text: '修改',
				iconCls: 'page_edit_1Icon',
				id: 'client_modify_button',
				handler: function () {
					updateCustBasListInit();
				}
			},
			{
				text: '注销',
				iconCls: 'page_delIcon',
				id: 'client_delete_button',
				handler: function () {
					deleteCustBasList();
				}
			},
			'-',
			{
				text: '导入',
				iconCls: 'page_refreshIcon',
				handler: function () {
					importClientwindow.show();
				}
			},
			'-',
			{
				text: '导出',
				iconCls: 'page_refreshIcon',
				handler: function () {
					exportExcel('./custBas.ered?reqCode=exportBasCustList');
				}
			},
			'-',
			{
				text: '刷新',
				iconCls: 'page_refreshIcon',
				handler: function () {
					custListTree.root.reload();
				}
			}
		]});

	var root = new Ext.tree.AsyncTreeNode({
		text: '部门树',
		expanded: true,
		id: '001'
	});

	var custListTree = new Ext.ux.tree.TreeGrid({
		loader: new Ext.tree.TreeLoader({
			dataUrl: './custBas.ered?reqCode=getCustBasInfoTreeAction'
		}),
		region: 'center',
		root: root,
		title: '客户信息',
		animate: false,
//		autoScroll:true,
        margins : '3 3 3 3',
		tbar: tbar,
		inlineScroll: true,//出现内部滚动条
		useArrows: true,
		border: false,
		columns: [
			{
				header: '地区',
				width: 80,
				align: 'center',
				dataIndex: 'country',
				sortable: true
			},
			{
				header: '客户编号',
				width: 90,
				align: 'center',
				dataIndex: 'cust_id'
			},
			{
				header: '客户名称',
				width: 100,
				align: 'center',
				dataIndex: 'cust_name',
				sortable: true
			},
			{
				header: '客户别名',
				width: 100,
				align: 'center',
				dataIndex: 'alias',
				sortable: true
			},
			{
				header: '联系人',
				width: 80,
				align: 'center',
				dataIndex: 'lnk_name',
				sortable: true
			},
			{
				header: '联系人电话',
				width: 90,
				align: 'center',
				dataIndex: 'lnk_tel_no',
				sortable: true
			},
			{
				header: '电话',
				width: 90,
				align: 'center',
				dataIndex: 'tel_no',
				sortable: true
			},
			{
				header: '传真',
				width: 90,
				align: 'center',
				dataIndex: 'fax',
				sortable: true
			},
			{
				header: 'Email',
				width: 90,
				align: 'center',
				dataIndex: 'email',
				sortable: true
			},
			{
				header: '地址',
				width: 120,
				align: 'center',
				dataIndex: 'address',
				sortable: true
			},
			{
				header: '网址',
				width: 100,
				align: 'center',
				dataIndex: 'web_site',
				sortable: true
			},
			{
				header: '开户银行',
				width: 100,
				align: 'center',
				dataIndex: 'opn_bank',
				sortable: true
			},
			{
				header: '帐号',
				width: 100,
				align: 'center',
				dataIndex: 'bank_account',
				sortable: true
			},
			{
				header: '税号',
				width: 100,
				align: 'center',
				dataIndex: 'tax_id',
				sortable: true
			},
			{
				header: 'MSN',
				width: 80,
				align: 'center',
				dataIndex: 'msn',
				sortable: true
			},
			{
				header: 'QQ',
				width: 80,
				align: 'center',
				dataIndex: 'qq',
				sortable: true
			},
			{
				header: '状态',
				width: 80,
				align: 'center',
				dataIndex: 'state',
				sortable: true
			}
		]
	});
	custListTree.on("click", function (node, e) {
		cust_id = node.attributes.cust_id;
		cust_name = node.attributes.cust_name;
	});

	// addClientWindow--新增窗口--表单
	var addClientFormPanel = new Ext.form.FormPanel({
		labelAlign: 'right',
		labelWidth: 70,
		frame: true,
		id: 'addClientFormPanel',
		name: 'addClientFormPanel',
		items: [
			{
				layout: 'column',
				items: [
					{
						columnWidth: 0.5,
						layout: 'form',
						defaultType: 'textfield',
						border: false,
						items: [
							{
								fieldLabel: '客户名称' + re,
								name: 'cust_name',
								id: 'cust_name',
								allowBlank: false,
								maxLength: 128,
								anchor: '95%'
							},
							{
								fieldLabel: '客户别名',
								name: 'alias',
								id: 'alias',
								emptyText:'多个别名之间用","隔开',
								maxLength: 128,
								anchor: '95%'
							},
							{
								fieldLabel: '传真',
								name: 'fax',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '网址',
								name: 'web_site',
								allowBlank: true,
								maxLength: 128,
								anchor: '95%'
							},
							{
								fieldLabel: '开户行',
								name: 'opn_bank',
								allowBlank: true,
								maxLength: 128,
								anchor: '95%'
							},
							{
								fieldLabel: '税号',
								name: 'tax_id',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '联系人电话',
								name: 'lnk_tel_no',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							}
						]
					},
					{
						columnWidth: 0.5,
						layout: 'form',
						defaultType: 'textfield',
						border: false,
						items: [
							{
								fieldLabel: '地区' + re,
								name: 'country',
								maxLength: 32,
								allowBlank: false,
								anchor: '95%'
							},
							{
								fieldLabel: '电话',
								name: 'tel_no',
								id: 'tel_no',
								allowDecimals: false, // 是否允许输入小数
								allowBlank: true,
								decimalPrecision: 0,
								allowNegative: true,
								maxLength: 128,
								anchor: '95%'
							},
							{
								fieldLabel: '帐号',
								name: 'bank_account',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '联系人',
								name: 'lnk_name',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '邮箱',
								name: 'email',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: 'MSN',
								name: 'msn',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: 'QQ',
								name: 'qq',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							}
						]
					}
				]
			},
			{
				layout: 'column',
				items: [
					{
						columnWidth: 1,
						layout: 'form',
						defaultType: 'textfield',
						border: false,
						items: [
							{
								fieldLabel: '地址',
								name: 'address',
								allowBlank: true,
								maxLength: 4000,
								anchor: '98%'
							}
						]
					}
				]
			}
		]
	});

//新增数据窗口
	var addClientWindow = new Ext.Window({
		layout: 'fit',
		width: 500,
		height: 350,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '新增客户信息',
		iconCls: 'page_addIcon',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ addClientFormPanel ], // 嵌入的表单面板
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					if (state == 'add')
						enterClientAddForm();
					else if (state = 'update') {
						enterClientUpdateData();
					}
				}
			},
			{
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(addClientFormPanel.getForm());
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					addClientWindow.hide();
				}
			}
		]
	});

	//导入
	var importClientpanel = new Ext.form.FormPanel(
		{
			id: 'importClientpanel',
			name: 'importClientpanel',
			defaultType: 'textfield',
			labelAlign: 'right',
			labelWidth: 105,
			width: 280,
			height: 220,
			frame: true,
			fileUpload: true,
			items: [
				{
					fieldLabel: '导入文件(Excel)' + re,
					name: 'theFile',
					id: 'theClientFile',
					inputType: 'file',
					allowBlank: false,
					blankText: "请选择导入文件",
					anchor: '94%'
				},
				{
					xtype: "label",
					labelStyle: 'color:red;',
					fieldLabel: 'Excel格式',
					html: "<SPAN STYLE='COLOR:red'>第一行为中文标题,文件中请不要出现空行。</SPAN>",
					anchor: '95%'
				},
				{
					xtype: "label",
					labelStyle: 'color:red;width=60px;',
					html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/custBasInfo.xls' target='_blank'>客户信息Excel模板文件实例</a></SPAN>",
					anchor: '99%'
				}
			]
		});

	var importClientwindow = new Ext.Window(
		{
			layout: 'fit',
			width: 400,
			height: 170,
			resizable: false,
			draggable: false,
			closeAction: 'hide',
			title: '导入客户信息',
			modal: true,
			collapsible: true,
			titleCollapse: true,
			maximizable: false,
			buttonAlign: 'right',
			border: false,
			animCollapse: true,
			animateTarget: Ext.getBody(),
			constrain: true,
			items: [ importClientpanel ],
			buttons: [
				{
					text: '导入',
					iconCls: 'acceptIcon',
					handler: function () {
						var theFile = Ext.getCmp('theClientFile').getValue();
						if (Ext.isEmpty(theFile)) {
							Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
							return;
						}
                          var a=theFile.substring(theFile.length -5,theFile.length);
						if (theFile.substring(theFile.length - 4,theFile.length) != ".xls"
							&& theFile.substring(theFile.length -5,theFile.length) != ".xlsx") {
							Ext.Msg.alert('提示','您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
							return;
						}
						importClient();
					}
				},
				{
					text: '关闭',
					id: 'client_btnReset',
					iconCls: 'deleteIcon',
					handler: function () {
						importClientwindow.hide();
					}
				}
			]
		});

	/**
	 * 新增窗口初始化
	 */
	function addCustBasListInit() {
		state = 'add';

		clearForm(addClientFormPanel.getForm());
		addClientWindow.setTitle('客户信息新增<span style="color:Red">(*为必填项)</span>');
		addClientWindow.show();

	}

	/**
	 * 修改窗口 初始化
	 */
	function updateCustBasListInit() {
		if (Ext.isEmpty(cust_id)) {
			Ext.MessageBox.alert('提示', '您没有选中有效的客户数据!');
			return;
		}
		clearFormPanel(addClientFormPanel);
		addClientFormPanel.getForm().load({
			url: './custBas.ered?reqCode=loadCustBasListByCustId',
			params: {
				cust_id: cust_id
			},
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) { // 回调函数有2个参数
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', action.result.msg);
			}
		});
		addClientWindow.show();
		addClientWindow.setTitle('修改客户信息<span style="color:Red">(*为必填项)</span>');
		state = 'update';
	}

	/**
	 * 表单数据---确定增加
	 */
	function enterClientAddForm() {
		if (!addClientFormPanel.form.isValid())
			return;

		addClientFormPanel.getForm().submit({
			url: './custBas.ered?reqCode=insertCustBasList',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addClientWindow.hide();
				form.reset();
				custListTree.root.reload();
				Ext.MessageBox.alert('提示', action.result.msg);

			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '数据保存失败:<br>' + msg);
			}
		});
	}

	/**
	 * 表单数据--确定修改
	 */
	function enterClientUpdateData() {
		if (!addClientFormPanel.form.isValid())
			return;

		addClientFormPanel.getForm().submit({
			url: './custBas.ered?reqCode=updateCustBasList',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addClientWindow.hide();
				custListTree.root.reload();
				Ext.MessageBox.alert('提示', action.result.msg);
				form.reset();
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '数据修改失败:<br>' + msg);
			},
			params: {
				cust_id: cust_id
			}        });
	}

	// 注销数据
	function deleteCustBasList() {
		if (Ext.isEmpty(cust_id)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认注销选中的客户信息吗?', function (btn, text) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: 'custBas.ered?reqCode=deleteCustBasList',
					success: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);

						custListTree.root.reload();
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failure: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.MessageBox.alert('提示', resultArray.msg);
					},
					params: {
						cust_id: cust_id
					}
				});
			}
		});
	}

	function importClient() {
		importClientpanel.getForm().submit({
			url: 'custBas.ered?reqCode=importCustBasList',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				importClientwindow.hide();
				importClientpanel.form.reset();
				Ext.MessageBox.show({
					title: '提示',
					msg: action.result.msg,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO
				});
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.show({
					title: '错误',
					msg: action.result.msg,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		});
	}

	/********************************客户常用信息*************************/
	var CustBasInfoState = '';
	// 复选框
	var custBasInfoSm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var custBasInfoCm = new Ext.grid.ColumnModel([ custBasInfoSm, {
		header: '序号',
		width: 150,
		align: 'left',
		dataIndex: 'seq_no'
	}, {
		header: '客户编号',
		width: 100,
		align: 'left',
		dataIndex: 'cust_id',
		hidden: true
	}, {
		header: '客户名称',
		width: 100,
		align: 'left',
		dataIndex: 'cust_name',
		sortable: true
	}, {
		header: '款式',
		width: 100,
		align: 'left',
		dataIndex: 'style',
		sortable: true
	}, {
		header: '品牌',
		width: 100,
		align: 'left',
		dataIndex: 'brand',
		sortable: true
	}, {
		header: '服装分类',
		width: 100,
		align: 'left',
		dataIndex: 'classify',
		sortable: true
	}, {
		header: '尺码',
		width: 100,
		align: 'left',
		dataIndex: 'cloth_size',
		sortable: true
	}, {
		header: '状态',
		width: 100,
		align: 'left',
		dataIndex: 'state',
		sortable: true,
		renderer: function (value) {
			if (value == '0')
				return '正常';
			else if (value == '1')
				return '注销';
		}
	} ]);

	// 数据存储
	var custBasInfoStore = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './custBas.ered?reqCode=queryCustBasInfoAction'
		}),
		// 数据读取器
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',// 记录总数
			root: 'ROOT'// Json中的列表数据根节点
		}, [
			{
				name: 'seq_no'
			},
			{
				name: 'cust_id'
			},
			{
				name: 'cust_name'
			},
			{
				name: 'brand'
			},
			{
				name: 'classify'
			},
			{
				name: 'style'
			},
			{
				name: 'cloth_size'
			},
			{
				name: 'state'
			}
		])
	});

	// 翻页排序时带上查询条件
	custBasInfoStore.on('beforeload', function () {
	});

	var custBasInfoPagesize_combo = new Ext.form.ComboBox({
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
		value: '50',
		editable: false,
		width: 85
	});

	var custBasInfoNumber = parseInt(custBasInfoPagesize_combo.getValue());
	custBasInfoPagesize_combo.on("select", function (comboBox) {
		custBasInfoBbar.pageSize = parseInt(comboBox.getValue());
		custBasInfoNumber = parseInt(comboBox.getValue());
		custBasInfoStore.reload({
			params: {
				start: 0,
				limit: custBasInfoBbar.pageSize
			}
		});
	});

	//分页工具栏
	var custBasInfoBbar = new Ext.PagingToolbar({
		pageSize: custBasInfoNumber,
		store: custBasInfoStore,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: [ '-', '&nbsp;&nbsp;', custBasInfoPagesize_combo ]
	});

	/**
	 * 表格实例
	 */
	var custBasInfoGrid = new Ext.grid.GridPanel({
		store: custBasInfoStore,
		region: 'center',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
        margins : '3 3 3 3',
		height: 510,
		cm: custBasInfoCm,
		sm: custBasInfoSm,
		tbar: [
			{
				text: '新增',
				iconCls: 'page_addIcon',
				id: 'CustBas_new_button',
				handler: function () {
					addCustBasInfoInit();
				}
			},
			'-',
			{
				text: '修改',
				iconCls: 'page_edit_1Icon',
				id: 'CustBas_modify_button',
				handler: function () {
					updateCustBasInfoDataInit();
				}
			},
			{
				text: '注销',
				iconCls: 'page_delIcon',
				id: 'CustBas_delete_button',
				handler: function () {
					deleteCustBasInfoData();
				}
			},
			'-',
			{
				text: '刷新',
				iconCls: 'page_refreshIcon',
				handler: function () {
					custBasInfoStore.load({
						params: {
							start: 0,
							limit: custBasInfoBbar.pageSize
						}
					});
				}
			}
		],
		bbar: custBasInfoBbar,
		listeners: {
			render: function () {
				setColumn(custBasInfoCm);
			}
		}
	});
	custBasInfoGrid.on('rowdblclick', function (grid, rowIndex, event) {
		updateCustBasInfoDataInit();
	});

	// 页面初始自动查询数据
	custBasInfoStore.load({
		params: {
			start: 0,
			limit: custBasInfoBbar.pageSize
		}
	});

	/**
	 * 客户下拉框
	 */
	var clientComboStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './custBas.ered?reqCode=getCustIDCombox'
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

	var clientCombo = new Ext.form.ComboBox({
		name: 'cust_id',
		hiddenName: 'cust_id',
		store: clientComboStore,
		fieldLabel: '客户名称' + re,
		emptyText: '请选择...',
		loadingText: '正在加载数据...',
		mode: 'remote',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		value: '0',
		allowBlank: false,
		forceSelection: true,
		editable: false,
		typeAhead: true,
		anchor: "95%"
	});

	/**
	 * 性别下拉框
	 */
	var stateStore = new Ext.data.SimpleStore({
		fields: [ 'value', 'text' ],
		data: [
			[ '0', '正常' ],
			[ '1', '注销' ]
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
		fieldLabel: '状态',
		emptyText: '请选择...',
		allowBlank: true,
		forceSelection: true,
		editable: false,
		typeAhead: true,
		anchor: "95%"
	});

	// addCustBasWindow--新增窗口--表单
	var addCustBasInfoFormPanel = new Ext.form.FormPanel({
		labelAlign: 'right',
		labelWidth: 70,
		frame: true,
		id: 'addCustBasInfoFormPanel',
		name: 'addCustBasInfoFormPanel',
		items: [
			{
				layout: 'column',
				items: [
					{
						columnWidth: 0.5,
						layout: 'form',
						defaultType: 'textfield',
						frame: true,
						border: false,
						items: [ clientCombo, {
							fieldLabel: '品牌',
							name: 'brand',
							allowBlank: true,
							maxLength: 32,
							anchor: '95%'
						}, {
							fieldLabel: '尺码',
							name: 'cloth_size',
							allowBlank: true,
							maxLength: 32,
							anchor: '95%'
						} ]
					},
					{
						columnWidth: 0.5,
						layout: 'form',
						defaultType: 'textfield',
						frame: true,
						border: false,
						items: [
							{
								fieldLabel: '款式' + re,
								name: 'style',
								allowBlank: false,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '服装分类',
								name: 'classify',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							stateCombo
						]
					}
				]
			}
		]
	});

	//新增数据窗口
	var addCustBasInfoWindow = new Ext.Window({
		layout: 'fit',
		width: 500,
		height: 180,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '新增客户信息',
		iconCls: 'page_addIcon',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ addCustBasInfoFormPanel ], // 嵌入的表单面板
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					if (CustBasInfoState == 'add')
						enterCustBasInfoAddForm();
					else if (CustBasInfoState = 'update') {
						enterCustBasInfoUpdateData();
					}
				}
			},
			{
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(addCustBasInfoFormPanel.getForm());
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					addCustBasInfoWindow.hide();
				}
			}
		]
	});

//	//导入
//	var importCustBasInfopanel = new Ext.form.FormPanel({
//		id: 'importCustBaspanel',
//		name: 'importCustBaspanel',
//		defaultType: 'textfield',
//		labelAlign: 'right',
//		labelWidth: 105,
//		width: 280,
//		height: 220,
//		frame: true,
//		fileUpload: true,
//		items: [
//			{
//				fieldLabel: '请选择导入文件',
//				name: 'theFile',
//				id: 'theCustBasFile',
//				inputType: 'file',
//				allowBlank: true,
//				anchor: '99%'
//			},
//			{
//				xtype: "label",
//				labelStyle: 'color:red;',
//				fieldLabel: 'Excel格式',
//				html: "<SPAN STYLE='COLOR:red'>第一行为中文标题,文件中请不要出现空行。</SPAN>",
//				anchor: '95%'
//			},
//			{
//				xtype: "label",
//				labelStyle: 'color:red;width=60px;',
//				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/custBasInfo.xls' target='_blank'>客户联系人信息Excel模板</a></SPAN>",
//				anchor: '99%'
//			}
//		]
//	});
//
//	var importCustBasInfowindow = new Ext.Window({
//		layout: 'fit',
//		width: 400,
//		height: 170,
//		resizable: false,
//		draggable: false,
//		closeAction: 'hide',
//		title: '导入客户联系人信息',
//		modal: true,
//		collapsible: true,
//		titleCollapse: true,
//		maximizable: false,
//		buttonAlign: 'right',
//		border: false,
//		animCollapse: true,
//		animateTarget: Ext.getBody(),
//		constrain: true,
//		items: [ importCustBasInfopanel ],
//		buttons: [
//			{
//				text: '导入',
//				iconCls: 'acceptIcon',
//				handler: function () {
//					var theFile = Ext.getCmp('theCustBasFile').getValue();
//					if (Ext.isEmpty(theFile)) {
//						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
//						return;
//					}
//
//					if (theFile.substring(theFile.length - 4,
//						theFile.length) != ".xls"
//						&& theFile.substring(theFile.length - 5,
//						theFile.length) != ".xlsx") {
//						Ext.Msg.alert('提示',
//							'您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
//						return;
//					}
//					importCustBasInfo();
//				}
//			},
//			{
//				text: '关闭',
//				id: 'CustBas_btnReset',
//				iconCls: 'deleteIcon',
//				handler: function () {
//					importCustBasInfowindow.hide();
//				}
//			}
//		]
//	});

	/**
	 * 新增窗口初始化
	 */
	function addCustBasInfoInit() {
		clearForm(addCustBasInfoFormPanel.getForm());
		addCustBasInfoWindow.setTitle('客户信息新增<span style="color:Red">(*为必填项)</span>');
		addCustBasInfoWindow.show();
		stateCombo.setValue('0');
		CustBasInfoState = 'add';
	}

	/**
	 * 修改窗口 初始化
	 */
	function updateCustBasInfoDataInit() {
		var record = custBasInfoGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		addCustBasInfoWindow.show();
		addCustBasInfoFormPanel.getForm().loadRecord(record);
		addCustBasInfoWindow.setTitle('修改客户信息<span style="color:Red">(*为必填项)</span>');
		CustBasInfoState = 'update';
	}

	/**
	 * 表单数据---确定增加
	 */
	function enterCustBasInfoAddForm() {
		if (!addCustBasInfoFormPanel.form.isValid())
			return;

		addCustBasInfoFormPanel.form.submit({
			url: './custBas.ered?reqCode=insertCustBasInfoAction',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
				addCustBasInfoWindow.hide();
				form.reset();
				custBasInfoStore.load({
					params: {
						start: 0,
						limit: custBasInfoBbar.pageSize
					}
				});
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '数据保存失败:<br>' + msg);
			}
		});
	}

	/**
	 * 表单数据--确定修改
	 */
	function enterCustBasInfoUpdateData() {
		var record = custBasInfoGrid.getSelectionModel().getSelected();
		if (!addCustBasInfoFormPanel.form.isValid())
			return;
		addCustBasInfoFormPanel.form.submit({
			url: './custBas.ered?reqCode=updateCustBasInfoAction',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
				addCustBasInfoWindow.hide();
				form.reset();
				custBasInfoStore.reload(
					this.baseParams = {
						start: 0,
						limit: custBasInfoBbar.pageSize
					});
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '数据修改失败:<br>' + msg);
			},
			params: {
				seq_no: record.get('seq_no').toString()
			}
		});
	}

	// 注销数据
	function deleteCustBasInfoData() {
		var record = custBasInfoGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认注销选中的客户信息吗?', function (btn, text) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: 'custBas.ered?reqCode=deleteCustBasInfoAction',
					success: function (response) {
						var resultArray = Ext.util.JSON
							.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
						custBasInfoStore.load({
							params: {
								start: 0,
								limit: custBasInfoBbar.pageSize
							}
						});
					},
					failure: function (response) {
						Ext.MessageBox.alert('提示', resultArray.msg);
					},
					params: {
						seq_no: record.get('seq_no').toString()
					}
				});
			}
		});
	}

	var custBasInfoPanel = new Ext.FormPanel({
		layout: 'border',
		title: '客户常用规格信息',
		id: 'custBasInfoPanel_id',
		name: 'custBasInfoPanel',
		items: custBasInfoGrid
	});

	var empTab = new Ext.TabPanel({
		region: 'center',
		collapsed: false,
		deferredRender: false,
		layoutOnTabChange: true,
		activeTab: 0,
		autoScroll: true,
		items: [custListTree]
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [
			{
				region: 'center',
				layout: 'fit',
				border: false,
                margins : '3 3 3 3',
				items: [empTab]
			}
		]
	});
});
