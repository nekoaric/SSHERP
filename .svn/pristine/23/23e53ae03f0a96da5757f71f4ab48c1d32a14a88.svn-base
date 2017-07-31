package org.eredlab.g4.arm.service.impl;
import com.cnnct.common.ApplicationException;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.arm.service.DutyService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import java.util.List;

public class DutyServiceImpl  extends BaseServiceImpl implements DutyService{
    /**
     * 保存职务信息表
     */
    public synchronized Dto saveDutyItem(Dto pDto){
        Dto outDto = new BaseDto();
        int duty_id =0;
        if (G4Utils.isOracle()) {
			duty_id=(Integer) g4Dao.queryForObject("queryMaxDutyId",pDto);
		} else if (G4Utils.isMysql()){
            duty_id=(Integer)g4Dao.queryForObject("queryMaxDutyIdMysql",pDto)+1;
        }
        
        if(duty_id>255){
            outDto.put("msg", "职务编号最大值为255");
            outDto.put("failure", new Boolean(true));   
        }else{
            pDto.put("duty_id", duty_id);
            g4Dao.insert("saveDutyItem", pDto);

            outDto.put("msg", "职务信息新增成功");
            outDto.put("success", new Boolean(true));
        }
        return outDto;
    }

    /**
     * 删除职务信息
     * 
     * @param pDto
     */
    public synchronized Dto deleteDutyItem(Dto pDto){
        Dto outDto = new BaseDto();
        Dto dto = new BaseDto();
        String[] arrChecked = pDto.getAsString("strChecked").split(",");
        for(int i = 0; i < arrChecked.length; i++){
            dto.put("duty_id", arrChecked[i]);
            dto.put("grp_id", pDto.getAsString("grp_id"));
            Integer count =(Integer)g4Dao.queryForObject("getCountFromEauserByDuty",dto);
            if(count>0){
            	outDto.put("success", new Boolean(false));
                outDto.put("msg", "职务信息已使用,请先取消!");
                return outDto;
            }
            g4Dao.delete("deletDutyItem", dto);
        }
        outDto.put("success", new Boolean(true));
        outDto.put("msg", "职务信息删除成功!");
        return outDto;
    }

    /**
     * 修改职务信息
     * 
     * @param pDto
     */
    public synchronized Dto updateDutyItem(Dto pDto){
        Dto outDto = new BaseDto();
        g4Dao.update("updateDutyItem", pDto);

        outDto.put("success", new Boolean(true));
        outDto.put("msg", "职务信息修改成功!");
        return outDto;
    }

    public void updateUserPerm4DutyUpdate(Dto dto) throws ApplicationException{
        try{
        //更新类型 0-部分更新 1-全部更新
        String flag= dto.getAsString("flag");
        List userList = g4Dao.queryForList("getDataPermByDuty",dto);
        String deptperm = dto.getAsString("deptperm");
        //查找出需要更新的人
        if("0".equals(flag)){//部分更新
            //1.有特殊授权;2.职务有部门权限但是有员工不是部门授权;3.职务没有有部门权限但是有员工有数据权限
            for(int i=0;i<userList.size();i++){
                Dto userDto = (BaseDto)userList.get(i);
                String roleType = userDto.getAsString("roletype");
                String notes = userDto.getAsString("notes");
                Integer special_num = userDto.getAsInteger("special_num");

                if(special_num!=null&&special_num>0){//有特殊权限
                    userList.remove(i);
                    i--;
                }else {
                    //职务有部门权限但是有员工不是部门授权
                    if("1".equals(deptperm)&&(!roleType.equals("3")||!notes.equals("localdept"))){
                        userList.remove(i);
                        i--;
                    }else if("0".equals(deptperm)&&(!roleType.equals("3")||!notes.equals("localdept"))){
                        userList.remove(i);
                        i--;
                    }
                }
            }
        }else{//

        }
        //更新权限
        Dto qDto = new BaseDto();
        String localDeptRoleId="",userRoleId;
        if("1".equals(deptperm)){
            qDto.put("notes","localdept");
            localDeptRoleId= (String)g4Dao.queryForObject("getEaDataRoleIdByNotes",qDto);

            qDto.put("notes","deptperm");
            userRoleId  = (String)g4Dao.queryForObject("getEaRoleIdByNotes",qDto);
        }else{
            qDto.put("notes","userperm");
            userRoleId = (String)g4Dao.queryForObject("getEaRoleIdByNotes",qDto);
        }

        for(int i=0;i<userList.size();i++){
            //更新用户权限信息
            Dto pDto = (BaseDto)userList.get(i);

            if("1".equals(deptperm)){//职务中设置具有本部门查询权限

                if(G4Utils.isNotEmpty(localDeptRoleId)){
                    pDto.put("roleid",localDeptRoleId);
                    g4Dao.insert("saveEauserRoleMap", pDto);
                }
                //菜单权限
                g4Dao.delete("deleteEaUserAuthorizeByUserId",pDto);
                if(G4Utils.isNotEmpty(userRoleId)){
                    pDto.put("roleid",userRoleId);
                    pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
                    g4Dao.insert("saveSelectedRole", pDto);
                }
            }else {

                g4Dao.delete("deleteEauserDataAuthorize4UserGrant",pDto);
                g4Dao.delete("deleteEauserRoleMapByUserId",pDto);

                //菜单权限
                g4Dao.delete("deleteEaUserAuthorizeByUserId",pDto);
                if(G4Utils.isNotEmpty(userRoleId)){
                    pDto.put("roleid",userRoleId);
                    pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
                    g4Dao.insert("saveSelectedRole", pDto);
                }
            }

        }
        }catch (Exception e){
            e.printStackTrace();;
            throw new ApplicationException("权限更新失败!");
        }

    }
}
