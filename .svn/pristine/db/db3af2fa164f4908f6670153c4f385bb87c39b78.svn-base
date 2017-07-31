/************************************************
 * 创建日期: 2015-2-3
 * 创建作者：xutj
 * 功能：qc流水账
 * 导入
 * 增删改查
 * 最后修改时间：
 * 修改记录：
 *************************************************/
 Ext.onReady(function () {
	
	
	
	
	var store= new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:'./manageQC.ered?reqCode=queryQCScheList'
		}),
		reader:new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
		},[
			'seq_no','order_id','qc_position_name','class_name','qc_item_name','parent_name','amount','opr_date'
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
                loadStore();
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
                    text: '修改',
					id: 'modify_button',
					iconCls: 'page_edit_1Icon',
					hidden:true,
					handler: function () {
						editInit();
					}
        }
        ,'-',{
                    text: '删除',
					id: 'delete_button',
					iconCls: 'page_delIcon',
					handler: function () {
						deleteQCSche();
					}
        
        },'-',{
                    text : '详细查询',
                    iconCls : 'page_findIcon',
                    handler : function(){
                        var queryWin = new QueryWindowConstruct();
                        queryWin.addListener('231',queryOrder4detail);
                        queryWin.showQueryWindow();
                    }
        },'-',{
                    text : '导出流水账信息',
           			iconCls : 'page_excelIcon',
            		handler : function() {
              		exportExcel('./manageQC.ered?reqCode=exportQCSche');
                }
        },'->',new Ext.form.TextField({
					id: 'order_id',
					name: 'order_id',
					emptyText: '请输入订单号（po）',
					enableKeyEvents: true,
					listeners: {
						specialkey: function (field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								loadStore();
							}
						}
					},
					width: 130
				}),new Ext.form.TextField({
					id: 'classParam',
					name: 'classParam',
					emptyText: '请输入样式名称',
					enableKeyEvents: true,
					listeners: {
						specialkey: function (field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								loadStore();
							}
						}
					},
					width: 130
				}),new Ext.form.TextField({
					id: 'positionParam',
					name: 'positionParam',
					emptyText: '请输入位置名称',
					enableKeyEvents: true,
					listeners: {
						specialkey: function (field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								loadStore();
							}
						}
					},
					width: 130
				}), {
                    text: '查询',
				iconCls: 'page_excelIcon',
				xtype:'button',
				handler: function () {
					loadStore();
				}
        }
        
        ]
	})
	
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	var gcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm, 
	 {
		dataIndex: 'seq_no',
		hidden:true,
		width: 120
	},	
	{
		header: '订单号',
		dataIndex: 'order_id',
		align: 'center',
		width: 120
	}, {
		header: '样式',
		dataIndex: 'class_name',
		align: 'center',
		width: 120
	},  {
		header: 'qc位置',
		align: 'left',
		dataIndex: 'qc_position_name',
		width: 200
	}, {
		header: '检查项',
		align: 'left',
		dataIndex: 'qc_item_name',
		width: 200
	},{
		header: '数量',
		dataIndex: 'amount',
		align: 'center',
		width: 120
	},  {
		header: '所属检查项',
		align: 'left',
		dataIndex: 'parent_name',
		width: 200
	},  {
		header: '操作时间',
		align: 'left',
		dataIndex: 'opr_date',
		width: 200
	}

	 ]);

	
	 var grid = new Ext.grid.GridPanel({
                id : 'prodOrdGrid',
                title : '<span style="font-weight:normal">qc工序管理</span>',
                height : 590,
                store : store,
                region : 'center',// 和VIEWPORT布局模型对应，充当center区域布局
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                stripeRows : true,
                // frame: true,// True表示为面板的边框外框可自定义的
                border : false,
                cm : gcm,
                tbar : tbar,
                bbar : bbar
               
            });
	/**
	 * 根据qc位置创建多个饼图
	 */
	function createPiesByPosition(param){
		
	
	}
	
	/**
	 * 新增初始化
	 */
	function addInit() {
		flag = 'add';
		clearFormPanel(addQCFormPanel);
		addQCWindow.show();
		addQCWindow.setTitle('新增部门<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('btnReset').show();
	}
	
	
	function updateQCItem(){};
	
	/**
	 * 删除
	 */
	function deleteQCSche() {
		var record = grid.getSelectionModel().getSelected();

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要删除的记录!');
			return;
		}
		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>您确定删除该记录吗?', function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg();
					Ext.Ajax.request({
						url: './manageQC.ered?reqCode=deleteQCNumInfo',
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
							seq_no: record.get('seq_no')
						}
					});
				}
			});
	}
	
	
	
	var loadStore=function (){
		var params = {   //如果为空 则构建一个空对象
        //添加一般参数
		order_id: Ext.getCmp("order_id").getValue(),
		class_name : Ext.getCmp("classParam").getValue(),
		qc_position_name:Ext.getCmp("positionParam").getValue(),
        start : 0,
        limit : bbar.pageSize
        };
		store.load({
		params:params
		});
	}
	 /**
     * 查询Store的数据
     */
    function queryStore(params){
        // 保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        
        params.start = 0;
        params.limit = bbar.pageSize;
        //加载数据
        store.baseParams = params;   // 查询条件赋值给store 在翻页查询中使用
        store.load({
            params: params
        });
    }
    
	 /**
     * 查询生产通知单,查询条件由详细查询得来
     */
    function queryOrder4detail(recordArr){
        isPageQuery = false;
        var prodordArr = [];
        for(var idx=0;idx<recordArr.length;idx++){
            var record = recordArr[idx];
            prodordArr.push(record.get('order_id'));
        }
        var params = {
            prodords : prodordArr.join(','),
            fromFlag : '1'  // 标记此查询是来之详细查询的
        };
        queryStore(params);
    }
	
	
	var task=function(){
		loadStore();
	}
	task();
	
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
	
	});