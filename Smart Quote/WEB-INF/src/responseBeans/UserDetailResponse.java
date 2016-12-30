package responseBeans;

import pojo.UserBean;
import responseStructure.Response;

public class UserDetailResponse extends Response {
	UserBean objUserBean = new UserBean();

	public UserBean getObjUserBean() {
		return objUserBean;
	}

	public void setObjUserBean(UserBean objUserBean) {
		this.objUserBean = objUserBean;
	}

}
