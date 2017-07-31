package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class desktop_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.Vector _jspx_dependants;

  static {
    _jspx_dependants = new java.util.Vector(2);
    _jspx_dependants.add("/common/include/taglib.jsp");
    _jspx_dependants.add("/WEB-INF/tld/eRedUI.tld");
  }

  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_eRedG4_arm$2desktop_nobody;

  private org.apache.jasper.runtime.ResourceInjector _jspx_resourceInjector;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _jspx_tagPool_eRedG4_arm$2desktop_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
  }

  public void _jspDestroy() {
    _jspx_tagPool_eRedG4_arm$2desktop_nobody.release();
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
      if (_jspx_meth_eRedG4_arm$2desktop_0(_jspx_page_context))
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

  private boolean _jspx_meth_eRedG4_arm$2desktop_0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  eRedG4:arm.desktop
    com.cnnct.sys.web.tag.ArmDesktopTag _jspx_th_eRedG4_arm$2desktop_0 = (com.cnnct.sys.web.tag.ArmDesktopTag) _jspx_tagPool_eRedG4_arm$2desktop_nobody.get(com.cnnct.sys.web.tag.ArmDesktopTag.class);
    _jspx_th_eRedG4_arm$2desktop_0.setPageContext(_jspx_page_context);
    _jspx_th_eRedG4_arm$2desktop_0.setParent(null);
    int _jspx_eval_eRedG4_arm$2desktop_0 = _jspx_th_eRedG4_arm$2desktop_0.doStartTag();
    if (_jspx_th_eRedG4_arm$2desktop_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_eRedG4_arm$2desktop_nobody.reuse(_jspx_th_eRedG4_arm$2desktop_0);
      return true;
    }
    _jspx_tagPool_eRedG4_arm$2desktop_nobody.reuse(_jspx_th_eRedG4_arm$2desktop_0);
    return false;
  }
}
