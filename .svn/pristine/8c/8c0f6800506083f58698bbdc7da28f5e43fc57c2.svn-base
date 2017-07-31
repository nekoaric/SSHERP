package com.cnnct.util;

import com.cnnct.common.ApplicationException;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 数据的正确性判断
 * Created on 2008-01-10
 *
 * @author zhengyh
 */
public class DataUtil {
    //默认运算精度
    private static final int DEF_SCALE = 2;

    /**
     * 判断数据只能有2位小数
     *
     * @param String
     */
    public static boolean isNumericTowDecimal(String str) {
        Pattern pattern = Pattern.compile("(\\d+\\.\\d{1,2})|\\d+");
        Matcher isNum = pattern.matcher(str);
        if (isNum.matches()) {
            return true;
        }
        return false;
    }

    /**
     * 判断数据只能有2位小数
     *
     * @param double
     */
    public static boolean isNumericTowDecimal(double dou) {
        boolean relust = false;
        String str1 = doubleToString(dou);
        if (isNumericTowDecimal(str1)) {
            relust = true;
        }
        return relust;
    }

    /**
     * 判断是否为有效的数字
     *
     * @param String
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static double getNumericFromStr(String str) throws ApplicationException {
        if (!isNumericTowDecimal(str)) {
            throw new ApplicationException("不是有效的金额！");
        }
        return Double.parseDouble(str);
    }

    /**
     * 判断数据只能有2位小数的实数
     *
     * @param String
     */
    public static boolean isRealNumericTowDecimal(String str) {
        Pattern pattern = Pattern.compile("\\-?((\\d+\\.\\d{1,2})|\\d+)");
        Matcher isNum = pattern.matcher(str);
        if (isNum.matches()) {
            return true;
        }
        return false;
    }

    /**
     * 判断数据只能有2位小数的实数
     *
     * @param double
     */
    public static boolean isRealNumericTowDecimal(double dou) {
        String str1 = doubleToString(dou);
        if (isRealNumericTowDecimal(str1)) {
            return true;
        }
        return false;
    }

    /**
     * 判断2个double类型的值是否相等
     *
     * @param double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static boolean isEqualTowDouble(double dou1, double dou2) throws ApplicationException {
        if (!isRealNumericTowDecimal(dou1)) {
            throw new ApplicationException("(" + dou1 + ")不是有效的数字！");
        } else if (!isRealNumericTowDecimal(dou2)) {
            throw new ApplicationException("(" + dou2 + ")不是有效的数字！");
        }
        //取2位小数
        dou1 = doubleRound(dou1, 2);
        dou2 = doubleRound(dou2, 2);
        if (dou1 == dou2) {
            return true;
        }
        return false;
    }

    /**
     * 判断dou1是否大于doub2
     *
     * @param double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static boolean isGt(double dou1, double dou2) throws ApplicationException {
        if (!isRealNumericTowDecimal(dou1)) {
            throw new ApplicationException("(" + dou1 + ")不是有效的数字！");
        } else if (!isRealNumericTowDecimal(dou2)) {
            throw new ApplicationException("(" + dou2 + ")不是有效的数字！");
        }
        // 取2位小数
        dou1 = doubleRound(dou1, 2);
        dou2 = doubleRound(dou2, 2);
        if (dou1 > dou2) {
            return true;
        }
        return false;
    }

    /**
     * 判断dou1是否小于doub2
     *
     * @param double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static boolean isLe(double dou1, double dou2) throws ApplicationException {
        if (!isRealNumericTowDecimal(dou1)) {
            throw new ApplicationException("(" + dou1 + ")不是有效的数字！");
        } else if (!isRealNumericTowDecimal(dou2)) {
            throw new ApplicationException("(" + dou2 + ")不是有效的数字！");
        }
        // 取2位小数
        dou1 = doubleRound(dou1, 2);
        dou2 = doubleRound(dou2, 2);
        if (dou1 < dou2) {
            return true;
        }
        return false;
    }

    /**
     * 2个double相加
     *
     * @param double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static double doubleAdd(double dou1, double dou2) throws ApplicationException {
        double result = 0;

        BigDecimal b1 = new BigDecimal(Double.toString(dou1));
        BigDecimal b2 = new BigDecimal(Double.toString(dou2));
        //相加，返回2个小数
        result = doubleRound(b1.add(b2).doubleValue(), DEF_SCALE);

        return result;
    }

    /**
     * 2个double相加
     *
     * @param double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static double doubleAdd(double dou1, double dou2, int length) throws ApplicationException {
        double result = 0;

        BigDecimal b1 = new BigDecimal(Double.toString(dou1));
        BigDecimal b2 = new BigDecimal(Double.toString(dou2));
        //相加，返回2个小数
        result = doubleRound(b1.add(b2).doubleValue(), length);

        return result;
    }

    /**
     * 2个double相减
     *
     * @param double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static double doubleSub(double dou1, double dou2) throws ApplicationException {
        double result = 0;

        BigDecimal b1 = new BigDecimal(Double.toString(dou1));
        BigDecimal b2 = new BigDecimal(Double.toString(dou2));
        result = doubleRound(b1.subtract(b2).doubleValue(), DEF_SCALE);

        return result;
    }

    /**
     * 3个double相减
     *
     * @param double,double,double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static double doubleSub(double dou1, double dou2, double dou3) throws ApplicationException {
        double result = 0;

        BigDecimal b1 = new BigDecimal(Double.toString(dou1));
        BigDecimal b2 = new BigDecimal(Double.toString(dou2));
        BigDecimal b3 = new BigDecimal(Double.toString(dou3));
        result = doubleRound(b1.subtract(b2).subtract(b3).doubleValue(), DEF_SCALE);

        return result;
    }

    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，
     * 精确到小数点以后10位，以后的数字四舍五入。
     *
     * @param v1 被除数
     * @param v2 除数
     * @return 两个参数的商
     */
    public static double doubleDiv(double v1, double v2) throws ApplicationException {
        return doubleDiv(v1, v2, DEF_SCALE);
    }

