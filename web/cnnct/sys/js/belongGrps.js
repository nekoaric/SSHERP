/************************************************
 * 创建日期: 2013-06-18
 * 创建作者：may
 * 功能：分厂集团管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var grp_id, match_dept_id;
	var flag;
	var belong_grp_id, belong_grp_name, belong_dept_id, belong_dept_name;
	var old_belong_dept_id, old_belong_dept_name;

	var firstLoad = true;
	var re = '<span style="color:red">*</span>';

	var root = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		expanded: true,
		id: '001'
	});

	root.on('expand', function (node) {
		if (node.hasChildNodes && firstLoad) {
			firstLoad = false;
			node.firstChild.fireEvent('click', node.firstChild);
		}
	})
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
		grp_id = node.attributes.id;
		belong_grp_id = node.attributes.id;
		belong_grp_name = node.attributes.text;
		belong_dept_id = node.attributes.match_dept_id;
		belong_dept_name = node.attributes.match_dept_name;

		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				grp_id: grp_id
			}
		});
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
		header: '企业代码',
		dataIndex: 'grp_id',
		width: 70,
		hidden: true,
		sortable: true
	}, {
		header: '企业名称',
		dataIndex: 'name',
		width: 160
	}, {
		header: '所属企业',
		dataIndex: 'belong_grp_name',
		width: 120
	},{
		header: '企业简称',
		dataIndex: 'abbr',
		width: 80
	}, {
		header: '企业规模',
		dataIndex: 'grp_size',
		width: 60
	}, {
		header: '邮政编码',
		width: 60,
		dataIndex: 'post_code'
	}, {
		header: '企业地址',
		hidden: true,
		dataIndex: 'addr'
	}, {
		header: '传真号码',
		width: 90,
		dataIndex: 'fax_no'
	}, {
		header: '负责人',
		width: 50,
		dataIndex: 'ceo_name'
	}, {
		header: '联系电话',
		width: 90,
		dataIndex: 'ceo_telno'
	}, {
		header: '电子邮箱',
		width: 90,
		dataIndex: 'email'
	}, {
		header: '平台功能',
		width: 150,
		dataIndex: 'apps',
		renderer: function (value) {
			var attr = value.split(',');
			var str="";
			if(attr[0]=='1'){
				str = str+"基础功能管理,";
			}
			if(attr[1]=='1'){
				str = str+"流程管理,";
			}
			if(attr[2]=='1'){
				str = str+"数据分析,";
			}
			if(attr[3]=='1'){
				str = str+"系统管理,";
			}
			if(str.length>0){
				str = str.substring(0,str.length-1);
			}
			return str;
		}
	}, {
		width: 70,
		hidden: true,
		dataIndex: 'match_dept_id'
	}, {
		width: 70,
		hidden: true,
		dataIndex: 'belong_grp_id'
	}, {
		width: 70,
		hidden: true,
		dataIndex: 'apps'
	}]);

	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './sysGrps.ered?reqCode=queryBelongGrpsInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'grp_id'
			},
			{
				name: 'name'
			},
			{
				name: 'abbr'
			},
			{
				name: 'grp_size'
			},
			{
				name: 'addr'
			},
			{
				name: 'post_code'
			},
			{
				name: 'prv_code'
			},
			{
				name: 'city_code'
			},
			{
				name: 'lnk_name'
			},
			{
				name: 'lnk_telno'
			},
			{
				name: 'ceo_name'
			},
			{
				name: 'ceo_telno'
			},
			{
				name: 'biz_lcns'
			},
			{
				name: 'crp_name'
			},
			{
				name: 'crp_telno'
			},
			{
				name: 'fax_no'
			},
			{
				name: 'email'
			},
			{
				name: 'opn_date'
			},
			{
				name: 'ptl_end_date'
			},
			{
				name: 'access_state'
			},
			{
				name: 'match_dept_id'
			},
			{
				name: 'match_dept_name'
			},
			{
				name: 'belong_grp_id'
			},
			{
				name: 'belong_grp_name'
			},
			{
				name: 'apps'
			}
		])
	});

	store.on('beforeload', function () {
		this.baseParams = {
			grp_id: grp_id
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
	});

	var grid = new Ext.grid.GridPanel(
		{
			renderTo: 'codeTableGrid',
			height: 510,
			store: store,
			region: 'center',
			viewConfig: {
				forceFit: true
			},
			loadMask: {
				msg: '正在加载表格数据,请稍等...'
			},
			stripeRows: true,
            border : false,
			cm: cm,
			sm: sm,
			tbar: [
				{
					text: '新增',
					iconCls: 'page_addIcon',
					handler: function () {
						ininAddCodeWindow();
					}
				},
				'-',
				{
					text: '修改',
					iconCls: 'page_edit_1Icon',
					handler: function () {
						ininEditCodeWindow();
					}
				},
				'-',
				{
					text: '删除',
					iconCls: 'page_delIcon',
					handler: function () {
						deleteCodeItem();
					}
				},
				'-',
				{
					text: '详细',
					iconCls: 'page_edit_1Icon',
					handler: function () {
						ininDetailCodeWindow();
					}
				}
			],
			bbar: bbar
		});

	grid.addListener('rowdblclick', ininEditCodeWindow);

	grid.on('sortchange', function () {
		grid.getSelectionModel().selectFirstRow();
	});

	bbar.on("change", function () {
		grid.getSelectionModel().selectFirstRow();
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
                margins : '3 0 3 3',
				autoScroll: true,
				items: [ deptTree ]
			},
			{
				region: 'center',
				layout: 'fit',
                margins : '3 3 3 0',
				items: [ grid ]
			}
		]
	});

	/**
	 * 根据条件查询企业信息表
	 */
	function queryCodeItem() {
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				grp_id: grp_id
			}
		});
	}

	var editCodeWindow, editCodeFormPanel;
	editCodeFormPanel = new Ext.form.FormPanel(
		{
			id: 'editCodeFormPanel',
			name: 'editCodeFormPanel',
			collapsible: false,
			border: true,
			labelWidth: 75, // 标签宽度
			// frame : true, //是否渲染表单面板背景色
			labelAlign: 'right', // 标签对齐方式
			bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
			buttonAlign: 'center',
			height: 250,
			items: [
				{
					layout: 'column',
					border: false,
					items: [
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '所属企业',
									name: 'belong_grp_name',
									id: 'belong_grp_name',
									anchor: '100%',
									allowBlank: false,
									readOnly: true
								}
							]
						},
						{
							columnWidth: .66,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '企业名称' + re,
									name: 'name',
									id: 'name2',
									allowBlank: false,
									maxLength: 128,
									anchor: '100%'
								}
							]
						}
					]
				},
				{
					layout: 'column',
					border: false,
					items: [
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '企业简称',
									name: 'abbr',
									id: 'abbr2',
									maxLength: 16,
									anchor: '100%'
								}
							]
						},
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									xtype: 'numberfield', // 设置为数字输入框类型
									allowDecimals: false, // 是否允许输入小数
									allowNegative: false, // 是否允许输入负数
									fieldLabel: '企业规模',
									name: 'grp_size',
									minValue: 1,
									anchor: '100%'
								}
							]
						},
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '邮政编码',
									name: 'post_code',
									maxLength: 6,
									anchor: '100%'
								}
							]
						}
					]
				},
				{
					layout: 'column',
					border: false,
					items: [
						{
							columnWidth: .66,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '企业地址',
									name: 'addr',
									anchor: '100%',
									maxLength: 64
								}
							]
						},
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '传真号码',
									name: 'fax_no',
									maxLength: 12,
									anchor: '100%'
								}
							]
						}
					]
				},
				{
					layout: 'column',
					border: false,
					items: [

						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '负责人',
									maxLength: 32,
									name: 'ceo_name',
									anchor: '100%'
								}
							]
						},
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '联系电话', // 标签
									name: 'ceo_telno', // name:后台根据此name属性取值
									maxLength: 32,
									anchor: '100%' // 宽度百分比
								}
							]
						},
						{
							columnWidth: .33,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							defaultType: 'textfield',
							border: false,
							items: [
								{
									fieldLabel: '电子邮箱',
									name: 'email',
									regex: /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,// 验证电子邮件格式的正则表达式
									regexText: '电子邮件格式不合法', // 验证错误之后的提示信息
									anchor: '100%'
								}
							]
						}
					]
				},
				{
					layout: 'column',
					border: false,
					items: [
						{
							columnWidth: 1,
							layout: 'form',
							labelWidth: 75, // 标签宽度
							border: false,
							items: [
								{
									xtype: 'checkboxgroup',
									itemCls: 'x-check-group-alt',
									id: 'appCheckGroup',
									fieldLabel: '平台功能',
									items: [
										{
											inputValue: '1',
											checked: true,
											boxLabel: '基础功能管理',
											disabledClass: 'x-item',
											name: 'bas',
											id: 'bas'
										},
										{
											inputValue: '1',
											checked: true,
											boxLabel: '流程管理',
											disabledClass: 'x-item',
											name: 'flw',
											id: 'flw'
										},
										{
											inputValue: '1',
											checked: true,
											boxLabel: '数据分析',
											disabledClass: 'x-item',
											name: 'cnt',
											id: 'cnt'
										},
										{
											inputValue: '1',
											checked: true,
											boxLabel: '系统配置',
											disabledClass: 'x-item',
											name: 'arm',
											id: 'arm'
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
					items: [
						{
							xtype: 'textfield',
							name: 'belong_grp_id', // name:后台根据此name属性取值
							hidden: true,
							id: 'belong_grp_id',
							anchor: '100%' // 宽度百分比
						},
						{
							xtype: 'textfield',
							name: 'grp_id', // name:后台根据此name属性取值
							hidden: true,
							anchor: '100%' // 宽度百分比
						},
						{
							xtype: 'textfield',
							name: 'old_apps',
							id: 'old_apps',
							hidden: true,
							anchor: '100%' // 宽度百分比
						}
					]
				}
			]
		});
	editCodeWindow = new Ext.Window({
		layout: 'fit',
		width: 680, // 窗口宽度
		height: 250, // 窗口高度
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '企业信息详情',
		iconCls: 'page_addIcon',
		modal: true,
		collapsible: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ editCodeFormPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				id: 'grpSaveButton',
				handler: function () {
					if (flag == 'update') {//修改企业信息
						updateCodeItem();
					} else {//新增企业信息||关联企业信息
						saveCodeItem();
					}

				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					editCodeWindow.hide();
				}
			}
		]
	});

	/**
	 * 新增企业信息初始化
	 */
	function ininAddCodeWindow() {
		if (Ext.isEmpty(belong_grp_id)) {
			Ext.Msg.alert('提示', '请先选择所属企业信息!');
			return;
		}
		flag = 'save';
		clearFormPanel(editCodeFormPanel);
		Ext.getCmp('belong_grp_name').setValue(belong_grp_name);
		Ext.getCmp('belong_grp_id').setValue(belong_grp_id);

		setFormPanelReadOnly(editCodeFormPanel, false);
		Ext.getCmp("appCheckGroup").setDisabled(false);
		Ext.getCmp('belong_grp_name').setReadOnly(true);
		Ext.getCmp('grpSaveButton').show();

		editCodeWindow.show();
		editCodeWindow.setTitle("企业信息新增");
		match_dept_id = '';
	}

	/**
	 * 修改企业信息初始化
	 */
	function ininEditCodeWindow() {
		flag = 'update';
		var record = grid.getSelectionModel().getSelected();


		if (Ext.isEmpty(record)) {
			Ext.MessageBox.show({
				title: '警告',
				msg: "请先选择一条企业信息..",
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.WARNING
			});
			return;
		}
		editCodeWindow.show();

		setFormPanelReadOnly(editCodeFormPanel, false);

		//初始话表单中元素状态
		Ext.getCmp('belong_grp_name').setReadOnly(true);
		Ext.getCmp("appCheckGroup").setDisabled(false);
		editCodeFormPanel.getForm().loadRecord(record);

		loadAppsInfo(record);
		Ext.getCmp('old_apps').setValue(record.get('apps'));

		match_dept_id = record.get('match_dept_id');
		editCodeWindow.setTitle("企业信息修改");
		Ext.getCmp('grpSaveButton').show();
	}

	/**
	 * 企业详细信息初始化
	 */
	function ininDetailCodeWindow() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.show({
				title: '警告',
				msg: "请先选择一条企业信息..",
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.WARNING
			});
			return;
		}
		editCodeWindow.show();

		setFormPanelReadOnly(editCodeFormPanel, true);

		editCodeFormPanel.getForm().loadRecord(record);
		loadAppsInfo(record);
		Ext.getCmp("appCheckGroup").setDisabled(true);
		editCodeWindow.setTitle("企业信息详细");
		Ext.getCmp('grpSaveButton').hide();
	}

	/**
	 * 企业信息新增
	 */
	function saveCodeItem() {
		if (!editCodeFormPanel.form.isValid()) {
			return;
		}
		editCodeFormPanel.getForm().submit({
			url: './sysGrps.ered?reqCode=saveSysGrpsItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				editCodeWindow.hide();
				store.reload();
				deptTree.root.reload();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			params: {
				match_dept_id: match_dept_id,
				flag: flag,
				belong_dept_id: belong_dept_id
			}
		});
	}

	/**
	 * 企业信息修改
	 */
	function updateCodeItem() {
		if (!editCodeFormPanel.form.isValid()) {
			return;
		}
		editCodeFormPanel.getForm().submit({
			url: './sysGrps.ered?reqCode=updateSysGrpsItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				editCodeWindow.hide();
				store.reload();
				deptTree.root.reload();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			params: {
				match_dept_id: match_dept_id
			}
		});
	}

	//所属企业删除确认窗口
	var delWin = new Ext.Window({
		layout: 'fit',
		width: 320,
		height: 140,
		resizable: true,
		draggable: true,
		closeAction: 'hide',
		pageY: 100,
		modal: true,
		pageX: document.body.clientWidth / 2 - 200 / 2,
		title: '确定要删除该企业信息吗?',
		buttonAlign: 'right',
		border: false,
		animateTarget: Ext.getBody(),
		items: [
			{
				id: 'winHtml',
				html: '<div style="padding:10 5 0;">' +
					'<span style="color:red">全部删除</span>:删除对应的企业信息及<span style="color:red">部门信息</span></br>' +
					'<span style="color:red">删除企业</span>:删除对应的企业信息</br>' +
					'<span style="color:red">放弃删除</span>:不进行删除操作</div>'
			}
		],
		buttons: [
			{
				text: '全部删除',
				iconCls: 'deleteIcon',
				handler: function () {
					delGrpInfo('all');
				}
			},
			{
				text: '删除企业',
				iconCls: 'deleteIcon',
				handler: function () {
					delGrpInfo('grps');
				}
			},
			{
				text: '放弃删除',
				iconCls: 'page_delIcon',
				handler: function () {
					delWin.hide();
				}
			}
		]
	});

	/**
	 * 企业信息删除
	 */
	function deleteCodeItem() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选择企业信息!');
			return;
		}
		delWin.show();
	}

	function delGrpInfo(flag) {
		var record = grid.getSelectionModel().getSelected();
		Ext.Ajax.request({
			url: './sysGrps.ered?reqCode=deleteSysGrpsItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				//删除成功后初始化各个变量
				grp_id = '';
				belong_grp_id = '';
				belong_grp_name = '';
				old_belong_dept_id = 'notnull';//设置旧的关联部门和选择的部门不同
				deptTree.root.reload();
				store.reload();
				Ext.MessageBox.alert('提示', resultArray.msg);
				delWin.hide();
			},
			failure: function (response) {
				var resultArray = Ext.util.JSON
					.decode(response.responseText);
				Ext.MessageBox.alert('提示', resultArray.msg);
			},
			params: {
				grp_id: record.get('grp_id'),
				match_dept_id: record.get('match_dept_id'),
				flag: flag
			}
		});
	}

	/**
	 * 解析record中的apps字段
	 * @param record
	 */
	function loadAppsInfo(record) {
		var apps = record.get('apps').split(",");
		var keys = ["bas", "flw", "cnt", "arm"];
		Ext.getCmp("appCheckGroup").reset();
		for (var i = 0; i < apps.length; i++) {
			var value = apps[i];
			if (value == '0')
				Ext.getCmp(keys[i]).setValue(false);
		}
	}

	/**
	 * 设置表单元素只读属性
	 * @param formpanel 表单
	 * @param value 是否只读 false|true
	 */
	function setFormPanelReadOnly(formpanel, value) {
		var typeArray = ['textfield', 'combo', 'datefield', 'textarea', 'numberfield', 'htmleditor', 'timefield'];
		for (var i = 0; i < typeArray.length; i++) {
			var typeName = typeArray[i];
			var itemArray = formpanel.findByType(typeName);
			for (var j = 0; j < itemArray.length; j++) {
				var element = itemArray[j];
				element.setReadOnly(value);
			}
		}
	}
});