/**
 * 用户登录管理
 * @since 2014年9月26日
 * @author zhouww 
 */

Ext.onReady(function(){
    //==================================基础数据=========================================//
    //==================================基础数据结束=====================================//
    
    //==================================Store=====================================//
    var sessionStore = new Ext.data.Store({ // 此损耗是按照单个订单来处理，而非订单所在完单报告来处理
      proxy : new Ext.data.HttpProxy({
          url : './sessionManage.ered?reqCode=queryPageSessionInfo'
      }),
      reader : new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
        }, ['sessionid','account','useragent','remotehost','starttime','endtime','user_name'])
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
                 header : '会话编号',
                 dataIndex : 'sessionid',
                 width : 200
              },{
                 header : '用户编号',
                 dataIndex : 'account'
              },{
                 header : '用户姓名',
                 dataIndex : 'user_name'
              },{
                 header : '请求IP',
                 dataIndex : 'remotehost'
              },{
                 header : '浏览器信息',
                 dataIndex : 'useragent',
                 width : 200
              },{
                 header : '开始时间',
                 dataIndex : 'starttime',
                 width : 200
              },{
                 header : '结束时间',
                 dataIndex : 'endtime',
                 width : 200
              }])
    /**
     * grid_tbar
     */
    var grid_tbar = new Ext.Toolbar({
        items : [{
            text : '刷新在线信息',
            iconCls : 'arrow_refreshIcon',
            handler : function(){
                loadSessionStore({isOnline : '1',isLogin : '1'});
            }
        }]
    })
    /**
     * grid_bbar
     */
    //下拉框
    var sessionCombo = new Ext.form.ComboBox({
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
        store : sessionStore,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', sessionCombo]
    })
    
    /**
     * gridpanel
     */
    var gridPanel = new Ext.grid.GridPanel({
        name : 'gridPanel',
        title:'请求信息查询',
        store:sessionStore,
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
    sessionCombo.on('select',function(){
        var pageSize = sessionCombo.getValue();
        grid_bbar.pageSize = pageSize;
        loadSessionStore(); 
    })
    
    //==================================事件结束============================================//
    
    //==================================页面内函数============================================//
    /**
     * sessionStore加载函数
     */
    var old_params = {};
    function loadSessionStore(params){
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
        sessionStore.baseParams = params;   // 设置翻页查询的基础参数
        sessionStore.load({
            params : params
        })
    }
    //==================================函数结束============================================//
})
 