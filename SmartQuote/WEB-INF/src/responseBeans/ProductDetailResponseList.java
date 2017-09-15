package responseBeans;

import java.util.ArrayList;

import pojo.ProductBean;
import responseStructure.Response;

public class ProductDetailResponseList extends Response {
	ArrayList<ProductBean> objProductDetailResponseList = new ArrayList<ProductBean>();

	public ArrayList<ProductBean> getObjProductDetailResponseList() {
		return objProductDetailResponseList;
	}

	public void setObjProductDetailResponseList(
			ArrayList<ProductBean> objProductDetailResponseList) {
		this.objProductDetailResponseList = objProductDetailResponseList;
	}

}
