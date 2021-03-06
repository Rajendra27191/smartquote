package action;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.ProductCodeUpdateBean;
import pojo.ProductGroupBean;
import pojo.UploadProgressBean;
import responseBeans.AlternativeProductResponseBean;
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
	static Logger logger = LogManager.getLogger();
	private HttpServletRequest request;
	private UserGroupResponse data = new UserGroupResponse();
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();
	private ProductResponseBean productDetailsResponse = new ProductResponseBean();
	private ProductDetailResponseList objProductDetailResponseList = new ProductDetailResponseList();
	private AlternativeProductResponseBean objAlternativesResponseList = new AlternativeProductResponseBean();
	UploadProgressBean objProgressBean = new UploadProgressBean();;

	public File productFile;
	private int fromLimit;
	private int toLimit;

	private static int totalFileCount;
	private static int currentFileCount;

	public UploadProgressBean getObjProgressBean() {
		return objProgressBean;
	}

	public void setObjProgressBean(UploadProgressBean objProgressBean) {
		this.objProgressBean = objProgressBean;
	}

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
		try {
			ProductDao objDao = new ProductDao();
			valuePairBeans = objDao.getProductList(productLike);
			// objDao.commit();
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
		// objDao.commit();
		objDao.closeAll();
		if (!isProductExist) {
			ProductDao objDao1 = new ProductDao();
			// isProductCreated = objDao1.saveProduct(objBean);
			objBean.setSpecial(true);
			isProductCreated = objDao1.saveSpecialProduct(objBean);
			// objDao1.commit();
			objDao1.closeAll();
			if (isProductCreated) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("product_created"));
				String projectPath = request.getSession().getServletContext().getRealPath("/");
				CommonLoadAction.createProductFile(projectPath);
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
			// objDao.commit();
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

	public String getProductDetailsWithAlternatives() {
		String productCode = request.getParameter("productCode");
		// productCode = "3DE-EDICUSEMB1";
		try {
			productDetailsResponse.setCode("error");
			productDetailsResponse.setMessage(getText("common_error"));
			ProductDao objDao = new ProductDao();
			ProductBean objBean = objDao.getProductDetailsWithAlternatives(productCode);
			// objDao.commit();
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

	public String getProductAlternatives() {
		String productCode = request.getParameter("productCode");
		// productCode = "3DE-EDICUSEMB1";
		try {
			objAlternativesResponseList.setCode("error");
			objAlternativesResponseList.setMessage(getText("common_error"));
			ProductDao objDao = new ProductDao();
			ArrayList<ProductBean> arrayProductBeans = new ArrayList<ProductBean>();
			arrayProductBeans = objDao.getAlternatives(productCode);
			// objDao.commit();
			objDao.closeAll();
			if (arrayProductBeans.size() > 0) {
				objAlternativesResponseList.setCode("success");
				objAlternativesResponseList.setMessage(getText("details_loaded"));
				objAlternativesResponseList.setArrayProductBeans(arrayProductBeans);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String updateProductDetails() {
		// System.out.println("updateProductDetails init :::"+df.format(dateobj));
		String productDetails = request.getParameter("productDetails");
		System.out.println("productDetails :" + productDetails);
		ProductBean objBean = new ProductBean();
		objBean = new Gson().fromJson(productDetails, ProductBean.class);
		boolean isProductUpdated = false;

		ProductDao objDao1 = new ProductDao();
		isProductUpdated = objDao1.updateProduct(objBean);
		// objDao1.commit();
		objDao1.closeAll();
		if (isProductUpdated) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_updated"));
			String projectPath = request.getSession().getServletContext().getRealPath("/");
			CommonLoadAction.createProductFile(projectPath);
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
		// objDao.commit();
		objDao.closeAll();
		if (isDeleted) {
			objEmptyResponse.setCode("success");
			objEmptyResponse.setMessage(getText("product_deleted"));
			String projectPath = request.getSession().getServletContext().getRealPath("/");
			CommonLoadAction.createProductFile(projectPath);
		} else {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("common_error"));
		}
		return SUCCESS;
	}

	public String uploadProductByXlsx() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		ExcelFileSplit objFileSplit = new ExcelFileSplit();
		ProductDao objProductDao = new ProductDao();
		totalFileCount = 0;
		currentFileCount = 0;
		try {
			System.out.println("Product File: " + productFile);
			String projectPath = request.getSession().getServletContext().getRealPath("/");
			JSONArray subFileString;
			int subFileCount = 0;

			subFileCount = objFileSplit.splitFileIntoMultiples(productFile + "", projectPath);
			ArrayList<ProductBean> productList = null;
			objProductDao.truncateProductStaging("product_master_staging");
			objProductDao.truncateProductStaging("product_master_staging2");
			objProductDao.truncateProductStaging("product_master_staging3");
			objProductDao.truncateProductStaging("product_master_staging_final");
			// objProductDao.commit();
			boolean isAddedToStaging = false, isAddedToStagingFinal = false, isFileUploaded = false;
			String subFilePath = "";
			totalFileCount = subFileCount;
			System.out.println("subFileCount :: " + subFileCount);
			for (int j = 0; j < subFileCount; j++) {
				try {
					subFilePath = projectPath + "ExcelFiles/subFile" + j + ".xlsx";
					subFileString = new JSONArray();
					subFileString = objFileSplit.readFile(subFilePath);
					productList = new Gson().fromJson(subFileString.toString(), new TypeToken<List<ProductBean>>() {
					}.getType());
					// =============
					System.out.println("productList size : " + productList.size());
					isAddedToStaging = objProductDao.addToProductStaging(productList);
					currentFileCount = j;
					// System.out.println("CU"+currentFileCount);
					if (!isAddedToStaging)
						break;
				} catch (Exception e) {
					System.out.println("Error in " + j);
					e.printStackTrace();
					break;
				}

			}

			// without split
			// subFileString = objFileSplit.readFile(productFile + "");
			// productList = new Gson().fromJson(subFileString.toString(), new
			// TypeToken<List<ProductBean>>() {
			// }.getType());

			if (isAddedToStaging) {
				String query0 = "delete from product_master_staging where item_status in('k','z') OR item_condition in('t','o','n');";
				String query1 = "DELETE a.* FROM product_master a, product_master_staging b WHERE a.item_code = b.item_code;";

				String query2 = "insert into product_master_staging_final "
						+ "select a.item_code,a.item_description,a.description2,a.description3,a.unit,"
						+ "a.qty_break0,a.price0exGST,a.qty_break1,a.price1exGST,a.qty_break2,a.price2exGST,"
						+ "a.qty_break3,a.price3exGST,a.qty_break4,a.price4exGST,a.avg_cost,a.tax_code,"
						+ "a.created_by,a.product_group_code,a.gst_flag,a.promo_price,a.priority,"
						+ "a.last_buy_date,a.supplier from product_master_staging a,"
						+ "(select item_code, min(priority) priority, count(*) from product_master_staging "
						+ "group by item_code having count(*) = 1) b " + "where a.item_code = b.item_code and a.priority = b.priority;";

				String query3 = "insert into product_master_staging2 "
						+ "select a.item_code,a.item_description,a.description2,a.description3,a.unit,"
						+ "a.qty_break0,a.price0exGST,a.qty_break1,a.price1exGST,a.qty_break2,a.price2exGST,"
						+ "a.qty_break3,a.price3exGST,a.qty_break4,a.price4exGST,a.avg_cost,a.tax_code,"
						+ "a.created_by,a.product_group_code,a.gst_flag,a.promo_price,a.priority,"
						+ "a.last_buy_date,a.supplier from product_master_staging a,"
						+ "(select item_code, min(priority) priority, count(*) from product_master_staging"
						+ " group by item_code having count(*) > 1) b " + "where a.item_code = b.item_code and a.priority = b.priority;";

				String query4 = "insert into product_master_staging_final "
						// + "select a.* from product_master_staging2 a,"
						+ "select a.item_code,a.item_description,a.description2,a.description3,a.unit,"
						+ "a.qty_break0,a.price0exGST,a.qty_break1,a.price1exGST,a.qty_break2,a.price2exGST,"
						+ "a.qty_break3,a.price3exGST,a.qty_break4,a.price4exGST,a.avg_cost,a.tax_code,"
						+ "a.created_by,a.product_group_code,a.gst_flag,a.promo_price,a.priority,"
						+ "a.last_buy_date,a.supplier from product_master_staging2 a,"
						+ " (select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging2 "
						+ " group by item_code having count(*) = 1) b "
						+ "where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date";

				String query5 = "insert into product_master_staging3 " + "select a.* from product_master_staging2 a, "
						+ "(select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging2 "
						+ "group by item_code having count(*) > 1) b "
						+ "where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date;";

				String query6 = "insert into product_master_staging_final " + "select a.* from product_master_staging3 a, "
						+ "(select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging3 "
						+ "group by item_code having count(*) > 1) b "
						+ "where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date "
						+ "and a.item_code regexp a.supplier group by a.item_code;";

				String query7 = "insert into product_master_staging_final " + "select a.* from product_master_staging3 a, "
						+ "(select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging3 "
						+ "group by item_code having count(*) = 1) b "
						+ "where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date;";

				String query8 = "insert ignore into product_master_staging_final " + "select a.* from product_master_staging3 a, "
						+ "(select item_code, min(avg_cost) avg_cost, max(last_buy_date) last_buy_date, count(*) "
						+ "from product_master_staging3 " + "group by item_code having count(*) > 1) b "
						+ "where a.item_code = b.item_code and a.avg_cost = b.avg_cost and a.last_buy_date = b.last_buy_date "
						+ "and a.item_code not in (select c.item_code from product_master_staging3 c where c.item_code = a.item_code "
						+ "and c.item_code regexp c.supplier and c.last_buy_date = b.last_buy_date and b.avg_cost = c.avg_cost) "
						+ "group by item_code;";

				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query0);
				System.out.println("executed query0 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query1);
				System.out.println("executed query1 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query2);
				System.out.println("executed query2 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query3);
				System.out.println("executed query3 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query4);
				System.out.println("executed query4 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query5);
				System.out.println("executed query5 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query6);
				System.out.println("executed query6 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query7);
				System.out.println("executed query7 " + isAddedToStagingFinal);
				isAddedToStagingFinal = objProductDao.addToProductStagingFinal(query8);
				System.out.println("executed query8 " + isAddedToStagingFinal);

			}

			if (isAddedToStagingFinal) {
				isFileUploaded = objProductDao.addToProductMaster();
			}

			if (isFileUploaded) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("product_file_uploaded"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("product_file_not_uploaded"));
			}
			System.out.println("Product Master Prepared...!");
			if (objEmptyResponse.getCode() == "success") {
				// System.out.println("CREATE JSON FILE");
				CommonLoadAction.createProductFile(projectPath);
				// File fileToDelete = new File(projectPath + "ExcelFiles");
				// ExcelFileSplit.delete(fileToDelete);
				ArrayList<ProductGroupBean> distinctProductGroupList = new ArrayList<ProductGroupBean>();
				distinctProductGroupList = objProductDao.getDistinctProductGroupList();
				System.out.println("Distinct Product Group List Size :" + distinctProductGroupList.size());
				if (distinctProductGroupList.size() > 0) {
					ProductGroupDao objProductGroupDao = new ProductGroupDao();
					boolean isNewProductGroupsUploaded = objProductGroupDao.insertProductGroupByFile(distinctProductGroupList);
					if (isNewProductGroupsUploaded) {
						System.out.println("New Product Group inserted successfully...");
					} else {
						System.out.println("New Product Group insertion unsuccessfully...");
					}
				}
				// objProductDao.commit();
				System.out.println("Product File Created...!");

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
		} finally {
			objProductDao.closeAll();
		}
		System.out.println("Done");

		return SUCCESS;
	}

	private boolean checkFileValidation(String fileSrc) throws Exception {
		boolean isFileValid = false;
		BufferedReader br = null;
		String cvsSplitBy = ",";
		br = new BufferedReader(new FileReader(fileSrc));
		System.out.println("fileSrc :: " + fileSrc);
		String fileHeaderLine = br.readLine();
		String[] headerArray = { "Item Code", "Brand", "Item GTIN", "Group", "Item Description", "Description (2)", "Description (3)",
				"Unit", "Status", "Condition", "ABC Class", "FLC Page No.", "Internet Flag", "Internet Tree", "New Internet Tree",
				"Reorder Policy", "Standard Cost", "Replacement Cost", "Sales Cost", "Region", "Price 0 (ex GST)", "Qty Break 1",
				"Price 1 (ex GST)", "Qty Break 2", "Price 2 (ex GST)", "Qty Break 3", "Price 3 (ex GST)", "Qty Break 4",
				"Price 4 (ex GST)", "Whse", "Bin Loc.", "On Hand", "Current Orders", "Back Orders", "On Order", "Minimum stock",
				"Maximum stock", "Avg Mth Demand", "Avg cost", "Supplier", "Supplier Item", "Priority", "Unit", "Conv Factor", "Pack Qty",
				"E.O.Q.", "Last Buy Date", "Last Buy Price", "Tax Code" };
		String[] fileHeaderArray = fileHeaderLine.split(cvsSplitBy);

		if (Arrays.equals(headerArray, fileHeaderArray))
			isFileValid = true;
		else
			isFileValid = false;
		br.close();
		return isFileValid;
	}

	public void deleteIfFileExistAndCreateNewFile(File file) {
		if (!file.exists()) {
			try {
				file.createNewFile();
				logger.info("File created");
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			try {
				file.delete();
				file.createNewFile();
				logger.info("File deleted & created");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public String uploadProductByCsv() {
		logger.trace("uploadProductByCsv initiated ...");
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		ProductDao objProductDao = new ProductDao();
		String projectPath = request.getSession().getServletContext().getRealPath("/");
		System.out.println("Project path ::" + projectPath);
		boolean isAddedToStaging = false;
		boolean isAddedToStagingFinal = false;
		boolean isFileUploaded = false;
		boolean isFileValid = false;
		File fileToCreate = new File(projectPath + getText("product_csv_file_path") + "ProductFile.csv");

		deleteIfFileExistAndCreateNewFile(fileToCreate);
		logger.debug("File Absolute Path :: " + fileToCreate.getAbsolutePath());
		try {
			logger.debug("Product File: " + productFile);
			FileUtils.copyFile(productFile, fileToCreate);
			String loadedFileSrc = fileToCreate.getAbsolutePath();
			logger.debug("Loaded File Src :: " + loadedFileSrc);
			String escapedFilePath = loadedFileSrc.replace("\\", "\\\\");
			logger.debug("Escaped File Path :: " + loadedFileSrc);
			isFileValid = checkFileValidation(loadedFileSrc);
			if (isFileValid) {
				objProductDao.truncateProductStaging("product_master_staging0");
				isAddedToStaging = objProductDao.loadFileToStaging_0(escapedFilePath);
				int dateCount = objProductDao.validateStaging_0();

				if ((isAddedToStaging) && (dateCount > 0)) {
					objProductDao.truncateProductStaging("product_master_staging");
					String query_0 = "INSERT INTO product_master_staging (item_code,product_group_code,item_description,description2,description3,unit,item_status,item_condition,price0exGST,qty_break1,price1exGST,qty_break2,price2exGST,qty_break3,price3exGST,qty_break4,price4exGST,supplier,priority,conv_factor,last_buy_date,last_buy_price,tax_code) "
							+ "SELECT TRIM(REPLACE(REPLACE(REPLACE(item_code, '\n', ' '), '\r', ' '), '\t', ' ')) item_code,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(product_group_code, '\n', ' '), '\r', ' '), '\t', ' ')) product_group_code,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(item_description, '\n', ' '), '\r', ' '), '\t', ' ')) item_description,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(description2, '\n', ' '), '\r', ' '), '\t', ' ')) description2,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(description3, '\n', ' '), '\r', ' '), '\t', ' ')) description3,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(unit, '\n', ' '), '\r', ' '), '\t', ' ')) unit,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(item_status, '\n', ' '), '\r', ' '), '\t', ' ')) item_status,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(item_condition, '\n', ' '), '\r', ' '), '\t', ' ')) item_condition,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(price0exGST, '\n', ' '), '\r', ' '), '\t', ' ')) price0exGST,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(REPLACE(qty_break1, '\n', ' '), '\r', ' '), '\t', ' '),',','')) qty_break1,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(price1exGST, '\n', ' '), '\r', ' '), '\t', ' ')) price1exGST,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(REPLACE(qty_break2, '\n', ' '), '\r', ' '), '\t', ' '),',','')) qty_break2,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(price2exGST, '\n', ' '), '\r', ' '), '\t', ' ')) price2exGST,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(REPLACE(qty_break3, '\n', ' '), '\r', ' '), '\t', ' '),',','')) qty_break3,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(price3exGST, '\n', ' '), '\r', ' '), '\t', ' ')) price3exGST,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(REPLACE(qty_break4, '\n', ' '), '\r', ' '), '\t', ' '),',','')) qty_break4,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(price4exGST, '\n', ' '), '\r', ' '), '\t', ' ')) price4exGST,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(supplier, '\n', ' '), '\r', ' '), '\t', ' ')) supplier,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(priority, '\n', ' '), '\r', ' '), '\t', ' ')) priority,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(conv_factor, '\n', ' '), '\r', ' '), '\t', ' ')) conv_factor,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(last_buy_date, '\n', ' '), '\r', ' '), '\t', ' ')) last_buy_date,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(last_buy_price, '\n', ' '), '\r', ' '), '\t', ' ')) last_buy_price,"
							+ "TRIM(REPLACE(REPLACE(REPLACE(tax_code, '\n', ' '), '\r', ' '), '\t', ' ')) tax_code "
							+ "FROM product_master_staging0;";

					// String query = "INSERT INTO product_master_staging (item_code,product_group_code,item_description,description2,description3,unit,item_status,item_condition,price0exGST,qty_break1,price1exGST,qty_break2,price2exGST,qty_break3,price3exGST,qty_break4,price4exGST,supplier,priority,conv_factor,last_buy_date,last_buy_price,tax_code)SELECT item_code,product_group_code,item_description,description2,description3,unit,item_status,item_condition,price0exGST,qty_break1,price1exGST,qty_break2,price2exGST,qty_break3,price3exGST,qty_break4,price4exGST,supplier,priority,conv_factor,last_buy_date,last_buy_price,tax_code FROM product_master_staging0;";

					objProductDao.executeQuery(query_0);

					objProductDao.truncateProductStaging("product_master_staging2");
					objProductDao.truncateProductStaging("product_master_staging3");
					objProductDao.truncateProductStaging("product_master_staging_final");

					// String query0 =
					// "UPDATE product_master_staging SET tax_code = TRIM(REPLACE(REPLACE(REPLACE(tax_code, '\n', ' '), '\r', ' '), '\t', ' '));";
					String query1 = "UPDATE product_master_staging set avg_cost = if(conv_factor!=0,last_buy_price/conv_factor,last_buy_price);";
					String query2 = "UPDATE product_master_staging set gst_flag='YES' where tax_code = 'E' ;";

					String query3 = "DELETE from product_master_staging where item_status in('k','z') OR item_condition in('t','o','n');";
					String query4 = "DELETE a.* FROM product_master a, product_master_staging b WHERE a.item_code = b.item_code;";

					String query5 = "insert into product_master_staging_final select a.item_code,a.item_description,a.description2,a.description3,a.unit,a.qty_break0,a.price0exGST,a.qty_break1,a.price1exGST,a.qty_break2,a.price2exGST,a.qty_break3,a.price3exGST,a.qty_break4,a.price4exGST,a.avg_cost,a.tax_code,a.created_by,a.product_group_code,a.gst_flag,a.promo_price,a.priority,a.last_buy_date,a.supplier from product_master_staging a,(select item_code, min(priority) priority, count(*) from product_master_staging group by item_code having count(*) = 1) b where a.item_code = b.item_code and a.priority = b.priority;";

					String query6 = "insert into product_master_staging2 select a.item_code,a.item_description,a.description2,a.description3,a.unit,a.qty_break0,a.price0exGST,a.qty_break1,a.price1exGST,a.qty_break2,a.price2exGST,a.qty_break3,a.price3exGST,a.qty_break4,a.price4exGST,a.avg_cost,a.tax_code,a.created_by,a.product_group_code,a.gst_flag,a.promo_price,a.priority,a.last_buy_date,a.supplier from product_master_staging a,(select item_code, min(priority) priority, count(*) from product_master_staging group by item_code having count(*) > 1) b where a.item_code = b.item_code and a.priority = b.priority;";

					String query7 = "insert into product_master_staging_final select a.item_code,a.item_description,a.description2,a.description3,a.unit,a.qty_break0,a.price0exGST,a.qty_break1,a.price1exGST,a.qty_break2,a.price2exGST,a.qty_break3,a.price3exGST,a.qty_break4,a.price4exGST,a.avg_cost,a.tax_code,a.created_by,a.product_group_code,a.gst_flag,a.promo_price,a.priority,a.last_buy_date,a.supplier from product_master_staging2 a, (select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging2  group by item_code having count(*) = 1) b where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date";

					String query8 = "insert into product_master_staging3 select a.* from product_master_staging2 a, (select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging2 group by item_code having count(*) > 1) b where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date;";

					String query9 = "insert into product_master_staging_final select a.* from product_master_staging3 a, (select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging3 group by item_code having count(*) > 1) b where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date and a.item_code regexp a.supplier group by a.item_code;";

					String query10 = "insert into product_master_staging_final select a.* from product_master_staging3 a, (select item_code, max(last_buy_date) last_buy_date, count(*) from product_master_staging3 group by item_code having count(*) = 1) b where a.item_code = b.item_code and a.last_buy_date = b.last_buy_date;";

					String query11 = "insert ignore into product_master_staging_final select a.* from product_master_staging3 a, (select item_code, min(avg_cost) avg_cost, max(last_buy_date) last_buy_date, count(*) from product_master_staging3 group by item_code having count(*) > 1) b where a.item_code = b.item_code and a.avg_cost = b.avg_cost and a.last_buy_date = b.last_buy_date and a.item_code not in (select c.item_code from product_master_staging3 c where c.item_code = a.item_code and c.item_code regexp c.supplier and c.last_buy_date = b.last_buy_date and b.avg_cost = c.avg_cost) group by item_code;";

					// objProductDao.executeQuery(query0);
					objProductDao.executeQuery(query1);
					objProductDao.executeQuery(query2);
					objProductDao.executeQuery(query3);
					objProductDao.executeQuery(query4);
					objProductDao.executeQuery(query5);
					objProductDao.executeQuery(query6);
					objProductDao.executeQuery(query7);
					objProductDao.executeQuery(query8);
					objProductDao.executeQuery(query9);
					objProductDao.executeQuery(query10);
					objProductDao.executeQuery(query11);

					isAddedToStagingFinal = objProductDao.checkFinalStaging();
					if (isAddedToStagingFinal) {
						isFileUploaded = objProductDao.addToProductMaster();
					} else {
						objEmptyResponse.setCode("error");
						objEmptyResponse.setMessage(getText("product_file_internal_error"));
						logger.warn(getText("product_file_invalid_date"));
					}
				} else {
					objEmptyResponse.setCode("error");
					objEmptyResponse.setMessage(getText("product_file_invalid_date"));
					logger.warn(getText("product_file_invalid_date"));
				}

				if (isFileUploaded) {
					objEmptyResponse.setCode("success");
					objEmptyResponse.setMessage(getText("product_file_uploaded"));
				}
				if (objEmptyResponse.getCode() == "success") {
					logger.info("Product Master Prepared...!");
					CommonLoadAction.createProductFile(projectPath);
					ArrayList<ProductGroupBean> distinctProductGroupList = new ArrayList<ProductGroupBean>();
					distinctProductGroupList = objProductDao.getDistinctProductGroupList();
					logger.info("Distinct Product Group List Size :" + distinctProductGroupList.size());

					if (distinctProductGroupList.size() > 0) {
						ProductGroupDao objProductGroupDao = new ProductGroupDao();
						boolean isNewProductGroupsUploaded = objProductGroupDao.insertProductGroupByFile(distinctProductGroupList);
						if (isNewProductGroupsUploaded) {
							logger.info("New Product Group inserted successfully...");
						}
					}

					logger.info("Product File Created...!");
				}
			} else {
				logger.warn(getText("product_file_invalid"));
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("product_file_invalid"));
			}
		} catch (FileNotFoundException e) {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("product_file_not_found"));
			logger.error(e);
		} catch (IOException e) {
			logger.error(e);
			e.printStackTrace();
		} catch (NumberFormatException e) {
			objEmptyResponse.setCode("error");
			objEmptyResponse.setMessage(getText("error_numeric_cell"));
			logger.error(e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			objProductDao.closeAll();
		}

		logger.trace("Done...");
		return "success";
	}

	public String getProductUploadProgress() {
		// System.out.println(totalFileCount +" :: "+currentFileCount);
		objProgressBean.setTotalFileCount(totalFileCount);
		objProgressBean.setCurrentFileCount(currentFileCount);
		return SUCCESS;
	}

	public String uploadProductPromoPriceByXlsx() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		GlsFileReader objFileReader = new test.FileReader();
		ProductDao objProductDao = new ProductDao();
		try {
			System.out.println("Product File With Promo Price: " + productFile);
			// String filename = "dataFile.xlsx";
			// File fileToCreate = new File(filename);
			// FileUtils.copyFile(productFile, fileToCreate);
			JSONArray fileString = objFileReader.readFile(productFile + "");
			System.out.println("File Content: " + fileString);

			ArrayList<ProductBean> productList = null;

			productList = new Gson().fromJson(fileString.toString(), new TypeToken<List<ProductBean>>() {
			}.getType());

			System.out.println("Total Products: " + productList.size());

			boolean isFileUploaded = false;
			isFileUploaded = objProductDao.uploadProductPromoPrice(productList);
			if (isFileUploaded) {
				objEmptyResponse.setCode("success");
				objEmptyResponse.setMessage(getText("promo_price_updated"));
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage(getText("promo_price_not_updated"));
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
		} finally {
			objProductDao.closeAll();
			System.out.println("Done");
		}

		return SUCCESS;
	};

	public String uploadNewProductCodeByXlsx() {
		// System.out.println("uploadNewProductCodeByXlsx :::");
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		GlsFileReader objFileReader = new test.FileReader();
		ProductDao objProductDao = new ProductDao();
		try {
			System.out.println("Product File With Promo Price: " + productFile);
			// String filename = "dataFile.xlsx";
			// File fileToCreate = new File(filename);
			// FileUtils.copyFile(productFile, fileToCreate);

			JSONArray fileString = objFileReader.readFile(productFile + "");
			// System.out.println("File Content: " + fileString);
			ArrayList<ProductCodeUpdateBean> productCodeList = null;

			JSONObject jsonObject = fileString.getJSONObject(0);
			if (jsonObject.has("newItemCode") && jsonObject.has("oldItemCode")) {
				productCodeList = new Gson().fromJson(fileString.toString(), new TypeToken<List<ProductCodeUpdateBean>>() {
				}.getType());
				boolean isFileUploaded = false;
				objProductDao.truncateProductCodeVersion();
				isFileUploaded = objProductDao.updateProductCode(productCodeList);
				if (isFileUploaded) {
					objEmptyResponse.setCode("success");
					objEmptyResponse.setMessage(getText("product_code_updated"));
					String projectPath = request.getSession().getServletContext().getRealPath("/");
					CommonLoadAction.createProductFile(projectPath);
				} else {
					objEmptyResponse.setCode("error");
					objEmptyResponse.setMessage(getText("product_code_not_updated"));
				}
			} else {
				objEmptyResponse.setCode("error");
				objEmptyResponse.setMessage("Column names are invalid. Column names should be 'Old Item Code' & 'New Item Code'");
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
		} finally {
			objProductDao.closeAll();
			System.out.println("Done");
		}

		return SUCCESS;
	}

	public String getProductListView() {
		try {
			ProductDao objDao = new ProductDao();
			ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
			objProductBeans = objDao.getAllProductDetailsList(fromLimit, toLimit);
			// objDao.commit();
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
			// objDao.commit();
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

	public String refreshProductFile() {
		objEmptyResponse.setCode("error");
		objEmptyResponse.setMessage(getText("common_error"));
		String projectPath = request.getSession().getServletContext().getRealPath("/");
		System.out.println("Project Path ::" + projectPath);
		CommonLoadAction.createProductFile(projectPath);
		objEmptyResponse.setCode("success");
		objEmptyResponse.setMessage(getText("product_file_created"));
		System.out.println("Done...");
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public AlternativeProductResponseBean getObjAlternativesResponseList() {
		return objAlternativesResponseList;
	}

	public void setObjAlternativesResponseList(AlternativeProductResponseBean objAlternativesResponseList) {
		this.objAlternativesResponseList = objAlternativesResponseList;
	}
}
