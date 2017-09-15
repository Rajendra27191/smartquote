package action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.EmptyResponseBean;
import pojo.PDFMasterReportBean;
import pojo.PDFSubReportBean;
import pojo.QuoteBean;

import com.opensymphony.xwork2.ActionSupport;

import dao.CustComparisonDao;

@SuppressWarnings("serial")
public class CustComparisonAction extends ActionSupport implements ServletRequestAware {
	ArrayList<PDFMasterReportBean> arrayPdfMasterReportBeans = new ArrayList<PDFMasterReportBean>();
	ArrayList<PDFSubReportBean> arrayPDFSubReportBeanForPronto = new ArrayList<PDFSubReportBean>();
	
	

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
	
	public ArrayList<PDFSubReportBean> getArrayPDFSubReportBeanForPronto() {
		return arrayPDFSubReportBeanForPronto;
	}

	public void setArrayPDFSubReportBeanForPronto(ArrayList<PDFSubReportBean> arrayPDFSubReportBeanForPronto) {
		this.arrayPDFSubReportBeanForPronto = arrayPDFSubReportBeanForPronto;
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
			PDFMasterReportBean objPdfMasterReportBean = objCustComparisonDao.getQuoteInfo(quoteId);
			ArrayList<PDFSubReportBean> productList=objPdfMasterReportBean.getArrayPdfSubReportBean();
//			boolean isAlternativeAdded=false;
			int count=0;
			for (int i = 0; i < productList.size(); i++) {
				if(productList.get(i).getAltForQuoteDetailId()>0){
					count++;
				}
			}
			if(count>0){
				objPdfMasterReportBean.setAlternativeAdded(true);	
			}else{
				objPdfMasterReportBean.setAlternativeAdded(false);	
			}
			
			objPdfMasterReportBean.setCurrentTotal(getTwoDecimal(getCurrentTotal(productList)));
			System.out.println("getCurrentTotal : "+getTwoDecimal(getCurrentTotal(productList)));
			objPdfMasterReportBean.setJaybelTotal(getTwoDecimal(getJaybelTotal(productList)));
			System.out.println("getJaybelTotal : "+getTwoDecimal(getJaybelTotal(productList)));
			objPdfMasterReportBean.setAltCurrentTotal(getTwoDecimal(getAltCurrentTotal(productList)));
			System.out.println("getAltCurrentTotal : "+getTwoDecimal(getAltCurrentTotal(productList)));
			objPdfMasterReportBean.setAltJaybelTotal(getTwoDecimal(getAltJaybelTotal(productList)));
			System.out.println("getAltJaybelTotal : "+getTwoDecimal(getAltJaybelTotal(productList)));
			
			if (getCurrentTotal(productList)>getJaybelTotal(productList)) {
				objPdfMasterReportBean.setSaving(getTwoDecimal(getCurrentTotal(productList)-getJaybelTotal(productList)));
				objPdfMasterReportBean.setAnnualSaving(getTwoDecimal((getCurrentTotal(productList)-getJaybelTotal(productList))*12));
				objPdfMasterReportBean.setSavingInPercentage(getTwoDecimal(((getCurrentTotal(productList)-getJaybelTotal(productList))/getCurrentTotal(productList))*100));
			}
			if (getAltCurrentTotal(productList)>getAltJaybelTotal(productList)) {
				objPdfMasterReportBean.setAltSaving(getTwoDecimal(getAltCurrentTotal(productList)-getAltJaybelTotal(productList)));
				objPdfMasterReportBean.setAltAnnualSaving(getTwoDecimal((getAltCurrentTotal(productList)-getAltJaybelTotal(productList))*12));
				objPdfMasterReportBean.setAltSavingInPercentage(getTwoDecimal(((getAltCurrentTotal(productList)-getAltJaybelTotal(productList))/getAltCurrentTotal(productList))*100));
			}
			
			arrayPdfMasterReportBeans.add(objPdfMasterReportBean);
			exportParameters.put("subreportPath", dirPath + "/");
			String imgDirPath=request.getSession().getServletContext().getRealPath("/Images");
			exportParameters.put("headerImg1Path", imgDirPath + "/header_img1.png");
			exportParameters.put("headerImg2Path", imgDirPath + "/header_img2.png");
			exportParameters.put("headerImg3Path", imgDirPath + "/header_img3.png");
			exportParameters.put("footerImg1Path", imgDirPath + "/footer_img1.png");
			exportParameters.put("footerImg2Path", imgDirPath + "/footer_img2.png");

			
			System.out.println(objPdfMasterReportBean.toString());
			System.out.println(objPdfMasterReportBean.getArrayPdfSubReportBean().get(0).toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
	public String exportToPronto() {
		try {
			exportParameters = new HashMap<String, String>();
			String dirPath = request.getSession().getServletContext().getRealPath("/Reports");
			CustComparisonDao objCustComparisonDao = new CustComparisonDao();
			PDFMasterReportBean objMasterReportBean = objCustComparisonDao.getQuoteInfo(quoteId);
			System.out.println("dirPath: "+ dirPath);
			exportParameters.put("subreportPath", dirPath + "/");
			arrayPdfMasterReportBeans.add(objMasterReportBean);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
	public double getCurrentTotal(ArrayList<PDFSubReportBean> productList) {
		double total=0;
		for (int i = 0; i < productList.size(); i++) {
			if (productList.get(i).getIsAlternative().equalsIgnoreCase("no")) {
				total=total+productList.get(i).getProductCurrentPriceTotalExGST();	
			}
			
		}
		return total;
	}
	public double getJaybelTotal(ArrayList<PDFSubReportBean> productList) {
		double total=0;
		for (int i = 0; i < productList.size(); i++) {
			if (productList.get(i).getIsAlternative().equalsIgnoreCase("no")){
			total=total+productList.get(i).getProductJaybelPriceTotalExGST();
			}
		}
		return total;
	}
		
	public double getAltCurrentTotal(ArrayList<PDFSubReportBean> productList) {
		double total=0;
		for (int i = 0; i < productList.size(); i++) {
			total=total+productList.get(i).getProductCurrentPriceTotalExGST();	
			if(productList.get(i).getIsAlternative().equalsIgnoreCase("yes")){
				for (int j = 0; j < productList.size(); j++) {
					if(productList.get(j).getQuoteDetailId()== productList.get(i).getAltForQuoteDetailId()){
						total=total-productList.get(j).getProductCurrentPriceTotalExGST();
					}
				}
			}
		}
		return total;
	}
	public double getAltJaybelTotal(ArrayList<PDFSubReportBean> productList) {
		double total=0;
		for (int i = 0; i < productList.size(); i++) {
//			System.out.println("I "+productList.get(i).getAltForQuoteDetailId());
			total=total+productList.get(i).getProductJaybelPriceTotalExGST();
//			System.out.println(productList.get(i).getIsAlternative().equalsIgnoreCase("no"));
			if(productList.get(i).getIsAlternative().equalsIgnoreCase("yes")){
				for (int j = 0; j < productList.size(); j++) {
					if(productList.get(j).getQuoteDetailId()==productList.get(i).getAltForQuoteDetailId()){
						total=total-productList.get(j).getProductJaybelPriceTotalExGST();
					}
				}
			}
		}
		return total;
	}
	
	public double getTwoDecimal(double total){
		double roundTotal=0;	
		roundTotal=Double.parseDouble(String.format( "%.2f", total));
		return roundTotal;
	}

}
