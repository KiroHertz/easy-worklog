import Worklog from "../models/Worklog";
import {FunctionComponent, PropsWithChildren} from "react";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import round from "lodash/round";
import {ProgressBar} from "primereact/progressbar";
import {existRangeCollisions} from "../services/worklog.service";

interface WorkProgressBarProps {
    worklogs: Worklog[];
}

const WorkProgressBar: FunctionComponent<WorkProgressBarProps> = (props: PropsWithChildren<WorkProgressBarProps>) => {

    function getPercentage(): number {
        const workedTimeInMinutes = props.worklogs
            .filter((value: Worklog) => !isEmpty(value.startTime) && !isEmpty(value.endTime))
            .reduce((previousValue: number, currentElement: Worklog) => {
                const startTime = moment(currentElement.startTime, "HH:mm");
                const endTime = moment(currentElement.endTime, "HH:mm");
                if (endTime.isBefore(startTime)) {
                    return previousValue;
                }
                return previousValue + endTime.diff(startTime, "minutes");
            }, 0);

        return round((workedTimeInMinutes * 100) / 480, 2);
    }

    return <ProgressBar value={getPercentage()} color={existRangeCollisions(props.worklogs) ? '#FBC02D' : ''}/>
}

export default WorkProgressBar;