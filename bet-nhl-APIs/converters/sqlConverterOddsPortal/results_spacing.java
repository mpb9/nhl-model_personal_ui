package sqlConverterOddsPortal;

import java.util.ArrayList;
import java.util.Scanner;

public class results_spacing {
	static String STL = "St."; static String COL = "Colorado"; static String DAL = "Dallas";
	static String VGK = "Vegas"; static String EDM = "Edmonton"; static String VAN = "Vancouver";
	static String CGY = "Calgary"; static String ARI = "Arizona"; static String WPG = "Winnipeg";
	static String NSH = "Nashville"; static String MIN = "Minnesota"; static String CHI = "Chicago";
	static String SJS = "San"; static String ANA = "Anaheim"; static String LAK = "Los";
	static String BOS = "Boston"; static String TBL = "Tampa"; static String WSH = "Washington";
	static String PIT = "Pittsburgh"; static String PHI = "Philadelphia"; static String NYI = "Islanders";
	static String CAR = "Carolina"; static String CBJ = "Columbus"; static String TOR = "Toronto";
	static String NYR = "Rangers"; static String FLA = "Florida"; static String BUF = "Buffalo";
	static String MTL = "Montreal"; static String NJD = "Jersey"; static String OTT = "Ottawa";
	static String DET = "Detroit";  static String SEA = "Seattle";
   
	String[] nhlTeams = {"St.", "Colorado", "Dallas", "Vegas", "Edmonton", "Vancouver", "Calgary", "Arizona",
                        "Winnipeg", "Nashville", "Minnesota", "Chicago", "San", "Anaheim", "Los", "Boston",
                        "Tampa", "Washington", "Pittsburgh", "Philadelphia", "New", "Carolina", "Columbus",
                        "Toronto", "Florida", "Buffalo", "Montreal", "Ottawa", "Detroit", "Seattle"};
	
	String[] nhlNames = {"Louis Blues", "Avalanche", "Stars", "Golden Knights", "Oilers", "Canucks", "Flames", "Coyotes",
						"Jets", "Predators", "Wild", "Blackhawks", "Jose Sharks", "Ducks", "Angeles Kings", "Bruins",
						"Bay Lightning", "Capitals", "Penguins", "Flyers", "York Rangers", "Jersey Devils", "York Islanders", "Hurricanes", "Blue Jackets",
						"Maple Leafs", "Panthers", "Sabres", "Canadiens", "Senators", "Red Wings", "Kraken"};
	
