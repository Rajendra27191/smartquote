package action;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.OfferBean;
import responseBeans.DetailResponseBean;
import responseBeans.OfferResponseBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.commons.io.FilenameUtils;

import dao.OfferDao;

@SuppressWarnings("serial")
public class OfferAction extends ActionSupport implements ServletRequestAware {
	HttpServletRequest request;
	HttpSession httpSession;
	private OfferResponseBean objOfferResponseBean;
	private DetailResponseBean objDetailResponseBean;
	public File templateFile;

	public OfferResponseBean getObjOfferResponseBean() {
		return objOfferResponseBean;
	}

	public void setObjOfferResponseBean(OfferResponseBean objOfferResponseBean) {
		this.objOfferResponseBean = objOfferResponseBean;
	}

//	public boolean createOfferTemplate(File srcFile, String destFileName) {
//		boolean isTemplateCreated = false;
//		String projectTemplatePath = System.getProperty("user.dir") + getText("offer_template_folder_path");
//		// System.out.println("projectTemplatePath ::" + projectTemplatePath);
//		File fileToCreate = new File(projectTemplatePath + destFileName);
//		// System.out.println("fileTocreate" + fileToCreate);
//		try {
//			if (!fileToCreate.exists()) {
//				FileUtils.copyFile(srcFile, fileToCreate);
//				System.out.println("1.LOGO saved ::: " + fileToCreate);
//			} else {
//				fileToCreate.delete();
//				FileUtils.copyFile(srcFile, fileToCreate);
//				System.out.println("2.LOGO saved ::: " + fileToCreate);
//			}
//			isTemplateCreated = true;
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		return isTemplateCreated;
//	}

//	public boolean deleteOfferTemplate(String destFileName) {
//		boolean isTemplateDeleted = false;
//		String projectTemplatePath = System.getProperty("user.dir") + getText("offer_template_folder_path");
//		// System.out.println("projectTemplatePath ::" + projectTemplatePath);
//		File deleteTemplate = new File(projectTemplatePath + destFileName);
//		// System.out.println("fileTocreate" + deleteTemplate);
//		try {
//			deleteTemplate.delete();
//			isTemplateDeleted = true;
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return isTemplateDeleted;
//	}

	public String createOffer() {
		String offerDetail = "", extension = "";
		boolean isOfferExist;
		int offerId = 0;
		objDetailResponseBean = new DetailResponseBean();
		offerDetail = request.getParameter("offerDetail");
		OfferBean objBean = new OfferBean();
		objBean = new Gson().fromJson(offerDetail, OfferBean.class);
		OfferDao objDao = new OfferDao();
		isOfferExist = objDao.isOfferExist(objBean.getOfferName());
		// System.out.println("isOfferExist ::" + objBean);
		// String basename =
		// FilenameUtils.getBaseName(objBean.getOfferTemplate());
		extension = FilenameUtils.getExtension(objBean.getOfferTemplate());
		if (!isOfferExist) {
			offerId = objDao.saveOffer(objBean.getOfferName());
			System.out.println("offerCount ::" + offerId);
			objDao.commit();
			objDao.closeAll();
			if (offerId > 0) {
				String offerTemplate = "offer_template_" + offerId + ".png";
				// boolean isTemplateSaved =false;
				System.out.println("offerTemplate : " + offerTemplate);
				if (templateFile != null) {
					if (extension.equals("pdf")) {
						String destDirPath = System.getProperty("user.dir") + getText("offer_template_folder_path");
						CommonLoadAction.convertPdfToImage(templateFile + "", destDirPath, offerTemplate);
					} else {
//						createOfferTemplate(templateFile, offerTemplate);
						CommonLoadAction.createTemplate(offerTemplate, templateFile,getText("offer_template_folder_path"));
					}
				}
				objDetailResponseBean.setCode("success");
				objDetailResponseBean.setGenratedId(offerId);
				objDetailResponseBean.setGenratedUrl(getText("offer_template_url") + offerTemplate);
				objDetailResponseBean.setMessage(getText("offer created successfully"));
			} else {
				objDetailResponseBean.setCode("error");
				objDetailResponseBean.setMessage(getText("common_error"));
			}
		} else {
			objDetailResponseBean.setCode("error");
			objDetailResponseBean.setMessage(getText("error_offer_exist"));
		}
		return SUCCESS;
	}

