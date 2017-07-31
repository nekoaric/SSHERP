package org.eredlab.g4.arm.service;

import com.cnnct.common.ApplicationException;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public interface DutyService extends BaseService{
    /**
     * 保存职务信息表
     */
    public Dto saveDutyItem(Dto pDto);

    /**
     * 删除职务信息
     * 
     * @param pDto
     */
    public Dto deleteDutyItem(Dto pDto);

    /**
     * 修改职务信息
     * 
     * @param pDto
     */
    public Dto updateDutyItem(Dto pDto);

    /**
     * 更新对应职务的权限
     * @param dto
     * @throws ApplicationException
     */
    public void updateUserPerm4DutyUpdate(Dto dto) throws ApplicationException;
}
