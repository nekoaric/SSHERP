window.onload = function(){
    //初始品牌选项
	var brand=['手填品牌','GAP','HADDAD','KIK','PEI','TALLYWEIJL','zara','森马','金宝贝',
	           '优衣库','DOCKERS','HM','LEVIS','BALABALA','JCP','LE','SELA',
	           'JOE','charing','F21','NIKE','匡威','乐途','李宁','美邦','sears',
	           'ROI','安踏','凡客','CA','NEXT','乐购','BIG BELL','FR0NT LINE',
	           'KIABI','MANGO','NAUTICA','STR','贝纳通','PVH和其它','CV','沃尔玛',
	           'TCP','Pimkie','Colony','海澜之家','ORSAY','塔利','宜台','CCDD',
	           '玛莎','ASMARA MAG','菲乐','八秒','科倍','欧赛加','PRIMARK','WEG',
	           'AEO','REITMANS','冠美','GSTAR','丰岛','QVC','妹尾','lee'
	           ];
	
	//清空表单
    function clearNumInfo(){
    	$('#cur_date_show').html(getDate(0));
//    	$("#style_no_read").attr("value",'');
//    	$("#brandInput").attr("value",'');
//    	$("#article").attr("value",'');
    	document.getElementById("style_no_read").value='';
    	document.getElementById("brandInput").value='';
    	document.getElementById("article").value='';
    	$('#good_num_show').html("");
    	$('#b_num_show').html("");
    	$('#c_num_show').html("");
//    	$("#b_num").attr("value",'');
//    	$("#c_num").attr("value",'');
//    	$("#good_num").attr("value",'');
//    	$("#ordNumRemark").attr("value",'');
    	document.getElementById("b_num").value='';
    	document.getElementById("c_num").value='';
    	document.getElementById("good_num").value='';
    	document.getElementById("ordNumRemark").value='';
    }
	
	$('#resetButton').click ( function(){
		clearNumInfo();
	})
	
	 
	
    $("#selectStyleNo").click ( function(){
    	if($('#style_no_read').val().length<=2){
    		alert("请输入至少3个字符进行查询");
    		return;
    	}
    	$.ajax({
			async:false, //同步请求
			url:'./depotCheck.mobile?reqCode=queryAllStyleNo&style_no='+$('#style_no_read').val(), //请求地址
			type:"POST", 
			dataType:'json',
			success:function(data, status) {
				var html='';
				$('#orderSelect').html("");
				var html=html+ '<option value="">无此款号，请手填</option>';
				$.each(data,function(i,item){
					html+= '<option value="'+item.style_no+'" >'+item.style_no+'</option>';
				});
				$('#style_noSelect').html(html);
			}, 
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				alert("ERR-110：系统繁忙，稍后重试！");
			}
		});
    	
    });
	$('#brandSelect').change( function(){
		$("#brandInput").val($("#brandSelect").val());
	})
    $('#style_noSelect').change( function(){
    	$("#style_no_read").val($("#style_noSelect").val());
		var style_no=$('#style_noSelect').val();
		$.ajax({
			async:false, //同步请求
			url:'./depotCheck.mobile?reqCode=queryInfo&style_no='+style_no, //请求地址
			type:"POST", 
			dataType:'json',
			success:function(data, status) {
				//如果查到记录，则/将input元素设置为readonly
				if(data.length>0){
//					$('article').attr("readonly","readonly");
//					$('brandInput').attr("readonly","readonly");
					document.getElementById('article').value=data.article;
					document.getElementById('brandInput').value=data.brand;
					document.getElementById('style_no_read').value=data.style_no;
					
					$('good_num_show').html(data.good_num);
					$('b_num_show').html(data.good_num);
					$('c_num_show').html(data.good_num);
				}
				else{
					alert("没有该款记录");
				}
			}, 
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				alert("ERR-110：系统繁忙，稍后重试！");
			}
		});
	})

    
    //提交验证
    $('#submitButton').click(function(){
    	//验证必填项,款式，数量，品牌，至少一个数量
    	if($("#style_no_read").val()==''){
    		alert("请填写款号！");
    		return;
    	}
    	if($("#good_num").val()==''&&$("#b_num").val()==''&&$("c_num").val()==''){
    		alert("请至少填写一个数量信息！");
    		return;
    	}
    	
    	//件数验证
    	var good_num = $("#good_num").val();
    	var b_num = $("#b_num").val();
    	var c_num = $("#c_num").val();
    	if(!isNaN(good_num)&&good_num>0){ 
    	}else{
    		alert('请输入正整数');
    		return;
    	}if(!isNaN(b_num)&&b_num>0){ 
    	}else{
    		alert('请输入正整数');
    		return;
    	}if(!isNaN(c_num)&&c_num>0){ 
    	}else{
    		alert('请输入正整数');
    		return;
    	}
    	//$("#form").submit();
    	var params={};
    	params.factory=$("#myGrpsSelect").val();
    	params.tr_date=$("#cur_date_show").html();
    	params.style_no_input=$("#style_no_read").val();
    	params.brand_input=$("#brandInput").val();
    	params.style_no=$("#style_noSelect").val();
    	params.brand=$("#brandSelect").val();
    	params.article=$("#article").val();
    	params.good_num=$("#good_num").val();
    	params.b_num=$("#b_num").val();
    	params.c_num=$("#c_num").val();
    	params.remark=$("#ordNumRemark").val();
    	
    	var resultStr = '';
        for(var key in params){
            resultStr += '&' + key + '=' + params[key]==undefined?'':params[key];
        }
        if(resultStr.length>1){
            resultStr = resultStr.substring(1);
        }
    	
    	sendAjaxRequest("./depotCheck.mobile?reqCode=saveCheckNum",resultStr,submit_callBack)
    })  
    
    /**
     * 提交数量回调函数
     */
    function submit_callBack(){
        try{
            if (XMLHttpReq.readyState == 4) {
                 if (XMLHttpReq.status == 200) {
                    var text = XMLHttpReq.responseText;
                     text = eval('('+text+')');
                     if(text.success){
                        alert('操作成功，处理下一条');
                        // 操作成功后初始化界面
                        initView(); 
                     }else {
                        
                     }
                 }
             }
        }catch(e){
            console.log(e);
        }
        reqFlag = false;
    
    }
    
    /**
     * 初始化界面
     */
    function initView(){
        //添加清空数据操作
        clearNumInfo();
        //初始化工厂选择框
        var html='<option value="">手填品牌</option>';
        $.each(brand,function(i,item){
			html+= '<option value="'+item+'" >'+item+'</option>';
		});
        $("#brandSelect").html(html);
        // 设置默认的操作日期
        var defaultDate = getDate(0);
        $('#opr_date').value=  defaultDate;
        // 请求工厂信息
        initMyGrps();
    };
    
    /**
     * 查询设置我的工厂信息
     */
    function initMyGrps(){
        $.ajax({
			async:true, //同步请求
			url:'./accountMobile.mobile?reqCode=queryGrps', //请求地址
			type:"POST", 
			dataType:'json',
			success:function(data, status) {
				var html='';
				$('#myGrpsSelect').html("");
				$.each(data.myGrps,function(i,item){
					html+= '<option value="'+item.name+'" >'+item.name+'</option>';
				});
				$('#myGrpsSelect').html(html);
			}, 
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				alert("ERR-110：系统繁忙，稍后重试！");
			}
		});
    }
    
    
    /**
     * 获取当前日期的相对days日期
     */
    function getDate(days){
        var curD = new Date();
        var dayOfMonth = curD.getDate();
        var resultDay = (+dayOfMonth) + days;
        curD.setDate(resultDay);
        var year = curD.getFullYear();
        var month = curD.getMonth()+1;
        month += '';
        month = month.length==1 ? '0'+month : month;
        
        var day = curD.getDate();
        day += '';
        day = day.length==1 ? '0'+day : day;
        
        return year + '-' + month + '-' + day;
    }
 
    var setFacButton = document.getElementById('setFacButton');
    setFacButton.onclick = function(){
        window.location.href = './accountMobile.mobile?reqCode=init';
    };
	//所有信息加载后初始化页面
    initView();
    
}


