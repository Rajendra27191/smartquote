package action;

import pojo.ObjectFactory;
import pojo.Report;
import pojo.Report.Detail;
import pojo.Report.Detail.CustomerWrapper;
import pojo.Report.Detail.CustomerWrapper.TransactionWrapper;
import pojo.Report.Detail.CustomerWrapper.TransactionWrapper.CustomerTransactions;
import pojo.Report.Detail.CustomerWrapper.TransactionWrapper.CustomerTransactions.Transactions;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBIntrospector;
import javax.xml.bind.Unmarshaller;

import com.google.gson.Gson;

public class XMLReader {

	public Report convertXMLFileToReport(String filepath) {
		Report objMyPojo = null;
		FileInputStream inputFile = null;
		try {
			inputFile = new FileInputStream(filepath);
			// 1. We need to create JAXContext instance
			JAXBContext jaxbContext = JAXBContext.newInstance(ObjectFactory.class);
			// 2. Use JAXBContext instance to create the Unmarshaller.
			Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
			objMyPojo = (Report) JAXBIntrospector.getValue(unmarshaller.unmarshal(inputFile));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				inputFile.close();
				System.out.println("File Closed...!");
			} catch (IOException e) {
				System.out.println("Error While Closing File...!");
				e.printStackTrace();
			}
		}
		return objMyPojo;
	}

	public List<Report.Detail> getDetailList(Report objReport) {
		List<Object> pageList = objReport.getSkipOneOrReportInfoOrPageHeader();
		List<Report.Detail> detailList = new ArrayList<Report.Detail>();
		for (int pageCount = 0; pageCount < pageList.size(); pageCount++) {
			String className = pageList.get(pageCount).getClass().getSimpleName();
			if (className.equals("Detail")) {
				Detail objDetail = (Detail) pageList.get(pageCount);
				detailList.add(objDetail);
			} else {
			}
		}
		return detailList;
	}

	public List<Report.Detail> getCheckedDetailList(List<Report.Detail> pageList) {
		int lastDetailIndex = 2, lastWrapperArraySize = 0, currentWrapperArraySize = 0;
		for (int pageCount = 0; pageCount < pageList.size(); pageCount++) {
			String className = pageList.get(pageCount).getClass().getSimpleName();
			// System.out.println(className);
			if (className.equals("Detail")) {
//				System.out.println("lastDetailIndex " + lastDetailIndex);
				Detail objDetail = (Detail) pageList.get(pageCount);
				if (objDetail.getCustomerWrapper().size() > 0) {
					currentWrapperArraySize = objDetail.getCustomerWrapper().size();
					for (int j = 0; j < objDetail.getCustomerWrapper().size(); j++) {
						CustomerWrapper objCurrentCustomerWrapper = objDetail.getCustomerWrapper().get(j);
//						System.out.println("JSON HEADER: " + new Gson().toJson(objCurrentCustomerWrapper.getCustomerHeader()));
						if (objCurrentCustomerWrapper.getCustomerHeader().size() > 0) {
						} else {
							Detail objLastDetail = (Detail) pageList.get(lastDetailIndex);
							lastWrapperArraySize = objLastDetail.getCustomerWrapper().size();
							CustomerWrapper objLastCustomerWrapper = objLastDetail.getCustomerWrapper().get(lastWrapperArraySize - 1);
							if (objCurrentCustomerWrapper.getTransactionWrapper().size() > 0) {
								if (objLastCustomerWrapper.getTransactionWrapper().size() > 0) {
//									System.out.println("SDC " + new Gson().toJson(objLastCustomerWrapper));
									for (int i = 0; i < objCurrentCustomerWrapper.getTransactionWrapper().size(); i++) {
										TransactionWrapper currentTransactionWrapper = objCurrentCustomerWrapper.getTransactionWrapper()
												.get(i);
										for (int k = 0; k < currentTransactionWrapper.getCustomerTransactions().size(); k++) {
											CustomerTransactions currentCustomerTransactions = currentTransactionWrapper
													.getCustomerTransactions().get(k);
											for (int l = 0; l < currentCustomerTransactions.getTransactions().size(); l++) {
												Transactions currentTransactions = currentCustomerTransactions.getTransactions().get(l);
												objLastCustomerWrapper.getTransactionWrapper().get(i).getCustomerTransactions().get(k)
														.getTransactions().add(currentTransactions);
											}
										}
									}
								} else {
									for (int i = 0; i < objCurrentCustomerWrapper.getTransactionWrapper().size(); i++) {
										objLastCustomerWrapper.getTransactionWrapper().add(
												objCurrentCustomerWrapper.getTransactionWrapper().get(i));
									}
								}
							}
							// System.out.println("objCurrentCustomerWrapper.getCustomerTotal() "+objCurrentCustomerWrapper.getCustomerTotal());
							if (objCurrentCustomerWrapper.getCustomerTotal().size() > 0) {
								if (objLastCustomerWrapper.getCustomerTotal().size() > 0) {

								} else {
									for (int i = 0; i < objCurrentCustomerWrapper.getCustomerTotal().size(); i++) {
										objLastCustomerWrapper.getCustomerTotal().add(objCurrentCustomerWrapper.getCustomerTotal().get(i));
									}
								}
							}

							if (currentWrapperArraySize == 1) {
								pageList.remove(pageCount);
								pageCount--;
							} else {
								objDetail.getCustomerWrapper().remove(j);
							}

						}
					}
				}
				lastDetailIndex = pageCount;
			}
		}
		return pageList;
	}

	// ReportInfo 0
	// PageHeader 1 4 7 10 13 16
	// Detail 2 5 8 11 14 17
	// SoftPage 3 6 9 12 15 18
	public Report validateCustomerDetails(Report objReport) {
		int lastDetailIndex = 2, lastCustomerWrapperArraySize = 0;
		List<Object> pageList = objReport.getSkipOneOrReportInfoOrPageHeader();
		System.out.println("1..." + pageList.size());
		for (int pageCount = 0; pageCount < pageList.size(); pageCount++) {
			String className = pageList.get(pageCount).getClass().getSimpleName();
			// System.out.println(className);
			if (className.equals("Detail")) {
				// System.out.println("lastDetailIndex " + lastDetailIndex);
				Detail objDetail = (Detail) pageList.get(pageCount);
				if (objDetail.getCustomerWrapper().size() > 0) {
					for (int j = 0; j < objDetail.getCustomerWrapper().size(); j++) {
						CustomerWrapper objCurrentCustomerWrapper = objDetail.getCustomerWrapper().get(j);
						// System.out.println("JSON HEADER: " + new
						// Gson().toJson(objCurrentCustomerWrapper.getCustomerHeader()));
						if (objCurrentCustomerWrapper.getCustomerHeader().size() > 0) {
						} else {
							Detail objLastDetail = (Detail) pageList.get(lastDetailIndex);
							lastCustomerWrapperArraySize = objLastDetail.getCustomerWrapper().size();
							CustomerWrapper objLastCustomerWrapper = objLastDetail.getCustomerWrapper().get(
									lastCustomerWrapperArraySize - 1);
							if (objCurrentCustomerWrapper.getTransactionWrapper().size() > 0) {
								if (objLastCustomerWrapper.getTransactionWrapper().size() > 0) {
									// System.out.println("SDC " + new
									// Gson().toJson(objLastCustomerWrapper));
									for (int i = 0; i < objCurrentCustomerWrapper.getTransactionWrapper().size(); i++) {
										TransactionWrapper currentTransactionWrapper = objCurrentCustomerWrapper.getTransactionWrapper()
												.get(i);
										for (int k = 0; k < currentTransactionWrapper.getCustomerTransactions().size(); k++) {
											CustomerTransactions currentCustomerTransactions = currentTransactionWrapper
													.getCustomerTransactions().get(k);
											for (int l = 0; l < currentCustomerTransactions.getTransactions().size(); l++) {
												Transactions currentTransactions = currentCustomerTransactions.getTransactions().get(l);
												objLastCustomerWrapper.getTransactionWrapper().get(i).getCustomerTransactions().get(k)
														.getTransactions().add(currentTransactions);
											}
										}
									}
								} else {
									for (int i = 0; i < objCurrentCustomerWrapper.getTransactionWrapper().size(); i++) {
										objLastCustomerWrapper.getTransactionWrapper().add(
												objCurrentCustomerWrapper.getTransactionWrapper().get(i));
									}
								}
							}
							// System.out.println("objCurrentCustomerWrapper.getCustomerTotal() "+objCurrentCustomerWrapper.getCustomerTotal());
							if (objCurrentCustomerWrapper.getCustomerTotal().size() > 0) {
								if (objLastCustomerWrapper.getCustomerTotal().size() > 0) {

								} else {
									for (int i = 0; i < objCurrentCustomerWrapper.getCustomerTotal().size(); i++) {
										objLastCustomerWrapper.getCustomerTotal().add(objCurrentCustomerWrapper.getCustomerTotal().get(i));
									}
								}
							}
							objDetail.getCustomerWrapper().remove(j);
						}
					}
				}
				lastDetailIndex = pageCount;
			}
		}
		// System.out.println("RESULT ::" + new Gson().toJson(pageList.get(2)));
		// System.out.println("RESULT ::" + new Gson().toJson(pageList.get(5)));
		// System.out.println("RESULT ::" + new Gson().toJson(pageList.get(8)));
		// System.out.println("RESULT ::" + new
		// Gson().toJson(pageList.get(11)));
		return objReport;
	}

}
