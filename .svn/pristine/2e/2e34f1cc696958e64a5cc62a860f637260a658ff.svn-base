package org.eredlab.g4.arm.service;

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
public interface UserService extends BaseService {
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
	 * 删除用户
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto deleteUserItems(Dto pDto) throws ApplicationException;

	/**
	 * 修改用户
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto updateUserItem(Dto pDto) throws ApplicationException;

	/**
	 * 保存人员角色关联信息
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto saveSelectedRole(Dto pDto) throws ApplicationException;

	/**
	 * 保存人员菜单关联信息
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto saveSelectedMenu(Dto pDto) throws ApplicationException;
	
	/**
     * 修改用户(提供首页修改使用)
     * 
     * @param pDto
     * @return
     */
    public Dto updateUserItem4IndexPage(Dto pDto) throws ApplicationException;
    
    /**
     * 发送密码
     * 
     * @param pDto
     * @return
     */
    public Dto sendPwd(Dto pDto) throws ApplicationException;
    
    /**
     * 保存人员权限授权信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto saveEaUserAuthorize(Dto pDto) throws  ApplicationException;

    /**
     * 删除人员权限授权信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto delEaUserAuthorize(Dto pDto) throws  ApplicationException;

}
