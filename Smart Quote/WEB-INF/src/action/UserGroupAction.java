package action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.MenuBean;
import pojo.UserBean;
import responseBeans.MenuResponse;
import responseBeans.UserDetailResponse;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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
	private UserDetailResponse userDetailsResponse = new UserDetailResponse();

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

	public UserDetailResponse getUserDetailsResponse() {
		return userDetailsResponse;
	}

	public void setUserDetailsResponse(UserDetailResponse userDetailsResponse) {
		this.userDetailsResponse = userDetailsResponse;
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


		System.out.println("username : "+userGroupName+" \nmenu : "+allMenuJson);
		
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

	public String updateUserGroup() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		int userGroupId = Integer.parseInt(request.getParameter("userGroupId"));
		String allMenuJson = request.getParameter("checkedMenuList");
		ArrayList<MenuBean> menuList = new ArrayList<MenuBean>();
		menuList = new Gson().fromJson(allMenuJson,
				new TypeToken<List<MenuBean>>() {
				}.getType());
		if (userGroupId != 0) {
			UserGroupDao objDao = new UserGroupDao();
			boolean isDeleted = objDao.deleteUserGroupAccess(userGroupId);
			if (isDeleted) {
				objDao.logUserGroupAccess(userGroupId, menuList);
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("user_group_updated"));
			}
			objDao.commit();
			objDao.closeAll();
		}
		return SUCCESS;
	}

	public String getAssignedAccess() {
		UserGroupDao objUserGroupDao = new UserGroupDao();
		int userGroupId = 0;
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

	public String getUserList() {
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
		try {
			UserGroupDao objUserGroupDao = new UserGroupDao();
			valuePairBeans = objUserGroupDao.getUserList();
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

	public String createUser() {
		try {
			String userDetails = request.getParameter("userDetails");
			// userDetails =
			// "{\"userGroupId\":\"1\",\"userName\":\"Chetan Choudhari\",\"emailId\":\"chetan@giantleapsystems.com\",\"password\":\"chetan@123\",\"userType\":\"\",\"contact\":\"1324578920\",\"validFrom\":\"2012-12-01\",\"validTo\":\"2018-12-31\",\"language\":\"es\"}";
			
			System.out.println("userDetails: "+ userDetails);
			UserBean objUserBean = new UserBean();
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			objUserBean = gson.fromJson(userDetails, UserBean.class);
			boolean isUserCreated = false, isUserAlreadyRegistered = false;

			UserGroupDao objUserDao = new UserGroupDao();
			isUserAlreadyRegistered = objUserDao.isRegisterdUser(objUserBean
					.getEmailId());
			objUserDao.commit();
			objUserDao.closeAll();
			System.out.println("isUserAlreadyRegistered: "+ isUserAlreadyRegistered);
			if (!isUserAlreadyRegistered) {
				UserGroupDao objUserGroupDao = new UserGroupDao();
				isUserCreated = objUserGroupDao.saveUser(objUserBean);
				objUserGroupDao.commit();
				objUserGroupDao.closeAll();
				if (isUserCreated) {
					objEmptyResponse.setCode("success");
					objEmptyResponse.setMessage(getText("user_created"));
				} else {
					objEmptyResponse.setCode("error");
					objEmptyResponse.setMessage(getText("error_user_create"));
				}
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("error_user_exist"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getUserDetails() {
		int userId = Integer.parseInt(request.getParameter("userId"));
		try {
			userDetailsResponse.setCode("error");
			userDetailsResponse.setMessage(getText("common_error"));
			UserGroupDao objUserDao = new UserGroupDao();
			UserBean objUserBean = objUserDao.getUserDetails(userId);
			objUserDao.commit();
			objUserDao.closeAll();
			if (objUserBean != null) {
				userDetailsResponse.setCode("success");
				userDetailsResponse.setMessage(getText("details_loaded"));
				userDetailsResponse.setObjUserBean(objUserBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String updateUserDetails() {
		String userDetails = request.getParameter("userDetails");
		// userDetails =
		// "{\"userId\":\"3\",\"userGroupId\":\"1\",\"userName\":\"Chetan Choudhari(cc)\",\"emailId\":\"chetan@giantleapsystems.com\",\"password\":\"chetan@123\",\"userType\":\"\",\"contact\":\"1324578920\",\"validFrom\":\"2012-12-01\",\"validTo\":\"2018-12-31\",\"language\":\"es\"}";
		UserBean objUserBean = new UserBean();
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		objUserBean = gson.fromJson(userDetails, UserBean.class);
		boolean isUserUpdated = false;
		UserGroupDao objUserGroupDao = new UserGroupDao();
		isUserUpdated = objUserGroupDao.updateUser(objUserBean);
		objUserGroupDao.commit();
		objUserGroupDao.closeAll();

		if (isUserUpdated) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("user_updated"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String deleteUser() {
		int userId = Integer.parseInt(request.getParameter("userId"));
		UserGroupDao objDao = new UserGroupDao();
		boolean isDeleted = objDao.deleteUser(userId);
		objDao.commit();
		objDao.closeAll();
		if (isDeleted) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("user_deleted"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
}
