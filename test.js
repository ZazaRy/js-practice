const log = console.log;
const width = 1750;
const height = 850;
const stride = 35


const cell_adj_graph = (() => {
    let entries = {}

    for (let y = 0; y < width; y+=35){
        for (let x = 0; x < height; x+=35){
            entries[`${y},${x}`] = {
                neighbours: [],
                entities: [],
            }
        }
    }
    return entries
})()

const new_player_pos = ["105,105", 3]
const start_top = 105-70
const start_left = 105-70
const end_top = 105+70
const end_left = 105+70
const fireball = "140,140"

const start = [`${start_left},${start_top}`]
const end = [`${end_left},${end_top}`]


for (let y = start_left; y <=end_left; y+=stride){
    for (let x = start_top; x < end_top; x+=stride){
        cell_adj_graph[new_player_pos[0]].neighbours.push(`${y},${x}`);
        cell_adj_graph[`${y},${x}`].entities.push(new_player_pos[1]);
    }
}

cell_adj_graph[new_player_pos[0]].entities.push(new_player_pos[1])
log(cell_adj_graph[new_player_pos[0]])

log(cell_adj_graph[fireball].entities)
