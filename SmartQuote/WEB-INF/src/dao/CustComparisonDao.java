package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.PDFMasterReportBean;
import pojo.PDFSubReportBean;
import connection.ConnectionFactory;

public class CustComparisonDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public CustComparisonDao() {
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
	
	public ArrayList<PDFSubReportBean> getProductDetails(int quoteId) {
		ArrayList<PDFSubReportBean> productList = new ArrayList<PDFSubReportBean>();
		
		PDFSubReportBean objPdfSubReportBean = null;
		
		String getData = "select quote_detail_id,quote_id,product_id,item_description,product_qty,avg_cost,quote_price,total, "
				+ " gp_required,current_supplier_price,current_supplier_gp,current_supplier_total,savings,gst_flag,"
				+ " ifnull(is_alternate, 'no') is_alternate, ifnull(alternate_for, 0) alternate_for,"
				+ " unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, price3exGST, "
				+ " qty_break4, price4exGST, tax_code "
				+ " from create_quote_details qd join product_master pm on qd.product_id = pm.item_code "
				+ " where quote_id=" + quoteId;
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			// System.out.println("Quote Details : " + pstmt);
			while (rs.next()) {
				objPdfSubReportBean = new PDFSubReportBean();
				objPdfSubReportBean.setProductCode(rs.getString("product_id"));
				objPdfSubReportBean.setProductDescription(rs.getString("item_description"));
				objPdfSubReportBean.setProductUOM(rs.getString("unit"));
				objPdfSubReportBean.setProductQty(rs.getInt("product_qty"));
				objPdfSubReportBean.setProductCurrentPriceExGST(getTwoDecimal(rs.getDouble("current_supplier_price")));
//				System.out.println("CurrentSupplier"+(rs.getDouble("current_supplier_price")));
				objPdfSubReportBean.setProductCurrentPriceTotalExGST(getTwoDecimal(rs.getDouble("current_supplier_total")));
				objPdfSubReportBean.setProductJaybelPriceExGST(getTwoDecimal(rs.getDouble("quote_price")));
//				System.out.println("JaybelQuotePrice"+(rs.getDouble("quote_price")));
				objPdfSubReportBean.setProductJaybelPriceTotalExGST(getTwoDecimal(rs.getDouble("total")));
				objPdfSubReportBean.setProductSavings(getTwoDecimal(rs.getDouble("savings")));
				objPdfSubReportBean.setQuoteDetailId(rs.getInt("quote_detail_id"));
				objPdfSubReportBean.setAltForQuoteDetailId(rs.getInt("alternate_for"));
				objPdfSubReportBean.setIsAlternative(rs.getString("is_alternate"));
				productList.add(objPdfSubReportBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return productList;
	}

	public PDFMasterReportBean getQuoteInfo(int quoteId) {
		ArrayList<PDFSubReportBean> productList = new ArrayList<PDFSubReportBean>();
		PDFMasterReportBean objPdfMasterReportBean=null;
		String getData = "select quote_id,custcode,customer_name,add1,phone,email,fax_no,quote_attn,prices_gst_include,notes, "
				+ " user_id,DATE(created_date) created_date,DATE(modified_date) modified_date,cq.current_supplier_id,current_supplier_name,compete_quote, "
				+ " cq.sales_person_id,sales_person_name,status "
				+ " from create_quote cq left outer join customer_master cm on cq.custcode=cm.customer_code "
				+ " left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
				+ " left outer join sales_person sp on cq.sales_person_id = sp.sales_person_id" + " WHERE quote_id=?"
				+ " order by created_date desc;";
		try {
			pstmt = conn.prepareStatement(getData);
			pstmt.setInt(1, quoteId);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objPdfMasterReportBean = new PDFMasterReportBean();
				objPdfMasterReportBean.setDedicatedAccountManager(rs.getString("customer_name"));
				objPdfMasterReportBean.setContact(rs.getString("phone"));
				objPdfMasterReportBean.setEmail(rs.getString("email"));
				productList = getProductDetails(rs.getInt("quote_id"));
     			objPdfMasterReportBean.setArrayPdfSubReportBean(productList);
     			

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objPdfMasterReportBean;
	}


	public double getTwoDecimal(double total){
		double roundTotal=0;	
		roundTotal=Double.parseDouble(String.format( "%.2f", total));
		return roundTotal;
	}
	

}
