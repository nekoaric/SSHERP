var prodOrdre = '<span style="color:red">*</span>'
var prodOrd_flag;
var columnsValue;
var colValue;

var curRow, curCol;
Ext.override(Ext.grid.RowSelectionModel, {

	onEditorKey : function(field, e){
		var k = e.getKey(),
			newCell,
			g = this.grid,
			last = g.lastEdit,
			ed = g.activeEditor,
			ae, last, r, c;
		var shift = e.shiftKey;
		if(k == e.RIGHT){
			e.stopEvent();
			newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
		} else if(k == e.LEFT){
			e.stopEvent();
			newCell = g.walkCells(ed.row, ed.col-1, 1, this.acceptsNav, this);
		}else if(k == e.UP){
			e.stopEvent();
			newCell = g.walkCells(ed.row-1, ed.col, 1, this.acceptsNav, this);
		} else if(k == e.DOWN){
			e.stopEvent();
			newCell = g.walkCells(ed.row+1, ed.col, 1, this.acceptsNav, this);
		}

		if(newCell){
			r = newCell[0];
			c = newCell[1];

			if(r<0){
				return;
			}
			ed.completeEdit();

			if(last.row != r){
				this.selectRow(r);
			}

			if(g.isEditor && g.editing){
				ae = g.activeEditor;
				if(ae && ae.field.triggerBlur){

					ae.field.triggerBlur();
				}
			}
			g.startEditing(r, c);
		}
	}
});

/**
 * 客户下拉框
 */
var custStore = new Ext.data.Store( {
	proxy : new Ext.data.HttpProxy( {
		url : './ordBas.ered?reqCode=getCustIdCombox'
	}),
	reader : new Ext.data.JsonReader( {}, [ {
		name : 'value'
	}, {
		name : 'text'
	} ])
});
custStore.load();

var custCombo = new Ext.form.ComboBox( {
	name : 'cust_id',
	hiddenName : 'cust_id',
	store : custStore,
	mode : 'local',
	triggerAction : 'all',
	valueField : 'value',
	displayField : 'text',
	fieldLabel : '客户' + prodOrdre,
	emptyText : '请选择...',
	allowBlank : false,
	forceSelection : true,
	editable : false,
	typeAhead : true,
	anchor : "84%"
});

/**
 * 订单下拉框
 */
var ordSeqNoStore = new Ext.data.Store( {
	proxy : new Ext.data.HttpProxy( {
		url : './prodOrd.ered?reqCode=getOrdIdCombox'
	}),
	reader : new Ext.data.JsonReader( {}, [ {
		name : 'value'
	}, {
		name : 'text'
	} ])
});
ordSeqNoStore.load();

var ordCombo = new Ext.form.ComboBox( {
	name : 'ord_seq_no',
	hiddenName : 'ord_seq_no',
	id : 'order_ids',
	store : ordSeqNoStore,
	mode : 'local',
	triggerAction : 'all',
	valueField : 'value',
	displayField : 'text',
	fieldLabel : '订单号' + prodOrdre,
	emptyText : '请选择...',
	allowBlank : false,
	forceSelection : true,
	editable : false,
	typeAhead : true,
	anchor : "84%"
});

var ordBasStore = new Ext.data.Store( {
	proxy : new Ext.data.HttpProxy( {
		url : './ordBas.ered?reqCode=queryOrdBasInfo'
	}),
	reader : new Ext.data.JsonReader( {
		totalProperty : 'TOTALCOUNT', // 记录总数
		root : 'ROOT' // Json中的列表数据根节点
	}, [ {
		name : 'seq_no'
	}, {
		name : 'order_date'
	}, {
		name : 'cust_id'
	}, {
		name : 'cust_name'
	}, {
		name : 'brand'
	}, {
		name : 'contract_id'
	}, {
		name : 'order_id'
	}, {
		name : 'style_no'
	}, {
		name : 'article'
	}, {
		name : 'classify'
	}, {
		name : 'material'
	}, {
		name : 'order_num'
	}, {
		name : 'percent'
	}, {
		name : 'deli_date'
	}, {
		name : 'merchandier'
	}, {
		name : 'approved'
	}, {
		name : 'assign_num'
	}, {
		name : 'box_ins'
	}, {
		name : 'point_notes'
	}, {
		name : 'style_drawing'
	}, {
		name : 'size_chart'
	}, {
		name : 'accessory_list'
	}, {
		name : 'process_quota'
	}, {
		name : 'process_desc'
	}, {
		name : 'pattern_code'
	}, {
		name : 'verify'
	}, {
		name : 'prod_plan'
	}, {
		name : 'num_detail_list'
	}, {
		name : 'state'
	} ])
});

