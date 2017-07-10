package action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
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

public class ExcelFileSplit implements GlsFileReader {
	@Override
	public JSONArray readFile(String arg0) throws FileNotFoundException, InvalidFormatException, IOException, JSONException {
		return null;
	}

	public int splitFile(String filename, String filePath) throws InvalidFormatException, IOException, JSONException {
		System.out.println("splitFile....");
		String headerValue = "";
		ArrayList<String> headerList = new ArrayList<String>();
		DataFormatter formatter = new DataFormatter();
		JSONArray rows = new JSONArray();
		int i = 0;
		int rowCount = 0;
		int subFileCount = 0;
		String FILE_NAME = "";
		String cellValue = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		InputStream ExcelFileToRead = new FileInputStream(filename);
		XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);
		XSSFSheet sheet1 = wb.getSheetAt(0);
		XSSFRow row;
		XSSFCell cell;
		Iterator<Row> rowSheet = sheet1.rowIterator();
		JSONObject jRow = null;
		XSSFWorkbook workbook = null;
		XSSFSheet sheet = null;
		File file = null;
		FileOutputStream outputStream = null;
		System.out.println("Project Path: " + filePath);
		file = new File(filePath + "ExcelFiles");
		if(file.exists()){	
			System.out.println("Distroyed existing directory!");
			delete(file);
		}
		while (rowSheet.hasNext()) {
			i = 0;
			if (rowCount == 0) {
				workbook = new XSSFWorkbook();
				sheet = workbook.createSheet("subfile");
				FILE_NAME = "subFile" + subFileCount + ".xlsx";
			}
			Row writeRow = null;
			Cell writeCell;
			int colNum = 0;
			row = (XSSFRow) rowSheet.next();
			Iterator<Cell> cells = row.cellIterator();
			jRow = new JSONObject();
			if (row.getRowNum() == 0) {
				writeRow = sheet.createRow(rowCount);
				colNum = 0;
				while (cells.hasNext()) {
					cell = (XSSFCell) cells.next();
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_STRING:
						headerValue = formatter.formatCellValue(cell);
						break;
					case Cell.CELL_TYPE_NUMERIC:
						headerValue = formatter.formatCellValue(cell) + "0";
						break;
					default:
						break;
					}
					headerValue = headerValue.replaceAll("[^a-zA-Z0-9]", "");
					headerValue = String.valueOf(headerValue.charAt(0)).toLowerCase() + headerValue.substring(1);
					headerList.add(headerValue);

					writeCell = writeRow.createCell(colNum++);
					writeCell.setCellValue((String) headerValue);
				}
				rowCount++;
			} else {
				if (rowCount == 0) {
					writeRow = sheet.createRow(rowCount);
					colNum = 0;
					for (String temp : headerList) {
						writeCell = writeRow.createCell(colNum++);
						writeCell.setCellValue((String) temp);
					}
					writeRow = sheet.createRow(++rowCount);
					colNum = 0;
					while (cells.hasNext()) {
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
							cellValue = "0";
							break;

						default:
							break;
						}
						jRow.put(headerList.get(i), cellValue);

						writeCell = writeRow.createCell(colNum++);
						writeCell.setCellValue((String) cellValue);
						i++;
					}

				} else {
					writeRow = sheet.createRow(rowCount);
					colNum = 0;
					while (cells.hasNext()) {
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
							cellValue = "0";
							break;

						default:
							break;
						}
						jRow.put(headerList.get(i), cellValue);

						writeCell = writeRow.createCell(colNum++);
						writeCell.setCellValue((String) cellValue);
						i++;
					}
				}

				rows.put(jRow);
				if (rowCount == 5000) {
					if(!file.exists()){	
						System.out.println("Directory is created!");
						file.mkdir();
					}
					outputStream = new FileOutputStream(file + "/" + FILE_NAME);
					workbook.write(outputStream);
					outputStream.close();
					rowCount = 0;
					subFileCount++;
				} else {
					rowCount++;
				}
			}
		}
		if (rowCount > 0) {
			FILE_NAME = "subFile" + subFileCount + ".xlsx";
			file = new File(filePath + "ExcelFiles");
			if(!file.exists()){
				System.out.println("Directory is created!");
				file.mkdir();
			}
			outputStream = new FileOutputStream(file + "/" + FILE_NAME);
			workbook.write(outputStream);
			outputStream.close();
			subFileCount++;
		}
		return subFileCount;
	}

	public static void delete(File file) throws IOException {

		if (file.isDirectory()) {

			// directory is empty, then delete it
			if (file.list().length == 0) {

				file.delete();
				System.out.println("Directory is deleted : " + file.getAbsolutePath());

			} else {

				// list all the directory contents
				String files[] = file.list();

				for (String temp : files) {
					// construct the file structure
					File fileDelete = new File(file, temp);

					// recursive delete
					delete(fileDelete);
				}

				// check the directory again, if empty then delete it
				if (file.list().length == 0) {
					file.delete();
					System.out.println("Directory is deleted : " + file.getAbsolutePath());
				}
			}

		} else {
			// if file, then delete it
			file.delete();
			System.out.println("File is deleted : " + file.getAbsolutePath());
		}
	}
}
