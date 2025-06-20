const API_URL = "http://localhost:3001/api/data";

async function fetch_data() {
    const res = await fetch(API_URL);
    const data = await res.json();
    const section = document.getElementById('user-history');

    section.innerHTML = '';
    data.forEach(item => {
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

fetch_data();
