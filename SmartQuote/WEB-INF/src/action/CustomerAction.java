package action;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Paths;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.swing.text.StyledEditorKit.BoldAction;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.CustomerBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import responseBeans.CustomerDetailResponseList;
import responseBeans.CustomerDetailsResponseBean;
import responseBeans.DetailResponseBean;
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
	private DetailResponseBean objDetailResponseBean;
	
	public DetailResponseBean getObjDetailResponseBean() {
		return objDetailResponseBean;
	}

	public void setObjDetailResponseBean(DetailResponseBean objDetailResponseBean) {
		this.objDetailResponseBean = objDetailResponseBean;
	}

	public File logoFile;
	
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
	public boolean createLogo(String filename,File logoImage){
		boolean isLogoCreated=false;
		String projectLogoPath=System.getProperty("user.dir")+getText("customer_logo_folder_path");
		System.out.println("projectLogoPath "+projectLogoPath);
		File fileToCreate = new File(projectLogoPath+filename);
		try {
			System.out.println("fileToCreate :: "+fileToCreate);
			FileUtils.copyFile(logoImage, fileToCreate);
			isLogoCreated=true;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return isLogoCreated;
	}
	public boolean deleteLogo(String filename){
		boolean isLogoDeleted=false;
		String projectLogoPath=System.getProperty("user.dir")+getText("customer_logo_folder_path");
		System.out.println("projectLogoPath "+projectLogoPath);
		File fileToDelete = new File(projectLogoPath+filename);
		try {
			System.out.println("fileToDelete :: "+fileToDelete);
			fileToDelete.delete();
			isLogoDeleted=true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isLogoDeleted;
	}
	public String createCustomer() {
		objDetailResponseBean = new DetailResponseBean();
		String customerDetails = request.getParameter("customerDetails");
		System.out.println("customerDetails ::: "+customerDetails);
		System.out.println("Logo file ::: " + logoFile);
		CustomerBean objBean = new CustomerBean();
		objBean = new Gson().fromJson(customerDetails, CustomerBean.class);
		boolean isCustomerCreated = false, isCustomerExist = false;
		
		CustomerDao objDao = new CustomerDao();
		isCustomerExist = objDao.isCustomerExist(objBean.getCustomerCode());
		objDao.commit();
		objDao.closeAll();
		int custId=0;
		if (!isCustomerExist) {
			CustomerDao objDao1 = new CustomerDao();
			custId = objDao1.saveCustomer(objBean);
			objDao1.commit();
			objDao1.closeAll();
			if (custId>0){
			if (logoFile!=null) {
//				System.out.println(logoFile.);
				String filename = "CustId_" + custId + ".png";
				boolean isLogoSaved=createLogo(filename, logoFile);
				System.out.println("LOGO saved ::: "+filename);
			}
			System.out.println("custId"+custId);
				objDetailResponseBean.setCode("success");
				objDetailResponseBean.setGenratedId(custId);
				objDetailResponseBean.setMessage(getText("customer_created"));
			} else {
				objDetailResponseBean.setCode("error");
				objDetailResponseBean.setMessage(getText("common_error"));
			}
		} else {
			objDetailResponseBean.setCode("error");
			objDetailResponseBean.setMessage(getText("error_Customer_exist"));
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
		System.out.println("customerDetails Update ::: "+customerDetails);
		System.out.println("Logo file ::: " + logoFile);
		
		CustomerBean objBean = new CustomerBean();
		objBean = new Gson().fromJson(customerDetails, CustomerBean.class);
		boolean isCustomerUpdated = false;

		CustomerDao objDao1 = new CustomerDao();
		isCustomerUpdated = objDao1.updateCustomer(objBean);
		objDao1.commit();
		objDao1.closeAll();
		if (isCustomerUpdated) {
			if (logoFile!=null) {
				String filename ="CustId_" + objBean.getCustId() + ".png";
				File file = new File(filename);
				boolean isLogoSaved=false;
				if (!file.exists()) {
					isLogoSaved=createLogo(filename, logoFile);
					System.out.println("1.LOGO saved ::: "+filename);
				}else{
					file.delete();
					isLogoSaved=createLogo(filename, logoFile);
					System.out.println("2.LOGO saved ::: "+filename);
				}
				
			}
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
		CustomerBean objBean = objDao.getCustomerDetails(customerCode);
		String filename ="CustId_" + objBean.getCustId() + ".png";
		deleteLogo(filename);
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
//			objCustomerBeans = objDao.getAllCustomerDetails(getText("customer_logo_folder_path"));
//			String customerLogoSrc=request.getSession().getServletContext().getRealPath("/")+"CustomerLogo";
			objCustomerBeans = objDao.getAllCustomerDetails(getText("customer_logo_url"));
			objDao.commit();
			objDao.closeAll();
			customerDetailResponseList.setCode("success");
			customerDetailResponseList.setMessage(getText("details_loaded"));
			customerDetailResponseList.setObjCustomersDetailResponseList(objCustomerBeans);
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
