const log = console.log;

const FAC_COUNT = 37;
const FAC_SPECIAL_IDS = {
    //Craft - Order ID 0
    ARCANE_STUDY: 0,
    LABORATORY: 1,
    SACRISTY: 2,
    SANCTUARY: 3,
    SCRIPTORIUM: 4,
    SMITHY: 5,
    WORKSHOP: 6,
    //Trade - Order ID 1
    ARMORY: 7,
    STOREHOUSE: 8,
    GAMING_HALL: 9,
    STABLE: 10,
    //RECRUIT - Order ID 2
    BARRACK: 11,
    ADVENTURERS_GUILD: 12,
    BAKERS_GUILD: 13,
    BREWERS_GUILD: 14,
    MASONS_GUILD: 15,
    SHIPBUILDERS_GUILD: 16,
    THIEVES_GUILD: 17,
    MENAGERIE: 18,
    TELEPORTATION_CIRCLE: 19,
    WAR_ROOM: 20,
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
    DEMIPLANE: 31,
    MEDITATION_CHAMBER: 32,
    OBSERVATORY: 33,
    SANCTUM: 34,
    THEATER: 35,
    TRAINING_AREA: 36,
};
const FAC_SPECIAL_NAMES = Object.entries(FAC_SPECIAL_IDS).reduce((map,[name,id]) => {
    map[id] = name;
    return map;
},{})



const TOTAL_PRODS = 49;
const FAC_PROD_IDS = {
    0: {name: "ARCANE_FOCUS", description: "PH", count: 0},
    1: "BOOK",
    2: "ALCHEMIST_SUPPLIES",
    3: "CRAFT_POISON",
    4: "HOLY_WATER",
    5: "SACRED_FOCUS",
    6: "BOOK_REPLICA",
    7: "SPELL_SCROLL",
    8: "PAPERWORK",
    9: "ADVENTURING_GEAR",
    10: "MAGIC_ITEM_ARCANA",
    11: "MAGIC_ITEM_RELIC",
    12: "MAGIC_ITEM_ARMAMENT",
    13: "MAGIC_ITEM_IMPLEMENT",
    14: "STOCK_ARMORY",
    15: "TRADE_GOODS",
    16: "ANIMALS",
    17: "GAMBLING_HALL",
    18: {name: "BASTION_DEFENDERS", description: "PLACEHOLDERS"},
    19: {name: "ADVENTURERS_GUILD_ASSIGNENT", description: "PH"},
    20: {name: "BAKERS_GUILD_ASSIGNENT", description: "PH"},
    21: "BREWERS_GUILD_ASSIGNENT",
    22: "MASONS_GUILD_ASSIGNENT",
    23: "SHIPBUILDERS_GUILD_ASSIGNENT",
    24: "THIEVES_GUILD_ASSIGNENT",
    25: "CREATURE",
    26: "SPELLCASTER",
    27: "LIEUTENANTS",
    28: "SOLDIERS",
    29: "PERFUME",
    30: "CANDLES",
    31: "FOOD_RATIONS",
    32: "HEALER_KIT",
    33: "HEALING_POTION",
    34: "ANTITOXIN",
    35: "BASIC_POISON",
    36: "HEALING_HERBS",
    37: "POISON",
    38: "TALISMAN",
    39: "HELPFUL_LORE",
    40: "TOPICAL_LORE",
    41: "INFORMATION_GATHERING",
    42: "LORE",
    43: "TRINKET_TROPHY",
    44: "ARCANE_RESILIENCE",
    45: "INNER_PEACE",
    46: "ELDRITCH_DISCOVERY",
    47: "FORTIFYING_RITES",
    48: "THEATRICAL_EVENT",
    49: "TRAINING",
};

//Product Header's Mask
const HEADER_PROD_CRAFT = 1n << 63n;
const HEADER_PROD_TRADE = 1n << 62n;
const HEADER_PROD_RECRUIT = 1n << 60n;
const HEADER_PROD_HARVEST = 1n << 59n;
const HEADER_PROD_RESEARCH = 1n << 58n;
const HEADER_PROD_EMPOWER = 1n << 57n;


//Product Subtype's Mask
const COUNT_CRAFTABLES = 14n;
const COUNT_TRADEABLES = 4n;
const COUNT_RECRUITABLES = 11n;
const COUNT_HARVESTABLES = 10n;
const COUNT_RESEARCHABLES = 5n;
const COUNT_EMPOWERABLES = 6n;

