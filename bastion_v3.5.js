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

const FACILITIES_LIST_VIEW = 0;
const ORDERS_VIEW_ONGOING = 1;
const INVENTORY_LIST = 2;
const HELP_LIST = 3;

const MENU_MAIN = {
    main: {
        title: "Bastion Main Menu",
        buttons: [
            {label:"Facilities List", command: FACILITIES_LIST_VIEW},
            {label:"Ongoing Orders", command: ORDERS_VIEW_ONGOING},
            {label:"Bastion Inventory", command: INVENTORY_LIST},
            {label:"Bastion Help&Info", command: HELP_LIST},
        ],
    },
    jump_menu: {
        title: "Jump To...",
        buttons : [
        ],
    },
};


const FACILITIES_LIST_LEVEL_5 = 5;
const FACILITIES_LIST_LEVEL_9 = 6;
const FACILITIES_LIST_LEVEL_13 = 7;
const FACILITIES_LIST_LEVEL_17 = 8;

const MENU_FAC_LIST_VIEW = {
    FACILITIES_LIST_VIEW: {
        title: "Bastion Facilities Lists By Level",
        buttons : [
            {label:"Lvl 5 Facilities", command: FACILITIES_LIST_LEVEL_5},
            {label:"Lvl 9 Facilities", command: FACILITIES_LIST_LEVEL_9},
            {label:"Lvl 13 Facilities", command: FACILITIES_LIST_LEVEL_13},
            {label:"Lvl 17 Facilities", command: FACILITIES_LIST_LEVEL_17},
        ],
    },

};


const MENU_FAC_LIST_LEVEL_5 = {
    facilities_list_level5:{
        title: "Select Two Level 5 Facilities",
        buttons : [
            {label:"Arcane Study", command: FAC_SPECIAL_IDS.ARCANE_STUDY},
            {label:"Armory", command: FAC_SPECIAL_IDS.ARMORY},
            {label:"Barrack", command: FAC_SPECIAL_IDS.BARRACK},
            {label:"Food Garden", command: FAC_SPECIAL_IDS.FOOD_GARDEN},
            {label:"Herb Garden", command: FAC_SPECIAL_IDS.HERB_GARDEN},
            {label:"Poison Garden", command: FAC_SPECIAL_IDS.POISON_GARDEN},
            {label:"Decorative Garden", command: FAC_SPECIAL_IDS.DECORATIVE_GARDEN},
            {label:"Library", command: FAC_SPECIAL_IDS.LIBRARY},
            {label:"Smithy", command: FAC_SPECIAL_IDS.SMITHY},
            {label:"Storehouse", command: FAC_SPECIAL_IDS.STOREHOUSE},
            {label:"Workshop", command: FAC_SPECIAL_IDS.WORKSHOP},
        ],
    },
};
const MENU_FAC_LIST_LEVEL_9 = {
    facilities_list_level9:{
        title: "Select Two Level 9 Facilities",
        buttons : [
            {label:"Gaming Hall", command: FAC_SPECIAL_IDS.GAMING_HALL},
            {label:"Greenhouse", command: FAC_SPECIAL_IDS.GREENHOUSE},
            {label:"Laboratory", command: FAC_SPECIAL_IDS.LABORATORY},
            {label:"Sacristy", command: FAC_SPECIAL_IDS.SACRISTY},
            {label:"Scriptorium", command: FAC_SPECIAL_IDS.SCRIPTORIUM},
            {label:"Stable", command: FAC_SPECIAL_IDS.STABLE},
            {label:"Teleportation Circle", command: FAC_SPECIAL_IDS.TELEPORTATION_CIRCLE},
            {label:"Theater", command: FAC_SPECIAL_IDS.THEATER},
            {label:"Training Area", command: FAC_SPECIAL_IDS.TRAINING_AREA},
            {label:"Trophy Room", command: FAC_SPECIAL_IDS.TROPHY_ROOM},
        ],
    },
};

