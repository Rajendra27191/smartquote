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
			String isUserPresentQuery = "SELECT user_id, user_group_id, user_name, email, password, "
					+ " contact, valid_from, valid_to FROM user_master"
					+ " WHERE email = ? AND password = ?";
			PreparedStatement pstmt = conn.prepareStatement(isUserPresentQuery);
			pstmt.setString(1, email);
			pstmt.setString(2, password);
			rs = pstmt.executeQuery();
			if (rs.next()) {
				objBean = new UserBean();
				objBean.setUserId(rs.getInt("user_id"));
				objBean.setUserGroupId(rs.getInt("user_group_id"));
				objBean.setUserName(rs.getString("user_name"));
				objBean.setEmailId(email);
				objBean.setPassword(password);
				objBean.setContact(rs.getString("contact"));
				objBean.setValidFrom(rs.getDate("valid_from"));
				objBean.setValidTo(rs.getDate("valid_to"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	}

}
