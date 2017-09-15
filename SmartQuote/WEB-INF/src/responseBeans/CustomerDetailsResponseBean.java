package responseBeans;

import pojo.CustomerBean;
import responseStructure.Response;

public class CustomerDetailsResponseBean extends Response {
	CustomerBean objResponseBean = new CustomerBean();

	public CustomerBean getObjResponseBean() {
		return objResponseBean;
	}

	public void setObjResponseBean(CustomerBean objResponseBean) {
		this.objResponseBean = objResponseBean;
	}

}
