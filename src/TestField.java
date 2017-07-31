import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.Calendar;



public class TestField extends TestSplit{
    public static void main(String[] args) {
    	SimpleDateFormat sf=new SimpleDateFormat("yyyy-MM-dd");
    	 Calendar fdw= Calendar.getInstance();
    	
    	 fdw.set(Calendar.YEAR,2014);
    	 fdw.set(Calendar.MONTH,11);
    	 fdw.set(Calendar.DAY_OF_MONTH,1);
	     for (int i = 0; i <52; i++) {
	    	 //System.out.println(sf.format(fdw.getTime()));
	    	 fdw.add(Calendar.DAY_OF_YEAR, 6);
	    	 System.out.println(sf.format(fdw.getTime()));
	    	 fdw.add(Calendar.DAY_OF_YEAR, 1);
	    	
	     } 
    	 
	      
    }
}