const MENU_FAC_LIST_LEVEL_13 = {
    facilities_list_level13:{
        title: "Select Two Level 13 Facilities",
        buttons : [
            {label:"Archive", command: FAC_SPECIAL_IDS.ARCHIVE},
            {label:"Meditation Chamber", command: FAC_SPECIAL_IDS.MEDITATION_CHAMBER},
            {label:"Menagerie", command: FAC_SPECIAL_IDS.MENAGERIE},
            {label:"Observatory", command: FAC_SPECIAL_IDS.OBSERVATORY},
            {label:"Pub", command: FAC_SPECIAL_IDS.PUB},
            {label:"Reliquary", command: FAC_SPECIAL_IDS.RELIQUARY},
        ],
    },
};
const MENU_FAC_LIST_LEVEL_17 = {
    facilities_list_level17:{
        title: "Select Two Level 17 Facilities",
        buttons : [
            {label:"Demiplane", command: FAC_SPECIAL_IDS.DEMIPLANE},
            {label:"Baker's Guild", command: FAC_SPECIAL_IDS.BAKERS_GUILD},
            {label:"Mason's Guild", command: FAC_SPECIAL_IDS.MASONS_GUILD},
            {label:"Brewer's Guild", command: FAC_SPECIAL_IDS.BREWERS_GUILD},
            {label:"Shipbuilder's Guild", command: FAC_SPECIAL_IDS.SHIPBUILDERS_GUILD},
            {label:"Adventurer's Guild", command: FAC_SPECIAL_IDS.ADVENTURERS_GUILD},
            {label:"Thieve's Guild", command: FAC_SPECIAL_IDS.THIEVES_GUILD},
            {label:"Sanctum", command: FAC_SPECIAL_IDS.SANCTUM},
            {label:"War Room", command: FAC_SPECIAL_IDS.WAR_ROOM},
        ],
    },
};


const BASTION_INPUT_COMMANDS_TABLE = {
    command_id: new Uint8Array(64),
};



const TOTAL_PRODS = 58;
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
    10: "ARCANE_STUDY_CHARM",
    11: "OBSERVATORY_CHARM",
    12: "RELIQUARY_CHARM",
    13: "SANCTUM_CHARM",
    14: "MAGIC_ITEM_ARCANA",
    15: "MAGIC_ITEM_RELIC",
    16: "MAGIC_ITEM_ARMAMENT",
    17: "MAGIC_ITEM_IMPLEMENT",
    19: "STOCK_ARMORY",
    20: "TRADE_GOODS",
    21: "GAMBLING_HALL",
    23: {name: "BASTION_DEFENDERS", description: "PLACEHOLDERS"},
    24: {name: "ADVENTURERS_GUILD_ASSIGNENT", description: "PH"},
    25: {name: "BAKERS_GUILD_ASSIGNENT", description: "PH"},
    26: "BREWERS_GUILD_ASSIGNENT",
    27: "MASONS_GUILD_ASSIGNENT",
    28: "SHIPBUILDERS_GUILD_ASSIGNENT",
    29: "THIEVES_GUILD_ASSIGNENT",
    30: "CREATURE",
    31: "SPELLCASTER",
    32: "LIEUTENANTS",
    33: "SOLDIERS",
    35: "PERFUME",
    36: "CANDLES",
    37: "FOOD_RATIONS",
    38: "HEALER_KIT",
    39: "HEALING_POTION",
    40: "ANTITOXIN",
    41: "BASIC_POISON",
    42: "HEALING_HERBS",
    43: "POISON",
    44: "TALISMAN",
    46: "HELPFUL_LORE",
    47: "TOPICAL_LORE",
    48: "INFORMATION_GATHERING",
    49: "LORE",
    50: "TRINKET_TROPHY",
    52: "ARCANE_RESILIENCE",
    53: "INNER_PEACE",
    54: "ELDRITCH_DISCOVERY",
    55: "FORTIFYING_RITES",
    56: "THEATRICAL_EVENT",
    57: "TRAINING",
};

const PROD_HEADER_IDS = {
    18: "CRAFT",
    22: "TRADE",
    34: "RECRUIT",
    45: "RECRUIT",
    51: "RESEARCH",
    58: "EMPOWER",
};


//Table Bit Headers
const prod_table_mask = (1n << 65n)-1n;

//Mask of all Craftables
const HEADER_PROD_CRAFT = 1n << 18n;
const CRAFTABLES = HEADER_PROD_CRAFT-1n;
const MASK_CRAFTABLES = HEADER_PROD_CRAFT | CRAFTABLES;

//Mask of all Tradeables
const HEADER_PROD_TRADE = 1n << 22n;
const TRADABLES = HEADER_PROD_TRADE-1n & ~(HEADER_PROD_CRAFT-1n|HEADER_PROD_CRAFT);
const MASK_TRADEABLES = HEADER_PROD_TRADE | TRADABLES;

//Mask of all Recruitables
const HEADER_PROD_RECRUIT = 1n << 34n;
const RECRUITABLES = HEADER_PROD_RECRUIT-1n & ~(HEADER_PROD_TRADE-1n|HEADER_PROD_TRADE);
const MASK_RECRUITABLES = HEADER_PROD_RECRUIT | RECRUITABLES;






