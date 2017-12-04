package responseBeans;

import java.util.ArrayList;

import pojo.KeyValuePairBean;
import responseStructure.Response;

public class KeyValuePairResponseBean extends Response {
	private ArrayList<KeyValuePairBean> result = new ArrayList<KeyValuePairBean>();

	public ArrayList<KeyValuePairBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<KeyValuePairBean> result) {
		this.result = result;
	}

}