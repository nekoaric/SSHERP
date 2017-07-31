/************************************************
 * 创建日期: 2013-05-19
 * 创建作者：may
 * 功能：角色管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var dept_id, click_dept_id;
	var check_role_id;
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
			renderTo: 'roleGridDiv',
			height: 500,
			// width:600,
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
					text: '菜单授权',
					iconCls: 'page_excelIcon',
					handler: function () {
						window4GrantInit();
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
		store: typeStore,
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		fieldLabel: '角色类型',
		emptyText: '角色类型',
		forceSelection: true,
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
					roleTypeCombo.reset();
					comboxWithTree.setValue('');
					dept_id = '';
					Ext.getCmp("rolename").setValue("");
					Ext.getCmp("remark").setValue("");
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
							deptTree.root.reload()
						}
					}
				],
				collapsible: true,
				split: true,
				width: 200,
				minSize: 140,
				maxSize: 280,
				region: 'west',
				autoScroll: true,
				items: [ deptTree ]
			},
			{
				region: 'center',
				layout: 'fit',
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
				var roleid = action.result.roleid;
				roleGrantInit(roleid);
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

	/*************************菜单授权开始*************************/
	function window4GrantInit() {
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
		if(showMenuTreeRoot.isLoaded){
			showMenuTreeRoot.reload();
		}
		if(manageMenuTreeRoot.isLoaded){
			manageMenuTreeRoot.reload();
		}
		roleGrantWindow.show();
	}

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
		id:'showMenuTree',
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
		id:'manageMenuTree',
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
				handler: function(){
					showMenuTree.root.reload();
					manageMenuTree.root.reload();
				}
			},
			{
				text: '确认授权',
				id: 'sure',
				handler: function(){
					var showMenuTreeCheckedNodes = showMenuTree.getChecked();
					var showMenuMenuIds = "";
					for(var i = 0; i < showMenuTreeCheckedNodes.length; i++) {
						var checkNode = showMenuTreeCheckedNodes[i];
						showMenuMenuIds = showMenuMenuIds + checkNode.attributes.id + ";" ;
					}
					if(showMenuMenuIds!=""){
						showMenuMenuIds = showMenuMenuIds.substring(0,showMenuMenuIds.length-1);
					}

					var manageMenuTreeCheckedNodes = manageMenuTree.getChecked();
					var manageMenuMenuIds = "";
					for(var i = 0; i < manageMenuTreeCheckedNodes.length; i++) {
						var checkNode = manageMenuTreeCheckedNodes[i];
						manageMenuMenuIds = manageMenuMenuIds + checkNode.attributes.id + ";" ;
					}
					if(manageMenuMenuIds!=""){
						manageMenuMenuIds = manageMenuMenuIds.substring(0,manageMenuMenuIds.length-1);
					}

					Ext.Ajax.request({
						url : './role.ered?reqCode=saveRoleMenuGrant',
						success : function(response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure : function(response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params : {
							showMenuMenuIds : showMenuMenuIds,
							manageMenuMenuIds: manageMenuMenuIds,
							role_id:check_role_id
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

	/** ***************** 级联选中支持开始 ******************** */
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
})
;