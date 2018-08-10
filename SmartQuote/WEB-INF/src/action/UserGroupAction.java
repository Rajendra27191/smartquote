package action;

import interceptor.SessionInterceptor;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.MenuBean;
import pojo.UserBean;
import responseBeans.DetailResponseBean;
import responseBeans.MenuResponse;
import responseBeans.UserDetailResponse;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;

import dao.UserGroupDao;

@SuppressWarnings("serial")
public class UserGroupAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private MenuResponse menuResponse = new MenuResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private UserDetailResponse userDetailsResponse = new UserDetailResponse();
	private DetailResponseBean objDetailResponseBean = new DetailResponseBean();
	public File logoFile;

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
		System.out.println("SESSION : " + ServletActionContext.getRequest().getSession());
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
		SessionInterceptor interceptor = new SessionInterceptor();
		boolean v = interceptor.isLoggedIn(request);
		System.out.println("Session : " + v);
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

		System.out.println("username : " + userGroupName + " \nmenu : " + allMenuJson);

		ArrayList<MenuBean> menuList = new ArrayList<MenuBean>();
		menuList = new Gson().fromJson(allMenuJson, new TypeToken<List<MenuBean>>() {
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
		menuList = new Gson().fromJson(allMenuJson, new TypeToken<List<MenuBean>>() {
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
			menuResponse.setResult(objUserGroupDao.getAssignedAccess(userGroupId));
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
			System.out.println("userDetails: " + userDetails);

			UserBean objUserBean = new UserBean();
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			objUserBean = gson.fromJson(userDetails, UserBean.class);
			boolean isUserAlreadyRegistered = false;

			UserGroupDao objUserDao = new UserGroupDao();
			isUserAlreadyRegistered = objUserDao.isRegisterdUser(objUserBean.getEmailId());
			objUserDao.commit();
			objUserDao.closeAll();
			System.out.println("isUserAlreadyRegistered: " + isUserAlreadyRegistered);
			
			if (!isUserAlreadyRegistered) {
				UserGroupDao objUserGroupDao = new UserGroupDao();
				// isUserCreated = objUserGroupDao.saveUser(objUserBean);
				int userID = objUserGroupDao.saveUser(objUserBean);
			
				String extension = FilenameUtils.getExtension(objUserBean.getTemplateUrl());
				if (userID > 0) {
					if (logoFile != null) {
						String filename = "UserId_" + userID + ".png";
						boolean isLogoSaved = false;
						if (extension.equals("pdf")) {
							String destDirPath = System.getProperty("user.dir") + getText("sales_rep_template_folder_path");
							isLogoSaved = CommonLoadAction.convertPdfToImage(logoFile + "", destDirPath, filename);
						} else {
							isLogoSaved = CommonLoadAction.createTemplate(filename, logoFile, getText("sales_rep_template_folder_path"));
						}
						System.out.println("LOGO saved ::: " + filename + " : " + isLogoSaved);
						objDetailResponseBean.setGenratedUrl(getText("sales_rep_template_url") + filename);
					}
					if (objUserBean.getPaymentReminderEmailFlag().equalsIgnoreCase("yes")) {
						objUserGroupDao.setOtherUserPREmailFlagOff(userID, objUserBean.getEmailId());
					}
					objDetailResponseBean.setCode("success");
					objDetailResponseBean.setGenratedId(userID);
					objDetailResponseBean.setMessage(getText("user_created"));
				} else {
					objDetailResponseBean.setCode("error");
					objDetailResponseBean.setMessage(getText("error_user_create"));
				}
				objUserGroupDao.commit();
				objUserGroupDao.closeAll();
			} else {
				objDetailResponseBean.setCode("error");
				objDetailResponseBean.setMessage(getText("error_user_exist"));
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
			UserBean objUserBean = objUserDao.getUserDetails(userId, getText("sales_rep_template_url"));
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
		UserBean objUserBean = new UserBean();
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		objUserBean = gson.fromJson(userDetails, UserBean.class);
		boolean isUserUpdated = false;
		UserGroupDao objUserGroupDao = new UserGroupDao();
		isUserUpdated = objUserGroupDao.updateUser(objUserBean);
		
		String extension = FilenameUtils.getExtension(objUserBean.getTemplateUrl());
		if (isUserUpdated) {
			if (objUserBean.getPaymentReminderEmailFlag().equalsIgnoreCase("yes")) {
				System.out.println("in update");
				objUserGroupDao.setOtherUserPREmailFlagOff(objUserBean.getUserId(), objUserBean.getEmailId());
			}
			if (logoFile != null) {
				String filename = "UserId_" + objUserBean.getUserId() + ".png";
				File file = new File(filename);
				boolean isLogoSaved = false;
				if (file.exists()) {
					file.delete();
				}

				if (extension.equals("pdf")) {
					String destDirPath = System.getProperty("user.dir") + getText("sales_rep_template_folder_path");
					isLogoSaved = CommonLoadAction.convertPdfToImage(logoFile + "", destDirPath, filename);
					// System.out.println("1.LOGO saved ::: " + filename);
				} else {
					isLogoSaved = CommonLoadAction.createTemplate(filename, logoFile, getText("sales_rep_template_folder_path"));
					// System.out.println("2.LOGO saved ::: " + filename);
				}
			}
			objUserGroupDao.commit();
			objUserGroupDao.closeAll();
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
			String filename = "UserId_" + userId + ".png";
			CommonLoadAction.deleteTemplate(filename, getText("sales_rep_template_folder_path"));
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("user_deleted"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}
	
	public String getPaymentReminderFlagUser() {
		try {
			UserGroupDao objUserDao = new UserGroupDao();
			UserBean objUserBean = objUserDao.checkIfAnyUserHavePREmailFlagOn();
			objUserDao.closeAll();
			userDetailsResponse.setCode("success");
			userDetailsResponse.setMessage(getText("details_loaded"));
			userDetailsResponse.setObjUserBean(objUserBean);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public DetailResponseBean getObjDetailResponseBean() {
		return objDetailResponseBean;
	}

	public void setObjDetailResponseBean(DetailResponseBean objDetailResponseBean) {
		this.objDetailResponseBean = objDetailResponseBean;
	}
}
