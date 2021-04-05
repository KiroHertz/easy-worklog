import axios, {AxiosResponse} from "axios";
import Worklog from "../models/Worklog";
import moment from "moment";

const config = {
    auth: {
        username: "jose.lopez",
        password: "",
    },
};

export interface SearchItem {
    title: string;
    subtitle: string;
    avatarUrl: string;
    url: string;
    favourite: boolean;
}

export interface QuickSearchResult {
    id: string;
    name: string;
    viewAllTitle: string;
    items: SearchItem[];
    url: string;
}

export const searchInJira = (query: string): Promise<QuickSearchResult[]> => {
    const url = `https://jira.edataconsulting.es/rest/quicksearch/1.0/productsearch/search?q=${query}`;
    return axios.get<QuickSearchResult[]>(url, config).then((response: AxiosResponse<QuickSearchResult[]>) => response.data);
}

export const addWorklogs = async (date: Date, worklogs: Worklog[]) => {
    worklogs
        .filter((worklog: Worklog) => worklog.canBeSent())
        .map(async (worklog: Worklog) => {
            if (typeof worklog.issue !== "string") {
                const url = `https://jira.edataconsulting.es/rest/api/2/issue/${worklog.issue.subtitle}/worklog`;
                const startDate = moment(date);
                startDate.hours(Number(worklog.startTime.split(":")[0]));
                startDate.minutes(Number(worklog.startTime.split(":")[1]));
                const endDate = moment(date);
                endDate.hours(Number(worklog.endTime.split(":")[0]));
                endDate.minutes(Number(worklog.endTime.split(":")[1]));
                const data = {
                    comment: worklog.description,
                    started: startDate.format("YYYY-MM-DDTHH:SS:SSSZZ"),
                    timeSpentSeconds: endDate.diff(startDate, 'second')
                };
                const response = await axios.post(url, data, config);
                console.log(response)
            }
            return worklog;
        })
}

export const login = () => {
    const url = `https://jira.edataconsulting.es/rest/auth/1/session`;
    axios.post(url, {
        username: "jose.lopez",
        password: "",
    }).then(response => console.log(response))
        .catch(error => console.log(error))
}