//Mask of all Harvestables
const HEADER_PROD_HARVEST = 1n << 45n;
const HARVESTABLES = (HEADER_PROD_HARVEST-1n) & ~(HEADER_PROD_RECRUIT-1n|HEADER_PROD_RECRUIT);
const MASK_HARVESTABLES = HEADER_PROD_HARVEST | HARVESTABLES;

//Mask of all Reserachables
const HEADER_PROD_RESEARCH = 1n << 51n;
const RESEARCHABLES = (HEADER_PROD_RESEARCH-1n) & ~(HEADER_PROD_HARVEST-1n|HEADER_PROD_HARVEST);
const MASK_RESEARCHABLES = HEADER_PROD_RESEARCH | RESEARCHABLES;

//Mask of all Empowerables
const HEADER_PROD_EMPOWER = 1n << 58n;
const EMPOWERABLES = (HEADER_PROD_EMPOWER-1n) & ~(HEADER_PROD_RESEARCH-1n|HEADER_PROD_RESEARCH);
const MASK_EMPOWERABLES = HEADER_PROD_EMPOWER | EMPOWERABLES;



const FAC_SIZES = {
    0: {size: 4, name: "Cramped"},
    1: {size: 16, name: "Roomy"},
    2: {size: 32, name: "Vast"},
};

// const ORDER_IDS ={
//     0: "CRAFT",
//     1: "TRADE",
//     2: "RECRUIT",
//     3: "HARVEST",
//     4: "RESEARCH",
//     5: "EMPOWER",
// };

const FAC_INTRINSICS = {
    name: new Uint8Array(37),
    size: new Uint8Array(37),
    hirelings: new Uint8Array(37),
    contains_prods: new BigUint64Array(37),
    //Pulling a facility by collumn takes 4 bytes, so 60 bytes left to fill the cache line.
};
FAC_INTRINSICS.contains_prods[0] = FAC_INTRINSICS.contains_prods[1] = FAC_INTRINSICS.contains_prods[2] = FAC_INTRINSICS.contains_prods[3] = FAC_INTRINSICS.contains_prods[4] = FAC_INTRINSICS.contains_prods[5] = FAC_INTRINSICS.contains_prods[6] = MASK_CRAFTABLES;
FAC_INTRINSICS.contains_prods[7] = FAC_INTRINSICS.contains_prods[8] = FAC_INTRINSICS.contains_prods[9] = FAC_INTRINSICS.contains_prods[10] =  MASK_TRADEABLES;
FAC_INTRINSICS.contains_prods[11] = FAC_INTRINSICS.contains_prods[12] = FAC_INTRINSICS.contains_prods[13] = FAC_INTRINSICS.contains_prods[14] = FAC_INTRINSICS.contains_prods[15] = FAC_INTRINSICS.contains_prods[16] = MASK_RECRUITABLES;
FAC_INTRINSICS.contains_prods[17] = FAC_INTRINSICS.contains_prods[18] = FAC_INTRINSICS.contains_prods[19] = FAC_INTRINSICS.contains_prods[20] = MASK_RECRUITABLES;
FAC_INTRINSICS.contains_prods[21] = FAC_INTRINSICS.contains_prods[22] = FAC_INTRINSICS.contains_prods[23] = FAC_INTRINSICS.contains_prods[24] = FAC_INTRINSICS.contains_prods[25] = FAC_INTRINSICS.contains_prods[26] = MASK_HARVESTABLES;
FAC_INTRINSICS.contains_prods[27] = FAC_INTRINSICS.contains_prods[28] = FAC_INTRINSICS.contains_prods[29] = FAC_INTRINSICS.contains_prods[30] = MASK_RESEARCHABLES;
FAC_INTRINSICS.contains_prods[31] = FAC_INTRINSICS.contains_prods[32] = FAC_INTRINSICS.contains_prods[33] = FAC_INTRINSICS.contains_prods[34] = FAC_INTRINSICS.contains_prods[35] = FAC_INTRINSICS.contains_prods[36] = MASK_EMPOWERABLES;

FAC_INTRINSICS.size[26] = FAC_INTRINSICS.size[32] = 0;

FAC_INTRINSICS.size[0] = FAC_INTRINSICS.size[1] = FAC_INTRINSICS.size[2] = FAC_INTRINSICS.size[3] = FAC_INTRINSICS.size[4] = FAC_INTRINSICS.size[5] = 1;
FAC_INTRINSICS.size[6] = FAC_INTRINSICS.size[7] = FAC_INTRINSICS.size[8] = FAC_INTRINSICS.size[10] = FAC_INTRINSICS.size[11] = FAC_INTRINSICS.size[19] = 1;
FAC_INTRINSICS.size[21] = FAC_INTRINSICS.size[22] = FAC_INTRINSICS.size[23] = FAC_INTRINSICS.size[24] = FAC_INTRINSICS.size[25] = FAC_INTRINSICS.size[27] = FAC_INTRINSICS.size[28] = 1;
FAC_INTRINSICS.size[29] = FAC_INTRINSICS.size[30] = FAC_INTRINSICS.size[33] = FAC_INTRINSICS.size[34] = 1;

