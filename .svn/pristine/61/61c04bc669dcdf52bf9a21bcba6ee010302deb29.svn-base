/************************************************
 * 创建日期: 2013-05-19
 * 创建作者：may
 * 功能：角色管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var dept_id, click_dept_id, check_role_id;

	var cust_id_str = '', prod_ord_seq_str = '';//部分选择时选中的生产通知单记录信息

	var mode;//操作类型
	var re = '<span style="color:red">*</span>';

	var root = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		expanded: true,
		id: '001'
	});
	var deptTree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			baseAttrs: {},
			dataUrl: './sysDept.ered?reqCode=departmentTreeInit'
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
	var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
		header: '角色编号',
		dataIndex: 'role_id',
		hidden: false,
		width: 80,
		sortable: true
	}, {
		header: '角色名称',
		dataIndex: 'role_name',
		width: 120
	}, {
		header: '所属部门',
		dataIndex: 'dept_name',
		width: 180
	}, {
		header: '角色类型',
		dataIndex: 'role_type',
		width: 80,
		renderer: function (value) {
			if (value == '1')
				return '普通员工';
			else if (value == '2')
				return '企业操作员';
			else if (value == '3')
				return '企业管理员';
		}
	}, {
		header: '角色状态',
		dataIndex: 'locked',
		width: 60,
		renderer: function (value) {
			if (value == '1')
				return '锁定';
			else
				return '正常';
		}
	}, {
		id: 'remark',
		header: '备注',
		dataIndex: 'remark'
	}]);

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
				name: 'role_id'
			},
			{
				name: 'role_name'
			},
			{
				name: 'locked'
			},
			{
				name: 'role_type'
			},
			{
				name: 'dept_id'
			},
			{
				name: 'dept_name'
			},
			{
				name: 'remark'
			}
		])
	});
	// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		this.baseParams = {
			role_name: Ext.getCmp('role_name').getValue(),
			dept_id: dept_id
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
		value: 20,
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
		items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
	});

	var grid = new Ext.grid.GridPanel(
		{
			title: '<img src="./resource/image/ext/award_star_silver_3.png" align="top" class="IEPNG"><span style="font-weight:normal">角色信息表</span>',
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
					text: '菜单授权',
					iconCls: 'page_excelIcon',
					handler: function () {
						window4MenuGrantInit();
					}
				},
				'-',
				{
					text: '数据授权',
					iconCls: 'page_addIcon',
					handler: function () {
						window4DataGrantInit();
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
					id: 'role_name',
					name: 'role_name',
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

	var addRoot = new Ext.tree.AsyncTreeNode({
		text: '根节点',
		id: '001',
		expanded: true
	});

	var addDeptTree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			dataUrl: './sysDept.ered?reqCode=departmentTreeInit'
		}),
		root: addRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	// 监听下拉树的节点单击事件
	addDeptTree.on('click', function (node) {
		click_dept_id = node.id;
		comboxWithTree.setValue(node.text);
		comboxWithTree.collapse();
	});

	var comboxWithTree = new Ext.form.ComboBox({
		id: 'match_deptid',
		name: 'dept_name',
		hiddenName: 'dept_name',
		store: new Ext.data.SimpleStore({
			fields: [],
			data: [
				[]
			]
		}),
		fieldLabel: '所属部门' + re,
		editable: false,
		value: ' ',
		emptyText: '请选择...',
		anchor: '99%',
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
		addDeptTree.root.expand();
	});

	var typeStore = new Ext.data.SimpleStore({
		fields: [ 'value', 'text' ],
		data: [
			[ '1', '普通员工' ],
			[ '2', '企业操作员' ],
			[ '3', '企业管理员' ]
		]
	});

	var roleTypeCombo = new Ext.form.ComboBox({
		name: 'role_type',
		hiddenName: 'role_type',
        id:'role_type_combo',
		store: typeStore,
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		fieldLabel: '角色类型'+ re,
		emptyText: '角色类型',
		forceSelection: true,
		allowBlank: false,
		editable: false,
		typeAhead: true,
		anchor: '99%'
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
				name: 'role_name',
				id: 'role_name',
				allowBlank: false,
				maxLength: 20,
				anchor: '99%'
			},
			roleTypeCombo,
			comboxWithTree,
			{
				fieldLabel: '备注',
				name: 'remark',
				id: 'remark',
				allowBlank: true,
				anchor: '99%'
			},
			{
				id: 'deptid_old',
				name: 'deptid_old',
				hidden: true
			},
			{
				id: 'role_id',
				name: 'role_id',
				hidden: true
			}
		]
	});

	var addRoleWindow = new Ext.Window({
		layout: 'fit',
		width: 260,
		height: 200,
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
                    addRoleFormPanel.getForm().reset();
//					roleTypeCombo.reset();
//					comboxWithTree.setValue('');
					dept_id = '';
//					Ext.getCmp("rolename").setValue("");
//					Ext.getCmp("remark").setValue("");
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
				title: '<span style="font-weight:normal">企业部门信息</span>',
				iconCls: 'chart_organisationIcon',
				tools: [
					{
						id: 'refresh',
						handler: function () {
							deptTree.root.reload();
						}
					}
				],
				collapsible: true,
				split: true,
				width: 200,
				minSize: 140,
				maxSize: 280,
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
	 * 根据条件查询角色
	 */
	function queryRoleItem() {
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				role_name: Ext.getCmp('role_name').getValue(),
				dept_id: dept_id
			}
		});
	}

	/**
	 * 新增角色初始化
	 */
	function addInit() {
		mode = 'add';//增加角色
		clearFormPanel(addRoleFormPanel);
		dept_id = '';
        Ext.getCmp('role_type_combo').setValue('1');
		addRoleWindow.show();
		addRoleWindow.setTitle('新增角色<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('btnReset').show();
	}

	/**
	 * 保存角色数据
	 */
	function saveRoleItem() {
		if (!addRoleFormPanel.form.isValid()) {
			return;
		}
		addRoleFormPanel.getForm().submit({
			url: './role.ered?reqCode=saveRoleItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addRoleWindow.hide();
				store.reload();
				form.reset();
				var role_id = action.result.role_id;
				roleGrantInit(role_id);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '角色数据保存失败:<br>' + msg);
			},
			params: {
				dept_id: click_dept_id
			}
		});
	}

	/**
	 * 删除角色
	 */
	function deleteRoleItems() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}

		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>删除角色将同时删除和角色相关的权限信息,请慎重.</span><br>继续删除吗?',
			function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg('正在删除!请等待');
					Ext.Ajax.request({
						url: './role.ered?reqCode=deleteRoleItems',
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
							role_id: record.get('role_id')
						}
					});
				}
			}
		);
	}

	/**
	 * 修改角色初始化
	 */
	function editInit() {
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

		addRoleFormPanel.getForm().loadRecord(record);
		addRoleWindow.show();
		addRoleWindow.setTitle('修改角色<span style="color:Red">(*为必填项)</span>');

		//初始化
		Ext.getCmp('deptid_old').setValue(record.get('dept_id'));
		Ext.getCmp('role_id').setValue(record.get('role_id'));
		Ext.getCmp('btnReset').hide();
	}

	/**
	 * 修改角色数据
	 */
	function updateRoleItem() {
		if (!addRoleFormPanel.form.isValid()) {
			return;
		}
		addRoleFormPanel.getForm().submit({
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
			},
			params: {
				dept_id: click_dept_id
			}
		});
	}

	function window4MenuGrantInit() {
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

		check_role_id = record.get('role_id');
		if (showMenuTreeRoot.isLoaded) {
			showMenuTreeRoot.reload();
		}
		if (manageMenuTreeRoot.isLoaded) {
			manageMenuTreeRoot.reload();
		}
		roleGrantWindow.show();
	}

	/*************************菜单授权窗口开始*************************/
	var showMenuTreeRoot = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		expanded: true,
		id: '001'
	});

	var showMenuTreeLoad = new Ext.tree.TreeLoader({
		dataUrl: './role.ered?reqCode=menuGrantTreeInit'
	});

	showMenuTreeLoad.on("beforeload", function (treeLoader, node) {
		treeLoader.baseParams.role_id = check_role_id;
		treeLoader.baseParams.showMenu = 'showMenu';
	}, this);

	var showMenuTree = new Ext.tree.TreePanel({
		id: 'showMenuTree',
		loader: showMenuTreeLoad,
		root: showMenuTreeRoot,
		title: '操作权限管理',
		region: 'west',
		autoScroll: true,
		width: 300,
		minSize: 140,
		maxSize: 300,
		collapsible: true,
		split: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	var panel = new Ext.Panel({
		region: 'center',
		autoScroll: true
	});

	var manageMenuTreeRoot = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		expanded: true,
		id: '01'
	});

	var manageMenuTreeLoad = new Ext.tree.TreeLoader({
		baseAttrs: {},
		dataUrl: './role.ered?reqCode=menuGrantTreeInit'
	});

	manageMenuTreeLoad.on("beforeload", function (treeLoader, node) {
		treeLoader.baseParams.role_id = check_role_id;
		treeLoader.baseParams.manageMenu = 'manageMenu';
	}, this);

	var manageMenuTree = new Ext.tree.TreePanel({
		id: 'manageMenuTree',
		loader: manageMenuTreeLoad,
		root: manageMenuTreeRoot,
		title: '授权菜单管理',
		region: 'east',
		autoScroll: true,
		width: 300,
		minSize: 140,
		maxSize: 300,
		collapsible: true,
		split: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	var roleGrantPanel = new Ext.Panel({
		id: 'roleGrantPanel',
		name: 'roleGrantPanel',
		labelAlign: 'right',
		labelWidth: 65,
		layout: 'border',
		border: false,
		items: [showMenuTree, panel, manageMenuTree ]
	});

	var roleGrantWindow = new Ext.Window({
		layout: 'fit',
		width: 630,
		height: 200,
		height: document.body.clientHeight,
		closeAction: 'hide',
		title: '角色授权',
		iconCls: 'award_star_silver_3Icon',
		pageY: 15,
		pageX: document.body.clientWidth / 2 - 420 / 2,
		collapsible: true,
		maximizable: false,
		modal: true,
		resizable: false,
		draggable: true,
		constrain: true,
		buttonAlign: 'right',
		items: [roleGrantPanel],
		buttons: [
			{
				text: '重置',
				id: 'reset',
				handler: function () {
					showMenuTree.root.reload();
					manageMenuTree.root.reload();
				}
			},
			{
				text: '确认授权',
				id: 'sure',
				handler: function () {
					var showMenuTreeCheckedNodes = showMenuTree.getChecked();
					var showMenuMenuIds = "";
					for (var i = 0; i < showMenuTreeCheckedNodes.length; i++) {
						var checkNode = showMenuTreeCheckedNodes[i];
						showMenuMenuIds = showMenuMenuIds + checkNode.attributes.id + ";";
					}
					if (showMenuMenuIds != "") {
						showMenuMenuIds = showMenuMenuIds.substring(0, showMenuMenuIds.length - 1);
					}

					var manageMenuTreeCheckedNodes = manageMenuTree.getChecked();
					var manageMenuMenuIds = "";
					for (var i = 0; i < manageMenuTreeCheckedNodes.length; i++) {
						var checkNode = manageMenuTreeCheckedNodes[i];
						manageMenuMenuIds = manageMenuMenuIds + checkNode.attributes.id + ";";
					}
					if (manageMenuMenuIds != "") {
						manageMenuMenuIds = manageMenuMenuIds.substring(0, manageMenuMenuIds.length - 1);
					}

					Ext.Ajax.request({
						url: './role.ered?reqCode=saveRoleMenuGrant',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							showMenuMenuIds: showMenuMenuIds,
							manageMenuMenuIds: manageMenuMenuIds,
							role_id: check_role_id
						}
					});

				}
			}
		]
	});

	//屏蔽树节点双击收起时间
	Ext.override(Ext.tree.TreeNodeUI, {
		onDblClick: function (e) {
			e.preventDefault();
			if (this.disabled) {
				return;
			}
			if (this.checkbox) {

			}
			if (!this.animating && this.node.hasChildNodes()) {
				var isExpand = this.node.ownerTree.doubleClickExpand;
				if (isExpand) {
					this.node.toggle();
				}
			}
			this.fireEvent("dblclick", this.node, e);
		}
	});
	/********************菜单授权结束************************/

	/********************相对授权窗口开始***********************/
	var flagTypeCombo = new Ext.form.ComboBox({
		name: 'flagtype',
		hiddenName: 'flagtype',
		store: new Ext.data.SimpleStore({
			fields: ['value', 'text'],
			data: [
//            ['1', '当前人员'],
				['2', '当前部门'],
				['3', '分管分厂'],
				['4', '分管部门'],
				['5', '东奥所有']
			]
		}),
		id: 'flagTypeComboId',
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		fieldLabel: '授权类型',
		emptyText: '请选择...',
		allowBlank: false,
		forceSelection: true,
		editable: false,
		typeAhead: true,
		anchor: "90%"
	});

	var otherForm = new Ext.form.FormPanel({
		labelAlign: 'right',
		labelWidth: 60,
		frame: true,
		items: [
			{
				layout: 'column',
				items: [
					{
						columnWidth: 1,
						layout: 'form',
						defaultType: 'textfield',
						items: [flagTypeCombo]
					}
				]
			}
		]
	});

	var otherWindow = new Ext.Window({
		layout: 'fit',
		width: 280,
		height: 150,
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '权限授权',
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
		items: [otherForm],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {

					Ext.Ajax.request({
						url: './dataPerm.ered?reqCode=saveDataRoleGrant4Classify',
						success: function (response) {
							hideWaitMsg();
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							hideWaitMsg();
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							other: flagTypeCombo.getValue(),
							role_id: check_role_id
						}
					});
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					otherWindow.hide();
				}
			}
		]
	});
	/********************相对授权窗口结束***********************/


	/********************详细授权窗口**************************/

	/************部门权限窗口开始*********/
	var selectDeptTreeRoot = new Ext.tree.AsyncTreeNode({
		text: '根部门',
		id: '001',
		expanded: true,
		iconCls: 'folder_userIcon'
	});

	var selectDeptTreeLoader = new Ext.tree.TreeLoader({
		dataUrl: './dataPerm.ered?reqCode=departmentTreeInit'
	});

	selectDeptTreeLoader.on("beforeload", function (treeLoader, node) {
		treeLoader.baseParams.role_id = check_role_id;
	}, this);

	var selectDeptTree = new Ext.tree.TreePanel({
		loader: selectDeptTreeLoader,
		root: selectDeptTreeRoot,
		title: '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">部门权限',
		autoScroll: true,
		animate: false,
		useArrows: false,
		layout: 'fit',
		border: false,
		rootVisible: false
	});
	/**********************部门选择窗口结束******************************/

	/**********************人员选择窗口开始******************************/
	var select_deptid = dept_id;

	var select_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});

	/** 定义列表显示区块 */
	var select_cm = new Ext.grid.ColumnModel([ select_sm, {
		header: '',
		align: 'center',
		dataIndex: 'account',
		width: 99,
		hidden: true
	}, {
		header: '部门编号',
		align: 'center',
		dataIndex: 'dept_id',
		width: 99,
		hidden: true
	}, {
		align: 'right',
		dataIndex: 'deptname1',
		width: 120,
		sortable: true
	}, {
		header: '部门',
		align: 'center',
		dataIndex: 'deptname2',
		width: 100,
		sortable: true
	}, {
		align: 'left',
		dataIndex: 'deptname3',
		width: 100,
		sortable: true
	}, {
		header: '工号',
		align: 'center',
		dataIndex: 'per_no',
		width: 99,
		sortable: true
	}, {
		header: '姓名',
		align: 'center',
		dataIndex: 'user_name',
		width: 99,
		sortable: true
	}, {
		header: '身份证号',
		align: 'center',
		dataIndex: 'id_crd',
		width: 99,
		sortable: true
	}]);

	/**
	 * 数据存储
	 */
	var select_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './dataPerm.ered?reqCode=queryUserInfo4RoleGrant'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'dept_id'
			},
			{
				name: 'deptname1'
			},
			{
				name: 'deptname2'
			},
			{
				name: 'deptname3'
			},
			{
				name: 'account'
			},
			{
				name: 'per_no'
			},
			{
				name: 'user_name'
			},
			{
				name: 'crd_no'
			},
			{
				name: 'id_crd'
			}
		]),
		remoteSort: true
	});

	select_store.on('beforeload', function () {
		this.baseParams = {
			start: 0,
			limit: select_bbar.pageSize,
			selectModel: '',
			deptid: select_deptid,
			role_id: check_role_id,
			per_no: Ext.getCmp("select_per_no").getValue(),
			user_name: Ext.getCmp("select_user_name").getValue(),
			id_crd: Ext.getCmp("select_id_crd").getValue()
		};
	});

	var select_pagesize_combo = new Ext.form.ComboBox({
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

	var select_number = parseInt(select_pagesize_combo.getValue());
	select_pagesize_combo.on("select", function (comboBox) {
		select_bbar.pageSize = parseInt(comboBox.getValue());
		select_number = parseInt(comboBox.getValue());
		select_store.reload({
			params: {
				start: 0,
				limit: select_bbar.pageSize
			}
		});
	});
	var select_bbar = new Ext.PagingToolbar({
		pageSize: select_number,
		store: select_store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', select_pagesize_combo]
	});

	var select_addRoot = new Ext.tree.AsyncTreeNode({
		text: '根节点',
		id: '001',
		expanded: true
	});

	var select_addDeptTree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			dataUrl: './dataPerm.ered?reqCode=departmentInfoInit'
		}),
		root: select_addRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	// 监听下拉树的节点单击事件
	select_addDeptTree.on('click', function (node) {
		select_comboxWithTree.setValue(node.text);
		select_deptid = node.id;
		select_comboxWithTree.collapse();
	});

	var select_comboxWithTree = new Ext.form.ComboBox({
		id: 'select_deptid',
		store: new Ext.data.SimpleStore({
			fields: [],
			data: [
				[]
			]
		}),
		editable: false,
		value: ' ',
		emptyText: '请选择...',
		anchor: '100%',
		mode: 'local',
		triggerAction: 'all',
		maxHeight: 390,
		// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
		tpl: "<tpl for='.'><div style='height:390px'><div id='select_addDeptTreeDiv'></div></div></tpl>",
		allowBlank: false,
		onSelect: Ext.emptyFn
	});
	// 监听下拉框的下拉展开事件
	select_comboxWithTree.on('expand', function () {
		// 将UI树挂到treeDiv容器
		select_addDeptTree.render('select_addDeptTreeDiv');
		select_addDeptTree.root.expand(); //只是第一次下拉会加载数据
	});
	var selectUserGrid = new Ext.grid.GridPanel({
		store: select_store,
		id: 'select_usergrid',
		border: true,
		layout:'fit',
		title: "人员信息",
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		viewConfig:{
			forceFit:true
		},
		stripeRows: true,
		frame: true,
		cm: select_cm,
		sm: select_sm,
		bbar: select_bbar,
		tbar: ['-', "<SPAN STYLE='font:normal 10pt Arial'>部门：</SPAN>",
			select_comboxWithTree,
			'-', "<SPAN STYLE='font:normal 10pt Arial'>工号：</SPAN>",
			new Ext.form.TextField({
				name: 'per_no',
				id: 'select_per_no',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							querySelectUserInfo();
						}
					}
				},
				width: 60
			}),
			'-', "<SPAN STYLE='font:normal 10pt Arial'>姓名：</SPAN>",
			new Ext.form.TextField({
				name: 'user_name',
				id: 'select_user_name',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							querySelectUserInfo();
						}
					}
				},
				width: 60
			}) ,
			'-', "<SPAN STYLE='font:normal 10pt Arial'>身份证号:</SPAN>",
			new Ext.form.TextField({
				name: 'id_crd',
				id: 'select_id_crd',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							querySelectUserInfo();
						}
					}
				},
				width: 100
			}),
			'->', {
				text: '查询',
				iconCls: 'previewIcon',
				handler: function () {
					querySelectUserInfo();
				}},
			'-', {
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					select_comboxWithTree.reset();
					select_deptid = '';
					Ext.getCmp('select_per_no').setValue("");
					Ext.getCmp('select_user_name').setValue("");
					Ext.getCmp('select_id_crd').setValue("");
				}
			}
		]
	});

	function querySelectUserInfo() {
		select_store.load({
			params: {
				start: 0,
				limit: select_bbar.pageSize,
				dept_id: select_deptid,
				role_id: check_role_id,
				selectModel: '',
				per_no: Ext.getCmp("select_per_no").getValue(),
				user_name: Ext.getCmp("select_user_name").getValue(),
				id_crd: Ext.getCmp("select_id_crd").getValue()
			}
		});
	};
	/**********************人员选择窗口结束******************************/

	/**********************人员查询窗口开始******************************/
	var check_deptid = dept_id;

	var check_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});

	/** 定义列表显示区块 */
	var check_cm = new Ext.grid.ColumnModel([ check_sm, {
		header: '',
		align: 'center',
		dataIndex: 'account',
		width: 99,
		hidden: true
	}, {
		header: '部门编号',
		align: 'center',
		dataIndex: 'dept_id',
		width: 99,
		hidden: true
	}, {
		align: 'right',
		dataIndex: 'deptname1',
		width: 120,
		sortable: true
	}, {
		header: '部门',
		align: 'center',
		dataIndex: 'deptname2',
		width: 100,
		sortable: true
	}, {
		align: 'left',
		dataIndex: 'deptname3',
		width: 100,
		sortable: true
	}, {
		header: '工号',
		align: 'center',
		dataIndex: 'per_no',
		width: 99,
		sortable: true
	}, {
		header: '姓名',
		align: 'center',
		dataIndex: 'user_name',
		width: 99,
		sortable: true
	}, {
		header: '身份证号',
		align: 'center',
		dataIndex: 'id_crd',
		width: 99,
		sortable: true
	}]);

	/**
	 * 数据存储
	 */
	var check_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './dataPerm.ered?reqCode=queryUserInfo4RoleGrant'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'dept_id'
			},
			{
				name: 'deptname1'
			},
			{
				name: 'deptname2'
			},
			{
				name: 'deptname3'
			},
			{
				name: 'account'
			},
			{
				name: 'per_no'
			},
			{
				name: 'user_name'
			},
			{
				name: 'crd_no'
			},
			{
				name: 'id_crd'
			}
		]),
		remoteSort: true
	});

	check_store.on('beforeload', function () {
		this.baseParams = {
			start: 0,
			limit: check_bbar.pageSize,
			selectModel: 'notNull',
			dept_id: check_deptid,
			role_id: check_role_id,
			per_no: Ext.getCmp("check_per_no").getValue(),
			user_name: Ext.getCmp("check_user_name").getValue(),
			id_crd: Ext.getCmp("check_id_crd").getValue()
		};
	});

	var check_pagesize_combo = new Ext.form.ComboBox({
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

	var check_number = parseInt(check_pagesize_combo.getValue());
	check_pagesize_combo.on("select", function (comboBox) {
		check_bbar.pageSize = parseInt(comboBox.getValue());
		check_number = parseInt(comboBox.getValue());
		check_store.reload({
			params: {
				start: 0,
				limit: check_bbar.pageSize
			}
		});
	});
	var check_bbar = new Ext.PagingToolbar({
		pageSize: check_number,
		store: check_store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', check_pagesize_combo]
	});

	var check_dept_root = new Ext.tree.AsyncTreeNode({
		text: '根节点',
		id: '001',
		expanded: true
	});

	var check_dept_tree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			dataUrl: './dataPerm.ered?reqCode=departmentInfoInit'
		}),
		root: check_dept_root,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	// 监听下拉树的节点单击事件
	check_dept_tree.on('click', function (node) {
		check_comboxWithTree.setValue(node.text);
		check_deptid = node.id;
		check_comboxWithTree.collapse();
	});

	var check_comboxWithTree = new Ext.form.ComboBox({
		id: 'check_deptid',
		store: new Ext.data.SimpleStore({
			fields: [],
			data: [
				[]
			]
		}),
		editable: false,
		value: ' ',
		emptyText: '请选择...',
		anchor: '100%',
		mode: 'local',
		triggerAction: 'all',
		maxHeight: 390,
		// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
		tpl: "<tpl for='.'><div style='height:390px'><div id='check_addDeptTreeDiv'></div></div></tpl>",
		allowBlank: false,
		onSelect: Ext.emptyFn
	});
	// 监听下拉框的下拉展开事件
	check_comboxWithTree.on('expand', function () {
		// 将UI树挂到treeDiv容器
		check_dept_tree.render('check_addDeptTreeDiv');
		check_dept_tree.root.expand(); //只是第一次下拉会加载数据
	});
	var checkUserGrid = new Ext.grid.GridPanel({
		store: check_store,
		id: 'check_usergrid',
		border: true,
		layout:'fit',
		title: "已选择人员",
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
		cm: check_cm,
		sm: check_sm,
		bbar: check_bbar,
		viewConfig:{
			forceFit:true
		},
		tbar: ['-', "<SPAN STYLE='font:normal 10pt Arial'>部门：</SPAN>",
			check_comboxWithTree,
			'-', "<SPAN STYLE='font:normal 10pt Arial'>工号：</SPAN>",
			new Ext.form.TextField({
				name: 'per_no',
				id: 'check_per_no',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryUserInfo();
						}
					}
				},
				width: 60
			}),
			'-', "<SPAN STYLE='font:normal 10pt Arial'>姓名：</SPAN>",
			new Ext.form.TextField({
				name: 'user_name',
				id: 'check_user_name',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryUserInfo();
						}
					}
				},
				width: 60
			}) ,
			'-', "<SPAN STYLE='font:normal 10pt Arial'>身份证号:</SPAN>",
			new Ext.form.TextField({
				name: 'id_crd',
				id: 'check_id_crd',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryUserInfo();
						}
					}
				},
				width: 100
			}),
			'->', {
				text: '查询',
				iconCls: 'previewIcon',
				handler: function () {
					queryUserInfo();
				}},
			'-', {
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					check_comboxWithTree.reset();
					check_deptid = '';
					Ext.getCmp('check_per_no').setValue("");
					Ext.getCmp('check_user_name').setValue("");
					Ext.getCmp('check_id_crd').setValue("");
				}
			}, '-', {
				text: '人员权限删除',
				iconCls: 'page_delIcon',
				handler: function () {
					Ext.MessageBox.confirm('请确认', '确认删除这些人员权限吗?', function (btn, text) {
						if (btn == 'yes') {

							//获取要删除的人员信息
							var records = checkUserGrid.getSelectionModel().getSelections();
							var perids = jsArray2JsString(records, 'account');

							showWaitMsg("删除中,请等待!");
							//更新权限
							Ext.Ajax.request({
								url: './dataPerm.ered?reqCode=delUserInfo4RoleData',
								success: function (response) {
									hideWaitMsg();
									var resultArray = Ext.util.JSON.decode(response.responseText);
									Ext.Msg.alert('提示', resultArray.msg);
									check_store.reload();
								},
								failure: function (response) {
									hideWaitMsg();
									var resultArray = Ext.util.JSON.decode(response.responseText);
									Ext.Msg.alert('提示', resultArray.msg);
								},
								params: {
									perids: perids,
									role_id: check_role_id
								}
							});
						}
					});
				}
			}]
	});

	function queryUserInfo() {
		check_store.load({
			params: {
				start: 0,
				limit: check_bbar.pageSize,
				selectModel: 'notNull',
				role_id: check_role_id,
				dept_id: check_deptid,
				per_no: Ext.getCmp("check_per_no").getValue(),
				user_name: Ext.getCmp("check_user_name").getValue(),
				id_crd: Ext.getCmp("check_id_crd").getValue()
			}
		});
	}

	var selectUserTab = new Ext.TabPanel({
		activeTab: 0,
		id: 'selectUserTab',
		title: '<img src="./resource/image/ext/user.png" align="top" class="IEPNG">人员权限',
		plain: true,// True表示为不渲染tab候选栏上背景容器图片
		defaults: {
			autoScroll: true
		},
		items: [selectUserGrid, checkUserGrid]
	});

	/**********************人员授权窗口结束******************************/

	/**********************客户授权窗口开始******************************/
	var cust_root = new Ext.tree.AsyncTreeNode({
		text: '部门树',
		expanded: true,
		id: '001'
	});
	var cust_tree_loader = new Ext.tree.TreeLoader({
		dataUrl: './dataPerm.ered?reqCode=getCustBasInfoTree'
	});
	cust_tree_loader.on("beforeload", function (treeLoader, node) {
		treeLoader.baseParams.role_id = check_role_id;
	}, this);

	var cust_tree = new Ext.tree.TreePanel({
		loader: cust_tree_loader,
		id: 'cust_tree',
		root: cust_root,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	cust_tree.on('checkchange', function (node) {
//		alert(cust_tree.getChecked('cust_id'));
		var cust_names = cust_tree.getChecked('cust_name').toString();
		var cust_ids = cust_tree.getChecked('cust_id').toString();

		var cust_name_str = "";
		var arr = cust_names.split(',');
		for (var i = 0; i < arr.length; i++) {
			var str = arr[i];
			if (str != '') {
				cust_name_str = cust_name_str + str + ","
			}
		}
		if (cust_name_str.length > 0) {
			cust_name_str = cust_name_str.substring(0, cust_name_str.length - 1);
		}
		var custString = '';
		var arr2 = cust_ids.split(',');
		for (var i = 0; i < arr2.length; i++) {
			var str = arr2[i];
			if (str != '') {
				custString = custString + str + ","
			}
		}
		if (custString.length > 0) {
			custString = custString.substring(0, custString.length - 1);
		}


		if (custString != cust_id_str) {//如果不相等则修改选择的客户信息并重新加载生产通知单
			cust_id_str = custString;
			if (Ext.getCmp('custType').getValue() == '1') {//部分选择时
				//选择的时候加载
				prodOrdStore.load({
					params: {
						role_id: check_role_id,
						cust_id_str: cust_id_str
					}
				});
			}
		}

		cust_comboBox.setValue(cust_name_str);

//		cust_comboBox.collapse();
	});

	var cust_comboBox = new Ext.form.ComboBox({
		name: 'cust_id',
		hiddenName: 'cust_id',
		store: new Ext.data.SimpleStore({
			fields: [],
			data: [
				[]
			]
		}),
		fieldLabel: '客户' + re,
		editable: false,
		value: ' ',
		emptyText: '请选择...',
		anchor: '99%',
		mode: 'local',
		triggerAction: 'all',
		maxHeight: 390,
		// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
		tpl: "<tpl for='.'><div style='height:390px'><div id='custTreeDiv'></div></div></tpl>",
		allowBlank: false,
		onSelect: Ext.emptyFn
	});

	// 监听下拉框的下拉展开事件
	cust_comboBox.on('expand', function () {
		// 将UI树挂到treeDiv容器
		cust_tree.render('custTreeDiv');
		cust_tree.root.expand();
	});

	var custFormPanel = new Ext.form.FormPanel({
		labelAlign: 'right',
		region: 'center',
		labelWidth: 60,
		title: '<img src="./resource/image/ext/fkdjgl.png" align="top" class="IEPNG">客户授权',
		frame: true,
		items: [
			{
				layout: 'column',
				items: [
					{
						columnWidth: 1,
						layout: 'form',
						defaultType: 'textfield',
						items: [cust_comboBox, {
							fieldLabel: '授权类型',
							xtype: 'combo',
							hiddenName: 'cust_type',
							id: 'custType',
							triggerAction: 'all',
							mode: 'local',
							emptyText: '请选择...',
							store: new Ext.data.ArrayStore({
								fields: [ 'value', 'text' ],
								data: [
									[ '0', '全部权限' ],
									[ '1', '部分权限' ]
								]
							}),
							valueField: 'value',
							displayField: 'text',
							value: '0',
							editable: false,
							anchor: '99%',
							listeners: {
								'select': function (obj) {
									//获取客户授权类型  0-全部权限 1-部分权限
									//如果是1则需弹出完单号窗口
									var type = obj.getValue();
									if (type == '1') {
										if (cust_id_str == '') {
											Ext.Msg.alert('提示', '请先选择客户信息!');
											obj.setValue('0');
											return;
										}
										roleDataGrantTabPanel.add(prodOrdGrid);
										roleDataGrantTabPanel.setActiveTab(3);

//										prodOrdWindow.show();
										//要加载的通知单信息
										prodOrdStore.load({
											params: {
												role_id: check_role_id,
												cust_id_str: cust_id_str
											}
										});
									} else {
										roleDataGrantTabPanel.remove(prodOrdGrid);
									}
								}
							}
						}]
					}
				]
			}
		]
	});

	var prodOrdSm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});

	var prodOrdCm = new Ext.grid.ColumnModel([ prodOrdSm,
		new Ext.grid.RowNumberer(), {
			header: '完单号',
			dataIndex: 'prod_ord_seq',
			width: 80,
			sortable: true
		}, {
			header: '客户名称',
			dataIndex: 'cust_name',
			width: 80
		}, {
			header: '订单号',
			dataIndex: 'order_id',
			id: 'duty_name',
			width: 150,
			sortable: true
		}, {
			header: '款号',
			dataIndex: 'style_no',
			width: 150,
			sortable: true
		}, {
			dataIndex: 'checked',
			hidden: true,
			width: 150,
			sortable: true
		}]);
	// 数据存储
	var prodOrdStore = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './dataPerm.ered?reqCode=getProdOrdInfo4DataPerm'
		}),
		// 数据读取器
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',// 记录总数
			root: 'ROOT'// Json中的列表数据根节点
		}, [
			{name: 'cust_name'},
			{name: 'order_id'},
			{name: 'prod_ord_seq'},
			{name: 'style_no'},
			{name: 'checked'}
		])
	});

	prodOrdStore.on('load', function (obj) {

//        alert(dutyGridOnReady);

		for (var i = 0; i < obj.getCount(); i++) {
			var record = obj.getAt(i);

			if (record.get('checked') == '1') {
				prodOrdSm.selectRow(i, true);
			}
		}
	});

	var prodOrdGrid = new Ext.grid.GridPanel({
		store: prodOrdStore,
		title: '<img src="./resource/image/ext/kqskjl.png" align="top" class="IEPNG">订单授权',
		stripeRows: true,
		frame: true,
		cm: prodOrdCm,
		sm: prodOrdSm,
		viewConfig: {
			forceFit: true
		}
	});

	/**********************客户授权窗口结束******************************/
	var roleDataGrantTabPanel = new Ext.TabPanel({
		activeTab: 0,
		height: 350,
		autoDestroy: false,
		plain: true,// True表示为不渲染tab候选栏上背景容器图片
		defaults: {
			autoScroll: true
		},
		items: [selectDeptTree, selectUserTab, custFormPanel]
	});

