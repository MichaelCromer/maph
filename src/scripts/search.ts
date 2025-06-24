import { Node } from './graph'

const API_URL = "http://localhost:3001/api";

async function search_nodes(str : string) : Promise<Node[]> {
    const endpoint = API_URL.concat(`/search?string=${str}`);

    const res = await fetch(endpoint);
    const nodes = await res.json();

    return nodes;
}

function search_results_refresh(nodes : Node[]) : void {
    const list = document.getElementById('user-search-results');

    list!.innerHTML = '';

    if (nodes.length == 0) {
        const message_empty = document.createElement('p');
        message_empty.textContent = "No results found";
        list!.appendChild(message_empty);
        return;
    }

    console.log(nodes);

    nodes.forEach((item : Node) => {
        const list_item = document.createElement('li')
        const title = document.createElement('h6');
        const body = document.createElement('p');

        title.textContent = `${item.title}`;
        body.textContent = `${item.body}`;

        list_item.appendChild(title);
        list_item.appendChild(body);

        body.toggleAttribute('hidden');

        list!.appendChild(list_item);
    });
}

const user_search = document.getElementById('user-search');

user_search!.addEventListener('change', async (e: Event) : Promise<void> => {
    const search_term = (e.target as HTMLTextAreaElement).value;
    if (search_term.length < 3) {
        return;
    }
    const nodes = await search_nodes(search_term);
    search_results_refresh(nodes);
    (e.target as HTMLTextAreaElement).blur();
});
