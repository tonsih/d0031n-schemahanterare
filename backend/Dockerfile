# Use the Adoptium Temurin OpenJDK 17 image as the base image
FROM eclipse-temurin:17-jre

# Add a volume pointing to /tmp
VOLUME /tmp

# Make port  available to the world outside this container
EXPOSE 5001

# The application's jar file
ARG JAR_FILE=target/time_edit-0.0.1-SNAPSHOT.jar

# Add the application's jar to the container
COPY ${JAR_FILE} app.jar

# Run the jar file
ENTRYPOINT ["java","-jar","/app.jar"]
