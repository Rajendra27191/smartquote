package pojo;

public class PaymentReminderFileBean {
//File Log	
private int fileId;
private String customerCode;
private String customerName;
private double total;
private double juneCurrent;
private double may30Days;
private double april60Days;
private double march90Days;
private String email;
private String sendStatus;
private String remark;
private String date;

public int getFileId() {
	return fileId;
}
public void setFileId(int fileId) {
	this.fileId = fileId;
}
public String getCustomerCode() {
	return customerCode;
}
public void setCustomerCode(String customerCode) {
	this.customerCode = customerCode;
}
public String getCustomerName() {
	return customerName;
}
public void setCustomerName(String customerName) {
	this.customerName = customerName;
}
public double getTotal() {
	return total;
}
public void setTotal(double total) {
	this.total = total;
}
public double getJuneCurrent() {
	return juneCurrent;
}
public void setJuneCurrent(double juneCurrent) {
	this.juneCurrent = juneCurrent;
}
public double getMay30Days() {
	return may30Days;
}
public void setMay30Days(double may30Days) {
	this.may30Days = may30Days;
}
public double getApril60Days() {
	return april60Days;
}
public void setApril60Days(double april60Days) {
	this.april60Days = april60Days;
}
public double getMarch90Days() {
	return march90Days;
}
public void setMarch90Days(double march90Days) {
	this.march90Days = march90Days;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getSendStatus() {
	return sendStatus;
}
public void setSendStatus(String sendStatus) {
	this.sendStatus = sendStatus;
}
public String getRemark() {
	return remark;
}
public void setRemark(String remark) {
	this.remark = remark;
}
public String getDate() {
	return date;
}
public void setDate(String date) {
	this.date = date;
}

//File Load Status
private String fileName;
private int rows;
private String loadDateTime;
private String reminderStatus;
private String startDate;
private String endDate;

public String getFileName() {
	return fileName;
}
public void setFileName(String fileName) {
	this.fileName = fileName;
}
public int getRows() {
	return rows;
}
public void setRows(int rows) {
	this.rows = rows;
}
public String getLoadDateTime() {
	return loadDateTime;
}
public void setLoadDateTime(String loadDateTime) {
	this.loadDateTime = loadDateTime;
}
public String getReminderStatus() {
	return reminderStatus;
}
public void setReminderStatus(String reminderStatus) {
	this.reminderStatus = reminderStatus;
}
public String getStartDate() {
	return startDate;
}
public String getEndDate() {
	return endDate;
}
public void setStartDate(String startDate) {
	this.startDate = startDate;
}
public void setEndDate(String endDate) {
	this.endDate = endDate;
}





}
