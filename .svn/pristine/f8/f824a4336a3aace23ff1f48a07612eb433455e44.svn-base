package com.cnnct.sys.service.impl;

import java.util.Date;
import java.util.ArrayList;

import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
import org.apache.commons.lang.StringUtils;

import java.util.List;

import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import com.cnnct.util.GlobalConstants;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.SysGrpsService;

@SuppressWarnings("unchecked")
public class SysGrpsServiceImpl extends BaseServiceImpl implements SysGrpsService {

    /**
     * 单位信息查询
     */
    public Dto getSysGrpsListForManage(Dto pDto) {
        Dto outDto = new BaseDto();
        List codeList = g4Dao.queryForPage("getSysGrpsListForPage", pDto);
        Integer totalCount = (Integer) g4Dao.queryForObject("getSysGrpsListForPageCount", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
    }

    /**
     * 单位信息保存
     */
    public Dto saveSysGrpsItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        try {
            //生成企业编号 1.取所属企业编号 2.获取下属企业中最大编号 3.生成grp_id
            String belong_grp_id = pDto.getAsString("belong_grp_id");

            Dto qDto = new BaseDto();
            qDto.put("grp_name", pDto.getAsString("name"));
            Integer grpNameCount = (Integer) g4Dao.queryForObject("queryCountGrpName", qDto);
            if (grpNameCount > 0) {
                outDto.put("success", false);
                outDto.put("msg", "企业名称重复,请重新命名!");
                return outDto;
            }
            qDto.put("startId", belong_grp_id);
            String maxId = (String) g4Dao.queryForObject("queryMaxBelongGrpId", qDto);
            Integer max = 0;
            if (!G4Utils.isEmpty(maxId)) {
                max = Integer.parseInt(maxId.substring(maxId.length() - 3));
            }
            max++;
            String grp_id = belong_grp_id + String.format("%03d", max);

            pDto.put("grp_id", grp_id);
            //判断是关联还是新增 新增的话需先新增部门
            Dto deptDto = new BaseDto();
            String belong_dept_id = pDto.getAsString("belong_dept_id");
            String maxSubDeptId = (String) g4Dao.queryForObject("getMaxSubDeptId", belong_dept_id);
            String dept_id;
            if (G4Utils.isEmpty(maxSubDeptId)) { // 当前父部门id所对应的子部门不存在
                dept_id = belong_dept_id + "00001";
                deptDto.put("sort_no", 1);
            } else {
                String temp = maxSubDeptId.substring(belong_dept_id.length());
                int intDeptId = Integer.parseInt(temp) + 1;
                deptDto.put("sort_no", intDeptId);
                dept_id = belong_dept_id + String.format("%05d", intDeptId);
            }

            deptDto.put("parent_id", belong_dept_id);
            deptDto.put("dept_name", pDto.getAsString("name"));//企业名做部门名
            //取根企业长度作为新增部门时的企业
            deptDto.put("grp_id", grp_id.substring(0, BusiConst.GRP_ROOT_GRPID_LENGTH));
            deptDto.put("dept_id", dept_id);
            deptDto.put("leaf", ArmConstants.LEAF_Y);
            deptDto.put("indep_flag", "1");//独立标识 0-否 1-是
            g4Dao.insert("saveSysDeptItem", deptDto);

            //更新父节点为非叶子节点
            Dto updateDto = new BaseDto();
            updateDto.put("dept_id", belong_dept_id);
            updateDto.put("leaf", ArmConstants.LEAF_N);
            g4Dao.update("updateLeafInSysDeptInfo", updateDto);

            pDto.put("match_dept_id", dept_id);//企业匹配的部门编号等于新增的部门编号

            // 保存单位信息
            pDto.put("opn_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
            pDto.put("state", "0");
            g4Dao.insert("createSysGrpsDomain", pDto);

            outDto.put("success", true);
            outDto.put("msg", "新增所属企业成功!");

        } catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 单位信息删除
     */
    public Dto deleteSysGrpsItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {

            pDto.put("user_type", ArmConstants.ACCOUNTTYPE_GRPMANAGE);
            Integer temp = (Integer) g4Dao.queryForObject("countSysGrpsEauser", pDto);
            if (temp == 0) {
                //删除企业信息
                g4Dao.delete("deleteSysGrpsItem", pDto);

                if ("all".equals(pDto.getAsString("flag"))) {//全部删除--删除部门和企业信息
                    pDto.put("dept_id", pDto.getAsString("match_dept_id"));
                    //更新父节点状态
                    pDto.put("leaf", ArmConstants.LEAF_Y);
                    g4Dao.update("updateLeafInSysDeptInfo", pDto);
                    //删除部门信息
                    g4Dao.delete("deleteSysGrpsDept", pDto);
                } else if ("grps".equals(pDto.getAsString("flag"))) {
                    //更改独立考勤字段
                    pDto.put("indep_flag", "0");
                    g4Dao.update("updateSysDeptInfoIndepFlag", pDto);
                }
                outDto.put("success", new Boolean(true));
                outDto.put("msg", "企业信息删除成功!");
            } else {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "此企业已分配管理员不能删除!请先删除人员信息!");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 单位信息修改
     */
    public Dto updateSysGrpsItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Dto dto = new BaseDto();
            dto.put("grp_name", pDto.getAsString("name"));
            dto.put("grp_id", pDto.getAsString("grp_id"));
            Integer grpNameCount = (Integer) g4Dao.queryForObject("queryCountGrpName", dto);
            if (grpNameCount > 0) {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "企业名称重复,请重新命名!");
                return outDto;
            }
            //修改企业信息
            g4Dao.update("updateSysGrpsItem", pDto);

            //修改分厂管理员平台功能信息
            String app = pDto.getAsString("apps");
            if (!app.equals(pDto.getAsString("old_apps"))) {//企业平台功能有变化
                Dto qDto = new BaseDto();
                qDto.put("deptid", pDto.getAsString("match_deptid"));
                qDto.put("localuserid", pDto.getAsString("opr_userid"));
                qDto.put("usertype", "5");
                //获取分厂管理员信息
                List grpUserList = g4Dao.queryForList("queryUsersForManage", qDto);

                for (Object o : grpUserList) {
                    Dto grpUserDto = (Dto) o;

                    //删除当前员工菜单信息
                    g4Dao.delete("deleteEausermenumapByUserId", grpUserDto);

                    List<String> removeList = new ArrayList<String>();

                    String[] keys = {BusiConst.MENU_TYPE_EMP, BusiConst.MENU_TYPE_WAGE, BusiConst.MENU_TYPE_CRD,
                            BusiConst.MENU_TYPE_CWA, BusiConst.MENU_TYPE_AEG, BusiConst.MENU_TYPE_VST,
                            BusiConst.MENU_TYPE_CNS, BusiConst.MENU_TYPE_GYM, BusiConst.MENU_TYPE_ARM};
                    String[] apps = app.split(",");//所属企业的功能权限
                    for (int i = 0; i < apps.length; i++) {
                        String value = apps[i];
                        if ("0".equals(value))
                            removeList.add(keys[i]);
                    }

                    //菜单权限
                    //获取当前操作员的人员菜单权限,插入到新加操作员中
                    List userMenuList = g4Dao.queryForList("getMenuIdByUserid", pDto.getAsString("opr_userid"));
                    for (int i = 0; i < userMenuList.size(); i++) {
                        Dto userMenuDto = (BaseDto) userMenuList.get(i);

                        if (removeList.contains(userMenuDto.getAsString("menutype"))) {
                            //该下属企业没有对应功能
                            userMenuList.remove(i);
                            i--;
                            continue;
                        }
                        userMenuDto.put("userid", grpUserDto.getAsString("userid"));
                        userMenuDto.put("authorizelevel", "1");
                        userMenuDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                    }
                    g4Dao.batchInsert(userMenuList, "saveSelectedMenu");
                }

            }

            outDto.put("success", new Boolean(true));
            outDto.put("msg", "单位信息修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

}
