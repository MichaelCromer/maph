const API_URL = "http://localhost:3001/api";

async function fetch_nodes() {
    const endpoint = API_URL.concat("/nodes");
    const res = await fetch(endpoint);
    const nodes = await res.json();
    const section = document.getElementById('user-history');

    section.innerHTML = '';
    nodes.forEach(item => {
        const fieldset = document.createElement('fieldset'); 
        const legend = document.createElement('legend');
        const content = document.createElement('p');

        legend.textContent = `${item.title}`;
        content.textContent = `${item.body}`;

        fieldset.appendChild(legend);
        fieldset.setAttribute('data-active', 'false');

        content.toggleAttribute('hidden');
        fieldset.appendChild(content);

        section.appendChild(fieldset);
    });
}

fetch_nodes();
