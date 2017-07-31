/*******************************************************************************
 * 行业类别信息管理
 * 
 */
Ext.onReady(function() {
	var aplCodeInfoStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './area.ered?reqCode=validateAplCode' // 后台请求地址
						}),
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // 
						}, [{	// 定义后台返回数据格式
							name : 'apl_code'
						}])
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : '省份代码',
				dataIndex : 'prvcode',
				hidden : false,
				sortable : true
			}, {
				header : '所属省份',
				dataIndex : 'province_name',
				sortable : true
			}, {
				header : '城市代码',
				dataIndex : 'citycode',
				sortable : true
			}, {
				header : '所属城市',
				dataIndex : 'city_name',
				sortable : true
			}, {
				header : '行业代码',
				dataIndex : 'apl_code'
			}, {
				header : '行业名称',
				dataIndex : 'apl_name'

			}, {
				header : '备注',
				dataIndex : 'remark'
			},{
				dataIndex : 'prv_code',
				hidden : true
			},{
				dataIndex : 'city_code',
				hidden : true
			}]);

	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './area.ered?reqCode=queryAplCodeItemsForManage'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'prvcode'
								}, {
									name : 'province_name'
								}, {
									name : 'citycode'
								}, {
									name : 'city_name'
								}, {
									name : 'apl_code'
								}, {
									name : 'apl_name'
								}, {
									name : 'remark'
								},{
									name : 'prv_code'
								},{
									name : 'city_code'
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
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			})

	var grid = new Ext.grid.GridPanel({
				renderTo : 'codeTableGrid',
				height : 510,
				store : store,
				region : 'center',
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
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
								ininEditCodeWindow();
							}
						}, '-', {
							text : '删除',
							iconCls : 'page_delIcon',
							handler : function() {
								deleteCodeItems();
							}
						}, '-', {
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								store.reload({
											params : {
												start : 0,
												limit : bbar.pageSize
											}
										});
							}
						}, '->', new Ext.form.TextField({
									id : 'queryParam',
									name : 'queryParam',
									emptyText : '行业名称',
									enableKeyEvents : true,
									listeners : {
										specialkey : function(field, e) {
											if (e.getKey() == Ext.EventObject.ENTER) {
												queryCodeItem();
											}
										}
									},
									width : 130
								}), {
							text : '查询',
							iconCls : 'page_findIcon',
							handler : function() {
								queryCodeItem();
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
	grid.on('sortchange', function() {
				grid.getSelectionModel().selectFirstRow();
			});

	bbar.on("change", function() {
				grid.getSelectionModel().selectFirstRow();
			});
	/**
	 * 新增
	 */
	var codeWindow;
	var formPanel;
	/** ********************************二级联动********************************************* */
	var provinceStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : 'sysGrps.ered?reqCode=queryAreaDatas'
						}),
				reader : new Ext.data.JsonReader({}, [{
									name : 'value'
								}, {
									name : 'text'
								}]),
				baseParams : {
					menuidlength : '4'
				}
			});
	provinceStore.load();
	var provinceCombo = new Ext.form.ComboBox({
				hiddenName : 'prv_code',
				hiddenId : 'prv_code',
				fieldLabel : '所属省份',
				emptyText : '请选择省份...',
				triggerAction : 'all',
				store : provinceStore,
				allowBlank : false,
				displayField : 'text',
				valueField : 'value',
				loadingText : '正在加载数据...',
				mode : 'remote', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				typeAhead : true,
				resizable : true,
				editable : false,
				anchor : '100%'
			});

	provinceCombo.on('select', function() {
				cityCombo.reset();
				var value = provinceCombo.getValue();
				cityStore.load({
							params : {
								menuid : value
							}
						});
			});
	// 州市
	var cityStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : 'sysGrps.ered?reqCode=queryAreaDatas'
						}),
				reader : new Ext.data.JsonReader({}, [{
									name : 'value'
								}, {
									name : 'text'
								}]),
				baseParams : {
					menuidlength : '6'
				}
			});
	cityStore.load();
	var cityCombo = new Ext.form.ComboBox({
				hiddenName : 'city_code',
				hiddenId : 'city_code',
				fieldLabel : '所属城市',
				emptyText : '请选择城市...',
				triggerAction : 'all',
				store : cityStore,
				allowBlank : false,
				displayField : 'text',
				valueField : 'value',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				typeAhead : true,
				resizable : true,
				editable : false,
				anchor : '100%'
			});

	formPanel = new Ext.form.FormPanel({
				name : 'codeForm',
				id : 'codeForm',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : true,
				items : [provinceCombo, cityCombo, {
							fieldLabel : '行业代码',
							xtype : 'numberfield', // 设置为数字输入框类型
							allowDecimals : true, // 是否允许输入小数
							allowNegative : false, // 是否允许输入负数
							name : 'apl_code',
							id : 'aplcode',
							listeners : { // 监听注册onblur事件
								'blur' : function() {
									// 获取数据
									validateNo();
								}
							},
							maxLength : 3,
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '行业名称',
							name : 'apl_name',
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '备注',
							name : 'remark',
							allowBlank : true,
							anchor : '99%'
						}]
			});

	codeWindow = new Ext.Window({
		layout : 'fit',
		width : 420,
		height : 290,
		resizable : false,
		draggable : false,
		closeAction : 'hide',
		title : '行业类别新增',
		iconCls : 'page_addIcon',
		modal : false,
		collapsible : true,
		titleCollapse : true,
		maximizable : false,
		buttonAlign : 'right',
		border : false,
		animCollapse : true,
		animateTarget : Ext.getBody(),
		constrain : true,
		items : [formPanel],
		buttons : [{
			text : '保存',
			iconCls : 'acceptIcon',
			handler : function() {
				if (runMode == '0') {
					Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
					return;
				}
				
				aplCodeInfoStore.load({
						params : {
							prv_code : Ext.get('prv_code').dom.value,
							city_code : Ext.get('city_code').dom.value,
							apl_code : Ext.getCmp('aplcode').getValue()
						}
					});
				
				aplCodeInfoStore.on('load', function(obj) {
				if (obj.getCount() > 0) { // 如果返回的数据非空\
					Ext.Msg.alert('提示', '违反唯一约束,[省份代码]和[城市代码]]和[行业代码]组合不能重复!');
					Ext.getCmp('aplcode').setValue('');
					return;
				} else {

				}

			});

				if (codeWindow.getComponent('codeForm').form.isValid()) {
					codeWindow.getComponent('codeForm').form.submit({
						url : './area.ered?reqCode=saveAplCodeItem',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							store.reload();
							Ext.Msg.confirm('请确认', '行业类别新增成功,您要继续新增吗?',
									function(btn, text) {
										if (btn == 'yes') {
											codeWindow.getComponent('codeForm').form
													.reset();
										} else {
											codeWindow.hide();
										}
									});
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('提示', '行业类别新增失败');
							codeWindow.getComponent('codeForm').form.reset();
						}
					});
				} else {
					// 表单验证失败
				}
			}
		}, {
			text : '重置',
			id : 'btnReset',
			iconCls : 'tbar_synchronizeIcon',
			handler : function() {
				codeWindow.getComponent('codeForm').form.reset();
			}
		}, {
			text : '关闭',
			iconCls : 'deleteIcon',
			handler : function() {
				codeWindow.hide();
			}
		}]
	});

	function addInit() {
		codeWindow.getComponent('codeForm').form.reset();
		codeWindow.show();
	}

	function validateNo() {
		if (Ext.get('aplcode').dom.value == '') {
			Ext.Msg.alert('提示', '请输入行业代码!');
			return;
		} else {
			if (Ext.get('aplcode').dom.value.length == 1) {
				Ext.get('aplcode').dom.value = '00'
						+ Ext.getCmp('aplcode').getValue();
			}
			if (Ext.get('aplcode').dom.value.length == 2) {
				Ext.get('aplcode').dom.value = '0'
						+ Ext.getCmp('aplcode').getValue();
			}
	
		}
	}
	/** *********************************修改********************************************* */
	var editCodeWindow, editCodeFormPanel;
	editCodeFormPanel = new Ext.form.FormPanel({
				labelAlign : 'right',
				labelWidth : 60,
				frame : true,
				id : 'editCodeFormPanel',
				name : 'editCodeFormPanel',
				items : [{
							layout : 'column',
							items : [{
										columnWidth : 1,
										layout : 'form',
										defaultType : 'textfield',
										items : [{
													fieldLabel : '所属省份',
													name : 'province_name',
													anchor : '100%',
													readOnly : true,
													allowBlank : false
												}, {
													fieldLabel : '所属城市',
													name : 'city_name',
													anchor : '100%',
													readOnly : true,
													allowBlank : false

												},{
													fieldLabel : '行业代码',
													name : 'apl_code',
													anchor : '100%',
													readOnly : true,
													allowBlank : false

												}, {
													fieldLabel : '行业名称',
													name : 'apl_name',
													anchor : '100%',
													allowBlank : false

												}, {
													fieldLabel : '备    注',
													name : 'remark',
													xtype : 'textarea',
													height : 20, // 设置多行文本框的高度
													emptyText : '', // 设置默认初始值
													anchor : '100%'
												}]
									}]
						}]

			});

	editCodeWindow = new Ext.Window({
				layout : 'fit',
				width : 360,
				height : 290,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '行业信息修改',
				iconCls : 'page_editICon',
				modal : false,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [editCodeFormPanel],
				buttons : [{
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						if (runMode == '0') {
							Ext.Msg.alert('提示',
									'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
							return;
						}
						updateCodeItem();
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						editCodeWindow.hide();
					}
				}]

			});
			
		function ininEditCodeWindow() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请选择一条行业信息进行修改！');
					return;
				}
				editCodeWindow.show();
				editCodeFormPanel.getForm().loadRecord(record);
			}

			/**
			 * 行业信息修改
			 */
			function updateCodeItem() {
				var record = grid.getSelectionModel().getSelected();
				if (!editCodeFormPanel.form.isValid()) {
					return;
				}
				editCodeFormPanel.form.submit({
							url : './area.ered?reqCode=updateAplCodeItem',
							waitTitle : '提示',
							method : 'POST',
							waitMsg : '正在处理数据,请稍候...',
							success : function(form, action) {
								editCodeWindow.hide();
								store.reload();
								Ext.MessageBox.alert('提示', action.result.msg);
							},
							failure : function(form, action) {
								var msg = action.result.msg;
								Ext.MessageBox.alert('提示', '行业信息修改成功:<br>' + msg);
							},params : {
								prv_code:record.get('prv_code').toString(),
								city_code: record.get('city_code').toString(),
								apl_code: record.get('apl_code').toString()
								
							}
						});
			}
			
			
			/**
			 * 删除行业信息
			 */
			function deleteCodeItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的行业信息!');
					return;
				}
				var strChecked = tableCells2JsonString(rows, ['prv_code','city_code','apl_code']);
				Ext.Msg.confirm('请确认', '<span style="color:red"><b>提示:</b>删除行业将同时删除和该行业相关的信息,请慎重.</span><br>继续删除吗?', function(btn, text) {
							if (btn == 'yes') {
								if (runMode == '0') {
									Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
									return;
								}
								showWaitMsg();
								Ext.Ajax.request({
											url :'./area.ered?reqCode=deleteAplCodeItem',
											success : function(response) {
												var resultArray = Ext.util.JSON.decode(response.responseText);
												store.reload();
												Ext.Msg.alert('提示', resultArray.msg);
											},
											failure : function(response) {
												var resultArray = Ext.util.JSON.decode(response.responseText);
												Ext.Msg.alert('提示', resultArray.msg);
											},
											params : {
												strChecked : strChecked
											}
										});
							}
						});
			}
	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	/**
	 * 根据条件行业类别信息表
	 */
	function queryCodeItem() {
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						queryParam : Ext.getCmp('queryParam').getValue()
					}
				});
	}

	/**
	 * 刷新代码表格
	 */
	function refreshCodeTable() {
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
	}

});