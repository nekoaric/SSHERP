<!-- 由<eRedG4:flashReport/>标签生成的代码开始 -->
<div id="${id}_div" class="${cls}" align="${align}"></div>
<script type="text/javascript">
	var ${id}_chart_object = new Object();
	window.onload=function(){
		function fn(){
			#if(${width} == "full")
			var width = document.body.clientWidth;
				${id}_chart_object = new FusionCharts("${swfModelPath}", "${id}", width, "${height}",0,1);
			#else
				${id}_chart_object = new FusionCharts("${swfModelPath}?ChartNoDataText=没有要展示数据", "${id}", "${width}", "${height}",0,1);
			#end

			${id}_chart_object.setDataURL("data.xml");
			${id}_chart_object.addParam("wmode","Opaque");
			${id}_chart_object.render("${id}_div");
		}
		var task = new Ext.util.DelayedTask(fn);
		task.delay(1000);
	}
</script>
<!-- 由<eRedG4:flashReport/>标签生成的代码结束 -->