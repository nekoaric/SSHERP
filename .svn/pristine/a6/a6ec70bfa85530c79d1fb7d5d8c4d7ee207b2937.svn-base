/**
 * qc 位置数量操作
 * 
 * @author zhouww
 * @since 2015-01-27 功能: 产品QC数量输入操作
 */
window.onload = function() {

    // 参数
    var qcInfo = {};

    // 画图参数
    /**
     * 数量
     */
    var series = [];
    var title = 'QC数量饼图';
    var subTitle = '';
    var pieChart;

    // URL
    var saveQCNumInfoUrl = './manageQC.mobile?reqCode=saveQCNumInfo';
    var queryQCNumItemURL = './manageQC.mobile?reqCode=queryQCItemInfo'; // 查询QC信息
    var queryQCViewURL = './manageQC.mobile?reqCode=queryView'; // QC查询位置

    // 元素
    var dataTable = getElementById('qcNumTable');
    var qcNumViewDiv = getElementById('qcNumViewDiv');
    var backButtonDiv = getElementById('backButtonDiv');
    var backPreviousButton = getElementById('backPreviousButton'); // 上一级按钮
    var cancelButtonDiv = getElementById('cancelButtonDiv'); // 撤销按钮
    var showCascadeInfoSpan = getElementById('showCascadeInfoSpan');
    var submitButtonDiv = getElementById('submitButtonDiv'); // 确认按钮

    var showQcPieChartButton = getElementById('showQcPieChart4detailNum'); // QC饼图按钮
    var showQcChart4TNButton = getElementById('showQcPieChart4totalNum');    // 统计数据饼图按钮
    var showQcChart4DNButton = getElementById('showQcPieChart4detailNum');  // 详细数据饼图按钮
    var hideQcPieChartButton = getElementById('hideQcPieChart'); // QC饼图隐藏按钮

    var pieChartDiv = getElementById('pieChartDiv'); // 饼图位置DIV
    var qcNumDiv = getElementById('qcNumDiv'); // 数量信息DIV

    // =============== 参数变量
    // 当前操作的数量id
    var oldNumId = '';

    // 显示层级图示
    var showInfo = [];

    // 级联对象数组
    var cascadeObj = [];
    // 级联界面ID数组
    var cascadeViewId = [];

    // ~============== 参数变量结束

    var data = [{
                text : '款式误差/辅料装配',
                id : 'kswc',
                original : 0,
                isLeaf : false,
                num : 0,
                childern : [{
                            text : '款式误差1',
                            id : 'kswc1',
                            isLeaf : true
                        }, {
                            text : '款式误差2/辅料装配 面料瑕疵',
                            id : 'kswc2',
                            isLeaf : false,
                            childern : [{
                                        text : '款式误差2-1',
                                        id : 'kswc2-1',
                                        isLeaf : true,
                                        num : 0
                                    }]
                        }]
            }, {
                text : '面料瑕疵',
                id : 'mlxc',
                isLeaf : true,
                num : 0
            }, {
                text : '裁剪不良',
                id : 'cjbl',
                isLeaf : true,
                num : 0
            }, {
                text : '位置不准',
                id : 'wzbz',
                isLeaf : true,
                num : 0
            }, {
                text : '线迹不良',
                id : 'xjbl',
                isLeaf : true,
                num : 0
            }]

    /**
     * 创建QC数量输入界面功能
     * 
     * @param qcNumId
     *            qc数量对象Id
     * @param viewDataArr
     *            生成界面所需的数据
     */
    function createQCNumDiv(qcNumId, viewDataArr) {
        if (!qcNumId || !viewDataArr) {
            return; // 传入参数不合规范
        }
        // 隐藏当前界面
        var cascadeViewIdLength = cascadeViewId.length;
        if (cascadeViewIdLength > 0) {
            var curViewId = cascadeViewId[cascadeViewIdLength - 1];
            var curViewDiv = getElementById(curViewId);
            if (curViewDiv) {
                curViewDiv.style.display = 'none';
            }
        }
        var viewId = 'viewId' + qcNumId; // 生成界面Id
        cascadeViewId.push(viewId); // 保存界面ID信息
        cascadeObj.push(viewDataArr); // 保存生成界面信息的数据

        // 创建界面
        var tableEle = document.createElement('table');
        tableEle.setAttribute('id', viewId);
        tableEle.setAttribute('data-parentId', qcNumId);
        tableEle.style.width = '100%';
        createOneView(tableEle, viewDataArr);
        qcNumViewDiv.appendChild(tableEle);
    }

    /**
     * 创建一个界面
     * 
     * @param tableEle
     *            table元素节点
     * @param arr
     *            生成界面数据
     */
    function createOneView(tableEle, arr) {
        // 将数组数据进行排序
        // 一般性的检查项放在最后
        var generArr = [];
        var specifecArr = [];
        for(var idx=0;idx < arr.length;idx++){
            var beanItem = arr[idx];
            if(beanItem.flag == '4'){
                generArr.push(beanItem);
            }else {
                specifecArr.push(beanItem);
            }
        }
        
        arr = specifecArr.concat(generArr);
        
        var arrLength = arr.length;
        var tr = document.createElement('tr');
        var isOneRow = false;
        for (var idx = 0; idx < arrLength; idx++) {
            var bean = arr[idx];
            var td = createTd4Table(bean);
            if (idx % 4 == 0 && idx != 0) {
                tableEle.appendChild(tr);
                tr = document.createElement('tr');
            }
            tr.appendChild(td);
        }
        tableEle.appendChild(tr);   // 不管怎么算 还是有剩余的
    }
    /**
     * 为table 创建一个TD
     * 
     * @param beanData
     *            创建一个Td所需的数据 添加点击事件:信息框点击事件，输入框点击事件
     */
    function createTd4Table(beanData) {
        var td = document.createElement('td');
        td.setAttribute('style', 'width:25%;height: 90px;');
        var div = document.createElement('div');
        div.setAttribute('style',
                'width: 100%;height: 100%;position: relative;');
        var divSub1 = document.createElement('div');
        var divSub2 = document.createElement('div');

        divSub1
                .setAttribute('style',
                        'width: 100%;height:70px;position: relative;background-color: #f8dc59;');
        divSub2
                .setAttribute('style',
                        'width: 100%;height:20px;background-color: #f87e59;text-align: center;');

        divSub1.innerHTML = '<div style="top: 2%;text-align: center;position: relative;font-size:18px;">'
                + '<span>' + beanData.text + '(' + beanData.originalNum + ') </span>' + '</div>';
        var num = beanData.num;
        num = num ? num : 0;
        var showId = beanData.id + 'Num';
        if (beanData.isLeaf) { // 叶子节点和非叶子节点处理不一样
            divSub2.innerHTML = '<input type="text" id="'
                    + showId
                    + '" value="'
                    + num
                    + '" style="text-align:center;width: 100%;height: 100%;" data-oldValue="0" data-newValue="0"/>'
            var inputE = divSub2.getElementsByTagName('input')[0];
            inputE.onchange = numChange;
        } else {
            divSub2.innerHTML = '<span id="' + showId + '" value="' + num
                    + '">' + num + '</span>';
        }
        // 为显示信息区域添加事件
        divSub1.onclick = callBackQCNum(beanData);

        div.appendChild(divSub1);
        div.appendChild(divSub2);
        td.appendChild(div);
        return td;
    }

    /**
     * 为了添加点击事件的回调函数
     */
    function callBackQCNum(beanData) {
        return function() {
            clickQCNum(beanData);
        }
    }

    /**
     * QC数量点击
     */
    function clickQCNum(beanData) {
        if (beanData.isLeaf) {
            var numE = getElementById(beanData.id + "Num");
            var numVal = numE.value;
            numE.value = parseInt(numVal) + 1;
            // 叶子节点的点击 会触发返回上一级的事件 
            autoFireBackButton();
            // 上面的赋值不会触发change事件
            oldNumId = beanData.id + 'Num';
            numE.setAttribute('data-oldValue', numVal);
            numE.setAttribute('data-newValue', numE.value); // 获取上次的值 并且赋值给旧值
                                                            // 获取改变前数据的方式
            showCancelButton();
        } else {
            // 修改按钮显示
            submitButtonDiv.style.display = 'none';
            backButtonDiv.style.display = 'block';
            // 显示信息
            showCascadeInfo('1', beanData.text);
            // 展开下一级菜单
            createQCNumDiv(beanData.id, beanData.childern);
            // 隐藏显示饼图按钮
            showQcChart4DNButton.style.display = 'none';
            showQcChart4TNButton.style.display = 'none';
            
            // 如果是展开的话 那么取消定时返回任务
            if(timeoutId){
                // 取消历史定时任务
                clearTimeout(timeoutId);
            }
            
            hideCancelButton();
        }
    }

    // ================================AJAX请求
    /**
     * 保存本次qc信息
     */
    function saveQCNumInfo(paramStr) {
        sendAjaxRequest(saveQCNumInfoUrl, paramStr, saveQCNumInfo_callBack);
    }

    /**
     * 保存QC信息回调函数
     */
    function saveQCNumInfo_callBack() {
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('(' + text + ')');

                if (text.success) { // 成功查询
                    // 操作成功
                    // 返回QC选择界面
                    alert('保存成功，回到款号/订单号选择界面');
                    window.location.href = queryQCViewURL;
                } else {
                    alert(text.msg);
                }
            }
        }
    }

    /**
     * 查询检查项
     */
    function queryQCNumItem(paramStr) {
        sendAjaxRequest(queryQCNumItemURL, paramStr, queryQCNumItem_callBack);
    }

    /**
     * 查询检查项回调函数
     */
    function queryQCNumItem_callBack() {
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('(' + text + ')');

                if (text.success) { // 成功查询
                    var items = text.qcItem;
                    parseQCItemInfo(eval(items));
                } else {
                }
            }
        }
    }

    /**
     * 解析QC的信息
     */
    function parseQCItemInfo(arr) {
        // 生成有层次结构的数据
        data = [];
        data = ergQCItem('-1');
        // 还要显示QC位置信息
        showCascadeInfo('1', qcInfo.qcPositionName + "->" + qcInfo.qcClassName);
        createQCNumDiv('-1', data);
        // 遍历余下的数据 信息
        // TODO 可优化 ： 将提提取出来的元素从原数组中删除
        function ergQCItem(dataId) {
            if (!dataId)
                return;
            var dataArr = [];
            for (var idx = 0; idx < arr.length; idx++) {
                var bean = arr[idx];
                if (dataId == bean.parent_no) {
                    dataArr.push({
                        flag : bean.flag,   // 检查项判断，4-一般性的检查项
                        text : bean.short_name,
                        id : bean.seq_no,
                        originalNum : bean.amount,
                        num : 0,
                        isLeaf : true
                            // 默认为叶子节点
                        })
                }
            }
            // 遍历新增的节点
            for (var idx = 0; idx < dataArr.length; idx++) {
                var bean = dataArr[idx];
                var childArr = ergQCItem(bean.id);
                if (childArr && childArr.length > 0) {
                    bean.isLeaf = false;
                    bean.childern = childArr;
                }
            }

            return dataArr;
        }
    }
    // ~==================AJAX请求结束
    // ======================事件
    // QC饼图隐藏按钮点击事件
    hideQcPieChartButton.onclick = function() {
        // 隐藏QC饼图界面
        // 显示数量界面
        // 隐藏隐藏按钮
        // 显示显示按钮
        pieChartDiv.style.display = 'none';
        qcNumDiv.style.display = 'block';
        showQcChart4DNButton.style.display = '';
        showQcChart4TNButton.style.display = '';
        
        hideQcPieChartButton.style.display = 'none';
    }
    // 统计数据QC饼图点击事件
    showQcChart4TNButton.onclick = function(){
        chanageButtonSH();
        updateTopQCNum();
        parseTotalNumData2pieChart();   // 处理画图数据
        redrawPieChart4Param();
        
    }
    // 详细数据QC饼图 点击事件
    showQcChart4DNButton.onclick = function() {
        // 显示饼图的时候 是否需要判断是否是顶级
        chanageButtonSH();
        
        // 解析QC数量用于 画图用 
        updateTopQCNum();   // 更新顶层数据
        // 获取所有的QC数量并且画图
        //TODO 创建两种模式 ： 子数据模式和统计数据模式
        // 子数据模式，显示详细到每一个叶子数据的数量
        // 统计数据模式： 统计顶层的数量信息
        parseQCNumData2pieChart();
        
        redrawPieChart4Param();
    }
    /**
     * 设置饼图显示操作按钮
     */
    function chanageButtonSH(){
        // 显示qC界面
        // 隐藏数量界面
        // 隐藏显示按钮
        // 显示隐藏按钮
        // 重画饼图
        pieChartDiv.style.display = 'block';
        qcNumDiv.style.display = 'none';
        showQcChart4DNButton.style.display = 'none';
        showQcChart4TNButton.style.display = 'none';
        hideQcPieChartButton.style.display = 'block';
    }
    /**
     * 统计数据的饼图
     */
    function parseTotalNumData2pieChart(){
        // 画图数据
        var chartData = []; 
        
        // 获取待处理数量信息
        var resultNum = cascadeObj[0];
        // 统计数量
        var totalNum = 0;
        for(var idx=0; idx<resultNum.length; idx++){
            var num = resultNum[idx].num ? resultNum[idx].num : 0;
            totalNum += num;
        }
        for(var idx=0; idx<resultNum.length; idx++){
            var bean = resultNum[idx];
            if(!bean.num || bean.num == 0){continue;} // 过滤数量为0的数据
            chartData.push({
                name : bean.text,
                num : bean.num,
                y : parseFloat((bean.num/totalNum*100).toFixed(2))
            })
        }
        
        series = [];
        series.push({
            data : chartData,
            name : 'QC饼图'
        })
    }
    /**
     * 把QC数量变为图形所需的数据
     * 子数据模式的数据处理
     * 详细数据的饼图
     */
    function parseQCNumData2pieChart(){
        // 画图数据
        var chartData = []; 
        
        // 获取待处理数量信息
        var resultNum = getChildernNum(cascadeObj[0]);
        // 统计数量
        var totalNum = 0;
        for(var idx=0; idx<resultNum.length; idx++){
            var num = resultNum[idx].num ? resultNum[idx].num : 0;
            totalNum += num;
        }
        for(var idx=0; idx<resultNum.length; idx++){
            var bean = resultNum[idx];
            if(!bean.num || bean.num == 0){continue;} // 过滤数量为0的数据
            chartData.push({
                name : bean.text,
                num : bean.num,
                y : parseFloat((bean.num/totalNum*100).toFixed(2))
            })
        }
        
        series = [];
        series.push({
            data : chartData,
            name : 'QC饼图'
        })
        
        // 获取叶子数据信息
        function  getChildernNum(arr){
            var parentNum = []; // 父节点信息
            var childernNum = [];   // 叶子节点信息
            for(var idx=0; idx < arr.length; idx++){
                var bean = arr[idx];
                if(bean.isLeaf){
                    childernNum.push(bean);
                }else {
                    parentNum.push(bean);
                }
            }
            
            for(var idx=0; idx < parentNum.length ; idx++){
                var childNumArr = getChildernNum(parentNum[idx].childern);
                childernNum = childernNum.concat(childNumArr);
            }
            return childernNum;
        }
    }
    
    
    // 保存QC数据 按钮点击
    submitButtonDiv.onclick = function() {
        // 封装参数，获取数据
        var qcClass = qcInfo.qcClass;
        var qcPosition = qcInfo.qcPosition;
        var ords = qcInfo.ords;

        // 将顶层QC数量信息同步到cascadeObj数组中
        updateTopQCNum();
        
        // 获取数量信息  qcNumObj 用来保存QC数量信息
        var qcNumObj = getQCNumObj(cascadeObj[0]);
        
        var param = 'class=' + qcClass + "&qc_position=" + qcPosition
                + '&ords=' + ords + '&numInfo=' + JSON.stringify(qcNumObj);

        // 封装数据
        saveQCNumInfo(param);
    }
    
    /**
     * 组装QC数量信息
     * 过滤数量为空或者为0  不处理
     * {id:nujm}
     */
    function getQCNumObj(arr){
        // 返回的对象
        var qcNumObj = {};
        var childern = [];
        
        for(var idx=0;idx<arr.length;idx++){
            var beanObj = arr[idx];
            
            // 过滤没有数量 或者数量为0的数据 
            if(!beanObj.num || beanObj.num == 0){
                continue;
            }
            qcNumObj[beanObj.id] = beanObj.num;
            if(beanObj.childern){
                childern.push(beanObj.childern);
            }
        }
        
        // 遍历子元素
        for(var idx=0;idx < childern.length; idx++){
            var childQcNum = getQCNumObj(childern[idx]);
            for(var key in childQcNum){
                childQcNum.hasOwnProperty(key) && (qcNumObj[key] = childQcNum[key]); // 获取自身属性
            }
        }
        
        
        return qcNumObj;
    }
    /**
     * 更新顶层QC的数量信息,把HTML元素中的数量更新到数量对象中
     */
    function updateTopQCNum() {
        //  更新顶层QC数量信息
        if(cascadeObj.length == 0){
            return;
        }
        var topQC = cascadeObj[0];
        
        for (var idx = 0; idx < topQC.length; idx++) {
            var beanD = topQC[idx];
            var numVal = getNum4Id(beanD.id);
            beanD.num = (+numVal);
        }
    }

    // 数量改变事件
    function numChange() {
        var eventEle = event.target || event.srcElement;
        var value = eventEle.value;
        // 获取旧值，复制新值
        oldNumId = eventEle.id;
        eventEle.setAttribute('data-oldValue', eventEle
                        .getAttribute('data-newValue')); // 获取上次的值 并且赋值给旧值
                                                            // 获取改变前数据的方式
        eventEle.getAttribute('data-newValue', value); // 复制新值

        showCancelButton();

    }

    // 返回上级界面按钮点击事件
    backPreviousButton.onclick = function() {
        // 能够返回上一级说明上一级的只是显示
        // 处理级联数据数量大于1的情况
        // 获取当前界面的数量信息，
        // 关闭当前页面
        // 处理上级界面的显示和数据处理
        // 
        if(timeoutId){  // 如果有定时任务 ，取消定时任务 
            clearTimeout(timeoutId);
        }
        var cascadeDataLength = cascadeObj.length;
        if (cascadeDataLength < 2) {
            return; // 界面数量小于2的是否不处理，此按钮也会隐藏掉
        } else {
            var curViewData = cascadeObj.pop();
            var curViewId = cascadeViewId.pop();

            var tableEl = getElementById(curViewId);
            var parentId = tableEl.getAttribute('data-parentId');
            var count = 0;
            for (var idx = 0; idx < curViewData.length; idx++) {
                var beanD = curViewData[idx];
                var numVal = getNum4Id(beanD.id);
                beanD.num = (+numVal);
                count += (+numVal);
            }

            // 获取上级数量显示元素
            var ipEl = getElementById(parentId + 'Num');
            ipEl.setAttribute('value', count);
            ipEl.innerHTML = count;

            // 处理界面显示
            var nextViewId = cascadeViewId[cascadeViewId.length - 1];
            var nextView = getElementById(nextViewId);

            nextView.style.display = 'block';

            qcNumViewDiv.removeChild(tableEl);

            // 隐藏撤销按钮
            hideCancelButton();
            // 显示返回上一级
            showCascadeInfo(0);

            if (cascadeObj.length == 1) { // 如果结果是顶层信息 修改按钮显示
                backButtonDiv.style.display = 'none';
                submitButtonDiv.style.display = 'block';
                
                // 显示饼图按钮
                showQcChart4DNButton.style.display = '';
                showQcChart4TNButton.style.display = '';
            }
        }
    }

    /**
     * 撤销按钮点击事件
     */
    cancelButtonDiv.onclick = function() {
        var targetEle = getElementById(oldNumId);
        if (targetEle) {
            var oldVal = targetEle.getAttribute('data-oldValue');
            oldVal = oldVal ? oldVal : 0;
            targetEle.value = oldVal;
        }
        // 处理完撤销业务 隐藏撤销按钮
        hideCancelButton();
    }

    /**
     * 显示级别信息
     * 
     * @param flag
     *            标识 1 ：下一级 0:上一级
     * @param info
     *            如果标识为1(下一级) 那么info就是显示的信息
     */
    function showCascadeInfo(flag, info) {
        if (flag == '1') {
            showInfo.push(info);
            showCascadeInfoSpan.innerText = showInfo.join('-->');
        } else {
            showInfo.pop();
            showCascadeInfoSpan.innerText = showInfo.join('-->');
        }

    }

    /**
     * 隐藏撤销按钮
     */
    function hideCancelButton() {
        cancelButtonDiv.style.display = 'none';
    }

    /**
     * 显示撤销按钮
     */
    function showCancelButton() {
        cancelButtonDiv.style.display = 'block';
    }

    /**
     * 获取数量信息
     */
    function getNum4Id(numId) {
        var te = getElementById(numId + 'Num');
        var resultD = 0;
        if (te.tagName == 'SPAN') {
            resultD = te.getAttribute('value');
        } else {
            resultD = te.value;
        }
        return resultD ? resultD : 0;
    }

    // ~=====================事件结束
    // =====================饼图处理
    /**
     * 颜色的定义
     */
    var colors = ['#AA4643', '#BBBBBB', '#4572A7', '#CCCCCC', '#DDDDDD',
            '#AAAAAA', '#89A54E', '#EEEEEE', '#111111', '#80699B', '#225522',
            '#333333', '#3D96AE', '#446644', '#555555', '#DB843D', '#667766',
            '#777777', '#92A8CD', '#889988', '#999999', '#A47D7C', '#112233',
            '#112244', '#B5CA92', '#112255', '#324355'];
    /**
     * 饼图对象
     * 
     * @type
     */
    var qcNumChart = {
        chart : {
            type : 'pie'
        },
        colors : colors,
        title : {
            text : 'QC数量分布图'
        },
        subtitle : {
            text : '饼图'
        },
        yAxis : {
            allowDecimals : false,
            title : {
                text : ''
            },
            stackLabels : {
                enabled : true,
                style : {
                    fontWeight : 'bold'
                },
                formatter : function() {
                    return this.total
                }
            }

        },
        tooltip : {
            enabled : false,
            pointFormat : '百分比:<b>{point.y:.1f}%</b>'
                    + '<br/>数量:<b>{point.num}</b>'
        },
        plotOptions : {
            pie : {
                allowPointSelect : true,
                cursor : 'pointer',
                dataLabels : {
                    enabled : true,
                    color : '#000000',
                    connectorColor : '#000000',
                    format : '<b>{point.name}</b>:<br/> {point.y:.1f}%(<span style="color:red">{point.num}</span>)'
                }
            }

        },
        series : [],
        credits : {
            enabled : false
        },
        exporting : {
            enabled : false
        }
    }
    /**
     * 重新绘制
     */
    function redrawPieChart4Param() {
        if (pieChart) {
            pieChart.destroy();
        }
        pieChart = $('#pieChartDiv').highcharts(qcNumChart).highcharts();
        pieSeriesLength = series.length;
        for (var i = 0; i < pieSeriesLength; i++) {
            pieChart.addSeries(series[i], false);
        }
        pieChart.setTitle({
                    text : title
                }, {
                    text : subTitle
                });
        pieChart.redraw();
    }
    // ~====================饼图处理结束
    /**
     * 界面加载完 执行初始化方法
     */
    function init() {
        var qcClass = qcInfo.qcClass;
        var qcPosition = qcInfo.qcPosition;
        var ords = qcInfo.ords;
        var param = 'class=' + qcClass + "&qc_position=" + qcPosition
                + '&ords=' + ords;

        queryQCNumItem(param);
    }
    var timeoutId = '';
    /**
     * 自动触发返回上一层的事件
     */
    function autoFireBackButton(){
        if(timeoutId){
            // 取消历史定时任务
            clearTimeout(timeoutId);
        }
        // 3S触发
        timeoutId = setTimeout(function(){
            // 增加判断上一级按钮是否是可见的 ，如果是可见的那么触发点击事件
            var  isDisplay = backButtonDiv.style.display;
            if('' == isDisplay || 'none' == isDisplay) return;  // 如果是隐藏的情况下 ，那么直接返回 不处理
            backPreviousButton.click();
        },3000)
    }
    /**
     * 获取元素
     * 
     * @param {}
     *            eId
     * @return {}
     */
    function getElementById(eId) {
        return document.getElementById(eId);
    };

    (function() {

        qcInfo = JSON.parse(localStorage.qcInfo);

        init();
    })()
}
