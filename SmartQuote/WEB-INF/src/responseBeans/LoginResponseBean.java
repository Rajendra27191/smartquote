package responseBeans;

import java.util.ArrayList;

import pojo.CustomerBean;
import pojo.KeyValuePairBean;
import pojo.MenuBean;
import pojo.OfferBean;
import pojo.UserBean;
import responseStructure.Response;

public class LoginResponseBean extends Response {
	private ArrayList<MenuBean> userMenuList = new ArrayList<MenuBean>();
	private UserBean userData= new UserBean();
	public ArrayList<MenuBean> getUserMenuList() {
		return userMenuList;
	}

	public void setUserMenuList(ArrayList<MenuBean> userMenuList) {
		this.userMenuList = userMenuList;
	}

	public UserBean getUserData() {
		return userData;
	}

	public void setUserData(UserBean userData) {
		this.userData = userData;
	}
	
	private ArrayList<KeyValuePairBean> userList = new ArrayList<KeyValuePairBean>();
	private ArrayList<KeyValuePairBean> customerList = new ArrayList<KeyValuePairBean>();
	private ArrayList<KeyValuePairBean> supplierList = new ArrayList<KeyValuePairBean>();
	private ArrayList<KeyValuePairBean> serviceList = new ArrayList<KeyValuePairBean>();
	private ArrayList<KeyValuePairBean> termConditionList = new ArrayList<KeyValuePairBean>();
	private ArrayList<OfferBean> offerList = new ArrayList<OfferBean>();
	
	public ArrayList<KeyValuePairBean> getUserList() {
		return userList;
	}

	public void setUserList(ArrayList<KeyValuePairBean> userList) {
		this.userList = userList;
	}

	public ArrayList<KeyValuePairBean> getCustomerList() {
		return customerList;
	}

	public void setCustomerList(ArrayList<KeyValuePairBean> customerList) {
		this.customerList = customerList;
	}

	public ArrayList<KeyValuePairBean> getSupplierList() {
		return supplierList;
	}

	public void setSupplierList(ArrayList<KeyValuePairBean> supplierList) {
		this.supplierList = supplierList;
	}

	public ArrayList<KeyValuePairBean> getServiceList() {
		return serviceList;
	}

	public void setServiceList(ArrayList<KeyValuePairBean> serviceList) {
		this.serviceList = serviceList;
	}

	public ArrayList<KeyValuePairBean> getTermConditionList() {
		return termConditionList;
	}

	public void setTermConditionList(ArrayList<KeyValuePairBean> termConditionList) {
		this.termConditionList = termConditionList;
	}

	public ArrayList<OfferBean> getOfferList() {
		return offerList;
	}

	public void setOfferList(ArrayList<OfferBean> offerList) {
		this.offerList = offerList;
	}


	

}
