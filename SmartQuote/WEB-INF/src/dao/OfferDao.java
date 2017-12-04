package dao;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.OfferBean;
import connection.ConnectionFactory;

public class OfferDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null, pstmt1 = null;

	public OfferDao() {
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

	public boolean isOfferExist(String Offer) {
		boolean isOfferExist = false;
		String queryString = "Select offer_name From offer_master where offer_name=?;";
		try {
			pstmt = conn.prepareStatement(queryString);
			pstmt.setString(1, Offer);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isOfferExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isOfferExist;
	}

	@SuppressWarnings("static-access")
	public int saveOffer(String offer) {
		String queryString = "INSERT IGNORE INTO offer_master (offer_name) VALUES (?);";
		int offerId = 0;
		try {
			pstmt = conn.prepareStatement(queryString, pstmt.RETURN_GENERATED_KEYS);
			pstmt.setString(1, offer);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if (rs.next())
				offerId = rs.getInt(1);
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return offerId;
	}

	public ArrayList<OfferBean> getOfferList(String offerFolderPath,String path,String altImagePath) {
		ArrayList<OfferBean> arrayOfferBean = new ArrayList<OfferBean>();
		OfferBean objOfferBean = null;
		String queryString = "Select id,offer_name From offer_master;";
		try {
			pstmt = conn.prepareStatement(queryString);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objOfferBean = new OfferBean();
				objOfferBean.setCode(rs.getString("id"));
				objOfferBean.setId(rs.getInt("id"));
				objOfferBean.setOfferName(rs.getString("offer_name"));
				String offerTemplate = path + "offer_template_" + rs.getInt("id") + ".png";
				String projectTemplatePath = System.getProperty("user.dir") + offerFolderPath ;
				File offerFile = new File(projectTemplatePath+"offer_template_" + rs.getInt("id") + ".png");
				if(!offerFile.exists()){
//					System.out.println("File not exist" + offerFile);
//				String altOfferTemplate=altPath;
					objOfferBean.setOfferTemplate(altImagePath);	
				}else{
					objOfferBean.setOfferTemplate(offerTemplate);	
				}
				arrayOfferBean.add(objOfferBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return arrayOfferBean;
	}

	public boolean deleteOffer(int offerId) {
		boolean isDeleted = false;
		String queryString = "DELETE FROM offer_master WHERE id=?;";
		try {
			pstmt = conn.prepareStatement(queryString);
			pstmt.setInt(1, offerId);
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

	public boolean updateOffer(OfferBean objBean) {
		boolean isUpdated = false;
		System.out.println("updateOffer");
		String queryString = "UPDATE offer_master SET offer_name=? WHERE id=?;";
		try {
			pstmt = conn.prepareStatement(queryString);
			pstmt.setString(1, objBean.getOfferName());
			pstmt.setInt(2, objBean.getId());
			System.out.println("PSTMT :: "+pstmt);
			int count = 0;
			count = pstmt.executeUpdate();
			System.out.println("COUNT ::"+count);
			if (count > 0)
				isUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isUpdated;
	}

}
