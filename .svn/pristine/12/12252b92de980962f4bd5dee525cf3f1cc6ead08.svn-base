/** ********全局变量*********** */
var constantCol = ['country', 'color', 'in_length'];
var belong_grp_id;
var ignore_flag = '0', window_flag = '';
var update_grp_id, update_dept_id, update_team_no;
var ordRecord4nature = {}; // 加载数据保存
var colValue;
var insOrdStore = new Ext.data.Store({});
var insOrdStoreEdit = new Ext.data.Store({});
// 用于计算并显示
var unfinishStroe = new Ext.data.Store({});
var westCenterTreeNode = new Ext.tree.AsyncTreeNode({
			text : '根节点',
			id : '001'
		});
var rollback2nature = {
	'80' : '2',
	'81' : '4',
	'82' : '6',
	'83' : '6',
	'84' : '10',
	'85' : '11'
}
var rollbackNatures = ['80', '81', '82', '83', '84', '85'];
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
			changeNaturesStore(node); // 修改数量性质
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

	// 载入生产通知单订单数,指令数 xtj 11.10
	prodInsNumStore.load({
				params : {
					ord_seq_no : order_id
					// prod_ord_seq : order_id
				}
			});

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
	width : 250,
	title : '<span style="font-weight:normal">订单查询窗口</span>',
	collapsible : true,
	minSize : 160,
	maxSize : 400,
	split : true,
	items : [westCenterTreePanel]
		// , westSouthTreePanel
	});

// ================================================指令数窗口===================//

/**
 * 指令数量信息
 */
var prodInsNumStore = new Ext.data.Store({
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy({
						url : './ordRecord.ered?reqCode=queryProdInsInfo'
					}),
			// 数据读取器
			reader : new Ext.data.JsonReader({
						totalProperty : 'TOTALCOUNT', // 记录总数
						root : 'ROOT' // Json中的列表数据根节点
					}, ['country', 'color', 'in_length', 'ins_num', 'num',
							'real_cut_num', 'drew_num', 'product_num'])
		});

/**
 * 重组store
 */
prodInsNumStore.on('load', function() {
			// 清空store前保证grid不是编辑状态
			if (insOrdGridEdit.activeEditor != null) {
				insOrdGridEdit.activeEditor.completeEdit();
			}
			insOrdStore.removeAll();
			insOrdStoreEdit.removeAll();
			unfinishStroe.removeAll();
			var recordCount = prodInsNumStore.getCount();
			colValue = prodInsNumStore.getAt(0).get('num');
			// 重组cm
			// setColumnsData();
			// 重组成 store
			for (var i = 0; i < recordCount; i++) {
				var record = prodInsNumStore.getAt(i);
				var columnValue = record.get("ins_num").split(',');
				var cut_columnValue = record.get("real_cut_num").split(',');
				var drew_columnValue = record.get("drew_num").split(',');
				var product_columnValue = record.get("product_num").split(',');
				// 这里的num是腰围信息
				var column = record.get("num").split(',');
				for (var j = 0; j < column.length; j++) {
					record.set("num" + column[j], columnValue[j]);
					record.set("real_cut_num" + column[j], cut_columnValue[j]);
					record.set("drew_num" + column[j], drew_columnValue[j]);
					record.set("product_num" + column[j],
							product_columnValue[j]);
				}
				insOrdStore.add(record);
				// 未完成数量的store
				unfinishStroe.add(record.copy());
				// 重组可填写行数据
				var insGridCM = insOrdGrid.getColumnModel();
				var insOrdGridCount = insGridCM.getColumnCount();
				var insRecord = new Ext.data.Record({});
				for (var idx = 0; idx < insOrdGridCount; idx++) {
					var dataIndex = insGridCM.getDataIndex(idx);
					switch (dataIndex) {

						case "country" :
							insRecord.set(dataIndex, record.get("country"));
							break;
						case "color" :
							insRecord.set(dataIndex, record.get("color"));
							break;
						case "in_length" :
							insRecord.set(dataIndex, record.get("in_length"));
							break;
						default :
							insRecord.set(dataIndex, '');
					}

				}
				insOrdStoreEdit.add(insRecord);
			}

		})

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

