import van from "./van-1.5.3.min.js";

const { div, button } = van.tags;
const { state, add } = van;

const count = state(0);

const Counter = () =>
    div(
        { class: "counter" },
        "Count: ", count,
        button({ onclick: () => ++count.val }, "Increment")
    );

add(document.body, Counter());
