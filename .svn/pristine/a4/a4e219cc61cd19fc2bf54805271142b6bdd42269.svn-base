package com.cnnct.common.mail.tools;

import java.io.File;

import javax.mail.internet.MimeMessage;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.VelocityException;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.velocity.VelocityEngineUtils;

import com.cnnct.common.ApplicationException;

public class CnnctMailSender implements CnnctMailSenderInterface {

	Log log = LogFactory.getLog(CnnctMailSender.class);

	private static final String DEFAULT_ENCODING = "utf-8";
	public static final String TPL_FILENAME_NOTICE = "notice.vm";
	private JavaMailSender mailSender;
	private VelocityEngine velocityEngine;

	/* (non-Javadoc)
     * @see com.cnnct.common.mail.tools.CnnctMailSenderInterface#sendEmail(java.lang.String, java.lang.String, java.lang.String, org.eredlab.g4.ccl.datastructure.Dto, java.lang.String)
     */
    public void sendEmail(String from, String to, String subject, Dto tplVar, String tplFilename) throws ApplicationException {
		try {
			MimeMessage msg = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(msg, true, DEFAULT_ENCODING);
			helper.setTo(to);
			helper.setFrom(from);
			helper.setSubject(subject);
			helper.setText(getMailText(tplVar, tplFilename), true);
			mailSender.send(msg);
			log.info(String.format("邮件发送成功,发件人：%s，收件人：%s，主题：%s", from, to, subject));
		} catch (Exception e) {
			log.info("邮件发送出错，" + e.getMessage());
			throw new ApplicationException(e);
		}
	}

	/**
	 * 获取邮件内容
	 * 
	 * @param dto
	 *            模板参数-值对
	 * @param tplFilename
	 *            模板文件名
	 * @return
	 */
	public String getMailText(Dto tplVar, String tplFilename) throws VelocityException {
		return VelocityEngineUtils.mergeTemplateIntoString(velocityEngine, tplFilename, tplVar);
	}

	/**
	 * 根据类路径得到文件
	 * 
	 * @param filePath
	 * @return
	 * @throws Exception
	 */
	public File getFile(String filePath) throws Exception {
		return new ClassPathResource(filePath).getFile();
	}

	public void setVelocityEngine(VelocityEngine velocityEngine) {
		this.velocityEngine = velocityEngine;
	}

	public void setMailSender(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

}
