/** ********全局变量*********** */
var belong_grp_id;
var ignore_flag = '0', window_flag = '';
var update_grp_id, update_dept_id, update_team_no;
var order_cur_finish_num = 0, order_pre_finish_num = 0, order_ins_num = 0;
var ordRecord4nature = {}; // 查询订单流程数量的返回信息
var ordSizeStore = new Ext.data.Store({});
var colValue;
var rollback2nature = {
	'80' : '2',
	'81' : '4',
	'82' : '6',
	'83' : '6',
	'84' : '10',
	'85' : '11'
}
var rollbackNatures = ['80', '81', '82', '83', '84', '85'];
// 正常流程数量性质
var initDataStore = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['99999', '请选择可以操作的部门']]
		});
var natureStore = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['99999', '请选择可以操作的部门']]
		})
var initData4natureStore = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['1', '裁出数量'], ['2', '缝制领片'], ['3', '缝制下线'], ['13', '送水洗'],
					['4', '水洗收货'], ['5', '水洗移交'], ['6', '后整收货'], ['7', '移交成品'],
					['8', '移交B品'], ['10', '收成品'], ['11', '收B品'],
					['12', '中间领用'], ['14', '出运成品'], ['15', '出运B品']]
		})
var natureStore4rollback = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['99999', '请选择可以操作的部门']]
		})
var initData4natureStore4rollback = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['80', '缝制退裁片'], ['81', '水洗退缝制'], ['82', '后整退水洗'],
					['83', '后整退缝制'], ['84', '成品退后整'], ['85', 'B品退后整']]
		})
/** ********全局变量结束*********** */

var westCenterTreeNode = new Ext.tree.AsyncTreeNode({
			text : '根节点',
			id : '001'
		});
var westCenterTreePanel = new Ext.tree.TreePanel({
			region : 'center',
			width : 400,
			loader : new Ext.tree.TreeLoader({
						dataUrl : './ordRecord.ered?reqCode=grpDeptTreeInit&treetype=1' // 添加treetype=1：查询绑定了数量性质的部门，0:所有的部门
					}),
			tbar : [{
						text : '详细查询',
						iconCls : 'page_addIcon',
						handler : function() {
							ordSelectWindow.show();
						}
					}
			// ,'-',
			// '订单状态:',
			// {
			// xtype: 'combo',
			// width: 80,
			// hiddenName: 'prodstatus',
			// id: 'prodstatus_id',
			// store: new Ext.data.SimpleStore({
			// fields: ['value', 'text'],
			// data: [
			// ['0', '未排产'],
			// ['1', '在产中'],
			// ['2', '已交货'],
			// ['', '所有']
			// ]
			// }),
			// mode: 'local',
			// triggerAction: 'all',
			// valueField: 'value',
			// displayField: 'text',
			// value: '1',
			// forceSelection: true,
			// editable: false,
			// typeAhead: true,
			// listeners: {
			// 'select': function () {
			// if (westSouthTreePanel.isExpanded) {
			// westSouthTreePanel.root.reload();
			// }
			// }
			// }
			// }
			],
			autoScroll : true,
			root : westCenterTreeNode,
			rootVisible : false
		});
westCenterTreePanel.on('click', function(node) {
			changeNaturesStore(node);
			var type = node.attributes.type;

			var text = node.attributes.text;
			var id = node.attributes.id;
			var belong_grp_name = node.attributes.belong_grp_name;
			belong_grp_id = node.attributes.belong_grp_id;
			if (type.indexOf('team') != -1) {// 班組
				var parent_name = node.parentNode.attributes.text;
				var parent_id = node.parentNode.attributes.id;
				centerPanel.findById('team_name').setValue(text);
				centerPanel.findById('dept_name').setValue(parent_name);
				centerPanel.findById('grp_name').setValue(belong_grp_name);
				centerPanel.findById('team_no').setValue(id.split('_')[1]);
				centerPanel.findById('dept_id').setValue(parent_id);
				centerPanel.findById('grp_id').setValue(belong_grp_id);
			} else if (type.indexOf('dept') != -1) {// 部门
				centerPanel.findById('team_name').setValue('');
				centerPanel.findById('dept_name').setValue(text);
				centerPanel.findById('grp_name').setValue(belong_grp_name);
				centerPanel.findById('team_no').setValue('');
				centerPanel.findById('dept_id').setValue(id);
				centerPanel.findById('grp_id').setValue(belong_grp_id);
			} else if (type.indexOf('grps') != -1) {
				centerPanel.findById('team_name').setValue('');
				centerPanel.findById('dept_name').setValue('');
				centerPanel.findById('grp_name').setValue(belong_grp_name);
				centerPanel.findById('team_no').setValue('');
				centerPanel.findById('dept_id').setValue('');
				centerPanel.findById('grp_id').setValue(belong_grp_id);
			}

			westSouthTreeNode.setId(belong_grp_id);
			westSouthTreePanel.root.reload();
		});

var westSouthTreeNode = new Ext.tree.AsyncTreeNode({
			text : '根节点',
			id : ''
		});
var westSouthTreeLoader = new Ext.tree.TreeLoader({
			dataUrl : './ordRecord.ered?reqCode=ordStyleTreeInit'
		});

westSouthTreeLoader.on("beforeload", function(treeLoader, node) {
	treeLoader.baseParams.belong_grp_id = belong_grp_id;
	treeLoader.baseParams.prodstatus = '';
		// Ext.getCmp('prodstatus_id').getValue();
	}, this);

/** 订单信息树 */
var westSouthTreePanel = new Ext.tree.TreePanel({
			region : 'south',
			width : 400,
			height : (document.body.clientHeight - 150) / 2,
			split : true,
			maxHeight : 400,
			minHeight : 100,
			autoScroll : true,
			loader : westSouthTreeLoader,
			root : westSouthTreeNode,
			rootVisible : false
		});

westSouthTreePanel.on('click', function(node) {
			var order_id = node.attributes.id;
			loadCenterPanelInfo(order_id);
		});

/** 加载中间区域及底部grid信息 */
function loadCenterPanelInfo(order_id) {

	centerPanel.form.load({
				url : './ordRecord.ered?reqCode=loadOrdBasInfo',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					showInfo4First();
				},
				failure : function(form, action) {
					Ext.MessageBox.alert('提示', '数据加载失败,请重试！');
				},
				params : {
					order_id : order_id
				}
			});

	addStore.reload({
				params : {
					start : 0,
					limit : 1000,
					order_id : order_id
				}
			});
}

var westPanel = new Ext.Panel({
	layout : 'border',
	border : true,
	region : 'west',
	width : 350,
	title : '<span style="font-weight:normal">订单查询窗口</span>',
	collapsible : true,
	minSize : 280,
	maxSize : 400,
	split : true,
	items : [westCenterTreePanel]
		// , westSouthTreePanel
	});

