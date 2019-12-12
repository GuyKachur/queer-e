import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class niftyParser {
    String[] cat = {
            "adult-friends",
            "adult-youth",
            "athletics",
            "authoritarian",
            "beginnings",
            "camping",
            "celebrity",
            "college",
            "encounters",
            "first-time",
            "highschool",
            "historical",
            "incest",
            "interracial",
            "masturbation",
            "military",
            "no-sex",
            "non-english",
            "relationships",
            "rural",
            "sf-fantasy",
            "urination",
            "young-friends"
    };
    public HashSet categories = new HashSet<>(Arrays.asList(cat));

   public static String exampledoc = "Date: Sat, 4 May 2019 17:22:29 -0400\n" +
            "From: Natty <bacteriaburger@gmail.com>\n" +
            "Subject: The Engineering of Consent\n" +
            "\n" +
            "*Support independent queer media and donate to the Nifty Archive:\n" +
            "http://donate.nifty.org/donate.html\n" +
            "\n" +
            "*More free stories on my website: http://nattysoltesz.com/stories\n" +
            "\n" +
            "*Email me: bacteriaburger@gmail.com\n" +
            "\n" +
            "The Engineering of Consent\n" +
            "by Natty Soltesz\n" +
            "\n" +
            "I got this instantaneous feeling the first time Paul smiled at me from\n" +
            "across the bar: attraction, yes, but more urgent. Like *need*.\n" +
            "\n" +
            "I was in the throes of a major breakup and depressed, to be sure. I'd\n" +
            "fallen asleep in the taxi, which was a thing people did in driverless cars,\n" +
            "drifting off in those cushy backseats while being spirited through the\n" +
            "streets. It woke me with a high-pitched beep and then I was in front of the\n" +
            "bar, wiping the drool off my chin. I caught a glimpse of myself in the dark\n" +
            "windows of the taxi before it went off – I was strewn.\n";

    public static NiftyDoc parse(String incomingDoc, String url) {
        //System.out.println(incomingDoc + url);
        String[] splitString = incomingDoc.split("\n");
       // System.err.println(splitString);
        SimpleDateFormat formatter = new SimpleDateFormat("E, dd MMM yyyy HH:mm:ss Z");

        Date date= null;
        try {
            date = formatter.parse(splitString[0].substring(6));
        } catch (ParseException | IndexOutOfBoundsException e) {
            //e.printStackTrace();
            date = new Date();
        }

        // will get "by" to the next newline character
       // \bby[A-Za-z0-9 ]+\n


        Pattern emailPattern = Pattern.compile("[A-Za-z0-9+_.-]+@[A-za-z0-9._+-]+");
        Matcher emailMatcher = emailPattern.matcher(incomingDoc);
        String authorEmail = "Unknown_Email";
        String authorName = "Unknown_Author";
        //System.err.println(authorLine);
        if(emailMatcher.find()) {
            authorEmail = emailMatcher.group(0);
        }

        try {
            String authorLine = splitString[1];
            authorName = authorLine.substring(authorLine.indexOf(":")+1, authorLine.indexOf(authorEmail)-1);
        } catch (IndexOutOfBoundsException e) {
            authorName = "Unknown_Author";
        }


        if(authorName.isEmpty()) {
            authorName = "Unknown_Author";
        }
        //i can ALWAYS ge the title from the url


//        int furthest = Math.min(splitString[2].length(), 9);
//        String title = splitString[2].substring(furthest);

        String[] spliturl = url.split("\\\\");
        String title = spliturl[spliturl.length-1];

        String category = "undefined";
        String orientation = "all";

        if(spliturl.length >3) {

            orientation = spliturl[2];
            if(orientation.equals("bestiality")) {
                category = orientation;
            } else {
                category = spliturl[3];
            }
        }
//        for(String el : spliturl) {
//            System.err.println(el);
//        }


//        StringBuilder body = new StringBuilder();
//        for(int i = 3; i < splitString.length; i++) {
//            body.append(splitString[i]).append("\n");
//        }
        //System.out.println(date +"\n"+ authorEmail +"\n"+ authorName +"\n"+ title + "\n" + url + "\n" + body.toString().substring(0, 50));
        return new NiftyDoc(title, authorName, authorEmail, date, orientation, category,  url, incomingDoc);

        //return date +"\n"+ authorEmail +"\n"+ authorName +"\n"+ title + "\n" + body.toString();


    }

    public static void main(String[] args) {
        System.err.println(niftyParser.parse(exampledoc, "www.nifty.org\\\\nifty\\\\gay\\\\adult-youth"));
    }
}