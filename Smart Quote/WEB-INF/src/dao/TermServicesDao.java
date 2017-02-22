package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import connection.ConnectionFactory;

public class TermServicesDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public TermServicesDao() {
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

	public ArrayList<KeyValuePairBean> getAllTermsConditions() {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getProdustList = "SELECT id, term_condition FROM term_condition_master";
		try {
			pstmt = conn.prepareStatement(getProdustList);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("id"));
				objKeyValuePairBean
						.setKey(Integer.parseInt(rs.getString("id")));
				objKeyValuePairBean.setValue(rs.getString("term_condition"));
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

	public boolean isTermConditionExist(String termCondition) {
		boolean isTermConditionExist = false;
		String getUserGroups = "SELECT term_condition FROM term_condition_master WHERE term_condition = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, termCondition);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isTermConditionExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermConditionExist;
	}

	public boolean saveTermCondition(String termCondition) {
		boolean isTermCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO term_condition_master (term_condition) VALUES (?)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, termCondition);
			pstmt.executeUpdate();
			isTermCreated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermCreated;
	}

	public boolean isTermConditionExistForUpdate(String termCondition, int id) {
		boolean isTermConditionExist = false;
		String getUserGroups = "SELECT term_condition FROM term_condition_master WHERE term_condition = ? AND id != ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, termCondition);
			pstmt.setInt(2, id);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isTermConditionExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermConditionExist;
	}

	public boolean updateTermCondition(String termCondition, int id) {
		boolean isTermUpdated = false;
		try {
			String updateCustQuery = "UPDATE term_condition_master SET term_condition = ? WHERE id = ?";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, termCondition);
			pstmt.setInt(2, id);
			pstmt.executeUpdate();
			isTermUpdated = true;
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermUpdated;
	}

	public boolean deleteTermCondition(int termId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM term_condition_master WHERE id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, termId);
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

	public boolean deleteTermFromQuote(int termId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_term_condition_master WHERE term_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, termId);
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

	public ArrayList<KeyValuePairBean> getAllServices() {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getProdustList = "SELECT id, service FROM service_master";
		try {
			pstmt = conn.prepareStatement(getProdustList);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("id"));
				objKeyValuePairBean
						.setKey(Integer.parseInt(rs.getString("id")));
				objKeyValuePairBean.setValue(rs.getString("service"));
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

	public boolean isServiceExist(String service) {
		boolean isTermConditionExist = false;
		String getUserGroups = "SELECT service FROM service_master WHERE service = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, service);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isTermConditionExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermConditionExist;
	}

	public boolean saveService(String service) {
		boolean isTermCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO service_master (service) VALUES (?)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, service);
			pstmt.executeUpdate();
			isTermCreated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermCreated;
	}

	public boolean isServiceExistForUpdate(String service, int id) {
		boolean isTermConditionExist = false;
		String getUserGroups = "SELECT service FROM service_master WHERE service = ? AND id != ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, service);
			pstmt.setInt(2, id);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isTermConditionExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermConditionExist;
	}

	public boolean updateService(String service, int id) {
		boolean isTermUpdated = false;
		try {
			String updateCustQuery = "UPDATE service_master SET service = ? WHERE id = ?";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, service);
			pstmt.setInt(2, id);
			pstmt.executeUpdate();
			isTermUpdated = true;
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isTermUpdated;
	}

	public boolean deleteService(int serviceId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM service_master WHERE id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, serviceId);
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

	public boolean deleteServiceFromQuote(int serviceId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_service_master WHERE service_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, serviceId);
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
