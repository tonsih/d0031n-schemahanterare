import { Locator, Page, expect, test } from '@playwright/test';

const { BEARER_TOKEN, VITE_BASEURL, FULL_NAME } = process.env;

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