	String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};	
	
	String line;
	String s = "";
	String first = "";
	String second = "";
	String third = "";
	String split1 = "";
	String split2 = "";
	char from ;
	String to ;
	
	String year = "";
	String month = "";
	String day = "";
	
	String lastLine = "";
	Scanner scan;
	
	public results_spacing(Scanner scan) {
		this.scan = scan;
	}
	public ArrayList<String> get_spacing(){
		ArrayList<String> res = new ArrayList<>();
		int i = -1;
		while (this.scan.hasNextLine()){
			line = this.scan.nextLine();
		    from = ':';
		    to = " : ";
		    
		    if(line.equals(":")) {
		    	line = lastLine + line + this.scan.nextLine();
		    	res.remove(i);
		    	i--;
		    }
		    
		    if(line.equals("X")) {
		    	res.remove(i);
		    	i--;
		    	line = this.scan.nextLine();
		    	line = this.scan.nextLine();
		    }
		    
		    
	    	String spaced = replacecharacter(from,to, nhlTeams);
	    	
	    	if(spaced.equals("OT") || spaced.equals("pen.")) {
	    		String oldScore = res.get(i-2);
	    		String oldTeam = res.get(i-1);
	    		res.remove(i);
	    		res.remove(i-1);
	    		res.remove(i-2);
	    		res.add(oldScore + " " + spaced);
	    		res.add(oldTeam);
	    		res.add(oldTeam);
	    	} else if(!spaced.equals("")) { //&& !spaced.equals(this.lastLine) to delete duplicate team
		    	res.add(spaced);
		    	this.lastLine = spaced;
				i++;
		    }
		}
		// end scanner with ctrl+z
		return res;
	}
   
	public String replacecharacter(char f, String t, String[] nhlTeams) {
	   
	   s = "";
	   
	 //split up the line with the time, team names, and score
	   for (int j = 0; j < nhlTeams.length; j++) { 
    	   if (line.contains(nhlTeams[j])){
    		   for(int mins1 = 0; mins1 < 6; mins1++) {
    			   for (int mins2 = 0; mins2<10; mins2++) {
    				   String time = ":" + mins1 + mins2;
    				   
    				   if (line.contains(time)){
    	        		   String[] strArr = line.split(time);
    	        		   first = strArr[0];
    	        		   String rest = strArr[1];
    	        		   // String third = strArr[2];
    	        		   
    	        		   for (int k = 0; k < nhlNames.length; k++) {
    	        			   if (rest.contains(nhlNames[k]) && !rest.contains(nhlNames[k] + " -")){
    	        				   String[] strArr2 = rest.split(nhlNames[k]);
    	        				   second = strArr2[0];
    	        				   third = strArr2[1];
    	        				   first = first + time;
    	                		   second = second + nhlNames[k];
    	                		   second.replaceAll("\t", "");
    	                		   third.replaceAll("\t", "");
    	        			   }
    	        		   }
    	        		   
    	        		   // remove : from first part
    	        		   System.out.println(first);
    	        		   System.out.println(second);
    	        		// remove : from third part
    	        		   String thi = "";
    	        		   for(int i =0;i< third.length();i++) {
    	    	               if(third.charAt(i) == f) {
    	    	                  thi += t;            	   
    	    	               } else {
    	    	                   thi += third.charAt(i);
    	    	               }
    	    	           }
    	    	           if (thi != "") {
    	    	               System.out.println(thi);
    	    	           }
    	        		   line = "";
    	        		   break;
    	    		   }
    			   }
    		   }
    		   
    	   }
       }
	   //removing the : from each line that wasnt addressed above (should be none but dont want to delete yet)

	   if (line != "") {
		   first = ""; //month
		   second = ""; //day
		   third = ""; //year
           for(int i =0;i< line.length();i++) {
               if(line.charAt(i) == f) {
                  s += t;            	   
               } else {
                   s += line.charAt(i);
               }
           }
    	   for (int j = 0; j < months.length; j++) {
    		   if (s.contains(months[j])) {
    			   if(s.contains("Today") || s.contains("Yesterday")) {	// havent tested this cond yet, should be good
    				   if(s.contains("Today, ")){
    					   String[] todaySplt = line.split("Today, ");
    					   //get month
        				   j = j+1;
        				   first = Integer.toString(j);
        				   if(first.length() < 2) {
        					   first = "0"+first;
        				   }
        				   //get day
        				   second += todaySplt[1].charAt(0);
        				   second += todaySplt[1].charAt(1);
        				   day = second;
        				   //get year
        				   if(!(first.equals("01") && !month.equals("01"))) {
        					   int newYear = Integer.parseInt(year);
        					   newYear++;
        					   year = Integer.toString(newYear);
        				   }
        				   //set month & year
        				   month = first;
        				   first += "-";
        				   third = year + "-";
        				   
        				   s = "DATE " + third + first + second;
        				   
    				   } else {
    					   String[] yesterdaySplt = line.split("Yesterday, ");
    					 //get month
        				   j = j+1;
        				   first = Integer.toString(j);
        				   if(first.length() < 2) {
        					   first = "0"+first;
        				   }
        				   //get day
        				   second += yesterdaySplt[1].charAt(0);
        				   second += yesterdaySplt[1].charAt(1);
        				   day = second;
        				   //get year
        				   if(!(first.equals("01") && !month.equals("01"))) {
        					   int newYear = Integer.parseInt(year);
        					   newYear++;
        					   year = Integer.toString(newYear);
        				   }
        				   //set month & year
        				   month = first;
        				   first += "-";
        				   third = year + "-";
        				   
        				   s = "DATE " + third + first + second;
    				   }
    			   } else {
    				   j = j+1;
    				   first = Integer.toString(j);
    				   if(first.length() < 2) {
    					   first = "0"+first;
    				   }
    				   month = first;
    				   first += "-";
    				   
    				   second += s.charAt(0);
    				   second += s.charAt(1);
    				   day = second;
    				   
    				   third += s.charAt(7);
    				   third += s.charAt(8);
    				   third += s.charAt(9);
    				   third += s.charAt(10);
    				   year = third;
    				   third += "-";
    				 
    				   s = "DATE " + third + first + second;

    			   }
    		   }
    	   }
           if (s.length() > 2 && !s.contains("B's")) {
               return s;
           } 
	   }
	   if (s.length() <= 2 || s.equals("OT") || s.equals("pen.")) {
		   return s;
	   } else return "";
   }
}
