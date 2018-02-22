package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import pojo.EmailFormatBean;
import pojo.EmailLogBean;
import pojo.KeyValuePairBean;
import pojo.PaymentReminderFileBean;
import pojo.SendReminderBean;
import connection.ConnectionFactory;

public class PaymentReminderDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public PaymentReminderDao() {
		conn = new ConnectionFactory().getConnection();
		try {
			conn.setAutoCommit(false);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void commit() {
		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void closeAll() {
		try {
			if (conn != null)
				conn.close();
			if (rs != null)
				rs.close();
			if (pstmt != null)
				pstmt.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public int getFileIdFromFileLoadStatus() {
		int id = 0;
		String query = "SELECT ifnull(MAX(file_id),0) 'file_id' FROM file_load_status;";
		try {
			PreparedStatement pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			System.out.println(pstmt);
			if (rs.next()) {
				id = rs.getInt("file_id");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ++id;
	}

	public String getCustomerEmail(String customerCode) {
		String email = null;
		System.out.println("getCustomerEmail" + customerCode);
		String query = "SELECT email FROM customer_master WHERE customer_code = ?;";
		try {
			PreparedStatement pstmt = conn.prepareStatement(query);
			pstmt.setString(1, customerCode);
			rs = pstmt.executeQuery();
			System.out.println(pstmt);
			if (rs.next()) {
				email = rs.getString("email");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return email;
	}

	public boolean checkIfFileExist(String fileName) {
		boolean isFileExist = false;
		String getUserGroups = "SELECT file_name FROM file_load_status WHERE file_name = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, fileName);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isFileExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isFileExist;
	}

	public boolean uploadReminderFile(ArrayList<PaymentReminderFileBean> reminderList, String fileName) {
		boolean isFileUploaded = false;
		int rowCount = 0;
		String query = "Insert Ignore Into file_log (file_id,customer_code,customer_name,"
				+ "total_amount,current_amount,30_amount,60_amount,90_amount,email,send_status,remark) "
				+ "values (?,?,?,?,?,?,?,?,?,?,?);";
		int fileId = getFileIdFromFileLoadStatus();
		try {
			pstmt = conn.prepareStatement(query);
			final int batchSize = 50;
			int count = 0;

			for (int i = 0; i < reminderList.size(); i++) {
				pstmt.setInt(1, fileId);
				pstmt.setString(2, reminderList.get(i).getCustomerCode());
				pstmt.setString(3, reminderList.get(i).getCustomerName());
				pstmt.setDouble(4, reminderList.get(i).getTotal());
				pstmt.setDouble(5, reminderList.get(i).getJuneCurrent());
				pstmt.setDouble(6, reminderList.get(i).getMay30Days());
				pstmt.setDouble(7, reminderList.get(i).getApril60Days());
				pstmt.setDouble(8, reminderList.get(i).getMarch90Days());
				String custEmail = "";
				custEmail = getCustomerEmail(reminderList.get(i).getCustomerCode());
				if (custEmail != null) {
				} else {
					custEmail = "";
				}
				// System.out.println("custEmail :" + custEmail);
				pstmt.setString(9, custEmail);
				pstmt.setString(10, reminderList.get(i).getSendStatus());
				pstmt.setString(11, reminderList.get(i).getRemark());
				pstmt.addBatch();
				rowCount++;
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			boolean savedFileStatus = saveFileLoadStatus(fileId, fileName, rowCount);
			if (savedFileStatus) {
				isFileUploaded = true;
			}

		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isFileUploaded;
	}

	public boolean saveFileLoadStatus(int fileId, String fileName, int rowCount) {
		boolean isFileUploaded = false;
		String query = "INSERT IGNORE INTO  file_load_status (file_id,file_name,load_date_time,rows,total,"
				+ "current_total,30_total,60_total,90_total,reminder_status) " + "values(?,?,now(),?,?,?,?,?,?,?) ";
		try {
			PreparedStatement pstmt = conn.prepareStatement(query);
			pstmt.setInt(1, fileId);
			pstmt.setString(2, fileName);
			pstmt.setInt(3, rowCount);
			pstmt.setString(4, "TOTAL");
			pstmt.setString(5, "CURRENT");
			pstmt.setString(6, "30 DAYS");
			pstmt.setString(7, "60 DAYS");
			pstmt.setString(8, "90 DAYS");
			pstmt.setString(9, "Not Send");
			int i = pstmt.executeUpdate();
			if (i > 0)
				isFileUploaded = true;

		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isFileUploaded;
	};

	public ArrayList<KeyValuePairBean> getFileList() {
		ArrayList<KeyValuePairBean> objArrayList = null;
		String query = "SELECT file_id,file_name FROM  file_load_status;";
		try {
			pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			objArrayList = new ArrayList<KeyValuePairBean>();
			while (rs.next()) {
				KeyValuePairBean objBean = new KeyValuePairBean();
				objBean.setCode(String.valueOf(rs.getInt("file_id")));
				objBean.setKey(rs.getInt("file_id"));
				objBean.setValue(rs.getString("file_name"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	};

	public boolean unloadReminderFile(int fileId, String fileName) {
		boolean isUnload = false;
		String query1 = "DELETE FROM file_load_status WHERE file_name = ?;";
		String query2 = "DELETE FROM file_log WHERE file_id=?; ";
		String query3 = "UPDATE email_record SET file_unload_status=1 WHERE file_id=? AND file_name=?;";
		try {
			pstmt = conn.prepareStatement(query1);
			pstmt.setString(1, fileName);
			System.out.println(pstmt);
			int i = pstmt.executeUpdate();
			int j = 0;
			System.out.println("I " + i);
			if (i > 0) {
				pstmt = conn.prepareStatement(query2);
				pstmt.setInt(1, fileId);
				j = pstmt.executeUpdate();
				System.out.println("J " + j);
			}
			int x = 0;
			if (j > 0) {
				pstmt = conn.prepareStatement(query3);
				pstmt.setInt(1, fileId);
				pstmt.setString(2, fileName);
				x = pstmt.executeUpdate();
				System.out.println("X " + x);
			}

			isUnload = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUnload;
	}

	public ArrayList<PaymentReminderFileBean> getFileDetailList() {
		ArrayList<PaymentReminderFileBean> objArrayList = null;
		String query = "Select file_id,file_name,day(load_date_time)'day',monthname(load_date_time) 'month',year(load_date_time) 'year',"
				+ "rows,reminder_status from  file_load_status;";
		try {
			pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			objArrayList = new ArrayList<PaymentReminderFileBean>();
			while (rs.next()) {
				PaymentReminderFileBean objBean = new PaymentReminderFileBean();
				objBean.setFileId(rs.getInt("file_id"));
				objBean.setFileName(rs.getString("file_name"));
				objBean.setLoadDateTime(rs.getString("day") + " " + rs.getString("month") + " " + rs.getString("year"));
				objBean.setRows(rs.getInt("rows"));
				objBean.setReminderStatus(rs.getString("reminder_status"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	};

	public ArrayList<PaymentReminderFileBean> getCustomerDetailList(int fileId, String fileName) {
		ArrayList<PaymentReminderFileBean> objArrayList = null;
		String query = "SELECT a.file_id,b.file_name, a.customer_code,a.customer_name,a.total_amount,a.current_amount,"
				+ "a.30_amount,a.60_amount,a.90_amount,ifnull(a.changed_email,a.email) 'email',a.send_status,a.remark "
				+ "FROM file_log a join  file_load_status b " + "on a.file_id=? AND b.file_name=?;";
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setInt(1, fileId);
			pstmt.setString(2, fileName);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();

			objArrayList = new ArrayList<PaymentReminderFileBean>();
			while (rs.next()) {
				PaymentReminderFileBean objBean = new PaymentReminderFileBean();
				objBean.setFileId(rs.getInt("file_id"));
				objBean.setFileName(rs.getString("file_name"));
				// System.out.println("CODE :: "+rs.getString("customer_code"));
				objBean.setCustomerCode(rs.getString("customer_code"));
				objBean.setCustomerName(rs.getString("customer_name"));
				objBean.setTotal(rs.getDouble("total_amount"));
				objBean.setJuneCurrent(rs.getDouble("current_amount"));
				objBean.setMay30Days(rs.getDouble("30_amount"));
				objBean.setApril60Days(rs.getDouble("60_amount"));
				objBean.setMarch90Days(rs.getDouble("90_amount"));
				objBean.setEmail(rs.getString("email"));
				objBean.setSendStatus(rs.getString("send_status"));
				objBean.setRemark(rs.getString("remark"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	}

	public ArrayList<EmailFormatBean> getEmailFormatData() {
		ArrayList<EmailFormatBean> objArrayList = null;
		// String query =
		// "SELECT email_id,header,body,contact_person,subject,contact_name,name,footer From email_data_ref "
		// + "WHERE email_id=1; ";
		String query = "SELECT a.config_id,b.template_id,a.email_id,header,body,contact_person,subject "
				+ "FROM email_config a, email_data_ref b where a.config_id=b.config_id;";

		try {
			pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			objArrayList = new ArrayList<EmailFormatBean>();
			while (rs.next()) {
				EmailFormatBean objBean = new EmailFormatBean();
				objBean.setConfigId(rs.getInt("config_id"));
				objBean.setTemplateId(rs.getInt("template_id"));
				objBean.setEmailId(rs.getString("email_id"));
				objBean.setHeader(rs.getString("header"));
				objBean.setBody(rs.getString("body"));
				objBean.setContactPerson(rs.getString("contact_person"));
				objBean.setSubject(rs.getString("subject"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	};

	public boolean updateEmailData(String body) {
		boolean isUpdated = false;
		String query = "update email_data set body='" + body.replaceAll("'", "\\\\'") + "' where email_id=1 ;";
		try {
			pstmt = conn.prepareStatement(query);
			int i = pstmt.executeUpdate();
			if (i > 0)
				isUpdated = true;

		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

	public int getBatchIdFromEmailRecordStatus() {
		int id = 0;
		String query = "SELECT ifnull(MAX(batch_id),0) 'batch_id' FROM email_record;";
		try {
			PreparedStatement pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			System.out.println(pstmt);
			if (rs.next()) {
				id = rs.getInt("batch_id");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ++id;
	}

	public boolean addCustomersIntoEmailRecord(SendReminderBean objSendReminderBean) {
		// System.out.println(objSendReminderBean);
		boolean isUpdated = false;
		String query = "replace into email_record(config_id,batch_id,file_id,cust_code,cust_name,total,"
				+ "current,d30,d60,d90,email_id,send_status,due,remark,date,file_name,file_unload_status," + "template_id,subject,body)"
				+ "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),?,?,?,?,?);";
		try {
			pstmt = conn.prepareStatement(query);
			final int batchSize = 50;
			int count = 0;
			int batchId = getBatchIdFromEmailRecordStatus();
			for (int i = 0; i < objSendReminderBean.getCustomerArrayList().size(); i++) {
				pstmt.setInt(1, objSendReminderBean.getEmailFormat().getFrom());
				pstmt.setInt(2, batchId);
				pstmt.setInt(3, objSendReminderBean.getCustomerArrayList().get(i).getFileId());
				pstmt.setString(4, objSendReminderBean.getCustomerArrayList().get(i).getCustomerCode());
				pstmt.setString(5, objSendReminderBean.getCustomerArrayList().get(i).getCustomerName());
				pstmt.setDouble(6, objSendReminderBean.getCustomerArrayList().get(i).getTotal());
				pstmt.setDouble(7, objSendReminderBean.getCustomerArrayList().get(i).getJuneCurrent());
				pstmt.setDouble(8, objSendReminderBean.getCustomerArrayList().get(i).getMay30Days());
				pstmt.setDouble(9, objSendReminderBean.getCustomerArrayList().get(i).getApril60Days());
				pstmt.setDouble(10, objSendReminderBean.getCustomerArrayList().get(i).getMarch90Days());
				pstmt.setString(11, objSendReminderBean.getCustomerArrayList().get(i).getEmail());
				pstmt.setString(12, "N");
				pstmt.setString(13, objSendReminderBean.getDuration());
				pstmt.setString(14, "");
				pstmt.setString(15, objSendReminderBean.getCustomerArrayList().get(i).getFileName());
				pstmt.setInt(16, 0);
				pstmt.setInt(17, objSendReminderBean.getEmailFormat().getTemplateId());
				pstmt.setString(18, objSendReminderBean.getEmailFormat().getSubject());
				pstmt.setString(19, objSendReminderBean.getEmailFormat().getBody());
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			isUpdated = true;

		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

	public ArrayList<EmailLogBean> getEmailLogArrayList() {
		ArrayList<EmailLogBean> objArrayList = null;
		String query = "SELECT batch_id,f.file_id,f.file_name,count(batch_id) 'total',"
				+ "sum(case when send_status='Y' then 1 else 0 end) 'sent', "
				+ "sum(case when send_status='N' then 1 else 0 end) 'pending', "
				+ "sum(case when send_status='F' then 1 else 0 end) 'fail' "
				+ "FROM email_record e,file_load_status f where f.file_id=e.file_id AND e.file_unload_status=0 group by e.batch_id;";
		try {
			pstmt = conn.prepareStatement(query);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			objArrayList = new ArrayList<EmailLogBean>();
			while (rs.next()) {
				EmailLogBean objBean = new EmailLogBean();
				objBean.setBatchId(rs.getInt("batch_id"));
				objBean.setFileId(rs.getInt("file_id"));
				objBean.setFileName(rs.getString("file_name"));
				objBean.setTotal(rs.getInt("total"));
				objBean.setSent(rs.getInt("sent"));
				objBean.setPending(rs.getInt("pending"));
				objBean.setFail(rs.getInt("fail"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	}

	public boolean updateFileLogEmailId(String custCode, int fileId, String email) {
		boolean isUpdated = false;
		String query = "UPDATE file_log set changed_email=? where customer_code=? AND file_id=?;";
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setString(1, email);
			pstmt.setString(2, custCode);
			pstmt.setInt(3, fileId);
			int i = pstmt.executeUpdate();
			if (i > 0)
				isUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

	public ArrayList<PaymentReminderFileBean> getEmailLogCustomers(int batchId, String status) {
		ArrayList<PaymentReminderFileBean> objArrayList = null;
		String query = "";
		if (status.equalsIgnoreCase("A")) {
			query = "SELECT cust_code,cust_name,email_id,send_status,remark,date FROM email_record " + "where batch_id=" + batchId
					+ " order by cust_code;";
		} else {
			query = "SELECT cust_code,cust_name,email_id,send_status,remark,date FROM email_record " + "where batch_id=" + batchId
					+ " and send_status='" + status + "' order by cust_code;";
		}
		try {
			pstmt = conn.prepareStatement(query);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			objArrayList = new ArrayList<PaymentReminderFileBean>();
			while (rs.next()) {
				PaymentReminderFileBean objBean = new PaymentReminderFileBean();
				objBean.setCustomerCode(rs.getString("cust_code"));
				objBean.setCustomerName(rs.getString("cust_name"));
				objBean.setEmail(rs.getString("email_id"));
				objBean.setSendStatus(rs.getString("send_status"));
				objBean.setRemark(rs.getString("remark"));
				objBean.setDate(rs.getString("date"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	}

	public boolean updateCustomerStatusOfEmailRecord(int batchId) {
		boolean isUpdated = false;
		String query = "UPDATE email_record set send_status='N',remark='' WHERE batch_id=" + batchId + " AND send_status='F'";
		try {
			pstmt = conn.prepareStatement(query);
			int i = pstmt.executeUpdate();
			if (i > 0)
				isUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

	public ArrayList<PaymentReminderFileBean> getPendingEmails() {
		ArrayList<PaymentReminderFileBean> objArrayList = null;
		String query1 = "select date,cust_code, cust_name, email_id, send_status from email_record where send_status='N' order by date;";
		try {
			pstmt = conn.prepareStatement(query1);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			objArrayList = new ArrayList<PaymentReminderFileBean>();
			while (rs.next()) {
				PaymentReminderFileBean objBean = new PaymentReminderFileBean();
				objBean.setDate(rs.getString("date"));
				objBean.setCustomerCode(rs.getString("cust_code"));
				objBean.setCustomerName(rs.getString("cust_name"));
				objBean.setEmail(rs.getString("email_id"));
				objBean.setSendStatus(rs.getString("send_status"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	}

	public boolean abortEmailRecord(SendReminderBean objSendReminderBean) {
		boolean isUpdated = false;
		String query = "UPDATE email_record SET send_status='A' WHERE date=? AND cust_code=? AND email_id=?;";
		try {
			pstmt = conn.prepareStatement(query);
			final int batchSize = 50;
			int count = 0;
			for (int i = 0; i < objSendReminderBean.getCustomerArrayList().size(); i++) {
				pstmt.setString(1, objSendReminderBean.getCustomerArrayList().get(i).getDate());
				pstmt.setString(2, objSendReminderBean.getCustomerArrayList().get(i).getCustomerCode());
				pstmt.setString(3, objSendReminderBean.getCustomerArrayList().get(i).getEmail());
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			isUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

	public boolean uploadReminderFileEmail(ArrayList<PaymentReminderFileBean> reminderList) {
		boolean isUpdated = false;
		String query = "Replace Into file_log_emails (customer_code,customer_name,email) " + "values (?,?,?);";
		try {
			pstmt = conn.prepareStatement(query);
			final int batchSize = 1000;
			int count = 0;
			for (int i = 0; i < reminderList.size(); i++) {
				pstmt.setString(1, reminderList.get(i).getCustomerCode());
				pstmt.setString(2, reminderList.get(i).getCustomerName());
				pstmt.setString(3, reminderList.get(i).getEmail().replace(" ", ""));
				//.replace(" ", "")
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			isUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

	public boolean executeQuery(String queryStr) {
		boolean isUpdated = false;
		String query = queryStr;
		try {
			pstmt = conn.prepareStatement(query);
			System.out.println(pstmt);
			int i = pstmt.executeUpdate();
			if (i > 0)
				isUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}
}
