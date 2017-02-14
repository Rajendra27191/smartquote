package responseBeans;

import java.util.ArrayList;

import pojo.KeyValuePairBean;
import responseStructure.Response;

public class CurrentSupplierResponse extends Response{

	private ArrayList<KeyValuePairBean> result ;

	public ArrayList<KeyValuePairBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<KeyValuePairBean> result) {
		this.result = result;
	}

	
	

}
