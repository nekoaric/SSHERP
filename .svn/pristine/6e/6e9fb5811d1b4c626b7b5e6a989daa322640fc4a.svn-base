package com.cnnct.sys.service.impl;

import java.util.List;

import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
import com.cnnct.sys.service.DataPermService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

/**
 * 数据权限授权
 * @author may
 * @since 2012-12
 */
public class DataPermServiceImpl extends BaseServiceImpl implements DataPermService{
	
    public Dto saveDataRoleGrant(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        String flag = pDto.getAsString("flag");


        //删除部门,人员,客户,生产通知单,分类授权信息
        String dept_type = BusiConst.DATA_AUTHORITY_TYPE_DEPT;
        String user_type = BusiConst.DATA_AUTHORITY_TYPE_USER;
        String cust_type = BusiConst.DATA_AUTHORITY_TYPE_CUST;
        String prod_ord_type = BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD;

        String relative_type = BusiConst.DATA_AUTHORITY_TYPE_RELATIVE;

        String type = "'"+dept_type+"',"+"'"+cust_type+"',"+"'"+prod_ord_type+"',"+"'"+relative_type+"'";

        //相对授权时删除人员信息
        if(flag.equals("relative")){
            type = type +","+"'"+user_type+"'";
        }
        Dto qDto = new BaseDto();
        qDto.put("role_id",pDto.getAsString("role_id"));
        qDto.put("type",type);
        g4Dao.delete("deleteSysRoleDataAuth4RoleGrant",qDto);

        //保存权限授权信息
        g4Dao.batchInsert(pDto.getDefaultAList(), "saveSysRoleDataAuth");

        outDto.put("success",true);
        outDto.put("msg","数据角色授权成功!");
        return outDto;
    }

    public Dto delUserInfo4RoleData(Dto pDto) throws ApplicationException{
        Dto outDto = new BaseDto();
        List list = pDto.getDefaultAList();
        for(int i=0;i<list.size();i++){
            Dto dto = (BaseDto)list.get(i);
            g4Dao.delete("deleteSysRoleDataAuth4DeleteUser",dto);
        }

        outDto.put("success",true);
        outDto.put("msg","人员权限删除成功!");
        return outDto;
    }

    public Dto saveDataUserGrant(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        Dto qDto = new BaseDto();
        qDto.put("userid",pDto.getAsString("userid"));
        //删除部门授权信息
        String dept_type = BusiConst.DATA_AUTHORITY_TYPE_DEPT;

        qDto.put("type",dept_type);
        g4Dao.delete("deleteSysUserDataAuth4DeleteDept",qDto);

        //保存权限授权信息
        g4Dao.batchInsert(pDto.getDefaultAList(), "saveSysUserDataAuth");

        outDto.put("success",true);
        outDto.put("msg","数据角色授权成功!");
        return outDto;
    }

    public Dto delUserInfo4UserData(Dto pDto) throws ApplicationException{
        Dto outDto = new BaseDto();
        List list = pDto.getDefaultAList();
        for(int i=0;i<list.size();i++){
            Dto dto = (BaseDto)list.get(i);
            g4Dao.delete("deleteSysUserDataAuth4DeleteUser",dto);
        }

        outDto.put("success",true);
        outDto.put("msg","人员权限删除成功!");
        return outDto;
    }
}
