package com.cnnct.may.data.process.ordrecordmanager;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.dataInterface.ProcessData;
import com.cnnct.dataInterface.ProcessDataAdapter;

/**
 * 交接记录操作的数据处理
 * @author zhouww
 *
 */
public class OrdRecordmanagerProcessContorl {
    /**
     * 回退数量的数据处理
     * @param inDto
     * @return
     */
    public static Dto rollbackProcess(Dto inDto,IReader dao){
        ProcessDataAdapter pd = new RollbackOrder4DatabaseProcess(inDto,dao);
        return pd.processData();
    }
    /**
     * 修改回退流程的数据处理
     * @param inDto
     * @param dao
     * @return
     */
    public static Dto rollbackProcess4Change(Dto inDto,IDao dao){
        ProcessData pd = new RollbackChange4dbProcess(inDto, dao);
        return pd.processData();
    }
}
