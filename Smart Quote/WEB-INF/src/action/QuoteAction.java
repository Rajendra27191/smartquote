package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.CommentBean;
import pojo.CustomerBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.QuoteBean;
import responseBeans.CommentResponseBean;
import responseBeans.CurrentSupplierResponse;
import responseBeans.QuoteResponseBean;
import responseBeans.QuoteTermServiceResponseBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.AlternateProductDao;
import dao.CustomerDao;
import dao.ProductDao;
import dao.QuoteDao;

@SuppressWarnings("serial")
public class QuoteAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	private EmptyResponseBean objEmptyResponse;
	HttpSession httpSession;
	ArrayList<KeyValuePairBean> salesPersonList;
	ArrayList<KeyValuePairBean> currentSupplierList;
	private CurrentSupplierResponse objSupplierResponse;
	private ArrayList<QuoteBean> quoteList;
	private QuoteResponseBean quoteResponseBean;
	private QuoteTermServiceResponseBean quoteTermServiceResponseBean;
	private CommentResponseBean objCommentResponse;

	public CommentResponseBean getObjCommentResponse() {
		return objCommentResponse;
	}

	public void setObjCommentResponse(CommentResponseBean objCommentResponse) {
		this.objCommentResponse = objCommentResponse;
	}

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

	public void setCurrentSupplierList(ArrayList<KeyValuePairBean> currentSupplierList) {
		this.currentSupplierList = currentSupplierList;
	}

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public QuoteTermServiceResponseBean getQuoteTermServiceResponseBean() {
		return quoteTermServiceResponseBean;
	}

	public void setQuoteTermServiceResponseBean(QuoteTermServiceResponseBean quoteTermServiceResponseBean) {
		this.quoteTermServiceResponseBean = quoteTermServiceResponseBean;
	}

	public String createQuote() {
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		System.out.println("userId : " + userId);
		int supplierId = 0, salesPersonId = 0;
		String quoteDetails = request.getParameter("objQuoteBean");
		System.out.println("Quote Details: " + quoteDetails);
		QuoteDao objQuoteDao = new QuoteDao();
		// String supplierName = "Demo Supplier 151";
		// String salesPerson = "Demo Sales Person 161";
		// quoteDetails =
		// "{\n\t\"custCode\": \"TEST1\",\n\t\"custName\": \"Pradnya\",\n\t\"address\": \"Unit 11, 1472 Boundary Road, Wacol, QLD, 4076\",\n\t\"email\": \"mark@jaybel.com.au\",\n\t\"faxNo\": \"0\",\n\t\"phone\": \"0734235888\",\n\t\"monthlyAvgPurchase\": \"0\",\n\t\"isNewCustomer\": \"no\",\n\t\"quoteAttn\": \"ss\",\n\t\"currentSupplierName\": \"Supplier\",\n\t\"currentSupplierId\": 1,\n\t\"competeQuote\": \"yes\",\n\t\"salesPerson\": \"\",\n\t\"salesPersonId\":\"15\",\n\t\"pricesGstInclude\": false,\n\t\"notes\": \"\",\n\t\"productList\": [{\n\t\t\"avgcost\": 1.106,\n\t\t\"created_by\": \"1\",\n\t\t\"currentSupplierGP\": 9.894,\n\t\t\"currentSupplierPrice\": 11,\n\t\t\"currentSupplierTotal\": 11,\n\t\t\"description2\": \"SPOONS PK100\",\n\t\t\"description3\": \"** PLASTIC ** DESSERT SPOONS *\",\n\t\t\"gpRequired\": 0,\n\t\t\"itemCode\": \"ACO-733060\",\n\t\t\"itemDescription\": \"DISPOSABLE PLASTIC DESSERT\",\n\t\t\"itemQty\": 1,\n\t\t\"price0exGST\": 3.22,\n\t\t\"price1exGST\": 2.92,\n\t\t\"price2exGST\": 2.68,\n\t\t\"price3exGST\": 2.48,\n\t\t\"price4exGST\": 2.48,\n\t\t\"productGroupCode\": null,\n\t\t\"productGroupName\": null,\n\t\t\"qtyBreak1\": 3,\n\t\t\"qtyBreak2\": 6,\n\t\t\"qtyBreak3\": 12,\n\t\t\"qtyBreak4\": 999999999,\n\t\t\"quotePrice\": \"3.22\",\n\t\t\"taxCode\": null,\n\t\t\"total\": 3.22,\n\t\t\"unit\": \"PACK\",\n\t\t\"$$hashKey\": \"object:552\"\n\t}]\n}";
		objEmptyResponse = new EmptyResponseBean();
		System.out.println("param : " + quoteDetails);

		QuoteBean objQuoteBean = new QuoteBean();
		objQuoteBean = new Gson().fromJson(quoteDetails, QuoteBean.class);
		
		System.out.println("objQuoteBean.toString : ");
		System.out.println(objQuoteBean.toString());
		System.out.println("CUST PRESENT : " + objQuoteBean.getIsNewCustomer().toLowerCase());
		if (objQuoteBean.getIsNewCustomer().toLowerCase().equals("yes") || objQuoteBean.getIsNewCustomer().toLowerCase() == "yes") {
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
			System.out.println("isCustomerCreated : " + isCustomerCreated);
			objDao1.commit();
			objDao1.closeAll();
		}

		if (objQuoteBean.getCurrentSupplierId() == 0) {
			System.out.println("SaveCurrentSupplier :>>");
			System.out.println(objQuoteBean.getCurrentSupplierId());
			supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
			objQuoteBean.setCurrentSupplierId(supplierId);
		}
		// if (objQuoteBean.getSalesPersonId() == 0) {
		// salesPersonId = objQuoteDao.saveSalesPerson(objQuoteBean
		// .getSalesPerson());
		// objQuoteBean.setSalesPersonId(salesPersonId);
		// }

		for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			ProductDao objDao1 = new ProductDao();
			if (objQuoteBean.getProductList().get(i).getIsNewProduct() != null
					&& objQuoteBean.getProductList().get(i).getIsNewProduct().equalsIgnoreCase("true")) {
				boolean isProductCreated = false;
				isProductCreated = objDao1.saveProduct((objQuoteBean.getProductList().get(i)));
				System.out.println("new product added ::::::::" + isProductCreated);
				objDao1.commit();
				objDao1.closeAll();
				String projectPath = request.getSession().getServletContext().getRealPath("/");
				CommonLoadAction.createProductFile(projectPath);
			}
		}
		if (objQuoteBean.isSaveWithAlternative()) {
			System.out.println("ALTERNATIVES");
			AlternateProductDao altProductDao = new AlternateProductDao();
			String mainId, alternativeId;
			double altDefaultPrice=0;
			boolean isAlternateSaved = false;
			for (int i = 0; i < objQuoteBean.getAlternativeArray().size(); i++) {
				mainId = objQuoteBean.getAlternativeArray().get(i).getMainProductCode();
				alternativeId = objQuoteBean.getAlternativeArray().get(i).getAltProductObj().getAltProductCode();
				isAlternateSaved = altProductDao.saveAlternateProducts(mainId,alternativeId,altDefaultPrice);
			}
			System.out.println("isAlternateSaved : " + isAlternateSaved);
			altProductDao.commit();
			altProductDao.closeAll();
		}
		String status = "SAVED";
		boolean isQuoteSaved = false;
		boolean istermSaved;
		boolean isServiceSaved;
		int quoteId = 0;
		int quoteDetailId=0;
		quoteId = objQuoteDao.saveQuote(objQuoteBean, userId, status);
		System.out.print("quoteId  : " + quoteId);
		if (quoteId > 0) {
			for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			objQuoteBean.getProductList().get(i).setQuoteDetailId(0);
			quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i), quoteId);
