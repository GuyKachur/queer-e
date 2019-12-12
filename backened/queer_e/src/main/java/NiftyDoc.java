import org.apache.solr.common.SolrInputDocument;

import java.util.Date;

public class NiftyDoc {
    String Title;
    String Author;
    String Email;
    String Content;
    String Category;
    String Orientation;
    String Url;
    java.util.Date Date;

    public NiftyDoc(String title, String authorName, String authorEmail, java.util.Date date, String orientation, String category, String url, String body) {
        Title = title;
        Author = authorName;
        Email = authorEmail;
        Date = date;
        Orientation = orientation;
        Category = category;
        Url = url;
        Content = body;
    }


    @Override
    public String toString() {
        return Date+"\n" + Title +"\n" + Author+"\n" + Email+"\n" +Url +"\n"+ Content+"\n" ;
    }

    public SolrInputDocument getSolrDoc() {
        SolrInputDocument returnDoc = new SolrInputDocument();
        returnDoc.addField("title", Title);
        returnDoc.addField("date", Date);
        returnDoc.addField("email", Email);
        returnDoc.addField("author", Author);
        returnDoc.addField("body", Content);
        returnDoc.addField("url", Url);
        returnDoc.addField("category", Category);
        returnDoc.addField("orientation", Orientation);
        return returnDoc;
    }

}