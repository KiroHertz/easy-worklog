import Dexie from 'dexie';
import Worklog from "../models/Worklog";

export interface WorkDay {
    date: string;
    worklogs: Worklog[];
}

class WorklogDatabase extends Dexie {
    public worklogs: Dexie.Table<WorkDay, string>;

    public constructor() {
        super("WorklogDatabase");
        this.version(1).stores({
            worklogs: "date,worklogs"
        });
        this.worklogs = this.table("worklogs");
    }
}

const db = new WorklogDatabase();

export default db;