var centerPanel = new Ext.form.FormPanel({
	region : 'center',
	frame : false, // 是否渲染表单面板背景色
	labelAlign : 'right', // 标签对齐方式
	bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
	buttonAlign : 'right',
	labelWidth : 70,
	autoScroll : true,
	items : [{
				layout : 'column',
				border : false,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : 0.5,
							defaultType : 'textfield',
							items : [{
										labelWidth : 70,
										anchor : '98%',
										xtype : 'datefield',
										format : 'Y-m-d',
										fieldLabel : '记录日期',
										name : 'tr_date'
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 70,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : .33,
							items : [{
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '工厂',
										readOnly : true,
										name : 'grp_name',
										id : 'grp_name'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '客户',
										readOnly : true,
										name : 'cust_name'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '品名',
										readOnly : true,
										name : 'article'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .33,
							items : [{
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '部门',
										name : 'dept_name',
										readOnly : true,
										id : 'dept_name'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '订单号',
										readOnly : true,
										name : 'order_id'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '标记',
										readOnly : true,
										name : 'ribbon_color'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .33,
							items : [{
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '班组',
										readOnly : true,
										name : 'team_name',
										id : 'team_name'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '款号',
										readOnly : true,
										name : 'style_no'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '指令数',
										readOnly : true,
										name : 'ins_num',
										id : 'ins_num',
										labelStyle : 'color:red;'
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : 0.33,
							items : [{
										xtype : 'radiogroup',
										name : 'natureTypeName',
										id : 'natureType',
										cloumns : [.5, .5],
										items : [{
													inputValue : '1',
													name : 'natureTypeName',
													boxLabel : '正常流程',
													disabledClass : 'x-item'
												}, {
													inputValue : '0',
													name : 'natureTypeName',
													boxLabel : '退货流程',
													disabledClass : 'x-item'
												}]
									}]
						}, {
							layout : 'form',
							border : false,
							bodyStyle : 'padding:5px;',
							columnWidth : 0.33,
							items : [{
								anchor : '100%',
								xtype : 'combo',
								fieldLabel : '数量性质',
								labelStyle : 'color:red;',
								hiddenName : 'naturerollback',
								id : 'nature_rollback',
								store : natureStore4rollback,
								mode : 'local',
								triggerAction : 'all',
								valueField : 'value',
								displayField : 'text',
								value : '80',
								forceSelection : true,
								editable : false,
								typeAhead : true,
								listeners : {
									'select' : function(combo) {
										// 获取需要查询的流程数据
										var natureText = Ext
												.get('nature_rollback').dom.value;
										var natureValue = Ext
												.getCmp('nature_rollback')
												.getValue();
										natureValue = window.rollback2nature[natureValue];
										window.loadCenterFormData(natureValue,
												natureText,
												window.showInfonature);
									}
								}
							}, {
								anchor : '100%',
								xtype : 'combo',
								fieldLabel : '数量性质',
								labelStyle : 'color:red;',
								hiddenName : 'nature',
								id : 'nature_id',
								store : natureStore,
								mode : 'local',
								triggerAction : 'all',
								valueField : 'value',
								displayField : 'text',
								value : '1',
								forceSelection : true,
								editable : false,
								typeAhead : true,
								listeners : {
									'select' : function(combo) {
										var natureText = Ext.get('nature_id').dom.value;
										var natureValue = Ext
												.getCmp('nature_id').getValue();
										window.loadCenterFormData(natureValue,
												natureText,
												window.showInfonature);
									}
								}
							}]
						}, {
							layout : 'form',
							border : false,
							bodyStyle : 'padding:5px;',
							columnWidth : 0.33,
							items : [{
								anchor : '98%',
								xtype : 'numberfield',
								allowDecimals : false, // 是否允许输入小数
								allowNegative : false, // 是否允许输入负数
								fieldLabel : '完成数量',
								labelStyle : 'color:red;',
								name : 'amount',
								id : 'amount',
								maxValue : 100000,
								allowBlank : false,
								enableKeyEvents : true,
								listeners : {
									'keyup' : function(field) {
										var data = ordRecord4nature;

										var order_cur_finish_num = getValueFilterEmpty(
												data.finish_num, 0);
										var order_ins_num = getValueFilterEmpty(
												data.ins_num, 0);
										var amount = field.getValue();
										if (Ext.isEmpty(amount)) {
											amount = 0;
										}
										var unfinished_amount = 0; // 未完成数量

										var natureType = Ext
												.getCmp('natureType')
												.getValue().inputValue;
										if (natureType == '0') {
											unfinished_amount = parseInt(order_ins_num)
													- parseInt(order_cur_finish_num)
													+ parseInt(amount); // 如果退货的就增加数量
											natureStore.each(function(record) { // 显示正常流程的流程名字
														if (record.get('value') == data.natureValue) {
															finish_nature_value = record
																	.get('text');
															return false;
														}
													})
										} else if (natureType == '1') {
											unfinished_amount = parseInt(order_ins_num)
													- parseInt(order_cur_finish_num)
													- parseInt(amount); // 如果是正常的就减少数量
										}
										if (unfinished_amount < 0) {
											unfinished_amount = 0;
										}

										document.getElementById('amount_value').innerHTML = amount
												+ '件';
										document
												.getElementById('finished_amount_value').innerHTML = order_cur_finish_num
												+ '件';
										document
												.getElementById('unfinished_amount_value').innerHTML = unfinished_amount
												+ '件';
										alertNotice(data);
									}
								}
							}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 70,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : 1,
							items : [{
										anchor : '98%',
										xtype : 'textarea',
										fieldLabel : '备注',
										name : 'remark'
									}, {
										anchor : '98%',
										xtype : 'hidden',
										name : 'grp_id',
										id : 'grp_id'
									}, {
										anchor : '98%',
										xtype : 'hidden',
										name : 'dept_id',
										id : 'dept_id'
									}, {
										anchor : '98%',
										xtype : 'hidden',
										name : 'team_no',
										id : 'team_no'
									}, {
										anchor : '100%',
										xtype : 'hidden',
										name : 'seq_no',
										id : 'seq_no'
									}, {
										anchor : '100%',
										xtype : 'hidden',
										name : 'cust_id',
										id : 'cust_id'
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
					layout : 'form',
					border : false,
					bodyStyle : "text-align:center",
					columnWidth : 1,
					items : [{
						anchor : '98%',
						xtype : 'label',
						labelStyle : 'color:red;',
						html : '<span style="font-size:15">提示：'
								+ '<span id="info1"><span>　</span>'
								+ '<span  id = "finish_nature_value" style="color:red;font-size:28">裁出数量</span>'
								+ '<span  style="color:red;font-size:28">已完成</span> ： '
								+ '<span  id = "finished_amount_value" style="color:red;font-size:28"></span>'
								+ '</span>'
								+ '<span id="info2">'
								+ '<span  style="color:red;font-size:28">　本次</span>'
								+ '<span  id = "nature_value" style="color:red;font-size:28">裁出数量</span> ： '
								+ '<span  id = "amount_value" style="color:red;font-size:28"></span>'
								+ '</span>'
								+ '<span id="info3">'
								+ '<span  style="color:red;font-size:28">　未完成</span> ： '
								+ '<span  id = "unfinished_amount_value" style="color:red;font-size:28"></span>'
								+ '</span>'
								+ '</span>'
								+ '<br/><span id="info4" >  <span  id = "pre_finished_notice" style="color:red;font-size:28"></span></span>'
					}]
				}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 70,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : .25,
							items : [{
										anchor : '98%',
										xtype : 'textfield',
										fieldLabel : '移交人',
										name : 'submitname',
										id : 'submitname',
										allowBlank : false,
										readOnly : true
									}, {
										xtype : 'textfield',
										hidden : true,
										name : 'submitname_id',
										id : 'submitname_id'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 0.08,
							items : [{
										anchor : '80%',
										xtype : 'button',
										id : 'submit_name_button',
										text : '读卡',
										handler : function() {
											loadUserInfoByCsn('submitname');
										}
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .25,
							items : [{
										anchor : '98%',
										xtype : 'textfield',
										fieldLabel : '收货人',
										name : 'surename',
										id : 'surename',
										allowBlank : false,
										readOnly : true
									}, {
										xtype : 'textfield',
										hidden : true,
										name : 'surename_id',
										id : 'surename_id'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .08,
							items : [{
										anchor : '80%',
										xtype : 'button',
										id : 'sure_name_button',
										text : '读卡',
										handler : function() {
											loadUserInfoByCsn('surename');
										}
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .25,
							items : [{
										anchor : '98%',
										xtype : 'textfield',
										fieldLabel : '司机',
										name : 'drivername',
										// allowBlank: false,
										id : 'drivername'
									}, {
										xtype : 'textfield',
										hidden : true,
										name : 'drivername_id',
										id : 'drivername_id'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .08,
							items : [{
										anchor : '80%',
										xtype : 'button',
										text : '读卡',
										handler : function() {
											loadUserInfoByCsn('drivername');
										}
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
					layout : 'form',
					border : false,
					bodyStyle : "text-align:center",
					columnWidth : 1,
					items : [{
						anchor : '98%',
						xtype : 'label',
						labelStyle : 'color:red;',
						html : '<span style="color:red;font-size:15">注意：读卡信息保存后不能修改!</span>'
					}]
				}]
			}]
});

var eastPanel = new Ext.form.FormPanel({
	region : 'east',
	width : 250,
	labelWidth : 60, // 标签宽度
	frame : false, // 是否渲染表单面板背景色
	labelAlign : 'right', // 标签对齐方式
	bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
	buttonAlign : 'right',
	items : [{
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
							layout : 'form',
							border : false,
							columnWidth : .7,
							items : [{
										anchor : '98%',
										xtype : 'textfield',
										fieldLabel : '移交人',
										name : 'submit_name',
										id : 'submit_name'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .3,
							items : [{
										anchor : '80%',
										xtype : 'button',
										id : 'submit_name_button',
										text : '读卡',
										handler : function() {
											loadUserInfoByCsn('submit_name');
										}
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
							layout : 'form',
							border : false,
							columnWidth : .7,
							items : [{
										anchor : '98%',
										xtype : 'textfield',
										fieldLabel : '收货人',
										name : 'sure_name',
										id : 'sure_name'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .3,
							items : [{
										anchor : '80%',
										xtype : 'button',
										id : 'sure_name_button',
										text : '读卡',
										handler : function() {
											loadUserInfoByCsn('sure_name');
										}
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
							layout : 'form',
							border : false,
							columnWidth : .7,
							items : [{
										anchor : '98%',
										xtype : 'textfield',
										fieldLabel : '司机',
										name : 'driver',
										id : 'driver'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .3,
							items : [{
										anchor : '80%',
										xtype : 'button',
										text : '读卡',
										handler : function() {
											loadUserInfoByCsn('driver');
										}
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
					layout : 'form',
					border : false,
					bodyStyle : "text-align:center",
					columnWidth : 1,
					items : [{
								anchor : '98%',
								xtype : 'label',
								labelStyle : 'color:red;',
								html : '<span style="color:red">注意：保存后不能修改!</span>'
							}]
				}]
			}]
});

function loadUserInfoByCsn(local) {
	var card = getCardCSN();

	if (card.state != 0) {
		Ext.Msg.alert('提示', card.returnMsg);
	} else {
		var csn = card.csn;
		Ext.Ajax.request({
					url : './ordRecord.ered?reqCode=loadUserInfoByCsn',
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						if (resultArray.success) {
							Ext.getCmp(local).setValue(resultArray.user_name);
							Ext.getCmp(local + "_id")
									.setValue(resultArray.account);
						} else {
							Ext.Msg.alert('提示', '获取人员信息失败!');
						}
					},
					failure : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						csn : csn
					}
				});
	}
}

var addForm = new Ext.Panel({
			layout : 'border',
			region : 'center',
			border : false,
			items : [westPanel, centerPanel/* ,eastPanel */]
		});

var addCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
			header : '日期',
			dataIndex : 'tr_date',
			width : 80
		}, {
			header : '工厂',
			dataIndex : 'grp_name',
			width : 80
		}, {
			header : '部门',
			dataIndex : 'dept_name',
			width : 80
		}, {
			header : '班组',
			dataIndex : 'team_name',
			width : 80
		}, {
			header : '客户',
			dataIndex : 'cust_name',
			width : 80
		}, {
			header : '订单号',
			dataIndex : 'order_id',
			width : 80
		}, {
			header : '款号',
			dataIndex : 'style_no',
			width : 80
		}, {
			header : '品名',
			dataIndex : 'article',
			width : 80
		}, {
			header : '标记',
			dataIndex : 'ribbon_color',
			width : 40
		}, {
			header : '数量性质',
			dataIndex : 'nature',
			width : 80,
			renderer : getNatureNameByType
		}, {
			header : '完成数量',
			dataIndex : 'amount',
			width : 60
		}, {
			header : '单据号',
			dataIndex : 'seq_no',
			width : 60
		}, {
			header : '移交人',
			dataIndex : 'submit_name',
			width : 60
		}, {
			header : '收货人',
			dataIndex : 'sure_name',
			width : 60
		}, {
			header : '司机',
			dataIndex : 'driver',
			width : 60
		}, {
			header : '处理时间',
			dataIndex : 'tr_time',
			width : 90
		}, {
			header : '备注',
			dataIndex : 'remark',
			width : 80
		}, {
			hidden : true,
			dataIndex : 'seq_no',
			width : 180
		}]);

var addStore = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : './ordRecord.ered?reqCode=queryOrdDayList'
					}),
			reader : new Ext.data.JsonReader({
						totalProperty : 'TOTALCOUNT',
						root : 'ROOT'
					}, ['seq_no', 'order_id', 'article', 'style_no', 'nature',
							'amount', 'grp_id', 'grp_name', 'dept_name',
							'dept_id', 'team_no', 'team_name', 'submit_name',
							'sure_name', 'driver', 'tr_date', 'cust_name',
							'tr_time', 'remark', 'ribbon_color', 'opr_time'])
		});
var addGrid = new Ext.grid.GridPanel({
			autoScroll : true,
			region : 'south',
			store : addStore,
			border : true,
			height : 150,
			title : '订单历史信息',
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			},
			stripeRows : true,
			cm : addCm
		});

var addWindow = new Ext.Window({
			layout : 'border',
			maximized : true,// ie 下虽然指定最大话,但还要指定宽度和高度,不然页面显示失常
			width : document.body.clientWidth - 250,
			title : '流水账输入',
			closeAction : 'hide',
			items : [addForm], // , addGrid
			buttons : [{
				text : '确认并保存',
				iconCls : 'acceptIcon',
				handler : function() {
					if (centerPanel.getForm().isValid()) {
						var isValide = valideNatureData();
						if (!isValide) {
							Ext.Msg.alert('提示', '请选择合适的数量性质');
							return;
						}
						var params = {
							ignore_flag : ignore_flag,
							submit_name : getValueFilterEmpty(centerPanel
											.findById('submitname').getValue(),
									''),
							sure_name : getValueFilterEmpty(centerPanel
											.findById('surename').getValue(),
									''),
							driver : getValueFilterEmpty(centerPanel
											.findById('drivername').getValue(),
									''),
							submit_id : getValueFilterEmpty(centerPanel
											.findById('submitname_id')
											.getValue(), ''),
							sure_id : getValueFilterEmpty(
									centerPanel.findById('surename_id')
											.getValue(), ''),
							driver_id : getValueFilterEmpty(centerPanel
											.findById('drivername_id')
											.getValue(), '')
						};
						var type = Ext.getCmp('natureType').getValue().inputValue;
						if (type == '0') {
							// 退货流程
							formRequestProxy(
									'./ordRecord.ered?reqCode=rollbackOrdprod4web',
									params, function(form, action) {
										Ext.Msg.alert('提示', action.result.msg);
									}, function(form, action) {
										var isSuccess = action.result.success;
										if (!isSuccess) {
											Ext.Msg.alert('提示',
													action.result.msg);
										} else {
											Ext.Msg.alert('提示', '未知错误')
										}
									})
							return;
						}
						// 正常流程
						formRequestProxy(
								'./ordRecord.ered?reqCode=addOrdRecordInfo',
								params, function(form, action) { // 回调函数有2个参数
									Ext.Msg.alert("提示", action.result.msg);
									ignore_flag = "0";
								}, function(form, action) {
									var isSuccess = action.result.success;
									if (!isSuccess) {
										Ext.getCmp('winHtml').html = action.result.msg;
										win.show();
									} else {
										Ext.Msg.alert('提示', '未知错误')
									}
								});
					} else {
						Ext.Msg.alert('提示', '请检查数据格式,如必填项,数据的格式');
					}
				}
			}, {
				text : '关闭',
				iconCls : 'deleteIcon',
				handler : function() {
					addWindow.hide();
				}
			}]
		});
addWindow.addListener('show', addListenerFirst);
addWindow.addListener('hide', removeListenerFirst);
// 角色删除确认窗口
var win = new Ext.Window({
	layout : 'fit',
	width : 310,
	height : 110,
	modal : true,
	draggable : true,
	closeAction : 'hide',
	pageY : 100,
	pageX : document.body.clientWidth / 2 - 200 / 2,
	title : '数量超出确认',
	buttonAlign : 'right',
	border : false,
	animateTarget : Ext.getBody(),
	items : [{
				id : 'winHtml',
				html : ''
			}],
	buttons : [{
		text : '确认数量并提交',
		iconCls : 'acceptIcon',
		handler : function() {
			ignore_flag = '1';// 不管数量超出
			if (window_flag == '1') {// addwindow
				centerPanel.getForm().submit({
					url : './ordRecord.ered?reqCode=addOrdRecordInfo',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) { // 回调函数有2个参数
						Ext.Msg.alert("提示", action.result.msg);
						ignore_flag = '0';
						win.hide();
					},
					failure : function(form, action) {
						Ext.Msg.alert('提示', action.result.msg);
					},
					params : {
						ignore_flag : ignore_flag,
						submit_name : centerPanel.findById('submitname')
								.getValue(),
						sure_name : centerPanel.findById('surename').getValue(),
						driver : centerPanel.findById('drivername').getValue(),
						submit_id : getValueFilterEmpty(centerPanel
										.findById('submitname_id').getValue(),
								''),
						sure_id : getValueFilterEmpty(centerPanel
										.findById('surename_id').getValue(), ''),
						driver_id : getValueFilterEmpty(centerPanel
										.findById('drivername_id').getValue(),
								'')
					}
				});
			} else if (window_flag == 2) {// updatewindow
				updateForm.getForm().submit({
					url : './ordRecord.ered?reqCode=updateOrdRecordInfo',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) { // 回调函数有2个参数
						Ext.Msg.alert("提示", action.result.msg);
						ordDayListStore.reload();
						updateWindow.hide();
						ignore_flag = '0';

						win.hide();
					},
					failure : function(form, action) {
						Ext.Msg.alert('提示', action.result.msg);
					},
					params : {
						natureType : Ext.getCmp('update_natureType').getValue().inputValue,
						ignore_flag : ignore_flag,
						grp_id : update_grp_id,
						dept_id : update_dept_id,
						team_no : update_team_no
					}
				});
			}

		}
	}, {
		text : '取消',
		iconCls : 'deleteIcon',
		handler : function() {
			win.hide();
		}
	}]
});

var grpRoot = new Ext.tree.AsyncTreeNode({
			text : '',
			expanded : true,
			iconCls : 'folder_userIcon',
			id : '001'
		});

var grpTree = new Ext.tree.TreePanel({
			loader : new Ext.tree.TreeLoader({
						baseAttrs : {},
						dataUrl : './ordRecord.ered?reqCode=grpTreeInit&treetype=1' // treetype为1：绑定数量性质的部门,没有treetype参数的查询所有部门
					}),
			root : grpRoot,
			autoScroll : true,
			animate : false,
			useArrows : false,
			rootVisible : false,
			border : false
		});

// 监听下拉树的节点单击事件
grpTree.on('click', function(node) {
			grpTreeCombox.setValue(node.text);
			update_grp_id = node.attributes.id;

			// 修改下拉框信息
			node.attributes.dept_id = node.attributes.match_dept_id;
			changeNaturesStore(node);
			grpTreeCombox.collapse();

			deptRoot.setId(update_grp_id);
			deptRoot.setText(node.attributes.text);

			deptTreeCombox.setValue('');
			teamTreeCombox.setValue('');
			update_dept_id = '';
			update_team_no = '';
		});

var grpTreeCombox = new Ext.form.ComboBox({
	id : 'grp_tree',
	name : 'grp_name',
	store : new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			}),
	editable : false,
	value : ' ',
	fieldLabel : '工厂',
	anchor : '100%',
	mode : 'local',
	allowBlank : false,
	triggerAction : 'all',
	maxHeight : 390,
	tpl : "<tpl for='.'><div style='height:390px'><div id='grpTreeDiv'></div></div></tpl>",
	onSelect : Ext.emptyFn
});
// 监听下拉框的下拉展开事件
grpTreeCombox.on('expand', function() {
			// 将UI树挂到treeDiv容器
			grpTree.render('grpTreeDiv');
			grpTree.root.reload(); // 每次下拉都会加载数
		});

var deptRoot = new Ext.tree.AsyncTreeNode({
			text : '',
			expanded : true,
			iconCls : 'folder_userIcon',
			id : '001'
		});

var deptTree = new Ext.tree.TreePanel({
			loader : new Ext.tree.TreeLoader({
						baseAttrs : {},
						dataUrl : './ordRecord.ered?reqCode=deptTreeInit&treetype=1' // treetype为1：绑定数量性质的部门,没有treetype参数的查询所有部门
					}),
			root : deptRoot,
			autoScroll : true,
			animate : false,
			useArrows : false,
			rootVisible : false,
			border : false
		});

// 监听下拉树的节点单击事件
deptTree.on('click', function(node) {
			deptTreeCombox.setValue(node.text);
			update_dept_id = node.attributes.id;
			// 修改数量性质
			node.attributes.dept_id = node.attributes.id;
			changeNaturesStore(node);
			teamRoot.setId(update_dept_id);
			teamRoot.setText(node.attributes.text);
			deptTreeCombox.collapse();

			teamTreeCombox.setValue('');
			update_team_no = '';
		});

var deptTreeCombox = new Ext.form.ComboBox({
	id : 'dept_tree',
	name : 'dept_name',
	store : new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			}),
	editable : false,
	value : ' ',
	fieldLabel : '部门',
	anchor : '100%',
	mode : 'local',
//	allowBlank : false,
	triggerAction : 'all',
	maxHeight : 390,
	tpl : "<tpl for='.'><div style='height:390px'><div id='deptTreeDiv'></div></div></tpl>",
	onSelect : Ext.emptyFn
});
// 监听下拉框的下拉展开事件
deptTreeCombox.on('expand', function() {
	// if (!Ext.isEmpty(update_dept_id)) {
	// 将UI树挂到treeDiv容器
	deptTree.render('deptTreeDiv');
	deptTree.root.reload(); // 每次下拉都会加载数
		// }
	});

var teamRoot = new Ext.tree.AsyncTreeNode({
			text : '',
			expanded : true,
			iconCls : 'folder_userIcon',
			id : '001'
		});

var teamTree = new Ext.tree.TreePanel({
			loader : new Ext.tree.TreeLoader({
						baseAttrs : {},
						dataUrl : './ordRecord.ered?reqCode=teamTreeInit'
					}),
			root : teamRoot,
			autoScroll : true,
			animate : false,
			useArrows : false,
			rootVisible : false,
			border : false
		});

// 监听下拉树的节点单击事件
teamTree.on('click', function(node) {
			teamTreeCombox.setValue(node.text);
			update_team_no = node.attributes.id;
			teamTreeCombox.collapse();
		});

var teamTreeCombox = new Ext.form.ComboBox({
	id : 'team_tree',
	name : 'team_name',
	store : new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			}),
	editable : false,
	value : ' ',
	fieldLabel : '班组',
	anchor : '100%',
	mode : 'local',
	triggerAction : 'all',
	maxHeight : 390,
	tpl : "<tpl for='.'><div style='height:390px'><div id='teamTreeDiv'></div></div></tpl>",
	onSelect : Ext.emptyFn
});
// 监听下拉框的下拉展开事件
teamTreeCombox.on('expand', function() {
	// if (!Ext.isEmpty(update_team_no)) {
	// 将UI树挂到treeDiv容器
	teamTree.render('teamTreeDiv');
	teamTree.root.reload(); // 每次下拉都会加载数
		// }
	});

/** 指令数* */

var insOrdcm = new Ext.grid.ColumnModel([{
			header : '国家',
			dataIndex : 'country',
			align : 'center',
			width : 40,
			editor : new Ext.form.TextField({
						allowBlank : false
					})
		}, {
			header : '颜色',
			dataIndex : 'color',
			align : 'center',
			width : 40,
			editor : new Ext.form.TextField({
						allowBlank : false
					})
		}, {
			header : '内长',
			dataIndex : 'in_length',
			align : 'center',
			width : 40,
			sortable : true,
			editor : new Ext.form.TextField({
						allowBlank : false
					})
		}]);
/**
 * 交接记录指令数量信息
 */
var ordInsNumStore = new Ext.data.Store({
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy({
						url : './ordRecord.ered?reqCode=queryOrdSizeInfo'
					}),
			// 数据读取器
			reader : new Ext.data.JsonReader({
						totalProperty : 'TOTALCOUNT', // 记录总数
						root : 'ROOT' // Json中的列表数据根节点
					}, ['country', 'color', 'in_length', 'ins_num', 'num',
							'waist'])
		});
ordInsNumStore.on('load', function() {
			ordSizeStore.removeAll();
			colValue = "";
			var recordCount = ordInsNumStore.getCount();
			colValue = ordInsNumStore.getAt(0).get('waist');
			// 重组cm
			setColumnsData();
			// 重组成 store
			for (var i = 0; i < recordCount; i++) {
				var record = ordInsNumStore.getAt(i);
				var columnValue = record.get("num").split(',');
				// 这里的num是腰围信息
				var column = record.get("waist").split(',');
				for (var j = 0; j < column.length; j++) {
					record.set("num" + column[j], columnValue[j]);
				}
				ordSizeStore.add(record);
			}

		})
// 表格实例
var ordSizeGrid = new Ext.grid.EditorGridPanel({
			id : 'numGrid_ordSize',
			title : '指令数量信息',
			height : 150,
			frame : true,
			border : false,
			autoEncode : true,
			autoScroll : true,
			region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
			store : ordSizeStore, // 数据存储
			clicksToEdit : 1,
			stripeRows : true, // 斑马线
			cm : insOrdcm, // 列模型
			pruneModifiedRecords : true,
			viewConfig : {
				forceFit : true
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});

ordSizeGrid.addListener('afteredit', function() {
			updateInsNumInfo();
			Ext.getCmp('amount').fireEvent('keyup', Ext.getCmp('amount'));
		})

function updateInsNumInfo() {
	var ins_num = 0;
	// 获取除制定列之外的其他列信息
	var insGridCM = insOrdGrid.getColumnModel();
	var colNum = insGridCM.getColumnCount();
	var colNumDataIndex = [];
	for (var idx = 0; idx < colNum; idx++) {
		var dataIndx = insGridCM.getDataIndex(idx);
		if (constantCol.indexOf(dataIndx) >= 0 || Ext.isEmpty(dataIndx)) {
			continue; // 指定的列跳过处理
		}
		colNumDataIndex.push(dataIndx);
	}
	// 统计数据
	var records = ordSizeGrid.getStore().getRange();
	var recordsLength = records.length;
	var dataIndexLength = colNumDataIndex.length;
	for (var idx = 0; idx < recordsLength; idx++) {
		for (var k = 0; k < dataIndexLength; k++) {
			var numData = records[idx].get(colNumDataIndex[k].trim());
			ins_num += Ext.isEmpty(numData) ? 0 : parseInt(numData);
		}
	}
	Ext.getCmp('update_amount').setValue(ins_num);
}
/**
 * 添加列信息，不能修改
 */
function setColumnsData() {
	var column = colValue;
	ordSizeStore.removeAll();
	var columnKeyList = [];
	columnKeyList.push('country');
	columnKeyList.push('color');
	columnKeyList.push('in_length');
	columnsValue = column.split(',');
	var insColumn = [];

	insColumn.push(new Ext.grid.RowNumberer());

	insColumn.push({
				header : '国家',
				dataIndex : 'country',
				align : 'center',
				width : 100
			});
	insColumn.push({
				header : '颜色',
				dataIndex : 'color',
				align : 'center',
				width : 100
			});
	insColumn.push({
				header : '内长',
				dataIndex : 'in_length',
				align : 'center',
				width : 100,
				sortable : true
			});
	for (var i = 0; i < columnsValue.length; i++) {
		var colBean = columnsValue[i].trim();
		if (colBean.equals == '') {
			continue;
		}
		insColumn.push({
					header : colBean,
					dataIndex : 'num' + colBean,
					align : 'center',
					width : 60,
					editor : {
						xtype : "spinnerfield",
						minValue : 0,
						allowDecimals : true,
						decimalPrecision : 0,
						incrementValue : 1
					}
				});
	}

	ordSizeGrid.getColumnModel().setConfig(insColumn);

}

var updateForm = new Ext.form.FormPanel({
	region : 'center',
	labelWidth : 70, // 标签宽度
	frame : false, // 是否渲染表单面板背景色
	labelAlign : 'right', // 标签对齐方式
	bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
	buttonAlign : 'right',
	items : [{
				layout : 'column',
				border : false,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : 0.5,
							defaultType : 'textfield',
							items : [{
										labelWidth : 70,
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '记录日期',
										name : 'tr_date',
										readOnly : true
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 70,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : .33,
							items : [grpTreeCombox, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '客户',
										readOnly : true,
										name : 'cust_name'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '品名',
										readOnly : true,
										name : 'article'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .33,
							items : [deptTreeCombox, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '订单号',
										readOnly : true,
										name : 'order_id'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '标记',
										readOnly : true,
										name : 'ribbon_color'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : .33,
							items : [teamTreeCombox, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '款号',
										readOnly : true,
										name : 'style_no'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '单据号',
										name : 'seq_no',
										readOnly : true
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : 0.33,
							items : [{
										xtype : 'radiogroup',
										name : 'natureTypeName',
										id : 'update_natureType',
										disabled : true,
										cloumns : [.5, .5],
										items : [{
													xtype : 'radio',
													inputValue : '1',
													name : 'natureTypeName',
													boxLabel : '正常流程'
												}, {
													xtype : 'radio',
													inputValue : '0',
													name : 'natureTypeName',
													boxLabel : '退货流程'
												}]
									}]

						}, {
							layout : 'form',
							border : false,
							bodyStyle : 'padding:5px;',
							columnWidth : 0.33,
							items : [{
										anchor : '100%',
										xtype : 'combo',
										fieldLabel : '数量性质',
										labelStyle : 'color:red;',
										hiddenName : 'naturerollback',
										id : 'update_nature_rollback',
										store : natureStore4rollback,
//										allowBlank : false,
										mode : 'local',
										triggerAction : 'all',
										valueField : 'value',
										displayField : 'text',
										value : '80',
										forceSelection : true,
										editable : false,
										typeAhead : true,
										listeners : {
											'select' : function(combo) {
											}
										}

									}, {
										anchor : '100%',
										xtype : 'combo',
										fieldLabel : '数量性质',
										labelStyle : 'color:red;',
										hiddenName : 'nature',
										id : 'update_nature_id',
										store : natureStore,
//										allowBlank : false,
										mode : 'local',
										triggerAction : 'all',
										valueField : 'value',
										displayField : 'text',
										value : '1',
										forceSelection : true,
										editable : false,
										typeAhead : true,
										listeners : {
											'select' : function(combo) {
												var nature = Ext
														.get('update_nature_id').dom.value;
												document
														.getElementById('update_nature_value').innerHTML = nature;
											}
										}
									}]
						}, {
							layout : 'form',
							border : false,
							bodyStyle : 'padding:5px;',
							columnWidth : 0.33,
							items : [{
								anchor : '98%',
								xtype : 'numberfield',
								allowDecimals : false, // 是否允许输入小数
								allowNegative : false, // 是否允许输入负数
								fieldLabel : '完成数量',
								labelStyle : 'color:red;',
								name : 'amount',
								id : 'update_amount',
								allowBlank : false,
								enableKeyEvents : true,
								listeners : {
									'blur' : function() {
										var amount = Ext.get('update_amount')
												.getValue();
										document
												.getElementById('update_amount_value').innerHTML = amount
												+ '件';
									},
									'keyup' : function() {
										var amount = Ext.get('update_amount')
												.getValue();
										document
												.getElementById('update_amount_value').innerHTML = amount
												+ '件';
									}
								}
							}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 70,
				items : [{
							layout : 'form',
							border : false,
							columnWidth : 1,
							items : [{
										anchor : '98%',
										xtype : 'textarea',
										fieldLabel : '备注',
										name : 'remark'
									}]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 70,
				items : [{
							layout : 'form',
							border : true,
							columnWidth : 1,
							items : [ordSizeGrid]
						}]
			}, {
				layout : 'column',
				border : false,
				bodyStyle : 'padding:10px;',
				items : [{
					layout : 'form',
					border : false,
					bodyStyle : "text-align:center",
					columnWidth : 1,
					items : [{
						anchor : '98%',
						xtype : 'label',
						labelStyle : 'color:red;',
						html : '<span style="font-size:15">提示：'
								+ '<span  id = "update_nature_value" style="color:red;font-size:28">裁出数量</span>　：　'
								+ '<span  id = "update_amount_value" style="color:red;font-size:28"></span>'
								+ '</span>'
					}]
				}]
			}]
});

var updateWindow = new Ext.Window({
	layout : 'border',
	width : 800,
	height : 550,
	title : '流水账修改',
	closeAction : 'hide',
	items : [updateForm],
	buttons : [{
		text : '确认并修改',
		iconCls : 'acceptIcon',
		handler : function() {
			if (updateForm.getForm().isValid()) {
                var isValide = valideNatureData('update_natureType','update_nature_id','update_nature_rollback');
                if(!isValide){
                    Ext.msg.alert('提示','请选择数量性质');
                    return;
                }
				// 重组size info
				// 判断并获取服装的数量信息
				// 獲取store
				var insOrdRecords = ordSizeStore.getRange();
				// 創建jason
				var insOrdRecordStr = "[";

				// 获取列的列表行数
				var gridCm = ordSizeGrid.getColumnModel();
				var dataIdxLength = gridCm.getColumnCount();
				// 拼接列头信息
				var colNames = [];
				// 遍历列 过滤空数据
				for (var idx = 0; idx < dataIdxLength; idx++) {
					var dataIndex = gridCm.getDataIndex(idx);
					if (Ext.isEmpty(dataIndex)) {
						continue;
					}
					if (colNames.indexOf(dataIndex) < 0) {
						colNames.push(dataIndex); // 不重复添加列信息
					}
				}
				// 遍历record组成map 跳过显示用的行
				for (var i = 0; i < insOrdRecords.length; i++) {
					insOrdRecordStr = insOrdRecordStr + "{";
					var insOrdRecord = insOrdRecords[i];

					for (var j = 0; j < colNames.length; j++) {
						var key = colNames[j];
						var keyname = key;
						if (keyname.indexOf('num') >= 0) {
							var s = keyname.lastIndexOf('_');
							keyname = key.substring(s + 1);
						}
						insOrdRecordStr = insOrdRecordStr + "'" + keyname
								+ "':'" + insOrdRecord.get(key) + "',";
					}

					if (insOrdRecordStr.length > 1) {
						insOrdRecordStr = insOrdRecordStr.substring(0,
								insOrdRecordStr.length - 1);
					}
					insOrdRecordStr = insOrdRecordStr + "},";
				}

				if (insOrdRecordStr.length > 1) {
					insOrdRecordStr = insOrdRecordStr.substring(0,
							insOrdRecordStr.length - 1);
				}
				insOrdRecordStr = insOrdRecordStr + "]";

				updateForm.getForm().submit({
					url : './ordRecord.ered?reqCode=updateOrdRecordInfo',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) { // 回调函数有2个参数
						Ext.Msg.alert("提示", action.result.msg);
						ordDayListStore.reload();
						updateWindow.hide();
					},
					failure : function(form, action) {
						Ext.getCmp('winHtml').html = action.result.msg;
						win.show();
					},
					params : {
						natureType : Ext.getCmp('update_natureType').getValue().inputValue,
						grp_id : update_grp_id,
						dept_id : update_dept_id,
						team_no : update_team_no,
						insOrdRecordStr : insOrdRecordStr,
						colValue : colValue
					}
				});
			}
		}
	}, {
		text : '关闭',
		iconCls : 'deleteIcon',
		handler : function() {
			updateWindow.hide();
		}
	}]
});
updateWindow.addListener('show', showupdateform); // 当窗口显示的时候设置下拉框的显示
updateWindow.addListener('hide', clearupdateform); // 窗口隐藏的时候清空数据
var ordDayListSm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : true
		});

var ordDayListCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		ordDayListSm, {
			header : '日期',
			dataIndex : 'tr_date',
			width : 80
		}, {
			header : '工厂',
			dataIndex : 'grp_name',
			width : 80
		}, {
			header : '部门',
			dataIndex : 'dept_name',
			width : 80
		}, {
			header : '班组',
			dataIndex : 'team_name',
			width : 80
		}, {
			dataIndex : 'grp_id',
			hidden : true,
			width : 80
		}, {
			dataIndex : 'dept_id',
			hidden : true,
			width : 80
		}, {
			dataIndex : 'team_no',
			hidden : true,
			width : 80
		}, {
			header : '客户',
			dataIndex : 'cust_name',
			width : 80
		}, {
			header : '订单号',
			dataIndex : 'order_id',
			width : 80
		}, {
			header : '款号',
			dataIndex : 'style_no',
			width : 80
		}, {
			header : '品名',
			dataIndex : 'article',
			width : 80
		}, {
			header : '标记',
			dataIndex : 'ribbon_color',
			width : 40
		}, {
			header : '数量性质',
			dataIndex : 'nature',
			width : 80,
			renderer : getNatureNameByType
		}, {
			header : '完成数量',
			dataIndex : 'amount',
			width : 60
		}, {
			header : '单据号',
			dataIndex : 'seq_no',
			width : 60
		}, {
			header : '移交人',
			dataIndex : 'submit_name',
			width : 60
		}, {
			header : '收货人',
			dataIndex : 'sure_name',
			width : 60
		}, {
			header : '司机',
			dataIndex : 'driver',
			width : 60
		}, {
			header : '状态',
			dataIndex : 'status',
			width : 80,
			renderer : function(value) {
				if (value == '0') {
					return '正常';
				} else if (value == '1') {
					return '修改中';
				} else if (value == '2') {
					return '修改完成';
				}
			}
		}, {
			header : '处理时间',
			dataIndex : 'tr_time',
			width : 140
		}, {
			header : '备注',
			dataIndex : 'remark',
			width : 80
		}, {
			hidden : true,
			dataIndex : 'seq_no',
			width : 180
		}]);

var ordDayListStore = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : './ordRecord.ered?reqCode=queryOrdDayList'
					}),
			reader : new Ext.data.JsonReader({
						totalProperty : 'TOTALCOUNT',
						root : 'ROOT'
					}, ['seq_no', 'order_id', 'article', 'style_no', 'nature',
							'amount', 'grp_id', 'grp_name', 'dept_name',
							'dept_id', 'team_no', 'team_name', 'submit_name',
							'sure_name', 'driver', 'tr_date', 'cust_name',
							'tr_time', 'remark', 'ribbon_color', 'status',
							'cust_id', 'ins_num'])
		});

ordDayListStore.on('beforeload', function() {
			if (query_params.query_flag != 'detailQuery') {
				var start_date = Ext.getCmp('start_date').getValue();
				if (!Ext.isEmpty(start_date)) {
					start_date = start_date.format('Y-m-d');
				}
				var end_date = Ext.getCmp('end_date').getValue();
				if (!Ext.isEmpty(end_date)) {
					end_date = end_date.format('Y-m-d');
				}
				this.baseParams = {
					start : 0,
					limit : ordDayListBbar.pageSize,
					start_date : start_date,
					end_date : end_date
				}
			} else {
				this.baseParams = query_params;
			}
		});

var ordDayListPagesize_combo = new Ext.form.ComboBox({
			name : 'pagesize',
			hiddenName : 'pagesize',
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : true,
			mode : 'local',
			store : new Ext.data.ArrayStore({
						fields : ['value', 'text'],
						data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'],
								[100, '100条/页'], [250, '250条/页'],
								[500, '500条/页']]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			editable : false,
			width : 85
		});

var ordDayListNumber = parseInt(ordDayListPagesize_combo.getValue());
ordDayListPagesize_combo.on("select", function(comboBox) {
			ordDayListBbar.pageSize = parseInt(comboBox.getValue());
			ordDayListNumber = parseInt(comboBox.getValue());
			var start_date = Ext.getCmp('start_date').getValue();
			if (!Ext.isEmpty(start_date)) {
				start_date = start_date.format('Y-m-d');
			}
			var end_date = Ext.getCmp('end_date').getValue();
			if (!Ext.isEmpty(end_date)) {
				end_date = end_date.format('Y-m-d');
			}
			ordDayListStore.load({
						params : {
							start : 0,
							limit : ordDayListBbar.pageSize,
							start_date : start_date,
							end_date : end_date
						}
					});
		});

var ordDayListBbar = new Ext.PagingToolbar({
			pageSize : ordDayListNumber,
			store : ordDayListStore,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', ordDayListPagesize_combo]
		});
// 模版新增保存所选信息
var clickRecord = {};
var ordDayListGrid = new Ext.grid.GridPanel({
	autoScroll : true,
	region : 'center',
	store : ordDayListStore,
	border : true,
	title : '订单记录信息',
	loadMask : {
		msg : '正在加载表格数据,请稍等...'
	},
	stripeRows : true,
	cm : ordDayListCm,
	sm : ordDayListSm,
	tbar : [{
				text : '新增',
				iconCls : 'page_addIcon',
				hidden : true,
				handler : function() { // 处理显示数据
					Ext.getCmp('natureType').setValue('1'); // 新增默认设置为正常流程
					window_flag = '1';
					addWindow.show();
				}
			}, '-', {
				text : '模板新增',
				hidden : true,
				iconCls : 'page_addIcon',
				tooltip : '以选中的记录作为模板新增',
				handler : function() {
					var record = ordDayListGrid.getSelectionModel()
							.getSelected();
					clickRecord = record;
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请选择一行有效记录！');
						return;
					}
					centerPanel.getForm().loadRecord(record);
					// 退货流程的单选框选择
					var nature = record.get('nature');
					if (rollbackNatures.indexOf(nature) >= 0) {
						Ext.getCmp('natureType').setValue('0'); // 新增默认设置为正常流程
						Ext.getCmp('nature_rollback').setValue(nature); // 设置新增的
					} else {
						Ext.getCmp('natureType').setValue('1'); // 新增默认设置为正常流程
						Ext.getCmp('nature_id').setValue(nature); // 设置新增的
					}

					addStore.load({
								params : {
									order_id : record.get('order_id')
								}
							});
					centerPanel.findById('seq_no').setValue();
					addWindow.show();
					window_flag = '1';
					document.getElementById('nature_value').innerHTML = getNatureNameByType(record
							.get('nature'));

					centerPanel.findById('amount').setValue('');
					centerPanel.findById('submitname').setValue('');
					centerPanel.findById('surename').setValue('');
					centerPanel.findById('drivername').setValue('');
					centerPanel.findById('submitname_id').setValue('');
					centerPanel.findById('surename_id').setValue('');
					centerPanel.findById('drivername_id').setValue('');
				}
			}, '-', {
				text : '修改',
				iconCls : 'page_addIcon',
				handler : function() {
					var record = ordDayListGrid.getSelectionModel()
							.getSelected();

					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请选择一行有效记录！');
						return;
					}
                    // 设置模式为修改模式
                    window_flag = '2';
					// 当三种数量性质时加载尺寸表
					var natureValue = record.get('nature');
					if (natureValue == '1' || natureValue == '2'
							|| natureValue == '14') {
						ordInsNumStore.removeAll();
						// 尺寸表数据的加载
						ordInsNumStore.load({
									params : {
										seq_no : record.get('seq_no')
									}
								});
						// 跳过没有尺寸信息的交接记录
						if (ordInsNumStore.getRange().lenght = 0) {
							Ext.getCmp("update_amount").readOnly = true;
							// changeColumnsData(natureValue);
							Ext.getCmp('numGrid_ordSize').setVisible(true);

							Ext.getCmp('update_nature_id').setDisabled(true);
						}
					} else {
						Ext.getCmp("update_amount").readOnly = false;
						Ext.getCmp('numGrid_ordSize').setVisible(false);
						Ext.getCmp('update_nature_id').setDisabled(false);
					}
					//todo:修改的数据存储以及汇总1：回滚所有外键关联的尺寸信息，2：保存新的信息 
					updateForm.getForm().loadRecord(record);
					updateWindow.show();
					// 单选框设置
					var nature = record.get('nature');
					if (rollbackNatures.indexOf(nature) >= 0) {
						Ext.getCmp('update_natureType').setValue('0'); // 新增默认设置为正常流程
						Ext.getCmp('update_nature_rollback').setValue(nature);
					} else {
						Ext.getCmp('update_natureType').setValue('1'); // 新增默认设置为正常流程
						Ext.getCmp('update_nature_id').setValue(nature);
					}
					changeGroupChecked4update();

					document.getElementById('update_nature_value').innerHTML = getNatureNameByType(record
							.get('nature'));
					document.getElementById('update_amount_value').innerHTML = record
							.get('amount')
							+ '件';

					update_grp_id = record.get('grp_id');
					update_dept_id = record.get('dept_id');
					update_team_no = record.get('team_no');

					deptRoot.setId(update_grp_id);
					teamRoot.setId(update_dept_id);
					teamRoot.setText(record.get('dept_name'));

					// 修改时初始化部门数量性质的数据
					var params = {
						attributes : {
							dept_id : update_dept_id
						}
					};
					changeNaturesStore(params);
				}
			}, '-', {
				text : '删除',
				iconCls : 'page_delIcon',
				handler : function() {
					var record = ordDayListGrid.getSelectionModel()
							.getSelected();

					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请选择一行有效记录！');
						return;
					}

					Ext.Msg.confirm('请确认', '你确认要删除　<span style="color:red">'
									+ record.get('tr_date') + '|'
									+ record.get('order_id')
									+ '</span>　的订单记录吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url : './ordRecord.ered?reqCode=deleteOrdRecordInfo',
										success : function(response) {
											var resultArray = Ext.util.JSON
													.decode(response.responseText);
											if (resultArray.success) {
												Ext.Msg.alert('提示',
														resultArray.msg);
												ordDayListStore.reload();
											} else {
												Ext.Msg.alert('提示', '删除记录失败!');
											}
										},
										failure : function(response) {
											var resultArray = Ext.util.JSON
													.decode(response.responseText);
											Ext.Msg
													.alert('提示',
															resultArray.msg);
										},
										params : {
											seq_no : record.get('seq_no')
										}
									});
								}
							});
				}
			}, '-', {
				text : '刷新',
				iconCls : 'page_refreshIcon',
				handler : function() {
					var start_date = Ext.getCmp('start_date').getValue();
					if (!Ext.isEmpty(start_date)) {
						start_date = start_date.format('Y-m-d');
					}
					var end_date = Ext.getCmp('end_date').getValue();
					if (!Ext.isEmpty(end_date)) {
						end_date = end_date.format('Y-m-d');
					}
					ordDayListStore.reload({
								params : {
									start : 0,
									limit : ordDayListBbar.pageSize,
									start_date : start_date,
									end_date : end_date
								}
							});
				}
			}, '->', {
				xtype : 'datefield',
				id : 'start_date',
				name : 'start_date',
				format : 'Y-m-d',
				editable : true,
				emptyText : '记录开始日期',
				width : 120
			}, '-', {
				xtype : 'datefield',
				id : 'end_date',
				name : 'end_date',
				format : 'Y-m-d',
				editable : true,
				emptyText : '记录结束日期',
				width : 120
			}, '-', {
				text : '查询',
				iconCls : 'page_findIcon',
				handler : function() {
					var start_date = Ext.getCmp('start_date').getValue();
					if (!Ext.isEmpty(start_date)) {
						start_date = start_date.format('Y-m-d');
					}
					var end_date = Ext.getCmp('end_date').getValue();
					if (!Ext.isEmpty(end_date)) {
						end_date = end_date.format('Y-m-d');
					}
					query_params.query_flag = '';
					ordDayListStore.reload({
								params : {
									start : 0,
									limit : ordDayListBbar.pageSize,
									start_date : start_date,
									end_date : end_date
								}
							});
				}
			}, '-', {
				text : '详细查询',
				iconCls : 'page_findIcon',
				handler : function() {
					ordQueryWindow.show();
				}
			}, '-', {
				text : '导出',
				iconCls : 'page_excelIcon',
				handler : function() {
					exportExcel('./ordRecord.ered?reqCode=exportOrdRecordInfo');
				}
			}],
	bbar : ordDayListBbar
});

function getNatureNameByType(value) {
	if (value == '0') {
		return '标签入库';
	} else if (value == '1') {
		return '裁出数量';
	} else if (value == '2') {
		return '缝制领片';
	} else if (value == '3') {
		return '缝制下线';
	} else if (value == '4') {
		return '水洗收货';
	} else if (value == '5') {
		return '水洗移交';
	} else if (value == '6') {
		return '后整收货';
	} else if (value == '7') {
		return '移交成品';
	} else if (value == '8') {
		return '移交B品';
	} else if (value == '9') {
		return '标签解绑';
	} else if (value == '10') {
		return '收成品';
	} else if (value == '11') {
		return '收B品';
	} else if (value == '12') {
		return '中间领用';
	} else if (value == '13') {
		return '送水洗';
	} else if (value == '14') {
		return '出运成品';
	} else if (value == '15') {
		return '出运B品';
	} else if (value == '80') {
		return '缝制退裁片';
	} else if (value == '81') {
		return '水洗退缝制';
	} else if (value == '82') {
		return '后整退水洗';
	} else if (value == '83') {
		return '后整退缝制';
	} else if (value == '84') {
		return '成品退后整';
	} else if (value == '85') {
		return 'B品退后整';
	}else if(value == '16') {
        return 'B品库收录B品数';
    }else if(value == '17') {
        return 'B品库出运B品数';
    }
}

/**
 * 流程的数据显示
 */
function showInfonature(data) {
	data = data || {};
	// 保存在其他地方需要使用的数据
	ordRecord4nature = data;

	var order_cur_finish_num = getValueFilterEmpty(data.finish_num, 0);

	var order_ins_num = getValueFilterEmpty(data.ins_num, 0);

	var amount = Ext.getCmp('amount').getValue();
	amount = getValueFilterEmpty(amount, 0);

	var nature_value = getValueFilterEmpty(data.natureText, '');
	var finish_nature_value = ''; // 显示查询流程的结果数据

	var unfinished_amount = 0; // 未完成数量

	var natureType = Ext.getCmp('natureType').getValue().inputValue;
	if (natureType == '0') {
		unfinished_amount = parseInt(order_ins_num)
				- parseInt(order_cur_finish_num) + parseInt(amount); // 如果退货的就增加数量
		natureStore.each(function(record) { // 显示正常流程的流程名字
					if (record.get('value') == data.natureValue) {
						finish_nature_value = record.get('text');
						return false;
					}
				})
	} else if (natureType == '1') {
		unfinished_amount = parseInt(order_ins_num)
				- parseInt(order_cur_finish_num) - parseInt(amount); // 如果是正常的就减少数量
		finish_nature_value = nature_value;
	}

	if (unfinished_amount <= 0) {
		unfinished_amount = 0;
	}
	document.getElementById('nature_value').innerHTML = nature_value;
	document.getElementById('finish_nature_value').innerHTML = finish_nature_value;

	document.getElementById('unfinished_amount_value').innerHTML = unfinished_amount
			+ '件';
	document.getElementById('finished_amount_value').innerHTML = order_cur_finish_num
			+ '件';
	document.getElementById('amount_value').innerHTML = amount + '件';
	// 如果本次数量超出前道 提醒 8-18 xtj
	alertNotice(data);
}

// 加载中间显示数据
function loadCenterFormData(natureValue, natureText, showInfo) {
	// 获取需要查询的流程数据
	var order_id = centerPanel.getForm().findField('order_id').getValue();
	if (Ext.isEmpty(order_id)) {
		return;
	}
	Ext.Ajax.request({
				url : './ordRecord.ered?reqCode=getOrdAmountByNuture',
				success : function(response) {
					var resultArray = Ext.util.JSON
							.decode(response.responseText);
					resultArray.natureValue = natureValue;
					resultArray.natureText = natureText;
					showInfo(resultArray);
				},
				failure : function(response) {
					var resultArray = Ext.util.JSON
							.decode(response.responseText);
					Ext.Msg.alert('提示', resultArray.msg);
				},
				params : {
					nature : natureValue,
					order_id : order_id
				}
			});
}
/**
 * 请求
 * 
 * @param {}
 *            url
 * @param {}
 *            params
 * @param {}
 *            successfun
 * @param {}
 *            failefun
 */
function formRequestProxy(url, params, successfun, failefun) {
	centerPanel.getForm().submit({
				url : url,
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : successfun,
				failure : failefun,
				params : params
			});
}
/**
 * 流程性质改变时发生的函数
 */
function natureChangeFun() {
	showInfo4First(); // 设置数量性质显示的默认信息
}
/**
 * 第一次改变流程性质的时候添加此监听,初始化数据
 */
function addListenerFirst() {
	changeGroupChecked(); // 显示下拉框
	loadNature4add(); // 模板新增处理
	if (window_flag == '1') {
		selectNature4add('0'); // 新增情况下处理数据 不触发事件
	}
	// 添加临时事件
	Ext.getCmp('natureType').addListener('change', changeGroupChecked) // 设置数量性质的显示
	Ext.getCmp('natureType').addListener('change', natureChangeFun) // 设置数量性质的下拉框的显示
}
/**
 * 如果clickRecord不为空那么加载nature的下拉框信息
 */
function loadNature4add() {
	if (clickRecord.get == null) {
		return; // 如果clickRecord为空 不处理加载
	}
	var params = {
		attributes : {
			dept_id : clickRecord.get('dept_id')
		}
	};
	changeNaturesStore(params); // 修改部门所允许的流程
}
/**
 * 清楚查询流程数量性质的参数
 */
function clearData4natureRecord() {
	clickRecord = {};
}
/**
 * 当窗口隐藏的时候移除监听,清除数据
 */
function removeListenerFirst() {
	// 隐藏后清除数据
	clearFormPanel4load(centerPanel);
	addStore.removeAll();
	// 移除所有的子节点:保证重新打开窗口的时候需要先查询订单
	removeAllOrderNode();
	// 清除显示的提示信息
	clearDataInfo();
	// 移除临时事件
	Ext.getCmp('natureType').removeListener('change', changeGroupChecked);
	Ext.getCmp('natureType').removeListener('change', natureChangeFun);
	initNaturesStore(initDataStore, '0'); // 清除数据不需要触发事件
	clearData4natureRecord(); // 清楚模板新增的数据
}
/**
 * 移除所有的订单信息节点
 */
function removeAllOrderNode() {
	var nodes = westSouthTreePanel.root.childNodes;
	for (var idx = 0; idx < nodes.length;) {
		var node = nodes[0];
		if (node instanceof Ext.tree.TreeNode) {
			node.remove(false); // 数组是动态变化的
			continue;
		}
		idx++; // 如果没有节点移除 那么序号加1
	}
}

/**
 * 单选框改变时修改数量性质下拉框性质
 */
function changeGroupChecked() {
	var val = Ext.getCmp('natureType').getValue().inputValue;
	Ext.getCmp('nature_id').getEl().up('.x-form-item').setDisplayed(val == '1');
	Ext.getCmp('nature_rollback').getEl().up('.x-form-item')
			.setDisplayed(val == '0');
}
/**
 * 修改单选框修改
 */
function changeGroupChecked4update() {
	var val = Ext.getCmp('update_natureType').getValue().inputValue;
	Ext.getCmp('update_nature_id').getEl().up('.x-form-item')
			.setDisplayed(val == '1');
	Ext.getCmp('update_nature_rollback').getEl().up('.x-form-item')
			.setDisplayed(val == '0');
}
/**
 * 设置相应数量性质的默认选择框
 */
function showInfo4First() {
	var type = Ext.getCmp('natureType').getValue().inputValue;
	if (type == '1') {
		selectFirst4nature()
	} else if (type == '0') {
		selectFirst4rollbackNature();
	}
}

/**
 * 如果为空返回默认值，没有默认值返回空字符串
 * 
 * @param {}
 *            val
 * @param {}
 *            defaultVal
 * @return {}
 */
function getValueFilterEmpty(val, defaultVal) {
	if (Ext.isEmpty(val)) {
		return Ext.isEmpty(defaultVal) ? '' : defaultVal;
	}
	return val;
}
/**
 * 显示修改窗口的时候选择下拉框显示
 */
function showupdateform() {
	Ext.getCmp('update_natureType').addListener('change',
			changeGroupChecked4update)
}
/**
 * 当修改窗口隐藏的时候清空修改的数据
 */
function clearupdateform() {
	clearFormPanel4load(updateForm);
	initNaturesStore(initDataStore,'0'); // 界面隐藏，初始化数量性质下拉框
	Ext.getCmp('update_natureType').removeListener('change',
			changeGroupChecked4update)
}

// ~viewport
var viewport = new Ext.Viewport({
			layout : 'border',
			items : [ordDayListGrid]
		});

/**
 * 返回流程类型
 * 
 * @return {}
 */
function getNatureType(natureType) {
    natureType = natureType || 'natureType';
	return Ext.getCmp(natureType).getValue().inputValue;
}

/**
 * 检验和前道程序的数量
 * 
 * @param {}
 *            data
 */
function alertNotice(data) {
	// 如果本次数量超出前道 提醒 8-18 xtj
	var order_cur_finish_num = getValueFilterEmpty(data.finish_num, 0);
	var pre_finish_num = getValueFilterEmpty(data.pre_finish_num, 0);
	var amount = Ext.getCmp('amount').getValue();
	amount = getValueFilterEmpty(amount, 0);
	if (parseInt(amount) + parseInt(order_cur_finish_num) > parseInt(pre_finish_num)
			&& getNatureType() == '1') {
		document.getElementById('pre_finished_notice').innerHTML = '已超出前道完成数量';
	} else {
		document.getElementById('pre_finished_notice').innerHTML = '';
	}
}

/**
 * 新增下处理首次显示的数量性质数据
 */
function selectNature4add(flag) {
	selectFirst4nature(flag);
}
/**
 * 所有的数量性质选择第一个选项
 */
function selectFirst4AllNature() {
	selectFirst4nature();
	selectFirst4rollbackNature();
}

/**
 * 正常流程选择第一个
 */
function selectFirst4nature(flag, nature) {
	var value = '';
	if (!Ext.isEmpty(nature)) {
		value = nature;
	} else {
		var storeSize = natureStore.getCount();
		if (storeSize > 0) { // 正常流程有数据的情况下选择第一个
			var value = natureStore.getAt(0).get('value');
		}
	}
	if (window_flag == '1') {
		Ext.getCmp('nature_id').setValue(value);
	} else if (window_flag == '2') {
		Ext.getCmp('update_nature_id').setValue(value);
	}
	// 事件处理
	if (flag != '0') { // 不为0 的情况下触发事件
        var natureType = '';
        var typeId = '';
        if(window_flag == '1'){ // 新增
            natureType = 'natureType';
            typeId = 'nature_id';
        }else if(window_flag == '2'){   // 修改
            natureType = 'update_natureType';
            typeId = 'update_nature_id';
        }
		var type = getNatureType(natureType);
		if (type == '1') { // 选择了正常流程时候触发事件
			Ext.getCmp(typeId)
					.fireEvent('select', Ext.getCmp(typeId));
		}
	}
}
/**
 * 回退流程选择第一个
 */
function selectFirst4rollbackNature(flag, nature) {
	var value = '';
	if (!Ext.isEmpty(nature)) {
		value = nature;
	} else {
		var storeSize = natureStore4rollback.getCount();
		if (storeSize > 0) { // 正常流程有数据的情况下选择第一个
			var value = natureStore4rollback.getAt(0).get('value');
		}
	}
	if (window_flag == '1') { // 新增
		Ext.getCmp('nature_rollback').setValue(value);
	} else if (window_flag == '2') { // 修改
		Ext.getCmp('update_nature_rollback').setValue(value);
	}
	// 事件触发
	if (flag != '0') {
        var natureType = '';
        var typeId = '';
        if(window_flag == '1'){ // 新增
            natureType = 'natureType';
            typeId = 'nature_rollback';
        }else if(window_flag == '2'){   // 修改
            natureType = 'update_natureType';
            typeId = 'update_nature_rollback';
        }
        var type = getNatureType(natureType);
		if (type == '0') { // 选择了回退流程时候触发事件
			Ext.getCmp(typeId).fireEvent('select',
					Ext.getCmp(typeId));
		}
	}
}

// ~查询数量性质所使用到的store
var natureStore_temp = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : './ordRecord.ered?reqCode=queryNature&naturetype=1'
					}),
			reader : new Ext.data.JsonReader({
						root : 'ROOT'
					}, ['value', 'text'])
		});
natureStore_temp.on('datachanged', function(store, records) {
			initStore4Nature(natureStore_temp);
		});
var natureStore4rollback_temp = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : './ordRecord.ered?reqCode=queryNature&naturetype=0'
					}),
			reader : new Ext.data.JsonReader({
						root : 'ROOT'
					}, ['value', 'text'])
		});