ordCombo.on('select', function() {
	var value = ordCombo.getValue();
	ordBasStore.load( {
		params : {
			seq_no : value,
			start : 0,
			limit : 999
		}
	});
});

//选择订单的时候加载订单信息
ordBasStore.on('load', function() {
	var recoder = ordBasStore.getAt(0);
	custCombo.setValue(recoder.get('cust_id'));
	Ext.getCmp('style_no').setValue(recoder.get('style_no'));
	Ext.getCmp('classify').setValue(recoder.get('classify'));
	Ext.getCmp('order_num').setValue(recoder.get('order_num'));
	Ext.getCmp('delivery_date').setValue(recoder.get('deli_date'));
	Ext.getCmp('contract_id').setValue(recoder.get('contract_id'));
	Ext.getCmp('batch').setValue(recoder.get('batch'));
	Ext.getCmp('article').setValue(recoder.get('article'));
	Ext.getCmp('add_proportion').setValue(recoder.get('percent'));
	Ext.getCmp('material').setValue(recoder.get('material'));
	Ext.getCmp('notity_date').setValue(recoder.get('order_date'));
});

var ordStore = new Ext.data.Store( {});

var ordsm = new Ext.grid.CheckboxSelectionModel( {
	singleSelect : false
});

var ordcm = new Ext.grid.ColumnModel( [ ordsm, {
	header : '颜色',
	dataIndex : 'color',
	align : 'center',
	width : 100,
	editor : new Ext.form.TextField( {
		allowBlank : false
	})
}, {
	header : '内长',
	dataIndex : 'in_length',
	align : 'center',
	width : 100,
	sortable : true,
	editor : new Ext.form.TextField( {
		allowBlank : false
	})
}, {
	header : '1',
	dataIndex : 'num1',
	align : 'center',
	width : 40,
	sortable : true,
	editor : new Ext.form.NumberField()
}, {
	header : '2',
	dataIndex : 'num2',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '3',
	dataIndex : 'num3',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '4',
	dataIndex : 'num4',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '5',
	dataIndex : 'num5',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '6',
	dataIndex : 'num6',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '7',
	dataIndex : 'num7',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '8',
	dataIndex : 'num8',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '9',
	dataIndex : 'num9',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '10',
	dataIndex : 'num10',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
} ]);

// 表格工具栏
var ordtbar = new Ext.Toolbar( {
	items : [ {
		text : '添加订单数量信息',
		id : 'prodOrd_submit_button2',
		iconCls : 'page_edit_1Icon',
		handler : function() {
			enterAddForm();
		}
	}, '-', {
		text : '取消订单数信息',
		id : 'prodOrd_cancel_button2',
		iconCls : 'page_edit_1Icon',
		handler : function() {
			deleteOrdData();
		}
	} ]
});

// 表格实例
var ordGrid = new Ext.grid.EditorGridPanel( {
	title : '订单数量信息',
	height : 500,
	frame : true,
	autoEncode : true,
	autoScroll : true,
	region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
	store : ordStore, // 数据存储
	stripeRows : true, // 斑马线
	cm : ordcm, // 列模型
	sm : ordsm,
	pruneModifiedRecords : true,
	tbar : ordtbar, // 表格工具栏
	viewConfig : {
		forceFit : true
	},
	loadMask : {
		msg : '正在加载表格数据,请稍等...'
	}
});

ordGrid.on('afteredit', function(e) {
	var value = e.value;
	var field = e.field;
	var row = e.row;
	if (Ext.isEmpty(insOrdStore.getAt(row).get(field))) {
		insOrdStore.getAt(row).set(field, value);
	}
});

var insOrdsm = new Ext.grid.CheckboxSelectionModel( {
	singleSelect : false
});

