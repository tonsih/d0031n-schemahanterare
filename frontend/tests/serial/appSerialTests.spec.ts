import { Locator, Page, expect, test } from '@playwright/test';
import { fetchData } from '../../../utils/fetchData';

const { BEARER_TOKEN, VITE_BASEURL, USER_ID } = process.env;

import { CANVAS_BASE_URL } from '../../constants/baseURLS';
import { EVENTS_URL } from '../../constants/pathsCanvas';
import { CANVAS_PROXY_URL } from '../../constants/proxyURLS';

test('add and modify events for schedule', async ({ page }: { page: Page }) => {
    const fetchCanvasEvents = async () => {
        const eventsUrl =
            EVENTS_URL.replace(CANVAS_PROXY_URL, `${CANVAS_BASE_URL}/api/v1`) +
            `user_${USER_ID}`;
        return await fetchData(eventsUrl, {
            Authorization: `Bearer ${BEARER_TOKEN}`,
        });
    };

    await page.goto(VITE_BASEURL!);

    const inputLocator: Locator = page.locator('#react-select-3-input');
    await inputLocator.fill('d0023e');
    await page
        .getByRole('option', {
            name: 'D0023E, Forskningsmetoder inom informationssystem, 50% Lp2 Luleå, 27006-H23.k',
        })
        .click();

    const authTokenInputLocator: Locator = page.getByPlaceholder(
        'Authorization token'
    );
    await authTokenInputLocator.fill(BEARER_TOKEN!);

    const userConnectedTextLocator: Locator = page.getByText(
        `UserId: "${USER_ID}" ansluten`
    );
    await userConnectedTextLocator.waitFor();

    const utvecklarmenyLocator: Locator = page.getByText('Utvecklarmeny');
    await utvecklarmenyLocator.hover();
    const cleanCanvasCalendarLocator: Locator = page.getByRole('button', {
        name: 'Rensa Canvas kalendern',
    });
    await cleanCanvasCalendarLocator.waitFor();
    await cleanCanvasCalendarLocator.click();
    const calendarCleanSuccessNotificationLocator: Locator = page.getByText(
        'Canvas kalendern har rensats!'
    );
    await calendarCleanSuccessNotificationLocator.waitFor({
        timeout: 60000,
    });

    let fetchCanvasEventsRes = await fetchCanvasEvents();
    expect(fetchCanvasEventsRes.length).toBe(0);

    const modifyButtonLocator: Locator = page.getByRole('button', {
        name: 'Modifiera',
    });
    await modifyButtonLocator.click();

    const eventLocator = page
        .getByRole('gridcell', {
            name: 'Handledning kl. 10:15 - 11:45 (Zoom) Diana Chroneer, Jennie Gelter',
            exact: true,
        })
        .locator('a');
    await eventLocator.click();

    let typeFieldLocator: Locator = page.getByPlaceholder('Handledning');
    await typeFieldLocator.fill('Test');

    let teachersFieldLocator: Locator = page.getByPlaceholder(
        'Diana Chroneer,Jennie Gelter'
    );
    await teachersFieldLocator.fill('Jultomten, Påskharen');

    let descriptionFieldLocator: Locator = page.getByLabel('Beskrivning');
    await descriptionFieldLocator.fill(
        'Länk till LTUs webbsida: <a href="https://www.ltu.se">https://www.ltu.se</a>'
    );

    const saveChangesButtonLocator: Locator = page.getByRole('button', {
        name: 'Spara ändringar',
    });
    await saveChangesButtonLocator.click();

    const appCalendarLocator: Locator = page.locator('.fc-media-screen');

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
        await page.mouse.click(x, y);

        typeFieldLocator = page.getByPlaceholder('Föreläsning, laboration...');
        await typeFieldLocator.fill('Test2');

        teachersFieldLocator = page.getByPlaceholder(
            'Lars Larsson, Frida Svensson'
        );
        await teachersFieldLocator.fill('Elvis Presley');

        const placeFieldLocator: Locator = page.getByPlaceholder('Zoom, Rumnr');
        await placeFieldLocator.fill('bastu');

        descriptionFieldLocator = page.getByLabel('Beskrivning');
        await descriptionFieldLocator.fill('beskrivning test text');

        await saveChangesButtonLocator.click();

        const readyButtonLocator: Locator = page.getByRole('button', {
            name: 'Klart',
        });
        await readyButtonLocator.click();

        const sendToCanvasLocator: Locator = page.getByRole('button', {
            name: 'Skicka till Canvas',
        });
        await sendToCanvasLocator.click();

        const confirmSendButtonLocator: Locator = page.getByRole('button', {
            name: 'OK',
        });
        await confirmSendButtonLocator.click();

        const registrationSuccessNotificationLocator: Locator = page.getByText(
            'Schemat är nu framgångsrikt'
        );
        await registrationSuccessNotificationLocator.waitFor();

        interface CanvasEventSubset {
            title: string;
            location_name: string;
            description: string;
        }

        const checkSubset = (object, subset: CanvasEventSubset) => {
            return Object.keys(subset).every(
                key => object[key] === subset[key]
            );
        };

        const checkObjectsExist = array => {
            const object1 = {
                title: 'Test2',
                location_name: 'bastu',
                description: 'beskrivning test text',
            };

            const object2 = {
                title: 'Test',
                location_name: 'Zoom',
                description:
                    'Länk till LTUs webbsida: <a href="https://www.ltu.se">https://www.ltu.se</a>',
            };

            const existsObject1 = array.some(item =>
                checkSubset(item, object1)
            );
            const existsObject2 = array.some(item =>
                checkSubset(item, object2)
            );

            return existsObject1 && existsObject2;
        };

        fetchCanvasEventsRes = await fetchCanvasEvents();
        expect(checkObjectsExist(fetchCanvasEventsRes)).toBeTruthy;

        await utvecklarmenyLocator.hover();
        await cleanCanvasCalendarLocator.waitFor();
        await cleanCanvasCalendarLocator.click();
        await calendarCleanSuccessNotificationLocator.waitFor({
            timeout: 60000,
        });
    }
    await page.close();
});
