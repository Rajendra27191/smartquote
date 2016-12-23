package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.MenuBean;
import pojo.SubMenuBean;
import connection.ConnectionFactory;

public class UserGroupDao {
	Connection conn = null;
	ResultSet rs,rs1 = null;
	PreparedStatement pstmt,pstmt1 = null;

	public UserGroupDao() {
		conn = new ConnectionFactory().getConnection();
	}

	public ArrayList<KeyValuePairBean> getUserGroupList() {
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		String getUserGroups = "SELECT user_group_id,user_group_name FROM user_group";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setKey(rs.getInt("user_group_id"));
				objKeyValuePairBean.setValue(rs.getString("user_group_name"));
				pairBeans.add(objKeyValuePairBean);
			}

		} catch (Exception e) {
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
		String getSubMenus = " SELECT sub_menu_id,sub_menu_name,menu_id FROM sub_menu_master where menu_id=?";
		
		try {
			pstmt = conn.prepareStatement(getMenus);
			rs = pstmt.executeQuery();
			//System.out.println("@@@  exe : "+pstmt);
			while(rs.next())
			{
				objMenuBean = new MenuBean();
				objMenuBean.setMenuId(rs.getInt("menu_id"));
				objMenuBean.setMenuName(rs.getString("menu_name"));
				
				pstmt1 = conn.prepareStatement(getSubMenus);
				pstmt1.setInt(1, rs.getInt("menu_id"));
				rs1= pstmt1.executeQuery();
				//System.out.println("@@@  exe 1 : "+pstmt1);
				objSubMenuList = new ArrayList<SubMenuBean>();
				while(rs1.next())
				{
					if(rs1.getString("sub_menu_name")!=null)
					{
					objSubMenuBean = new SubMenuBean();
					objSubMenuBean.setSubMenuId(rs1.getInt("sub_menu_id"));
					objSubMenuBean.setSubMenuName(rs1.getString("sub_menu_name"));
					objSubMenuList.add(objSubMenuBean);
					}
				}
				objMenuBean.setSubMenuBeans(objSubMenuList);
				menuList.add(objMenuBean);
			}
			

		} catch (Exception e) {
			e.printStackTrace();
		}
		return menuList;
	}

	public void CloseAll() {
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
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
