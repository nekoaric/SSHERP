package com.cnnct.sys.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.cnnct.sys.service.RoleService;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

/**
 * 角色管理与授权业务实现类
 *
 * @author XiongChun
 * @since 2010-04-13
 */
public class RoleServiceImpl extends BaseServiceImpl implements RoleService {

    /**
     * 角色管理 - 角色列表
     *
     * @param pDto
     * @return
     */
    public Dto queryRolesForManage(Dto pDto) {
        Dto outDto = new BaseDto();
        List roleList = g4Dao.queryForPage("queryRolesForManage", pDto);
        Integer pageCount = g4Dao.queryForPageCount("queryRolesForManage", pDto);

        String jsonString = JsonHelper.encodeList2PageJson(roleList, pageCount, "yyyy-MM-dd");
        outDto.put("jsonString", jsonString);
        return outDto;
    }

    /**
     * 保存角色
     *
     * @param pDto
     * @return
     */
    public Dto saveRoleItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //查询是否有同名
            Integer count = (Integer) g4Dao.queryForObject("getCountNameEarole", pDto);
            if (count > 0) {
                outDto.put("msg", "角色名重复!请修改!");
                outDto.put("success", new Boolean(false));
                return outDto;
            }
            g4Dao.insert("saveSysRoleInfo", pDto);
            outDto.put("msg", "角色数据新增成功");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 删除角色
     *
     * @param pDto
     * @return
     */
    public Dto deleteRoleItems(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            int count = (Integer) g4Dao.queryForObject("selectCountEauserauthorize", pDto);
            if (count > 0) {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "该角色已关联操作员，不能删除!");
            } else {
                g4Dao.delete("deleteSysRoleInfoInRoleManage", pDto);

                g4Dao.delete("deleteSysRoleMenuAuthInRoleManage", pDto);
                g4Dao.delete("deleteSysRoleDataAuthInRoleManage", pDto);
                g4Dao.delete("deleteEauserauthorizeInRoleManage", pDto);

                outDto.put("success", new Boolean(true));
                outDto.put("msg", "角色数据删除成功!");
            }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 修改角色
     *
     * @param pDto
     * @return
     */
    public Dto updateRoleItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //查询是否有同名
            Integer count = (Integer) g4Dao.queryForObject("getCountNameEarole", pDto);
            if (count > 0) {
                outDto.put("msg", "角色名重复!请修改!");
                outDto.put("success", new Boolean(false));
                return outDto;
            }
            g4Dao.update("updateSysRoleInfo", pDto);

            outDto.put("success", new Boolean(true));
            outDto.put("msg", "角色数据修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 保存角色授权信息
     *
     * @param pDto
     * @return
     */
    public synchronized Dto saveRoleMenuGrant(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteSysRoleMenuAuth", pDto);//删除角色菜单表
            g4Dao.delete("deleteSysRolePartAuth", pDto);//删除角色菜单组件表

            String showMenuMenuId = pDto.getAsString("showMenuMenuIds");
            String manageMenuMenuId = pDto.getAsString("manageMenuMenuIds");

            Dto menuIdDto = new BaseDto();
            if (!"".equals(showMenuMenuId)){
                String[] showMenuMenuIds = showMenuMenuId.split(";");
                for (String menu_id : showMenuMenuIds) {
                    menuIdDto.put(menu_id, "0");//0-查看
                }
            }

            if (!"".equals(manageMenuMenuId)){
                String[] manageMenuMenuIds = manageMenuMenuId.split(";");
                for (String menu_id : manageMenuMenuIds) {
                    //menuIdDto中没有对应的menuid 设当前menuid的状态为 1(授权)
                    if (G4Utils.isEmpty(menuIdDto.get(menu_id))) {
                        menuIdDto.put(menu_id, "1");
                    } else {
                        menuIdDto.put(menu_id, "2");//2-查看&授权
                    }
                }
            }

            List menuList = new ArrayList();
            Iterator it = menuIdDto.keySet().iterator();
            while (it.hasNext()) {
                String menu_id = (String) it.next();

                Dto menuDto = new BaseDto();
                menuDto.put("role_id", pDto.getAsString("role_id"));
                menuDto.put("menu_id", menu_id);
                menuDto.put("authorize_level", menuIdDto.getAsString(menu_id));//权限
                menuList.add(menuDto);
            }
            g4Dao.batchInsert(menuList, "insertSysRoleMenuAuth");

            outDto.put("msg", "角色权限授权成功");

            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 保存角色用户关联信息
     *
     * @param pDto
     * @return
     */
    public Dto saveSelectUser(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteEaUserAuthorizeByRoleId", pDto);
            String[] userids = pDto.getAsString("userid").split(",");
            for (int i = 0; i < userids.length; i++) {
                String userid = userids[i];
                if (G4Utils.isEmpty(userid))
                    continue;
                pDto.put("userid", userid);
                pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
                g4Dao.insert("saveSelectUser", pDto);
            }
            outDto.put("msg", "您选择的角色人员关联数据保存成功");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    public Dto menuGrantTreeInit(Dto pDto) throws ApplicationException {

        List menuList = g4Dao.queryForList("queryMenusInRoleManage", pDto);

        Dto parentDto = new BaseDto();
        Dto rootDto = new BaseDto();
        for (Object o : menuList) {
            Dto menuDto = (Dto) o;

            menuDto.put("id", menuDto.getAsString("menu_id"));
            menuDto.put("text", menuDto.getAsString("menu_name"));
            menuDto.put("iconCls", menuDto.getAsString("icon_cls"));
            menuDto.remove("icon");

            if ("".equals(menuDto.getAsString("authorize_level"))) {
                menuDto.put("checked", false);
            } else {
                menuDto.put("checked", true);
            }

            if ("01".equals(menuDto.getAsString("menu_id"))) {
                rootDto = menuDto;
            }

            if ("1".equals(menuDto.getAsString("leaf"))) {
                menuDto.put("leaf", true);
            } else {
                menuDto.put("leaf", false);
                menuDto.put("expanded", true);
            }

            String parent_id = menuDto.getAsString("parent_id");
            Object parentObj = parentDto.get(parent_id);

            if (parentObj == null) {
                List l = new ArrayList();
                l.add(menuDto);
                parentDto.put(parent_id, l);
            } else {
                List l = (List) parentObj;
                l.add(menuDto);
            }
        }

        Dto d = getChildList(parentDto, "01");
        rootDto.put("children", d.get("01"));

        return rootDto;
    }


    private Dto getChildList(Dto parentDto, String rootId) {
        Object o = parentDto.get(rootId);
        if (o != null) {//当前根节点rootId下有部门列表
            List l = (List) o;
            for (int i = 0; i < l.size(); i++) {
                Dto menuDto = (Dto) l.get(i);
                String id = menuDto.getAsString("menu_id");

                Dto parentDto_update = getChildList(parentDto, id);//所有的子部门信息
                if (parentDto_update != null) {//节点下有子列表
                    menuDto.put("children", parentDto_update.get(id));
                }
            }
        } else {
            return null;
        }
        return parentDto;//返回修改过根节点信息的parentDto
    }
}
