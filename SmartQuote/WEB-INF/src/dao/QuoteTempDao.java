package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import pojo.CommentBean;
import pojo.KeyValuePairBean;
import pojo.OfferBean;
import pojo.ProductBean;
import pojo.QuoteBean;
import pojo.QuoteStatusBean;
import connection.ConnectionFactory;

public class QuoteTempDao {
	Connection conn = null;
	ResultSet rs, rs1, rsTerm, rsService = null;
	PreparedStatement pstmt = null;

	public QuoteTempDao() {
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

	@SuppressWarnings("static-access")
	public boolean saveQuoteTemp(QuoteBean quoteBean, String userId, String status) {
		int quoteId = 0;
		boolean isInserted = false;
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		String createdDate = sdf.format(quoteBean.getCreatedDate());
		String closeDate = sdf.format(quoteBean.getCloseDate());
		System.out.println("QuoteCtreatedDate: " + createdDate);
		String saveData = " insert into create_quote_temp " + "(quote_id,custcode,quote_attn,prices_gst_include,notes,created_date,"
				+ "user_id,current_supplier_id,compete_quote,sales_person_id,status,close_date) " + " values(?,?,?,?,?,?,?,?,?,?,?,?)";
		try {
			pstmt = conn.prepareStatement(saveData);

			pstmt.setString(1, quoteBean.getQuoteId());
			pstmt.setString(2, quoteBean.getCustCode());
			pstmt.setString(3, quoteBean.getQuoteAttn());
			if (quoteBean.getPricesGstInclude())
				pstmt.setString(4, "Yes");
			else
				pstmt.setString(4, "No");
			pstmt.setString(5, quoteBean.getNotes());
			pstmt.setString(6, createdDate);
			pstmt.setString(7, userId);
			pstmt.setInt(8, quoteBean.getCurrentSupplierId());
			pstmt.setString(9, quoteBean.getCompeteQuote());
			pstmt.setInt(10, quoteBean.getSalesPersonId());
			pstmt.setString(11, status);
			pstmt.setString(12, closeDate);
			pstmt.executeUpdate();
			isInserted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isInserted;
	}

	@SuppressWarnings("static-access")
	public int saveQuoteDetailsTemp(ProductBean objProductBean, String quoteId) {
		System.out.println("PRODUCTBEAN>>>");
		System.out.println(objProductBean.toString());
		int quoteDetailId = 0;
		String saveData = " insert into create_quote_details_temp ( quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
				+ " current_supplier_gp,current_supplier_total,gp_required ,savings,is_alternate,alternate_for,comment,unit_diviser) "
				+ " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
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
			System.out.println(objProductBean.getQuoteDetailId());
			pstmt.setInt(12, objProductBean.getQuoteDetailId());
			pstmt.setString(13, objProductBean.getLineComment());
			if(objProductBean.getUnitDiviser()>0){
				pstmt.setInt(14,objProductBean.getUnitDiviser());
			}else{
				pstmt.setInt(14,1);
			}
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

	@SuppressWarnings("static-access")
	public int updateQuoteDetailsTemp(ProductBean objProductBean, String quoteId,int alternateFor) {
		int result = 0;
//		String saveData = " REPLACE INTO create_quote_details_temp (quote_detail_id,quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
//				+ " current_supplier_gp,current_supplier_total,gp_required ,savings,is_alternate,alternate_for,comment) "
//				+ " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		System.out.println(objProductBean.toString());
		String updateQuoteDetails="update create_quote_details_temp set "
				+ "product_id=?,product_qty=?,total=?,quote_price=?,current_supplier_price=?,"
				+ "current_supplier_gp=?,current_supplier_total=?,gp_required=?,savings=?,is_alternate=?,"
				+ "alternate_for=?,comment=?,unit_diviser=? where quote_detail_id=? AND quote_id=?;";
		try {
			pstmt = conn.prepareStatement(updateQuoteDetails);

			pstmt.setString(1, objProductBean.getItemCode());
			pstmt.setInt(2, objProductBean.getItemQty());
			pstmt.setDouble(3, objProductBean.getTotal());
			pstmt.setDouble(4, objProductBean.getQuotePrice());
			pstmt.setDouble(5, objProductBean.getCurrentSupplierPrice());
			pstmt.setDouble(6, objProductBean.getCurrentSupplierGP());
			pstmt.setDouble(7, objProductBean.getCurrentSupplierTotal());
			pstmt.setDouble(8, objProductBean.getGpRequired());
			pstmt.setDouble(9, objProductBean.getSavings());
			pstmt.setString(10, objProductBean.getIsAlternative());
			System.out.println("alternateFor > "+alternateFor);
			pstmt.setInt(11, alternateFor);
			pstmt.setString(12, objProductBean.getLineComment());
			
			pstmt.setInt(13, objProductBean.getQuoteDetailId());
			if(objProductBean.getUnitDiviser()>0){
				pstmt.setInt(14,objProductBean.getUnitDiviser());
			}else{
				pstmt.setInt(14,1);
			}
			pstmt.setString(15, quoteId);
			
			result = pstmt.executeUpdate();
			
			System.out.println("Last updated rows = " + result);
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return result;
	};

	public boolean deleteFromQuoteDetailsTemp(String quoteId, int quoteDetailId) {
		boolean isDeleted = false;
		String query = "delete from create_quote_details_temp where quote_id=? and quote_detail_id=?";
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setString(1, quoteId);
			pstmt.setInt(2, quoteDetailId);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;
	}

	public boolean saveTermsAndConditionDetailsTemp(ArrayList<KeyValuePairBean> termConditionList, String quoteId) {
		boolean termsAndConditionSaved = false;
		String saveData = " insert IGNORE into quote_term_condition_temp (quote_id ,term_id) " + " values(?,?);";
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < termConditionList.size(); i++) {
				if (termConditionList.get(i).getCode().equalsIgnoreCase("true")) {
					termsAndConditionSaved = true;
					pstmt.setString(1, quoteId);
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

	public boolean saveOfferDetailsTemp(ArrayList<OfferBean> offerList, String quoteId) {
		boolean offerDetailsSaved = false;
		String saveData = " insert IGNORE into quote_offer_temp (quote_id ,offer_id) " + " values(?,?);";
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < offerList.size(); i++) {
				if (offerList.get(i).getCode().equalsIgnoreCase("true")) {
					offerDetailsSaved = true;
					pstmt.setString(1, quoteId);
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

	public boolean addNoteToQuote(String query) {
		boolean isDone = false;
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.executeUpdate();
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
	
	public boolean deleteAlternativesFromTemp(String quoteId) {
		boolean isDone = false;
		String query1;
		query1 = "DELETE FROM create_quote_details_temp "
			   + "where quote_id='" + quoteId + "' AND is_alternate='yes' ;";
		try {
			pstmt = conn.prepareStatement(query1);
			pstmt.executeUpdate();
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

	public boolean saveQuoteToMaster(String quoteId) {
		boolean isDone = false;
		String query1, query2, query3, query4;
		query1 = "insert into create_quote_details select a.* from create_quote_details_temp a where a.quote_id = '" + quoteId + "'; ";
		query2 = "insert into create_quote select a.* from create_quote_temp a where a.quote_id = '" + quoteId + "'; ";
//		query3 = "insert into quote_offer_master select a.* from quote_offer_temp a where a.quote_id = '" + quoteId + "'; ";
//		query4 = "insert into quote_term_condition_master select a.* from quote_term_condition_temp a where a.quote_id = '" + quoteId+ "'; ";
		try {
			pstmt = conn.prepareStatement(query1);
			pstmt.executeUpdate();
			pstmt = conn.prepareStatement(query2);
			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query3);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query4);
//			pstmt.executeUpdate();
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

	public boolean deleteQuoteFromTemp(String quoteId) {
		boolean isDone = false;
		String query1, query2, query3, query4;
//		query1 = "delete from quote_offer_temp where quote_id = '" + quoteId + "'; ";
//		query2 = "delete from quote_term_condition_temp where quote_id = '" + quoteId + "'; ";
		query1 = "delete from create_quote_details_temp where quote_id = '" + quoteId + "'; ";
		query2 = "delete from create_quote_temp where quote_id = '" + quoteId + "'; ";
		try {
			pstmt = conn.prepareStatement(query1);
			pstmt.executeUpdate();
			pstmt = conn.prepareStatement(query2);
			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query3);
//			pstmt.executeUpdate();
//			pstmt = conn.prepareStatement(query4);
//			pstmt.executeUpdate();
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
	
	public ArrayList<QuoteBean> getTempQuoteList(String queryGetData, String customerLogoSrc) {
		ArrayList<QuoteBean> quoteList = new ArrayList<QuoteBean>();
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
				objQuoteBean.setCloseDate(rs.getDate("close_date"));
				if (rs.getString("cust_id") == null) {
				} else {
					String src = customerLogoSrc + "CustId_" + rs.getInt("cust_id") + ".png";
					objQuoteBean.setCustLogo(src);
				}
				quoteList.add(objQuoteBean);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return quoteList;
	}
	public ArrayList<ProductBean> getProductDetailsTemp(String quoteId) {
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		ProductBean objProductBean = null;

		String getData = "select quote_detail_id,quote_id,product_id,item_description,product_qty,avg_cost,quote_price,total, "
				+ " gp_required,current_supplier_price,current_supplier_gp,current_supplier_total,savings,"
				+ " ifnull(gst_flag, 'No') gst_flag, "
				+ " unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, price3exGST, "
				+ " qty_break4, price4exGST,promo_price, tax_code,is_alternate,alternate_for, comment,unit_diviser "
				+ " from create_quote_details_temp qd join product_master pm on qd.product_id = pm.item_code " + " where quote_id= ? "
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
				objProductBean.setUnitDiviser(rs1.getInt("unit_diviser"));
				productList.add(objProductBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return productList;
	}
	public QuoteBean getTempQuoteDetail(String quoteId, String customerLogoSrc) {
		QuoteBean objQuoteBean = new QuoteBean();
		String getData = "select quote_id,custcode,cust_id,customer_name,add1,phone,cm.email,fax_no,quote_attn,"
				+ "prices_gst_include,notes,cq.user_id,DATE(created_date) created_date,"
				+ "DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,"
				+ "compete_quote,cq.sales_person_id,um.user_name as sales_person_name,status,close_date "
				+ "from create_quote_temp cq "
				+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
				+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
				+ "left outer join user_master um on cq.sales_person_id = um.user_id "
				+ "where quote_id ='"+quoteId+"';";
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			System.out.println("Quote : " + pstmt);
			if (rs.next()) {
				objQuoteBean.setQuoteId(rs.getString("quote_id"));
				objQuoteBean.setCustCode(rs.getString("custcode"));
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
				objQuoteBean.setCloseDate(rs.getDate("close_date"));
				if (rs.getString("cust_id") == null) {
				} else {
					String src = customerLogoSrc + "CustId_" + rs.getInt("cust_id") + ".png";
					objQuoteBean.setCustLogo(src);
				}
				objQuoteBean.setProductList(getProductDetailsTemp(quoteId));
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return objQuoteBean;
	}

}
