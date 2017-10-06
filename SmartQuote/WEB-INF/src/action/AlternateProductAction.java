package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.AlternateProductBean;
import pojo.EmptyResponseBean;
import pojo.ProductBean;
import responseBeans.AlternativeProductResponseBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.AlternateProductDao;

@SuppressWarnings("serial")
public class AlternateProductAction extends ActionSupport implements ServletRequestAware{
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private AlternativeProductResponseBean data=new AlternativeProductResponseBean();
	private HttpServletRequest request;
	
	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}
		
	public AlternativeProductResponseBean getData() {
		return data;
	}

	public void setData(AlternativeProductResponseBean data) {
		this.data = data;
	}

	public String createAlternateProducts(){
	String alternateProductDetails=request.getParameter("alternateProductDetails");
	System.out.println("alternateProductDetails : "+alternateProductDetails);
	AlternateProductBean objBean = new AlternateProductBean();
	objBean = new Gson().fromJson(alternateProductDetails, AlternateProductBean.class);
	boolean isDataSaved=false;
	AlternateProductDao objDao=new AlternateProductDao();
	String mainId,altId;
	double altDefaultPrice;
//	System.out.println("ObjBean : "+ objBean.getMainProductCode());
//	System.out.println("ObjBean : "+ objBean.getAlternativeProductList().size());
	if (objBean.getAlternativeProductList().size()>0) {
		System.out.println("Inside IF");
		for (int i = 0; i < objBean.getAlternativeProductList().size(); i++) {
			mainId=objBean.getMainProductCode();
			altId=objBean.getAlternativeProductList().get(i).getAltProductCode();
//			altDefaultPrice=objBean.getAlternativeProductList().get(i).getAltProductDefaultPrice();
//			isDataSaved=objDao.saveAlternateProducts(mainId,altId,altDefaultPrice);
			isDataSaved=objDao.saveAlternateProducts(mainId,altId);
		}
	}
	objDao.commit();
	objDao.closeAll();
	if (isDataSaved) {
		objEmptyResponse.setCode("success");
		objEmptyResponse.setMessage(getText("alternate_product_created"));
	} else {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
	}
	
	return SUCCESS;	
	};
	
	public String updateAlternateProducts(){
		String alternateProductDetails=request.getParameter("alternateProductDetails");
		System.out.println("alternateProductDetails : "+alternateProductDetails);
		AlternateProductBean objBean = new AlternateProductBean();
		objBean = new Gson().fromJson(alternateProductDetails, AlternateProductBean.class);
		boolean isDataSaved=false;
		AlternateProductDao objDao=new AlternateProductDao();
		String mainId,altId;
		double altDefaultPrice;
//		System.out.println("ObjBean : "+ objBean.getMainProductCode());
//		System.out.println("ObjBean : "+ objBean.getAlternativeProductList().size());
		if (objBean.getAlternativeProductList().size()>0) {
			System.out.println("Inside IF");
			for (int i = 0; i < objBean.getAlternativeProductList().size(); i++) {
				mainId=objBean.getMainProductCode();
				altId=objBean.getAlternativeProductList().get(i).getAltProductCode();
//				altDefaultPrice=objBean.getAlternativeProductList().get(i).getAltProductDefaultPrice();
				boolean isDataDeleted=false;
				isDataDeleted=objDao.deleteAlternateProduct(mainId, altId);
				if (isDataDeleted) {
					isDataSaved=objDao.saveAlternateProducts(mainId,altId);	
				}
			}
		}
		objDao.commit();
		objDao.closeAll();
		if (isDataSaved) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("alternate_product_updated"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		
		return SUCCESS;	
		};
	
	public String deleteAlternateProduct(){
		String mainId=request.getParameter("mainProductId");
		String altId=request.getParameter("altProductId");
//		System.out.println("alternateProductDetails : "+mainId);
//		System.out.println("alternateProductDetails : "+altId);
		boolean isDataDeleted=false;
		AlternateProductDao objDao=new AlternateProductDao();
		isDataDeleted=objDao.deleteAlternateProduct(mainId, altId);
		objDao.commit();
		objDao.closeAll();
		if (isDataDeleted) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("alternate_product_deleted"));
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		
		return SUCCESS;	
		};
	
	public String getAlternateProductsView(){
		ArrayList<AlternateProductBean> alternateProductBeans=new ArrayList<AlternateProductBean>();
		try {
			AlternateProductDao objDao=new AlternateProductDao();
			alternateProductBeans=objDao.getAlternateProductsList();
//			System.out.println("alternateProductBeans"+alternateProductBeans.size());
//			for (int i = 0; i < alternateProductBeans.size(); i++) {
//				System.out.println("Alt Price : "+ alternateProductBeans.get(i).getAltProductObj().getAltPromoPrice());
//			}
			
			
			objDao.commit();
			objDao.closeAll();
			data.setCode("success");
			data.setMessage(getText("list_loaded"));
			data.setObjAlternateProductBeans(alternateProductBeans);
		} catch (Exception e) {
			data.setCode("error");
			data.setMessage(getText("common_error"));
			e.printStackTrace();
		}
	
		return SUCCESS;
	};
	
	
	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
}
