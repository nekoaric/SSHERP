package com.cnnct.rfid.web;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrderReportService;
import com.cnnct.rfid.util.ProcessSpecialSign;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;
import com.ibatis.common.logging.Log;
import com.ibatis.common.logging.LogFactory;
/**
 * 完单报告管理
 * @author zhouww
 * @since 2014-08-26
 */
public class OrderReportInfoAction extends BaseAction{
    //日志
    private Log log = LogFactory.getLog(OrderReportInfoAction.class);
    //服务类
    private OrderReportService ors = (OrderReportService)super.getService("orderReportService");
    
    /**
     * 完单报告损耗分析初始化界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward orderReportQueryInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
             HttpServletResponse response) throws Exception {
        String loginid = super.getSessionContainer(request).getUserInfo().getAccount();
        String name = super.getSessionContainer(request).getUserInfo().getUsername();
        return mapping.findForward("orderReportQuery");
    }
    
    /**
     * 初始化界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward orderReportInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
             HttpServletResponse response) throws Exception {
        String loginid = super.getSessionContainer(request).getUserInfo().getAccount();
        String name = super.getSessionContainer(request).getUserInfo().getUsername();
        request.setAttribute("login_id", loginid);
        request.setAttribute("login_name", name);
        return mapping.findForward("orderReport");
    }
    
    /**
     * 查询完单报告损耗信息的列头信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryColumn4OrderReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String order_id = inDto.getAsString("order_id");
            if(G4Utils.isEmpty(order_id)){
                throw new Exception("订单号为空");
            }
            String[] orders = order_id.split(",");
            StringBuffer sb = new StringBuffer();
            for(int idx=0;idx < orders.length; idx++){
                String orderid = orders[idx];
                orderid = ProcessSpecialSign.processQuotes(orderid); // 处理单引号，成为数据库接受的符号
                sb.append(",'").append(orderid).append("'");
            }
            if(sb.length()>0){
                sb.deleteCharAt(0);
            }
            Dto dbDto = new BaseDto();
            dbDto.put("order_id", sb.toString());
            List<Dto> resultList = g4Reader.queryForList("queryNumColumn4orderReport",dbDto);
            
            String[] generCol = new String[]{"sr_total_num","sew_num","product_num","ins_num","ord_num"};    //可计算
            String[] ordrepInfo = new String[]{"tailor_percent","sr_num","cust_name","style_no","order_id","ord_report_no"};    //不计算
            for(int idx=0;idx < generCol.length;idx++){
                Dto beanDto = new BaseDto();
                beanDto.put("param", generCol[idx]);
                resultList.add(0,beanDto);
            }
            // 一般列添加指令数，订单数，加裁率信息
            
            List<Dto> ordRepList = new ArrayList<Dto>();
            for(int idx=0;idx < ordrepInfo.length;idx++){
                Dto beanDto = new BaseDto();
                beanDto.put("param", ordrepInfo[idx]);
                ordRepList.add(0,beanDto);
            }
            // 添加一般列头信息 
            outDto.put("numinfo", resultList);
            outDto.put("ordrepinfo", ordRepList);
            outDto.put("success", true);
            outDto.put("msg","查询成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "查询信息失败");
            outDto.put("msg2", e.getMessage());
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 查询完单报告的订单信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrders4orderReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        List<Dto> resultList = new ArrayList<Dto>();
        int totalNum = 0;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String order_id = inDto.getAsString("order_id");
            String[] orders = order_id.split(",");
            
            StringBuffer sb = new StringBuffer(256);
            for(String str : orders){
                String orderid = ProcessSpecialSign.processQuotes(str); // 处理单引号，成为数据库接受的符号
                sb.append(",'").append(orderid).append("'");
            }
            if(sb.length()>0){
                sb.deleteCharAt(0);
            }
            Dto dbDto = new BaseDto();
            dbDto.putAll(inDto);
            dbDto.put("orders", sb.toString());
            resultList = g4Reader.queryForPage("queryOrders4sr", dbDto);
            totalNum = g4Reader.queryForPageCount("queryOrders4sr", dbDto);
            //查询每个完单报告的详细数量信息
            Dto oneDto = new BaseDto();
            oneDto.put("type", "1");
            for(Dto dto : resultList){
                // 计算加裁率
                String tailorPer  = computeTailorPercent(dto.getAsString("sew_num"), 
                        dto.getAsString("ins_num"));
                dto.put("tailor_percent", tailorPer);
                
                oneDto.put("ord_report_no", dto.getAsString("ord_report_no"));
                List<Dto> beanList = g4Reader.queryForList("queryOrderReport4detailInfo",oneDto);
                Dto nameMap = new BaseDto();    // 保存所有的名字类field
                for(int idx=0;idx<beanList.size();idx++) {
                    Dto numDto = beanList.get(idx);
                    String value = numDto.getAsString("param");
                    if(value.endsWith("_name"))    {    // _name结尾的为标签前显示信息
                        nameMap.put(value, numDto.getAsString("data"));
                        beanList.remove(idx--);
                    }
                }
                
                for(Dto numDto : beanList){
                    String param = numDto.getAsString("param");
                    String value = numDto.getAsString("data");
                    dto.put(param, value);
                }
                
                //计算损耗率
                Integer sew_num = dto.getAsInteger("sew_num");
                Integer product_num = dto.getAsInteger("product_num");
                String sr_num = "";
                Integer sr_total_num = 0;
                if(product_num==null){
                    sr_num = "100%";
                    sr_total_num = sew_num;
                }else if(sew_num==null || sew_num==0){
                    sr_num = "0%";
                    sr_total_num = 0;
                }else {
                    BigDecimal bd = new BigDecimal((sew_num-product_num-0.0)/sew_num*100);
                    sr_num  = bd.setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue()+"%";
                    sr_total_num = sew_num-product_num;
                }
                dto.put("sr_total_num", sr_total_num);    //添加损耗数
                dto.put("sr_num", sr_num);    // 添加损耗率
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        String resultStr = JsonHelper.encodeList2PageJson(resultList, totalNum, null);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 计算加裁率
     * @param str1
     * @param str2
     * @return
     */
    private String computeTailorPercent(String sew_num,String ins_num){
        if("".equals(sew_num) || "".equals(ins_num)){
            return "";
        }
        Double d1 = Double.parseDouble(sew_num);
        Double d2 = Double.parseDouble(ins_num);
        BigDecimal bd = new BigDecimal(d1/d2*100);
        return bd.setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue()+"%";
    }
    