var insOrdcm = new Ext.grid.ColumnModel( [ insOrdsm, {
	header : '颜色',
	dataIndex : 'color',
	align : 'center',
	width : 100,
	editor : new Ext.form.TextField( {
		allowBlank : false
	})
}, {
	header : '内长',
	dataIndex : 'in_length',
	align : 'center',
	width : 100,
	sortable : true,
	editor : new Ext.form.TextField( {
		allowBlank : false
	})
}, {
	header : '1',
	dataIndex : 'num1',
	align : 'center',
	width : 40,
	sortable : true,
	editor : new Ext.form.NumberField()
}, {
	header : '2',
	dataIndex : 'num2',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '3',
	dataIndex : 'num3',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '4',
	dataIndex : 'num4',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '5',
	dataIndex : 'num5',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '6',
	dataIndex : 'num6',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '7',
	dataIndex : 'num7',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '8',
	dataIndex : 'num8',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '9',
	dataIndex : 'num9',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
}, {
	header : '10',
	dataIndex : 'num10',
	align : 'center',
	width : 40,
	editor : new Ext.form.NumberField(),
	sortable : true
} ]);
var insOrdStore = new Ext.data.Store( {});

// 表格工具栏
var insOrdtbar = new Ext.Toolbar( {
	items : [ {
		text : '添加指令数量信息',
		id : 'prodOrd_submit_button1',
		iconCls : 'page_edit_1Icon',
		handler : function() {
			enterAddForm();
		}
	}, '-', {
		text : '取消指令数量信息',
		id : 'prodOrd_cancel_button1',
		iconCls : 'page_edit_1Icon',
		handler : function() {
			deleteInsData();
		}
	} ]
});

// 表格实例
var insOrdGrid = new Ext.grid.EditorGridPanel( {
	title : '指令数量信息',
	height : 500,
	frame : true,
	autoEncode : true,
	autoScroll : true,
	region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
	store : insOrdStore, // 数据存储
	stripeRows : true, // 斑马线
	cm : insOrdcm, // 列模型
	sm : insOrdsm,
	pruneModifiedRecords : true,
	tbar : insOrdtbar, // 表格工具栏
	viewConfig : {
		forceFit : true
	},
	loadMask : {
		msg : '正在加载表格数据,请稍等...'
	}
});

insOrdGrid.on('afteredit', function(e) {
	var value = e.value;
	var field = e.field;
	var row = e.row;

	if (Ext.isEmpty(ordStore.getAt(row).get(field))) {
		ordStore.getAt(row).set(field, value);
	}

});

var ordersPanel = new Ext.Panel( {
	title : "订单资料",
	labelAlign : "right",
	layout : 'form',
	labelWidth : 70,
	height : 400,
	frame : true,
	items : [ {
		layout : 'column',
		anchor : '100%',
		width : 100,
		//			bodyStyle: 'padding:0 0 0 5', // 表单元素和表单面板的边距
		border : false,
		frame : false,
		items : [ {
			columnWidth : 0.5,
			layout : 'form',
			labelWidth : 70, // 标签宽度
			border : false,
			items : [ ordCombo, custCombo, {
				xtype : "textfield",
				fieldLabel : "款号" + prodOrdre,
				allowBlank : false,
				id : 'style_no',
				name : 'style_no',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "产品分类" + prodOrdre,
				allowBlank : false,
				id : 'classify',
				name : 'classify',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "总数" + prodOrdre,
				allowBlank : false,
				id : 'order_num',
				name : 'order_num',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "面料缩率J" + prodOrdre,
				allowBlank : false,
				id : 'percent_j',
				name : 'percent_j',
				anchor : "84%"
			}, {
				xtype : 'datefield',
				fieldLabel : '交货日期',
				name : 'delivery_date',
				id : 'delivery_date',
				editable : false,
				format : 'Y-m-d', // 日期格式化
				maxLength : 128,
				anchor : '84%'
			}, {
				layout : 'column',
				anchor : '100%',
				width : 100,
				//			bodyStyle: 'padding:0 0 0 5', // 表单元素和表单面板的边距
				border : false,
				frame : false,
				items : [ {
					columnWidth : 0.6,
					layout : 'form',
					labelWidth : 70, // 标签宽度
					border : false,
					items : [ {
						xtype : "textfield",
						fieldLabel : "腰围",
						allowBlank : false,
						id : 'column',
						name : 'column',
						anchor : "100%"
					} ]
				}, {
					columnWidth : 0.2,
					layout : 'form',
					labelWidth : 15, // 标签宽度
					border : false,
					items : [ {
						xtype : "button",
						text : "设置腰围",
						allowBlank : false,
						anchor : "84%",
						handler : function() {
							setColumnsData();
						}
					} ]
				} ]
			} ]
		}, {
			columnWidth : 0.5,
			layout : 'form',
			labelWidth : 75, // 标签宽度
			border : false,
			items : [ {
				xtype : "textfield",
				fieldLabel : "合同号" + prodOrdre,
				allowBlank : false,
				id : 'contract_id',
				name : 'contract_id',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "分单号" + prodOrdre,
				allowBlank : false,
				id : 'batch',
				name : 'batch',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "品名" + prodOrdre,
				allowBlank : false,
				id : 'article',
				name : 'article',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "加裁比例" + prodOrdre,
				allowBlank : false,
				id : 'add_proportion',
				name : 'add_proportion',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "面料" + prodOrdre,
				allowBlank : false,
				id : 'material',
				name : 'material',
				anchor : "84%"
			}, {
				xtype : "textfield",
				fieldLabel : "面料缩率W" + prodOrdre,
				allowBlank : false,
				id : 'percent_w',
				name : 'percent_w',
				anchor : "84%"
			}, {
				fieldLabel : '订单时间',
				xtype : 'datefield',
				name : 'notity_date',
				id : 'notity_date',
				format : 'Y-m-d', // 日期格式化
				editable : false,
				anchor : '84%'
			} ]
		} ]
	}

	]
});

