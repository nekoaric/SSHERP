package org.eredlab.g4.arm.service;

import org.eredlab.g4.ccl.datastructure.Dto;

/**
 * UI组件授权服务接口
 * 
 * @author XiongChun
 * @since 2011-06-25
 */
public interface PartService {
	
	/**
	 * 保存UI元素角色授权数据
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto savePartRoleGrantDatas(Dto pDto);
}
