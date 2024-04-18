package dev.toni.course_data_assembler.gui;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a progress bar that visually indicates the progress of a lengthy
 * for writing course data to a file. The progress bar is updated in the console
 *  and shows changes in percentage completed.
 */
@Getter
@Setter
@AllArgsConstructor
public class ProgressBar {
    private Long total;
    private Long completed;
    private int lastPrintedPercentage;
    private boolean initialPrint;

    /**
     * Constructs a ProgressBar with the specified total number of operations.
     * Sets the initial number of completed operations to zero and prepares
     * the progress bar for initial use.
     *
     * @param total the total number of steps to complete
     */
    public ProgressBar(Long total) {
        this.total = total;
        this.completed = 0L;
        this.initialPrint = true;
    }

    /**
     * Prints the current progress to the console. This method checks if there
     * is a change in the percentage completed before updating to minimize the
     * number of updates. Initial and subsequent updates alter the output
     * format.
     */
    public void printProgress() {
        if (initialPrint) {
            System.out.println("Writing course data to ../db/kurser.csv");
            initialPrint = false;
        }

        int width = 50;
        int currentPercentage = (int) (completed * 100 / total);

        if (currentPercentage != lastPrintedPercentage) {
            lastPrintedPercentage = currentPercentage;
            System.out.print("\r[");
            int progress = (int) (completed * width / total);
            for (int i = 0; i < width; i++) {
                if (i < progress) {
                    System.out.print("#");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.print("] " + currentPercentage + "% ");
        }
    }

    /**
     * Increments the count of completed operations by one. Typically called
     * whenever an operation represented by the progress bar is completed.
     */
    public void incrementProgress() {
        completed += 1;
    }
}