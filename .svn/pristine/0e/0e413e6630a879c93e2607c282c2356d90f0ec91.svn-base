/****************************************************************************
 * Project Name:JDURFID
 * File Name:PassWordValid.java
 * Package Name:com.cnnct.util
 * Date:2015-11-20
 * Copyright (c) 2015, http://www.jdunited.com All Rights Reserved.
 *
 *************************************************************************/
package com.cnnct.util;

/**
 * 密码校验 
 * 
 * @className: PassWordValid
 * @author frank
 * @date 2015-11-20
 */
public class PassWordValid {
	
	public static void main(String[] args) {
		System.out.println(check("234567"));
		System.out.println(check("aaaaaa"));
		System.out.println(check("765432"));
		System.out.println(check("222222"));
		
		System.out.println(check("123436"));
		System.out.println(check("aa1aaa"));
		System.out.println(check("644321"));
		System.out.println(check("212222"));
	}
	
	/**
	 * 密码校验 
	 * 校验规则：六位相同密码、六位递增数字、六位递减数字
	 * @author frank 
	 * @date 2015-11-20
	 * @param password
	 * @return true：太简单不通过   false：通过
	 */
	public static boolean check(String password) {
		boolean rel = false;
		if(equalStr(password)){//是否为六位相同密码：如：111111 aaaaaa
			rel = true;
		}else if(isOrderNumericAsc(password)){//是否为六位递增数字：如：123456
			rel = true;
		}else if(isOrderNumericDesc(password)){//是否为六位递减数字：如：123456
			rel = true;
		}
		return rel;
	}
	// 不能全是相同的数字或者字母（如：000000、111111、aaaaaa） 全部相同返回true
	private static boolean equalStr(String numOrStr) {
		boolean flag = true;
		char str = numOrStr.charAt(0);
		for (int i = 0; i < numOrStr.length(); i++) {
			if (str != numOrStr.charAt(i)) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	// 不能是连续的数字--递增（如：123456、12345678）连续数字返回true
	private static boolean isOrderNumericAsc(String numOrStr) {
		boolean flag = true;// 如果全是连续数字返回true
		boolean isNumeric = true;// 如果全是数字返回true
		for (int i = 0; i < numOrStr.length(); i++) {
			if (!Character.isDigit(numOrStr.charAt(i))) {
				isNumeric = false;
				break;
			}
		}
		if (isNumeric) {// 如果全是数字则执行是否连续数字判断
			for (int i = 0; i < numOrStr.length(); i++) {
				if (i > 0) {// 判断如123456
					int num = Integer.parseInt(numOrStr.charAt(i) + "");
					int num_ = Integer.parseInt(numOrStr.charAt(i - 1) + "") + 1;
					if (num != num_) {
						flag = false;
						break;
					}
				}
			}
		} else {
			flag = false;
		}
		return flag;
	}

	private static boolean isOrderNumericDesc(String numOrStr) {
		boolean flag = true;// 如果全是连续数字返回true
		boolean isNumeric = true;// 如果全是数字返回true
		for (int i = 0; i < numOrStr.length(); i++) {
			if (!Character.isDigit(numOrStr.charAt(i))) {
				isNumeric = false;
				break;
			}
		}
		if (isNumeric) {// 如果全是数字则执行是否连续数字判断
			for (int i = 0; i < numOrStr.length(); i++) {
				if (i > 0) {// 判断如654321
					int num = Integer.parseInt(numOrStr.charAt(i) + "");
					int num_ = Integer.parseInt(numOrStr.charAt(i - 1) + "") - 1;
					if (num != num_) {
						flag = false;
						break;
					}
				}
			}
		} else {
			flag = false;
		}
		return flag;
	}
}