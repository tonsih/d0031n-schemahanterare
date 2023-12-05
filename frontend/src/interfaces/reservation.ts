interface Reservation {
    id: string;
    tempId: string;
    startdate: string;
    starttime: string;
    enddate: string;
    endtime: string;
    columns: string[];
    description?: string;
}

export type { Reservation };
