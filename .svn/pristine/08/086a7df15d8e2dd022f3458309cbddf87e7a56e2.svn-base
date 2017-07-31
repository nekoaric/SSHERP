package com.cnnct.common;

public class ApplicationException extends RuntimeException implements java.io.Serializable {
    protected Throwable myException;
    protected int errorCode;
    protected String Msg = "";// \u00D0\u00C2\u00BC\u00D3\u00B5\u00C4\u00CA\u00F4\u00D0\u00D4

    public ApplicationException() {
    }

    public ApplicationException(String s) {
        super(s);
    }

    public ApplicationException(Exception ex) {
        super(ex.toString());
    }

    public ApplicationException(String s, Throwable ex) {
        super(s);
        this.myException = ex;
    }

    public ApplicationException(int errorCode, String msg) {
        super(msg);
        this.errorCode = errorCode;
    }

    public ApplicationException(int errorCode, String msg, Throwable e) {
        super(msg);
        this.errorCode = errorCode;
        this.myException = e;
    }

    public int getErrorCode() {
        return this.errorCode;
    }

    // \u00D0\u00C2\u00BC\u00D3\u00B5\u00C4\u00D6\u00D8\u00D4\u00D8\u00B8\u00B8\u00C0à\u00B5\u00C4·\u00BD·¨

    public String getMessage() {
        if (myException != null) {
            Msg = super.getMessage() + myException.getMessage();
        } else {
            Msg = super.getMessage();
        }
        return Msg;
    }

    public void printStackTrace() {
        System.out.println("ApplicationException:" + this.toString());
        if (myException != null)
            myException.printStackTrace();
    }
}