    /**
     * 新增完单报告
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward addOrderReport4web(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String reportFalg = "0";    //完单报告标识，0：新增，1：修改
            String ord_report_no = inDto.getAsString("ordreportno");
            if(G4Utils.isEmpty(ord_report_no)){
                ord_report_no = getNextOrderReportSeq();
                reportFalg = "0";
            }else {
                reportFalg = "1";
            }
            
            String opr_id = super.getSessionContainer(request).getUserInfo().getAccount();
            
            Dto baseDto = new BaseDto();
            baseDto.put("opr_id", opr_id);
            baseDto.put("ord_report_no",ord_report_no);
            baseDto.put("opr_time", TimeUtil.getCurrentDate());
            
            // 完单报告基本信息
            String baseInfo = inDto.getAsString("baseinfo");
            Dto baseInfoDto = JsonHelper.parseSingleJson2Dto(baseInfo);
            baseInfoDto.putAll(baseDto);
            baseInfoDto.put("open_id", opr_id);
            baseInfoDto.put("open_time", TimeUtil.getCurrentDate());
            
            // 完单报告数量信息
            String numInfo = inDto.getAsString("numinfo");
            Dto numInfoDto = JsonHelper.parseSingleJson2Dto(numInfo);
            List<Dto> numInfoList = parseObject4listinfo(numInfoDto, baseDto,"1");
            
            // 完单报告操作人信息
            String sureInfo = inDto.getAsString("sureopr");
            Dto sureInfoDto = JsonHelper.parseSingleJson2Dto(sureInfo);
            List<Dto> sureInfoList = parseObject4listinfo(sureInfoDto, baseDto,"2");
            
            // 完单报告备注信息
            String remark = inDto.getAsString("remark");
            Dto remarkDto = JsonHelper.parseSingleJson2Dto(remark);
            List<Dto> remarkList = parseObject4listinfo(remarkDto, baseDto,"3");
            
            //订单号的详细信息
            String orderinfo = inDto.getAsString("orderinfo");
            List<Dto> orderinfoList = JsonHelper.parseJson2List(orderinfo);
            orderinfoList = parseCollection2listinfo(orderinfoList, baseDto, "order_id", "4");
            
            //工厂的编号信息
            String factoryinfo = inDto.getAsString("factoryinfo");
            List<Dto> factoryinfoList = JsonHelper.parseJson2List(factoryinfo);
            factoryinfoList = parseCollection2listinfo(factoryinfoList, baseDto, "fac_id", "5");
            
            // 责任工厂编号
            String dutyfac = inDto.getAsString("dutyfac");
            Dto dutyfacDto = JsonHelper.parseSingleJson2Dto(dutyfac);
            List<Dto> dutyfacList = parseObject4listinfo(dutyfacDto, baseDto, "6");
            
            // 责任工厂名称
            String dutyfacname = inDto.getAsString("dutyfacname");
            Dto dutyfacnameDto = JsonHelper.parseSingleJson2Dto(dutyfacname);
            List<Dto> dutyfacnameList = parseObject4listinfo(dutyfacnameDto, baseDto, "7");
            
            // 责任工厂数量
            String dutynum = inDto.getAsString("dutynum");
            Dto dutyNumDto = JsonHelper.parseSingleJson2Dto(dutynum);
            List<Dto> dutyNumList = parseObject4listinfo(dutyNumDto, baseDto, "8");
            
            
            //整合附加信息
            List<Dto> resultDbList = new ArrayList<Dto>();
            resultDbList.addAll(numInfoList);
            resultDbList.addAll(sureInfoList);
            resultDbList.addAll(remarkList);
            resultDbList.addAll(orderinfoList);
            resultDbList.addAll(factoryinfoList);
            resultDbList.addAll(dutyfacList);
            resultDbList.addAll(dutyNumList);
            resultDbList.addAll(dutyfacnameList);
            
            //数据信息
            Dto resultDbDto = new BaseDto();
            resultDbDto.put("baseInfo", baseInfoDto);
            resultDbDto.put("listInfo", resultDbList);
            resultDbDto.put("ord_report_no", ord_report_no);
            resultDbDto.put("account", opr_id);
            //~~~~~数据处理完毕
            
            if("1".equals(reportFalg))    {    //完单报告标识-修改
                ors.updateOrdReport(resultDbDto);
            }else if("0".equals(reportFalg)) {//完单报告标识-新增
                ors.addOrdReport(resultDbDto);
            }
            outDto.put("success", true);
            outDto.put("msg","成功操作完单报告,完单报告号为"+ord_report_no);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "完单报告出现问题");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 修改完单报告
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateOrderReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "新增完单报告出现问题");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 查询一条完单报告用来显示损耗饼图
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrderReport4showSrInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String ord_report_no = inDto.getAsString("ord_report_no");
            String order_id = inDto.getAsString("order_id");
            // 传入参数优先使用完单报告号
            if(G4Utils.isEmpty(ord_report_no)){    //如果是空的话就使用订单号查询完单报告
                if(G4Utils.isEmpty(order_id)){
                    throw new ApplicationException("没有完单报告号或者生产通知单号");
                }
                Dto dbDto = new BaseDto();
                dbDto.put("order_id", order_id);
                List<Dto> ordReportList = g4Reader.queryForList("queryOrdReportNo4orderId", dbDto);
                if((G4Utils.isEmpty(ordReportList))){    // 没有或者有多条数据都不行
                    throw new ApplicationException("此订单没有 完单报告信息");
                }else if(ordReportList.size()>1){
                    throw new ApplicationException("此订单有多个完单报告信息");
                }else {
                    ord_report_no = ordReportList.get(0).getAsString("ord_report_no");
                }
            }
            
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", ord_report_no);
            //1 完单报告的基本信息
            Dto baseInfo = new BaseDto();
            Object obj = g4Reader.queryForObject("queryOrdReportInfo4baseinfo", dbDto);
            if(obj==null){
                throw new ApplicationException("没有完单报告号");
            }
            outDto = ors.queryOrdReport(dbDto);
            //5 添加登录人信息 
            String account = super.getSessionContainer(request).getUserInfo().getAccount();
            
            outDto.put("ord_report_no", ord_report_no);
            outDto.put("account", account);
            outDto.put("success", true);
            outDto.put("msg", "数据查询成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "后台无法加载数据");
            outDto.put("msg2", e.getMessage());
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    
    }
    /**
     * 查询单个完单报告
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrderReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String ord_report_no = inDto.getAsString("ord_report_no");
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", ord_report_no);
            //1 完单报告的基本信息
            Dto baseInfo = new BaseDto();
            Object obj = g4Reader.queryForObject("queryOrdReportInfo4baseinfo", dbDto);
            if(obj==null){
                throw new ApplicationException("没有完单报告号");
            }
            outDto = ors.queryOrdReport(dbDto);
            //5 添加登录人信息 
            String account = super.getSessionContainer(request).getUserInfo().getAccount();
            
            outDto.put("ord_report_no", ord_report_no);
            outDto.put("account", account);
            outDto.put("success", true);
            outDto.put("msg", "数据查询成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "后台无法加载数据");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 查询完单报告集合
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrderReport4List(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        String resultStr = "";
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            // 处理所有的订单  单引号--》双单引号
            String orders = inDto.getAsString("orders");
            if(!"".equals(orders)){
                StringBuffer sb = new StringBuffer();
                String[] orderArr = orders.split(",");
                for(String str : orderArr){
                    String ts = str.replace("'", "''");
                    sb.append(",'").append(str).append("'");
                }
                if (sb.length()>0){
                    sb.deleteCharAt(0);
                }
                inDto.put("orders", sb.toString());
            }
            List<Dto> resultList = g4Reader.queryForPage("queryOrdReportInfo4baseinfo", inDto);
            Integer totalNum = g4Reader.queryForPageCount("queryOrdReportInfo4baseinfo", inDto);
            resultStr = JsonHelper.encodeList2PageJson(resultList, totalNum, null);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
        }
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 获取一些订单的额外信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward requestOrderInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String orders = inDto.getAsString("order_id");
            if(G4Utils.isEmpty(orders)){
                throw new ApplicationException("没有订单号信息");
            }
            String[] order_id = orders.split(",");
            StringBuffer sb = new StringBuffer(256);
            for(String orderBean : order_id){
                String orderid = ProcessSpecialSign.processQuotes(orderBean); // 处理单引号，成为数据库接受的符号
                sb.append(",'").append(orderid).append("'");
            }
            if(sb.length()>0){
                sb.deleteCharAt(0);
            }
            Dto dbDto = new BaseDto();
            dbDto.put("order_id", sb.toString());
            List<Dto> resultList = g4Reader.queryForList("queryOrderInfo4ordReport",dbDto);
            outDto.put("resultList", resultList);
            outDto.put("success", true);
            outDto.put("msg", "获取订单额外信息");
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("msg", "查询额外信息失败");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 删除完单报告信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteOrdReportInfol(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String account = super.getSessionContainer(request).getUserInfo().getAccount();
            inDto.put("account", account);
            String ord_report_no = inDto.getAsString("ord_report_no");
            outDto = ors.delOrdReport(inDto);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "删除完单报告失败");
            outDto.put("msg2", e.getMessage());
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 保存报表导出信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveExportDataInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            
            super.setSessionAttribute(request, "orderReportSrDataInfo4Export", inDto);
            
            outDto.put("success", true);
            outDto.put("msg", "保存信息成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "保存信息失败");
            outDto.put("msg2", e.getMessage());
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 导出损耗信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportOrderReportSrInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        try{
            // 获取导出信息数据
            Dto dataDto = (Dto)super.getSessionAttribute(request, "orderReportSrDataInfo4Export");
            
            Dto countDto = JsonHelper.parseSingleJson2Dto(dataDto.getAsString("countinfo"));
            List<Dto> colList = JsonHelper.parseJson2List(dataDto.getAsString("colinfo"));
            String title = dataDto.getAsString("title");
            List<Dto> dataList = JsonHelper.parseJson2List(dataDto.getAsString("datainfo"));
            OutputStream os = response.getOutputStream();
            WritableWorkbook book = Workbook.createWorkbook(os);
            filldata4book(book, colList, dataList, countDto);
            String filename = new String((title +".xls").getBytes(),"iso8859-1");
            response.setHeader("Content-disposition", "attachment;filename="+filename);
            response.setContentType("application/vnd.ms-excel");
            book.write();
            book.close();
            os.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return mapping.findForward(null);
    }
    /**
     * book填充数据
     * @param book
     * @param colList
     * @param dataList
     * @param countDto
     */
    public void filldata4book(WritableWorkbook book,List<Dto> colList,List<Dto> dataList,Dto countDto){
        try{
            WritableFont titleFont = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false);
            WritableCellFormat titleF = new WritableCellFormat(titleFont);
            WritableSheet sheet = book.createSheet("订单损耗",0);
            //解析并添加列头信息
            List<String> col = new ArrayList<String>();
            int size = colList.size();
            for(int idx=0;idx<size;idx++){
                Dto dto = colList.get(idx);
                String text = dto.getAsString("text");
                String value = dto.getAsString("value");
                Label label = new Label(idx, 0, text,titleF);
                col.add(value);
                sheet.addCell(label);
                sheet.setColumnView(idx, 15);
            }
            // 添加数据信息
            int dataSize = dataList.size();
            int colSize = col.size();
            for(int idx=0;idx<dataSize;idx++){
                Dto beanDto = dataList.get(idx);
                for(int k=0;k<colSize;k++){
                    String str = col.get(k);
                    Label label = new Label(k, idx+1, beanDto.getAsString(str));
                    sheet.addCell(label);
                }
            }
            
            // 添加总计信息
            for(int k=0;k<colSize;k++){
                String str = col.get(k);
                Label label = new Label(k, dataSize+2, countDto.getAsString(str),titleF);
                sheet.addCell(label);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    
    /**
     * 解析数量信息
     * 内容为空的不处理
     * @param dto 基础信息 key-value
     * @param baseDto 需要添加的基本数据
     * @param type 添加的类型
     * @return
     */
    @SuppressWarnings("unchecked")
    private List<Dto> parseObject4listinfo(Dto dto,Dto baseDto,String type){
        List<Dto> list = new ArrayList<Dto>();
        for(Object obj : dto.entrySet()){
            Entry<String,String> entry = (Entry<String,String>)obj;
            String name = entry.getKey();
            String value = entry.getValue();
            if(G4Utils.isEmpty(value)){
                continue;
            }
            Dto beanDto = new BaseDto();
            beanDto.put("param", name);
            beanDto.put("data", value);
            beanDto.put("type", type);
            beanDto.putAll(baseDto);
            
            list.add(beanDto);
        }
        return list;
    }
    /**
     * 将对象集合，行转列形式
     * @param list
     * @param baseDto
     * @param key
     * @param type
     * @return
     */
    private List<Dto> parseCollection2listinfo(List<Dto> list,Dto baseDto,String key,String type){
        List<Dto> resultList = new ArrayList<Dto>();
        for(Dto beanDto : list){
            String value = beanDto.getAsString(key);
            if(G4Utils.isEmpty(value)){
                continue;
            }
            Dto dbDto = new BaseDto();
            dbDto.put("param", key);
            dbDto.put("data", value);
            dbDto.put("type", type);
            dbDto.putAll(baseDto);
            resultList.add(dbDto);
        }
        return resultList;
    }
    
    /**
     * 获取序号
     * @return
     */
    private String getNextOrderReportSeq(){
        synchronized (this) {
            Object obj = g4Reader.queryForObject("querySeqNo4OrderReport");
            String num = obj==null?"1":(Integer)obj+"";
            return num;
        }
    }
}
