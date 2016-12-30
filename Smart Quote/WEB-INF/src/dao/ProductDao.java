package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.ProductBean;
import connection.ConnectionFactory;

public class ProductDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public ProductDao() {
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

	public ArrayList<KeyValuePairBean> getProductList(String productLike) {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getProdustList = "SELECT product_code, product_name FROM product_master "
				+ " WHERE product_code like ? OR product_name like ?";
		try {
			pstmt = conn.prepareStatement(getProdustList);
			pstmt.setString(1, productLike);
			pstmt.setString(2, productLike);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("product_code"));
				objKeyValuePairBean.setValue(rs.getString("product_name"));
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

	public boolean isProductExist(String productCode) {
		boolean isProductExist = false;
		String getUserGroups = "SELECT product_code FROM product_master WHERE product_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isProductExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isProductExist;
	}

	public boolean saveProduct(ProductBean objBean) {
		boolean isProductCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO product_master (product_code, product_name, product_group_id, "
					+ " unit, selling_price1, selling_price2, selling_price3, selling_price4, cost, gst_flag, created_by) "
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, objBean.getProductCode());
			pstmt.setString(2, objBean.getProductName());
			pstmt.setInt(3, objBean.getProductGroupId());
			pstmt.setString(4, objBean.getUnit());
			pstmt.setDouble(5, objBean.getSelligPrice1());
			pstmt.setDouble(6, objBean.getSelligPrice2());
			pstmt.setDouble(7, objBean.getSelligPrice3());
			pstmt.setDouble(8, objBean.getSelligPrice4());
			pstmt.setDouble(9, objBean.getCost());
			pstmt.setString(10, objBean.getGstFlag());
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

	public ProductBean getCustomerDetails(String productCode) {
		ProductBean objBean = null;
		String getUserGroups = "SELECT product_code, product_name, product_group_id, unit, selling_price1, "
				+ " selling_price2, selling_price3, selling_price4, cost, gst_flag, created_by "
				+ " FROM product_master WHERE product_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setProductCode(rs.getString("product_code"));
				objBean.setProductName(rs.getString("product_name"));
				objBean.setProductGroupId(rs.getInt("product_group_id"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setSelligPrice1(rs.getDouble("selling_price1"));
				objBean.setSelligPrice2(rs.getDouble("selling_price2"));
				objBean.setSelligPrice3(rs.getDouble("selling_price3"));
				objBean.setSelligPrice4(rs.getDouble("selling_price4"));
				objBean.setCost(rs.getDouble("cost"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setCreatedBy(rs.getString("created_by"));
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

	public boolean updateProduct(ProductBean objBean) {
		boolean isCustomerUpdated = false;
		try {
			String updateCustQuery = "UPDATE product_master SET product_name = ?, product_group_id = ?, unit = ?, "
					+ "selling_price1 = ?, selling_price2 = ?, selling_price3 = ?, selling_price4 = ?, cost = ?, "
					+ " gst_flag = ?, created_by = 0"
					+ " WHERE product_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, objBean.getProductName());
			pstmt.setInt(2, objBean.getProductGroupId());
			pstmt.setString(3, objBean.getUnit());
			pstmt.setDouble(4, objBean.getSelligPrice1());
			pstmt.setDouble(5, objBean.getSelligPrice2());
			pstmt.setDouble(6, objBean.getSelligPrice3());
			pstmt.setDouble(7, objBean.getSelligPrice4());
			pstmt.setDouble(8, objBean.getCost());
			pstmt.setString(9, objBean.getGstFlag());
			pstmt.setString(10, objBean.getProductCode());
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

	public boolean deleteProduct(String productCode) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM product_master WHERE product_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, productCode);
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
