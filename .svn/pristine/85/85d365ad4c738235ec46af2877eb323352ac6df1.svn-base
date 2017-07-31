package com.cnnct.may.service;

import com.cnnct.common.ApplicationException;
import org.eredlab.g4.ccl.datastructure.Dto;

public interface OrdRecordManagerService {


    public Dto addOrdRecordInfo(Dto inDto) throws ApplicationException;

    public Dto updateOrdRecordInfo(Dto inDto) throws ApplicationException;

    public Dto deleteOrdRecordInfo(Dto inDto) throws ApplicationException;

    public Dto bindUserAndCsn(Dto inDto) throws ApplicationException;

    public Dto unbindUserAndCsn(Dto inDto) throws ApplicationException;
    /**
     * 回退业务
     * @param inDto
     * @return
     * @throws ApplicationEception
     */
    public Dto rollbackProdInfo(Dto inDto) throws ApplicationException;
    
    /**
     * 回退流水数据的修改
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public Dto rollbackChange(Dto inDto) throws ApplicationException;
    
    /**
     * 回退数据的删除
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public Dto rollbackDelete(Dto inDto) throws ApplicationException;
    
    public Dto queryProdInsInfo(Dto pDto) throws ApplicationException;
    
    public Dto queryOrdSizeInfo(Dto pDto) throws ApplicationException;
}
