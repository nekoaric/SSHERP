import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.alibaba.fastjson.JSON;
import com.cnnct.util.G4Utils;


public class TestSplit {
    public static void main(String[] args) {
    	//初始化当年的周列表
//	    	Calendar c = new GregorianCalendar();
	        
//	        c.setTime(date);
//	        c.get(Calendar.WEEK_OF_YEAR);
    	
            Calendar c2 = new GregorianCalendar();
            c2.setFirstDayOfWeek(Calendar.SUNDAY);
	        c2.setMinimalDaysInFirstWeek(7);
            int y=Integer.parseInt(G4Utils.getCurDate().substring(0, 4));
            System.out.println(y);
            c2.set(y, Calendar.DECEMBER, 31, 23, 59, 59);
            System.out.println(c2.getTime());
            System.out.println(c2.get(Calendar.WEEK_OF_YEAR)); 
        

    		Map<String, Dto> weeks=new HashMap<String, Dto>();
    	      Calendar fdw= Calendar.getInstance();
    	      fdw.set(Calendar.WEEK_OF_YEAR, 1);
    	      fdw.set(Calendar.DAY_OF_WEEK, 7);
    	      SimpleDateFormat sf=new SimpleDateFormat("MM/dd");
    	      for (int i = 0;i<=60; i++) {
    			Dto dto=new BaseDto();
    			String week=+fdw.get(Calendar.YEAR)+"-"+toEnDate(fdw.get(Calendar.MONTH))+"-"+fdw.get(Calendar.WEEK_OF_MONTH)+"Week";
    			String date=sf.format(fdw.getTime());
    			fdw.add(Calendar.DAY_OF_YEAR, -6);
    			date=sf.format(fdw.getTime())+"-"+date;
    			String weekInfo=week+"("+date+")";
    			dto.put("week",weekInfo);
    			dto.put("no", i);
    			weeks.put(weekInfo,dto);
    	    	fdw.add(Calendar.DAY_OF_YEAR, 13);
    	      }
    	      
    	  for (String key : weeks.keySet()) {
			System.out.println(weeks.get(key));
		}
    }
    private static  String toEnDate(int month){
    	String monthEn="";
    	switch (month) {
		case 0:
			monthEn="Jan";
			break;
		case 1:
			monthEn="Feb";
			break;
		case 2:
			monthEn="Mar";
			break;
		case 3:
			monthEn="Apr";
			break;
		case 4:
			monthEn="May";
			break;
		case 5:
			monthEn="Jun";
			break;
		case 6:
			monthEn="Jul";
			break;
		case 7:
			monthEn="Aug";
			break;
		case 8:
			monthEn="Sep";
			break;
		case 9:
			monthEn="Oct";
			break;
		case 10:
			monthEn="Nov";
			break;
		case 11:
			monthEn="Dec";
			break;	
		default:
			break;
		}
    	return monthEn;
    }
}
