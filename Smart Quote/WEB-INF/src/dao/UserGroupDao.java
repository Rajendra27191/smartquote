package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.MenuBean;
import pojo.SubMenuBean;
import connection.ConnectionFactory;

public class UserGroupDao {
	Connection conn = null;
	ResultSet rs, rs1 = null;
	PreparedStatement pstmt, pstmt1 = null;

	public UserGroupDao() {
		conn = new ConnectionFactory().getConnection();
		try {
			conn.setAutoCommit(false);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void closeAll() {
		try {
			if (conn != null) {
				conn.close();
			}
			if (rs != null) {
				rs.close();
			}
			if (pstmt != null) {
				pstmt.close();
			}
			if (rs1 != null) {
				rs1.close();
			}
			if (pstmt1 != null) {
				pstmt1.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public ArrayList<KeyValuePairBean> getUserGroupList() {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getUserGroups = "SELECT user_group_id,user_group_name FROM user_group";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			rs = pstmt.executeQuery();
			System.out.println("EXE : "+pstmt);
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setKey(rs.getInt("user_group_id"));
				objKeyValuePairBean.setValue(rs.getString("user_group_name"));
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

	public ArrayList<MenuBean> getAllMenus() {
		ArrayList<MenuBean> menuList = new ArrayList<MenuBean>();
		MenuBean objMenuBean = null;
		ArrayList<SubMenuBean> objSubMenuList = null;
		SubMenuBean objSubMenuBean;
		String getMenus = " SELECT menu_id,menu_name FROM menu_master ";
		String getSubMenus = "SELECT sub_menu_id, sub_menu_name, menu_id FROM sub_menu_master WHERE menu_id = ?";
		try {
			pstmt = conn.prepareStatement(getMenus);
			rs = pstmt.executeQuery();
			System.out.println("EXE MENU  : "+pstmt);
			while (rs.next()) {
				objMenuBean = new MenuBean();
				objMenuBean.setMenuId(rs.getInt("menu_id"));
				objMenuBean.setMenuName(rs.getString("menu_name"));

				pstmt1 = conn.prepareStatement(getSubMenus);
				pstmt1.setInt(1, rs.getInt("menu_id"));
				rs1 = pstmt1.executeQuery();
				objSubMenuList = new ArrayList<SubMenuBean>();
				while (rs1.next()) {
					if (rs1.getString("sub_menu_name") != null) {
						objSubMenuBean = new SubMenuBean();
						objSubMenuBean.setSubMenuId(rs1.getInt("sub_menu_id"));
						objSubMenuBean.setSubMenuName(rs1
								.getString("sub_menu_name"));
						objSubMenuList.add(objSubMenuBean);
					}
				}
				objMenuBean.setSubMenuBeans(objSubMenuList);
				menuList.add(objMenuBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return menuList;
	}

	public int createUserGroup(String userGroupName) {
		int userGroupId = 0;
		try {
			String userGroupQuery = "INSERT IGNORE INTO user_group (user_group_name) VALUES(?)";
			PreparedStatement pstmt = conn.prepareStatement(userGroupQuery,
					PreparedStatement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, userGroupName);
			pstmt.executeUpdate();
			ResultSet rs = pstmt.getGeneratedKeys();
			while (rs.next()) {
				userGroupId = rs.getInt(1);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return userGroupId;
	}

	public void logUserGroupAccess(int userGroupId, ArrayList<MenuBean> menuList) {
		try {
			String userGroupQuery = "INSERT IGNORE INTO user_group_access (user_group_id, menu_id, sub_menu_id) VALUES(?, ?, ?)";
			pstmt = conn.prepareStatement(userGroupQuery);
			final int batchSize = 100;
			int count = 0;

			for (int i = 0; i < menuList.size(); i++) {
				if (menuList.get(i).getSubMenuBeans() != null
						&& menuList.get(i).getSubMenuBeans().size() > 0) {
					for (int j = 0; j < menuList.get(i).getSubMenuBeans()
							.size(); j++) {
						pstmt.setInt(1, userGroupId);
						pstmt.setInt(2, menuList.get(i).getMenuId());
						pstmt.setInt(3, menuList.get(i).getSubMenuBeans()
								.get(j).getSubMenuId());
						pstmt.addBatch();
					}
				} else {
					pstmt.setInt(1, userGroupId);
					pstmt.setInt(2, menuList.get(i).getMenuId());
					pstmt.setInt(3, 0);
					pstmt.addBatch();
				}

				if (++count % batchSize == 0) {
					System.out.println("Query1: " + pstmt.toString());
					pstmt.executeBatch();
				}
			}
			System.out.println("\nQuery2: " + pstmt.toString());
			pstmt.executeBatch(); // insert remaining records
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
	}

	public boolean deleteUserGroupAccess(int userGroupId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM user_group_access WHERE user_group_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, userGroupId);
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

	public void commit() {
		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public ArrayList<MenuBean> getAssignedAccess(int userGroupId) {
		ArrayList<MenuBean> menuList = new ArrayList<MenuBean>();
		MenuBean objMenuBean = null;
		ArrayList<SubMenuBean> objSubMenuList = null;
		SubMenuBean objSubMenuBean;
		String getMenus = "SELECT b.menu_name, b.menu_id "
				+ " FROM menu_master b, user_group_access a "
				+ " WHERE a.menu_id = b.menu_id and user_group_id = ? group by 2";
		String getSubMenus = "SELECT c.sub_menu_id, c.sub_menu_name "
				+ " FROM user_group_access a, sub_menu_master c "
				+ " WHERE a.sub_menu_id = c.sub_menu_id and a.menu_id = ? and  user_group_id = ?";
		try {
			pstmt = conn.prepareStatement(getMenus);
			pstmt.setInt(1, userGroupId);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objMenuBean = new MenuBean();
				objMenuBean.setMenuId(rs.getInt("menu_id"));
				objMenuBean.setMenuName(rs.getString("menu_name"));

				pstmt1 = conn.prepareStatement(getSubMenus);
				pstmt1.setInt(1, rs.getInt("menu_id"));
				pstmt1.setInt(2, userGroupId);
				rs1 = pstmt1.executeQuery();
				objSubMenuList = new ArrayList<SubMenuBean>();
				while (rs1.next()) {
					if (rs1.getString("sub_menu_name") != null) {
						objSubMenuBean = new SubMenuBean();
						objSubMenuBean.setSubMenuId(rs1.getInt("sub_menu_id"));
						objSubMenuBean.setSubMenuName(rs1
								.getString("sub_menu_name"));
						objSubMenuList.add(objSubMenuBean);
					}
				}
				objMenuBean.setSubMenuBeans(objSubMenuList);
				menuList.add(objMenuBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return menuList;
	}

	public boolean deleteUserGroup(int userGroupId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM user_group WHERE user_group_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, userGroupId);
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
