package com.cnnct.sys.service;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;
public interface ManageTeamService extends BaseService{

    public Dto saveTeamGrpInfo(Dto areaDto) throws ApplicationException;
    
    public Dto delTeamGrpInfo(Dto areaDto) throws ApplicationException;

    public Dto saveTeamGrpList(Dto pDto) throws ApplicationException;
    
    public Dto delTeamGrpList(List list) throws ApplicationException;
    
    public Dto importTeamsList(Dto pDto) throws ApplicationException;

}
