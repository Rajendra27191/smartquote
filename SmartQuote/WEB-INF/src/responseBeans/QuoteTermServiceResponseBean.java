package responseBeans;

import pojo.QuoteBean;
import responseStructure.Response;

public class QuoteTermServiceResponseBean extends Response {
	
	private QuoteBean result;

	public QuoteBean getResult() {
		return result;
	}

	public void setResult(QuoteBean result) {
		this.result = result;
	}

}
