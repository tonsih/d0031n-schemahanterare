package dev.toni.course_data_scraper;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.SelectOption;
import dev.toni.course_data_scraper.api.WebRequestHandler;
import dev.toni.course_data_scraper.constants.K;
import dev.toni.course_data_scraper.gui.ProgressBar;
import dev.toni.course_data_scraper.model.Kurs;
import dev.toni.course_data_scraper.model.KursContainer;
import dev.toni.course_data_scraper.parser.HTMLParser;
import dev.toni.course_data_scraper.parser.JSONParser;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * Main class responsible for orchestrating the course data assembly using
 * web scraping and API requests.
 */
public class Main implements K {
    /**
     * Main method to run the application.
     *
     * @param args command line arguments
     * @throws IOException if an I/O error occurs
     */
    public static void main(String[] args) throws IOException {
        String inputFilePath;
        String outputFilePath;

        List<String> urls = new ArrayList<>();

        if (args.length > 0) {
            inputFilePath = args[0];
            Scanner coursesCodesFile = new Scanner(Paths.get(inputFilePath));

            while (coursesCodesFile.hasNextLine()) {
                String currentLine = coursesCodesFile.nextLine();
                String url = String.format(
                        "%s/objects.html?fr=t&partajax=t&im=f&sid=3&l=en_US&search_text=%s&objects=&types=28",
                        BASE_URL,
                        currentLine);
                urls.add(url);
            }
        } else {
            urls.add(
                    String.format("%s/objects.html?max=&fr=t&partajax=t&im=f&sid=3&l=en_US&objects=&types=28", BASE_URL));
        }

        if (args.length > 1) {
            outputFilePath = args[1];
        } else {
            outputFilePath = DEFAULT_OUTPUT_PATH;
        }

        List<String> courseSignatures = new ArrayList<>();

        urls.forEach(url -> {
            try {
                String coursesResponse = WebRequestHandler.makeHttpRequest(url);

                List<String> parsedSignatures = List.of(HTMLParser.parseCoursesResponse(
                        coursesResponse).split("\n"));

                courseSignatures.addAll(parsedSignatures);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium()
                    .launch(new BrowserType.LaunchOptions().setHeadless(true)
                            .setSlowMo(50));
            Page page = browser.newPage();

            KursContainer kursContainer = new KursContainer();

            System.out.printf("Writing course data to %s\n", outputFilePath);
            ProgressBar progressBar = new ProgressBar((long) courseSignatures.size());
            progressBar.printProgress();

            for (String courseSignature : courseSignatures) {
                if (courseSignature.isEmpty()) continue;

                page.navigate(
                        String.format("%s/ri1Q8.html", BASE_URL));

                Locator selectorLocator = page.locator(
                        "xpath=//*[@id='fancytypeselector']");
                selectorLocator.selectOption(new SelectOption().setLabel(
                        "Course"));
                Locator searchKursElementLocator = page.locator(
                        "xpath=//*[@id='ffsearchname']");

                searchKursElementLocator.fill("\"" + courseSignature + "\"");

                Locator searchKursButtonLocator = page.locator(
                        "xpath=/html/body/div[9]/div[1]/div[2]/div[1]/div/div/input[2]");
                searchKursButtonLocator.click();

                Locator objectBasketItemLocator = page.locator(
                        "id=objectbasketitemX0");

                if (objectBasketItemLocator == null) {
                    continue;
                }

                String dataId = objectBasketItemLocator.getAttribute(
                        "data-idonly");
                String response = WebRequestHandler.makeHttpRequest(String.format(
                        "%s/objects/%s/o.json?fr=t&types=28&sid=3&l=en_US",
                        BASE_URL,
                        dataId));

                System.out.println(response);

                Kurs kurs = JSONParser.parse(response, Kurs.class);

                Locator infoBoxLocator = page.locator("id=info0");
                infoBoxLocator.click();

                Locator visaSchemaButtonLocator = page.locator(
                        "xpath=//*[@id=\"objectbasketgo\"]");
                visaSchemaButtonLocator.click();

                String apiUrl = page.url().replaceAll("\\.htm(l)?$", ".json");
                kurs.setApiUrl(apiUrl);

                kursContainer.addKurs(kurs);

                progressBar.printProgress();
                progressBar.incrementProgress();
            }

            progressBar.printProgress();

            page.context().browser().close();

            kursContainer.writeCsv(outputFilePath);

            System.out.println("\nDone!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}