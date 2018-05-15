package pojo;

import java.util.ArrayList;

public class PDFMasterReportBean {
	private int dedicatedAccountManagerId;
	private String dedicatedAccountManager;
	private String dedicatedAccountManagerEmail;
	private String dedicatedAccountManagerContact;
	
	private String Contact;
	private String email;
	private String quoteId;
	private String quoteDate;
	private String proposalFor;
	private String submittedBy;
	private String quoteAttn;
	private int custId;
	private boolean isAlternativeAdded;
	private boolean isGstInclusive;
	private ArrayList<OfferBean> offerList;
	
	private ArrayList<PdfPageBean> proposalPageList1;
	private ArrayList<PdfPageBean> proposalPageList2;
	
	private ArrayList<KeyValuePairBean> termConditionList;
	private CalculationBean objCalculationBean=new CalculationBean();
//	private ArrayList<CalculationBean> listCalculationBean=new ArrayList<CalculationBean>();
	private ArrayList<PDFSubReportBean> arrayPdfSubReportBean = new ArrayList<PDFSubReportBean>();

	public String getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(String quoteId) {
		this.quoteId = quoteId;
	}

	public String getQuoteDate() {
		return quoteDate;
	}

	public void setQuoteDate(String quoteDate) {
		this.quoteDate = quoteDate;
	}

	public String getProposalFor() {
		return proposalFor;
	}

	public void setProposalFor(String proposalFor) {
		this.proposalFor = proposalFor;
	}

	public String getSubmittedBy() {
		return submittedBy;
	}

	public void setSubmittedBy(String submittedBy) {
		this.submittedBy = submittedBy;
	}

	public String getQuoteAttn() {
		return quoteAttn;
	}

	public void setQuoteAttn(String quoteAttn) {
		this.quoteAttn = quoteAttn;
	}

	public ArrayList<PDFSubReportBean> getArrayPdfSubReportBean() {
		return arrayPdfSubReportBean;
	}

	public void setArrayPdfSubReportBean(ArrayList<PDFSubReportBean> arrayPdfSubReportBean) {
		this.arrayPdfSubReportBean = arrayPdfSubReportBean;
	}

	public String getDedicatedAccountManager() {
		return dedicatedAccountManager;
	}

	public void setDedicatedAccountManager(String dedicatedAccountManager) {
		this.dedicatedAccountManager = dedicatedAccountManager;
	}

	public String getContact() {
		return Contact;
	}

	public void setContact(String contact) {
		Contact = contact;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isAlternativeAdded() {
		return isAlternativeAdded;
	}

	public void setAlternativeAdded(boolean isAlternativeAdded) {
		this.isAlternativeAdded = isAlternativeAdded;
	}

	public int getCustId() {
		return custId;
	}

	public void setCustId(int custId) {
		this.custId = custId;
	}

	public CalculationBean getObjCalculationBean() {
		return objCalculationBean;
	}

	public void setObjCalculationBean(CalculationBean objCalculationBean) {
		this.objCalculationBean = objCalculationBean;
	}

	public boolean isGstInclusive() {
		return isGstInclusive;
	}

	public void setGstInclusive(boolean isGstInclusive) {
		this.isGstInclusive = isGstInclusive;
	}

	public ArrayList<OfferBean> getOfferList() {
		return offerList;
	}

	public void setOfferList(ArrayList<OfferBean> offerList) {
		this.offerList = offerList;
	}

	public ArrayList<KeyValuePairBean> getTermConditionList() {
		return termConditionList;
	}

	public void setTermConditionList(ArrayList<KeyValuePairBean> termConditionList) {
		this.termConditionList = termConditionList;
	}

	public String getDedicatedAccountManagerEmail() {
		return dedicatedAccountManagerEmail;
	}

	public void setDedicatedAccountManagerEmail(String dedicatedAccountManagerEmail) {
		this.dedicatedAccountManagerEmail = dedicatedAccountManagerEmail;
	}

	public String getDedicatedAccountManagerContact() {
		return dedicatedAccountManagerContact;
	}

	public void setDedicatedAccountManagerContact(String dedicatedAccountManagerContact) {
		this.dedicatedAccountManagerContact = dedicatedAccountManagerContact;
	}

	public int getDedicatedAccountManagerId() {
		return dedicatedAccountManagerId;
	}

	public void setDedicatedAccountManagerId(int dedicatedAccountManagerId) {
		this.dedicatedAccountManagerId = dedicatedAccountManagerId;
	}

	@Override
	public String toString() {
		return "PDFMasterReportBean [dedicatedAccountManagerId=" + dedicatedAccountManagerId + ", dedicatedAccountManager="
				+ dedicatedAccountManager + ", dedicatedAccountManagerEmail=" + dedicatedAccountManagerEmail
				+ ", dedicatedAccountManagerContact=" + dedicatedAccountManagerContact + ", Contact=" + Contact + ", email=" + email
				+ ", quoteId=" + quoteId + ", quoteDate=" + quoteDate + ", proposalFor=" + proposalFor + ", submittedBy=" + submittedBy
				+ ", quoteAttn=" + quoteAttn + ", custId=" + custId + ", isAlternativeAdded=" + isAlternativeAdded + ", isGstInclusive="
				+ isGstInclusive + ", offerList=" + offerList + ", termConditionList=" + termConditionList + ", objCalculationBean="
				+ objCalculationBean + ", arrayPdfSubReportBean=" + arrayPdfSubReportBean + "]";
	}

	public ArrayList<PdfPageBean> getProposalPageList1() {
		return proposalPageList1;
	}

	public void setProposalPageList1(ArrayList<PdfPageBean> proposalPageList1) {
		this.proposalPageList1 = proposalPageList1;
	}

	public ArrayList<PdfPageBean> getProposalPageList2() {
		return proposalPageList2;
	}

	public void setProposalPageList2(ArrayList<PdfPageBean> proposalPageList2) {
		this.proposalPageList2 = proposalPageList2;
	}



	

//	public ArrayList<CalculationBean> getListCalculationBean() {
//		return listCalculationBean;
//	}
//
//	public void setListCalculationBean(ArrayList<CalculationBean> listCalculationBean) {
//		this.listCalculationBean = listCalculationBean;
//	}


}
