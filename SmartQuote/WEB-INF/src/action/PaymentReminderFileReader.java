package action;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import test.GlsFileReader;

public class PaymentReminderFileReader implements GlsFileReader {

	public JSONArray readFile(String filename) throws InvalidFormatException, IOException, JSONException {
		ArrayList<String> headerList = new ArrayList<String>();
		headerList.add("customerCode");
		headerList.add("customerName");
		headerList.add("total");
		headerList.add("juneCurrent");
		headerList.add("may30Days");
		headerList.add("april60Days");
		headerList.add("march90Days");
		
		DataFormatter formatter = new DataFormatter();
		JSONArray rows = new JSONArray();
		int i = 0;
		String cellValue = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		InputStream ExcelFileToRead = new FileInputStream(filename);
		XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);
		XSSFSheet sheet1 = wb.getSheetAt(0);
		XSSFRow row;
		XSSFCell cell;
		Iterator<Row> rowSheet = sheet1.rowIterator();
		JSONObject jRow = null;
		// System.out.println();
		while (rowSheet.hasNext()) {
			i = 0;
			row = (XSSFRow) rowSheet.next();
			Iterator<Cell> cells = row.cellIterator();
			jRow = new JSONObject();
			if (row.getRowNum() > 0) {
				while (cells.hasNext() && i < headerList.size()) {
					cell = (XSSFCell) cells.next();
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_STRING:
						cellValue = formatter.formatCellValue(cell);
						break;
					case Cell.CELL_TYPE_NUMERIC:
						if (DateUtil.isCellDateFormatted(cell)) {
							try {
								cellValue = sdf.format(cell.getDateCellValue());
							} catch (Exception e) {
								e.printStackTrace();
							}
						} else {
							cellValue = formatter.formatCellValue(cell) + "";
						}
						break;
					case Cell.CELL_TYPE_BLANK:
						cellValue = "";
						break;
					default:
						break;
					}
					jRow.put(headerList.get(i), cellValue);
					i++;
				}
				rows.put(jRow);
			}
		}
		return rows;
	}
}
