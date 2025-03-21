const log = console.log;


//Any name not tagged with a hireling count has 1 hirelings that it starts with.
const FAC_SPECIAL_IDS = {
    //Craft - Order ID 0
    ARCANE_STUDY: 0,
    LABORATORY: 1,
    SACRISTY: 2,
    SANCTUARY: 3, //Hirelings: 4
    SCRIPTORIUM: 4,
    SMITHY: 5, // Hirelings: 2
    WORKSHOP: 6, // Hirelings: 3
    //Trade - Order ID 1
    ARMORY: 7,
    STOREHOUSE: 8,
    GAMING_HALL: 9, // Hirelings: 4 // Vast
    STABLE: 10,
    //RECRUIT - Order ID 2
    BARRACK: 11,
    //Vast Sizes Start
    ADVENTURERS_GUILD: 12,
    BAKERS_GUILD: 13,
    BREWERS_GUILD: 14,
    MASONS_GUILD: 15,
    SHIPBUILDERS_GUILD: 16,
    THIEVES_GUILD: 17,
    //Vast Sizes End
    MENAGERIE: 18, // Hirelings: 2 // Vast
    TELEPORTATION_CIRCLE: 19,
    WAR_ROOM: 20, // Hirelings: 2 // VAST
    //Harvest - Order ID 3
    FOOD_GARDEN: 21,
    HERB_GARDEN: 22,
    POISON_GARDEN: 23,
    DECORATIVE_GARDEN: 24,
    GREENHOUSE: 25,
    RELIQUARY: 26,
    //Research - Order ID 4
    ARCHIVE: 27,
    LIBRARY: 28,
    PUB: 29,
    TROPHY_ROOM: 30,
    //Empower - Order ID 5
    DEMIPLANE: 31, //Vast
    MEDITATION_CHAMBER: 32,
    OBSERVATORY: 33,
    SANCTUM: 34,
    THEATER: 35, //Hirelings: 4 // VAST
    TRAINING_AREA: 36, //Hirelings: 4 // VAST
};
const FAC_SPECIAL_NAMES = Object.entries(FAC_SPECIAL_IDS).reduce((map, [name,id]) => {
    map[id] = name;
    return map;
}, {});

const ORDER_IDS = {
    CRAFT: 0,
    TRADE: 1,
    RECRUIT: 2,
    HARVEST: 3,
    RESEARCH: 4,
    EMPOWER: 5,
};
const ORDER_NAMES = Object.entries(ORDER_IDS).reduce((map, [name,id]) => {
    map[id] = name;
    return map;
}, {});

let PLAYER_ID = {};
const PLAYERS = {
    player_id: {},
    current_capacity: 0,
    next_available: 0,
    capacity: 8,
    players: [],

    const capacity = 5
};

const NUM_FACILITIES = 37;
const FACILITY_INTRINSICS = {
    hirelings: new Uint8Array(NUM_FACILITIES),
    size: new Uint8Array(NUM_FACILITIES),
    order: new Uint8Array(NUM_FACILITIES),
};
FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.GAMING_HALL] = FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.SANCTUARY] = 4;
FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.THEATER] = FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.TRAINING_AREA] = 4;

FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.WORKSHOP] = 3;

FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.SMITHY] = FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.MENAGERIE] = FACILITY_INTRINSICS.hirelings[FAC_SPECIAL_IDS.WAR_ROOM] = 2;


FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.DEMIPLANE] = FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.GAMING_HALL] = 32;
FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.BAKERS_GUILD] = FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.MASONS_GUILD] = 32;
FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.BREWERS_GUILD] = FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.ADVENTURERS_GUILD] = 32;
FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.SHIPBUILDERS_GUILD] = FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.THIEVES_GUILD] = 32;
FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.MENAGERIE] = FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.THEATER] = 32;
FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.TRAINING_AREA] = FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.WAR_ROOM] = 32;

FACILITY_INTRINSICS.size[FAC_SPECIAL_IDS.MEDITATION_CHAMBER] = 4;



FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.MEDITATION_CHAMBER] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.OBSERVATORY] = ORDER_IDS.EMPOWER;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.SANCTUM] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.THEATER] = ORDER_IDS.EMPOWER;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.TRAINING_AREA] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.DEMIPLANE] = ORDER_IDS.EMPOWER;

FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.ARCHIVE] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.LIBRARY] = ORDER_IDS.RESEARCH;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.TROPHY_ROOM] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.PUB] = ORDER_IDS.RESEARCH;


FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.FOOD_GARDEN] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.HERB_GARDEN] = ORDER_IDS.HARVEST;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.POISON_GARDEN] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.DECORATIVE_GARDEN] = ORDER_IDS.HARVEST;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.GREENHOUSE] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.RELIQUARY] = ORDER_IDS.HARVEST;

FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.BARRACK] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.MENAGERIE] = ORDER_IDS.RECRUIT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.TELEPORTATION_CIRCLE] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.WAR_ROOM] = ORDER_IDS.RECRUIT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.ADVENTURERS_GUILD] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.BAKERS_GUILD] = ORDER_IDS.RECRUIT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.BREWERS_GUILD] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.MASONS_GUILD] = ORDER_IDS.RECRUIT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.SHIPBUILDERS_GUILD] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.THIEVES_GUILD] = ORDER_IDS.RECRUIT;


FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.ARMORY] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.STOREHOUSE] = ORDER_IDS.TRADE;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.GAMING_HALL] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.STABLE] = ORDER_IDS.TRADE;

FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.ARCANE_STUDY] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.LABORATORY] = ORDER_IDS.CRAFT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.SACRISTY] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.SANCTUARY] = ORDER_IDS.CRAFT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.SCRIPTORIUM] = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.SMITHY] = ORDER_IDS.CRAFT;
FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS.WORKSHOP] = ORDER_IDS.CRAFT;
for (let idx = 0; idx < NUM_FACILITIES;idx++){
    if (FACILITY_INTRINSICS.hirelings[idx] === 0){
        FACILITY_INTRINSICS.hirelings[idx] = 1;
    };


    if (FACILITY_INTRINSICS.size[idx] === 0){
        FACILITY_INTRINSICS.size[idx] = 16;
    };
};

function handleNewPlayer(player_name){
    player_name = player_name.toUpperCase();
    if (PLAYERS.capacity === PLAYERS.current_capacity){
        return `Maximum capacity of ${PLAYERS.capacity} has been reached`;
    };
    for (let i = 0; i < PLAYERS.current_capacity;i++){
        if (PLAYERS.players[i] === player_name){
            return `Player ${player_name} already exists`;
        }
    }
    if (PLAYERS.current_capacity === 0 && PLAYERS.next_available === 0){
        PLAYERS.next_available = 1;
    };
    PLAYERS.players.push(player_name);
    PLAYERS.current_capacity += 1;
    PLAYERS.player_id[player_name] = PLAYERS.next_available-1;
    PLAYERS.next_available += 1;
    return PLAYERS;
};

function handleAwardGold(player_list, gold_amount){
    for (let idx = 0; idx < player_list.length; idx++){
        const player_id = PLAYERS.player_id[player_list[0]];
        PLAYERS_BASTION_TABLE[player_id] = gold_amount;
    };
    return `Players ${player_list} have all been awarded ${gold_amount}`;
};

const PLAYERS_BASTION_CRAFTING_INVENTORY = {
    MAGIC_ITEMS: [[],[],[],[],[],[],[],[]],
    CHARMS: [[],[],[],[],[],[],[],[]],
    POISONS: [[],[],[],[],[],[],[],[]],
    EXTRA: [[],[],[],[],[],[],[],[]],
};

const PLAYERS_BASTION_TRADE_INVENTORY = {
    STOCK_ARMORY: [[],[],[],[],[],[],[],[]],
    GAMBLING_HALL: [[],[],[],[],[],[],[],[]],
    ANIMALS: [[],[],[],[],[],[],[],[]],
    GOODS: [[],[],[],[],[],[],[],[]],
};

