package action;

import java.io.File;
import java.io.FileInputStream;
//import java.io.FileNotFoundException;
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
	static XSSFWorkbook workbook = null;
	static XSSFSheet sheet = null;
	File file = null;
	FileOutputStream outputStream = null;
	ArrayList<String> headerList = null;
	DataFormatter formatter = null;
	static int rowCount = 0, subFileCount = 0;
	static String FILE_NAME = "", headerValue = "", cellValue = "";
	SimpleDateFormat sdf = null;
	XSSFWorkbook wb = null;
	XSSFSheet sheet1 = null;
	int rowStart = 0, rowEnd = 0, rowNum = 0;
	
	public ExcelFileSplit() {
		formatter = new DataFormatter();
		sdf = new SimpleDateFormat("yyyy-MM-dd");
	}
	
	public String convertToCamelCase(String str) {
		String s = str.replaceAll("[^a-zA-Z0-9]", " ");
		String lower = s.toLowerCase();
		String[] parts = lower.split(" ");
		String camelString = "";
		for (int i = 0; i < parts.length; i++) {
			String p = parts[i];
			if (i == 0) {
				try {
					p = String.valueOf(p.charAt(0)).toLowerCase() + p.substring(1).toLowerCase();
					camelString = camelString + p;
				} catch (Exception e) {
					p = p.substring(0).toLowerCase();
					camelString = camelString + p;
				}
			} else {
				try {
					p = String.valueOf(p.charAt(0)).toUpperCase() + p.substring(1).toLowerCase();
					camelString = camelString + p;
				} catch (Exception e) {
					p = p.substring(0).toLowerCase();
					camelString = camelString + p;
				}
			}
		}
		return camelString;
	}

	public JSONArray readFile(String filename) throws InvalidFormatException, IOException, JSONException {
		String headerValue = "";
		ArrayList<String> headerList = new ArrayList<String>();
		DataFormatter formatter = new DataFormatter();
		JSONArray rows = new JSONArray();
		String cellValue = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		InputStream ExcelFileToRead = new FileInputStream(filename);
		XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);
		XSSFSheet sheet1 = wb.getSheetAt(0);
		JSONObject jRow = null;
		int rowStart = sheet1.getFirstRowNum(); // Math.min(15,sheet1.getFirstRowNum());
		int rowEnd = sheet1.getLastRowNum() + 1; // Math.max(1400,sheet1.getLastRowNum());
		int lastColumn = 0;
		for (int rowNum = rowStart; rowNum < rowEnd; rowNum++) {
			jRow = new JSONObject();
			Row r = sheet1.getRow(rowNum);
			if (r == null) {
				continue;
			}
					
			if (rowNum == 0) {
				lastColumn=r.getLastCellNum();
//				System.out.println("lastColumn : "+lastColumn);
				for (int cn = 0; cn < lastColumn; cn++) {
					Cell c = r.getCell(cn, Row.RETURN_BLANK_AS_NULL);
					// System.out.println("CELL :" + c);
					if (c == null) {
						cellValue = null;
					} else {
						switch (c.getCellType()) {
						case Cell.CELL_TYPE_STRING:
							headerValue = formatter.formatCellValue(c);
							break;
						case Cell.CELL_TYPE_NUMERIC:
							headerValue = formatter.formatCellValue(c) + "0";
							break;
						default:
							break;
						}
						// headerValue = convertToCamelCase(headerValue);
						headerValue = headerValue.replaceAll("[^a-zA-Z0-9]", "");
						headerValue = String.valueOf(headerValue.charAt(0)).toLowerCase() + headerValue.substring(1);
						headerList.add(headerValue);
					}
				}
			} else {
//				System.out.println("lastColumn : "+lastColumn);
				for (int cn = 0; cn < lastColumn; cn++) {
					Cell c = r.getCell(cn, Row.RETURN_BLANK_AS_NULL);
					if (c == null) {
						cellValue = null;
					} else {
						switch (c.getCellType()) {
						case Cell.CELL_TYPE_STRING:
							cellValue = formatter.formatCellValue(c);
							break;
						case Cell.CELL_TYPE_NUMERIC:
							if (DateUtil.isCellDateFormatted(c)) {
								try {
									cellValue = sdf.format(c.getDateCellValue());
								} catch (Exception e) {
									e.printStackTrace();
								}
							} else {
								cellValue = formatter.formatCellValue(c) + "";
							}
							break;
						case Cell.CELL_TYPE_BLANK:
							cellValue = "";
							break;
						default:
							break;
						}
					}
//					 System.out.println("CN : "+cn);
//					 System.out.println(headerList.get(cn)+" : "+cellValue);
					// System.out.println(cellValue);
					jRow.put(headerList.get(cn), cellValue);
				}
				rows.put(jRow);
			}
		}
		ExcelFileToRead.close();
		return rows;
	}

	public int splitFileIntoMultiples(String filename, String filePath) throws InvalidFormatException, IOException, JSONException {
		headerList = new ArrayList<String>();
		rowCount = 0; subFileCount = 0; FILE_NAME = ""; headerValue = ""; cellValue = "";
		InputStream ExcelFileToRead = new FileInputStream(filename);
		wb = new XSSFWorkbook(ExcelFileToRead);
		sheet1 = wb.getSheetAt(0);
		Row r = null, writeRow = null;
		int lastColumn = 0;
		
		file = new File(filePath + "ExcelFiles");
		if (file.exists()) {
			delete(file);
		}
		rowStart = sheet1.getFirstRowNum();
		rowEnd = sheet1.getLastRowNum() + 1;
		for (rowNum = rowStart; rowNum < rowEnd; rowNum++) {
			r = sheet1.getRow(rowNum);
			if (r == null) {
				continue;
			}
			lastColumn = r.getLastCellNum();
			if (rowCount == 0) {
				workbook = new XSSFWorkbook();
				sheet = workbook.createSheet("subfile");
				FILE_NAME = "subFile" + subFileCount + ".xlsx";
			}
			writeRow = null;
			// jRow = new JSONObject();
			Cell writeCell;
			int colNum = 0;
			if (rowNum == 0) {
				writeRow = sheet.createRow(rowCount);
				colNum = 0;
				for (int cn = 0; cn < lastColumn; cn++) {
					Cell c = r.getCell(cn, Row.RETURN_BLANK_AS_NULL);
					if (c == null) {
						cellValue = null;
					} else {
						switch (c.getCellType()) {
						case Cell.CELL_TYPE_STRING:
							headerValue = formatter.formatCellValue(c);
							break;
						case Cell.CELL_TYPE_NUMERIC:
							headerValue = formatter.formatCellValue(c) + "0";
							break;
						default:
							break;
						}
						headerList.add(headerValue);
						writeCell = writeRow.createCell(colNum++);
						writeCell.setCellValue((String) headerValue);
					}
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
					for (int cn = 0; cn < lastColumn; cn++) {
						Cell c = r.getCell(cn, Row.RETURN_BLANK_AS_NULL);
						if (c == null) {
							cellValue = null;
						} else {
							switch (c.getCellType()) {
							case Cell.CELL_TYPE_STRING:
								cellValue = formatter.formatCellValue(c);
								break;
							case Cell.CELL_TYPE_NUMERIC:
								if (DateUtil.isCellDateFormatted(c)) {
									try {
										cellValue = sdf.format(c.getDateCellValue());
									} catch (Exception e) {
										e.printStackTrace();
									}
								} else {
									cellValue = formatter.formatCellValue(c) + "";
								}
								break;
							case Cell.CELL_TYPE_BLANK:
								cellValue = "0";
								break;

							default:
								break;
							}
						}
						writeCell = writeRow.createCell(colNum++);
						writeCell.setCellValue((String) cellValue);
					}
				} else {
					writeRow = sheet.createRow(rowCount);
					colNum = 0;
					for (int cn = 0; cn < lastColumn; cn++) {
						Cell c = r.getCell(cn, Row.RETURN_BLANK_AS_NULL);
						if (c == null) {
							cellValue = null;
						} else {
							switch (c.getCellType()) {
							case Cell.CELL_TYPE_STRING:
								cellValue = formatter.formatCellValue(c);
								break;
							case Cell.CELL_TYPE_NUMERIC:
								if (DateUtil.isCellDateFormatted(c)) {
									try {
										cellValue = sdf.format(c.getDateCellValue());
									} catch (Exception e) {
										e.printStackTrace();
									}
								} else {
									cellValue = formatter.formatCellValue(c) + "";
								}
								break;
							case Cell.CELL_TYPE_BLANK:
								cellValue = "";
								break;

							default:
								break;
							}
						}
						writeCell = writeRow.createCell(colNum++);
						writeCell.setCellValue((String) cellValue);
					}
				}
				// rows.put(jRow);
				if (rowCount == 1000) {
					if (!file.exists()) {
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
			if (!file.exists()) {
//				System.out.println("Directory is created!");
				file.mkdir();
			}
			outputStream = new FileOutputStream(file + "/" + FILE_NAME);
			workbook.write(outputStream);
			outputStream.close();
			subFileCount++;
		}
		System.out.println("File Splitting done...!");
		ExcelFileToRead.close();
		return subFileCount;
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
		if (file.exists()) {
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
				if (rowCount == 10000) {
					if (!file.exists()) {
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
			if (!file.exists()) {
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
			if (file.list().length == 0) {
				file.delete();
//				System.out.println("Directory is deleted : " + file.getAbsolutePath());
			} else {
				String files[] = file.list();
				for (String temp : files) {
					File fileDelete = new File(file, temp);
					delete(fileDelete);
				}
				if (file.list().length == 0) {
					file.delete();
//					System.out.println("Directory is deleted : " + file.getAbsolutePath());
				}
			}
		} else {
			file.delete();
//			System.out.println("File is deleted : " + file.getAbsolutePath());
		}
	}
}
