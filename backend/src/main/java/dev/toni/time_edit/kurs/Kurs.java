package dev.toni.time_edit.kurs;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table
public class Kurs {
    @Id
    private Long id;
    private String kurskod;
    private String namn;
    private String kommentar;
    private String signatur;
    @Column(name = "spec_benamning")
    private String specBenamning;
    @Column(name = "api_url")
    private String apiUrl;
}