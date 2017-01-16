package action;

import pojo.EmptyResponseBean;

import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
public class CommonLoadAction extends ActionSupport {
	public String action;
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	@Override
	public String execute() throws Exception {
		System.out.println("action = " + action);
		System.out.println("Session has been time out...!");
		objEmptyResponse.setCode("sessionTimeOut");
		objEmptyResponse.setMessage("Session Timeout...!");
		return SUCCESS;
	}

}
