/**
 * 服装信息管理
 */
Ext.onReady(function () {
	var ClothBasState = '';
	// 定义必填项 * 样式
	var re = '<span style="color:red">*</span>'

	// 复选框
	var ClothBasSm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var ClothBasCm = new Ext.grid.ColumnModel([ ClothBasSm, {
		header: '序号',
		width: 150,
		align: 'left',
		dataIndex: 'seq_no'
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
		header: '款式',
		width: 100,
		align: 'left',
		dataIndex: 'style',
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
	var ClothBasStore = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './clothBas.ered?reqCode=queryClothBasInfoAction'
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
	ClothBasStore.on('beforeload', function () {
		/*this.baseParams = {
		 codedesc : Ext.getCmp('codedesc').getValue()
		 };*/
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
		ClothBasStore.reload({
			params: {
				start: 0,
				limit: bbar.pageSize
			}
		});
	});

	//分页工具栏
	var bbar = new Ext.PagingToolbar({
		pageSize: number,
		store: ClothBasStore,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
	});

	/**
	 * 表格实例
	 */
	var ClothBasGrid = new Ext.grid.GridPanel({
		store: ClothBasStore,
		region: 'center',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
		height: 510,
		cm: ClothBasCm,
		sm: ClothBasSm,
		tbar: [
			{
				text: '新增',
				iconCls: 'page_addIcon',
				id: 'ClothBas_new_button',
				handler: function () {
					addClothBasInit();
				}
			},
			'-',
			{
				text: '修改',
				iconCls: 'page_edit_1Icon',
				id: 'ClothBas_modify_button',
				handler: function () {
					updateClothBasDataInit();
				}
			},
			{
				text: '删除',
				iconCls: 'page_delIcon',
				id: 'ClothBas_delete_button',
				handler: function () {
					deleteClothBasData();
				}
			},
			'-',
			{
				text: '刷新',
				iconCls: 'page_refreshIcon',
				handler: function () {
					ClothBasStore.reload();
				}
			}
		],
		bbar: bbar,
		listeners: {
			render: function () {
				setColumn(ClothBasCm);
				var hd_checker = this.getEl().select(
					'div.x-grid3-hd-checker');
				if (hd_checker.hasClass('x-grid3-hd-checker')) {
					hd_checker.removeClass('x-grid3-hd-checker'); // 去掉全选框
				}
			}
		}
	});

	// 页面初始自动查询数据
	ClothBasStore.load({
		params: {
			start: 0,
			limit: bbar.pageSize
		}
	});

	ClothBasGrid.on('sortchange', function () {
		ClothBasGrid.getSelectionModel().selectFirstRow();
	});

	bbar.on("change", function () {
		ClothBasGrid.getSelectionModel().selectFirstRow();
	});

	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
		layout: 'border',
		title: '服装信息',
		items: [
			{
				region: 'center',
				layout: 'fit',
				items: [ ClothBasGrid ]
			}
		]
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

	// addClothBasWindow--新增窗口--表单
	var addClothBasFormPanel = new Ext.form.FormPanel({
		labelAlign: 'right',
		labelWidth: 55,
		frame: true,
		id: 'addClothBasFormPanel',
		name: 'addClothBasFormPanel',
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
						items: [
							{
								fieldLabel: '品牌',
								name: 'brand',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '尺码',
								name: 'cloth_size',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							stateCombo
						]
					},
					{
						columnWidth: 0.5,
						layout: 'form',
						defaultType: 'textfield',
						frame: true,
						border: false,
						items: [
							{
								fieldLabel: '服装分类',
								name: 'classify',
								allowBlank: true,
								maxLength: 32,
								anchor: '95%'
							},
							{
								fieldLabel: '款式' + re,
								name: 'style',
								allowBlank: false,
								maxLength: 32,
								anchor: '95%'
							}
						]
					}
				]
			}
		]
	});

	//新增数据窗口
	var addClothBasWindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 160,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '新增服装信息',
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
		items: [ addClothBasFormPanel ], // 嵌入的表单面板
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					if (ClothBasState == 'add')
						enterClothBasAddForm();
					else if (ClothBasState = 'update') {
						enterClothBasUpdateData();
					}
				}
			},
			{
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(addClothBasPanel.getForm());
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					addClothBasWindow.hide();
				}
			}
		]
	});

	//导入
	var importClothBaspanel = new Ext.form.FormPanel(
		{
			id: 'importClothBaspanel',
			name: 'importClothBaspanel',
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
					name: 'theClothBasFile',
					id: 'theClothBasFile',
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
					html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/subsidiesInfo.xls' target='_blank'>客户联系人信息Excel模板文件</a></SPAN>",
					anchor: '99%'
				}
			]
		});

	var importClothBaswindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 170,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '导入服装信息',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ importClothBaspanel ],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('theClothBasFile')
						.getValue();
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
					importClothBas();
				}
			},
			{
				text: '关闭',
				id: 'ClothBas_btnReset',
				iconCls: 'deleteIcon',
				handler: function () {
					importClothBaswindow.hide();
				}
			}
		]
	});

	/**
	 * 新增窗口初始化
	 */
	function addClothBasInit() {
		clearForm(addClothBasFormPanel.getForm());
		addClothBasWindow
			.setTitle('服装信息新增<span style="color:Red">(*为必填项)</span>');
		addClothBasWindow.show();
		ClothBasState = 'add';
	}

	/**
	 * 修改窗口 初始化
	 */
	function updateClothBasDataInit() {
		var record = ClothBasGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		addClothBasWindow.show();
		addClothBasFormPanel.getForm().loadRecord(record);
		addClothBasWindow
			.setTitle('修改服装信息<span style="color:Red">(*为必填项)</span>');
		ClothBasState = 'update';
	}

	/**
	 * 表单数据---确定增加
	 */
	function enterClothBasAddForm() {
		if (!addClothBasFormPanel.form.isValid())
			return;

		addClothBasFormPanel.form.submit({
			url: './clothBas.ered?reqCode=insertClothBasInfoAction',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
				addClothBasWindow.hide();
				form.reset();
				ClothBasStore.reload();
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
	function enterClothBasUpdateData() {
		var record = ClothBasGrid.getSelectionModel().getSelected();
		if (!addClothBasFormPanel.form.isValid())
			return;
		addClothBasFormPanel.form.submit({
			url: './clothBas.ered?reqCode=updateClothBasInfoAction',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
				addClothBasWindow.hide();
				form.reset();
				ClothBasStore.reload(this.baseParams = {
					start: 0,
					limit: bbar.pageSize
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

	// 删除数据
	function deleteClothBasData() {
		var record = ClothBasGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认删除选中的客户信息吗?', function (btn, text) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: 'clothBas.ered?reqCode=deleteClothBasInfoAction',
					success: function (response) {
						var resultArray = Ext.util.JSON
							.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
						ClothBasStore.reload();
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
});