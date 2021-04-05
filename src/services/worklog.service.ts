import Worklog from "../models/Worklog";
import isEmpty from "lodash/isEmpty";
import moment from "moment";


export const existRangeCollisions = (worklogs: Worklog[]): boolean => {
    if (worklogs.length < 1) return false;

    const sortedWorklogs = sortWorklogsByStartTime(worklogs);

    const worklogWithStartAndEndTime = sortedWorklogs.filter(worklog => !isEmpty(worklog.startTime) && !isEmpty(worklog.endTime));
    for (let i = 0; i < worklogWithStartAndEndTime.length - 1; i++) {
        const currentEndTime = moment(worklogWithStartAndEndTime[i].endTime, "HH:mm");
        const nextStartTime = moment(worklogWithStartAndEndTime[i + 1].startTime, "HH:mm");

        if (currentEndTime.isAfter(nextStartTime)) {
            return true;
        }
    }

    return false;
}

export const sortWorklogsByStartTime = (worklogs: Worklog[]): Worklog[] => {
    const worklogsWithoutStartTime = worklogs.filter(worklog => isEmpty(worklog.startTime));
    const worklogsWithStartTimeSortedByStartTime = worklogs.filter(worklog => !isEmpty(worklog.startTime)).sort((a: Worklog, b: Worklog) => {
        const startTime1 = moment(a.startTime, "HH:mm");
        const startTime2 = moment(b.startTime, "HH:mm");
        return startTime1.isBefore(startTime2) ? -1 : 1;
    })

    return [...worklogsWithStartTimeSortedByStartTime, ...worklogsWithoutStartTime];
}