package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.ProductGroupBean;
import responseBeans.ProductDetailResponseList;
import responseBeans.ProductGroupDetailResponseList;
import responseBeans.ProductGroupResponseBean;
import responseBeans.UserGroupResponse;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.ProductDao;
import dao.ProductGroupDao;

@SuppressWarnings("serial")
public class ProductGroupAction extends ActionSupport implements
		ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private ProductGroupResponseBean productGroupDetailsResponse = new ProductGroupResponseBean();
	private ProductGroupDetailResponseList objProductGroupDetailResponseList = new ProductGroupDetailResponseList();

	public ProductGroupDetailResponseList getObjProductGroupDetailResponseList() {
		return objProductGroupDetailResponseList;
	}

	public void setObjProductGroupDetailResponseList(ProductGroupDetailResponseList objProductGroupDetailResponseList) {
		this.objProductGroupDetailResponseList = objProductGroupDetailResponseList;
	}

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
			ProductGroupDao objDao = new ProductGroupDao();
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
	
	public String getProductGroupListView() {
		try {
			ProductGroupDao objDao = new ProductGroupDao();
			ArrayList<ProductGroupBean> objProductGroupBeans = new ArrayList<ProductGroupBean>();
			objProductGroupBeans = objDao.getAllProductGroupDetails();
			objDao.commit();
			objDao.closeAll();
			objProductGroupDetailResponseList.setCode("success");
			objProductGroupDetailResponseList.setMessage(getText("details_loaded"));
			objProductGroupDetailResponseList.setObjProductGroupDetailResponseList(objProductGroupBeans);
		} catch (Exception e) {
			objProductGroupDetailResponseList.setCode("error");
			objProductGroupDetailResponseList.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}


	public String createProductGroup() {
		String productDetails = request.getParameter("productDetails");
		// productDetails = "{\"productCode\":\"pro242Ink\",\"productName\":\"Gel Ink\",\"catalogueNo\":\"\"}";
		ProductGroupBean objBean = new ProductGroupBean();
		objBean = new Gson().fromJson(productDetails, ProductGroupBean.class);
		boolean isProductCreated = false, isProductExist = false;

		ProductGroupDao objDao = new ProductGroupDao();
		isProductExist = objDao.isProductExist(objBean.getProductCode());
		objDao.commit();
		objDao.closeAll();
		if (!isProductExist) {
			ProductGroupDao objDao1 = new ProductGroupDao();
			isProductCreated = objDao1.saveProduct(objBean);
			objDao1.commit();
			objDao1.closeAll();
			if (isProductCreated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("product_group_created"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("common_error"));
			}
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_product_group_exist"));
		}
		return SUCCESS;
	}

	public String getProductGroupDetails() {
		String productGroupCode = request.getParameter("productGroupCode");
		// productGroupCode = "pro242Ink";
		try {
			productGroupDetailsResponse.setCode("error");
			productGroupDetailsResponse.setMessage(getText("common_error"));
			ProductGroupDao objDao = new ProductGroupDao();
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
		String productDetails = request.getParameter("productDetails");
		// productDetails = "{\"productCode\":\"pro242Ink\",\"productName\":\"Gel\",\"catalogueNo\":\"\"}";
		ProductGroupBean objBean = new ProductGroupBean();
		objBean = new Gson().fromJson(productDetails, ProductGroupBean.class);
		boolean isProductGroupUpdated = false;

		ProductGroupDao objDao1 = new ProductGroupDao();
		isProductGroupUpdated = objDao1.updateProduct(objBean);
		objDao1.commit();
		objDao1.closeAll();
		if (isProductGroupUpdated) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_group_updated"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String deleteProductGroup() {
		String productGroupCode = request.getParameter("productGroupCode");
		// productGroupCode = "pro242Ink";
		ProductGroupDao objDao = new ProductGroupDao();
		boolean isDeleted = objDao.deleteProductGroup(productGroupCode);
		objDao.commit();
		objDao.closeAll();
		if (isDeleted) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_group_deleted"));
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
