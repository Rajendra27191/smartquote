package action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import pojo.QuoteBean;

import com.opensymphony.xwork2.ActionSupport;

public class CustComparisonAction extends ActionSupport{
	
	Map<String ,String > exportParameters ;
	ArrayList<String> list = new ArrayList<String>();
	QuoteBean objQuoteBean ;
	int quoteId;
	
	
	
	public int getQuoteId() {
		return quoteId;
	}
	public void setQuoteId(int quoteId) {
		this.quoteId = quoteId;
	}
	public Map<String, String> getExportParameters() {
		return exportParameters;
	}
	public void setExportParameters(Map<String, String> exportParameters) {
		this.exportParameters = exportParameters;
	}
	public ArrayList<String> getList() {
		return list;
	}
	public void setList(ArrayList<String> list) {
		this.list = list;
	}
	public QuoteBean getObjQuoteBean() {
		return objQuoteBean;
	}
	public void setObjQuoteBean(QuoteBean objQuoteBean) {
		this.objQuoteBean = objQuoteBean;
	}
	
	public String exportPDF(){
		System.out.println("Quote Id : "+quoteId);
		objQuoteBean = new QuoteBean();
		exportParameters = new HashMap<String, String>();
		return SUCCESS;
	}
	
	
	
}
