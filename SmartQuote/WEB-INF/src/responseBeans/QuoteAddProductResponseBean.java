package responseBeans;

import responseStructure.Response;

public class QuoteAddProductResponseBean extends Response{
	private int quoteDetailIdMain;
	private int quoteDeatilIdAlt;
	private boolean isNewProductCreated;
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
	public boolean isNewProductCreated() {
		return isNewProductCreated;
	}
	public void setNewProductCreated(boolean isNewProductCreated) {
		this.isNewProductCreated = isNewProductCreated;
	}

}
