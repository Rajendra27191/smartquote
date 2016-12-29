package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import responseBeans.ProductResponseBean;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.ProductDao;

@SuppressWarnings("serial")
public class ProductAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private ProductResponseBean productDetailsResponse = new ProductResponseBean();

	public UserGroupResponse getData() {
		return data;
	}

	public void setData(UserGroupResponse data) {
		this.data = data;
	}

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public ProductResponseBean getProductDetailsResponse() {
		return productDetailsResponse;
	}

	public void setProductDetailsResponse(
			ProductResponseBean productDetailsResponse) {
		this.productDetailsResponse = productDetailsResponse;
	}

	public String getProductList() {
		String productLike = request.getParameter("prodLike");
		// productLike = "nk";
		productLike = "%" + productLike + "%";
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
		try {
			ProductDao objDao = new ProductDao();
			valuePairBeans = objDao.getProductList(productLike);
			objDao.commit();
			objDao.closeAll();
			data.setCode("success");
			data.setMessage(getText("list_loaded"));
			data.setResult(valuePairBeans);
		} catch (Exception e) {
			data.setCode("error");
			data.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String createProduct() {
		String productDetails = request.getParameter("productDetails");
		// productDetails =
		// "{\"productCode\":\"PROD342PEN\",\"productName\":\"BALL PEN\",\"productGroupId\":1,\"unit\":\"Piece\",\"selligPrice1\":\"15\",\"selligPrice2\":\"16\",\"selligPrice3\":\"17\",\"selligPrice4\":\"18\",\"cost\":\"16\",\"gstFlag\":\"Y\",\"createdBy\":\"0\"}";
		ProductBean objBean = new ProductBean();
		objBean = new Gson().fromJson(productDetails, ProductBean.class);
		boolean isProductCreated = false, isProductExist = false;

		ProductDao objDao = new ProductDao();
		isProductExist = objDao.isProductExist(objBean.getProductCode());
		objDao.commit();
		objDao.closeAll();
		if (!isProductExist) {
			ProductDao objDao1 = new ProductDao();
			isProductCreated = objDao1.saveProduct(objBean);
			objDao1.commit();
			objDao1.closeAll();
			if (isProductCreated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("product_created"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_product_exist"));
		}
		return SUCCESS;
	}

	public String getProductDetails() {
		String productCode = request.getParameter("productGroupCode");
		// productCode = "1";
		try {
			productDetailsResponse.setCode("error");
			productDetailsResponse.setMessage(getText("common_error"));
			ProductDao objDao = new ProductDao();
			ProductBean objBean = objDao.getCustomerDetails(productCode);
			objDao.commit();
			objDao.closeAll();
			if (objBean != null) {
				productDetailsResponse.setCode("success");
				productDetailsResponse.setMessage(getText("details_loaded"));
				productDetailsResponse.setObjProductResponseBean(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String updateProductDetails() {
		String productDetails = request.getParameter("productDetails");
		// productDetails =
		// "{\"productCode\":\"PROD342PEN\",\"productName\":\"BALL-PEN\",\"productGroupId\":1,\"unit\":\"Piece\",\"selligPrice1\":\"15\",\"selligPrice2\":\"16\",\"selligPrice3\":\"17\",\"selligPrice4\":\"18\",\"cost\":\"16\",\"gstFlag\":\"Y\",\"createdBy\":\"0\"}";
		ProductBean objBean = new ProductBean();
		objBean = new Gson().fromJson(productDetails, ProductBean.class);
		boolean isProductUpdated = false;

		ProductDao objDao1 = new ProductDao();
		isProductUpdated = objDao1.updateProduct(objBean);
		objDao1.commit();
		objDao1.closeAll();
		if (isProductUpdated) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_updated"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String deleteProduct() {
		String productCode = request.getParameter("productCode");
//		productCode = "1";
		ProductDao objDao = new ProductDao();
		boolean isDeleted = objDao.deleteProduct(productCode);
		objDao.commit();
		objDao.closeAll();
		if (isDeleted) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_deleted"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
