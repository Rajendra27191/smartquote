package action;


import java.util.ArrayList;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.SessionAware;
import org.apache.struts2.util.ServletContextAware;

import pojo.CustomerBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.QuoteBean;
import responseBeans.CurrentSupplierResponse;
import responseBeans.QuoteResponseBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.CustomerDao;
import dao.QuoteDao;

public class QuoteAction extends ActionSupport  implements ServletContextAware, SessionAware, ServletRequestAware{
	private HttpServletRequest request;
	private EmptyResponseBean objEmptyResponse ;
	Map<String, Object> session;
	ArrayList<KeyValuePairBean> salesPersonList;
	ArrayList<KeyValuePairBean> currentSupplierList;
	private CurrentSupplierResponse objSupplierResponse ;
	private ArrayList<QuoteBean> quoteList ;
	private QuoteResponseBean quoteResponseBean ;
	
	
	public QuoteResponseBean getQuoteResponseBean() {
		return quoteResponseBean;
	}

	public void setQuoteResponseBean(QuoteResponseBean quoteResponseBean) {
		this.quoteResponseBean = quoteResponseBean;
	}

	public ArrayList<QuoteBean> getQuoteList() {
		return quoteList;
	}

	public void setQuoteList(ArrayList<QuoteBean> quoteList) {
		this.quoteList = quoteList;
	}

	public CurrentSupplierResponse getObjSupplierResponse() {
		return objSupplierResponse;
	}

	public void setObjSupplierResponse(CurrentSupplierResponse objSupplierResponse) {
		this.objSupplierResponse = objSupplierResponse;
	}

	public void setSalesPersonList(ArrayList<KeyValuePairBean> salesPersonList) {
		this.salesPersonList = salesPersonList;
	}

