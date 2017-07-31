package org.eredlab.g4.bmf.base;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.cnnct.common.ApplicationException;
import com.ibatis.sqlmap.client.SqlMapExecutor;

/**
 * sqlserver Dao<br>
 * 
 * @author xutj
 * @since 2015年9月1日16:09:21
 */
public class IDaoSImpl extends SqlMapClientDaoSupport implements IDao {
	
	 private static Log log = LogFactory.getLog(IDaoImpl.class);
	    /**
	     * 插入一条记录
	     * 
	     * @param SQL语句ID号
	     * @param parameterObject
	     *            要插入的对象(map javaBean)
	     */
	    public Object insert(String statementName, Object parameterObject) throws ApplicationException {
	        Object o = new Object();
	        try {
	            o = super.getSqlMapClientTemplate().insert(statementName, parameterObject);
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }
	        return o;
	    }

	    /**
	     * 插入一条记录
	     * 
	     * @param SQL语句ID号
	     */
	    public void insert(String statementName) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().insert(statementName, new BaseDto());
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }
	    }

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
	     * 分页查询时查询总行数
	     *
	     * @param SQL语句ID号
	     * @param parameterObject
	     *            查询条件对象(map javaBean)
	     */
	    public Integer queryForPageCount(String statementName, Dto qDto) throws ApplicationException {
	        qDto.put("queryForPageCountFlag","queryForPageCountFlag");//查询总行数标记
	        try {
	            Object obj = super.getSqlMapClientTemplate().queryForObject(statementName, qDto);
	            if(obj instanceof  Dto){
	                Dto dto = (Dto)obj;
	                return dto.getAsInteger("pagecount");
	            }else{
	                return 0;
	            }

	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }

	    }

	    /**
	     * 更新记录
	     * 
	     * @param SQL语句ID号
	     * @param parameterObject
	     *            更新对象(map javaBean)
	     */
	    public void update(String statementName, Object parameterObject) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().update(statementName, parameterObject);
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }
	    }

	    /**
	     * 更新记录
	     * 
	     * @param SQL语句ID号
	     */
	    public void update(String statementName) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().update(statementName, new BaseDto());
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }
	    }

	    /**
	     * 删除记录
	     * 
	     * @param SQL语句ID号
	     * @param parameterObject
	     *            更新对象(map javaBean)
	     */
	    public void delete(String statementName, Object parameterObject) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().delete(statementName, parameterObject);
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }
	    }

	    /**
	     * 删除记录
	     * 
	     * @param SQL语句ID号
	     */
	    public void delete(String statementName) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().delete(statementName, new BaseDto());
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }
	    }

	    /**
	     * 批量保存（基于Dto）
	     * 
	     * @param memberList
	     *            list集合(org.eredlab.g4.ccl.datastructure.Dto)
	     * @param statement
	     *            sql语句ID
	     * @throws ApplicationException
	     */
	    public void batchInsertBaseDto(final String statement, final List<Dto> memberList) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().execute(new SqlMapClientCallback() {
	                public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
	                    executor.startBatch();
	                    int batch = 0;
	                    for (Dto dto : memberList) {
	                        // 参数1为：ibatis中需要执行的语句的id
	                        executor.insert(statement, dto);
	                        batch++;
	                        // 每500条批量提交一次。
	                        if (batch == 500) {
	                            executor.executeBatch();
	                            batch = 0;
	                        }
	                    }
	                    executor.executeBatch();
	                    return null;
	                }
	            });
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }

	    }

	    /**
	     * 批量删除（基于Dto）
	     * 
	     * @param memberList
	     *            list集合(org.eredlab.g4.ccl.datastructure.Dto)
	     * @param statement
	     *            sql语句ID
	     * @throws ApplicationException
	     */
	    public void batchDelBaseDto(final List<Dto> memberList, final String statement) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().execute(new SqlMapClientCallback() {
	                public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
	                    executor.startBatch();
	                    int batch = 0;
	                    for (Dto dto : memberList) {
	                        // 参数1为：ibatis中需要执行的语句的id
	                        executor.delete(statement, dto);
	                        batch++;
	                        // 每500条批量提交一次。
	                        if (batch == 500) {
	                            executor.executeBatch();
	                            batch = 0;
	                        }
	                    }
	                    executor.executeBatch();
	                    return null;
	                }
	            });
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }

	    }

	    /**
	     * 批量修改（基于Dto）
	     * 
	     * @param memberList
	     *            list集合(org.eredlab.g4.ccl.datastructure.Dto)
	     * @param statement
	     *            sql语句ID
	     * @throws ApplicationException
	     */
	    public void batchUpdateBaseDto(final String statement, final List<Dto> memberList) throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().execute(new SqlMapClientCallback() {
	                public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
	                    executor.startBatch();
	                    int batch = 0;
	                    for (Dto dto : memberList) {
	                        // 参数1为：ibatis中需要执行的语句的id
	                        executor.update(statement, dto);
	                        batch++;
	                        // 每500条批量提交一次。
	                        if (batch == 500) {
	                            executor.executeBatch();
	                            batch = 0;
	                        }
	                    }
	                    executor.executeBatch();
	                    return null;
	                }
	            });
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }

	    }

	    /**
	     * 批量新增
	     * 
	     * @param memberList
	     *            集合
	     * @param statement
	     *            insert方法id
	     * @throws ApplicationException
	     */
	    public void batchInsert(final List<HashMap<String, Object>> memberList, final String statement)
	            throws ApplicationException {
	        try {
	            super.getSqlMapClientTemplate().execute(new SqlMapClientCallback() {
	                public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
	                    executor.startBatch();
	                    int batch = 0;
	                    for (HashMap<String, Object> map : memberList) {
	                        // 参数1为：ibatis中需要执行的语句的id
	                        executor.insert(statement, map);
	                        batch++;
	                        // 每500条批量提交一次。
	                        if (batch == 500) {
	                            executor.executeBatch();
	                            batch = 0;
	                        }
	                    }
	                    executor.executeBatch();
	                    return null;
	                }
	            });
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }

	    }

	    /**
	     * 批量新增
	     * 
	     * @param memberList
	     *            集合
	     * @param statement
	     *            insert方法id
	     * @throws ApplicationException
	     */
	    public void batchCreate(final List<HashMap<String, Object>> memberList, final String statement)
	            throws ApplicationException {
	        try {
	            SqlMapClientCallback callback = new SqlMapClientCallback() {
	                public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
	                    executor.startBatch();
	                    for (HashMap<String, Object> tObject : memberList) {
	                        executor.insert(statement, tObject); // statement在*MapSql.xml一条语句的id
	                    }
	                    executor.executeBatch();
	                    return null;
	                }
	            };
	        } catch (Exception e) {
	            throw new ApplicationException(e.getMessage(), e);
	        }

	    }
	    
	    public void changeDataSource(DataSource dataSourceId){
	    	try {
	    		
				super.setDataSource(dataSourceId);
			} catch (Exception e) {
				throw new ApplicationException(e.getMessage(), e);
			}
	    }
	}
