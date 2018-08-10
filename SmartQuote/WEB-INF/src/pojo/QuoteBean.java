package pojo;

import java.util.ArrayList;
import java.util.Date;

public class QuoteBean {
	private String quoteId;
	private String custCode;
	private String custName;
	private String address;
	private String email;
	private String faxNo;
	private String phone;
	private String custLogo;


	private String quoteAttn;
	private String isNewCustomer;
	private String monthlyAvgPurchase;
	private String notes;
	private boolean pricesGstInclude;
	private ArrayList<ProductBean> productList;
	private String currentSupplierName;
	private String competeQuote;
	private String salesPerson;
	private int currentSupplierId;
	private int salesPersonId;
	private int userId;

	private Date createdDate;
	private Date modifiedDate;

	private String status;
	private ArrayList<CommentBean> commentList;
	private ArrayList<KeyValuePairBean> termConditionList;
	private ArrayList<KeyValuePairBean> serviceList;
	private ArrayList<OfferBean> offerList;
	private boolean saveWithAlternative;
	private String isNewProductAdded;
	private boolean isSaveAndPrint;
	
	
	private ArrayList<AlternateProductBean> alternativeArray;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getIsNewCustomer() {
		return isNewCustomer;
	}

	public void setIsNewCustomer(String isNewCustomer) {
		this.isNewCustomer = isNewCustomer;
	}

	public String getMonthlyAvgPurchase() {
		return monthlyAvgPurchase;
	}

	public void setMonthlyAvgPurchase(String monthlyAvgPurchase) {
		this.monthlyAvgPurchase = monthlyAvgPurchase;
	}

	public int getSalesPersonId() {
		return salesPersonId;
	}

	public void setSalesPersonId(int salesPersonId) {
		this.salesPersonId = salesPersonId;
	}

	public int getCurrentSupplierId() {
		return currentSupplierId;
	}

	public void setCurrentSupplierId(int currentSupplierId) {
		this.currentSupplierId = currentSupplierId;
	}

	public String getSalesPerson() {
		return salesPerson;
	}

	public void setSalesPerson(String salesPerson) {
		this.salesPerson = salesPerson;
	}

	public String getCurrentSupplierName() {
		return currentSupplierName;
	}

	public void setCurrentSupplierName(String currentSupplierName) {
		this.currentSupplierName = currentSupplierName;
	}

	public String getCompeteQuote() {
		return competeQuote;
	}

	public void setCompeteQuote(String competeQuote) {
		this.competeQuote = competeQuote;
	}

	public boolean getPricesGstInclude() {
		return pricesGstInclude;
	}

	public void setPricesGstInclude(boolean pricesGstInclude) {
		this.pricesGstInclude = pricesGstInclude;
	}

	public String getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(String quoteId) {
		this.quoteId = quoteId;
	}

	public String getCustCode() {
		return custCode;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}

	public String getCustName() {
		return custName;
	}

	public void setCustName(String custName) {
		this.custName = custName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFaxNo() {
		return faxNo;
	}

	public void setFaxNo(String faxNo) {
		this.faxNo = faxNo;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getQuoteAttn() {
		return quoteAttn;
	}

	public void setQuoteAttn(String quoteAttn) {
		this.quoteAttn = quoteAttn;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public ArrayList<ProductBean> getProductList() {
		return productList;
	}

	public void setProductList(ArrayList<ProductBean> productList) {
		this.productList = productList;
	}

	public ArrayList<CommentBean> getCommentList() {
		return commentList;
	}

	public void setCommentList(ArrayList<CommentBean> commentList) {
		this.commentList = commentList;
	}

	public ArrayList<KeyValuePairBean> getTermConditionList() {
		return termConditionList;
	}

	public void setTermConditionList(ArrayList<KeyValuePairBean> termConditionList) {
		this.termConditionList = termConditionList;
	}

	public ArrayList<KeyValuePairBean> getServiceList() {
		return serviceList;
	}

	public void setServiceList(ArrayList<KeyValuePairBean> serviceList) {
		this.serviceList = serviceList;
	}

	public boolean isSaveWithAlternative() {
		return saveWithAlternative;
	}

	public void setSaveWithAlternative(boolean saveWithAlternative) {
		this.saveWithAlternative = saveWithAlternative;
	}

	public ArrayList<AlternateProductBean> getAlternativeArray() {
		return alternativeArray;
	}

	public void setAlternativeArray(ArrayList<AlternateProductBean> alternativeArray) {
		this.alternativeArray = alternativeArray;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getModifiedDate() {
		return modifiedDate;
	}

	public void setModifiedDate(Date modifiedDate) {
		this.modifiedDate = modifiedDate;
	}

	public ArrayList<OfferBean> getOfferList() {
		return offerList;
	}

	public void setOfferList(ArrayList<OfferBean> offerList) {
		this.offerList = offerList;
	}
	
	public String getCustLogo() {
		return custLogo;
	}

	public void setCustLogo(String custLogo) {
		this.custLogo = custLogo;
	}

	public String getIsNewProductAdded() {
		return isNewProductAdded;
	}

	public void setIsNewProductAdded(String isNewProductAdded) {
		this.isNewProductAdded = isNewProductAdded;
	}

	@Override
	public String toString() {
		return "QuoteBean [quoteId=" + quoteId + ", custCode=" + custCode + ", custName=" + custName + ", address=" + address + ", email="
				+ email + ", faxNo=" + faxNo + ", phone=" + phone + ", custLogo=" + custLogo + ", quoteAttn=" + quoteAttn
				+ ", isNewCustomer=" + isNewCustomer + ", monthlyAvgPurchase=" + monthlyAvgPurchase + ", notes=" + notes
				+ ", pricesGstInclude=" + pricesGstInclude + ", productList=" + productList + ", currentSupplierName="
				+ currentSupplierName + ", competeQuote=" + competeQuote + ", salesPerson=" + salesPerson + ", currentSupplierId="
				+ currentSupplierId + ", salesPersonId=" + salesPersonId + ", userId=" + userId + ", createdDate=" + createdDate
				+ ", modifiedDate=" + modifiedDate + ", status=" + status + ", commentList=" + commentList + ", termConditionList="
				+ termConditionList + ", serviceList=" + serviceList + ", offerList=" + offerList + ", saveWithAlternative="
				+ saveWithAlternative + ", isNewProductAdded=" + isNewProductAdded + ", alternativeArray=" + alternativeArray + "]";
	}

	public boolean isSaveAndPrint() {
		return isSaveAndPrint;
	}

	public void setSaveAndPrint(boolean isSaveAndPrint) {
		this.isSaveAndPrint = isSaveAndPrint;
	}



	
	
}
