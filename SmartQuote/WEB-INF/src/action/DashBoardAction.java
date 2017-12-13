package action;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.interceptor.ServletRequestAware;

import pojo.ChartBean;
import responseBeans.ChartResponseBean;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

import dao.DashBoardDao;

@SuppressWarnings("serial")
public class DashBoardAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	HttpSession httpSession;
	DashBoardDao objDashBoardDao = null;

	ArrayList<ChartResponseBean> objChartResponseBeans = new ArrayList<ChartResponseBean>();

	public ArrayList<ChartResponseBean> getObjChartResponseBeans() {
		return objChartResponseBeans;
	}

	public void setObjChartResponseBeans(ArrayList<ChartResponseBean> objChartResponseBeans) {
		this.objChartResponseBeans = objChartResponseBeans;
	}

	public String getChartData() {
		String chartDetails = request.getParameter("chartDetails");
		ChartBean objChartBean = new ChartBean();
		objChartBean = new Gson().fromJson(chartDetails, ChartBean.class);
		System.out.println("chartDetails" + chartDetails);
		objDashBoardDao = new DashBoardDao();
		// objChartResponseBean = new ChartResponseBean();
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		String userType = String.valueOf(httpSession.getAttribute("userType"));
		System.out.println("userId : " + userId);
		System.out.println("userType : " + userType);
		String queryStr = "";
		System.out.println("objChartBean" + objChartBean);
		if (objChartBean.getUserID().equalsIgnoreCase("0")) {
			queryStr = "Select CASE when status in ('saved', 'updated') then 'PIPELINE' "
					+ "ELSE status END  as status , count(distinct a.quote_id) totalCount, "
					+ "round(sum(b.total), 2) totalAmount from create_quote a, create_quote_details b "
					+ "where a.quote_id =  b.quote_id and b.alternate_for = 0 " + "and date(a.created_date) between '"
					+ objChartBean.getFromDate() + "' " + "and '" + objChartBean.getToDate() + "' group by 1";
		} else {
			queryStr = "Select CASE when status in ('saved', 'updated') then 'PIPELINE' "
					+ "ELSE status END  as status , count(distinct a.quote_id) totalCount, "
					+ "round(sum(b.total), 2) totalAmount from create_quote a, create_quote_details b "
					+ "where a.quote_id =  b.quote_id and b.alternate_for = 0 " + "and date(a.created_date) between '"
					+ objChartBean.getFromDate() + "' " + "and '" + objChartBean.getToDate() + "' " + " and sales_person_id = "
					+ objChartBean.getUserID() + " group by 1";
		}

		try {
			objChartResponseBeans = objDashBoardDao.getChartDetails(queryStr);
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
