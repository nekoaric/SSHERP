package com.cnnct.rfid.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;


/************************************************
 * 创建日期: 2013-05-13
 * 创建作者：lingm
 * 功能：领片记录确认 业务接口
 * 最后修改时间：
 * 修改记录：
*************************************************/
public interface ProdSureListService extends BaseService {
	
	/**
	 * 根据productid查询服装信息
	 * @param pDto
	 * @return
	 */
	public Dto queryProdInfoById(Dto pDto);
	/**
	 * 根据productid查询已经领片确认信息
	 * @param pDto
	 * @return
	 */
	public Dto queryProdSureInfoById(Dto pDto);
	/**
	 * 领片记录保存
	 * @param pDto
	 * @return
	 */
	public Dto saveProdSureInfo(Dto pDto);
	
	
	public Dto queryProdBasBaseInfo(Dto pDto);
	/**
	 * 保存电子标签数据
	 * @param pDto
	 * @return
	 */
	
	/**
	 * 更新标签状态（解绑）
	 * @param pDto
	 * @return
	 */
	public Dto updateProdEpcInfo(Dto pDto);


}
