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

import action.CommonLoadAction;

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
public class SessionInterceptor implements Interceptor, ServletRequestAware {

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
		@SuppressWarnings("rawtypes")
		Map session = ActionContext.getContext().getSession();
		boolean status = isLoggedIn(request);
		

		String url = request.getServletPath();
		String actionName[] = url.split("/");
		System.out.println("URL: " + url);
		@SuppressWarnings("rawtypes")
		Map objMapList = new HashMap();
		@SuppressWarnings("rawtypes")
		Enumeration parameterNames = request.getParameterNames();
		System.out.println("-------------------------\n");
		Gson gson = new Gson();
		// System.out.println("PAram>>"+parameterNames);
		String paramName = "";
		ArrayList<String> valuArrayList = null;
		for (; parameterNames.hasMoreElements(); objMapList.put(paramName, valuArrayList)) {
			paramName = (String) parameterNames.nextElement();

			valuArrayList = new ArrayList<String>();
			String as[];
			int j = (as = request.getParameterValues(paramName)).length;
			for (int i = 0; i < j; i++) {
				String paramValue = as[i];
				valuArrayList.add(URLEncoder.encode(paramValue, "UTF-8"));
			}
		}
		

		String result = java.net.URLDecoder.decode(String.valueOf(valuArrayList), "UTF-8");
		result = result.substring(1, result.length() - 1);
		if (url.equals("/getProductUploadProgress")){
		}else{
			System.out.println("Intercepter Status: " + status);
			System.out.println("Param Name :" + paramName + " | valuArrayList: " + valuArrayList);
			System.out.println((new StringBuilder("Json1 = ")).append(gson.toJson(objMapList)).toString());
			System.out.println("Result1: " + result);
			System.out.println("status  = " + status);
		}
	
//		if (!status) {
//			CommonLoadAction cLoadAction = null;
//			if (url.equals("/createQuote")) {
//				System.out.println("Create Quote");
//				cLoadAction = new CommonLoadAction();
//				cLoadAction.createQuote(result);
//			} else if (url.equals("/updateQuote")) {
//				System.out.println("Update Quote");
//				cLoadAction = new CommonLoadAction();
//				cLoadAction.updateQuote(result);
//			}
//		}
		if (!status) {
			if (url.equals("/login") || url.equals("/logout") || url.equals("/forgotPassword")
					 || url.equals("/createQuote") || url.equals("/updateQuote")) {
				return invocation.invoke();
			} else {
				return "sessionTimeOut";
			}
		} else {
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
		System.out.println("request: " + request);
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
