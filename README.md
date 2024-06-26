# Schemahanterare (D0031N - Examination Assignment)

This repository contains the code and resources for an LTU project developed as
part of the course: "D0031N - Enterprise Architecture using SOA". The project
includes a web application that automates LTU's course scheduling by
functioning as an intermediary between TimeEdit and Canvas. The web application
enables course coordinators to directly register courses and provides
functionalities to modify, add, or remove course details retrieved from
TimeEdit, and submit the data to a Canvas calendar.

This repository includes:

-   **LTU Course Data Scraper**: The source code for a Java application that
    uses the Playwright framework to populate a database of LTU course data on
    TimeEdit. The application was developed to overcome the lack of direct
    access to TimeEdit's API for event data. API URLs for course events are
    generated by TimeEdit in some mysterious manner (although there appears to
    be some logical pattern to these URLs, as discussed by Jonas Hietala in his
    blog post: [Jonas Hietala: Extracting schedule information from
    timeedit](https://www.jonashietala.se/blog/2014/11/27/extracting_schedule_information_from_timeedit/))

-   **Frontend**: A web application client developed using React, with Vite
    serving as the build tool and development environment. TypeScript is used
    for scripting the React components. Note: The Playwright library is
    included for testing purposes (original tests are omitted due to changes in
    schedule data).

-   **Backend**: A REST API that provides TimeEdit course data from the
    database, built with Java SpringBoot.

-   **Database**: Includes the necessary PostgreSQL SQL script
    "[utils/build_db.sh](utils/build_db.sh)" to construct the schema and
    populate the database with course data from the CSV file generated by the
    Playwright application (or manually).

### Web Application Demo
![web-app-demo](assets/d0031n-webapp-demo.gif)
