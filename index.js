
let wellFlowArray = [
    {
        date: 1702261800000,
        wellFlowSize: 11,
    },
    {
        date: 1702263600000,
        wellFlowSize: 2,
    },
    {
        date: 1702267200000,
        wellFlowSize: 9,
    },
    {
        date: 1702270800000,
        wellFlowSize: 10,
    },
    {
        date: 1702274400000,
        wellFlowSize: 4,
    },
];

let endDayWellFlowSize =  {
    date: 1702339200000,
    wellFlowSize: 110,
};

let xValues = wellFlowArray.map((point) => point.date);
let traces1Y =  wellFlowArray.map((point) => point.wellFlowSize);

let layout = {
    title: 'Скважина 1.1',
    template: 'plotly_dark',
    xaxis: {
        tickformat: '%-I:%M',
        type: 'date',
        autorange: false,
        range: [1702252800000-3000000, 1702339200000+3000000],
        tickvals: [1702252800000, 1702260000000, 1702267200000, 1702274400000, 1702281600000, 1702288800000, 1702296000000, 1702303200000, 1702310400000, 1702317600000, 1702324800000, 1702332000000, 1702339200000 ],
        ticktext: ['11 дек.', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '12 дек.' ],

    },
    yaxis: {
        autorange: false,
        range: [-5, 125],
        tickvals: [0, 20, 40, 60, 80, 100, 120],
        ticktext: ['0 тыс.м<sup>3  ', '20 тыс.м<sup>3  ', '40 тыс.м<sup>3  ','60 тыс.м<sup>3  ','80 тыс.м<sup>3  ','100 тыс.м<sup>3  ','120 тыс.м<sup>3  '],
    },
    showlegend: true,
    displayModeBar: false,
    legend: {
        x: 0.15,
        y: -0.08,
        orientation: "h"
    },
    cliponaxis: false,
    shapes: [{
        fillcolor: '#2683cc',
        opacity: 0.1,
        zIndex: -100,
        x0: 1702252800000,
        x1: 1702339200000,
        y0: 0,
        y1: 100,
        xref: 'x',
        line: {
            color: 'blue',
            width: 0,
        }
    }]
};

let config = {
    displayModeBar: false,
    responsive: true,
};

let traces3Y = [];
traces1Y.reduce((previousValue, currentValue, index) => {
    traces3Y.push((index === 0) ? previousValue : previousValue + currentValue);
    return (index === 0) ? previousValue : previousValue + currentValue
}, traces1Y[0]);

console.log("traces3Y", traces3Y);

function setTraces(wellFlowArray, endDayWellFlowSize) {
    let xValues = wellFlowArray.map((point) => point.date);
    let traces1Y =  wellFlowArray.map((point) => point.wellFlowSize);

    let traces3Y = [];
    traces1Y.reduce((previousValue, currentValue, index) => {
        traces3Y.push((index === 0) ? previousValue : previousValue + currentValue);
        return (index === 0) ? previousValue : previousValue + currentValue
    }, traces1Y[0]);
    return [
        {
            x: xValues,
            y: traces1Y,
            name: "Добыто (час)",
            type: 'bar',
            opacity: 1,
            width: [1667677, 1667677, 1667677, 1667677, 1667677, 1667677, 1667677],
            marker: {color: '#31b300'},
        },
        {
            x: xValues,
            y: traces3Y,
            name: "Добыто (сутки)",
            type: 'scatter',
            mode: 'lines',
            marker: {color: '#cd00cd'},
        },
        {
            x: [ xValues[traces3Y.length-1], endDayWellFlowSize.date ],
            y:  [traces3Y[traces3Y.length-1], 110],
            name: "Прогноз добычи",
            type: 'scatter',
            mode: 'lines+text',
            line: {
                dash: 'dot',
                width: 4
            },
            marker: {color: '#e69a0d', size: 14},
            text: [ traces3Y[traces3Y.length-1], endDayWellFlowSize.wellFlowSize],
            textposition: 'top center',
            textfont: {
                x: 1,
                family:  'Raleway, sans-serif'
            },
        },
        {
            x: [ 1702252800000, 1702339200000 ],
            y: [100, 100],
            name: "План добычи",
            type: 'scatter',
            marker: {
                color: '#6CB4EE',
                opacity: 0.1,
            },
        },
    ]
}

