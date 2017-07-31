package com.cnnct.dataInterface;


import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 提供数据检查的统一接口
 * @author zhouww
 *
 */
public interface ValideData {
    /**
     * 数据检查的统一入口
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public void valideDate() throws ApplicationException;
}