const MASK_CRAFTABLES = HEADER_PROD_CRAFT | ((1n << COUNT_CRAFTABLES)-1n);
const MASK_TRADEABLES = (HEADER_PROD_TRADE | ((1n << COUNT_TRADEABLES)-1n)) << COUNT_CRAFTABLES;
const MASK_RECRUITABLES = (HEADER_PROD_RECRUIT | ((1n << COUNT_RECRUITABLES)-1n)) << (COUNT_CRAFTABLES+COUNT_TRADEABLES);
const MASK_HARVESTABLES = (HEADER_PROD_HARVEST | ((1n << COUNT_HARVESTABLES)-1n)) << (COUNT_CRAFTABLES+COUNT_TRADEABLES+COUNT_RECRUITABLES);
const MASK_RESEARCHABLES = HEADER_PROD_RESEARCH | ((1n << COUNT_RESEARCHABLES)-1n) << (COUNT_CRAFTABLES+COUNT_TRADEABLES+COUNT_RECRUITABLES+COUNT_HARVESTABLES);
const MASK_EMPOWERABLES = (HEADER_PROD_EMPOWER | ((1n << COUNT_EMPOWERABLES)-1n)) << (COUNT_CRAFTABLES+COUNT_TRADEABLES+COUNT_RECRUITABLES+COUNT_HARVESTABLES+COUNT_RESEARCHABLES);
log((1n<<39n)&MASK_RESEARCHABLES);

const FAC_SIZES = {
    0: {size: 4, name: "Cramped"},
    1: {size: 16, name: "Roomy"},
    2: {size: 32, name: "Vast"},
};

const ORDER_TYPES = {
    0: "CRAFT",
    1: "TRADE",
    2: "RECRUIT",
    3: "HARVEST",
    4: "RESEARCH",
    5: "EMPOWER",
};

const FAC_INTRINSICS = {
    name: new Uint8Array(37),
    size: new Uint8Array(37),
    hirelings: new Uint8Array(37),
    order_type: new Uint8Array(37),
    contains_prods: new BigUint64Array(37),
    //Pulling a facility by collumn takes 4 bytes, so 60 bytes left to fill the cache line.
};
// CRAFT facilities
FAC_INTRINSICS.order_type[0] = FAC_INTRINSICS.order_type[1] =
FAC_INTRINSICS.order_type[2] = FAC_INTRINSICS.order_type[3] =
FAC_INTRINSICS.order_type[4] = FAC_INTRINSICS.order_type[5] =
FAC_INTRINSICS.order_type[6] = 0;

// Initialize contains_prods for each facility type
FAC_INTRINSICS.contains_prods[0] = FAC_INTRINSICS.contains_prods[1] =
FAC_INTRINSICS.contains_prods[2] = FAC_INTRINSICS.contains_prods[3] =
FAC_INTRINSICS.contains_prods[4] = FAC_INTRINSICS.contains_prods[5] =
FAC_INTRINSICS.contains_prods[6] = MASK_CRAFTABLES;

FAC_INTRINSICS.contains_prods[7] = FAC_INTRINSICS.contains_prods[8] =
FAC_INTRINSICS.contains_prods[9] = FAC_INTRINSICS.contains_prods[10] = MASK_TRADEABLES;

FAC_INTRINSICS.contains_prods[11] = FAC_INTRINSICS.contains_prods[12] =
FAC_INTRINSICS.contains_prods[13] = FAC_INTRINSICS.contains_prods[14] =
FAC_INTRINSICS.contains_prods[15] = FAC_INTRINSICS.contains_prods[16] =
FAC_INTRINSICS.contains_prods[17] = FAC_INTRINSICS.contains_prods[18] =
FAC_INTRINSICS.contains_prods[19] = FAC_INTRINSICS.contains_prods[20] = MASK_RECRUITABLES;

FAC_INTRINSICS.contains_prods[21] = FAC_INTRINSICS.contains_prods[22] =
FAC_INTRINSICS.contains_prods[23] = FAC_INTRINSICS.contains_prods[24] =
FAC_INTRINSICS.contains_prods[25] = FAC_INTRINSICS.contains_prods[26] = MASK_HARVESTABLES;

FAC_INTRINSICS.contains_prods[27] = FAC_INTRINSICS.contains_prods[28] =
FAC_INTRINSICS.contains_prods[29] = FAC_INTRINSICS.contains_prods[30] = MASK_RESEARCHABLES;

