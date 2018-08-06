package action;

import java.io.File;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.CommentBean;
import pojo.CustomerBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.QuoteBean;
import pojo.QuoteStatusBean;
import responseBeans.CommentResponseBean;
import responseBeans.CurrentSupplierResponse;
import responseBeans.QuoteAddProductResponseBean;
import responseBeans.QuoteCreateResponseBean;
import responseBeans.QuoteResponseBean;
import responseBeans.QuoteTermServiceResponseBean;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.opensymphony.xwork2.ActionSupport;

import dao.AlternateProductDao;
import dao.CustomerDao;
import dao.ProductDao;
import dao.QuoteDao;
import dao.QuoteTempDao;

@SuppressWarnings("serial")
public class QuoteAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	private EmptyResponseBean objEmptyResponse;
	private QuoteAddProductResponseBean objQuoteAddProductResponse;
	HttpSession httpSession;
	ArrayList<KeyValuePairBean> salesPersonList;
	ArrayList<KeyValuePairBean> currentSupplierList;
	private CurrentSupplierResponse objSupplierResponse;
	private ArrayList<QuoteBean> quoteList;
	private QuoteResponseBean quoteResponseBean;
	private QuoteTermServiceResponseBean quoteTermServiceResponseBean;
	private CommentResponseBean objCommentResponse;
	private QuoteCreateResponseBean objQuoteCreateResponseBean;
	public File logoFile;
	private CustomerAction objCustomerAction = new CustomerAction();

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
		QuoteDao objQuoteDao = new QuoteDao();
		CustomerDao objCustomerDao = new CustomerDao();
		ProductDao objProductDao = new ProductDao();
		AlternateProductDao altProductDao = new AlternateProductDao();

		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		System.out.println("userId : " + userId);
		int supplierId = 0;// salesPersonId = 0;
		int customerId = 0;
		String status = "SAVED";
		httpSession = ServletActionContext.getRequest().getSession();

		try {
			if (userId.equals("null")) {
				System.out.println("session is inactive.");
				System.out.println(userId);
				status = "INI";
			} else {
				System.out.println("session is active.");
				System.out.println(userId);
				status = "SAVED";
			}
			synchronized (httpSession) {
				String quoteDetails = request.getParameter("objQuoteBean");
				System.out.println("Quote Details: " + quoteDetails);
				// System.out.println("Logo file ::: " + logoFile);

				objQuoteCreateResponseBean = new QuoteCreateResponseBean();
				QuoteBean objQuoteBean = new QuoteBean();
				Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
				objQuoteBean = gson.fromJson(quoteDetails, QuoteBean.class);
				System.out.println("New Customer : " + objQuoteBean.getIsNewCustomer().toLowerCase());
				// ----------------
				if (objQuoteBean.getIsNewCustomer().toLowerCase().equals("yes") || objQuoteBean.getIsNewCustomer().toLowerCase() == "yes") {
					CustomerBean objBean = new CustomerBean();
					objBean.setCustomerCode(objQuoteBean.getCustCode());
					objBean.setCustomerName(objQuoteBean.getCustName());
					objBean.setAddress1(objQuoteBean.getAddress());
					objBean.setPhone(objQuoteBean.getPhone());
					objBean.setFax(objQuoteBean.getFaxNo());
					objBean.setEmail(objQuoteBean.getEmail());
					objBean.setAvgPurchase(objQuoteBean.getMonthlyAvgPurchase());

					customerId = objCustomerDao.saveCustomer(objBean);
					System.out.println("isCustomerCreated : " + customerId);
					if (customerId > 0) {
						if (logoFile != null) {
							String filename = "CustId_" + customerId + ".png";
							System.out.println(">>" + filename + ">>" + logoFile);
							boolean isLogoSaved = objCustomerAction.createLogo(filename, logoFile);
							System.out.println("LOGO saved ::: " + isLogoSaved + " " + filename);
						}
					}
					objCustomerDao.commit();
				}

				if (objQuoteBean.getCurrentSupplierId() == 0) {
					System.out.println("SaveCurrentSupplier :>>");
					System.out.println(objQuoteBean.getCurrentSupplierId());
					System.out.println(objQuoteBean.getCurrentSupplierName().isEmpty());
					if (!objQuoteBean.getCurrentSupplierName().isEmpty()) {
						supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
						objQuoteBean.setCurrentSupplierId(supplierId);
					}
				}

				// ----------------
				boolean isProductCreated;
				int newProductCount = 0;

				for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
					if (objQuoteBean.getProductList().get(i).getIsNewProduct() != null
							&& objQuoteBean.getProductList().get(i).getIsNewProduct().equalsIgnoreCase("true")) {
						isProductCreated = false;
						isProductCreated = objProductDao.saveProduct((objQuoteBean.getProductList().get(i)));
						if (isProductCreated)
							newProductCount++;
						System.out.println("new product added ::::::::" + isProductCreated);
						// objDao1.commit();
						String projectPath = request.getSession().getServletContext().getRealPath("/");
						CommonLoadAction.createProductFile(projectPath);
					}
				}

				if (objQuoteBean.isSaveWithAlternative()) {
					System.out.println("ALTERNATIVES");

					String mainId, alternativeId;
					// double altDefaultPrice=0;
					boolean isAlternateSaved = false;
					for (int i = 0; i < objQuoteBean.getAlternativeArray().size(); i++) {
						mainId = objQuoteBean.getAlternativeArray().get(i).getMainProductCode();
						alternativeId = objQuoteBean.getAlternativeArray().get(i).getAltProductObj().getAltProductCode();
						isAlternateSaved = altProductDao.saveAlternateProducts(mainId, alternativeId);
					}
					System.out.println("isAlternateSaved : " + isAlternateSaved);
					altProductDao.commit();
				}

				boolean isQuoteSaved = false;
				boolean istermSaved = false;
				boolean isServiceSaved = false;
				boolean isOfferSaved = false;
				String quoteId = "";
				int quoteDetailId = 0;

				quoteId = objQuoteDao.getGenratedQuoteId();
				objQuoteBean.setQuoteId(quoteId);
				isQuoteSaved = objQuoteDao.saveQuote(objQuoteBean, String.valueOf(objQuoteBean.getUserId()), status);

				System.out.print("quoteId  : " + quoteId);
				if (isQuoteSaved) {
					for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
						objQuoteBean.getProductList().get(i).setQuoteDetailId(0);
						quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i), quoteId);
						if (objQuoteBean.isSaveWithAlternative() && quoteDetailId > 0) {
							if (objQuoteBean.getProductList().get(i).getAltProd() != null) {
								objQuoteBean.getProductList().get(i).getAltProd().setQuoteDetailId(quoteDetailId);
								quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i).getAltProd(), quoteId);
							}
						}
					}
					istermSaved = objQuoteDao.saveTermsAndConditionDetails(objQuoteBean.getTermConditionList(), quoteId);
					isServiceSaved = objQuoteDao.saveServiceDetails(objQuoteBean.getServiceList(), quoteId);
					isOfferSaved = objQuoteDao.saveOfferDetails(objQuoteBean.getOfferList(), quoteId);

					objQuoteDao.updateQuoteId();

					objQuoteDao.commit();

				}
				if (quoteDetailId > 0 && isQuoteSaved) {
					if (status.equalsIgnoreCase("ini")) {
						return "sessionTimeOut";
					} else {
						objQuoteCreateResponseBean.setCode("success");
						objQuoteCreateResponseBean.setMessage(getText("quote_saved"));
					}

					if (newProductCount > 0) {
						objQuoteCreateResponseBean.setNewProductCreated(true);
					}
					if (customerId > 0) {
						objQuoteCreateResponseBean.setNewCustomerCreated(true);
						objQuoteCreateResponseBean.setGenratedCustomerId(customerId);
					}
					if (supplierId > 0) {
						objQuoteCreateResponseBean.setNewSupplierCreated(true);
						objQuoteCreateResponseBean.setGenratedSupplierId(supplierId);
					}
				} else {
					objQuoteCreateResponseBean.setCode("error");
					objQuoteCreateResponseBean.setMessage(getText("common_error"));
				}
			}
		} finally {
			objCustomerDao.closeAll();
			objProductDao.closeAll();
			altProductDao.closeAll();
			objQuoteDao.closeAll();
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
			httpSession = request.getSession(true);
			String userId = String.valueOf(httpSession.getAttribute("userId"));
			String userType = String.valueOf(httpSession.getAttribute("userType"));
			System.out.println("userId : " + userId);
			System.out.println("userType : " + userType);
			quoteResponseBean = new QuoteResponseBean();
			QuoteDao objQuoteDao = new QuoteDao();
			String query = "";
			if (userType.equalsIgnoreCase("admin")) {
				query = "select quote_id,custcode,cust_id,customer_name,add1,phone,cm.email,fax_no,quote_attn,prices_gst_include,notes, "
						+ "cq.user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,"
						+ "compete_quote,cq.sales_person_id,um.user_name as sales_person_name,status " + "from create_quote cq "
						+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
						+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
						+ "left outer join user_master um on cq.sales_person_id = um.user_id " + "order by quote_id desc;";
			} else {
				query = "select quote_id,custcode,cust_id,customer_name,add1,phone,cm.email,fax_no,quote_attn,prices_gst_include,notes, "
						+ "cq.user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,"
						+ "compete_quote,cq.sales_person_id,um.user_name as sales_person_name,status " + "from create_quote cq "
						+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
						+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
						+ "left outer join user_master um on cq.sales_person_id = um.user_id " + " WHERE cq.sales_person_id =" + userId
						+ " order by quote_id desc;";
			}
			quoteList = objQuoteDao.getQuoteList(query, getText("customer_logo_url"));
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
		String quoteId = request.getParameter("quoteId");
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
		QuoteDao objQuoteDao = new QuoteDao();
		CustomerDao objCustomerDao = new CustomerDao();
		ProductDao objProductDao = new ProductDao();
		AlternateProductDao altProductDao = new AlternateProductDao();

		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		System.out.println("userId : " + userId);
		String status = "UPDATED";
		httpSession = ServletActionContext.getRequest().getSession();

		try {

			if (userId.equals("null")) {
				System.out.println("session is inactive.");
				System.out.println(userId);
				status = "INI";
			} else {
				System.out.println("session is active.");
				System.out.println(userId);
				status = "UPDATED";
			}
			String quoteDetails = request.getParameter("objQuoteBean");

			System.out.println("Quote Details: " + quoteDetails);
			// objEmptyResponse = new EmptyResponseBean();
			objQuoteCreateResponseBean = new QuoteCreateResponseBean();
			QuoteBean objQuoteBean = new QuoteBean();
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			objQuoteBean = gson.fromJson(quoteDetails, QuoteBean.class);
			int customerId = 0;
			int supplierId = 0; // salesPersonId = 0;
			System.out.println("Modefied date before format ::" + objQuoteBean.getModifiedDate());
			// objQuoteBean = new Gson().fromJson(quoteDetails,
			// QuoteBean.class);
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

				customerId = objCustomerDao.saveCustomer(objBean);
				System.out.println("isCustomerCreated: " + customerId);
				objCustomerDao.commit();

			}
			System.out.println("CurrentSupplierId" + objQuoteBean.getCurrentSupplierId());
			if (objQuoteBean.getCurrentSupplierId() == 0) {
				System.out.println("SaveCurrentSupplier :>>");
				System.out.println(objQuoteBean.getCurrentSupplierId());
				System.out.println(objQuoteBean.getCurrentSupplierName().isEmpty());
				if (!objQuoteBean.getCurrentSupplierName().isEmpty()) {
					supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
					objQuoteBean.setCurrentSupplierId(supplierId);
				}
				// supplierId =
				// objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
				// objQuoteBean.setCurrentSupplierId(supplierId);
			}
			// if (objQuoteBean.getSalesPersonId() == 0) {
			// salesPersonId =
			// objQuoteDao.saveSalesPerson(objQuoteBean.getSalesPerson());
			// objQuoteBean.setSalesPersonId(salesPersonId);
			// }
			int newProductCount = 0;
			for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
				if (objQuoteBean.getProductList().get(i).getIsNewProduct() != null
						&& objQuoteBean.getProductList().get(i).getIsNewProduct().equalsIgnoreCase("true")) {
					boolean isProductCreated = false;

					isProductCreated = objProductDao.saveProduct((objQuoteBean.getProductList().get(i)));
					if (isProductCreated)
						newProductCount++;
					System.out.println("new product added ::::::::" + isProductCreated);
					objProductDao.commit();

					String projectPath = request.getSession().getServletContext().getRealPath("/");
					CommonLoadAction.createProductFile(projectPath);
				}
			}

			// objQuoteDao.deleteQuote(objQuoteBean.getQuoteId());
			if (objQuoteBean.isSaveWithAlternative()) {
				System.out.println("ALTERNATIVES FROM EDIT QUOTE");

				String mainId, alternativeId;
				// double altDefaultPrice=0;
				boolean isAlternateSaved = false;
				for (int i = 0; i < objQuoteBean.getAlternativeArray().size(); i++) {
					mainId = objQuoteBean.getAlternativeArray().get(i).getMainProductCode();
					alternativeId = objQuoteBean.getAlternativeArray().get(i).getAltProductObj().getAltProductCode();
					isAlternateSaved = altProductDao.saveAlternateProducts(mainId, alternativeId);
				}
				System.out.println("isAlternateSaved : " + isAlternateSaved);
				altProductDao.commit();

			}
			// objQuoteBean.setUserId(Integer.parseInt(userId));

			boolean isQuoteUpdated = objQuoteDao.updateQuote(objQuoteBean, status);
			// boolean isQuoteSaved = false;
			boolean isTermsSaved = false;
			boolean isServiceSaved = false;
			boolean isOfferSaved = false;
			if (isQuoteUpdated) {
				objQuoteDao.deleteQuoteDetails(objQuoteBean.getQuoteId());
				int quoteDetailId = 0;
				for (int i = 0; i < objQuoteBean.getProductList().size(); i++) {
					objQuoteBean.getProductList().get(i).setQuoteDetailId(0);
					quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i), objQuoteBean.getQuoteId());
					System.out.println("Quote Updated Successfully...!");
					if (objQuoteBean.isSaveWithAlternative()) {
						if (objQuoteBean.getProductList().get(i).getAltProd() != null) {
							System.out.println("ALTERNATIVE : ");
							System.out.println(objQuoteBean.getProductList().get(i).getAltProd().toString());
							;
							objQuoteBean.getProductList().get(i).getAltProd().setQuoteDetailId(quoteDetailId);
							quoteDetailId = objQuoteDao.saveQuoteDetails(objQuoteBean.getProductList().get(i).getAltProd(),
									objQuoteBean.getQuoteId());
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

				objQuoteDao.deleteOfferDetails(objQuoteBean.getQuoteId());
				isOfferSaved = objQuoteDao.saveOfferDetails(objQuoteBean.getOfferList(), objQuoteBean.getQuoteId());
				System.out.println("Offer Updated Successfully...!" + isOfferSaved);
				objQuoteDao.commit();

				if (quoteDetailId > 0) {
					if (status.equalsIgnoreCase("ini")) {
						return "sessionTimeOut";
					} else {
						objQuoteCreateResponseBean.setCode("success");
						objQuoteCreateResponseBean.setMessage(getText("quote_updated"));
					}

					if (newProductCount > 0) {
						objQuoteCreateResponseBean.setNewProductCreated(true);
					}
					if (customerId > 0) {
						objQuoteCreateResponseBean.setNewCustomerCreated(true);
						objQuoteCreateResponseBean.setGenratedCustomerId(customerId);
					}
					if (supplierId > 0) {
						objQuoteCreateResponseBean.setNewSupplierCreated(true);
						objQuoteCreateResponseBean.setGenratedSupplierId(supplierId);
					}
				} else {
					objQuoteCreateResponseBean.setCode("error");
					objQuoteCreateResponseBean.setMessage(getText("common_error"));
				}
			}
		} finally {
			objCustomerDao.closeAll();
			objProductDao.closeAll();
			altProductDao.closeAll();
			objQuoteDao.closeAll();
		}
		return SUCCESS;
	}

	public String changeQuoteStatus() {
		System.out.println("changeQuoteStatusToWon");
		objEmptyResponse = new EmptyResponseBean();
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		System.out.println("userId : " + userId);
		String quoteDetails = request.getParameter("objQuoteBean");
		System.out.println("QuoteDetails :: " + quoteDetails);
		QuoteStatusBean objQuoteStatusBean = new QuoteStatusBean();
		objQuoteStatusBean = (new Gson().fromJson(quoteDetails, QuoteStatusBean.class));
		boolean isStatusChanged = false;
		QuoteDao objQuoteDao = new QuoteDao();
		isStatusChanged = objQuoteDao.changeQuoteStatus(objQuoteStatusBean);
		objQuoteDao.commit();
		objQuoteDao.closeAll();
		if (isStatusChanged) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("quote_status_changed"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getTermsAndServiceList() {
		httpSession = request.getSession(true);
		String quoteId = request.getParameter("quoteId");
		QuoteBean quoteBean = new QuoteBean();
		try {
			quoteTermServiceResponseBean = new QuoteTermServiceResponseBean();

			QuoteDao objQuoteDao = new QuoteDao();
			// quoteList = objQuoteDao.getQuoteList();
			quoteBean = objQuoteDao.getTermsServiceList(quoteId, getText("offer_template_url"));
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

	public String generateProposal() {
		objQuoteCreateResponseBean = new QuoteCreateResponseBean();
		objQuoteCreateResponseBean.setCode("error");
		objQuoteCreateResponseBean.setMessage(getText("common_error"));
		httpSession = request.getSession(true);
		int supplierId = 0;
		int customerId = 0;
		QuoteDao objQuoteDao = new QuoteDao();
		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		CustomerDao objCustomerDao = new CustomerDao();
		try {
			synchronized (httpSession) {
				boolean isCustomerExist = false;
				KeyValuePairBean objSupplier;
				String status = "INI";
				QuoteBean objQuoteBean = new QuoteBean();
				Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
				String customerInfo = request.getParameter("customerInfo");
				System.out.println("Customer Details: " + customerInfo);
				System.out.println("Logo file ::: " + logoFile);
				objQuoteBean = gson.fromJson(customerInfo, QuoteBean.class);
				// ----------------
				System.out.println("New Customer : " + objQuoteBean.getIsNewCustomer().toLowerCase());
				if (objQuoteBean.getIsNewCustomer().toLowerCase().equals("yes") || objQuoteBean.getIsNewCustomer().toLowerCase() == "yes") {
					isCustomerExist = objCustomerDao.isCustomerExist(objQuoteBean.getCustCode());
					if (isCustomerExist) {
					} else {
						CustomerBean objBean = new CustomerBean();
						objBean.setCustomerCode(objQuoteBean.getCustCode());
						objBean.setCustomerName(objQuoteBean.getCustName());
						objBean.setAddress1(objQuoteBean.getAddress());
						objBean.setPhone(objQuoteBean.getPhone());
						objBean.setFax(objQuoteBean.getFaxNo());
						objBean.setEmail(objQuoteBean.getEmail());
						objBean.setAvgPurchase(objQuoteBean.getMonthlyAvgPurchase());
						customerId = objCustomerDao.saveCustomer(objBean);
						System.out.println("isCustomerCreated : " + customerId);
						if (customerId > 0) {
							if (logoFile != null) {
								String filename = "CustId_" + customerId + ".png";
								System.out.println(">>" + filename + ">>" + logoFile);
								boolean isLogoSaved = objCustomerAction.createLogo(filename, logoFile);
								System.out.println("LOGO saved ::: " + isLogoSaved + " " + filename);
							}
						}
						objCustomerDao.commit();
					}
				}
				// ----------------
				if (objQuoteBean.getCurrentSupplierId() == 0) {
					System.out.println("SaveCurrentSupplier :>>");
					// System.out.println(objQuoteBean.getCurrentSupplierId());
					// System.out.println(objQuoteBean.getCurrentSupplierName().isEmpty());
					if (!objQuoteBean.getCurrentSupplierName().isEmpty()) {
						objSupplier = objQuoteDao.getSupplierIfExist(objQuoteBean.getCurrentSupplierName());
						System.out.println(objSupplier.toString());
						if (objSupplier.getValue() == null) {
							supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
							objQuoteBean.setCurrentSupplierId(supplierId);
						} else {
							objQuoteCreateResponseBean.setNewSupplierCreated(true);
							objQuoteCreateResponseBean.setGenratedSupplierId(objSupplier.getKey());
						}
					}
				}
				boolean isQuoteSaved = false;
				String quoteId = "";
				quoteId = objQuoteDao.getGenratedQuoteId();
				objQuoteBean.setQuoteId(quoteId);
				isQuoteSaved = objQuoteTempDao.saveQuoteTemp(objQuoteBean, String.valueOf(objQuoteBean.getUserId()), status);
				System.out.print("quoteId  : " + quoteId);
				objQuoteDao.updateQuoteId();
				objQuoteDao.commit();
				objQuoteTempDao.commit();

				if (isCustomerExist) {
					objQuoteCreateResponseBean.setCode("error");
					objQuoteCreateResponseBean.setMessage("Customer with this code is already exist");
				}
				if (isQuoteSaved) {
					objQuoteCreateResponseBean.setCode("success");
					objQuoteCreateResponseBean.setMessage(getText("quote_saved"));
					objQuoteCreateResponseBean.setGenratedProposalId(quoteId);
				}
				if (customerId > 0) {
					objQuoteCreateResponseBean.setNewCustomerCreated(true);
					objQuoteCreateResponseBean.setGenratedCustomerId(customerId);
				}
				if (supplierId > 0) {
					objQuoteCreateResponseBean.setNewSupplierCreated(true);
					objQuoteCreateResponseBean.setGenratedSupplierId(supplierId);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			objCustomerDao.closeAll();
			objQuoteDao.closeAll();
			objQuoteTempDao.closeAll();
		}
		return SUCCESS;
	}

	public String addProductToProposal() {
		System.out.println("addProductToProposal");
		objQuoteAddProductResponse = new QuoteAddProductResponseBean();
		objQuoteAddProductResponse.setCode("error");
		objQuoteAddProductResponse.setMessage(getText("common_error"));
		httpSession = request.getSession(true);
		ProductBean objProductBean = new ProductBean();
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		String productDetails = request.getParameter("objProductBean");
		System.out.println("productDetails: " + productDetails);
		objProductBean = gson.fromJson(productDetails, ProductBean.class);

		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		ProductDao objProductDao = new ProductDao();
		AlternateProductDao altProductDao = new AlternateProductDao();
		try {
			boolean isProductCreated;
			int newProductCount = 0;
			int quoteDetailId = 0;
			if (objProductBean != null) {
				if (objProductBean.getIsNewProduct() != null && objProductBean.getIsNewProduct().equalsIgnoreCase("true")) {
					isProductCreated = false;
					isProductCreated = objProductDao.saveProduct(objProductBean);
					objQuoteAddProductResponse.setNewProductCreated(isProductCreated);
					// objProductDao.commit();
				}
			}
			if (objProductBean.getAltProd() != null) {
				boolean isAlternateSaved = false;
				String mainId, alternativeId;
				mainId = objProductBean.getItemCode();
				alternativeId = objProductBean.getAltProd().getItemCode();
				isAlternateSaved = altProductDao.saveAlternateProducts(mainId, alternativeId);
				System.out.println("isAlternateSaved : " + isAlternateSaved);
				altProductDao.commit();
			}
			if (objProductBean.getQuoteId() != null && objProductBean.getQuoteId() != "") {
				objProductBean.setQuoteDetailId(quoteDetailId);
				quoteDetailId = objQuoteTempDao.saveQuoteDetailsTemp(objProductBean, objProductBean.getQuoteId());
				objQuoteAddProductResponse.setQuoteDetailIdMain(quoteDetailId);
				System.out.println("quoteDetailId>>" + quoteDetailId);
				if (objProductBean.getAltProd() != null) {
					objProductBean.getAltProd().setQuoteDetailId(quoteDetailId);
					quoteDetailId = objQuoteTempDao.saveQuoteDetailsTemp(objProductBean.getAltProd(), objProductBean.getQuoteId());
					objQuoteAddProductResponse.setQuoteDeatilIdAlt(quoteDetailId);
				}
				objQuoteTempDao.commit();
			}
			objQuoteAddProductResponse.setCode("success");
			objQuoteAddProductResponse.setMessage("add products successfully");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			objProductDao.closeAll();
			altProductDao.closeAll();
			objQuoteTempDao.closeAll();
		}
		return SUCCESS;
	}

	public String editProductIntoProposal() {
		System.out.println("editProductIntoProposal");
		objQuoteAddProductResponse = new QuoteAddProductResponseBean();
		objQuoteAddProductResponse.setCode("error");
		objQuoteAddProductResponse.setMessage(getText("common_error"));
		httpSession = request.getSession(true);
		ProductBean objProductBean = new ProductBean();
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		String productDetails = request.getParameter("objProductBean");
		System.out.println("productDetails: " + productDetails);
		objProductBean = gson.fromJson(productDetails, ProductBean.class);
		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		ProductDao objProductDao = new ProductDao();
		AlternateProductDao altProductDao = new AlternateProductDao();
		try {
			boolean isProductCreated;
			int quoteDetailId = 0;
			if (objProductBean != null) {
				if (objProductBean.getIsNewProduct() != null && objProductBean.getIsNewProduct().equalsIgnoreCase("true")) {
					isProductCreated = false;
					isProductCreated = objProductDao.saveProduct(objProductBean);
					objProductDao.commit();
				}
			}
			if (objProductBean.getAltProd() != null) {
				boolean isAlternateSaved = false;
				String mainId, alternativeId;
				mainId = objProductBean.getItemCode();
				alternativeId = objProductBean.getAltProd().getItemCode();
				isAlternateSaved = altProductDao.saveAlternateProducts(mainId, alternativeId);
				System.out.println("isAlternateSaved : " + isAlternateSaved);
				altProductDao.commit();
			}
			if (objProductBean.getQuoteId() != null && objProductBean.getQuoteId() != "") {
				int alternateFor = 0;
				quoteDetailId = objQuoteTempDao.updateQuoteDetailsTemp(objProductBean, objProductBean.getQuoteId(), alternateFor);
				System.out.println("quoteDetailId>>" + quoteDetailId);
				if (objProductBean.getAltProd() != null) {
					alternateFor = objProductBean.getQuoteDetailId();
					quoteDetailId = objQuoteTempDao.updateQuoteDetailsTemp(objProductBean.getAltProd(), objProductBean.getQuoteId(),
							alternateFor);
				}
				objQuoteTempDao.commit();
			}
			objQuoteAddProductResponse.setCode("success");
			objQuoteAddProductResponse.setMessage("update products successfully");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			objProductDao.closeAll();
			altProductDao.closeAll();
			objQuoteTempDao.closeAll();
		}
		return SUCCESS;
	}

	public String deleteProductFromProposal() {
		System.out.println("deleteProductFromProposal");
		objEmptyResponse = new EmptyResponseBean();
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		httpSession = request.getSession(true);
		ProductBean objProductBean = new ProductBean();
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		String productDetails = request.getParameter("objProductBean");
		System.out.println("productDetails: " + productDetails);
		objProductBean = gson.fromJson(productDetails, ProductBean.class);
		System.out.println(objProductBean.toString());
		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		try {
			boolean isDeleted = false;
			if (objProductBean.getQuoteId() != null && objProductBean.getQuoteId() != "") {
				isDeleted = objQuoteTempDao.deleteFromQuoteDetailsTemp(objProductBean.getQuoteId(), objProductBean.getQuoteDetailId());
				System.out.println("isDeleted >> " + isDeleted);
				if (objProductBean.getAltProd() != null) {
					isDeleted = objQuoteTempDao.deleteFromQuoteDetailsTemp(objProductBean.getQuoteId(), objProductBean.getAltProd()
							.getQuoteDetailId());
				}
				objQuoteTempDao.commit();
			}
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage("update products successfully");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			objQuoteTempDao.closeAll();
		}
		return SUCCESS;
	}

	public String saveGeneratedProposal() {
		objQuoteCreateResponseBean = null;
		objQuoteCreateResponseBean = new QuoteCreateResponseBean();
		objQuoteCreateResponseBean.setCode("error");
		objQuoteCreateResponseBean.setMessage(getText("common_error"));
		httpSession = request.getSession(true);
		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		QuoteDao objQuoteDao = new QuoteDao();
		try {
			String status = "SAVED";
			QuoteBean objQuoteBean = new QuoteBean();
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			String quoteDetails = request.getParameter("objQuoteBean");
			System.out.println("Quote Details :: " + quoteDetails);
			objQuoteBean = gson.fromJson(quoteDetails, QuoteBean.class);
			System.out.println(objQuoteBean.toString());
			String query;
			if (objQuoteBean.getNotes() != "" && objQuoteBean.getNotes() != null) {
				query = "update create_quote_temp set notes='" + objQuoteBean.getNotes() + "',status ='" + status + "' "
						+ "where quote_id='" + objQuoteBean.getQuoteId() + "';";
				objQuoteTempDao.addNoteToQuote(query);
			} else {
				query = "update create_quote_temp set status='" + status + "' where quote_id='" + objQuoteBean.getQuoteId() + "';";
				objQuoteTempDao.addNoteToQuote(query);
			}
			boolean isDone;
			isDone = objQuoteTempDao.saveQuoteToMaster(objQuoteBean.getQuoteId());
			if (objQuoteBean.getTermConditionList().size() > 0) {
				objQuoteDao.saveTermsAndConditionDetails(objQuoteBean.getTermConditionList(), objQuoteBean.getQuoteId());
			}
			if (objQuoteBean.getOfferList().size() > 0) {
				objQuoteDao.saveOfferDetails(objQuoteBean.getOfferList(), objQuoteBean.getQuoteId());
			}
			if (isDone) {
				objQuoteTempDao.deleteQuoteFromTemp(objQuoteBean.getQuoteId());
			}
			objQuoteDao.commit();
			objQuoteTempDao.commit();
			System.out.println("isNewProductAdded "+objQuoteBean.getIsNewProductAdded());
			if (objQuoteBean.getIsNewProductAdded().toLowerCase().equals("yes") ||objQuoteBean.getIsNewProductAdded().toLowerCase()=="yes") {
				System.out.println("Creating New File >>>");
				String projectPath = request.getSession().getServletContext().getRealPath("/");
				CommonLoadAction.createProductFile(projectPath);
				objQuoteCreateResponseBean.setNewProductCreated(true);
			}
			objQuoteCreateResponseBean.setCode("success");
			objQuoteCreateResponseBean.setMessage("quote successfull");
//			objQuoteCreateResponseBean.setMessage(getText("quote_saved"));
			System.out.println(objQuoteCreateResponseBean.toString());
			System.out.println("Done...");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			objQuoteTempDao.closeAll();
			objQuoteDao.closeAll();
		}
		return SUCCESS;
	}

	public String getGeneratedQuoteList() {
		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		String userType = String.valueOf(httpSession.getAttribute("userType"));
		quoteResponseBean = new QuoteResponseBean();
		try {
			String query = "";
			if (userType.equalsIgnoreCase("admin")) {
				query = "select quote_id,custcode,cust_id,customer_name,add1,phone,cm.email,fax_no,quote_attn,prices_gst_include,notes, "
						+ "cq.user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,"
						+ "compete_quote,cq.sales_person_id,um.user_name as sales_person_name,status " + "from create_quote_temp cq "
						+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
						+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
						+ "left outer join user_master um on cq.sales_person_id = um.user_id " + "order by quote_id desc;";
			} else {
				query = "select quote_id,custcode,cust_id,customer_name,add1,phone,cm.email,fax_no,quote_attn,prices_gst_include,notes, "
						+ "cq.user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,"
						+ "compete_quote,cq.sales_person_id,um.user_name as sales_person_name,status " + "from create_quote_temp cq "
						+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
						+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
						+ "left outer join user_master um on cq.sales_person_id = um.user_id " + " WHERE cq.sales_person_id =" + userId
						+ " order by quote_id desc;";
			}
			quoteList = objQuoteTempDao.getTempQuoteList(query, getText("customer_logo_url"));
			System.out.println("Quote List : " + quoteList.size());
			quoteResponseBean.setCode("success");
			quoteResponseBean.setMessage("quote_list_loaded");
			quoteResponseBean.setResult(quoteList);
		} catch (Exception e) {
			e.printStackTrace();
			quoteResponseBean.setCode("common_error");
			quoteResponseBean.setMessage("error_quote_list_loaded");
			quoteResponseBean.setResult(quoteList);
		} finally {
			objQuoteTempDao.closeAll();
		}
		return SUCCESS;
	}

	public String getGeneratedQuoteView() {
		QuoteTempDao objQuoteTempDao = new QuoteTempDao();
		httpSession = request.getSession(true);
		String quoteId = request.getParameter(("quoteId"));
		quoteResponseBean = new QuoteResponseBean();
		quoteResponseBean.setCode("error");
		quoteResponseBean.setMessage(getText("common_error"));
		try {
			QuoteBean objBean = objQuoteTempDao.getTempQuoteDetail(quoteId, getText("customer_logo_url"));
			System.out.println(objBean.toString());
			quoteResponseBean.setCode("success");
			quoteResponseBean.setMessage("quote_info_loaded");
			quoteResponseBean.setQuoteInfo(objBean);
		} catch (Exception e) {
			e.printStackTrace();
			quoteResponseBean.setCode("common_error");
			quoteResponseBean.setMessage("error_quote_info_loaded");
			quoteResponseBean.setQuoteInfo(null);
		} finally {
			objQuoteTempDao.closeAll();
		}
		return SUCCESS;
	}

	public QuoteCreateResponseBean getObjQuoteCreateResponseBean() {
		return objQuoteCreateResponseBean;
	}

	public void setObjQuoteCreateResponseBean(QuoteCreateResponseBean objQuoteCreateResponseBean) {
		this.objQuoteCreateResponseBean = objQuoteCreateResponseBean;
	}

	public QuoteAddProductResponseBean getObjQuoteAddProductResponse() {
		return objQuoteAddProductResponse;
	}

	public void setObjQuoteAddProductResponse(QuoteAddProductResponseBean objQuoteAddProductResponse) {
		this.objQuoteAddProductResponse = objQuoteAddProductResponse;
	}

}
