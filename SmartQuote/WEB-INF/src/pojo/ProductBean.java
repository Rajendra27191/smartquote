package pojo;

import java.util.ArrayList;

import javax.swing.text.StyledEditorKit.BoldAction;

public class ProductBean {
	private String itemCode;
	private String itemDescription;
	private String description2;
	private String description3;
	private String unit;
	private double qtyBreak0;
	private double price0exGST;
	private double qtyBreak1;
	private double price1exGST;
	private double qtyBreak2;
	private double price2exGST;
	private double qtyBreak3;
	private double price3exGST;
	private double qtyBreak4;
	private double price4exGST;
	private double avgcost;
	private String taxCode;
	private String created_by;
	private int itemQty;
	private double total;
	private double quotePrice;
	private double currentSupplierPrice;
	private double currentSupplierGP;
	private double currentSupplierTotal;
	private double gpRequired;
	private String productGroupCode;
	private String productGroupName;
	private String gstFlag;
	private double savings;
	private int quoteId;
	private int quoteDetailId;
	private String isNewProduct;
	private String isAlternative;
	private int altForQuoteDetailId;
	private ArrayList<ProductBean> alternativeProductList;
	private ProductBean altProd;
//-----------------------------------
	private double altDefaultPrice;
	
	public int getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(int quoteId) {
		this.quoteId = quoteId;
	}

	public double getSavings() {
		return savings;
	}

	public void setSavings(double savings) {
		this.savings = savings;
	}

	public String getGstFlag() {
		return gstFlag;
	}

	public void setGstFlag(String gstFlag) {
		this.gstFlag = gstFlag;
	}

	public String getProductGroupName() {
		return productGroupName;
	}

	public void setProductGroupName(String productGroupName) {
		this.productGroupName = productGroupName;
	}

	public String getProductGroupCode() {
		return productGroupCode;
	}

	public void setProductGroupCode(String productGroupCode) {
		this.productGroupCode = productGroupCode;
	}

	public double getCurrentSupplierPrice() {
		return currentSupplierPrice;
	}

	public void setCurrentSupplierPrice(double currentSupplierPrice) {
		this.currentSupplierPrice = currentSupplierPrice;
	}

	public double getCurrentSupplierGP() {
		return currentSupplierGP;
	}

	public void setCurrentSupplierGP(double currentSupplierGP) {
		this.currentSupplierGP = currentSupplierGP;
	}

	public double getCurrentSupplierTotal() {
		return currentSupplierTotal;
	}

	public void setCurrentSupplierTotal(double currentSupplierTotal) {
		this.currentSupplierTotal = currentSupplierTotal;
	}

	public double getGpRequired() {
		return gpRequired;
	}

	public void setGpRequired(double gpRequired) {
		this.gpRequired = gpRequired;
	}

	public double getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(double quotePrice) {
		this.quotePrice = quotePrice;
	}

	public int getItemQty() {
		return itemQty;
	}