FAC_INTRINSICS.contains_prods[31] = FAC_INTRINSICS.contains_prods[32] =
FAC_INTRINSICS.contains_prods[33] = FAC_INTRINSICS.contains_prods[34] =
FAC_INTRINSICS.contains_prods[35] = FAC_INTRINSICS.contains_prods[36] = MASK_EMPOWERABLES;

// Initialize size values
FAC_INTRINSICS.size[26] = FAC_INTRINSICS.size[32] = 0;

FAC_INTRINSICS.size[0] = FAC_INTRINSICS.size[1] =
FAC_INTRINSICS.size[2] = FAC_INTRINSICS.size[3] =
FAC_INTRINSICS.size[4] = FAC_INTRINSICS.size[5] =
FAC_INTRINSICS.size[6] = FAC_INTRINSICS.size[7] =
FAC_INTRINSICS.size[8] = FAC_INTRINSICS.size[10] =
FAC_INTRINSICS.size[11] = FAC_INTRINSICS.size[19] =
FAC_INTRINSICS.size[21] = FAC_INTRINSICS.size[22] =
FAC_INTRINSICS.size[23] = FAC_INTRINSICS.size[24] =
FAC_INTRINSICS.size[25] = FAC_INTRINSICS.size[27] =
FAC_INTRINSICS.size[28] = FAC_INTRINSICS.size[29] =
FAC_INTRINSICS.size[30] = FAC_INTRINSICS.size[33] =
FAC_INTRINSICS.size[34] = 1;

FAC_INTRINSICS.size[31] = FAC_INTRINSICS.size[9] =
FAC_INTRINSICS.size[12] = FAC_INTRINSICS.size[13] =
FAC_INTRINSICS.size[14] = FAC_INTRINSICS.size[15] =
FAC_INTRINSICS.size[16] = FAC_INTRINSICS.size[17] =
FAC_INTRINSICS.size[18] = FAC_INTRINSICS.size[35] =
FAC_INTRINSICS.size[36] = FAC_INTRINSICS.size[20] = 2;


// CRAFT facilities (order_type 0)
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.ARCANE_STUDY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.LABORATORY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.SACRISTY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.SANCTUARY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.SCRIPTORIUM] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.SMITHY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.WORKSHOP] = 0;

// TRADE facilities (order_type 1)
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.ARMORY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.STOREHOUSE] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.GAMING_HALL] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.STABLE] = 1;

// RECRUIT facilities (order_type 2)
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.BARRACK] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.ADVENTURERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.BAKERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.BREWERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.MASONS_GUILD] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.SHIPBUILDERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.THIEVES_GUILD] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.MENAGERIE] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.TELEPORTATION_CIRCLE] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.WAR_ROOM] = 2;

// HARVEST facilities (order_type 3)
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.FOOD_GARDEN] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.HERB_GARDEN] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.POISON_GARDEN] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.DECORATIVE_GARDEN] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.GREENHOUSE] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.RELIQUARY] = 3;

// RESEARCH facilities (order_type 4)
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.ARCHIVE] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.LIBRARY] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.PUB] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.TROPHY_ROOM] = 4;

// EMPOWER facilities (order_type 5)
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.DEMIPLANE] = FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.MEDITATION_CHAMBER] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.OBSERVATORY] = FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.SANCTUM] =
FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.THEATER] = FAC_INTRINSICS.order_type[FAC_SPECIAL_IDS.TRAINING_AREA] = 5;

const MAX_PLAYERS = 8;
//TODO: still work in progress here, haven't decided what to do with tihs
const PLAYERS_SCHEDULE_TABLES = {
    scheduled_orderes: new BigUint64Array(MAX_PLAYERS),
};


const PLAYER_ID_NAMES_TABLE = {
    GID: 0,
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
};

//This works for some reason, which is ridiculous.
//the empty string is mapped to 7 different values.
const PLAYERS_NAMES_ID_TABLE = {
    "": 0,
    "": 1,
    "": 2,
    "": 3,
    "": 4,
    "": 5,
    "": 6,
    "": 7,
};


const PLAYERS_INFO_FACILITY_TABLE = {
    facilities: new BigUint64Array(MAX_PLAYERS),
};

const PLAYERS_INFO_INVENTORY_TABLE = {
    items_name: new Uint8Array(TOTAL_PRODS*MAX_PLAYERS),
    items_count: new Uint8Array(TOTAL_PRODS*MAX_PLAYERS),
};




function fmsb(mask){
    let msb = 0n;
    let i = 64n;
    while (i!=0){
        if (mask>=2n**i){
            mask >>= i;
            msb += i;
            i >>= 1n;
        }else{
            i >>= 1n;
        }
    };
    return msb
};

