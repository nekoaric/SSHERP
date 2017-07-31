package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 组织机构模型模型业务接口
 * @author XiongChun
 * @since 2010-01-13
 */
public interface OrganizationService extends BaseService{
	
	/**
	 * 获取用户信息
	 * @param pDto
	 * @return
	 */
	public Dto getUserInfo(Dto pDto);
	
	/**
	 * 查询部门信息生成部门树
	 * @param pDto
	 * @return
	 */
	public Dto queryDeptItems(Dto pDto);
	
	/**
	 * 部门管理 - 部门列表
	 * @param pDto
	 * @return
	 */
	public Dto queryDeptsForManage(Dto pDto);
	
	/**
	 * 保存部门
	 * @param pDto
	 * @return
	 */
	public Dto saveDeptItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 修改部门
	 * @param pDto
	 * @return
	 */
	public Dto updateDeptItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 删除部门
	 * @param pDto
	 * @return
	 */
	public Dto deleteDeptItems(Dto pDto) throws ApplicationException;
	
	/**
	 * 根据用户所属部门编号查询部门对象<br>
	 * 用于构造组织机构树的根节点
	 * @param
	 * @return
	 */
	public Dto queryDeptinfoByDeptid(Dto pDto);
	
	/**
	 * 保存用户主题信息
	 * @param pDto
	 */
	public Dto saveUserTheme(Dto pDto) throws ApplicationException;

	/**
	 * 保存用户主题信息
	 * @param pDto
	 */
	public Dto saveUserLayout(Dto pDto) throws ApplicationException;
}
