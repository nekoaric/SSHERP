/************************************************
 * 创建日期: 2015-1-14
 * 创建作者：xutj
 * 功能：工厂权限管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var store= new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:'./sysUser.ered?reqCode=queryUserOutList'
		}),
		reader:new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
		},[
			'seq_no','grp_name','user_name','opr_date'
			])
	})
	
	var pagesize_combo = new Ext.form.ComboBox({
		name : 'pagesize',
                triggerAction : 'all',
                mode : 'local',
                store : new Ext.data.ArrayStore({
                            fields : ['value', 'text'],
                            data : [[10, '10条/页'], [20, '20条/页'],
                                    [50, '50条/页'], [100, '100条/页'],
                                    [250, '250条/页'], [500, '500条/页']]
                        }),
                valueField : 'value',
                displayField : 'text',
                value : '50',
                editable : false,
                width : 85
	})
	 var number = parseInt(pagesize_combo.getValue());
    // 改变每页显示条数reload数据
    pagesize_combo.on("select", function(comboBox) {
                bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                queryOrdItem();
            });
    // 分页工具栏
    var bbar = new Ext.PagingToolbar({
                pageSize : number,
                store : store,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', pagesize_combo]
            });
	var tbar = new Ext.Toolbar({
        items : [
        {
                    text: '查询',
				iconCls: 'page_excelIcon',
				xtype:'button',
				handler: function () {
					loadStore();
				}
        }
        ,'-',{
                    text: '导入权限',
				iconCls: 'page_excelIcon',
				xtype:'button',
				handler: function () {
					importrolewindow.show();
				}
        }
        ]
	})
	
	/** 定义列头 */
	var gcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
		header: '序号',
		dataIndex: 'seq_no',
		hidden: false
	}, {
		header: '工厂代码',
		dataIndex: 'grp_name',
		align: 'center',
		width: 120
	}, {
		header: '员工姓名',
		dataIndex: 'user_name',
		align: 'center',
		width: 120
	}, {
		header: '操作时间',
		dataIndex: 'opr_date',
		align: 'center',
		width: 210
	}, {
		header: '部门',
		align: 'left',
		dataIndex: 'dept_name',
		width: 200
	} ]);

	
	 var grid = new Ext.grid.GridPanel({
                id : 'prodOrdGrid',
                title : '<span style="font-weight:normal">员工</span>',
                height : 590,
                store : store,
                region : 'center',// 和VIEWPORT布局模型对应，充当center区域布局
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                stripeRows : true,// 斑马线 True表示为显示行的分隔符（默认为true）。
                // frame: true,// True表示为面板的边框外框可自定义的
                border : false,
                cm : gcm,
                tbar : tbar,
                bbar : bbar
               
            });
	
	//导入权限excel 1.8xtj
	var importformpanel = new Ext.form.FormPanel({
		id: 'importformpanel',
		name: 'importformpanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 105,
		width: 280,
		height: 220,
		frame: true,
		fileUpload: true,
		items: [
			{
				fieldLabel: '导入文件(Excel)',
				name: 'theFile',
				id: 'theFile',
				inputType: 'file',
				allowBlank: false,
				blankText: "请选择导入文件",
				anchor: '94%'
			},
			{
				xtype: "label",
				labelStyle: 'color:red;width=60px;',
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/userout.xlsx' target='_blank'>员工模板文件</a></SPAN>",
				anchor: '99%'
			}
		]
	});

	var importrolewindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 200,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '导入Excel',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [importformpanel],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('theFile').getValue();
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls" &&
						theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}

					importformpanel.getForm().submit({
						url: 'sysUser.ered?reqCode=importRoleList',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							importrolewindow.hide();
							clearFormPanel(importformpanel);
							Ext.Msg.alert('提示', action.result.msg);
						},
						failure: function (form, action) {
							Ext.Msg.alert('提示', action.result.msg);
						}
					});
				}
			},
			{
				text: '关闭',
				id: 'btnReset',
				iconCls: 'deleteIcon',
				handler: function () {
					importrolewindow.hide();
				}
			}
		]
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [
			{
				region: 'center',
				layout: 'fit',
                margins : '3 3 3 0',
				items: [grid]
			}
		]
	});
	
	var loadStore=function (){
		var params = {   //如果为空 则构建一个空对象
        //添加一般参数
        start : 0,
        limit : bbar.pageSize
        };
		store.load({
		params:params
		});
	}
	
	
	
	});