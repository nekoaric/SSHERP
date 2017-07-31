package org.apache.jsp.cnnct.sys;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class getSysUserInfo_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.Vector _jspx_dependants;

  static {
    _jspx_dependants = new java.util.Vector(1);
    _jspx_dependants.add("/common/include/taglib.jsp");
  }

  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_html_title;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_import_src_nobody;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_body;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_ext$2uiGrant_nobody;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_script;
  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_out_scope_key_nobody;

  private org.apache.jasper.runtime.ResourceInjector _jspx_resourceInjector;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _jspx_tagPool_eRedG4_html_title = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_import_src_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_body = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_ext$2uiGrant_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_script = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _jspx_tagPool_eRedG4_out_scope_key_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
  }

  public void _jspDestroy() {
    _jspx_tagPool_eRedG4_html_title.release();
    _jspx_tagPool_eRedG4_import_src_nobody.release();
    _jspx_tagPool_eRedG4_body.release();
    _jspx_tagPool_eRedG4_ext$2uiGrant_nobody.release();
    _jspx_tagPool_eRedG4_script.release();
    _jspx_tagPool_eRedG4_out_scope_key_nobody.release();
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
    org.eredlab.g4.rif.taglib.html.HtmlTag _jspx_th_eRedG4_html_0 = (org.eredlab.g4.rif.taglib.html.HtmlTag) _jspx_tagPool_eRedG4_html_title.get(org.eredlab.g4.rif.taglib.html.HtmlTag.class);
    _jspx_th_eRedG4_html_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_html_0.setParent(null);
    _jspx_th_eRedG4_html_0.setTitle("员工管理");
    int _jspx_eval_eRedG4_html_0 = _jspx_th_eRedG4_html_0.doStartTag();
    if (_jspx_eval_eRedG4_html_0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write('\r');
        out.write('\n');
        if (_jspx_meth_eRedG4_import_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_html_0, _jspx_page_context))
          return true;
        out.write('\r');
        out.write('\n');
        if (_jspx_meth_eRedG4_body_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_html_0, _jspx_page_context))
          return true;
        out.write('\r');
        out.write('\n');
        if (_jspx_meth_eRedG4_ext$2uiGrant_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_html_0, _jspx_page_context))
          return true;
        out.write('\r');
        out.write('\n');
        if (_jspx_meth_eRedG4_script_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_html_0, _jspx_page_context))
          return true;
        out.write('\r');
        out.write('\n');
        int evalDoAfterBody = _jspx_th_eRedG4_html_0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_eRedG4_html_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_html_title.reuse(_jspx_th_eRedG4_html_0);
      return true;
    }
    _jspx_tagPool_eRedG4_html_title.reuse(_jspx_th_eRedG4_html_0);
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
    _jspx_th_eRedG4_import_0.setSrc("/cnnct/sys/js/getSysUserInfo.js");
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
        out.write('\r');
        out.write('\n');
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

  private boolean _jspx_meth_eRedG4_ext$2uiGrant_0(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_html_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:ext.uiGrant
    org.eredlab.g4.rif.taglib.ext.UiGrantTag _jspx_th_eRedG4_ext$2uiGrant_0 = (org.eredlab.g4.rif.taglib.ext.UiGrantTag) _jspx_tagPool_eRedG4_ext$2uiGrant_nobody.get(org.eredlab.g4.rif.taglib.ext.UiGrantTag.class);
    _jspx_th_eRedG4_ext$2uiGrant_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_ext$2uiGrant_0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_html_0);
    int _jspx_eval_eRedG4_ext$2uiGrant_0 = _jspx_th_eRedG4_ext$2uiGrant_0.doStartTag();
    if (_jspx_th_eRedG4_ext$2uiGrant_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_ext$2uiGrant_nobody.reuse(_jspx_th_eRedG4_ext$2uiGrant_0);
      return true;
    }
    _jspx_tagPool_eRedG4_ext$2uiGrant_nobody.reuse(_jspx_th_eRedG4_ext$2uiGrant_0);
    return false;
  }

  private boolean _jspx_meth_eRedG4_script_0(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_html_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:script
    org.eredlab.g4.rif.taglib.html.ScriptTag _jspx_th_eRedG4_script_0 = (org.eredlab.g4.rif.taglib.html.ScriptTag) _jspx_tagPool_eRedG4_script.get(org.eredlab.g4.rif.taglib.html.ScriptTag.class);
    _jspx_th_eRedG4_script_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_script_0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_html_0);
    int _jspx_eval_eRedG4_script_0 = _jspx_th_eRedG4_script_0.doStartTag();
    if (_jspx_eval_eRedG4_script_0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("\r\n");
        out.write("   var root_dept_id = '");
        if (_jspx_meth_eRedG4_out_0((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_script_0, _jspx_page_context))
          return true;
        out.write("';\r\n");
        out.write("   var root_dept_name = '");
        if (_jspx_meth_eRedG4_out_1((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_script_0, _jspx_page_context))
          return true;
        out.write("';\r\n");
        out.write("   var root_usertype = '");
        if (_jspx_meth_eRedG4_out_2((javax.servlet.jsp.tagext.JspTag) _jspx_th_eRedG4_script_0, _jspx_page_context))
          return true;
        out.write("';\r\n");
        int evalDoAfterBody = _jspx_th_eRedG4_script_0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_eRedG4_script_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_script.reuse(_jspx_th_eRedG4_script_0);
      return true;
    }
    _jspx_tagPool_eRedG4_script.reuse(_jspx_th_eRedG4_script_0);
    return false;
  }

  private boolean _jspx_meth_eRedG4_out_0(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_script_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:out
    org.eredlab.g4.rif.taglib.html.OutTag _jspx_th_eRedG4_out_0 = (org.eredlab.g4.rif.taglib.html.OutTag) _jspx_tagPool_eRedG4_out_scope_key_nobody.get(org.eredlab.g4.rif.taglib.html.OutTag.class);
    _jspx_th_eRedG4_out_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_out_0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_script_0);
    _jspx_th_eRedG4_out_0.setKey("root_dept_id");
    _jspx_th_eRedG4_out_0.setScope("request");
    int _jspx_eval_eRedG4_out_0 = _jspx_th_eRedG4_out_0.doStartTag();
    if (_jspx_th_eRedG4_out_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_out_scope_key_nobody.reuse(_jspx_th_eRedG4_out_0);
      return true;
    }
    _jspx_tagPool_eRedG4_out_scope_key_nobody.reuse(_jspx_th_eRedG4_out_0);
    return false;
  }

  private boolean _jspx_meth_eRedG4_out_1(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_script_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:out
    org.eredlab.g4.rif.taglib.html.OutTag _jspx_th_eRedG4_out_1 = (org.eredlab.g4.rif.taglib.html.OutTag) _jspx_tagPool_eRedG4_out_scope_key_nobody.get(org.eredlab.g4.rif.taglib.html.OutTag.class);
    _jspx_th_eRedG4_out_1.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_out_1.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_script_0);
    _jspx_th_eRedG4_out_1.setKey("root_dept_name");
    _jspx_th_eRedG4_out_1.setScope("request");
    int _jspx_eval_eRedG4_out_1 = _jspx_th_eRedG4_out_1.doStartTag();
    if (_jspx_th_eRedG4_out_1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_out_scope_key_nobody.reuse(_jspx_th_eRedG4_out_1);
      return true;
    }
    _jspx_tagPool_eRedG4_out_scope_key_nobody.reuse(_jspx_th_eRedG4_out_1);
    return false;
  }

  private boolean _jspx_meth_eRedG4_out_2(javax.servlet.jsp.tagext.JspTag _jspx_th_eRedG4_script_0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:out
    org.eredlab.g4.rif.taglib.html.OutTag _jspx_th_eRedG4_out_2 = (org.eredlab.g4.rif.taglib.html.OutTag) _jspx_tagPool_eRedG4_out_scope_key_nobody.get(org.eredlab.g4.rif.taglib.html.OutTag.class);
    _jspx_th_eRedG4_out_2.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_out_2.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_eRedG4_script_0);
    _jspx_th_eRedG4_out_2.setKey("root_usertype");
    _jspx_th_eRedG4_out_2.setScope("request");
    int _jspx_eval_eRedG4_out_2 = _jspx_th_eRedG4_out_2.doStartTag();
    if (_jspx_th_eRedG4_out_2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_out_scope_key_nobody.reuse(_jspx_th_eRedG4_out_2);
      return true;
    }
    _jspx_tagPool_eRedG4_out_scope_key_nobody.reuse(_jspx_th_eRedG4_out_2);
    return false;
  }
}
