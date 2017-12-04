package responseBeans;

import java.util.ArrayList;

import pojo.OfferBean;
import responseStructure.Response;

public class OfferResponseBean extends Response{

	private ArrayList<OfferBean> result = new ArrayList<OfferBean>();
	public ArrayList<OfferBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<OfferBean> result) {
		this.result = result;
	}



}
