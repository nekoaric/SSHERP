/* @(#) HttpClient.java
 * Create on 2010-9-13 at 下午04:17:49
 */
package com.cnnct.api;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.SocketTimeoutException;

import org.apache.commons.httpclient.ConnectTimeoutException;
import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.HttpVersion;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;

public class HttpClientUtil {
    private static final Logger _log = Logger.getLogger(HttpClientUtil.class);

    private String encoder; // 编码
    private HttpVersion httpVersion; // http编码
    private String url; // 连接地址
    private int connTimeOut; // 连接超时时间
    private int soTimeOut; // 响应超时时间

    public HttpClientUtil(String url) {
        this.encoder = "UTF-8";
        this.httpVersion = HttpVersion.HTTP_1_0;
        this.url = url;
        this.connTimeOut = 60 * 1000; // 3秒
        this.soTimeOut = 120 * 1000; // 6秒
    }

    public HttpClientUtil(String url, String encoder, HttpVersion httpVersion, int connTimeOut, int soTimeOut) {
        this.encoder = encoder;
        this.httpVersion = httpVersion;
        this.url = url;
        this.connTimeOut = connTimeOut;
        this.soTimeOut = soTimeOut;
    }

    public synchronized byte[] sendHttp(String sendData) {
        byte[] getData = null;
        HttpClient client = new HttpClient();
        
        HttpClientParams httpParams = new HttpClientParams();
        httpParams.setContentCharset(encoder);
        httpParams.setVersion(httpVersion);
        client.setParams(httpParams);
        
        // 设置连接超时时间
        client.getHttpConnectionManager().getParams().setConnectionTimeout(connTimeOut);
        
        // 设置响应超时时间
        client.getHttpConnectionManager().getParams().setSoTimeout(soTimeOut);
        
        PostMethod post = new PostMethod(url);
        
        HttpMethodParams methodParams = new HttpMethodParams();
        // 设置重发次数
        methodParams.setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler(1, false));
        
        post.setParams(methodParams);
        
        long startTime = 0;
        try {
            RequestEntity request = new StringRequestEntity(sendData, "text/plain", "UTF-8");
            post.setRequestEntity(request);
            _log.debug("请求报文：" + sendData);
            startTime = System.currentTimeMillis();
            int statusCode = client.executeMethod(post);// 状态码
            System.out.println("响应时间：" + (System.currentTimeMillis() - startTime));
            if (statusCode == HttpStatus.SC_OK) {
                _log.info("返回码为：" + statusCode + ",交易成功。");
                getData = post.getResponseBody();// 获取响应的内容
            } else {
                _log.info("返回码为：" + statusCode + ",交易失败。");
            }

        } catch (ConnectTimeoutException e) {
            e.printStackTrace();
            _log.info("连接超时，无法连接：" + e.getMessage());
            return "-1".getBytes();
        } catch (SocketTimeoutException e) {
            e.printStackTrace();
            _log.info("超时时间：" + (System.currentTimeMillis() - startTime));
            return "-2".getBytes();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            _log.info("编码异常:" + e.getMessage());
            return "-3".getBytes();
        } catch (HttpException e) {
            e.printStackTrace();
            _log.info("链路异常:" + e.getMessage());
            return "-4".getBytes();
        } catch (IOException e) {
            e.printStackTrace();
            _log.info("等待超时：" + e.getMessage());
            return "-5".getBytes();
        } finally {
            post.releaseConnection();// 释放连接
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
        return getData;
    }
    
    public static boolean testHttpIsAlive(String url) {
        HttpClient client = new HttpClient();

        HttpClientParams httpParams = new HttpClientParams();
        httpParams.setContentCharset("UTF-8");
        httpParams.setVersion(HttpVersion.HTTP_1_0);
        client.setParams(httpParams);

        // 设置连接超时时间
        client.getHttpConnectionManager().getParams().setConnectionTimeout(5 * 1000);

        // 设置响应超时时间
        client.getHttpConnectionManager().getParams().setSoTimeout(5 * 1000);

        PostMethod post = new PostMethod(url);

        HttpMethodParams methodParams = new HttpMethodParams();
        // 设置重发次数
        methodParams.setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler(0, false));

        post.setParams(methodParams);

        long startTime = 0;
        try {
            _log.info("测试地址：" + url);
            RequestEntity request = new StringRequestEntity("", "text/plain", "UTF-8");
            post.setRequestEntity(request);
            startTime = System.currentTimeMillis();
            int statusCode = client.executeMethod(post);// 状态码
            System.out.println("响应时间：" + (System.currentTimeMillis() - startTime));
            if (statusCode == HttpStatus.SC_OK) {
                _log.info("返回码为：" + statusCode + ",地址可用。");
            } else {
                _log.info("返回码为：" + statusCode + ",地址不可用。");
            }

        } catch (ConnectTimeoutException e) {
            e.printStackTrace();
            _log.info("连接超时，无法连接：" + e.getMessage());
            return false;
        } catch (SocketTimeoutException e) {
            e.printStackTrace();
            _log.info("超时时间：" + (System.currentTimeMillis() - startTime));
            return false;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            _log.info("编码异常:" + e.getMessage());
            return false;
        } catch (HttpException e) {
            e.printStackTrace();
            _log.info("链路异常:" + e.getMessage());
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            _log.info("等待超时：" + e.getMessage());
            return false;
        } finally {
            post.releaseConnection();// 释放连接
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
        return true;
    }
    
    public static boolean testHttpIsAlive2(String url,String requesttxt) {
        HttpClient client = new HttpClient();
        
        HttpClientParams httpParams = new HttpClientParams();
        httpParams.setContentCharset("UTF-8");
        httpParams.setVersion(HttpVersion.HTTP_1_0);
        client.setParams(httpParams);
        
        // 设置连接超时时间
        client.getHttpConnectionManager().getParams().setConnectionTimeout(5 * 1000);
        
        // 设置响应超时时间
        client.getHttpConnectionManager().getParams().setSoTimeout(5 * 1000);
        
        PostMethod post = new PostMethod(url);
        
        HttpMethodParams methodParams = new HttpMethodParams();
        // 设置重发次数
        methodParams.setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler(0, false));
        
        post.setParams(methodParams);
        
        long startTime = 0;
        try {
            _log.info("测试地址：" + url);
            RequestEntity request = new StringRequestEntity(requesttxt, "text/plain", "UTF-8");
            post.setRequestEntity(request);
            startTime = System.currentTimeMillis();
            int statusCode = client.executeMethod(post);// 状态码
            System.out.println("响应时间：" + (System.currentTimeMillis() - startTime));
            if (statusCode == HttpStatus.SC_OK) {
                _log.info("返回码为：" + statusCode + ",地址可用。");
            } else {
                _log.info("返回码为：" + statusCode + ",地址不可用。");
            }
            
        } catch (ConnectTimeoutException e) {
            e.printStackTrace();
            _log.info("连接超时，无法连接：" + e.getMessage());
            return false;
        } catch (SocketTimeoutException e) {
            e.printStackTrace();
            _log.info("超时时间：" + (System.currentTimeMillis() - startTime));
            return false;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            _log.info("编码异常:" + e.getMessage());
            return false;
        } catch (HttpException e) {
            e.printStackTrace();
            _log.info("链路异常:" + e.getMessage());
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            _log.info("等待超时：" + e.getMessage());
            return false;
        } finally {
            post.releaseConnection();// 释放连接
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
        return true;
    }

}
