package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.CustomerBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import responseBeans.CustomerDetailResponseList;
import responseBeans.CustomerDetailsResponseBean;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.CustomerDao;

@SuppressWarnings("serial")
public class CustomerAction extends ActionSupport implements
		ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private CustomerDetailsResponseBean customerDetailsResponse = new CustomerDetailsResponseBean();
	private CustomerDetailResponseList customerDetailResponseList = new CustomerDetailResponseList();

	public UserGroupResponse getData() {
		return data;
	}

	public void setData(UserGroupResponse data) {
		this.data = data;
	}

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public CustomerDetailsResponseBean getCustomerDetailsResponse() {
		return customerDetailsResponse;
	}

	public void setCustomerDetailsResponse(
			CustomerDetailsResponseBean customerDetailsResponse) {
		this.customerDetailsResponse = customerDetailsResponse;
	}

	public CustomerDetailResponseList getCustomerDetailResponseList() {
		return customerDetailResponseList;
	}

	public void setCustomerDetailResponseList(
			CustomerDetailResponseList customerDetailResponseList) {
		this.customerDetailResponseList = customerDetailResponseList;
	}

	public String getCustomerList() {
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
		try {
			CustomerDao objDao = new CustomerDao();
			valuePairBeans = objDao.getCustomerList();
			objDao.commit();
			objDao.closeAll();
			data.setCode("success");
			data.setMessage(getText("list_loaded"));
			data.setResult(valuePairBeans);
		} catch (Exception e) {
			data.setCode("error");
			data.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String createCustomer() {
		String customerDetails = request.getParameter("customerDetails");
		// customerDetails =
		// "{\"customerCode\":\"SHR6799AUN\",\"customerName\":\"Shrujan Systems\",\"state\":\"MH\",\"postalCode\":\"411007\",\"address1\":\"Aundh\",\"address2\":\"Aundh\",\"phone\":\"6523489\",\"contactPerson\":\"Divyesh Shah\",\"fax\":\"\",\"email\":\"divyesh@giantleapsystems.com\",\"totalStaff\":\"36\",\"avgPurchase\":\"5318462\",\"industryType\":\"IT\"}";
		CustomerBean objBean = new CustomerBean();
		objBean = new Gson().fromJson(customerDetails, CustomerBean.class);
		boolean isCustomerCreated = false, isCustomerExist = false;

		CustomerDao objDao = new CustomerDao();
		isCustomerExist = objDao.isCustomerExist(objBean.getCustomerCode());
		objDao.commit();
		objDao.closeAll();
		if (!isCustomerExist) {
			CustomerDao objDao1 = new CustomerDao();
			isCustomerCreated = objDao1.saveCustomer(objBean);
			objDao1.commit();
			objDao1.closeAll();
			if (isCustomerCreated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("customer_created"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_Customer_exist"));
		}
		return SUCCESS;
	}

	public String getCustomerDetails() {
		String customerCode = request.getParameter("customerCode");
	
		try {
			customerDetailsResponse.setCode("error");
			customerDetailsResponse.setMessage(getText("common_error"));
			CustomerDao objDao = new CustomerDao();
			CustomerBean objBean = objDao.getCustomerDetails(customerCode);
			objDao.commit();
			objDao.closeAll();
			if (objBean != null) {
				customerDetailsResponse.setCode("success");
				customerDetailsResponse.setMessage(getText("details_loaded"));
				customerDetailsResponse.setObjResponseBean(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String updateCustomerDetails() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_creating_user_group"));

		String customerDetails = request.getParameter("customerDetails");
		// customerDetails =
		// "{\"customerCode\":\"SHR6799AUN\",\"customerName\":\"Shrujan Systems PVT. LTD.\",\"state\":\"MH\",\"postalCode\":\"411007\",\"address1\":\"Aundh\",\"address2\":\"Aundh\",\"phone\":\"6523489\",\"contactPerson\":\"Divyesh Shah\",\"fax\":\"\",\"email\":\"divyesh@giantleapsystems.com\",\"totalStaff\":\"36\",\"avgPurchase\":\"5318462\",\"industryType\":\"IT\"}";
		CustomerBean objBean = new CustomerBean();
		objBean = new Gson().fromJson(customerDetails, CustomerBean.class);
		boolean isCustomerUpdated = false;

		CustomerDao objDao1 = new CustomerDao();
		isCustomerUpdated = objDao1.updateCustomer(objBean);
		objDao1.commit();
		objDao1.closeAll();
		if (isCustomerUpdated) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("customer_updated"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String deleteCustomer() {
		String customerCode = request.getParameter("customerCode");
		// customerCode = "SHR6799AUN";
		CustomerDao objDao = new CustomerDao();
		boolean isDeleted = objDao.deleteUser(customerCode);
		objDao.commit();
		objDao.closeAll();
		if (isDeleted) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("customer_deleted"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getCustomerListView() {
		try {
			CustomerDao objDao = new CustomerDao();
			ArrayList<CustomerBean> objCustomerBeans = new ArrayList<CustomerBean>();
			objCustomerBeans = objDao.getAllCustomerDetails();
			objDao.commit();
			objDao.closeAll();
			customerDetailResponseList.setCode("success");
			customerDetailResponseList.setMessage(getText("details_loaded"));
			customerDetailResponseList
					.setObjCustomersDetailResponseList(objCustomerBeans);
		} catch (Exception e) {
			customerDetailResponseList.setCode("error");
			customerDetailResponseList.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
}
