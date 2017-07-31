package org.eredlab.g4.bmf.base;

import java.util.HashMap;
import java.util.List;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 数据访问接口(原生)<br>
 * 基于iBatis实现,支持自定义的数据操作
 * 
 * @author XiongChun
 * @since 2009-07-23
 * @see com.ibatis.dao.client.Dao
 */
public interface IDao {
	/**
	 * 插入一条记录
	 * @param SQL语句ID号
	 * @param parameterObject 要插入的对象(map javaBean)
	 */
	public Object insert(String statementName, Object parameterObject) throws ApplicationException;
	
	/**
	 * 插入一条记录
	 * @param SQL语句ID号
	 */
	public void insert(String statementName) throws ApplicationException;
	
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
	public List queryForList(String statementName, Object parameterObject)throws ApplicationException;
	
	/**
	 * 查询记录集合
	 * @param SQL语句ID号
	 */
	public List queryForList(String statementName)throws ApplicationException;
	
	/**
	 * 按分页查询
	 * 
	 * @param SQL语句ID号
	 * @param parameterObject
	 *            查询条件对象(map javaBean)
	 */
	public List queryForPage(String statementName, Dto qDto)throws ApplicationException;


    /**
     * 查询页面分页
     * @param SQL语句ID号
     * @param parameterObject 查询条件对象(map javaBean)
     */
    public Integer queryForPageCount(String statementName,Dto qDto) throws ApplicationException;

	/**
	 * 更新记录
	 * @param SQL语句ID号
	 * @param parameterObject 更新对象(map javaBean)
	 */
	public void update(String statementName, Object parameterObject)throws ApplicationException;
	
	/**
	 * 更新记录
	 * @param SQL语句ID号
	 */
	public void update(String statementName)throws ApplicationException;
	
	/**
	 * 删除记录
	 * @param SQL语句ID号
	 * @param parameterObject 更新对象(map javaBean)
	 */
	public void delete(String statementName, Object parameterObject)throws ApplicationException;
	
	/**
	 * 删除记录
	 * @param SQL语句ID号
	 */
	public void delete(String statementName)throws ApplicationException;
	
	/**
	 * 批量新增
	 * @param memberList 集合
	 * @param statement insert方法id
	 * @throws ApplicationException
	 */
	public void batchInsert(final List<HashMap<String, Object>> memberList, final String statement)
			throws ApplicationException;
	
	/**
	 * 批量新增
	 * @param memberList 集合
	 * @param statement insert方法id
	 * @throws ApplicationException
	 */
	public void batchCreate(final List<HashMap<String, Object>> memberList, final String statement) throws ApplicationException;
	
	/**
	 * 批量删除（基于Dto）
	 * @param memberList list集合(org.eredlab.g4.ccl.datastructure.Dto)
	 * @param statement sql语句ID
	 * @throws ApplicationException
	 */
	public void batchDelBaseDto(final List<Dto> memberList, final String statement) throws ApplicationException;
	/**
	 * 批量修改（基于Dto）
	 * @param memberList list集合(org.eredlab.g4.ccl.datastructure.Dto)
	 * @param statement sql语句ID
	 * @throws ApplicationException
	 */
	public void batchUpdateBaseDto(final String statement,final List<Dto> memberList) throws ApplicationException;
	
	/**
	 * 批量新增（基于Dto）
	 * @param memberList list集合(org.eredlab.g4.ccl.datastructure.Dto)
	 * @param statement sql语句ID
	 * @throws ApplicationException
	 */
	public void batchInsertBaseDto(final String statement,final List<Dto> memberList) throws ApplicationException;
}
