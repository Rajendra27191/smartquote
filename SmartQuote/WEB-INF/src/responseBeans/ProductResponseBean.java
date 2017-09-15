package responseBeans;

import pojo.ProductBean;
import responseStructure.Response;

public class ProductResponseBean extends Response {
	private ProductBean objProductResponseBean = new ProductBean();

	public ProductBean getObjProductResponseBean() {
		return objProductResponseBean;
	}

	public void setObjProductResponseBean(ProductBean objProductResponseBean) {
		this.objProductResponseBean = objProductResponseBean;
	}

}
