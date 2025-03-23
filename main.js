import van from "./van-1.5.3.min.js";

const {div, button, img, h2} = van.tags;

const links = van.state([
    {name: "Google", url: "https://www.google.com/"},
    {name: "Facebook", url: "https://www.facebook.com/"},
    {name: "X", url: "https://x.com/"},
])

const updateLinks = (func) => {
    func();
    links.val = [...links.val];
}

const normalizeUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    return url;
};

const GetFaviconUrl = (url, size = 64) => {
    const hostname = new URL(url).hostname;
    return `https://favicon.yandex.net/favicon/${hostname}`;
};

const Page = () =>
    div(
        {class: "page"},
        Navbar(),
        Content(),
    )

const Navbar = () =>
    div(
        {class: "navbar"},
        h2("Hop In!")
    )

const Content = () => div(
    {class: "content"},
    () => LinkButtons(links.val)
);

const LinkButtons = (links) => div(
    {class: "link-buttons-container"},
    links.map(LinkButton),
    AddLinkButton()
)

const AddLinkButton = () => button(
    {
        class: "link-button-body",
        onclick: PromptAddingLink
    },
    h2("+")
)

const PromptAddingLink = () => {
    const name = prompt("Enter name:");
    if (name === null) return;
    
    const url = prompt("Enter URL:");
    if (url === null) return;
    
    links.val = [...links.val, {name, url}];
}

const LinkButton = (link) => {
    return div(
        {class: "link-button"},
        LinkButtonBody(link),
        LinkMoreOptionsButton(link)
    );
};

const LinkButtonBody = (link) =>
    button(
        {class: "link-button-body", onclick: () => window.location.href = link.url},
        img({src: () => GetFaviconUrl(link.url), alt: `${link.name} icon`, class: "icon"}),
        link.name
    )

const LinkMoreOptionsButton = (link) => {
    const showMenu = van.state(false);

    return div(
        {class: "more-options-container"},
        button(
            {
                class: "more-options-button",
                onclick: (e) => {
                    e.stopPropagation();
                    showMenu.val = !showMenu.val;
                }
            },
            "⋮"
        ),
        () => showMenu.val ? OptionsMenu(link, showMenu) : div()
    );
};

const OptionsMenu = (link, showMenu) =>
    div(
        {class: "options-menu"},
        OptionsMenuItem("Rename", showMenu,
            {onclick: () => updateLinks(() => link.name = PromptForUpdateValue("Enter new name:", link.name))}),
        OptionsMenuItem("Change URL", showMenu,
            {onclick: () => updateLinks(() => link.url = normalizeUrl(PromptForUpdateValue("Enter new URL:", link.url)))}),
        OptionsMenuItem("Delete", showMenu,
            {onclick: () => links.val = links.val.filter(l => l !== link)}),
    );

const PromptForUpdateValue = (message, defaultValue) =>
    prompt(message, defaultValue) ?? defaultValue

const OptionsMenuItem = (label, showMenu, {onclick}) => {
    return button(
        {
            class: "options-menu-item",
            onclick: (e) => {
                e.stopPropagation();
                onclick();
                showMenu.val = false;
            }
        },
        label
    );
}

van.add(document.body, Page());
