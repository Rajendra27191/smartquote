package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.CustomerBean;
import pojo.KeyValuePairBean;
import connection.ConnectionFactory;

public class CustomerDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public CustomerDao() {
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

	public ArrayList<KeyValuePairBean> getCustomerList() {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getCustomerList = "SELECT customer_name, customer_Code FROM customer_master;";
		try {
			pstmt = conn.prepareStatement(getCustomerList);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("customer_Code"));
				objKeyValuePairBean.setValue(rs.getString("customer_Code") + " ("+ rs.getString("customer_name")+")");
				pairBeans.add(objKeyValuePairBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return pairBeans;
	}

	public boolean isCustomerExist(String customerCode) {
		boolean isRegisterdUser = false;
		String getUserGroups = "SELECT customer_code FROM customer_master WHERE customer_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, customerCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isRegisterdUser = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isRegisterdUser;
	}

	public boolean saveCustomer(CustomerBean objBean) {
		boolean isUserCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO customer_master (customer_code, customer_name, state, postal_code, "
					+ " add1, add2, phone, contact_person, fax_no, email, total_staff, avg_purchase, industry_type) "
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			PreparedStatement pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, objBean.getCustomerCode());
			pstmt.setString(2, objBean.getCustomerName());
			pstmt.setString(3, objBean.getState());
			pstmt.setString(4, objBean.getPostalCode());
			pstmt.setString(5, objBean.getAddress1());
			pstmt.setString(6, objBean.getAddress2());
			pstmt.setString(7, objBean.getPhone());
			pstmt.setString(8, objBean.getContactPerson());
			pstmt.setString(9, objBean.getFax());
			pstmt.setString(10, objBean.getEmail());
			pstmt.setInt(11, objBean.getTotalStaff());
			pstmt.setString(12, objBean.getAvgPurchase());
			pstmt.setString(13, objBean.getIndustryType());
			pstmt.executeUpdate();
			isUserCreated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUserCreated;
	}

	public CustomerBean getCustomerDetails(String customerCode) {
		CustomerBean objBean = null;
		String getUserGroups = "SELECT customer_code, customer_name, state, postal_code, add1, add2, phone, contact_person, "
				+ " fax_no, email, total_staff, avg_purchase, industry_type "
				+ " FROM customer_master WHERE customer_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, customerCode);
			System.out.println("pstm: " + pstmt.toString());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new CustomerBean();
				objBean.setCustomerCode(rs.getString("customer_code"));
				objBean.setCustomerName(rs.getString("customer_name"));
				objBean.setState(rs.getString("state"));
				objBean.setPostalCode(rs.getString("postal_code"));
				objBean.setAddress1(rs.getString("add1"));
				objBean.setAddress2(rs.getString("add2"));
				objBean.setPhone(rs.getString("phone"));
				objBean.setContactPerson(rs.getString("contact_person"));
				objBean.setFax(rs.getString("fax_no"));
				objBean.setEmail(rs.getString("email"));
				objBean.setTotalStaff(rs.getInt("total_staff"));
				objBean.setAvgPurchase(rs.getString("avg_purchase"));
				objBean.setIndustryType(rs.getString("industry_type"));
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objBean;
	}

	public boolean updateCustomer(CustomerBean objBean) {
		boolean isCustomerUpdated = false;
		try {
			String updateCustQuery = "UPDATE customer_master SET customer_name = ?, state = ?, postal_code = ?, "
					+ " add1 = ?, add2 = ?, phone = ?, contact_person = ?, fax_no = ?, email = ?, total_staff = ?, "
					+ " avg_purchase = ?, industry_type = ?"
					+ " WHERE customer_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, objBean.getCustomerName());
			pstmt.setString(2, objBean.getState());
			pstmt.setString(3, objBean.getPostalCode());
			pstmt.setString(4, objBean.getAddress1());
			pstmt.setString(5, objBean.getAddress2());
			pstmt.setString(6, objBean.getPhone());
			pstmt.setString(7, objBean.getContactPerson());
			pstmt.setString(8, objBean.getFax());
			pstmt.setString(9, objBean.getEmail());
			pstmt.setInt(10, objBean.getTotalStaff());
			pstmt.setString(11, objBean.getAvgPurchase());
			pstmt.setString(12, objBean.getIndustryType());
			pstmt.setString(13, objBean.getCustomerCode());
			System.out.println("Update Customer: " + pstmt.toString());
			pstmt.executeUpdate();
			isCustomerUpdated = true;
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isCustomerUpdated;
	}

	public boolean deleteUser(String customerCode) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM customer_master WHERE customer_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, customerCode);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;
	}
}