var field = new Ext.ux.form.FileUploadField( {
	fieldLabel : '字样推码',
	buttonText : '上传',
	name : 'pattern_code',
	id : 'pattern_code',
	fileUpload : true,
	blankText : "请选择导入文件",
	anchor : '94%'
})

var filePanel = new Ext.Panel( {
	title : "相关文件",
	border : false,
	layout : "form",
	region : 'center',
	labelAlign : "right",
	labelWidth : 70,
	height : 500,
	frame : true,
	items : [ {
		layout : 'column',
		anchor : '100%',
		width : 100,
		//			bodyStyle: 'padding:0 0 0 5', // 表单元素和表单面板的边距
		border : false,
		frame : false,
		items : [ {
			columnWidth : 0.1,
			layout : 'form',
			labelWidth : 70, // 标签宽度
			border : false,
			items : [ {
				xtype : "button",
				text : "上传文件",
				allowBlank : false,
				anchor : "84%",
				handler : function() {
					setColumnsData();
				}
			} ]
		} ]
	}, {
		layout : 'column',
		border : false,
		items : [ {
			columnWidth : 0.5,
			layout : 'form',
			labelWidth : 75, // 标签宽度
			border : false,
			items : [ new Ext.ux.form.FileUploadField( {
				fieldLabel : '原始合同',
				buttonText : '上传',
				name : 'orig_contract',
				id : 'orig_contract',
				blankText : "请选择导入文件",
				fileUpload : true,
				anchor : '94%'
			}), new Ext.ux.form.FileUploadField( {
				fieldLabel : '款式图',
				buttonText : '上传',
				name : 'style_drawing',
				id : 'style_drawing',
				fileUpload : true,
				blankText : "请选择导入文件",
				anchor : '94%'
			}), new Ext.ux.form.FileUploadField( {
				fieldLabel : '尺寸表',
				buttonText : '上传',
				name : 'size_chart',
				id : 'size_chart',
				fileUpload : true,
				blankText : "请选择导入文件",
				anchor : '94%'
			}), new Ext.ux.form.FileUploadField( {
				fieldLabel : '工艺说明书',
				buttonText : '上传',
				fileUpload : true,
				name : 'process_desc',
				id : 'process_desc',
				blankText : "请选择导入文件",
				anchor : '94%'
			}) ]
		}, {
			columnWidth : 0.5,
			layout : 'form',
			labelWidth : 75, // 标签宽度
			border : false,
			items : [ new Ext.ux.form.FileUploadField( {
				fieldLabel : '包装指示',
				buttonText : '上传',
				name : 'pack_ins',
				id : 'pack_ins',
				fileUpload : true,
				blankText : "请选择导入文件",
				anchor : '94%'
			}), new Ext.ux.form.FileUploadField( {
				fieldLabel : '装箱指示',
				buttonText : '上传',
				name : 'box_ins',
				id : 'box_ins',
				fileUpload : true,
				blankText : "请选择导入文件",
				anchor : '94%'
			}), new Ext.ux.form.FileUploadField( {
				fieldLabel : '工序定额表',
				buttonText : '上传',
				name : 'process_quota',
				id : 'process_quota',
				fileUpload : true,
				blankText : "请选择导入文件",
				anchor : '94%'
			}), field ]
		} ]
	} ]
});

