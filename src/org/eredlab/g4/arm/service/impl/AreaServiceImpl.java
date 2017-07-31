package org.eredlab.g4.arm.service.impl;

import java.util.List;

import com.cnnct.util.ArmConstants;
import org.eredlab.g4.arm.service.AreaService;
import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

public class AreaServiceImpl extends BaseServiceImpl implements AreaService {
    public Dto queryAreaItems(Dto pDto) {
        Dto outDto = new BaseDto();
        List menuList = g4Dao.queryForList("queryAreaItemsByDto", pDto);
        Dto menuDto = new BaseDto();
        for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            if (menuDto.getAsString("leaf").equals(ArmConstants.LEAF_Y))
                menuDto.put("leaf", new Boolean(true));
            else
                menuDto.put("leaf", new Boolean(false));
        }
        outDto.put("jsonString", JsonHelper.encodeObject2Json(menuList));
        return outDto;
    }

    /**
     * 保存地区信息
     * 
     * @param pDto
     * @return
     */
    public Dto saveAreaItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            String menuid = IdGenerator.getAreaIdGenerator(pDto.getAsString("parentid"));
            pDto.put("menuid", menuid);
            if (pDto.getAsString("parentid").length() == 2) {
//                pDto.put("menutype", ArmConstants.AREA_SF);
            }
            if (pDto.getAsString("parentid").length() == 4) {
//                pDto.put("menutype", ArmConstants.AREA_SQ);
            }
            if (pDto.getAsString("parentid").length() == 6) {
//                pDto.put("menutype", ArmConstants.AREA_CQ);
            }
            if (pDto.getAsString("parentid").length() == 8) {
//                pDto.put("menutype", ArmConstants.AREA_JD);
            }
            pDto.put("leaf", ArmConstants.LEAF_Y);
            g4Dao.insert("saveAreaItem", pDto);
            Dto updateDto = new BaseDto();
            updateDto.put("menuid", pDto.getAsString("parentid"));
            updateDto.put("leaf", ArmConstants.LEAF_N);
            g4Dao.update("updateLeafFieldInArea", updateDto);
            outDto.put("msg", "地区数据新增成功");
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 修改地区信息
     * 
     * @param pDto
     * @return
     */
    public Dto updateAreaItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            if (pDto.getAsString("parentid").equals(pDto.getAsString("parentid_old"))) {
                pDto.remove("parentid");
                g4Dao.update("updateAreaItem", pDto);
            } else {
                g4Dao.delete("deleteAreaItem", pDto);
                saveAreaItem(pDto);
                pDto.put("parentid", pDto.getAsString("parentid_old"));
                changeLeafDeletedParent(pDto);
            }
            outDto.put("success", new Boolean(true));
            outDto.put("msg", "地区信息数据修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /**
     * 调整被删除菜单的直系父级菜单的Leaf属性
     * 
     * @param pDto
     */
    private void changeLeafDeletedParent(Dto pDto) throws ApplicationException {
        try {
            String parentid = pDto.getAsString("parentid");
            pDto.put("menuid", parentid);
            Integer countInteger = (Integer) g4Dao.queryForObject("changeLeafOfDeletedParent", pDto);
            if (countInteger.intValue() == 0) {
                pDto.put("leaf", ArmConstants.LEAF_Y);
            } else {
                pDto.put("leaf", ArmConstants.LEAF_N);
            }
            g4Dao.update("updateLeafFieldInEaMenu", pDto);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
    }

    /***
     * 行业类别信息保存
     */
    public Dto saveAplCodeItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Dto dto1 = new BaseDto();
            Dto dto2 = new BaseDto();
            dto1.put("menuid", pDto.getAsString("prv_code"));
            dto2.put("menuid", pDto.getAsString("city_code"));
            pDto.put("prv_code", (String) g4Dao.queryForObject("getAreaIdByMenuId", dto1));
            pDto.put("city_code", (String) g4Dao.queryForObject("getAreaIdByMenuId", dto2));
            g4Dao.insert("saveAplCodeItem", pDto);
            outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 行业类别修改
     */
    public Dto updateAplCodeItem(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.update("updateAplCodeItem", pDto);
            outDto.put("success", new Boolean(true));
            outDto.put("msg", "行业类别信息修改成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     ** 行业类别删除
     */
    public Dto deleteAplCodeItem(List<Dto> memberList) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Dto dto = memberList.get(0);
            Dto dto1 = new BaseDto();
            Dto dto2 = new BaseDto();
            dto1.put("menuid", dto.getAsString("prv_code"));
            dto2.put("menuid", dto.getAsString("city_code"));
            dto.put("prv_code", (String) g4Dao.queryForObject("getAreaIdByMenuId", dto1));
            dto.put("city_code", (String) g4Dao.queryForObject("getAreaIdByMenuId", dto2));
            dto.put("apl_code", dto.getAsString("apl_code"));
            dto.put("apltype", " ");
            g4Dao.update("updateAplCodeSysGrp", dto);// 修改单位中的行业代码 为空
            g4Dao.delete("deleteAplCodeItem", dto);
            outDto.put("success", new Boolean(true));
            outDto.put("msg", "行业类别信息删除成功!");
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }
}
