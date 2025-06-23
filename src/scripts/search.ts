const API_URL = "http://localhost:3001/api";

async function nodes_search(s: string) {
    const endpoint = API_URL.concat(`/search?string=${s}`);

    const res = await fetch(endpoint);
    const nodes = await res.json();

    return nodes;
}

function refresh_search_results(nodes) {
    const list = document.getElementById('user-search-results');

    list.innerHTML = '';

    if (nodes.length == 0) {
        const message_empty = document.createElement('p');
        message_empty.textContent = "No results found";
        list.appendChild(message_empty);
        return;
    }

    console.log(nodes);

    nodes.forEach(item => {
        const list_item = document.createElement('li')
        const title = document.createElement('h6');
        const body = document.createElement('p');

        title.textContent = `${item.title}`;
        body.textContent = `${item.body}`;

        list_item.appendChild(title);
        list_item.appendChild(body);

        body.toggleAttribute('hidden');

        list.appendChild(list_item);
    });
}

const user_search = document.getElementById('user-search');

user_search.addEventListener('change', async (e: Event) => {
    const nodes = await nodes_search((e.target as HTMLTextAreaElement).value);
    refresh_search_results(nodes);
});
