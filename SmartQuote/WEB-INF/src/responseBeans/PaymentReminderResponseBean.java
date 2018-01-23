package responseBeans;

import java.util.ArrayList;

import pojo.EmailConfigBean;
import pojo.EmailFormatBean;
import pojo.EmailLogBean;
import pojo.PaymentReminderFileBean;
import responseStructure.Response;

public class PaymentReminderResponseBean extends Response {
private ArrayList<PaymentReminderFileBean> fileLogList = new ArrayList<PaymentReminderFileBean>();
//private EmailFormatBean objEmailFormatBean = new EmailFormatBean();
private ArrayList<EmailFormatBean> emailFormatList= new  ArrayList<EmailFormatBean>();
private ArrayList<EmailLogBean> emailLogList= new  ArrayList<EmailLogBean>();
//
//public EmailFormatBean getObjEmailFormatBean() {
//	return objEmailFormatBean;
//}
//
//public void setObjEmailFormatBean(EmailFormatBean objEmailFormatBean) {
//	this.objEmailFormatBean = objEmailFormatBean;
//}



//public ArrayList<EmailConfigBean> getEmailConfigList() {
//	return emailConfigList;
//}
//
//public void setEmailConfigList(ArrayList<EmailConfigBean> emailConfigList) {
//	this.emailConfigList = emailConfigList;
//}

public ArrayList<EmailLogBean> getEmailLogList() {
	return emailLogList;
}

public ArrayList<EmailFormatBean> getEmailFormatList() {
	return emailFormatList;
}

public void setEmailFormatList(ArrayList<EmailFormatBean> emailFormatList) {
	this.emailFormatList = emailFormatList;
}

public void setEmailLogList(ArrayList<EmailLogBean> emailLogList) {
	this.emailLogList = emailLogList;
}

public ArrayList<PaymentReminderFileBean> getFileLogList() {
	return fileLogList;
}

public void setFileLogList(ArrayList<PaymentReminderFileBean> fileLogList) {
	this.fileLogList = fileLogList;
}


}
