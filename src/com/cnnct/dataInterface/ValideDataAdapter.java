package com.cnnct.dataInterface;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;


/**
 * 数据校验的适应类
 * @author zhouww
 *
 */
public abstract class ValideDataAdapter implements ValideData{
    public ValideData vd = null;    
    public IDao dao = null; //数据库操作
    public IReader iReader = null;  //数据库操作，只能查询
    public Dto inDto = null;
    
    
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

    public ValideData getVd() {
        return vd;
    }

    public void setVd(ValideData vd) {
        this.vd = vd;
    }
    
}
