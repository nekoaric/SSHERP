package com.cnnct.rfid.service;

import com.cnnct.common.ApplicationException;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/**
 * *********************************************
 * 创建日期: 2013-05-12
 * 创建作者：may
 * 功能：订单进度查询
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public interface OrdScheInfoService extends BaseService {

    public Dto getOrdScheList(Dto pDto) throws ApplicationException;

    public Dto getOrdSchePerCent(Dto pDto) throws ApplicationException;

    public Dto getOrdDaySche(Dto pDto) throws ApplicationException;

    public Dto getOrdShortInfo(Dto pDto) throws ApplicationException;

    public Dto getOrdScheListView(Dto pDto) throws ApplicationException;

    public Dto getOrdSchePerCentView(Dto pDto) throws ApplicationException;

    public Dto getOrdDayScheView(Dto pDto) throws ApplicationException;

    public Dto getOrdShortInfoView(Dto pDto) throws ApplicationException;

    public Dto getDetailShortInfo(Dto pDto) throws ApplicationException;
    /**
     * 多订单日进度查询
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getOrdDayScheMulti(Dto pDto) throws ApplicationException;
    /**
     * 多订单日进度导出
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto prodDayScheExceport(Dto pDto) throws ApplicationException;
    /**
     * 查询产品的短缺图信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getProdShortInfo(Dto pDto)throws ApplicationException;
    /**
     * 导出短缺详情
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto exportOrdShortInfo(Dto pDto) throws ApplicationException;
    /**
     * 获取工厂<br/>
     * 传入superFactory的父工厂名字
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getFactoryBySuperFacotry(Dto pDto) throws ApplicationException;
}
