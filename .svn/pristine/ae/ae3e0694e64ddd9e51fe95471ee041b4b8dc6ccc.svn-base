package com.cnnct.rfid.web.excelParse.ordDayExcelParse;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.report.excel.ExcelReader;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.web.excelParse.OrdDayExcelParseInf;

/**
 * 流水账模板<模板三>
 * 5列,出运成品的导入模板
 * !如果以后有相同的列数的其他数量性质导入模板，模板需要添加一列标识
 * @author zhouww
 * @since 2014-12-12
 */
public class OrdDayExcelThree implements OrdDayExcelParseInf{
    
    
    public Dto parseExcel(FormFile file, Dto inDto) throws ApplicationException {
        
        try {
            IReader g4Reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
            Dto outDto = new BaseDto();
            //流水账导入模板三
            String metaData = "order_id,style_no,tr_date,amount,remark";
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("[模板三]导入文件格式有误,请下载最新文件格式!");
                }
            }
            List resultList = new ArrayList();
            for(int idx=1; idx<list.size(); idx++){
                Dto dto = (Dto)list.get(idx);
                String nature = "14"; // 
                dto.put("nature", nature);
                //添加行号
                dto.put("row_num", (idx+1));
                resultList.add(dto);
            }
            outDto.setDefaultAList(resultList);
            return outDto;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    
    }

    public Dto parseExcel(File file, Dto inDto) throws Exception {
        // TODO Auto-generated method stub
        return null;
    }
    
    
}