//	roleDataGrantTabPanel.on('tabchange', function (tab, panel) {
//		if (panel.getId() == 'selectUserTab') {
//			roleDataGrantWindow.maximize();
//		} else {
//			if (roleDataGrantWindow.maximized) {
//				roleDataGrantWindow.toggleMaximize();
//			}
//		}
//	});

	var roleDataGrantWindow = new Ext.Window({
		layout: 'fit',
		width: 900,
		height: document.body.clientHeight,
		resizable: true,
		draggable: true,
		closeAction: 'hide',
		title: '角色数据授权',
		iconCls: 'award_star_silver_3Icon',
		modal: false,
		pageY: 15,
		collapsible: true,
		maximizable: true,
		buttonAlign: 'right',
		constrain: true,
		items: [roleDataGrantTabPanel],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					//获取部门选中的数据
					var checked = selectDeptTree.getChecked('id');
					var deptids = '' + checked;
					//获取人员选择的数据
					var userRecords = selectUserGrid.getSelectionModel().getSelections();
					var perids = jsArray2JsString(userRecords, 'account');

					//获取选择的客户数据  prod_ord_seq_str
					//'0', '全部权限' '1', '部分权限'
					var custType = Ext.getCmp('custType').getValue();//客户授权类型
					if (custType == '1') {
						var records = prodOrdGrid.getSelectionModel().getSelections();
						if (Ext.isEmpty(records)) {
							Ext.Msg.alert('提示', '请选择记录信息!');
							return;
						}
						prod_ord_seq_str = "" + jsArray2JsString(records, "prod_ord_seq");
					} else {
						prod_ord_seq_str = '';
					}
					showWaitMsg("正在授权请等待!");
					//更新权限
					Ext.Ajax.request({
						url: './dataPerm.ered?reqCode=saveDataRoleGrant',
						success: function (response) {
							hideWaitMsg();
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);

							select_store.removeAll();
							check_store.removeAll();

						},
						failure: function (response) {
							hideWaitMsg();
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							deptids: deptids,
							perids: perids,
							cust_type: custType,
							prod_ord_seq_str: prod_ord_seq_str,//选择的生产通知单信息
							cust_id_str: cust_id_str,//选择的客户信息
							role_id: check_role_id
						}
					});
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					roleDataGrantWindow.hide();
					//清空人员查询信息
					check_store.removeAll();
					check_comboxWithTree.reset();
					check_deptid = '';
					Ext.getCmp('check_per_no').setValue("");
					Ext.getCmp('check_user_name').setValue("");
					Ext.getCmp('check_id_crd').setValue("");
					select_store.removeAll();
					select_comboxWithTree.reset();
					select_deptid = '';
					Ext.getCmp('select_per_no').setValue("");
					Ext.getCmp('select_user_name').setValue("");
					Ext.getCmp('select_id_crd').setValue("");
				}
			}
		]
	});

	function window4DataGrantInit() {
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

		//设置全局变量role_id
		check_role_id = record.get('role_id');

		var deptid = record.get('deptid');
		var flag = record.get('flag');

		//加载授权部门树信息
		selectDeptTree.root.reload();

		//加载 客户授权信息
		Ext.Ajax.request({
			url: './dataPerm.ered?reqCode=getCustInfo4DataPerm',
			method: 'post',// 请求方式
			success: function (response) {// 加载成功的处理函数
				var resultArray = Ext.util.JSON.decode(response.responseText);

				cust_id_str = resultArray.cust_id_str;
				cust_comboBox.setValue(resultArray.cust_name_str);

				var custType = resultArray.cust_type;
				Ext.getCmp('custType').setValue(custType);
				if (custType == '1') {
					roleDataGrantTabPanel.add(prodOrdGrid);
					roleDataGrantTabPanel.setActiveTab(3);

					//要加载的通知单信息
					prodOrdStore.load({
						params: {
							role_id: check_role_id,
							cust_id_str: cust_id_str
						}
					});
				} else {
					roleDataGrantTabPanel.remove(prodOrdGrid);
				}
			},
			failure: function (response) {// 加载失败的处理函数
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', '加载失败!');
			},
			params: {
				role_id: check_role_id
			}
		});


		roleDataGrantWindow.show();
		if (cust_tree.root.isLoaded())
			cust_tree.root.reload();
		if (record.get('flag') == '3') {
			check_role_id = record.get('role_id');

			//加载 分类授权信息
			otherForm.getForm().load({
				url: './dataPerm.ered?reqCode=queryClassifyInfo4RoleGrant',
				method: 'post',// 请求方式
				success: function (form, action) {// 加载成功的处理函数
				},
				failure: function (form, action) {// 加载失败的处理函数
					Ext.Msg.alert('提示', action.result.msg);
				},
				params: {
					role_id: check_role_id
				}
			});
			otherWindow.show();
		}
	}

	/********************级联选中支持开始 ******************** */
	function cascadeParent() {
		var treeId = '' + this.attributes.id;
		if (treeId.indexOf('part') != -1) {
			return;
		}
		var pn = this.parentNode;
		if (!pn || !Ext.isBoolean(this.attributes.checked))
			return;
		if (this.attributes.checked) {// 级联选中
			pn.getUI().toggleCheck(true);
		} else {// 级联未选中
			var b = true;
			Ext.each(pn.childNodes, function (n) {
				if (n.getUI().isChecked()) {
					return b = false;
				}
				return true;
			});
			if (b)
				pn.getUI().toggleCheck(false);
		}
		pn.cascadeParent();
	}

	function cascadeChildren() {
		var ch = this.attributes.checked;
		if (!Ext.isBoolean(ch))
			return;
		Ext.each(this.childNodes, function (n) {

			n.getUI().toggleCheck(ch);
			n.cascadeChildren();
		});
	}

	// 为TreeNode对象添加级联父节点和子节点的方法
	Ext.apply(Ext.tree.TreeNode.prototype, {
		cascadeParent: cascadeParent,
		cascadeChildren: cascadeChildren
	});
	// Checkbox被点击后级联父节点和子节点
	Ext.override(Ext.tree.TreeEventModel, {
		onCheckboxClick: Ext.tree.TreeEventModel.prototype.onCheckboxClick
			.createSequence(function (e, node) {
				node.cascadeParent();
				node.cascadeChildren();
			})
	});
	/** ***************** 级联选中支持结束 ******************** */
});
