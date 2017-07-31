/************************************************
 * 创建日期: 2014-09-15
 * 创建作者：zhouww
 * 功能: 完单报告损耗分析
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function() {

      //=======================================基础数据=============================//
      /**
       *  计算列，需要统计数据的列的集合
       */
      var numinfo = [];
      /**
       * 统计的数量信息
       */
      var sumObject_num = {};
      /**
       * 汇总信息对象
       */
      var sumObject = {};

      /**
       * 过滤饼图显示统计
       */
      var filterNum4pieChart = ['sew_num', 'product_num', 'sr_total_num',
                  'ins_num', 'ord_num'];
      //=======================================基础数据结束=============================//

      //=======================================数据=============================//
      var orderStore = new Ext.data.Store({ // 此损耗是按照单个订单来处理，而非订单所在完单报告来处理
            proxy : new Ext.data.HttpProxy({
                              url : './orderReport.ered?reqCode=queryOrders4orderReport'
                        }),
            reader : new Ext.data.JsonReader({
                              totalProperty : 'TOTALCOUNT', // 记录总数
                              root : 'ROOT' // Json中的列表数据根节点
                        }, ['ord_report_no', 'style_no', 'order_no', 'cust_name',
                                    'ord_num', 'ins_num', 'sew_num', 'f_product_num',
                                    'order_id'])
      })

      //=======================================数据结束=============================//

      //=======================================显示组件开始=============================//
      /**
       * grid_sm
       */
      var grid_sm = new Ext.grid.CheckboxSelectionModel();
      /**
       * grid_cm
       */
      var grid_cm = new Ext.grid.ColumnModel([grid_sm,
                  new Ext.grid.RowNumberer(), {
                        header : '完单报告号',
                        dataIndex : 'ord_report_no'
                  }, {
                        header : '订单号',
                        dataIndex : 'order_id'
                  }, {
                        header : '款号',
                        dataIndex : 'style_no'
                  }, {
                        header : '实裁数',
                        dataIndex : 'sew_num'
                  }, {
                        header : '指令数',
                        dataIndex : 'ins_num'
                  }, {
                        header : '出运成品数',
                        dataIndex : 'f_product_num',
                        width : 150
                  }, {
                        header : '损耗率%',
                        dataIndex : 'sr_num',
                        renderer : doSrNum
                  }])
      /**
       * grid_tbar
       */
      var grid_tbar = new Ext.Toolbar({
                        items : [{
                                          text : '查询订单信息',
                                          iconCls : 'page_refreshIcon',
                                          id : 'queryOrder_button'
                                    }, '-', {
                                          text : '导出信息',
                                          iconCls : "page_excelIcon",
                                          id : 'exportOrderReportInfo'
                                    }, '-', {
                                          text : '汇总饼图',
                                          iconCls : 'theme2Icon',
                                          id : 'pieChart4orderReport'
                                    }, '-', {
                                          text : '汇总饼图(计算总数)',
                                          iconCls : 'theme2Icon',
                                          hidden : true,
                                          id : 'pieChart4orderReport_totalOrdNum'
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
                        store : orderStore,
                        displayInfo : true,
                        displayMsg : '显示{0}条到{1}条,共{2}条',
                        emptyMsg : "没有符合条件的记录",
                        items : ['-', '&nbsp;&nbsp;', ordReportCombo]
                  })
      /**
       * grid_summary 合计
       */
      var summary = new Ext.ux.grid.GridSummary();
      //    summary.toggleSummary(false);
      /**
       * gridpanel
       */
      var gridPanel = new Ext.grid.GridPanel({
                        name : 'gridPanel',
                        title : '损耗分析',
                        store : orderStore,
                        region : 'center',
                        plugins : [summary], // 合计
                        loadMask : {
                              msg : '正在加载表格数据,请稍等......'
                        },
                        stripeRows : true,
                        sm : grid_sm,
                        cm : grid_cm,
                        tbar : grid_tbar,
                        bbar : grid_bbar
                  })

      var viewPort = new Ext.Viewport({
                        layout : 'border',
                        title : '',
                        items : [gridPanel]
                  })
      //=======================================显示组件结束=============================//

      //=======================================组件事件监听=============================//
      /**
       * 汇总饼图点击事件
       */
      Ext.getCmp('pieChart4orderReport').addListener('click', function() {
                        //          showPieChartWindow('srNum');
                        if(parseRecords2total()){
                            showPieChartWindowArr();
                        };
                        
                  })
      Ext.getCmp('pieChart4orderReport_totalOrdNum').addListener('click',
                  function() {
                        showPieChartWindow('ordNum');
                  })
      /**
       * 导出按钮添加事件 
       */
      Ext.getCmp('exportOrderReportInfo').addListener('click', function() {
                        exportReportInfo();
                  })
      /**
       * 下拉框改变的事件
       */
      ordReportCombo.on('change', function(combo, newValue, oldValue) {
                        var pageNum = ordReportCombo.getValue();
                        grid_bbar.pageSize = pageNum;
                        loadOrderStore();
                  })
      /**
       * orderStore加载完毕的事件
       * <br/> 处理统计数据
       */
      orderStore.on('load', function(store, records) {

                        //统计总实裁数，总指令数，总出运成品数，损耗率
                        var n = records.length;// 获得总行数

                        if (n <= 0) {
                              summary.toggleSummary(false);
                        } else {
                              summary.toggleSummary(true);
                              sumObject = {};
                              var numLength = numinfo.length;
                              for (var idx = 0; idx < n; idx++) {
                                    var record = records[idx];
                                    for (var k = 0; k < numLength; k++) {
                                          var key = numinfo[k].param;
                                          var num = addTwoNum(sumObject[key], record.get(key));
                                          sumObject[key] = num;
                                    }
                              }

                              //计算平均损耗率
                              var sew_num = sumObject.sew_num;
                              var product_num = sumObject.product_num;
                              var ins_num = sumObject.ins_num;
                              var tailorPer = '0%';
                              if (ins_num == '') {
                                    tailorPer = '100%';
                              } else {
                                    tailorPer = (sew_num / ins_num * 100).toFixed(2) + '%';
                              }

                              var sr_num = '0%';
                              if (product_num == 0) {
                                    sr_num = '100%';
                              } else {
                                    sr_num = ((sew_num - product_num) / sew_num * 100)
                                                .toFixed(2)
                                                + '%';
                              }
                              for (var key in sumObject) { //为统计信息添加额外显示信息
                                    sumObject[key] = fieldNameValueMap4others[key] + ":"
                                                + sumObject[key];
                              }

                              sumObject.sr_num = "损耗率:" + sr_num;
                              sumObject.tailor_percent = '加裁率:' + tailorPer;
                              sumObject.style_no = '统计';
                              summary.setSumValue(sumObject);
                        }

                  })
      /**
       * 处理选中数据的统计信息
       */
      function parseRecords2total() {
            var selectionModel = gridPanel.getSelectionModel();
            //获取现有选择的行
            var records = selectionModel.getSelections();
            if(records.length==0){
                Ext.Msg.alert('提示','请选择需要展现的数据');
                return false;
            }
            sumObject_num = {}; // 饼图显示数据
            var numLength = numinfo.length;
            for (var idx = 0; idx < records.length; idx++) {
                  var record = records[idx];
                  for (var k = 0; k < numLength; k++) {
                        var key = numinfo[k].param;
                        var num = addTwoNum(sumObject_num[key], record.get(key));
                        sumObject_num[key] = num;
                  }
            }
            return true;
      }

      /**
       * 查询订单信息按钮
       */
      Ext.getCmp('queryOrder_button').addListener('click', function(e) {
            showQueryWindow();
                  })

      //=======================================组件事件结束=============================//
      //=======================================组件操作函数=============================//
                  
      /**
       * 查询订单窗口 
       */
      function showQueryWindow(){
            var windowCon = new QueryWindowConstruct(); //详细查询控制器
            //        windowCon.addListener('872',queryOrdderSrInfo);
            windowCon.addListener('101', queryGridInfo);
            //添加事件
            windowCon.showQueryWindow();
            // 设置初始状态 参数设置要在显示之后， 需要等到组件渲染
            windowCon.setOrderState('2');
            windowCon.setMyOrderState(false);   // true值 选择我的订单，false值不选择我的订单
      }
      /**
       * 传递图表组件多个图表信息
       */
      function showPieChartWindowArr() {
            var params1 = getPieChartData('srNum');
            params1.name = '计算损耗';
            var params2 = getPieChartData('ordNum');
            params2.name = '计算总数';
            // 获取高宽信息
            var height = document.documentElement.clientHeight;
            var width = document.documentElement.clientWidth;
            var pieCon = new PieChartWindow();
            pieCon.showWindow({
                              height : height,
                              widht : width
                        });
            var paramArr = [];
            paramArr.push(params1);
            paramArr.push(params2);
            pieCon.showPieChartArr(paramArr);
      }

      /**
       * 显示饼图组件
       * @param flag srNum : 计算损耗的百分比
       * <br/>        ordNum ： 计算总数百分比
       */
      function showPieChartWindow(flag) {
            var params = getPieChartData(flag);
            // 获取高宽信息
            var height = document.documentElement.clientHeight;
            var width = document.documentElement.clientWidth;
            var pieCon = new PieChartWindow();
            pieCon.showWindow({
                              height : height,
                              widht : width
                        });
            pieCon.darwPieChart(params);
      }
      /**
       * 封装获取图表数据的方式
       */
      function getPieChartData(flag) {
            //组装数据  
            var numlength = numinfo.length; // 统计数据的列信息
            var seriesData = [];
            var totalNum = 0; // 统计总损耗率
            for (var idx = 0; idx < numlength; idx++) {
                  var beanName = numinfo[idx].param;
                  // 在过滤范围内的数据不做饼图处理
                  if (filterNum4pieChart.indexOf(beanName) >= 0) {
                        continue;
                  }
                  // 取消没有数量的判断
                  var srNum = sumObject_num[beanName];
                  if (!srNum) {
                        continue;
                  }
                  seriesData.push({
                                    num : sumObject_num[beanName],
                                    name : fieldNameValueMap4others[beanName]
                              })
                  totalNum += sumObject_num[beanName]; // 统计登记损耗数量
            }
            // 处理未登记损耗数量信息
            var srNum = sumObject_num['sr_total_num']; // 总损耗数
            totalNum = !totalNum ? 0 : totalNum;
            srNum = !srNum ? 0 : srNum;

            var unRegiesteredNum = 0;
            if (srNum > totalNum) { //总损耗数大于登记损耗数量添加未登记数
                  unRegiesteredNum = srNum - totalNum;
                  seriesData.push({
                                    num : unRegiesteredNum,
                                    name : fieldNameValueMap4others['unregiestered']
                              })
                  totalNum = srNum;
            }
            // ~处理未登记损耗数量结束

            // 处理出货数
            if ('ordNum' == flag) { // 标记为ordNum 统计出货数的信息
                  var productNum = sumObject_num['product_num'];
                  totalNum += productNum;
                  seriesData.push({
                                    num : sumObject_num['product_num'],
                                    name : fieldNameValueMap4others['product_num']
                              })
            }
            // ~处理出货数结束
            // 处理y轴 百分比数据  -- 饼图分配区域的数据        
            if (!Ext.isEmpty(totalNum) && totalNum > 0) {
                  var dataLength = seriesData.length;
                  for (var idx = 0; idx < dataLength; idx++) {
                        seriesData[idx].y = parseFloat((parseInt(seriesData[idx].num)
                                    / totalNum * 100).toFixed(2))
                  }
            }

            var series = [];
            series.push({
                              data : seriesData,
                              name : "损耗饼图"
                        })
            // 组装子标题信息(注：这里采用统计结果后的的数据，利用现成的数据来显示 ，如果现成的没有就新增)
            var subTitle = '出货数 :' + sumObject_num.product_num + ' 实裁数:' + sumObject_num.sew_num
                        + " 损耗数: " + sumObject_num.sr_total_num + ' <br/>登记损耗数:'
                        + (totalNum - unRegiesteredNum) + '   未登记损耗数:'
                        + (unRegiesteredNum);

            //组装参数
            var params = {
                  title : '损耗信息饼图',
                  subTitle : subTitle,
                  series : series
            }
            return params;
      }

      /**
       *  导出订单损耗信息
       */
      function exportReportInfo() {
            var records = orderStore.getRange();
            if (records.length == 0) { //没有数据返回
                  return;
            }
            var cms = gridPanel.getColumnModel();
            var colLength = cms.getColumnCount();

            // 封装列头
            var columns = [];
            var dataIndexArr = [];
            for (var idx = 0; idx < colLength; idx++) {
                  if (cms.isHidden(idx)) { // 不包含隐藏的列
                        continue;
                  }
                  var dataIndex = cms.getDataIndex(idx);
                  var header = cms.getColumnHeader(idx)
                  if (Ext.isEmpty(dataIndex)) { // dataindex为空则不处理
                        continue;
                  }
                  columns.push({
                                    value : dataIndex,
                                    text : header
                              })
                  dataIndexArr.push(dataIndex);
            }

            //封装实体数据
            var dataInfo = [];
            var recordsLength = records.length;
            var colLength = dataIndexArr.length;
            for (var idx = 0; idx < recordsLength; idx++) {
                  var record = records[idx];
                  var dataBean = {};
                  for (var k = 0; k < colLength; k++) {
                        var di = dataIndexArr[k];
                        dataBean[di] = record.get(di);
                  }
                  dataInfo.push(dataBean);
            }
            //报表表头信息
            var title = '订单损耗信息 ';

            var exportObj = {
                  colinfo : Ext.util.JSON.encode(columns),
                  datainfo : Ext.util.JSON.encode(dataInfo),
                  title : Ext.util.JSON.encode(title),
                  countinfo : Ext.util.JSON.encode(sumObject)
            }
            exportReportInfo_ajax(exportObj);
      }

      /**
       * 导出订单损耗
       */
      function exportReportInfo_ajax(params) {
            Ext.Ajax.request({
                              url : './orderReport.ered?reqCode=saveExportDataInfo',
                              success : exportReportInfo_ajax_success,
                              failure : exportReportInfo_ajax_failure,
                              params : params
                        })
      }

      /**
       * 后台请求保存导出信息成功
       */
      function exportReportInfo_ajax_success(response) {
            var data = Ext.util.JSON.decode(response.responseText);
            if (data.success) { //信息保存成功开始到处报表
                  exportExcel('./orderReport.ered?reqCode=exportOrderReportSrInfo');
            }
      }

      /**
       * 后台请求保存导出信息失败
       */
      function exportReportInfo_ajax_failure(response) {

      }

      /**
       * 计算损耗率
       */
      function doSrNum(value, param, record) {
            var sew_num = record.get('sew_num');
            var product_num = record.get('product_num');
            if (Ext.isEmpty(product_num)) {
                  return '100'
            }
            if (Ext.isEmpty(sew_num)) {
                  return '0';
            }
            return ((parseInt(sew_num) - parseInt(product_num)) / parseInt(sew_num) * 100)
                        .toFixed(2);
      }

      /**
       * 后台请求完成列头信息查询
       * params 是 record数组
       */
      var queryOrders = {}; // 保存查询结果的订单信息
      function queryGridInfo(params) {
            if (params.length < 1) {
                  return;
            }
            var orders = [];
            var recordLength = params.length;
            for (var idx = 0; idx < recordLength; idx++) {
                  var record = params[idx];
                  orders.push(record.get('order_id'))
            }
            queryOrders = {
                  order_id : orders.join(',')
            };
            queryGridInfo4Ajax(queryOrders);
      }
      /**
       * 请求后台数据 将后台请求数据手动处理然后将数据添加到Store中
       */
      function queryGridInfo4Ajax(params) {
            Ext.Ajax.request({
                              url : './orderReport.ered?reqCode=queryColumn4OrderReport',
                              success : queryGridInfo4Ajax_success,
                              failure : queryGridInfo4Ajax_failure,
                              params : params
                        })
      }

      /**
       * 后台请求数据成功回调函数
       */
      function queryGridInfo4Ajax_success(response) {
            var data = Ext.util.JSON.decode(response.responseText);
            //设置数量信息列头
            //设置store的reader
            //后台请求数据

            var fields = [];
            var columnInfo = [];
            columnInfo.push(new Ext.grid.CheckboxSelectionModel());
            columnInfo.push(new Ext.grid.RowNumberer());

            numinfo = data.numinfo;
            var ordrepinfo = data.ordrepinfo;

            //添加完单报告基本信息列
            var ordrepLength = ordrepinfo.length;
            for (var idx = 0; idx < ordrepLength; idx++) {
                  var bean = ordrepinfo[idx];
                  columnInfo.push({
                                    header : fieldNameValueMap4others[bean.param],
                                    dataIndex : bean.param,
                                    align : 'center'
                              })
                  fields.push(bean.param);
            }

            //添加统计信息列
            var numLength = numinfo.length;
            for (var idx = 0; idx < numLength; idx++) {
                  var bean = numinfo[idx];
                  columnInfo.push({
                                    header : fieldNameValueMap4others[bean.param],
                                    dataIndex : bean.param,
                                    align : 'center'
                              })
                  fields.push(bean.param);
            }
            gridPanel.getColumnModel().setConfig(columnInfo);

            orderStore.reader = new Ext.data.JsonReader({
                              totalProperty : 'TOTALCOUNT', // 记录总数
                              root : 'ROOT' // Json中的列表数据根节点
                        }, fields);
            loadOrderStore(queryOrders);
      }
      /**
       * 后台请求数据失败回调函数
       */
      function queryGridInfo4Ajax_failure(response) {
            Ext.Msg.alert('提示', '不能加载显示数据');
      }

      /**
       * 查询订单的损耗分析数据 
       */
      function queryOrdderSrInfo(records) {
            // 提取所有的订单号
            var recordsLength = records.length;
            var orders = [];
            for (var idx = 0; idx < recordsLength; idx++) {
                  orders.push(records[idx].get('order_id'))
            }
            if (orders.length <= 0) {
                  Ext.Msg.alert('提示', '订单号不能为空')
                  return false;
            }
            loadOrderStore({
                              order_id : orders.join(',')
                        })
      }
      /**
       * 加载grid数据
       */
      var old_params = {};
      function loadOrderStore(params) {
            params = params || {}; //如果为空 则构建一个空对象
            //保存现有的查询条件
            if (Ext.isEmpty(params)) {
                  Ext.apply(params, old_params); //不是首次查询的条件，赋予旧参数
            } else {
                  old_params = {}; // 清空旧数据
                  Ext.apply(old_params, params); //保存第一次查询的条件
            }

            params.start = 0;
            params.limit = grid_bbar.pageSize;

            orderStore.baseParams = params; //保存基础参数
            orderStore.load({
                              params : params
                        })

      }
      /**
       * 数量相加
       */
      function addTwoNum(num1, num2) {
            if (Ext.isEmpty(num1)) {
                  num1 = 0;
            }
            if (Ext.isEmpty(num2)) {
                  num2 = 0;
            }
            return (+num1) + (+num2);
      }

      /**
       * 如果num为空 返回param或者空字符串
       */
      function filterNullNum(num, param) {
            if (Ext.isEmpty(num)) {
                  return param || '';
            }
            return num;
      }
      
      // 初始化处理
    (function(){
        showQueryWindow();
    }())
            //=======================================组件操作函数结束=============================//
})
