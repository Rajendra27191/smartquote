package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import connection.ConnectionFactory;

public class DashBoardDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public DashBoardDao() {
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
	public int getTotalQuotes(String query) {
		int total = 0;
		try {
			pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			if(rs.next()){
				total=rs.getInt(1);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return total;
	}
	
//	public int getTotalQuote(String getTotalQuoteQuery) {
//		int totalQuote = 0;
//		try {
//			pstmt = conn.prepareStatement(getTotalQuoteQuery);
//			rs = pstmt.executeQuery();
//			if(rs.next()){
//				totalQuote=rs.getInt(1);
//			}
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return totalQuote;
//	}
//
//	public int getPipelineQuote(String query) {
//		int pipelineQuote = 0;
//		try {
//			pstmt = conn.prepareStatement(query);
//			rs = pstmt.executeQuery();
//			if(rs.next()){
//				pipelineQuote=rs.getInt(1);
//			}
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return pipelineQuote;
//	}
//
//	public int getWonQuote(String query) {
//		int wonQuote = 0;
//		try {
//			pstmt = conn.prepareStatement(query);
//			rs = pstmt.executeQuery();
//			if(rs.next()){
//				wonQuote=rs.getInt(1);
//			}
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return wonQuote;
//	}
//
//	public int getLostQuote(String query) {
//		int lostQuote = 0;
//		try {
//			pstmt = conn.prepareStatement(query);
//			rs = pstmt.executeQuery();
//			if(rs.next()){
//				lostQuote=rs.getInt(1);
//			}
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return lostQuote;
//	}
//
//	public int getClosedQuote(String query) {
//		int closedQuote = 0;
//		try {
//			pstmt = conn.prepareStatement(query);
//			rs = pstmt.executeQuery();
//			if(rs.next()){
//				closedQuote=rs.getInt(1);
//			}
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return closedQuote;
//	}

}
