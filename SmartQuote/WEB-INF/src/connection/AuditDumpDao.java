package connection;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class AuditDumpDao {

	Connection conn;
	PreparedStatement pstmt;
	
	public AuditDumpDao() {
		initalize();
	}

	public void initalize() {
		try {
			conn = (new ConnectionFactory()).getConnection();
			pstmt = conn
					.prepareStatement("insert into audit_dump values(?,?,?,now())");
		} catch (Exception e) {
			System.out.println((new StringBuilder(
					"Error in initalize() in AuditDumpDao class")).append(e)
					.toString());
		}
	}

	public void insertData(int user_id, String actionName, String jsonParam) {
		try {
			pstmt.setInt(1, user_id);
			pstmt.setString(2, actionName.replace("/", "").trim());
			pstmt.setString(3, jsonParam);
			System.out.println(pstmt.toString());
			pstmt.executeUpdate();
			closeAll();
		} catch (Exception e) {
			closeAll();
			System.out.println((new StringBuilder(
					"Error in insertData() in AuditDumpDao class")).append(e)
					.toString());
		}
	}

	public void closeAll() {
		try {
			if (conn != null)
				conn.close();
			if (pstmt != null)
				pstmt.close();
		} catch (Exception e) {
			System.out.println((new StringBuilder(
					"Error while closing connection in AuditDumpDao class"))
					.append(e).toString());
		}
	}

	


}
