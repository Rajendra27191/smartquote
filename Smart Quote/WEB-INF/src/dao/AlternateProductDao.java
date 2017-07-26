package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.AlternateProductBean;
import connection.ConnectionFactory;

public class AlternateProductDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;
	public AlternateProductDao() {
		try {
			conn= new ConnectionFactory().getConnection();
			conn.setAutoCommit(false);
		} catch (Exception e) {
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
	public boolean saveAlternateProducts(String mainId, String alternativeId) {
		boolean isProductCreated = false;
		try {
			String insertQuery= "INSERT IGNORE INTO alternative_product_master (main_product_id, alternative_product_id) "
					+ " VALUES(?, ?)";
			pstmt = conn.prepareStatement(insertQuery);
			pstmt.setString(1,mainId);
			pstmt.setString(2,alternativeId);
			pstmt.executeUpdate();
			isProductCreated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isProductCreated;
	}
	public boolean deleteAlternateProduct(String mainId, String alternativeId) {
		boolean isProductDeleted = false;
		try {
			String deleteQuery= "DELETE FROM alternative_product_master WHERE "
					+ "main_product_id = ? AND alternative_product_id = ?";
			pstmt = conn.prepareStatement(deleteQuery);
			pstmt.setString(1,mainId);
			pstmt.setString(2,alternativeId);
			pstmt.executeUpdate();
			isProductDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isProductDeleted;
	}
	public ArrayList<AlternateProductBean> getAlternateProductsList(){
		ArrayList<AlternateProductBean> arrayListBeans=new ArrayList<AlternateProductBean>();
		AlternateProductBean objBean=null;
		String query="SELECT "
				+ "b.item_code 'main_product_id', b.item_description 'main_item_desc', "
				+ "b.avg_cost 'main_avg_cost', b.unit 'main_unit', "
				+ "c.item_code 'alt_product_id', c.item_description 'alt_item_desc', "
				+ "c.avg_cost 'alt_avg_cost', c.unit 'alt_unit' "
				+ "FROM alternative_product_master a, product_master b, product_master c "
				+ "WHERE a.main_product_id = b.item_code AND a.alternative_product_id = c.item_code;";
		try {
			pstmt=conn.prepareStatement(query);
			rs=pstmt.executeQuery();
			while(rs.next()){
				objBean=new AlternateProductBean();
				objBean.setMainProductCode(rs.getString("main_product_id"));
				objBean.setMainProductDesc(rs.getString("main_item_desc"));
				objBean.setMainProductAvgCost(rs.getDouble("main_avg_cost"));
				objBean.setMainProductUnit(rs.getString("main_unit"));
				objBean.setAltProductCode(rs.getString("alt_product_id"));
				objBean.setAltProductDesc(rs.getString("alt_item_desc"));
				objBean.setAltProductAvgCost(rs.getDouble("alt_avg_cost"));
				objBean.setAltProductUnit(rs.getString("alt_unit"));
				arrayListBeans.add(objBean);	
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return arrayListBeans;
	};
	
}
