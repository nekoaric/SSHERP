/************************************************
 * 创建日期: 2013-05-27
 * 创建作者：may|tangfh|lingm
 * 功能：部门管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/

Ext.onReady(function () {
	var re = '<span style="color:red">*</span>'
	var tmp_user_cnt = 0; // 该部门下的用户个数
	var tmp_subdept_cnt = 0; // 该部门下子部门个数

	var dept_id = root_dept_id;
	var flag;

	var userCntStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './sysDept.ered?reqCode=getUserCntInDept'
		}),
		reader: new Ext.data.JsonReader({}, [
			{ // 定义后台返回数据格式
				name: 'cnt'
			}
		])
	});
	var subDeptCntStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './sysDept.ered?reqCode=getSubDeptCntInDept'
		}),
		reader: new Ext.data.JsonReader({}, [
			{ // 定义后台返回数据格式
				name: 'cnt'
			}
		])
	});

	var root = new Ext.tree.AsyncTreeNode({
		text: root_dept_name,
		expanded: true,
		iconCls: 'folder_userIcon',
		id: root_dept_id
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
		border: false
	});
	deptTree.on('click', function (node) { // 左键单击
		Ext.getCmp('queryParam').setValue('');
		dept_id = node.attributes.id;
		natureBindPanel.hide();
//		reloadNatureTree();	//加载数量性质的数据
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				dept_id: dept_id
			}
		});

		// 获取单位下用户个数
		userCntStore.load({
			params: {
				dept_id: dept_id
			}
		});
		// 获取单位下子部门个数
		subDeptCntStore.load({
			params: {
				dept_id: dept_id
			}
		});
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	/** 定义列表显示区块 */
	var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
		header: '部门编号',
		dataIndex: 'dept_id',
		width: 130,
		sortable: true
	}, {
		header: '部门名称',
		dataIndex: 'dept_name',
		width: 130
	}, {
		header: '上级部门',
		dataIndex: 'parentdept_name',
		width: 130
	}, {
		header: '部门地址',
		dataIndex: 'address',
		width: 130
	}, {
		header: '部门联系人',
		dataIndex: 'lnk_name',
		width: 100
	}, {
		header: '联系电话',
		dataIndex: 'lnk_telno'
	}, {
		id: 'remark',
		header: '备注',
		dataIndex: 'remark'
	}, {
		header: '节点类型',
		dataIndex: 'leaf',
		hidden: true,
		renderer: function (value) {
			if (value == '1')
				return '叶子节点';
			else if (value == '0')
				return '树枝节点';
			else
				return value;
		}
	}, {
		id: 'parent_id',
		header: '父节点编号',
		hidden: true,
		dataIndex: 'parent_id'
	}, {
		id: 'usercount',
		header: '下属用户数目',
		hidden: true,
		dataIndex: 'usercount'
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './sysDept.ered?reqCode=queryDeptsForManage'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'dept_id'
			},
			{
				name: 'dept_name'
			},
			{
				name: 'parentdept_name'
			},
			{
				name: 'lnk_name'
			},
			{
				name: 'lnk_telno'
			},
			{
				name: 'leaf'
			},
			{
				name: 'remark'
			},
			{
				name: 'parent_id'
			},
			{
				name: 'usercount'
			},
			{
				name: 'customid'
			},
			{
				name: 'opr_id'
			},
			{
				name: 'address'
			},
			{
				name: 'grp_id'
			}
		])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		this.baseParams = {
			queryParam: Ext.getCmp('queryParam').getValue(),
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
				limit: bbar.pageSize,
				dept_id: dept_id
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
	var grid = new Ext.grid.GridPanel(
		{
			title: '<img src="./resource/image/ext/building.png" align="top" class="IEPNG"><span style="font-weight:normal">部门信息表</span>',
			height: 500,
			autoScroll: true,
			region: 'center',
			store: store,
			loadMask: {
				msg: '正在加载表格数据,请稍等...'
			},
			stripeRows: true,
            border:false,
			autoExpandColumn: 'remark',
			cm: cm,
			sm: sm,
			tbar: [
				{
					text: '新增',
					id: 'new_button',
					iconCls: 'page_addIcon',
					handler: function () {
						addInit();
					}
				},
				'-',
				{
					text: '修改',
					id: 'modify_button',
					iconCls: 'page_edit_1Icon',
					handler: function () {
						editInit();
					}
				},
				'-',
				{
					text: '删除',
					id: 'delete_button',
					iconCls: 'page_delIcon',
					handler: function () {
						deleteDeptItems();
					}
				},
				'-',
				{
					id: 'dept_batch_import',
					text: '批量导入',
					iconCls: 'page_addIcon',
					handler: function () {
						deptInfoImpWindow.show();
					}
				},
				'-',
				{
					text: '导出',
					iconCls: 'page_refreshIcon',
					handler: function () {
						exportExcel('./sysDept.ered?reqCode=excleDeptInfoAction');
					}
				},
				'-',
				{
					text: '刷新',
					iconCls: 'page_refreshIcon',
					handler: function () {
						queryDeptItem();
					}
				},'-',
				{
					text:'绑定数量性质',
					iconCls:'page_addIcon',
					handler:function(){
						natureBindPanel.show();
						reloadNatureTree();
					}
				},
				'->',
				new Ext.form.TextField({
					id: 'queryParam',
					name: 'queryParam',
					emptyText: '请输入部门名称',
					enableKeyEvents: true,
					listeners: {
						specialkey: function (field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryDeptItem();
							}
						}
					},
					width: 130
				}),
				{
					text: '查询',
					iconCls: 'page_findIcon',
					handler: function () {
						queryDeptItem();
					}
				}
			],
			bbar: bbar
		});

	store.load({
		params: {
			start: 0,
			limit: bbar.pageSize,
			firstload: 'true',
			dept_id: dept_id
		}
	});

	// grid单击事件
	grid.addListener('rowclick', rowclickFn);

	function rowclickFn(grid, rowindex, e) {
		grid.getSelectionModel().each(function (rec) {
			// 获取单位下用户个数
			userCntStore.load({
				params: {
					dept_id: rec.get('dept_id')
				}
			});
			// 获取单位下子部门个数
			subDeptCntStore.load({
				params: {
					dept_id: rec.get('dept_id')
				}
			});
		});
	}

	grid.on('rowdblclick', function (grid, rowIndex, event) {
		editInit();
	});
	grid.on('sortchange', function () {
		grid.getSelectionModel().selectFirstRow();
	});

	bbar.on("change", function () {
		grid.getSelectionModel().selectFirstRow();
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
			dataUrl: './sysDept.ered?reqCode=departmentTreeInit'
		}),
		root: addRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false
	});
	// 监听下拉树的节点单击事件
	addDeptTree.on('click', function (node) {
		comboxWithTree.setValue(node.attributes.text);
		Ext.getCmp('parent_id').setValue(node.attributes.id);
		comboxWithTree.collapse();
	});
	var comboxWithTree = new Ext.form.ComboBox(
		{
			id: 'parentdept_name',
			store: new Ext.data.SimpleStore({
				fields: [],
				data: [
					[]
				]
			}),
			editable: false,
			value: ' ',
			emptyText: '请选择...',
			fieldLabel: '上级部门' + re,
			anchor: '95%',
			mode: 'local',
			triggerAction: 'all',
			maxHeight: 390,
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

	/** 添加信息 */
	var addDeptFormPanel = new Ext.form.FormPanel({
		id: 'addDeptFormPanel',
		name: 'addDeptFormPanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 70,
		frame: true,
		items: [
			{
				fieldLabel: '部门名称' + re,
				name: 'dept_name',
				id: 'dept_name',
				allowBlank: false,
				anchor: '95%'
			},
			comboxWithTree,
			{
				fieldLabel: '部门地址',
				name: 'address',
				allowBlank: true,
				anchor: '95%'
			},
			{
				fieldLabel: '部门联系人',
				name: 'lnk_name',
				allowBlank: true,
				anchor: '95%'
			},
			{
				fieldLabel: '联系电话',
				name: 'lnk_telno',
				allowBlank: true,
				anchor: '95%'
			},
			{
				height: 70,
				anchor: '95%',
				xtype: 'textarea',
				fieldLabel: '备注',
				id: 'remark',
				allowBlank: true
			},
			{
				id: 'parent_id',
				name: 'parent_id',
				hidden: true
			},
			{
				id: 'dept_id',
				name: 'dept_id',
				hidden: true
			},
			{
				id: 'parent_id_old',
				name: 'parent_id_old',
				hidden: true
			}
		]
	});
	var addDeptWindow = new Ext.Window({
		layout: 'fit',
		width: 350, // 添加子窗口 高度
		height: 320, // 添加 窗口宽度
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '新增部门',
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
		items: [ addDeptFormPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				id: 'btn_id_save_update',
				handler: function () {
					if (flag == 'add') {
						saveDeptItem();
					} else if (flag == 'update') {
						updateDeptItem();
					}
				}
			},
			{
				text: '重置',
				id: 'btnReset',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					Ext.getCmp("dept_name").setValue("");
					Ext.getCmp("remark").setValue("");
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					addDeptWindow.hide();
				}
			}
		]
	});

	var deptInfoImpForm = new Ext.form.FormPanel(
		{
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
					html: "第一行标题请勿改动;<br/>中间不要有空行;<br/>红色的列为必填项"
						+ "<br/><span style='color:red'>当前导入需要验证身份证状态,如果港澳台及其他人员请选择对应导入功能</span>",
					anchor: '99%'
				},
				{
					xtype: "label",
					labelStyle: 'color:red;width=60px;',
					id: 'download_id',
					html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/deptInfo.xls' target='_blank'>下载Excel导入模板</a></SPAN>",
					anchor: '99%'
				}
			]
		});

	var deptInfoImpWindow = new Ext.Window({
		layout: 'fit',
		width: 380,
		height: 260,
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '导入部门信息',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ deptInfoImpForm ],
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

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls"
						&& theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}

					deptInfoImpForm.getForm().submit({
						url: './sysDept.ered?reqCode=importDeptInfo',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							deptTree.root.reload();
							Ext.MessageBox.alert('提示', action.result.msg);
							deptInfoImpWindow.hide();
						},
						failure: function (form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示', '部门导入失败:<br>' + msg);
						}
					});
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					deptInfoImpWindow.hide();
				}
			}
		]
	});
	//部门和数量性质的绑定
	
	var tree_root = new Ext.tree.AsyncTreeNode({
						text : '数量性质树',
						expanded : true,
						id : '10001',
                        loaded : true
					});
	var treeLoader = new Ext.tree.TreeLoader({
					dataUrl :  './sysDept.ered?reqCode=queryNatures4dept',
                    baseParams : {
                        'dept_id' : dept_id
                    }
				});
	var natureTree = new Ext.tree.TreePanel({
				loader : treeLoader,
				title : '',
				root : tree_root,
				autoScroll : true,
				animate : false,
				tbar : [{
				text : '保存',
				id:'saveButton',
				iconCls : 'acceptIcon',
				handler : function() {
					saveDeptNautres();
				}
			}, '-', {
				text : '取消',
				iconCls : 'deleteIcon',
				id:'cancelButton',
				handler : function() {
					natureBindPanel.hide();
				}
			} ],
				width : 650, // 必须指定,否则显示有问题
				height : 400,
				useArrows : true,
				border : true,
				rootVisible : false,
				listeners:{
					beforeload:function(){
					}
				}
			});
	
		var natureBindPanel = new Ext.Window({
			title:'绑定操作数量性质',
			region: 'center',
			labelAlign: "right",
			closable:false,
			labelWidth: 70,
            margins : '3 3 3 0',
			items: [
				natureTree
			]
		})
	
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
				width: 210,
				minSize: 160,
				maxSize: 280,
				split: true,
				region: 'west',
				autoScroll: true,
                margins:'3 0 3 3',
				items: [ deptTree ]
			},
			{
				region: 'center',
				layout: 'fit',
                margins:'3 3 3 0',
				items: [ grid ]
			}
		]
	});

	/**
	 * 根据条件查询部门
	 */
	function queryDeptItem() {
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
	 * 新增部门初始化
	 */
	function addInit() {
		flag = 'add';
		clearFormPanel(addDeptFormPanel);

		var selectModel = deptTree.getSelectionModel();
		var selectNode = selectModel.getSelectedNode();

		if (Ext.isEmpty(selectNode)) {
			Ext.getCmp('parentdept_name').setValue(root_dept_name);
			Ext.getCmp('parent_id').setValue(root_dept_id);
		} else {
			Ext.getCmp('parentdept_name').setValue(selectNode.attributes.text);
			Ext.getCmp('parent_id').setValue(selectNode.attributes.id);
		}
		addDeptWindow.show();
		addDeptWindow.setTitle('新增部门<span style="color:Red">(*为必填项)</span>');
		comboxWithTree.setDisabled(false);

		Ext.getCmp('btnReset').show();
	}

	/**
	 * 保存部门数据
	 */
	function saveDeptItem() {
		if (!addDeptFormPanel.form.isValid()) {
			return;
		}
		addDeptFormPanel.getForm().submit({
			url: './sysDept.ered?reqCode=saveDeptItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addDeptWindow.hide();
				store.reload();
				refreshNode(Ext.getCmp('parent_id').getValue());
				form.reset();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '部门数据保存失败:<br>' + msg);
			}
		});
	}
	/**
	 * 保存部门的数量性质的关系
	 */
	function saveDeptNautres(){
		var userInfo = ""+natureTree.getChecked('id');
		Ext.Ajax.request({
			waitMsg:'增加保存数据',
			url: './sysDept.ered?reqCode=saveNatures4dept',
			success: function (response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', resultArray.msg);
				natureBindPanel.hide();
			},
			failure: function (response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', resultArray.msg);
			},
			params: {
				dept_id:dept_id,
				natures:userInfo
			}
		});
	}
	
	/**
	 * 修改部门初始化
	 */
	function editInit() {
		flag = 'update';
		var record = grid.getSelectionModel().getSelected();

		if (Ext.isEmpty(record)) {
			grid.getSelectionModel().selectFirstRow();
		}
		record = grid.getSelectionModel().getSelected();
		if (record.get('leaf') == '0' || record.get('usercount') != '0'
			|| record.get('rolecount') != '0') {
			comboxWithTree.setDisabled(true);
		} else {
			comboxWithTree.setDisabled(false);
		}
		if (record.get('dept_id') == '001') {
			var a = Ext.getCmp('parentdept_name');
			a.emptyText = '已经是顶级部门';
		}
		addDeptFormPanel.getForm().loadRecord(record);
		addDeptWindow.show();
		addDeptWindow.setTitle('修改部门<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('parent_id_old').setValue(record.get('parent_id'));
		Ext.getCmp('btnReset').hide();
	}

	/**
	 * 修改部门数据
	 */
	function updateDeptItem() {
		if (!addDeptFormPanel.form.isValid()) {
			return;
		}
		var parent_id = Ext.getCmp('parent_id').getValue();
		var parent_id_old = Ext.getCmp('parent_id_old').getValue();
		var dept_id = Ext.getCmp('dept_id').getValue();
		if (parent_id == dept_id) {
			Ext.MessageBox.alert('提示', "上级部门不能为部门本身");
			return;
		}
		addDeptFormPanel.getForm().submit({
			url: './sysDept.ered?reqCode=updateDeptItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addDeptWindow.hide();
				store.reload();
				refreshNode(parent_id);
				if (parent_id != parent_id_old) {
					refreshNode(parent_id_old);
				}
				form.reset();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '部门数据修改失败:<br>' + msg);
			}
		});
	}


	/**
	 * 删除部门
	 */
	function deleteDeptItems() {
		var record = grid.getSelectionModel().getSelected();

		if (record.get('parent_id') == '001') {// 操作部门为单位根部门，不允许删除
			Ext.MessageBox.alert('提示', '根部门无法删除!');
			return;
		}

		// 判断：如将要删除部门下有子部门信息，则提示需要删除子部门信息
		if (tmp_subdept_cnt > 0) {
			Ext.Msg.alert('提示', '该部门下包含子部门信息，请先删除子部门！');
			return;
		}
		// 判断：如将要删除部门下有用户信息，则不允许删除
		if (tmp_user_cnt > 0) {
			Ext.Msg.alert('提示', '该部门下包含用户信息，无法删除！');
			return;
		}

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要删除的部门!');
			return;
		}
		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>您确定删除该部门信息吗?', function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg();
					Ext.Ajax.request({
						url: './sysDept.ered?reqCode=deleteDeptItems',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							store.reload();
							deptTree.root.reload();
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							dept_id: record.get('dept_id')
						}
					});
				}
			});
	}

	userCntStore.on('load', function (obj) {// 返回数据格式不能写错
		tmp_user_cnt = obj.getAt(0).get('cnt');
	});
	subDeptCntStore.on('load', function (obj) {// 返回数据格式不能写错
		tmp_subdept_cnt = obj.getAt(0).get('cnt');
	});

	/**
	 * 数量性质树重载
	 */
	function reloadNatureTree(){
		natureTree.loader.baseParams = {
            'dept_id' : dept_id
        }
		natureTree.root.reload();
	}
	
	/**
	 * 刷新指定节点
	 */
	function refreshNode(nodeid) {
		var node = deptTree.getNodeById(nodeid);
		/* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
		if (Ext.isEmpty(node)) {
			deptTree.root.reload();
			return;
		}
		if (node.attributes.leaf) {
			node.parentNode.reload();
		} else {
			node.reload();
		}
	}
});