// 表格实例
var insOrdGridEdit = new Ext.grid.EditorGridPanel({
			id : 'numGrid_prodord',
			title : '本次完成数量信息',
			height : 150,
			frame : true,
			border : false,
			autoEncode : true,
			autoScroll : true,
			region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
			store : insOrdStoreEdit, // 数据存储
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

// 显示用表格
var insOrdGrid = new Ext.grid.GridPanel({
			id : 'numGrid_show',
			title : '未完成数量信息',
			height : 150,
			frame : true,
			border : false,
			autoEncode : true,
			autoScroll : true,
			region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
			store : insOrdStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : insOrdcm, // 列模型
			viewConfig : {
				forceFit : true
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});

insOrdGridEdit.addListener('afteredit', function() {
			updateInsNumInfo();
			Ext.getCmp('amount').fireEvent('keyup', Ext.getCmp('amount'));
		})

function updateInsNumInfo() {
	if (insOrdGridEdit.activeEditor != null) {
		insOrdGridEdit.activeEditor.completeEdit();
	}
	var ins_num = 0;
	// 获取除制定列之外的其他列信息
	var insGridCM = insOrdGridEdit.getColumnModel();
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
	var records = insOrdGridEdit.getStore().getRange();
	var recordsLength = records.length;
	var dataIndexLength = colNumDataIndex.length;
	var unrecords = unfinishStroe.getRange();
	// 获取未完成数量
	for (var idx = 0; idx < recordsLength; idx++) {
		for (var k = 0; k < dataIndexLength; k++) {
			var numu = unrecords[idx].get(colNumDataIndex[k].trim());
			var numData = records[idx].get(colNumDataIndex[k].trim());
			if (Ext.isEmpty(numData)) {
				numData = 0;
			}
			Ext.getCmp('numGrid_show').getStore().getRange()[idx].set(
					colNumDataIndex[k].trim(), numu - numData);
			// if (!Ext.isEmpty(numData)) {
			// var nums = numu - numData;
			// // unrecords[idx].set(colNumDataIndex[k].trim(),nums);
			// Ext.getCmp('numGrid_show').getStore().getRange()[idx].set(
			// colNumDataIndex[k].trim(), nums);
			// }
			ins_num += Ext.isEmpty(numData) ? 0 : parseInt(numData);
		}
	}
	Ext.getCmp('amount').setValue(ins_num);
}
/**
 * 添加列信息，不能修改
 */
function setColumnsData() {
	var column = colValue;
	insOrdStore.removeAll();
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
		insColumn.push({
					header : colBean,
					dataIndex : 'num' + colBean,
					align : 'center',
					width : 60,
					sortable : true
				});
	}

	insOrdGrid.getColumnModel().setConfig(insColumn);

}
/**
 * 根据数量性质重载grid数据
 * 
 * @param {}
 *            natureId
 */
function changeColumnsData(natureId) {
	if (insOrdGridEdit.activeEditor != null) {
		insOrdGridEdit.activeEditor.completeEdit();
	}
	var column = colValue;
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
			// editor : new Ext.form.TriggerField({
			// allowBlank : true
			// })
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
	var numtype = '';
	switch (natureId) {
		case '1' :
			Ext.getCmp('numGrid_prodord').setTitle('本次裁出数量信息');
			var numtype = 'real_cut_num';
			break;
		case '2' :
			Ext.getCmp('numGrid_prodord').setTitle('本次领片数量信息');
			var numtype = 'drew_num';
			break;
		case '14' :
			Ext.getCmp('numGrid_prodord').setTitle('本次出运数量信息');
			var numtype = 'product_num';
			break;

	}
	for (var i = 0; i < columnsValue.length; i++) {
		var colBean = columnsValue[i].trim();
		insColumn.push({
					header : colBean,
					dataIndex : numtype + colBean,
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
	insOrdGridEdit.getColumnModel().setConfig(insColumn);
	insOrdGrid.getColumnModel().setConfig(insColumn);
	insOrdGrid.getView().refresh();
}
// ================================================指令数窗口结束===================//

// 中间显示
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
										id : 'actiondata',
										fieldLabel : '记录日期',
										// readOnly: true,
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
										name : 'cust_name',
										id : 'cust_name'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '品名',
										readOnly : true,
										name : 'article',
										id : 'article'
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
										name : 'order_id',
										id : 'order_id4print'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '标记',
										readOnly : true,
										name : 'ribbon_color',
										id : 'ribbon_color4print'
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
										name : 'style_no',
										id : 'style_no4print'
									}, {
										anchor : '100%',
										xtype : 'textfield',
										fieldLabel : '开单数',
										readOnly : true,
										name : 'ins_num',
										id : 'ins_num',
										labelStyle : 'color:red;'
									}, {
										fieldLabel : '单据号',
										xtype : 'hidden',
										name : 'seq_no',
										id : 'seq_no4print'
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
										if (natureValue == '1'|| natureValue == '14') {
											//Ext.getCmp("amount").setReadOnly(true);
											// Ext.getCmp("amount").setValue(0);
											// Ext.getCmp('numGrid_show').getStore().removeAll();
											changeColumnsData(natureValue);
											Ext.getCmp('numGrid_prodord')
													.setVisible(true);
											Ext.getCmp('numGrid_show')
													.setVisible(true);

										} else {
											Ext.getCmp("amount")
													.setReadOnly(true);
											Ext.getCmp("amount")
													.setReadOnly(false);
											Ext.getCmp('numGrid_prodord')
													.setVisible(false);
											Ext.getCmp('numGrid_show')
													.setVisible(false);
										}
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
								// allowNegative : false, // 是否允许输入负数
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

										var natureType = getNatureType();
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
										xtype : 'textfield',
										fieldLabel : '备注',
										name : 'remark',
										id : 'remark'
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
										xtype : 'hidden',
										name : 'cust_id',
										id : 'cust_id'
									}]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 1,
							items : [insOrdGrid]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 1,
							items : [insOrdGridEdit]
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
						id : 'showInfo',
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
										fieldLabel : '移交(送货）人',
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
										fieldLabel : '移交(送货）人',
										name : 'submit_name',
										id : 'submit_name',
										readyOnly : true,
										allowBlank : false
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
										readOnly : true,
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
	items : [westPanel, centerPanel]
		/* ,eastPanel */
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
			header : '移交(送货）人',
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
// 获取打印数据
function getPrintData() {

	var data = {};
	data.actiondata = Ext.util.Format.date(Ext.getCmp("actiondata").getValue(),
			'Y-m-d');
	data.seqno = Ext.getCmp('seq_no4print').getValue();
	data.factory = Ext.getCmp('grp_name').getValue();
	data.cust = Ext.getCmp('cust_name').getValue();
	data.article = Ext.getCmp('article').getValue();
	data.dept = Ext.getCmp('dept_name').getValue();
	data.orderno = Ext.getCmp('order_id4print').getValue();
	data.flag = Ext.getCmp('ribbon_color4print').getValue();
	data.team = Ext.getCmp('team_name').getValue();
	data.style = Ext.getCmp('style_no4print').getValue();
	// 指令数
	data.ins_num = Ext.getCmp('ins_num').getValue();
	// 数量性质
	data.nature = getNatureName();
	// 已完成
	data.order_cur_finish_num = document
			.getElementById('finished_amount_value').innerText;
	// 当前数量
	data.number = Ext.getCmp('amount').getValue();
	// 未完成
	data.unfinished_amount = document.getElementById('unfinished_amount_value').innerText;
	data.remark = Ext.getCmp("remark").getValue();
	data.submitname = Ext.getCmp('submitname').getValue();
	data.surename = Ext.getCmp('surename').getValue();
	data.drivername = Ext.getCmp('drivername').getValue();
	data.submitname_id = Ext.getCmp('submitname_id').getValue();
	data.surename_id = Ext.getCmp('surename_id').getValue();
	data.drivername_id = Ext.getCmp('drivername_id').getValue();
	return data;
}
function getNatureName() {
	var type = getNatureType();
	var natureid = '';
	if (type == '1') {
		natureid = 'nature_id';
	} else if (type == '0') {
		natureid = 'nature_rollback';
	}
	return Ext.getCmp(natureid).getRawValue();
}

var addWindow = new Ext.Window({
			layout : 'border',
			maximized : true,// ie 下虽然指定最大话,但还要指定宽度和高度,不然页面显示失常
			width : document.body.clientWidth - 250,
			title : '流水账输入',
			closeAction : 'hide',
			items : [addForm], // , addGrid
			buttons : [

			{
				text : '保存并打印',
				id : 'save4ordButton',
				iconCls : 'acceptIcon',
				handler : function() {
					// 数据完整性判断
					var rollback = Ext.getCmp('nature_rollback').getValue();
					var nature = Ext.getCmp('nature_id').getValue();
					var type = getNatureType();
					if ((type == '0' && Ext.isEmpty(rollback)) || type == '1'
							&& Ext.isEmpty(nature)) {
						Ext.Msg.alert('提示', '请选择数量性质');
						return;
					}
					var finish_num = ordRecord4nature.finish_num;
					var amount = Ext.getCmp('amount').getValue();
					if (Ext.isEmpty(amount) || amount == 0) {
						Ext.Msg.alert('提示', '数量不能为0');
						return;
					}
					// 判断退货数量不能比完成数量大
					if (type == '0' && (finish_num - amount) < 0) {
						Ext.Msg.alert('提示', '退货数量不能比完成数量大')
						return;
					}
					var isValide = valideNatureData();
					if (!isValide) {
						Ext.Msg.alert('提示', '请选择合适的数量性质');
						return;
					}
					var html1 = document.getElementById('info1').innerHTML;
					var html2 = document.getElementById('info2').innerHTML;
					var html3 = document.getElementById('info3').innerHTML;
					var html4 = document.getElementById('info4').innerHTML;
					var htmlVal = html1 + '</br>' + html2 + "</br>" + html3
							+ "</br>" + html4;
					//12.19todo 当数量是负数的时候重写提示
					if(amount<0){
						var html6 = document.getElementById('unfinished_amount_value').innerHTML;
						var htmlVal='<span  style="color:red;font-size:28">本次操作之后，累计未完成数量为'+html6+'</span>';
					}
					if (centerPanel.getForm().isValid()) {
						showNatureSure(htmlVal);
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

var isPrintFlag = false; // 是否打印标识，false为不打印，true为打印
var sure_win = new Ext.Window({
			layout : 'fit',
			width : 400,
			height : 200,
			modal : true,
			draggable : true,
			closeAction : 'hide',
			pageY : 100,
			pageX : document.body.clientWidth / 2 - 200 / 2,
			title : '请确认数量',
			buttonAlign : 'right',
			border : false,
			animateTarget : Ext.getBody(),
			items : [{
						id : 'sureHtml',
						html : ''
					}],
			buttons : [{
						text : '保存并打印',
						iconCls : 'acceptIcon',
						handler : function() {
							isPrintFlag = true; // 打印
							saveOrdDayList();
						}

					}, {
						text : ' 仅保存',
						iconCls : 'acceptIcon',
						handler : function() {
							isPrintFlag = false; // 不打印
							saveOrdDayList();
						}
					}, {
						text : '取消',
						iconCls : 'deleteIcon',
						handler : function() {
							sure_win.hide();
						}
					}]
		});

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
						Ext.getCmp("seq_no4print")
								.setValue(action.result.seq_no.currval);
						var printData = getPrintData();
						printOrdDaylist(printData, 2);
						clearForm();
						Ext.getCmp('numGrid_prodord').setVisible(false);
						Ext.getCmp('numGrid_show').setVisible(false);
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
						submit_id : centerPanel.findById('submitname_id')
								.getValue(),
						sure_id : centerPanel.findById('surename_id')
								.getValue(),
						driver_id : centerPanel.findById('drivername_id')
								.getValue(),
						insOrdRecordStr : getInsOrdRecordStr(),
						colValue : colValue
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
						dataUrl : './ordRecord.ered?reqCode=grpTreeInit'
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
						dataUrl : './ordRecord.ered?reqCode=deptTreeInit'
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
	allowBlank : false,
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
			header : '移交(送货）人',
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
// 保存模板新增的模式下的数据
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
				handler : function() {
					// 处理显示数据
					Ext.getCmp('natureType').setValue('1'); // 新增默认设置为正常流程
					window_flag = '1';
					addWindow.show();
					// ordQueryWindow.show(); // 显示查询框
					ordSelectWindow.show();
				}
			}, '-', {
				text : '模板新增',
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
	}
}
var viewport = new Ext.Viewport({
			layout : 'border',
			items : [ordDayListGrid]
		});

/**
 * 打印函数
 * 
 * @param {}
 *            data 打印数据
 * @param {}
 *            time 打印次数
 */
function printOrdDaylist(data, time) {
	if (time-- > 0) {
		printDataInfo(data);
		setTimeout(_printOrdDaylist(data, time), 2000); // 2秒后再次打印
	}
}

function _printOrdDaylist(data, time) {
	return function() {
		printOrdDaylist(data, time);
	}
}
/**
 * 打印的方法
 */
function printDataInfo(data) {
	try {
		var printData = data;
		LODOP = getLodop(document.getElementById('LODOP_OB'), document
						.getElementById('LODOP_EM'));
		LODOP.PRINT_INIT("移交记录");
		LODOP.SET_PRINT_PAGESIZE(3, '58mm', '3mm', '');
		LODOP.SET_PRINT_STYLE("Alignment", 2);
		LODOP.ADD_PRINT_TEXT('3mm', 0, '55mm', '20mm', "移交记录")
		LODOP.SET_PRINT_STYLE("Alignment", 1);
		LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
		LODOP.SET_PRINT_STYLEA(1, "FontSize", 14);
		LODOP.SET_PRINT_STYLEA(1, "Bold", 1);
		LODOP.ADD_PRINT_TEXT("10mm", '0mm', '55mm', '5mm', "记录日期："
						+ parseDataFilterNull(printData.actiondata));
		LODOP.ADD_PRINT_TEXT("15mm", '0mm', '55mm', '5mm', "单据号："
						+ parseDataFilterNull(printData.seqno));
		LODOP.ADD_PRINT_TEXT("20mm", '0mm', '55mm', '5mm', "工厂:"
						+ parseDataFilterNull(printData.factory));
		LODOP.ADD_PRINT_TEXT("25mm", '0mm', '55mm', '5mm', "部门:"
						+ parseDataFilterNull(printData.dept));
		LODOP.ADD_PRINT_TEXT("30mm", '0mm', '55mm', '5mm', "班组："
						+ parseDataFilterNull(printData.team));
		LODOP.ADD_PRINT_TEXT("35mm", '0mm', '55mm', '5mm', "客户："
						+ parseDataFilterNull(printData.cust));
		LODOP.ADD_PRINT_TEXT("40mm", '0mm', '55mm', '5mm', "订单号："
						+ parseDataFilterNull(printData.orderno));
		LODOP.ADD_PRINT_TEXT("45mm", '0mm', '55mm', '5mm', "款号："
						+ parseDataFilterNull(printData.style));
		LODOP.ADD_PRINT_TEXT("50mm", '0mm', '55mm', '5mm', "标记："
						+ parseDataFilterNull(printData.flag));
		LODOP.ADD_PRINT_TEXT("55mm", '0mm', '55mm', '10mm', "品名："
						+ parseDataFilterNull(printData.article));
		LODOP.ADD_PRINT_TEXT("60mm", '0mm', '55mm', '5mm', "开单数："
						+ parseDataFilterNull(printData.ins_num));
		LODOP.ADD_PRINT_TEXT("65mm", '0mm', '55mm', '5mm', "数量性质："
						+ parseDataFilterNull(printData.nature));
		LODOP.ADD_PRINT_TEXT("70mm", '0mm', '55mm', '5mm',
				parseDataFilterNull(printData.nature) + "已完成："
						+ parseDataFilterNull(printData.order_cur_finish_num));
		LODOP.ADD_PRINT_TEXT("75mm", '0mm', '55mm', '5mm',
				parseDataFilterNull(printData.nature) + "本次完成："
						+ parseDataFilterNull(printData.number));
		LODOP.ADD_PRINT_TEXT("80mm", '0mm', '55mm', '5mm',
				parseDataFilterNull(printData.nature) + "未完成："
						+ parseDataFilterNull(printData.unfinished_amount));
		LODOP.ADD_PRINT_TEXT("85mm", '0mm', '55mm', '5mm', "移交(送货）人:"
						+ parseDataFilterNull(printData.submitname));
		LODOP.ADD_PRINT_TEXT("90mm", '0mm', '55mm', '5mm', "收货人:"
						+ parseDataFilterNull(printData.surename));
		LODOP.ADD_PRINT_TEXT("95mm", '0mm', '55mm', '5mm', "司机："
						+ parseDataFilterNull(printData.drivername));
		LODOP.ADD_PRINT_TEXT("100mm", '0mm', '55mm', '10mm', "备注："
						+ parseDataFilterNull(printData.remark));
		// LODOP.PREVIEW(); //预览
		LODOP.PRINT(); // 直接打印
	} catch (err) {
		console.error(err);
		Ext.Msg.alert("打印失败" + err);
	}
}
/**
 * 
 * @param {}
 *            value
 * @return {}
 */
function parseDataFilterNull(value) {
	return value == null ? "" : value
};
/**
 * 确认显示框
 */
function showNatureSure(value) {
	sure_win.show();
	Ext.getCmp('sureHtml').update(value);
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

	var natureType = getNatureType();
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
	changeGroupChecked(); // 默认第一次显示的样式
	loadNature4add();
	if (window_flag == '1') { // 新增
		selectNature4add();
	}
	// 添加临时事件
	Ext.getCmp('natureType').addListener('change', changeGroupChecked);
	Ext.getCmp('natureType').addListener('change', natureChangeFun);

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
	// window隐藏的时候清楚数据的显示
	clearDataInfo();
	// 移除临时事件
	Ext.getCmp('natureType').removeListener('change', changeGroupChecked);
	Ext.getCmp('natureType').removeListener('change', natureChangeFun);
	initNaturesStore(initDataStore, '0');
	clearData4natureRecord();
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
	var val = getNatureType();
	Ext.getCmp('nature_id').getEl().up('.x-form-item').setDisplayed(val == '1');
	Ext.getCmp('nature_rollback').getEl().up('.x-form-item')
			.setDisplayed(val == '0');
}
/**
 * 设置相应数量性质的默认选择框
 */
function showInfo4First() {
	var type = getNatureType();
	if (type == '1') {
		selectFirst4nature();
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
 * 返回流程类型
 * 
 * @return {}
 */
function getNatureType() {
	return Ext.getCmp('natureType').getValue().inputValue;
}

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
function selectNature4add() {
	selectFirst4nature();
}
/**
 * 所有的数量性质选择第一个选项
 */
function selectFirst4AllNature() {
	selectFirst4nature();
	selectFirst4rollbackNature();
}

/**
 * 正常流程选择第一个 flag 1:触发事件，0：不触发 默认为触发
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
	Ext.getCmp('nature_id').setValue(value);
	if (flag != '0') {
		var type = getNatureType();
		if (type == '1') { // 选择了正常流程时候触发事件
			Ext.getCmp('nature_id')
					.fireEvent('select', Ext.getCmp('nature_id'));
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
	Ext.getCmp('nature_rollback').setValue(value);
	if (flag != '0') {
		var type = getNatureType();
		if (type == '0') { // 选择了回退流程时候触发事件
			Ext.getCmp('nature_rollback').fireEvent('select',
					Ext.getCmp('nature_type'));
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
 * 初始化数量性质流程的数量 flag 是否触发事件1：触发，0：不触发
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
 */
function valideNatureData() {
	var type = Ext.getCmp('natureType').getValue().inputValue;
	if (type == '1') {
		return valideData4nature();
	} else if (type = '0') {
		return valideData4rollback();
	}
}
/**
 * 验证正常流程
 */
function valideData4nature() {
	var val = Ext.getCmp('nature_id').getValue();
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
 */
function valideData4rollback() {
	var val = Ext.getCmp('nature_rollback').getValue();
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
// 重组size info

function getInsOrdRecordStr() {
	if (insOrdGridEdit.activeEditor != null) {
		insOrdGridEdit.activeEditor.completeEdit();
	}
	var insOrdRecords = insOrdStoreEdit.getRange();
	// 創建jason
	var ordRecordStr = "[", insOrdRecordStr = "[";

	// 获取列的列表行数
	var gridCm = insOrdGrid.getColumnModel();
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
	// 遍历record组成map
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
			insOrdRecordStr = insOrdRecordStr + "'" + keyname + "':'"
					+ insOrdRecord.get(key) + "',";
		}

		if (insOrdRecordStr.length > 1) {
			insOrdRecordStr = insOrdRecordStr.substring(0,
					insOrdRecordStr.length - 1);
		}
		insOrdRecordStr = insOrdRecordStr + "},";
	}

	if (insOrdRecordStr.length > 1) {
		insOrdRecordStr = insOrdRecordStr.substring(0, insOrdRecordStr.length
						- 1);
	}
	insOrdRecordStr = insOrdRecordStr + "]";
	return insOrdRecordStr;
}
/**
 * 保存交接信息
 */
function saveOrdDayList() {
	var insOrdRecordStr=getInsOrdRecordStr();
	var params = {
		ignore_flag : ignore_flag,
		submit_name : getValueFilterEmpty(centerPanel.findById('submitname')
						.getValue(), ''),
		sure_name : getValueFilterEmpty(centerPanel.findById('surename')
						.getValue(), ''),
		driver : getValueFilterEmpty(centerPanel.findById('drivername')
						.getValue(), ''),
		submit_id : centerPanel.findById('submitname_id').getValue(),
		sure_id : centerPanel.findById('surename_id').getValue(),
		driver_id : centerPanel.findById('drivername_id').getValue(),
		insOrdRecordStr : insOrdRecordStr,
		colValue : colValue
	};
	var type = getNatureType();
	if (type == '0') {
		// 退货流程
		formRequestProxy('./ordRecord.ered?reqCode=rollbackOrdprod4web',
				params, function(form, action) {
					Ext.Msg.alert('提醒', '退货成功');
					sure_win.hide();
					Ext.getCmp("seq_no4print")
							.setValue(action.result.seq_no.currval);
					var printData = getPrintData();
					if (isPrintFlag)
						printOrdDaylist(printData, 2);
					clearForm();
				}, function(form, action) {
					var isSuccess = action.result.success;
					if (!isSuccess) {
						Ext.Msg.alert('提示', action.result.msg);
					} else {
						Ext.Msg.alert('提示', '操作失败请重试');
					}
					sure_win.hide();
				})
		return;
	}
	// 正常流程
	formRequestProxy('./ordRecord.ered?reqCode=addOrdRecordInfo', params,
			function(form, action) { // 回调函数有2个参数
				Ext.Msg.alert('提醒', '操作成功');
				ignore_flag = "0";
				sure_win.hide();
				Ext.getCmp("seq_no4print")
						.setValue(action.result.seq_no.currval);
				var printData = getPrintData();
				if (isPrintFlag)
					printOrdDaylist(printData, 2);
				clearForm();
				Ext.getCmp('numGrid_prodord').setVisible(false);
				Ext.getCmp('numGrid_show').setVisible(false);
			}, function(form, action) {
				var isSuccess = action.result.success;
				if (!isSuccess) {
					Ext.getCmp('winHtml').html = action.result.msg;
					win.show();
				} else {
					Ext.Msg.alert('提示', '未知错误')
				}
				sure_win.hide();
			});

}

function clearForm() {
	Ext.getCmp('actiondata').setValue('');
	Ext.getCmp('grp_name').setValue('');
	Ext.getCmp('dept_name').setValue('');
	Ext.getCmp('team_name').setValue('');
	Ext.getCmp('cust_name').setValue('');
	Ext.getCmp('order_id4print').setValue('');
	Ext.getCmp('style_no4print').setValue('');
	Ext.getCmp('article').setValue('');
	Ext.getCmp('ribbon_color4print').setValue('');
	Ext.getCmp('ins_num').setValue('');
	Ext.getCmp('amount').setValue('');
	Ext.getCmp('submitname').setValue('');
	Ext.getCmp('remark').setValue('');
	Ext.getCmp('surename').setValue('');
	Ext.getCmp('drivername').setValue('');
	Ext.getCmp('submitname_id').setValue('');
	Ext.getCmp('surename_id').setValue('');
	Ext.getCmp('drivername').setValue('');
}
