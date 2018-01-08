package pojo;

public class FileLoadStatusBean {
	private String fileName;
	private int rows;
	private String loadDateTime;
	private String reminderStatus;

	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public String getLoadDateTime() {
		return loadDateTime;
	}
	public void setLoadDateTime(String loadDateTime) {
		this.loadDateTime = loadDateTime;
	}
	public String getReminderStatus() {
		return reminderStatus;
	}
	public void setReminderStatus(String reminderStatus) {
		this.reminderStatus = reminderStatus;
	}

}
