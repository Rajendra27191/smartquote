package action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import responseBeans.KeyValuePairResponseBean;

import com.opensymphony.xwork2.ActionSupport;

import dao.TermServicesDao;

@SuppressWarnings("serial")
public class TermServicesAction extends ActionSupport implements
		ServletRequestAware {
	HttpServletRequest request;
	HttpSession httpSession;
	private KeyValuePairResponseBean objPairResponseBean;
	private EmptyResponseBean objEmptyResponse;

	public KeyValuePairResponseBean getObjPairResponseBean() {
		return objPairResponseBean;
	}

	public void setObjPairResponseBean(
			KeyValuePairResponseBean objPairResponseBean) {
		this.objPairResponseBean = objPairResponseBean;
	}

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public String getTermsConditions() {
		objPairResponseBean = new KeyValuePairResponseBean();
		try {
			TermServicesDao objDao = new TermServicesDao();
			objPairResponseBean.setCode("success");
			objPairResponseBean.setMessage(getText("list_loaded"));
			objPairResponseBean.setResult(objDao.getAllTermsConditions());
			objDao.commit();
			objDao.closeAll();
		} catch (Exception e) {
			objPairResponseBean.setCode("error");
			objPairResponseBean.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getServices() {
		objPairResponseBean = new KeyValuePairResponseBean();
		try {
			TermServicesDao objDao = new TermServicesDao();
			objPairResponseBean.setCode("success");
			objPairResponseBean.setMessage(getText("list_loaded"));
			objPairResponseBean.setResult(objDao.getAllServices());
			objDao.commit();
			objDao.closeAll();
		} catch (Exception e) {
			objPairResponseBean.setCode("error");
			objPairResponseBean.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String createTermsConditions() {
		objEmptyResponse = new EmptyResponseBean();
		String termCondition = request.getParameter("termCondition");
		// termCondition = "Terms Offering 5";
		boolean isTermCreated = false, isTermConditionExist = false;

		TermServicesDao objDao = new TermServicesDao();
		isTermConditionExist = objDao.isTermConditionExist(termCondition);
		objDao.commit();
		objDao.closeAll();
		if (!isTermConditionExist) {
			TermServicesDao objDao1 = new TermServicesDao();
			isTermCreated = objDao1.saveTermCondition(termCondition);
			objDao1.commit();
			objDao1.closeAll();
			if (isTermCreated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("term_created"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("term_exist"));
		}
		return SUCCESS;
	}

	public String createService() {
		objEmptyResponse = new EmptyResponseBean();
		String service = request.getParameter("service");
		// service = "Service 2";
		boolean isServiceCreated = false, isServiceExist = false;

		TermServicesDao objDao = new TermServicesDao();
		isServiceExist = objDao.isServiceExist(service);
		objDao.commit();
		objDao.closeAll();
		if (!isServiceExist) {
			TermServicesDao objDao1 = new TermServicesDao();
			isServiceCreated = objDao1.saveService(service);
			objDao1.commit();
			objDao1.closeAll();
			if (isServiceCreated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("service_created"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("service_exist"));
		}
		return SUCCESS;
	}

	public String updateTermsConditions() {
		objEmptyResponse = new EmptyResponseBean();
		String termCondition = request.getParameter("termCondition");
		int id = Integer.parseInt(request.getParameter("id"));

		// termCondition = "Terms Offering 1";
		// int id = 1;
		boolean isTermUpdated = false, isTermConditionExist = false;

		TermServicesDao objDao = new TermServicesDao();
		isTermConditionExist = objDao.isTermConditionExistForUpdate(
				termCondition, id);
		objDao.commit();
		objDao.closeAll();
		if (!isTermConditionExist) {
			TermServicesDao objDao1 = new TermServicesDao();
			isTermUpdated = objDao1.updateTermCondition(termCondition, id);
			objDao1.commit();
			objDao1.closeAll();
			if (isTermUpdated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("term_updated"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("term_exist"));
		}
		return SUCCESS;
	}

	public String updateService() {
		objEmptyResponse = new EmptyResponseBean();
		String service = request.getParameter("service");
		int id = Integer.parseInt(request.getParameter("id"));

		// service = "Service 1";
		// int id = 1;
		boolean isServiceUpdated = false, isServiceExist = false;

		TermServicesDao objDao = new TermServicesDao();
		isServiceExist = objDao.isServiceExistForUpdate(service, id);
		objDao.commit();
		objDao.closeAll();
		if (!isServiceExist) {
			TermServicesDao objDao1 = new TermServicesDao();
			isServiceUpdated = objDao1.updateService(service, id);
			objDao1.commit();
			objDao1.closeAll();
			if (isServiceUpdated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("service_updated"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("service_exist"));
		}
		return SUCCESS;
	}

	public String deleteTermCondition() {
		objEmptyResponse = new EmptyResponseBean();
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_term_delete"));
		int termId = Integer.parseInt(request.getParameter("id"));

		TermServicesDao objDao = new TermServicesDao();
		boolean isDeleted = objDao.deleteTermCondition(termId);
		if (isDeleted) {
			objDao.deleteTermFromQuote(termId);
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("term_delete"));
		}
		objDao.commit();
		objDao.closeAll();
		return SUCCESS;
	}

	public String deleteService() {
		objEmptyResponse = new EmptyResponseBean();
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_service_delete"));
		int serviceId = Integer.parseInt(request.getParameter("id"));

		TermServicesDao objDao = new TermServicesDao();
		boolean isDeleted = objDao.deleteService(serviceId);
		if (isDeleted) {
			objDao.deleteServiceFromQuote(serviceId);
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("service_delete"));
		}
		objDao.commit();
		objDao.closeAll();
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
