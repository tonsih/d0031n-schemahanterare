/* 
 * =============================================================================
 * ==                                SETUP                                    ==
 * =============================================================================
 */
\c postgres;
DROP DATABASE IF EXISTS time_edit;

CREATE DATABASE time_edit;

\c time_edit;

/* 
 * =============================================================================
 * ==                                TABLES                                   ==
 * =============================================================================
 */
CREATE TABLE kurs (
    id bigserial PRIMARY KEY,
    kurskod varchar,
    namn varchar,
    kommentar varchar,
    signatur varchar,
    spec_benamning varchar,
    api_url varchar
);

/* 
 * =============================================================================
 * ==                             INDEXES                                     ==
 * =============================================================================
 */
CREATE INDEX idx_kurs_kurskod ON kurs (kurskod);

CREATE INDEX idx_kurs_namn ON kurs (namn);

CREATE INDEX idx_kurs_kommentar ON kurs (kommentar);

CREATE INDEX idx_kurs_signatur ON kurs (signatur);

CREATE INDEX idx_kurs_spec_benamning ON kurs (spec_benamning);

CREATE INDEX idx_kurs_api_url ON kurs (api_url);

/* 
 * =============================================================================
 * ==                          DATA INSERTION                                 ==
 * =============================================================================
 */
\copy kurs(kurskod, namn, kommentar, signatur, spec_benamning, api_url) FROM './kurser.csv' WITH (FORMAT csv, HEADER, DELIMITER ',', QUOTE '"');