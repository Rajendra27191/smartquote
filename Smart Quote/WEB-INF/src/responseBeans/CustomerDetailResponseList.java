package responseBeans;

import java.util.ArrayList;

import pojo.CustomerBean;
import responseStructure.Response;

public class CustomerDetailResponseList extends Response {
	ArrayList<CustomerBean> objCustomersDetailResponseList = new ArrayList<CustomerBean>();

	public ArrayList<CustomerBean> getObjCustomersDetailResponseList() {
		return objCustomersDetailResponseList;
	}

	public void setObjCustomersDetailResponseList(
			ArrayList<CustomerBean> objCustomersDetailResponseList) {
		this.objCustomersDetailResponseList = objCustomersDetailResponseList;
	}

}
