package pojo;

import java.sql.Date;
import java.util.ArrayList;


public class PDFMasterReportBean {
	private String dedicatedAccountManager;
	private String Contact;
	private String email;
	private int quoteId;
	private String quoteDate;
	private String proposalFor;
	private String submittedBy;
	private String quoteAttn;
	private int custId;
	private boolean isAlternativeAdded;
	private boolean isGstInclusive;
//--
//	private double currentTotal;
//	private double jaybelTotal;
//	private double saving;
//	private double annualSaving;
//	private double savingInPercentage;
	
	private CalculationBean objCalculationBean=new CalculationBean();
	private ArrayList<CalculationBean> listCalculationBean=new ArrayList<CalculationBean>();
	//--
//	private double altCurrentTotal;
//	private double altJaybelTotal;
//	private double altSaving;
//	private double altAnnualSaving;
//	private double altSavingInPercentage;
	//--
	private ArrayList<PDFSubReportBean> arrayPdfSubReportBean = new ArrayList<PDFSubReportBean>();
	
	
	
	
	public int getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(int quoteId) {
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

//	public double getAltCurrentTotal() {
//		return altCurrentTotal;
//	}
//
//	public void setAltCurrentTotal(double altCurrentTotal) {
//		this.altCurrentTotal = altCurrentTotal;
//	}
//
//	public double getAltJaybelTotal() {
//		return altJaybelTotal;
//	}
//
//	public void setAltJaybelTotal(double altJaybelTotal) {
//		this.altJaybelTotal = altJaybelTotal;
//	}
//
//	public double getAltSaving() {
//		return altSaving;
//	}
//
//	public void setAltSaving(double altSaving) {
//		this.altSaving = altSaving;
//	}
//
//	public double getAltAnnualSaving() {
//		return altAnnualSaving;
//	}
//
//	public void setAltAnnualSaving(double altAnnualSaving) {
//		this.altAnnualSaving = altAnnualSaving;
//	}
//
//	public double getAltSavingInPercentage() {
//		return altSavingInPercentage;
//	}
//
//	public void setAltSavingInPercentage(double altSavingInPercentage) {
//		this.altSavingInPercentage = altSavingInPercentage;
//	}

	
	

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

//	public double getCurrentTotal() {
//		return currentTotal;
//	}
//
//	public void setCurrentTotal(double currentTotal) {
//		this.currentTotal = currentTotal;
//	}
//
//	public double getJaybelTotal() {
//		return jaybelTotal;
//	}
//
//	public void setJaybelTotal(double jaybelTotal) {
//		this.jaybelTotal = jaybelTotal;
//	}

//	public double getSaving() {
//		return saving;
//	}
//
//	public void setSaving(double saving) {
//		this.saving = saving;
//	}
//
//	public double getAnnualSaving() {
//		return annualSaving;
//	}
//
//	public void setAnnualSaving(double annualSaving) {
//		this.annualSaving = annualSaving;
//	}
//
//	public double getSavingInPercentage() {
//		return savingInPercentage;
//	}
//
//	public void setSavingInPercentage(double savingInPercentage) {
//		this.savingInPercentage = savingInPercentage;
//	}

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

	public ArrayList<CalculationBean> getListCalculationBean() {
		return listCalculationBean;
	}

	public void setListCalculationBean(ArrayList<CalculationBean> listCalculationBean) {
		this.listCalculationBean = listCalculationBean;
	}

	
	

	

}