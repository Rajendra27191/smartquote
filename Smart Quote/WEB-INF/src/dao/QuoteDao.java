package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.QuoteBean;
import connection.ConnectionFactory;

public class QuoteDao {
	Connection conn = null;
	ResultSet rs,rs1 = null;
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

	public ArrayList<KeyValuePairBean> getCurrentSupplierList ()
	{
		KeyValuePairBean objKeyValuePairBean ;
		ArrayList<KeyValuePairBean> supplierList = new ArrayList<KeyValuePairBean>();
		String getData = "select current_supplier_id,current_supplier_name from current_supplier";
		try{
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			System.out.println("Supplier : "+pstmt);
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setKey(rs.getInt("current_supplier_id"));
				objKeyValuePairBean.setValue(rs.getString("current_supplier_name"));
				objKeyValuePairBean.setCode(rs.getString("current_supplier_name"));
				supplierList.add(objKeyValuePairBean);
			}
			
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		return supplierList;
		
	}
	
	
	public ArrayList<KeyValuePairBean> getSalesPersonList ()
	{
		KeyValuePairBean objKeyValuePairBean ;
		ArrayList<KeyValuePairBean> salesPersonList = new ArrayList<KeyValuePairBean>();
		String getData = "select sales_person_id,sales_person_name from sales_person";
		try{
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setKey(rs.getInt("sales_person_id"));
				objKeyValuePairBean.setValue(rs.getString("sales_person_name"));
				salesPersonList.add(objKeyValuePairBean);
			}
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		return salesPersonList;
		
	}
	
