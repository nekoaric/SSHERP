package org.eredlab.g4.arm.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.arm.service.UserService;
import com.cnnct.util.ArmConstants;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

/**
 * 用户管理与授权业务实现类
 * 
 * @author XiongChun
 * @since 2010-04-13
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class UserServiceImpl extends BaseServiceImpl implements UserService {

    /**
     * 用户管理 - 用户列表
     * 
     * @param pDto
     * @return
     */
    public Dto queryUsersForManage(Dto pDto) {
        Dto outDto = new BaseDto();
        List userList = g4Dao.queryForPage("queryUsersForManage", pDto);
        Integer  pageCount= g4Dao.queryForPageCount("queryUsersForManage", pDto);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(userList,pageCount, "yyyy-MM-dd"));
        return outDto;
    }

    /**
     * 保存用户
     * 
     * @param pDto
     * @return
     */
    public synchronized Dto saveUserItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Integer temp = (Integer) g4Dao.queryForObject("checkAccount", pDto);
            if (temp.intValue() != 0) {
                outDto.put("msg", "账号【" + pDto.getAsString("account") + "】已被占用,请重新设置!");
                outDto.put("success", new Boolean(false));
                return outDto;
            }

            String userid = IDHelper.getUserID();
            pDto.put("userid", userid);
            pDto.put("opn_date", G4Utils.getCurrentTime("yyyy-MM-dd"));

            String password = pDto.getAsString("password");
            password = convertPwd(password);
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            String username = pDto.getAsString("username").trim();
            pDto.put("username", username);
            pDto.put("state", "0"); // 人员状态，除添加企业普通用户外，默认状态为0 - 正常

            // 系统管理员添加人员(分厂管理员,企业操作员)
            if (pDto.getAsString("opn_usertype").equals(ArmConstants.ACCOUNTTYPE_ADMIN)) {

                if (pDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)) {
                    List<String> removeList = new ArrayList<String>();
                    String[] keys = {BusiConst.MENU_TYPE_EMP,BusiConst.MENU_TYPE_WAGE,BusiConst.MENU_TYPE_CRD,
                            BusiConst.MENU_TYPE_CWA,BusiConst.MENU_TYPE_AEG, BusiConst.MENU_TYPE_VST,
                            BusiConst.MENU_TYPE_CNS,BusiConst.MENU_TYPE_GYM,BusiConst.MENU_TYPE_ARM};
                    String[] apps = pDto.getAsString("apps").split(",");//所属企业的功能权限
                    for(int i =0;i<apps.length;i++){
                        String value = apps[i];
                        if("0".equals(value))
                            removeList.add(keys[i]);
                    }

                    //菜单权限
                    //获取当前操作员的人员菜单权限,插入到新加操作员中
                    List userMenuList = g4Dao.queryForList("getMenuIdByUserid", pDto.getAsString("opn_opr_id"));
                    for (int i = 0; i < userMenuList.size(); i++) {
                        Dto userMenuDto = (BaseDto) userMenuList.get(i);

                        if(removeList.contains(userMenuDto.getAsString("menutype"))){
                            //该下属企业没有对应功能
                            userMenuList.remove(i);
                            i--;
                            continue;
                        }
                        userMenuDto.put("userid", userid);
                        userMenuDto.put("authorizelevel", "1");
                        userMenuDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                    }
                    g4Dao.batchInsert(userMenuList, "saveSelectedMenu");

                    //获取当前部门数据角色id
                    Dto qDto = new BaseDto();
                    qDto.put("notes", "localdept");
                    String localDeptRoleId = (String) g4Dao.queryForObject("getEaDataRoleIdByNotes", qDto);
                    pDto.put("dataroleid", localDeptRoleId);

                } else {
                    pDto.put("usertype", ArmConstants.ACCOUNTTYPE_OPERATOR);

                    saveSelectedRole(pDto);// 保存菜单角色
                }

                pDto.put("per_no", pDto.getAsString("account"));

                saveSelectedDataRole(pDto);//保存数据角色

                g4Dao.insert("saveUserItem", pDto);
                g4Dao.insert("saveEausersubinfoItem", pDto);
                outDto.put("msg", "企业操作员新增成功");
                outDto.put("success", true);

            }

            // 分厂管理员添加操作员
            if (pDto.getAsString("opn_usertype").equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)) {
                // 保存
                if (pDto.getAsString("flag").equals("save")) {
                    pDto.put("per_no", pDto.getAsString("account"));
                    saveSelectedRole(pDto);// 保存菜单角色
                    saveSelectedDataRole(pDto);//保存数据角色
                    g4Dao.insert("saveUserItem", pDto);
                    g4Dao.insert("saveEausersubinfoItem", pDto);
                    outDto.put("msg", "企业操作员新增成功");
                    outDto.put("success", Boolean.valueOf(true));
                }
            }

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
    public synchronized Dto deleteUserItems(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        Dto dto = new BaseDto();
        try {
            String[] arrChecked = pDto.getAsString("strChecked").split(",");
            for (int i = 0; i < arrChecked.length; i++) {
                dto.put("userid", arrChecked[i]);
                // 用户状态改为注销
                g4Dao.delete("deleteEauserInUserManage", dto);
//                g4Dao.delete("updateEauser4State", dto);
                g4Dao.delete("deleteEauserauthorizeInUserManage", dto);
                g4Dao.delete("deleteEausermenumapByUserid", dto);
                g4Dao.delete("deleteEausersubinfoByUserid", dto);
            }
            outDto.put("success", Boolean.valueOf(true));
            outDto.put("msg", "用户数据删除成功!");
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
    public synchronized Dto updateUserItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            String userid = pDto.getAsString("userid");

            String password = pDto.getAsString("password");
            password = convertPwd(password);
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);

            if (pDto.getAsString("opn_usertype").equals(ArmConstants.ACCOUNTTYPE_ADMIN)) {
                //分厂管理员的数据权限和菜单权限不需做更改
                if (!pDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)) {

                    pDto.put("usertype", ArmConstants.ACCOUNTTYPE_OPERATOR);

                    if (!pDto.getAsString("roleid").equals(pDto.getAsString("roleid_old"))) {
                        g4Dao.delete("deleteEausermenumapByUserId", pDto);
                        saveSelectedRole(pDto);
                    }

                    saveSelectedDataRole(pDto);//保存数据角色
                }
            }else if (pDto.getAsString("opn_usertype").equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)) {
                //分厂管理员修改操作员
                pDto.put("usertype", ArmConstants.ACCOUNTTYPE_OPERATOR);

                if (!pDto.getAsString("roleid").equals(pDto.getAsString("roleid_old"))) {
                    g4Dao.delete("deleteEausermenumapByUserId", pDto);
                    saveSelectedRole(pDto);
                }

                saveSelectedDataRole(pDto);//保存数据角色
            }

            if (!pDto.getAsString("deptid").equals(pDto.getAsString("deptid_old"))) {
                pDto.put("status", "0");
            }
            g4Dao.update("updateUserItem", pDto);

            outDto.put("success", Boolean.valueOf(true));
            outDto.put("msg", "用户数据修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 保存人员角色关联信息
     * 
     * @param pDto
     * @return
     */
    public synchronized Dto saveSelectedRole(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteEaUserAuthorizeByUserId", pDto);
            // g4Dao.delete("deleteEausermenumapByUserId", pDto);
            String[] roleids = pDto.getAsString("roleid").split(",");
            for (int i = 0; i < roleids.length; i++) {
                String roleid = roleids[i];
                if (G4Utils.isEmpty(roleid))
                    continue;
                pDto.put("roleid", roleid);
                pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
                g4Dao.insert("saveSelectedRole", pDto);
            }
            outDto.put("msg", "您选择的人员角色关联数据保存成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 保存人员角色关联信息
     *
     * @param pDto
     * @return
     */
    public synchronized Dto saveSelectedDataRole(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //分配数据角色
            String datarroleid = pDto.getAsString("dataroleid");
            if(!"".equals(datarroleid)){
                pDto.put("roleid",datarroleid);
                g4Dao.insert("saveEauserRoleMap", pDto);
                if(!"".equals(pDto.getAsString("managedeptid"))){
                    g4Dao.update("updateUserManageDeptid",pDto);
                }
            }
            outDto.put("msg", "您选择的人员角色关联数据保存成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 保存人员菜单关联信息
     * 
     * @param pDto
     * @return
     */
    public synchronized Dto saveSelectedMenu(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteEausermenumapByUserId", pDto);
            String[] menuids = pDto.getAsString("menuid").split(",");
            for (int i = 0; i < menuids.length; i++) {
                String menuid = menuids[i];
                if (G4Utils.isEmpty(menuid))
                    continue;
                pDto.put("menuid", menuid);
                pDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                pDto.put("authorizelevel", ArmConstants.AUTHORIZELEVEL_ACCESS);
                g4Dao.insert("saveSelectedMenu", pDto);
            }
            outDto.put("msg", "您选择的人员菜单关联数据保存成功");
            outDto.put("success", Boolean.valueOf(true));
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
    public synchronized Dto updateUserItem4IndexPage(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            String password = pDto.getAsString("password");
            password = convertPwd(password);
            String mPasswor = G4Utils.encryptBasedDes(password);
            pDto.put("password", mPasswor);
            pDto.put("updatemode", "notnull");
            g4Dao.update("updateUserItem", pDto);
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /***
     * 发送密码
     * 
     * @param pDto
     * @return
     */

    public synchronized Dto sendPwd(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        Dto dto = new BaseDto();
        try {
            // 查询当前用户信息
            Dto userDto = (BaseDto) g4Dao.queryForObject("getUserInfoByKey", pDto);
            String password = userDto.getAsString("password");
            String mPasswor = G4Utils.decryptBasedDes(password);
            String account = userDto.getAsString("account");
            String username = userDto.getAsString("username");
            String grp_id = userDto.getAsString("grp_id");
            String message = "";
//            if (userDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_PROVINCE_OPERATOE)) {
//                message = username + ",您好！您在一卡通管理平台的省级代码为" + grp_id + ",登录账号为" + account + ",密码为" + mPasswor + ",请妥善保管你的账号和密码！";
//            }
//            if (userDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_SUPERADMIN) || userDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_CITYOPERATOR) || userDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_CUSTOMER_MANAGER)) {
//                message = username + ",您好！您在一卡通管理平台的地市代码为" + grp_id + ",登录账号为" + account + ",密码为" + mPasswor + ",请妥善保管你的账号和密码！";
//            }
            if (userDto.getAsString("usertype").equals(ArmConstants.ACCOUNTTYPE_OPERATOR)) {
                message = username + ",您好！您在一卡通管理平台的企业代码为" + grp_id + ",登录账号为" + account + ",密码为" + mPasswor + ",请妥善保管你的账号和密码！";
            }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 转换密码（为空返回默认111111）
     * 
     * @param password
     * @return
     */
    public static String convertPwd(String password) {
        return password != null && !password.equals("") ? password : "111111";
    }

    public Dto saveEaUserAuthorize(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //分配菜单角色
            g4Dao.delete("deleteEaUserAuthorizeByUserId",pDto);
            pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
            g4Dao.insert("saveSelectedRole", pDto);

            //分配数据角色
            String datarroleid = pDto.getAsString("dataroleid");
            if(!"".equals(datarroleid)){
                pDto.put("roleid",datarroleid);
                g4Dao.insert("saveEauserRoleMap", pDto);
                if(!"".equals(pDto.getAsString("managedeptid"))){
                    g4Dao.update("updateUserManageDeptid",pDto);
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
            g4Dao.delete("deleteEaUserAuthorizeByUserId",pDto);

            outDto.put("msg", "您选择的人员角色关联数据删除成功!");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

}
