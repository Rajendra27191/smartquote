package action;

import java.util.ArrayList;

import pojo.KeyValuePairBean;
import responseBeans.MenuResponse;
import responseBeans.UserGroupResponse;

import com.opensymphony.xwork2.ActionSupport;

import dao.UserGroupDao;

@SuppressWarnings("serial")
public class UserGroupAction extends ActionSupport {
	private UserGroupResponse data = new UserGroupResponse();
	private MenuResponse menuResponse = new MenuResponse();

	public UserGroupResponse getData() {
		return data;
	}

	public void setData(UserGroupResponse data) {
		this.data = data;
	}

	public MenuResponse getMenuResponse() {
		return menuResponse;
	}

	public void setMenuResponse(MenuResponse menuResponse) {
		this.menuResponse = menuResponse;
	}

	/**
	 * 
	 */

	public String getUserGroups() {
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
		UserGroupDao objUserGroupDao = new UserGroupDao();
		try {
			valuePairBeans = objUserGroupDao.getUserGroupList();
			objUserGroupDao.CloseAll();
			data.setCode("success");
			data.setMessage("List Loaded...!");
			data.setResult(valuePairBeans);
		} catch (Exception e) {
			data.setCode("error");
			data.setMessage("Error, Please try again...!");
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getMenuAndSubmenu() {
		UserGroupDao objUserGroupDao = new UserGroupDao();
		try {
			menuResponse.setCode("success");
			menuResponse.setMessage("List Loaded...!");
			menuResponse.setResult(objUserGroupDao.getAllMenus());
			objUserGroupDao.CloseAll();
		} catch (Exception e) {
			menuResponse.setCode("error");
			menuResponse.setMessage("Error, Please try again...!");
			e.printStackTrace();
		}
		//System.out.println("Menu Response: "+ new Gson().toJson(menuResponse));
		return SUCCESS;
	}

}