var planPanel = new Ext.Panel( {
	title : "生产进度计划",
	border : false,
	region : 'center',
	labelAlign : "right",
	height : 500,
	frame : true,
	items : [ {
		xtype : "panel",
		height : 85,
		border : false,
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : 0.5,
				layout : 'form',
				labelWidth : 70, // 标签宽度
				border : false,
				items : [ {
					xtype : "textfield",
					fieldLabel : "缝制工厂",
					id : 'sew_fac',
					name : 'sew_fac',
					anchor : "84%"
				}, {
					xtype : "textfield",
					fieldLabel : "水洗工厂",
					id : 'bach_fac',
					name : 'bach_fac',
					anchor : "84%"
				}, {
					xtype : "textfield",
					fieldLabel : "后整工厂",
					id : 'pack_fac',
					name : 'pack_fac',
					anchor : "84%"
				} ]
			}, {
				columnWidth : 0.5,
				layout : 'form',
				labelWidth : 70, // 标签宽度
				border : false,
				items : [ {
					fieldLabel : '交货时间',
					xtype : 'datefield',
					name : 'sew_delivery_date',
					id : 'sew_delivery_date',
					format : 'Y-m-d', // 日期格式化
					editable : false,
					anchor : '84%'
				}, {
					fieldLabel : '交货时间',
					xtype : 'datefield',
					name : 'bach_delivery_date',
					id : 'bach_delivery_date',
					format : 'Y-m-d', // 日期格式化
					editable : false,
					anchor : '84%'
				}, {
					fieldLabel : '交货时间',
					xtype : 'datefield',
					name : 'pack_delivery_date',
					id : 'pack_delivery_date',
					format : 'Y-m-d', // 日期格式化
					editable : false,
					anchor : '84%'
				} ]
			} ]
		} ]
	}, {
		xtype : "panel",
		title : "审核记录",
		height : 120,
		border : false,
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : 0.5,
				layout : 'form',
				labelWidth : 70, // 标签宽度
				border : false,
				items : [ {
					xtype : "textfield",
					fieldLabel : "计划审核",
					id : 'plan_check',
					name : 'plan_check',
					anchor : "84%"
				}, {
					xtype : "textfield",
					fieldLabel : "采购审核",
					id : 'purchase_check',
					name : 'purchase_check',
					anchor : "84%"
				}, {
					xtype : "textfield",
					fieldLabel : "贸易审核",
					id : 'trade_check',
					name : 'trade_check',
					anchor : "84%"
				} ]
			}, {
				columnWidth : 0.5,
				layout : 'form',
				labelWidth : 80, // 标签宽度
				border : false,
				items : [ {
					fieldLabel : '计划审核时间',
					xtype : 'datefield',
					name : 'plan_check_date',
					id : 'plan_check_date',
					format : 'Y-m-d', // 日期格式化
					editable : false,
					anchor : '84%'
				}, {
					fieldLabel : '采购审核时间',
					xtype : 'datefield',
					name : 'purchase_check_date',
					id : 'purchase_check_date',
					format : 'Y-m-d', // 日期格式化
					editable : false,
					anchor : '84%'
				}, {
					fieldLabel : '贸易审核时间',
					xtype : 'datefield',
					name : 'trade_check_date',
					id : 'trade_check_date',
					format : 'Y-m-d', // 日期格式化
					editable : false,
					anchor : '84%'
				}, {
					xtype : "textfield",
					hidden : true,
					id : 'seq_no',//生产通知单序号
					name : 'seq_no',
					anchor : "84%"
				}, {
					xtype : "textfield",
					hidden : true,
					id : 'prod_plan_seq',
					name : 'prod_plan_seq',//生产计划序号
					anchor : "84%"
				} ]
			} ]
		} ]
	} ]
});

