package pojo;

public class PDFSubReportBean {
private String productCode;
private String productDescription;
private String productUOM;
private int productQty;
private double productCurrentPriceExGST;
private double productCurrentPriceTotalExGST;
private double productJaybelPriceExGST;
private double productJaybelPriceTotalExGST;
private double productSavings;
private String isAlternative;
private int quoteDetailId;
private int altForQuoteDetailId;
private String gstExempt;
private String lineComment;

private String isSpecialCode;

public String getLineComment() {
	return lineComment;
}
public void setLineComment(String lineComment) {
	this.lineComment = lineComment;
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
public String getProductCode() {
	return productCode;
}
public void setProductCode(String productCode) {
	this.productCode = productCode;
}
public String getProductDescription() {
	return productDescription;
}
public void setProductDescription(String productDescription) {
	this.productDescription = productDescription;
}
public String getProductUOM() {
	return productUOM;
}
public void setProductUOM(String productUOM) {
	this.productUOM = productUOM;
}
public int getProductQty() {
	return productQty;
}
public void setProductQty(int productQty) {
	this.productQty = productQty;
}
public double getProductCurrentPriceExGST() {
	return productCurrentPriceExGST;
}
public void setProductCurrentPriceExGST(double productCurrentPriceExGST) {
	this.productCurrentPriceExGST = productCurrentPriceExGST;
}
public double getProductCurrentPriceTotalExGST() {
	return productCurrentPriceTotalExGST;
}
public void setProductCurrentPriceTotalExGST(double productCurrentPriceTotalExGST) {
	this.productCurrentPriceTotalExGST = productCurrentPriceTotalExGST;
}
public double getProductJaybelPriceExGST() {
	return productJaybelPriceExGST;
}
public void setProductJaybelPriceExGST(double productJaybelPriceExGST) {
	this.productJaybelPriceExGST = productJaybelPriceExGST;
}
public double getProductJaybelPriceTotalExGST() {
	return productJaybelPriceTotalExGST;
}
public void setProductJaybelPriceTotalExGST(double productJaybelPriceTotalExGST) {
	this.productJaybelPriceTotalExGST = productJaybelPriceTotalExGST;
}
public double getProductSavings() {
	return productSavings;
}
public void setProductSavings(double productSavings) {
	this.productSavings = productSavings;
}
public String getIsAlternative() {
	return isAlternative;
}
public void setIsAlternative(String isAlternative) {
	this.isAlternative = isAlternative;
}

public String getGstExempt() {
	return gstExempt;
}
public void setGstExempt(String gstExempt) {
	this.gstExempt = gstExempt;
}
@Override
public String toString() {
	return "PDFSubReportBean [productCode=" + productCode + ", productDescription=" + productDescription + ", productUOM=" + productUOM
			+ ", productQty=" + productQty + ", productCurrentPriceExGST=" + productCurrentPriceExGST + ", productCurrentPriceTotalExGST="
			+ productCurrentPriceTotalExGST + ", productJaybelPriceExGST=" + productJaybelPriceExGST + ", productJaybelPriceTotalExGST="
			+ productJaybelPriceTotalExGST + ", productSavings=" + productSavings + ", isAlternative=" + isAlternative + ", quoteDetailId="
			+ quoteDetailId + ", altForQuoteDetailId=" + altForQuoteDetailId + ", gstExempt=" + gstExempt + "]";
}
public String getIsSpecialCode() {
	return isSpecialCode;
}
public void setIsSpecialCode(String isSpecialCode) {
	this.isSpecialCode = isSpecialCode;
}


}
