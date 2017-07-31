package org.eredlab.g4.arm.service;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

public interface AreaService extends BaseService {
    /**
     * 查询地区信息 生成菜单树
     * 
     * @param pDto
     * @return
     */
    public Dto queryAreaItems(Dto pDto) throws ApplicationException;

    /**
     * 保存地区信息
     * 
     * @param pDto
     * @return
     */
    public Dto saveAreaItem(Dto pDto)throws ApplicationException;

    /**
     * 修改地区信息
     * 
     * @param pDto
     * @return
     */
    public Dto updateAreaItem(Dto pDto)throws ApplicationException;

    /***
     * 行业类别信息保存
     * @param pDto
     * @return
     */
    public Dto saveAplCodeItem(Dto pDto)throws ApplicationException;
    
    /**
     * 修改行业信息
     * 
     * @param pDto
     * @return
     */
    public Dto updateAplCodeItem(Dto pDto)throws ApplicationException;
    
    
    /***
     * 删除行业信息
     * @param pDto
     * @return
     */
    public Dto deleteAplCodeItem(List<Dto> memberList)throws ApplicationException;
}
