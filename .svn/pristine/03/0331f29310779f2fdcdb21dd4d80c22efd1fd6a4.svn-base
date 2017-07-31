package com.cnnct.sys.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;

/**
 * 组织机构模型业务实现类
 */
public class SysDeptInfoServiceImpl extends BaseServiceImpl implements SysDeptInfoService {

    /**
     * 查询部门信息生成部门树
     *
     * @param pDto
     * @return
     */
    public Dto queryDeptItems(Dto pDto) {
        Dto outDto = new BaseDto();
        List deptList = g4Dao.queryForList("querySysDeptItemsByDto", pDto);
        Dto deptDto;
        for (int i = 0; i < deptList.size(); i++) {
            deptDto = (BaseDto) deptList.get(i);
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)) {
                deptDto.put("leaf", new Boolean(true));
            } else {
                deptDto.put("leaf", new Boolean(false));
            }
            if (deptDto.getAsString("id").length() == 8) {
                deptDto.put("expanded", new Boolean(true));
            }
            deptDto.put("iconCls", "folder_userIcon");
        }
        outDto.put("jsonString", JsonHelper.encodeObject2Json(deptList));
        return outDto;
    }

    /**
     * 部门管理 - 部门列表
     *
     * @param pDto
     * @return
     */
    public Dto queryDeptsForManage(Dto pDto) {
        Dto outDto = new BaseDto();
        List menuList = g4Dao.queryForPage("querySysDeptsForManage", pDto);
        String jsonString = JsonHelper.encodeObject2Json(menuList);
        Integer pageCount = g4Dao.queryForPageCount("querySysDeptsForManage", pDto);
        outDto.put("jsonString", JsonHelper.encodeJson2PageJson(jsonString, pageCount));
        return outDto;
    }

    /**
     * 保存部门
     *
     * @param pDto
     * @return
     */
    public synchronized Dto saveDeptItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            int count = (Integer) g4Dao.queryForObject("querySysCountDeptName", pDto);
            if (count > 0) {
                outDto.put("msg", "已经存在一个" + pDto.getAsString("dept_name") + ",请勿重复添加");
                outDto.put("success", new Boolean(false));
            } else {
                //获取部门id
                String dept_id = "";
                String parent_id = pDto.getAsString("parent_id");
                String maxSubDeptId=(String)g4Dao.queryForObject("getMaxSubDeptId", parent_id);

                if(G4Utils.isEmpty(maxSubDeptId)){ // 当前父部门id所对应的子部门不存在
                    dept_id = "00001";
                    pDto.put("sort_no",1);
                }else{
                    String temp = maxSubDeptId.substring(parent_id.length());
                    int intDeptId = Integer.parseInt(temp) + 1;
                    pDto.put("sort_no",intDeptId);
                    dept_id = String.format("%05d",intDeptId);
                }

                pDto.put("dept_id",parent_id+dept_id);
                pDto.put("dept_state", '0');//正常
                pDto.put("leaf", ArmConstants.LEAF_Y);
                g4Dao.insert("saveSysDeptItem", pDto);

                Dto updateDto = new BaseDto();
                updateDto.put("dept_id", pDto.getAsString("parent_id"));
                updateDto.put("leaf", ArmConstants.LEAF_N);
                g4Dao.update("updateLeafInSysDeptInfo", updateDto);

                outDto.put("msg", "部门数据新增成功");
                outDto.put("success", new Boolean(true));
                outDto.put("dept_id", dept_id); // 当前创建部门ID
            }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 修改部门
     *
     * @param pDto
     * @return
     */
    public Dto updateDeptItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            if (pDto.getAsString("parent_id").equals(pDto.getAsString("parent_id_old"))) {
                int count = (Integer) g4Dao.queryForObject("querySysCountDeptName", pDto);
                if (count > 1) {
                    outDto.put("msg", "已经存在一个" + pDto.getAsString("dept_name") + ",请重新修改部门名称");
                    outDto.put("success", new Boolean(false));
                } else {
                    g4Dao.update("updateSysDeptItem", pDto);
                    outDto.put("success", new Boolean(true));
                    outDto.put("msg", "部门数据修改成功!");
                }
            } else {
                saveDeptItem(pDto);
                pDto.put("parent_id", pDto.getAsString("parent_id_old"));
                changeLeafOfDeletedParent(pDto);
                outDto.put("success", new Boolean(true));
                outDto.put("msg", "部门数据修改成功!");
            }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

    /**
     * 删除部门项
     *
     * @param pDto
     * @return
     */
    public synchronized Dto deleteDeptItems(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            try {
                g4Dao.delete("deleteSysRoleInfoByDeptId", pDto);//删除对应角色信息
                g4Dao.delete("deleteSysRoleMenuAuthByDeptId", pDto);//删除对应角色权限信息
                g4Dao.delete("deleteSysRoleDataAuthByDeptId", pDto);//删除对应角色权限信息

                g4Dao.update("updateSysEadeptItem", pDto);

                Dto changeLeafDto = new BaseDto();
                Dto parentDto = (BaseDto) g4Dao.queryForObject("querySysDeptItemsByDto", pDto);
                changeLeafDto.put("parent_id", parentDto.getAsString("parent_id"));
                changeLeafOfDeletedParent(changeLeafDto);
            } catch (Exception e) {
                throw new ApplicationException(e.getMessage(), e);
            }
            outDto.put("success", new Boolean(true));
            outDto.put("msg", "部门数据删除成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }


    /**
     * 根据用户所属部门编号查询部门对象<br>
     * 用于构造组织机构树的根节点
     *
     * @param
     * @return
     */
    public Dto queryDeptinfoByDeptid(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            outDto = (BaseDto) g4Dao.queryForObject("querySysDeptinfoByDeptid", pDto);
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }


    /**
     * 导入部门信息保存
     */
    public Dto importDeptInfo(List lst) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            int size = lst.size();
            for (int i = 0; i < size; i++) {
                BaseDto dto = (BaseDto) lst.get(i);
                outDto = saveDeptItem(dto);
                if(!(Boolean)outDto.get("success")){
                    throw new ApplicationException(outDto.getAsString("msg"));
                }
            }
            outDto.put("success", new Boolean(true));
            outDto.put("msg", "部门信息导入成功！");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 调整被删除部门的直系父级部门的Leaf属性
     *
     * @param pDto
     */
    private void changeLeafOfDeletedParent(Dto pDto) throws ApplicationException {
        try {
            String parentid = pDto.getAsString("parent_id");
            pDto.put("dept_id", parentid);
            Integer countInteger = (Integer) g4Dao.queryForObject("getSubDeptCountByParentId", pDto);
            if (countInteger.intValue() == 0) {
                pDto.put("leaf", ArmConstants.LEAF_Y);
            } else {
                pDto.put("leaf", ArmConstants.LEAF_N);
            }
            g4Dao.update("updateLeafInSysDeptInfo", pDto);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
    }

	/**
	 * 保存部门的数量性质
	 */
	public Dto saveDeptNatures(Dto dto) throws ApplicationException {
		Dto outDto = new BaseDto();
		try{
			String dept_id = dto.getAsString("dept_id");
			String opr_id = dto.getAsString("opr_id");
			String opr_time = TimeUtil.getCurrentDate();
			String natures = dto.getAsString("natures");
			
			String[] natureArr = natures.split(",");
			List<Dto> resultList = new ArrayList<Dto>();
			for(String str : natureArr) {
				Dto dbDto = new BaseDto();
				dbDto.put("dept_id",dept_id);
				dbDto.put("nature",str);
				dbDto.put("opr_time",opr_time);
				dbDto.put("opr_id",opr_id);
				resultList.add(dbDto);
			}
			Dto dbDto = new BaseDto();
			dbDto.put("dept_id",dept_id);
			//删除所有现有的数量性质
			//添加所有数量性质
			g4Dao.delete("deleteNatures4dept", dbDto);
			g4Dao.batchInsertBaseDto("insertNatures4dept", resultList);
			outDto.put("success", true);
			outDto.put("msg", "保存成功");
		}catch(Exception e){
			e.printStackTrace();
			outDto = new BaseDto();
			outDto.put("success", false);
			outDto.put("msg","数量性质修改失败");
		}
		return outDto;
	}

    
}
