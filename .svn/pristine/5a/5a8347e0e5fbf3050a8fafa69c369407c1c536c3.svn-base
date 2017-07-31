/**
 * 请求日志管理
 * @since 2014年9月26日
 * @author zhouww 
 */
Ext.onReady(function(){
    //==================================基础数据=========================================//
	//==================================基础数据结束=====================================//
	
	//==================================Store=====================================//
	var requestStore = new Ext.data.Store({ // 此损耗是按照单个订单来处理，而非订单所在完单报告来处理
      proxy : new Ext.data.HttpProxy({
          url : './requestManage.ered?reqCode=queryRequestInfo'
      }),
      reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
        }, ['uuid','account','user_name','startlongtime','longtime','remotehost','path','reqcode','descinfo','sessionid'])
    })
	//==================================Store End=======================================//
	
	//==================================组件============================================//
   /**
     * grid_sm
     */
    var grid_sm = new Ext.grid.CheckboxSelectionModel();
    /**
     * grid_cm
     */
    var grid_cm = new Ext.grid.ColumnModel([grid_sm,new Ext.grid.RowNumberer(),{
                 header : '登录账号',
                 dataIndex : 'account'
              },{
                 header : '姓名',
                 dataIndex : 'user_name'
              },{
                 header : '请求时间',
                 dataIndex : 'startlongtime'
              },{
                 header : '耗时(ms)',
                 dataIndex : 'longtime'
              },{
                 header : '请求IP',
                 dataIndex : 'remotehost'
              },{
                 header : '请求路径',   
                 dataIndex : 'path'
              },{
                 header : '请求方法',
                 dataIndex : 'reqcode'
              },{
                 header : '方法描述',
                 dataIndex : 'descinfo',
                 width : 200
              },{
                 header : '请求编号',
                 dataIndex : 'uuid',
                 sortable : false,
                 width : 200
              },{
                header : '会话编号',
                dataIndex : 'sessionid',
                sortable : false,
                width : 200
              }])
    /**
     * grid_tbar
     */
    var grid_tbar = new Ext.Toolbar({
        items : ['用户名:',{
            xtype : 'textfield',
            id : 'accountText_request'
        },{
        	text : '查询',
            id : "queryButton_request",
            handler : function(){
                var accountVal = Ext.getCmp('accountText_request').getValue();
                loadRequestStore({account : accountVal})
            }
        },'-',{
            text : '刷新请求日志过滤信息',
            iconCls : 'arrow_refreshIcon',
            handler : function(){
                Ext.Ajax.request({
                    url : './requestManage.ered?reqCode=refreshLogRequestInfo' 
                })
            }
        }]
    })
    /**
     * grid_bbar
     */
    //下拉框
    var ordReportCombo = new Ext.form.ComboBox({
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
    var grid_bbar = new Ext.PagingToolbar({
        pageSize : 50,
        store : requestStore,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', ordReportCombo]
    })
    
    /**
     * gridpanel
     */
    var gridPanel = new Ext.grid.GridPanel({
        name : 'gridPanel',
        title:'请求信息查询',
        store:requestStore,
        region:'center',
        loadMask:{
            msg:'正在加载表格数据,请稍等......'
        },
        stripeRows : true,
        sm : grid_sm,
        cm : grid_cm,
        tbar : grid_tbar,
        bbar : grid_bbar
    })
	
	//界面渲染
	var viewPort = new Ext.Viewport({
	   title : '',
	   layout : 'border',
	   items : [gridPanel]
	})
	//==================================组件结束========================================//
	
    //==================================页面事件============================================//
	/**
	 * 翻页下拉框事件
	 */
	ordReportCombo.on('select',function(){
	   var pageSize = ordReportCombo.getValue();
	   grid_bbar.pageSize = pageSize;
	   loadRequestStore();
	})
	//==================================事件结束============================================//
	
	//==================================页面内函数============================================//
	 /**
     * requestStore加载函数
     */
    var old_params = {};
    function loadRequestStore(params){
        //保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        params.start = 0;
        params.limit = grid_bbar.pageSize;
        requestStore.baseParams = params;   // 设置翻页查询的基础数据
        requestStore.load({
            params : params
        })
    }
	//==================================函数结束============================================//
})
 