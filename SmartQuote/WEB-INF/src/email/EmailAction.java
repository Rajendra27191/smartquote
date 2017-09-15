/**
 * 
 */
package email;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmailBean;
import pojo.EmptyResponseBean;

import com.opensymphony.xwork2.ActionSupport;

import dao.UserGroupDao;

/**
 * @author rajendra
 * 
 */
@SuppressWarnings("serial")
public class EmailAction extends ActionSupport implements ServletRequestAware {
	HttpServletRequest request;
	EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public String sendPassword() {
		String email = request.getParameter("email");
		/*email = "vidya@giantleapsystems.com";*/
		
		UserGroupDao objUserGroupDao = new UserGroupDao();
		boolean isRegisterdUser = objUserGroupDao.isRegisterdUser(email);
		objUserGroupDao.commit();
		objUserGroupDao.closeAll();
		
		if (isRegisterdUser) {
			String newPassword = RandomPasswordGenerator.generateRandomPassword();
			EmailBean objEmailBean = new EmailBean();
			objEmailBean.setMailTo(email);
			objEmailBean.setBody(getText("new_password_body") + " " + newPassword);
			objEmailBean.setSubject(getText("reset_password_lbl"));

			EmailDAO objEmailDAO = new EmailDAO();
			boolean isMailSent = objEmailDAO.insertRecords(objEmailBean);
			objEmailDAO.closeAll();
			if (isMailSent) {
				UserGroupDao objDao = new UserGroupDao();
				objDao.changePassword(email, newPassword);
				objDao.commit();
				objDao.closeAll();
				System.out.println("Mail Sent...!");
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("password_sent"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("error_check_email"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_not_register_email"));
		}
		return SUCCESS;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.apache.struts2.interceptor.ServletRequestAware#setServletRequest(
	 * javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public void setServletRequest(HttpServletRequest req) {
		request = req;
	}
}
