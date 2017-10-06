package action;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
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
	String pattern = "#######.##";
	DecimalFormat decimalFormat = new DecimalFormat(pattern);
	

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
	
	public int isAlternativeAddedInQuote(ArrayList<PDFSubReportBean> productList) {
		int count=0;
		for (int i = 0; i < productList.size(); i++) {
			if(productList.get(i).getAltForQuoteDetailId()>0){
				count++;
			}
		}
		return count;
	}
	public double getGstInPercentage(double price) {
		double gst=0;
		gst=price*10/100;
//		System.out.println("getGstInPercentage"+gst);
		return gst;
	}
	
	public PDFMasterReportBean getStandardCalculation(PDFMasterReportBean objPdfMasterReportBean){
		PDFMasterReportBean obj=objPdfMasterReportBean;
		double currentSubTotal=0,currentGstTotal=0,currentTotal=0;
		//--Current Total
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			if (obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("no")) {
				currentSubTotal=currentSubTotal+obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST();	
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					currentGstTotal=currentGstTotal+getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST());	
				}
			}
		}
		if(obj.isGstInclusive()){
			currentSubTotal=currentSubTotal-currentGstTotal;	
		}
		currentTotal=currentSubTotal+currentGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setCurrentSupplierSubtotal(convertToTwoDecimal(currentSubTotal));;
		objPdfMasterReportBean.getObjCalculationBean().setCurrentSupplierGST(convertToTwoDecimal(currentGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setCurrentSupplierTotal(convertToTwoDecimal(currentTotal));
		//--Jaybel Total
		double jaybelSubTotal=0,jaybelGstTotal=0,jaybelTotal=0;
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			if (obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("no")) {
				jaybelSubTotal=jaybelSubTotal+obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST();
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					jaybelGstTotal=jaybelGstTotal+getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST());
				}				
			}
		}
		if(obj.isGstInclusive()){
			jaybelSubTotal=jaybelSubTotal-jaybelGstTotal;
		}
		jaybelTotal=jaybelSubTotal+jaybelGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setJaybelSubtotal(convertToTwoDecimal(jaybelSubTotal));;
		objPdfMasterReportBean.getObjCalculationBean().setJaybelGST(convertToTwoDecimal(jaybelGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setJaybelTotal(convertToTwoDecimal(jaybelTotal));
		
		objPdfMasterReportBean.getObjCalculationBean().setSaving(convertToTwoDecimal(currentTotal-jaybelTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAnnualSaving(convertToTwoDecimal((currentTotal-jaybelTotal)*12));
		objPdfMasterReportBean.getObjCalculationBean().setSavingInPercentage(convertToTwoDecimal(((currentTotal-jaybelTotal)/currentTotal)*100));
//		objPdfMasterReportBean.setAltSavingInPercentage(getTwoDecimal(((getAltCurrentTotal(productList)-getAltJaybelTotal(productList))/getAltCurrentTotal(productList))*100));
		return obj;
	};
	public PDFMasterReportBean getAlternativeCalculation(PDFMasterReportBean objPdfMasterReportBean){
		PDFMasterReportBean obj=objPdfMasterReportBean;
		double currentSubTotal=0,currentGstTotal=0,currentTotal=0;
		//--Alt Current total
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			currentSubTotal=currentSubTotal+obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST();	
			if(obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("yes")){
				for (int j = 0; j < obj.getArrayPdfSubReportBean().size(); j++) {
					if(obj.getArrayPdfSubReportBean().get(j).getQuoteDetailId()== obj.getArrayPdfSubReportBean().get(i).getAltForQuoteDetailId()){
						currentSubTotal=currentSubTotal-obj.getArrayPdfSubReportBean().get(j).getProductCurrentPriceTotalExGST();
						if (obj.getArrayPdfSubReportBean().get(j).getGstExempt().equalsIgnoreCase("no")) {
							currentGstTotal= currentGstTotal-getGstInPercentage(obj.getArrayPdfSubReportBean().get(j).getProductCurrentPriceTotalExGST());
							currentGstTotal= currentGstTotal+getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST());	
						}
					}
				}
			}else{
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					currentGstTotal=currentGstTotal+getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST());
				}
			}
		}
		if(obj.isGstInclusive()){
			currentSubTotal=currentSubTotal-currentGstTotal;
		}
		currentTotal=currentSubTotal+currentGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setAltCurrentSupplierSubtotal(convertToTwoDecimal(currentSubTotal));;
		objPdfMasterReportBean.getObjCalculationBean().setAltCurrentSupplierGST(convertToTwoDecimal(currentGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAltCurrentSupplierTotal(convertToTwoDecimal(currentTotal));
		//--Alt Jaybel total
		double jaybelSubTotal=0,jaybelGstTotal=0,jaybelTotal=0;
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			jaybelSubTotal=jaybelSubTotal+obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST();	
			if(obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("yes")){
				for (int j = 0; j < obj.getArrayPdfSubReportBean().size(); j++) {
					if(obj.getArrayPdfSubReportBean().get(j).getQuoteDetailId()== obj.getArrayPdfSubReportBean().get(i).getAltForQuoteDetailId()){
						jaybelSubTotal=jaybelSubTotal-obj.getArrayPdfSubReportBean().get(j).getProductJaybelPriceTotalExGST();
						if (obj.getArrayPdfSubReportBean().get(j).getGstExempt().equalsIgnoreCase("no")) {
							jaybelGstTotal= jaybelGstTotal-getGstInPercentage(obj.getArrayPdfSubReportBean().get(j).getProductJaybelPriceTotalExGST());
							jaybelGstTotal= jaybelGstTotal+getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST());	
						}
					}
				}
			}else{
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					jaybelGstTotal= jaybelGstTotal+getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST());
				}
			}
		}
		if(obj.isGstInclusive()){	
			jaybelSubTotal=jaybelSubTotal-jaybelGstTotal;
		}
		jaybelTotal=jaybelSubTotal+jaybelGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setAltJaybelSubtotal(convertToTwoDecimal(jaybelSubTotal));;
		objPdfMasterReportBean.getObjCalculationBean().setAltJaybelGST(convertToTwoDecimal(jaybelGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAltJaybelTotal(convertToTwoDecimal(jaybelTotal));
		
		objPdfMasterReportBean.getObjCalculationBean().setAltSaving(convertToTwoDecimal(currentTotal-jaybelTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAltAnnualSaving(convertToTwoDecimal((currentTotal-jaybelTotal)*12));
		objPdfMasterReportBean.getObjCalculationBean().setAltSavingInPercentage(convertToTwoDecimal(((currentTotal-jaybelTotal)/currentTotal)*100));
		return obj;
	}
	
	public String exportPDF() {
		try {
			exportParameters = new HashMap<String, String>();
			String dirPath = request.getSession().getServletContext().getRealPath("/Reports");
			CustComparisonDao objCustComparisonDao = new CustComparisonDao();
			PDFMasterReportBean objPdfMasterReportBean = objCustComparisonDao.getQuoteInfo(quoteId);
			ArrayList<PDFSubReportBean> productList=objPdfMasterReportBean.getArrayPdfSubReportBean();
			int count=isAlternativeAddedInQuote(productList);
			if(count>0){
				objPdfMasterReportBean.setAlternativeAdded(true);	
			}else{
				objPdfMasterReportBean.setAlternativeAdded(false);	
			}
			//--getStandardCalculation()
			objPdfMasterReportBean=getStandardCalculation(objPdfMasterReportBean);
			objPdfMasterReportBean=getAlternativeCalculation(objPdfMasterReportBean);
						
			System.out.println("objPdfMasterReportBean :: "+objPdfMasterReportBean);
			
//			objPdfMasterReportBean.setCurrentTotal(getTwoDecimal(getCurrentTotal(productList)));
//			System.out.println("getCurrentTotal : "+getTwoDecimal(getCurrentTotal(productList)));
//			objPdfMasterReportBean.setJaybelTotal(getTwoDecimal(getJaybelTotal(productList)));
//			System.out.println("getJaybelTotal : "+getTwoDecimal(getJaybelTotal(productList)));
//			objPdfMasterReportBean.setAltCurrentTotal(getTwoDecimal(getAltCurrentTotal(productList)));
//			System.out.println("getAltCurrentTotal : "+getTwoDecimal(getAltCurrentTotal(productList)));
//			objPdfMasterReportBean.setAltJaybelTotal(getTwoDecimal(getAltJaybelTotal(productList)));
//			System.out.println("getAltJaybelTotal : "+getTwoDecimal(getAltJaybelTotal(productList)));
			
//			if (getCurrentTotal(productList)>getJaybelTotal(productList)) {
//				objPdfMasterReportBean.setSaving(getTwoDecimal(getCurrentTotal(productList)-getJaybelTotal(productList)));
//				objPdfMasterReportBean.setAnnualSaving(getTwoDecimal((getCurrentTotal(productList)-getJaybelTotal(productList))*12));
//				objPdfMasterReportBean.setSavingInPercentage(getTwoDecimal(((getCurrentTotal(productList)-getJaybelTotal(productList))/getCurrentTotal(productList))*100));
//			}
//			if (getAltCurrentTotal(productList)>getAltJaybelTotal(productList)) {
//				objPdfMasterReportBean.setAltSaving(getTwoDecimal(getAltCurrentTotal(productList)-getAltJaybelTotal(productList)));
//				objPdfMasterReportBean.setAltAnnualSaving(getTwoDecimal((getAltCurrentTotal(productList)-getAltJaybelTotal(productList))*12));
//				objPdfMasterReportBean.setAltSavingInPercentage(getTwoDecimal(((getAltCurrentTotal(productList)-getAltJaybelTotal(productList))/getAltCurrentTotal(productList))*100));
//			}
			
			arrayPdfMasterReportBeans.add(objPdfMasterReportBean);
			exportParameters.put("subreportPath", dirPath + "/");
			String imgDirPath=request.getSession().getServletContext().getRealPath("/Images");
			exportParameters.put("headerImg1Path", imgDirPath + "/header_img1.png");
			exportParameters.put("headerImg2Path", imgDirPath + "/header_img2.png");
			exportParameters.put("headerImg3Path", imgDirPath + "/header_img3.png");
			exportParameters.put("footerImg1Path", imgDirPath + "/footer_img1.png");
			exportParameters.put("footerImg2Path", imgDirPath + "/footer_img2.png");
			String custLogoPath=getText("customer_logo_folder_path");;
			File file = new File(custLogoPath + "CustId_" + objPdfMasterReportBean.getCustId()+".png");
			if (!file.exists()) {
				exportParameters.put("customerLogoPath",imgDirPath + "/no-image.png");
			}else{
				exportParameters.put("customerLogoPath", custLogoPath + "CustId_" + objPdfMasterReportBean.getCustId()+".png");
			}
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
	
	public double getTwoDecimal(double total){
		double roundTotal=0;	
		roundTotal=Double.parseDouble(String.format( "%.2f", total));
		return roundTotal;
	}
	
	public double convertToTwoDecimal(double value){
		Double objDouble = new Double(value);
		String str=decimalFormat.format(objDouble);
		return Double.parseDouble(str);
	}

}
