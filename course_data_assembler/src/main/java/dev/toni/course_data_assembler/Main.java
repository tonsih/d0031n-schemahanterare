package dev.toni.course_data_assembler;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.SelectOption;
import dev.toni.course_data_assembler.api.WebRequestHandler;
import dev.toni.course_data_assembler.gui.ProgressBar;
import dev.toni.course_data_assembler.model.Kurs;
import dev.toni.course_data_assembler.model.KursContainer;
import dev.toni.course_data_assembler.parser.HTMLParser;
import dev.toni.course_data_assembler.parser.JSONParser;

import java.io.IOException;

/**
 * Main class responsible for orchestrating the course data assembly
 * using web scraping and API requests.
 */
public class Main {
    /**
     * Main method to run the application.
     *
     * @param args command line arguments
     * @throws IOException if an I/O error occurs
     */
    public static void main(String[] args) throws IOException {

        String allCoursesResponse = WebRequestHandler.makeHttpRequest(
                "https://cloud.timeedit.net/ltu/web/schedule1/objects.html?fr=t&partajax=t&im=f&sid=3&l=sv_SE&objects=&types=28");
        String[] kursSignaturer = HTMLParser.parseAllCoursesResponse(
                allCoursesResponse).split("\n");

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium()
                    .launch(new BrowserType.LaunchOptions().setHeadless(true)
                            .setSlowMo(50));
            Page page = browser.newPage();

            KursContainer kursContainer = new KursContainer();

            ProgressBar progressBar = new ProgressBar((long) kursSignaturer.length);
            progressBar.printProgress();

            for (String kursSignatur : kursSignaturer) {
                if (kursSignatur.isEmpty()) continue;

                kursContainer.writeCsv("kurser.csv");

                page.navigate(
                        "https://cloud.timeedit.net/ltu/web/schedule1/ri1Q7.html");

                Locator selectorLocator = page.locator(
                        "xpath=//*[@id='fancytypeselector']");
                selectorLocator.selectOption(new SelectOption().setLabel("Kurs"));
                Locator searchKursElementLocator = page.locator(
                        "xpath=//*[@id='ffsearchname']");

                searchKursElementLocator.fill("\"" + kursSignatur + "\"");

                Locator searchKursButtonLocator = page.locator(
                        "xpath=/html/body/div[9]/div[1]/div[2]/div[1]/div/div/input[2]");
                searchKursButtonLocator.click();

                Locator objectBasketItemlocator = page.locator(
                        "id=objectbasketitemX0");
                String dataId = objectBasketItemlocator.getAttribute(
                        "data-idonly");
                String response = WebRequestHandler.makeHttpRequest(String.format(
                        "https://cloud.timeedit.net/ltu/web/schedule1/objects/%s/o.json?fr=t&types=28&sid=3&l=sv_SE",
                        dataId));

                Kurs kurs = JSONParser.parse(response, Kurs.class);

                Locator infoBoxLocator = page.locator("id=info0");
                infoBoxLocator.click();

                Locator visaSchemaButtonLocator = page.locator(
                        "xpath=//*[@id=\"objectbasketgo\"]");
                visaSchemaButtonLocator.click();

                String apiUrl = page.url();
                kurs.setApiUrl(apiUrl);

                kursContainer.addKurs(kurs);

                progressBar.printProgress();
                progressBar.incrementProgress();
            }

            progressBar.printProgress();

            page.context().browser().close();
            kursContainer.writeCsv("kurser.csv");
            System.out.println("\nDone!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}