package action;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.I18nInterceptor;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
public class LoginAction extends ActionSupport implements ServletRequestAware {
	HttpServletRequest request;
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	@Override
	public String execute() throws Exception {
		objEmptyResponse.setCode("success");
		objEmptyResponse.setMessage("Login Successfully...!");
		HttpSession httpSession;
		httpSession = request.getSession(true);
		String lang = (String) httpSession.getAttribute("language");
		Locale locale = null;
		if (lang != null) {
			locale = new Locale(lang);
		} else {
			locale = new Locale("es");
		}
		ActionContext.getContext().setLocale(locale);
		httpSession.setAttribute(I18nInterceptor.DEFAULT_SESSION_ATTRIBUTE,
				locale);
		return SUCCESS;
	}
	
	public String logout() {
		if (ServletActionContext.getRequest().getSession() != null) {
			HttpSession httpSession;
			httpSession = request.getSession(true);

			httpSession = ServletActionContext.getRequest().getSession();
			httpSession.invalidate();
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage("Session Invalidate Successfully...!");
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
