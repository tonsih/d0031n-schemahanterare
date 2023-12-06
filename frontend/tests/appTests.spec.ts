import { test, expect, Locator, Page } from '@playwright/test';

const {
    BEARER_TOKEN,
    VITE_BASEURL,
    FULL_NAME,
    CANVAS_URL,
    LTU_USERNAME,
    LTU_PASSWORD,
} = process.env;

test('has correct title', async ({ page }: { page: Page }) => {
    await page.goto(VITE_BASEURL!);
    await expect(page).toHaveTitle('Schemahanterare');
});

test('warns about non-existing authcode', async ({ page }: { page: Page }) => {
    await page.goto(VITE_BASEURL!);

    const inputLocator: Locator = page.locator('#react-select-3-input');
    await inputLocator.fill('d0031n');
    await page
        .getByRole('option', {
            name: 'D0031N, Enterprise Architecture och SOA, 50% Lp1-2 Luleå, 17190-H23.k',
        })
        .click();

    await expect(page.locator('form')).toContainText(
        'Ett Authorization Token behövs för att modifiera schemat'
    );
});

test('warns about wrong authcode', async ({ page }: { page: Page }) => {
    await page.goto(VITE_BASEURL!);

    const inputLocator: Locator = page.locator('#react-select-3-input');
    await inputLocator.fill('d0031n');
    await page
        .getByRole('option', {
            name: 'D0031N, Enterprise Architecture och SOA, 50% Lp1-2 Luleå, 17190-H23.k',
        })
        .click();

    const authTokenInputLocator: Locator = page.getByPlaceholder(
        'Authorization token'
    );
    await authTokenInputLocator.click();
    await authTokenInputLocator.fill('1234');

    await expect(page.locator('form')).toContainText(
        'Det gick inte att upprätta en anslutning med den angivna auktoriseringskoden. Kontrollera koden och försök igen.'
    );
});

test('auth success', async ({ page }: { page: Page }) => {
    await page.goto(VITE_BASEURL!);

    const inputLocator: Locator = page.locator('#react-select-3-input');
    await inputLocator.fill('d0031n');
    await page
        .getByRole('option', {
            name: 'D0031N, Enterprise Architecture och SOA, 50% Lp1-2 Luleå, 17190-H23.k',
        })
        .click();

    const authTokenInputLocator: Locator = page.getByPlaceholder(
        'Authorization token'
    );
    await authTokenInputLocator.click();
    await authTokenInputLocator.fill(BEARER_TOKEN!);

    await expect(page.locator('form')).toContainText(
        'UserId: "65580" ansluten'
    );
});

test('change an existing course event', async ({ page }: { page: Page }) => {
    await page.goto(VITE_BASEURL!);

    const inputLocator: Locator = page.locator('#react-select-3-input');
    await inputLocator.fill('d0031n');
    await page
        .getByRole('option', {
            name: 'D0031N, Enterprise Architecture och SOA, 50% Lp1-2 Luleå, 17190-H23.k',
        })
        .click();

    const authTokenInputLocator: Locator = page.getByPlaceholder(
        'Authorization token'
    );
    await authTokenInputLocator.click();
    await authTokenInputLocator.fill(BEARER_TOKEN!);

    const modifyButtonLocator: Locator = page.getByRole('button', {
        name: 'Modifiera',
    });
    await modifyButtonLocator.click();

    const eventLocator: Locator = page.locator(
        'xpath=//*[@id="root"]/div/div[3]/div/div/div[2]/div/div[2]/div/table/tbody/tr/td/div/div/div/div[2]/table/tbody/tr/td[4]/div/div[2]/div/a'
    );
    await expect(eventLocator).toHaveText(
        'Lektionkl. 13:00 - 14:30(Zoom, A1301*)Ingemar AnderssonLuleå'
    );
    await eventLocator.click();

    const lektionFieldLocator: Locator = page.getByPlaceholder('Lektion');
    await lektionFieldLocator.click();
    await lektionFieldLocator.fill('Test');

    const teacherFieldLocator: Locator =
        page.getByPlaceholder('Ingemar Andersson');
    await teacherFieldLocator.click();
    await teacherFieldLocator.fill(FULL_NAME);

    const locationFieldLocator: Locator = page.getByPlaceholder('Zoom, A1301*');
    await locationFieldLocator.click();
    await locationFieldLocator.fill('Bastu');

    const descriptionFieldLocator: Locator = page.getByLabel('Beskrivning');
    await descriptionFieldLocator.click();
    await descriptionFieldLocator.fill('test');

    const saveChangesButtonLocator: Locator = page.getByRole('button', {
        name: 'Spara ändringar',
    });
    await saveChangesButtonLocator.click();

    const readyButtonLocator: Locator = page.getByRole('button', {
        name: 'Klart',
    });
    await readyButtonLocator.click();

    await expect(eventLocator).toHaveText(
        `Testkl. 13:00 - 14:30(Bastu)${FULL_NAME}`
    );
});

test('add events to schedule', async ({ page }: { page: Page }) => {
    const canvasPage: Page = await page.context().newPage();
    await canvasPage.goto(CANVAS_URL);

    const userIdFieldLocator: Locator = canvasPage.getByLabel('Användarid:');
    await userIdFieldLocator.fill(LTU_USERNAME!);

    const passwordFieldLocator: Locator = canvasPage.getByLabel('Lösenord:');
    await passwordFieldLocator.fill(LTU_PASSWORD!);

    await canvasPage.getByRole('button', { name: 'LOGGA IN' }).click();
    await canvasPage.getByRole('link', { name: 'Calendar' }).click();

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
        'UserId: "65580" ansluten'
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

    const modifyButtonLocator: Locator = appPage.getByRole('button', {
        name: 'Modifiera',
    });
    await modifyButtonLocator.click();

    let eventLocator: Locator = appPage
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

        await canvasPage.reload({ timeout: 60000 });
        eventLocator = canvasPage.getByTitle('Test', { exact: true });
        await eventLocator.click();
        const eventDetailsLocator: Locator = canvasPage.locator(
            '#event-details-trap-focus'
        );
        await expect(eventDetailsLocator).toContainText(
            `Dec 8, 10:15am - 11:45am Calendar ${FULL_NAME} Location Zoom Details Länk till LTUs webbsida: https://www.ltu.se`
        );

        eventLocator = canvasPage.getByTitle('Test2');
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
