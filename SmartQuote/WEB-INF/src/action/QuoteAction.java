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
import pojo.QuoteBean;
import pojo.QuoteStatusBean;
import responseBeans.CommentResponseBean;
import responseBeans.CurrentSupplierResponse;
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
		CustomerDao objCustomerDao = new CustomerDao();
		try {
			synchronized (httpSession) {
				boolean isCustomerExist =false;
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
					System.out.println(objQuoteBean.getCurrentSupplierId());
					System.out.println(objQuoteBean.getCurrentSupplierName().isEmpty());
					if (!objQuoteBean.getCurrentSupplierName().isEmpty()) {
						objSupplier = objQuoteDao.getSupplierIfExist(objQuoteBean.getCurrentSupplierName());
						if(objSupplier.getValue().equals(null)){
							supplierId = objQuoteDao.saveCurrentSupplier(objQuoteBean.getCurrentSupplierName());
							objQuoteBean.setCurrentSupplierId(supplierId);	
						}else{
							objQuoteCreateResponseBean.setNewSupplierCreated(true);
							objQuoteCreateResponseBean.setGenratedSupplierId(objSupplier.getKey());
						}					
					}
				}
				boolean isQuoteSaved = false;
				String quoteId = "";
				quoteId = objQuoteDao.getGenratedQuoteId();
				objQuoteBean.setQuoteId(quoteId);
				isQuoteSaved = objQuoteDao.saveQuote(objQuoteBean, String.valueOf(objQuoteBean.getUserId()), status);
				System.out.print("quoteId  : " + quoteId);
				objQuoteDao.updateQuoteId();
				objQuoteDao.commit();
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
		}
		return SUCCESS;
	}

	public QuoteCreateResponseBean getObjQuoteCreateResponseBean() {
		return objQuoteCreateResponseBean;
	}

	public void setObjQuoteCreateResponseBean(QuoteCreateResponseBean objQuoteCreateResponseBean) {
		this.objQuoteCreateResponseBean = objQuoteCreateResponseBean;
	}
}