//			System.out.println("SAVED Quote Detail quote detail id : " + quoteDetailId);
				if(objQuoteBean.isSaveWithAlternative() && quoteDetailId>0){
					if(objQuoteBean.getProductList().get(i).getAltProd()!=null){
//						System.out.println("ALTERNATIVE : ");
//						System.out.println(objQuoteBean.getProductList().get(i).getAltProd().toString());;
						objQuoteBean.getProductList().get(i).getAltProd().setQuoteDetailId(quoteDetailId);
						quoteDetailId=objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i).getAltProd(),quoteId);
//						System.out.println("new alternate product added quote detail id ::::::::" + quoteDetailId);
					}
				}
			}
			istermSaved = objQuoteDao.saveTermsAndConditionDetails(objQuoteBean.getTermConditionList(), quoteId);
//			System.out.println("SAVED terms and condition  : " + istermSaved);
			isServiceSaved = objQuoteDao.saveServiceDetails(objQuoteBean.getServiceList(), quoteId);
//			System.out.println("SAVED terms and condition  : " + isServiceSaved);

			objQuoteDao.commit();
			objQuoteDao.closeAll();
		}
		if (quoteDetailId>0 && quoteId > 0) {
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

	public String getCurrentSupplierList() {
		try {
			QuoteDao objQuoteDao = new QuoteDao();
			objSupplierResponse = new CurrentSupplierResponse();
			currentSupplierList = new ArrayList<KeyValuePairBean>();
			currentSupplierList = objQuoteDao.getCurrentSupplierList();
			System.out.println("LST : " + currentSupplierList);
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

	public String getSalesPersonList() {
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

	public String getQuoteView() {
		try {
			quoteResponseBean = new QuoteResponseBean();
			QuoteDao objQuoteDao = new QuoteDao();
			quoteList = objQuoteDao.getQuoteList();
			System.out.println("Quote List : " + quoteList.size());
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

	public String addComment() {
		CommentBean objCommentBean = null;
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		int quoteId = Integer.parseInt(request.getParameter("quoteId"));
		String comment = request.getParameter("comment");
		// int quoteId = 2;
		// String comment = "Testing Comment 121...!";
		System.out.println("QuoteId: " + quoteId + " | Comment: " + comment);
		QuoteDao objQuoteDao = new QuoteDao();
		objCommentResponse = new CommentResponseBean();

		int commentID = objQuoteDao.addComment(userId, quoteId, comment);
		objQuoteDao.commit();
		objQuoteDao.closeAll();
		if (commentID != 0) {
			QuoteDao objDao = new QuoteDao();
			objCommentBean = new CommentBean();
			objCommentBean = objDao.getCommentDetails(commentID);
			objDao.commit();
			objDao.closeAll();
			objCommentResponse.setCode("success");
			objCommentResponse.setMessage(getText("comment_added"));
			objCommentResponse.setResult(objCommentBean);
		} else {
			objCommentResponse.setCode("error");
			objCommentResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String updateQuote() {
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		System.out.println("userId : " + userId);
		int supplierId = 0, salesPersonId = 0;
		String quoteDetails = request.getParameter("objQuoteBean");
		QuoteDao objQuoteDao = new QuoteDao();
		// String quoteDetails =
		// "{\"quoteId\":6,\"custCode\":\"TEST1\",\"custName\":\"Pradnya\",\"address\":\"Unit 11, 1472 Boundary Road, Wacol, QLD, 4076\",\"email\":\"mark@jaybel.com.au\",\"faxNo\":\"0\",\"phone\":\"0734235888\",\"monthlyAvgPurchase\":\"0\",\"isNewCustomer\":\"no\",\"quoteAttn\":\"Quote Updated\",\"currentSupplierName\":\"Supplier\",\"currentSupplierId\":1,\"competeQuote\":\"yes\",\"salesPerson\":\"\",\"salesPersonId\":\"15\",\"pricesGstInclude\":false,\"notes\":\"\",\"productList\":[{\"avgcost\":1.106,\"created_by\":\"1\",\"currentSupplierGP\":9.894,\"currentSupplierPrice\":11,\"currentSupplierTotal\":11,\"description2\":\"SPOONS PK100\",\"description3\":\"** PLASTIC ** DESSERT SPOONS *\",\"gpRequired\":0,\"itemCode\":\"ACO-733060\",\"itemDescription\":\"DISPOSABLE PLASTIC DESSERT\",\"itemQty\":1,\"price0exGST\":3.22,\"price1exGST\":2.92,\"price2exGST\":2.68,\"price3exGST\":2.48,\"price4exGST\":2.48,\"productGroupCode\":null,\"productGroupName\":null,\"qtyBreak1\":3,\"qtyBreak2\":6,\"qtyBreak3\":12,\"qtyBreak4\":999999999,\"quotePrice\":\"3.22\",\"taxCode\":null,\"total\":3.22,\"unit\":\"PACK\",\"$$hashKey\":\"object:552\"}]}";
		System.out.println("Quote Details: " + quoteDetails);
		objEmptyResponse = new EmptyResponseBean();
		QuoteBean objQuoteBean = new QuoteBean();
		objQuoteBean = new Gson().fromJson(quoteDetails, QuoteBean.class);

		System.out.println("New Cust: " + objQuoteBean.getIsNewCustomer().toLowerCase());
		if (objQuoteBean.getIsNewCustomer().toLowerCase().equals("yes") || objQuoteBean.getIsNewCustomer().toLowerCase() == "yes") {
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
			System.out.println("isCustomerCreated: " + isCustomerCreated);
			objDao1.commit();
			objDao1.closeAll();
		}
		System.out.println("CurrentSupplierId"+objQuoteBean.getCurrentSupplierId());
		if (objQuoteBean.getCurrentSupplierId() == 0) {
			supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
			objQuoteBean.setCurrentSupplierId(supplierId);
		}
//		if (objQuoteBean.getSalesPersonId() == 0) {
//			salesPersonId = objQuoteDao.saveSalesPerson(objQuoteBean.getSalesPerson());
//			objQuoteBean.setSalesPersonId(salesPersonId);
//		}

		for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			if (objQuoteBean.getProductList().get(i).getIsNewProduct() != null
					&& objQuoteBean.getProductList().get(i).getIsNewProduct().equalsIgnoreCase("true")) {
				boolean isProductCreated = false;
				ProductDao objDao1 = new ProductDao();
				isProductCreated = objDao1.saveProduct((objQuoteBean.getProductList().get(i)));
				System.out.println("new product added ::::::::" + isProductCreated);
				objDao1.commit();
				objDao1.closeAll();
				String projectPath = request.getSession().getServletContext().getRealPath("/");
				CommonLoadAction.createProductFile(projectPath);
			}
		}

		// objQuoteDao.deleteQuote(objQuoteBean.getQuoteId());
		if (objQuoteBean.isSaveWithAlternative()) {
			System.out.println("ALTERNATIVES FROM EDIT QUOTE");
			AlternateProductDao altProductDao = new AlternateProductDao();
			String mainId, alternativeId;
			double altDefaultPrice=0;
			boolean isAlternateSaved = false;
			for (int i = 0; i < objQuoteBean.getAlternativeArray().size(); i++) {
				mainId = objQuoteBean.getAlternativeArray().get(i).getMainProductCode();
				alternativeId = objQuoteBean.getAlternativeArray().get(i).getAltProductObj().getAltProductCode();
				isAlternateSaved = altProductDao.saveAlternateProducts(mainId, alternativeId,altDefaultPrice);
			}
			System.out.println("isAlternateSaved : " + isAlternateSaved);
			altProductDao.commit();
			altProductDao.closeAll();
		}
		objQuoteBean.setUserId(Integer.parseInt(userId));
		String status = "UPDATED";
		boolean isQuoteUpdated = objQuoteDao.updateQuote(objQuoteBean, status);
		boolean isQuoteSaved = false;
		boolean isTermsSaved = false;
		boolean isServiceSaved = false;
		if (isQuoteUpdated) {
			objQuoteDao.deleteQuoteDetails(objQuoteBean.getQuoteId());
			int quoteDetailId=0;
			for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			objQuoteBean.getProductList().get(i).setQuoteDetailId(0);	
			quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i), objQuoteBean.getQuoteId());
			System.out.println("Quote Updated Successfully...!");
			if(objQuoteBean.isSaveWithAlternative()){
					if(objQuoteBean.getProductList().get(i).getAltProd()!=null){
						System.out.println("ALTERNATIVE : ");
						System.out.println(objQuoteBean.getProductList().get(i).getAltProd().toString());;
						objQuoteBean.getProductList().get(i).getAltProd().setQuoteDetailId(quoteDetailId);
						quoteDetailId=objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i).getAltProd(),objQuoteBean.getQuoteId());
					}
					System.out.println("new alternate product added ::::::::" + quoteDetailId);
					}
			}
			objQuoteDao.deleteTermsDetails(objQuoteBean.getQuoteId());
			isTermsSaved = objQuoteDao.saveTermsAndConditionDetails(objQuoteBean.getTermConditionList(), objQuoteBean.getQuoteId());
			System.out.println("Terms Updated Successfully...!" + isTermsSaved);

			objQuoteDao.deleteServiceDetails(objQuoteBean.getQuoteId());
			isServiceSaved = objQuoteDao.saveServiceDetails(objQuoteBean.getServiceList(), objQuoteBean.getQuoteId());
			System.out.println("Service Updated Successfully...!" + isServiceSaved);

			objQuoteDao.commit();
			objQuoteDao.closeAll();
			if (quoteDetailId>0) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("quote_updated"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		}
		return SUCCESS;
	}

	public String getTermsAndServiceList() {
		httpSession = request.getSession(true);
		int quoteId = Integer.parseInt(request.getParameter("quoteId"));
		QuoteBean quoteBean = new QuoteBean();
		try {
			quoteTermServiceResponseBean = new QuoteTermServiceResponseBean();

			QuoteDao objQuoteDao = new QuoteDao();
			// quoteList = objQuoteDao.getQuoteList();
			quoteBean = objQuoteDao.getTermsServiceList(quoteId);
			// System.out.println("Quote List : " + quoteList.size());
			objQuoteDao.commit();
			objQuoteDao.closeAll();
			quoteTermServiceResponseBean.setCode("success");
			quoteTermServiceResponseBean.setMessage("terms and Condition list loaded");
			quoteTermServiceResponseBean.setResult(quoteBean);

		} catch (Exception e) {
			e.printStackTrace();
			quoteTermServiceResponseBean.setCode("common_error");
			quoteTermServiceResponseBean.setMessage("error_quote_list_loaded");
			quoteTermServiceResponseBean.setResult(quoteBean);
		}
		return SUCCESS;

	}
}
