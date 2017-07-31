package com.cnnct.rfid.web;

import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.write.Label;
import jxl.write.NumberFormats;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.rfid.service.OrdScheInfoService;
import com.cnnct.util.DataUtil;
import com.cnnct.util.NatureNumberUtil;
import com.cnnct.util.NatureUtil;
import com.cnnct.util.TimeUtil;

/**
 * *********************************************
 * 创建日期: 2013-05-08
 * 创建作者：may
 * 功能：订单进度|生产进度
 * 最后修改时间：2013-07-25
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings("unchecked")
public class OrdScheInfoAction extends BaseAction {

	private Log log = LogFactory.getLog(OrdScheInfoAction.class);
	
    private OrdScheInfoService ordScheInfoService = (OrdScheInfoService) super.getService("ordScheInfoService");

    /**
     * 订单进度页面初始化
     *
     * @param
     * @return
     */
    public ActionForward ordScheListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        return mapping.findForward("ordScheListView");
    }

    /**
     * 部门管理页面初始化
     *
     * @param
     * @return
     */
    public ActionForward ordDayScheInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("ordDayScheView");
    }

    /**
     * 订单短缺初始化
     *
     * @param
     * @return
     */
    public ActionForward ordShortInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        return mapping.findForward("prodOrdShortInfoView");