const tester = document.getElementById('tester');
Plotly.newPlot(tester, setTraces(wellFlowArray, endDayWellFlowSize), layout, config);

const modal = document.getElementById("modal-one");

const addWellButton = document.getElementById("wellFlow");
addWellButton.addEventListener('click', function (event) {
    event.preventDefault();
    modal.classList.add('open');
});

const closeButton = document.querySelector(".close");
closeButton.addEventListener('click', function (event) {
    event.preventDefault();
    modal.classList.remove('open');
})

document.getElementById('submit').addEventListener("click", setValue);

function binSearch(arr, toFind) {
    if (!arr) return -1;
    var first = 0;
    var last = arr.length - 1;
    while (first < last) {
        var mid = first + Math.floor((last - first) / 2);
        if (arr[mid].date >= toFind.date) last = mid;
        else first = mid + 1;
    }
    if (arr[last] == toFind || last == 0 || last == arr.length - 1)
        return last;
    else
        return last - 1;
}

function setValue(event){
    event.preventDefault();
    const wellFlowPoint = document.getElementById('wellFlowPoint').value;
    const wellFlowTime = document.getElementById('wellFlowTime').value;
    const [h, m] = wellFlowTime.split(":");

    const ms = new Date("2023-12-11").getTime() + ((+h * 60 + +m) * 60 * 1000);

    let newArray = [...wellFlowArray];

    let currentWellFlow = {
        date: ms,
        wellFlowSize: +wellFlowPoint
    };

    const hasWellFlowArrayIndex = wellFlowArray.findIndex(item => item.date === ms);

    if (hasWellFlowArrayIndex > 0) {
        newArray[hasWellFlowArrayIndex] = currentWellFlow;
    } else {
        const index = binSearch(wellFlowArray, currentWellFlow)

        if (index === -1) return;

        if (index === 0) {
            newArray.unshift(currentWellFlow);
        } else if (index === wellFlowArray.length-1) {
            newArray.push(currentWellFlow)
        } else {
            console.log("else");
            newArray.splice(index, 0, currentWellFlow);
        }

        console.log("wellFlowArray after", newArray);
    }
    wellFlowArray = [...newArray];

    tester.innerHTML = "";
    console.log(document.getElementById('tester'));
    const newTest = document.getElementById('tester');
    console.log(newTest);

    Plotly.newPlot(tester,
        setTraces(newArray, endDayWellFlowSize),
        layout,
        {
            displayModeBar: false,
            responsive: true,
        }
    );
}

const changPlanModal = document.getElementById("modal-plan");

const changePlanButton = document.getElementById("plan");
changePlanButton.addEventListener('click', function (event) {
    event.preventDefault();
    changPlanModal.classList.add('open');
});

const closePlanButton = document.querySelector(".close-plan");
closePlanButton.addEventListener('click', function (event) {
    event.preventDefault();
    changPlanModal.classList.remove('open');
})

document.getElementById('submit_plan').addEventListener("click", setPlan);

function setPlan(event){
    event.preventDefault();
    console.log("setPlan");
    const weightWellFlow = +document.getElementById('input_plan').value;
    const planTime = document.getElementById('planTime').value;
    const [h, m] = planTime.split(":");

    const ms = new Date("2023-12-11").getTime() + ((+h * 60 + +m) * 60 * 1000);

    endDayWellFlowSize =  {
        date: ms,
        wellFlowSize: weightWellFlow,
    };
    console.log("endDayWellFlowSize", endDayWellFlowSize);
    Plotly.newPlot(tester,
        setTraces(wellFlowArray, endDayWellFlowSize),
        layout,
        {
            displayModeBar: false,
            responsive: true,
        }
    );
}