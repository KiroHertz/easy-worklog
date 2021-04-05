import isEmpty from "lodash/isEmpty";

export default class Worklog {
    public startTime: string;
    public endTime: string;
    public description: string;
    public issue: string | { title: string, subtitle: string, avatarUrl: string };
    private externalId: string | null;

    constructor() {
        this.startTime = '';
        this.endTime = '';
        this.description = '';
        this.issue = '';
        this.externalId = null;
    }

    hasBeenSent() {
        return this.externalId !== null;
    }

    canBeSent() {
        return !isEmpty(this.startTime) && !isEmpty(this.endTime) && !isEmpty(this.description) && !isEmpty(this.issue) && typeof this.issue !== 'string';
    }

    static fromObject(dbObject: Worklog): Worklog {
        const newWorklog = new Worklog();
        newWorklog.startTime = dbObject.startTime;
        newWorklog.endTime = dbObject.endTime;
        newWorklog.description = dbObject.description;
        newWorklog.issue = dbObject.issue;
        newWorklog.externalId = dbObject.externalId;
        return newWorklog;
    }
}