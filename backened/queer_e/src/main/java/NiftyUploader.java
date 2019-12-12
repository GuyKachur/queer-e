import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrResponse;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrInputDocument;
import org.eclipse.jetty.util.IO;
import sun.rmi.runtime.Log;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

public class NiftyUploader {

    private final static Logger LOGGER = Logger.getLogger("NiftyLogger");

    /*
     * I need to,
     * read the entire directory structure,
     * and just make batches of docs to upload
     * then i need to send them to solr
     */

    public static String mirrorPath = "D:\\web\\nifty\\www.nifty.org";
    public static String urlString = "http://localhost:8983/solr/nifty";
    public static SolrClient solr = new HttpSolrClient.Builder(urlString).build();




    public static void main(String[] args) throws IOException {

        System.out.println("Uploading nifty.org mirror to solr");
        ArrayList<SolrInputDocument> inputDocuments = new ArrayList<>();
//        int docCount = 0;
////
//        File fileToRead = new File("fileToRead.txt");
//        BufferedWriter out = new BufferedWriter(new FileWriter(fileToRead));
//
//
//        //Load files into Solr
//        try (Stream<Path> filePathStream=Files.walk(Paths.get(mirrorPath))) {
//
//            filePathStream.forEach(filePath -> {
//                if (Files.isRegularFile(filePath)) {
//                    final String substring = filePath.toString().substring(filePath.toString().lastIndexOf("."));
//                    if(".html".equals(substring)
//                            || ".xml".equals(substring)
//                            || ".jpg".equals(substring)
//                            || ".png".equals(substring)
//                            || ".pdf".equals(substring)
//                            || ".mp4".equals(substring)
//                            || ".js".equals(substring)
//                            || ".ico".equals(substring)
//
//                    ){
//                        if(filePath.toString().equals("D:\\web\\nifty\\www.woot.com\\index.html")) {
//                            System.err.println("APPROACHING");
//                        }
//                        System.out.println("Found one: " + filePath.toString());
//                    } else {
//                        //filepath is a file i want to index
//                        try {
//                            out.write(filePath + "\n");
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                        }
////                        String url = filePath.toString().substring(13);
////                        StringBuilder fileContent = new StringBuilder();
////                        try (Stream<String> stream = Files.lines(filePath, StandardCharsets.ISO_8859_1)) {
////                            stream.forEach(s -> fileContent.append(s).append("\n"));
////                        } catch (IOException e) {
////                            e.printStackTrace();
////                        }
////
////                        NiftyDoc niftyDoc = niftyParser.parse(fileContent.toString(), url);
////                        //LOGGER.log(Level.INFO, niftyDoc.toString());
////                        //System.err.println(niftyDoc.toString());
////                        inputDocuments.add(niftyDoc.getSolrDoc());
//                    }
//                }
//            });
//            out.close();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        batchUpload(0);
    }

    private static void batchUpload(int cursor) {
        int processed = cursor;
        ArrayList<SolrInputDocument> inputDocuments = new ArrayList<>();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream("fileToRead.txt.bak")));
            String line = null;
            StringBuilder fileContent;
            String url;

            while((line = br.readLine()) != null) {
                url = line.substring(13);
                fileContent = new StringBuilder();
                List<String> lines = Files.readAllLines(Paths.get(line),  StandardCharsets.ISO_8859_1);
                for(String lin : lines) {
                    fileContent.append(lin).append("\n");
                }

//                BufferedReader fileBR = new BufferedReader(new InputStreamReader(new FileInputStream(line)));
//                String fileLine = null;
//                StringBuilder fileContent = new StringBuilder();
//                while((fileLine = fileBR.readLine()) != null) {{
//                    fileContent.append(fileLine).append("\n");
//                }}
//                fileBR.close();

//                StringBuilder fileContent = new StringBuilder();
//                try (Stream<String> stream = Files.lines(Paths.get(line), StandardCharsets.ISO_8859_1)) {
//                    stream.forEach(s -> fileContent.append(s).append("\n"));
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
                NiftyDoc niftyDoc = niftyParser.parse(fileContent.toString(), url);
                //LOGGER.log(Level.INFO, niftyDoc.toString());
                //System.err.println(niftyDoc.toString());
                inputDocuments.add(niftyDoc.getSolrDoc());
                processed++;

                if(processed%1000 == 0) {
                    //System.err.println("Committing progress to Solr: " + processed);
                    try {
                        UpdateResponse response = solr.add(inputDocuments);
                        solr.commit();
                        System.err.println(response);
                        if(response.getStatus() == 0) {
                            //if we were sucessful clear the list
                            System.err.println("Committed to Solr successfully " + processed);
                            inputDocuments.clear();
                        }
                    } catch (SolrServerException e) {
                        e.printStackTrace();
                    } catch (IOException ie) {
                        ie.printStackTrace();
                    }
                }

            }
            br.close();
        } catch (IOException e) {

            System.err.println("Processed: " + processed);
            e.printStackTrace();
        }
        if(!inputDocuments.isEmpty()) {
            try {
                UpdateResponse response = solr.add(inputDocuments);
                solr.commit();
                System.err.println(response);
                if(response.getStatus() == 200) {
                    //if we were sucessful clear the list
                    inputDocuments.clear();
                }
            } catch (SolrServerException | IOException e) {
                e.printStackTrace();
            }
        }
    }
}