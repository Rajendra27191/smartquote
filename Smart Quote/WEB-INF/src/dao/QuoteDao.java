package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.CommentBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.QuoteBean;
import connection.ConnectionFactory;

public class QuoteDao {
	Connection conn = null;
	ResultSet rs, rs1,rsTerm, rsService  = null;
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
				objKeyValuePairBean.setValue(rs
						.getString("current_supplier_name"));
				objKeyValuePairBean.setCode(rs
						.getString("current_supplier_name"));
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
		String inserData = "insert into current_supplier(current_supplier_name) values ('"
				+ supplierName + "')";
		try {
			pstmt = conn.prepareStatement(inserData,
					pstmt.RETURN_GENERATED_KEYS);
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

	@SuppressWarnings("static-access")
	public int saveSalesPerson(String salesPerson) {
		int salesPersonId = 0;
		String inserData = "insert into sales_person(sales_person_name) values ('"
				+ salesPerson + "')";
		try {
			pstmt = conn.prepareStatement(inserData,
					pstmt.RETURN_GENERATED_KEYS);
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

	@SuppressWarnings("static-access")
	public int saveQuote(QuoteBean quoteBean, String userId,String status) {
		int quoteId = 0;
		String saveData = " insert into create_quote (custcode,quote_attn,prices_gst_include,notes,created_date,user_id,current_supplier_id,compete_quote,sales_person_id,status) "
				+ " values(?,?,?,?,now(),?,?,?,?,?)";
		try {
			pstmt = conn
					.prepareStatement(saveData, pstmt.RETURN_GENERATED_KEYS);

			pstmt.setString(1, quoteBean.getCustCode());
			pstmt.setString(2, quoteBean.getQuoteAttn());
			if (quoteBean.getPricesGstInclude())
				pstmt.setString(3, "Yes");
			else
				pstmt.setString(3, "No");
			pstmt.setString(4, quoteBean.getNotes());
			pstmt.setString(5, userId);
			pstmt.setInt(6, quoteBean.getCurrentSupplierId());
			pstmt.setString(7, quoteBean.getCompeteQuote());
			pstmt.setInt(8, quoteBean.getSalesPersonId());
			pstmt.setString(9,status);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if (rs.next())
				quoteId = rs.getInt(1);
			System.out.println("Last Inserted Id = " + quoteId);

		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return quoteId;
	}

	public boolean saveQuoteDetails(ArrayList<ProductBean> productList,
			int quoteId) {
		boolean quoteSaved = false;
		String saveData = " insert into create_quote_details ( quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
				+ " current_supplier_gp,current_supplier_total,gp_required ,savings) "
				+ " values(?,?,?,?,?,?,?,?,?,?);";
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < productList.size(); i++) {
				pstmt.setInt(1, quoteId);
				pstmt.setString(2, productList.get(i).getItemCode());
				pstmt.setInt(3, productList.get(i).getItemQty());
				pstmt.setDouble(4, productList.get(i).getTotal());
				pstmt.setDouble(5, productList.get(i).getQuotePrice());
				pstmt.setDouble(6, productList.get(i).getCurrentSupplierPrice());
				pstmt.setDouble(7, productList.get(i).getCurrentSupplierGP());
				pstmt.setDouble(8, productList.get(i).getCurrentSupplierTotal());
				pstmt.setDouble(9, productList.get(i).getGpRequired());
				pstmt.setDouble(10, productList.get(i).getSavings());
				pstmt.addBatch();
			}
			pstmt.executeBatch();
			quoteSaved = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return quoteSaved;
	}

	public ArrayList<QuoteBean> getQuoteList() {
		ArrayList<QuoteBean> quoteList = new ArrayList<QuoteBean>();
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		QuoteBean objQuoteBean;
//		String getData = "select quote_id,custcode,customer_name,add1,phone,email,fax_no,quote_attn,prices_gst_include,notes, "
//				+ " user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,compete_quote, "
//				+ " cq.sales_person_id,sales_person_name,status "
//				+ " from create_quote cq left outer join customer_master cm on cq.custcode=cm.customer_code "
//				+ " left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
//				+ " left outer join sales_person sp on cq.sales_person_id = sp.sales_person_id order by created_date desc;";
		String getData="select quote_id,custcode,customer_name,add1,phone,cm.email,fax_no,quote_attn,prices_gst_include,notes, "
				+ "cq.user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,"
				+ "compete_quote,cq.sales_person_id,um.user_name as sales_person_name,status "
				+ "from create_quote cq "
				+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
				+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
				+ "left outer join user_master um on cq.sales_person_id = um.user_id "
				+ "order by created_date desc;";
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			// System.out.println("Quote : "+pstmt);
			while (rs.next()) {
				objQuoteBean = new QuoteBean();
				objQuoteBean.setQuoteId(rs.getInt("quote_id"));
				objQuoteBean.setCustCode(rs.getString("custcode"));
				objQuoteBean.setCustName(rs.getString("customer_name"));
				objQuoteBean.setAddress(rs.getString("add1"));
				objQuoteBean.setPhone(rs.getString("phone"));
				objQuoteBean.setEmail(rs.getString("email"));
				objQuoteBean.setFaxNo(rs.getString("fax_no"));
				objQuoteBean.setQuoteAttn(rs.getString("quote_attn"));
				if (rs.getString("prices_gst_include").equals("Yes")
						|| rs.getString("prices_gst_include") == "Yes")
					objQuoteBean.setPricesGstInclude(true);
				else
					objQuoteBean.setPricesGstInclude(false);
				objQuoteBean.setNotes(rs.getString("notes"));
				objQuoteBean.setUserId(rs.getInt("user_id"));
				objQuoteBean.setCreatedDate(rs.getString("created_date"));
				objQuoteBean.setModifiedDate(rs.getString("modified_date"));
				objQuoteBean.setCurrentSupplierId(rs
						.getInt("current_supplier_id"));
				objQuoteBean.setCurrentSupplierName(rs
						.getString("current_supplier_name"));
				objQuoteBean.setCompeteQuote(rs.getString("compete_quote"));
				objQuoteBean.setSalesPersonId(rs.getInt("sales_person_id"));
				objQuoteBean.setSalesPerson(rs.getString("sales_person_name"));
				objQuoteBean.setStatus(rs.getString("status"));
				productList = getProductDetails(rs.getInt("quote_id"));
				objQuoteBean.setProductList(productList);
				objQuoteBean.setCommentList(getCommentList(rs
						.getInt("quote_id")));
				//objQuoteBean.setTermConditionList(getTermAndConditionList(rs.getInt("quote_id")));
				//objQuoteBean.setServiceList(getServiceList(rs.getInt("quote_id")));
				quoteList.add(objQuoteBean);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return quoteList;
	}

	private ArrayList<KeyValuePairBean> getServiceList(int quote_id) {
		ArrayList<KeyValuePairBean> serviceList = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean pairBean = null;
		
		String query = "select sm.id,sm.service from quote_service_master qs,service_master sm "
				+ "where qs.service_id = sm.id  and qs.quote_id= ?;";
		
		try {
			pstmt= conn.prepareStatement(query);
			pstmt.setInt(1, quote_id);
			rsService = pstmt.executeQuery();
			while(rsService.next()){
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

	private ArrayList<KeyValuePairBean> getTermAndConditionList(int quote_id) {
		ArrayList<KeyValuePairBean> termAndConditionList = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean pairBean = null;
		String query = "select tcm.id,tcm.term_condition from quote_term_condition_master qt,term_condition_master tcm "
				+ "where qt.term_id = tcm.id  and qt.quote_id= ?; ";
		
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setInt(1, quote_id);
			rsTerm = pstmt.executeQuery();
			
			while(rsTerm.next()){
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

	public ArrayList<CommentBean> getCommentList(int quoteId) {
		ArrayList<CommentBean> commentList = new ArrayList<CommentBean>();
		CommentBean objBean = null;
		String getData = "select a.id, a.quote_id, a.user_id, a.comment, DATE_FORMAT(a.date, '%m %b %Y %H:%i %p') as date, "
				+ " upper(b.user_name) user_name, b.email "
				+ " from quote_comment_master a, user_master b  "
				+ " where a.user_id = b.user_id and quote_id = ?";
		try {
			pstmt = conn.prepareStatement(getData);
			pstmt.setInt(1, quoteId);
			rs1 = pstmt.executeQuery();
			// System.out.println("Comment List :" + pstmt);
			while (rs1.next()) {
				objBean = new CommentBean();
				objBean.setQuoteId(rs1.getInt("quote_id"));
				objBean.setUserID(rs1.getInt("user_id"));
				objBean.setUserName(rs1.getString("user_name"));
				objBean.setComment(rs1.getString("comment"));
				objBean.setDate(rs1.getString("date"));
				objBean.setEmail(rs1.getString("email"));
				commentList.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return commentList;
	}

	public ArrayList<ProductBean> getProductDetails(int quoteId) {
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		ProductBean objProductBean = null;
		String getData = "select quote_detail_id,quote_id,product_id,item_description,product_qty,avg_cost,quote_price,total, "
				+ " gp_required,current_supplier_price,current_supplier_gp,current_supplier_total,savings,gst_flag, "
				+ " unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, price3exGST, "
				+ " qty_break4, price4exGST, tax_code "
				+ " from create_quote_details qd join product_master pm on qd.product_id = pm.item_code "
				+ " where quote_id=" + quoteId;
		try {
			pstmt = conn.prepareStatement(getData);
			rs1 = pstmt.executeQuery();
			// System.out.println("Quote Details : " + pstmt);
			while (rs1.next()) {
				objProductBean = new ProductBean();
				objProductBean.setQuoteId(rs1.getInt("quote_id"));
				objProductBean.setItemCode(rs1.getString("product_id"));
				objProductBean.setItemDescription(rs1
						.getString("item_description"));
				objProductBean.setItemQty(rs1.getInt("product_qty"));
				objProductBean.setAvgcost(rs1.getDouble("avg_cost"));
				objProductBean.setQuotePrice(rs1.getDouble("quote_price"));
				objProductBean.setTotal(rs1.getDouble("total"));
				objProductBean.setGpRequired(rs1.getDouble("gp_required"));
				objProductBean.setCurrentSupplierPrice(rs1
						.getDouble("current_supplier_price"));
				objProductBean.setCurrentSupplierGP(rs1
						.getDouble("current_supplier_gp"));
				objProductBean.setCurrentSupplierTotal(rs1
						.getDouble("current_supplier_total"));
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
				objProductBean.setTaxCode(rs1.getString("tax_code"));
				productList.add(objProductBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return productList;
	}
	

	@SuppressWarnings("static-access")
	public int addComment(String userId, int quoteId, String comment) {
		int commentID = 0;
		String saveData = "INSERT INTO quote_comment_master (quote_id, user_id, comment, date) "
				+ " VALUES (?, ?, ?, now())";
		try {
			pstmt = conn
					.prepareStatement(saveData, pstmt.RETURN_GENERATED_KEYS);
			pstmt.setInt(1, quoteId);
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

	public boolean deleteQuoteDetails(int quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM create_quote_details WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, quoteId);
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
		CommentBean objBean = null;
		String getData = "SELECT a.id, a.quote_id, a.user_id, a.comment, "
				+ " DATE_FORMAT(a.date, '%m %b %Y %H:%i %p') as date, upper(b.user_name) user_name, b.email "
				+ " FROM quote_comment_master a, user_master b "
				+ " WHERE a.user_id = b.user_id and a.id = ?";
		try {
			pstmt = conn.prepareStatement(getData);
			pstmt.setInt(1, commentID);
			rs1 = pstmt.executeQuery();
			while (rs1.next()) {
				objBean = new CommentBean();
				objBean.setQuoteId(rs1.getInt("quote_id"));
				objBean.setUserID(rs1.getInt("user_id"));
				objBean.setUserName(rs1.getString("user_name"));
				objBean.setComment(rs1.getString("comment"));
				objBean.setDate(rs1.getString("date"));
				objBean.setEmail(rs1.getString("email"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objBean;
	}

	public boolean updateQuote(QuoteBean quoteBean,String status) {
		boolean isQuoteUpdated = false;
		/*String saveData = "UPDATE create_quote set custcode = ?, quote_attn = ?, prices_gst_include = ?, "
				+ " notes = ?, created_date = now(), user_id = ?, current_supplier_id = ?, compete_quote = ?, "
				+ " sales_person_id = ?, status = 'UPDATED' WHERE quote_id = ?";*/
		String saveData = "UPDATE create_quote set custcode = ?, quote_attn = ?, prices_gst_include = ?, "
				+ " notes = ?, user_id = ?, current_supplier_id = ?, compete_quote = ?, "
				+ " sales_person_id = ?, status = ?,modified_date = now() WHERE quote_id = ?";
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
			pstmt.setString(9,status);
			pstmt.setInt(10, quoteBean.getQuoteId());
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

	public boolean saveTermsAndConditionDetails(
			ArrayList<KeyValuePairBean> termConditionList, int quoteId) {
		boolean termsAndConditionSaved= false;
		String saveData = " insert IGNORE into quote_term_condition_master (quote_id ,term_id) "
				+ " values(?,?);";
		System.out.println("quote id:::::"+quoteId);
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < termConditionList.size(); i++) {
				
				System.out.println("codeeeee::::::::"+termConditionList.get(i).getCode());
				if(termConditionList.get(i).getCode().equalsIgnoreCase("true")){
					
					pstmt.setInt(1, quoteId);
					System.out.println("value::"+termConditionList.get(i).getKey()+"quoteId::::"+quoteId);
					pstmt.setInt(2, termConditionList.get(i).getKey());
					pstmt.addBatch();
				}
				
			}
			pstmt.executeBatch();
			termsAndConditionSaved = true;
			
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

	public boolean saveServiceDetails(ArrayList<KeyValuePairBean> serviceList,
			int quoteId) {
		boolean serviceDetailsSaved= false;
		String saveData = " insert IGNORE into quote_service_master (quote_id ,service_id) "
				+ " values(?,?);";
		System.out.println("quote id:::::"+quoteId);
		try {
			pstmt = conn.prepareStatement(saveData);
			for (int i = 0; i < serviceList.size(); i++) {
				
				System.out.println("codeeeee::::::::"+serviceList.get(i).getCode());
				if(serviceList.get(i).getCode().equalsIgnoreCase("true")){
					serviceDetailsSaved = true;
					pstmt.setInt(1, quoteId);
					System.out.println("value::"+serviceList.get(i).getKey()+"quoteId::::"+quoteId);
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

	public QuoteBean getTermsServiceList(int quoteId) {
		QuoteBean objQuoteBean = new QuoteBean();
		objQuoteBean.setQuoteId(quoteId);
		objQuoteBean.setTermConditionList(getTermAndConditionList(quoteId));
		objQuoteBean.setServiceList(getServiceList(quoteId));
		return objQuoteBean;
	}

	public boolean deleteTermsDetails(int quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_term_condition_master WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, quoteId);
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
	
	public boolean deleteServiceDetails(int quoteId) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM quote_service_master WHERE quote_id = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setInt(1, quoteId);
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

}
