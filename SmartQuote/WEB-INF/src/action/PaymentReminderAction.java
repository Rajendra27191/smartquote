package action;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import pojo.EmailConfigBean;
import pojo.EmailFormatBean;
import pojo.EmailLogBean;
import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.PaymentReminderFileBean;
import pojo.SendReminderBean;
import responseBeans.KeyValuePairResponseBean;
import responseBeans.PaymentReminderResponseBean;
import test.GlsFileReader;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;
import dao.PaymentReminderDao;

@SuppressWarnings("serial")
public class PaymentReminderAction extends ActionSupport implements ServletRequestAware {
	private EmptyResponseBean objEmptyResponseBean = new EmptyResponseBean();
	ArrayList<KeyValuePairBean> objFileList;
	private KeyValuePairResponseBean objResponseBean;
	private HttpServletRequest request;
	public File reminderFile;
	public String fileName;
	PaymentReminderResponseBean objPaymentReminderResponse;// = new
	ArrayList<PaymentReminderFileBean> listFileBeans;

	public EmptyResponseBean getObjEmptyResponseBean() {
		return objEmptyResponseBean;
	}

	public ArrayList<PaymentReminderFileBean> getListFileBeans() {
		return listFileBeans;
	}

	public void setListFileBeans(ArrayList<PaymentReminderFileBean> listFileBeans) {
		this.listFileBeans = listFileBeans;
	}

	public void setObjEmptyResponseBean(EmptyResponseBean objEmptyResponseBean) {
		this.objEmptyResponseBean = objEmptyResponseBean;
	}

	public ArrayList<KeyValuePairBean> getObjFileList() {
		return objFileList;
	}

	public void setObjFileList(ArrayList<KeyValuePairBean> objFileList) {
		this.objFileList = objFileList;
	}

	public KeyValuePairResponseBean getObjResponseBean() {
		return objResponseBean;
	}

