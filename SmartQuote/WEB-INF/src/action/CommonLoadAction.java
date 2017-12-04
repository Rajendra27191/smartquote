package action;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import pojo.CustomerBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.QuoteBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.CustomerDao;
import dao.ProductDao;
import dao.QuoteDao;

@SuppressWarnings("serial")
public class CommonLoadAction extends ActionSupport {
	public String action;
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	@Override
	public String execute() throws Exception {
		System.out.println("action = " + action);
		System.out.println("Session has been time out...!");
		objEmptyResponse.setCode("sessionTimeOut");
		objEmptyResponse.setMessage("Session Timeout...!");
		return SUCCESS;
	}

	public String createQuote(String quoteDetails) {
		int supplierId = 0;
		System.out.println("Quote Details 1: " + quoteDetails);
		QuoteDao objQuoteDao = new QuoteDao();

		System.out.println("param 1: " + quoteDetails);
		QuoteBean objQuoteBean = new QuoteBean();

		System.out.println(new Gson().fromJson(quoteDetails, QuoteBean.class));
		objQuoteBean = new Gson().fromJson(quoteDetails, QuoteBean.class);

		// System.out.println("objQuoteBean : "+objQuoteBean);
		// System.out.println("objQuoteBean toString : "+objQuoteBean.toString());
		// System.out.println("getProductList : "+objQuoteBean.getProductList());
		// System.out.println("getTermConditionList : "+objQuoteBean.getTermConditionList());
		// System.out.println("getTermConditionList : "+objQuoteBean.getServiceList());
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
			int isCustomerCreated = objDao1.saveCustomer(objBean);
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
		for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			if (objQuoteBean.getProductList().get(i).getIsNewProduct() != null
					&& objQuoteBean.getProductList().get(i).getIsNewProduct().equalsIgnoreCase("true")) {
				boolean isProductCreated = false;
				ProductDao objDao1 = new ProductDao();
				isProductCreated = objDao1.saveProduct((objQuoteBean.getProductList().get(i)));
				System.out.println("new product added ::::::::" + isProductCreated);
				objDao1.commit();
				objDao1.closeAll();
			}
		}
		String status = "INI";
		boolean isQuoteSaved = false;
		boolean istermSaved;
		boolean isServiceSaved;
		int quoteId = objQuoteDao.saveQuote(objQuoteBean, String.valueOf(objQuoteBean.getUserId()), status);
		System.out.println("SAVED Quote id : " + quoteId);
		if (quoteId > 0) {
			int quoteDetailId=0;
			for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i), quoteId);
			System.out.println("SAVED  : " + quoteDetailId);
			}

			istermSaved = objQuoteDao.saveTermsAndConditionDetails(objQuoteBean.getTermConditionList(), quoteId);
			System.out.println("SAVED terms and condition  : " + istermSaved);

			isServiceSaved = objQuoteDao.saveServiceDetails(objQuoteBean.getServiceList(), quoteId);
			System.out.println("SAVED service  : " + isServiceSaved);
			objQuoteDao.commit();
			objQuoteDao.closeAll();
		}
		return "success";
	}

	public String updateQuote(String quoteDetails) {
		int supplierId = 0;
		QuoteDao objQuoteDao = new QuoteDao();
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
			int isCustomerCreated = objDao1.saveCustomer(objBean);
			System.out.println("isCustomerCreated: " + isCustomerCreated);
			objDao1.commit();
			objDao1.closeAll();
		}

		if (objQuoteBean.getCurrentSupplierId() == 0) {
			supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
			objQuoteBean.setCurrentSupplierId(supplierId);
		}

		for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			if (objQuoteBean.getProductList().get(i).getIsNewProduct() != null
					&& objQuoteBean.getProductList().get(i).getIsNewProduct().equalsIgnoreCase("true")) {
				boolean isProductCreated = false;
				ProductDao objDao1 = new ProductDao();
				isProductCreated = objDao1.saveProduct((objQuoteBean.getProductList().get(i)));
				System.out.println("new product added ::::::::" + isProductCreated);
				objDao1.commit();
				objDao1.closeAll();
			}
		}

		// objQuoteDao.deleteQuote(objQuoteBean.getQuoteId());
		// objQuoteBean.setUserId(Integer.parseInt(userId));
		String status = "INI";
		boolean isQuoteUpdated = objQuoteDao.updateQuote(objQuoteBean, status);
		@SuppressWarnings("unused")
		boolean isQuoteSaved = false;
		boolean isTermsSaved = false;
		boolean isServiceSaved = false;

		if (isQuoteUpdated) {
			objQuoteDao.deleteQuoteDetails(objQuoteBean.getQuoteId());
			int quoteDetailId=0;
			for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
			quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i), objQuoteBean.getQuoteId());
			System.out.println("Quote Updated Successfully...!");
			}
			objQuoteDao.deleteTermsDetails(objQuoteBean.getQuoteId());
			isTermsSaved = objQuoteDao.saveTermsAndConditionDetails(objQuoteBean.getTermConditionList(), objQuoteBean.getQuoteId());
			System.out.println("Terms Updated Successfully...!" + isTermsSaved);

			objQuoteDao.deleteServiceDetails(objQuoteBean.getQuoteId());
			isServiceSaved = objQuoteDao.saveServiceDetails(objQuoteBean.getServiceList(), objQuoteBean.getQuoteId());
			System.out.println("Service Updated Successfully...!" + isServiceSaved);

			objQuoteDao.commit();
			objQuoteDao.closeAll();
		}
		return "success";
	}

	public static void createProductFile(String projectPath) {
//		System.out.println("CommonLoadAction createProductFile init :::");
		File file = new File(projectPath + "/products.json");
		if (!file.exists()) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}else{
			try {
				file.delete();
				System.out.println("File deleted");
				file.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		try {
			FileWriter fw = new FileWriter(file);
			ProductDao productDao = new ProductDao();
			ArrayList<KeyValuePairBean> obj = productDao.getProductList("");
			fw.write(new Gson().toJson(obj));
			fw.close();
			System.out.println("File created");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}