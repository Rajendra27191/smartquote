package action;


import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.I18nInterceptor;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;

import pojo.UserBean;
import responseBeans.LoginResponseBean;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

import dao.CustomerDao;
import dao.LoginDao;
import dao.OfferDao;
import dao.QuoteDao;
import dao.TermServicesDao;
import dao.UserGroupDao;

@SuppressWarnings("serial")
public class LoginAction extends ActionSupport implements ServletRequestAware {
	HttpServletRequest request;
	HttpSession httpSession;
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private LoginResponseBean objLoginResponse = new LoginResponseBean();

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public LoginResponseBean getObjLoginResponse() {
		return objLoginResponse;
	}

	public void setObjLoginResponse(LoginResponseBean objLoginResponse) {
		this.objLoginResponse = objLoginResponse;
	}

	@SuppressWarnings("unused")
	@Override
	public String execute() throws Exception {
		String email = request.getParameter("email");
		String password = request.getParameter("password");

		// email = "admin@gmail.com";
		// password = "admin123";

		UserBean objUserBean = null;
		LoginDao objDao = new LoginDao();
		objUserBean = objDao.isUserPresent(email, password);
		objDao.commit();
		objDao.closeAll();
		if (objUserBean != null) {
			httpSession = request.getSession(true);
			String lang = (String) httpSession.getAttribute("language");
			lang = "en";
			Locale locale = null;
			if (lang != null) {
				locale = new Locale(lang);
			} else {
				locale = new Locale("es");
			}
			System.out.println("objUserBean >>"+objUserBean);
			ActionContext.getContext().setLocale(locale);
			httpSession.setAttribute(I18nInterceptor.DEFAULT_SESSION_ATTRIBUTE, locale);
			httpSession.setAttribute("password", password);
			httpSession.setAttribute("userId", objUserBean.getUserId());
			httpSession.setAttribute("language", objUserBean.getLanguage());
			httpSession.setAttribute("userType", objUserBean.getUserType());
			httpSession.setAttribute("userName", objUserBean.getUserName());
			httpSession.setAttribute("email", objUserBean.getEmailId());
			objLoginResponse.setCode("success");
			objLoginResponse.setMessage("Login Successfully...!");
			System.out.println("userType ::"+objUserBean.getUserType());
			try {
				UserGroupDao objUserGroupDao = new UserGroupDao();
				if(objLoginResponse.getCode().equalsIgnoreCase("success")){
					System.out.println("success ::");
					objLoginResponse.setUserMenuList(objUserGroupDao.getAssignedAccess(objUserBean.getUserGroupId()));
					objLoginResponse.setUserData(objUserBean);
					objLoginResponse.setUserList(objUserGroupDao.getUserList());
					objUserGroupDao.closeAll();
					CustomerDao objCustomerDao = new CustomerDao();
					objLoginResponse.setCustomerList(objCustomerDao.getCustomerList());
					objCustomerDao.closeAll();
					QuoteDao objQuoteDao = new QuoteDao();
					objLoginResponse.setSupplierList(objQuoteDao.getCurrentSupplierList());
					objQuoteDao.closeAll();
					TermServicesDao objTermServicesDao= new TermServicesDao();
					objLoginResponse.setServiceList(objTermServicesDao.getAllServices());
					objLoginResponse.setTermConditionList(objTermServicesDao.getAllTermsConditions());
					objTermServicesDao.closeAll();
					OfferDao objOfferDao =new OfferDao();
					objLoginResponse.setOfferList(objOfferDao.getOfferList(getText("offer_template_folder_path"),getText("offer_template_url"),getText("alt_offer_template_url")));
					objOfferDao.closeAll();
				}
				
			} catch (Exception e) {
				objLoginResponse.setCode("error");
				objLoginResponse.setMessage("Error, Please Contact Administrator...!");
			}
		} else {
			objLoginResponse.setCode("error");
			objLoginResponse.setMessage("Please Check Email/Password.");
		}
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
	public String checkSessionActive() {
		if (ServletActionContext.getRequest().getSession() != null) {
			HttpSession httpSession;
			httpSession = request.getSession(true);
			httpSession = ServletActionContext.getRequest().getSession();
			if (httpSession.getAttribute("userId")!=null) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage("session is active.");
			}else{
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage("session is inactive.");
			}
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
