package responseBeans;
import java.util.ArrayList;

import pojo.MenuBean;
import responseStructure.Response;

public class MenuResponse extends Response {
	private ArrayList<MenuBean> result = new ArrayList<MenuBean>();

	public ArrayList<MenuBean> getResult() {
		return result;
	}

	public void setResult(ArrayList<MenuBean> result) {
		this.result = result;
	}

}
