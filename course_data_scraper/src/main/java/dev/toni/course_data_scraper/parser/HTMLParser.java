package dev.toni.course_data_scraper.parser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * A utility class for parsing HTML content related to course data.
 * The class uses JSoup library to parse HTML and extract specific information.
 */
public class HTMLParser {

    /**
     * Parses the HTML content of a web page response to extract specific course data.
     * This method specifically targets elements with the class 'infoboxtitle' and extracts
     * the last part of their text content, typically representing a signature or a unique identifier.
     *
     * @param htmlString The HTML content as a string, typically the response from a course listing page.
     * @return A string containing all extracted signatures or identifiers, each followed by a new line.
     */
    public static String parseCoursesResponse(String htmlString) {
        Document doc = Jsoup.parse(htmlString);
        Elements infoTitles = doc.select(".infoboxtitle");
        StringBuilder extractedText = new StringBuilder();
        for (Element title : infoTitles) {
            String[] parts = title.text().split(", ");
            if (parts.length > 0) {
                String signatur = parts[parts.length - 1];
                extractedText.append(signatur).append(System.lineSeparator());
            }
        }
        return extractedText.toString();
    }

}