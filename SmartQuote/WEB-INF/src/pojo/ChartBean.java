package pojo;

public class ChartBean {
private String fromDate;
private String toDate;
private String userID;

public String getUserID() {
	return userID;
}
public void setUserID(String userID) {
	this.userID = userID;
}
public String getFromDate() {
	return fromDate;
}
public void setFromDate(String fromDate) {
	this.fromDate = fromDate;
}
public String getToDate() {
	return toDate;
}
public void setToDate(String toDate) {
	this.toDate = toDate;
}
@Override
public String toString() {
	return "ChartBean [fromDate=" + fromDate + ", toDate=" + toDate + ", userID=" + userID + "]";
}




}
