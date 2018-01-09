package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.EmailConfigBean;
import pojo.EmailFormatBean;
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
		int id=0;
		String query = "SELECT ifnull(MAX(file_id),0)  'file_id' FROM file_load_status_master;";
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

	public boolean uploadReminderFile(ArrayList<PaymentReminderFileBean> reminderList,String fileName) {
		boolean isFileUploaded = false;
		int rowCount = 0;
		String query = "Insert Ignore Into file_log_master (file_id,customer_code,customer_name,"
				+ "total_amount,current_amount,30_amount,60_amount,90_amount,email,send_status,remark) " 
				+ "values (?,?,?,?,?,?,?,?,?,?,?);";
		int fileId=getFileIdFromFileLoadStatus();
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
				String custEmail = getCustomerEmail(reminderList.get(i).getCustomerCode());
				System.out.println("custEmail :" + custEmail);
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
			boolean savedFileStatus=saveFileLoadStatus(fileId,fileName,rowCount);
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
	public boolean saveFileLoadStatus(int fileId,String fileName,int rowCount) {
		boolean isFileUploaded = false;
		String query = "INSERT IGNORE INTO file_load_status_master (file_id,file_name,load_date_time,rows,total,"
				+ "current_total,30_total,60_total,90_total,reminder_status) "
				+ "values(?,?,now(),?,?,?,?,?,?,?) ";
		try {
			PreparedStatement pstmt = conn.prepareStatement(query);
			pstmt.setInt(1, fileId);
			pstmt.setString(2, fileName);
			pstmt.setInt(3, rowCount);
			pstmt.setString(4, "TOTAL");
			pstmt.setString(5, "CURRENT");
			pstmt.setString(6, "30DAYS");
			pstmt.setString(7, "60DAYS");
			pstmt.setString(8, "90DAYS");
			pstmt.setString(9, "Not Send");
			int i=pstmt.executeUpdate();
			if(i>0)
				isFileUploaded=true;
			
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
		ArrayList<KeyValuePairBean> objArrayList=null;
		String query="SELECT file_id,file_name FROM file_load_status_master;";
		try {
			pstmt=conn.prepareStatement(query);
			rs=pstmt.executeQuery();
			objArrayList= new ArrayList<KeyValuePairBean>();
			while(rs.next()){
				KeyValuePairBean objBean =new KeyValuePairBean();
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
	
	public boolean unloadReminderFile(int fileId, String fileName){
		boolean isUnload=false;
		String query1="DELETE FROM file_log_master WHERE file_id=?; ";
		String query2="DELETE FROM file_load_status_master WHERE file_id=? AND file_name=?;";
		try {
		pstmt=conn.prepareStatement(query1);
		pstmt.setInt(1, fileId);
		int i=pstmt.executeUpdate();
		if (i>0) {
			pstmt=conn.prepareStatement(query2);
			pstmt.setInt(1, fileId);
			pstmt.setString(2, fileName);
			int j=pstmt.executeUpdate();
			if(j>0)
				isUnload=true;
				
		}
		
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
		ArrayList<PaymentReminderFileBean> objArrayList=null;
		String query="Select file_id,file_name,day(load_date_time)'day',monthname(load_date_time) 'month',year(load_date_time) 'year',"
				+ "rows,reminder_status from file_load_status_master;";
		try {
			pstmt=conn.prepareStatement(query);
			rs=pstmt.executeQuery();
			objArrayList= new ArrayList<PaymentReminderFileBean>();
			while(rs.next()){
				PaymentReminderFileBean objBean =new PaymentReminderFileBean();
				objBean.setFileId(rs.getInt("file_id"));
				objBean.setFileName(rs.getString("file_name"));
				objBean.setLoadDateTime(rs.getString("day")+" "+rs.getString("month")+" "+rs.getString("year"));
				objBean.setRows(rs.getInt("rows"));
				objBean.setReminderStatus(rs.getString("reminder_status"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	};
	public ArrayList<PaymentReminderFileBean> getCustomerDetailList(int fileId,String fileName) {
		ArrayList<PaymentReminderFileBean> objArrayList=null;
		String query="SELECT a.file_id,b.file_name, a.customer_code,a.customer_name,a.total_amount,a.current_amount,"
				+ "a.30_amount,a.60_amount,a.90_amount,a.email,a.send_status,a.remark "
				+ "FROM file_log_master a left outer join file_load_status_master b "
				+ "on a.file_id=? AND b.file_name=?;";
		try {
			pstmt=conn.prepareStatement(query);
			pstmt.setInt(1, fileId);
			pstmt.setString(2, fileName);
			System.out.println(pstmt);
			rs=pstmt.executeQuery();
			
			objArrayList= new ArrayList<PaymentReminderFileBean>();
			while(rs.next()){
				PaymentReminderFileBean objBean =new PaymentReminderFileBean();
				objBean.setFileId(rs.getInt("file_id"));
				objBean.setFileName(rs.getString("file_name"));
				System.out.println("CODE :: "+rs.getString("customer_code"));
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

	public EmailFormatBean getEmailFormatData() {
		String query="SELECT email_id,header,body,contact_person,subject,contact_name From email_data_ref "
				+ "WHERE email_id=1; ";
		EmailFormatBean objBean= new EmailFormatBean();
		try {
			pstmt=conn.prepareStatement(query);
			rs=pstmt.executeQuery();
			while(rs.next()){
				objBean.setHeader(rs.getString("header"));
				objBean.setBody(rs.getString("body"));
				objBean.setContactPerson(rs.getString("contact_person"));
				objBean.setSubject(rs.getString("subject"));
				objBean.setContactName(rs.getString("contact_name"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	};
	
	public ArrayList<EmailConfigBean> getEmailConfigList() {
		System.out.println("inside getEmailConfigList");
		ArrayList<EmailConfigBean> objArrayList=null;
		String query="Select config_id, email_id From email_config Where module='PR' AND flag='1';";
		try {
			pstmt=conn.prepareStatement(query);
			System.out.println(pstmt);
			rs=pstmt.executeQuery();
			objArrayList= new ArrayList<EmailConfigBean>();
			while(rs.next()){
				System.out.println("inside while");
				EmailConfigBean objBean =new EmailConfigBean();
				objBean.setConfigId(rs.getInt("config_id"));
				objBean.setEmailId(rs.getString("email_id"));
				objArrayList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objArrayList;
	}

	public boolean updateEmailData(String body){
		boolean isUpdated=false;
		String query="update email_data set body='"+body.replaceAll("'","\\\\'")+"' where email_id=1 ;";
		try {
			pstmt=conn.prepareStatement(query);
			int i=pstmt.executeUpdate();
			if(i>0)
				isUpdated=true;
			
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
	public boolean addCustomersIntoEmailRecord(SendReminderBean objSendReminderBean){
		boolean isUpdated=false;
		String query="replace into email_record(config_id,file_id,cust_code,cust_name,total,"
				+ "current,d30,d60,d90,email_id,send_status,due,remark,date)"
				+ "values(?,?,?,?,?,?,?,?,?,?,?,?,?,now());";
		try {
			pstmt=conn.prepareStatement(query);
			final int batchSize = 50;
			int count = 0;
			for (int i = 0; i < objSendReminderBean.getCustomerArrayList().size(); i++) {
				pstmt.setInt(1, objSendReminderBean.getEmailFormat().getFrom());
				pstmt.setInt(2, objSendReminderBean.getCustomerArrayList().get(i).getFileId());
				pstmt.setString(3, objSendReminderBean.getCustomerArrayList().get(i).getCustomerCode());
				pstmt.setString(4, objSendReminderBean.getCustomerArrayList().get(i).getCustomerName());
				pstmt.setDouble(5, objSendReminderBean.getCustomerArrayList().get(i).getTotal());
				pstmt.setDouble(6, objSendReminderBean.getCustomerArrayList().get(i).getJuneCurrent());
				pstmt.setDouble(7, objSendReminderBean.getCustomerArrayList().get(i).getMay30Days());
				pstmt.setDouble(8, objSendReminderBean.getCustomerArrayList().get(i).getApril60Days());
				pstmt.setDouble(9, objSendReminderBean.getCustomerArrayList().get(i).getMarch90Days());
				pstmt.setString(10, objSendReminderBean.getCustomerArrayList().get(i).getEmail());
				pstmt.setString(11, "N");
				pstmt.setString(12,objSendReminderBean.getDuration());
				pstmt.setString(13,"");
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
		    pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			
				isUpdated=true;
			
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
