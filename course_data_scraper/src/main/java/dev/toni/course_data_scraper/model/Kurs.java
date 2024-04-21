package dev.toni.course_data_scraper.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
@Getter
public class Kurs {
    @JsonProperty("Course code")
    private String kurskod;

    @JsonProperty("Name")
    private String namn;

    @JsonProperty("Kommentar")
    private String kommentar;

    @JsonProperty("Signature")
    private String signatur;

    @JsonProperty("Spec benämning")
    private String specBenamning;

    private String apiUrl;

}