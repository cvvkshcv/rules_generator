const modeldata = {
    "data": [
        [
            {"key": "amount", "condition": ">", "value": "$1000"},
            {"key": "order", "condition": "in", "value": ["TV", "Cot"]},
            {"key": "tenure", "condition": ">", "value": "3 Months"},
            {"key": "tenure", "condition": ">", "value": "3 Months"},
            {"key": "tenure", "condition": ">", "value": "3 Months"},
            {"key": "customer's zip code", "condition": "==", "value": "6000028"}
        ],
        [
            {"key": "amount", "condition": ">", "value": "$1000"}
        ]
    ]
};

fetch('https://run.mocky.io/v3/37b4807e-e44c-4ec5-b6a6-6133d904ed7c')
    .then(res => res.json())
    .then(res => {
        const app = new App(res.data);
    });

