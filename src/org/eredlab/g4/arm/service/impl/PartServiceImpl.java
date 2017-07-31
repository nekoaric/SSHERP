package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.PartService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import java.util.List;

/**
 * UI组件授权服务实现
 * 
 * @author XiongChun
 * @since 2011-06-25
 */
public class PartServiceImpl extends BaseServiceImpl implements PartService {
	
	/**
	 * 保存UI元素角色授权数据
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto savePartRoleGrantDatas(Dto pDto){
		List list = pDto.getDefaultAList();
		for (int i = 0; i < list.size(); i++) {
			Dto lDto = (BaseDto)list.get(i);

			g4Dao.insert("insertEarolemenupartItem", lDto);

		}
		return null;
	}
}
