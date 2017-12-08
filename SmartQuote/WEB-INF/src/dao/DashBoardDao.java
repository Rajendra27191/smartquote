package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import responseBeans.ChartResponseBean;
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
	public ArrayList<ChartResponseBean> getChartDetails(String query) {
		ArrayList<ChartResponseBean> objList = new ArrayList<ChartResponseBean>();
		ChartResponseBean objBean = null;
		try {
			pstmt = conn.prepareStatement(query);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			while(rs.next()){
				objBean = new ChartResponseBean();
				objBean.setStatus(rs.getString("status"));
				objBean.setTotalCount(rs.getInt("totalCount"));
				objBean.setTotalAmount(rs.getDouble("totalAmount"));
				objList.add(objBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objList;
	}
}
