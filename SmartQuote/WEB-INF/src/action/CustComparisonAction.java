package action;

import java.io.File;
import java.io.FileInputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;


import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;

import pojo.EmptyResponseBean;
import pojo.PDFMasterReportBean;
import pojo.PDFSubReportBean;
import pojo.QuoteBean;

import com.opensymphony.xwork2.ActionSupport;

import dao.CustComparisonDao;
import dao.QuoteDao;

@SuppressWarnings("serial")
public class CustComparisonAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {
	ArrayList<PDFMasterReportBean> arrayPdfMasterReportBeans = new ArrayList<PDFMasterReportBean>();
	ArrayList<PDFSubReportBean> arrayPDFSubReportBeanForPronto = new ArrayList<PDFSubReportBean>();
	String pattern = "#######.##";
	DecimalFormat decimalFormat = new DecimalFormat(pattern);

	Map<String, Object> exportParameters;
	ArrayList<String> list = new ArrayList<String>();
	QuoteBean objQuoteBean;
	int quoteId;
	HttpServletRequest request;
	HttpServletResponse response;
	private EmptyResponseBean objEmptyResponse = new EmptyResponseBean();

	/**
	 * 
	 */
	public CustComparisonAction() {
	}

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

	public Map<String, Object> getExportParameters() {
		return exportParameters;
	}

	public void setExportParameters(Map<String, Object> exportParameters) {
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
		int count = 0;
		for (int i = 0; i < productList.size(); i++) {
			if (productList.get(i).getAltForQuoteDetailId() > 0) {
				count++;
			}
		}
		return count;
	}

	public double getGstInPercentage(double price) {
		double gst = 0;
		gst = price * 10 / 100;
		// System.out.println("getGstInPercentage"+gst);
		return gst;
	}

