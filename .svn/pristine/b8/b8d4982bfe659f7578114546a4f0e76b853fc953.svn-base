Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : '卡片发行',
				dataIndex : 'crd_issu_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true
			}, {
				header : '卡片挂失',
				dataIndex : 'crd_loss_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true
			}, {
				header : '卡片解挂',
				dataIndex : 'crd_reloss_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true
			}, {
				header : '卡片注销',
				dataIndex : 'crd_logout_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true
			},{
				header : '卡片损坏',
				dataIndex : 'crd_shatter_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true
			}, {
				header : '卡片补换',
				dataIndex : 'crd_repair_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true
			},{
				header : '帐户充值',
				dataIndex : 'recharge_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true		
			},{
				header : '帐户退款',
				dataIndex : 'refund_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true		
			},{
				header : '帐户消费',
				dataIndex : 'consume_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true		
			},{
				header : '考勤刷卡',
				dataIndex : 'cwaswipe_flag',
				renderer :MESSSTATERender,
				width : 70,	
				sortable : true		
			},{
				dataIndex : 'seq_no',
				hidden : true		
			}]);

	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './message.ered?reqCode=queryMessageOpenItems'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'crd_issu_flag'
								}, {
									name : 'crd_loss_flag'
								}, {
									name : 'crd_reloss_flag'
								}, {
									name : 'crd_logout_flag'
								}, {
									name : 'crd_shatter_flag'
								},{
									name : 'crd_repair_flag'
								}, {
									name : 'recharge_flag'
								}, {
									name : 'refund_flag'
								}, {
									name : 'consume_flag'
								},{
									name:'cwaswipe_flag'
								},{
									name:'seq_no'
								}])
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
							text : '短信应用开通关闭',
							iconCls : 'page_edit_1Icon',
							handler : function() {
								ininEditCodeWindow();
							}
						}, '-', {
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								store.reload();
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

	grid.addListener('rowdblclick', ininEditCodeWindow);
	grid.on('sortchange', function() {
				grid.getSelectionModel().selectFirstRow();
			});

	bbar.on("change", function() {
				grid.getSelectionModel().selectFirstRow();
			});
	formPanel = new Ext.form.FormPanel({
				labelAlign : 'right',
				labelWidth : 70,
				frame : true,
				id : 'formPanel',
				name : 'formPanel',
				items : [{
					layout : 'column',
					items : [{
						columnWidth : 1,
						layout : 'form',
						defaultType : 'textfield',
						items : [
							       new Ext.form.RadioGroup({
											name : 'crd_issu_flag',
											id : 'crd_issu_flag',
											fieldLabel : '卡片发行',
											//columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'crd_issu_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'crd_issu_flag'
													}]
										}),  new Ext.form.RadioGroup({
											name : 'crd_loss_flag',
											id : 'crd_loss_flag',
											fieldLabel : '卡片挂失',
											//columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'crd_loss_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'crd_loss_flag'
													}]
										}),  new Ext.form.RadioGroup({
											name : 'crd_reloss_flag',
											id : 'crd_reloss_flag',
											fieldLabel : '卡片解挂',
											//columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'crd_reloss_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'crd_reloss_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'crd_logout_flag',
											id : 'crd_logout_flag',
											fieldLabel : '卡片注销',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'crd_logout_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'crd_logout_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'crd_shatter_flag',
											id : 'crd_shatter_flag',
											fieldLabel : '卡片损坏',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'crd_shatter_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'crd_shatter_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'crd_repair_flag',
											id : 'crd_repair_flag',
											fieldLabel : '卡片补换',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'crd_repair_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'crd_repair_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'recharge_flag',
											id : 'recharge_flag',
											fieldLabel : '帐户充值',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'recharge_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'recharge_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'refund_flag',
											id : 'refund_flag',
											fieldLabel : '帐户退款',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'refund_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'refund_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'consume_flag',
											id : 'consume_flag',
											fieldLabel : '帐户消费',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'consume_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'consume_flag'
													}]
										}), new Ext.form.RadioGroup({
											name : 'cwaswipe_flag',
											id : 'cwaswipe_flag',
											fieldLabel : '考勤刷卡',
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '开通',
														inputValue : '1',
														name : 'cwaswipe_flag'
													}, {
														boxLabel : '关闭',
														inputValue : '0',
														checked:true,
														name : 'cwaswipe_flag'
													}]
										}),new Ext.form.RadioGroup({
											name : 'all_flag',
											id : 'all_flag',
											fieldLabel : '',
											listeners : { // 监听注册onblur事件
												'change' : function() {
													show1();
												}
											}, 
											columns : 2,
											vertical : false,
											items : [{
														boxLabel : '全部开通',
														inputValue : '1',
														name : 'all_flag'
													}, {
														boxLabel : '全部关闭',
														inputValue : '0',
														name : 'all_flag'
													}]
										}),{
										id : 'seq_no',
										name : 'seq_no',
										hidden : true
								}]
					}]
				}]
			});
		var codeWindow = new Ext.Window( {
			layout : 'fit',
			width : 280,
			height : 428,
			resizable : false,
			draggable : true,
			closeAction : 'hide',
			title : '业务短信设置',
			iconCls : 'page_addIcon',
			modal : false,
			collapsible : true,
			titleCollapse : true,
			maximizable : false, // 窗口最大化
			buttonAlign : 'right',
			border : false,
			animCollapse : true,
			pageY : 20,
			pageX : document.body.clientWidth / 2 - 420 / 2,
			animateTarget : Ext.getBody(),
			constrain : true,
			items : [ formPanel ],
			buttons : [
					{
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
							 codeWindow.hide();
						}
					} ]
		});
	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});
	




	/**
	 * 初始化短信应用开通关闭窗口
	 */
	function ininEditCodeWindow() {
		var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.show( {
						title : '警告',
						msg : "请先选择一条记录..",
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
					return;
				}
		var recs = grid.getSelectionModel().getSelections(); // 把所有选中项放入
		if (recs.length > 1) {
			Ext.MessageBox.show( {
				title : '警告',
				msg : "请选择一条记录..",
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
	    codeWindow.setTitle('短信应用开通关闭');
		formPanel.getForm().loadRecord(record);
		Ext.getCmp('all_flag').setValue();
		codeWindow.show();
	}


	function show1() {
		var all_flag = Ext.getCmp('all_flag');
			all_flag.eachItem(function(item) {
					if (item.checked === true) {
						if (item.inputValue == 1) {//开通
							Ext.getCmp('crd_issu_flag').setValue('1');
							Ext.getCmp('crd_loss_flag').setValue('1');
							Ext.getCmp('crd_reloss_flag').setValue('1');
							Ext.getCmp('crd_logout_flag').setValue('1');
							Ext.getCmp('crd_shatter_flag').setValue('1');
							Ext.getCmp('crd_repair_flag').setValue('1');
							Ext.getCmp('recharge_flag').setValue('1');
							Ext.getCmp('refund_flag').setValue('1');
							Ext.getCmp('consume_flag').setValue('1');
							Ext.getCmp('cwaswipe_flag').setValue('1');
						}
						if (item.inputValue == 0) {//关闭
							Ext.getCmp('crd_issu_flag').setValue('0');
							Ext.getCmp('crd_loss_flag').setValue('0');
							Ext.getCmp('crd_reloss_flag').setValue('0');
							Ext.getCmp('crd_logout_flag').setValue('0');
							Ext.getCmp('crd_shatter_flag').setValue('0');
							Ext.getCmp('crd_repair_flag').setValue('0');
							Ext.getCmp('recharge_flag').setValue('0');
							Ext.getCmp('refund_flag').setValue('0');
							Ext.getCmp('consume_flag').setValue('0');
							Ext.getCmp('cwaswipe_flag').setValue('0');
						}
					}
				});
			}

	
	

		function updateCodeItem() {
			if (!formPanel.form.isValid()) {
				return;
			}
			formPanel.form.submit( {
				url : './message.ered?reqCode=updateMessageItem',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					codeWindow.hide();
					store.reload();
					Ext.MessageBox.alert('提示', '企业短信应用开通(关闭)成功');
				},
				failure : function(form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '企业短信应用开通(关闭)失败');
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