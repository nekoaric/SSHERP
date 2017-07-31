package org.eredlab.g4.bmf.base;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.cnnct.common.ApplicationException;

/**
 * 数据读取器<br>
 * 基于iBatis实现,只有query权限,提供在Action中使用
 * 
 * @author XiongChun
 * @since 2009-07-23
 * @see org.springframework.orm.ibatis.support.SqlMapClientDaoSupport
 */
public class IReaderImpl extends SqlMapClientDaoSupport implements IReader {
    private static Log log = LogFactory.getLog(IReaderImpl.class);

    /**
     * 查询一条记录
     * 
     * @param SQL语句ID号
     * @param parameterObject
     *            查询条件对象(map javaBean)
     */
    public Object queryForObject(String statementName, Object parameterObject) throws ApplicationException {
        try {
            return super.getSqlMapClientTemplate().queryForObject(statementName, parameterObject);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

    }

    /**
     * 查询一条记录
     * 
     * @param SQL语句ID号
     */
    public Object queryForObject(String statementName) throws ApplicationException {
        try {
            return super.getSqlMapClientTemplate().queryForObject(statementName, new BaseDto());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
    }

    /**
     * 查询记录集合
     * 
     * @param SQL语句ID号
     * @param parameterObject
     *            查询条件对象(map javaBean)
     */
    public List queryForList(String statementName, Object parameterObject) throws ApplicationException {
        try {
            return super.getSqlMapClientTemplate().queryForList(statementName, parameterObject);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
    }

    /**
     * 按分页查询
     * 
     * @param SQL语句ID号
     * @param parameterObject
     *            查询条件对象(map javaBean)
     */
    public List queryForPage(String statementName, Dto qDto) throws ApplicationException {
        try {
            if(qDto.getAsInteger("start")==null){
                qDto.put("start", 0);
                log.warn("缺失分页起始参数,后台已经为你自动赋值，但建议您参照标准范例");
            }

            if(qDto.getAsInteger("end")==null){
                qDto.put("end", 999999);
                log.warn("缺失分页终止参数,后台已经为你自动赋值，但建议您参照标准范例");
            }

            return super.getSqlMapClientTemplate().queryForList(statementName, qDto,
                    qDto.getAsInteger("start").intValue(), qDto.getAsInteger("end").intValue());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

    }

    /**
     * 查询记录集合
     * 
     * @param SQL语句ID号
     */
    public List queryForList(String statementName) throws ApplicationException {
        try {
            return super.getSqlMapClientTemplate().queryForList(statementName, new BaseDto());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
    }

    /**
     * 分页查询时查询总行数
     *
     * @param SQL语句ID号
     * @param parameterObject
     *            查询条件对象(map javaBean)
     */
    public Integer queryForPageCount(String statementName, Dto qDto) throws ApplicationException {
        Dto dto = new BaseDto();
        dto.putAll(qDto);
        dto.put("queryForPageCountFlag","queryForPageCountFlag");//查询总行数标记
        try {
            Object obj = super.getSqlMapClientTemplate().queryForObject(statementName, dto);
            if(obj instanceof  Dto){
                Dto outDto = (Dto)obj;
                return outDto.getAsInteger("pagecount");
            }else{
                return 0;
            }

        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

    }
}