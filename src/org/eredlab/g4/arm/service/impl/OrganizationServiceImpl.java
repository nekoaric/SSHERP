package org.eredlab.g4.arm.service.impl;

import java.util.List;

import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

/**
 * 组织机构模型业务实现类
 * 
 * @author XiongChun
 * @since 2010-01-13
 */
public class OrganizationServiceImpl extends BaseServiceImpl implements OrganizationService {

	/**
	 * 获取用户信息
	 * 
	 * @param pDto
	 * @return
	 */
	public synchronized Dto getUserInfo(Dto pDto) {
		Dto outDto = new BaseDto();
		pDto.put("lock", ArmConstants.LOCK_N);
//        pDto.put("group_type", BusiConst.DATA_AUTHORITY_TYPE_GROUP);
        pDto.put("relative_type", BusiConst.DATA_AUTHORITY_TYPE_RELATIVE);
//        pDto.put("duty_type", BusiConst.DATA_AUTHORITY_TYPE_DUTY);

		UserInfoVo userInfo = (UserInfoVo) g4Dao.queryForObject("getUserInfo", pDto);
		outDto.put("userInfo", userInfo);
		return outDto;
	}

	/**
	 * 查询部门信息生成部门树
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto queryDeptItems(Dto pDto) {
		Dto outDto = new BaseDto();
		
		List deptList = g4Dao.queryForList("queryDeptItemsByDto", pDto);
		Dto deptDto = new BaseDto();
		for (int i = 0; i < deptList.size(); i++) {
			deptDto = (BaseDto) deptList.get(i);
			if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)){
				deptDto.put("leaf", new Boolean(true));
			}
			else{
				deptDto.put("leaf", new Boolean(false));
			}
			if (deptDto.getAsString("id").length() == 6){
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
		List menuList = g4Dao.queryForPage("queryDeptsForManage", pDto);
		String jsonString = JsonHelper.encodeObject2Json(menuList);
		Integer pageCount = g4Dao.queryForPageCount("queryDeptsForManage", pDto);
		outDto.put("jsonString", JsonHelper.encodeJson2PageJson(jsonString, pageCount));
		return outDto;
	}

	/**
	 * 保存部门
	 * 
	 * @param pDto
	 * @return
	 */
	public synchronized Dto saveDeptItem(Dto pDto) throws ApplicationException{
		Dto outDto = new BaseDto();
		try {
		    String deptid = IdGenerator.getDeptIdGenerator(pDto.getAsString("parentid"));
	        pDto.put("deptid", deptid);
	        pDto.put("leaf", ArmConstants.LEAF_Y);
	        int count=(Integer) g4Dao.queryForObject("queryCountDeptName", pDto);
	        if(count>0){
	            outDto.put("msg", "已经存在一个"+pDto.getAsString("deptname")+",请勿重复添加");
	            outDto.put("success", new Boolean(false));  
	        }else{
                g4Dao.insert("saveDeptItem", pDto);
                Dto updateDto = new BaseDto();
                updateDto.put("deptid", pDto.getAsString("parentid"));
                updateDto.put("leaf", ArmConstants.LEAF_N);
                g4Dao.update("updateLeafFieldInEaDept", updateDto);
                outDto.put("msg", "部门数据新增成功");
                outDto.put("success", new Boolean(true));
                outDto.put("deptid", deptid); // 当前创建部门ID

                //更新部门数据权限信息
                Dto dto = new BaseDto();
                UserInfoVo user =(UserInfoVo)pDto.get("oprUserInfo");
                String dataRoleId = user.getRoleid();
                String relativeAuthority = user.getRelativeAuthority();
                if(!G4Utils.isEmpty(dataRoleId)){
                    if(G4Utils.isEmpty(relativeAuthority)){//具体权限的
                        dto.put("roleid", dataRoleId);
                        dto.put("deptid", deptid);
                        dto.put("type", "1");//部门授权
                        dto.put("per_id", "1");
                        dto.put("other", "1");
                        g4Dao.insert("saveDataRoleGrantItem",dto);
                    }
                }
                //通过userid获取roleid
                String roleid = (String)g4Dao.queryForObject("getRoleIdByUserId",pDto);


	        }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(),e);
        }
//		String deptid = IdGenerator.getDeptIdGenerator(pDto.getAsString("parentid"));
//		pDto.put("deptid", deptid);
//		pDto.put("leaf", ArmConstants.LEAF_Y);
//		g4Dao.insert("saveDeptItem", pDto);
//		Dto updateDto = new BaseDto();
//		updateDto.put("deptid", pDto.getAsString("parentid"));
//		updateDto.put("leaf", ArmConstants.LEAF_N);
//		g4Dao.update("updateLeafFieldInEaDept", updateDto);
//		outDto.put("msg", "部门数据新增成功");
//		outDto.put("success", new Boolean(true));
		return outDto;
	}

	/**
	 * 修改部门
	 * 
	 * @param pDto
	 * @return
	 */
	public synchronized Dto updateDeptItem(Dto pDto) throws ApplicationException{
		Dto outDto = new BaseDto();
		try {
		    if (pDto.getAsString("parentid").equals(pDto.getAsString("parentid_old"))) {
//	            pDto.remove("parentid");
	            int count=(Integer) g4Dao.queryForObject("queryCountDeptName", pDto);
				if (count > 1) {
					outDto.put("msg", "已经存在一个" + pDto.getAsString("deptname") + ",请重新修改部门名称");
					outDto.put("success", new Boolean(false));
				} else {
					g4Dao.update("updateDeptItem", pDto);
					outDto.put("success", new Boolean(true));
					outDto.put("msg", "部门数据修改成功!");
				}
	        } else {
//	            g4Dao.delete("deleteEadeptItem", pDto);
	            saveDeptItem(pDto);
	            pDto.put("parentid", pDto.getAsString("parentid_old"));
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
	 * 调整被删除部门的直系父级部门的Leaf属性
	 * 
	 * @param pDto
	 */
	private void changeLeafOfDeletedParent(Dto pDto) throws ApplicationException{
	    try {
	        String parentid = pDto.getAsString("parentid");
	        pDto.put("deptid", parentid);
	        Integer countInteger = (Integer) g4Dao.queryForObject("prepareChangeLeafOfDeletedParentForEadept", pDto);
	        if (countInteger.intValue() == 0) {
	            pDto.put("leaf", ArmConstants.LEAF_Y);
	        } else {
	            pDto.put("leaf", ArmConstants.LEAF_N);
	        }
	        g4Dao.update("updateLeafFieldInEaDept", pDto);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
		
	}

	/**
	 * 删除部门项
	 * 
	 * @param pDto
	 * @return
	 */
	public synchronized Dto deleteDeptItems(Dto pDto) throws ApplicationException{
		Dto outDto = new BaseDto();
		Dto dto = new BaseDto();
		try {
		    if (pDto.getAsString("type").equals("1")) {
	            // 列表复选删除
	            String[] arrChecked = pDto.getAsString("strChecked").split(",");
	            for (int i = 0; i < arrChecked.length; i++) {
	                dto.put("deptid", arrChecked[i]);
	                deleteDept(dto);
	            }
	        } else {
	            // 部门树右键删除
	            dto.put("deptid", pDto.getAsString("deptid"));
	            deleteDept(dto);
	        }
	        outDto.put("success", new Boolean(true));
	        outDto.put("msg", "部门数据删除成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
		
		return outDto;
	}

	/**
	 * 删除部门 类内部调用
	 * 
	 * @param pDto
	 */
	private void deleteDept(Dto pDto) throws ApplicationException{
		Dto changeLeafDto = new BaseDto();
		try {
		    changeLeafDto.put("parentid", ((BaseDto) g4Dao.queryForObject("queryDeptItemsByDto", pDto))
	                .getAsString("parentid"));
	        g4Dao.delete("deleteEaroleAuthorizeInDeptManage", pDto);
	        g4Dao.delete("deleteEaroleInDeptManage", pDto);
	        g4Dao.delete("deleteEauserauthorizeInDeptManage", pDto);
//	        g4Dao.delete("deleteEauserauthorizeInDeptManage2", pDto);
	        g4Dao.delete("deleteEauserInDeptManage", pDto);
	        g4Dao.delete("deleteEausermenumapInDeptManage", pDto);
	        g4Dao.update("updateEadeptItem", pDto);
	        changeLeafOfDeletedParent(changeLeafDto);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
		
	}

	/**
	 * 根据用户所属部门编号查询部门对象<br>
	 * 用于构造组织机构树的根节点
	 * 
	 * @param
	 * @return
	 */
	public Dto queryDeptinfoByDeptid(Dto pDto) throws ApplicationException{
		Dto outDto = new BaseDto();
		try {
		    outDto.putAll((BaseDto) g4Dao.queryForObject("queryDeptinfoByDeptid", pDto));
	        outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
		
		return outDto;
	}

	/**
	 * 保存用户主题信息
	 * 
	 * @param pDto
	 */
	public Dto saveUserTheme(Dto pDto) throws ApplicationException{
		Dto outDto = new BaseDto();
		try {
		    g4Dao.update("saveUserTheme", pDto);
	        outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
		return outDto;
	}

    /**
     * 保存用户布局信息
     *
     * @param pDto
     */
    public Dto saveUserLayout(Dto pDto) {
        Dto outDto = new BaseDto();
        g4Dao.insert("saveUserLayout", pDto);
        outDto.put("success", new Boolean(true));
        return outDto;
    }

}
