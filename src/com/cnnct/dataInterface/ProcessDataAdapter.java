package com.cnnct.dataInterface;

import java.io.InputStream;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;


/**
 * 数据处理接口的适应类
 * @author zhouww
 *
 */
public abstract class ProcessDataAdapter implements ProcessData{
    public ProcessData pd = null;
    public IDao dao = null; //数据库操作
    public IReader iReader = null;  //数据库操作，只能够查询
    public Dto inDto = null;
    public InputStream is = null;  //数据流
    
    //~~SET ADN GET
    public Dto getInDto() {
        return inDto;
    }

    public void setInDto(Dto inDto) {
        this.inDto = inDto;
    }

    public IDao getDao() {
        return dao;
    }

    public void setDao(IDao dao) {
        this.dao = dao;
    }

    public IReader getiReader() {
        return iReader;
    }

    public void setiReader(IReader iReader) {
        this.iReader = iReader;
    }

    public ProcessData getPd() {
        return pd;
    }

    public void setPd(ProcessData pd) {
        this.pd = pd;
    }

    public InputStream getIs() {
        return is;
    }

    public void setIs(InputStream is) {
        this.is = is;
    }
    
}
