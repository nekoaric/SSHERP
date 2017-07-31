package com.cnnct.sys.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.arm.service.DutyService;
import com.cnnct.util.ArmConstants;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.sys.service.SysUserInfoService;

/**
 * 用户管理与授权业务实现类
 *
 * @author XiongChun
 * @since 2010-04-13
 */
@SuppressWarnings({"unchecked", "rawtypes"})
public class SysUserInfoServiceImpl extends BaseServiceImpl implements SysUserInfoService {

    private SysDeptInfoService sysDeptService;
    private DutyService dutyService;

    /**
     * 用户管理 - 用户列表
     *
     * @param pDto
     * @return
     */
    public Dto queryUsersForManage(Dto pDto) {
        Dto outDto = new BaseDto();
        List userList = g4Dao.queryForPage("querySysUsersForManage", pDto);
        Integer pageCount = g4Dao.queryForPageCount("querySysUsersForManage", pDto);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(userList, pageCount, "yyyy-MM-dd"));
        return outDto;
    }

    /**
     * 保存用户
     *
     * @param pDto
     * @return
     */
    public Dto saveSysUserInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
          	//登录名默认为用户名	以后如果界面上指定了登录名 修改逻辑
        	pDto.put("login_name", pDto.getAsString("user_name"));
            pDto.put("user_type", ArmConstants.ACCOUNTTYPE_NORMAL);//0-普通人员
            pDto.put("opn_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
            pDto.put("state", "0"); // 人员状态，除添加企业普通用户外，默认状态为0 - 正常

            //获取account
            Integer per_id = (Integer) g4Dao.queryForObject("getPerIdFromSysGrp", pDto);
            pDto.put("account", per_id);

            String password = pDto.getAsString("password");
            password = password != null && !password.equals("") ? password : "111111";
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            pDto.put("user_name", pDto.getAsString("user_name").trim());

            //保存用户信息的时候返回主键user_id
            Integer user_id = (Integer) g4Dao.insert("saveSysUserInfo", pDto);
            Dto subInfoDto = new BaseDto();
            subInfoDto.put("user_id", user_id);
            g4Dao.insert("saveSysUserSubInfo", subInfoDto);

            //更新企业表中per_id_seq
            pDto.put("per_id_seq", per_id + 1);
            g4Dao.update("updatePerIdInSysGrpsInfo", pDto);

            outDto.put("msg", "人员信息新增成功");
            outDto.put("success", true);

        } catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 修改员工信息
     *
     * @param pDto
     * @return
     */
    public Dto updateSysUserInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            String password = pDto.getAsString("password");
            password = password != null && !password.equals("") ? password : "111111";
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            g4Dao.update("updateSysUserItem", pDto);

            outDto.put("success", true);
            outDto.put("msg", "用户数据修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 删除用户
     *
     * @param pDto
     * @return
     */
    public Dto deleteUserItems(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        Dto dto = new BaseDto();
        try {
            String[] arrChecked = pDto.getAsString("strChecked").split(",");
            for (int i = 0; i < arrChecked.length; i++) {
                dto.put("user_id", arrChecked[i]);

                g4Dao.delete("deleteSysUserInfo", dto);

                g4Dao.delete("deleteSysUserRoleMapByUserId", dto);
                g4Dao.delete("deleteSysUserSubInfoByUserid", dto);
                g4Dao.delete("deleteSysUserMenuAuthByUserId", dto);
                g4Dao.delete("deleteSysUserDataAuthByUserId", dto);
            }
            outDto.put("success", true);
            outDto.put("msg", "用户数据删除成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }


    /**
     * 保存用户
     *
     * @param pDto
     * @return
     */
    public Dto saveUserItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
        	//登录名默认为用户名	以后如果界面上指定了登录名 修改逻辑
        	pDto.put("login_name", pDto.getAsString("user_name"));
            Integer temp = (Integer) g4Dao.queryForObject("checkSysAccount", pDto);
            if (temp != 0) {
                outDto.put("msg", "账号【" + pDto.getAsString("account") + "】已被占用,请重新设置!");
                outDto.put("success", false);
                return outDto;
            }

            pDto.put("opn_date", G4Utils.getCurrentTime("yyyy-MM-dd"));

            String password = pDto.getAsString("password");
            password = "".equals(password) ? "111111" : password;
            pDto.put("password", G4Utils.encryptBasedDes(password));

            pDto.put("user_name", pDto.getAsString("user_name").trim());
            pDto.put("user_type", ArmConstants.ACCOUNTTYPE_OPERATOR);//0-普通员工 1-管理员
            pDto.put("state", "0"); // 人员状态，除添加企业普通用户外，默认状态为0 - 正常

            pDto.put("per_no", pDto.getAsString("account"));//目前per_no取account值

            //保存用户信息的时候返回自增长主键user_id
            Integer user_id = (Integer) g4Dao.insert("saveSysUserInfo", pDto);
            Dto subDto = new BaseDto();
            subDto.put("user_id", user_id);
            g4Dao.insert("saveSysUserSubInfo", subDto);

            subDto.put("role_id", pDto.getAsString("role_id"));
            g4Dao.insert("saveSysUserRoleMap", subDto);//建立人员角色映射关系

            outDto.put("msg", "企业操作员新增成功");
            outDto.put("success", true);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 修改用户
     *
     * @param pDto
     * @return
     */
    public Dto updateUserItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            String password = pDto.getAsString("password");
            password = password != null && !password.equals("") ? password : "111111";
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            g4Dao.update("updateSysUserItem", pDto);

            if (!pDto.getAsString("role_id_old").equals(pDto.getAsString("role_id"))) {
                g4Dao.delete("deleteSysUserRoleMapByUserId", pDto);
                g4Dao.insert("saveSysUserRoleMap", pDto);
            }
            outDto.put("success", true);
            outDto.put("msg", "用户数据修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }


    public Dto delSysUserRoleMap(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteSysUserRoleMapByUserId", pDto);
            outDto.put("msg", "您选择的人员角色关联数据删除成功!");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }


    /**
     * 修改用户(提供首页修改使用)
     *
     * @param pDto
     * @return
     */
    public Dto updateUserItem4IndexPage(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            String password = pDto.getAsString("password");
            password = password != null && !password.equals("") ? password : pDto.getAsString("account");
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);
            g4Dao.update("updateSysUserItem", pDto);
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }


    public Dto saveEaUserAuthorize(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //分配菜单角色
            g4Dao.delete("deleteEaUserAuthorizeByUserId", pDto);
            pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
            g4Dao.insert("saveSelectedRole", pDto);

            //分配数据角色
            String datarroleid = pDto.getAsString("dataroleid");
            if (!"".equals(datarroleid)) {
                pDto.put("roleid", datarroleid);
                g4Dao.insert("saveEauserRoleMap", pDto);
                if (!"".equals(pDto.getAsString("managedeptid"))) {
                    g4Dao.update("updateUserManageDeptid", pDto);
                }
            }
            outDto.put("msg", "您选择的人员角色关联数据保存成功!");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    public Dto delEaUserAuthorize(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteEaUserAuthorizeByUserId", pDto);
            outDto.put("msg", "您选择的人员角色关联数据删除成功!");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    public Dto bindEpc4User(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //查询该epc码是否已绑定
            Integer count = (Integer) g4Dao.queryForObject("getCountByEpc4SysUserInfo", pDto);
            if (count == 0) {
                g4Dao.update("updateSysUserInfoEpcByUserId", pDto);
                outDto.put("msg", "人员EPC绑定成功!");
                outDto.put("success", new Boolean(true));
            } else {
                outDto.put("msg", "该EPC已经被绑定,请更换!");
                outDto.put("success", new Boolean(true));
            }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    public void setSysDeptService(SysDeptInfoService sysDeptService) {
        this.sysDeptService = sysDeptService;
    }

    public void setDutyService(DutyService dutyService) {
        this.dutyService = dutyService;
    }

	@Override
	public Dto importRoleList(Dto pDto) throws ApplicationException {
		 Dto outDto = new BaseDto();
		 List list = pDto.getDefaultAList();
		 //记录系统中不存在的用户
		 StringBuffer sb=new StringBuffer();
		 //核对登陆人部门和权限
		 //保存所有的工厂部门信息，以操作时间作为批次来选用合适的匹配信息
		 try {
	        for(Object obj:list){
	            Dto dto = (Dto)obj;
	            if("".equals(dto.getAsString("account_name"))){
	            	continue;
	            }
	            //整理
	 	        dto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
	 	        dto.put("opr_id",pDto.getAsString("opr_id"));
	            //获取account,excel中的名字去空格
	 	        String account_name=dto.getAsString("account_name");
	 	        account_name=account_name.replace(" ", "");
	 	        dto.put("account_name", account_name);
	 	        Dto dept_id=(Dto) g4Dao.queryForObject("queryDeptId",dto);
	 	        dto.put("dept_id", dept_id.getAsString("dept_id"));
	            Dto accountDto = (Dto) g4Dao.queryForObject("getAccountFromAccountName", dto);
	            //部门下不存在该人时记录人名并跳出
	            if(accountDto==null||accountDto.getAsString("account")==null){
	            	sb.append(dto.getAsString("account_name")+"员工不存在。\r\n");
	            	continue;
	            }
	            //获取grpid
	            Dto grp_idDto=(Dto)g4Dao.queryForObject("getGrpIdFromName", dto);
	            if(grp_idDto==null||grp_idDto.getAsString("grp_id")==null){
	            	sb.append(dto.getAsString("grp_id")+"工厂不存在。\r\n");
	            	continue;
	            }
	            dto.put("account", accountDto.getAsString("account"));
	            dto.put("grp_id", grp_idDto.getAsString("grp_id"));
	            dto.put("opr_id", pDto.getAsString("opr_id"));
	            g4Dao.insert("saveUserGrp", dto);
	        	 }
	            outDto.put("msg", "人员信息导入完毕\n存在的问题：\n"+sb.toString());
	            outDto.put("success", true);

	        } catch (Exception e) {
	            e.printStackTrace();
	            throw new ApplicationException(e.getMessage(), e);
	        }
	        return outDto;
	}

	@Override
	public Dto queryUserOut(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List UserOutList=g4Dao.queryForList("queryUserOut",pDto);
        Integer pageCount = g4Dao.queryForPageCount("queryUserOut", pDto);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(UserOutList, pageCount, "yyyy-MM-dd"));
		return outDto;
	}

}
