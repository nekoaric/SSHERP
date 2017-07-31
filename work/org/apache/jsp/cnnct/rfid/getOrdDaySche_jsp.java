package org.apache.jsp.cnnct.rfid;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class getOrdDaySche_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.Vector _jspx_dependants;

  static {
    _jspx_dependants = new java.util.Vector(1);
    _jspx_dependants.add("/common/include/taglib.jsp");
  }

  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_html_title_fcfEnabled;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_import_src_nobody;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_body;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_flashReport_width_visible_type_id_height_dataVar_align_nobody;

  private org.apache.jasper.runtime.ResourceInjector _jspx_resourceInjector;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _jspx_tagPool_eRedG4_html_title_fcfEnabled = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_import_src_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_body = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_flashReport_width_visible_type_id_height_dataVar_align_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
  }

  public void _jspDestroy() {
    _jspx_tagPool_eRedG4_html_title_fcfEnabled.release();
    _jspx_tagPool_eRedG4_import_src_nobody.release();
    _jspx_tagPool_eRedG4_body.release();
    _jspx_tagPool_eRedG4_flashReport_width_visible_type_id_height_dataVar_align_nobody.release();
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    JspFactory _jspxFactory = null;
    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      _jspxFactory = JspFactory.getDefaultFactory();
      response.setContentType("text/html; charset=utf-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;
      _jspx_resourceInjector = (org.apache.jasper.runtime.ResourceInjector) application.getAttribute("com.sun.appserv.jsp.resource.injector");

      out.write('\r');
      out.write('\n');
      out.write("\r\n");
      out.write("\r\n");
      out.write('\r');
      out.write('\n');
      if (_jspx_meth_eRedG4_html_0(_jspx_page_context))
        return;
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      if (_jspxFactory != null) _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }

  private boolean _jspx_meth_eRedG4_html_0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:html
    org.eredlab.g4.rif.taglib.html.HtmlTag _jspx_th_eRedG4_html_0 = (org.eredlab.g4.rif.taglib.html.HtmlTag) _jspx_tagPool_eRedG4_html_title_fcfEnabled.get(org.eredlab.g4.rif.taglib.html.HtmlTag.class);
    _jspx_th_eRedG4_html_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_html_0.setParent(null);
    _jspx_th_eRedG4_html_0.setTitle("订单日进度");
    _jspx_th_eRedG4_html_0.setFcfEnabled("true");
    int _jspx_eval_eRedG4_html_0 = _jspx_th_eRedG4_html_0.doStartTag();
    if (_jspx_eval_eRedG4_html_0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("    ");
        if (_jspx_meth_eRedG4_import_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_html_0, _jspx_page_context))
          return true;
        out.write("\r\n");
        out.write("    ");
        if (_jspx_meth_eRedG4_body_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_html_0, _jspx_page_context))
          return true;
        out.write('\r');
        out.write('\n');
        int evalDoAfterBody = _jspx_th_eRedG4_html_0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_eRedG4_html_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_html_title_fcfEnabled.reuse(_jspx_th_eRedG4_html_0);
      return true;
    }
    _jspx_tagPool_eRedG4_html_title_fcfEnabled.reuse(_jspx_th_eRedG4_html_0);
    return false;
  }

  private boolean _jspx_meth_eRedG4_import_0(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_html_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:import
    org.eredlab.g4.rif.taglib.html.ImportTag _jspx_th_eRedG4_import_0 = (org.eredlab.g4.rif.taglib.html.ImportTag) _jspx_tagPool_eRedG4_import_src_nobody.get(org.eredlab.g4.rif.taglib.html.ImportTag.class);
    _jspx_th_eRedG4_import_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_import_0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_html_0);
    _jspx_th_eRedG4_import_0.setSrc("/cnnct/rfid/js/getOrdDaySche.js");
    int _jspx_eval_eRedG4_import_0 = _jspx_th_eRedG4_import_0.doStartTag();
    if (_jspx_th_eRedG4_import_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_import_src_nobody.reuse(_jspx_th_eRedG4_import_0);
      return true;
    }
    _jspx_tagPool_eRedG4_import_src_nobody.reuse(_jspx_th_eRedG4_import_0);
    return false;
  }

  private boolean _jspx_meth_eRedG4_body_0(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_html_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:body
    org.eredlab.g4.rif.taglib.html.BodyTag _jspx_th_eRedG4_body_0 = (org.eredlab.g4.rif.taglib.html.BodyTag) _jspx_tagPool_eRedG4_body.get(org.eredlab.g4.rif.taglib.html.BodyTag.class);
    _jspx_th_eRedG4_body_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_body_0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_html_0);
    int _jspx_eval_eRedG4_body_0 = _jspx_th_eRedG4_body_0.doStartTag();
    if (_jspx_eval_eRedG4_body_0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("    ");
        if (_jspx_meth_eRedG4_flashReport_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_body_0, _jspx_page_context))
          return true;
        out.write("\r\n");
        out.write("    ");
        int evalDoAfterBody = _jspx_th_eRedG4_body_0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_eRedG4_body_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_body.reuse(_jspx_th_eRedG4_body_0);
      return true;
    }
    _jspx_tagPool_eRedG4_body.reuse(_jspx_th_eRedG4_body_0);
    return false;
  }

  private boolean _jspx_meth_eRedG4_flashReport_0(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_body_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:flashReport
    org.eredlab.g4.rif.taglib.fcf.FlashReportTag _jspx_th_eRedG4_flashReport_0 = (org.eredlab.g4.rif.taglib.fcf.FlashReportTag) _jspx_tagPool_eRedG4_flashReport_width_visible_type_id_height_dataVar_align_nobody.get(org.eredlab.g4.rif.taglib.fcf.FlashReportTag.class);
    _jspx_th_eRedG4_flashReport_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_flashReport_0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_body_0);
    _jspx_th_eRedG4_flashReport_0.setType("SC_2D");
    _jspx_th_eRedG4_flashReport_0.setDataVar("xmlString");
    _jspx_th_eRedG4_flashReport_0.setId("mySC2DChart");
    _jspx_th_eRedG4_flashReport_0.setAlign("center");
    _jspx_th_eRedG4_flashReport_0.setVisible("true");
    _jspx_th_eRedG4_flashReport_0.setWidth("100%");
    _jspx_th_eRedG4_flashReport_0.setHeight("100%");
    int _jspx_eval_eRedG4_flashReport_0 = _jspx_th_eRedG4_flashReport_0.doStartTag();
    if (_jspx_th_eRedG4_flashReport_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_flashReport_width_visible_type_id_height_dataVar_align_nobody.reuse(_jspx_th_eRedG4_flashReport_0);
      return true;
    }
    _jspx_tagPool_eRedG4_flashReport_width_visible_type_id_height_dataVar_align_nobody.reuse(_jspx_th_eRedG4_flashReport_0);
    return false;
  }
}
