/**
 * 地区表管理
 * 
 * @author XiongChun
 * @since 2010-02-13
 */
Ext.onReady(function() {
	var areaInfoStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './area.ered?reqCode=validateAreaId' // 后台请求地址
						}),
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // 
						}, [{	// 定义后台返回数据格式
							name : 'areaid'
						}])
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : '菜单编号',
				dataIndex : 'menuid',
				hidden : false,
				width : 130,
				sortable : true
			}, {
				header : '地区编号',
				dataIndex : 'areaid',
				width : 130
			}, {
				header : '地区名称',
				dataIndex : 'areaname',
				width : 130
			}, {
				header : '排序号',
				dataIndex : 'sortno',
				sortable : true,
				width : 50
			}, {
				header : '上级菜单',
				dataIndex : 'parentname',
				width : 130
			}, {
				header : '地区类型',
				dataIndex : 'menutype',
				renderer : function(value) {
					if (value == '1')
						return '省份';
					else if (value == '2')
						return '城市';
					else if (value == '3')
						return '城区';
					else if (value == '4')
						return '街道';

				}
			}, {
				header : '节点类型',
				dataIndex : 'leaf',
				renderer : function(value) {
					if (value == '1')
						return '叶子节点';
					else if (value == '0')
						return '树枝节点';
					else
						return value;
				}
			}, {
				id : 'remark',
				header : '备注',
				dataIndex : 'remark'
			}, {
				id : 'parentid',
				header : '父节点编号',
				hidden : true,
				dataIndex : 'parentid'
			}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './area.ered?reqCode=queryAreaItemsForManage'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'menuid'
								}, {
									name : 'areaid'
								}, {
									name : 'areaname'
								}, {
									name : 'sortno'
								}, {
									name : 'parentname'
								}, {
									name : 'menutype'
								}, {
									name : 'leaf'
								}, {
									name : 'remark'
								}, {
									name : 'parentid'
								}])
			});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue()
				};
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
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});

	var grid = new Ext.grid.GridPanel({
		title : '<img src="./resource/image/ext/application_view_list.png" align="top" class="IEPNG"><span style="font-weight:normal">菜单信息表</span>',
		renderTo : 'menuGridDiv',
		height : 500,
		// width:600,
		autoScroll : true,
		region : 'center',
		store : store,
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		},
		stripeRows : true,
		frame : true,
		autoExpandColumn : 'remark',
		cm : cm,
		sm : sm,
		tbar : [{
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteMenuItems('1', '');
					}
				}, '-', {
					text : '刷新',
					iconCls : 'page_refreshIcon',
					handler : function() {
						queryMenuItem();
					}
				}, '->', new Ext.form.TextField({
							id : 'queryParam',
							name : 'queryParam',
							emptyText : '请输入地区名称',
							enableKeyEvents : true,
							listeners : {
								specialkey : function(field, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										queryMenuItem();
									}
								}
							},
							width : 130
						}), {
					text : '查询',
					iconCls : 'page_findIcon',
					handler : function() {
						queryMenuItem();
					}
				}],
		bbar : bbar
	});
	store.load({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});
	grid.on('rowdblclick', editInit);
	grid.on('sortchange', function() {
				grid.getSelectionModel().selectFirstRow();
			});

	bbar.on("change", function() {
				grid.getSelectionModel().selectFirstRow();
			});

	/** *******************************************************新增***************************************************** */
	var addMenuWindow, addMenuFormPanel;
	var comboxWithTree;
	var addRoot = new Ext.tree.AsyncTreeNode({
				text : '中国',
				expanded : true,
				id : '01'
			});
	var addMenuTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							baseAttrs : {},
							dataUrl : './area.ered?reqCode=queryAreaItems'
						}),
				root : addRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

	// 监听下拉树的节点单击事件
	addMenuTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				//Ext.Msg.alert('提示', node.attributes.id);
				Ext.getCmp("addMenuFormPanel").findById('parentid')
						.setValue(node.attributes.id);
				comboxWithTree.collapse();
			});

	comboxWithTree = new Ext.form.ComboBox({
		id : 'parentname',
		store : new Ext.data.SimpleStore({
					fields : [],
					data : [[]]
				}),
		editable : false,
		value : '中国',
		emptyText : '请选择...',
		fieldLabel : '上级菜单',
		anchor : '100%',
		mode : 'local',
		triggerAction : 'all',
		maxHeight : 390,
		// 下拉框的显示模板,addMenuTreeDiv作为显示下拉树的容器
		tpl : "<tpl for='.'><div style='height:390px'><div id='addMenuTreeDiv'></div></div></tpl>",
		allowBlank : false,
		onSelect : Ext.emptyFn
	});
	// 监听下拉框的下拉展开事件
	comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addMenuTree.render('addMenuTreeDiv');
				addMenuTree.root.reload(); // 每次下拉都会加载数据

			});
	addMenuFormPanel = new Ext.form.FormPanel({
				id : 'addMenuFormPanel',
				name : 'addMenuFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : true,
				items : [comboxWithTree, {
							fieldLabel : '地区编号',
							name : 'areaid',
							id : 'areaid',
							maxLength : 20,
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '地区名称',
							name : 'areaname',
							id : 'areaname',
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '备注',
							name : 'remark',
							id : 'remark',
							allowBlank : true,
							anchor : '99%'
						}, {
							id : 'parentid',
							name : 'parentid',
							hidden : true
						}, {
							id : 'windowmode',
							name : 'windowmode',
							hidden : true
						}, {
							id : 'menuid',
							name : 'menuid',
							hidden : true
						}, {
							id : 'parentid_old',
							name : 'parentid_old',
							hidden : true
						}, {
							id : 'count',
							name : 'count',
							hidden : true
						}]
			});
	addMenuWindow = new Ext.Window({
				layout : 'fit',
				width : 420,
				height : 290,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '新增菜单',
				iconCls : 'page_addIcon',
				modal : false,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				pageY : 20,
				pageX : document.body.clientWidth / 2 - 420 / 2,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [addMenuFormPanel],
				buttons : [{
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						if (runMode == '0') {
							Ext.Msg.alert('提示',
									'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
							return;
						}
						var mode = Ext.getCmp('windowmode').getValue();
						if (mode == 'add')
							saveMenuItem();
						if (mode == 'edit')
							updateMenuItem();
					}
				}, {
					text : '重置',
					id : 'btnReset',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						clearForm(addMenuFormPanel.getForm());
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						addMenuWindow.hide();
					}
				}]
			});
	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				region : 'center',
				layout : 'fit',
				items : [grid]
			})

	/**
	 * 新增菜单初始化
	 */
	function addInit() {
		addMenuWindow.getComponent('addMenuFormPanel').form.reset();
		var flag = Ext.getCmp('windowmode').getValue();
		if (typeof(flag) != 'undefined') {
			addMenuFormPanel.form.getEl().dom.reset();
		} else {
			clearForm(addMenuFormPanel.getForm());
		}
		comboxWithTree.setDisabled(false);
		addMenuWindow.show();
		addMenuWindow.setTitle('新增地区菜单');
		Ext.getCmp('windowmode').setValue('add');
		Ext.getCmp('btnReset').show();
		Ext.getCmp("areaid").getEl().dom.readOnly = false;
	}

	/**
	 * 保存菜单数据
	 */
	function saveMenuItem() {
		if (Ext.getCmp('parentname').getValue().length == 2
				&& Ext.getCmp('areaid').getValue().length != 4) {
			Ext.MessageBox.alert('提示', '省份的地区编号长度应该为4');
			Ext.getCmp('areaid').setValue('');
			return;
		}
		if (Ext.getCmp("addMenuFormPanel").findById('parentid').getValue().length == 4
				&& Ext.getCmp('areaid').getValue().length != 4) {
			Ext.MessageBox.alert('提示', '城市的地区编号长度应该为4');
			Ext.getCmp('areaid').setValue('');
			return;
		}
		if (Ext.getCmp("addMenuFormPanel").findById('parentid').getValue().length > 8) {
			Ext.MessageBox.alert('提示', '无需新增街道的下一级地区！');
			Ext.getCmp('areaid').setValue('');
			return;
		}
		if (!addMenuFormPanel.form.isValid()) {
			return;
		}
		areaInfoStore.load({
					params : {
						areaid : Ext.getCmp('areaid').getValue()
					}
				});

	areaInfoStore.on('load', function(obj) {
				if (obj.getCount() > 0) { // 如果返回的数据非空
					Ext.Msg.alert('提示', '违反唯一约束,该地区编号已经存在不能重复!');
					Ext.getCmp('areaid').setValue('');
					return;
				} else {
                   save();
				}

			});
	}
	function save()
	{
		addMenuFormPanel.form.submit({
				url : './area.ered?reqCode=saveAreaItem',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					addMenuWindow.hide();
					store.reload();
					refreshNode(Ext.getCmp('parentid').getValue());form.reset();
					Ext.MessageBox.alert('提示', action.result.msg);
				},
				failure : function(form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '数据保存失败:<br>' + msg);
				}
			});
	}

	/**
	 * 修改初始化
	 */
	function editInit() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请选择一条记录进行修改');
			return;
		}
		if (record.get('menutype') == '0') {
			Ext.Msg.alert('提示', '您选中的记录为系统内置菜单,不允许修改');
			return;
		}
		if (record.get('menutype') == '1') {
			comboxWithTree.setDisabled(true);
		} else {
			comboxWithTree.setDisabled(false);
		}
		addMenuWindow.getComponent('addMenuFormPanel').form.reset();
		addMenuFormPanel.getForm().loadRecord(record);
		addMenuWindow.show();
		addMenuWindow.setTitle('修改地区菜单');
		Ext.getCmp('windowmode').setValue('edit');
		Ext.getCmp('parentid_old').setValue(record.get('parentid'));
		Ext.getCmp('count').setValue(record.get('count'));
		Ext.getCmp('btnReset').hide();
		Ext.getCmp("areaid").getEl().dom.readOnly = true;
	}
	function updateMenuItem() {
		if (!addMenuFormPanel.form.isValid()) {
			return;
		}
		var parentid = Ext.getCmp('parentid').getValue();
		var parentid_old = Ext.getCmp('parentid_old').getValue();
		var count = Ext.getCmp('count').getValue();
		if (parentid != parentid_old) {
			if (count != '0') {
				Ext.Msg.confirm('请确认', '您确定保存修改后的地区信息吗?', function(btn, text) {
							if (btn == 'yes') {
								update();
							} else {
								return;
							}
						});
			} else {
				update();
			}
		} else {
			update();
		}

	}

	/**
	 * 更新
	 */
	function update() {
		var parentid = Ext.getCmp('parentid').getValue();
		var parentid_old = Ext.getCmp('parentid_old').getValue();
		addMenuFormPanel.form.submit({
					url : './area.ered?reqCode=updateAreaItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addMenuWindow.hide();
						store.reload();
						refreshNode(parentid);
						if (parentid != parentid_old) {
							refreshNode(parentid_old);
						}
						addMenuWindow.getComponent('addMenuFormPanel').form
								.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '数据修改失败:<br>' + msg);
					}
				});
	}

	/**
	 * 刷新指定节点
	 */
	function refreshNode(nodeid) {
		var node = comboxWithTree.getNodeById(nodeid);
		/* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
		if (Ext.isEmpty(node)) {
			comboxWithTree.root.reload();
			return;
		}
		if (node.attributes.leaf) {
			node.parentNode.reload();
		} else {
			node.reload();
		}
	}

	/**
	 * 根据条件查询菜单
	 */
	function queryMenuItem() {
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						queryParam : Ext.getCmp('queryParam').getValue()
					}
				});
	}

}

);