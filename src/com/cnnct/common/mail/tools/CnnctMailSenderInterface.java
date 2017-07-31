package com.cnnct.common.mail.tools;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

public interface CnnctMailSenderInterface {

	/**
	 * 发送邮件
	 * 
	 * @param from
	 *            发送者
	 * @param to
	 *            邮件接收者
	 * @param subject
	 *            主题
	 * @param tplVar
	 *            模板文件变量-值对
	 * @param tplFilename
	 *            模板文件名
	 */
	public abstract void sendEmail(String from, String to, String subject, Dto tplVar, String tplFilename) throws ApplicationException;

}