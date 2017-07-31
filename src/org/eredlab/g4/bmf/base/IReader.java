package org.eredlab.g4.bmf.base;

import java.util.List;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 数据读取器<br>
 * 基于iBatis实现,只有query权限,提供在Action中使用
 * @author XiongChun
 * @since 2009-07-23
 * @see com.ibatis.dao.client.Dao
 */
public interface IReader {
    
    /**
     * 查询一条记录
     * @param SQL语句ID号
     * @param parameterObject 查询条件对象(map javaBean)
     */
    public Object queryForObject(String statementName, Object parameterObject) throws ApplicationException;
    
    /**
     * 查询一条记录
     * @param SQL语句ID号
     */
    public Object queryForObject(String statementName) throws ApplicationException;
    
    /**
     * 查询记录集合
     * @param SQL语句ID号
     * @param parameterObject 查询条件对象(map javaBean)
     */
    public List queryForList(String statementName, Object parameterObject) throws ApplicationException;
    
    /**
     * 查询记录集合
     * @param SQL语句ID号
     */
    public List queryForList(String statementName) throws ApplicationException;

    /**
     * 按分页查询
     * 
     * @param SQL语句ID号
     * @param parameterObject
     *            查询条件对象(map javaBean)
     */
    public List queryForPage(String statementName,  Dto qDto) throws ApplicationException;

    /**
     * 查询页面分页
     * @param SQL语句ID号
     * @param parameterObject 查询条件对象(map javaBean)
     */
    public Integer queryForPageCount(String statementName,Dto qDto) throws ApplicationException;
}
