package com.cnnct.sys.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 角色管理与授权业务接口
 * @author XiongChun
 * @since 2010-01-13
 */
public interface DataPermService extends BaseService{
	

    /**
     * 保存数据授权信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto saveDataRoleGrant(Dto pDto) throws  ApplicationException;

    /**
     * 删除角色人员授权信息
     * @param pDto
     * @return
     */
    public Dto delUserInfo4RoleData(Dto pDto) throws ApplicationException;

    /**
     * 保存用户数据授权信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto saveDataUserGrant(Dto pDto) throws  ApplicationException;

    /**
     * 删除用户授权中人员信息
     * @param pDto
     * @return
     */
    public Dto delUserInfo4UserData(Dto pDto) throws ApplicationException;

}
