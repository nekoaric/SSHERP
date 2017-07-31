package com.cnnct.rfid.web.excelParse.ordDayExcelParse;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.report.excel.ExcelReader;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.web.excelParse.OrdDayExcelParseInf;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * 模板一
 * 列中选择数量性质
 * @author zhouww
 * @since 2014-11-21
 */
public class OrdDayExcelOne implements OrdDayExcelParseInf{

    public Dto parseExcel(FormFile file,Dto inDto) throws ApplicationException {
        try {
            IReader g4Reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
            Dto outDto = new BaseDto();
            //流水账导入模板一
            String metaData = "sequence_number,tr_date,tr_time,grp_name,dept_name,team_name,cust_name,order_id," +
                    "style_no,article,color,mark,nature_name,amount,billno,submit_name,sure_name,driver,remark";
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("[模板一]导入文件格式有误,请下载最新文件格式!");
                }
            }
            List resultList = new ArrayList();
            for(int idx=1; idx<list.size(); idx++){
                Dto dto = (Dto)list.get(idx);
                String nature = NatureUtil.parseNatureZh2natureCode(dto.getAsString("nature_name")); // 添加数量性质的方式不同
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