//        return mapping.findForward("ordShortInfoView");
    }
    /**
     * 为查询订单流水数据的移交信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrdDayList4detailData(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	String resultStr = "";
    	try{
    		CommonActionForm cForm = (CommonActionForm)form;
    		Dto inDto = cForm.getParamAsDto(request);
    		String nature = inDto.getAsString("nature");
    		//查询与此流程相关的回退操作数量
    		Map<String,List<String>> rollbackMap = NatureUtil.getNatureCode2actionNature4rollback();
    		List<String> rollbackNatures = new ArrayList<String>();
    		
    		for(Entry<String,List<String>> entry : rollbackMap.entrySet()){
    			List<String> beanList = entry.getValue();
    			if(beanList.contains(nature)){
    				rollbackNatures.add(entry.getKey());
    			}
    		}
    		StringBuffer sb = new StringBuffer(128);
    		for(String natureBean : rollbackNatures){
    			sb.append(",'").append(natureBean).append("'");
    		}
    		sb.append(",'").append(nature).append("'");
    		if(sb.length()>0){
    			sb.deleteCharAt(0);
    		}
    		inDto.put("natures", sb.toString());
    		List<Dto> resultList = g4Reader.queryForList("queryOrdDaylist4detailData", inDto);
    		for(Dto dto : resultList){	//添加流程名字信息
    			dto.put("nature_name", NatureUtil.parseNC2natureZh(dto.getAsString("nature")));
    		}
    		
    		resultStr = JsonHelper.encodeList2PageJson(resultList, resultList.size(), null);
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	super.write(resultStr, response);
    	return mapping.findForward(null);
    }
    /**
     * 获取订单进度列表
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdScheList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        super.setSessionAttribute(request, "GETORDSCHELIST_DTO", inDto);

        Dto outDto = ordScheInfoService.getOrdScheList(inDto);

        super.write(outDto.getAsString("jsonString"), response);

        return mapping.findForward(null);
    }
    /**
     * 获取订单进度列表
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdSchePerCent(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        super.setSessionAttribute(request, "GETORDSCHELIST_DTO", inDto);

        Dto outDto = ordScheInfoService.getOrdSchePerCent(inDto);

        super.write(outDto.getAsString("jsonString"), response);

        return mapping.findForward(null);
    }

    /**
     * 获取订单进度图
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdScheListView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = ordScheInfoService.getOrdScheListView(inDto);

        response.setContentType("text/xml;charset=GBK");
        response.setHeader("Cache-control","no-cache");
        String JsonString = outDto.getAsString("xmlString");

        super.write(JsonString, response);

        return mapping.findForward(null);
    }

    /**
     * 获取订单进度百分比图(支持多个订单对比)
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdSchePerCentView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = ordScheInfoService.getOrdSchePerCentView(inDto);

        response.setContentType("text/xml;charset=GBK");
        response.setHeader("Cache-control","no-cache");
        String JsonString = outDto.getAsString("xmlString");

//        String JsonString = JsonHelper.encodeObject2Json(outDto);

        super.write(JsonString, response);

        return mapping.findForward(null);
    }

    /**
     * 获取订单进度列表
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdDaySche(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        super.setSessionAttribute(request, "GETORDDAYSCHE_DTO", inDto);

        Dto outDto = ordScheInfoService.getOrdDaySche(inDto);

        super.write(outDto.getAsString("jsonString"), response);

        return mapping.findForward(null);
    }

    /**
     * 获取订单日进度图信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdDayScheView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = ordScheInfoService.getOrdDayScheView(inDto);

//        String JsonString = JsonHelper.encodeObject2Json(outDto);

        response.setContentType("text/xml;charset=GBK");
        response.setHeader("Cache-control","no-cache");
        String JsonString = outDto.getAsString("xmlString");

        super.write(JsonString, response);

        return mapping.findForward(null);
    }

    /**
     * 获取订单短缺列表
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdShortInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        super.setSessionAttribute(request, "GETORDSHORTINFO_DTO", inDto);

        Dto outDto = ordScheInfoService.getOrdShortInfo(inDto);

        super.write(outDto.getAsString("jsonString"), response);

        return mapping.findForward(null);
    }
    /**
     * 获取产品短缺信息<br/>
     *  epc绑定产品的数据
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getPordShortInfo(ActionMapping mapping ,ActionForm form,HttpServletRequest request,
    										HttpServletResponse response)throws Exception {
    	CommonActionForm aform = (CommonActionForm)form;
    	Dto inDto = aform.getParamAsDto(request);
    	super.setSessionAttribute(request, "GETPORDSHORTINFO", inDto);
    	Dto outDto = ordScheInfoService.getProdShortInfo(inDto);
    	super.write(outDto.getAsString("jsonString"), response);
    	return mapping.findForward(null);
    }
    
    /**
     * 获取订单短缺详细列表
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getDetailShortInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        super.setSessionAttribute(request, "GETORDSHORTINFO_DTO", inDto);

        Dto outDto = ordScheInfoService.getDetailShortInfo(inDto);

        super.write(outDto.getAsString("jsonString"), response);

        return mapping.findForward(null);
    }

    /**
     * 获取订单短缺图信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdShortInfoView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = ordScheInfoService.getOrdShortInfoView(inDto);

        response.setContentType("text/xml;charset=GBK");
        response.setHeader("Cache-control","no-cache");
        String JsonString = outDto.getAsString("xmlString");

//        String JsonString = JsonHelper.encodeObject2Json(outDto);

        super.write(JsonString, response);

        return mapping.findForward(null);
    }



    /**
     * 导出订单进度信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportOrdScheList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto inDto = new BaseDto(request);
        parametersDto.put("reportTitle", "订单进度表"); // parameter GETORDSCHELIST_DTO
        String flag = request.getParameter("flag");
        if (flag.equals("cur")) {
            inDto = (BaseDto) super.getSessionAttribute(request, "GETORDSCHELIST_DTO");
        }
        inDto.remove("queryForPageCountFlag");
        inDto.remove("start");
        List list = g4Reader.queryForList("getOrdScheListByOrdSeq", inDto);
        // 修改  2013-8-14 zhouww
        String[] category_label_value = {"real_cut_num", "draw_num", "sew_num", "bach_accept_num",
                "bach_delivery_num", "pack_accept_num", "f_product_num", "b_product_num","receive_f_product",
                "receive_b_product","middle_take","sew_delivery_num","sendout_f_product","sendout_b_product"};
        for(int i=0;i<list.size();i++){
            Dto dto = (Dto)list.get(i);
//            Dto insDto = (Dto) g4Reader.queryForObject("getInsNumInfo4OrdSche", dto);
            //判断ins_num,order_num是否为null：预防因为订单没有产品信息而产生的null值
            if(dto.getAsInteger("ins_num")==null){
            	dto.put("ins_num", 0);
            }
            if(dto.getAsInteger("order_num")==null){
            	dto.put("order_num", 0);
            }
            for(String key:category_label_value){
                Integer v = dto.getAsInteger(key);
                if(v==null){
                	v=0;
                	dto.put(key,0);
                }
                Double value = 0.0;
                if(dto.getAsInteger("ins_num")!=0){
                	 value = DataUtil.doubleDiv(v * 100, dto.getAsInteger("ins_num"));
                }
                dto.put(key+"_percent",value.toString()+"%");
            }
            //处理单耗计算
            DecimalFormat df = new DecimalFormat("0.00");
            //修改导出的单耗的显示 xtj 7.22
            if(dto.getAsInteger("sendout_f_product")+dto.getAsInteger("sendout_b_product")==0){
            	dto.put("consume", "");
            }else{
            dto.put("consume", df.format(dto.getAsDouble("consume")*100)+"%");
            }
//            dto.put("ins_num",insDto.getAsString("ins_num"));
            //9.29增加许可损耗，损耗超标
            //double allow_loss=dto.getAsDouble("allow_loss_per")==null?0:dto.getAsDouble("allow_loss_per");
            //double loss_exceed=0;
//            if (allow_loss>0) {
//            	double consume=dto.getAsDouble("consume")==null?0:dto.getAsDouble("consume");
//            	 loss_exceed=consume-allow_loss*100;
//			}
            dto.put("allow_loss_per", dto.getAsString("allow_loss_per"));
            //dto.put("loss_exceed", loss_exceed+"%");
            //2015.7.1 加入所有日进度的备注
            List<Dto> remarklist=g4Reader.queryForList("getOrdDayRemarkByOrderId",dto);
            String remarks="";
            for(Dto remarkDto : remarklist){
            	remarks+=remarkDto.getAsString("remark")+"/";
            }
            dto.put("remarks", remarks);
        }
        
        // ~ end
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/ordScheList.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("订单进度表" +TimeUtil.getCurrentDate()+ ".xls");
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }

    /**
     * 导出订单日进度信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportOrdDaySche1(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto inDto = new BaseDto(request);
        inDto.remove("queryForPageCountFlag");
        parametersDto.put("reportTitle", "订单日进度信息表"); // parameter
        List list = g4Reader.queryForList("getOrdDayListForexcel", inDto);
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/ordDaySche.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("订单信息表" +TimeUtil.getCurrentDate()+ ".xls");
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }

    /**
     * 导出订单日进度信息
     */
    public ActionForward exportOrdDaySche(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto inDto = (BaseDto) super.getSessionAttribute(request, "GETORDDAYSCHE_DTO");
        inDto.remove("queryForPageCountFlag");
        inDto.remove("start");
        parametersDto.put("reportTitle", "订单日进度表"); // parameter
        if (inDto != null) {
        	Dto insDto = (Dto) g4Reader.queryForObject("getInsNumInfo4OrdSche", inDto);
            List list = g4Reader.queryForList("getOrdDayScheListByOrdSeq", inDto);
            String style_no = "";
            //修改 2013-8-14 zhouww
            if (list.size() > 0) {
            	style_no = ((Dto)list.get(0)).getAsString("style_no");
                for (int i = 0; i < list.size(); i++) {
                    Dto a = (Dto) list.get(i);
                    a.put("style_no", style_no);
                    a.put("ins_num", insDto.getAsString("ins_num"));
                    a.put("order_num", insDto.getAsString("order_num"));
                }
            }
            String fobDate = "";
            if(list.size()>0){
            	fobDate = ((Dto)list.get(0)).getAsString("fob_deal_date");
            	if(fobDate.length()>10){
            		fobDate = fobDate.substring(0,10);
            	}
            }
            fobDate = "FOB  "+fobDate;
            parametersDto.put("reportTitle", fobDate+parametersDto.getAsString("reportTitle"));
            insDto.put("tr_date", "订单号:"+insDto.getAsString("ord_seq_no"));
            insDto.put("ord_seq_no", "汇总信息");
            list.add(insDto);
            style_no = "  款号"+style_no;
            //~ end
            ExcelExporter excelExporter = new ExcelExporter();
            excelExporter.setTemplatePath("/report/excel/ordDaySche.xls");
            excelExporter.setData(parametersDto, list);
            excelExporter.setFilename(style_no+"  订单日进度表" +TimeUtil.getCurrentDate()+ ".xls");
            excelExporter.export(request, response);
        }
        return mapping.findForward(null);
    }
    
    /**
     * 导出订单短缺信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportOrdShortInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        String flag = request.getParameter("flag");
        String isFill = request.getParameter("isFill");
        Dto inDto = new BaseDto();
        if (flag.equals("all")) {
            inDto = new BaseDto(request);
        } else if (flag.equals("cur")) {
            inDto = (BaseDto) super.getSessionAttribute(request, "GETORDSHORTINFO_DTO");
        }
        inDto.put("isFill", isFill);
        inDto.put("request",request);
        inDto.put("response", response);
        inDto.remove("queryForPageCountFlag");
        ordScheInfoService.exportOrdShortInfo(inDto);
        return mapping.findForward(null);
    }

    /**
     * 导出订单短缺信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
	public ActionForward exportProdDetailShortInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        String columnValue = inDto.getAsString("columnValue");
        String shortNatures = inDto.getAsString("shortNatures");
        String[] columns = columnValue.split(",");

        List shortList = g4Reader.queryForList("getProdScheListByProdOrdSeq", inDto);
        Dto paramDto = new BaseDto();
        paramDto.put("prod_ord_seq", inDto.getAsString("prod_ord_seq"));
        Object prodOrdDto = g4Reader.queryForObject("queryProdOrdInfo",paramDto);
        String isFill = inDto.getAsString("isFill");
        if(isFill!=null && "yes".equals(isFill)){
        	shortList = NatureNumberUtil.fillData(shortList);
        }
        Dto columnKeyValue = new BaseDto();
        shortList = NatureNumberUtil.doShort4nature(shortList);
        for(int i =0;i<columns.length;i++){
            columnKeyValue.put(columns[i],(i+1));
        }

        String[] short_nature_key = {"draw_short_num", "sew_short_num","sew_delivery_short", "bach_accept_short_num",
                "bach_delivery_short_num", "pack_accept_short_num", "product_short_num","receive_f_product_short",
                "receive_b_product_short"};
        String[] short_nature_value = {"裁片短缺", "缝制短缺","缝制交短缺", "水洗收短缺", "水洗交短缺", "后整收短缺", "后整交短缺",
        			"收成品短缺","收B品短缺"};
        //根据产品的短缺信息生成产品的各个流程的短缺信息
        List<Dto> detailShortList = new ArrayList<Dto>();
        for (Integer i = 0; i < short_nature_key.length; i++) {
            String nature = short_nature_key[i];
            for (Object o : shortList) {
                Dto shortDto = (Dto) o;

                Dto dto = new BaseDto();
                dto.put("nature_value", short_nature_value[i]);
                dto.put("nature", nature);

                dto.put("color", shortDto.getAsString("color"));
                dto.put("country", shortDto.getAsString("country"));
                dto.put("in_length", shortDto.getAsString("in_length"));
                dto.put("waist", shortDto.getAsString("waist"));
                dto.put("product_id", shortDto.getAsString("product_id"));
                dto.put("style_no", shortDto.getAsString("style_no"));

                String shortNum = shortDto.getAsString(nature);//某个产品某个流程短缺数量

                if (!shortNum.equals("")) {
                    System.out.println("product_id:"+dto.getAsString("product_id"));
                }
                dto.put("short_num", shortNum);

                detailShortList.add(dto);
            }
        }

        //更新各个产品各个流程的短缺信息组合成需要展示的行信息
        List<Dto> rowList = new ArrayList<Dto>();
        for(Dto detailShortDto:detailShortList){
            Boolean eqFlag = false;
            if(!"".equals(shortNatures) && !shortNatures.contains(detailShortDto.getAsString("nature"))){
                continue;
            }
            for(Dto rowDto:rowList){
                //如果行信息中有对应的信息.设置行中其他腰围的短缺数量
                if(detailShortDto.getAsString("nature").equals(rowDto.getAsString("nature"))
                        &&detailShortDto.getAsString("color").equals(rowDto.getAsString("color"))
                        &&detailShortDto.getAsString("country").equals(rowDto.getAsString("country"))
                        &&detailShortDto.getAsString("in_length").equals(rowDto.getAsString("in_length"))){
                    eqFlag = true;
                    String waist = detailShortDto.getAsString("waist");

                    rowDto.put(waist,detailShortDto.getAsString("short_num"));
                }
            }

            if(!eqFlag){//当前信息还没有对应的行信息时,新建一行
                //设置key名称为 waist+腰围 值为当前的腰围的短缺数
                String waist = detailShortDto.getAsString("waist");
                detailShortDto.put(waist,detailShortDto.getAsString("short_num"));
                String nature = detailShortDto.getAsString("nature");
                if(!"".equals(nature)){
                	detailShortDto.put("shortFac",NatureUtil.parseShortEn2shortZh(nature));
                }
                rowList.add(detailShortDto);
            }
        }
	    //过滤行记录中为空的   修改 2013-8-16 zhouww
	    for(int  i=0;i<rowList.size();i++){
	        Dto rowDto = (Dto)rowList.get(i);
	        boolean  flag = false;
	        Iterator it = rowDto.keySet().iterator();
	        while (it.hasNext()){
	            String key = (String)it.next();
	            if(Arrays.asList(columns).contains(key)){
	                if(!"".equals(rowDto.getAsString(key))){
	                    flag = true;
	                    break;
	                }
	            }
	        }

            if(!flag){
                rowList.remove(i);
                i--;
            }
	    }
        //~ end
        OutputStream os = response.getOutputStream();
        WritableWorkbook wbook = Workbook.createWorkbook(os);
        WritableSheet wsheet = wbook.createSheet("短缺详情", 0);

        wsheet.mergeCells(0, 0, (columns.length+4), 0);//合并一行
        //设置字体
        WritableFont font = new WritableFont(WritableFont.TIMES, 18, WritableFont.BOLD , false);
        WritableCellFormat cFormat = new WritableCellFormat(font);
        cFormat.setBorder(Border.ALL,   BorderLineStyle.THIN);
        cFormat.setAlignment(jxl.format.Alignment.CENTRE);//居中
        
        Label label = new Label(0, 0, "生产通知单短缺详情",cFormat);
        wsheet.addCell(label);

        font = new WritableFont(WritableFont.TIMES, 11, WritableFont.BOLD , false);
        cFormat = new WritableCellFormat(font);
        //设置边框
        cFormat.setBorder(Border.ALL,   BorderLineStyle.THIN);
        cFormat.setAlignment(jxl.format.Alignment.RIGHT);
        label = new Label(0,1,"短缺位置",cFormat);
        wsheet.addCell(label);
        label = new Label(1,1, "短缺性质",cFormat);
        wsheet.addCell(label);
        label = new Label(2,1, "国家",cFormat);
        wsheet.addCell(label);
        label = new Label(3,1, "颜色",cFormat);
        wsheet.addCell(label);
        label = new Label(4,1, "内长",cFormat);
        wsheet.addCell(label);
        for(int i =0;i<columns.length;i++){
            String column = columns[i];

            label = new Label((5+i),1,column,cFormat);
            wsheet.addCell(label);
        }

        cFormat = new WritableCellFormat(NumberFormats.TEXT);
        //设置边框
        cFormat.setBorder(Border.ALL,   BorderLineStyle.THIN);
        cFormat.setAlignment(jxl.format.Alignment.RIGHT);
        for (int i = 0; i < rowList.size(); i++) {
            Dto rowDto = (Dto)rowList.get(i);
            label = new Label(0,(2+i),rowDto.getAsString("shortFac"),cFormat);
            wsheet.addCell(label);
            label = new Label(1,(2+i), rowDto.getAsString("nature_value"),cFormat);
            wsheet.addCell(label);
            label = new Label(2,(2+i), rowDto.getAsString("country"),cFormat);
            wsheet.addCell(label);
            label = new Label(3,(2+i), rowDto.getAsString("color"),cFormat);
            wsheet.addCell(label);
            label = new Label(4,(2+i), rowDto.getAsString("in_length"),cFormat);
            wsheet.addCell(label);
            for(int j =0;j<columns.length;j++){
                String column = columns[j];
                label = new Label((5+j),(2+i),rowDto.getAsString(column),cFormat);
                wsheet.addCell(label);
            }
        }
        String fobDate = "";
        if(prodOrdDto!=null){
        	fobDate = ((Dto)prodOrdDto).getAsString("fob_deal_date");
        	if(fobDate.length()>10){
        		fobDate = fobDate.substring(0,10);
        	}
        }
        fobDate = "FOB "+fobDate;
        String fs = new String((fobDate+"  生产通知单短缺详情"+TimeUtil.getCurrentDate()).getBytes("GB2312"), "iso8859-1");

        response.setHeader("Content-disposition", "attachment;filename="+fs+".xls");
        response.setContentType("application/vnd.ms-excel");
        wbook.write();
        wbook.close();
        os.close();
        return mapping.findForward(null);
    }
    
    /**
     * 多订单日进度查询
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdDayScheMulti (ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	  CommonActionForm aform = (CommonActionForm) form;
          Dto inDto = aform.getParamAsDto(request);

          super.setSessionAttribute(request, "GETORDDAYSCHEMULTI_DTO", inDto);

          Dto outDto = ordScheInfoService.getOrdDayScheMulti(inDto);

          super.write(outDto.getAsString("jsonString"), response);

          return mapping.findForward(null);
    }
    /**
     * 多订单日进度导出
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward prodDayScheExceport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		parametersDto.put("reportTitle", "多订单进度表");
		Dto inDto = (BaseDto) super.getSessionAttribute(request, "GETORDDAYSCHEMULTI_DTO");
		Dto outDto = ordScheInfoService.prodDayScheExceport(inDto);
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/ordDaySche.xls");
		excelExporter.setData(parametersDto, (List)outDto.get("prodDayList"));
		excelExporter.setFilename("多订单日进度表" +TimeUtil.getCurrentDate()+ ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
    
    /**
     * 获取工厂下的子工厂<br/>
     * 传入上级工厂的名字：superFactory:factoryName
     * @param mapping
     * @param from
     * @param request
     * @param response
     * @return
     */
    public ActionForward getFactoryByFactoryName(ActionMapping mapping,ActionForm form,HttpServletRequest request,
    		HttpServletResponse response){
    	try{
    		CommonActionForm cForm = (CommonActionForm)form;
    		Dto inDto = cForm.getParamAsDto(request);
    		String superFactory = inDto.getAsString("superFactory");
    		String osName = System.getProperty("os.name").toLowerCase();
    		if(osName.indexOf("window")==-1){
    			superFactory = new String(superFactory.getBytes());
    		}else if(osName.indexOf("window")!=-1){
    			superFactory = new String(superFactory.getBytes("iso8859-1"),"utf-8");
    		}
    		inDto.put("superFactory", superFactory);
    		Dto outDto = ordScheInfoService.getFactoryBySuperFacotry(inDto);
    		List dataList = outDto.getDefaultAList();
    		String dataJson = JsonHelper.encodeList2PageJson(dataList, dataList.size(), "");
    		super.write(dataJson, response);
    	}catch(Exception e){
    		e.printStackTrace();
    	
    	}
    	return mapping.findForward(null);
    }

   
}
