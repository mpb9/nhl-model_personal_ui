package sqlConverterOddsPortal;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Scanner;

public class results_convert {
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
	static String DET = "Detroit"; static String SEA = "Seattle";

  public static void main(String[] args) {
		new results_convert();
	}
  
  public results_convert() {
		Scanner scan = new Scanner(System.in);
    ArrayList<String> spaced = new results_spacing(scan).get_spacing();

		
		//testSpacingInput(spaced);
		printSpaces();
		printSQLFormat(spaced); 
		//System.out.println("REMEMBER THIS MUST BE GMT-4");
	}

  public void printSQLFormat(ArrayList<String> spaced) {
		System.out.println(
			"INSERT INTO `results` (`result_date`, `result_time`, `home_team`, `away_team`, `home_odds`, `away_odds`, `ot_odds`, `result`, `home_score`, `away_score`) VALUES"
		);
		
		String date = "";
		String time = "";
		
		for(int i = 0; i<spaced.size(); i++) {			
			// 1) Check for new DATE 2) Add TIME
			String dateOrTime = spaced.get(i);
			String newDate = "";
			if (dateOrTime.contains("DATE")) {
 			   	date = dateOrTime.substring(5);
 			   	newDate = dateOrTime.substring(5);
			} else  time = dateOrTime;
			if (!newDate.equals("")) {
				i++;
				time = spaced.get(i);
			}
			time = time.replaceAll("\\s", "");
			
			// 1) Add HOME TEAM 
			i++;
			String homeTeam = teamFormat(getTeam(spaced.get(i)));
			
			// 1) Add RESULT 2) Add SCORES
			i = i+2;
			String scores[] = spaced.get(i).split(" ", 3);
			String result = "";
			if(scores[2].contains(" ")) {
				String temp[] = scores[2].split(" ", 2);
				result = temp[1];
				scores[2] = temp[0];
			}
			int homeScore = Integer.parseInt(scores[0]);
			int awayScore = Integer.parseInt(scores[2]);
			
			String winner = "H";
			if (result.equals("OT")) {
				winner = "O";
			} else if (result.equals("pen.")) {
				winner = "O";
			} else if (homeScore<awayScore) winner = "A";
			
			// 1) Add AWAY TEAM
			i = i+2;
			String awayTeam = teamFormat(getTeam(spaced.get(i)));			
			
			
			// 1) Add IMPLIED ODDS
			i++;
			double home = Double.parseDouble(spaced.get(i));
			home = (1/home);
			i++;
			double overtime = Double.parseDouble(spaced.get(i));
			overtime = 1/overtime;
			i++;
			double away = Double.parseDouble(spaced.get(i));
			away = 1/away;
			
			DecimalFormat numberFormat = new DecimalFormat("#.00000");
			String hOdds = numberFormat.format(home);
			String aOdds = numberFormat.format(away);
			String oOdds = numberFormat.format(overtime);

			System.out.println(
				"('" + date + "', '" + time + "', '" + homeTeam +  "', '" + awayTeam + "', " 
						+ hOdds + ", " + aOdds + ", " + oOdds +  ", '"
						+ winner +  "', " + homeScore + ", " + awayScore + "),"
			);
			
			// Confirm next List item is a DATE/TIME
			if(!confirmDateOrTime(spaced.get(i+1))) {
				i++;
			}
		}
	}
	
	public static String getTeam(String team) {
		String fullName[] = team.split(" ", 2);
		String readyToFormat = fullName[0];
		if(fullName[0].equals("New")){
			String restOfName[] = fullName[1].split(" ", 2);
			readyToFormat = restOfName[0];
			if(restOfName[0].equals("York")){
				readyToFormat = restOfName[1];
			}
		}
		return readyToFormat;
	}
	
	public static String teamFormat(String team) {
		if (team.equals(STL)) return "STL"; if (team.equals(COL)) return "COL";
		if (team.equals(DAL)) return "DAL"; if (team.equals(VGK)) return "VGK";
		if (team.equals(EDM)) return "EDM"; if (team.equals(VAN)) return "VAN";
		if (team.equals(CGY)) return "CGY"; if (team.equals(ARI)) return "ARI";
		if (team.equals(WPG)) return "WPG"; if (team.equals(NSH)) return "NSH";
		if (team.equals(MIN)) return "MIN"; if (team.equals(CHI)) return "CHI";
		if (team.equals(SJS)) return "SJS"; if (team.equals(ANA)) return "ANA";
		if (team.equals(LAK)) return "LAK"; if (team.equals(BOS)) return "BOS";
		if (team.equals(TBL)) return "TBL"; if (team.equals(WSH)) return "WSH";
		if (team.equals(PIT)) return "PIT"; if (team.equals(PHI)) return "PHI";
		if (team.equals(NYI)) return "NYI"; if (team.equals(CAR)) return "CAR";
		if (team.equals(CBJ)) return "CBJ"; if (team.equals(TOR)) return "TOR";
		if (team.equals(NYR)) return "NYR"; if (team.equals(FLA)) return "FLA";
		if (team.equals(BUF)) return "BUF"; if (team.equals(MTL)) return "MTL";
		if (team.equals(NJD)) return "NJD"; if (team.equals(OTT)) return "OTT";
		if (team.equals(DET)) return "DET"; if (team.equals(SEA)) return "SEA";
		else return "ERROR";
	}
	
	public static boolean confirmDateOrTime(String possibleDateTime) {
		return possibleDateTime.length() > 2;
	}
	
	public static void printIt(String s) {
		System.out.println(s);
	}

  public static void printSpaces() {
		System.out.println(""); System.out.println("");
    System.out.println(""); System.out.println("");
		System.out.println(""); System.out.println("");
	}
	
  public static void testSpacingInput(ArrayList<String> spaced){
    for(int i = 0; i<spaced.size(); i++) { 
			printIt(spaced.get(i));
		} 
  }

}
