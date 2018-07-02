package responseBeans;

import responseStructure.Response;

public class QuoteAddProductResponseBean extends Response{
	private int quoteDetailIdMain;
	private int quoteDeatilIdAlt;
	public int getQuoteDetailIdMain() {
		return quoteDetailIdMain;
	}
	public int getQuoteDeatilIdAlt() {
		return quoteDeatilIdAlt;
	}
	public void setQuoteDetailIdMain(int quoteDetailIdMain) {
		this.quoteDetailIdMain = quoteDetailIdMain;
	}
	public void setQuoteDeatilIdAlt(int quoteDeatilIdAlt) {
		this.quoteDeatilIdAlt = quoteDeatilIdAlt;
	}

}
