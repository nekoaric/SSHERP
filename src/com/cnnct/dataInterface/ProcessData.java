package com.cnnct.dataInterface;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 提供数据处理的统一接口
 * @author zhouww
 *
 */
public interface ProcessData {
    public Dto processData() throws ApplicationException;
}
