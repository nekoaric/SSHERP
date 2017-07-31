package com.cnnct.rfid.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

public interface ManageQCService extends BaseService {
	/**
	 * 查询browser页面信息
	 * @param pDto
	 * @return Dto
	 */
	public Dto queryQCProcess(Dto pDto);
	/**
	 * 查询流水记录信息
	 * @param pDto
	 * @return Dto
	 */
	public Dto queryQCScheList(Dto pDto);
	/**
	 * 保存qc基本信息
	 * @param dto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto saveQCprocess(Dto dto) throws ApplicationException;
	/**
	 * 页面新增qc基本信息
	 * @param dto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto saveQCItemFromB(Dto dto) throws ApplicationException;
	
	public Dto updateQCprocess(Dto dto) throws ApplicationException;

	public Dto deleteQCprocess(Dto dto) throws ApplicationException;
	
	public Dto getQCInfoByDto(Dto dto) throws ApplicationException;
	
	public Dto getPItemByDto(Dto dto) throws ApplicationException;
	
	/**
	 * 保存检查项信息
	 * @param qcItemDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto saveQCItem(Dto qcItemDto) throws ApplicationException;
	
	/**
	 * 保存QC信息
	 * @param inDto
	 * @throws ApplicationException
	 */
	public void saveQCNumInfo(Dto inDto) throws ApplicationException;
	/**
	 * 删除QC信息
	 * @param inDto
	 * @throws ApplicationException
	 */
	public void deleteQCNumInfo(Dto inDto)throws ApplicationException;
	/**
	 * 查询qc饼图
	 * @param inDto
	 * @throws ApplicationException
	 */
	public Dto getQCPieByOrderId(Dto inDto)throws ApplicationException;
	
}
