/*
 *  Copyright 2004 Clinton Begin
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.ibatis.sqlmap.engine.execution;

import java.sql.BatchUpdateException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import com.cnnct.util.DataPermUtil;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import com.cnnct.util.G4Utils;

import com.ibatis.common.logging.Log;
import com.ibatis.common.logging.LogFactory;
import com.ibatis.sqlmap.engine.impl.ExtendedSqlMapClient;
import com.ibatis.sqlmap.engine.impl.SqlMapExecutorDelegate;
import com.ibatis.sqlmap.engine.mapping.parameter.BasicParameterMapping;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMap;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMapping;
import com.ibatis.sqlmap.engine.mapping.result.ResultMap;
import com.ibatis.sqlmap.engine.mapping.result.ResultObjectFactoryUtil;
import com.ibatis.sqlmap.engine.mapping.statement.DefaultRowHandler;
import com.ibatis.sqlmap.engine.mapping.statement.MappedStatement;
import com.ibatis.sqlmap.engine.mapping.statement.RowHandlerCallback;
import com.ibatis.sqlmap.engine.scope.ErrorContext;
import com.ibatis.sqlmap.engine.scope.RequestScope;
import com.ibatis.sqlmap.engine.scope.SessionScope;

/**
 * Class responsible for executing the SQL 支持打印带参数的完整SQL语句 XiongChun 修改
 * 执行查询时传入当前用户信息拼接sql实现权限控制 may修改
 */
public class SqlExecutor {
    //
    private static Log log = LogFactory.getLog(SqlExecutor.class);
    //
    // Constants
    //
    /**
     * Constant to let us know not to skip anything
     */
    public static final int NO_SKIPPED_RESULTS = 0;
    /**
     * Constant to let us know to include all records
     */
    public static final int NO_MAXIMUM_RESULTS = -999999;

    //
    // Public Methods
    //

