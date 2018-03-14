package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import pojo.UserBean;
import connection.ConnectionFactory;

public class LoginDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public LoginDao() {
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
			if (conn != null) {
				conn.close();
			}
			if (rs != null) {
				rs.close();
			}
			if (pstmt != null) {
				pstmt.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public UserBean isUserPresent(String email, String password) {
		UserBean objBean = null;
		ResultSet rs = null;
		try {
//			String isUserPresentQuery = "SELECT user_id, user_group_id, user_name, email, password, "
//					+ " contact, valid_from, valid_to FROM user_master"
//					+ " WHERE email = ? AND password = ?";
			String isUserPresentQuery="SELECT a.user_id, b.user_group_id,b.user_group_name, "
					+ "a.user_name, a.email, a.password,a.contact, a.valid_from, a.valid_to, payment_reminder_access "
					+ "FROM user_master a "
					+ "LEFT OUTER JOIN user_group b ON a.user_group_id=b.user_group_id "
					+ "WHERE a.email = ? AND a.password = ?;";
			
			PreparedStatement pstmt = conn.prepareStatement(isUserPresentQuery);
			pstmt.setString(1, email);
			pstmt.setString(2, password);
			System.out.println("Login Query: "+ pstmt.toString());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				objBean = new UserBean();
				objBean.setUserId(rs.getInt("user_id"));
				objBean.setUserGroupId(rs.getInt("user_group_id"));
				objBean.setUserType(rs.getString("user_group_name"));
				objBean.setUserName(rs.getString("user_name"));
				objBean.setEmailId(email);
//				objBean.setPassword(password);
				objBean.setContact(rs.getString("contact"));
				objBean.setValidFrom(rs.getDate("valid_from"));
				objBean.setValidTo(rs.getDate("valid_to"));
				objBean.setPaymentReminderAccess(rs.getString("payment_reminder_access"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	}

}