FAC_INTRINSICS.size[31] = FAC_INTRINSICS.size[9] = 2;
FAC_INTRINSICS.size[12] = FAC_INTRINSICS.size[13] = FAC_INTRINSICS.size[14] = FAC_INTRINSICS.size[15] = FAC_INTRINSICS.size[16] = FAC_INTRINSICS.size[17] = 2;
FAC_INTRINSICS.size[18] = FAC_INTRINSICS.size[35] = FAC_INTRINSICS.size[36] = FAC_INTRINSICS.size[20] = 2;



const MAX_PLAYERS = 8;
const PLAYERS_SCHEDULE_TABLES = {
    scheduled_orderes: new BigUint64Array(MAX_PLAYERS),
};


let gid = 0;
const PLAYER_ID_NAMES_TABLE = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
};
let PLAYERS_NAMES_ID_TABLE = Object.entries(PLAYER_ID_NAMES_TABLE).reduce((map,[id,name]) => {
    map[name] = id;
    return map;
},{});

function update_name_ids_table(){
    PLAYERS_NAMES_ID_TABLE = Object.entries(PLAYER_ID_NAMES_TABLE).reduce((map,[id,name]) => {
        map[name] = id;
        return map;
    },{});
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
    if (gid >7){
        return "Max Players Capacity (8) reached";
    };
    PLAYER_ID_NAMES_TABLE[gid] = player_name;
    gid += 1;
    update_name_ids_table();
    return `Player ${player_name} registered.`
};
addPlayer("Storm")
addPlayer("Cloudstrike")
addPlayer("Octavius")

function getFacilityOrderType(fac_id){
    const msb = Number(fmsb(FAC_INTRINSICS.contains_prods[fac_id]));
    return PROD_HEADER_IDS[msb];
};

function add_facility(fac_id, player_id){
    PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] |= 1n << fac_id;
};

function remove_facility(fac_id, player_id){
    PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] &= ~(1n << fac_id);
};


function start_order(prod_id,player_id){
    PLAYERS_SCHEDULE_TABLES.scheduled_orderes[player_id] |= (1n << prod_id);
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
        if ((facilities & (1n<<i))!==0n){
            collect_fac_data.push(FAC_SPECIAL_NAMES[i])
        };
    };
    return collect_fac_data;
};


function createButton(data, cmd_wrapper) {
    const compile_wrapper = cmd_wrapper.replace("#cmd_id", data.command);
    return `<td><a style="background-color:#8a2be2; color:white; padding:5px 10px; border-radius:5px; text-decoration:none; display:inline-block; text-align:auto; width:80px; height:160px; margin:2px;" href="${compile_wrapper}">${data.label}</a></td>`;

}

function createRows(buttonData,cmd_wrapper) {
    let rows = [];
    for (let i = 0; i < buttonData.length; i += 2) {
        let row = '<tr>';
        row += createButton(buttonData[i],cmd_wrapper);
        if (i + 1 < buttonData.length) {
            row += createButton(buttonData[i + 1],cmd_wrapper);
        }
        row += '</tr>';
        rows.push(row);
    }
    return rows;
}


function createTable(btn_list, cmd_wrapper){
    const rows = createRows(btn_list, cmd_wrapper)
    return `<table style="width:100%; text-align:center;">${rows.join('')}</table>`;
};


const CMD_WRAPPERS = {
    facilities: "@facilities #cmd_id",
    menu: "@menu #cmd_id",
    add: "@add #cmd_id",
};

const main_menu_table = createTable(MENU_MAIN.main.buttons,CMD_WRAPPERS.menu);
const main_menu_title = MENU_FAC_LIST_VIEW.FACILITIES_LIST_VIEW.title;

const menu_fac_list_table = createTable(MENU_FAC_LIST_VIEW.FACILITIES_LIST_VIEW.buttons,CMD_WRAPPERS.facilities);
const menu_fac_list_title = MENU_FAC_LIST_VIEW.FACILITIES_LIST_VIEW.title;


const menu_fac_list_lvl5 = createTable(MENU_FAC_LIST_LEVEL_5.facilities_list_level5.buttons, CMD_WRAPPERS.add);
const menu_fac_list_lvl5_t =
log(menu_fac_list_table)
