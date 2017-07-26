package responseBeans;

import java.util.ArrayList;

import pojo.AlternateProductBean;
import responseStructure.Response;

public class AlternativeProductResponseBean extends Response {
private ArrayList<AlternateProductBean> objAlternateProductBeans;

public ArrayList<AlternateProductBean> getObjAlternateProductBeans() {
	return objAlternateProductBeans;
}

public void setObjAlternateProductBeans(ArrayList<AlternateProductBean> objAlternateProductBeans) {
	this.objAlternateProductBeans = objAlternateProductBeans;
}


}
