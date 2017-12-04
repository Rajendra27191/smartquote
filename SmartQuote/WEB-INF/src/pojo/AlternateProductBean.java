package pojo;

import java.util.ArrayList;

public class AlternateProductBean {
private String mainProductCode;//--
private String mainProductDesc;//--
private String mainProductUnit;//--
private double mainProductPrice;//--
private double mainProductAvgCost;//--
private double mainPromoPrice;//--
//private ArrayList<String> alternativeProductCodeList=new ArrayList<String>();//--
private ArrayList<AlternateProductDetailBean> alternativeProductList=new ArrayList<AlternateProductDetailBean>();
private AlternateProductDetailBean altProductObj=new AlternateProductDetailBean();
//private ArrayList<AlternateProductBean> alternativeProductsDetailList = new ArrayList<AlternateProductBean>();

//private String altProductCode;//--
//private String altProductDesc;//--
//private String altProductDesc2;
//private String altProductDesc3;
//private String altProductUnit;//--
//private double altProductAvgCost;//--
//private double altProductDefaultPrice;//--
//
//private double altProductPrice0exGST;//--

//private double altProductPrice1exGST;
//private double altProductPrice2exGST;
//private double altProductPrice3exGST;
//private double altProductPrice4exGST;
//private int altProductItemQty;
//private double altProductTotal;
//private double altProductQuotePrice;
//private double altProductCurrentSupplierPrice;
//private double altProductCurrentSupplierGP;
//private double altProductCurrentSupplierTotal;
//private double altProductGpRequired;
//
//private String altProductGstFlag;
//private double altProductSavings;

//==================


//==================


public String getMainProductCode() {
	return mainProductCode;
}
//public String getAltProductDesc2() {
//	return altProductDesc2;
//}
//public void setAltProductDesc2(String altProductDesc2) {
//	this.altProductDesc2 = altProductDesc2;
//}
//public String getAltProductDesc3() {
//	return altProductDesc3;
//}
//public void setAltProductDesc3(String altProductDesc3) {
//	this.altProductDesc3 = altProductDesc3;
//}
//public double getAltProductPrice0exGST() {
//	return altProductPrice0exGST;
//}
//public void setAltProductPrice0exGST(double altProductPrice0exGST) {
//	this.altProductPrice0exGST = altProductPrice0exGST;
//}
//public double getAltProductPrice1exGST() {
//	return altProductPrice1exGST;
//}
//public void setAltProductPrice1exGST(double altProductPrice1exGST) {
//	this.altProductPrice1exGST = altProductPrice1exGST;
//}
//public double getAltProductPrice2exGST() {
//	return altProductPrice2exGST;
//}
//public void setAltProductPrice2exGST(double altProductPrice2exGST) {
//	this.altProductPrice2exGST = altProductPrice2exGST;
//}
//public double getAltProductPrice3exGST() {
//	return altProductPrice3exGST;
//}
//public void setAltProductPrice3exGST(double altProductPrice3exGST) {
//	this.altProductPrice3exGST = altProductPrice3exGST;
//}
//public double getAltProductPrice4exGST() {
//	return altProductPrice4exGST;
//}
//public void setAltProductPrice4exGST(double altProductPrice4exGST) {
//	this.altProductPrice4exGST = altProductPrice4exGST;
//}
//public int getAltProductItemQty() {
//	return altProductItemQty;
//}
//public void setAltProductItemQty(int altProductItemQty) {
//	this.altProductItemQty = altProductItemQty;
//}
//public double getAltProductTotal() {
//	return altProductTotal;
//}
//public void setAltProductTotal(double altProductTotal) {
//	this.altProductTotal = altProductTotal;
//}
//public double getAltProductQuotePrice() {
//	return altProductQuotePrice;
//}
//public void setAltProductQuotePrice(double altProductQuotePrice) {
//	this.altProductQuotePrice = altProductQuotePrice;
//}
//public double getAltProductCurrentSupplierPrice() {
//	return altProductCurrentSupplierPrice;
//}
//public void setAltProductCurrentSupplierPrice(double altProductCurrentSupplierPrice) {
//	this.altProductCurrentSupplierPrice = altProductCurrentSupplierPrice;
//}
//public double getAltProductCurrentSupplierGP() {
//	return altProductCurrentSupplierGP;
//}
//public void setAltProductCurrentSupplierGP(double altProductCurrentSupplierGP) {
//	this.altProductCurrentSupplierGP = altProductCurrentSupplierGP;
//}
//public double getAltProductCurrentSupplierTotal() {
//	return altProductCurrentSupplierTotal;
//}
//public void setAltProductCurrentSupplierTotal(double altProductCurrentSupplierTotal) {
//	this.altProductCurrentSupplierTotal = altProductCurrentSupplierTotal;
//}
//public double getAltProductGpRequired() {
//	return altProductGpRequired;
//}
//public void setAltProductGpRequired(double altProductGpRequired) {
//	this.altProductGpRequired = altProductGpRequired;
//}
//public String getAltProductGstFlag() {
//	return altProductGstFlag;
//}
//public void setAltProductGstFlag(String altProductGstFlag) {
//	this.altProductGstFlag = altProductGstFlag;
//}
//public double getAltProductSavings() {
//	return altProductSavings;
//}
//public void setAltProductSavings(double altProductSavings) {
//	this.altProductSavings = altProductSavings;
//}

//public ArrayList<String> getAlternativeProductCodeList() {
//	return alternativeProductCodeList;
//}
//public void setAlternativeProductCodeList(ArrayList<String> alternativeProductCodeList) {
//	this.alternativeProductCodeList = alternativeProductCodeList;
//}
public void setMainProductCode(String mainProductCode) {
	this.mainProductCode = mainProductCode;
}
public String getMainProductDesc() {
	return mainProductDesc;
}
public void setMainProductDesc(String mainProductDesc) {
	this.mainProductDesc = mainProductDesc;
}
public String getMainProductUnit() {
	return mainProductUnit;
}
public void setMainProductUnit(String mainProductUnit) {
	this.mainProductUnit = mainProductUnit;
}
public double getMainProductPrice() {
	return mainProductPrice;
}
public void setMainProductPrice(double mainProductPrice) {
	this.mainProductPrice = mainProductPrice;
}
public double getMainProductAvgCost() {
	return mainProductAvgCost;
}
public void setMainProductAvgCost(double mainProductAvgCost) {
	this.mainProductAvgCost = mainProductAvgCost;
}
//public String getAltProductCode() {
//	return altProductCode;
//}
//public void setAltProductCode(String altProductCode) {
//	this.altProductCode = altProductCode;
//}
//public String getAltProductDesc() {
//	return altProductDesc;
//}
//public void setAltProductDesc(String altProductDesc) {
//	this.altProductDesc = altProductDesc;
//}
//public String getAltProductUnit() {
//	return altProductUnit;
//}
//public void setAltProductUnit(String altProductUnit) {
//	this.altProductUnit = altProductUnit;
//}
//
//public double getAltProductAvgCost() {
//	return altProductAvgCost;
//}
//public void setAltProductAvgCost(double altProductAvgCost) {
//	this.altProductAvgCost = altProductAvgCost;
//}

//@Override
//public String toString() {
//	return "AlternateProductBean [mainProductCode=" + mainProductCode + ", alternativeProductCodeList=" + alternativeProductCodeList + "]";
//}

//public double getAltProductDefaultPrice() {
//	return altProductDefaultPrice;
//}
//public void setAltProductDefaultPrice(double altProductDefaultPrice) {
//	this.altProductDefaultPrice = altProductDefaultPrice;
//}
//public ArrayList<AlternateProductBean> getAlternativeProductsDetailList() {
//	return alternativeProductsDetailList;
//}
//public void setAlternativeProductsDetailList(ArrayList<AlternateProductBean> alternativeProductsDetailList) {
//	this.alternativeProductsDetailList = alternativeProductsDetailList;
//}
public ArrayList<AlternateProductDetailBean> getAlternativeProductList() {
	return alternativeProductList;
}
public void setAlternativeProductList(ArrayList<AlternateProductDetailBean> alternativeProductList) {
	this.alternativeProductList = alternativeProductList;
}

public AlternateProductDetailBean getAltProductObj() {
	return altProductObj;
}

public void setAltProductObj(AlternateProductDetailBean altProductObj) {
	this.altProductObj = altProductObj;
}

public double getMainPromoPrice() {
	return mainPromoPrice;
}

public void setMainPromoPrice(double mainPromoPrice) {
	this.mainPromoPrice = mainPromoPrice;
}


}
