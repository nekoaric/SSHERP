package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.MessageService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;

public class MessageServiceImpl extends BaseServiceImpl implements MessageService{

    public Dto updateMessageItem(Dto pDto) throws ApplicationException {
       
        Dto outDto = new BaseDto();
        try {
            g4Dao.update("updateMessageOpenItem", pDto);
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }

}
