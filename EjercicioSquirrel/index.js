let eventTable = document.getElementById("eventTable");
let correlationTable = document.getElementById("correlationTable");

const dataUrl =
    "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(dataUrl).then((dataResponse) =>
    dataResponse.json().then((data) => {
        console.log(data);
        fillTables(data);
    })
);

function fillTables(data) {
    clearTables();
    for (let i = 1; i < data.length + 1; i++) {
        const element = data[i - 1];
        insertEventRow(i, element["events"].join(", "), element["squirrel"]);
    }
    let correlationList = getCorrelationList(data);
    for (let i = 1; i < correlationList.length + 1; i++) {
        const element = correlationList[i - 1];
        insertCorrelationRow(i, element["event"], element["correlation"]);
    }
}

function clearTables() {
    eventTable.getElementsByTagName("tbody")[0].innerHTML = "";
    correlationTable.getElementsByTagName("tbody")[0].innerHTML = "";
}

function insertEventRow(id, event, squirrel) {
    let colorSquirrel = "";
    if (squirrel) {
        colorSquirrel = "table-danger";
    }
    eventTable
        .getElementsByTagName("tbody")[0]
        .insertAdjacentHTML(
            "beforeend",
            `<tr class="d-flex ${colorSquirrel}"><th scope="row" class="col-1">${id}</th><td class="col-9">${event}</td><td class="col-2">${squirrel}</td></tr>`
        );
}

function insertCorrelationRow(id, event, correlation) {
    correlationTable
        .getElementsByTagName("tbody")[0]
        .insertAdjacentHTML(
            "beforeend",
            `<tr class="d-flex"><th scope="row" class="col-1">${id}</th><td class="col-9">${event}</td><td class="col-2">${correlation}</td></tr>`
        );
}

function getCorrelationList(data) {
    let eventData = {};
    let correlationList = [];
    let totalSquirrel = 0,
        totalNoSquirrel = 0;
    for (const day of data) {
        let events = day["events"];
        for (const event of events) {
            if (!(event in eventData))
                eventData[event] = { squirrel: 0, noSquirrel: 0 };
            eventData[event][day["squirrel"] ? "squirrel" : "noSquirrel"] += 1;
        }
        if (day["squirrel"]) {
            totalSquirrel += 1;
        } else {
            totalNoSquirrel += 1;
        }
    }
    for (const event in eventData) {
        let truePositives = eventData[event]["squirrel"];
        let trueNegatives = totalNoSquirrel - eventData[event]["noSquirrel"];
        let falsePositives = totalSquirrel - eventData[event]["squirrel"];
        let falseNegatives = eventData[event]["noSquirrel"];
        let correlation = calculateMCC(
            truePositives,
            trueNegatives,
            falsePositives,
            falseNegatives
        );
        correlationList.push({ event: event, correlation: correlation });
    }
    correlationList.sort((a, b) => (a.correlation > b.correlation ? -1 : 1));
    return correlationList;
}

function calculateMCC(
    truePositives,
    trueNegatives,
    falsePositives,
    falseNegatives
) {
    return (
        (truePositives * trueNegatives - falsePositives * falseNegatives) /
        Math.sqrt(
            (truePositives + falsePositives) *
                (truePositives + falseNegatives) *
                (trueNegatives + falseNegatives) *
                (trueNegatives + falsePositives)
        )
    );
}
