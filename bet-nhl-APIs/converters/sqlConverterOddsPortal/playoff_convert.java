package sqlConverterOddsPortal;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Scanner;

public class playoff_convert {

  public static void main(String[] args) {
		new playoff_convert();
	}
  
  public playoff_convert() { 
		Scanner scan = new Scanner(System.in);

    // REMOVE EXTRA SPACES & UNNEEDED LINES
		ArrayList<String> spaced = new playoff_spacing(scan).get_spacing();

		//testSpacingInput(spaced);
		utility.printSpaces(); 

    // GET REGULAR SEASON FORMAT WITH 0s FOR [..., ROUND, GAME]
    ArrayList<String[]> playoffResults = getSQLFormat(spaced);

    // SORT BY DATE AND ADD PROPER #s FOR [..., ROUND, GAME]
    playoffResults = sortByDate(playoffResults);
    playoffResults = getGameAndRound(playoffResults);

    utility.printPlayoffFinal(playoffResults);
	}

  public ArrayList<String[]> getSQLFormat(ArrayList<String> spaced) {
		
		String date = "";
		String time = "";

    ArrayList<String[]> playoffResults = new ArrayList<String[]>();
		
		for(int i = 0; i<spaced.size(); i++) {			
			// 1) Check for/add new DATE 2) Add TIME
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
			
			// Add HOME_TEAM 
			i++;
			String homeTeam = utility.teamFormat(utility.getTeam(spaced.get(i)));
			
			// Add SCORES
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
			
      // Add RESULT
			String winner = "H";
			if (result.equals("OT")) {
				winner = "O";
			} else if (result.equals("pen.")) {
				winner = "O";
			} else if (homeScore<awayScore) winner = "A";
			
			// Add AWAY_TEAM
			i = i+2;
			String awayTeam = utility.teamFormat(utility.getTeam(spaced.get(i)));			 

			// Add IMPLIED ODDS
      i+=3;
      DecimalFormat numberFormat = new DecimalFormat("#.00000");
			String hOdds = numberFormat.format(1/Double.parseDouble(spaced.get(i-2)));
			String oOdds = numberFormat.format(1/Double.parseDouble(spaced.get(i-1)));
			String aOdds = numberFormat.format(1/Double.parseDouble(spaced.get(i)));

      // Input into playoffResults
      playoffResults.add(new String[]{date, time, homeTeam, awayTeam, hOdds, aOdds, oOdds, winner, String.valueOf(homeScore), String.valueOf(awayScore), "0", "0"});

			// Confirm next List item is a DATE/TIME
			if(!utility.confirmDateOrTime(spaced.get(i+1))) {
				i++;
			}
		}

    return playoffResults;
	}

  public ArrayList<String[]> getGameAndRound(ArrayList<String[]> playoffResults){
    int year = Integer.parseInt(playoffResults.get(0)[0].substring(0, 4));
    int beginId = 0;
    HashMap<String, String> seriesStartDates = new HashMap<>();
    HashMap<String, Integer> seriesGameCount = new HashMap<>();
    HashMap<String, Integer> teamSeriesCount = new HashMap<>();


    for(int i = 0; i < playoffResults.size(); i++){
      String[] result = playoffResults.get(i);

      //make this fix a bit tidier
      if(i == playoffResults.size()-1){
        if(!seriesStartDates.containsKey(result[2]+result[3]) && !seriesStartDates.containsKey(result[3]+result[2])){
          seriesStartDates.put(result[2]+result[3], result[0]);
          seriesGameCount.put(result[2]+result[3], 0);
          if(!teamSeriesCount.containsKey(result[2])){
            teamSeriesCount.put(result[2], 0);
            teamSeriesCount.put(result[3], 0);
          }
        }
        year = 0;
        i++;
      }

      if(Integer.parseInt(result[0].substring(0, 4)) != year){
        
        while(beginId < i){
          String[] playoffYearResult = playoffResults.get(beginId);
          int seriesNumber = teamSeriesCount.get(playoffYearResult[2]);
          String seriesStartDateKey = seriesStartDates.containsKey(playoffYearResult[2]+playoffYearResult[3]) 
            ? playoffYearResult[2]+playoffYearResult[3] 
            : playoffYearResult[3]+playoffYearResult[2];
          
          int gameNumber = seriesGameCount.get(seriesStartDateKey);

          if(gameNumber == 0){
            seriesNumber++;
            teamSeriesCount.replace(playoffYearResult[2], seriesNumber);
            teamSeriesCount.replace(playoffYearResult[3], seriesNumber);
          }
          gameNumber++;

          playoffYearResult[10] = String.valueOf(seriesNumber);
          playoffYearResult[11] = String.valueOf(gameNumber);

          seriesGameCount.replace(seriesStartDateKey, gameNumber);

          playoffResults.set(beginId, playoffYearResult);
          beginId++;
        }
        // make this tidier too
        if(year==0) return playoffResults;

        year = Integer.parseInt(result[0].substring(0, 4));
        seriesStartDates.clear();
        teamSeriesCount.clear();
        i--;

      } else {
        if(!seriesStartDates.containsKey(result[2]+result[3]) && !seriesStartDates.containsKey(result[3]+result[2])){
          seriesStartDates.put(result[2]+result[3], result[0]);
          seriesGameCount.put(result[2]+result[3], 0);
          if(!teamSeriesCount.containsKey(result[2])){
            teamSeriesCount.put(result[2], 0);
            teamSeriesCount.put(result[3], 0);
          }
        }
      }

    }


    return playoffResults;
  }

  public ArrayList<String[]> sortByDate(ArrayList<String[]> regSeasonFormats){
    Collections.sort(regSeasonFormats, new Comparator<String[]>() {
      public int compare(String[] result1, String[] result2){
        return result1[0].compareTo(result2[0]);
      }
    });
    return regSeasonFormats;
  }

}
