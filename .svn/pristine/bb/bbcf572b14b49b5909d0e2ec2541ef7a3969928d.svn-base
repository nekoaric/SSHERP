package com.cnnct.sys.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.ManageTeamService;
import com.cnnct.util.G4Utils;

/************************************************
 * 创建日期：2013-9-3
 * 创建作者：zhouww
 * 功能：
 * 最后修改时间：
 * 修改功能：
 ************************************************/
@SuppressWarnings("unchecked")
public class ManageTeamServiceImpl extends BaseServiceImpl implements ManageTeamService {
/**
 * 新增班组 
 */
	public Dto saveTeamGrpInfo(Dto grpDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		try {
			//默认没有加1
			Integer team_grp_no = (Integer)g4Dao.queryForObject("queryTeamGrpNo", grpDto);
			if(team_grp_no==null){
				team_grp_no=0;
			}
		    grpDto.put("team_grp_no", team_grp_no+1);
	        int count=(Integer) g4Dao.queryForObject("queryCountTeamGrpName", grpDto);
	        if(count>0){
	            outDto.put("msg", "已经存在一个"+grpDto.getAsString("name")+",请勿重复添加!");
	            outDto.put("success", new Boolean(false)); 
	            return outDto;
	        }
	        
	        g4Dao.insert("saveTeamGrpInfo", grpDto);
	        outDto.put("msg", "班组信息新增成功");
	        outDto.put("success", new Boolean(true));
	        
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(),e);
        }
        return outDto;
	}
	/**
	 * 删除班组的操作
	 */
	public Dto delTeamGrpInfo(Dto areaDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		try {
			Integer count = (Integer)g4Dao.queryForObject("queryTeamGrpListNum", areaDto);
			if(count>0){
				outDto.put("msg", "班组中已有设置的信息,请先</br>删除信息!");
		        outDto.put("success", new Boolean(false));
		        return outDto;
			}
	        g4Dao.delete("delTeamGrpDef", areaDto);
	        outDto.put("msg", "班组数据删除成功");
	        outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(),e);
        }
        return outDto;
	}
	/**
	 */
	public Dto saveTeamGrpList(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		Dto listDto = new BaseDto();
		Dto qDto = new BaseDto();
		Dto updateDto = new BaseDto();
        List list = pDto.getDefaultAList();
		try {
	        g4Dao.batchInsert(list, "saveTeamGrpList");
	        outDto.put("msg", "班组数据保存成功");
	        outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException(e.getMessage(),e);
        }
        return outDto;
	}

	public Dto delTeamGrpList(List list) throws ApplicationException {
		Dto outDto = new BaseDto();
		try {
	        g4Dao.batchUpdateBaseDto("delTeamGrpList",list);
//	        Dto listDto=(BaseDto)list.get(0);
//
//			Dto scheDto = new BaseDto();
//			scheDto.put("team_grp_no",listDto.getAsString("team_grp_no"));
//			scheDto.put("type", "2");
//			scheDto.put("status", "2");
//			g4Dao.update("updateTeamScheBookStatus", scheDto);
	        outDto.put("msg", "班组数据删除成功");
	        outDto.put("success", new Boolean(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(),e);
        }
        return outDto;
	}


    /**
     * 班组导入
     */
	public Dto importTeamsList(Dto pDto) throws ApplicationException {
		List teams = pDto.getDefaultAList();
		try{
			g4Dao.batchInsert(teams, "batchTeamInfoImport");
		}catch (Exception e){
			e.printStackTrace();
			throw new ApplicationException("班组批量导入失败");
		}
		return null;
	}


}
