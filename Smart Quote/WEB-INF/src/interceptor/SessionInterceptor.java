/**
 * 
 */
package interceptor;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.Interceptor;

import connection.AuditDumpDao;



/**
 * @author rajendra
 * 
 */
@SuppressWarnings("serial")
public class SessionInterceptor implements Interceptor,
		ServletRequestAware {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.opensymphony.xwork2.interceptor.Interceptor#intercept(com.opensymphony
	 * .xwork2.ActionInvocation)
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		EmptyResponseBean data = new EmptyResponseBean(); 
		HttpServletRequest request = ServletActionContext.getRequest();
		Map session = ActionContext.getContext().getSession();
		boolean status = isLoggedIn(request);
		 System.out.println("Intercepter Status: "+status);

		String url = request.getServletPath();
		String actionName[] = url.split("/");
		System.out.println("URL: " + url);
		@SuppressWarnings("rawtypes")
		Map objMapList = new HashMap();
		@SuppressWarnings("rawtypes")
		Enumeration parameterNames = request.getParameterNames();
		System.out.println("-------------------------\n");
		String paramName;
		ArrayList<String> valuArrayList;
		for (; parameterNames.hasMoreElements(); objMapList.put(paramName,
				valuArrayList)) {
			paramName = (String) parameterNames.nextElement();
			valuArrayList = new ArrayList<String>();
			String as[];
			int j = (as = request.getParameterValues(paramName)).length;
			for (int i = 0; i < j; i++) {
				String paramValue = as[i];
				valuArrayList.add(URLEncoder.encode(paramValue, "UTF-8"));
			}
		}
		Gson gson = new Gson();
		System.out.println((new StringBuilder("Json = ")).append(
				gson.toJson(objMapList)).toString());
		System.out
				.println("-----------------------------------------------------------\n");
		System.out.println("status  = " + status);
		if (!status) {
			if (url.equals("/login") || url.equals("/logout")) {
				return invocation.invoke();
			} else {
				return "sessionTimeOut";
			}
		}
		else
		{
			new AuditDumpDao().insertData(Integer.parseInt(session.get("userId").toString()), url, gson.toJson(objMapList));
		}
		return invocation.invoke();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.opensymphony.xwork2.interceptor.Interceptor#destroy()
	 */
	@Override
	public void destroy() {
		System.out.println("Destroying SessionCheckInterceptor...");
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.opensymphony.xwork2.interceptor.Interceptor#init()
	 */
	@Override
	public void init() {
		System.out.println("Initializing SessionCheckInterceptor...");
	}

	public boolean isLoggedIn(HttpServletRequest request) {
		System.out.println("request: "+ request);
		HttpSession session;
		session = request.getSession(false);
		if (session == null)
			return false;
		else {
			if (session.getAttribute("userId") != null) {
				return true;
			} else
				return false;
		}
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		
	}

}