const PLAYERS_BASTION_RECRUIT_INVENTORY = {
    DEFENDERS: [[],[],[],[],[],[],[],[]],
    GUILD_ASSIGNMENTS: [[],[],[],[],[],[],[],[]],
    CREATURES: [[],[],[],[],[],[],[],[]],
    SPELLCASTER: [[],[],[],[],[],[],[],[]],
    LIEUTENANTS: [[],[],[],[],[],[],[],[]],
    SOLDIERS: [[],[],[],[],[],[],[],[]],
};


const PLAYERS_BASTION_HARVEST_INVENTORY = {
    GARDEN_GROWTH: [[],[],[],[],[],[],[],[]],
    HEALING_HERBS: [[],[],[],[],[],[],[],[]],
    POISON: [[],[],[],[],[],[],[],[]],
    TALISMAN: [[],[],[],[],[],[],[],[]],
};

const PLAYERS_BASTION_RESEARCH_INVENTORY = {
    HELPFUL_LORE: [[],[],[],[],[],[],[],[]],
    TOPICAL_LORE: [[],[],[],[],[],[],[],[]],
    INFORMATION_GATHERING: [[],[],[],[],[],[],[],[]],
    LORE: [[],[],[],[],[],[],[],[]],
    TRINKET_TROPHY: [[],[],[],[],[],[],[],[]],
};

const PLAYERS_BASTION_EMPOWER_INVENTORY = {
    ARCANE_RESILIENCE: [[],[],[],[],[],[],[],[]],
    INNER_PEACE: [[],[],[],[],[],[],[],[]],
    ELDRITCH_DISCOVERY: [[],[],[],[],[],[],[],[]],
    FORTIFYING_RITES: [[],[],[],[],[],[],[],[]],
    THEATRICAL_EVENT: [[],[],[],[],[],[],[],[]],
    TRAINING: [[],[],[],[],[],[],[],[]],
};



const PLAYERS_BASTION_TABLE = {
    player_gold: [],
    player_currently_scheduled_orders: [[],[],[],[],[],[],[],[]],
    player_facilities: [[],[],[],[],[],[],[],[]],
    player_inventory_type: [[],[],[],[],[],[],[],[]],
};


function addPlayerSpecialFacility(facility_name, player_name){
    facility_name = facility_name.toUpperCase();
    const player_id = PLAYERS.player_id[player_name.toUpperCase()];
    if (PLAYERS_BASTION_TABLE.player_facilities[player_id] == facility_name){
        return `${player_name} already owns facility ${facility_name}`;
    };
    if (facility_name in FAC_SPECIAL_IDS){
        PLAYERS_BASTION_TABLE.player_facilities[player_id].push(facility_name);
        log(`Facility ${facility_name} added to ${player_name}`);
        return
    }else{
        log(`Facility ${facility_name} does not exist`);
    };
};



const command = "!bastion ARCANE_STUDY craft arcane_focus extra Storm "
const trimmed = command.split(" ");
const fac_name = trimmed[1]
const order_type = trimmed[2]
const order_name = trimmed[3]
const order_inventory_type = trimmed[4]
const player_name = trimmed[5]
function handleOrder(fac_name, order_type, order_name, order_inventory_type, player_name){
    fac_name = fac_name.toUpperCase();
    order_type = order_type.toUpperCase();
    order_name = order_name.toUpperCase();
    order_inventory_type = order_inventory_type.toUpperCase();
    player_name = player_name.toUpperCase();


    const check_player_exists = player_name in PLAYERS.player_id;
    if(!check_player_exists){
        return `Player ${player_name} does not exist`;
    }
    const check_facility_exists = fac_name in FAC_SPECIAL_IDS;
    if(!check_facility_exists){
        return `Facility ${fac_name} does not exist`;
    };
    const player_id = PLAYERS.player_id[player_name];

    const check_player_has_facility = PLAYERS_BASTION_TABLE.player_facilities[player_id].some(player_fac_name =>
        player_fac_name === fac_name
    );
    const facility_order_id = FACILITY_INTRINSICS.order[FAC_SPECIAL_IDS[fac_name]];
    const facility_order_name = ORDER_NAMES[facility_order_id];
    const check_order_in_facility = order_type === facility_order_name;
    if(!check_order_in_facility){
        return `Facility ${fac_name} does not have order of type ${order_type}`;
    };
    if (check_player_has_facility){
        const order_id = ORDER_IDS[order_type];
        switch (order_id) {
            case 0:
                PLAYERS_BASTION_CRAFTING_INVENTORY[order_inventory_type][player_id].push(order_inventory_type);
                return `Order ${order_name} has been placed for ${player_name}`;
            case 1:
                PLAYERS_BASTION_TRADE_INVENTORY[order_inventory_type][player_id].push(order_inventory_type);
                return `Order ${order_name} has been placed for ${player_name}`;
            case 2:
                PLAYERS_BASTION_RECRUIT_INVENTORY[order_inventory_type][player_id].push(order_inventory_type);
                return `Order ${order_name} has been placed for ${player_name}`;
            case 3:
                PLAYERS_BASTION_HARVEST_INVENTORY[order_inventory_type][player_id].push(order_inventory_type);
                return `Order ${order_name} has been placed for ${player_name}`;
            case 4:
                PLAYERS_BASTION_RESEARCH_INVENTORY[order_inventory_type][player_id].push(order_inventory_type);
                return `Order ${order_name} has been placed for ${player_name}`;
            case 5:
                PLAYERS_BASTION_EMPOWER_INVENTORY[order_inventory_type][player_id].push(order_inventory_type);
                return `Order ${order_name} has been placed for ${player_name}`;
            default:

        }
    }else{
        return `Player ${player_name} does not have a facility of type ${fac_name}`;
    };


};