	public int saveCurrentSupplier(String supplierName)
	{
		int supplierId = 0;
		String inserData = "insert into current_supplier(current_supplier_name) values ('"+supplierName+"')";
		try {
			pstmt = conn.prepareStatement(inserData,pstmt.RETURN_GENERATED_KEYS);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			System.out.println("INSERT SUPPLIER : "+pstmt);
			while (rs.next()) {
				supplierId = rs.getInt(1);
			}
			System.out.println("Supplier ID : "+supplierId);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return supplierId;
	}
	
	public int saveSalesPerson(String salesPerson)
	{
		int salesPersonId = 0;
		String inserData = "insert into sales_person(sales_person_name) values ('"+salesPerson+"')";
		try {
			pstmt = conn.prepareStatement(inserData,pstmt.RETURN_GENERATED_KEYS);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			System.out.println("INSERT SALES PERSON : "+pstmt);
			while (rs.next()) {
				salesPersonId = rs.getInt(1);
			}
			System.out.println("Sales Person ID : "+salesPersonId);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return salesPersonId;
	}
	
	public int saveQuote(QuoteBean quoteBean , String userId){
		int quoteId=0;
		String saveData = " insert into create_quote (custcode,quote_attn,prices_gst_include,notes,created_date,user_id,current_supplier_id,compete_quote,sales_person_id,status) "
						+ " values(?,?,?,?,now(),?,?,?,?,'SAVED')";
		try {
			pstmt= conn.prepareStatement(saveData,pstmt.RETURN_GENERATED_KEYS);
			
			pstmt.setString(1, quoteBean.getCustCode());
			pstmt.setString(2, quoteBean.getQuoteAttn());
			if(quoteBean.getPricesGstInclude())
				pstmt.setString(3, "Yes");
			else
				pstmt.setString(3, "No");
			pstmt.setString(4, quoteBean.getNotes());
			pstmt.setString(5, userId);
			pstmt.setInt(6, quoteBean.getCurrentSupplierId());
			pstmt.setString(7, quoteBean.getCompeteQuote());
			pstmt.setInt(8, quoteBean.getSalesPersonId());
			
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if(rs.next())
				quoteId = rs.getInt(1);
			System.out.println("Last Inserted Id = "+quoteId);
			
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
	
	public boolean saveQuoteDetails(ArrayList<ProductBean> productList,int quoteId){
		final int batchSize = 100;
		int count = 0;
		boolean quoteSaved=false;
		String saveData = " insert into create_quote_details ( quote_id,product_id,product_qty,total,quote_price,current_supplier_price,"
				        + " current_supplier_gp,current_supplier_total,gp_required ,savings) "
						+ " values(?,?,?,?,?,?,?,?,?,?);";
		try {
			pstmt= conn.prepareStatement(saveData);
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
				pstmt.setDouble(10,productList.get(i).getSavings());
				pstmt.addBatch();
				
				/*if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}*/
				quoteSaved=true;
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
		return quoteSaved;
	}


	public ArrayList<QuoteBean> getQuoteList(){
		ArrayList<QuoteBean> quoteList = new ArrayList<QuoteBean>();
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		QuoteBean objQuoteBean ;
		String getData = "select quote_id,custcode,customer_name,add1,phone,email,fax_no,quote_attn,prices_gst_include,notes, "
						+" user_id,DATE(created_date) created_date,cq.current_supplier_id,current_supplier_name,compete_quote, "
						+" cq.sales_person_id,sales_person_name,status "
						+" from create_quote cq join customer_master cm on cq.custcode=cm.customer_code " 
						+" join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
						+" join sales_person sp on cq.sales_person_id = sp.sales_person_id;";
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			//System.out.println("Quote : "+pstmt);
			while (rs.next())
			{
				objQuoteBean = new QuoteBean();
				objQuoteBean.setQuoteId(rs.getInt("quote_id"));
				objQuoteBean.setCustCode(rs.getString("custcode"));
				objQuoteBean.setCustName(rs.getString("customer_name"));
				objQuoteBean.setAddress(rs.getString("add1"));
				objQuoteBean.setPhone(rs.getString("phone"));
				objQuoteBean.setEmail(rs.getString("email"));
				objQuoteBean.setFaxNo(rs.getString("fax_no"));
				objQuoteBean.setQuoteAttn(rs.getString("quote_attn"));
				if(rs.getString("prices_gst_include").equals("Yes") || rs.getString("prices_gst_include")=="Yes")
					objQuoteBean.setPricesGstInclude(true);
				else
					objQuoteBean.setPricesGstInclude(false);
				objQuoteBean.setNotes(rs.getString("notes"));
				objQuoteBean.setUserId(rs.getInt("user_id"));
				objQuoteBean.setCreatedDate(rs.getString("created_date"));
				objQuoteBean.setCurrentSupplierId(rs.getInt("current_supplier_id"));
				objQuoteBean.setCurrentSupplierName(rs.getString("current_supplier_name"));
				objQuoteBean.setCompeteQuote(rs.getString("compete_quote"));
				objQuoteBean.setSalesPersonId(rs.getInt("sales_person_id"));
				objQuoteBean.setSalesPerson(rs.getString("sales_person_name"));
				objQuoteBean.setStatus(rs.getString("status"));
				productList = getProductDetails(rs.getInt("quote_id"));
				objQuoteBean.setProductList(productList);
				quoteList.add(objQuoteBean);
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return quoteList;
	}
	
	public ArrayList<ProductBean> getProductDetails(int quoteId)
	{
		ArrayList<ProductBean> productList = new ArrayList<ProductBean>();
		ProductBean objProductBean = null;
		String getData = "select quote_detail_id,quote_id,product_id,item_description,product_qty,avg_cost,quote_price,total, "
						+" gp_required,current_supplier_price,current_supplier_gp,current_supplier_total,savings,gst_flag "
						+" from create_quote_details qd join product_master pm on qd.product_id = pm.item_code "
						+" where quote_id="+quoteId+"";
		try {
			
			pstmt = conn.prepareStatement(getData);
			rs1 = pstmt.executeQuery();
			//System.out.println("Quote Details : "+pstmt);
			while(rs1.next())
			{
				objProductBean = new ProductBean();
				objProductBean.setQuoteId(rs1.getInt("quote_id"));
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
				productList.add(objProductBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return productList;
	}
	
	
	
	
	
}
