package com.cnnct.rfid.web;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.alibaba.fastjson.JSONObject;
import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.QAInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.TimeUtil;

/************************************************
 * 创建日期: 2013-11-20 创建作者：zhouww 功能：问题解决方案 最后修改时间： 修改记录：`
 *************************************************/
public class QAInfoAction extends BaseAction {
	private QAInfoService qaInfoService = (QAInfoService) super
			.getService("qaInfoService");
	private String separator = File.separator;

	/**
	 * 问题界面初始化
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward initQAInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("QAInfoView");
	}

	/**
	 * 查询保存数据库的数据
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryQAInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("info_type", "4");
		Dto outDto = qaInfoService.queryQAInfo(inDto);
		String outStr = outDto.getDefaultJson();
		response.getWriter().write(outStr);
		response.getWriter().close();
		return mapping.findForward(null);
	}
	/**
	 * 查询系统公告
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward querySysInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("info_type", "5");
		Dto outDto = qaInfoService.queryQAInfo(inDto);
		String outStr = outDto.getDefaultJson();
		response.getWriter().write(outStr);
		response.getWriter().close();
		return mapping.findForward(null);
	}
	/**
	 * 查询经验分享的数据
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryExpInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("info_type", "3");
		Dto outDto = qaInfoService.queryQAInfo(inDto);
		String outStr = outDto.getDefaultJson();
		response.getWriter().write(outStr);
		response.getWriter().close();
		return mapping.findForward(null);
	}
	
	/**
	 * 依据问题 查询保存数据库的数据
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryByAnswer(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		String answer = inDto.getAsString("answer");
		inDto.put("answer", answer);
		Dto outDto = qaInfoService.queryByAnswer(inDto);
		String outStr = outDto.getDefaultJson();
		response.getWriter().write(outStr);
		response.getWriter().close();
		return mapping.findForward(null);
	}

	/**
	 * 查询文件信息数据
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryFileInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		Dto inDto = cForm.getParamAsDto(request);
		Dto outDto = qaInfoService.queryFileInfo(inDto);
		String outStr = outDto.getDefaultJson();
		response.getWriter().write(outStr);
		response.getWriter().close();
		return mapping.findForward(null);
	}

	/**
	 * 信息的添加
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward addQAInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			CommonActionForm cform = (CommonActionForm) form;
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			checkUserId(user);
			Dto inDto = cform.getParamAsDto(request);
			String info_title = inDto.getAsString("info_title");
			String info_detail = inDto.getAsString("info_detail");
			String info_type=inDto.getAsString("info_type");
			Dto saveDto = new BaseDto();
			saveDto.put("info_title", info_title);
			saveDto.put("info_detail", info_detail);
			saveDto.put("info_type", info_type);
			saveDto.put("opr_name", user.getAccount());
			saveDto.put("pub_time", TimeUtil.getCurrentDate());
			saveDto.put("remark", inDto.getAsString("remark"));
			qaInfoService.saveQAInfo(saveDto);
			Dto outDto = new BaseDto();
			outDto.put("msg", "保存成功");
			outDto.put("success", true);
			String outStr = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(outStr);
		} catch (Exception e) {
			Dto outDto = new BaseDto();
			outDto.put("msg", "保存失败"+e.toString().substring(0,e.toString().indexOf("!")));
			outDto.put("success", false);
			String outStr = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(outStr);
		} finally {
			response.getWriter().close();
		}
		return mapping.findForward(null);
	}

	/**
	 * 信息的修改
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward editQAInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			CommonActionForm cform = (CommonActionForm) form;
			Dto inDto = cform.getParamAsDto(request);
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			String info_type = inDto.getAsString("info_type");
			String info_title = inDto.getAsString("info_title");
			String info_detail = inDto.getAsString("info_detail");
			String seq_no = inDto.getAsString("seq_no");
			String remark=inDto.getAsString("remark");
			Dto saveDto = new BaseDto();
			saveDto.put("seq_no", seq_no);
			saveDto.put("info_title", info_title);
			saveDto.put("info_detail", info_detail);
			saveDto.put("info_type", info_type);
			saveDto.put("opr_name", user.getAccount());
			saveDto.put("pub_time", TimeUtil.getCurrentDate());
			saveDto.put("remark",remark);
			qaInfoService.updateQAInfo(saveDto);
			Dto outDto = new BaseDto();
			outDto.put("success", true);
			String outStr = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(outStr);
		} catch (Exception e) {
			Dto outDto = new BaseDto();
			outDto.put("msg", "保存失败");
			outDto.put("success", false);
			String outStr = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(outStr);
		} finally {
			response.getWriter().close();
		}
		return mapping.findForward(null);

	}

	/**
	 * 信息的删除
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward deleteQAInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			checkUserId(user);
			CommonActionForm cform = (CommonActionForm) form;
			Dto inDto = cform.getParamAsDto(request);
			String seq_no = inDto.getAsString("seq_no");
			Dto saveDto = new BaseDto();
			saveDto.put("seq_no", seq_no);
			qaInfoService.deleteQAInfo(saveDto);
			Dto outDto = new BaseDto();
			outDto.put("msg", "删除成功");
			outDto.put("success", true);
			String outStr = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(outStr);
		} catch (Exception e) {
			Dto outDto = new BaseDto();
			outDto.put("msg", "删除失败");
			outDto.put("success", false);
			String outStr = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(outStr);
		} finally {
			response.getWriter().close();
		}
		return mapping.findForward(null);
	}

	/**
	 * 文件上传
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward uploadFile(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		FormFile myFile = aform.getTheFile();
		String file_name = myFile.getFileName();
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		Dto saveDto = new BaseDto();
		try {
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			checkUserId(user);
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String savePath = contextpath + "resource" + separator + "file"
					+ separator;
			File file = new File(savePath);
			if (!file.exists() && !file.isDirectory()) {
				file.mkdir();
			}
			String file_extensions = file_name.substring(
					file_name.lastIndexOf(".")).toLowerCase();// 文件后缀名
			// 创建一个和文件相对应的唯一的字符串
			String fileName2UUID = UUID.randomUUID().toString();
			// 写文件

			File fileToCreate = new File(savePath, fileName2UUID);
			FileOutputStream os = new FileOutputStream(fileToCreate);
			// 检查同名文件是否存在,不存在则将文件流写入文件磁盘系统
			if (!fileToCreate.exists()) {
				os.write(myFile.getFileData());
				os.flush();
				os.close();
			} else {
				// 此路径下已存在同名文件,是否要覆盖或给客户端提示信息由你自己决定
				os.write(myFile.getFileData());
				os.flush();
				os.close();
			}
			// 修改状态：更新数据库，新增状态：添加信息到集合
			saveDto.put("info_title", inDto.getAsString("info_title"));
			saveDto.put("info_detail", FormetFileSize(myFile.getFileSize()));
			saveDto.put("remark", inDto.getAsString("remark"));
			saveDto.put("opr_name", user.getAccount());
			saveDto.put("pub_time", TimeUtil.getCurrentDate());
			saveDto.put("file_name", file_name);
			saveDto.put("file_name_alias", fileName2UUID);
			qaInfoService.saveFileInfo(saveDto);

			outDto.put("success", true);
			outDto.put("msg", "文件上传成功!");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件上传失败!" + e.getLocalizedMessage());
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}
		return mapping.findForward(null);
	}

	/**
	 * 文件下载
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward downFileInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		try {
			Dto fileInfo = (Dto) g4Reader
					.queryForObject("queryFileInfo", inDto);
			String fileName = fileInfo.getAsString("file_name");// 记录在数据库的文件名
			String aliasName = fileInfo.getAsString("file_name_alias");

			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator + aliasName;
			File file = new File(path);
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(path));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			String fs = new String(fileName.getBytes("GB2312"), "iso8859-1");
			response.addHeader("Content-Disposition", "attachment;filename="
					+ fs);
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(
					response.getOutputStream());
			response.setContentType("application/octet-stream");
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件下载失败!");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}

		return null;
	}

	/**
	 * 删除 文件信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward deleteFileInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		try {
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			checkUserId(user);
			Dto fileDto = (Dto) g4Reader.queryForObject("queryFileInfo", inDto);
			String fileName = fileDto.getAsString("file_name");// 记录在数据库的文件名
			String aliasName = fileDto.getAsString("file_name_alias");
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator;
			File file = new File(path + aliasName);

			qaInfoService.deleteQAInfo(fileDto);
			// 更新数据库后删除本地文件
			if (file.exists()) {
				file.delete();
			}
			outDto.put("success", true);
			outDto.put("msg", "文件删除成功!");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件删除失败!" + e.getLocalizedMessage());
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}
		return null;
	}
/**
 * 查询最新的生产通知单模板 
 * @param mapping
 * @param form
 * @param request
 * @param response
 * @return
 * @throws Exception
 */
	public ActionForward findLatestProdFile(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto inDto = new BaseDto();
		inDto.put("key1", "模板");
		inDto.put("key2", "生产通知单");
		Dto outDto=(Dto)g4Reader.queryForObject("findLatestProdFile", inDto);
		outDto.put("success", true);
		outDto.put("msg", "通知单模板最后更新时间为"+outDto.getAsString("pub_time")+"，请核对你的模板");
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	public String FormetFileSize(long fileS) {// 转换文件大小
		DecimalFormat df = new DecimalFormat("#.00");
		String fileSizeString = "";
		if (fileS < 1024) {
			fileSizeString = df.format((double) fileS) + "B";
		} else if (fileS < 1048576) {
			fileSizeString = df.format((double) fileS / 1024) + "K";
		} else if (fileS < 1073741824) {
			fileSizeString = df.format((double) fileS / 1048576) + "M";
		} else {
			fileSizeString = df.format((double) fileS / 1073741824) + "G";
		}
		return fileSizeString;
	}

	// 限制上传和删除的用户
	public void checkUserId(UserInfoVo user) throws Exception {
		if ("1000".equals(user.getAccount())
				|| "1001".equals(user.getAccount())) {
		} else {
			throw new Exception("您的账户不支持该功能!");
		}

	}
}
