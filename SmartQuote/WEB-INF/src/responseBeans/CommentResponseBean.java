package responseBeans;

import pojo.CommentBean;
import responseStructure.Response;

public class CommentResponseBean extends Response {
	private CommentBean result;

	public CommentBean getResult() {
		return result;
	}

	public void setResult(CommentBean result) {
		this.result = result;
	}

}
