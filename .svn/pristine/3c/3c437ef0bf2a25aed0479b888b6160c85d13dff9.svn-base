package com.cnnct.rfid.web;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.process.prodOrd.ProdOrdProcessControl;
import com.cnnct.rfid.service.ProdOrdInfoService;
import com.cnnct.rfid.util.FileViewControl;
import com.cnnct.rfid.valide.prodOrd.ProdOrdValideControl;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;

/**
 * ********************************************* 创建日期: 13-5-24 创建作者：tangfh
 * 功能：生产通知单管理 最后修改时间： 修改记录： ***********************************************
 */
@SuppressWarnings( { "unchecked", "rawtypes" })
public class ProdOrdInfoAction extends BaseAction {
	private ProdOrdInfoService prodOrdInfoService = (ProdOrdInfoService) super
			.getService("prodOrdInfoService");
	private String separator = File.separator;

	private List list = new ArrayList();// 保存的文件信息

	/**
	 * 页面初始化
	 */
	public ActionForward prodOrdInfoInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("prodOrdInfoView");
	}

	/**
	 * 查询生产通知单文件信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryProdordFile(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		List<Dto> resultList = new ArrayList<Dto>();
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			// 查询生产通知单的某一个类型的文件数据信息
			String seq_no = inDto.getAsString("seq_no");
			String filetype = inDto.getAsString("filetype");

			if (G4Utils.isEmpty(seq_no) || G4Utils.isEmpty(filetype)) {
				throw new Exception("参数设置不正确");
			}
			Dto dbDto = new BaseDto();
			dbDto.put("seq_no", seq_no);
			dbDto.put("filetype", filetype);
			Dto resultDto = (Dto) g4Reader.queryForObject(
					"queryFileInfo4prodord", dbDto);
			// 解析查询文件信息，作为集合返回
			if (!G4Utils.isEmpty(resultDto)) { // 如果存在此生产通知单
				String fileName = resultDto.getAsString("filename");
				String fileNameAlias = resultDto.getAsString("filenamealias");
				String prod_ord_seq = resultDto.getAsString("prod_ord_seq");
				String ord_seq_no = resultDto.getAsString("ord_seq_no");
				if (G4Utils.isEmpty(fileName) || G4Utils.isEmpty(fileNameAlias)) { // 判断有没有文件信息
					throw new Exception("没有文件信息");
				}
				String[] fileNames = fileName.split(",");
				String[] filealias = fileNameAlias.split(",");
				if (fileNames.length != filealias.length) {
					throw new Exception("文件信息不匹配");
				}
				for (int idx = 0; idx < fileNames.length; idx++) {
					Dto beanDto = new BaseDto();
					beanDto.put("filename", fileNames[idx]);
					beanDto.put("filenamealias", filealias[idx]);
					beanDto.put("prod_ord_seq", prod_ord_seq);
					beanDto.put("ord_seq_no", ord_seq_no);
					beanDto.put("filetype", filetype);
					beanDto.put("seq_no", seq_no);
					resultList.add(beanDto);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		String resultStr = JsonHelper.encodeObject2Json(resultList);
		super.write(resultStr, response);
		return mapping.findForward(null);
	}

	/**
	 * 查询生产通知单信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryProdOrdInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		String account = user.getAccount();
		super.setSessionAttribute(request, "QUERYPRODORDINFO_DTO", inDto);

		inDto.put("account", account);
		Dto outDto = prodOrdInfoService.queryProdOrdInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		System.out.println(jsonStrList);
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}

	/**
	 * 保存我的订单
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward saveMyOrder(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto parDto = aForm.getParamAsDto(request);

		UserInfoVo user = super.getSessionContainer(request).getUserInfo();

		parDto.put("account", user.getAccount()); // 添加用户
		prodOrdInfoService.saveMyOrder(parDto);
		return mapping.findForward(null);

	}

	/**
	 * 查询页面载入时所有产品信息
	 */
	public ActionForward queryProdBasInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String grp_id = super.getSessionContainer(request).getUserInfo()
				.getGrpId();
		Dto outDto = prodOrdInfoService.queryProdBasInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}

	/**
	 * 查询页面载入时所有产品信息
	 */
	public ActionForward queryProdOrdBasInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String grp_id = super.getSessionContainer(request).getUserInfo()
				.getGrpId();
		Dto outDto = prodOrdInfoService.queryProdOrdBasInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}

	/**
	 * 查询页面载入时所有产品信息
	 */
	public ActionForward queryProdInsInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		String grp_id = super.getSessionContainer(request).getUserInfo()
				.getGrpId();
		Dto outDto = prodOrdInfoService.queryProdInsInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}

	/**
	 * 生产通知单 保存和修改相关操作
	 */
	public ActionForward saveProdOrdInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			String opr_name = user.getUsername();
			String opr_date = G4Utils.getCurrentTime();
			Dto prodOrdInfo = (Dto) g4Reader.queryForObject(
					"queryOprNameBySeqno", inDto);
			String loginName = super.getSessionContainer(request).getUserInfo().getUsername();
			// 添加跟单员修改权限  跟单员不做为空权限判断
			// 2014.10.15 zhouww
			if (!(prodOrdInfo != null
					&& !"".equals(prodOrdInfo.getAsString("account"))
					&& user.getAccount().equals(
							prodOrdInfo.getAsString("account"))) 
				&& !(prodOrdInfo!=null && loginName.equals(prodOrdInfo.getAsString("opr_merchandiser")))) {
				throw new ApplicationException("订单只能由导入或最后修改的人修改");
			}
			
			inDto.put("account", user.getAccount());
			inDto.put("new_opr_date", TimeUtil.getCurrentDate());

			jsDateFormat(inDto, "delivery_date");
			jsDateFormat(inDto, "notity_date");
			jsDateFormat(inDto, "sew_delivery_date");
			jsDateFormat(inDto, "bach_delivery_date");
			jsDateFormat(inDto, "pack_delivery_date");
			jsDateFormat(inDto, "plan_check_date");
			jsDateFormat(inDto, "purchase_check_date");
			jsDateFormat(inDto, "trade_check_date");
			jsDateFormat(inDto, "fob_deal_date");
			jsDateFormat(inDto, "check_prod_date");

			String check_prod_date = inDto.getAsString("check_prod_date");
			String fob_deal_date = inDto.getAsString("fob_deal_date");

			// // 修改尾查期和fob交期的判断条件
			// if (!"".equals(fob_deal_date) && !"".equals(check_prod_date)
			// && TimeUtil.comDate(check_prod_date, fob_deal_date)) {
			// throw new ApplicationException("尾查期不能晚于fob交期");
			// }
			inDto.put("remark", inDto.getAsString("remark").replaceAll("\n",
					";"));

			// Map file_map = (Map) super.getSessionAttribute(request,
			// "PROD_ORD_FILE_MAP");
			// if (!G4Utils.isEmpty(file_map)) {// 文件信息不为空
			// Set fileSet = file_map.keySet();
			// for (Object obj : fileSet) {
			// String key = (String) obj;
			// Dto file_dto = (Dto) file_map.get(key);
			// inDto.put(file_dto.get("file_type"),
			// file_dto.get("file_name"));
			// inDto.put(file_dto.get("file_type") + "_alias",
			// file_dto.get("aliasName"));
			// }
			// }
			// 检测基础数据的合规性
			ProdOrdValideControl povc = new ProdOrdValideControl(); // 
																	// 可以考虑将此判断和操作在service中处理，业务和控制器分开
			povc.valideProdordBaseInfo(inDto, g4Reader);
			// 更新，新增标识
			String flag = inDto.getAsString("flag");
			if (flag.equals("update")) {
				outDto = updateProdOrd(inDto);
			} else {
				// 检测基础数据的合规性
				povc.valideProdordRedataInfo(inDto, g4Reader); // 新增判断重复数据
				outDto = saveProdOrd4Web(inDto);
			}
			String jsonStrList = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonStrList, response);
		} catch (ApplicationException e) {
			e.printStackTrace();
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "生产通知单登记失败");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		}
		return mapping.findForward(null);
	}

	public void jsDateFormat(Dto inDto, String key) {
		String date = inDto.getAsString(key);
		if (!date.equals("")) {
			date = date.substring(0, 10);
		} else {
			date = " ";
		}
		inDto.put(key, date);
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
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		String file_name = myFile.getFileName();
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		Dto fileDto = new BaseDto();
		try {

			String exist_file_name = inDto.getAsString("exist_file_name");
			String file_type = inDto.getAsString("file_type");

			if (exist_file_name.contains(file_name)) {
				outDto.put("success", false);
				outDto.put("msg", "文件上传重复!");
				String jsonString = JsonHelper.encodeObject2Json(outDto);
				write(jsonString, response);
				return mapping.findForward(null);
			}
			Integer seq_no = 0;
			if (!"".equals(exist_file_name)) {
				seq_no = exist_file_name.split(",").length;
			}

			String prod_ord_flag = inDto.getAsString("prod_ord_flag");// 生产通知单模式
			String prod_ord_seq = inDto.getAsString("prod_ord_seq");

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
			String fileName = "";
			if ("add".equals(prod_ord_flag)) {// 新增的时候保存缓存文件
				fileDto.put("file_type", file_type);
				fileDto.put("savePath", savePath);
				fileDto.put("file_name", file_name);
				fileDto.put("aliasName", fileName2UUID);
				String fileFlag = savePath + file_type;

				// 设置用户操作缓存信息
				Map map = (Map) super.getSessionAttribute(request,
						"PROD_ORD_FILE_MAP");
				if (map == null) {
					map = new HashMap();
					map.put(fileFlag, fileDto);
					super
							.setSessionAttribute(request, "PROD_ORD_FILE_MAP",
									map);
				} else {
					map.put(fileFlag, fileDto);
				}
			} else {// 修改的时候直接更新
				//取消文件上传权限
//				Dto obj = (Dto) g4Reader.queryForObject("queryOprNameBySeqno",
//						inDto);
//				if (obj != null && !"".equals(obj.getAsString("account"))
//						&& !user.getAccount().equals(obj.getAsString("account"))) {
//					throw new ApplicationException("订单只能由导入的人修改");
//				}
				// 查询 文件信息
				Dto prodFileInfo = (Dto) g4Reader.queryForObject(
						"queryProdOrdInfoFileInfo", inDto);
				String typeNames = prodFileInfo.getAsString(file_type);
				String typeAlias = prodFileInfo.getAsString(file_type
						+ "_alias");
				inDto.put(file_type + "_name", "".equals(typeNames) ? file_name
						: typeNames + "," + file_name);
				inDto.put(file_type, "not null");
				inDto.put(file_type + "_alias",
						"".equals(typeAlias) ? fileName2UUID : typeAlias + ","
								+ fileName2UUID);
				prodOrdInfoService.updateFileInfo(inDto);
			}

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
	 * 检查要下载文件的正确性,采用文件名别名验证，不采用名字验证
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward checkDownFile4alias(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();

		try {
			String file_type = inDto.getAsString("file_type");
			Integer seq_no = inDto.getAsInteger("seq_no");
			String file_name = inDto.getAsString("file_name");
			String file_name_alias = inDto.getAsString("file_name_alias");
			inDto.remove("seq_no");

			if (G4Utils.isEmpty(file_name_alias) || G4Utils.isEmpty(file_type)) {
				throw new Exception("必须要参数不能为空");
			}

			Dto fileInfo = (Dto) g4Reader.queryForObject(
					"queryProdOrdInfoFileInfo", inDto);

			String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
			String aliasNames = fileInfo.getAsString(file_type + "_alias");
			// 记录在服务器的文件名
			String[] fileNamesArr = fileNames.split(",");
			String[] aliasNamesArr = aliasNames.split(",");
			if (fileNamesArr.length != aliasNamesArr.length) {
				throw new ApplicationException("文件错误");
			}
			String dbFileName = "";
			for (int k = 0; k < aliasNamesArr.length; k++) {
				if (file_name_alias.equals(aliasNamesArr[k])) {
					dbFileName = fileNamesArr[k];
				}
			}
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator + file_name_alias;
			File file = new File(path);
			// 判断文件是否存在：存在的条件为 数据库里文件名，磁盘里保存有此文件名的文件
			// 判断正确的情况， 异常情况都由异常捕获处理
			if (aliasNames.indexOf(file_name_alias) != -1 && file.exists()
					&& !file.isDirectory()) {
				outDto.put("success", true);
				outDto.put("msg", "文件检查成功");
				String jsonString = JsonHelper.encodeObject2Json(outDto);
				write(jsonString, response);
			} else {
				outDto.put("success", false);
				outDto.put("msg", "文件检查失败");
				String jsonString = JsonHelper.encodeObject2Json(outDto);
				write(jsonString, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件检查失败");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}

		return mapping.findForward(null);
	}

	/**
	 * 检查要下载文件的正确性
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward checkDownFile(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();

		try {
			String file_type = inDto.getAsString("file_type");
			Integer seq_no = inDto.getAsInteger("seq_no");
			String file_name = inDto.getAsString("file_name");
			String file_name_alias = inDto.getAsString("file_name_alias");
			inDto.remove("seq_no");
			Dto fileInfo = (Dto) g4Reader.queryForObject(
					"queryProdOrdInfoFileInfo", inDto);

			String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
			String aliasNames = fileInfo.getAsString(file_type + "_alias");
			// 记录在服务器的文件名
			String fileName = "";
			String[] fileNamesArr = fileNames.split(",");
			String[] aliasNamesArr = aliasNames.split(",");
			if (fileNamesArr.length != aliasNamesArr.length) {
				throw new ApplicationException("文件错误");
			}
			for (int k = 0; k < fileNamesArr.length; k++) {
				if (file_name.equals(fileNamesArr[k])) {
					fileName = aliasNamesArr[k];
				}
			}
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator + fileName;
			File file = new File(path);
			// 判断文件是否存在：存在的条件为 数据库里文件名，磁盘里保存有此文件名的文件
			// 判断正确的情况， 异常情况都由异常捕获处理
			if (fileNames.indexOf(file_name) != -1 && file.exists()
					&& !file.isDirectory()) {
				outDto.put("success", true);
				outDto.put("msg", "文件检查成功");
				String jsonString = JsonHelper.encodeObject2Json(outDto);
				write(jsonString, response);
			} else {
				outDto.put("success", false);
				outDto.put("msg", "文件检查失败");
				String jsonString = JsonHelper.encodeObject2Json(outDto);
				write(jsonString, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件检查失败");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}

		return mapping.findForward(null);
	}
	/**
	 * 下载文件:参数为文件别名
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward downFileInfo4alias(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		try {
			String file_type = inDto.getAsString("file_type");
			Integer seq_no = inDto.getAsInteger("seq_no");
			String file_name = inDto.getAsString("file_name");
			String file_name_alias = inDto.getAsString("file_name_alias");
			inDto.remove("seq_no");

			if (G4Utils.isEmpty(file_name_alias) || G4Utils.isEmpty(file_type)) {
				throw new Exception("必须要参数不能为空");
			}

			Dto fileInfo = (Dto) g4Reader.queryForObject(
					"queryProdOrdInfoFileInfo", inDto);

			String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
			String aliasNames = fileInfo.getAsString(file_type + "_alias");
			// 记录在服务器的文件名
			String[] fileNamesArr = fileNames.split(",");
			String[] aliasNamesArr = aliasNames.split(",");
			if (fileNamesArr.length != aliasNamesArr.length) {
				throw new ApplicationException("文件错误");
			}
			String dbFileName = "";
			for (int k = 0; k < aliasNamesArr.length; k++) {
				if (file_name_alias.equals(aliasNamesArr[k])) {
					dbFileName = fileNamesArr[k];
				}
			}
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator + file_name_alias;
			File file = new File(path);
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(path));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			String fs = new String(dbFileName.getBytes("UTF8"), "iso8859-1");
			response.addHeader("Content-Disposition", "attachment;filename="
					+ fs);
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(response
					.getOutputStream());
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
	 * 预览文件信息判断
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward viewProdordFile4valide(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto outDto = new BaseDto();
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			super.setSessionAttribute(request, "viewProdordFileDto", inDto);
			outDto.put("success", true);
		}catch(Exception e){
			e.printStackTrace();
			outDto.put("success", false);
		}
		String resultStr = JsonHelper.encodeObject2Json(outDto);
		super.write(resultStr, response);
		return mapping.findForward(null);
	}
	
	
	/**
	 * 文件预览
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward viewProdordFile4alias(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		// 查找查询的文件
		// 获取文件信息 
		// 文件输出到响应
		
		Dto outDto = new BaseDto();
		try {
			Dto inDto = (Dto)super.getSessionAttribute(request, "viewProdordFileDto");
			inDto = inDto==null ? new BaseDto() : inDto;
			String file_type = inDto.getAsString("filetype");
			String file_name_alias = inDto.getAsString("filenamealias");
			String prod_ord_seq = inDto.getAsString("prod_ord_seq");
			if (G4Utils.isEmpty(file_name_alias) || G4Utils.isEmpty(file_type)) {
				throw new Exception("必须要参数不能为空");
			}
			
			Dto dbDto = new BaseDto();
			dbDto.put("prod_ord_seq", prod_ord_seq);
			
			Dto fileInfo = (Dto) g4Reader.queryForObject(
					"queryProdOrdInfoFileInfo", dbDto);

			String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
			String aliasNames = fileInfo.getAsString(file_type + "_alias");
			// 记录在服务器的文件名
			String[] fileNamesArr = fileNames.split(",");
			String[] aliasNamesArr = aliasNames.split(",");
			if (fileNamesArr.length != aliasNamesArr.length) {
				throw new ApplicationException("文件错误");
			}
			String dbFileName = "";
			for (int k = 0; k < aliasNamesArr.length; k++) {
				if (file_name_alias.equals(aliasNamesArr[k])) {
					dbFileName = fileNamesArr[k];
				}
			}
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}
			
			// 以上为文件查找
			// 以下为预览文件处理
			
			// 判断文件格式
			String fileFormat = "";
			if(dbFileName.indexOf(".")>0){
				fileFormat = dbFileName.substring(dbFileName.lastIndexOf("."), dbFileName.length()); 
			}
			// 过滤不正确格式
			if("".equals(fileFormat)){
				throw new ApplicationException("文件格式不正确");
			}
			// 输出字节数组
			byte[] bytes = new byte[0];
			
			String filePath = contextpath + "resource" + separator + "file"
				+ separator;
			String filename = file_name_alias;
			
			
			String[] officeType = new String[]{".xls",".xlsx",".doc",".docx"};	// 可处理的文档
			String[] jpegType = new String[]{".jpg",".jpeg"};	// 处理图片的格式
			if(Arrays.asList(jpegType).contains(fileFormat)){	// 处理jpg文件
				String extension =".jpg";
				bytes = FileViewControl.parseViewJSPFile(extension, filePath, filename);
				response.setContentType("image/jpeg");
			}else if(".png".equals(fileFormat)){	// 处理png文件
				String extension = ".png";
//				bytes = FileViewControl.parseViewPNGFile(extension, filePath, filename);
				bytes = FileViewControl.parseViewJSPFile(extension, filePath, filename);
				response.setContentType("image/png");
			}else {	// 剩余情况当office文档处理
				String extension = fileFormat;
				bytes = FileViewControl.parseOfficeFile4swf(extension, filePath, filename);
				response.setContentType("application/pdf");
			
			}
			
			response.getOutputStream().write(bytes);
			response.getOutputStream().flush();
			response.getOutputStream().close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	
	
	/**
	 * 下载文件
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
			String file_type = inDto.getAsString("file_type");
			Integer seq_no = inDto.getAsInteger("seq_no");
			String file_name = inDto.getAsString("file_name");
			inDto.remove("seq_no");
			Dto fileInfo = (Dto) g4Reader.queryForObject(
					"queryProdOrdInfoFileInfo", inDto);

			String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
			String aliasNames = fileInfo.getAsString(file_type + "_alias");
			// 记录在服务器的文件名
			String fileName = "";
			String[] fileNamesArr = fileNames.split(",");
			String[] aliasNamesArr = aliasNames.split(",");
			for (int k = 0; k < fileNamesArr.length; k++) {
				if (file_name.equals(fileNamesArr[k])) {
					fileName = aliasNamesArr[k];
				}
			}
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator + fileName;
			File file = new File(path);
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(path));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			String fs = new String(file_name.getBytes("GB2312"), "iso8859-1");
			response.addHeader("Content-Disposition", "attachment;filename="
					+ fs);
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(response
					.getOutputStream());
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
	 * 删除 文件信息：参数为文件的别名，不是文件名作为参考
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward deleteFileInfo4alias(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		try {
			String file_type = inDto.getAsString("filetype");
			String file_name = inDto.getAsString("filename");
			String prod_ord_flag = inDto.getAsString("prod_ord_flag");
			String file_name_alias = inDto.getAsString("filenamealias");
			Integer seq_no = inDto.getAsInteger("seq_no");

			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator;

			if ("add".equals(prod_ord_flag)) {
			} else {
				inDto.remove("seq_no");
				Dto obj = (Dto) g4Reader.queryForObject("queryOprNameBySeqno",
						inDto);
				// 添加跟单员操作权限 
				// zhouww 2014.10.15
				String loginName = super.getSessionContainer(request).getUserInfo().getUsername();
				if (!(obj != null && !"".equals(obj.getAsString("account"))
						&& user.getAccount().equals(obj.getAsString("account")))
						&& !(obj!=null && loginName.equals(obj.getAsString("opr_merchandiser")))) {
					throw new ApplicationException("订单只能由导入的人修改");
				}
				
				
				Dto fileInfo = (Dto) g4Reader.queryForObject(
						"queryProdOrdInfoFileInfo", inDto);
				String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
				String aliasNames = fileInfo.getAsString(file_type + "_alias");
				// 记录在服务器的文件名
				String fileName = "";
				String[] fileNamesArr = fileNames.split(",");
				String[] aliasNamesArr = aliasNames.split(",");
				List<String> upLoadFiles = new ArrayList<String>();
				List<String> aliasNamesList = new ArrayList<String>();
				for (int k = 0; k < aliasNamesArr.length; k++) {
					if (file_name_alias.equals(aliasNamesArr[k])) {
						fileName = fileNamesArr[k];
					}
					upLoadFiles.add(fileNamesArr[k]);
					aliasNamesList.add(aliasNamesArr[k]);
				}

				File file = new File(path + file_name_alias);
				if (aliasNamesList.contains(file_name_alias)) {
					// 处理文件名
					StringBuffer sb = new StringBuffer(100);
					upLoadFiles.remove(file_name);
					for (String name : upLoadFiles) {
						sb.append(name).append(",");
					}
					if (sb.length() > 0) {
						sb.deleteCharAt(sb.length() - 1);
					}
					inDto.put(file_type, "not null");
					inDto.put(file_type + "_name", sb.toString());
					// 处理别名
					sb = new StringBuffer(100);
					aliasNamesList.remove(file_name_alias);
					for (String name : aliasNamesList) {
						sb.append(name).append(",");
					}
					if (sb.length() > 0) {
						sb.deleteCharAt(sb.length() - 1);
					}
					inDto.put(file_type + "_alias", sb.toString());

					prodOrdInfoService.updateFileInfo(inDto);
				}
				// 添加判断文件是否被多个其他的资源使用，如果是则不删除文件，如果不是则删除文件
				Dto dbDto = new BaseDto();
				dbDto.put("fileAlias", file_name_alias);
				
				// 更新数据库后删除本地文件
				if (file.exists()) {
					file.delete();
				}
			}

			outDto.put("success", true);
			outDto.put("msg", "文件删除成功!");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件下载失败!" + e.getLocalizedMessage());
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
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		Dto inDto = aform.getParamAsDto(request);
		Dto outDto = new BaseDto();
		try {
			String file_type = inDto.getAsString("file_type");
			String file_name = inDto.getAsString("file_name");
			String prod_ord_flag = inDto.getAsString("prod_ord_flag");
			String file_name_alias = inDto.getAsString("file_name_alias");
			Integer seq_no = inDto.getAsInteger("seq_no");

			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}

			String path = contextpath + "resource" + separator + "file"
					+ separator;

			if ("add".equals(prod_ord_flag)) {
			} else {
				inDto.remove("seq_no");
				Dto obj = (Dto) g4Reader.queryForObject("queryOprNameBySeqno",
						inDto);
//				if (obj != null && !"".equals(obj.getAsString("account"))
//						&& !user.getAccount().equals(obj.getAsString("account"))) {
//					throw new ApplicationException("订单只能由导入的人修改");
//				}
				String loginName = super.getSessionContainer(request).getUserInfo().getUsername();
				if (!(obj != null && !"".equals(obj.getAsString("account"))
						&& user.getAccount().equals(obj.getAsString("account")))
						&& !(obj!=null && loginName.equals(obj.getAsString("opr_merchandiser")))) {
					throw new ApplicationException("订单只能由导入的人修改");
				}
				
				Dto fileInfo = (Dto) g4Reader.queryForObject(
						"queryProdOrdInfoFileInfo", inDto);
				String fileNames = fileInfo.getAsString(file_type);// 记录在数据库的文件名
				String aliasNames = fileInfo.getAsString(file_type + "_alias");
				// 记录在服务器的文件名
				String fileName = "";
				String[] fileNamesArr = fileNames.split(",");
				String[] aliasNamesArr = aliasNames.split(",");
				for (int k = 0; k < fileNamesArr.length; k++) {
					if (file_name.equals(fileNamesArr[k])) {
						fileName = aliasNamesArr[k];
					}
				}

				List<String> upLoadFiles = new ArrayList<String>();
				List<String> aliasNamesList = new ArrayList<String>();
				for (String s : fileNamesArr) {
					upLoadFiles.add(s);
				}
				for (String s : aliasNamesArr) {
					aliasNamesList.add(s);
				}

				File file = new File(path + fileName);
				if (upLoadFiles.contains(file_name)) {
					// 处理文件名
					StringBuffer sb = new StringBuffer(100);
					upLoadFiles.remove(file_name);
					for (String name : upLoadFiles) {
						sb.append(name).append(",");
					}
					if (sb.length() > 0) {
						sb.deleteCharAt(sb.length() - 1);
					}
					inDto.put(file_type, "not null");
					inDto.put(file_type + "_name", sb.toString());
					// 处理别名
					sb = new StringBuffer(100);
					aliasNamesList.remove(fileName);
					for (String name : aliasNamesList) {
						sb.append(name).append(",");
					}
					if (sb.length() > 0) {
						sb.deleteCharAt(sb.length() - 1);
					}
					inDto.put(file_type + "_alias", sb.toString());

					prodOrdInfoService.updateFileInfo(inDto);
				}
				// 更新数据库后删除本地文件
				if (file.exists()) {
					file.delete();
				}
			}

			outDto.put("success", true);
			outDto.put("msg", "文件删除成功!");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("msg", "文件下载失败!" + e.getLocalizedMessage());
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			write(jsonString, response);
		}

		return null;
	}

	/**
	 * 订单信息删除
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward deleteProdOrdInfoAction(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			inDto.put("account", user.getAccount()); 
			inDto.put("opr_date", G4Utils.getCurrentTime());
			// 判断有无删除权限
			Dto obj = (Dto) g4Reader.queryForObject("queryOprNameBySeqno",
					inDto);
//			if (obj != null && !"".equals(obj.getAsString("account"))
//					&& !user.getAccount().equals(obj.getAsString("account"))) {
//				throw new ApplicationException("订单只能由导入的人修改");
//			}
//			1.24关闭 xtj
//			String loginName = super.getSessionContainer(request).getUserInfo().getUsername();
//			if (!(obj != null && !"".equals(obj.getAsString("account"))
//					&& user.getAccount().equals(obj.getAsString("account")))
//					&& !(obj!=null && loginName.equals(obj.getAsString("opr_merchandiser")))) {
//				throw new ApplicationException("订单只能由导入的人修改");
//			}
			
			
			// 判断生产通知单是否已经有绑定或者有订单导入信息
			// 如果有则不能够删除，如果没有则删除生产通知单
			inDto.put("state", "1");
			String isAll = inDto.getAsString("isAll"); // 是否全部删除标示
			String checkStr = inDto.getAsString("checkStr");
			if ("yes".equals(isAll)) {
				inDto.put("reqCode", inDto.getAsString("reqCode")+"all");
				prodOrdInfoService.logProdDelete(inDto);
				outDto = prodOrdInfoService.deleteAllInfo4ProdOrd(inDto);
				//TODO 订单附件的删除 
			} else {
				inDto.put("reqCode", inDto.getAsString("reqCode")+"_onlyOrder");
				prodOrdInfoService.logProdDelete(inDto);
				outDto = prodOrdInfoService.deleteProdOrdInfo(inDto);
			}
			outDto.put("msg", "生产通知单删除成功!");
			outDto.put("success", true);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("failure", new Boolean(true));
			outDto.put("msg", "生产通知单删除失败" + e.getLocalizedMessage());
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		
		return mapping.findForward(null);
	}

	/**
	 * 订单号下拉框查询
	 */
	public ActionForward getOrdIdCombox(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		List list = g4Reader.queryForList("getOrdIdCombox", inDto);
		String jsonString = JsonHelper.encodeObject2Json(list);
		response.getWriter().write(jsonString);
		return mapping.findForward(null);
	}

	/**
	 * 获取产品基本信息下拉框
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward getProdBasInfoCombo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);

		// 订单状态处理
		String orderstatus = inDto.getAsString("orderstatus");
		if ("9".equals(orderstatus)) {
			inDto.remove("orderstatus");
		}
		// 我的订单状态处理
		String myorder = inDto.getAsString("ismyorder");
		if (!"yes".equals(myorder)) {
			inDto.remove("ismyorder");
		}
		inDto.put("account", super.getSessionContainer(request).getUserInfo()
				.getAccount());
		Dto outDto = prodOrdInfoService.getProdBasInfoCombo(inDto);

		super.write(outDto.getAsString("jsonString"), response);
		return mapping.findForward(null);
	}

	/**
	 * 生产通知单导出
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward excleProdOrderInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();

		Dto inDto = (Dto) super.getSessionAttribute(request,
				"QUERYPRODORDINFO_DTO");

		inDto.remove("queryForPageCountFlag");
		parametersDto.put("reportTitle", "生产通知单信息"); // parameter
		List list = g4Reader.queryForList("queryProdOrdInfo", inDto);
		for (int i = 0; i < list.size(); i++) {
			Dto devDto = (Dto) list.get(i);
			if (devDto.getAsString("state").equals("0")) {
				devDto.put("state", "正常");
			} else if (devDto.getAsString("state").equals("1")) {
				devDto.put("state", "取消");
			}
		}
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/prodOrderInfo.xls");
		excelExporter.setData(parametersDto, list);
		excelExporter.setFilename("生产通知单详情表" + TimeUtil.getCurrentDate()
				+ ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

	/**
	 * 生产通知单导出
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward excleSelectProdOrderInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();

		Dto inDto = (Dto) super.getSessionAttribute(request,
				"QUERYSELECTPRODORDINFO_DTO");
		// 清楚session中缓存的请求信息
		String prod_ord_seqs = inDto.getAsString("prod_ord_seqs");
		StringBuffer sb = new StringBuffer();
		for (String s : prod_ord_seqs.split(",")) {
			sb.append("'").append(s).append("',");
		}
		inDto.put("prod_ord_seq_list", sb.substring(0, sb.length() - 1));

		inDto.remove("queryForPageCountFlag");
		parametersDto.put("reportTitle", "生产通知单信息"); // parameter
		List list = g4Reader.queryForList("queryProdOrdInfo", inDto);
		for (int i = 0; i < list.size(); i++) {
			Dto devDto = (Dto) list.get(i);
			if (devDto.getAsString("state").equals("0")) {
				devDto.put("state", "正常");
			} else if (devDto.getAsString("state").equals("1")) {
				devDto.put("state", "取消");
			}
		}
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/prodOrderInfo.xls");
		excelExporter.setData(parametersDto, list);
		excelExporter.setFilename("生产通知单详情表" + TimeUtil.getCurrentDate()
				+ ".xls");
		excelExporter.export(request, response);

		// super.setSessionAttribute(request,
		// "QUERYSELECTPRODORDINFO_DTO",null);
		return mapping.findForward(null);
	}

	/**
	 * 导入生产通知单,根据标准格式进行判断
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward importProdOrdInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm actionForm = (CommonActionForm) form;
		Dto inDto = actionForm.getParamAsDto(request);
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		Dto outDto = new BaseDto();
		String prod_ord_seq = "";
		String ord_seq_no = "";
		//操作异常回滚数据标识
		boolean isValided = false;
		//错误信息拼接字符串
		StringBuffer errSb = new StringBuffer();
		//通知单文件
		FormFile theFile = actionForm.getTheFile();
		//文件名
		String file_name = theFile.getFileName();
		//文件别名
		String fileName2UUID = UUID.randomUUID().toString();
		String grp_id = user.getGrpId();// 单位代码
		String account = user.getAccount();	//操作员
		inDto.put("grp_id", grp_id);
		inDto.put("account", account);
		inDto.put("opr_date", G4Utils.getCurrentTime());
		
		try {
			// 传入文档的解析处理,数据合法性判断
			ProdOrdProcessControl popc = new ProdOrdProcessControl();
			ProdOrdValideControl povc = new ProdOrdValideControl();
			Dto sheetsDto = popc.praseProdOrdExcel(inDto, g4Reader, theFile
					.getInputStream());
			outDto.put("success", false);
			for (int sheetNo = 0; sheetNo < sheetsDto.keySet().size(); sheetNo++) {
				try {
					isValided=true;
					Dto baseDto = (Dto) sheetsDto.get(sheetNo);
					povc.prodOrdImportValide(baseDto, g4Reader);
					prod_ord_seq = baseDto.getAsString("prod_ord_seq");
					ord_seq_no=baseDto.getAsString("ord_seq_no");
					List<Dto> productList = (List<Dto>) baseDto
							.get("productList");
					//  提取生成的订单和完单号，共用其他的信息，保存订单信息
					// 如果是复合订单则在复合订单表中增加多订单的映射关系
					baseDto.put("prod_ord_file", file_name);
					baseDto.put("prod_ord_file_alias", fileName2UUID);
					// 保存生产通知单
					prodOrdInfoService.addProdOrdDef(baseDto);

					// 保存产品信息
					for (Dto productDto : productList) {
						prodOrdInfoService.addProdBasDef(productDto);
					}
					// 数据库数据插入结束
					isValided = false;
					
					System.out.println("生成通知单" + prod_ord_seq + "导入成功!");
					errSb.append("生成通知单" + prod_ord_seq + "导入成功!</br>");
					// String jsonString = JsonHelper.encodeObject2Json(outDto);
					// response.getWriter().write(jsonString);
				} catch (Exception e) {
					e.printStackTrace();
					if (e.getMessage().indexOf("SQL")!=-1) {
						errSb.append( prod_ord_seq+"通知单尺寸信息存在匹配错误,请校验你的国家，颜色，尺寸是否正确"+e.getMessage().substring(20));
					}else{
						errSb.append(prod_ord_seq+"通知单操作错误"+e.getMessage());
					}
					
					// 添加导入失败的数据清除操作
					try {
						//报数据操作错误回退所有保存的订单信息
						if (isValided&&e.toString().indexOf("SQL")!=-1) {
							Dto paramDto = new BaseDto();
							paramDto.put("prod_ord_seq", prod_ord_seq);
							paramDto.put("ord_seq_no", ord_seq_no);
							prodOrdInfoService.logProdDelete(inDto);
							prodOrdInfoService.deleteProdOrdInfo(paramDto);
						}
					} catch (Exception e1) {
						System.out.println("导入失败后，订单回滚操作异常");
						e1.printStackTrace();
					}
				}
			}
			// 信息登记成功后保存生产通知单导入文件
			String contextpath = getServlet().getServletContext()
					.getRealPath("/");
			if (!contextpath.endsWith(separator)) {
				contextpath = contextpath + separator;
			}
			String savePath = contextpath + "resource" + separator
					+ "file" + separator ;
			File file = new File(savePath);
			if (!file.exists() && !file.isDirectory()) {
				file.mkdir();
			}

			File fileToCreate = new File(savePath, fileName2UUID);
			FileOutputStream os = new FileOutputStream(fileToCreate);
			// 检查同名文件是否存在,不存在则将文件流写入文件磁盘系统
			if (!fileToCreate.exists()) {
				os.write(theFile.getFileData());
				os.flush();
				os.close();
			} else {
				// 此路径下已存在同名文件,是否要覆盖或给客户端提示信息由你自己决定
				os.write(theFile.getFileData());
				os.flush();
				os.close();
			}
		} catch (Exception e) {
			//  handle 遍历sheets外的流等的 exception
			e.printStackTrace();
			errSb.append("操作发生错误，请联系管理员" + e.getMessage());
		} finally {
			outDto.put("msg", "生产通知单导入信息</br>" + errSb.toString() + "</br>");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}

	/**
	 * 导出生产计划通知单
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward prodPlanExport(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto pDto = aform.getParamAsDto(request);
		pDto.put("response", response);
		prodOrdInfoService.prodPlanExceport(pDto);
		return mapping.findForward(null);
	}

	/**
	 * 准备导出的列名和列项
	 */
	public ActionForward doExportExcel(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		// 设置缓存信息
		super.setSessionAttribute(request, "QUERYSELECTPRODORDINFO_DTO", inDto);
		System.out.println(inDto.getAsString("prod_ord_seqs"));
		Dto outDto = new BaseDto();
		outDto.put("success", true);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		response.getWriter().write(jsonString);
		return mapping.findForward(null);
	}

	/**
	 * 更新生产通知单的信息
	 */
	private Dto updateProdOrd(Dto inDto) {
		Dto outDto = new BaseDto();
		try {
			outDto = prodOrdInfoService.updateProdOrdInfo(inDto);
			String is_used = inDto.getAsString("is_used");
			if ("0".equals(is_used)) {
				updateProdord4ProdDetail(inDto);
			}
			outDto.put("msg", "生产通知单修改成功!");
			outDto.put("success", true);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("msg", "生产通知单修改失败");
			outDto.put("success", false);
		}
		return outDto;
	}

	/**
	 * 更新订单产品信息
	 * 
	 * @return
	 */
	private void updateProdord4ProdDetail(Dto inDto) {
		// 没有绑定过的,更新产品信息
		List insList = JsonHelper.parseJson2List(inDto
				.getAsString("insOrdRecordStr"));
		List ordList = JsonHelper.parseJson2List(inDto
				.getAsString("ordRecordStr"));
		inDto.remove("insOrdRecordStr");
		inDto.remove("ordRecordStr");
		// 删除生产通知单下的产品信息
		prodOrdInfoService.deleteProdBasDef(inDto);
		// 登记对应产品信息
		for (int i = 0; i < ordList.size(); i++) {
			Dto insDto = (Dto) insList.get(i);
			Dto ordDto = (Dto) ordList.get(i);
			String[] colnumsValue = inDto.getAsString("colValue").split(",");
			for (String value : colnumsValue) {
				if (G4Utils.isEmpty(ordDto.getAsString("num" + value))) {
					continue;
				}
				inDto.put("country", ordDto.getAsString("country"));
				inDto.put("color", ordDto.getAsString("color"));
				inDto.put("in_length", ordDto.getAsString("in_length"));
				inDto.put("ord_num", ordDto.getAsString("num" + value));
				inDto.put("ins_num", insDto.getAsString("num" + value));
				inDto.put("waist", value);// 腰围
				prodOrdInfoService.addProdBasDef(inDto); // 增加产品
			}
		}

	}

	/**
	 * 保存网页格式的生产通知单
	 */
	private Dto saveProdOrd4Web(Dto inDto) {
		Dto outDto = new BaseDto();
		try {
			outDto = prodOrdInfoService.addProdOrdDef(inDto);// 生成通知单登记

			// 转换上传文件的保存形式。
			List insList = JsonHelper.parseJson2List(inDto
					.getAsString("insOrdRecordStr"));
			List ordList = JsonHelper.parseJson2List(inDto
					.getAsString("ordRecordStr"));
			inDto.remove("insOrdRecordStr");
			inDto.remove("ordRecordStr");
			// 登记对应产品信息
			for (int i = 0; i < ordList.size(); i++) {
				Dto insDto = (Dto) insList.get(i);
				Dto ordDto = (Dto) ordList.get(i);
				String[] colnumsValue = inDto.getAsString("colValue")
						.split(",");
				for (String value : colnumsValue) {
					if (G4Utils.isEmpty(ordDto.getAsString("num" + value))) {
						continue;
					}
					inDto.put("country", ordDto.getAsString("country"));
					inDto.put("color", ordDto.getAsString("color"));
					inDto.put("in_length", ordDto.getAsString("in_length"));
					inDto.put("ord_num", ordDto.getAsString("num" + value));
					inDto.put("ins_num", insDto.getAsString("num" + value));
					inDto.put("waist", value);// 腰围
					prodOrdInfoService.addProdBasDef(inDto);
				}
			}
			outDto.put("msg", "产品信息添加成功");
			outDto.put("success", true);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("msg", "产品信息添加失败");
			outDto.put("success", false);
		}
		return outDto;
	}
	/**
	 * 更新生产通知单的数量修改备注信息
	 */
	public ActionForward updateNumeditRemark(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto outDto=new BaseDto();
		try {
			CommonActionForm aform = (CommonActionForm) form;
			Dto inDto = aform.getParamAsDto(request);
			prodOrdInfoService.updateNumeditRemark(inDto);
			outDto.put("success", true);
			outDto.put("msg", "备注信息更新成功");
			
		} catch (Exception e) {
			outDto.put("success", false);
			outDto.put("msg", "备注信息更新失败");
		}
		String jsonStrList = JsonHelper.encodeObject2Json(outDto);
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}
	/**
	 * 查询生产通知单的数量修改备注信息
	 */
	public ActionForward queryNumeditRemark(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		Dto pDto = aform.getParamAsDto(request);
		Dto outDto= new BaseDto();
		outDto=(Dto)g4Reader.queryForObject("queryNumeditRemark", pDto);
		String jsonStrList = JsonHelper.encodeObject2Json(outDto);
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}
}