	public PDFMasterReportBean getStandardCalculation(PDFMasterReportBean objPdfMasterReportBean) {
		PDFMasterReportBean obj = objPdfMasterReportBean;
		double currentSubTotal = 0, currentGstTotal = 0, currentTotal = 0;
		// --Current Total
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			if (obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("no")) {
				currentSubTotal = currentSubTotal + obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST();
				// System.out.println("obj.getArrayPdfSubReportBean().get(i)"
				// +obj.getArrayPdfSubReportBean().get(i).toString());
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					currentGstTotal = currentGstTotal
							+ getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST());
				}
			}
		}
		if (obj.isGstInclusive()) {
			currentSubTotal = currentSubTotal - currentGstTotal;
		}
		currentTotal = currentSubTotal + currentGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setCurrentSupplierSubtotal(convertToTwoDecimal(currentSubTotal));
		;
		objPdfMasterReportBean.getObjCalculationBean().setCurrentSupplierGST(convertToTwoDecimal(currentGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setCurrentSupplierTotal(convertToTwoDecimal(currentTotal));
		// --Jaybel Total
		double jaybelSubTotal = 0, jaybelGstTotal = 0, jaybelTotal = 0;
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			if (obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("no")) {
				jaybelSubTotal = jaybelSubTotal + obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST();
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					jaybelGstTotal = jaybelGstTotal
							+ getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST());
				}
			}
		}
		if (obj.isGstInclusive()) {
			jaybelSubTotal = jaybelSubTotal - jaybelGstTotal;
		}
		jaybelTotal = jaybelSubTotal + jaybelGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setJaybelSubtotal(convertToTwoDecimal(jaybelSubTotal));
		;
		objPdfMasterReportBean.getObjCalculationBean().setJaybelGST(convertToTwoDecimal(jaybelGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setJaybelTotal(convertToTwoDecimal(jaybelTotal));

		if (currentTotal > 0) {
			objPdfMasterReportBean.getObjCalculationBean().setSaving(convertToTwoDecimal(currentTotal - jaybelTotal));
			objPdfMasterReportBean.getObjCalculationBean().setAnnualSaving(convertToTwoDecimal((currentTotal - jaybelTotal) * 12));
			objPdfMasterReportBean.getObjCalculationBean().setSavingInPercentage(
					convertToTwoDecimal(((currentTotal - jaybelTotal) / currentTotal) * 100));
		} else {
			objPdfMasterReportBean.getObjCalculationBean().setSaving(convertToTwoDecimal(0));
			objPdfMasterReportBean.getObjCalculationBean().setAnnualSaving(convertToTwoDecimal(0));
			objPdfMasterReportBean.getObjCalculationBean().setSavingInPercentage(convertToTwoDecimal(0));
		}

		// objPdfMasterReportBean.setAltSavingInPercentage(getTwoDecimal(((getAltCurrentTotal(productList)-getAltJaybelTotal(productList))/getAltCurrentTotal(productList))*100));
		return obj;
	};

	public PDFMasterReportBean getAlternativeCalculation(PDFMasterReportBean objPdfMasterReportBean) {
		PDFMasterReportBean obj = objPdfMasterReportBean;
		double currentSubTotal = 0, currentGstTotal = 0, currentTotal = 0;
		// --Alt Current total
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			currentSubTotal = currentSubTotal + obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST();
			if (obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("yes")) {
				for (int j = 0; j < obj.getArrayPdfSubReportBean().size(); j++) {
					if (obj.getArrayPdfSubReportBean().get(j).getQuoteDetailId() == obj.getArrayPdfSubReportBean().get(i)
							.getAltForQuoteDetailId()) {
						currentSubTotal = currentSubTotal - obj.getArrayPdfSubReportBean().get(j).getProductCurrentPriceTotalExGST();
						if (obj.getArrayPdfSubReportBean().get(j).getGstExempt().equalsIgnoreCase("no")) {
							currentGstTotal = currentGstTotal
									- getGstInPercentage(obj.getArrayPdfSubReportBean().get(j).getProductCurrentPriceTotalExGST());
							currentGstTotal = currentGstTotal
									+ getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST());
						}
					}
				}
			} else {
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					currentGstTotal = currentGstTotal
							+ getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductCurrentPriceTotalExGST());
				}
			}
		}
		if (obj.isGstInclusive()) {
			currentSubTotal = currentSubTotal - currentGstTotal;
		}
		currentTotal = currentSubTotal + currentGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setAltCurrentSupplierSubtotal(convertToTwoDecimal(currentSubTotal));
		;
		objPdfMasterReportBean.getObjCalculationBean().setAltCurrentSupplierGST(convertToTwoDecimal(currentGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAltCurrentSupplierTotal(convertToTwoDecimal(currentTotal));
		// --Alt Jaybel total
		double jaybelSubTotal = 0, jaybelGstTotal = 0, jaybelTotal = 0;
		for (int i = 0; i < obj.getArrayPdfSubReportBean().size(); i++) {
			jaybelSubTotal = jaybelSubTotal + obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST();
			if (obj.getArrayPdfSubReportBean().get(i).getIsAlternative().equalsIgnoreCase("yes")) {
				for (int j = 0; j < obj.getArrayPdfSubReportBean().size(); j++) {
					if (obj.getArrayPdfSubReportBean().get(j).getQuoteDetailId() == obj.getArrayPdfSubReportBean().get(i)
							.getAltForQuoteDetailId()) {
						jaybelSubTotal = jaybelSubTotal - obj.getArrayPdfSubReportBean().get(j).getProductJaybelPriceTotalExGST();
						if (obj.getArrayPdfSubReportBean().get(j).getGstExempt().equalsIgnoreCase("no")) {
							jaybelGstTotal = jaybelGstTotal
									- getGstInPercentage(obj.getArrayPdfSubReportBean().get(j).getProductJaybelPriceTotalExGST());
							jaybelGstTotal = jaybelGstTotal
									+ getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST());
						}
					}
				}
			} else {
				if (obj.getArrayPdfSubReportBean().get(i).getGstExempt().equalsIgnoreCase("no")) {
					jaybelGstTotal = jaybelGstTotal
							+ getGstInPercentage(obj.getArrayPdfSubReportBean().get(i).getProductJaybelPriceTotalExGST());
				}
			}
		}
		if (obj.isGstInclusive()) {
			jaybelSubTotal = jaybelSubTotal - jaybelGstTotal;
		}
		jaybelTotal = jaybelSubTotal + jaybelGstTotal;
		objPdfMasterReportBean.getObjCalculationBean().setAltJaybelSubtotal(convertToTwoDecimal(jaybelSubTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAltJaybelGST(convertToTwoDecimal(jaybelGstTotal));
		objPdfMasterReportBean.getObjCalculationBean().setAltJaybelTotal(convertToTwoDecimal(jaybelTotal));

		if (currentTotal > 0) {
			objPdfMasterReportBean.getObjCalculationBean().setAltSaving(convertToTwoDecimal(currentTotal - jaybelTotal));
			objPdfMasterReportBean.getObjCalculationBean().setAltAnnualSaving(convertToTwoDecimal((currentTotal - jaybelTotal) * 12));
			objPdfMasterReportBean.getObjCalculationBean().setAltSavingInPercentage(
					convertToTwoDecimal(((currentTotal - jaybelTotal) / currentTotal) * 100));

		} else {
			objPdfMasterReportBean.getObjCalculationBean().setAltSaving(convertToTwoDecimal(0));
			objPdfMasterReportBean.getObjCalculationBean().setAltAnnualSaving(convertToTwoDecimal(0));
			objPdfMasterReportBean.getObjCalculationBean().setAltSavingInPercentage(convertToTwoDecimal(0));
		}

		return obj;
	}

	public void exportPDF() {
		try {
			exportParameters = new HashMap<String, Object>();
			String dirPath = request.getSession().getServletContext().getRealPath("/Reports");
			CustComparisonDao objCustComparisonDao = new CustComparisonDao();
			PDFMasterReportBean objPdfMasterReportBean = objCustComparisonDao.getQuoteInfo(quoteId);
			ArrayList<PDFSubReportBean> productList = objPdfMasterReportBean.getArrayPdfSubReportBean();
			int count = isAlternativeAddedInQuote(productList);
			if (count > 0) {
				objPdfMasterReportBean.setAlternativeAdded(true);
			} else {
				objPdfMasterReportBean.setAlternativeAdded(false);
			}
			// --getStandardCalculation()
			objPdfMasterReportBean = getStandardCalculation(objPdfMasterReportBean);
			if (objPdfMasterReportBean.isAlternativeAdded()) {
				objPdfMasterReportBean = getAlternativeCalculation(objPdfMasterReportBean);
			}
			// System.out.println("objPdfMasterReportBean :: " +
			// objPdfMasterReportBean);

			exportParameters.put("alternativeAdded", objPdfMasterReportBean.isAlternativeAdded());
			arrayPdfMasterReportBeans.add(objPdfMasterReportBean);
			exportParameters.put("subreportPath", dirPath + "/");
			String imgDirPath = request.getSession().getServletContext().getRealPath("/Images");
			exportParameters.put("frontCoverPath", imgDirPath + "/front_cover.jpg");
			exportParameters.put("backCoverPath", imgDirPath + "/back_cover.jpg");
			exportParameters.put("officeChoiceLogo", imgDirPath + "/officeChoice.png");
			String pageFooterText = "";
			if (objPdfMasterReportBean.isGstInclusive()) {
				pageFooterText = "All prices quoted are including GST. Pricing guaranteed for 6 months provided our supplier prices remain the same.";
			} else {
				pageFooterText = "All prices quoted are excluding GST. Pricing guaranteed for 6 months provided our supplier prices remain the same.";
			}
			exportParameters.put("pageFooterText", pageFooterText);
			String custLogoPath = System.getProperty("user.dir") + getText("customer_logo_folder_path");
			String salesRepProfilePath = System.getProperty("user.dir") + getText("sales_rep_template_folder_path");
			File file = new File(custLogoPath + "CustId_" + objPdfMasterReportBean.getCustId() + ".png");
			File file1 = new File(salesRepProfilePath + "UserId_" + objPdfMasterReportBean.getDedicatedAccountManagerId() + ".png");
			if (!file.exists()) {
				exportParameters.put("customerLogoPath", "");
			} else {
				exportParameters.put("customerLogoPath", file.toString());
			}
			if (!file1.exists()) {
				exportParameters.put("salesRepProfilePath", "");
			} else {
				exportParameters.put("salesRepProfilePath", file1.toString());
			}

			QuoteDao objQuoteDao = new QuoteDao();
			objPdfMasterReportBean
					.setOfferList(objQuoteDao.getOfferList(objPdfMasterReportBean.getQuoteId(), getText("offer_template_url")));
			objPdfMasterReportBean.setTermConditionList(objQuoteDao.getTermAndConditionList(objPdfMasterReportBean.getQuoteId()));
			objQuoteDao.closeAll();
			 System.out.println("OFFER LIST ::"+objPdfMasterReportBean.getOfferList().toString());

			JRBeanCollectionDataSource beanColDataSourceHeaderPage = new JRBeanCollectionDataSource(arrayPdfMasterReportBeans);
			JRBeanCollectionDataSource beanColDataSourceProductDetailPage = new JRBeanCollectionDataSource(arrayPdfMasterReportBeans.get(0)
					.getArrayPdfSubReportBean());
			JRBeanCollectionDataSource beanColDataSourceFooterPage = new JRBeanCollectionDataSource(arrayPdfMasterReportBeans);
			JRBeanCollectionDataSource beanColDataSalesRepInfoPage = new JRBeanCollectionDataSource(arrayPdfMasterReportBeans);

			String mainHeaderPageSrc = dirPath + "/MainHeaderPage.jasper";
			String productDetailsPageSrc = dirPath + "/ProductDetailsPage.jasper";
			String mainFooterPageSrc = dirPath + "/MainFooterPage.jasper";
			String salesRepInfoPageSrc = dirPath + "/SalesRepInfoPage.jasper";

			FileInputStream reportHeader = new FileInputStream(mainHeaderPageSrc);
			FileInputStream reportProDetail = new FileInputStream(productDetailsPageSrc);
			FileInputStream reportFooter = new FileInputStream(mainFooterPageSrc);
			FileInputStream reportSalesRep = new FileInputStream(salesRepInfoPageSrc);

			exportParameters.put("objCalculationBean", arrayPdfMasterReportBeans.get(0).getObjCalculationBean());
			exportParameters.put("pdfMasterBean", objPdfMasterReportBean);

			String termCondition = "";
			if (objPdfMasterReportBean.getTermConditionList().size() > 0) {
				// System.out.println("Term :: "+objPdfMasterReportBean.getTermConditionList());
				for (int i = 0; i < objPdfMasterReportBean.getTermConditionList().size(); i++) {
					if (i < objPdfMasterReportBean.getTermConditionList().size() - 1) {
						termCondition = termCondition + objPdfMasterReportBean.getTermConditionList().get(i).getValue() + ", ";
					} else {
						termCondition = termCondition + objPdfMasterReportBean.getTermConditionList().get(i).getValue() + ". ";
					}
				}
				exportParameters.put("termCondition", termCondition);
			}

			JasperPrint jasperPrintHeader = JasperFillManager.fillReport(reportHeader, exportParameters, beanColDataSourceHeaderPage);
			JasperPrint jasperPrintProDetail = JasperFillManager.fillReport(reportProDetail, exportParameters,
					beanColDataSourceProductDetailPage);
			JasperPrint jasperPrintFooter = JasperFillManager.fillReport(reportFooter, exportParameters, beanColDataSourceFooterPage);
			JasperPrint jasperPrintSalesRep = JasperFillManager.fillReport(reportSalesRep, exportParameters, beanColDataSalesRepInfoPage);

			JRPdfExporter exp = new JRPdfExporter();
			List<JasperPrint> list = new ArrayList<JasperPrint>();
			list.add(jasperPrintHeader);
			list.add(jasperPrintSalesRep);
			list.add(jasperPrintProDetail);

			JRBeanCollectionDataSource beanColDataSourceForOfferDetailsPage = null;
			String OfferDetailsPageSrc = "";
			JasperPrint jasperPrintOfferDetail = null;
			FileInputStream reportOfferDetail = null;
			if (objPdfMasterReportBean.getOfferList().size() > 0) {
				beanColDataSourceForOfferDetailsPage = new JRBeanCollectionDataSource(arrayPdfMasterReportBeans.get(0).getOfferList());
				OfferDetailsPageSrc = dirPath + "/OfferDetailsPage.jasper";
				reportOfferDetail = new FileInputStream(OfferDetailsPageSrc);
				jasperPrintOfferDetail = JasperFillManager.fillReport(reportOfferDetail, exportParameters,
						beanColDataSourceForOfferDetailsPage);
				list.add(jasperPrintOfferDetail);
			}
			list.add(jasperPrintFooter);

			exp.setParameter(JRPdfExporterParameter.JASPER_PRINT_LIST, list);
			exp.setParameter(JRExporterParameter.OUTPUT_STREAM, response.getOutputStream());
			// exp.setParameter(JRExporterParameter.OUTPUT_FILE_NAME,
			// "Quote_"+objPdfMasterReportBean.getQuoteId()+".pdf");
			// response.setContentType("text/pdf");
			// response.setHeader ("Content-Disposition",
			// "attachment; filename=\""+"Quote_"+objPdfMasterReportBean.getQuoteId()+".pdf\"");

			exp.exportReport();
			System.out.println("Done...!");
			objCustComparisonDao.closeAll();
			// System.out.println("Export params ::"+exportParameters);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String exportToPronto() {
		try {
			exportParameters = new HashMap<String, Object>();
			String dirPath = request.getSession().getServletContext().getRealPath("/Reports");
			CustComparisonDao objCustComparisonDao = new CustComparisonDao();
			PDFMasterReportBean objMasterReportBean = objCustComparisonDao.getQuoteInfo(quoteId);
			System.out.println("dirPath: " + dirPath);
			exportParameters.put("subreportPath", dirPath + "/");
			arrayPdfMasterReportBeans.add(objMasterReportBean);
			// objCustComparisonDao.commit();
			objCustComparisonDao.closeAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public void pdfDemo() {
		try {
			String dirPath = request.getSession().getServletContext().getRealPath("/Reports");
			String sourceFileName = dirPath + "/demoPDFMaster.jasper";
			String subreport1 = dirPath + "/demoReportPage2.jasper";

			ArrayList<PDFMasterReportBean> objMList = new ArrayList<PDFMasterReportBean>();
			PDFMasterReportBean objBean = new PDFMasterReportBean();
			objMList.add(objBean);

			JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(objMList);
			JRBeanCollectionDataSource beanColDataSource2 = new JRBeanCollectionDataSource(objMList);
			Map<String, Object> parameters = new HashMap<String, Object>();
			parameters.put("subReportPath", dirPath);

			FileInputStream report1 = new FileInputStream(sourceFileName);
			FileInputStream report2 = new FileInputStream(subreport1);
			JasperPrint jasperPrint = JasperFillManager.fillReport(report1, parameters, beanColDataSource);
			JasperPrint jasperPrint2 = JasperFillManager.fillReport(report2, parameters, beanColDataSource2);
			JRPdfExporter exp = new JRPdfExporter();
			List<JasperPrint> list = new ArrayList<JasperPrint>();
			list.add(jasperPrint);
			
			List<JasperPrint> list1 = new ArrayList<JasperPrint>();
			list1.add(jasperPrint2);
			
//			JRPdfExporter exporter = new JRPdfExporter();
//			exporter.setExporterInput(SimpleExporterInput.getInstance(list)); //Set as export input my list with JasperPrint s
//			exporter.setExporterInput(SimpleExporterInput.getInstance(list1));
//			exporter.setExporterOutput(new SimpleOutputStreamExporterOutput("/home/radhika/Documents/Give Away POS_Part1.pdf")); //or any other out streaam
//			SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
//			configuration.setCreatingBatchModeBookmarks(true); //add this so your bookmarks work, you may set other parameters
//			exporter.setConfiguration(configuration);
//			exporter.exportReport();
			
			exp.setParameter(JRPdfExporterParameter.JASPER_PRINT_LIST, list);
			exp.setParameter(JRExporterParameter.OUTPUT_STREAM, response.getOutputStream());
			exp.exportReport();
			System.out.println("Done...!");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public double getTwoDecimal(double total) {
		double roundTotal = 0;
		roundTotal = Double.parseDouble(String.format("%.2f", total));
		return roundTotal;
	}

	public double convertToTwoDecimal(double value) {
		// System.out.println("Double :" +value);
		Double objDouble = new Double(value);
		String str = decimalFormat.format(objDouble);
		return Double.parseDouble(str);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.apache.struts2.interceptor.ServletResponseAware#setServletResponse
	 * (javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public void setServletResponse(HttpServletResponse arg0) {
		this.response = arg0;
	}

}
