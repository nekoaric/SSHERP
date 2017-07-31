package com.cnnct.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.UUID;

import org.springframework.web.context.support.ServletContextAwareProcessor;
import org.springframework.web.context.support.ServletContextResource;

/**
 * 文件操作
 * 流转换为文件，
 * @author zhouww
 * @since 2015-1-20
 */
public class FileUtil {
    private static String rootPath = "";
    /**
     * 将数据流转化为文件
     * @param is
     * @return
     */
    public static File parseIS2File(InputStream is)throws Exception{
        URL url = FileUtil.class.getResource("");
        String path = url.getPath();
        
        String[] paths = path.split("WEB-INF");
        rootPath = paths[0];
        System.out.println("rootPath:"+rootPath);   
        String uuid = UUID.randomUUID().toString();
        File file = new File(rootPath + "importTempFile/" + uuid);
        System.out.println("filepath:" + file.getAbsolutePath());
        if (!file.exists()) {
            file.createNewFile();
        }
        int fileSize = is.available();
        byte[] data = new byte[fileSize];
        is.read(data, 0,fileSize);
        
        FileOutputStream os = new FileOutputStream(file);
        os.write(data);
        os.flush();
        is.close();
        return file;
        
    }
    
    /**
     * 删除文件
     * @param file
     */
    public static void deleteFile(File file){
        if(file.isFile()){
            file.delete();
        }
        
    }

    
    //~~SET  AND  GET
    public static String getRootPath() {
        return rootPath;
    }

    public static void setRootPath(String rootPath) {
        FileUtil.rootPath = rootPath;
    }
    
    
}
