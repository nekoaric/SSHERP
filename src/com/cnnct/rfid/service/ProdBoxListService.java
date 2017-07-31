package com.cnnct.rfid.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;


/************************************************
 * 创建日期: 2013-05-13
 * 创建作者：lingm
 * 功能：领片记录确认 业务接口
 * 最后修改时间：
 * 修改记录：
*************************************************/
public interface ProdBoxListService extends BaseService {
	/**
	 * 查询装箱单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto queryProdBoxInfo(Dto inDto) throws ApplicationException;

	/**
	 * 增加装箱单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto addProdBoxDef(Dto inDto) throws ApplicationException;
	
	
	
	/**
	 * 修改装箱单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto updateProdBoxInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 删除装箱单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto deleteProdBoxInfo(Dto inDto) throws ApplicationException;
	public Dto deleteForEdit(Dto inDto) throws ApplicationException;
	


}
