package responseBeans;

import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.QuoteBean;
import responseStructure.Response;

public class QuoteResponseBean extends Response{

	private ArrayList<QuoteBean> result ;

	public ArrayList<QuoteBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<QuoteBean> result) {
		this.result = result;
	}
}
