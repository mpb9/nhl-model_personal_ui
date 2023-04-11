package sqlConverterOddsPortal;

import java.util.ArrayList;

public class utility {
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

  public static void printStringArray(String[] results){
    String printFormat = "(";
    for (String result : results) {
      printFormat = printFormat + result + ", ";
    }
    printIt(printFormat + "),");
  }

  public static void printRegularFinal(ArrayList<String[]> regularResults){
    System.out.println(	"INSERT INTO `playoff_results` (`result_date`, `result_time`, `home_team`, `away_team`, `home_odds`, `away_odds`, `ot_odds`, `result`, `home_score`, `away_score`, `round`, `game`) VALUES");
    for(int i = 0; i<regularResults.size(); i++) { 
      String[] results = regularResults.get(i);
			printIt(
				"('" + results[0] + "', '" + results[1] + "', '" + results[2] +  "', '" + results[3] + "', " 
            + results[4] + ", " + results[5] + ", " + results[6] +  ", '"
            + results[7] +  "', " + results[8] + ", " + results[9] + "),"
			);
		} 
    //System.out.println("REMEMBER THIS MUST BE GMT-4");
  }

  public static void printPlayoffFinal(ArrayList<String[]> playoffResults){
    System.out.println(	"INSERT INTO `playoff_results` (`result_date`, `result_time`, `home_team`, `away_team`, `home_odds`, `away_odds`, `ot_odds`, `result`, `home_score`, `away_score`, `round`, `game`) VALUES");
    for(int i = 0; i<playoffResults.size(); i++) { 
      String[] results = playoffResults.get(i);
			printIt(
        "('" + results[0] + "', '" + results[1] + "', '" + results[2] +  "', '" + results[3] + "', " 
            + results[4] + ", " + results[5] + ", " + results[6] +  ", '"
            + results[7] +  "', " + results[8] + ", " + results[9] +  ", "
            + results[10] +  ", " + results[11] + "),"
			);
		} 
    //System.out.println("REMEMBER THIS MUST BE GMT-4");
  }

}
