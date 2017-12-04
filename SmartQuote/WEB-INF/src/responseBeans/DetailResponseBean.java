package responseBeans;

import responseStructure.Response;

public class DetailResponseBean extends Response {
	private int genratedId;
	private String genratedUrl;
	public int getGenratedId() {
		return genratedId;
	}
	public void setGenratedId(int genratedId) {
		this.genratedId = genratedId;
	}
	public String getGenratedUrl() {
		return genratedUrl;
	}
	public void setGenratedUrl(String genratedUrl) {
		this.genratedUrl = genratedUrl;
	}
}
