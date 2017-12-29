package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.PaymentReminderBean;
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

	public boolean uploadReminderFile(ArrayList<PaymentReminderBean> reminderList,String fileName) {
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
			pstmt.setString(9, "");
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
}
