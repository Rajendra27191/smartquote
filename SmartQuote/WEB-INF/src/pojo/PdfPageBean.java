package pojo;

public class PdfPageBean {
	private String pageTemplateSrc;

	public String getPageTemplateSrc() {
		return pageTemplateSrc;
	}

	public void setPageTemplateSrc(String pageTemplateSrc) {
		this.pageTemplateSrc = pageTemplateSrc;
	}

	@Override
	public String toString() {
		return "PdfPageBean [pageTemplateSrc=" + pageTemplateSrc + "]";
	}

}
