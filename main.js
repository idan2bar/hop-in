import van from "./van-1.5.3.min.js";

const {div, button, img, h2} = van.tags;

const DEFAULT_LINKS = [
    {name: "Google", url: "https://www.google.com/"},
    {name: "Facebook", url: "https://www.facebook.com/"},
    {name: "X", url: "https://x.com/"},
];

const loadLinks = () => {
    const links = localStorage.getItem("links");

    return links ? JSON.parse(links) : DEFAULT_LINKS;
}

const links = van.state(loadLinks());

const updateLinks = (func) => {
    func();
    links.val = [...links.val];
    localStorage.setItem('links', JSON.stringify(links.val));
}

const addLink = (name, url) => {
    links.val = [...links.val, {name, url}];
    localStorage.setItem('links', JSON.stringify(links.val));
}

const deleteLink = (link) => {
    links.val = links.val.filter(l => l !== link);
    localStorage.setItem('links', JSON.stringify(links.val));
}

const normalizeUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    return url;
};

const GetFaviconUrl = (url, size = 64) =>
    `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${size}`;

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
    div(
        {class: "icon-circle"},
        h2("+")
    ),
    "Add Link"
)

const PromptAddingLink = () => {
    const name = prompt("Enter name:");
    if (name === null) return;

    const url = prompt("Enter URL:");
    if (url === null) return;

    addLink(name, url);
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

    // Handler for clicking outside
    const closeOptionsMenu = () => {
        showMenu.val = false;
        document.removeEventListener('click', closeOptionsMenu);
    };

    // Add/remove document click listener when menu state changes
    van.derive(() => {
        if (showMenu.val) {
            // Use setTimeout to avoid immediate trigger
            setTimeout(() => document.addEventListener('click', closeOptionsMenu), 0);
        } else {
            document.removeEventListener('click', closeOptionsMenu);
        }
    });

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
        () => showMenu.val ? OptionsMenu(link) : div()
    );
};

const OptionsMenu = (link) =>
    div(
        {class: "options-menu"},
        OptionsMenuItem("Rename",
            {onclick: () => updateLinks(() => link.name = PromptForUpdateValue("Enter new name:", link.name))}),
        OptionsMenuItem("Change URL",
            {onclick: () => updateLinks(() => link.url = normalizeUrl(PromptForUpdateValue("Enter new URL:", link.url)))}),
        OptionsMenuItem("Delete",
            {onclick: () => deleteLink(link)}),
    );

const PromptForUpdateValue = (message, defaultValue) =>
    prompt(message, defaultValue) ?? defaultValue

const OptionsMenuItem = (label, {onclick}) => {
    return button(
        {
            class: "options-menu-item",
            onclick: (e) => {
                e.stopPropagation();
                onclick();
            }
        },
        label
    );
}

van.add(document.body, Page());
