package com.cnnct.rfid.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrderReportService;
/**
 * 完单报告业务
 * @author zhouww
 * @since 2014-08-26
 */
public class OrderReportServiceImpl extends BaseServiceImpl implements OrderReportService{

      /**
       * 新增
       */
      public Dto addOrdReport(Dto inDto) throws ApplicationException {
            Dto baseinfo = (Dto)inDto.get("baseInfo");
            List<Dto> listinfo = (List<Dto>)inDto.get("listInfo");
            g4Dao.insert("insertOrdReportInfo4baesinfo", baseinfo);
            g4Dao.batchInsertBaseDto("insertOrdReportInfo4listinfo", listinfo);
            return null;
      }
      /**
       * 删除
       */
      public Dto delOrdReport(Dto inDto) throws ApplicationException {
            Dto outDto = new BaseDto();
            String ord_report_no = inDto.getAsString("ord_report_no");
            String account = inDto.getAsString("account");
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", ord_report_no);
            dbDto.put("type","2");
            // 不是订单生成者不能删除
            // 有不是本人确认的不能删除
            Object obj = g4Dao.queryForObject("queryOrdReportInfo4baseinfo", dbDto);
            List<Dto> sureOprList = g4Dao.queryForList("querySureOpr4ordReport",dbDto);
            if(obj==null){
                  outDto.put("success", false);
                  outDto.put("msg", "不存在此完单报告号");
                  return outDto;
            }
            Dto ordReportDto = (Dto)obj;
            String openOpr = ordReportDto.getAsString("open_id");
            if(!openOpr.equals(account)){
                  outDto.put("success", false);
                  outDto.put("msg", "不是创建人不能删除");
                  return outDto;
            }
            for(Dto dtoBean : sureOprList){
                  String opr_id = dtoBean.getAsString("opr_id");
                  if(!opr_id.equals(account)){
                        outDto.put("success", false);
                        outDto.put("msg","有其他人确认信息，不能删除");
                        return outDto;
                  }
            }

            g4Dao.delete("deleteOrdReport", inDto);
            outDto.put("success", true);
            outDto.put("msg", "删除成功");
            return outDto;
      }
      /**
       * 修改
       */
      public Dto updateOrdReport(Dto inDto) throws ApplicationException {
            String ord_report_no = inDto.getAsString("ord_report_no");
            String account = inDto.getAsString("account");
            Dto baseinfo = (Dto)inDto.get("baseInfo");
            List<Dto> listinfo = (List<Dto>)inDto.get("listInfo");
            
            //先删除现有的数据然后插入新数据
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", ord_report_no);
            dbDto.put("account", account);
            
            // 查询开单人员
            Object obj = g4Dao.queryForObject("queryOrdReportInfo4baseinfo", dbDto);
            if(obj==null){
                  throw new ApplicationException("不存在此完单报告");
            }
            Dto oldDto = (Dto)obj;
            String open_id = oldDto.getAsString("open_id");
            String open_time = oldDto.getAsString("open_time");
            baseinfo.put("open_id", open_id);      //修改开单人员
            baseinfo.put("open_time", open_time);
            g4Dao.update("delStatement4ordReportNo",dbDto);      //删除旧数据
            // 删除修改的数量信息
            
            //添加新数据
            g4Dao.insert("insertOrdReportInfo4baesinfo", baseinfo);
            g4Dao.batchInsertBaseDto("insertOrdReportInfo4listinfo", listinfo);
            return null;
      }
      /**
       * 查询完单报告信息
       */
      public Dto queryOrdReport(Dto inDto) throws ApplicationException {
            Dto outDto = new BaseDto();
            String ord_report_no = inDto.getAsString("ord_report_no");
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", ord_report_no);
            //1 完单报告的基本信息
            Dto baseInfo = new BaseDto();
            Object obj = g4Dao.queryForObject("queryOrdReportInfo4baseinfo", dbDto);
            if(obj==null){
                  throw new ApplicationException("没有完单报告号");
            }else {
                  baseInfo = (Dto)obj;
            }
            //2 完单报告的数量信息
            Dto numInfo = queryOrderReport4numInfo(ord_report_no);
            //3 确认信息
            Dto sureDto = queryOrderReport4suerOpr(ord_report_no);
            //4 备注
            Dto remarkDto = queryOrderReport4remark(ord_report_no);
            //5 查询PO号
            List<Dto> poList = queryOrderReport4PO(ord_report_no);
            //6 查询工厂      讨论后怎么处理
            
            // 7 责任工厂
            Dto dutyfac = queryOrderReport4dutyfac(ord_report_no);
            // 8 责任工厂名字
            Dto dutyfacname = queryOrderReport4dutyfacname(ord_report_no);
            // 9 责任数量
            Dto dutynum = queryOrderReport4dutynum(ord_report_no);
            
            outDto.put("ord_report_no", ord_report_no);
            outDto.put("baseinfo", baseInfo);
            outDto.put("remark", remarkDto);
            outDto.put("sureinfo",sureDto);
            outDto.put("numinfo", numInfo);
            outDto.put("orderinfo", poList);
            outDto.put("dutyfac", dutyfac);
            outDto.put("dutyfacname", dutyfacname);
            outDto.put("dutynum", dutynum);
            return outDto;
      }
      /**
       * 查询seq_no完单报告的数量信息
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4numInfo(String seq_no){
            Dto dto = new BaseDto();
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", seq_no);
            dbDto.put("type", "1");
            List<Dto> resultList = g4Dao.queryForList("queryOrderReport4detailInfo", dbDto);
            for(Dto bean : resultList){
                  String name = bean.getAsString("param");
                  String value = bean.getAsString("data");
                  dto.put(name, value);
            }
            return dto;
      }
      /**
       * 查询seq_no完单报告的确认人
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4suerOpr(String seq_no){
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", seq_no);
            dbDto.put("type", "2");
            return queryOrderReportList(dbDto);
      }
      /**
       * 查询完单报告附加信息表
       * 按照param分类处理
       * @param dbDto
       * @return
       */
      private Dto queryOrderReportList(Dto dbDto){
            Dto dto = new BaseDto();
            List<Dto> resultList = g4Dao.queryForList("queryOrderReport4detailInfo", dbDto);
            for(Dto bean : resultList){
                  String name = bean.getAsString("param");
                  Object obj = dto.get(name);
                  List<Dto> list;
                  list = obj==null?new ArrayList<Dto>():(List<Dto>)obj;
                  bean.put(name, bean.getAsString("data"));      // 将行数据转为列数据
                  list.add(bean);
                  dto.put(name, list);      //已经存在就覆盖，没有则新增
            }
            return dto;
      }

      
      /**
       * 查询工厂
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4factory(String seq_no){
            return null;
      }
      /**
       * 查询seq_no完单报告的备注
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4remark(String seq_no){
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", seq_no);
            dbDto.put("type", "3");
            return queryOrderReportList(dbDto);
      }
      /**
       * 查询PO号
       * @param seq_no
       * @return
       */
      private List<Dto> queryOrderReport4PO(String seq_no){
            Dto dbDto = new BaseDto();
            dbDto.put("ord_report_no", seq_no);
            List<Dto> resultList = g4Dao.queryForList("queryOrdReportInfo4PO", dbDto);
            return resultList;
      }
      /**
       * 查询责任工厂
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4dutyfac(String seq_no){
          Dto dbDto = new BaseDto();
          dbDto.put("ord_report_no", seq_no);
          dbDto.put("type", "6");
          return queryOrderReportList(dbDto);
      }
      /**
       * 查询责任工厂名字
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4dutyfacname(String seq_no){
          Dto dbDto = new BaseDto();
          dbDto.put("ord_report_no", seq_no);
          dbDto.put("type", "7");
          return queryOrderReportList(dbDto);
      }
      /**
       * 查询责任数量
       * @param seq_no
       * @return
       */
      private Dto queryOrderReport4dutynum(String seq_no){
          Dto dbDto = new BaseDto();
          dbDto.put("ord_report_no", seq_no);
          dbDto.put("type", "8");
          return queryOrderReportList(dbDto);
      }
      
}
