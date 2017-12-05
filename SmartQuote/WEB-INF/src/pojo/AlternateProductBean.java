package pojo;

import java.util.ArrayList;

public class AlternateProductBean {
private String mainProductCode;//--
private String mainProductDesc;//--
private String mainProductUnit;//--
private double mainProductPrice;//--
private double mainProductAvgCost;//--
private double mainPromoPrice;//--
private ArrayList<AlternateProductDetailBean> alternativeProductList=new ArrayList<AlternateProductDetailBean>();
private AlternateProductDetailBean altProductObj=new AlternateProductDetailBean();

public String getMainProductCode() {
	return mainProductCode;
}
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