const commandx = "!bastion @facility text text text";
log(commandx.split("@facility")[1].trim().split(" "));

const facilities_menu_level5_display = ["Arcane Study", "Armory", "Barrack", "Garden", "Library", "Sanctuary", "Smithy", "Storehouse", "Workshop"];
const facilities_meny_levle5_command = ["add arcane_study", "add armory", "add barrack", "add garden", "add library", "add Sanctuary", "add Smithy", "add Storehouse", "add Workshop"];

const table_template = `<table style="width:100%; text-align:center;">#content</table>`;
const row_template = `<tr>#content</tr>`;
const button_template = `<td><a style="background-color:#8a2be2; color:white; padding:5px 10px; border-radius:5px; text-decoration:none; display:inline-block; width:80px; margin:2px;" href="!bastion #command">#label</a></td>`;

function create_row(row_template, buttons) {
    const rows = [];

    // Process complete pairs first
    const pairs = Math.floor(buttons.length / 2);
    for (let i = 0; i < pairs; i++) {
        const rowContent = buttons[i*2] + buttons[i*2+1];
        const row = row_template.replace("#content", rowContent);
        rows.push(row);
    }

    // Handle odd item if present
    if (buttons.length % 2 === 1) {
        // Center the last button by adding an empty cell before it
        const lastButton = buttons[buttons.length-1];
        const centeredRowContent = '<td></td>' + lastButton + '<td></td>';
        const lastRow = row_template.replace("#content", centeredRowContent);
        rows.push(lastRow);
    }

    return rows;
}

function create_table(table_template, rows){
    let idx = 0;
    let result = table_template;
    let table_content = "";
    while (idx < rows.length){
        if (idx === 0){
            table_content += rows[idx];
            idx += 4;
        }
        table_content += rows[idx];
        table_content += rows[idx-1];
        table_content += rows[idx-2];
        table_content += rows[idx-3];
        idx += 4;

    };
    result = result.replace("#content", table_content);
    return result
};

function create_button(button_template, labels, commands) {
    const buttons = [];
    for (let i = 0; i < commands.length; i += 4) {
        for (let j = 0; j < 4 && i+j < commands.length; j++) {
            const button = button_template
                .replace("#command", commands[i+j])
                .replace("#label", labels[i+j]);
            buttons.push(button);
        }
    }
    return buttons;
}

const buttons = create_button(button_template,facilities_menu_level5_display, facilities_meny_levle5_command)
const rows =create_row(row_template,buttons);
const tabled = create_table(table_template, rows);
const lastButton = buttons[buttons.length-1];
const centeredRowContent = `<td style="text-align:center" colspan="2">${lastButton}</td>`;

log(tabled)



