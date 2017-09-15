package responseBeans;

import java.util.ArrayList;

import pojo.MenuBean;
import pojo.UserBean;
import responseStructure.Response;

public class LoginResponseBean extends Response {
	private ArrayList<MenuBean> result = new ArrayList<MenuBean>();
	private UserBean userData= new UserBean();
	public ArrayList<MenuBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<MenuBean> result) {
		this.result = result;
	}

	public UserBean getUserData() {
		return userData;
	}

	public void setUserData(UserBean userData) {
		this.userData = userData;
	}

	

}
