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
 * 解析传入的excel数据
 * @author zhouww
 */
public class ProdOrd2ExcelProcess extends ProcessDataAdapter {
    
    public ProdOrd2ExcelProcess(){};
    
    public ProdOrd2ExcelProcess(Dto inDto,IReader iReader,InputStream is){
        super();
        this.inDto = inDto;
        this.iReader = iReader;
        this.is = is;
    }
    
    
    public Dto processData() throws ApplicationException {
        Dto outDto2 = new BaseDto();
        if(is==null){
            //既然没有数据流，那就返回没有数据的结果
            return outDto2;
        }
        try{
            //返回一个sheet的集合
            List<List> sheetList= ExcelUtil.readByPoi2(is);
            for(int j=0;j<sheetList.size();j++){
                Dto outDto=new BaseDto();
                List<List<String>> list = sheetList.get(j);
                
                // 新创建额外数据集合，为防止相同对象引用修改
                Dto curDto = new BaseDto();
                curDto.putAll(inDto);
                
                //TODO 改进，这两个版本的基础信息解析不同，但是数量的统计是相同的
                // 所以可以把相同的代码提取出来
                String prodOrdVersion = list.get(0).get(2).trim(); // 生产通知单版本信息
                if("150324".equals(prodOrdVersion)){
                    // 20150324确定的模板，新增各个损耗数据
                    outDto = ProdOrd2EPMode150324.extractData(list, curDto);
                }else { // 其他的情况采用旧模板
                    outDto = ProdOrd2EPModelOld.processData(list, curDto);
                }
                outDto.getAsInteger("fzyxsh");
                outDto2.put(j, outDto);
            }
        }catch(Exception e){
            e.printStackTrace();
            throw new ApplicationException("excel解析异常,请确认使用最新的模板");
        }
        return outDto2;
    }
    
    /**
     * 独立excel sheet to outDto
     * return : map<sheetnum,Dto>
     */
    public Dto processData(Sheet sheet){
        Dto outDto= new BaseDto();
        return outDto;
    }
    /**
     * 处理小计的列</br> 处理的数据里包含了 总计的信息<腰围,小计>，<total,合计>
     * 
     * @param l
     *            小计的列
     * @param order_list
     *            腰围信息
     * @return
     */
    public static Dto parseSubTotalRow(List<String> l, List order_list) {
        Dto outDto = new BaseDto();
        int size = order_list.size();
        for (int i = 3; i < size; i++) {
            String wait = (String) order_list.get(i);
            if ("合计".equals(wait)) {
                outDto.put("total", DataUtil.StringToDoubleByRound(l.get(i)));
                continue;
            }
            if (!"".equals(wait)) {
                outDto.put(wait, DataUtil.StringToDoubleByRound(l.get(i)
                        .equals("") ? "0" : l.get(i)));
            }
        }
        return outDto;
    }

    /**
     * 处理单行数据</br> 处理非空和不是合计的列的腰围信息
     * 
     * @param beanDto
     *            产品的基础信息
     * @param l
     *            单行数据
     * @param productList
     *            结果产品
     * @param order_list
     *            产品信息
     * @return
     */
    public static List<Dto> parseOneRow(Dto beanDto, List<String> l,
            List<Dto> productList, List order_list, String numtype) {
        String color = beanDto.getAsString("color");
        String in_length = beanDto.getAsString("in_length");
        String country = beanDto.getAsString("country");
        String style_no = beanDto.getAsString("style_no");
        String ord_seq_no = beanDto.getAsString("ord_seq_no");
        String prod_ord_seq = beanDto.getAsString("prod_ord_seq");
        for (int j = 3; j < order_list.size(); j++) {
            // 腰围不为空的才是一个产品
            if (!"".equals(order_list.get(j))
                    && !"合计".equals(order_list.get(j))) {
                if ("".equals(l.get(j)) || "0".equals(l.get(j))) {// 如果当前产品数量为空或0
                    continue;
                }
                String str = DataUtil.StringToDoubleByRound(l.get(j)) + "";
                boolean isRepetition = false;
                // 判断是否数据重复
                for (Dto productDto : productList) {
                    if (productDto.getAsString("color").equals(color)
                            && productDto.getAsString("in_length").equals(
                                    in_length)
                            && productDto.getAsString("country")
                                    .equals(country)
                            && productDto.getAsString("waist").equals(
                                    order_list.get(j))) {
                        Long num = productDto.getAsLong((numtype));
                        productDto.put(numtype, (num == null ? 0 : num)
                                + Long.parseLong(str));
                        isRepetition = true;
                        break;
                    }
                }
                // 如果数据没有重复的话 加入一个新的产品信息
                if (!isRepetition) {
                    Dto productDto = new BaseDto();
                    productDto.put("style_no", style_no);
                    productDto.put("country", country);
                    productDto.put("color", color);
                    productDto.put("in_length", in_length);
                    productDto.put("waist", order_list.get(j));
                    productDto.put(numtype, str); // 取消默认为订单数，根据传入的参数进行保存
                    productDto.put("ord_seq_no", ord_seq_no);
                    productDto.put("prod_ord_seq", prod_ord_seq);
                    productList.add(productDto);
                }
            }
        }
        return productList;
    }

    /**
     * 将解析的日期转化为能导入的数据</br>
     * 
     * @param date
     *            日期 格式YYYYMMDD
     * @return 格式YYYY-MM-DD
     */
    public static String parseDateFormat(String date) {
        String result = "";
        if ("".equals(date) || date.length() < 8) {
            return result;
        }
        result = date.substring(0, 4) + '-' + date.substring(4, 6) + '-'
                + date.substring(6, 8);
        return result;
    }
    //~~SET ADN GET
    public InputStream getIs() {
        return is;
    }
    public void setIs(InputStream is) {
        this.is = is;
    }
    

}