var addPanel = new Ext.form.FormPanel({
		id : 'formpanel4Imp',
		name : 'formpanel4Imp',
		defaultType : 'textfield',
		labelAlign : 'right',
		labelWidth : 99,
		frame : true,
		labelAlign : 'right',
		fileUpload : true,
		items : [
			{
				fieldLabel: '文件类型',
				xtype:'combo',
				hiddenName: 'file_type',
				triggerAction: 'all',
				mode: 'local',
				emptyText: '请选择...',
				store: new Ext.data.ArrayStore({
					fields: [ 'value', 'text' ],
					data: [
						[ '0', '验厂文件' ],
						[ '1', '验厂资料' ]
					]
				}),
				valueField: 'value',
				displayField: 'text',
				value: '0',
				editable: false,
				anchor: '99%'
			},
			{
				fieldLabel: '备注',
				name: 'remark',
				id: 'remark',
				xtype:'textarea',
				allowBlank: true,
				anchor: '99%'
			},
			{
				fieldLabel: '请选择上传文件',
				name: 'theFile',
				id: 'EmpInfoTheFile',
				inputType: 'file',
				allowBlank: true,
				anchor: '99%'
			}
		]
	});

	var addWindow = new Ext.Window({
		layout : 'fit',
		width : 380,
		height : 260,
		resizable : false,
		draggable : true,
		closeAction : 'hide',
		title : '上传文件',
		modal : true,
		collapsible : true,
		titleCollapse : true,
		maximizable : false,
		buttonAlign : 'right',
		border : false,
		animCollapse : true,
		animateTarget : Ext.getBody(),
		constrain : true,
		items : [ addPanel ],
		buttons : [
			{
				text : '导入',
				iconCls : 'acceptIcon',
				handler : function() {
					var theFile = new String(Ext.getCmp('EmpInfoTheFile').getValue());
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}
					var pos = theFile.lastIndexOf(".");
					var lastname = theFile.substring(pos,theFile.length).toLowerCase();

					if (lastname != ".xls"&&lastname != ".xlsx"&&lastname != ".doc"&&lastname != ".docx"
						&&lastname != ".pdf"&&lastname != ".ppt"&&lastname != ".pptx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对!');
						return;
					}
					addPanel.form.submit( {
						url : './prodOrd.ered?reqCode=uploadFile4CSR',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							Ext.MessageBox.alert('提示',action.result.msg);
							addWindow.hide();
							store.reload();
						},
						failure : function(form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示',
								'文件上传失败:<br>' + msg);
						}
					});

				}
			}, {
				text : '关闭',
				iconCls : 'deleteIcon',
				handler : function() {
					addWindow.hide();
				}
			} ]
	});

var empTab = new Ext.TabPanel( {
	region : 'center',
	border : false,
	collapsed : false,
	deferredRender : false,
	layoutOnTabChange : true,
	activeTab : 0,
	autoScroll : true,
	items : [ ordGrid, insOrdGrid, filePanel ]
});
/**
 * 布局
 */
var orderPanel = new Ext.Panel( {
	layout : "border",
	height : 250,
	frame : true,
	items : [ {
		region : 'center',
		width : 650,
		items : [ ordersPanel ]
	}, {
		region : 'east',
		width : 600,
		items : [ planPanel ]
	} ]
});

var prodOrdPanel = new Ext.FormPanel( {
	layout : 'border',
	border : false,
	labelAlign : 'right',
	id : 'prodOrdPanel_id',
	name : 'prodOrdPanel',
	items : [ {
		region : 'north',
		height : 250,
		items : [ orderPanel ]
	}, {
		region : 'center',
		width : 1140,
		items : [ empTab ]
	} ]
});

//增加行记录
function enterAddForm() {
	var data = new Ext.data.Record( {
		color : "",
		in_length : ""
	});
	var insOrd = new Ext.data.Record( {
		color : "",
		in_length : ""
	});
	var ord = new Ext.data.Record( {
		color : "",
		in_length : ""
	});
	if (Ext.isEmpty(columnsValue)) {
		for ( var i = 1; i < 11; i++) {
			data.set("num" + i, "");
			insOrd.set("num" + i, "");
			ord.set("num" + i, "");
		}
	} else {
		for ( var i = 0; i < columnsValue.length; i++) {
			data.set("num" + columnsValue[i], "");
			insOrd.set("num" + columnsValue[i], "");
			ord.set("num" + columnsValue[i], "");
		}
	}
	ordStore.add(ord);
	insOrdStore.add(insOrd);
}

