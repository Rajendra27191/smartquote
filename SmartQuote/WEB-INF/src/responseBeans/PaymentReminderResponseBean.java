package responseBeans;

import java.util.ArrayList;

import pojo.EmailConfigBean;
import pojo.EmailFormatBean;
import pojo.PaymentReminderFileBean;
import responseStructure.Response;

public class PaymentReminderResponseBean extends Response {
private ArrayList<PaymentReminderFileBean> fileList = new ArrayList<PaymentReminderFileBean>();
private EmailFormatBean objEmailFormatBean = new EmailFormatBean();
private ArrayList<EmailConfigBean> emailConfigList= new  ArrayList<EmailConfigBean>();

public EmailFormatBean getObjEmailFormatBean() {
	return objEmailFormatBean;
}

public void setObjEmailFormatBean(EmailFormatBean objEmailFormatBean) {
	this.objEmailFormatBean = objEmailFormatBean;
}

public ArrayList<PaymentReminderFileBean> getFileList() {
	return fileList;
}

public void setFileList(ArrayList<PaymentReminderFileBean> fileList) {
	this.fileList = fileList;
}

public ArrayList<EmailConfigBean> getEmailConfigList() {
	return emailConfigList;
}

public void setEmailConfigList(ArrayList<EmailConfigBean> emailConfigList) {
	this.emailConfigList = emailConfigList;
}


}