natureStore4rollback_temp.on('datachanged', function(store, records) {
			initStore4Rollback(natureStore4rollback_temp);
		});
/**
 * 修改数量性质的流程，在选择部门或者工厂，点击新增的时候执行函数
 * 
 * @param {}
 *            deptData 传入企业，部门的信息{grp_id:XXXX,dept_id:XXXX}
 */
function changeNaturesStore(node) {
	var params = node.attributes;
	natureStore_temp.load({
				params : params
			});
	natureStore4rollback_temp.load({
				params : params
			});
	// deptData为空执行initNatures方法并返回
	// 从后台查询本部门数量性质的数据
	// 如果没有数据执行initNatures方法并返回
	// 如果有数据则修改数量性质下拉框的数据
}
/**
 * 初始化数量性质流程的数量 flag 1:触发事件 0:不触发事件 默认为0
 */
function initNaturesStore(store, flag) {
	initStore4Nature(store, flag);
	initStore4Rollback(store, flag);
}
/**
 * 正常流程数据初始化
 */
function initStore4Nature(store, flag, nature) {
	natureStore.removeAll();
	natureStore.add(store.getRange());
	selectFirst4nature(flag, nature);
}
/**
 * 回退流程数据的初始化
 */
function initStore4Rollback(store, flag, nature) {
	natureStore4rollback.removeAll();
	natureStore4rollback.add(store.getRange());
	selectFirst4rollbackNature(flag, nature);
}
/**
 * 检验数量性质的正确性
 * @param natureName  流程性质id
 * @param nature_id 正常流程数量性质id
 * @param nature_rollback 回退流程数量性质id
 * <2015-02-04 修改  >
 */
