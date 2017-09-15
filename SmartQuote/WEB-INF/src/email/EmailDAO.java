/**
 * 
 */
package email;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import pojo.EmailBean;
import connection.ConnectionFactory;

/**
 * @author rajendra
 * 
 */
public class EmailDAO {
	ConnectionFactory objConnection = null;
	Connection conn = null;

	public EmailDAO() {
		objConnection = new ConnectionFactory();
		conn = objConnection.getConnection();
	}

	public void closeAll() {
		try {
			if (conn != null) {
				conn.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @param objEmailBean
	 * @return
	 */
	public boolean insertRecords(EmailBean objEmailBean) {
		PreparedStatement pstmt = null;
		boolean isMailSent = false;

		String assignHscodeQuery = "INSERT INTO sent_mail_processing (subject, mail_to, body, status) values (?, ?, ?, ?)";
		try {
			pstmt = conn.prepareStatement(assignHscodeQuery);
			pstmt.setString(1, objEmailBean.getSubject());
			pstmt.setString(2, objEmailBean.getMailTo());
			pstmt.setString(3, objEmailBean.getBody());
			pstmt.setString(4, "N");
			pstmt.executeUpdate();
			isMailSent = true;
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isMailSent;
	}

}
