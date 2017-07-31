package com.cnnct.rfid.web.excelParse;

import java.io.File;
import java.util.List;

import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;
import com.cnnct.dataInterface.ValideDataAdapter;
import com.cnnct.rfid.process.ordDaylist.OrdDayListProcess;
import com.cnnct.rfid.valide.ordDaylist.OrdDayListValide;
import com.cnnct.rfid.web.excelParse.ordDayExcelParse.OrdDayExcelFour;
import com.cnnct.rfid.web.excelParse.ordDayExcelParse.OrdDayExcelOne;
import com.cnnct.rfid.web.excelParse.ordDayExcelParse.OrdDayExcelThree;
import com.cnnct.rfid.web.excelParse.ordDayExcelParse.OrdDayExcelTwo;
import com.cnnct.util.ExcelUtil;
import com.cnnct.util.FileUtil;

/**
 * 解析订单流水信息工厂
 * 
 * 简单工厂模式和策略模式
 * <br>将文件解析，结果分析过滤，数据验证作为独立功能实现
 * <br>避免出现过多的功能在一个方法中实现
 * @author zhouww
 * @since 2014-11-21
 */
public class OrdDayExcelParseFactory{
    
    public Dto parseExcel(FormFile file,Dto inDto)throws ApplicationException{
        //解析文件列头(第一行)
        //得到对应的文件解析策略
        //解析文件
        //返回解析结果
        File saveFile = null;
        try {
            IReader iReader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
            // 保存上传的流信息， 在操作结束后删除文件
            saveFile = FileUtil.parseIS2File(file.getInputStream());
            Dto titleDto =  new ExcelUtil().parseExcel4Row(saveFile, 1);
            List<String> titleList = titleDto.getDefaultAList();
            // 获取解析文件模板
            int titleListSize= titleList.size(); 
            
            // 解析文件
            OrdDayExcelParseInf parseExcel = null;
            Dto parseDto = new BaseDto();
            switch(titleListSize){
                case 19 :   //19行的为模板一
                    parseExcel = new OrdDayExcelOne();  //此处考虑使用spring容器管理对象
                    parseDto = parseExcel.parseExcel(file,inDto);
                    break;
                case 24 :   //26行列头的为模板二
                    parseExcel = new OrdDayExcelTwo();
                    parseDto = parseExcel.parseExcel(file,inDto);
                    break;
                case 5 :    // 5列 为模板三
                    parseExcel = new OrdDayExcelThree();
                    parseDto = parseExcel.parseExcel(file,inDto);
                    break;
                case 4 :    // 4列模板四
                    parseExcel = new OrdDayExcelFour(); 
                    parseDto = parseExcel.parseExcel(saveFile,inDto);
                    break;
                default : 
                    throw new ApplicationException("不能读取这个文件，请下载标准模板文件");
            }
            if(parseExcel != null) {
                // 过滤及处理解析后数据
                ProcessDataAdapter pda = new OrdDayListProcess();
                pda.setInDto(parseDto);
                pda.setiReader(iReader);
                parseDto = pda.processData();
                
                // 验证过滤后的数据
                ValideDataAdapter vda = new OrdDayListValide();
                vda.setInDto(parseDto);
                vda.setiReader(iReader);
                vda.valideDate();
                return parseDto;
            }
        }catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException(e);
        }finally{
            if (saveFile!=null && saveFile.exists()) {
                saveFile.delete();
            }
        }
        return null;
    }
}
