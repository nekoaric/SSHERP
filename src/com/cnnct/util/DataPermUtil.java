package com.cnnct.util;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.expression.*;
import net.sf.jsqlparser.expression.operators.arithmetic.Concat;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.schema.Column;
import net.sf.jsqlparser.statement.select.*;
import com.cnnct.sys.vo.UserInfoVo;

import java.io.StringReader;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * *********************************************
 * 创建日期: 2013-9-5
 * 创建作者：may
 * 功能：数据权限工具类
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public class DataPermUtil {
    /**
     * 通过解析sql语句,判断出要查询的内容,拼接各式的关联查询信息
     * @param sql ibatis解析的sql查询语句
     * @param currentLoginedUserId 执行sql查询的用户userid信息
     * @param queryForPageCountFlag 是否查询总数的标识
     * @return
     * @throws java.sql.SQLException
     */
    public static String getDataQuerySql(String sql,String currentLoginedUserId,String queryForPageCountFlag)
            throws SQLException {
        if(!"".equals(currentLoginedUserId)){
            String userInfo = currentLoginedUserId.replace("currentLoginedUserId,","");

            //解析sql 判断使用权限查询的方式
            Map<String,String> colomnMap = parseSql(sql);

            String[] str= getJoinFlagAndKeyWorkByColumnMap(colomnMap);
            if(str!=null){
                String joinMsg = str[0];//join语句中on部分
                String keyword =str[1];//查询关键字
                if(!"".equals(keyword)){
                    sql = "select a.* from ("+sql+") a "+getJoinString(keyword,userInfo,joinMsg);
                }
            }
        }

        if("queryForPageCountFlag".equals(queryForPageCountFlag)){
            sql = "select count(*) as pagecount from ("+sql+")";
        }
        return  sql;
    }


    public static String getDataQuerySqlByUserInfo(Map<String,String> colomnMap,UserInfoVo user)
            throws SQLException {

        String currentLoginedUserId = getDataPermInfoByUserInfo(user);//获取user中的数据权限信息
        String sql ="";
        if(!"".equals(currentLoginedUserId)){

            String[] str= getJoinFlagAndKeyWorkByColumnMap(colomnMap);
            String joinMsg = str[0];//join语句中on部分
            String keyword =str[1];//查询关键字
            if(!"".equals(keyword)){
                sql = getJoinString(keyword,currentLoginedUserId,joinMsg);
            }

        }
        return  sql;
    }

    /**
     * 解析sql语句,判断sql语句中的查询列
     * @param sql
     * @return sql语句中的查询列值的映射
     * @throws SQLException
     */
    public static Map<String,String> parseSql(String sql) throws SQLException {

        Map<String,String> map= new HashMap<String,String>();

        //去除case语句(JSqlParser解析不了case语句,所以去掉)
        String str = sql.toLowerCase();//先全部转换成小写
        sql = replaceCase(new StringBuilder(str)).toString();

        CCJSqlParserManager parserManager = new CCJSqlParserManager();

        try {
            Select select = (Select) parserManager.parse(new StringReader(sql));

            SelectBody sb = select.getSelectBody();//获取解析后查询语句
            if(sb instanceof PlainSelect){//如果是简单的查询语句
                PlainSelect pb = (PlainSelect)sb;//The core of a "SELECT" statement (no UNION, no ORDER BY)
                List list =pb.getSelectItems();//获取sql查询的列字段的列表
                for (Object o : list) {
                    String key = "";
//                    String value = "";
                    if (o instanceof SelectExpressionItem) {
                        //An expression as in "SELECT expr1 AS EXPR"
                        SelectExpressionItem s = (SelectExpressionItem) o;
                        String alias = s.getAlias();// as 后面的字段
                        Expression e = s.getExpression();// as 前的表达式

                        if (e instanceof Column) {
                            Column c = (Column) e;//列,可能包含表名
                            key = c.getColumnName();//原来的列名作为关键字

                        } else if (e instanceof Concat) {
                            Concat concat = (Concat) e;
                            Expression leftExp = concat.getLeftExpression();//连接
                            Expression rightExp = concat.getRightExpression();

                            // 支持一次连接符连接
                            if (leftExp instanceof Column && rightExp instanceof StringValue) {
                                Column column = (Column) leftExp;
                                key = column.getColumnName();
                                alias = alias+"||"+rightExp;//连接符在右边时加上右边的表达式
                            }

                            if (leftExp instanceof StringValue && rightExp instanceof Column) {
                                Column column = (Column) rightExp;
                                key = column.getColumnName();
                                alias = leftExp+"||"+alias;//连接符在左边时加上左边的表达式
                            }

                        }
                        map.put(key.toLowerCase(), alias);

                    } else {//其他还有全部查询(*) ,某个表全部查询(a.*)

                    }

                }
            }else if(sb instanceof Union){//union语句
                Union union = (Union)sb;
                //多个联合语句只取第一个查询表信息的
                PlainSelect ps = (PlainSelect)union.getPlainSelects().get(0);
                List list = ps.getSelectItems();
                for (Object o : list) {
                    if (o instanceof SelectExpressionItem) {
                        //TODO 现有解析不了复杂的列表达式
                        SelectExpressionItem s = (SelectExpressionItem) o;
                        String alias = s.getAlias();
                        Expression e = s.getExpression();

                        map.put(e.toString().toLowerCase(), alias);
                    } else {

                    }

                }
            }

        } catch (JSQLParserException e) {
            System.out.print("sql语句["+sql+"]"+"JSqlParser不能解析!");
//            e.printStackTrace();
        }

        return map;
    }

    /**
     * sql中case替换,替换现在不能被jsqlparse识别的case语句,需要case和end格式为"case "," end "
     * @param sql 查询语句
     * @return 替换之后的sql语句
     */
    public static StringBuilder replaceCase(StringBuilder sql){

        StringBuilder sb = sql;
        try{
            //case 后面有一个空格(准确的判断case语句)
            if(sql.indexOf("case ")!=-1){

                //case 后面有一个空格 ;end 前后都有一个空格 (空格用于区分单词!)
                sb= sb.replace(sb.indexOf("case "),sb.indexOf(" end ")+5,"a ");

                //继续替换
                sb = replaceCase(sb);
            }
            //屏蔽queryManageDeptInfo解析报错
            if(sql.indexOf("table(fn_split")!=-1){
                sb= sb.replace(sb.indexOf("table"),sb.lastIndexOf(")")+1,"a ");
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return  sb;
    }

    /**
     * 获取sql语句查询列中的join语句和关键字
     * @param colomnMap sql语句中的查询列值的映射
     * @return String数组 第一位joinFlag join语句 第二位 keyword查询使用的关键字
     */
    public static String[] getJoinFlagAndKeyWorkByColumnMap(Map<String,String> colomnMap){
        Map<String,String> keyWordMap = new HashMap<String,String>();//关键字映射
        keyWordMap.put("account","user");
        keyWordMap.put("perid","user");
        keyWordMap.put("per_id","user");
        keyWordMap.put("per_no","user");
        keyWordMap.put("perno","user");
        keyWordMap.put("deptid","dept");
        keyWordMap.put("dept_id","dept");
        keyWordMap.put("cust_id","cust");
        keyWordMap.put("prod_ord_seq","prod");
        keyWordMap.put("order_id","order");
        keyWordMap.put("ord_seq_no","order");

        //关键字关键字映射 就是在正常sql列字段和权限查询中的列字段的映射关系
        Map<String,String> keyKeyMap = new HashMap<String,String>();
        keyKeyMap.put("account","account");
        keyKeyMap.put("perid","account");
        keyKeyMap.put("per_id","account");
        keyKeyMap.put("per_no","per_no");
        keyKeyMap.put("perno","per_no");
        keyKeyMap.put("deptid","dept_id");
        keyKeyMap.put("dept_id","dept_id");
        keyKeyMap.put("cust_id","other");
        keyKeyMap.put("prod_ord_seq","other");
        keyKeyMap.put("order_id","other");
        keyKeyMap.put("ord_seq_no","other");

        String key1 ="";
        //key1字符数组先后顺序不能变!! 关系到各个关键字在sql查询中的顺序,按优先级高低排序
        //系统号>工号>部门>生产通知单>订单>客户
        //即有查询语句中有系统号,工号关键字时认为sql语句是查人员信息的;
        //在没有人员信息关键字后,如果有部门关键字则人为sql语句是查部门信息的;
        //都没有时认为是查询无关数据的
        String[] key1Array = {"account","perid","per_id","perno","per_no","deptid","dept_id",
                "prod_ord_seq","order_id","ord_seq_no","cust_id"};

        for(String val:key1Array){
            if (colomnMap.containsKey(val)) {
                key1 = val;
                break;
            }
        }

        //查询语句中没有权限关键字时不做权限语句的拼接
        if(!"".equals(key1)){
            String key2 = keyKeyMap.get(key1);
            String value1 = colomnMap.get(key1);
            String keyword = keyWordMap.get(key1);

            StringBuilder jsonMsg =new StringBuilder();
            if(value1!=null&&!"".equals(value1)){
                if(value1.contains("||")){//查询语句中有使用||作连接
                    String v1 = value1.split("\\|\\|")[0];
                    String v2 = value1.split("\\|\\|")[1];
                    if(v1.equals(key1)){//连接在右边
                        jsonMsg.append("a.").append(v1).append(" = b.").append(key2).append("||").append(v2);
                    }else{
                        jsonMsg.append("a.").append(v2).append(" = ").append(v1).append("||b.").append(key2);
                    }
                }else{
                    jsonMsg.append("a.").append(value1).append(" = b.").append(key2);
                }
            } else {
                jsonMsg.append("a.").append(key1).append(" = b.").append(key2);
            }
            return new String[]{jsonMsg.toString(), keyword};
        }
        return null;
    }

    /**
     * 判断sql查询列中的关键字,组合用户关键权限信息,拼接成sql join语句部分
     * @param keyword sql查询列中的关键字 user|dept|cust|prod|order
     * @param userInfo 用户关键权限信息
     * @param joinMsg join语句中on部分
     * @return 拼接后的sql语句
     */
    public static String getJoinString(String keyword, String userInfo, String joinMsg) {
        StringBuilder joinWord = new StringBuilder();

        String user_type = BusiConst.DATA_AUTHORITY_TYPE_USER;//员工权限
        String dept_type = BusiConst.DATA_AUTHORITY_TYPE_DEPT;//部门权限
        String cust_type = BusiConst.DATA_AUTHORITY_TYPE_CUST;//客户权限
        String prod_ord_type = BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD;//生产通知单

        if ("user".equals(keyword)) {//如果sql语句中是查询用户信息的
            //判断登录员的用户权限类型
            //user-个人 local-本机部门 parent-上级部门 manage-分管部门 root-所有 其他则为具体授权
            if (userInfo.startsWith("user")) {//个人权限
                userInfo = userInfo.replace("user,", "");
                String[] strings = userInfo.split(";");
                String user_id = strings[0];

                joinWord.append("join (select account,dept_id,user_id,per_no from sys_user_info where user_id ='")
                        .append(user_id).append("') b ");
            } else if (userInfo.startsWith("local")) {//本级部门
                userInfo = userInfo.replace("local,", "");
                String[] strings = userInfo.split(";");
                String dept_id = strings[0];
                String userperm = strings[2];//用户权限值为当前user_id
                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    //部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("dept_id in (select dept_id from sys_user_dataauth where type ='").append(dept_type)
                            .append("' and user_id = '").append(userperm).append("')");
                    //人员权限查询语句
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("account in (select per_id from sys_user_dataauth where type ='").append(user_type)
                            .append("' and user_id = '").append(userperm).append("')");

                    userPermSB.append("union (select account,dept_id,user_id,per_no from sys_user_info a ")
                            .append("where (").append(deptTypeSB).append(" or ").append(userTypeSB).append("))");
                }

                joinWord.append("join (select account,dept_id,user_id ,per_no from sys_user_info where dept_id like '").append(dept_id)
                        .append("%' ").append(userPermSB).append(" ) b ");
            } else if (userInfo.startsWith("parent")) {//上级部门
                userInfo = userInfo.replace("parent,", "");

                String[] strings = userInfo.split(";");
                String dept_id = strings[0];
                String userperm = strings[2];//用户权限 user_id
                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    //部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("dept_id in (select dept_id from sys_user_dataauth where type ='").append(dept_type)
                            .append("' and user_id = '").append(userperm).append("')");
                    //人员权限查询语句
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("account in (select per_id from sys_user_dataauth where type ='").append(user_type)
                            .append("' and user_id = '").append(userperm).append("')");

                    userPermSB.append("union (select account,dept_id,user_id,per_no from sys_user_info a ")
                            .append("where (").append(deptTypeSB).append(" or ").append(userTypeSB).append("))");
                }

                joinWord.append("join (select account,dept_id,user_id ,per_no from sys_user_info where dept_id like '").append(dept_id)
                        .append("%' ").append(userPermSB).append(" ) b ");
            } else if (userInfo.startsWith("manage")) {//分管部门
                userInfo = userInfo.replace("manage,", "");

                String[] strings = userInfo.split(";");
                String dept_id = strings[0];
                String userperm = strings[2];//用户权限 user_id
                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    //部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("dept_id in (select dept_id from sys_user_dataauth where type ='").append(dept_type)
                            .append("' and user_id = '").append(userperm).append("')");
                    //人员权限查询语句
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("account in (select per_id from sys_user_dataauth where type ='").append(user_type)
                            .append("' and user_id = '").append(userperm).append("')");

                    userPermSB.append("union (select account,dept_id,user_id,per_no from sys_user_info a ")
                            .append("where (").append(deptTypeSB).append(" or ").append(userTypeSB).append("))");
                }

                joinWord.append("join (select account,dept_id,user_id ,per_no from sys_user_info where dept_id in (select column_value from table(fn_split('")
                        .append(dept_id).append("',','))) ").append(userPermSB).append(" ) b ");
            } else if (userInfo.startsWith("root")) {//根部门
                userInfo = userInfo.replace("root,", "");

                String[] strings = userInfo.split(";");
                String dept_id = strings[0];

                joinWord.append("join (select account,dept_id,user_id ,per_no from sys_user_info where dept_id like '")
                        .append(dept_id).append("%') b ");
            } else {

                String[] strings = userInfo.split(";");

                String dataRoleId = strings[0];
                String userperm = strings[2];

                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){//用户数据授权时
                    //部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("dept_id in (select dept_id from sys_user_dataauth where type ='").append(dept_type)
                            .append("' and user_id = '").append(userperm).append("')");
                    //人员权限查询语句
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("account in (select per_id from sys_user_dataauth where type ='").append(user_type)
                            .append("' and user_id = '").append(userperm).append("')");

                    userPermSB.append("union (select account,dept_id,user_id,per_no from sys_user_info a ")
                            .append("where (").append(deptTypeSB).append(" or ").append(userTypeSB).append("))");
                }

                //部门权限查询语句
                StringBuilder deptTypeSB = new StringBuilder()
                        .append("dept_id in (select dept_id from sys_role_dataauth where type ='").append(dept_type)
                        .append("' and role_id = '").append(dataRoleId).append("')");
                //人员权限查询语句
                StringBuilder userTypeSB = new StringBuilder()
                        .append("account in (select per_id from sys_role_dataauth where type ='").append(user_type)
                        .append("' and role_id = '").append(dataRoleId).append("')");

                joinWord = joinWord.append(" join( ")
                        .append("select account,dept_id,user_id,per_no from sys_user_info a ")
                        .append("where (").append(deptTypeSB).append(" or ").append(userTypeSB).append(")")
                        .append(userPermSB).append(") b  ");
            }

        } else if ("dept".equals(keyword)) {
            if (userInfo.startsWith("user")) {
                userInfo = userInfo.replace("user,", "");
                String user_id = userInfo.split(";")[0];

                joinWord.append(" join (select a.dept_id from sys_dept_info a left join ").append(
                        "(select account,dept_id,user_id,per_no from sys_user_info where user_id ='" ).append( user_id)
                        .append( "') b " ).append("on instr(b.dept_id,a.dept_id)=1  where b.dept_id is not null) b");
            } else if (userInfo.startsWith("local")) {
                userInfo = userInfo.replace("local,", "");
                String[] strings = userInfo.split(";");
                String dept_id = strings[0];
                String userperm = strings[2];//用户权限 user_id

                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    ///部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("(select dept_id from sys_user_dataauth where type ='").append( dept_type)
                            .append( "' and user_id ='").append(userperm).append("')");

                    //根据人员权限查询出的部门信息
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("select a.dept_id from sys_user_info a ")
                            .append("where account in (select per_id from sys_user_dataauth where type ='" )
                            .append( user_type ).append( "'and user_id = '").append(userperm).append("')");


                    userPermSB = userPermSB.append(" union( ").append(deptTypeSB)
                            .append("union select distinct a.dept_id from sys_dept_info a left join (")
                            .append(userTypeSB).append(")b on instr(b.dept_id,a.dept_id)=1 where b.dept_id is not null")
                            .append(")  ");

                }

                joinWord.append(" join (select a.dept_id from sys_dept_info a where instr('").append(dept_id).append("',a.dept_id)=1")
                        .append(" union (select dept_id from sys_dept_info where dept_id like ('").append(dept_id).append("%'))")
                        .append(userPermSB).append(") b ");
            } else if (userInfo.startsWith("parent")) {
                userInfo = userInfo.replace("parent,", "");
                String[] strings = userInfo.split(";");
                String dept_id = strings[0];
                String userperm = strings[2];//用户权限 user_id

                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    ///部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("(select dept_id from sys_user_dataauth where type ='").append( dept_type)
                            .append( "' and user_id ='").append(userperm).append("')");

                    //根据人员权限查询出的部门信息
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("select a.dept_id from sys_user_info a ")
                            .append("where account in (select per_id from sys_user_dataauth where type ='" )
                            .append( user_type ).append( "'and user_id = '").append(userperm).append("')");


                    userPermSB = userPermSB.append(" union( ").append(deptTypeSB)
                            .append("union select distinct a.dept_id from sys_dept_info a left join (")
                            .append(userTypeSB).append(")b on instr(b.dept_id,a.dept_id)=1 where b.dept_id is not null")
                            .append(")  ");

                }

                joinWord.append(" join (select distinct a.dept_id from sys_dept_info a left join  ")
                        .append("(select dept_id from sys_dept_info where dept_id like '").append(dept_id).append( "%') b ")
                        .append("on instr(b.dept_id,a.dept_id)=1  where b.dept_id is not null").append(userPermSB).append(") b");
            } else if (userInfo.startsWith("manage")) {
                userInfo = userInfo.replace("manage,", "");
                String[] strings = userInfo.split(";");
                String dept_id = strings[0];
                String userperm = strings[2];//用户权限 user_id

                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    ///部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("(select dept_id from sys_user_dataauth where type ='").append( dept_type)
                            .append( "' and user_id ='").append(userperm).append("')");

                    //根据人员权限查询出的部门信息
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("select a.dept_id from sys_user_info a ")
                            .append("where account in (select per_id from sys_user_dataauth where type ='" )
                            .append( user_type ).append( "'and user_id = '").append(userperm).append("')");


                    userPermSB = userPermSB.append(" union( ").append(deptTypeSB)
                            .append("union select distinct a.dept_id from sys_dept_info a left join (")
                            .append(userTypeSB).append(")b on instr(b.dept_id,a.dept_id)=1 where b.dept_id is not null")
                            .append(")  ");

                }

                joinWord.append(" join (select distinct a.dept_id from sys_dept_info a left join  ").append("(table(fn_split('" )
                        .append(dept_id ).append("',','))) b ")
                        .append("on instr(b.column_value,a.dept_id)=1  where b.column_value is not null")
                        .append(userPermSB).append(") b");

            } else if (userInfo.startsWith("root")) {
                userInfo = userInfo.replace("root,", "");
                String dept_id = userInfo.split(";")[0];
                joinWord.append(" join (select dept_id from sys_dept_info where dept_id like '").append(dept_id).append("%') b ");
            } else {

                String[] strings = userInfo.split(";");
                String dataRoleId = strings[0];
                String userperm = strings[2];//用户权限 user_id

                StringBuilder userPermSB = new StringBuilder();
                if(!" ".equals(userperm)){
                    ///部门权限查询语句
                    StringBuilder deptTypeSB = new StringBuilder()
                            .append("(select dept_id from sys_user_dataauth where type ='").append( dept_type)
                            .append( "' and user_id ='").append(userperm).append("')");

                    //根据人员权限查询出的部门信息
                    StringBuilder userTypeSB = new StringBuilder()
                            .append("select a.dept_id from sys_user_info a ")
                            .append("where account in (select per_id from sys_user_dataauth where type ='" )
                            .append( user_type ).append( "'and user_id = '").append(userperm).append("')");


                    userPermSB = userPermSB.append(" union( ").append(deptTypeSB)
                            .append("union select distinct a.dept_id from sys_dept_info a left join (")
                            .append(userTypeSB).append(")b on instr(b.dept_id,a.dept_id)=1 where b.dept_id is not null")
                            .append(")  ");

                }

                //部门权限查询语句
                StringBuilder deptTypeSB = new StringBuilder()
                        .append("(select dept_id from sys_role_dataauth where type ='").append( dept_type)
                        .append( "' and role_id ='").append(dataRoleId).append("')");

                //根据人员权限查询出的部门信息
                StringBuilder userTypeSB = new StringBuilder()
                        .append("select a.dept_id from sys_user_info a ")
                        .append("where account in (select per_id from sys_role_dataauth where type ='" )
                        .append( user_type ).append( "'and role_id = '").append(dataRoleId).append("')");

                joinWord = joinWord.append(" join( ").append(deptTypeSB)
                        .append("union select distinct a.dept_id from sys_dept_info a left join (")
                        .append(userTypeSB).append(")b on instr(b.dept_id,a.dept_id)=1 where b.dept_id is not null")
                        .append(userPermSB).append(") b  ");
            }

        }else if("cust".equals(keyword)){
            String role_id = userInfo.split(";")[0];
            joinWord.append(" join (select other from sys_role_dataauth where type ='").append(cust_type)
                    .append( "'and role_id = '").append(role_id).append("') b ");
        }else if("prod".equals(keyword)){
            String role_id = userInfo.split(";")[0];
            String custType = userInfo.split(";")[1];
            if("0".equals(custType)){//全部客户权限
                joinWord.append(" join (select a.prod_ord_seq as other from prod_ord_info a inner join (select other from sys_role_dataauth where type ='").append(cust_type)
                        .append( "'and role_id = '").append(role_id).append("') b on a.cust_id = b.other) b ");
            }else if("1".equals(custType)){//部分客户权限
                joinWord.append(" join (select other from sys_role_dataauth where type ='").append(prod_ord_type)
                        .append( "'and role_id = '").append(role_id).append("') b ");
            }
        }else if("order".equals(keyword)){
            String role_id = userInfo.split(";")[0];
            String custType = userInfo.split(";")[1];
            if("0".equals(custType)){//全部客户权限
                joinWord.append(" join (select distinct a.ord_seq_no as other from prod_ord_info a ")
                        .append("inner join (select other from sys_role_dataauth where type ='").append(cust_type)
                        .append( "'and role_id = '").append(role_id).append("') b on a.cust_id = b.other)  b ");
            }else if("1".equals(custType)){//部分客户权限
                joinWord.append(" join (select distinct a.ord_seq_no as other from prod_ord_info a ")
                        .append("inner join (select other from sys_role_dataauth where type ='").append(prod_ord_type)
                        .append( "'and role_id = '").append(role_id).append("') b on a.prod_ord_seq = b.other) b ");
            }
        }

        joinWord.append(" on ").append(joinMsg);
        return joinWord.toString();

    }

    /**
     * 获取用户信息中的权限控制信息
     * @param user 登录后的用户信息
     * @return 拼接后的权限关键字
     */
    public static String getDataPermInfoByUserInfo(UserInfoVo user){
        String currentLoginedUserId = "";
        if(!ArmConstants.ACCOUNTTYPE_SUPER.equals(user.getUsertype())){//企业管理员不过滤
            String roleid = user.getRoleid();
            String userPerm = user.getUserPerm();

            Boolean roleFlag = (null == roleid || "".equals(roleid));
            Boolean userFlag = (null == userPerm || "".equals(userPerm));

            if(userFlag&&roleFlag){//没有对这个员工授予数据权限,默认个人权限
                currentLoginedUserId = "user,"+user.getUserid()+"; ";
            }else{
                StringBuilder str = new StringBuilder(";");
                if(!userFlag){//没有用户授权
                    str = str.append(userPerm);
                }else{
                    str = str.append(" ");
                }

                String relativeAuthority = user.getRelativeAuthority();
                if(null == relativeAuthority || "".equals(relativeAuthority)){//没有相对权限的则为详细权限
                    StringBuilder msg = new StringBuilder();
                    Integer prodAuthority = user.getProdAuthority();//部分客户权限
                    msg.append(roleid).append(";").append(prodAuthority).append(str);
                    currentLoginedUserId = msg.toString();
                }else{
                    StringBuilder msg = new StringBuilder();
                    if(relativeAuthority.equals(BusiConst.RELATIVE_AUTHORITY_LOCALDEPT)){
                        msg.append("local,").append(user.getDeptid()).append(str);
                    }/*else if(relativeAuthority.equals(BusiConst.RELATIVE_AUTHORITY_PARENTDEPT)){
                        msg.append("parent,").append(user.getBelongDeptId()).append(";")
                                .append(user.getGroupAuthority()).append(str);
                    }else if(relativeAuthority.equals(BusiConst.RELATIVE_AUTHORITY_MANAGEDEPT)){
                        msg.append( "manage,").append(user.getManageDeptId()).append(";")
                                .append(user.getGroupAuthority()).append(str);
                    }*/else if(relativeAuthority.equals(BusiConst.RELATIVE_AUTHORITY_ROOTDEPT)){
                        msg.append("root,").append(user.getDeptid().substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH))
                                .append(str);
                    }

                    currentLoginedUserId = msg.toString();
                }
            }
        }
        return currentLoginedUserId;
    }


    public static void main(String[] args) throws SQLException {

        String s = "SELECT  a.deptid as id, a.deptname as text, a.parentid,a.leaf,a.sortno,a.indepd_cwa_ctrl," +
                "         case when b.column_value is null then '0' else '1' end as num         " +
                "FROM sys_dept_info a  left join table(fn_split((select managedeptid from sys_user_info" +
                "            where grp_id =#grp_id# and account =#account#),',')) b on a.deptid = b.column_value                                                                 rfid by a.deptid";
        System.out.print(s.replaceAll("^table\\(.*$",""));
    }
}
