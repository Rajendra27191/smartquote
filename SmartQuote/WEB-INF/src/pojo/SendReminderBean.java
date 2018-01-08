package pojo;

import java.util.ArrayList;

public class SendReminderBean {
	private ArrayList<PaymentReminderFileBean> customerArrayList= new ArrayList<PaymentReminderFileBean>();
	private EmailFormatBean emailFormat = new EmailFormatBean();
	private String duration;
	
	public ArrayList<PaymentReminderFileBean> getCustomerArrayList() {
		return customerArrayList;
	}
	public void setCustomerArrayList(ArrayList<PaymentReminderFileBean> customerArrayList) {
		this.customerArrayList = customerArrayList;
	}
	public EmailFormatBean getEmailFormat() {
		return emailFormat;
	}
	public void setEmailFormat(EmailFormatBean emailFormat) {
		this.emailFormat = emailFormat;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	

	

}
