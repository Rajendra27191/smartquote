package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductGroupBean;
import responseBeans.ProductGroupResponseBean;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.ProductDao;

@SuppressWarnings("serial")
public class ProductGroupAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private ProductGroupResponseBean productGroupDetailsResponse = new ProductGroupResponseBean();

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

	public ProductGroupResponseBean getProductGroupDetailsResponse() {
		return productGroupDetailsResponse;
	}

	public void setProductGroupDetailsResponse(
			ProductGroupResponseBean productGroupDetailsResponse) {
		this.productGroupDetailsResponse = productGroupDetailsResponse;
	}

	public String getProductGroupList() {
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
		try {
			ProductDao objDao = new ProductDao();
			valuePairBeans = objDao.getProductList();
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

	public String createProductGroup() {
		String productDetails = request.getParameter("productDetails");
		// productDetails =
		// "{\"productCode\":\"pro242Ink\",\"productName\":\"Gel Ink\",\"catalogueNo\":\"\"}";
		ProductGroupBean objBean = new ProductGroupBean();
		objBean = new Gson().fromJson(productDetails, ProductGroupBean.class);
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

	public String getProductGroupDetails() {
		String productGroupCode = request.getParameter("productGroupCode");
		// productGroupCode = "pro242Ink";
		try {
			productGroupDetailsResponse.setCode("error");
			productGroupDetailsResponse.setMessage(getText("common_error"));
			ProductDao objDao = new ProductDao();
			ProductGroupBean objBean = objDao
					.getCustomerDetails(productGroupCode);
			objDao.commit();
			objDao.closeAll();
			if (objBean != null) {
				productGroupDetailsResponse.setCode("success");
				productGroupDetailsResponse
						.setMessage(getText("details_loaded"));
				productGroupDetailsResponse.setObjResponseBean(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String updateProductGroupDetails() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("error_creating_user_group"));

		String productDetails = request.getParameter("productDetails");
//		productDetails = "{\"productCode\":\"pro242Ink\",\"productName\":\"Gel\",\"catalogueNo\":\"\"}";
		ProductGroupBean objBean = new ProductGroupBean();
		objBean = new Gson().fromJson(productDetails, ProductGroupBean.class);
		boolean isProductGroupUpdated = false;

		ProductDao objDao1 = new ProductDao();
		isProductGroupUpdated = objDao1.updateProduct(objBean);
		objDao1.commit();
		objDao1.closeAll();
		if (isProductGroupUpdated) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_updated"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String deleteProductGroup() {
		String productGroupCode = request.getParameter("productGroupCode");
//		productGroupCode = "pro242Ink";
		ProductDao objDao = new ProductDao();
		boolean isDeleted = objDao.deleteProductGroup(productGroupCode);
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