	public void setItemQty(int itemQty) {
		this.itemQty = itemQty;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getItemDescription() {
		return itemDescription;
	}

	public void setItemDescription(String itemDescription) {
		this.itemDescription = itemDescription;
	}

	public String getDescription2() {
		return description2;
	}

	public void setDescription2(String description2) {
		this.description2 = description2;
	}

	public String getDescription3() {
		return description3;
	}

	public void setDescription3(String description3) {
		this.description3 = description3;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getQtyBreak0() {
		return qtyBreak0;
	}

	public void setQtyBreak0(double qtyBreak0) {
		this.qtyBreak0 = qtyBreak0;
	}

	public double getPrice0exGST() {
		return price0exGST;
	}

	public void setPrice0exGST(double price0exGST) {
		this.price0exGST = price0exGST;
	}

	public double getQtyBreak1() {
		return qtyBreak1;
	}

	public void setQtyBreak1(double qtyBreak1) {
		this.qtyBreak1 = qtyBreak1;
	}

	public double getPrice1exGST() {
		return price1exGST;
	}

	public void setPrice1exGST(double price1exGST) {
		this.price1exGST = price1exGST;
	}

	public double getQtyBreak2() {
		return qtyBreak2;
	}

	public void setQtyBreak2(double qtyBreak2) {
		this.qtyBreak2 = qtyBreak2;
	}

	public double getPrice2exGST() {
		return price2exGST;
	}

	public void setPrice2exGST(double price2exGST) {
		this.price2exGST = price2exGST;
	}

	public double getQtyBreak3() {
		return qtyBreak3;
	}

	public void setQtyBreak3(double qtyBreak3) {
		this.qtyBreak3 = qtyBreak3;
	}

	public double getPrice3exGST() {
		return price3exGST;
	}

	public void setPrice3exGST(double price3exGST) {
		this.price3exGST = price3exGST;
	}

	public double getQtyBreak4() {
		return qtyBreak4;
	}

	public void setQtyBreak4(double qtyBreak4) {
		this.qtyBreak4 = qtyBreak4;
	}

	public double getPrice4exGST() {
		return price4exGST;
	}

	public void setPrice4exGST(double price4exGST) {
		this.price4exGST = price4exGST;
	}

	public double getAvgcost() {
		return avgcost;
	}

	public void setAvgcost(double avgcost) {
		this.avgcost = avgcost;
	}

	public String getTaxCode() {
		return taxCode;
	}

	public void setTaxCode(String taxCode) {
		this.taxCode = taxCode;
	}

	public String getCreated_by() {
		return created_by;
	}

	public void setCreated_by(String created_by) {
		this.created_by = created_by;
	}

	public String getIsNewProduct() {
		return isNewProduct;
	}

	public void setIsNewProduct(String isNewProduct) {
		this.isNewProduct = isNewProduct;
	}

	public ArrayList<ProductBean> getAlternativeProductList() {
		return alternativeProductList;
	}

	public void setAlternativeProductList(ArrayList<ProductBean> alternativeProductList) {
		this.alternativeProductList = alternativeProductList;
	}

	public String getIsAlternative() {
		return isAlternative;
	}

	public void setIsAlternative(String isAlternative) {
		this.isAlternative = isAlternative;
	}

	public ProductBean getAltProd() {
		return altProd;
	}

	public void setAltProd(ProductBean altProd) {
		this.altProd = altProd;
	}

	@Override
	public String toString() {
		return "ProductBean [itemCode=" + itemCode + ", itemDescription=" + itemDescription + ", description2=" + description2
				+ ", description3=" + description3 + ", unit=" + unit + ", qtyBreak0=" + qtyBreak0 + ", price0exGST=" + price0exGST
				+ ", qtyBreak1=" + qtyBreak1 + ", price1exGST=" + price1exGST + ", qtyBreak2=" + qtyBreak2 + ", price2exGST=" + price2exGST
				+ ", qtyBreak3=" + qtyBreak3 + ", price3exGST=" + price3exGST + ", qtyBreak4=" + qtyBreak4 + ", price4exGST=" + price4exGST
				+ ", avgcost=" + avgcost + ", taxCode=" + taxCode + ", created_by=" + created_by + ", itemQty=" + itemQty + ", total="
				+ total + ", quotePrice=" + quotePrice + ", currentSupplierPrice=" + currentSupplierPrice + ", currentSupplierGP="
				+ currentSupplierGP + ", currentSupplierTotal=" + currentSupplierTotal + ", gpRequired=" + gpRequired
				+ ", productGroupCode=" + productGroupCode + ", productGroupName=" + productGroupName + ", gstFlag=" + gstFlag
				+ ", savings=" + savings + ", quoteId=" + quoteId + ", isNewProduct=" + isNewProduct + ", isAlternative=" + isAlternative
				+ ", alternativeProductList=" + alternativeProductList + ", altProd=" + altProd + "]";
	}

	public int getAltForQuoteDetailId() {
		return altForQuoteDetailId;
	}

	public void setAltForQuoteDetailId(int altForQuoteDetailId) {
		this.altForQuoteDetailId = altForQuoteDetailId;
	}

	public int getQuoteDetailId() {
		return quoteDetailId;
	}

	public void setQuoteDetailId(int quoteDetailId) {
		this.quoteDetailId = quoteDetailId;
	}

	public double getAltDefaultPrice() {
		return altDefaultPrice;
	}

	public void setAltDefaultPrice(double altDefaultPrice) {
		this.altDefaultPrice = altDefaultPrice;
	}
	

}
