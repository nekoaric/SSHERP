package com.cnnct.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日期，时间工具类
 * 
 * @author zhouww
 *
 */
public class TimeUtil {
	  /**
     * 当前日期 
     * @return
     */
    public static String getCurrentDate(String format){
    	return new SimpleDateFormat(format).format(new Date());
    }
    /**
     * 当前日期  yyyy-MM-dd HH:mm:ss
     * @return
     */
    public static String getCurrentDate(){
    	return getCurrentDate("yyyy-MM-dd HH:mm:ss");
    }
    /**
     * 比较日期大小
     * @param d1  第一个日期 格式为yyyy-MM-dd
     * @param d2	第二个日期 格式为yyyy-MM-dd
     * @return </br>
     * 	d1,d2日期格式不正确 返回false</br>
     *  d1日期大于d2日期 返回true</br>
     *  d1日期不大于d2日期 返回false
     */
    public static boolean comDate(String d1,String d2){
    	try{
	    	if(d1.length()!=10 || d2.length()!=10){
	    		return false;
	    	}
	    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    	Date date1 = sdf.parse(d1);
	    	Date date2 = sdf.parse(d2);
	    	if(date1.after(date2)){
	    		return true;
	    	}
    	}catch(Exception e){
    		return false;
    	}
    	return false;
    }
    /**
     * 判断日期
     *
     * @param s
     * @param dataFormat
     * @param isNull 判断是否允许为空
     * @return
     */
    public static boolean isValidDate(String s, String dataFormat,boolean isNull) {
        try {
        	s = s.trim();
            if(isNull && "".equals(s)){
                return true;
            }else if("".equals(s)){
            	return false;
            }
            SimpleDateFormat dateFormat = new SimpleDateFormat(dataFormat);
            Date date = dateFormat.parse(s);
            String value = dateFormat.format(date);
            return s.equals(value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
