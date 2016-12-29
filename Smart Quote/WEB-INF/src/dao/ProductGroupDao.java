package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.ProductGroupBean;
import connection.ConnectionFactory;

public class ProductGroupDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public ProductGroupDao() {
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

	public ArrayList<KeyValuePairBean> getProductList() {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getProdustList = "SELECT product_group_code, product_group_name FROM product_group";
		try {
			pstmt = conn.prepareStatement(getProdustList);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("product_group_code"));
				objKeyValuePairBean
						.setValue(rs.getString("product_group_name"));
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
		String getUserGroups = "SELECT product_group_code FROM product_group WHERE product_group_code = ?";
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

	public boolean saveProduct(ProductGroupBean objBean) {
		boolean isProductCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO product_group (product_group_code, product_group_name, catalogue_no) "
					+ " VALUES(?, ?, ?)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, objBean.getProductCode());
			pstmt.setString(2, objBean.getProductName());
			pstmt.setString(3, objBean.getCatalogueNo());
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

	public ProductGroupBean getCustomerDetails(String productGroupCode) {
		ProductGroupBean objBean = null;
		String getUserGroups = "SELECT product_group_code, product_group_name, catalogue_no "
				+ " FROM product_group WHERE product_group_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productGroupCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductGroupBean();
				objBean.setProductCode(rs.getString("product_group_code"));
				objBean.setProductName(rs.getString("product_group_name"));
				objBean.setCatalogueNo(rs.getString("catalogue_no"));
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

	public boolean updateProduct(ProductGroupBean objBean) {
		boolean isCustomerUpdated = false;
		try {
			String updateCustQuery = "UPDATE product_group SET product_group_name = ?, catalogue_no = ? "
					+ " WHERE product_group_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, objBean.getProductName());
			pstmt.setString(2, objBean.getCatalogueNo());
			pstmt.setString(3, objBean.getProductCode());
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

	public boolean deleteProductGroup(String productGroupCode) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM product_group WHERE product_group_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, productGroupCode);
//			pstmt.executeUpdate();
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
