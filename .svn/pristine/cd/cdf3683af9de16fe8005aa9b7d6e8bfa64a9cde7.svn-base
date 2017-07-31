<%@ page contentType="text/html; charset=utf-8"%>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Ext JS Calendar Sample</title>
    <!-- Ext includes -->
    <link rel="stylesheet" type="text/css" href="resource/extjs3.1/resources/css/ext-all.css" />
    <script type="text/javascript" src="resource/extjs3.1/adapter/ext/ext-base-debug.js"></script>
    <script type="text/javascript" src="resource/extjs3.1/ext-all-debug.js"></script>
    <link rel="stylesheet" type="text/css" href="resource/css/ext_icon.css">
    <script type="text/javascript" src="resource/commonjs/ext-lang-zh_CN.js"></script>
    
    <!-- Calendar-specific includes -->
	<link rel="stylesheet" type="text/css" href="arrange/resources/css/calendar.css" />
    <script src="arrange/calendar-all-debug.js"></script>
    <!--<script type="text/javascript" src="src/Ext.calendar.js"></script>-->
    <!--<script type="text/javascript" src="src/templates/DayHeaderTemplate.js"></script>-->
    <!--<script type="text/javascript" src="src/templates/DayBodyTemplate.js"></script>-->
    <!--<script type="text/javascript" src="src/templates/DayViewTemplate.js"></script>-->
    <!--<script type="text/javascript" src="src/templates/BoxLayoutTemplate.js"></script>-->
    <!--<script type="text/javascript" src="src/templates/MonthViewTemplate.js"></script>-->
    <!--<script type="text/javascript" src="src/dd/CalendarScrollManager.js"></script>-->
    <!--<script type="text/javascript" src="src/dd/StatusProxy.js"></script>-->
    <!--<script type="text/javascript" src="src/dd/CalendarDD.js"></script>-->
    <!--<script type="text/javascript" src="src/dd/DayViewDD.js"></script>-->
    <!--<script type="text/javascript" src="src/EventRecord.js"></script>-->
	<!--<script type="text/javascript" src="src/views/MonthDayDetailView.js"></script>-->
    <!--<script type="text/javascript" src="src/widgets/CalendarPicker.js"></script>-->
    <!--<script type="text/javascript" src="src/WeekEventRenderer.js"></script>-->
    <!--<script type="text/javascript" src="src/views/CalendarView.js"></script>-->
    <!--<script type="text/javascript" src="src/views/MonthView.js"></script>-->
    <!--<script type="text/javascript" src="src/views/DayHeaderView.js"></script>-->
    <!--<script type="text/javascript" src="src/views/DayBodyView.js"></script>-->
    <!--<script type="text/javascript" src="src/views/DayView.js"></script>-->
    <!--<script type="text/javascript" src="src/views/WeekView.js"></script>-->
    <!--<script type="text/javascript" src="src/widgets/DateRangeField.js"></script>-->
    <!--<script type="text/javascript" src="src/widgets/ReminderField.js"></script>-->
    <!--<script type="text/javascript" src="src/EventEditForm.js"></script>-->
    <!--<script type="text/javascript" src="src/EventEditWindow.js"></script>-->
    <!--<script type="text/javascript" src="src/CalendarPanel.js"></script>-->

    <!-- App -->
    <link rel="stylesheet" type="text/css" href="arrange/resources/css/examples.css" />
	<script type="text/javascript" src="arrange/app/calendar-list.js"></script>
    <script type="text/javascript" src="arrange/app/event-list.js"></script>
	<script type="text/javascript" src="arrange/app/test-app.js"></script>
    <script type="text/javascript" src="baseComponent/queryGrpAndDeptDetail.js"></script>
    <script type="text/javascript" src="arrange/app/viewAuth.js"></script>
    <%--  需要引入查询订单的JS  --%>
    <script type="text/javascript" src="baseComponent/queryOrderInfoDetailMode2.js"></script>
    <script>
        // 获取request传递的参数
        var userType = ${requestScope.userType};
        var isGrpUser = ${requestScope.isGrpUser};
    </script>
</head>
<body>
    <div style="display:none;">
    <div id="app-header-content">
        <div id="app-logo">
            <div class="logo-top">&nbsp;</div>
            <div id="logo-body">&nbsp;</div>
            <div class="logo-bottom">&nbsp;</div>
        </div>
        <h1>订单排期</h1>
        <span id="app-msg" class="x-hidden"></span>
    </div>
    </div>
</body>
<script>
    var updateLogoDt = function(){
        document.getElementById('logo-body').innerHTML = new Date().getDate();
    }
    updateLogoDt();
    setInterval(updateLogoDt, 1000);
</script>
</html>