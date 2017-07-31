package com.cnnct.rfid.util;

import org.junit.Test;

/**
 * 处理数据库的特殊符号
 * @author zhouww
 * @since 2014-11-25
 */
public class ProcessSpecialSign {
    
    /**
     * 处理单引号
     * 因为在数据库中单引号是特殊字符所以需要将单引号处理为双单引号
     * @param str
     * @return
     */
    public static String processQuotes(String str){
        if(str == null){
            return null;
        }
        str = str.replaceAll("'", "''");    //将查询的语句经过处理，防止单引号对查询所造成的影响
        return str;
    }
}
