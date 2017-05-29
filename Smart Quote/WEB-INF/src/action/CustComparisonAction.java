package action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.PDFMasterReportBean;
import pojo.QuoteBean;

import com.opensymphony.xwork2.ActionSupport;

import dao.CustComparisonDao;

@SuppressWarnings("serial")
public class CustComparisonAction extends ActionSupport implements ServletRequestAware {
	ArrayList<PDFMasterReportBean> arrayPdfMasterReportBeans = new ArrayList<PDFMasterReportBean>();
	Map<String, String> exportParameters;
	ArrayList<String> list = new ArrayList<String>();
	QuoteBean objQuoteBean;
	int quoteId;
	HttpServletRequest request;
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

	public EmptyResponseBean getObjEmptyResponse() {
		return objEmptyResponse;
	}

	public void setObjEmptyResponse(EmptyResponseBean objEmptyResponse) {
		this.objEmptyResponse = objEmptyResponse;
	}

	public ArrayList<PDFMasterReportBean> getArrayPdfMasterReportBeans() {
		return arrayPdfMasterReportBeans;
	}

	public void setArrayPdfMasterReportBeans(ArrayList<PDFMasterReportBean> arrayPdfMasterReportBeans) {
		this.arrayPdfMasterReportBeans = arrayPdfMasterReportBeans;
	}

	public int getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(int quoteId) {
		this.quoteId = quoteId;
	}

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

	public QuoteBean getObjQuoteBean() {
		return objQuoteBean;
	}

	public void setObjQuoteBean(QuoteBean objQuoteBean) {
		this.objQuoteBean = objQuoteBean;
	}

	public String exportPDF() {
		try {
			exportParameters = new HashMap<String, String>();
			String dirPath = request.getSession().getServletContext().getRealPath("/Reports");
			CustComparisonDao objCustComparisonDao = new CustComparisonDao();
			PDFMasterReportBean objMasterReportBean = objCustComparisonDao.getQuoteInfo(quoteId);
			arrayPdfMasterReportBeans.add(objMasterReportBean);
			exportParameters.put("subreportPath", dirPath + "/");
			String imgDirPath=request.getSession().getServletContext().getRealPath("/Images");
			exportParameters.put("headerImg1Path", imgDirPath + "/header_img1.png");
			exportParameters.put("headerImg2Path", imgDirPath + "/header_img2.png");
			exportParameters.put("headerImg3Path", imgDirPath + "/header_img3.png");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
