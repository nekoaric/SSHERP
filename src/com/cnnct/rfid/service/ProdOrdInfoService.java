package com.cnnct.rfid.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

public interface ProdOrdInfoService extends BaseService {
	
	/**
	 * 查询生产通知单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto queryProdOrdInfo(Dto inDto) throws ApplicationException;
	

	/**
	 * 查询产品信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto queryProdBasInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 查询产品信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto queryProdInsInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 查询产品信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto queryProdOrdBasInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 增加生产通知单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto addProdOrdDef(Dto inDto) throws ApplicationException;
	
	
	
	/**
	 * 修改生产通知单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto updateProdOrdInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 删除生产通知单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto deleteProdOrdInfo(Dto inDto) throws ApplicationException;
	/**
	 * 删除产品的所有数据：基础信息和动态流程数据
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto deleteAllInfo4ProdOrd(Dto inDto) throws ApplicationException;
	
	/**
	 * 增加产品信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto addProdBasDef(Dto inDto) throws ApplicationException;
	
	
	/**
	 * 删除产品信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto deleteProdBasDef(Dto inDto) throws ApplicationException;
	
	/**
	 * 文件上传信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto updateFileInfo(Dto inDto) throws ApplicationException;

    /**
     *获取产品基本信息下拉框
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public Dto getProdBasInfoCombo(Dto inDto) throws ApplicationException;
    /**
     * 导出订单计划通知单
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto prodPlanExceport(Dto pDto) throws ApplicationException;
    /**
     * 保存我的订单
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto saveMyOrder(Dto pDto) throws ApplicationException;

    /**
     * 更新订单数量修改的备注信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
	public Dto updateNumeditRemark(Dto inDto) throws ApplicationException;

	public void logProdDelete(Dto inDto) ;
}
