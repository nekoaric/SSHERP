package com.cnnct.sys.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.eredlab.g4.arm.service.DutyService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.ManageUserInfoService;
import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;

/**
 * 用户管理与授权业务实现类
 *
 * @author XiongChun
 * @since 2010-04-13
 */
@SuppressWarnings({"unchecked", "rawtypes"})
public class ManageUserInfoServiceImpl extends BaseServiceImpl implements ManageUserInfoService {

    /**
     * 用户管理 - 用户列表
     *
     * @param pDto
     * @return
     */
    public Dto queryUsersForManage(Dto pDto) {
        Dto outDto = new BaseDto();
        List userList = g4Dao.queryForPage("queryManageUsersForManage", pDto);
        Integer pageCount = g4Dao.queryForPageCount("queryManageUsersForManage", pDto);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(userList, pageCount, "yyyy-MM-dd"));
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
            if (temp.intValue() != 0) {
                outDto.put("msg", "账号【" + pDto.getAsString("account") + "】已被占用,请重新设置!");
                outDto.put("success", new Boolean(false));
                return outDto;
            }

            pDto.put("opn_date", G4Utils.getCurrentTime("yyyy-MM-dd"));

            String password = pDto.getAsString("password");
            password = "".equals(password) ? "111111" : password;
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            String user_name = pDto.getAsString("user_name").trim();
            pDto.put("user_name", user_name);
            pDto.put("user_type", "1");//0-普通员工 1-管理员
            pDto.put("state", "0"); // 人员状态，除添加企业普通用户外，默认状态为0 - 正常

            pDto.put("per_no", pDto.getAsString("account"));

            //保存用户信息的时候返回主键user_id
            Integer user_id = (Integer) g4Dao.insert("saveSysUserInfo", pDto);
            Dto subDto = new BaseDto();
            subDto.put("user_id", user_id);
            g4Dao.insert("saveSysUserSubInfo", subDto);

            subDto.put("role_id", pDto.getAsString("role_id"));
            g4Dao.insert("saveSysUserRoleMap", subDto);

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
            String userid = pDto.getAsString("user_id");

            String password = pDto.getAsString("password");
            password = "".equals(password) ? "111111" : password;
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            g4Dao.update("updateSysUserItem", pDto);

            if (!pDto.getAsString("roleid_old").equals(pDto.getAsString("role_id"))) {
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


}
