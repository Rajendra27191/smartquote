package pojo;

public class PaymentReminderBean {
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
@Override
public String toString() {
	return "PaymentReminderBean [fileId=" + fileId + ", customerCode=" + customerCode + ", customerName=" + customerName + ", total="
			+ total + ", juneCurrent=" + juneCurrent + ", may30Days=" + may30Days + ", april60Days=" + april60Days + ", march90Days="
			+ march90Days + ", email=" + email + ", sendStatus=" + sendStatus + ", remark=" + remark + "]";
}

}
