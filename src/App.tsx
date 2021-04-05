import {useEffect, useState} from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import isUndefined from "lodash/isUndefined";
import {Button} from "primereact/button";
import './App.css';
import Worklog from "./models/Worklog";
import {Calendar} from "primereact/calendar";
import {addWorklogs} from "./services/jira.service";
import db, {WorkDay} from "./services/db.service";
import {existRangeCollisions, sortWorklogsByStartTime} from "./services/worklog.service";
import WorkProgressBar from "./components/WorkProgressBar";
import WorklogRow from "./components/WorklogRow";
import {InputText} from "primereact/inputtext";

function App() {
    const [worklogs, setWorklogs] = useState<Worklog[]>([new Worklog()]);

    const [date, setDate] = useState<Date | Date[]>(() => {
        const storedDate: string | null = localStorage.getItem("date");
        if (storedDate) {
            return new Date(storedDate);
        }

        return new Date();
    });

    useEffect(() => {

        const keypressHandler = (event: any) => {
            if (event.code === "Comma") {
                setWorklogs((previousState: Worklog[]) => [
                    ...previousState,
                    new Worklog(),
                ]);
            }
            if (event.code === "KeyS" && event.ctrlKey && event.shiftKey) {
                setWorklogs(sortWorklogsByStartTime(worklogs));
            }
        };

        const keydownHandler = (event: any) => {
            if (event.code === "ArrowLeft") {
                setDate((previousDate: Date | Date[]) => moment(previousDate instanceof Array ? previousDate[0] : previousDate).subtract(1, "day").toDate())
            }
            if (event.code === "ArrowRight") {
                setDate((previousDate: Date | Date[]) => moment(previousDate instanceof Array ? previousDate[0] : previousDate).add(1, "day").toDate())
            }
        }

        window.addEventListener("keypress", keypressHandler);
        window.addEventListener("keydown", keydownHandler);

        return () => {
            window.removeEventListener("keypress", keypressHandler);
            window.removeEventListener("keydown", keydownHandler);
        }

    }, [worklogs]);

    useEffect(() => {
        if (date) {
            const key = Array.isArray(date) ? date[0] : date;
            window.localStorage.setItem("date", moment(key).format("YYYY-MM-DD") + 'T00:00:00Z');
            db.worklogs.get(moment(key).format("DD/MM/YYYY")).then((workday: WorkDay | undefined) => {
                if (!isUndefined(workday)) {
                    const work = !isEmpty(workday.worklogs) ? workday?.worklogs.map((worklog: Worklog) => Worklog.fromObject(worklog)) : [];
                    setWorklogs(work);
                } else {
                    setWorklogs([new Worklog()]);
                }
            })
        }
    }, [date]);


    useEffect(() => {
        const getObjectToSave = () => {
            const key = Array.isArray(date) ? date[0] : date;
            return {
                date: moment(key).format("DD/MM/YYYY"),
                worklogs: worklogs
            }
        }

        db.worklogs.put(getObjectToSave()).catch((error: any) => console.log("Error", error));

    }, [date, worklogs]);

    function updateField(index: number, field: string, value: string) {
        const updatedWorklogs: Worklog[] = [...worklogs];
        set(updatedWorklogs[index], field, value);
        setWorklogs(updatedWorklogs);
    }

    return (
        <>
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="d-flex flex-column container-fluid p-2">
                                <div className="row">
                                    <div className="col-sm-12 col-md-2 p-1">
                                        <Calendar
                                            value={date}
                                            onChange={(e: { originalEvent: Event, value: Date | Date[], target: { name: string, id: string, value: Date | Date[] } }) => {
                                                setDate(e.value)
                                            }}
                                            showIcon
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-1 p-1">
                                        <InputText type="text" />
                                    </div>
                                    <div className="col-sm-12 col-md-1 p-1">
                                        <InputText type="password"/>
                                    </div>
                                </div>
                                {worklogs.map(
                                    (worklog: Worklog, index) => <WorklogRow key={index} worklog={worklog}
                                                                             onChange={(field: string, value: string) => updateField(index, field, value)}/>
                                )}
                                <div className="row">
                                    <div className="col-sm-12 p-1">
                                        <WorkProgressBar worklogs={worklogs}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 p-1">
                                        <Button
                                            onClick={() => addWorklogs(Array.isArray(date) ? date[0] : date, worklogs)}
                                            disabled={!worklogs.every((worklog: Worklog) => worklog.canBeSent()) || existRangeCollisions(worklogs)}>Send</Button>
                                        <Button className="ml-2"
                                                onClick={() => setWorklogs((previousState: Worklog[]) => [
                                                    ...previousState,
                                                    new Worklog(),
                                                ])}>Add</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default App;