function valideNatureData(natureName, nature_id, nature_rollback) {
    var natureName = natureName || 'natureType';    // 默认为新增界面的id
	var type = Ext.getCmp(natureName).getValue().inputValue;
	if (type == '1') {
		return valideData4nature(nature_id);
	} else if (type = '0') {
		return valideData4rollback(nature_rollback);
	}
}
/**
 * 验证正常流程
 * @param nature_id 流程id
 */
function valideData4nature(nature_id) {
    nature_id = nature_id || 'nature_id';   // 默认为流程id
	var val = Ext.getCmp(nature_id).getValue();
	if (Ext.isEmpty(val)) {
		return false;
	}
	isValide = false;
	natureStore.each(function(record) {
				var key = record.get('value');
				if (key == val) { // 找到存在的流程
					isValide = true;
					return false;
				}
			})
	return isValide;
}
/**
 * 验证回退流程
 * @param nature_rollback 回退流程id
 */
function valideData4rollback(nature_rollback) {
    nature_rollback = nature_rollback || 'nature_rollback'
	var val = Ext.getCmp(nature_rollback).getValue();
	if (Ext.isEmpty(val)) {
		return false;
	}
	isValide = false;
	natureStore4rollback.each(function(record) {
				var key = record.get('value');
				if (key == val) { // 找到存在的流程
					isValide = true;
					return false;
				}
			})
	return true;
}

/**
 * 清除刷卡交接的显示信息
 */
function clearDataInfo() {
	document.getElementById('nature_value').innerHTML = '';
	document.getElementById('finish_nature_value').innerHTML = '';

	document.getElementById('unfinished_amount_value').innerHTML = '' + '件';
	document.getElementById('finished_amount_value').innerHTML = '' + '件';
	document.getElementById('amount_value').innerHTML = '' + '件';
}

// 仿照eredg4的clearFormPanel取消reset
function clearFormPanel4load(form) {
	// 只对表单中的一些类型进行清除
	var typeArray = ['textfield', 'combo', 'datefield', 'textarea',
			'numberfield', 'htmleditor', 'timefield', 'checkboxgroup'];
	for (var i = 0; i < typeArray.length; i++) {
		var typeName = typeArray[i];
		var itemArray = form.findByType(typeName);
		for (var j = 0; j < itemArray.length; j++) {
			var element = itemArray[j];
			element.setValue('');
		}
	}
}
