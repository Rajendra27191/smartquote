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
	ResultSet rs = null;
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


	
}
