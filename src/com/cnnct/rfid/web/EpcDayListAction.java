package com.cnnct.rfid.web;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.EpcDayListService;
import com.cnnct.rfid.service.EpcProdInfoService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;


/**
 * *********************************************
 * 创建日期: 2013-05-22
 * 创建作者：lingm
 * 功能：电子标签流水查询
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */

@SuppressWarnings({"unchecked"})
public class EpcDayListAction extends BaseAction {
    Log log = LogFactory.getLog(EpcDayListAction.class);

    EpcDayListService epcDayListService = (EpcDayListService) super.getService("epcDayListService");
    EpcProdInfoService epcProdInfoService = (EpcProdInfoService) super.getService("epcProdInfoService");

    /**
     * RFID电子标签流水页面初始化
     *
     * @param
     * @return
     */
    public ActionForward manageEpcDayListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        return mapping.findForward("manageEpcDayListView");
    }

    /**
     * 查询RFID电子标签基本信息带分页
     *
     * @param
     * @return
     */
    public ActionForward queryEpcDayListInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("state", '0');

        String natures = inDto.getAsString("natures");
        if(!"".equals(natures)){
            StringBuffer sb = new StringBuffer();
            //nature格式 : '1','2'
            for(String nature:natures.split(";")){
                sb.append("'").append(nature).append("',");
            }
            if(sb.length()>0){
                inDto.put("nature",sb.substring(0,sb.length()-1));
            }
        }
        super.setSessionAttribute(request,"QUERYEPCDAYLISTINFO_DTO",inDto);

        Dto outDto = epcDayListService.queryEpcDayListInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        FormFile file = aform.getTheFile();
        Dto outDto = new BaseDto();
        try {
            Dto inDto = new BaseDto();
            String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
            
            String metaData = "tr_date,trm_no,epc,product_id,nature,opr_id";
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("导入文件格式有误,请查看!");
                }
            }

            List epcDayList = new ArrayList();//标签记录表
            List epcProdList = new ArrayList();//标签产品绑定表

            for (int i=1;i<list.size();i++){
                Dto epcDayDto = (Dto)list.get(i);

                //nature转换
                String nature = NatureUtil.parseNatureZh2natureCode(epcDayDto.getAsString("nature"));
                if("".equals(nature)){
                    throw new ApplicationException("第"+(i+1)+"行中数量性质值错误,请核对!");
                }
                epcDayDto.put("nature",nature);

                Dto epcProdDto = new BaseDto();
                epcProdDto.put("epc",epcDayDto.getAsString("epc"));
                epcProdDto.put("product_id",epcDayDto.getAsString("product_id"));
                epcProdDto.put("opr_id",epcDayDto.getAsString("opr_id"));
                epcProdDto.put("opr_date", G4Utils.getCurDate());
                epcProdDto.put("state","0");
                epcProdList.add(epcProdDto);

                epcDayDto.put("grp_id",grp_id);
                epcDayDto.put("opr_time",G4Utils.getCurrentTime());
                epcDayDto.put("flag","0");
                epcDayDto.put("ord_status","0");
                epcDayDto.put("dept_status","0");

                epcDayList.add(epcDayDto);
            }

            inDto.setDefaultAList(epcDayList);
            inDto.setDefaultBList(epcProdList);
            outDto = epcDayListService.importExcel(inDto);

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString,response);

        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "标签信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString,response);
        }

        return mapping.findForward(null);
    }


    /**
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importExcelNoEpc(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        FormFile file = aform.getTheFile();
        Dto outDto = new BaseDto();
        try {
            Dto inDto = new BaseDto();
            String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();

            
            String metaData = "tr_date,trm_no,prod_ord_seq,style_no,country,color,in_length,waist,epc,nature,opr_id";
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            Dto excelDto = excelReader.readByPoi4Key(0, 0,"prod_ord_seq");
            List list = excelDto.getDefaultAList();
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("导入文件格式有误,请查看!");
                }
            }

            Dto qDto = new BaseDto();
            Dto keyWordDto = (Dto)excelDto.get("keyWordDto");
            StringBuffer prod_ord_seq_str = new StringBuffer();
            Iterator it = keyWordDto.keySet().iterator();
            while (it.hasNext()){
                String key = (String)it.next();
                prod_ord_seq_str.append("'").append(key).append("',");
            }
            if(prod_ord_seq_str.length()>0){
                qDto.put("prod_ord_seq",prod_ord_seq_str.substring(0,prod_ord_seq_str.length()-1));
            }else{
                throw new ApplicationException("生产通知单格式错误,请核对!");
            }

            List prodBasInfoList = g4Reader.queryForList("getProdBasInfoByProdOrdSeq",qDto);

            List epcDayList = new ArrayList();//标签记录表

            Dto tidKey = new BaseDto();

            for (int i=1;i<list.size();i++){
                Dto epcDayDto = (Dto)list.get(i);
                //保存excel表的位置信息
                epcDayDto.put("indexOfExcel", i+1);
                
                Object obj = epcDayDto.get("tr_date");
                if(obj instanceof java.util.Date){
                    epcDayDto.put("tr_date",G4Utils.getDate((Date)obj,"yyyy-MM-dd"));
                }

                //nature转换
                String nature = NatureUtil.parseNatureZh2natureCode(epcDayDto.getAsString("nature")); 
                if("".equals(nature)){
                    throw new ApplicationException("第"+(i+1)+"行中数量性质值错误,请核对!");
                }
                epcDayDto.put("nature",nature);
                epcDayDto.put("grp_id",grp_id);
                epcDayDto.put("opr_time",G4Utils.getCurrentTime());
                epcDayDto.put("flag","1");//导入
                epcDayDto.put("ord_status","0");
                epcDayDto.put("dept_status","0");
                epcDayDto.put("product_id","");
                //获取产品信息
                for(Object object : prodBasInfoList){
                    Dto prodBasInfoDto = (Dto)object;
                    if(epcDayDto.getAsString("prod_ord_seq").equals(prodBasInfoDto.getAsString("prod_ord_seq"))
                            &&epcDayDto.getAsString("style_no").equals(prodBasInfoDto.getAsString("style_no"))
                            &&epcDayDto.getAsString("country").equals(prodBasInfoDto.getAsString("country"))
                            &&epcDayDto.getAsString("color").equals(prodBasInfoDto.getAsString("color"))
                            &&epcDayDto.getAsString("in_length").equals(prodBasInfoDto.getAsString("in_length"))
                            &&epcDayDto.getAsString("waist").equals(prodBasInfoDto.getAsString("waist"))){
                        epcDayDto.put("product_id",prodBasInfoDto.getAsString("product_id"));
                        epcDayDto.put("prod_ord_seq",prodBasInfoDto.getAsString("prod_ord_seq"));
                        epcDayDto.put("ins_num",prodBasInfoDto.getAsString("ins_num"));
                        epcDayDto.put("cut_num",prodBasInfoDto.getAsString("cut_num"));
                        epcDayDto.put("style_no_seq_no",prodBasInfoDto.getAsString("style_no_seq_no"));
                        epcDayDto.put("color_seq_no",prodBasInfoDto.getAsString("color_seq_no"));
                        epcDayDto.put("cloth_size_seq_no",prodBasInfoDto.getAsString("cloth_size_seq_no"));
                        break;
                    }
                }

                if("".equals(epcDayDto.getAsString("product_id"))){
                    throw new ApplicationException("第"+(i+1)+"行中产品信息错误,请核对!");
                }

                epcDayList.add(epcDayDto);
            }
            epcDayListService.importExcelNoEpc(epcDayList);
            outDto.put("msg","导入记录成功");
            outDto.put("success",true);

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString,response);

        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "标签信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString,response);
        }

        return mapping.findForward(null);
    }

    //导出流水信息
    public ActionForward excleDeptInfoAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto dayListDto = new BaseDto();

        Dto inDto = (Dto)super.getSessionAttribute(request,"QUERYEPCDAYLISTINFO_DTO");
        //包头数据类型转换
        String osName = System.getProperty("os.name").toLowerCase();
        if(osName.indexOf("window")!=-1){
	        for(Object obj :inDto.keySet()){
	        	String str = (String)obj;
	        	String property = new String(inDto.getAsString(str).getBytes("iso8859-1"),"utf-8");
	        	inDto.put(str, property);
	        }
        }else if(osName.indexOf("window")==-1){
        	for(Object obj :inDto.keySet()){
	        	String str = (String)obj;
	        	String property = new String(inDto.getAsString(str).getBytes());
	        	inDto.put(str, property);
	        }
        }
        //保存订单名
        String ord_seq_no = inDto.getAsString("ord_seq_no");
        //处理nature
        String natures = inDto.getAsString("natures");
        if(!"".equals(natures)){
            StringBuffer sb = new StringBuffer();
            //nature格式 : '1','2'
            for(String nature:natures.split(";")){
                sb.append("'").append(nature).append("',");
            }
            if(sb.length()>0){
                inDto.put("nature",sb.substring(0,sb.length()-1));
            }
        }
        if(!G4Utils.isEmpty(inDto)){
            inDto.remove("queryForPageCountFlag");
            parametersDto.put("reportTitle", "记录流水信息"); // parameter
            Integer pageCount = g4Reader.queryForPageCount("queryEpcDayListInfo", inDto);
            //设置下载数量
            if(pageCount>100000){
            	throw new ApplicationException("结果数据大于100000条，请分类,分批次导出");
            }
            List list = g4Reader.queryForList("queryEpcDayListInfo", inDto);
            for (int i = 0; i < list.size(); i++) {
                dayListDto = (Dto) list.get(i);
                dayListDto.put("nature", dayListDto.getAsString("nature"));
            }
            ExcelExporter excelExporter = new ExcelExporter();
            excelExporter.setTemplatePath("/report/excel/epcDayListInfo.xls");
            excelExporter.setData(parametersDto, list);
            excelExporter.setFilename(new String((ord_seq_no).getBytes("GBK"),"iso8859-1")+"记录流水表" + ".xls");
            excelExporter.export(request, response);
        }
        return mapping.findForward(null);
    }

}
