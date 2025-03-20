import van from "./van-1.5.3.min.js";

const { div, button, img, h2 } = van.tags;
const { add } = van;

const links = [
    { name: "Google", url: "https://www.google.com/" },
    { name: "Facebook", url: "https://www.facebook.com/" },
    { name: "X", url: "https://x.com/" },
]

const GetFaviconUrl = (url, size=64) =>
    `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${size}`;

const Page = () =>
    div(
        { class: "page" },
        Navbar(),
        Content(),
    )

const Navbar = () =>
    div(
        { class: "navbar" },
        h2("Hop In!")
    )

const Content = () => div(
    { class: "content" },
    LinkButtons()
);

const LinkButtons = () => div(
    { class: "link-buttons-container" },
    links.map(({ name, url }) =>
        LinkButton(name, url)
    )
)

const LinkButton = (name, url) => {
    return div(
        {class: "link-button"},
        LinkButtonBody(url, name),
        LinkMoreOptionsButton()
    );
}

const LinkButtonBody = (url, name) =>
    button(
        {class: "link-button-body", onclick: () => window.location.href = url},
        img({src: GetFaviconUrl(url), alt: `${name} icon`, class: "icon"}),
        name
    )

const LinkMoreOptionsButton = () =>
    button(
        {
            class: "more-options-button",
            onclick: (e) => {
                e.stopPropagation();
                alert('More options clicked');
            }
        },
        "⋮"
    )

add(document.body, Page());
