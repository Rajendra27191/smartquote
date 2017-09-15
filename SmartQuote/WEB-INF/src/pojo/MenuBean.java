package pojo;

import java.util.ArrayList;

public class MenuBean {

	private int menuId;
	private String menuName;
	private ArrayList<SubMenuBean> subMenuBeans = new ArrayList<SubMenuBean>();
	
	public int getMenuId() {
		return menuId;
	}
	public void setMenuId(int menuId) {
		this.menuId = menuId;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public ArrayList<SubMenuBean> getSubMenuBeans() {
		return subMenuBeans;
	}
	public void setSubMenuBeans(ArrayList<SubMenuBean> subMenuBeans) {
		this.subMenuBeans = subMenuBeans;
	}
	
	
}
