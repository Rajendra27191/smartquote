package responseBeans;
import java.util.ArrayList;
import pojo.ProductGroupBean;
import responseStructure.Response;
public class ProductGroupDetailResponseList extends Response {
	ArrayList<ProductGroupBean> objProductGroupDetailResponseList = new ArrayList<ProductGroupBean>();

	public ArrayList<ProductGroupBean> getObjProductGroupDetailResponseList() {
		return objProductGroupDetailResponseList;
	}

	public void setObjProductGroupDetailResponseList(ArrayList<ProductGroupBean> objProductGroupDetailResponseList) {
		this.objProductGroupDetailResponseList = objProductGroupDetailResponseList;
	}

	


}
