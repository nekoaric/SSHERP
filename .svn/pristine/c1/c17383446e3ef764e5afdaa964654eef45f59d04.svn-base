package com.cnnct.rfid.web.excelParse.ordDayExcelParse;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.junit.Test;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.web.excelParse.OrdDayExcelParseInf;
import com.cnnct.util.NatureUtil;
import com.cnnct.util.excel2007.ParseExcel2007Util;

/**
 * 流水模板二
 * 数量性质作为列头
 * @author zhouww
 * @since 2014-11-21
 */
public class OrdDayExcelTwo implements OrdDayExcelParseInf{

  //流水帐模板二
    private String metaData = "tr_date,grp_name,cust_name,order_id,style_no," +
            "article,mark,real_cut_num,sew_num,sew_delivery_num,bach_accept_num,bach_delivery_num," +
            "pack_accept_num,f_product_num,b_product_num,receive_f_product,receive_b_product," +
            "sendout_f_product,sendout_b_product,middle_take,remark,opr_name," +
            "day_count,total_count";
    // 日期列标识  用于SAX解析结果日期处理， 如果将来在SAX解析过程中处理日期 ，此参数可以省略s
    private String[] dateCol = {"tr_date"};
    
    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    private Calendar calendar = Calendar.getInstance();
    @SuppressWarnings("unchecked")
    public Dto parseExcel(FormFile file,Dto inDto) throws ApplicationException {
        try {
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("[模板二]导入文件格式有误,请下载最新文件格式!");
                }
            }
            return parseQueryData(list);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * 文件作为解析参数传入
     */
    public Dto parseExcel(File file, Dto inDto) throws Exception {
        // TODO 未支持此解析方式
        return null;
    }
    
    private String parseNum2Date(int dateNum){
        calendar.set(1900, 0, 1);
        calendar.add(Calendar.DAY_OF_YEAR, dateNum);
        String  dateStr = sdf.format(calendar.getTime());
        return dateStr;
    }
    /**
     * 解析查询到的数据
     * @param list
     * @return
     */
    private Dto parseQueryData(List list){
        try {
            IReader g4Reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
            Dto outDto = new BaseDto();
            String[] baseColumn  = new String[]{"tr_date","grp_name","cust_name","order_id","style_no","article",
                    "mark","remark,opr_name","day_count","total_count"};  // 常规列
            // 将行转列数据为所有的数量性质
            List ordDayList = new ArrayList();
            List<String> natureNum = NatureUtil.getNatureCode();
            for (int i = 1; i < list.size(); i++) {
                Dto dto = (Dto) list.get(i);
                // 遍历数量性质
                for(String beanStr : natureNum){
                    String nature = NatureUtil.parseNC2natureEn(beanStr);
                    String value = dto.getAsString(nature);
                    if("".equals(value.trim())){    //如果此数量性质没有数量则跳出此次处理
                        continue;   
                    }
                    Dto beanDto = new BaseDto();
                    
                    //  为每个dto添加常规列
                    for(String baseStr : baseColumn){
                        beanDto.put(baseStr, dto.get(baseStr));
                    }
                    beanDto.put("nature",beanStr);
                    beanDto.put("amount", value);
                    //添加行号
                    beanDto.put("orw_num", (i+1));
                    ordDayList.add(beanDto);
                }
            }
            outDto.setDefaultAList(ordDayList);
            return outDto;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
}













