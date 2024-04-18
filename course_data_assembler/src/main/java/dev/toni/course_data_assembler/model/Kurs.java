package dev.toni.course_data_assembler.model;
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
    @JsonProperty("Kurskod")
    private String kurskod;

    @JsonProperty("Namn")
    private String namn;

    @JsonProperty("Kommentar")
    private String kommentar;

    @JsonProperty("Signatur")
    private String signatur;

    @JsonProperty("Spec benämning")
    private String specBenamning;

    private String apiUrl;

}