    /**
     * Execute an update
     *
     * @param request
     *            - the request scope
     * @param conn
     *            - the database connection
     * @param sql
     *            - the sql statement to execute
     * @param parameters
     *            - the parameters for the sql statement
     * @return - the number of records changed
     * @throws SQLException
     *             - if the update fails
     */
    public int executeUpdate(RequestScope request, Connection conn, String sql, Object[] parameters)
            throws SQLException {
        PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.G4);
        // 获取监控开关参数
        String jdbcMonitor = pHelper.getValue("jdbcMonitor", "0");
        boolean flag = jdbcMonitor.equalsIgnoreCase("1") ? true : false;
        ErrorContext errorContext = request.getErrorContext();
        errorContext.setActivity("executing update");
        errorContext.setObjectId(sql);
        PreparedStatement ps = null;
        setupResultObjectFactory(request);
        int rows = 0;
        long time = 0;
        if (flag) {
            time = System.currentTimeMillis();
        }
        try {
            if (log.isDebugEnabled()) {
                outLog(sql, parameters);
            }
            errorContext.setMoreInfo("请检查您的SQL语句 (preparation failed).");
            ps = prepareStatement(request.getSession(), conn, sql);
            setStatementTimeout(request.getStatement(), ps);
            errorContext.setMoreInfo("Check the parameters (set parameters failed).");
            request.getParameterMap().setParameters(request, ps, parameters);
            errorContext.setMoreInfo("请检查您的SQL语句 (update failed).");
            ps.execute();
            rows = ps.getUpdateCount();
        } finally {
            closeStatement(request.getSession(), ps);
        }
        if (flag) {
            time = System.currentTimeMillis() - time;
            jdbcMonitor(conn, sql, parameters, time, rows);
        }
        return rows;
    }

    /**
     * JDBC监控信息持久化
     *
     * @param conn
     * @param sql
     * @param parameters
     * @param time
     */
    private void jdbcMonitor(Connection conn, String sql, Object[] parameters, long time, int rows) throws SQLException {
        String type = null;
        if (sql.indexOf("INSERT") != -1) {
            type = "1";
        }else if (sql.indexOf("UPDATE") != -1) {
            type = "2";
        }else if (sql.indexOf("DELETE") != -1) {
            type = "3";
        }else if (sql.indexOf("SELECT") != -1) {
            type = "4";
        }else {
            type = "0";
        }
        PreparedStatement statement = null;
        String inserSql = "INSERT INTO eajdbcmonitor(monitorid,sqltext,starttime,costtime,rowcount,type) VALUES(?,?,?,?,?,?)";
        statement = conn.prepareStatement(inserSql);
        statement.setString(1, "1000000000");
        statement.setString(2, mergeSQL(sql, parameters));
        statement.setString(3, G4Utils.getCurrentTime());
        statement.setLong(4, new Long(time));
        statement.setInt(5, rows);
        statement.setString(6, type);
        statement.executeUpdate();
        statement.close();
    }

    /**
     * 合并SQL语句和参数集
     *
     * @return
     */
    private String mergeSQL(String sql, Object[] parameters) {
        Object[] myParam = new Object[parameters.length];
        for (int i = 0; i < parameters.length; i++) {
            myParam[i] = parameters[i];
        }
        int count = myParam.length;
        for (int i = 0; i < count; i++) {
            // 针对参数为null的做特殊处理
            myParam[i] = myParam[i] == null ? "" : myParam[i];
            if (sql != null)
                sql = sql.replaceFirst("\\?", myParam[i].getClass().getName().equals("java.lang.String") ? "'"
                        + myParam[i].toString() + "'" : myParam[i].toString());
        }
        if (sql.indexOf("UPDATE") != -1) {
            sql = sql.trim();
            // sql = sql.substring(3);
        } else {
            sql = sql.trim();
            // sql = sql.substring(3);
        }
        return sql;
    }

    /**
     * 日志输出 支持打印带参数执行的完整SQL语句
     *
     * @param sql
     * @param parameters
     */
    private void outLog(String sql, Object[] parameters) {
        String outSql = mergeSQL(sql, parameters);
        if (log.isDebugEnabled()) {
            //log.debug("==带参数执行的完整SQL语句为==\n" + outSql);
            System.out.println("==带参数执行的完整SQL语句为==\n" + outSql);
        }
    }

    /**
     * Adds a statement to a batch
     *
     * @param request
     *            - the request scope
     * @param conn
     *            - the database connection
     * @param sql
     *            - the sql statement
     * @param parameters
     *            - the parameters for the statement
     * @throws SQLException
     *             - if the statement fails
     */
    public void addBatch(RequestScope request, Connection conn, String sql, Object[] parameters) throws SQLException {
        Batch batch = (Batch) request.getSession().getBatch();
        if (batch == null) {
            batch = new Batch();
            request.getSession().setBatch(batch);
        }
        batch.addBatch(request, conn, sql, parameters);
    }

    /**
     * Execute a batch of statements
     *
     * @param session
     *            - the session scope
     * @return - the number of rows impacted by the batch
     * @throws SQLException
     *             - if a statement fails
     */
    public int executeBatch(SessionScope session) throws SQLException {
        int rows = 0;
        Batch batch = (Batch) session.getBatch();
        if (batch != null) {
            try {
                rows = batch.executeBatch();
            } finally {
                batch.cleanupBatch(session);
            }
        }
        return rows;
    }

    /**
     * Execute a batch of statements
     *
     * @param session
     *            - the session scope
     * @return - a List of BatchResult objects (may be null if no batch has been
     *         initiated). There will be one BatchResult object in the list for
     *         each sub-batch executed
     * @throws SQLException
     *             if a database access error occurs, or the drive does not
     *             support batch statements
     * @throws BatchException
     *             if the driver throws BatchUpdateException
     */
    public List executeBatchDetailed(SessionScope session) throws SQLException, BatchException {
        List answer = null;
        Batch batch = (Batch) session.getBatch();
        if (batch != null) {
            try {
                answer = batch.executeBatchDetailed();
            } finally {
                batch.cleanupBatch(session);
            }
        }
        return answer;
    }

    /**
     * Long form of the method to execute a query
     *
     * @param request
     *            - the request scope
     * @param conn
     *            - the database connection
     * @param sql
     *            - the SQL statement to execute
     * @param parameters
     *            - the parameters for the statement
     * @param skipResults
     *            - the number of results to skip
     * @param maxResults
     *            - the maximum number of results to return
     * @param callback
     *            - the row handler for the query
     * @throws SQLException
     *             - if the query fails
     */
    public void executeQuery(RequestScope request, Connection conn, String sql, Object[] parameters, int skipResults,
                             int maxResults, RowHandlerCallback callback) throws SQLException {
        PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.G4);
        // 获取监控开关参数
        String jdbcMonitor = pHelper.getValue("jdbcMonitor", "0");
        boolean flag = jdbcMonitor.equalsIgnoreCase("1") ? true : false;

        String currentLoginedUserId = "";//执行sql查询的用户信息
        String queryForPageCountFlag = "";//语句是否是查询总数的标识
        //获取执行查询语句的用户信息(userid)
        for(int i =0;i<parameters.length;i++){
            Object o = parameters[i];

            if(o instanceof String){
                String str = (String)o;
                if("queryForPageCountFlag".equals(str)){
                    queryForPageCountFlag = "queryForPageCountFlag";
                }
                if(str.startsWith("currentLoginedUserId")){
                    currentLoginedUserId = str;
                }
            }
        }

        //通过对sql解析,拼接用户信息和其他查询信息
        sql = DataPermUtil.getDataQuerySql(sql, currentLoginedUserId, queryForPageCountFlag);
        System.out.println(sql);
        ErrorContext errorContext = request.getErrorContext();
        errorContext.setActivity("executing query");
        errorContext.setObjectId(sql);
        PreparedStatement ps = null;
        ResultSet rs = null;
        setupResultObjectFactory(request);
        long time = 0;
        if (flag) {
            time = System.currentTimeMillis();
        }
        try {
            if (!"queryForPageCountFlag".equals(queryForPageCountFlag)&&(conn.getMetaData().getDatabaseProductName().toLowerCase().indexOf("ora") > -1)) {
                // oracle分页
                if (maxResults != -999999) {
                    sql = pageSqlOracle(sql, skipResults, maxResults);
                }
                skipResults = 0;
                maxResults = -999999;
            } else if(!"queryForPageCountFlag".equals(queryForPageCountFlag)&&conn.getMetaData().getDatabaseProductName().toLowerCase().indexOf("mysql") > -1) {
                // Mysql分页
                if (maxResults != -999999) {
                    sql = pageSqlMysql(sql, skipResults, maxResults);
                }
                skipResults = 0;
                maxResults = -999999;
            }else {
                //others
            }
            if (log.isDebugEnabled()) {
                outLog(sql, parameters);
            }
            errorContext.setMoreInfo("请检查您的SQL语句 (preparation failed).");
            Integer rsType = request.getStatement().getResultSetType();
            if (rsType != null) {
                ps = prepareStatement(request.getSession(), conn, sql, rsType);
            } else {
                ps = prepareStatement(request.getSession(), conn, sql);
            }
            setStatementTimeout(request.getStatement(), ps);
            Integer fetchSize = request.getStatement().getFetchSize();
            if (fetchSize != null) {
                ps.setFetchSize(fetchSize.intValue());
            }
            errorContext.setMoreInfo("Check the parameters (set parameters failed).");
            request.getParameterMap().setParameters(request, ps, parameters);
            errorContext.setMoreInfo("请检查您的SQL语句 (query failed).");
            ps.execute();
            errorContext.setMoreInfo("Check the results (failed to retrieve results).");

            // Begin ResultSet Handling
            rs = handleMultipleResults(ps, request, skipResults, maxResults, callback);
            // End ResultSet Handling
            if (flag) {
                time = System.currentTimeMillis() - time;
                jdbcMonitor(conn, sql, parameters, time, -1);
            }
        } finally {
            try {
                closeResultSet(rs);
            } finally {
                closeStatement(request.getSession(), ps);
            }
        }

    }

    /**
     * Oracle分页SQL语句
     *
     * @param sql
     * @param skipResults
     * @param maxResults
     * @return
     */
    private String pageSqlOracle(String sql, int skipResults, int maxResults) {
        String pageSql = "SELECT * FROM (SELECT page.*, ROWNUM AS rn FROM (" + sql + ") page) WHERE rn BETWEEN "
                + skipResults + " AND " + maxResults;
        return pageSql;
    }

    /**
     * Mysql分页SQL语句
     *
     * @param sql
     * @param skipResults
     * @param maxResults
     * @return
     */
    private String pageSqlMysql(String sql, int skipResults, int maxResults) {
        String pageSql = sql + " limit " + skipResults + ", " + maxResults;
        return pageSql;
    }

    /**
     * Execute a stored procedure that updates data
     *
     * @param request
     *            - the request scope
     * @param conn
     *            - the database connection
     * @param sql
     *            - the SQL to call the procedure
     * @param parameters
     *            - the parameters for the procedure
     * @return - the rows impacted by the procedure
     * @throws SQLException
     *             - if the procedure fails
     */
    public int executeUpdateProcedure(RequestScope request, Connection conn, String sql, Object[] parameters)
            throws SQLException {
        ErrorContext errorContext = request.getErrorContext();
        errorContext.setActivity("executing update procedure");
        errorContext.setObjectId(sql);
        CallableStatement cs = null;
        setupResultObjectFactory(request);
        int rows = 0;
        try {
            errorContext.setMoreInfo("请检查您的SQL语句 (preparation failed).");
            cs = prepareCall(request.getSession(), conn, sql);
            setStatementTimeout(request.getStatement(), cs);
            ParameterMap parameterMap = request.getParameterMap();
            ParameterMapping[] mappings = parameterMap.getParameterMappings();
            errorContext.setMoreInfo("Check the output parameters (register output parameters failed).");
            registerOutputParameters(cs, mappings);
            errorContext.setMoreInfo("Check the parameters (set parameters failed).");
            parameterMap.setParameters(request, cs, parameters);
            errorContext.setMoreInfo("Check the statement (update procedure failed).");
            cs.execute();
            rows = cs.getUpdateCount();
            errorContext.setMoreInfo("Check the output parameters (retrieval of output parameters failed).");
            retrieveOutputParameters(request, cs, mappings, parameters, null);
        } finally {
            closeStatement(request.getSession(), cs);
        }
        return rows;
    }

    /**
     * Execute a stored procedure
     *
     * @param request
     *            - the request scope
     * @param conn
     *            - the database connection
     * @param sql
     *            - the sql to call the procedure
     * @param parameters
     *            - the parameters for the procedure
     * @param skipResults
     *            - the number of results to skip
     * @param maxResults
     *            - the maximum number of results to return
     * @param callback
     *            - a row handler for processing the results
     * @throws SQLException
     *             - if the procedure fails
     */
    public void executeQueryProcedure(RequestScope request, Connection conn, String sql, Object[] parameters,
                                      int skipResults, int maxResults, RowHandlerCallback callback) throws SQLException {
        ErrorContext errorContext = request.getErrorContext();
        errorContext.setActivity("executing query procedure");
        errorContext.setObjectId(sql);
        CallableStatement cs = null;
        ResultSet rs = null;
        setupResultObjectFactory(request);
        try {
            errorContext.setMoreInfo("请检查您的SQL语句 (preparation failed).");
            Integer rsType = request.getStatement().getResultSetType();
            if (rsType != null) {
                cs = prepareCall(request.getSession(), conn, sql, rsType);
            } else {
                cs = prepareCall(request.getSession(), conn, sql);
            }
            setStatementTimeout(request.getStatement(), cs);
            Integer fetchSize = request.getStatement().getFetchSize();
            if (fetchSize != null) {
                cs.setFetchSize(fetchSize.intValue());
            }
            ParameterMap parameterMap = request.getParameterMap();
            ParameterMapping[] mappings = parameterMap.getParameterMappings();
            errorContext.setMoreInfo("Check the output parameters (register output parameters failed).");
            registerOutputParameters(cs, mappings);
            errorContext.setMoreInfo("Check the parameters (set parameters failed).");
            parameterMap.setParameters(request, cs, parameters);
            errorContext.setMoreInfo("Check the statement (update procedure failed).");
            cs.execute();
            errorContext.setMoreInfo("Check the results (failed to retrieve results).");

            // Begin ResultSet Handling
            rs = handleMultipleResults(cs, request, skipResults, maxResults, callback);
            // End ResultSet Handling
            errorContext.setMoreInfo("Check the output parameters (retrieval of output parameters failed).");
            retrieveOutputParameters(request, cs, mappings, parameters, callback);

        } finally {
            try {
                closeResultSet(rs);
            } finally {
                closeStatement(request.getSession(), cs);
            }
        }
    }

    private ResultSet handleMultipleResults(PreparedStatement ps, RequestScope request, int skipResults,
                                            int maxResults, RowHandlerCallback callback) throws SQLException {
        ResultSet rs;
        rs = getFirstResultSet(ps);
        if (rs != null) {
            handleResults(request, rs, skipResults, maxResults, callback);
        }

        // Multiple ResultSet handling
        if (callback.getRowHandler() instanceof DefaultRowHandler) {
            MappedStatement statement = request.getStatement();
            DefaultRowHandler defaultRowHandler = ((DefaultRowHandler) callback.getRowHandler());
            if (statement.hasMultipleResultMaps()) {
                List multipleResults = new ArrayList();
                multipleResults.add(defaultRowHandler.getList());
                ResultMap[] resultMaps = statement.getAdditionalResultMaps();
                int i = 0;
                while (moveToNextResultsSafely(ps)) {
                    if (i >= resultMaps.length)
                        break;
                    ResultMap rm = resultMaps[i];
                    request.setResultMap(rm);
                    rs = ps.getResultSet();
                    DefaultRowHandler rh = new DefaultRowHandler();
                    handleResults(request, rs, skipResults, maxResults, new RowHandlerCallback(rm, null, rh));
                    multipleResults.add(rh.getList());
                    i++;
                }
                defaultRowHandler.setList(multipleResults);
                request.setResultMap(statement.getResultMap());
            } else {
                while (moveToNextResultsSafely(ps))
                    ;
            }
        }
        // End additional ResultSet handling
        return rs;
    }

    private ResultSet getFirstResultSet(Statement stmt) throws SQLException {
        ResultSet rs = null;
        boolean hasMoreResults = true;
        while (hasMoreResults) {
            rs = stmt.getResultSet();
            if (rs != null) {
                break;
            }
            hasMoreResults = moveToNextResultsIfPresent(stmt);
        }
        return rs;
    }

    private boolean moveToNextResultsIfPresent(Statement stmt) throws SQLException {
        boolean moreResults;
        // This is the messed up JDBC approach for determining if there are more
        // results
        moreResults = !(((moveToNextResultsSafely(stmt) == false) && (stmt.getUpdateCount() == -1)));
        return moreResults;
    }

    private boolean moveToNextResultsSafely(Statement stmt) throws SQLException {
        if (!stmt.getConnection().getMetaData().supportsMultipleResultSets()) {
            return false;
        }
        return stmt.getMoreResults();
    }

    private void handleResults(RequestScope request, ResultSet rs, int skipResults, int maxResults,
                               RowHandlerCallback callback) throws SQLException {
        try {
            request.setResultSet(rs);
            ResultMap resultMap = request.getResultMap();
            if (resultMap != null) {
                // Skip Results
                if (rs.getType() != ResultSet.TYPE_FORWARD_ONLY) {
                    if (skipResults > 0) {
                        rs.absolute(skipResults);
                    }
                } else {
                    for (int i = 0; i < skipResults; i++) {
                        if (!rs.next()) {
                            return;
                        }
                    }
                }

                // Get Results
                int resultsFetched = 0;
                while ((maxResults == SqlExecutor.NO_MAXIMUM_RESULTS || resultsFetched < maxResults) && rs.next()) {
                    Object[] columnValues = resultMap.resolveSubMap(request, rs).getResults(request, rs);
                    callback.handleResultObject(request, columnValues, rs);
                    resultsFetched++;
                }
            }
        } finally {
            request.setResultSet(null);
        }
    }

    private void retrieveOutputParameters(RequestScope request, CallableStatement cs, ParameterMapping[] mappings,
                                          Object[] parameters, RowHandlerCallback callback) throws SQLException {
        for (int i = 0; i < mappings.length; i++) {
            BasicParameterMapping mapping = ((BasicParameterMapping) mappings[i]);
            if (mapping.isOutputAllowed()) {
                if ("java.sql.ResultSet".equalsIgnoreCase(mapping.getJavaTypeName())) {
                    ResultSet rs = (ResultSet) cs.getObject(i + 1);
                    ResultMap resultMap;
                    if (mapping.getResultMapName() == null) {
                        resultMap = request.getResultMap();
                        handleOutputParameterResults(request, resultMap, rs, callback);
                    } else {
                        ExtendedSqlMapClient client = (ExtendedSqlMapClient) request.getSession().getSqlMapClient();
                        resultMap = client.getDelegate().getResultMap(mapping.getResultMapName());
                        DefaultRowHandler rowHandler = new DefaultRowHandler();
                        RowHandlerCallback handlerCallback = new RowHandlerCallback(resultMap, null, rowHandler);
                        handleOutputParameterResults(request, resultMap, rs, handlerCallback);
                        parameters[i] = rowHandler.getList();
                    }
                    rs.close();
                } else {
                    parameters[i] = mapping.getTypeHandler().getResult(cs, i + 1);
                }
            }
        }
    }

    private void registerOutputParameters(CallableStatement cs, ParameterMapping[] mappings) throws SQLException {
        for (int i = 0; i < mappings.length; i++) {
            BasicParameterMapping mapping = ((BasicParameterMapping) mappings[i]);
            if (mapping.isOutputAllowed()) {
                if (null != mapping.getTypeName() && !mapping.getTypeName().equals("")) { // @added
                    cs.registerOutParameter(i + 1, mapping.getJdbcType(), mapping.getTypeName());
                } else {
                    if (mapping.getNumericScale() != null
                            && (mapping.getJdbcType() == Types.NUMERIC || mapping.getJdbcType() == Types.DECIMAL)) {
                        cs.registerOutParameter(i + 1, mapping.getJdbcType(), mapping.getNumericScale().intValue());
                    } else {
                        cs.registerOutParameter(i + 1, mapping.getJdbcType());
                    }
                }
            }
        }
    }

    private void handleOutputParameterResults(RequestScope request, ResultMap resultMap, ResultSet rs,
                                              RowHandlerCallback callback) throws SQLException {
        ResultMap orig = request.getResultMap();
        try {
            request.setResultSet(rs);
            if (resultMap != null) {
                request.setResultMap(resultMap);

                // Get Results
                while (rs.next()) {
                    Object[] columnValues = resultMap.resolveSubMap(request, rs).getResults(request, rs);
                    callback.handleResultObject(request, columnValues, rs);
                }
            }
        } finally {
            request.setResultSet(null);
            request.setResultMap(orig);
        }
    }

    /**
     * Clean up any batches on the session
     *
     * @param session
     *            - the session to clean up
     */
    public void cleanup(SessionScope session) {
        Batch batch = (Batch) session.getBatch();
        if (batch != null) {
            batch.cleanupBatch(session);
            session.setBatch(null);
        }
    }

    private PreparedStatement prepareStatement(SessionScope session, Connection conn, String sql, Integer rsType)
            throws SQLException {
        SqlMapExecutorDelegate delegate = ((ExtendedSqlMapClient) session.getSqlMapExecutor()).getDelegate();
        if (session.hasPreparedStatementFor(sql)) {
            return session.getPreparedStatement((sql));
        } else {
            PreparedStatement ps = conn.prepareStatement(sql, rsType.intValue(), ResultSet.CONCUR_READ_ONLY);
            session.putPreparedStatement(delegate, sql, ps);
            return ps;
        }
    }

    private CallableStatement prepareCall(SessionScope session, Connection conn, String sql, Integer rsType)
            throws SQLException {
        SqlMapExecutorDelegate delegate = ((ExtendedSqlMapClient) session.getSqlMapExecutor()).getDelegate();
        if (session.hasPreparedStatementFor(sql)) {
            return (CallableStatement) session.getPreparedStatement((sql));
        } else {
            CallableStatement cs = conn.prepareCall(sql, rsType.intValue(), ResultSet.CONCUR_READ_ONLY);
            session.putPreparedStatement(delegate, sql, cs);
            return cs;
        }
    }

    private static PreparedStatement prepareStatement(SessionScope session, Connection conn, String sql)
            throws SQLException {
        SqlMapExecutorDelegate delegate = ((ExtendedSqlMapClient) session.getSqlMapExecutor()).getDelegate();
        if (session.hasPreparedStatementFor(sql)) {
            return session.getPreparedStatement((sql));
        } else {
            PreparedStatement ps = conn.prepareStatement(sql);
            session.putPreparedStatement(delegate, sql, ps);
            return ps;
        }
    }

    private CallableStatement prepareCall(SessionScope session, Connection conn, String sql) throws SQLException {
        SqlMapExecutorDelegate delegate = ((ExtendedSqlMapClient) session.getSqlMapExecutor()).getDelegate();
        if (session.hasPreparedStatementFor(sql)) {
            return (CallableStatement) session.getPreparedStatement((sql));
        } else {
            CallableStatement cs = conn.prepareCall(sql);
            session.putPreparedStatement(delegate, sql, cs);
            return cs;
        }
    }

    private static void closeStatement(SessionScope session, PreparedStatement ps) {
        if (ps != null) {
            if (!session.hasPreparedStatement(ps)) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    // ignore
                }
            }
        }
    }

    /**
     * @param rs
     */
    private static void closeResultSet(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                // ignore
            }
        }
    }

    private static void setStatementTimeout(MappedStatement mappedStatement, Statement statement) throws SQLException {
        if (mappedStatement.getTimeout() != null) {
            statement.setQueryTimeout(mappedStatement.getTimeout().intValue());
        }
    }

    //
    // Inner Classes
    //

    private static class Batch {
        private String currentSql;
        private List statementList = new ArrayList();
        private List batchResultList = new ArrayList();
        private int size;

        /**
         * Create a new batch
         */
        public Batch() {
            this.size = 0;
        }

        /**
         * Getter for the batch size
         *
         * @return - the batch size
         */
        public int getSize() {
            return size;
        }

        /**
         * Add a prepared statement to the batch
         *
         * @param request
         *            - the request scope
         * @param conn
         *            - the database connection
         * @param sql
         *            - the SQL to add
         * @param parameters
         *            - the parameters for the SQL
         * @throws SQLException
         *             - if the prepare for the SQL fails
         */
        public void addBatch(RequestScope request, Connection conn, String sql, Object[] parameters)
                throws SQLException {
            PreparedStatement ps = null;
            if (currentSql != null && sql.hashCode() == currentSql.hashCode() && sql.length() == currentSql.length()) {
                int last = statementList.size() - 1;
                ps = (PreparedStatement) statementList.get(last);
            } else {
                ps = prepareStatement(request.getSession(), conn, sql);
                setStatementTimeout(request.getStatement(), ps);
                currentSql = sql;
                statementList.add(ps);
                batchResultList.add(new BatchResult(request.getStatement().getId(), sql));
            }
            request.getParameterMap().setParameters(request, ps, parameters);
            ps.addBatch();
            size++;
        }

        /**
         * TODO (Jeff Butler) - maybe this method should be deprecated in some
         * release, and then removed in some even later release.
         * executeBatchDetailed gives much more complete information.
         * <p/>
         * Execute the current session's batch
         *
         * @return - the number of rows updated
         * @throws SQLException
         *             - if the batch fails
         */
        public int executeBatch() throws SQLException {
            int totalRowCount = 0;
            for (int i = 0, n = statementList.size(); i < n; i++) {
                PreparedStatement ps = (PreparedStatement) statementList.get(i);
                int[] rowCounts = ps.executeBatch();
                for (int j = 0; j < rowCounts.length; j++) {
                    if (rowCounts[j] == Statement.SUCCESS_NO_INFO) {
                        // do nothing
                    } else if (rowCounts[j] == Statement.EXECUTE_FAILED) {
                        throw new SQLException("The batched statement at index " + j + " failed to execute.");
                    } else {
                        totalRowCount += rowCounts[j];
                    }
                }
            }
            return totalRowCount;
        }

        /**
         * Batch execution method that returns all the information the driver
         * has to offer.
         *
         * @return a List of BatchResult objects
         * @throws BatchException
         *             (an SQLException sub class) if any nested batch fails
         * @throws SQLException
         *             if a database access error occurs, or the drive does not
         *             support batch statements
         * @throws BatchException
         *             if the driver throws BatchUpdateException
         */
        public List executeBatchDetailed() throws SQLException, BatchException {
            List answer = new ArrayList();
            for (int i = 0, n = statementList.size(); i < n; i++) {
                BatchResult br = (BatchResult) batchResultList.get(i);
                PreparedStatement ps = (PreparedStatement) statementList.get(i);
                try {
                    br.setUpdateCounts(ps.executeBatch());
                } catch (BatchUpdateException e) {
                    StringBuffer message = new StringBuffer();
                    message.append("Sub batch number ");
                    message.append(i + 1);
                    message.append(" failed.");
                    if (i > 0) {
                        message.append(" ");
                        message.append(i);
                        message.append(" prior sub batch(s) completed successfully, but will be rolled back.");
                    }
                    throw new BatchException(message.toString(), e, answer, br.getStatementId(), br.getSql());
                }
                answer.add(br);
            }
            return answer;
        }

        /**
         * Close all the statements in the batch and clear all the statements
         *
         * @param session
         */
        public void cleanupBatch(SessionScope session) {
            for (int i = 0, n = statementList.size(); i < n; i++) {
                PreparedStatement ps = (PreparedStatement) statementList.get(i);
                closeStatement(session, ps);
            }
            currentSql = null;
            statementList.clear();
            batchResultList.clear();
            size = 0;
        }
    }

    private void setupResultObjectFactory(RequestScope request) {
        ExtendedSqlMapClient client = (ExtendedSqlMapClient) request.getSession().getSqlMapClient();
        ResultObjectFactoryUtil.setResultObjectFactory(client.getResultObjectFactory());
        ResultObjectFactoryUtil.setStatementId(request.getStatement().getId());
    }

}
