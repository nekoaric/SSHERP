package com.cnnct.sys.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 角色管理与授权业务接口
 * @author XiongChun
 * @since 2010-01-13
 */
public interface RoleService extends BaseService{
	
	/**
	 * 角色管理 - 角色列表
	 * @param pDto
	 * @return
	 */
	public Dto queryRolesForManage(Dto pDto);
	
	/**
	 * 保存角色
	 * @param pDto
	 * @return
	 */
	public Dto saveRoleItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 删除角色
	 * @param pDto
	 * @return
	 */
	public Dto deleteRoleItems(Dto pDto) throws ApplicationException;
	
	/**
	 * 修改角色
	 * @param pDto
	 * @return
	 */
	public Dto updateRoleItem(Dto pDto) throws ApplicationException;
	
	/**
	 * 保存角色授权信息
	 * @param pDto
	 * @return
	 */
	public Dto saveRoleMenuGrant(Dto pDto) throws ApplicationException;
	
	/**
	 * 保存角色用户关联信息
	 * @param pDto
	 * @return
	 */
	public Dto saveSelectUser(Dto pDto) throws ApplicationException;

    /**
     * 菜单授权树初始化
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto menuGrantTreeInit(Dto pDto) throws ApplicationException;
}