    /**
     * 提供（相对）精确的除法运算。
     * 当发生除不尽的情况时，由scale参数指定精度，以后的数字四舍五入。
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示表示需要精确到小数点以后几位。
     * @return 两个参数的商
     */
    public static double doubleDiv(double v1, double v2, int scale) throws ApplicationException {
        if (scale < 0) {
            throw new ApplicationException("精度必须>=0！");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供精确的乘法运算。
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double doubleMul(double v1, double v2) throws ApplicationException {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return doubleRound(b1.multiply(b2).doubleValue(), DEF_SCALE);
    }

    /**
     * 提供精确的乘法运算（精度为0）。
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double doubleMulNoScale(double v1, double v2) throws ApplicationException {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return doubleRound(b1.multiply(b2).doubleValue(), 0);
    }

    /**
     * double转换成String,科学计数法也会全部转换成数据的String
     *
     * @param double
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static String doubleToString(double dou1) {
        String str = String.valueOf(dou1);
        //返回值
        StringBuffer result = new StringBuffer();
        if (str.indexOf('E') > -1) {
            int lenD = str.indexOf('.');  //小数点位置
            int lenE = str.indexOf('E');  //E位置
            int leng = str.length();      //总长度
            //指数
            int bs = Integer.parseInt(str.substring(lenE + 1, leng));
            //E前的原数据
            String reStr = str.substring(0, lenE);
            if (bs >= lenE - lenD - 1) {
                //除掉小数点
                result = new StringBuffer().append(reStr.substring(0, lenD)).append(reStr.substring(lenD + 1, lenE));
                //位数不够补0
                for (int i = 0; i < bs - (lenE - lenD - 1); i++) {
                    result.append("0");
                }
            } else {
                //整数
                String a1 = reStr.substring(0, lenD);
                //移动的位数
                String a2 = reStr.substring(lenD + 1, lenD + 1 + bs);
                //剩下的小数位数
                String a3 = reStr.substring(lenD + 1 + bs, lenE);
                //返回值
                result = new StringBuffer().append(a1).append(a2).append(".").append(a3);
            }
        } else {
            result = new StringBuffer().append(str);
        }

        return result.toString();
    }

    /**
     * 判断2个String类型的值是否相等
     *
     * @param String,String
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static boolean isEqualTowString(String str1, String str2) throws ApplicationException {
        if (str1 == null) {
            throw new ApplicationException("(" + str1 + ")不是有效的字符！");
        } else if (str2 == null) {
            throw new ApplicationException("(" + str2 + ")不是有效的字符！");
        }
        if (str1.trim().equals(str2.trim())) {
            return true;
        }
        return false;
    }

    /**
     * 提供精确的小数位四舍五入处理。
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double doubleRound(double v, int scale) throws ApplicationException {
        if (scale < 0) {
            throw new ApplicationException("精度必须>=0！");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        BigDecimal one = new BigDecimal("1");
        return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 判断判断参数 temsubject 科目是否属于一级科目 subject
     *
     * @param subject 一级科目 ； temsubject，参数科目
     * @throws com.cnnct.common.ApplicationException
     *
     */
    public static boolean isBelongSubject(String subject, String temsubject) {
        boolean result = false;
        if (subject == null || subject.length() != 3 || temsubject == null || temsubject.length() < 3) {
            result = false;
        } else {
            String temsub = temsubject.substring(0, 3);
            if (subject.equals(temsub)) {
                result = true;
            }
        }
        return result;
    }
    /**
     * 将字符串按照四舍五入取值
     * @param num 转化字符串 小数点位数默认为1位
     * @return
     */
    public static Long StringToDoubleByRound(String num){
        //radix_point:小数点位数
        return StringToDoubleByRound(num,1);
    }
    
    /**
     * 将字符串按照四舍五入取值
     * @param num 转化字符串
     * @param radix_point 小数点位数 <br/>
     * 如果没有小数 ，忽视此参数<br/>
     * 有小数 
     * >0:取相应的位数：=0不取小数：<0 当0处理
     * @return
     */
    public static Long StringToDoubleByRound(String num,int radix_point){
        Long result = new Long(0);
        String[] nums = num.split("\\.");
        if(nums.length>1){//有小数的
            if(radix_point>0){
                if(radix_point<nums[1].length()){
                    num = num.substring(0,nums[0].length()+1+radix_point);
                }
            }
            result = Math.round(Double.parseDouble(num));
        }else {
             result = Long.parseLong(num);
        }
        return result;
    }

}
