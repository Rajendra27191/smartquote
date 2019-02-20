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
			queryStr = "SELECT a.status, b.totalCount, b.totalAmount"
					+ " FROM status_master a left outer join"
					+ " (Select CASE when status in ('saved', 'updated') then 'PIPELINE'"
					+ " ELSE status END  as status , count(distinct a.quote_id) totalCount,"
					+ " round(sum(CASE when a.prices_gst_include = 'No' then"
					+ " (CASE when c.gst_flag = 'No' then round(b.total + ((10/100) * b.total), 2)"
					+ " else round(b.total, 2) end) else round(b.total, 2) end), 2) as totalAmount"
					+ " from create_quote a, create_quote_details b, product_master c"
					+ " where a.quote_id =  b.quote_id and b.product_id = c.item_code and b.alternate_for = 0 and"
					
					+ " coalesce(date(a.modified_date),date(a.created_date)) between '"+objChartBean.getFromDate()+"' and '"+objChartBean.getToDate()+"' group by 1)"
//					+ " date(a.created_date) between '"+objChartBean.getFromDate()+"' and '"+objChartBean.getToDate()+"' group by 1)"
					+ " b on a.status = b.status;";
		} else {
			queryStr = "SELECT a.status, b.totalCount, b.totalAmount"
					+ " FROM status_master a left outer join"
					+ " (Select CASE when status in ('saved', 'updated') then 'PIPELINE'"
					+ " ELSE status END  as status , count(distinct a.quote_id) totalCount,"
					+ " round(sum(CASE when a.prices_gst_include = 'No' then"
					+ " (CASE when c.gst_flag = 'No' then round(b.total + ((10/100) * b.total), 2)"
					+ " else round(b.total, 2) end) else round(b.total, 2) end), 2) as totalAmount"
					+ " from create_quote a, create_quote_details b, product_master c"
					+ " where a.quote_id =  b.quote_id and b.product_id = c.item_code and b.alternate_for = 0 and"
					
					+ " coalesce(date(a.modified_date),date(a.created_date)) between '"+objChartBean.getFromDate()+"' and '"+objChartBean.getToDate()+"'"
//					+ " date(a.created_date) between '"+objChartBean.getFromDate()+"' and '"+objChartBean.getToDate()+"'"
					+ " and sales_person_id ="+objChartBean.getUserID()+" group by 1)"
					+ " b on a.status = b.status;";
		}

		try {
			objChartResponseBeans = objDashBoardDao.getChartDetails(queryStr);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			objDashBoardDao.closeAll();
		}
		return SUCCESS;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