	public String getOffersList() {
		objOfferResponseBean = new OfferResponseBean();
		try {
			ArrayList<OfferBean> arrayOfferBeans = new ArrayList<OfferBean>();
			OfferDao objOfferDao = new OfferDao();
			arrayOfferBeans = objOfferDao.getOfferList(getText("offer_template_folder_path"), getText("offer_template_url"),
					getText("alt_offer_template_url"));
			if (arrayOfferBeans.size() > 0) {
				objOfferResponseBean.setCode("success");
				objOfferResponseBean.setMessage(getText("details_loaded"));
				objOfferResponseBean.setResult(arrayOfferBeans);
			} else {
				objOfferResponseBean.setCode("error");
				objOfferResponseBean.setMessage(getText("details_not_loaded"));
				objOfferResponseBean.setResult(arrayOfferBeans);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	};

	public String deleteOffer() {
		objDetailResponseBean = new DetailResponseBean();
		objDetailResponseBean.setCode("error");
		objDetailResponseBean.setMessage(getText("common_error"));
		OfferDao objOfferDao = new OfferDao();
		int offerId = Integer.parseInt(request.getParameter("id"));
		try {
			boolean isDeleted = objOfferDao.deleteOffer(offerId);
			String offerTemplate = "offer_template_" + offerId + ".png";
//			deleteOfferTemplate(offerTemplate);
			CommonLoadAction.deleteTemplate(offerTemplate, getText("offer_template_folder_path"));
			objOfferDao.commit();
			objOfferDao.closeAll();
			if (isDeleted) {
				objDetailResponseBean.setCode("success");
				objDetailResponseBean.setMessage(getText("offer deleted successfully"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String updateOffer() {
		String offerDetail = "", extension = "", offerTemplate = "";
		objDetailResponseBean = new DetailResponseBean();
		offerDetail = request.getParameter("offerDetail");
		OfferBean objBean = new OfferBean();
		objBean = new Gson().fromJson(offerDetail, OfferBean.class);
		boolean isOfferUpdated = false;
		OfferDao objDao = new OfferDao();
		System.out.println(objBean.toString());
		isOfferUpdated = objDao.updateOffer(objBean);
		objDao.commit();
		objDao.closeAll();
		extension = FilenameUtils.getExtension(objBean.getOfferTemplate());
		offerTemplate = "offer_template_" + objBean.getId() + ".png";
		if (isOfferUpdated) {
			if (templateFile != null) {
				if (extension.equals("pdf")) {
					String destDirPath = System.getProperty("user.dir") + getText("offer_template_folder_path");
					CommonLoadAction.convertPdfToImage(templateFile + "", destDirPath, offerTemplate);
				} else {
//					createOfferTemplate(templateFile, offerTemplate);
					CommonLoadAction.createTemplate(offerTemplate, templateFile,getText("offer_template_folder_path"));
				}
			}
			objDetailResponseBean.setCode("success");
			objDetailResponseBean.setGenratedId(objBean.getId());
			objDetailResponseBean.setGenratedUrl(getText("offer_template_url") + offerTemplate);
			objDetailResponseBean.setMessage(getText("offer updated successfully"));
		} else {
			objDetailResponseBean.setCode("error");
			objDetailResponseBean.setMessage(getText("offer not updated"));
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public DetailResponseBean getObjDetailResponseBean() {
		return objDetailResponseBean;
	}

	public void setObjDetailResponseBean(DetailResponseBean objDetailResponseBean) {
		this.objDetailResponseBean = objDetailResponseBean;
	}

}
