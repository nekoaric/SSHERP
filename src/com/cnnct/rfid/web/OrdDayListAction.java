package com.cnnct.rfid.web;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrdDayListService;
import com.cnnct.rfid.web.excelParse.OrdDayExcelParseFactory;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;


/**
 * *********************************************
 * 创建日期: 2013-07-25
 * 创建作者：may
 * 功能：订单记录流水管理(查询,导入)
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings({"unchecked"})
public class OrdDayListAction extends BaseAction {
    Log log = LogFactory.getLog(OrdDayListAction.class);

    OrdDayListService ordDayListService = (OrdDayListService) super.getService("ordDayListService");

    /**
     * 产品记录导出页面初始化
     *
     * @param
     * @return
     */
    public ActionForward ordDayListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("ordDayListView");
    }

    /**
     * 查询RFID电子标签基本信息带分页
     *
     * @param
     * @return
     */
    public ActionForward queryOrdDayList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("state", '0');

        String natures = inDto.getAsString("natures");
        if (!"".equals(natures)) {
            StringBuffer sb = new StringBuffer();
            //nature格式 : '1','2'
            for (String nature : natures.split(";")) {
                sb.append("'").append(nature).append("',");
            }
            if (sb.length() > 0) {
                inDto.put("nature", sb.substring(0, sb.length() - 1));
            }
        }
        if(!"".equals(inDto.get("tr_date"))){
            inDto.put("tr_date", inDto.getAsString("tr_date").substring(0, 10));
        }

        super.setSessionAttribute(request, "QUERYORDDAYLISTINFO", inDto);

        Dto outDto = ordDayListService.queryOrdDayList(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 导入订单进度信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importOrdScheList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        FormFile file = aform.getTheFile();
        Dto outDto = new BaseDto();
        try {
            Dto inDto = new BaseDto();
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String grp_id = user.getGrpId();
            String opr_id = user.getAccount();
            String opr_time = G4Utils.getCurrentTime();
            
            // 解析文件
            Dto parseDto = new BaseDto();
            parseDto.put("grp_id", grp_id);
            parseDto.put("opr_id", opr_id);
            parseDto.put("opr_time", opr_time);
            Dto excelDto = new OrdDayExcelParseFactory().parseExcel(file,parseDto);
            if(excelDto==null){
                throw new ApplicationException("没有结果数据");
            }
            List list = excelDto.getDefaultAList(); // 获取解析后的集合数据
            
            int redatanum = 0;  // 重复数据
            // 重复数据的行号
            List rownum_redata = new ArrayList();
            // 数据错误行号
            List rownum_errdata = new ArrayList();
            // 出运成品数量超出行号
            List rowNum_errNum = new ArrayList();
            List resultList = new ArrayList();
            List<Dto> resultList_sfp = new ArrayList<Dto>();  //出运成品
            for(int idx=0;idx<list.size();idx++) {
                Dto dto = (Dto)list.get(idx);
                String rowNum = dto.getAsString("row_num");
                
                // 判断数据正确性
                Dto dbDto = new BaseDto();
                for(String str : (Set<String>)dto.keySet()){
                    String value = dto.getAsString(str);
                    value = value.replaceAll("'", "''");    //将查询的语句经过处理，防止单引号对查询所造成的影响
                    dbDto.put(str, value);
                }
                Dto orderDto = (Dto) g4Reader.queryForObject("queryOrdBasInfo", dbDto);
                if (G4Utils.isEmpty(orderDto) || ((!"".equals(dto.getAsString("style_no")) && !dto.getAsString("style_no").equals(orderDto.getAsString("style_no"))))) {
                    rownum_errdata.add(Integer.parseInt(rowNum));
                    continue;
                }
                dto.put("order_id", orderDto.getAsString("order_id"));
                
                //判断是否有相同的记录
                Integer countOrdDay = (Integer)g4Reader.queryForObject("queryOrdDayList4Dto",dto);
                if(countOrdDay>=1) {
                    rownum_redata.add(Integer.parseInt(rowNum));
                    redatanum ++;
                    continue;
                }
                dto.put("opr_id", opr_id);
                dto.put("opr_time", opr_time);
                dto.put("state", "0");
                
                // 出运成品独里添加到集合
                if("14".equals(dto.getAsString("nature"))){
                    resultList_sfp.add(dto);
                }else {
                    resultList.add(dto);
                }
            }
            
            // 处理不合规范的订单数量信息
            List<String> unValideOrder = valideOrderSendoutFProduct(resultList_sfp);
            for(Dto dto : resultList_sfp){
                if (unValideOrder.indexOf(dto.getAsString("order_id")) >=0 ) {
                    rowNum_errNum.add(dto.getAsInteger("row_num"));
                } else {
                    resultList.add(dto);
                }
            }
            
            
            Dto dbDto = new BaseDto();
            dbDto.setDefaultAList(resultList);

            outDto = ordDayListService.importOrdScheList(dbDto);

            if (list.size() == 0 && redatanum == 0){
                outDto.put("msg", "没有有效的流水记录!");
            } else {
                StringBuffer sb = new StringBuffer(100);
                sb.append("订单记录流水导入!<br/>登记记录共").append(list.size()).append("条,有效记录")
                        .append(resultList.size()).append( "条!");
                
               if(rownum_redata.size()>0){
                    sb.append("<br/>重复记录").append(collectionToString(rownum_redata))
                            .append("行!");
               }
               if(rownum_errdata.size()>0){
                    sb.append("<br/>信息有误数据记录").append(collectionToString(rownum_errdata)).append("行");
               }
               if(rowNum_errNum.size()>0){
                    sb.append("<br/>出运数超出指定范围(订单数*1.2)").append(collectionToString(rowNum_errNum)).append("行");
               }
                outDto.put("msg", sb.toString());
            }

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);

        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "标签信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }

        return mapping.findForward(null);
    }
    /**
     *  验证出运成品的数量
     * @return
     */
    private List<String> valideOrderSendoutFProduct(List<Dto> list){
     // 只对出运成品进行比较
        // 验证数量和订单数比较，比较系数为1.2
        double coefNum = 1.2;
        // 对正确结果的数据进行处理
        List<Dto> sendoutFProductList = new ArrayList<Dto>();
        List<String> disctinctOrderid = new ArrayList<String>();
        for(Dto dto : list){
            String orderid = dto.getAsString("order_id");
            if (disctinctOrderid.indexOf(orderid) < 0) {
                disctinctOrderid.add(orderid);
                continue;
            }
        }
        for(String str : disctinctOrderid){
            int pNum = 0;
            for(Dto dto : list) {
                if(str.equals(dto.getAsString("order_id"))){
                    pNum += dto.getAsInteger("amount");
                }
            }
            Dto beanDto = new BaseDto();
            beanDto.put("order_id", str);
            beanDto.put("amount", pNum);
            sendoutFProductList.add(beanDto);
        }
        List<String> unValideList = new ArrayList<String>();
        for(Dto dto : sendoutFProductList) {
            Object obj = g4Reader.queryForObject("getOrdScheListByOrdSeq", dto);
            if(obj==null){
                continue;
            }
            Dto qDto = (Dto)obj;
            Integer historyNum = qDto.getAsInteger("sendout_f_product");
            Integer ord_num = qDto.getAsInteger("order_num");
            Integer cur_num = dto.getAsInteger("amount");
            // 如果总数大于订单数量的系数范围 则添加不处理订单号
            if((historyNum+cur_num)> ord_num*coefNum){
                unValideList.add(dto.getAsString("order_id"));
            }
        }
        return unValideList;
        
    }
    
    //删除重复导入的订单数据  新增 2013年10月9日17:37:36 zhouww
    public ActionForward deleteOrdReData(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                                                    HttpServletResponse respons){
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        ordDayListService.deleteOrdReData(inDto);
        return mapping.findForward(null);
    }
    //重置订单导入基本数据 清空 订单导入的统计数据
    public ActionForward resetOrdData(ActionMapping mapping,ActionForm form,HttpServletRequest request,
            HttpServletResponse respons){
            
        return mapping.findForward(null);
    }
    
    //导出流水信息
    public ActionForward excleDeptInfoAction(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto dayListDto = new BaseDto();

        Dto inDto = (Dto) super.getSessionAttribute(request, "QUERYEPCDAYLISTINFO_DTO");
        if (!G4Utils.isEmpty(inDto)) {
            inDto.remove("queryForPageCountFlag");
            parametersDto.put("reportTitle", "记录流水信息"); // parameter
            List list = g4Reader.queryForList("queryEpcDayListInfo", inDto);
            for (int i = 0; i < list.size(); i++) {
                dayListDto = (Dto) list.get(i);
                String natureName = NatureUtil.parseNC2natureZh(dayListDto.getAsString("nature"));
                dayListDto.put("nature", natureName);
            }
            ExcelExporter excelExporter = new ExcelExporter();
            excelExporter.setTemplatePath("/report/excel/epcDayListInfo.xls");
            excelExporter.setData(parametersDto, list);
            excelExporter.setFilename("记录流水表" + ".xls");
            excelExporter.export(request, response);
        }
        return mapping.findForward(null);
    }
    /**
     * 将array转化为分行显示的字符串
     * @return
     */
    public String collectionToString(List data){
        //将连续的数字组合成：起始数字-终止数字的样式
        StringBuffer sb = new StringBuffer(100);
        int dataSize = data.size();
        if(dataSize<=0){
            return sb.toString();
        }
        Collections.sort(data);
        long lastNum = -2L;
        long firstNum = -1L;
        int indexNum = 0;   //数字处理个数的标识,每10个一行数据
        for(int i=0;i<dataSize;i++){
            Long currentNum = Long.parseLong(data.get(i).toString());
            if(currentNum==(lastNum+1)) {   //判断下一个数字是上一个数字的连续
                lastNum = currentNum;
            }else { //排除第一个的可能性  对第二个开始的数据开始判断
                if(firstNum==lastNum){
                    sb.append(",").append(firstNum);
                }else if(lastNum>firstNum){
                    sb.append(",").append(firstNum).append("-").append(lastNum);
                }
                if(lastNum>=firstNum){  
                    indexNum++;
                }
                if(indexNum%10==0){
                    sb.append(" <br/>");
                }
                //处理后的数据，重置初始状态
                lastNum = currentNum;
                firstNum = currentNum;
            }
            if((i+1) ==dataSize){ //如果是最后一个元素
                if(firstNum==lastNum){
                    sb.append(",").append(firstNum);
                }else {
                    sb.append(",").append(firstNum).append("-").append(lastNum);
                }
            }
        }
        if (sb.length()==0) {
            sb.append("--");
        }
        return sb.toString();
    }
}
