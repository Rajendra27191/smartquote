package action;

import java.util.ArrayList;
import java.util.Map;

import com.opensymphony.xwork2.ActionSupport;

public class CustComparisonAction extends ActionSupport{
	
	Map<String ,String > exportParameters ;
	ArrayList<String> list = new ArrayList<String>();
	
	public Map<String, String> getExportParameters() {
		return exportParameters;
	}
	public void setExportParameters(Map<String, String> exportParameters) {
		this.exportParameters = exportParameters;
	}
	public ArrayList<String> getList() {
		return list;
	}
	public void setList(ArrayList<String> list) {
		this.list = list;
	}

	
	
	
}
