package com.cnnct.rfid.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.tools.ant.taskdefs.Copyfile;

import com.cectsims.util.DocConverter;

/**
 * 文件浏览控制器
 * @author zhouww
 * @since 2014-10-10
 */
public class FileViewControl {
	/**
	 * 获取office文档的swf字节
	 * @param extension 包含点的扩展名
	 * @param filePath 文件路径最后需要斜杠
	 * @param filename 文件名字
	 * @return
	 */
	public static byte[] parseOfficeFile4swf(String extension, String filePath, String filename){
		byte[] bytes = new byte[0];
		String fileStr = "";
		String newFileStr = "";
		String swfFilePath = "";
		try{
			fileStr = filePath+filename;
			newFileStr = fileStr + extension;
			// 拷贝文件
			copyFile(fileStr, newFileStr);

			// 将文件转化为pdf文件
			DocConverter dc = new DocConverter(newFileStr);
			dc.conver();	// 如果抛出异常，文件转换失败(可能指定的文件不是office文件或者不支持此文件类型)
			
			swfFilePath = fileStr + ".swf"; 
			// 获取swf文件
			File outFile = new File(swfFilePath);
			if(outFile.exists()) {	// 处理文件存在的情况
				// 1)获取文件的数据
				// 2)删除文件
				bytes = new byte[(int)outFile.length()];
				FileInputStream  fis = new FileInputStream(outFile);
				fis.read(bytes);
				fis.close();
				//删除文件
				outFile.delete();
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			File newFile = new File(newFileStr);
			if(newFile.exists() && newFile.isFile()){	// 删除存在的拷贝文件
				newFile.delete();
			}
		}
		return bytes;
	}
	/**
	 * 处理jpg文件预览
	 * @param extension
	 * @param filePath
	 * @param filename
	 * @return
	 */
	public static byte[] parseViewJSPFile(String extension, String filePath, String filename){
		byte[] bytes = new byte[0];
		String fileStr = "";	// 源文件
		String newFileStr = "";	//带扩展名文件
		String targetFile = "";	//  目标文件
		try{
			// 拷贝文件
			fileStr = filePath+filename;	// 源文件
			newFileStr = fileStr + extension;	//带扩展名文件
			targetFile = fileStr + ".swf";	//  目标文件
			copyFile(fileStr, newFileStr);
			
			DocConverter dc = new DocConverter();
			dc.jpeg2swf(newFileStr, targetFile);

			File file = new File(targetFile);
			if(file.exists()) {	//处理文件存在的情况
				// 1) 获取文件的数据
				// 2) 删除生成的文件
				bytes = new byte[(int)file.length()];
				FileInputStream  fis = new FileInputStream(file);
				fis.read(bytes);
				fis.close();
				//删除拷贝的文件
				file.delete();	
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			File newFile = new File(newFileStr);
			if(newFile.exists() && newFile.isFile()) {	// 删除存在的拷贝文件
				newFile.delete();
			}
		}
		return bytes;
	}
	
	
	/**
	 * 处理PNG文件预览
	 * @param extension
	 * @param filePath
	 * @param filename
	 * @return
	 */
	public static byte[] parseViewPNGFile(String extension, String filePath, String filename){
		byte[] bytes = new byte[0];
		String fileStr = "";	// 源文件
		String newFileStr = "";	//带扩展名文件
		String targetFile = "";	//  目标文件
		try{
			// 拷贝文件
			fileStr = filePath+filename;	// 源文件
			newFileStr = fileStr + extension;	//带扩展名文件
			targetFile = fileStr + ".swf";	//  目标文件
			copyFile(fileStr, newFileStr);
			
			DocConverter dc = new DocConverter();
			dc.png2swf(newFileStr, targetFile);

			File file = new File(targetFile);
			if(file.exists()) {	// 处理文件存在的情况
				bytes = new byte[(int)file.length()];
				FileInputStream  fis = new FileInputStream(file);
				fis.read(bytes);
				fis.close();
				//删除拷贝的文件
				file.delete();	//目标文件 
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			File newFile = new File(newFileStr);
			if(newFile.exists() && newFile.isFile()) { //删除存在的拷贝文件
				newFile.delete();
			}
		}
		return bytes;
	}
	
	/**
	 *  拷贝文件
	 * @param oldFile
	 * @param newFile
	 * @throws IOException 
	 * @throws FileNotFoundException 
	 */
	private static void copyFile(String oldFileStr, String newFileStr) throws FileNotFoundException, IOException{
		// 创建文件
		File file = new File(oldFileStr);
		File newFile = new File(newFileStr);
		// 创建文件流
		FileInputStream fileIs = new FileInputStream(file);
		FileOutputStream newFileOs = new FileOutputStream(newFile);
		
		byte[] copyBytes = new byte[(int)file.length()];
		fileIs.read(copyBytes);
		newFileOs.write(copyBytes);
		fileIs.close();
		newFileOs.close();
	}
}
