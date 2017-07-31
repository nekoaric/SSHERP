package com.cnnct.rfid.web.excelParse;

import java.io.File;

import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 解析流水账信息的接口
 * @author zhouww
 * @since 2014-11-21
 */
public interface OrdDayExcelParseInf {
    
    /**
     * 解析文件 POI workBook解析 
     * @param file
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public Dto parseExcel(FormFile file,Dto inDto)throws ApplicationException;
    
    /**
     * 解析文件  POI SAX解析
     * @param file
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public Dto parseExcel(File file,Dto inDto)throws Exception;
}
