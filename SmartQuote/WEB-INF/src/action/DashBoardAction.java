package action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.interceptor.ServletRequestAware;

import responseBeans.ChartResponseBean;

import com.opensymphony.xwork2.ActionSupport;

import dao.DashBoardDao;

@SuppressWarnings("serial")
public class DashBoardAction extends ActionSupport implements ServletRequestAware {
	private HttpServletRequest request;
	HttpSession httpSession;	
	DashBoardDao objDashBoardDao=null;
	ChartResponseBean objChartResponseBean = null;
	
	public ChartResponseBean getObjChartResponseBean() {
		return objChartResponseBean;
	}

	public void setObjChartResponseBean(ChartResponseBean objChartResponseBean) {
		this.objChartResponseBean = objChartResponseBean;
	}

	
	public String getChartData() {
		objDashBoardDao=new DashBoardDao();
		objChartResponseBean= new ChartResponseBean();
		httpSession = request.getSession(true);
		String userId = String.valueOf(httpSession.getAttribute("userId"));
		String userType=String.valueOf(httpSession.getAttribute("userType"));
		System.out.println("userId : " + userId);
		System.out.println("userType : " + userType);
		String getTotalQuery="", getPipelineQuery="", getWonQuery="", getLostQuery="",getClosedQuery="";
		if (userType.equalsIgnoreCase("admin")) {
			getTotalQuery="select count(*) from create_quote;";
			getPipelineQuery="select count(*) from create_quote where status='SAVED' OR status='UPDATED' OR status='INI';";
			getWonQuery="select count(*) from create_quote where status='WON';";
			getLostQuery="select count(*) from create_quote where status='LOST';";
			getClosedQuery="select count(*) from create_quote where status='CLOSED';";
		}else{
			getTotalQuery="select count(*) from create_quote WHERE sales_person_id ="+userId;
			getPipelineQuery="select count(*) from create_quote WHERE sales_person_id ="+userId
					+" AND (status='SAVED' OR status='UPDATED' OR status='INI');";
			getWonQuery="select count(*) from create_quote WHERE status='WON' AND sales_person_id ="+userId;
			getLostQuery="select count(*) from create_quote WHERE status='LOST' AND sales_person_id ="+userId;
			getClosedQuery="select count(*) from create_quote WHERE status='CLOSED' AND sales_person_id ="+userId;
		}
		try {
			objChartResponseBean.setCode("success");
			objChartResponseBean.setMessage("chart data");
			objChartResponseBean.getTotal().setTotalQuote(objDashBoardDao.getTotalQuotes(getTotalQuery));
			objChartResponseBean.getPipeline().setTotalQuote(objDashBoardDao.getTotalQuotes(getPipelineQuery));
			objChartResponseBean.getWon().setTotalQuote(objDashBoardDao.getTotalQuotes(getWonQuery));
			objChartResponseBean.getLost().setTotalQuote(objDashBoardDao.getTotalQuotes(getLostQuery));
			objChartResponseBean.getClosed().setTotalQuote(objDashBoardDao.getTotalQuotes(getClosedQuery));
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
