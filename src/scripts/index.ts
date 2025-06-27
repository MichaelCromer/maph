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
type Vertex =
{
    type : VertexID,
    title : string,
    body : string,
    edges : VertexID[],
};


function vertex_parse(data: JSON_Object): Vertex
{
    return {
        type : JSON_parse<number>(data, "type", -1),
        title : JSON_parse<string>(data, "title", "Vertex Title Not Found"),
        body : JSON_parse<string>(data, "body", "Vertex body not found"),
        edges : JSON_parse<number[]>(data, "edges", []),
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

    union_soft(g: Graph): void {
        this.vertices = { ...g.vertices, ...this.vertices };
    }

    union_hard(g: Graph): void {
        this.vertices = { ...this.vertices, ...g.vertices };
    }

    vertex(id: VertexID): Vertex | undefined {
        return this.vertices[id];
    }
}


function graph_parse(data_vertices: JSON_Object[]) : Graph 
{
    const graph = new Graph();

    for (const data_vertex of data_vertices) {
        const id = JSON_parse<number>(data_vertex, "id", -1);
        if (id === -1) { continue; }
        const vertex = vertex_parse(data_vertex);
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




/*--------------------------------------------------------------------------------------
 *  SUBSECTION USER DATA
 */


const user_graph : Graph = new Graph();
const user_search : VertexID[] = [];




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

function search_results_refresh(vertices: Vertex[]): void {
    const list = document.getElementById('user-search-results');

    list!.innerHTML = '';

    if (vertices.length == 0) {
        const message_empty = document.createElement('p');
        message_empty.textContent = "No results found";
        list!.appendChild(message_empty);
        return;
    }

    console.log(vertices);

    vertices.forEach((item: Vertex) => {
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



/*--------------------------------------------------------------------------------------
 *  SUBSECTION EVENTS
 */


async function event_user_search(e: Event): Promise<void>
{
    const search_term = (e.target as HTMLTextAreaElement).value;
    if (search_term.length < 3) { return; }

    const json_data = await search_vertices(search_term);
    const search_graph = graph_parse(json_data);

    console.log(`User graph was ${user_graph}`);
    console.log(`Search results are ${search_graph}`);
    user_graph.union_hard(search_graph);
    console.log(`User graph is now ${user_graph}`);

    //search_results_refresh(search_graph);

    (e.target as HTMLTextAreaElement).blur();
}




/*======================================================================================
 *  SECTION MAIN
 *--------------------------------------------------------------------------------------
 *
 *
 */


html_user_search!.addEventListener('change', event_user_search);


