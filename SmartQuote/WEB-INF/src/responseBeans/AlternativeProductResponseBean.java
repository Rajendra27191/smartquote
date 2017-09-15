package responseBeans;

import java.util.ArrayList;

import pojo.AlternateProductBean;
import pojo.ProductBean;
import responseStructure.Response;

public class AlternativeProductResponseBean extends Response {
private ArrayList<AlternateProductBean> objAlternateProductBeans;

public ArrayList<AlternateProductBean> getObjAlternateProductBeans() {
	return objAlternateProductBeans;
}

public void setObjAlternateProductBeans(ArrayList<AlternateProductBean> objAlternateProductBeans) {
	this.objAlternateProductBeans = objAlternateProductBeans;
}
	private ArrayList<ProductBean> arrayProductBeans;

	public ArrayList<ProductBean> getArrayProductBeans() {
		return arrayProductBeans;
	}

	public void setArrayProductBeans(ArrayList<ProductBean> arrayProductBeans) {
		this.arrayProductBeans = arrayProductBeans;
	}

	

}
