package com.cnnct.rfid.process.prodOrd;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;
import com.cnnct.util.DataUtil;
import com.cnnct.util.ExcelUtil;
import com.cnnct.util.TimeUtil;

/**
 * 生成通知单旧版本数据获取 由excel解析到的数据，提取出来保存为业务数据的格式
 * 
 * @author zhouww
 * @since 2015-03-30
 */
public class ProdOrd2EPModelOld {

    public ProdOrd2EPModelOld() {
    };

    /**
     * 提取exlce解析的数据
     * 
     * @param list
     *            一张表解析结果数据
     * @param inDto
     *            传递的额外信息集合
     * @return
     * @throws ApplicationException
     */
    public static  Dto processData(List<List<String>> list, Dto inDto)
            throws ApplicationException {
        Dto outDto = new BaseDto();
        try {

            String version = list.get(0).get(2).trim(); // 版本信息
            String area_no = list.get(1).get(1).trim();// 区域
            String fob_deal_date = list.get(1).get(3).trim();// FOB交期
            fob_deal_date = ProdOrd2ExcelProcess.parseDateFormat(fob_deal_date);

            String check_prod_date = list.get(1).get(7).trim();// 尾查期
            check_prod_date = ProdOrd2ExcelProcess
                    .parseDateFormat(check_prod_date);

            String transportation_way = list.get(1).get(10).trim();// 出运方式
            String opr_merchandiser = list.get(1).get(14).trim();// 跟单员
            String opr_date = list.get(1).get(18).trim();// 制单日期
            opr_date = ProdOrd2ExcelProcess.parseDateFormat(opr_date);

            String opr_name = list.get(1).get(16).trim();// 制单员
            // 1.获取生产通知单号
            String prod_ord_seq = list.get(3).get(2).trim();// 第4行第3列
            // 2.获取客户信息和基本订单信息
            String contract_id = list.get(4).get(2).trim();// 合同
            String batch = list.get(5).get(2).trim();// 分单号
            String ord_seq_no = list.get(6).get(2).trim();// 订单号PO
            String cust_name = list.get(7).get(2).trim();// 客户|品牌
            String style_no = list.get(8).get(2).trim();// 款号
            String article = list.get(9).get(2).trim();// 品名
            String classify = list.get(10).get(2).trim();// 产品分类
            String wash = list.get(11).get(2).trim();// 洗水工艺
            String material = list.get(3).get(6).trim();// 面料
            String percent_j = list.get(4).get(6).trim();// 面料缩水j
            String percent_w = list.get(5).get(6).trim();// 面料缩水w
            String add_proportion = list.get(6).get(6).trim();// 加裁比例
            String allow_loss_per = "";
            // 如果是旧版通知单 修改模板 增加允许损耗 xtj 9.27
            if (add_proportion.indexOf("损耗") > -1) {
                add_proportion = list.get(6).get(5).trim();// 加裁比例
                allow_loss_per = list.get(6).get(7).trim();// 允许损耗
                // allow_loss_per=allow_loss_per.equals("")?"":DataUtil.doubleRound(Double.parseDouble(allow_loss_per),
                // 4)+"";
            } else {
                add_proportion = add_proportion.equals("") ? "" : DataUtil
                        .doubleRound(Double.parseDouble(add_proportion), 4)
                        + "";
            }
            String ribbon_color = list.get(7).get(6).trim();// 丝带色号
            String notity_date = list.get(8).get(6).trim();// 通知日期
            notity_date = ProdOrd2ExcelProcess.parseDateFormat(notity_date);

            String order_num = list.get(9).get(6).trim();// 总数
            String more_clause = list.get(10).get(6).trim();
            if (!"".equals(more_clause)) {
                more_clause = DataUtil.doubleRound(Double
                        .parseDouble(more_clause), 2)
                        + "";// 溢装
            }
            String less_clause = list.get(11).get(6).trim();
            if (!"".equals(less_clause)) {
                less_clause = DataUtil.doubleRound(Double
                        .parseDouble(less_clause), 2)
                        + "";// 短装
            }
            // 3.获取生产计划
            String sew_facName = list.get(3).get(10).trim();// 缝制工厂
            String bach_facName = list.get(5).get(10).trim();// 水洗工厂
            String pack_facName = list.get(6).get(10).trim();// 后整工厂
            String sew_start_date = list.get(3).get(14);// 缝制起始日期
            sew_start_date = ProdOrd2ExcelProcess
                    .parseDateFormat(sew_start_date);

            String sew_delivery_date = list.get(4).get(14).trim();// 缝制交货日期
            sew_delivery_date = ProdOrd2ExcelProcess
                    .parseDateFormat(sew_delivery_date);

            String bach_delivery_date = list.get(5).get(14).trim();// 水洗交货日期
            bach_delivery_date = ProdOrd2ExcelProcess
                    .parseDateFormat(bach_delivery_date);

            String pack_delivery_date = list.get(6).get(14).trim();// 后整交货日期
            pack_delivery_date = ProdOrd2ExcelProcess
                    .parseDateFormat(pack_delivery_date);

            String plan_check = list.get(8).get(10).trim();// 计划审批
            String purchase_check = list.get(9).get(10).trim();// 采购审批
            String tech_check = list.get(10).get(10).trim();// 技术审批
            String trade_check = list.get(11).get(10).trim();// 贸易审批
            String plan_check_date = list.get(8).get(14).trim();// 计划审批日期
            plan_check_date = ProdOrd2ExcelProcess
                    .parseDateFormat(plan_check_date);

            String purchase_check_date = list.get(9).get(14).trim();// 采购审批日期
            purchase_check_date = ProdOrd2ExcelProcess
                    .parseDateFormat(purchase_check_date);

            String tech_check_date = list.get(10).get(14).trim();// 技术审批日期
            tech_check_date = ProdOrd2ExcelProcess
                    .parseDateFormat(tech_check_date);

            String trade_check_date = list.get(11).get(14).trim();// 贸易审批日期
            trade_check_date = ProdOrd2ExcelProcess
                    .parseDateFormat(trade_check_date);

            String wash_stream = list.get(11).get(17).trim(); // 大货洗水流程
            // 重要提示
            String remark = "";
            for (int i = 3; i < 8; i++) {
                List<String> l = list.get(i);
                if (!"".equals(l.get(15))) {
                    remark = remark + l.get(15) + ";";
                }
            }

            // 数据包装为数据库对应的字段
            String account = inDto.getAsString("account");
            outDto.put("account", account);
            outDto.put("new_opr_date", TimeUtil.getCurrentDate());
            outDto.put("sew_facName", sew_facName);
            outDto.put("bach_facName", bach_facName);
            outDto.put("pack_facName", pack_facName);
            outDto.put("prod_ord_seq", prod_ord_seq);
            outDto.put("cust_name", cust_name);
            outDto.put("area_no", area_no);
            outDto.put("opr_date", opr_date);
            outDto.put("opr_name", opr_name);
            outDto.put("contract_id", contract_id);
            outDto.put("ord_seq_no", ord_seq_no);
            outDto.put("batch", batch);
            outDto.put("style_no", style_no);
            outDto.put("article", article);
            outDto.put("classify", classify);
            outDto.put("ribbon_color", ribbon_color);
            outDto.put("add_proportion", add_proportion);
            outDto.put("allow_loss_per", allow_loss_per);
            outDto.put("order_num", order_num);
            outDto.put("wash", wash);
            outDto.put("material", material);
            outDto.put("percent_j", percent_j);
            outDto.put("percent_w", percent_w);
            outDto.put("notity_date", notity_date);
            outDto.put("more_clause", more_clause);
            outDto.put("less_clause", less_clause);
            outDto.put("opr_merchandiser", opr_merchandiser);
            outDto.put("transportation_way", transportation_way);
            outDto.put("check_prod_date", check_prod_date);
            outDto.put("fob_deal_date", fob_deal_date);
            outDto.put("sew_start_date", sew_start_date);
            outDto.put("sew_delivery_date", sew_delivery_date);
            outDto.put("bach_delivery_date", bach_delivery_date);
            outDto.put("pack_delivery_date", pack_delivery_date);
            outDto.put("plan_check", plan_check);
            outDto.put("purchase_check", purchase_check);
            outDto.put("tech_check", tech_check);
            outDto.put("trade_check", trade_check);
            outDto.put("plan_check_date", plan_check_date);
            outDto.put("purchase_check_date", purchase_check_date);
            outDto.put("tech_check_date", tech_check_date);
            outDto.put("trade_check_date", trade_check_date);
            outDto.put("version", version); // 新增版本信息
            
            // 重要提示
            outDto.put("remark", remark);
            // 大货水洗流程
            outDto.put("wash_stream", wash_stream);

            // 设置默认的订单状态：0
            outDto.put("prodstatus", "0");
            // 4.1获取订单数量信息
            List<String> order_list = list.get(13);// 订单数量的头信息
            // 4.2获取腰围信息(头部列信息)
            String column = "";
            for (int i = 3; i < order_list.size(); i++) {
                if (!"".equals(order_list.get(i).trim())
                        && !"合计".equals(order_list.get(i).trim())) {
                    column = column + order_list.get(i) + ",";
                }
            }
            if (column.length() > 0) {
                column = column.substring(0, column.length() - 1);
            }
            outDto.put("colValue", column);

            // 4.3获取订单信息的最长长度
            int ord_index = 0;
            for (int i = 12; i < list.size(); i++) {
                List<String> l = list.get(i);
                String s = l.get(0);
                if (s.equals("小计")) {
                    ord_index = i + 1;
                    break;
                }
            }
            String order_num_cal = "";
            // 获取产品信息
            List<Dto> productList = new ArrayList<Dto>();
            Dto subTotalDto = new BaseDto();
            boolean isEndOrdNum = false;
            for (int i = 14; !isEndOrdNum; i++) {
                List<String> l = list.get(i);
                // 如果行的第一列不为小计且第1,2,3列有值
                if (!"小计".equals(l.get(0))) {
                    String country = l.get(0);// 国家
                    String color = l.get(1);// 颜色
                    String in_length = l.get(2);// 内长
                    Dto beanDto = new BaseDto();
                    beanDto.put("country", country);
                    beanDto.put("color", color);
                    beanDto.put("in_length", in_length);
                    beanDto.put("style_no", style_no);
                    beanDto.put("ord_seq_no", ord_seq_no);
                    beanDto.put("prod_ord_seq", prod_ord_seq);

                    productList = ProdOrd2ExcelProcess.parseOneRow(beanDto, l,
                            productList, order_list, "ord_num");
                } else if ("小计".equals(l.get(0))) {
                    order_num_cal = l.get(19); // 获得小计统计信息
                    isEndOrdNum = true;
                    subTotalDto = ProdOrd2ExcelProcess.parseSubTotalRow(l,
                            order_list);
                }
            }
            outDto.put("productList", productList);
            outDto.put("ord_subTotal", subTotalDto);
            // 添加小计信息
            outDto.put("order_num_cal", order_num_cal);
            // 指令数信息
            boolean isEndInsNum = false;
            Dto totalDto = new BaseDto();
            for (int i = ord_index + 2; !isEndInsNum; i++) {
                List<String> l = list.get(i);
                // 如果行的第一列不是"" 并且第3列不能为""
                if (!"小计".equals(l.get(0))) {
                    String country = l.get(0);// 国家
                    String color = l.get(1);// 颜色
                    String in_length = l.get(2);// 内长
                    Dto beanDto = new BaseDto();
                    beanDto.put("country", country);
                    beanDto.put("color", color);
                    beanDto.put("in_length", in_length);
                    beanDto.put("style_no", style_no);
                    beanDto.put("ord_seq_no", ord_seq_no);
                    beanDto.put("prod_ord_seq", prod_ord_seq);
                    productList = ProdOrd2ExcelProcess.parseOneRow(beanDto, l,
                            productList, order_list, "ins_num");
                } else if ("小计".equals(l.get(0).trim())) {
                    // 设置结束条件
                    isEndInsNum = true;
                    totalDto = ProdOrd2ExcelProcess.parseSubTotalRow(l,
                            order_list);
                }
            }
            outDto.put("ins_subTotal", totalDto);
            // 9.25
            outDto.put("grp_id", inDto.get("grp_id"));
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException("excel解析异常,请确认使用最新的模板");
        }
        return outDto;
    }

    /**
     * 独立excel sheet to outDto return : map<sheetnum,Dto>
     */
    public Dto processData(Sheet sheet) {
        Dto outDto = new BaseDto();
        return outDto;
    }

}
