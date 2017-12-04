package responseBeans;

import pojo.ChartBean;
import responseStructure.Response;

public class ChartResponseBean extends Response{
private ChartBean total= new ChartBean(); 
private ChartBean pipeline= new ChartBean(); 
private ChartBean won= new ChartBean(); 
private ChartBean lost= new ChartBean(); 
private ChartBean closed= new ChartBean();
public ChartBean getTotal() {
	return total;
}
public void setTotal(ChartBean total) {
	this.total = total;
}
public ChartBean getPipeline() {
	return pipeline;
}
public void setPipeline(ChartBean pipeline) {
	this.pipeline = pipeline;
}
public ChartBean getWon() {
	return won;
}
public void setWon(ChartBean won) {
	this.won = won;
}
public ChartBean getLost() {
	return lost;
}
public void setLost(ChartBean lost) {
	this.lost = lost;
}
public ChartBean getClosed() {
	return closed;
}
public void setClosed(ChartBean closed) {
	this.closed = closed;
}

}