function flsb(mask){
    let lsb = 0n;
    let max_search = 64;
    while((mask & (1n << lsb)) === 0n){
        if(max_search===0){break};
        lsb++;
        max_search--;
    };
    return lsb;
};

function addPlayer(player_name){
    const gid = PLAYER_ID_NAMES_TABLE.GID;
    if (gid >7){
        return "Max Players Capacity (8) reached";
    };
    PLAYER_ID_NAMES_TABLE[gid] = player_name;
    PLAYER_ID_NAMES_TABLE.GID++;
    PLAYERS_NAMES_ID_TABLE[player_name] = gid;
    return `Player ${player_name} registered.`
};
addPlayer("Storm")
addPlayer("Cloudstrike")
addPlayer("Octavius")
log(PLAYER_ID_NAMES_TABLE)
log(PLAYERS_NAMES_ID_TABLE)
log(PLAYER_ID_NAMES_TABLE[2])

function getFacilityOrderType(fac_id){
    const order_id = FAC_INTRINSICS.order_type[fac_id];
    return order_id;
};

function add_facility(fac_id, player_id){
    PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] |= 1n << BigInt(fac_id);
};

function remove_facility(fac_id, player_id){
    PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] &= ~(1n << BigInt(fac_id));
};


function start_order(prod_id,player_id){
    PLAYERS_SCHEDULE_TABLES.scheduled_orderes[player_id] |= (1n << BigInt(prod_id));
};

function finish_order(prod_id, player_id){
    const totals = 59;
    const id_offset = totals*player_id;
    PLAYERS_INFO_INVENTORY_TABLE.items_name[prod_id+id_offset] = prod_id;
    PLAYERS_INFO_INVENTORY_TABLE.items_count[prod_id+id_offset] += 1;
    PLAYERS_SCHEDULE_TABLES.scheduled_orderes[player_id] &= ~(1n << BigInt(prod_id));
};

function viewPlayerActiveOrders(player_id){
    const player_mask = PLAYERS_SCHEDULE_TABLES.scheduled_orderes[player_id];
    const msb = fmsb(player_mask);
    let lsb = flsb(player_mask);

    let products = [];
    while (lsb<=msb){
        if ((player_mask & (1n<<lsb))!==0n){
            products.push(FAC_PROD_IDS[lsb])
        };
        lsb++;
    };
    return products;
};


function viewPlayerInventory(player_id){
    const id_w_offset = player_id*(TOTAL_PRODS+1);
    const upper_bound = TOTAL_PRODS * (player_id+1);
    // const invs_name = PLAYERS_INFO_INVENTORY_TABLE.items_name[player_id]
    // const invs_count = PLAYERS_INFO_INVENTORY_TABLE.items_count[player_id]
    let collect_names = [];
    let collect_count = [];
    for (let i = id_w_offset; i < upper_bound; i++){
       if (PLAYERS_INFO_INVENTORY_TABLE.items_name[i] !== 0){
            const prod_name = FAC_PROD_IDS[i];
            collect_names.push(prod_name)
        };
       if (PLAYERS_INFO_INVENTORY_TABLE.items_count[i] !== 0){
            const count = PLAYERS_INFO_INVENTORY_TABLE.items_count[i];
            collect_count.push(count);
        };

    };
    console.assert(collect_names.length === collect_count.length);
    return [collect_names, collect_count];
};

function  viewPlayerFacilities(player_id){
    const facilities = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id]
    const ubound = fmsb(facilities);
    const lbound = flsb(facilities);
    let collect_fac_data = [];
    for (let i = lbound; i <= ubound; i++){
        if ((facilities & (1n<<i))!==0){
            collect_fac_data.push(FAC_SPECIAL_NAMES[i])
        };
    };
    return collect_fac_data;
};