	public void setObjResponseBean(KeyValuePairResponseBean objResponseBean) {
		this.objResponseBean = objResponseBean;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public File getReminderFile() {
		return reminderFile;
	}

	public void setReminderFile(File reminderFile) {
		this.reminderFile = reminderFile;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String loadPaymentReminderFile() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		System.out.println("loadPaymentReminderFile");
		GlsFileReader objFileReader = new test.FileReader();
		System.out.println("Reminder File : " + reminderFile);
		System.out.println("File Name : " + fileName);
		ArrayList<PaymentReminderFileBean> listReminderBeans = new ArrayList<PaymentReminderFileBean>();
		try {
			JSONArray fileString = objFileReader.readFile(reminderFile + "");
			System.out.println("File String :: " + fileString);
			listReminderBeans = new Gson().fromJson(fileString.toString(), new TypeToken<List<PaymentReminderFileBean>>() {
			}.getType());
			// System.out.println(listReminderBeans);
			JSONObject jsonObject = fileString.getJSONObject(0);
			if (jsonObject.has("customerCode") && jsonObject.has("customerName")) {
				// System.out.println("1..");
				PaymentReminderDao objDao = new PaymentReminderDao();
				boolean isFilePresent = objDao.checkIfFileExist(fileName);
				if (isFilePresent) {
					objEmptyResponseBean.setCode("error");
					objEmptyResponseBean.setMessage(getText("File " + fileName + " Exist "));
				} else {
					boolean isFileUploaded = objDao.uploadReminderFile(listReminderBeans, fileName);
					objDao.commit();
					if (isFileUploaded) {
						objEmptyResponseBean.setCode("success");
						objEmptyResponseBean.setMessage(getText("file_load_success"));
					}
				}
				objDao.closeAll();

			} else {
				System.out.println("2..");
				objEmptyResponseBean.setCode("error");
				objEmptyResponseBean.setMessage(getText("file_column_invalid"));
			}

		} catch (FileNotFoundException e) {
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("product_file_not_found"));
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("error_file_format"));
			e.printStackTrace();
		} catch (JSONException e) {
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("error_file_parse"));
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getLoadedFileList() {
		objResponseBean = new KeyValuePairResponseBean();
		objResponseBean.setCode("error");
		objResponseBean.setMessage(getText("common_error"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			objFileList = new ArrayList<KeyValuePairBean>();
			objFileList = objDao.getFileList();
			objDao.closeAll();
			objResponseBean.setCode("success");
			objResponseBean.setMessage("file_list_success");
			objResponseBean.setResult(objFileList);
		} catch (Exception e) {
			e.printStackTrace();
			objResponseBean.setCode("error");
			objResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String unloadPaymentReminderFile() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		// System.out.println("unloadPaymentReminderFile");
		String fileName = request.getParameter("fileName");
		int fileId = Integer.parseInt(request.getParameter("fileId"));
		// System.out.println("File Name : " + fileName);
		// System.out.println("File Id : " + fileId);
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			boolean isUnload = objDao.unloadReminderFile(fileId, fileName);
			objDao.commit();
			objDao.closeAll();
			if (isUnload) {
				objEmptyResponseBean.setCode("success");
				objEmptyResponseBean.setMessage(getText("file_unload_success"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getLoadedFileDetailList() {
		objPaymentReminderResponse = new PaymentReminderResponseBean();
		objPaymentReminderResponse.setCode("error");
		objPaymentReminderResponse.setMessage(getText("common_error"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			ArrayList<PaymentReminderFileBean> objList = new ArrayList<PaymentReminderFileBean>();
			objList = objDao.getFileDetailList();
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage("file_list_success");
			objPaymentReminderResponse.setFileLogList(objList);
		} catch (Exception e) {
			e.printStackTrace();
			objPaymentReminderResponse.setCode("error");
			objPaymentReminderResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getCustomerDetailFromFile() {
		objPaymentReminderResponse = new PaymentReminderResponseBean();
		objPaymentReminderResponse.setCode("error");
		objPaymentReminderResponse.setMessage(getText("common_error"));
		int fileId = Integer.parseInt(request.getParameter("fileId"));
		String fileName = request.getParameter("fileName");
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			ArrayList<PaymentReminderFileBean> objList = new ArrayList<PaymentReminderFileBean>();
			objList = objDao.getCustomerDetailList(fileId, fileName);
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage("file_list_success");
			objPaymentReminderResponse.setFileLogList(objList);
		} catch (Exception e) {
			e.printStackTrace();
			objPaymentReminderResponse.setCode("error");
			objPaymentReminderResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getEmailFormat() {
		objPaymentReminderResponse = new PaymentReminderResponseBean();
		objPaymentReminderResponse.setCode("error");
		objPaymentReminderResponse.setMessage(getText("common_error"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			EmailFormatBean objBean = new EmailFormatBean();
			objBean = objDao.getEmailFormatData();
			ArrayList<EmailConfigBean> emailConfigList = new ArrayList<EmailConfigBean>();
			emailConfigList = objDao.getEmailConfigList();
			System.out.println("emailConfigList >>" + emailConfigList);
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage("file_list_success");
			objPaymentReminderResponse.setObjEmailFormatBean(objBean);
			objPaymentReminderResponse.setEmailConfigList(emailConfigList);

		} catch (Exception e) {
			e.printStackTrace();
			objPaymentReminderResponse.setCode("error");
			objPaymentReminderResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String updateCustomerEmailId() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		// System.out.println("updateCustomerEmailId");
		String custCode = request.getParameter("custCode");
		int fileId = Integer.parseInt(request.getParameter("fileId"));
		String email = request.getParameter("email");
		// System.out.println(">> "+custCode+"\n"+fileId+"\n"+email);
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			boolean isUnload = objDao.updateFileLogEmailId(custCode, fileId, email);
			objDao.commit();
			objDao.closeAll();
			if (isUnload) {
				objEmptyResponseBean.setCode("success");
				objEmptyResponseBean.setMessage(getText("email_change"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String sendReminder() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		String sendReminderDetail = request.getParameter("sendReminderDetail");
		System.out.println("DETAIL ::" + sendReminderDetail);
		SendReminderBean objSendReminderBean = new SendReminderBean();
		objSendReminderBean = new Gson().fromJson(sendReminderDetail, SendReminderBean.class);
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			objDao.addCustomersIntoEmailRecord(objSendReminderBean);
			objDao.commit();
			objDao.closeAll();
			objEmptyResponseBean.setCode("success");
			objEmptyResponseBean.setMessage(getText("send_reminder_success"));
		} catch (Exception e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getEmailLogList() {
		objPaymentReminderResponse = new PaymentReminderResponseBean();
		objPaymentReminderResponse.setCode("error");
		objPaymentReminderResponse.setMessage(getText("common_error"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			ArrayList<EmailLogBean> emailLogBeans = new ArrayList<EmailLogBean>();
			emailLogBeans = objDao.getEmailLogArrayList();
			// objDao.commit();
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage(getText("email_log_success"));
			objPaymentReminderResponse.setEmailLogList(emailLogBeans);
		} catch (Exception e) {
			e.printStackTrace();
			objPaymentReminderResponse.setCode("error");
			objPaymentReminderResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getEmailLogDetail() {
		objPaymentReminderResponse = new PaymentReminderResponseBean();
		objPaymentReminderResponse.setCode("error");
		objPaymentReminderResponse.setMessage(getText("common_error"));
		int batchId = Integer.parseInt(request.getParameter("batchId"));
		String status = request.getParameter("status");
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			ArrayList<PaymentReminderFileBean> customerList = new ArrayList<PaymentReminderFileBean>();
			customerList = objDao.getEmailLogCustomers(batchId, status);
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage(getText("email_log_detail_success"));
			objPaymentReminderResponse.setFileLogList(customerList);
		} catch (Exception e) {
			e.printStackTrace();
			objPaymentReminderResponse.setCode("error");
			objPaymentReminderResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String resendReminder() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		int batchId = Integer.parseInt(request.getParameter("batchId"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			boolean isUpdated = objDao.updateCustomerStatusOfEmailRecord(batchId);
			objDao.commit();
			objDao.closeAll();
			if (isUpdated) {
				objEmptyResponseBean.setCode("success");
				objEmptyResponseBean.setMessage(getText("send_reminder_success"));
			}

		} catch (Exception e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String getPendingEmailList() {
		objPaymentReminderResponse = new PaymentReminderResponseBean();
		objPaymentReminderResponse.setCode("error");
		objPaymentReminderResponse.setMessage(getText("common_error"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			ArrayList<PaymentReminderFileBean> objArrayList = new ArrayList<PaymentReminderFileBean>();
			objArrayList = objDao.getPendingEmails();
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage(getText("email_log_detail_success"));
			objPaymentReminderResponse.setFileLogList(objArrayList);
		} catch (Exception e) {
			e.printStackTrace();
			objPaymentReminderResponse.setCode("error");
			objPaymentReminderResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String abortEmail() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		String abortEmailList = request.getParameter("sendReminderDetail");
		System.out.println("DETAIL ::" + abortEmailList);
		SendReminderBean objSendReminderBean = new SendReminderBean();
		objSendReminderBean = new Gson().fromJson(abortEmailList, SendReminderBean.class);
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			objDao.abortEmailRecord(objSendReminderBean);
			objDao.commit();
			objDao.closeAll();
			objEmptyResponseBean.setCode("success");
			objEmptyResponseBean.setMessage(getText("email_abort_success"));
		} catch (Exception e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String saveEmailLogAsExcel() {
		listFileBeans = new ArrayList<PaymentReminderFileBean>();
		int batchId = Integer.parseInt(request.getParameter("batchId"));
		String status = request.getParameter("status");
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			listFileBeans = objDao.getEmailLogCustomers(batchId, status);
			objDao.closeAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public PaymentReminderResponseBean getObjPaymentReminderResponse() {
		return objPaymentReminderResponse;
	}

	public void setObjPaymentReminderResponse(PaymentReminderResponseBean objPaymentReminderResponse) {
		this.objPaymentReminderResponse = objPaymentReminderResponse;
	}

}
