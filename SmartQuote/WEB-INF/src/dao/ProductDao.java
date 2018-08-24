package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.ProductCodeUpdateBean;
import pojo.ProductGroupBean;
import connection.ConnectionFactory;


public class ProductDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;
	DecimalFormat df = new DecimalFormat("###.###");
	

	public ProductDao() {
		conn = new ConnectionFactory().getConnection();
	}

	public void commit() {
		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void closeAll() {
		try {
			if (conn != null)
				conn.close();
			if (rs != null)
				rs.close();
			if (pstmt != null)
				pstmt.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public ArrayList<KeyValuePairBean> getProductList(String productLike) {
		// System.out.println("getProductList init :::"+df.format(dateobj));
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		System.out.println("T1: " + System.currentTimeMillis());
		String getProdustList = "SELECT item_code, " + "ifnull(item_description, 'No Description') item_description,"
				+ "ifnull(description2, 'No Description') description2, " + "ifnull(description3, 'No Description') description3 "
				+ "FROM product_master";
		System.out.println("Query>>");
		System.out.println(getProdustList);
		try {
			pstmt = conn.prepareStatement(getProdustList);
			rs = pstmt.executeQuery();
			int rsCount = 0;
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("item_code"));
				objKeyValuePairBean.setValue(rs.getString("item_code") + " ( " + rs.getString("item_description") + " "
						+ rs.getString("description2") + " " + rs.getString("description3") + " )");
				pairBeans.add(objKeyValuePairBean);
				rsCount = rsCount + 1;
			}
			System.out.println("T2: " + System.currentTimeMillis());
			System.out.println("RowCount>>" + rsCount);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// System.out.println("getProductList deinit :::"+df.format(dateobj));
		return pairBeans;
	}

	public boolean isProductExist(String productCode) {
		boolean isProductExist = false;
		String getUserGroups = "SELECT item_code FROM product_master WHERE item_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isProductExist = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isProductExist;
	}

	public boolean saveProduct(ProductBean objBean) {
		boolean isProductCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO product_master (item_code, item_description, description2, "
					+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
					+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,product_group_code,"
					+ " qty_break0,gst_flag, promo_price) " + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?,?,?, ?)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, objBean.getItemCode());
			pstmt.setString(2, objBean.getItemDescription());
			pstmt.setString(3, objBean.getDescription2());
			pstmt.setString(4, objBean.getDescription3());
			pstmt.setString(5, objBean.getUnit());
			pstmt.setDouble(6, objBean.getPrice0exGST());
			pstmt.setDouble(7, objBean.getQtyBreak1());
			pstmt.setDouble(8, objBean.getPrice1exGST());
			pstmt.setDouble(9, objBean.getQtyBreak2());
			pstmt.setDouble(10, objBean.getPrice2exGST());
			pstmt.setDouble(11, objBean.getQtyBreak3());
			pstmt.setDouble(12, objBean.getPrice3exGST());
			pstmt.setDouble(13, objBean.getQtyBreak4());
			pstmt.setDouble(14, objBean.getPrice4exGST());
			pstmt.setDouble(15, objBean.getAvgcost());
			pstmt.setString(16, objBean.getTaxCode());
			pstmt.setString(17, objBean.getProductGroupCode());
			pstmt.setDouble(18, objBean.getQtyBreak0());
			pstmt.setString(19, objBean.getGstFlag());
			pstmt.setDouble(20, objBean.getPromoPrice());
			// System.out.println("GST FLAG"+objBean.getGstFlag());
			pstmt.executeUpdate();
			isProductCreated = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isProductCreated;
	}

	public ProductBean getProductDetails(String productCode) {
		ProductBean objBean = null;
		String getUserGroups = "SELECT item_code, item_description, description2, "
				+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
				+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,"
				+ " ifnull(gst_flag, 'NO') gst_flag, promo_price as promoPrice " + " FROM product_master WHERE item_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promoPrice"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	}

	public ProductBean getProductDetailsWithAlternatives(String productCode) {
		ProductBean objBean = new ProductBean();
		String getProductDetails = "SELECT item_code, item_description, description2, "
				+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
				+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,"
				+ " ifnull(gst_flag, 'NO') gst_flag, promo_price as promoPrice " + " FROM product_master WHERE item_code = ?";

		try {
			pstmt = conn.prepareStatement(getProductDetails);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promoPrice"));
			}
			ArrayList<ProductBean> arrayProductBeans = new ArrayList<ProductBean>();
			boolean isAltAdded = false;
			arrayProductBeans = getAlternatives(productCode);
			if (arrayProductBeans.size() > 0) {
				isAltAdded = true;
			}
			if (isAltAdded) {
				// System.out.println("If rs.next");
				// objBean.setAlternativeProductAdded(true);
				objBean.setAlternativeProductList(arrayProductBeans);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	}

	public ArrayList<ProductBean> getAlternatives(String productCode) {
		// System.out.println("GET Alternatives...");
		// System.out.println("Product Code"+productCode);
		// ArrayList<AlternateProductBean> arrayAlternateProductBeans=new
		// ArrayList<AlternateProductBean>();
		ArrayList<ProductBean> arrayProductBeans = new ArrayList<ProductBean>();
		String getAlternatives = "SELECT a.alternative_product_id 'alt_product_id', "
				// + "a.alternative_default_price 'alt_default_price', "
				+ "p.item_description 'alt_item_desc',p.description2 'alt_item_desc2',p.description3 'alt_item_desc3',"
				+ "p.avg_cost 'alt_avg_cost',p.unit 'alt_unit',p.price0exGST 'alt_price0exGST',"
				+ "p.price1exGST 'alt_price1exGST',p.price2exGST 'alt_price2exGST',p.price3exGST 'alt_price3exGST',"
				+ "p.price4exGST 'alt_price4exGST'," + "ifnull(p.gst_flag, 'NO') 'alt_gst_flag', p.promo_price as promoPrice "
				+ "FROM alternative_product_master a, product_master p "
				+ "WHERE a.main_product_id = ? AND p.item_code=a.alternative_product_id;";

		try {
			pstmt = conn.prepareStatement(getAlternatives);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			ProductBean objProductBean = null;
			while (rs.next()) {
				objProductBean = new ProductBean();
				objProductBean.setItemCode(rs.getString("alt_product_id"));
				// objProductBean.setAltDefaultPrice(rs.getDouble("alt_default_price"));
				// System.out.println("alt_product_id >>"+rs.getString("alt_product_id"));
				objProductBean.setItemDescription(rs.getString("alt_item_desc"));
				objProductBean.setDescription2(rs.getString("alt_item_desc2"));
				objProductBean.setDescription3(rs.getString("alt_item_desc3"));
				objProductBean.setAvgcost(rs.getDouble("alt_avg_cost"));
				objProductBean.setUnit(rs.getString("alt_unit"));
				objProductBean.setPrice0exGST(rs.getDouble("alt_price0exGST"));
				objProductBean.setPrice1exGST(rs.getDouble("alt_price1exGST"));
				objProductBean.setPrice2exGST(rs.getDouble("alt_price2exGST"));
				objProductBean.setPrice3exGST(rs.getDouble("alt_price3exGST"));
				objProductBean.setPrice4exGST(rs.getDouble("alt_price4exGST"));
				objProductBean.setGstFlag(rs.getString("alt_gst_flag"));
				objProductBean.setPromoPrice(rs.getDouble("promoPrice"));

				arrayProductBeans.add(objProductBean);
			}
			// System.out.println("GET Alternatives List Size ..."+arrayProductBeans.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return arrayProductBeans;
	}

	public boolean updateProduct(ProductBean objBean) {
		boolean isCustomerUpdated = false;
		try {
			String updateCustQuery = "UPDATE product_master SET item_code = ?, item_description = ?, description2 = ?, "
					+ " description3 = ?, unit = ?, price0exGST = ?, qty_break1 = ?, price1exGST = ?, qty_break2 = ?, "
					+ " price2exGST = ?, qty_break3 = ?, price3exGST = ?, qty_break4 = ?, price4exGST = ?, avg_cost = ?, "
					+ " tax_code = ?, created_by = 0, product_group_code = ?, qty_break0 = ?, gst_flag = ?, promo_price= ? "
					+ " WHERE item_code = ? ";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, objBean.getItemCode());
			pstmt.setString(2, objBean.getItemDescription());
			pstmt.setString(3, objBean.getDescription2());
			pstmt.setString(4, objBean.getDescription3());
			pstmt.setString(5, objBean.getUnit());
			pstmt.setDouble(6, objBean.getPrice0exGST());
			pstmt.setDouble(7, objBean.getQtyBreak1());
			pstmt.setDouble(8, objBean.getPrice1exGST());
			pstmt.setDouble(9, objBean.getQtyBreak2());
			pstmt.setDouble(10, objBean.getPrice2exGST());
			pstmt.setDouble(11, objBean.getQtyBreak3());
			pstmt.setDouble(12, objBean.getPrice3exGST());
			pstmt.setDouble(13, objBean.getQtyBreak4());
			pstmt.setDouble(14, objBean.getPrice4exGST());
			pstmt.setDouble(15, objBean.getAvgcost());
			pstmt.setString(16, objBean.getTaxCode());
			pstmt.setString(17, objBean.getProductGroupCode());
			pstmt.setDouble(18, objBean.getQtyBreak0());
			pstmt.setString(19, objBean.getGstFlag());
			pstmt.setDouble(20, objBean.getPromoPrice());
			pstmt.setString(21, objBean.getItemCode());

			pstmt.executeUpdate();
			isCustomerUpdated = true;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return isCustomerUpdated;
	}

	public boolean deleteProduct(String productCode) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM product_master WHERE item_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, productCode);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isDeleted;
	}

	public boolean truncateProductStaging(String tablename) {
		boolean isTruncate = false;
		try {
			String deleteGroupQuery = "TRUNCATE TABLE " + tablename;
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			System.out.println(pstmt);
			pstmt.executeUpdate();
			isTruncate = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isTruncate;
	};

	public boolean addToProductStaging(ArrayList<ProductBean> productList) {
		boolean isFileUploaded = false;
		String productQuery = "INSERT INTO product_master_staging (item_code, item_description, description2, "
				+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
				+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by, qty_break0,"
				+ " product_group_code, gst_flag, priority, last_buy_date, item_status, item_condition, supplier)"
				+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?,?,?,?,?,?,?)";
		try {
			pstmt = conn.prepareStatement(productQuery);
			System.out.println(pstmt);
			final int batchSize = 5000;
			int count = 0;
			for (int i = 0; i < productList.size(); i++) {
				pstmt.setString(1, productList.get(i).getItemCode());
				pstmt.setString(2, productList.get(i).getItemDescription());
				pstmt.setString(3, productList.get(i).getDescription2());
				pstmt.setString(4, productList.get(i).getDescription3());
				pstmt.setString(5, productList.get(i).getUnit());
				pstmt.setDouble(6, productList.get(i).getPrice0exGST());
				pstmt.setDouble(7, productList.get(i).getQtyBreak1());
				pstmt.setDouble(8, productList.get(i).getPrice1exGST());
				pstmt.setDouble(9, productList.get(i).getQtyBreak2());
				pstmt.setDouble(10, productList.get(i).getPrice2exGST());
				pstmt.setDouble(11, productList.get(i).getQtyBreak3());
				pstmt.setDouble(12, productList.get(i).getPrice3exGST());
				pstmt.setDouble(13, productList.get(i).getQtyBreak4());
				pstmt.setDouble(14, productList.get(i).getPrice4exGST());
				double avgCost;
				try {
					avgCost= Double.parseDouble(df.format(productList.get(i).getLastBuyPrice() / productList.get(i).getConvFactor()));
				} catch (Exception e) {
					avgCost= productList.get(i).getLastBuyPrice();
				}
				pstmt.setDouble(15,avgCost);		
				
				pstmt.setString(16, productList.get(i).getTaxCode());
				pstmt.setString(17, productList.get(i).getGroup());
				String gstExempt = productList.get(i).getTaxCode();
				if (gstExempt.equalsIgnoreCase("E")) {
					pstmt.setString(18, "YES");
				} else {
					pstmt.setString(18, "NO");
				}
				pstmt.setInt(19, productList.get(i).getPriority());
				// System.out.println("getLastBuyDate() : " +
				// productList.get(i).getLastBuyDate());
				pstmt.setString(20, productList.get(i).getLastBuyDate());
				
				pstmt.setString(21, productList.get(i).getStatus());
				pstmt.setString(22,productList.get(i).getCondition());
				pstmt.setString(23, productList.get(i).getSupplier());
							
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Staging Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			// System.out.println("Staging Remaining Executed...!");
			isFileUploaded = true;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	}

	public boolean addToProductStaging1() {
		boolean isFileUploaded = false;
		String productQuery = "INSERT INTO product_master_staging1 "
				+ "SELECT item_code, min(priority), max(last_buy_date) FROM product_master_staging group by 1; ";
		try {
			pstmt = conn.prepareStatement(productQuery);
			@SuppressWarnings("unused")
			int i = pstmt.executeUpdate();
			System.out.println(pstmt);
			isFileUploaded = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	}

	public boolean addToProductStagingFinal(String query) {
		boolean isFileUploaded = false;
		String productQuery = query;
		try {
			pstmt = conn.prepareStatement(productQuery);
			@SuppressWarnings("unused")
			int i = pstmt.executeUpdate();
			System.out.println(pstmt);
			isFileUploaded = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	}

	public boolean addToProductMaster() {
		boolean isFileUploaded = false;
		String productQuery = "INSERT INTO product_master "
				+ "SELECT item_code, item_description, description2, description3, unit, qty_break0, price0exGST, "
				+ "qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, price3exGST, qty_break4, price4exGST, "
				+ "avg_cost, tax_code,  created_by, product_group_code, gst_flag, '0.000' " + "FROM product_master_staging_final;";
		try {
			pstmt = conn.prepareStatement(productQuery);
			System.out.println(pstmt);
			@SuppressWarnings("unused")
			int i = pstmt.executeUpdate();

			isFileUploaded = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	}
	
	public boolean loadFileToStaging(String loadedFileSrc) {
		boolean isFileUploaded = false;
		String productQuery = "LOAD DATA LOCAL INFILE '"+loadedFileSrc+"' "
				+ "INTO TABLE `product_master_staging` "
				+ "FIELDS TERMINATED BY ',' "
				+ "ENCLOSED BY '\"' "
				+ "LINES TERMINATED BY '\n' "
				+ "IGNORE 1 LINES "
				+ "(item_code,product_group_code,item_description,description2,description3,unit,item_status,item_condition,"
				+ "price0exGST,qty_break1,price1exGST,qty_break2,price2exGST,qty_break3,price3exGST,qty_break4,price4exGST,"
				+ "supplier,priority,conv_factor,last_buy_date,last_buy_price,tax_code);";
		try {
			pstmt = conn.prepareStatement(productQuery);
			System.out.println(pstmt);	
			@SuppressWarnings("unused")
			int i = pstmt.executeUpdate();
			isFileUploaded = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	}

	public int validateStaging() {
		int count = 0;
		String productQuery = "SELECT count(*)'date_count' FROM product_master_staging where last_buy_date !='0000-00-00';";
		try {
			pstmt = conn.prepareStatement(productQuery);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			if(rs.next())
				count = rs.getInt("date_count");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}
	public ArrayList<ProductBean> getFilterdProductFromStaging() {
		ArrayList<ProductBean> arrayProductBeans = new ArrayList<ProductBean>();
		try {
			String productQuery = "SELECT a.item_code,item_description,description2,description3,"
					+ "unit,qty_break0,price0exGST,qty_break1,price1exGST,qty_break2,"
					+ "price2exGST,qty_break3,price3exGST,qty_break4,price4exGST,avg_cost,"
					+ "tax_code,created_by,product_group_code,gst_flag " + "FROM product_master_staging a,  product_master_staging1 b "
					+ "WHERE a.item_code = b.item_code and a.priority = b.priority and a.last_buy_date = b.last_buy_date;";
			pstmt = conn.prepareStatement(productQuery);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			ProductBean objProductBean = null;
			while (rs.next()) {
				objProductBean = new ProductBean();
				objProductBean.setItemCode(rs.getString("item_code"));
				objProductBean.setItemDescription(rs.getString("item_description"));
				objProductBean.setDescription2(rs.getString("description2"));
				objProductBean.setDescription3(rs.getString("description3"));
				objProductBean.setUnit(rs.getString("unit"));
				objProductBean.setQtyBreak0(rs.getInt("qty_break0"));
				objProductBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objProductBean.setQtyBreak1(rs.getInt("qty_break1"));
				objProductBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objProductBean.setQtyBreak2(rs.getInt("qty_break2"));
				objProductBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objProductBean.setQtyBreak3(rs.getInt("qty_break3"));
				objProductBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objProductBean.setQtyBreak4(rs.getInt("qty_break4"));
				objProductBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objProductBean.setAvgcost(rs.getDouble("avg_cost"));
				objProductBean.setLastBuyPrice(rs.getDouble("avg_cost"));
				objProductBean.setTaxCode(rs.getString("tax_code"));
				objProductBean.setCreated_by(rs.getString("created_by"));
				objProductBean.setGroup(rs.getString("product_group_code"));
				objProductBean.setGstFlag(rs.getString("gst_flag"));
				arrayProductBeans.add(objProductBean);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return arrayProductBeans;
	}

	public boolean uploadProductFile(ArrayList<ProductBean> productList) {
		boolean isFileUploaded = false;
		try {
			String productQuery = "REPLACE INTO product_master (item_code, item_description, description2, "
					+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
					+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by, qty_break0, product_group_code,gst_flag) "
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?,?)";
			pstmt = conn.prepareStatement(productQuery);
			System.out.println(pstmt);
			final int batchSize = 5000;
			int count = 0;

			for (int i = 0; i < productList.size(); i++) {
				pstmt.setString(1, productList.get(i).getItemCode());
				pstmt.setString(2, productList.get(i).getItemDescription());
				pstmt.setString(3, productList.get(i).getDescription2());
				pstmt.setString(4, productList.get(i).getDescription3());
				pstmt.setString(5, productList.get(i).getUnit());
				pstmt.setDouble(6, productList.get(i).getPrice0exGST());
				pstmt.setDouble(7, productList.get(i).getQtyBreak1());
				pstmt.setDouble(8, productList.get(i).getPrice1exGST());
				pstmt.setDouble(9, productList.get(i).getQtyBreak2());
				pstmt.setDouble(10, productList.get(i).getPrice2exGST());
				pstmt.setDouble(11, productList.get(i).getQtyBreak3());
				pstmt.setDouble(12, productList.get(i).getPrice3exGST());
				pstmt.setDouble(13, productList.get(i).getQtyBreak4());
				pstmt.setDouble(14, productList.get(i).getPrice4exGST());
				pstmt.setDouble(15, productList.get(i).getLastBuyPrice());
				pstmt.setString(16, productList.get(i).getTaxCode());
				pstmt.setString(17, productList.get(i).getGroup());
				String gstExempt = productList.get(i).getTaxCode();
				if (gstExempt.equalsIgnoreCase("E")) {
					pstmt.setString(18, "YES");
				} else {
					pstmt.setString(18, "NO");
				}
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			isFileUploaded = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	}

	public boolean uploadProductPromoPrice(ArrayList<ProductBean> productList) {
		boolean isFileUploaded = false;

		try {
			String productQuery = "UPDATE product_master set promo_price = ? where item_code = ? ;";
			pstmt = conn.prepareStatement(productQuery);
			final int batchSize = 5000;
			int count = 0;
			for (int i = 0; i < productList.size(); i++) {
				pstmt.setDouble(1, productList.get(i).getPromoPrice());
				pstmt.setString(2, productList.get(i).getItemCode());
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch();
			// System.out.println("Remaining Executed...!");
			// System.out.println("Promo Price updated...!");
			isFileUploaded = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isFileUploaded;
	};

	public boolean addCodeInProductCodeVersion(ArrayList<ProductCodeUpdateBean> productCodeList) throws Exception {
		System.out.println("addCodeInProductCodeVersion");
		boolean isInserted = false;
		String insertQryOnProductCodeVersion = "INSERT IGNORE INTO product_code_version (old_item_code,new_item_code)" + " VALUES(?,?);";
		pstmt = conn.prepareStatement(insertQryOnProductCodeVersion);
		final int batchSize = 5000;
		int count = 0;
		for (int i = 0; i < productCodeList.size(); i++) {
			pstmt.setString(1, productCodeList.get(i).getOldItemCode());
			pstmt.setString(2, productCodeList.get(i).getNewItemCode());
			pstmt.addBatch();
			if (++count % batchSize == 0) {
				System.out.println("Batch Executed...!");
				pstmt.executeBatch();
			}
		}
		pstmt.executeBatch();
		isInserted = true;
		return isInserted;
	}

	public boolean updateCodeInProductMaster() throws Exception {
		System.out.println("updateCodeInProductMaster");
		boolean isUpdated = false;
		int result = 0;
		String updateProductCode = "update product_master a, product_code_version b "
				+ "set a.item_code = b.new_item_code where a.item_code = b.old_item_code ";
		pstmt = conn.prepareStatement(updateProductCode);
		// System.out.println(pstmt.);
		pstmt.executeUpdate();

		if (result > 0) {
			isUpdated = true;
		}
		return isUpdated;
	}

	public boolean updateCodeInCreateQuoteDetails() throws Exception {
		System.out.println("updateCodeInCreateQuoteDetails");
		boolean isUpdated = false;
		int result = 0;
		String updateProductCode = "update create_quote_details a, product_code_version b "
				+ "set a.product_id = b.new_item_code where a.product_id = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result > 0) {
			isUpdated = true;
		}
		return isUpdated;
	}

	public boolean updateMainIdInAlternativeMaster() throws Exception {
		System.out.println("updateMainIdInAlternativeMaster");
		boolean isUpdated = false;
		int result = 0;
		String updateProductCode = "update alternative_product_master a, product_code_version b "
				+ "set a.main_product_id = b.new_item_code where a.main_product_id = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result > 0) {
			isUpdated = true;
		}
		return isUpdated;
	}

	public boolean updateAltIdAlternativeMaster() throws Exception {
		System.out.println("updateAltIdAlternativeMaster");
		boolean isUpdated = false;
		int result = 0;
		String updateProductCode = "update alternative_product_master a, product_code_version b "
				+ "set a.main_product_id = b.new_item_code where a.main_product_id = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result > 0) {
			isUpdated = true;
		}
		return isUpdated;
	}

	public boolean updateProductCode(ArrayList<ProductCodeUpdateBean> productCodeList) {
		System.out.println("updateProductCode");
		boolean isFileUploaded = false, isInserted = false;
		try {
			System.out.println("Product Code List " + productCodeList);
			isInserted = addCodeInProductCodeVersion(productCodeList);
			if (isInserted) {
				updateCodeInProductMaster();
				updateCodeInCreateQuoteDetails();
				updateMainIdInAlternativeMaster();
				updateAltIdAlternativeMaster();
				isFileUploaded = true;
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				conn.commit();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return isFileUploaded;
	}

	public boolean deletedPreviousProduct() {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE a.* FROM product_master a, product_master_staging b " + "WHERE a.item_code = b.item_code;";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			System.out.println(pstmt);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isDeleted;
	}

	public ArrayList<ProductBean> getAllProductDetailsList(int fromLimit, int toLimit) {
		ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
		ProductBean objBean = null;
		String getUserGroups = "SELECT item_code, pm.product_group_code, " + " ifnull(item_description, '') item_description, "
				+ " ifnull(description2, '') description2, description3, unit,"
				+ " ifnull(qty_break0, '0.0') qty_break0, ifnull(price0exGST, '') price0exGST, "
				+ " ifnull(qty_break1, '0.0') qty_break1, ifnull(price1exGST, '0.0') price1exGST, "
				+ " ifnull(qty_break2, '0.0') qty_break2, ifnull(price2exGST, '0.0') price2exGST, "
				+ " ifnull(qty_break3, '0.0') qty_break3, ifnull(price3exGST, '0.0') price3exGST, "
				+ " ifnull(qty_break4, '0.0') qty_break4, ifnull(price4exGST, '0.0') price4exGST, "
				+ " ifnull(avg_cost, '0.0') avg_cost, ifnull(tax_code, '') tax_code, "
				+ " created_by , product_group_name, pm.product_group_code,ifnull(gst_flag, 'NO') gst_flag, "
				+ " promo_price as promoPrice,special_flag "
				+ " FROM product_master pm left join product_group pg on pm.product_group_code = pg.product_group_code "
				+ " order by 1, 2 limit " + fromLimit + "," + toLimit + "";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setQtyBreak0(rs.getDouble("qty_break0"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setProductGroupCode(rs.getString("product_group_code"));
				objBean.setProductGroupName(rs.getString("product_group_name"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promoPrice"));
				boolean isSpecial=false;
				if (rs.getString("special_flag").equalsIgnoreCase("yes")) {
					isSpecial=true;
				}
				objBean.setSpecial(isSpecial);
				objProductBeans.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objProductBeans;
	}

	public ArrayList<ProductBean> getSearchedProductDetailsList(String productLike) {
		ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
		ProductBean objBean = null;
		String getUserGroups = "SELECT item_code, pm.product_group_code, "
				+ " ifnull(item_description, '') item_description, "
				+ " ifnull(description2, '') description2, description3, unit,"
				+ " ifnull(qty_break0, '0.0') qty_break0, ifnull(price0exGST, '') price0exGST, "
				+ " ifnull(qty_break1, '0.0') qty_break1, ifnull(price1exGST, '0.0') price1exGST, "
				+ " ifnull(qty_break2, '0.0') qty_break2, ifnull(price2exGST, '0.0') price2exGST, "
				+ " ifnull(qty_break3, '0.0') qty_break3, ifnull(price3exGST, '0.0') price3exGST, "
				+ " ifnull(qty_break4, '0.0') qty_break4, ifnull(price4exGST, '0.0') price4exGST, "
				+ " ifnull(avg_cost, '0.0') avg_cost, ifnull(tax_code, '') tax_code, created_by , product_group_name, pm.product_group_code,ifnull(gst_flag, 'NO') gst_flag, "
				+ " ifnull(promo_price, '0.0') promo_price,special_flag "
				+ " FROM product_master pm left join product_group pg on pm.product_group_code = pg.product_group_code "
				+ " WHERE item_code like ? OR item_description like ?" + " order by 1, 2 ";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productLike);
			pstmt.setString(2, productLike);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setQtyBreak0(rs.getDouble("qty_break0"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setProductGroupCode(rs.getString("product_group_code"));
				objBean.setProductGroupName(rs.getString("product_group_name"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promo_price"));
				boolean isSpecial=false;
				if (rs.getString("special_flag").equalsIgnoreCase("yes")) {
					isSpecial=true;
				}
				objBean.setSpecial(isSpecial);
				objProductBeans.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objProductBeans;
	}

	public ArrayList<ProductGroupBean> getDistinctProductGroupList() {
		ArrayList<ProductGroupBean> objProductGroupBeans = new ArrayList<ProductGroupBean>();
		ProductGroupBean objBean = null;
		String sqlGetDistinctProductGroup = "select distinct(product_group_code) from product_master";
		try {
			pstmt = conn.prepareStatement(sqlGetDistinctProductGroup);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductGroupBean();
				objBean.setProductCode(rs.getString("product_group_code"));
				objBean.setProductName("No Description");
				objBean.setCatalogueNo("No Description");
				objProductGroupBeans.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return objProductGroupBeans;
	}

	public int getProgressCount() {
		int insertCount = 0;
		String getUserGroups = "select count(*)'count' from product_master_staging;";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				insertCount = rs.getInt("count");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return insertCount;
	}
	
	public boolean saveSpecialProduct(ProductBean objBean) {
		boolean isProductCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO product_master (item_code, item_description, description2, "
					+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
					+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,product_group_code,"
					+ " qty_break0,gst_flag, promo_price,special_flag) " + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?,?,?, ?,?)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, objBean.getItemCode());
			pstmt.setString(2, objBean.getItemDescription());
			pstmt.setString(3, objBean.getDescription2());
			pstmt.setString(4, objBean.getDescription3());
			pstmt.setString(5, objBean.getUnit());
			pstmt.setDouble(6, objBean.getPrice0exGST());
			pstmt.setDouble(7, objBean.getQtyBreak1());
			pstmt.setDouble(8, objBean.getPrice1exGST());
			pstmt.setDouble(9, objBean.getQtyBreak2());
			pstmt.setDouble(10, objBean.getPrice2exGST());
			pstmt.setDouble(11, objBean.getQtyBreak3());
			pstmt.setDouble(12, objBean.getPrice3exGST());
			pstmt.setDouble(13, objBean.getQtyBreak4());
			pstmt.setDouble(14, objBean.getPrice4exGST());
			pstmt.setDouble(15, objBean.getAvgcost());
			pstmt.setString(16, objBean.getTaxCode());
			pstmt.setString(17, objBean.getProductGroupCode());
			pstmt.setDouble(18, objBean.getQtyBreak0());
			pstmt.setString(19, objBean.getGstFlag());
			pstmt.setDouble(20, objBean.getPromoPrice());
			if (objBean.isSpecial())
				pstmt.setString(21, "YES");
			else
				pstmt.setString(21, "NO");
			// System.out.println("GST FLAG"+objBean.getGstFlag());
			pstmt.executeUpdate();
			isProductCreated = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isProductCreated;
	}
}
