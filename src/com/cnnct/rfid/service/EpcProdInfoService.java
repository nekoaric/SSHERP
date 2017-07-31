package com.cnnct.rfid.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;


/**
 * RFID电子标签业务接口
 * @author lingm
 * @since 2013-05-09
 */
public interface EpcProdInfoService extends BaseService {
	
	/**
	 * 查询服装产品信息
	 * @param pDto
	 * @return
	 */
	public Dto queryProdBasInfo(Dto pDto);
	public Dto queryProdBasDetailInfo(Dto pDto);
	public Dto queryProdBasBaseInfo(Dto pDto);
	public Dto queryProdBaseInfo(Dto pDto);
	/**
	 * 保存电子标签数据
	 * @param pDto
	 * @return
	 */
	public Dto saveProdBasInfo(Dto pDto);

	/**
	 * 更新标签状态（解绑）
	 * @param pDto
	 * @return
	 */
	public Dto updateProdEpcInfo(Dto pDto);

	public Dto queryProdDetailInfo(Dto pDto);

	public Dto queryProdDetailInfoByProdOrd(Dto pDto);
	/**
	 * 导出产品动向信息
	 * @param pDto 传入的信息
	 * @return
	 */
	public Dto prodStateExport(Dto pDto);
}
