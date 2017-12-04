package pojo;

public class OfferBean {
private int id;
private String code;
private String offerName;
private String offerTemplate;

public int getId() {
	return id;
}
public void setId(int id) {
	this.id = id;
}
public String getOfferName() {
	return offerName;
}
public void setOfferName(String offerName) {
	this.offerName = offerName;
}
public String getOfferTemplate() {
	return offerTemplate;
}
public void setOfferTemplate(String offerTemplate) {
	this.offerTemplate = offerTemplate;
}
@Override
public String toString() {
	return "OfferBean [id=" + id + ", offerName=" + offerName + ", offerTemplate=" + offerTemplate + "]";
}
public String getCode() {
	return code;
}
public void setCode(String code) {
	this.code = code;
}

}
