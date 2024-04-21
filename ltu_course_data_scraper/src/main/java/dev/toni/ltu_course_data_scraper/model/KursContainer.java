package dev.toni.ltu_course_data_scraper.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.StringJoiner;

/**
 * This class serves as a container for managing a collection of Kurs objects
 * and provides functionalities to add courses and write them to a CSV file.
 */
@AllArgsConstructor
@Getter
@Setter
public class KursContainer {
    private final ArrayList<Kurs> kurser;

    /**
     * Constructs an empty KursContainer.
     */
    public KursContainer() {
        kurser = new ArrayList<>();
    }

    /**
     * Adds a new Kurs object to the container.
     *
     * @param kurs The Kurs object to be added.
     */
    public void addKurs(Kurs kurs) {
        kurser.add(kurs);
    }

    /**
     * Writes the data of all Kurs objects in the container to a CSV file
     * specified by the filename. The file is created in the "../db/" directory.
     * If the directory does not exist, it is created.
     *
     * @param filename The name of the CSV file to write the kurs data to.
     */
    public void writeCsv(String filename) {

        File file = new File(filename);

        File directory = file.getParentFile();

        if (directory != null && !directory.exists()) {
            directory.mkdirs();
        }

        try (FileWriter writer = new FileWriter(file)) {
            writer.write(
                    "\"kurskod\",\"namn\",\"kommentar\",\"signatur\",\"spec_benämning\",\"api_url\"\n");

            for (Kurs kurs : kurser) {
                StringJoiner joiner = new StringJoiner("\",\"", "\"", "\"\n");

                joiner.add(safeString(kurs.getKurskod()))
                        .add(safeString(kurs.getNamn()))
                        .add(safeString(kurs.getKommentar()))
                        .add(safeString(kurs.getSignatur()))
                        .add(safeString(kurs.getSpecBenamning()))
                        .add(safeString(kurs.getApiUrl()));

                writer.write(joiner.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Ensures that a given string is not null, returning an empty string if it is null.
     *
     * @param value The string to check for nullity.
     * @return The original string if not null; an empty string otherwise.
     */
    private String safeString(String value) {
        return value != null ? value : "";
    }
}