/************************************************
 * 创建日期: 2013-05-04
 * 创建作者：may
 * 功能：设备信息管理
 * 最后修改时间：2013-08-04
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var re = '<span style="color:red">*</span>';
	var flag = 'add';

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
		header: '单位代码',
		dataIndex: 'grp_id',
		hidden: true
	}, {
		header: '设备编号',
		dataIndex: 'trm_no',
		width: 70,
		sortable: true
	}, {
		header: '设备名称',
		width: 70,
		dataIndex: 'trm_name'
	}, {
		header: '所属分厂',
		width: 120,
		dataIndex: 'belong_grp_name'
	},{
		header: '所属分厂',
		dataIndex: 'belong_grp',
		width: 70,
		hidden:true
	}, {
		header: '设备类型',
		dataIndex: 'trm_kind',
		width: 70,
		renderer: function (value) {
			if (value == '3')
				return '读卡绑定器';
			else if (value == '4')
				return '隧道机';
		}
	}, {
		header: '数量性质',
		dataIndex: 'trm_flag',
		hidden:'true',
		renderer: function (value) {
			if (value == '1')
				return '裁剪绑定';
			else if (value == '2')
				return '缝制领片';
			else if (value == '3')
				return '缝制下线';
			else if (value == '4')
				return '水洗收货';
			else if (value == '5')
				return '水洗移交';
			else if (value == '6')
				return '后整收货';
			else if (value == '7')
				return '移交成品';
			else if (value == '8')
				return '移交B品';
            else if (value == '10')
                return '收成品';
            else if (value == '11')
                return '收B品';
            else if (value == '12')
                return '中间领用';
            else if (value == '13')
                return '送水洗';
		}
	}, {
		header: 'IP地址',
		dataIndex: 'com_spd',
		width: 80
	}, {
		header: 'IP端口',
		dataIndex: 'com_port',
		width: 80
	}, {
		header: '设备地址',
		dataIndex: 'trm_addr',
		width: 120
	}, {
		header: '安装日期',
		dataIndex: 'ins_date'
	}, {
		header: '备注',
		dataIndex: 'notes',
		width: 80
	}, {
		header: '状态',
		dataIndex: 'state',
		width: 60,
		renderer: function (value) {
			if (value == '0')
				return '登记';
			else if (value == '1')
				return '开通';
			else if (value == '2')
				return '关闭';
		}
	} ]);

	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './devTrm.ered?reqCode=queryDeviceBaseInfoAction'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'grp_id'
			},
			{
				name: 'trm_no'
			},
			{
				name: 'trm_kind'
			},
			{
				name: 'trm_name'
			},
			{
				name: 'trm_flag'
			},
			{
				name: 'trm_key'
			},
			{
				name: 'com_way'
			},
			{
				name: 'com_port'
			},
			{
				name: 'com_spd'
			},
			{
				name: 'trm_addr'
			},
			{
				name: 'ins_date'
			},
			{
				name: 'notes'
			},
			{
				name: 'belong_grp'
			},
			{
				name: 'belong_grp_name'
			},
			{
				name: 'state'
			}
		])
	});
	// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		//        this.baseParams = {
		//            queryParam: Ext.getCmp('queryParam').getValue()
		//        };
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
			}
		});
	});

	var bbar = new Ext.PagingToolbar({
		pageSize: number,
		store: store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
	})

	var grid = new Ext.grid.GridPanel({
		title: '设备信息维护',
		renderTo: 'codeTableGrid',
		height: 500,
		store: store,
		region: 'center',
        margins : '3 3 3 3',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
        border : false,
		frame: false,
		cm: cm,
		sm: sm,
		tbar: [
			{
				text: '新增',
				id: 'new_button',
				//hidden:true,
				iconCls: 'page_addIcon',
				handler: function () {
					saveInit();
				}
			},
			'-',
			{
				text: '修改',
				id: 'modify_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					ininEditCodeWindow();
				}
			},
			'-',
			{
				text: '开启',
				iconCls: 'acceptIcon',
				handler: function () {
					openData();
				}
			},
			'-',
			{
				text: '关闭',
				iconCls: 'page_delIcon',
				handler: function () {
					deleteData();
				}
			},
			'-',
			{
				text: '刷新',
				iconCls: 'page_refreshIcon',
				handler: function () {
					queryCodeItem();
				}
			},
			'-',
			{
				text: '导入',
				hidden: true,
				iconCls: 'page_refreshIcon',
				handler: function () {
					importwindow.show();
				}
			},
			'-',
			{
				text: '导出',
				iconCls: 'page_refreshIcon',
				handler: function () {
					exportExcel('./devTrm.ered?reqCode=excleDeviceBaseInfoAction');
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

	grid.addListener('rowdblclick', ininEditCodeWindow);

	grid.on('sortchange', function () {
		grid.getSelectionModel().selectFirstRow();
	});

	bbar.on("change", function () {
		grid.getSelectionModel().selectFirstRow();
	});


	var grp_root = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		expanded: true,
		id: '001'
	});
	var grp_tree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			baseAttrs: {},
			dataUrl: './sysGrps.ered?reqCode=belongGrpsTreeInit'
		}),
		root: grp_root,
		title: '',
		autoScroll: false,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	// 监听下拉树的节点单击事件
	grp_tree.on('click', function (node) {
		if (node.isLeaf()) {
			comboxWithTree.setValue(node.text);
			Ext.getCmp('belong_grp').setValue(node.attributes.id);
			comboxWithTree.collapse();
		} else {
			comboxWithTree.collapse();
			Ext.Msg.alert('提示', '请选择分厂信息!');
			return;
		}

	});
	var comboxWithTree = new Ext.form.ComboBox(
		{
			id: 'grp_tree',
			store: new Ext.data.SimpleStore({
				fields: [],
				data: [
					[]
				]
			}),
			editable: false,
			value: ' ',
			emptyText: '请选择...',
			fieldLabel: '归属分厂' + re,
			anchor: '100%',
			mode: 'local',
			triggerAction: 'all',
			maxHeight: 390,
			listWidth: 200,
			// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
			tpl: "<tpl for='.'><div style='height:390px'><div id='grpTreeDiv'></div></div></tpl>",
			allowBlank: false,
			onSelect: Ext.emptyFn
		});

	// 监听下拉框的下拉展开事件
	comboxWithTree.on('expand', function () {
		// 将UI树挂到treeDiv容器
		grp_tree.render('grpTreeDiv');
		// addDeptTree.root.expand(); //只是第一次下拉会加载数据
		grp_tree.root.reload(); // 每次下拉都会加载数据

	});

	var formPanel = new Ext.form.FormPanel({
			collapsible: false,
			border: true,
			labelWidth: 70, // 标签宽度
			labelAlign: 'right', // 标签对齐方式
			bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
			buttonAlign: 'center',
			name: 'codeForm',
			id: 'codeForm',
			height: 250,
			items: [
				{
					layout: 'column',
					border: false,
					items: [
						{
							columnWidth: .5,
							layout: 'form',
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '设备名称' + re,
									name: 'trm_name',
									allowBlank: false,
									anchor: '100%'
								},
								comboxWithTree,
//								{
//									hiddenName: 'trm_flag',
//									xtype: 'combo',
//									fieldLabel: '数量性质' + re,
//									emptyText: '请选择',
//									triggerAction: 'all',
//									store: new Ext.data.SimpleStore({
//										fields: [ 'value', 'text' ],
//										data: [
//											['1', '裁剪绑定'],
//											['2', '缝制领片'],
//											['3', '缝制下线'],
//											['4', '水洗收货'],
//											['5', '水洗移交'],
//											['6', '后整收货'],
//											['7', '后整解绑']
//										]
//									}),
//									valueField: 'value',
//									displayField: 'text',
//									mode: 'local',
//									forceSelection: false, // 选中内容必须为下拉列表的子项
//									editable: false,
//									typeAhead: true,
//									resizable: true,
//									allowBlank: false,
//									anchor: '100%'
//								},
								{
									fieldLabel: '设备地址' + re,
									name: 'trm_addr',
									allowBlank: false,
									anchor: '100%'
								}, {
									fieldLabel: '安装日期',
									xtype: 'datefield',
									name: 'ins_date',
									id: 'ins_date',
									format: 'Y-m-d', // 日期格式化
									editable: false,
									anchor: '100%'
								}
							]
						},
						{
							columnWidth: .5,
							layout: 'form',
							defaultType: 'textfield',
							border: false,
							items: [ {
								hiddenName: 'trm_kind',
								xtype:'combo',
								fieldLabel: '设备类型' + re,
								emptyText: '请选择',
								triggerAction: 'all',
								store: new Ext.data.SimpleStore({
									fields: [ 'value', 'text' ],
									data: [
										[ '3', '读卡绑定器' ],
										[ '4', '隧道机' ]
									]
								}),
								valueField: 'value',
								displayField: 'text',
								mode: 'local',
								forceSelection: false, // 选中内容必须为下拉列表的子项
								editable: false,
								typeAhead: true,
								resizable: true,
								allowBlank: false,
								anchor: '100%'
							}, {
								fieldLabel: 'IP地址' + re,
								name: 'com_spd',
								allowBlank: false,
								anchor: '100%'
							}, {
								fieldLabel: 'IP端口' + re,
								name: 'com_port',
								allowBlank: false,
								anchor: '100%'
							}]
						}
					]
				},
				{
					fieldLabel: '备注',
					name: 'notes',
					xtype: 'textarea',
					maxLength: 100,
					anchor: '99%'
				}
				,
				{
					name: 'belong_grp',
					id: 'belong_grp',
					xtype: 'textfield',
					hidden: true
				}
				,
				{
					name: 'trm_no',
					xtype: 'textfield',
					hidden: true
				}
			]
		})
		;

	var codeWindow = new Ext.Window({
		layout: 'fit',
		width: 500, // 窗口宽度
		height: 260, // 窗口高度
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '设备信息登记(*为必填项)',
		iconCls: 'page_addIcon',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ formPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					if (flag == 'add') {
						saveCodeItem();
					} else if (flag == 'update') {
						updateCodeItem();
					}
				}
			},
			{
				text: '重置',
				id: 'btnReset',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(formPanel.getForm());
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					codeWindow.hide();
				}
			}
		]
	});

//导入
	var importpanel = new Ext.form.FormPanel(
		{
			id: 'importpanel',
			name: 'importpanel',
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
					id: 'theFile',
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
					html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/deviceInfo.xls' target='_blank'>设备信息Excel模板文件</a></SPAN>",
					anchor: '99%'
				}
			]
		});

	var importwindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 170,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '导入设备信息',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ importpanel ],
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

					if (theFile.substring(theFile.length - 4,
						theFile.length) != ".xls"
						&& theFile.substring(theFile.length - 5,
						theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示',
							'您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}
					importDev();
				}
			},
			{
				text: '关闭',
				id: 'client_btnReset',
				iconCls: 'deleteIcon',
				handler: function () {
					importwindow.hide();
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
                margins : '3 3 3 3',
				layout: 'fit',
				items: [ grid ]
			}
		]
	});

	function saveInit() {
		flag = 'add';
		clearFormPanel(formPanel);
		codeWindow.setTitle('设备信息登记<span style="color:Red">(*为必填项)</span>');
		codeWindow.show();
	}

	function saveCodeItem() {
		if (formPanel.form.isValid()) {
			formPanel.getForm().submit({
				url: './devTrm.ered?reqCode=insertDeviceBaseInfoAction',
				waitTitle: '提示',
				method: 'POST',
				waitMsg: '正在处理数据,请稍候...',
				success: function (form, action) {
					store.reload();
					Ext.Msg.confirm('请确认', '设备信息登记成功,您要继续登记吗?', function (btn, text) {
						if (btn == 'yes') {
							clearForm(formPanel.getForm());
						} else {
							codeWindow.hide();
							form.reset();
						}
					});
				},
				failure: function (form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '设备信息登记失败:<br>' + msg);
					codeWindow.getComponent('codeForm').form.reset();
				}
			});
		} else {
			// 表单验证失败
		}
	}

	/**
	 * 初始化代码修改出口
	 */
	function ininEditCodeWindow() {
		flag = 'update'
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		codeWindow.setTitle('设备信息修改');
		codeWindow.show();
		formPanel.getForm().loadRecord(record);
	}

	/**
	 * 设备信息修改
	 */
	function updateCodeItem() {
		if (!formPanel.form.isValid()) {
			return;
		}
		formPanel.form.submit({
			url: './devTrm.ered?reqCode=updateDeviceBaseInfoAction',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				codeWindow.hide();
				store.reload();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', msg);
			}
		});
	}

	function openData() {
		// 返回一个行集合JS数组
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		var record = grid.getSelectionModel().getSelected();
		var state = record.get('state').toString();
		if (state == "0") {
			Ext.MessageBox.alert('提示', '该设备已经开启');
			return;
		}

		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认关闭选中的设备吗?',
			function (btn, text) {
				if (btn == 'yes') {
					Ext.Ajax.request({
						url: './devTrm.ered?reqCode=updateDevTrmInfoStateAction',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
							store.reload(this.baseParams = {
								start: 0,
								limit: bbar.pageSize
							});
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.MessageBox.alert('提示', resultArray.msg);
						},
						params: {
							trm_no: record.get('trm_no').toString(),
							state: '0'
						}
					});
				}
			});
	}

	function deleteData() {
		// 返回一个行集合JS数组
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		var record = grid.getSelectionModel().getSelected();
		var state = record.get('state').toString();
		if (state == "2") {
			Ext.MessageBox.alert('提示', '该设备已经关闭!');
			return;
		}

		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认关闭选中的设备吗?',
			function (btn, text) {
				if (btn == 'yes') {
					Ext.Ajax.request({
						url: './devTrm.ered?reqCode=updateDevTrmInfoStateAction',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
							store.reload(this.baseParams = {
								start: 0,
								limit: bbar.pageSize
							});
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.MessageBox.alert('提示', resultArray.msg);
						},
						params: {
							trm_no: record.get('trm_no').toString(),
							state: '2'
						}
					});
				}
			});
	}

	/**
	 * 设备信息导入
	 */
	function importDev() {
		importpanel.getForm().submit({
			url: './devTrm.ered?reqCode=xlsDeviceBaseInfoAction',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				importwindow.hide();
				importpanel.form.reset();
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

	/**
	 * 根据条件查询代码表
	 */
	function queryCodeItem() {
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize
			}
		});
	}

})
;