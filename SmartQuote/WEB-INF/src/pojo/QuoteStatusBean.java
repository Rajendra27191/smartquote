package pojo;

import java.util.ArrayList;

public class QuoteStatusBean {
	private String quoteStatus="";
	private ArrayList<CommentBean> objQuoteBeanList = new ArrayList<CommentBean>();

	public ArrayList<CommentBean> getObjQuoteBeanList() {
		return objQuoteBeanList;
	}

	public void setObjQuoteBeanList(ArrayList<CommentBean> objQuoteBeanList) {
		this.objQuoteBeanList = objQuoteBeanList;
	}

	public String getQuoteStatus() {
		return quoteStatus;
	}

	public void setQuoteStatus(String quoteStatus) {
		this.quoteStatus = quoteStatus;
	}

	
	
}
