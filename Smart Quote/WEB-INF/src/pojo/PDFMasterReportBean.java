package pojo;

import java.util.ArrayList;

public class PDFMasterReportBean {
	private String dedicatedAccountManager;
	private String Contact;
	private String email;
	private double currentTotal;
	private double jaybelTotal;
	private double saving;
	private double annualSaving;
	private double savingInPercentage;
	private ArrayList<PDFSubReportBean> arrayPdfSubReportBean = new ArrayList<PDFSubReportBean>();
	

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

	public double getCurrentTotal() {
		return currentTotal;
	}

	public void setCurrentTotal(double currentTotal) {
		this.currentTotal = currentTotal;
	}

	public double getJaybelTotal() {
		return jaybelTotal;
	}

	public void setJaybelTotal(double jaybelTotal) {
		this.jaybelTotal = jaybelTotal;
	}

	public double getSaving() {
		return saving;
	}

	public void setSaving(double saving) {
		this.saving = saving;
	}

	public double getAnnualSaving() {
		return annualSaving;
	}

	public void setAnnualSaving(double annualSaving) {
		this.annualSaving = annualSaving;
	}

	public double getSavingInPercentage() {
		return savingInPercentage;
	}

	public void setSavingInPercentage(double savingInPercentage) {
		this.savingInPercentage = savingInPercentage;
	}

	@Override
	public String toString() {
		return "PDFMasterReportBean [dedicatedAccountManager=" + dedicatedAccountManager + ", Contact=" + Contact + ", email=" + email
				+ ", currentTotal=" + currentTotal + ", jaybelTotal=" + jaybelTotal + ", saving=" + saving + ", annualSaving="
				+ annualSaving + ", savingInPercentage=" + savingInPercentage + ", arrayPdfSubReportBean=" + arrayPdfSubReportBean + "]";
	}

}