	public void setCurrentSupplierList(
			ArrayList<KeyValuePairBean> currentSupplierList) {
		this.currentSupplierList = currentSupplierList;
	}

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	@Override
	public void setSession(Map<String, Object> session) {
		this.session = session;
		
	}
	
	
	public String createQuote(){		
		String userId = session.get("userId").toString();
		System.out.println("userId : "+userId);
		int supplierId=0,salesPersonId = 0;
		String quoteDetails = request.getParameter("objQuoteBean");
		System.out.println("Quote Details: "+ quoteDetails);
		QuoteDao objQuoteDao = new QuoteDao();
		//String supplierName = "Demo Supplier 151";
		//String salesPerson = "Demo Sales Person 161";
	//	quoteDetails = "{\n\t\"custCode\": \"TEST1\",\n\t\"custName\": \"Pradnya\",\n\t\"address\": \"Unit 11, 1472 Boundary Road, Wacol, QLD, 4076\",\n\t\"email\": \"mark@jaybel.com.au\",\n\t\"faxNo\": \"0\",\n\t\"phone\": \"0734235888\",\n\t\"monthlyAvgPurchase\": \"0\",\n\t\"isNewCustomer\": \"no\",\n\t\"quoteAttn\": \"ss\",\n\t\"currentSupplierName\": \"Supplier\",\n\t\"currentSupplierId\": 1,\n\t\"competeQuote\": \"yes\",\n\t\"salesPerson\": \"\",\n\t\"salesPersonId\":\"15\",\n\t\"pricesGstInclude\": false,\n\t\"notes\": \"\",\n\t\"productList\": [{\n\t\t\"avgcost\": 1.106,\n\t\t\"created_by\": \"1\",\n\t\t\"currentSupplierGP\": 9.894,\n\t\t\"currentSupplierPrice\": 11,\n\t\t\"currentSupplierTotal\": 11,\n\t\t\"description2\": \"SPOONS PK100\",\n\t\t\"description3\": \"** PLASTIC ** DESSERT SPOONS *\",\n\t\t\"gpRequired\": 0,\n\t\t\"itemCode\": \"ACO-733060\",\n\t\t\"itemDescription\": \"DISPOSABLE PLASTIC DESSERT\",\n\t\t\"itemQty\": 1,\n\t\t\"price0exGST\": 3.22,\n\t\t\"price1exGST\": 2.92,\n\t\t\"price2exGST\": 2.68,\n\t\t\"price3exGST\": 2.48,\n\t\t\"price4exGST\": 2.48,\n\t\t\"productGroupCode\": null,\n\t\t\"productGroupName\": null,\n\t\t\"qtyBreak1\": 3,\n\t\t\"qtyBreak2\": 6,\n\t\t\"qtyBreak3\": 12,\n\t\t\"qtyBreak4\": 999999999,\n\t\t\"quotePrice\": \"3.22\",\n\t\t\"taxCode\": null,\n\t\t\"total\": 3.22,\n\t\t\"unit\": \"PACK\",\n\t\t\"$$hashKey\": \"object:552\"\n\t}]\n}";
		objEmptyResponse = new EmptyResponseBean();
		System.out.println("param : "+quoteDetails);
		
		QuoteBean objQuoteBean = new QuoteBean();
		objQuoteBean = new Gson().fromJson(quoteDetails, QuoteBean.class);
		
		System.out.println("CUST PRESENT : "+objQuoteBean.getIsNewCustomer().toLowerCase());
		if(objQuoteBean.getIsNewCustomer().toLowerCase().equals("yes") || objQuoteBean.getIsNewCustomer().toLowerCase()=="yes")
		{
			CustomerBean objBean = new CustomerBean();
			objBean.setCustomerCode(objQuoteBean.getCustCode());
			objBean.setCustomerName(objQuoteBean.getCustName());
			objBean.setAddress1(objQuoteBean.getAddress());
			objBean.setPhone(objQuoteBean.getPhone());
			objBean.setFax(objQuoteBean.getFaxNo());
			objBean.setEmail(objQuoteBean.getEmail());
			objBean.setAvgPurchase(objQuoteBean.getMonthlyAvgPurchase());
			CustomerDao objDao1 = new CustomerDao();
			boolean isCustomerCreated = objDao1.saveCustomer(objBean);
			System.out.println("isCustomerCreated : "+isCustomerCreated);
			objDao1.commit();
			objDao1.closeAll();
		}
			
		
		if(objQuoteBean.getCurrentSupplierId()==0)
		{
			supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
			objQuoteBean.setCurrentSupplierId(supplierId);
		}
		if(objQuoteBean.getSalesPersonId()==0)
		{
			salesPersonId = objQuoteDao.saveSalesPerson(objQuoteBean.getSalesPerson());
			objQuoteBean.setSalesPersonId(salesPersonId);
		}
		
		
		int quoteId = objQuoteDao.saveQuote(objQuoteBean,userId);
		boolean isQuoteSaved = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList(), quoteId);
		System.out.println("SAVED : "+isQuoteSaved);
		objQuoteDao.commit();
		objQuoteDao.closeAll();
		if (isQuoteSaved) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("quote_saved"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	@Override
	public void setServletContext(ServletContext arg0) {
		// TODO Auto-generated method stub
		
	}
	
	public String getCurrentSupplierList(){

		try {
			QuoteDao objQuoteDao = new QuoteDao();
			objSupplierResponse = new CurrentSupplierResponse();
			currentSupplierList = new ArrayList<KeyValuePairBean>();
			currentSupplierList = objQuoteDao.getCurrentSupplierList();
			System.out.println("LST : "+currentSupplierList);
			objQuoteDao.commit();
			objQuoteDao.closeAll();
			
			objSupplierResponse.setCode("success");
			objSupplierResponse.setResult(currentSupplierList);
			objSupplierResponse.setMessage(getText("supplier_list_loaded"));
		} catch (Exception e) {
			e.printStackTrace();
			objSupplierResponse.setCode("common_error");
			objSupplierResponse.setResult(currentSupplierList);
			objSupplierResponse.setMessage(getText("error_supplier_list_loaded"));
		}
		return SUCCESS;
	
	}
	
	
	public String getSalesPersonList(){

		try {
			QuoteDao objQuoteDao = new QuoteDao();
			objSupplierResponse = new CurrentSupplierResponse();
			salesPersonList = objQuoteDao.getSalesPersonList();
			objQuoteDao.commit();
			objQuoteDao.closeAll();
			objSupplierResponse.setCode("success");
			objSupplierResponse.setResult(salesPersonList);
			objSupplierResponse.setMessage(getText("sales_person_list_loaded"));
		} catch (Exception e) {
			e.printStackTrace();
			objSupplierResponse.setCode("common_error");
			objSupplierResponse.setResult(salesPersonList);
			objSupplierResponse.setMessage(getText("error_sales_person_list_loaded"));
		}
		return SUCCESS;
	
	}
	
	public String getQuoteView(){
		try {
			quoteResponseBean = new QuoteResponseBean();
			QuoteDao objQuoteDao = new QuoteDao();
			quoteList = objQuoteDao.getQuoteList();
			System.out.println("Quote List : "+quoteList.size());
			objQuoteDao.commit();
			objQuoteDao.closeAll();
			quoteResponseBean.setCode("success");
			quoteResponseBean.setMessage("quote_list_loaded");
			quoteResponseBean.setResult(quoteList);
			
		} catch (Exception e) {
			e.printStackTrace();
			quoteResponseBean.setCode("common_error");
			quoteResponseBean.setMessage("error_quote_list_loaded");
			quoteResponseBean.setResult(quoteList);
		}
		return SUCCESS;
	}
	
}
