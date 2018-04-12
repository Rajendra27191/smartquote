package action;

import pojo.Report.Detail;
import pojo.Report.PageHeader;
import pojo.Report.Detail.CustomerWrapper;

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
import pojo.Report;
import pojo.Report.Detail.CustomerWrapper.CustomerHeader;
import pojo.Report.Detail.CustomerWrapper.CustomerHeader.CustomerDetails;
import pojo.Report.Detail.CustomerWrapper.CustomerHeader.CustomerWithTrans;
import pojo.Report.Detail.CustomerWrapper.CustomerTotal;
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
		String duration = request.getParameter("duration");
		String query = "";
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			ArrayList<PaymentReminderFileBean> objList = new ArrayList<PaymentReminderFileBean>();
			if (duration.equalsIgnoreCase("all")) {
				query ="SELECT a.file_id,b.file_name, a.customer_code,a.customer_name,"
						+ "a.total_amount,a.current_amount,a.30_amount,a.60_amount,a.90_amount,"
						+ "ifnull(a.changed_email,a.email) 'email',a.send_status,a.remark "
						+ "FROM file_log a join  file_load_status b "
						+ "on a.file_id="+fileId+" AND b.file_name='"+fileName+"' "
						+ "AND (a.total_amount > 0 OR a.current_amount > 0 OR 30_amount > 0 OR a.60_amount > 0 OR a.90_amount > 0) "
						+ "order by a.customer_name";

			}else if(duration.equalsIgnoreCase("30")){
				query ="SELECT a.file_id,b.file_name, a.customer_code,a.customer_name,"
						+ "a.30_amount,a.60_amount,a.90_amount,"
						+ "ifnull(a.changed_email,a.email) 'email',a.send_status,a.remark "
						+ "FROM file_log a join  file_load_status b "
						+ "on a.file_id="+fileId+" AND b.file_name='"+fileName+"' "
						+ "AND (30_amount > 0 OR a.60_amount > 0 OR a.90_amount > 0) "
						+ "order by a.customer_name";
			}else if(duration.equalsIgnoreCase("60")){
				query ="SELECT a.file_id,b.file_name, a.customer_code,a.customer_name,"
						+ "a.60_amount,a.90_amount,"
						+ "ifnull(a.changed_email,a.email) 'email',a.send_status,a.remark "
						+ "FROM file_log a join  file_load_status b "
						+ "on a.file_id="+fileId+" AND b.file_name='"+fileName+"' "
						+ "AND (a.60_amount > 0 OR a.90_amount > 0) "
						+ "order by a.customer_name";
			}else if(duration.equalsIgnoreCase("90")){
				query ="SELECT a.file_id,b.file_name, a.customer_code,a.customer_name,"
						+ "a.90_amount,"
						+ "ifnull(a.changed_email,a.email) 'email',a.send_status,a.remark "
						+ "FROM file_log a join  file_load_status b "
						+ "on a.file_id="+fileId+" AND b.file_name='"+fileName+"' "
						+ "AND (a.90_amount > 0) "
						+ "order by a.customer_name";
			}
			
			objList = objDao.getCustomerDetailList(duration,query);
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
			// EmailFormatBean objBean = new EmailFormatBean();
			// objBean = objDao.getEmailFormatData();
			ArrayList<EmailFormatBean> emailFormatList = new ArrayList<EmailFormatBean>();
			emailFormatList = objDao.getEmailFormatData();
			System.out.println("emailConfigList >>" + emailFormatList);
			objDao.closeAll();
			objPaymentReminderResponse.setCode("success");
			objPaymentReminderResponse.setMessage("file_list_success");
			// objPaymentReminderResponse.setObjEmailFormatBean(objBean);
			objPaymentReminderResponse.setEmailFormatList(emailFormatList);

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
			boolean isEmailDataUpdated = false, isCustomer = false;
			String customerCodeString = "";
			// for (int i = 0; i <
			// objSendReminderBean.getCustomerArrayList().size() &&
			// objSendReminderBean.getCustomerArrayList() != null; i++) {
			// if (i == 0) {
			// customerCodeString = "'" +
			// objSendReminderBean.getCustomerArrayList().get(i).getCustomerCode().trim()
			// + "'";
			// } else {
			// customerCodeString = customerCodeString + ", '" +
			// objSendReminderBean.getCustomerArrayList().get(i).getCustomerCode().trim()
			// + "'";
			// }
			// }
			// System.out.println("Cust List: "+customerCodeString);
			// isEmailDataUpdated =
			// objDao.updateEmailData(objSendReminderBean.getEmailFormat().getBody());
			// if (isEmailDataUpdated) {
			// isCustomer =
			// objDao.addCustomersIntoEmailRecord(objSendReminderBean);
			// }
			isCustomer = objDao.addCustomersIntoEmailRecord(objSendReminderBean);
			if (isCustomer) {
				objDao.commit();
				objEmptyResponseBean.setCode("success");
				objEmptyResponseBean.setMessage(getText("send_reminder_success"));
			}
			objDao.closeAll();
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

	public String loadPaymentReminderEmailFile() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		System.out.println("loadPaymentReminderEmailFile");
		ExcelFileSplit objFileReader = new ExcelFileSplit();
		System.out.println("Reminder Email  File : " + reminderFile);
		System.out.println("File Name : " + fileName);
		ArrayList<PaymentReminderFileBean> listReminderBeans = new ArrayList<PaymentReminderFileBean>();
		try {
			JSONArray fileString = objFileReader.readFile(reminderFile + "");
//			System.out.println("File String :: " + fileString);
			listReminderBeans = new Gson().fromJson(fileString.toString(), new TypeToken<List<PaymentReminderFileBean>>() {
			}.getType());
//			System.out.println(listReminderBeans);
			JSONObject jsonObject = fileString.getJSONObject(0);
			if (jsonObject.has("customerCode") && jsonObject.has("customerName") && jsonObject.has("email")) {
				PaymentReminderDao objDao = new PaymentReminderDao();
				boolean isFileUploaded = objDao.uploadReminderFileEmail(listReminderBeans);
				objDao.commit();
				String query1 = "", query2 = "";
				if (isFileUploaded) {
					query1 = "update file_log a, file_log_emails b set a.email = b.email " + "where a.customer_code = b.customer_code;";
					query2 = "update customer_master a, file_log_emails b set a.email = b.email "
							+ "where a.customer_code = b.customer_code;";
					objDao.executeQuery(query1);
					objDao.executeQuery(query2);

					objEmptyResponseBean.setCode("success");
					objEmptyResponseBean.setMessage(getText("file_load_success"));
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
		}finally{
			System.out.println("Done...");
		}
		System.out.println("Done...");
		return SUCCESS;
	}

	public String loadPaymentReminderFileByXml() {
		System.out.println("loadPaymentReminderFileByXml");
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		boolean isUploaded = false, isFilePresent = false;
		XMLReader objFileReader = new XMLReader();
		PaymentReminderDao objDao = null;
		Report objReport; // = new Report();
		String queryStr = "", query1 = "", query2 = "", query3 = "";
		try {
			objReport = objFileReader.convertXMLFileToReport(reminderFile + "");
			System.out.println("1..."+objReport.getSkipOneOrReportInfoOrPageHeader().size());
			if (objReport != null) {
//				Report objValidReport = objFileReader.validateCustomerDetails(objReport);
				List<Report.Detail> listDetails = objFileReader.getDetailList(objReport);
				System.out.println("2..." +listDetails.size());
				listDetails = objFileReader.getCheckedDetailList(listDetails);
				System.out.println("3..." +listDetails.size());
				objDao = new PaymentReminderDao();
				isFilePresent = objDao.checkIfFileExist(fileName);
				if (isFilePresent) {
					objEmptyResponseBean.setCode("error");
					objEmptyResponseBean.setMessage(getText("File " + fileName + " Exist "));
				} else {
					String className = "", startDate = "", endDate = "";

					boolean isFileLogAdded = false, isFileTransactionAdded = false, isFileLoadStatusAdded = false;
					int fileId = objDao.getFileIdFromFileLoadStatus(), rowCount = 0;

//					List<Object> pageList = objReport.getSkipOneOrReportInfoOrPageHeader();
					for (int pageCount = 0; pageCount < listDetails.size(); pageCount++) {
						className = listDetails.get(pageCount).getClass().getSimpleName();
						System.out.println(className);
						if (className.equals("Detail")) {
							Detail objDetail = (Detail) listDetails.get(pageCount);
							if (objDetail.getCustomerWrapper().size() > 0) {
								for (int j = 0; j < objDetail.getCustomerWrapper().size(); j++) {
									CustomerWrapper objCustomerWrapper = objDetail.getCustomerWrapper().get(j);
									if (objCustomerWrapper.getCustomerHeader().size() > 0
											&& objCustomerWrapper.getCustomerTotal().size() > 0) {
										// Add to file_log
//										System.out.println(objCustomerWrapper.getCustomerHeader().toString());
//										System.out.println(objCustomerWrapper.getCustomerTotal().toString());
										if (objCustomerWrapper.getCustomerTotal().get(0).getCustomerTransTotal().size() > 0
												&& objCustomerWrapper.getCustomerHeader().get(0).getCustomerWithTrans().size() > 0
												&& objCustomerWrapper.getCustomerHeader().get(0).getCustomerDetails().size() > 0) {
											isFileLogAdded = objDao.loadReminderFileByXmlToFileLog(objCustomerWrapper.getCustomerHeader()
													.get(0), objCustomerWrapper.getCustomerTotal().get(0), fileId);
										}

									}
									if (objCustomerWrapper.getTransactionWrapper().size() > 0) {
										if (objCustomerWrapper.getTransactionWrapper().get(0).getCustomerTransactions().get(0)
												.getTransactions().size() > 0) {
											isFileTransactionAdded = objDao.loadReminderFileByXmlTransactions(fileId, objCustomerWrapper
													.getCustomerHeader().get(0).getCustomerWithTrans().get(0).getAccountcode(),
													objCustomerWrapper.getTransactionWrapper().get(0).getCustomerTransactions().get(0)
															.getTransactions());
										}
									}
									rowCount++;
								}
							}
						}
					}
					//
					PageHeader objPageHeader = (PageHeader) objReport.getSkipOneOrReportInfoOrPageHeader().get(1);
					if (isFileTransactionAdded) {
						startDate = objPageHeader.getStartDate();// sdf.format();
						endDate = objPageHeader.getEndDate();// sdf.format();

						isFileLoadStatusAdded = objDao.saveFileLoadStatus(fileId, fileName, rowCount, startDate, endDate);
						queryStr = "DELETE FROM file_log_transactions WHERE trans_type='CU' OR ref LIKE 'C00%';";
						objDao.executeQuery(queryStr);

						query1 = "update file_log a, file_log_emails b set a.email = b.email " + "where a.customer_code = b.customer_code;";
						query2 = "update customer_master a, file_log_emails b set a.email = b.email "
								+ "where a.customer_code = b.customer_code;";
						query3 = "UPDATE file_log a INNER JOIN "
								+ "(SELECT file_id, customer_code, ifnull(sum(outstanding_bal), 0) outstanding_bal, "
								+ "ifnull(sum(postdated_amount), 0) postdated_amount, ifnull(sum(current_amount), 0) current_amount,"
								+ "ifnull(sum(30_days_amount), 0) 30_days_amount,  ifnull(sum(60_days_amount), 0) 60_days_amount,"
								+ "ifnull(sum(90_days_amount), 0) 90_days_amount "
								+ "FROM file_log_transactions GROUP BY file_id, customer_code) b "
								+ "ON a.file_id = b.file_id AND a.customer_code = b.customer_code "
								+ "SET a.current_amount = b.current_amount, a.30_amount = 30_days_amount, "
								+ "a.60_amount = 60_days_amount, a.90_amount = 90_days_amount, "
								+ "a.post_dated_amount = postdated_amount, "
								+ "a.total_amount = (b.postdated_amount + b.current_amount + b.30_days_amount + b.60_days_amount + b.90_days_amount);";
						objDao.executeQuery(query1);
						objDao.executeQuery(query2);
						objDao.executeQuery(query3);
					}

					if (isFileLoadStatusAdded) {
						objEmptyResponseBean.setCode("success");
						objEmptyResponseBean.setMessage(getText("file_load_success"));
						objDao.commit();
						objDao.closeAll();
					}

				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("common_error"));
		} finally {
			objDao.closeAll();
			System.out.println("Done...");
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
