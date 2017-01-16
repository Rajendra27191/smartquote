package action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.MenuBean;
import responseBeans.MenuResponse;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;

import dao.UserGroupDao;

@SuppressWarnings("serial")
public class UserGroupAction extends ActionSupport implements
		ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private MenuResponse menuResponse = new MenuResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

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

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	/**
	 * 
	 */

	public String getUserGroups() {
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
		UserGroupDao objUserGroupDao = new UserGroupDao();
		try {
			valuePairBeans = objUserGroupDao.getUserGroupList();
			objUserGroupDao.commit();
			objUserGroupDao.closeAll();
			data.setCode("success");
			data.setMessage(getText("list_loaded"));
			data.setResult(valuePairBeans);
		} catch (Exception e) {
			data.setCode("error");
			data.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getMenuAndSubmenu() {
		UserGroupDao objUserGroupDao = new UserGroupDao();
		try {
			menuResponse.setCode("success");
			menuResponse.setMessage(getText("list_loaded"));
			menuResponse.setResult(objUserGroupDao.getAllMenus());
			objUserGroupDao.commit();
			objUserGroupDao.closeAll();
		} catch (Exception e) {
			menuResponse.setCode("error");
			menuResponse.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String createUserGroup() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_creating_user_group"));
		String userGroupName = request.getParameter("userGroupName");
		String allMenuJson = request.getParameter("checkedMenuList");
		//userGroupName = "Sales Person";

		System.out.println("username : "+userGroupName+" \nmenu : "+allMenuJson);
		
		
		// Dummy Data
	    /*allMenuJson = "[{\"menuId\":1,\"menuName\":\"Home\",\"subMenuBeans\":[]},"
				+ "{\"menuId\":2,\"menuName\":\"Manage\",\"subMenuBeans\":[{\"subMenuId\":1,\"subMenuName\":\"Manage User Group\"},"
				+ "{\"subMenuId\":2,\"subMenuName\":\"Manage User\"},{\"subMenuId\":3,\"subMenuName\":\"Manage Customer\"}]},"
			ecli	+ "{\"menuId\":3,\"menuName\":\"Profile\",\"subMenuBeans\":[{\"subMenuId\":5,\"subMenuName\":\"Logout\"}]}]";*/
		ArrayList<MenuBean> menuList = new ArrayList<MenuBean>();
		menuList = new Gson().fromJson(allMenuJson,
				new TypeToken<List<MenuBean>>() {
				}.getType());
		UserGroupDao objDao = new UserGroupDao();
		int userGroupId = objDao.createUserGroup(userGroupName);
		if (userGroupId != 0) {
			boolean isDeleted = objDao.deleteUserGroupAccess(userGroupId);
			if (isDeleted) {
				objDao.logUserGroupAccess(userGroupId, menuList);
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("user_group_created"));
			}
		}
		objDao.commit();
		objDao.closeAll();
		return SUCCESS;
	}

	public String updateUserGroup(){
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_creating_user_group"));
		String userGroupName = request.getParameter("userGroupName");
		String allMenuJson = request.getParameter("checkedMenuList");

		ArrayList<MenuBean> menuList = new ArrayList<MenuBean>();
		menuList = new Gson().fromJson(allMenuJson,
				new TypeToken<List<MenuBean>>() {
				}.getType());
		UserGroupDao objDao = new UserGroupDao();
		int userGroupId = objDao.createUserGroup(userGroupName);
		if (userGroupId != 0) {
			boolean isDeleted = objDao.deleteUserGroupAccess(userGroupId);
			if (isDeleted) {
				objDao.logUserGroupAccess(userGroupId, menuList);
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("user_group_created"));
			}
		}
		objDao.commit();
		objDao.closeAll();
		return SUCCESS;
	}
	
	public String getAssignedAccess() {
		UserGroupDao objUserGroupDao = new UserGroupDao();
		int userGroupId=0;
		userGroupId = Integer.parseInt(request.getParameter("userGroupId"));
		try {
			menuResponse.setCode("success");
			menuResponse.setMessage(getText("list_loaded"));
			menuResponse.setResult(objUserGroupDao
					.getAssignedAccess(userGroupId));
			objUserGroupDao.commit();
			objUserGroupDao.closeAll();
		} catch (Exception e) {
			menuResponse.setCode("error");
			menuResponse.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String deleteUserGroup() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_deleting_user_group"));
		int userGroupId = Integer.parseInt(request.getParameter("userGroupId"));

		UserGroupDao objDao = new UserGroupDao();
		boolean isDeleted = objDao.deleteUserGroup(userGroupId);
		if (isDeleted) {
			objDao.deleteUserGroupAccess(userGroupId);
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("user_group_deleted"));
		}
		objDao.commit();
		objDao.closeAll();
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
}
