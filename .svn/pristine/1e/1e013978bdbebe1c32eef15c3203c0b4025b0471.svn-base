package com.cnnct.rfid.web;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import com.cnnct.rfid.service.OrdBasInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.TimeUtil;

/**
 * @author may
 */

@SuppressWarnings({"unchecked", "rawtypes"})
public class OrdBasInfoAction extends BaseAction {
    private OrdBasInfoService ordBasInfoService = (OrdBasInfoService) super
            .getService("ordBasInfoService");
    private String separator = File.separator;

    private String photoState = "0";// 人员修改时图片状态 0-未上传无图片 1-未上传有图片 2-已上传修改
    private ServletContext sc;// 获取设备上下文对象
    private String savePath;// 保存的路径
    private List list = new ArrayList();// 保存的文件信息

    /**
     * 页面初始化
     */
    public ActionForward ordBasInfoInit(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("ordBasInfoView");
    }

    /**
     * 查询页面载入时所有订单信息
     */
    public ActionForward queryOrdBasInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        
        inDto.put("account", user.getAccount());    //保存用户  在查询我的订单的时候使用
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto outDto = ordBasInfoService.queryOrdBasInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 订单保存和修改相关操作
     */
    public ActionForward saveOrdBasInfo(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String file = inDto.getAsString("file");
            String item = inDto.getAsString("item");
            String[] files = file.split(",");
            String[] items = item.split(",");
            inDto.put("box_ins", " ");
            inDto.put("point_notes", " ");
            inDto.put("style_drawing", " ");
            inDto.put("size_chart", " ");
            inDto.put("accessory_list", " ");
            inDto.put("process_quota", " ");
            inDto.put("process_desc", " ");
            inDto.put("pattern_code", " ");
            inDto.put("verify", " ");
            inDto.put("prod_plan", " ");
            inDto.put("num_detail_list", " ");
            for (int i = 0; i < items.length; i++) {
                if (items[i].equals("0")) {
                    inDto.put("box_ins", files[i]);
                } else if (items[i].equals("1")) {
                    inDto.put("point_notes", files[i]);
                } else if (items[i].equals("2")) {
                    inDto.put("style_drawing", files[i]);
                } else if (items[i].equals("3")) {
                    inDto.put("size_chart", files[i]);
                } else if (items[i].equals("4")) {
                    inDto.put("accessory_list", files[i]);
                } else if (items[i].equals("5")) {
                    inDto.put("process_quota", files[i]);
                } else if (items[i].equals("6")) {
                    inDto.put("process_desc", files[i]);
                } else if (items[i].equals("7")) {
                    inDto.put("pattern_code", files[i]);
                } else if (items[i].equals("8")) {
                    inDto.put("verify", files[i]);
                } else if (items[i].equals("9")) {
                    inDto.put("prod_plan", files[i]);
                } else if (items[i].equals("10")) {
                    inDto.put("num_detail_list", files[i]);
                }
            }

            String date = inDto.getAsString("deli_date");
            date = date.substring(0, 10);
            String ordDate = inDto.getAsString("order_date");
            ordDate = ordDate.substring(0, 10);
            inDto.put("deli_date", date);
            inDto.put("order_date", ordDate);
            String seq_no = inDto.getAsString("seq_no");
            if (!seq_no.equals("")) {
                outDto = ordBasInfoService.updateOrdBasInfo(inDto);
            } else {
                outDto = ordBasInfoService.addOrdBasDef(inDto);
            }
            for (int n = 0; n < list.size(); n++) {
                Dto dto = (Dto) list.get(n);
                File fileRename = new File(dto.getAsString("savePath") + dto.getAsString("fileName"));
                if (fileRename.exists()) {
                    fileRename.renameTo(new File(dto.getAsString("savePath") + dto.getAsString("file_name")));
                }
            }
            String jsonStrList = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonStrList);
        } catch (ApplicationException e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "订单登记失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
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
    public ActionForward deleteClothBasInfoAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            inDto.put("state", "1");
            outDto = ordBasInfoService.deleteOrdBasInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("failure", new Boolean(true));
            outDto.put("msg", "服务信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 客户下拉框查询
     */
    public ActionForward getCustIdCombox(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = new BaseDto();
        List list = g4Reader.queryForList("getCustIdCombox", inDto);
        String jsonString = JsonHelper.encodeObject2Json(list);
        response.getWriter().write(jsonString);
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
    public ActionForward uploadFile4CSR(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        FormFile myFile = aform.getTheFile();
        String file_name = myFile.getFileName();
        Dto inDto = aform.getParamAsDto(request);
        // Dto inDto = new BaseDto(request);
        HttpSession session = request.getSession(true);
        String sID = session.getId();
        Dto outDto = new BaseDto();
        Dto dto = new BaseDto();
        try {
            String contextpath = getServlet().getServletContext().getRealPath(
                    "/");
            if (!contextpath.endsWith(separator)) {
                contextpath = contextpath + separator;
            }
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            inDto.put("grp_id", user.getGrpId());
            inDto.put("per_id", user.getAccount());
            inDto.put("file_name", file_name);
            String savePath = contextpath + "resource" + separator + "ordFile"
                    + separator;
            File file = new File(savePath);
            if (!file.exists() && !file.isDirectory()) {
                file.mkdir();
            }
            inDto.put("file_loc", savePath);
            // inDto.put("file_id", inDto.getAsString("ord_seq_no"));
            // inDto.put("seq_no", inDto.getAsString("ord_seq_no"));
            if (inDto.getAsString("item").equals("0")) {
                inDto.put("file_type", "box_ins");
            } else if (inDto.getAsString("item").equals("1")) {
                inDto.put("file_type", "point_notes");
            } else if (inDto.getAsString("item").equals("2")) {
                inDto.put("file_type", "style_drawing");
            } else if (inDto.getAsString("item").equals("3")) {
                inDto.put("file_type", "size_chart");
            } else if (inDto.getAsString("item").equals("4")) {
                inDto.put("file_type", "accessory_list");
            } else if (inDto.getAsString("item").equals("5")) {
                inDto.put("file_type", "process_quota");
            } else if (inDto.getAsString("item").equals("6")) {
                inDto.put("file_type", "process_desc");
            } else if (inDto.getAsString("item").equals("7")) {
                inDto.put("file_type", "pattern_code");
            } else if (inDto.getAsString("item").equals("8")) {
                inDto.put("file_type", "verify");
            } else if (inDto.getAsString("item").equals("9")) {
                inDto.put("file_type", "prod_plan");
            } else if (inDto.getAsString("item").equals("10")) {
                inDto.put("file_type", "num_detail_list");
            }
            inDto.put(inDto.getAsString("file_type"),
                    inDto.getAsString("file_type"));
            dto.put("file_type", inDto.getAsString("file_type"));
            dto.put("file_name", file_name);
            dto.put("savePath", savePath);
            // outDto= prodOrdInfoService.insertFileInfo(inDto);
            // 写文件
            String file_extensions = file_name.substring(
                    file_name.lastIndexOf(".")).toLowerCase();// 文件后缀名
            // 使用文件id加文件名作为文件存储时的名字
            String fileName = sID + file_name;
            dto.put("fileName", fileName);
            list.add(dto);
            File fileToCreate = new File(savePath, fileName);

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

            outDto.put("success", true);
            outDto.put("msg", "文件上传成功!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            write(jsonString, response);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "文件上传失败!");
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
        String file_name = "";
        try {

            String file_id = inDto.getAsString("file_name");
            Dto fileInfo = (Dto) g4Reader.queryForObject("queryOrdBasInfo", inDto);
            // path是指欲下载的文件的路径。
            if (inDto.getAsString("item").equals("0")) {
                file_name = fileInfo.getAsString("box_ins");
            } else if (inDto.getAsString("item").equals("1")) {
                file_name = fileInfo.getAsString("point_notes");
            } else if (inDto.getAsString("item").equals("2")) {
                file_name = fileInfo.getAsString("style_drawing");
            } else if (inDto.getAsString("item").equals("3")) {
                file_name = fileInfo.getAsString("size_chart");
            } else if (inDto.getAsString("item").equals("4")) {
                file_name = fileInfo.getAsString("accessory_list");
            } else if (inDto.getAsString("item").equals("5")) {
                file_name = fileInfo.getAsString("process_quota");
            } else if (inDto.getAsString("item").equals("6")) {
                file_name = fileInfo.getAsString("process_desc");
            } else if (inDto.getAsString("item").equals("7")) {
                file_name = fileInfo.getAsString("pattern_code");
            } else if (inDto.getAsString("item").equals("8")) {
                file_name = fileInfo.getAsString("verify");
            } else if (inDto.getAsString("item").equals("9")) {
                file_name = fileInfo.getAsString("prod_plan");
            } else if (inDto.getAsString("item").equals("10")) {
                file_name = fileInfo.getAsString("num_detail_list");
            }
//			String file_name = inDto.getAsString("file_name");
            // 取得文件的后缀名。
            String ext = file_name.substring(file_name.lastIndexOf("."))
                    .toLowerCase();
            String contextpath = getServlet().getServletContext().getRealPath(
                    "/");
            if (!contextpath.endsWith(separator)) {
                contextpath = contextpath + separator;
            }
            String path = contextpath + "resource" + separator + "ordFile"
                    + separator + file_name;
            File file = new File(path);
            // 取得文件名。
            String filename = file.getName();

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

    // 导出订单信息
    public ActionForward excleOrderInfoAction(ActionMapping mapping,
                                              ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto devDto = new BaseDto();
        Dto inDto = new BaseDto(request);
        parametersDto.put("reportTitle", "订单信息"); // parameter
        List list = g4Reader.queryForList("queryOrdBasInfo", inDto);
        for (int i = 0; i < list.size(); i++) {
            devDto = (Dto) list.get(i);
            if (devDto.getAsString("state").equals("0")) {
                devDto.put("state", "正常");
            } else if (devDto.getAsString("state").equals("1")) {
                devDto.put("state", "取消");
            }
        }
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/orderListInfo.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("订单详情表" +TimeUtil.getCurrentDate()+ ".xls");
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }
}