const CMD_ADJ_LIST_TABLE = {
    root_cmds: ["@menu", "@jump"],//TODO: Decide how to deal with jump since I don't need it for the main menu.
    menu: [
        {name: "Facilities List", command: '@facilities'},
        {name: "Ongoing Orders", command: '@orders'},
        {name: "Bastion Inventory", command: '@binventory'},
        {name: "Bastion Help&Info", command: '@hni'},
    ],
    facilities: [
        {name: "Level 5", command:"@fac_lvl5"},
        {name: "Level 9", command:"@fac_lvl9"},
        {name: "Level 13", command:"@fac_lvl13"},
        {name: "Level 17", command:"@fac_lvl17"},
    ],
    fac_lvl5: [
        {name: "Arcane Study", id: 0},
        {name: "Armory", id: 7},
        {name: "Barrack", id: 11},
        {name: "Food Garden", id: 21},
        {name: "Herb Garden", id: 22},
        {name: "Poison Garden", id: 23},
        {name: "Decorative Garden", id: 24},
        {name: "Library", id: 28},
        {name: "Smithy", id: 5},
        {name: "Storehouse", id: 8},
        {name: "Workshop", id: 6}
    ],
    fac_lvl9: [
        {name: "Gaming Hall", id: 9},
        {name: "Greenhouse", id: 25},
        {name: "Laboratory", id: 1},
        {name: "Sacristy", id: 2},
        {name: "Scriptorium", id: 4},
        {name: "Stable", id: 10},
        {name: "Teleportation Circle", id: 19},
        {name: "Theater", id: 35},
        {name: "Training Area", id: 36},
        {name: "Trophy Room", id: 30}
    ],
    fac_lvl13: [
        {name: "Archive", id: 27},
        {name: "Meditation Chamber", id: 32},
        {name: "Menagerie", id: 18},
        {name: "Observatory", id: 33},
        {name: "Pub", id: 29},
        {name: "Reliquary", id: 26}
    ],
    fac_lvl17: [
        {name: "Demiplane", id: 31},
        {name: "Baker's Guild", id: 13},
        {name: "Mason's Guild", id: 15},
        {name: "Brewer's Guild", id: 14},
        {name: "Shipbuilder's Guild", id: 16},
        {name: "Adventurer's Guild", id: 12},
        {name: "Thieve's Guild", id: 17},
        {name: "Sanctum", id: 34},
        {name: "War Room", id: 20}
    ]
};



function createTable(btn_list){
    log(btn_list)
    let rows = [];
    const batched = Math.floor(btn_list.length/4);
    const idx = batched * 4;
    const remaining = btn_list % 4;
    let btn_style = `<td><a style="background-color:#8a2be2; color:white; padding:5px 10px; white-space: normal; word-wrap: break-word; border-radius:5px; text-decoration:none; display:inline-block; text-align:auto; width:80px; height:160px; margin:2px;" href="#cmd">#name</a></td>`;
    for (let i = 0; i < batched; i++) {
        const button_style_0 = btn_style
        .replace("#cmd", btn_list[(i*4)].command)
        .replace("#name",btn_list[(i*4).name]);
        const button_style_1 = btn_style
        .replace("#cmd", btn_list[(i*4)+1].command)
        .replace("#name", btn_list[(i*4)+1].name)
        const button_style_2 = btn_style
        .replace("#cmd", btn_list[(i*4)+2].command)
        .replace("#name", btn_list[(i*4)+2].name)
        const button_style_3 = btn_style
        .replace("#cmd", btn_list[(i*4)+3].command)
        .replace("#name", btn_list[(i*4)+3].name)
        const row = '<tr>'+button_style_0+button_style_1+button_style_2+button_style_3+'</tr>';
        rows.push(row);
    }
    if (remaining>0){
        for(let j = 0; j < remaining;j++){
            const button_style = btn_style
            .replace("#cmd", btn_list[j+idx].command)
            .replace("#name", btn_list[j+idx].name)
            const row = '<tr>'+button_style+'</tr>';
            rows.push(row);
        };
    };
    const jmp_btn = `<td><a style="background-color:#8a2be2; color:white; padding:5px 10px; border-radius:5px; text-decoration:none; display:inline-block; text-align:auto; width:80px; height:160px; margin:2px;" href="!bastion @jump_to">Go To...</a></td>`;
    const row = "<tr>"+jmp_btn+"</tr>"
    rows.push(row)
    return `<table style="width:100%; text-align:center;">${rows.join('')}</table>`;
};


const command = "!bastion @menu"
const menu_view = command.split(" ")[1].split("@")[1];




const table_view = createTable(CMD_ADJ_LIST_TABLE[menu_view])
log(table_view)







// log(start_order(33,0))
// log(viewPlayerActiveOrders(0))
// log(finish_order(33,0))
// log(start_order(33,0))
// log(start_order(33,0))
// log(start_order(33,0))
// log(start_order(33,0))
// log(start_order(33,0))
// log(finish_order(33,0))
// log(finish_order(33,0))
// log(finish_order(33,0))
// log(finish_order(33,0))
// log(finish_order(33,0))
// log(viewPlayerActiveOrders(0))
// let output = viewPlayerInventory(0);
// log("Item name: ", output[0]);
// log("Item count: ", output[1]);



