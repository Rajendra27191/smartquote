package action;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.json.JSONArray;
import org.json.JSONException;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.ProductGroupBean;
import responseBeans.ProductDetailResponseList;
import responseBeans.ProductResponseBean;
import responseBeans.UserGroupResponse;
import test.GlsFileReader;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;

import dao.ProductDao;
import dao.ProductGroupDao;

@SuppressWarnings("serial")
public class ProductAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private ProductResponseBean productDetailsResponse = new ProductResponseBean();
	private ProductDetailResponseList objProductDetailResponseList = new ProductDetailResponseList();
	public File productFile;
	private int fromLimit;
	private int toLimit;

	public int getFromLimit() {
		return fromLimit;
	}

	public void setFromLimit(int fromLimit) {
		this.fromLimit = fromLimit;
	}

	public int getToLimit() {
		return toLimit;
	}

	public void setToLimit(int toLimit) {
		this.toLimit = toLimit;
	}

	public UserGroupResponse getData() {
		return data;
	}

	public File getProductFile() {
		return productFile;
	}

	public void setProductFile(File productFile) {
		this.productFile = productFile;
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

	public void setProductDetailsResponse(ProductResponseBean productDetailsResponse) {
		this.productDetailsResponse = productDetailsResponse;
	}

	public ProductDetailResponseList getObjProductDetailResponseList() {
		return objProductDetailResponseList;
	}

	public void setObjProductDetailResponseList(ProductDetailResponseList objProductDetailResponseList) {
		this.objProductDetailResponseList = objProductDetailResponseList;
	}

	public String getProductList() {
		String productLike = request.getParameter("prodLike");
		// productLike = "nk";
		productLike = "%" + productLike + "%";
		ArrayList<KeyValuePairBean> valuePairBeans = new ArrayList<KeyValuePairBean>();
//		String[] splitArray = productLike.split(" ");
//		System.out.println(">>>>>>>>>>>>>");
//		System.out.println(productLike);
//		System.out.println(java.util.Arrays.toString(splitArray));
//		System.out.println(splitArray.length);
//		String whereClause1="";
//		String whereClause2="";
//		String whereClause3="";
//		String whereClause4="";
//		for (int i = 0; i < splitArray.length; i++) {
//			if(i==0){
//				whereClause1="item_code like "+"'%"+splitArray[i]+"%'";
//				whereClause2=" OR "+"item_description like " +"'%"+splitArray[i]+"%'";
//				whereClause3=" OR "+"description2 like " +"'%"+splitArray[i]+"%'";	
//				whereClause4=" OR "+"description3 like " +"'%"+splitArray[i]+"%'";
//			}else{
//				whereClause1=whereClause1+" OR "+"item_code like "+"'%"+splitArray[i]+"%'";
//				whereClause2=whereClause2+" OR "+"item_description like "+"'%"+splitArray[i]+"%'";
//				whereClause3=whereClause3+" OR "+"description2 like "+"'%"+splitArray[i]+"%'";	
//				whereClause4=whereClause4+" OR "+"description3 like " +"'%"+splitArray[i]+"%'";
//			}		
//		}
//		System.out.println(whereClause1+whereClause2+whereClause3);
//		String whereClause=whereClause1+whereClause2+whereClause3+whereClause4+";";
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
		// "{\"description3\":\"POSITION: LHS CHEST\",\"description2\":\"EDI INTERNATIONAL\",\"price2exGST\":\"3.5\",\"price4exGST\":\"3.5\",\"unit\":\"EACH\",\"itemDescription\":\"EMBROIDERY BLACK TEXT\",\"price1exGST\":\"3.5\",\"price3exGST\":\"3.5\",\"avgcost\":\"3\",\"price0exGST\":\"3.5\",\"qtyBreak1\":\"9999\",\"qtyBreak2\":\"99999999\",\"qtyBreak3\":\"99999999\",\"qtyBreak4\":\"99999999\",\"itemCode\":\"3DE-EDICUSEMB1\"}";
		ProductBean objBean = new ProductBean();
		objBean = new Gson().fromJson(productDetails, ProductBean.class);
		boolean isProductCreated = false, isProductExist = false;

		ProductDao objDao = new ProductDao();
		isProductExist = objDao.isProductExist(objBean.getItemCode());
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
		String productCode = request.getParameter("productCode");
		// productCode = "3DE-EDICUSEMB1";
		try {
			productDetailsResponse.setCode("error");
			productDetailsResponse.setMessage(getText("common_error"));
			ProductDao objDao = new ProductDao();
			ProductBean objBean = objDao.getProductDetails(productCode);
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
		// productCode = "1";
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

	public String uploadProductByXlsx() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));

		// GlsFileReader objFileReader = new test.FileReader();
		ExcelFileSplit objFileSplit = new ExcelFileSplit();
		try {
			System.out.println("Product File: " + productFile);
			String filename = "dataFile.xlsx";
			File fileToCreate = new File(filename);
			FileUtils.copyFile(productFile, fileToCreate);

			// JSONArray fileString = objFileReader.readFile(filename);
			// System.out.println("File Content: " + fileString);
			String projectPath = request.getSession().getServletContext().getRealPath("/");
			GlsFileReader objSubFileReader;
			JSONArray subFileString;

			int subFileCount = objFileSplit.splitFile(filename, projectPath);

			ArrayList<ProductBean> productList = null;
			ProductDao objProductDao = null;
			for (int j = 0; j < subFileCount; j++) {
				try {
					String subFilePath = projectPath + "ExcelFiles/subFile" + j + ".xlsx";
					objSubFileReader = new test.FileReader();
					subFileString = new JSONArray();
					subFileString = objSubFileReader.readFile(subFilePath);
					System.out.println("subFileCount:" + subFileCount);
					System.out.println(subFilePath);
					System.out.println("subFileString :" + subFileString);
					productList = new Gson().fromJson(subFileString.toString(), new TypeToken<List<ProductBean>>() {
					}.getType());
					System.out.println("Total Products: " + productList.size());
					// =============
					String productCodeString = "";
					for (int i = 0; i < productList.size() && productList != null; i++) {
						if (i == 0) {
							productCodeString = "'" + productList.get(i).getItemCode().trim() + "'";
						} else {
							productCodeString = productCodeString + ", '" + productList.get(i).getItemCode().trim() + "'";
						}
					}

					// System.out.println("Codes to Delete: " +
					// productCodeString);
					objProductDao = new ProductDao();
					@SuppressWarnings("unused")
					boolean isDeleted = true;
					boolean isFileUploaded = true;
					isDeleted = objProductDao.deletedPreviousProduct(productCodeString);
					isFileUploaded = objProductDao.uploadProductFile(productList);
					objProductDao.commit();
//					objProductDao.closeAll();
					if (isFileUploaded) {
						objEmptyResponse.setCode("success");
						objEmptyResponse.setMessage(getText("product_file_uploaded"));
					}else{
						objEmptyResponse.setCode("error");
						objEmptyResponse.setMessage(getText("product_file_not_uploaded"));
					}

				} catch (Exception e) {
					System.out.println("Error in " + j);
					e.printStackTrace();
					break;
				}
			}
			if (objEmptyResponse.getCode() == "success") {
				File fileToDelete = new File(projectPath + "ExcelFiles");
				ExcelFileSplit.delete(fileToDelete);
				
				ArrayList<ProductGroupBean> distinctProductGroupList= new ArrayList<ProductGroupBean>();
				distinctProductGroupList=objProductDao.getDistinctProductGroupList();
//				objProductDao.commit();
				//objProductDao.closeAll();
				System.out.println("Distinct Product Group List Size :"+distinctProductGroupList.size());
				if (distinctProductGroupList.size() > 0) {
					ProductGroupDao objProductGroupDao = new ProductGroupDao();
					boolean isNewProductGroupsUploaded = objProductGroupDao.insertProductGroupByFile(distinctProductGroupList);
					if (isNewProductGroupsUploaded) {
					    System.out.println("New Product Group inserted successfully...");
						objProductDao.closeAll();
					}else{
						System.out.println("New Product Group insertion unsuccessfully...");	
					}
				}
			}
			
			
			
			
			
		} catch (FileNotFoundException e) {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("product_file_not_found"));
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_file_format"));
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_file_parse"));
			e.printStackTrace();
		} catch (NumberFormatException e) {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_numeric_cell"));
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("Done");
		
		
		
		return SUCCESS;
	}

	public String getProductListView() {
		try {
			ProductDao objDao = new ProductDao();
			ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
			objProductBeans = objDao.getAllProductDetailsList(fromLimit, toLimit);
			objDao.commit();
			objDao.closeAll();
			objProductDetailResponseList.setCode("success");
			objProductDetailResponseList.setMessage(getText("details_loaded"));
			objProductDetailResponseList.setObjProductDetailResponseList(objProductBeans);
		} catch (Exception e) {
			objProductDetailResponseList.setCode("error");
			objProductDetailResponseList.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getSearchedProductListView() {
		String productLike = request.getParameter("prodLike");
		// productLike = "nk";
		productLike = "%" + productLike + "%";
		try {
			ProductDao objDao = new ProductDao();
			ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
			System.out.println("prodLike:" + productLike);
			objProductBeans = objDao.getSearchedProductDetailsList(productLike);
			objDao.commit();
			objDao.closeAll();
			objProductDetailResponseList.setCode("success");
			objProductDetailResponseList.setMessage(getText("details_loaded"));
			objProductDetailResponseList.setObjProductDetailResponseList(objProductBeans);
		} catch (Exception e) {
			objProductDetailResponseList.setCode("error");
			objProductDetailResponseList.setMessage(getText("common_error"));
			e.printStackTrace();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
}
