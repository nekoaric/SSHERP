package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 资源模型业务接口
 * @author XiongChun
 * @since 2010-01-13
 */
public interface ResourceService extends BaseService{
	
	/**
	 * 查询代码表
	 * @param pDto
	 * @return
	 */
	public Dto getCodeList(Dto pDto);
	
	/**
	 * 查询全局参数表
	 * @param pDto
	 * @return
	 */
	public Dto getParamList(Dto pDto);
	
	/**
	 * 查询代码表[代码表管理]
	 * @param pDto
	 * @return
	 */
	public Dto getCodeListForManage(Dto pDto);
	
	/**
	 * 保存代码表
	 * @param pDto
	 * @return
	 */
	public Dto saveCodeItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 删除代码表
	 * @param pDto
	 * @return
	 */
	public Dto deleteCodeItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 修改代码表
	 * @param pDto
	 * @return
	 */
	public Dto updateCodeItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 菜单资源管理生成菜单树
	 * @param pDto
	 * @return
	 */
	public Dto queryMenuItems(Dto pDto);
	
	/**
	 * 菜单资源管理 - 菜单列表
	 * @param pDto
	 * @return
	 */
	public Dto queryMenuItemsForManage(Dto pDto);
	
	/**
	 * 保存菜单
	 * @param pDto
	 * @return
	 */
	public  Dto saveMenuItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 删除菜单
	 * @param pDto
	 * @return
	 */
	public Dto deleteMenuItems(Dto pDto) throws ApplicationException;
	
	/**
	 * 修改菜单
	 * @param pDto
	 * @return
	 */
	public Dto updateMenuItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 系统图标列表
	 * @param pDto
	 * @return
	 */
	public Dto queryIconsForManage(Dto pDto);
}
