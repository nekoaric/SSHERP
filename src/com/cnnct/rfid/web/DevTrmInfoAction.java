package com.cnnct.rfid.web;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import com.cnnct.sys.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.DevTrmInfoService;

@SuppressWarnings("unchecked")
/************************************************
 * 创建日期: 2013-04-25 13:38:00
 * 创建作者：唐芳海
 * 功能：设备管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/
public class DevTrmInfoAction extends BaseAction {
    private DevTrmInfoService devTrmInfoService = (DevTrmInfoService) super.getService("devTrmInfoService");

    /**
     * 设备信息初始化页面
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward devTrmInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("devTrmInfoView");
    }

    /**
     * 设备信息查询
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */

    public ActionForward queryDeviceBaseInfoAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        String grpid = getSessionContainer(request).getUserInfo().getGrpId();
        inDto.put("grp_id", grpid);// 企业代码
        Dto outDto = devTrmInfoService.queryDeviceBaseInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 设备信息新增
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertDeviceBaseInfoAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String grpid = getSessionContainer(request).getUserInfo().getGrpId();
            inDto.put("grp_id", grpid);// 企业代码
            outDto = devTrmInfoService.insertDeviceBaseInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "设备信息新增失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 设备信息状态更改
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateDevTrmInfoStateAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String grpid = getSessionContainer(request).getUserInfo()
                    .getGrpId();
            inDto.put("grp_id", grpid);// 企业代码
            outDto = devTrmInfoService.updateDevTrmInfoState(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("failure", new Boolean(true));
            outDto.put("msg", "设备信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 设备信息修改
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateDeviceBaseInfoAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String grpid = getSessionContainer(request).getUserInfo()
                    .getGrpId();
            inDto.put("grp_id", grpid);// 企业代码
            outDto = devTrmInfoService.updateDeviceBaseInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "设备信息修改失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 导入设备信息
     */
    public ActionForward xlsDeviceBaseInfoAction(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm actionForm = (CommonActionForm) form;
            Dto inDto = actionForm.getParamAsDto(request);
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String grp_id = user.getGrpId();// 单位代码
            FormFile theFile = actionForm.getTheFile();
            String metaData = "trm_no,trm_name,trm_kind,trm_flag,trm_key,com_way,com_port,com_spd,trm_addr,ins_date,notes,state";
            Dto timeDto = new BaseDto();
            ExcelReader excelReader = new ExcelReader(metaData,
                    theFile.getInputStream());
            List list = excelReader.read(0, 0);

            if (list.size() > 0) {
                Dto impList = (Dto) list.get(0);

                if (impList.size() != metaData.toString().trim().split(",").length) {
                    outDto.put("success", new Boolean(false));
                    outDto.put("msg", "导入失败！Excel文件格式有误,请对照下载的模版文件的格式填写文件");
                    response.getWriter().println(outDto.toJson());
                    return mapping.findForward(null);
                }
            } else {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "导入失败！Excel文件格式有误,请对照下载的模版文件的格式填写文件");
                response.getWriter().println(outDto.toJson());
                return mapping.findForward(null);
            }

            list.remove(0);// 去除第一列的信息

            DateFormat df = new SimpleDateFormat("yyyyMMdd");

            for (int i = 0; i < list.size(); i++) {
                timeDto = (Dto) list.get(i);
                timeDto.put("grp_id", grp_id);
                String trm_flag = timeDto.getAsString("trm_flag");
                if (trm_flag.equals("裁剪绑定")) {
                    timeDto.put("trm_flag", "1");
                } else if (trm_flag.equals("领片")) {
                    timeDto.put("trm_flag", "2");
                } else {
                    outDto.put("success", new Boolean(false));
                    outDto.put("msg", "设备新增到第" + i + "行成功!第" + (i + 1)
                            + "行失败所处流程填写格式错误!");
                    String jsonString = JsonHelper.encodeObject2Json(outDto);
                    response.getWriter().write(jsonString);
                    return mapping.findForward(null);
                }
                String trm_kind = timeDto.getAsString("trm_kind");
                if (trm_kind.equals("读卡机")) {
                    timeDto.put("trm_kind", "1");
                } else if (trm_kind.equals("检测机")) {
                    timeDto.put("trm_kind", "2");
                } else {
                    outDto.put("success", new Boolean(false));
                    outDto.put("msg", "设备新增到第" + i + "行成功!第" + (i + 1)
                            + "行失败设备类型填写格式错误!");
                    String jsonString = JsonHelper.encodeObject2Json(outDto);
                    response.getWriter().write(jsonString);
                    return mapping.findForward(null);
                }
                String com_way = timeDto.getAsString("com_way");
                if (com_way.equals("TCP/IP")) {
                    timeDto.put("com_way", "1");
                } else if (com_way.equals("串口")) {
                    timeDto.put("com_way", "2");
                } else {
                    outDto.put("success", new Boolean(false));
                    outDto.put("msg", "设备新增到第" + i + "行成功!第" + (i + 1)
                            + "行失败端口类型填写格式错误!");
                    String jsonString = JsonHelper.encodeObject2Json(outDto);
                    response.getWriter().write(jsonString);
                    return mapping.findForward(null);
                }
                String insdate = timeDto.getAsString("ins_date");
                if (!insdate.equals("")) {
                    if (!isValidDate(insdate)) {
                        throw new ApplicationException("[出生年月]格式错误（日期格式格式为\"1988-08-08\"），" +
                                "请核对第" + (i + 2) + "日期格式");
                    }
                }
                timeDto.put("state", "0");
                devTrmInfoService.insertDeviceBaseInfo(timeDto);
            }
            outDto.put("msg", "设备新增成功!");
            outDto.put("success", new Boolean(true));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "设备新增失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }
    public static boolean isValidDate(String s) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = dateFormat.parse(s);
            return s.equals(dateFormat.format(date));
        } catch (Exception e) {
            // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
            return false;
        }
    }
    /**
     * 导出设备信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward excleDeviceBaseInfoAction(ActionMapping mapping,
                                                   ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto devDto = new BaseDto();
        Dto inDto = new BaseDto(request);
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String grp_id = user.getGrpId();// 单位代码
        parametersDto.put("reportTitle", "设备信息"); // parameter
        inDto.put("grp_id", grp_id);// 企业代码
        List list = g4Reader.queryForList("queryDeviceBaseInfo4excle", inDto);
        for (int i = 0; i < list.size(); i++) {
            devDto = (Dto) list.get(i);
            if (devDto.getAsString("trm_flag").equals("1")) {
                devDto.put("trm_flag", "裁剪绑定");
            } else if (devDto.getAsString("trm_flag").equals("2")) {
                devDto.put("trm_flag", "缝制领片");
            }else if (devDto.getAsString("trm_flag").equals("3")) {
                devDto.put("trm_flag", "缝制下线");
            }else if (devDto.getAsString("trm_flag").equals("4")) {
                devDto.put("trm_flag", "水洗收货");
            }else if (devDto.getAsString("trm_flag").equals("5")) {
                devDto.put("trm_flag", "水洗移交");
            }else if (devDto.getAsString("trm_flag").equals("6")) {
                devDto.put("trm_flag", "后整收货");
            }else if (devDto.getAsString("trm_flag").equals("7")) {
                devDto.put("trm_flag", "移交成品");
            }else if (devDto.getAsString("trm_flag").equals("8")) {
                devDto.put("trm_flag", "移交B品");
            }else if (devDto.getAsString("trm_flag").equals("10")) {
				devDto.put("nature", "收成品");
			}else if (devDto.getAsString("trm_flag").equals("11")) {
				devDto.put("nature", "收B品");
			}else if (devDto.getAsString("trm_flag").equals("12")) {
				devDto.put("nature", "中间领用");
			}else if(devDto.getAsString("trm_flag").equals("13")){
				devDto.put("nature", "送水洗");
			}
            
            
            
            if (devDto.getAsString("com_way").equals("1")) {
            	 devDto.put("com_way", "TCP/IP");
            }else if(devDto.getAsString("com_way").equals("2")){
            	devDto.put("com_way", "串口");
            }
            
            if("3".equals(devDto.getAsString("trm_kind"))){
            	devDto.put("trm_kind", "读卡绑定器");
            }else if("4".equals(devDto.getAsString("trm_kind"))){
            	devDto.put("trm_kind", "隧道机");
            }
            
            if (devDto.getAsString("state").equals("0")) {
                devDto.put("state", "登记");
            } else if (devDto.getAsString("state").equals("1")) {
                devDto.put("state", "开通");
            } else if (devDto.getAsString("state").equals("2")) {
                devDto.put("state", "关闭");
            }
        }
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/deviceInfo.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("设备信息表" + ".xls");
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }
}
