package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.AlternateProductBean;
import pojo.AlternateProductDetailBean;
import connection.ConnectionFactory;

public class AlternateProductDao {
	Connection conn = null;
	ResultSet rs,rs1 = null;
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
	public boolean isAlternativeExist(String mainId, String altId) {
		boolean isExist = false;
		try {
			String insertQuery= "SELECT main_product_id, alternative_product_id "
					+ "FROM alternative_product_master "
					+ "WHERE main_product_id=? AND alternative_product_id=?;";
			pstmt = conn.prepareStatement(insertQuery);
			pstmt.setString(1, mainId);
			pstmt.setString(2, altId);
			rs=pstmt.executeQuery();
			if (rs.next()) {
				isExist=true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isExist;
	}
		public boolean saveAlternateProducts(String mainId, String altId) {
		boolean isProductCreated = false;
		System.out.println("IN saveAlternateProducts");
		System.out.println("mainID : "+mainId+" altId : "+altId);
		try {
			String insertQuery= "INSERT IGNORE INTO alternative_product_master (main_product_id, alternative_product_id) "
					+ " VALUES(?,?)";
			pstmt = conn.prepareStatement(insertQuery);
			pstmt.setString(1,mainId);
			pstmt.setString(2,altId);
//			pstmt.setDouble(3,altDefaultPrice);
			int result=pstmt.executeUpdate();
//			System.out.println("Result :"+result+" "+pstmt);
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
		AlternateProductDetailBean altProductObj=null;
		String query="SELECT "
		+ "b.item_code 'main_product_id', b.item_description 'main_item_desc', "
		+ "b.avg_cost 'main_avg_cost', b.unit 'main_unit',b.price0exGST 'main_product_price', "
		+ "c.item_code 'alt_product_id', c.item_description 'alt_item_desc', "
		+ "c.avg_cost 'alt_avg_cost', c.unit 'alt_unit',c.price0exGST 'alt_product_price',"
		+ "c.promo_price 'alt_promo_price' "
//		+ "a.alternative_default_price "
		+ "FROM alternative_product_master a, product_master b, product_master c "
		+ "WHERE a.main_product_id = b.item_code AND a.alternative_product_id = c.item_code;";
		try {
			pstmt=conn.prepareStatement(query);
			rs=pstmt.executeQuery();
			while(rs.next()){
				String mainID=rs.getString("main_product_id");
				objBean=new AlternateProductBean();
				objBean.setMainProductCode(mainID);
				objBean.setMainProductDesc(rs.getString("main_item_desc"));
				objBean.setMainProductAvgCost(rs.getDouble("main_avg_cost"));
				objBean.setMainProductUnit(rs.getString("main_unit"));
				objBean.setMainProductPrice(rs.getDouble("main_product_price"));
				//---------------------
				objBean.getAltProductObj().setAltProductCode(rs.getString("alt_product_id"));
				objBean.getAltProductObj().setAltProductDesc(rs.getString("alt_item_desc"));
				objBean.getAltProductObj().setAltProductAvgCost(rs.getDouble("alt_avg_cost"));
				objBean.getAltProductObj().setAltProductUnit(rs.getString("alt_unit"));
				objBean.getAltProductObj().setAltProductPrice0exGST(rs.getDouble("alt_product_price"));
				objBean.getAltProductObj().setAltPromoPrice(rs.getDouble("alt_promo_price"));
//				System.out.println("ALt promo price :"+rs.getDouble("alt_promo_price"));
//				objBean.getAltProductObj().setAltProductDefaultPrice(rs.getDouble("alternative_default_price"));
//				altProductObj=new AlternateProductDetailBean();
//				altProductObj.setAltProductCode(rs.getString("alt_product_id"));
//				altProductObj.setAltProductDesc(rs.getString("alt_item_desc"));
//				altProductObj.setAltProductAvgCost(rs.getDouble("alt_avg_cost"));
//				altProductObj.setAltProductUnit(rs.getString("alt_unit"));
//				altProductObj.setAltProductPrice0exGST(rs.getDouble("alt_product_price"));
//				altProductObj.setAltProductDefaultPrice(rs.getDouble("alternative_default_price"));
//				objBean.setAltProductObj(altProductObj);
				
//				objBean.setAltProductCode(rs.getString("alt_product_id"));
//				objBean.setAltProductDesc(rs.getString("alt_item_desc"));
//				objBean.setAltProductAvgCost(rs.getDouble("alt_avg_cost"));
//				objBean.setAltProductUnit(rs.getString("alt_unit"));
//				objBean.setAltProductPrice0exGST(rs.getDouble("alt_product_price"));
//				objBean.setAltProductDefaultPrice(rs.getDouble("alternative_default_price"));
				arrayListBeans.add(objBean);	

			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return arrayListBeans;
	};
	
}
