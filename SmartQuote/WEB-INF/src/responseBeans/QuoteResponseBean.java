package responseBeans;

import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.QuoteBean;
import responseStructure.Response;

public class QuoteResponseBean extends Response{

	private ArrayList<QuoteBean> result ;
	private QuoteBean quoteInfo;

	public ArrayList<QuoteBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<QuoteBean> result) {
		this.result = result;
	}

	public QuoteBean getQuoteInfo() {
		return quoteInfo;
	}

	public void setQuoteInfo(QuoteBean quoteInfo) {
		this.quoteInfo = quoteInfo;
	}
}
