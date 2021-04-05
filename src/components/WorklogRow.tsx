import Worklog from "../models/Worklog";
import {ChangeEvent, useState} from "react";
import {QuickSearchResult, searchInJira, SearchItem} from "../services/jira.service";
import {InputText} from "primereact/inputtext";
import {AutoComplete, CompleteMethodParams} from "primereact/autocomplete";

const WorklogRow = (props: { worklog: Worklog, onChange: Function }) => {

    const [suggestions, setSuggestions] = useState<SearchItem[]>([]);

    const {startTime, endTime, description, issue} = props.worklog;

    const {onChange} = props;

    function itemTemplate(item: SearchItem) {
        return <span>{`${item.subtitle} - ${item.title}`}</span>;
    }

    return <div className="row">
        <div className="col-sm-6 col-md-2 col-lg-1 p-1">
            <input
                type="time"
                className="input-time"
                value={startTime}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onChange("startTime", event.target.value)
                }
                step="300"
            />
        </div>
        <div className="col-sm-6 col-md-2 col-lg-1 p-1">
            <input
                type="time"
                className="input-time"
                value={endTime}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onChange("endTime", event.target.value)
                }
                step="300"
            />
        </div>
        <div className="col-sm-12 col-md-5 col-lg-7 p-1">
            <InputText
                placeholder="Description"
                value={description}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onChange("description", event.target.value)
                }
            />
        </div>
        <div className="col-sm-12 col-md-3 col-lg-3 p-1">
            <AutoComplete
                placeholder="Issue"
                value={issue}
                onChange={(e: { originalEvent: Event, value: any, target: { name: string, id: string, value: any } }) => {
                    setSuggestions([]);
                    onChange("issue", e.target.value)
                }
                }
                suggestions={suggestions}
                field="subtitle"
                completeMethod={(e: CompleteMethodParams) =>
                    searchInJira(e.query)
                        .then((searchResults: QuickSearchResult[]) =>
                            setSuggestions(searchResults[0].items)
                        )
                }
                tooltip={(issue as any).title}
                tooltipOptions={{showDelay: 500}}
                itemTemplate={itemTemplate}
            />
        </div>
    </div>
};

export default WorklogRow;