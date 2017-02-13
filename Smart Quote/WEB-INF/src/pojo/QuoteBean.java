package pojo;

import java.util.ArrayList;

public class QuoteBean {
	private int quoteId;
	private String custCode;
	private String custName;
	private String address;
	private String email;
	private String faxNo;
	private String phone;
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
	public int getQuoteId() {
		return quoteId;
	}
	public void setQuoteId(int quoteId) {
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

}
