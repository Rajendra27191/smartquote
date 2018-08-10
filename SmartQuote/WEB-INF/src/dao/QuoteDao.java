package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.TimeZone;

import pojo.CommentBean;
import pojo.KeyValuePairBean;
import pojo.OfferBean;
import pojo.ProductBean;
import pojo.QuoteBean;
import pojo.QuoteStatusBean;
import connection.ConnectionFactory;

public class QuoteDao {
	Connection conn = null;
	ResultSet rs, rs1, rsTerm, rsService = null;
	PreparedStatement pstmt = null;

	public QuoteDao() {
		conn = new ConnectionFactory().getConnection();
		try {
			conn.setAutoCommit(false);
		} catch (SQLException e) {
			e.printStackTrace();
		}
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

	public ArrayList<KeyValuePairBean> getCurrentSupplierList() {
		KeyValuePairBean objKeyValuePairBean;
		ArrayList<KeyValuePairBean> supplierList = new ArrayList<KeyValuePairBean>();
		String getData = "select current_supplier_id,current_supplier_name from current_supplier";
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			System.out.println("Supplier : " + pstmt);
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setKey(rs.getInt("current_supplier_id"));
				objKeyValuePairBean.setValue(rs.getString("current_supplier_name"));
				objKeyValuePairBean.setCode(rs.getString("current_supplier_name"));
				supplierList.add(objKeyValuePairBean);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return supplierList;

	}

	public ArrayList<KeyValuePairBean> getSalesPersonList() {
		KeyValuePairBean objKeyValuePairBean;
		ArrayList<KeyValuePairBean> salesPersonList = new ArrayList<KeyValuePairBean>();
		String getData = "select sales_person_id,sales_person_name from sales_person";
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setKey(rs.getInt("sales_person_id"));
				objKeyValuePairBean.setValue(rs.getString("sales_person_name"));
				salesPersonList.add(objKeyValuePairBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return salesPersonList;

	}

	@SuppressWarnings("static-access")
	public int saveCurrentSupplier(String supplierName) {
		int supplierId = 0;
		String inserData = "insert into current_supplier(current_supplier_name) values ('" + supplierName + "')";
		try {
			pstmt = conn.prepareStatement(inserData, pstmt.RETURN_GENERATED_KEYS);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			System.out.println("INSERT SUPPLIER : " + pstmt);
			while (rs.next()) {
				supplierId = rs.getInt(1);
			}
			System.out.println("Supplier ID : " + supplierId);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return supplierId;
	}

	public KeyValuePairBean getSupplierIfExist(String customerCode) {
		KeyValuePairBean objSupplier = new KeyValuePairBean();
		String getUserGroups = "SELECT current_supplier_id,current_supplier_name FROM current_supplier "
				+ "WHERE current_supplier_name = ?;";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, customerCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objSupplier.setKey(rs.getInt("current_supplier_id"));
				objSupplier.setCode(rs.getString("current_supplier_name"));
				objSupplier.setValue(rs.getString("current_supplier_name"));
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objSupplier;
	}

	@SuppressWarnings("static-access")
	public int saveSalesPerson(String salesPerson) {
		int salesPersonId = 0;
		String inserData = "insert into sales_person(sales_person_name) values ('" + salesPerson + "')";
		try {
			pstmt = conn.prepareStatement(inserData, pstmt.RETURN_GENERATED_KEYS);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			System.out.println("INSERT SALES PERSON : " + pstmt);
			while (rs.next()) {
				salesPersonId = rs.getInt(1);
			}
			System.out.println("Sales Person ID : " + salesPersonId);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return salesPersonId;
	}

	public String getGenratedQuoteId() {
		String quoteId = "";
		String query = "select concat(prefix,id) as genrated_id from quote_id_genrator;";
		try {
			pstmt = conn.prepareStatement(query);
			rs = pstmt.executeQuery();
			if (rs.next())
				quoteId = rs.getString("genrated_id");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return quoteId;
	}

	public boolean updateQuoteId() {
		boolean isUpdated = false;
		String query = "update quote_id_genrator set id =id+1;";
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.executeUpdate();
			isUpdated = true;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return isUpdated;
	}

	@SuppressWarnings("static-access")
	public boolean saveQuote(QuoteBean quoteBean, String userId, String status) {
		int quoteId = 0;
		boolean isInserted = false;
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		String currentTime = sdf.format(quoteBean.getCreatedDate());
		System.out.println("QuoteCtreatedDate: " + currentTime);
		String saveData = " insert into create_quote " + "(quote_id,custcode,quote_attn,prices_gst_include,notes,created_date,"
				+ "user_id,current_supplier_id,compete_quote,sales_person_id,status) " + " values(?,?,?,?,?,?,?,?,?,?,?)";
		try {
			// pstmt = conn.prepareStatement(saveData,
			// pstmt.RETURN_GENERATED_KEYS);
			pstmt = conn.prepareStatement(saveData);

			pstmt.setString(1, quoteBean.getQuoteId());
			pstmt.setString(2, quoteBean.getCustCode());
			pstmt.setString(3, quoteBean.getQuoteAttn());
			if (quoteBean.getPricesGstInclude())
				pstmt.setString(4, "Yes");
			else
				pstmt.setString(4, "No");
			pstmt.setString(5, quoteBean.getNotes());
			pstmt.setString(6, currentTime);
			pstmt.setString(7, userId);
			pstmt.setInt(8, quoteBean.getCurrentSupplierId());
			pstmt.setString(9, quoteBean.getCompeteQuote());
			pstmt.setInt(10, quoteBean.getSalesPersonId());
			pstmt.setString(11, status);
			pstmt.executeUpdate();
			isInserted = true;
			// rs = pstmt.getGeneratedKeys();
			// if (rs.next())
			// quoteId = rs.getInt(1);
			// System.out.println("Last Inserted Id = " + quoteId);
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		// return quoteId;
		return isInserted;
	}

	@SuppressWarnings("static-access")
	public int saveQuoteDetails(ProductBean objProductBean, String quoteId) {
		System.out.println("PRODUCTBEAN>>>");
		System.out.println(objProductBean);
		int quoteDetailId = 0;
		String saveData = " insert into create_quote_details ( quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
				+ " current_supplier_gp,current_supplier_total,gp_required ,savings,is_alternate,alternate_for,comment) "
				+ " values(?,?,?,?,?,?,?,?,?,?,?,?,?);";
		try {
			pstmt = conn.prepareStatement(saveData, pstmt.RETURN_GENERATED_KEYS);
			pstmt.setString(1, quoteId);
			pstmt.setString(2, objProductBean.getItemCode());
			pstmt.setInt(3, objProductBean.getItemQty());
			pstmt.setDouble(4, objProductBean.getTotal());
			pstmt.setDouble(5, objProductBean.getQuotePrice());
			pstmt.setDouble(6, objProductBean.getCurrentSupplierPrice());
			pstmt.setDouble(7, objProductBean.getCurrentSupplierGP());
			pstmt.setDouble(8, objProductBean.getCurrentSupplierTotal());
			pstmt.setDouble(9, objProductBean.getGpRequired());
			pstmt.setDouble(10, objProductBean.getSavings());
			pstmt.setString(11, objProductBean.getIsAlternative());
			pstmt.setInt(12, objProductBean.getQuoteDetailId());
			pstmt.setString(13, objProductBean.getLineComment());
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if (rs.next())
				quoteDetailId = rs.getInt(1);
			System.out.println("Last Inserted quote detail Id = " + quoteDetailId);
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return quoteDetailId;
	}

	public ArrayList<QuoteBean> getQuoteList(String queryGetData, String customerLogoSrc) {
		ArrayList<QuoteBean> quoteList = new ArrayList<QuoteBean>();
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		QuoteBean objQuoteBean;
		String getData = queryGetData;
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			System.out.println("Quote : " + pstmt);
			while (rs.next()) {
				objQuoteBean = new QuoteBean();
				objQuoteBean.setQuoteId(rs.getString("quote_id"));
				objQuoteBean.setCustCode(rs.getString("custcode"));
				// System.out.println("CCC "+rs.getString("cust_id"));
				objQuoteBean.setCustName(rs.getString("customer_name"));
				objQuoteBean.setAddress(rs.getString("add1"));
				objQuoteBean.setPhone(rs.getString("phone"));
				objQuoteBean.setEmail(rs.getString("email"));
				objQuoteBean.setFaxNo(rs.getString("fax_no"));
				objQuoteBean.setQuoteAttn(rs.getString("quote_attn"));
				if (rs.getString("prices_gst_include").equals("Yes") || rs.getString("prices_gst_include") == "Yes")
					objQuoteBean.setPricesGstInclude(true);
				else
					objQuoteBean.setPricesGstInclude(false);
				objQuoteBean.setNotes(rs.getString("notes"));
				objQuoteBean.setUserId(rs.getInt("user_id"));
				objQuoteBean.setCreatedDate(rs.getDate("created_date"));
				objQuoteBean.setModifiedDate(rs.getDate("modified_date"));
				objQuoteBean.setCurrentSupplierId(rs.getInt("current_supplier_id"));
				objQuoteBean.setCurrentSupplierName(rs.getString("current_supplier_name"));
				objQuoteBean.setCompeteQuote(rs.getString("compete_quote"));
				objQuoteBean.setSalesPersonId(rs.getInt("sales_person_id"));
				objQuoteBean.setSalesPerson(rs.getString("sales_person_name"));
				objQuoteBean.setStatus(rs.getString("status"));
				productList = getProductDetails(rs.getString("quote_id"));
				objQuoteBean.setProductList(productList);
				objQuoteBean.setCommentList(getCommentList(rs.getString("quote_id")));
				if (rs.getString("cust_id") == null) {
				} else {
					String src = customerLogoSrc + "CustId_" + rs.getInt("cust_id") + ".png";
					objQuoteBean.setCustLogo(src);
				}
				// objQuoteBean.setTermConditionList(getTermAndConditionList(rs.getInt("quote_id")));
				// objQuoteBean.setServiceList(getServiceList(rs.getInt("quote_id")));
				quoteList.add(objQuoteBean);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return quoteList;
	}

	private ArrayList<KeyValuePairBean> getServiceList(String quote_id) {
		ArrayList<KeyValuePairBean> serviceList = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean pairBean = null;

		String query = "select sm.id,sm.service from quote_service_master qs,service_master sm "
				+ "where qs.service_id = sm.id  and qs.quote_id= ?;";

		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setString(1, quote_id);
			rsService = pstmt.executeQuery();
			while (rsService.next()) {
				pairBean = new KeyValuePairBean();
				pairBean.setCode(rsService.getString("id"));
				pairBean.setKey(Integer.parseInt(rsService.getString("id")));
				pairBean.setValue(rsService.getString("service"));
				serviceList.add(pairBean);
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return serviceList;
	}

	public ArrayList<OfferBean> getOfferList(String quote_id, String path) {
		// System.out.println("PAth :: "+path);
		ArrayList<OfferBean> offerList = new ArrayList<OfferBean>();
		// KeyValuePairBean pairBean = null;
		OfferBean objOfferBean = null;
		String query = "select om.id,om.offer_name from quote_offer_master qo,offer_master om "
				+ "where qo.offer_id = om.id  and qo.quote_id= ?;";

		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setString(1, quote_id);
			rsService = pstmt.executeQuery();
			System.out.println(pstmt);
			while (rsService.next()) {
				objOfferBean = new OfferBean();
				objOfferBean.setCode(rsService.getString("id"));
				objOfferBean.setId(Integer.parseInt(rsService.getString("id")));
				objOfferBean.setOfferName(rsService.getString("offer_name"));
				String offerTemplate = path + "offer_template_" + rsService.getInt("id") + ".png";
				objOfferBean.setOfferTemplate(offerTemplate);
				offerList.add(objOfferBean);
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return offerList;
	}

	public ArrayList<KeyValuePairBean> getTermAndConditionList(String quote_id) {
		ArrayList<KeyValuePairBean> termAndConditionList = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean pairBean = null;
		String query = "select tcm.id,tcm.term_condition from quote_term_condition_master qt,term_condition_master tcm "
				+ "where qt.term_id = tcm.id  and qt.quote_id= ?; ";

		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setString(1, quote_id);
			rsTerm = pstmt.executeQuery();

			while (rsTerm.next()) {
				pairBean = new KeyValuePairBean();
				pairBean.setKey(Integer.parseInt(rsTerm.getString("id")));
				pairBean.setCode(rsTerm.getString("id"));
				pairBean.setValue(rsTerm.getString("term_condition"));
				termAndConditionList.add(pairBean);
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return termAndConditionList;
	}

	public ArrayList<CommentBean> getCommentList(String quoteId) {
		Calendar start = Calendar.getInstance();
		DateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
		ArrayList<CommentBean> commentList = new ArrayList<CommentBean>();
		CommentBean objBean = null;// DATE_FORMAT(a.date, '%m %b %Y %H:%i %p')
		String getData = "select a.id, a.quote_id, a.user_id, a.comment, " + " convert_tz(a.date, '+00:00', '"
				+ start.getTimeZone().getID() + "') as date, " + " upper(b.user_name) user_name, b.email "
				+ " from quote_comment_master a, user_master b  " + " where a.user_id = b.user_id and quote_id = ?";
		try {
			pstmt = conn.prepareStatement(getData);
			pstmt.setString(1, quoteId);
			rs1 = pstmt.executeQuery();
			// System.out.println("Comment List :" + pstmt);
			while (rs1.next()) {
				objBean = new CommentBean();
				objBean.setQuoteId(rs1.getString("quote_id"));
				objBean.setUserID(rs1.getInt("user_id"));
				objBean.setUserName(rs1.getString("user_name"));
				objBean.setComment(rs1.getString("comment"));
				objBean.setDate(dateFormat.format(rs1.getTimestamp("date")));
				objBean.setEmail(rs1.getString("email"));
				commentList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return commentList;
	}

	public ArrayList<ProductBean> getProductDetails(String quoteId) {
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		ProductBean objProductBean = null;

		String getData = "select quote_detail_id,quote_id,product_id,item_description,product_qty,avg_cost,quote_price,total, "
				+ " gp_required,current_supplier_price,current_supplier_gp,current_supplier_total,savings,"
				+ " ifnull(gst_flag, 'No') gst_flag, "
				+ " unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, price3exGST, "
				+ " qty_break4, price4exGST,promo_price, tax_code,is_alternate,alternate_for, comment"
				+ " from create_quote_details qd join product_master pm on qd.product_id = pm.item_code " + " where quote_id= ? "
				+ " order by quote_detail_id;";
		try {
			pstmt = conn.prepareStatement(getData);
			pstmt.setString(1, quoteId);
			rs1 = pstmt.executeQuery();
			// System.out.println("Quote Details : " + pstmt);
			while (rs1.next()) {
				objProductBean = new ProductBean();
				objProductBean.setQuoteDetailId(rs1.getInt("quote_detail_id"));
				objProductBean.setQuoteId(rs1.getString("quote_id"));
				objProductBean.setItemCode(rs1.getString("product_id"));
				objProductBean.setItemDescription(rs1.getString("item_description"));
				objProductBean.setItemQty(rs1.getInt("product_qty"));
				objProductBean.setAvgcost(rs1.getDouble("avg_cost"));
				objProductBean.setQuotePrice(rs1.getDouble("quote_price"));
				objProductBean.setTotal(rs1.getDouble("total"));
				objProductBean.setGpRequired(rs1.getDouble("gp_required"));
				objProductBean.setCurrentSupplierPrice(rs1.getDouble("current_supplier_price"));
				objProductBean.setCurrentSupplierGP(rs1.getDouble("current_supplier_gp"));
				objProductBean.setCurrentSupplierTotal(rs1.getDouble("current_supplier_total"));
				objProductBean.setSavings(rs1.getDouble("savings"));
				objProductBean.setGstFlag(rs1.getString("gst_flag"));

				objProductBean.setUnit(rs1.getString("unit"));
				objProductBean.setPrice0exGST(rs1.getDouble("price0exGST"));
				objProductBean.setQtyBreak1(rs1.getDouble("qty_break1"));
				objProductBean.setPrice1exGST(rs1.getDouble("price1exGST"));
				objProductBean.setQtyBreak2(rs1.getDouble("qty_break2"));
				objProductBean.setPrice2exGST(rs1.getDouble("price2exGST"));
				objProductBean.setQtyBreak3(rs1.getDouble("qty_break3"));
				objProductBean.setPrice3exGST(rs1.getDouble("price3exGST"));
				objProductBean.setQtyBreak4(rs1.getDouble("qty_break4"));
				objProductBean.setPrice4exGST(rs1.getDouble("price4exGST"));
				objProductBean.setPromoPrice(rs1.getDouble("promo_price"));

				objProductBean.setTaxCode(rs1.getString("tax_code"));
				objProductBean.setIsAlternative(rs1.getString("is_alternate"));
				objProductBean.setAltForQuoteDetailId(rs1.getInt("alternate_for"));
				objProductBean.setLineComment(rs1.getString("comment"));
				productList.add(objProductBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return productList;
	}

	@SuppressWarnings("static-access")
	public int addComment(String userId, String quoteId, String comment) {
		int commentID = 0;
		String saveData = "INSERT INTO quote_comment_master (quote_id, user_id, comment, date) " + " VALUES (?, ?, ?, now())";
		try {
			pstmt = conn.prepareStatement(saveData, pstmt.RETURN_GENERATED_KEYS);
			pstmt.setString(1, quoteId);
			pstmt.setString(2, userId);
			pstmt.setString(3, comment);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			while (rs.next()) {
				commentID = rs.getInt(1);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return commentID;
	}

	public boolean deleteQuoteDetails(String quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM create_quote_details WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, quoteId);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;
	}

	public CommentBean getCommentDetails(int commentID) {
		Calendar start = Calendar.getInstance();
		DateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
		// dateFormat.setTimeZone(TimeZone.getTimeZone(String.valueOf(start.getTimeZone().getID())));
		System.out.println("Time Zone: " + start.getTimeZone().getID());
		CommentBean objBean = null;// DATE_FORMAT(a.date, '%d %b %Y %H:%i %p')
		String getData = "SELECT a.id, a.quote_id, a.user_id, a.comment, " + " convert_tz(a.date, '+00:00', '"
				+ start.getTimeZone().getID() + "') as date, " + "upper(b.user_name) user_name, b.email "
				+ " FROM quote_comment_master a, user_master b " + " WHERE a.user_id = b.user_id and a.id = ?";
		try {
			pstmt = conn.prepareStatement(getData);
			pstmt.setInt(1, commentID);
			rs1 = pstmt.executeQuery();
			while (rs1.next()) {
				objBean = new CommentBean();
				objBean.setQuoteId(rs1.getString("quote_id"));
				objBean.setUserID(rs1.getInt("user_id"));
				objBean.setUserName(rs1.getString("user_name"));
				objBean.setComment(rs1.getString("comment"));
				objBean.setDate(dateFormat.format(rs1.getTimestamp("date")));
				objBean.setEmail(rs1.getString("email"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	}

	public boolean updateQuote(QuoteBean quoteBean, String status) {
		boolean isQuoteUpdated = false;
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		String currentTime = sdf.format(quoteBean.getModifiedDate());
		System.out.println("QuoteModifiedDate : " + currentTime);
		String saveData = "UPDATE create_quote set custcode = ?, quote_attn = ?, prices_gst_include = ?, "
				+ " notes = ?, user_id = ?, current_supplier_id = ?, compete_quote = ?, "
				+ " sales_person_id = ?, status = ?,modified_date = ? WHERE quote_id = ?";
		try {
			pstmt = conn.prepareStatement(saveData);

			pstmt.setString(1, quoteBean.getCustCode());
			pstmt.setString(2, quoteBean.getQuoteAttn());
			if (quoteBean.getPricesGstInclude())
				pstmt.setString(3, "Yes");
			else
				pstmt.setString(3, "No");
			pstmt.setString(4, quoteBean.getNotes());
			pstmt.setInt(5, quoteBean.getUserId());
			pstmt.setInt(6, quoteBean.getCurrentSupplierId());
			pstmt.setString(7, quoteBean.getCompeteQuote());
			pstmt.setInt(8, quoteBean.getSalesPersonId());
			pstmt.setString(9, status);
			pstmt.setString(10, currentTime);
			pstmt.setString(11, quoteBean.getQuoteId());
			System.out.println("Update Quote: " + pstmt.toString());
			pstmt.executeUpdate();
			isQuoteUpdated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isQuoteUpdated;
	}

	public boolean saveTermsAndConditionDetails(ArrayList<KeyValuePairBean> termConditionList, String quoteId) {
		boolean termsAndConditionSaved = false;
		String saveData = " insert IGNORE into quote_term_condition_master (quote_id ,term_id) " + " values(?,?);";
		System.out.println("saveTermsAndConditionDetails : quote id:::::" + quoteId);
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < termConditionList.size(); i++) {
				System.out.println("codeeeee::::::::" + termConditionList.get(i).getCode());
				if (termConditionList.get(i).getCode().equalsIgnoreCase("true")) {
					termsAndConditionSaved = true;
					pstmt.setString(1, quoteId);
					System.out.println("value::" + termConditionList.get(i).getKey() + "quoteId::::" + quoteId);
					pstmt.setInt(2, termConditionList.get(i).getKey());
					pstmt.addBatch();
				}
			}
			pstmt.executeBatch();
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return termsAndConditionSaved;
	}

	public boolean saveServiceDetails(ArrayList<KeyValuePairBean> serviceList, String quoteId) {
		boolean serviceDetailsSaved = false;
		String saveData = " insert IGNORE into quote_service_master (quote_id ,service_id) " + " values(?,?);";
		System.out.println("saveServiceDetails : quote id:::::" + quoteId);
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < serviceList.size(); i++) {
				System.out.println("codeeeee::::::::" + serviceList.get(i).getCode());
				if (serviceList.get(i).getCode().equalsIgnoreCase("true")) {
					serviceDetailsSaved = true;
					pstmt.setString(1, quoteId);
					System.out.println("value::" + serviceList.get(i).getKey() + "quoteId::::" + quoteId);
					pstmt.setInt(2, serviceList.get(i).getKey());
					pstmt.addBatch();
				}
			}
			pstmt.executeBatch();
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return serviceDetailsSaved;
	}

	public boolean saveOfferDetails(ArrayList<OfferBean> offerList, String quoteId) {
		boolean offerDetailsSaved = false;
		String saveData = " insert IGNORE into quote_offer_master (quote_id ,offer_id) " + " values(?,?);";
		System.out.println("saveOfferDetails : quote id:::::" + quoteId);
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < offerList.size(); i++) {
				System.out.println("codeeeee::::::::" + offerList.get(i).getCode());
				if (offerList.get(i).getCode().equalsIgnoreCase("true")) {
					offerDetailsSaved = true;
					pstmt.setString(1, quoteId);
					System.out.println("value::" + offerList.get(i).getId() + "quoteId::::" + quoteId);
					pstmt.setInt(2, offerList.get(i).getId());
					pstmt.addBatch();
				}
			}
			pstmt.executeBatch();
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return offerDetailsSaved;
	}

	public QuoteBean getTermsServiceList(String quoteId, String path) {
		QuoteBean objQuoteBean = new QuoteBean();
		objQuoteBean.setQuoteId(quoteId);
		objQuoteBean.setTermConditionList(getTermAndConditionList(quoteId));
		objQuoteBean.setServiceList(getServiceList(quoteId));
		objQuoteBean.setOfferList(getOfferList(quoteId, path));
		return objQuoteBean;
	}

	public boolean deleteTermsDetails(String quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_term_condition_master WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, quoteId);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;

	}

	public boolean deleteServiceDetails(String quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_service_master WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, quoteId);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;

	}

	public boolean deleteOfferDetails(String quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_offer_master WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, quoteId);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;

	}

	public boolean changeQuoteStatus(QuoteStatusBean objQuoteStatusBean) {
		boolean isStatusChanged = false;
		try {
			String statusQuery = "UPDATE create_quote set  status=? where quote_id=?;";
			PreparedStatement pstmt = conn.prepareStatement(statusQuery);
			for (int i = 0; i < objQuoteStatusBean.getObjQuoteBeanList().size(); i++) {
				if (objQuoteStatusBean.getObjQuoteBeanList().get(i) != null) {
					System.out.println("Quote Status : " + objQuoteStatusBean.getQuoteStatus());
					pstmt.setString(1, objQuoteStatusBean.getQuoteStatus().toUpperCase());
					System.out.println("Quote ID : " + objQuoteStatusBean.getObjQuoteBeanList().get(i).getQuoteId());
					pstmt.setString(2, objQuoteStatusBean.getObjQuoteBeanList().get(i).getQuoteId());
					pstmt.addBatch();
				}
			}
			pstmt.executeBatch();
			isStatusChanged = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isStatusChanged;
	}
	
	public boolean deleteQuote(String quoteId) {
		boolean isDone = false;
		String query1, query2, query3, query4;
		query1 = "delete from quote_offer_master where quote_id = '" + quoteId + "'; ";
		query2 = "delete from quote_term_condition_master where quote_id = '" + quoteId + "'; ";
		query3 = "delete from create_quote_details where quote_id = '" + quoteId + "'; ";
		query4 = "delete from create_quote where quote_id = '" + quoteId + "'; ";
		try {
			pstmt = conn.prepareStatement(query1);
			pstmt.executeUpdate();
			System.out.println("Delete 1 : " + pstmt);
			pstmt = conn.prepareStatement(query2);
			pstmt.executeUpdate();
			System.out.println("Delete 2 : " + pstmt);
			pstmt = conn.prepareStatement(query3);
			pstmt.executeUpdate();
			System.out.println("Delete 3 : " + pstmt);
			pstmt = conn.prepareStatement(query4);
			pstmt.executeUpdate();
			System.out.println("Delete 4 : " + pstmt);
			isDone = true;
		} catch (SQLException e) {
			try {
			conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDone;
	}

	// ===================================
//	@SuppressWarnings("static-access")
//	public boolean saveQuoteTemp(QuoteBean quoteBean, String userId, String status) {
//		int quoteId = 0;
//		boolean isInserted = false;
//		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
//		String currentTime = sdf.format(quoteBean.getCreatedDate());
//		System.out.println("QuoteCtreatedDate: " + currentTime);
//		String saveData = " insert into create_quote_temp " + "(quote_id,custcode,quote_attn,prices_gst_include,notes,created_date,"
//				+ "user_id,current_supplier_id,compete_quote,sales_person_id,status) " + " values(?,?,?,?,?,?,?,?,?,?,?)";
//		try {
//			pstmt = conn.prepareStatement(saveData);
//
//			pstmt.setString(1, quoteBean.getQuoteId());
//			pstmt.setString(2, quoteBean.getCustCode());
//			pstmt.setString(3, quoteBean.getQuoteAttn());
//			if (quoteBean.getPricesGstInclude())
//				pstmt.setString(4, "Yes");
//			else
//				pstmt.setString(4, "No");
//			pstmt.setString(5, quoteBean.getNotes());
//			pstmt.setString(6, currentTime);
//			pstmt.setString(7, userId);
//			pstmt.setInt(8, quoteBean.getCurrentSupplierId());
//			pstmt.setString(9, quoteBean.getCompeteQuote());
//			pstmt.setInt(10, quoteBean.getSalesPersonId());
//			pstmt.setString(11, status);
//			pstmt.executeUpdate();
//			isInserted = true;
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return isInserted;
//	}
//
//	@SuppressWarnings("static-access")
//	public int saveQuoteDetailsTemp(ProductBean objProductBean, String quoteId) {
//		System.out.println("PRODUCTBEAN>>>");
//		System.out.println(objProductBean.toString());
//		int quoteDetailId = 0;
//		String saveData = " insert into create_quote_details_temp ( quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
//				+ " current_supplier_gp,current_supplier_total,gp_required ,savings,is_alternate,alternate_for,comment) "
//				+ " values(?,?,?,?,?,?,?,?,?,?,?,?,?);";
//		try {
//			pstmt = conn.prepareStatement(saveData, pstmt.RETURN_GENERATED_KEYS);
//			pstmt.setString(1, quoteId);
//			pstmt.setString(2, objProductBean.getItemCode());
//			pstmt.setInt(3, objProductBean.getItemQty());
//			pstmt.setDouble(4, objProductBean.getTotal());
//			pstmt.setDouble(5, objProductBean.getQuotePrice());
//			pstmt.setDouble(6, objProductBean.getCurrentSupplierPrice());
//			pstmt.setDouble(7, objProductBean.getCurrentSupplierGP());
//			pstmt.setDouble(8, objProductBean.getCurrentSupplierTotal());
//			pstmt.setDouble(9, objProductBean.getGpRequired());
//			pstmt.setDouble(10, objProductBean.getSavings());
//			pstmt.setString(11, objProductBean.getIsAlternative());
//			System.out.println(objProductBean.getQuoteDetailId());
//			pstmt.setInt(12, objProductBean.getQuoteDetailId());
//			pstmt.setString(13, objProductBean.getLineComment());
//			pstmt.executeUpdate();
//			rs = pstmt.getGeneratedKeys();
//			if (rs.next())
//				quoteDetailId = rs.getInt(1);
//			System.out.println("Last Inserted quote detail Id = " + quoteDetailId);
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return quoteDetailId;
//	}
//
//	@SuppressWarnings("static-access")
//	public int updateQuoteDetailsTemp(ProductBean objProductBean, String quoteId) {
//		int quoteDetailId = 0;
//		String saveData = " REPLACE INTO create_quote_details_temp (quote_detail_id,quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
//				+ " current_supplier_gp,current_supplier_total,gp_required ,savings,is_alternate,alternate_for,comment) "
//				+ " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
//		try {
//			pstmt = conn.prepareStatement(saveData, pstmt.RETURN_GENERATED_KEYS);
//			pstmt.setInt(1, objProductBean.getQuoteDetailId());
//			pstmt.setString(2, quoteId);
//			pstmt.setString(3, objProductBean.getItemCode());
//			pstmt.setInt(4, objProductBean.getItemQty());
//			pstmt.setDouble(5, objProductBean.getTotal());
//			pstmt.setDouble(6, objProductBean.getQuotePrice());
//			pstmt.setDouble(7, objProductBean.getCurrentSupplierPrice());
//			pstmt.setDouble(8, objProductBean.getCurrentSupplierGP());
//			pstmt.setDouble(9, objProductBean.getCurrentSupplierTotal());
//			pstmt.setDouble(10, objProductBean.getGpRequired());
//			pstmt.setDouble(11, objProductBean.getSavings());
//			pstmt.setString(12, objProductBean.getIsAlternative());
//			pstmt.setInt(13, objProductBean.getQuoteDetailId());
//			pstmt.setString(14, objProductBean.getLineComment());
//			pstmt.executeUpdate();
//			rs = pstmt.getGeneratedKeys();
//			if (rs.next())
//				quoteDetailId = rs.getInt(1);
//			System.out.println("Last Inserted quote detail Id = " + quoteDetailId);
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return quoteDetailId;
//	};
//
//	public boolean deleteFromQuoteDetailsTemp(String quoteId, int quoteDetailId) {
//		boolean isDeleted = false;
//		String query = "delete from create_quote_details_temp where quote_id=? and quote_detail_id=?";
//		try {
//			pstmt = conn.prepareStatement(query);
//			pstmt.setString(1, quoteId);
//			pstmt.setInt(2, quoteDetailId);
//			pstmt.executeUpdate();
//			isDeleted = true;
//		} catch (SQLException e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return isDeleted;
//	}
//
//	public boolean saveTermsAndConditionDetailsTemp(ArrayList<KeyValuePairBean> termConditionList, String quoteId) {
//		boolean termsAndConditionSaved = false;
//		String saveData = " insert IGNORE into quote_term_condition_temp (quote_id ,term_id) " + " values(?,?);";
//		try {
//			pstmt = conn.prepareStatement(saveData);
//			for (int i = 0; i < termConditionList.size(); i++) {
//				if (termConditionList.get(i).getCode().equalsIgnoreCase("true")) {
//					termsAndConditionSaved = true;
//					pstmt.setString(1, quoteId);
//					pstmt.setInt(2, termConditionList.get(i).getKey());
//					pstmt.addBatch();
//				}
//			}
//			pstmt.executeBatch();
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return termsAndConditionSaved;
//	}
//
//	public boolean saveOfferDetailsTemp(ArrayList<OfferBean> offerList, String quoteId) {
//		boolean offerDetailsSaved = false;
//		String saveData = " insert IGNORE into quote_offer_temp (quote_id ,offer_id) " + " values(?,?);";
//		try {
//			pstmt = conn.prepareStatement(saveData);
//			for (int i = 0; i < offerList.size(); i++) {
//				if (offerList.get(i).getCode().equalsIgnoreCase("true")) {
//					offerDetailsSaved = true;
//					pstmt.setString(1, quoteId);
//					pstmt.setInt(2, offerList.get(i).getId());
//					pstmt.addBatch();
//				}
//			}
//			pstmt.executeBatch();
//		} catch (Exception e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return offerDetailsSaved;
//	}
//
//	public boolean addNoteToQuote(String query) {
//		boolean isDone = false;
//		try {
//			pstmt = conn.prepareStatement(query);
//			pstmt.executeUpdate();
//			isDone = true;
//		} catch (SQLException e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return isDone;
//	}
//
//	public boolean saveQuoteToMaster(String quoteId) {
//		boolean isDone = false;
//		String query1, query2, query3, query4;
//		query1 = "insert into quote_offer_master select a.* from quote_offer_temp a where a.quote_id = '" + quoteId + "'; ";
//		query2 = "insert into quote_term_condition_master select a.* from quote_term_condition_temp a where a.quote_id = '" + quoteId
//				+ "'; ";
//		query3 = "insert into create_quote_details select a.* from create_quote_details_temp a where a.quote_id = '" + quoteId + "'; ";
//		query4 = "insert into create_quote select a.* from create_quote_temp a where a.quote_id = '" + quoteId + "'; ";
//		try {
//			pstmt = conn.prepareStatement(query1);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query2);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query3);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query4);
//			pstmt.executeUpdate();
//			isDone = true;
//		} catch (SQLException e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return isDone;
//	}
//
//	public boolean deleteQuoteFromTemp(String quoteId) {
//		boolean isDone = false;
//		String query1, query2, query3, query4;
//		query1 = "delete from quote_offer_temp where quote_id = '" + quoteId + "'; ";
//		query2 = "delete from quote_term_condition_temp where quote_id = '" + quoteId + "'; ";
//		query3 = "delete from create_quote_details_temp where quote_id = '" + quoteId + "'; ";
//		query4 = "delete from create_quote_temp where quote_id = '" + quoteId + "'; ";
//		try {
//			pstmt = conn.prepareStatement(query1);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query2);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query3);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query4);
//			pstmt.executeUpdate();
//			isDone = true;
//		} catch (SQLException e) {
//			try {
//				conn.rollback();
//			} catch (SQLException e1) {
//				e1.printStackTrace();
//			}
//			e.printStackTrace();
//		}
//		return isDone;
//	}
//
//	public ArrayList<QuoteBean> getTempQuoteList(String queryGetData, String customerLogoSrc) {
//		ArrayList<QuoteBean> quoteList = new ArrayList<QuoteBean>();
//		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
//		QuoteBean objQuoteBean;
//		String getData = queryGetData;
//		try {
//			pstmt = conn.prepareStatement(getData);
//			rs = pstmt.executeQuery();
//			System.out.println("Quote : " + pstmt);
//			while (rs.next()) {
//				objQuoteBean = new QuoteBean();
//				objQuoteBean.setQuoteId(rs.getString("quote_id"));
//				objQuoteBean.setCustCode(rs.getString("custcode"));
//				// System.out.println("CCC "+rs.getString("cust_id"));
//				objQuoteBean.setCustName(rs.getString("customer_name"));
//				objQuoteBean.setAddress(rs.getString("add1"));
//				objQuoteBean.setPhone(rs.getString("phone"));
//				objQuoteBean.setEmail(rs.getString("email"));
//				objQuoteBean.setFaxNo(rs.getString("fax_no"));
//				objQuoteBean.setQuoteAttn(rs.getString("quote_attn"));
//				if (rs.getString("prices_gst_include").equals("Yes") || rs.getString("prices_gst_include") == "Yes")
//					objQuoteBean.setPricesGstInclude(true);
//				else
//					objQuoteBean.setPricesGstInclude(false);
//				objQuoteBean.setNotes(rs.getString("notes"));
//				objQuoteBean.setUserId(rs.getInt("user_id"));
//				objQuoteBean.setCreatedDate(rs.getDate("created_date"));
//				objQuoteBean.setModifiedDate(rs.getDate("modified_date"));
//				objQuoteBean.setCurrentSupplierId(rs.getInt("current_supplier_id"));
//				objQuoteBean.setCurrentSupplierName(rs.getString("current_supplier_name"));
//				objQuoteBean.setCompeteQuote(rs.getString("compete_quote"));
//				objQuoteBean.setSalesPersonId(rs.getInt("sales_person_id"));
//				objQuoteBean.setSalesPerson(rs.getString("sales_person_name"));
//				objQuoteBean.setStatus(rs.getString("status"));
//				// productList =
//				// getTempProductDetails(rs.getString("quote_id"));
//				// objQuoteBean.setProductList(productList);
//				// objQuoteBean.setCommentList(getCommentList(rs.getString("quote_id")));
//				if (rs.getString("cust_id") == null) {
//				} else {
//					String src = customerLogoSrc + "CustId_" + rs.getInt("cust_id") + ".png";
//					objQuoteBean.setCustLogo(src);
//				}
//				// objQuoteBean.setTermConditionList(getTermAndConditionList(rs.getString("quote_id")));
//
//				quoteList.add(objQuoteBean);
//			}
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return quoteList;
//	}

}
