package com.cectsims.util;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.ConnectException;
import java.util.ArrayList;
import java.util.List;

import com.artofsolving.jodconverter.DocumentConverter;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;

/**
 * 文件转换为swf文件
 */
public class DocConverter {
	private static int environment = 1;	// 系统类型　1:windows 2:linux
	private String fileString; // 待处理文件
	private String outputPath = "";	// 输出文件 
	private String fileName;
	private File pdfFile;
	private File swfFile;
	private File docFile;
	private static List<OpenOfficeConnection> connectionList = new ArrayList<OpenOfficeConnection>();
	
	static{
		try{
			// 类加载时检测服务器系统
			String osName = System.getProperty("os.name");
			if(osName.toLowerCase().indexOf("window") != -1){	//包含window的则为window系统其他的设置linux
				environment = 1;
			}else {
				environment = 2;
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	// 空构造器
	public DocConverter(){};
	
	public DocConverter(String fileString) {
		ini(fileString);
	}

	/**
	 * 设置类型
	 * 
	 * @param fileString
	 */
	public void setFile(String fileString) {
		ini(fileString);
	}

	/**
	 * 初始化文件处理 
	 * 
	 * @param fileString
	 */
	private void ini(String fileString) {
		this.fileString = fileString;
		if(fileString.lastIndexOf(".")>0){
			fileName = fileString.substring(0, fileString.lastIndexOf("."));
		}
		docFile = new File(fileString);
		pdfFile = new File(fileName + ".pdf");
		swfFile = new File(fileName + ".swf");
	}
	
	/**
	 * office转pdf文件
	 * 
	 * @param file
	 */
	public void doc2pdf() throws Exception {
		if (docFile.exists()) {
			if (!pdfFile.exists()) {
				OpenOfficeConnection connection = null;
				try {
					connection = getConnection();
					DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
					converter.convert(docFile, pdfFile);
					// close the connection
					System.out.println("****pdf»»" + pdfFile.getPath()+ "****");
				} catch (java.net.ConnectException e) {
					e.printStackTrace();
					System.out.println("****swf»»openoffice****");
					throw e;
				} catch (com.artofsolving.jodconverter.openoffice.connection.OpenOfficeException e) {
					e.printStackTrace();
					System.out.println("****swf»»»»****");
					throw e;
				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				}finally{
					saveConnection(connection);
				}
			} else {
				System.out.println("****office 文件****");
			}
		} else {
			System.out.println("****office文件不存在»»****");
		}
	}
	
	/**
	 * pdf2swf
	 */
	@SuppressWarnings("unused")
	public void pdf2swf() throws Exception {
		Runtime r = Runtime.getRuntime();
		if (!swfFile.exists()) {
			if (pdfFile.exists()) {
				if (environment == 1) {// windows»·¾³´¦Àí
					try {
						Process p = r.exec("C:\\Program Files (x86)\\SWFTools\\pdf2swf.exe "+ pdfFile.getPath() + " -o "+ swfFile.getPath() + " -T 9");
						System.out.print(loadStream(p.getInputStream()));
						System.err.print(loadStream(p.getErrorStream()));
						System.out.print(loadStream(p.getInputStream()));
						System.err.println("****swf"
								+ swfFile.getPath() + "****");
						if (pdfFile.exists()) {
							pdfFile.delete();
						}

					} catch (IOException e) {
						e.printStackTrace();
						throw e;
					}
				} else if (environment == 2) {// linux»
					try {
						Process p = r.exec("pdf2swf " + pdfFile.getPath()
								+ " -o " + swfFile.getPath() + " -T 9");
						System.out.print(loadStream(p.getInputStream()));
						System.err.print(loadStream(p.getErrorStream()));
						System.err.println("****swf×ª»»³É¹¦£¬ÎÄ¼þÊä³ö£º"
								+ swfFile.getPath() + "****");
						if (pdfFile.exists()) {
							pdfFile.delete();
						}
					} catch (Exception e) {
						e.printStackTrace();
						throw e;
					}
				}
			} else {
				System.out.println("****pdf²»»»****");
			}
		} else {
			System.out.println("****swf»»****");
		}
	}
	
	/**
	 * png图片转swf格式
	 * @param fileName	指定转换的文件
	 * @param targetFile	目标文件
	 * @throws Exception
	 */
	public void png2swf(String fileName, String targetFile) throws Exception{
		Runtime r = Runtime.getRuntime();
		File pngFile = new File(targetFile);
		File oldFile = new File(fileName);
		
		if(!pngFile.exists() && oldFile.exists()){	// 只有目标文件不存在 并且存在待处理文件
			if (environment == 1) {// windows»
				try {	
					Process p = r.exec("C:\\Program Files (x86)\\SWFTools\\png2swf.exe "+ 
							" -o "+ pngFile.getPath() +" "+oldFile.getPath() +  " -T 9");
					System.out.print(loadStream(p.getInputStream()));
					System.err.print(loadStream(p.getErrorStream()));
					System.out.print(loadStream(p.getInputStream()));
					System.err.println("****swf»»"
							+ pngFile.getPath() + "****");
				} catch (IOException e) {
					e.printStackTrace();
					throw e;
				}
			} else if (environment == 2) {// linux»
				try {
					Process p = r.exec("png2swf " + oldFile.getPath() 
							+ " -o "+ pngFile.getPath() + " -T 9");
					System.out.print(loadStream(p.getInputStream()));
					System.err.print(loadStream(p.getErrorStream()));
					System.err.println("****swf×ª»»"
							+ pngFile.getPath() + "****");
				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				}
			}
		}
	}
	
	/**
	 * jpeg，jpg图片转swf格式
	 * @param fileName	指定转换的文件
	 * @param targetFile	目标文件
	 * @throws Exception
	 */
	public void jpeg2swf(String fileName, String targetFile) throws Exception{
		Runtime r = Runtime.getRuntime();
		File jpegFile = new File(targetFile);
		File oldFile = new File(fileName);
		
		if(!jpegFile.exists() && oldFile.exists()){	// 只有目标文件不存在 并且存在待处理文件
			if (environment == 1) {// windows»
				try {
					Process p = r.exec("C:\\Program Files (x86)\\SWFTools\\jpeg2swf.exe "+ 
							oldFile.getPath() + " -o "+ jpegFile.getPath() + " -T 9");
					System.out.print(loadStream(p.getInputStream()));
					System.err.print(loadStream(p.getErrorStream()));
					System.out.print(loadStream(p.getInputStream()));
					System.err.println("****swf»»"
							+ jpegFile.getPath() + "****");
				} catch (IOException e) {
					e.printStackTrace();
					throw e;
				}
			} else if (environment == 2) {// linux»
				try {
					Process p = r.exec("jpeg2swf " + oldFile.getPath() 
							+ " -o "+ jpegFile.getPath() + " -T 9");
					System.out.print(loadStream(p.getInputStream()));
					System.err.print(loadStream(p.getErrorStream()));
					System.err.println("****swf»»"
							+ jpegFile.getPath() + "****");
				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				}
			}
		}
	}
	
	
	static String loadStream(InputStream in) throws IOException {

		int ptr = 0;
		in = new BufferedInputStream(in);
		StringBuffer buffer = new StringBuffer();

		while ((ptr = in.read()) != -1) {
			buffer.append((char) ptr);
		}

		return buffer.toString();
	}
	/**
	 * office文件转为swf文件
	 */
	@SuppressWarnings("unused")
	public boolean conver() {
		// 如果目标文件已经存在则不处理
		if (swfFile.exists()) {
			return true;
		}

		try {
			doc2pdf();
			pdf2swf();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

		if (swfFile.exists()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 获取swf路径
	 * 
	 * @param s
	 */
	public String getswfPath() {
		if (swfFile.exists()) {
			String tempString = swfFile.getPath();
			tempString = tempString.replaceAll("\\\\", "/");
			return tempString;
		} else {
			return "";
		}

	}
	/**
	 * 设置输出路径
	 */
	public void setOutputPath(String outputPath) {
		this.outputPath = outputPath;
		if (!outputPath.equals("")) {
			String realName = fileName.substring(fileName.lastIndexOf("/"),
					fileName.lastIndexOf("."));
			if (outputPath.charAt(outputPath.length()) == '/') {
				swfFile = new File(outputPath + realName + ".swf");
			} else {
				swfFile = new File(outputPath + realName + ".swf");
			}
		}
	}
	/**
	 * 连接转换池
	 * @return
	 */
	private static synchronized OpenOfficeConnection getConnection() throws ConnectException{
		try{
			// 如果连接池为空，添加连接
			if(connectionList.size() == 0){
				OpenOfficeConnection connection = new SocketOpenOfficeConnection(8100);
				connection.connect();
				connectionList.add(connection);
			}
		}catch(ConnectException e){
			e.printStackTrace();
			throw e;
		}
		return connectionList.remove(0);
	}
	
	/**
	 * 保存连接信息
	 * @param connection
	 */
	private static synchronized void saveConnection(OpenOfficeConnection connection){
		// 如果连接池为空，添加连接
		if(connection!=null && connection.isConnected() && connectionList.size()<5){	// 最多保存5个连接
			connectionList.add(connection);
		}
	}
}
