package dev.toni.course_data_scraper.parser;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * A utility class for parsing JSON content into Java objects.
 * This class uses the Jackson data-binding library to deserialize JSON content.
 */
public class JSONParser {

    /**
     * Parses a JSON string into an object of the specified type. This method configures the ObjectMapper
     * to not fail on unknown properties, which allows for more lenient mapping of JSON to Java objects.
     *
     * @param json The JSON string to parse.
     * @param tClass The class of type T that the JSON should be parsed into.
     * @param <T> The type parameter indicating the type of the object to return.
     * @return An instance of type T populated with data parsed from the provided JSON string.
     * @throws Exception if there is an error in reading or parsing the JSON.
     */
    public static <T> T parse(String json, Class<T> tClass) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper.readValue(json, tClass);
    }
}