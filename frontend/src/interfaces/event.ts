interface CalendarEvent {
    publicId?: string;
    type?: string;
    location?: string;
    teachers?: string[] | string;
    start?: Date | string;
    end?: Date | string;
    title?: string;
    description?: string;
}

export type { CalendarEvent };
