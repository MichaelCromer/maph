/*======================================================================================
 *  SECTION DATA TYPES
 *--------------------------------------------------------------------------------------
 *
 *
 */


/*--------------------------------------------------------------------------------------
 *  SUBSECTION JSON
 */


interface JSON_Object
{
    [key : string] : any
}


function JSON_parse<Type>(data: JSON_Object, key: string, fallback: Type): Type
{
    return (typeof data[key] === typeof fallback) ? data[key] : fallback;
}


/*--------------------------------------------------------------------------------------
 *  SUBSECTION VERTEX
 */


type VertexID = number;
type Vertex = {
    type : VertexID,
    title : string,
    body : string,
    edges : VertexID[],
};


function vertex_parse(json_vertex: JSON_Object): Vertex
{
    return {
        type : JSON_parse<number>(json_vertex, "type", -1),
        title : JSON_parse<string>(json_vertex, "title", "Vertex Title Not Found"),
        body : JSON_parse<string>(json_vertex, "body", "Vertex body not found"),
        edges : JSON_parse<number[]>(json_vertex, "edges", []),
    };
}


/*--------------------------------------------------------------------------------------
 *  SUBSECTION GRAPH
 */


class Graph
{
    vertices: Record<number, Vertex>;

    constructor(vertices: Record<number, Vertex> = {}) {
        this.vertices = { ...vertices };
    }

    vertex_append(id: number, vertex: Vertex): void {
        this.vertices[id] = vertex;
    }

    vertex_get(id: VertexID): Vertex | undefined {
        return this.vertices[id];
    }

    vertices_get(ids: VertexID[]): Vertex[] {
        return ids
            .map((id) => this.vertices[id])
            .filter((x) => typeof x !== "undefined");
    }

    union_soft(g: Graph): void {
        this.vertices = { ...g.vertices, ...this.vertices };
    }

    union_hard(g: Graph): void {
        this.vertices = { ...this.vertices, ...g.vertices };
    }
}


function graph_parse(json_vertices: JSON_Object[]) : Graph 
{
    const graph = new Graph();

    for (const json_vertex of json_vertices) {
        const id = JSON_parse<number>(json_vertex, "id", -1);
        if (id === -1) { continue; }
        const vertex = vertex_parse(json_vertex);
        graph.vertex_append(id, vertex);
    }

    return graph;
}




/*======================================================================================
 *  SECTION GLOBAL DATA
 *--------------------------------------------------------------------------------------
 *
 *
 */


/*--------------------------------------------------------------------------------------
 *  SUBSECTION PROGRAM DATA
 */


const API_URL = "http://localhost:3001/api";


/*--------------------------------------------------------------------------------------
 *  SUBSECTION PAGE DATA
 */


const html_user_search = document.getElementById('user-search');
const html_user_search_results = document.getElementById('user-search-results');


/*--------------------------------------------------------------------------------------
 *  SUBSECTION USER DATA
 */


const user_graph: Graph = new Graph();
const user_search: VertexID[] = [];
const user_history: VertexID[] = [];
const user_current: VertexID = -1;




/*======================================================================================
 *  SECTION FUNCTIONS
 *--------------------------------------------------------------------------------------
 *
 *
 */


async function search_vertices(str: string): Promise<JSON_Object[]> {
    const endpoint_vertices = API_URL.concat(`/search?string=${str}`);

    const res = await fetch(endpoint_vertices);
    const data: JSON_Object[] = await res.json();

    return data;
}

function search_results_refresh(vertex_ids: VertexID[]): void {
    html_user_search_results!.innerHTML = '';

    if (vertex_ids.length == 0) {
        const message_empty = document.createElement('p');
        message_empty.textContent = "No results found";
        html_user_search_results!.appendChild(message_empty);
        return;
    }

    const vertices: Vertex[] = user_graph.vertices_get(vertex_ids);

    vertices.forEach((item: Vertex) => {
        const list_item = document.createElement('li')
        const title = document.createElement('h6');
        const body = document.createElement('p');

        title.textContent = `${item.title}`;
        body.textContent = `${item.body}`;

        list_item.appendChild(title);
        list_item.appendChild(body);

        body.toggleAttribute('hidden');

        html_user_search_results!.appendChild(list_item);
    });
}


/*--------------------------------------------------------------------------------------
 *  SUBSECTION EVENTS
 */


async function event_user_search(e: Event): Promise<void>
{
    const search_term = (e.target as HTMLTextAreaElement).value;
    if (search_term.length < 3) { return; }

    const json_data = await search_vertices(search_term);
    const search_graph = graph_parse(json_data);

    user_graph.union_hard(search_graph);
    search_results_refresh(json_data.map(x => x.id));

    (e.target as HTMLTextAreaElement).blur();
}




/*======================================================================================
 *  SECTION MAIN
 *--------------------------------------------------------------------------------------
 *
 *
 */


html_user_search!.addEventListener('change', event_user_search);
