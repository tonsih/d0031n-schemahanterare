package dev.toni.course_data_scraper.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Handles web requests for the application.
 */
public class WebRequestHandler {

    /**
     * Makes an HTTP GET request to the specified URL and returns the response as a String.
     *
     * @param urlString The URL string to which the request is to be made.
     * @return The response from the server as a String.
     * @throws IOException If an I/O error occurs while creating the input stream,
     *                     reading from the input stream, or closing the input stream.
     */
    public static String makeHttpRequest(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        InputStream inputStream = connection.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(
                inputStream,
                StandardCharsets.UTF_8));

        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line).append(System.lineSeparator());
        }

        reader.close();
        connection.disconnect();

        return response.toString();
    }
}