// 删除数据
function deleteOrdData() {
	var rows = ordGrid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert('提示', '您没有选中任何数据!');
		return;
	}
	//删除其他列表中的对应行
	for ( var record in rows) {
		var rownum = ordStore.indexOf(record);
		ordStore.removeAt(rownum);
		insOrdStore.removeAt(rownum);
	}
}
var columnKeyList = new Array("color", "in_length", "num1", "num2", "num3",
		"num4", "num5", "num6", "num7", "num8", "num9", "num10");

function setColumnsData() {
	if (Ext.isEmpty(Ext.getCmp('column').getValue())) {
		Ext.MessageBox.alert('提示', '请输入列的设置信息');
		return;
	}
	ordStore.removeAll();
	insOrdStore.removeAll();
	columnKeyList.length = 0;
	columnKeyList.push('color');
	columnKeyList.push('in_length');
	colValue = Ext.getCmp('column').getValue();
	columnsValue = Ext.getCmp('column').getValue().split(',');

	var columnsIns = [];
	columnsIns.push(new Ext.grid.CheckboxSelectionModel( {
		singleSelect : false
	}));
	columnsIns.push( {
		header : '颜色',
		dataIndex : 'color',
		align : 'center',
		width : 100,
		editor : new Ext.form.TextField( {
			allowBlank : false
		})
	});
	columnsIns.push( {
		header : '内长',
		dataIndex : 'in_length',
		align : 'center',
		width : 100,
		sortable : true,
		editor : new Ext.form.TextField( {
			allowBlank : false
		})
	});
	for ( var i = 0; i < columnsValue.length; i++) {
		columnsIns.push( {
			header : columnsValue[i],
			dataIndex : 'num' + columnsValue[i],
			align : 'center',
			width : 40,
			sortable : true,
			editor : new Ext.form.NumberField()
		});
		columnKeyList.push('num' + columnsValue[i]);
	}
	insOrdGrid.getColumnModel().setConfig(columnsIns);
	var columnsOrd = [];
	columnsOrd.push(new Ext.grid.CheckboxSelectionModel( {
		singleSelect : false
	}));
	columnsOrd.push( {
		header : '颜色',
		dataIndex : 'color',
		align : 'center',
		width : 100,
		editor : new Ext.form.TextField( {
			allowBlank : false
		})
	});
	columnsOrd.push( {
		header : '内长',
		dataIndex : 'in_length',
		align : 'center',
		width : 100,
		sortable : true,
		editor : new Ext.form.TextField( {
			allowBlank : false
		})
	});
	for ( var i = 0; i < columnsValue.length; i++) {
		columnsOrd.push( {
			header : columnsValue[i],
			dataIndex : 'num' + columnsValue[i],
			align : 'center',
			width : 40,
			sortable : true,
			editor : new Ext.form.NumberField()
		});
	}
	ordGrid.getColumnModel().setConfig(columnsOrd);
}

