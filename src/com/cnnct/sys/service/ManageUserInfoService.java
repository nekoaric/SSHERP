package com.cnnct.sys.service;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 用户管理与授权业务接口
 * 
 * @author XiongChun
 * @since 2010-01-13
 */
public interface ManageUserInfoService extends BaseService {
	/**
	 * 用户管理 - 用户列表
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto queryUsersForManage(Dto pDto);

	/**
	 * 保存用户
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto saveUserItem(Dto pDto) throws ApplicationException;

	/**
	 * 修改用户
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto updateUserItem(Dto pDto) throws ApplicationException;

    /**
     * 删除人员权限授权信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto delSysUserRoleMap(Dto pDto) throws  ApplicationException;


}
