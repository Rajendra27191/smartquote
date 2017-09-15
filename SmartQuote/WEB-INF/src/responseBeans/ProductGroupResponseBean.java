package responseBeans;

import pojo.ProductGroupBean;
import responseStructure.Response;

public class ProductGroupResponseBean extends Response {
	private ProductGroupBean objResponseBean = new ProductGroupBean();

	public ProductGroupBean getObjResponseBean() {
		return objResponseBean;
	}

	public void setObjResponseBean(ProductGroupBean objResponseBean) {
		this.objResponseBean = objResponseBean;
	}

}
