import { test, expect, Locator, Page } from '@playwright/test';

const {
    BEARER_TOKEN,
    VITE_BASEURL,
    FULL_NAME,
    CANVAS_URL,
    LTU_USERNAME,
    LTU_PASSWORD,
    USER_ID,
} = process.env;

test('add events to schedule', async ({ page }: { page: Page }) => {
    const appPage: Page = await page.context().newPage();
    await appPage.goto(VITE_BASEURL!);

    const inputLocator: Locator = appPage.locator('#react-select-3-input');
    await inputLocator.fill('d0023e');
    await appPage
        .getByRole('option', {
            name: 'D0023E, Forskningsmetoder inom informationssystem, 50% Lp2 Luleå, 27006-H23.k',
        })
        .click();

    const authTokenInputLocator: Locator = appPage.getByPlaceholder(
        'Authorization token'
    );
    await authTokenInputLocator.fill(BEARER_TOKEN!);

    const userConnectedTextLocator: Locator = appPage.getByText(
        `UserId: "${USER_ID}" ansluten`
    );
    await userConnectedTextLocator.waitFor();

    const utvecklarmenuLocator: Locator = appPage.getByText('Utvecklarmenu');
    await utvecklarmenuLocator.hover();
    const cleanCanvasCalendarLocator: Locator = appPage.getByRole('button', {
        name: 'Rensa Canvas kalendern',
    });
    await cleanCanvasCalendarLocator.waitFor();
    await cleanCanvasCalendarLocator.click();
    const calendarCleanSuccessNotificationLocator: Locator = appPage.getByText(
        'Canvas kalendern har rensats!'
    );
    await calendarCleanSuccessNotificationLocator.waitFor({
        timeout: 60000,
    });

    const canvasPage: Page = await page.context().newPage();
    await canvasPage.goto(CANVAS_URL);

    const userIdFieldLocator: Locator = canvasPage.getByLabel('Användarid:');
    await userIdFieldLocator.fill(LTU_USERNAME!);

    const passwordFieldLocator: Locator = canvasPage.getByLabel('Lösenord:');
    await passwordFieldLocator.fill(LTU_PASSWORD!);

    await canvasPage.getByRole('button', { name: 'LOGGA IN' }).click();
    await canvasPage.getByRole('link', { name: 'Calendar' }).click();

    let eventLocator: Locator = page.getByTitle('Test', { exact: true });
    await expect(eventLocator).toHaveCount(0);

    eventLocator = page.getByTitle('Test2', { exact: true });
    await expect(eventLocator).toHaveCount(0);

    const modifyButtonLocator: Locator = appPage.getByRole('button', {
        name: 'Modifiera',
    });
    await modifyButtonLocator.click();

    eventLocator = appPage
        .getByRole('gridcell', {
            name: 'Handledning kl. 10:15 - 11:45 (Zoom) Diana Chroneer, Jennie Gelter',
            exact: true,
        })
        .locator('a');
    await eventLocator.click();

    let typeFieldLocator: Locator = appPage.getByPlaceholder('Handledning');
    await typeFieldLocator.fill('Test');

    let teachersFieldLocator: Locator = appPage.getByPlaceholder(
        'Diana Chroneer,Jennie Gelter'
    );
    await teachersFieldLocator.fill('Jultomten, Påskharen');

    let descriptionFieldLocator: Locator = appPage.getByLabel('Beskrivning');
    await descriptionFieldLocator.fill(
        'Länk till LTUs webbsida: <a href="https://www.ltu.se">https://www.ltu.se</a>'
    );

    const saveChangesButtonLocator: Locator = appPage.getByRole('button', {
        name: 'Spara ändringar',
    });
    await saveChangesButtonLocator.click();

    const appCalendarLocator: Locator = appPage.locator('.fc-media-screen');

    interface BoundingBox {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    const boundingBox: BoundingBox | null =
        await appCalendarLocator.boundingBox();

    const x: number | undefined = boundingBox?.x
        ? boundingBox?.x + 180
        : undefined;
    const y: number | undefined = boundingBox?.y
        ? boundingBox?.y + 180
        : undefined;
    if (x && y) {
        await appPage.mouse.click(x, y);

        typeFieldLocator = appPage.getByPlaceholder(
            'Föreläsning, laboration...'
        );
        await typeFieldLocator.fill('Test2');

        teachersFieldLocator = appPage.getByPlaceholder(
            'Lars Larsson, Frida Svensson'
        );
        await teachersFieldLocator.fill('Elvis Presley');

        const placeFieldLocator: Locator =
            appPage.getByPlaceholder('Zoom, Rumnr');
        await placeFieldLocator.fill('bastu');

        descriptionFieldLocator = appPage.getByLabel('Beskrivning');
        await descriptionFieldLocator.fill('beskrivning test text');

        // saveChangesButtonLocator = appPage.getByRole('button', {
        //     name: 'Spara ändringar',
        // });
        await saveChangesButtonLocator.click();

        const readyButtonLocator: Locator = appPage.getByRole('button', {
            name: 'Klart',
        });
        await readyButtonLocator.click();

        const sendToCanvasLocator: Locator = appPage.getByRole('button', {
            name: 'Skicka till Canvas',
        });
        await sendToCanvasLocator.click();

        const confirmSendButtonLocator: Locator = appPage.getByRole('button', {
            name: 'OK',
        });
        await confirmSendButtonLocator.click();

        const registrationSuccessNotificationLocator: Locator =
            appPage.getByText('Schemat är nu framgångsrikt');
        await registrationSuccessNotificationLocator.waitFor();

        await canvasPage.reload();
        eventLocator = canvasPage.getByTitle('Test', { exact: true });
        await eventLocator.click();
        const eventDetailsLocator: Locator = canvasPage.locator(
            '#event-details-trap-focus'
        );
        await expect(eventDetailsLocator).toContainText(
            `Dec 8, 10:15am - 11:45am Calendar ${FULL_NAME} Location Zoom Details Länk till LTUs webbsida: https://www.ltu.se`
        );

        eventLocator = canvasPage.getByTitle('Test2', { exact: true });
        await eventLocator.click();
        await expect(eventDetailsLocator).toContainText(
            `Dec 4, 8:15am - 9:45am Calendar ${FULL_NAME} Location bastu Details beskrivning test text`
        );

        await utvecklarmenuLocator.hover();
        await cleanCanvasCalendarLocator.waitFor();
        await cleanCanvasCalendarLocator.click();
        await calendarCleanSuccessNotificationLocator.waitFor({
            timeout: 60000,
        });
    }
    await appPage.close();
    await canvasPage.close();
});