// 删除数据
function deleteInsData() {
	var rows = insOrdGrid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert('提示', '您没有选中任何数据!');
		return;
	}
	//删除其他列表中的对应行
	for ( var record in rows) {
		var rownum = insOrdStore.indexOf(record);
		ordStore.removeAt(rownum);
		insOrdStore.removeAt(rownum);
	}
}
//确认增加
function enterAddForm1() {
	if (Ext.isEmpty(Ext.getCmp('pattern_code').getValue())) {
		return;
	}
	var pattern_code = getFile('pattern_code');
	var params = filePanel.getForm().getValues();
	params.pattern_code = pattern_code;
	prodOrdPanel.getForm().submit( {
		url : './prodOrd.ered?reqCode=uploadFile4CSR',
		waitTitle : '提示',
		method : 'POST',
		waitMsg : '正在处理数据,请稍候...',
		success : function(form, action) {
			Ext.Msg.alert('提示', action.result.msg);
		},
		failure : function(form, action) {
			Ext.Msg.alert('提示', action.result.msg);
		}
	})
}
//确认增加
function enterOrdAddForm() {

	//		.replace("\\","-")
	//获取文件
	var orig_contract = getFile('orig_contract');
	var style_drawing = getFile('style_drawing');
	var size_chart = getFile('size_chart');
	var process_desc = getFile('process_desc');
	var pack_ins = getFile('pack_ins');
	var box_ins = getFile('box_ins');
	var process_quota = getFile('process_quota');
	var pattern_code = getFile('pattern_code');
	//判断并获取服装的数量信息
	var ordRecords = ordStore.getRange();
	var insOrdRecords = insOrdStore.getRange();
	var ordRecordStr = "[", insOrdRecordStr = "[";
	if (ordRecords.length != insOrdRecords.length) {
		Ext.Msg.alert('提示', '数量数据不对应!请修改!');
		return;
	} else {
		for ( var i = 0; i < ordRecords.length; i++) {
			ordRecordStr = ordRecordStr + "{";
			insOrdRecordStr = insOrdRecordStr + "{";

			var ordRecord = ordRecords[i];
			var insOrdRecord = insOrdRecords[i];
			for ( var j = 0; j < columnKeyList.length; j++) {
				var key = columnKeyList[j];
				if (key == 'color' || key == 'in_length') {
					if (ordRecord.get(key) != insOrdRecord.get(key)) {
						Ext.Msg.alert('提示', '数量数据不对应!请修改!');
						return;
					}
				}

				if (Ext.isEmpty(ordRecord.get(key))) {
					continue;
				}
				ordRecordStr = ordRecordStr + "'" + key + "':'"
						+ ordRecord.get(key) + "',";
				insOrdRecordStr = insOrdRecordStr + "'" + key + "':'"
						+ insOrdRecord.get(key) + "',";
			}
			if (ordRecordStr.length > 0) {
				ordRecordStr = ordRecordStr.substring(0,
						ordRecordStr.length - 1);
			}
			ordRecordStr = ordRecordStr + "},";

			if (insOrdRecordStr.length > 0) {
				insOrdRecordStr = insOrdRecordStr.substring(0,
						insOrdRecordStr.length - 1);
			}
			insOrdRecordStr = insOrdRecordStr + "},";
		}
		if (ordRecordStr.length > 0) {
			ordRecordStr = ordRecordStr.substring(0, ordRecordStr.length - 1);
		}
		ordRecordStr = ordRecordStr + "]";

		if (insOrdRecordStr.length > 0) {
			insOrdRecordStr = insOrdRecordStr.substring(0,
					insOrdRecordStr.length - 1);
		}
		insOrdRecordStr = insOrdRecordStr + "]";
	}
	var params = prodOrdPanel.getForm().getValues();
	params.cust_id = custCombo.getValue();
	params.orig_contract = orig_contract;
	params.style_drawing = style_drawing;
	params.size_chart = size_chart;
	params.process_desc = process_desc;
	params.pack_ins = pack_ins;
	params.box_ins = box_ins;
	params.process_quota = process_quota;
	params.pattern_code = pattern_code;
	params.ordRecordStr = ordRecordStr;
	params.insOrdRecordStr = insOrdRecordStr;
	params.colValue = colValue;

	Ext.Ajax.request( {
		url : './prodOrd.ered?reqCode=saveProdOrdInfo',
		success : function(response) { // 回调函数有1个参数
			var resultArray = Ext.util.JSON.decode(response.responseText);
			if (resultArray.success) {
				Ext.Msg.alert('提示', resultArray.msg);
				insOrdStore.removeAll();
				ordStore.removeAll();
				clearForm(prodOrdPanel.getForm());
				Ext.getCmp('prodOrdWindow').hide();
				Ext.getCmp('prodOrdGrid').getStore().reload();

			} else {
				Ext.Msg.alert('提示', resultArray.msg);
			}
		},
		failure : function(response) {
			Ext.Msg.alert('提示通知单保存失败');
		},
		params : params
	});
}

function getFile(String) {
	var string = '';
	if (!Ext.isEmpty(Ext.getCmp(String).getValue())) {
		var data = Ext.getCmp(String).getValue();
		var file = data.split("\\");
		if (file.length > 0) {
			string = file[file.length - 1];
		}
	}
	return string;
}
