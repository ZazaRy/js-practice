const log = console.log;


const Facility_Errors = {
    FacilityDoesNotExist: "Error: Facility does not exist",
};

const Crafting_Errors = {
    CraftingItemNotInTable: "Error: Crafting item is not in required table",
};


const FAC_BASIC = ["Bedroom","Dining_Room","Parlor","Courtyard","Kitchen","Storage"];


const FAC_NAME_SIZE_PAIRS = {
    cramped:  4,
    roomy:    16,
    vast:     36,
};

const FAC_BASIC_TABLE = {
    space:            ["cramped", "roomy", "vast"],
    cost:             [500,1000,3000],
    time_required:    [20,45,125],
};


const FAC_ENLARGE_TABLE = {
    space_increase: ["cramped_to_roomy","roomy_to_vast"],
    cost:           [500,2000],
    time_required:  [25,80],
};

const FAC_SPECIAL_LEVEL_REQ_TABLE = {
    level:                      [5,9,13,17],
    special_facilities_count:   [2,4,5,6],
};



const FAC_SPECIAL_IDS = {
    ARCANE_STUDY: 0,
    ARMORY: 1,
    BARRACK: 2,
    DECORATIVE_GARDEN: 3,
    FOOD_GARDEN: 4,
    HERB_GARDEN: 5,
    POISON_GARDEN: 6,
    LIBRARY: 7,
    SANCTUARY: 8,
    SMITHY: 9,
    STOREHOUSE: 10,
    WORKSHOP: 11,
    GAMING_HALL: 12,
    GREENHOUSE: 13,
    LABORATORY: 14,
    SACRISTY: 15,
    SCRIPTORIUM: 16,
    STABLE: 17,
    TELEPORTATION_CIRCLE: 18,
    THEATER: 19,
    TRAINING_AREA: 20,
    TROPHY_ROOM: 21,
    ARCHIVE: 22,
    MEDITATION_CHAMBER: 23,
    MENAGERIE: 24,
    OBSERVATORY: 25,
    PUB: 26,
    RELIQUARY: 27,
    DEMIPLANE: 28,
    GUILDHALL: 29,
    SANCTUM: 30,
    WAR_ROOM: 31,
};
const FAC_SPECIAL_NAMES = Object.entries(FAC_SPECIAL_IDS).reduce((map, [name,id]) => {
    map[id] = name;
    return map;
}, {});





const FAC_SPECIAL_PREREQ_IDS = {
    0: "ARCANE_FOCUS",
    1: "SPELLCASTING_FOCUS",
    2: "HOLY_SYMBOL",
    3: "DRUIDIC_FOCUS",
    4: "SKILL_EXPERTIES",
    5: "FIGHTING_STYLE",
    6: "UNARMORED_DEFENSE",
};

const FAC_SPECIAL_ORDER_TYPE_IDS = {
    0: "CRAFT",
    1: "TRADE",
    2: "RECRUIT",
    3: "HARVEST",
    4: "RESEARCH",
    5: "EMPOWER",
};
const FAC_SPECIAL_ORDER_NAMES = Object.entries(FAC_SPECIAL_ORDER_TYPE_IDS).reduce((map, [id,name]) => {
    map[name] = parseInt(id);
    return map;
}, {});
log("Order names: ", FAC_SPECIAL_ORDER_NAMES["CRAFT"]);


const FS_ORDER_NAME_TABLE = new Uint8Array(41);

FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.ARCANE_STUDY] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.SANCTUARY] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.SMITHY] = FAC_SPECIAL_ORDER_NAMES["CRAFT"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.WORKSHOP] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.LABORATORY] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.SANCTUARY] = FAC_SPECIAL_ORDER_NAMES["CRAFT"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.SCRIPTORIUM] = FAC_SPECIAL_ORDER_NAMES["CRAFT"];

FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.ARMORY] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.STOREHOUSE] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_ORDER_TYPE_IDS.GAMING_HALL] = FAC_SPECIAL_ORDER_NAMES["TRADE"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.STABLE] = FAC_SPECIAL_ORDER_NAMES["TRADE"];

FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.BARRACK] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.TELEPORTATION_CIRCLE] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_ORDER_TYPE_IDS.MENAGERIE] = FAC_SPECIAL_ORDER_NAMES["RECRUIT"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.WAR_ROOM] = FAC_SPECIAL_ORDER_NAMES["RECRUIT"];


FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.FOOD_GARDEN] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.HERB_GARDEN] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.POISON_GARDEN] = FAC_SPECIAL_ORDER_NAMES["HARVEST"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.DECORATIVE_GARDEN] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.GREENHOUSE] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.RELIQUARY] = FAC_SPECIAL_ORDER_NAMES["HARVEST"];


FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.LIBRARY] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.TROPHY_ROOM] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.ARCHIVE] = FAC_SPECIAL_ORDER_NAMES["RESEARCH"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.PUB] = FAC_SPECIAL_ORDER_NAMES["RESEARCH"];

FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.THEATER] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.TRAINING_AREA] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.MEDITATION_CHAMBER] = FAC_SPECIAL_ORDER_NAMES["EMPOWER"];
FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.OBSERVATORY] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.DEMIPLANE] = FS_ORDER_NAME_TABLE[FAC_SPECIAL_IDS.SANCTUM] = FAC_SPECIAL_ORDER_NAMES["EMPOWER"];



const A_FOCUS_S_FOCUS = ["ARCANE_FOCUS","SPELLCASTING_FOCUS"];
const H_FOCUS_D_FOCUS = ["HOLY_SYMBOL", "DRUIDIC_FOCUS"];
let FAC_PREREQS = new Array(11);
const mod_prereqs_offset = FAC_PREREQS.length;
//Modulo 11 is the smallest prime that hold all relationships true in here.
FAC_PREREQS[FAC_SPECIAL_IDS.ARCANE_STUDY%mod_prereqs_offset] = FAC_PREREQS[FAC_SPECIAL_IDS.DEMIPLANE%mod_prereqs_offset] = A_FOCUS_S_FOCUS;
FAC_PREREQS[FAC_SPECIAL_IDS.SANCTUARY%mod_prereqs_offset] = FAC_PREREQS[FAC_SPECIAL_IDS.SACRISTY%mod_prereqs_offset] = H_FOCUS_D_FOCUS;
FAC_PREREQS[FAC_SPECIAL_IDS.RELIQUARY%mod_prereqs_offset] = FAC_PREREQS[FAC_SPECIAL_IDS.SANCTUM%mod_prereqs_offset] = H_FOCUS_D_FOCUS;
FAC_PREREQS[FAC_SPECIAL_IDS.OBSERVATORY%mod_prereqs_offset] = ["SPELLCASTING_FOCUS"];
FAC_PREREQS[FAC_SPECIAL_IDS.GUILDHALL%mod_prereqs_offset] = ["SKILL_EXPERTIES"];
FAC_PREREQS[FAC_SPECIAL_IDS.WAR_ROOM%mod_prereqs_offset] = ["FIGHTING_STYLE"];

function getFacilityID(fac_name){
    return FAC_SPECIAL_IDS[fac_name] ?? Error.FacilityDoesNotExist;
}

function getFacilityPrereq(fac_name) {
    return FAC_PREREQS[FAC_SPECIAL_IDS[fac_name]] ?? null;
};

function getFacilityOrder(fac_name){
    const fac_id = FAC_SPECIAL_IDS[fac_name];
};

function getFacilityEnlargeReqs(upgrade_type){
    switch (upgrade_type) {
        case 'cramped_to_roomy':
            return [FAC_ENLARGE_TABLE.space_increase[0], FAC_ENLARGE_TABLE.cost[0], FAC_ENLARGE_TABLE.time_required[0]]
            break;
        case 'roomy_to_vast':
            return [FAC_ENLARGE_TABLE.space_increase[1], FAC_ENLARGE_TABLE.cost[1], FAC_ENLARGE_TABLE.time_required[1]]
            break;
        default:
            log("Invalid upgrade type");

    }
};


const CRAFT_ID_FACILITY_PAIRS= {
    ARCANE_FOCUS: FAC_SPECIAL_IDS.ARCANE_STUDY,
    BOOK: FAC_SPECIAL_IDS.ARCANE_STUDY,
    ALCHEMIST_SUPPLIES: FAC_SPECIAL_IDS.LABORATORY,
    CRAFT_POISON: FAC_SPECIAL_IDS.LABORATORY,
    HOLY_WATER: FAC_SPECIAL_IDS.SACRISTY,
    SACRED_FOCUS: FAC_SPECIAL_IDS.SANCTUARY,
    BOOK_REPLICA: FAC_SPECIAL_IDS.SCRIPTORIUM,
    SPELL_SCROLL: FAC_SPECIAL_IDS.SCRIPTORIUM,
    PAPERWORK: FAC_SPECIAL_IDS.SCRIPTORIUM,
    SMITH_TOOLS: FAC_SPECIAL_IDS.SMITHY,
    ADVENTURING_GEAR: FAC_SPECIAL_IDS.WORKSHOP,
    ARCANE_STUDY_CHARM: FAC_SPECIAL_IDS.ARCANE_STUDY,
    OBSERVATORY_CHARM: FAC_SPECIAL_IDS.OBSERVATORY,
    RELIQUARY_CHARM: FAC_SPECIAL_IDS.RELIQUARY,
    SANCTUM_CHARM: FAC_SPECIAL_IDS.SANCTUM,
    ARCANA: FAC_SPECIAL_IDS.ARCANE_STUDY,
    RELIC: FAC_SPECIAL_IDS.SACRISTY,
    ARMAMENT: FAC_SPECIAL_IDS.SMITHY,
    IMPLEMENT: FAC_SPECIAL_IDS.WORKSHOP,
};



const CRAFT_TYPE_IDS = {
    ARCANE_FOCUS: 0,
    BOOK: 1,
    ARCANA: 2,
    ALCHEMIST_SUPPLIES:3,
    CRAFT_POISON:4,
    HOLY_WATER:5,
    RELIC:6,
    SACRED_FOCUS:7,
    BOOK_REPLICA:8,
    SPELL_SCROLL:9,
    ARMAMENT:10,
    ADVENTURING_GEAR:11,
    IMPLEMENT:12,
    ARCANE_STUDY_CHARM: 13,
    OBSERVATORY_CHARM: 14,
    RELIQUARY_CHARM: 15,
    SANCTUM_CHARM: 16,
    ASSASSINS_BLOOD: 17,
    MALICE: 18,
    PALE_TINCTURE: 19,
    TRUTH_SERUM: 20,
    BURNT_OTHUR_FUMES: 21,
    ESSENCE_OF_ETHER: 22,
    TORPOR: 23,
};

const CRAFT_TYPE_NAMES_BY_IDS = Object.entries(CRAFT_TYPE_IDS).reduce((map, [name,id]) => {
    map[id] = name;
    return map
},{});

const CRAFT_TYPE_CATEGORY_IDS = {
    0: "MAGIC_ITEMS",
    1: "CHARMS",
    2: "POISONS",
    3: "EXTRA",
};

const CRAFT_TYPE_CATEGORY_NAMES = Object.entries(CRAFT_TYPE_CATEGORY_IDS).reduce((map, [id,name]) => {
    map[name] = id;
    return map;
}, {});

const CRAFT_TYPE_ARRAY = [
    "ARCANE_FOCUS","BOOK","ARCANA",
    "ALCHEMIST_SUPPLIES","CRAFT_POISON",
    "HOLY_WATER","RELIC",
    "SACRED_FOCUS","BOOK_REPLICA","SPELL_SCROLL",
    "ARMAMENT", "ADVENTURING_GEAR",
    "IMPLEMENT",
    "ARCANE_STUDY_CHARM","OBSERVATORY_CHARM","RELIQUARY_CHARM","SANCTUARY_CHARM","SANCTUARY_CHARM",
    "ASSASSINS_BLOOD","MALICE","PALE_TINCTURE","TRUTH_SERUM","BURNT_OTHUR_FUMES","ESSENCE_OF_ETHER","TORPOR"
];
const CRAFT_TYPE_CATEGORY_PAIRS = new Uint8Array(CRAFT_TYPE_ARRAY.length);
CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ARCANE_FOCUS] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.BOOK] = CRAFT_TYPE_CATEGORY_NAMES["EXTRA"];
CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ALCHEMIST_SUPPLIES] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.BOOK_REPLICA] = CRAFT_TYPE_CATEGORY_NAMES["EXTRA"];

CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ARCANA] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ARMAMENT] = CRAFT_TYPE_CATEGORY_NAMES["MAGIC_ITEMS"];
CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.IMPLEMENT] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.RELIC] = CRAFT_TYPE_CATEGORY_IDS["MAGIC_ITEMS"];

CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ASSASSINS_BLOOD] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.MALICE] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.PALE_TINCTURE] = CRAFT_TYPE_CATEGORY_NAMES["POISONS"];
CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.TRUTH_SERUM] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.BURNT_OTHUR_FUMES] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ESSENCE_OF_ETHER] = CRAFT_TYPE_CATEGORY_NAMES["POISONS"];
CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.TORPOR] = CRAFT_TYPE_CATEGORY_NAMES["POISONS"];

CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.RELIQUARY_CHARM] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.OBSERVATORY_CHARM] = CRAFT_TYPE_CATEGORY_NAMES["CHARMS"];
CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.ARCANE_STUDY_CHARM] = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS.SANCTUM_CHARM] = CRAFT_TYPE_CATEGORY_IDS["CHARMS"];

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


const RECRUIT_BASTION_TYPE_IDS = {
    BASTION_DEFENDERS: 0,
    GUILD_ASSIGNMENT: 1,
    CREATURE: 2,
    SPELLCASTER: 3,
    LIEUTENANTS: 4,
    SOLDIERS: 5,
};

const RECRUIT_BASTION_TYPE_ARRAY = ["BASTION_DEFENDERS","GUILD_ASSIGNMENT", "CREATURE","SPELLCASTER","LIEUTENANTS","SOLDIERS"];

const RECRUIT_ID_FACILITY_PAIRS = {
    BASTION_DEFENDERS: FAC_SPECIAL_IDS.BARRACK,
    GUILD_ASSIGNMENT: FAC_SPECIAL_IDS.GUILDHALL,
    CREATURE: FAC_SPECIAL_IDS.MENAGERIE,
    SPELLCASTER: FAC_SPECIAL_IDS.TELEPORTATION_CIRCLE,
    LIEUTENANTS: FAC_SPECIAL_IDS.WAR_ROOM,
    SOLIDERS: FAC_SPECIAL_IDS.WAR_ROOM,
};

//TO DO: Whenever I get to facilities of this level. Will have to review this approach here
//since dms/players could add custom assignments to custom guilds.
const RECRUIT_GUILD_ASSIGNMENT_TYPE_IDS = {};
const RECRUIT_GUILD_ASSIGNMENT_ARRAY = [];




const TRADE_ID_FACILITY_PAIRS = {
    STOCK_ARMORY: FAC_SPECIAL_IDS.ARMORY,
    TRADE_GOODS: FAC_SPECIAL_IDS.STOREHOUSE,
    TRADE_ANIMALS: FAC_SPECIAL_IDS.STABLE,
    GAMBLING_HALL: FAC_SPECIAL_IDS.GAMING_HALL,
};


const HARVEST_ID_FACILITY_PAIRS = {
    GARDEN_DECORATIVE_PERFUME: FAC_SPECIAL_IDS.DECORATIVE_GARDEN,
    GARDEN_DECORATIVE_CANDLES: FAC_SPECIAL_IDS.DECORATIVE_GARDEN,
    GARDEN_FOOD_RATIONS: FAC_SPECIAL_IDS.FOOD_GARDEN,
    GARDEN_HERB_HEALER_KIT: FAC_SPECIAL_IDS.HERB_GARDEN,
    GARDEN_HERB_POTION_HEALING: FAC_SPECIAL_IDS.HERB_GARDEN,
    GARDEN_POISON_ANTITOXIN: FAC_SPECIAL_IDS.POISON_GARDEN,
    GARDEN_POISON_BASIC: FAC_SPECIAL_IDS.POISON_GARDEN,
    HEALING_HERBS: FAC_SPECIAL_IDS.GREENHOUSE,
    POISON: FAC_SPECIAL_IDS.GREENHOUSE,
    POISON: FAC_SPECIAL_IDS.GREENHOUSE,
    TALISMAN: FAC_SPECIAL_IDS.RELIQUARY,
};


const RESEARCH_ID_FACILITY_PAIRS = {
    HELPFUL_LORE: FAC_SPECIAL_IDS.ARCHIVE,
    TOPICAL_LORE: FAC_SPECIAL_IDS.LIBRARY,
    INFORMATION_GATHERING: FAC_SPECIAL_IDS.PUB,
    LORE: FAC_SPECIAL_IDS.TROPHY_ROOM,
    TRINKET_TROPHY: FAC_SPECIAL_IDS.TROPHY_ROOM,
};


const EMPOWER_ID_FACILITY_PAIRS = {
    ARCANE_RESILIENCE: FAC_SPECIAL_IDS.DEMIPLANE,
    INNER_PEACE: FAC_SPECIAL_IDS.MEDITATION_CHAMBER,
    ELDRITCH_DISCOVERY: FAC_SPECIAL_IDS.OBSERVATORY,
    FORTIFYING_RITES: FAC_SPECIAL_IDS.SANCTUM,
    THEATRICAL_EVENT: FAC_SPECIAL_IDS.THEATER,
    TRAINING: FAC_SPECIAL_IDS.TRAINING_AREA,
};

const SEQ_FAC_ORDERS_ARRAYS = [CRAFT_ID_FACILITY_PAIRS, TRADE_ID_FACILITY_PAIRS, RECRUIT_ID_FACILITY_PAIRS, HARVEST_ID_FACILITY_PAIRS, RESEARCH_ID_FACILITY_PAIRS, EMPOWER_ID_FACILITY_PAIRS];
const SEQ_FAC_ORDERS_IDS = {
    CRAFT: 0,
    TRADE: 1,
    RECRUIT: 2,
    HARVEST: 3,
    RESEARCH: 4,
    EMPOWER: 5,
};

const PLAYE_BASTION_RECRUIT = {
    bastion_defenders: new Uint8Array(8),
    guild_assignments: new Uint8Array(8),
};



const INVENTORY_TYPE_IDS = {
    INVENTORY_CRAFTING: 0,
    INVENTORY_RECRUIT: 1,
    INVENTORY_TRADE: 2,
    INVENTORY_HARVEST: 3,
    INVENTORY_RESEARCH: 4,
    INVENTORY_EMPOWER: 5,
};

const PLAYER_BASTION_RECRUIT = {};
const PLAYER_BASTION_HARVEST = {};
const PLAYER_BASTION_RESEARCH = {};
const PLAYER_BASTION_EMPOWER = {};

const PLAYER_BASTION_TRACKER = {
    track_crafting: new Uint8Array(8),
    track_recruit: new Uint8Array(8),
    track_trade: new Uint8Array(8),
    track_harvest: new Uint8Array(8),
    track_research: new Uint8Array(8),
    track_empower: new Uint8Array(8),
};




let PLAYER_IDs = {}
const PLAYER_TABLE = {
    last_entry: null,
    player_name: [],
};


function handleNewPlayer(player_name){
    player_name = player_name.toUpperCase();
    for(let i = 0; i < PLAYER_TABLE.player_name.length;i++){
        if (PLAYER_TABLE.player_name[i] == player_name){
            log(`Player ${player_name} already exists`);
            return;
        }
    }
    PLAYER_TABLE.player_name.push(player_name);
    const last_entry = PLAYER_TABLE.last_entry ?? 0;
    PLAYER_IDs[player_name] = last_entry;

    PLAYER_TABLE.last_entry += 1;
    log(`Player ${player_name} added to table ${Object.entries(PLAYER_TABLE.player_name)}`)
};



function getPlayerIDByName(player_name){
    const player_id = PLAYER_IDs[player_name.toUpperCase()];
    return player_id;
};

function getPlayerNameByID(playerid){
    const player_name = PLAYER_TABLE.player_name[playerid];
    return player_name;
};


const PLAYERS_INVEOTRY_IDS = {

};


const PLAYERS_BASTION_TABLE = {
    player: new Uint8Array([0,1,2,3,4,5,6,7]),
    player_level: new Uint8Array(8),
    player_facilities: [[],[],[],[],[],[],[],[]],
    player_hirelings: [[],[],[],[],[],[],[],[]],
    player_facility_space: [[],[],[],[],[],[],[],[]],
    player_inventory_tracker: new Uint8Array([0,1,2,3,4,5,6,7]),
};


function checkPlayerOrderReqs(order, playerid){

};

function checkPlayerFacReqs(fac, playerid){

};


function getFacilityBasics(facility_type){
    switch (facility_type) {
        case 'cramped':
            return [FAC_BASIC_TABLE.space[0], FAC_BASIC_TABLE.cost[0],FAC_BASIC_TABLE.time_required[0]];
        case 'roomy':
            return [FAC_BASIC_TABLE.space[1], FAC_BASIC_TABLE.cost[1],FAC_BASIC_TABLE.time_required[1]];
        case 'vast':
            return [FAC_BASIC_TABLE.space[2], FAC_BASIC_TABLE.cost[2],FAC_BASIC_TABLE.time_required[2]];
        default:
            log("Invalid facility type");
    };
};

function handleAddFacility(facility_name,player_name){
    facility_name = facility_name.toUpperCase()
    player_name = player_name.toUpperCase()
    const player_id = getPlayerIDByName(player_name);
    const facility_id = getFacilityID(facility_name);
    if(facility_id===Error.FacilityDoesNotExist){
        return `Facility ${facility_name} does not exist`;
    };
    PLAYERS_BASTION_TABLE.player_facilities[player_id].push(facility_name);
    log(`Facility ${facility_name.toUpperCase()} successfuly added to ${player_name}`);
    return `Facility ${facility_name} successfuly added to ${player_name}`;

};


function handleTradeOrder(trade_name, playerid){
    const trade_id = TRADE_ID_FACILITY_PAIRS[trade_name.toUpperCase()];
    const facility_name = FAC_SPECIAL_NAMES[trade_id];
    if(!facility_name){
        return `Trade order ${trade_name} does not exist`;
    }
    if(!PLAYERS_BASTION_TABLE.player_facilities[playerid].find(facility => facility === facility_name)){
        return `Order ${trade_name} requires ${facility_name}`;
    }
    log("Trade ID: ", trade_id);
    return `Order ${trade_name.toUpperCase()} successful!`;
};

function handleRecruitOrder(recruit_name, playerid){
    const recruit_id = RECRUIT_ID_FACILITY_PAIRS[recruit_name.toUpperCase()];
    const facility_name = FAC_SPECIAL_NAMES[recruit_id];
    log(facility_name);

};

function handleHarvestOrder(recruit_name, playerid){
    const harvest_id = HARVEST_ID_FACILITY_PAIRS[recruit_name.toUpperCase()];
    const facility_name = FAC_SPECIAL_NAMES[harvest_id];
    log(facility_name);

};

function handleResearchOrder(recruit_name, playerid){
    const research_id = RESEARCH_ID_FACILITY_PAIRS[recruit_name.toUpperCase()];
    const facility_name = FAC_SPECIAL_NAMES[research_id];
    log(facility_name);

};

function handleEmpowerOrder(recruit_name, playerid){
    const empower_id = EMPOWER_ID_FACILITY_PAIRS[recruit_name.toUpperCase()];
    const facility_name = FAC_SPECIAL_NAMES[empower_id];
    log(facility_name);

};



function handleOrderIDValidation(order_type,order_name){
    switch (order_type) {
        case 'CRAFT':
            log("Craft Order name:", CRAFT_TYPE_ARRAY[CRAFT_TYPE_IDS[order_name]]);
            return true;
        case 'RECRUIT':
            log("Recruit Order name:", RECRUIT_BASTION_TYPE_ARRAY[RECRUIT_BASTION_TYPE_IDS[order_name]]);
            return true;
        default:
            return false;
    }
};

function handleOrderByID(order_type,order_name,playername){
    order_name = order_name.toUpperCase();
    order_type = order_type.toUpperCase();
    const playerid = getPlayerIDByName(playername);
    const validate_order_id = handleOrderIDValidation(order_type,order_name);
    if(!validate_order_id){
        log(validate_order_id);
        log(`Invalid Order id: ${order_type}`);
        return `Invalid order type ${order_type}`;
    }
    const order_type_id = FAC_SPECIAL_ORDER_NAMES[order_type.toUpperCase()];
    log("order type id: ", order_type_id)

    log("Logged:", order_type_id);

    switch (order_type_id) {
        case 0:
            const craft_category_id = CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS[order_name]];
            log(order_name)
            const craft_category_type = CRAFT_TYPE_CATEGORY_IDS[craft_category_id].toUpperCase();
            log(craft_category_type)
            PLAYERS_BASTION_CRAFTING_INVENTORY[craft_category_type][playerid].push(order_name)
            break;
        case 1:
            PLAYERS_BASTION_TRADE_INVENTORY[order_name][playerid].push(order_name);
            break;
        case 2:
            PLAYERS_BASTION_RECRUIT_INVENTORY[order_name][playerid].push(order_name);
            break;
        default:
            log("Error");

    }

}

function getInventoryTypeID(inventory_type){
    return INVENTORY_TYPE_IDS[inventory_type] ?? null;
};

//TO DO: Decided wether or not to deprecate these
// function handleCraftOrderExtra(craft_type,playerid){
//     const craft_id = CRAFT_EXTRA_TYPE_IDS[craft_type.toUpperCase()]
//     log("ID: ",craft_id);
//     if (CRAFT_EXTRA_TYPE_ARRAY[craft_id]){
//         log("Player facilities: ",PLAYERS_BASTION_TABLE.player_facilities[playerid])
//         const extra_inventory = PLAYERS_BASTION_CRAFTING_INVENTORY.extra[playerid];
//         log("Extra array: ", PLAYERS_BASTION_CRAFTING_INVENTORY.extra)
//         extra_inventory.push(craft_type);
//         log(`${getPlayerNameByID(playerid)} is crafting ${craft_type}`)
//     }
// }
//
// function handleCraftOrderCharm(craft_type,playerid){
//     const craft_id = CRAFT_CHARM_TYPE_IDS[craft_type]
//     if (CRAFT_CHARM_TYPES_ARRAY[craft_id]){
//         const craft_inventory = PLAYERS_BASTION_CRAFTING_INVENTORY.charms[playerid];
//         craft_inventory.push(craft_type);
//     }else{
//         log(Crafting_Errors.CraftingItemNotInTable);
//     }
// }
//
//
// function handleCraftOrderMagicItem(craft_type,playerid){
//     const craft_id = CRAFT_MAGIC_ITEM_TYPE_IDS[craft_type]
//     if (CRAFT_MAGIC_ITEM_TYPE_ARRAY[craft_id]){
//         const craft_inventory = PLAYERS_BASTION_CRAFTING_INVENTORY.magic_items[playerid];
//         craft_inventory.push(craft_type);
//     }else{
//         log(Crafting_Errors.CraftingItemNotInTable);
//     };
// }

function getPlayerInventoryItems(inventory_type_id, player_name){
    const playerid = getPlayerIDByName(player_name);
    switch (inventory_type_id) {
        case 0:
            const crafted_magic_items = PLAYERS_BASTION_CRAFTING_INVENTORY.MAGIC_ITEMS[playerid];
            const crafted_charms = PLAYERS_BASTION_CRAFTING_INVENTORY.CHARMS[playerid];
            const crafted_poisons = PLAYERS_BASTION_CRAFTING_INVENTORY.POISONS[playerid];
            const crafted_extras = PLAYERS_BASTION_CRAFTING_INVENTORY.EXTRA[playerid];
            const craft_payload = [crafted_magic_items, crafted_charms, crafted_extras, crafted_poisons];
            return craft_payload;
        case 1:
            const recruit_lieut = PLAYERS_BASTION_RECRUIT_INVENTORY.LIEUTENANTS[playerid];
            const recruit_soldiers = PLAYERS_BASTION_RECRUIT_INVENTORY.SOLDIERS[playerid];
            const recruit_creatures = PLAYERS_BASTION_RECRUIT_INVENTORY.CREATURES[playerid];
            const recruit_defenders= PLAYERS_BASTION_RECRUIT_INVENTORY.DEFENDERS[playerid];
            const recruit_specllcasters= PLAYERS_BASTION_RECRUIT_INVENTORY.SPELLCASTER[playerid];
            const recruit_guild_assignments= PLAYERS_BASTION_RECRUIT_INVENTORY.GUILD_ASSIGNMENTS[playerid];
            const recruit_payload = [recruit_lieut, recruit_soldiers, recruit_creatures, recruit_defenders, recruit_specllcasters, recruit_guild_assignments];
            return recruit_payload;
        case 2:
            const trade_inventory = PLAYERS_BASTION_TRADE_INVENTORY.STOCK_ARMORY[playerid];
            const trade_animals = PLAYERS_BASTION_TRADE_INVENTORY.GAMBLING_HALL[playerid];
            const trade_stock_armory = PLAYERS_BASTION_TRADE_INVENTORY.GOODS[playerid];
            const trade_gambling_hall = PLAYERS_BASTION_TRADE_INVENTORY.ANIMALS[playerid];
            const trade_payload = [trade_inventory, trade_animals, trade_stock_armory, trade_gambling_hall]
            return trade_payload;


        default:
            log("Invalid player id or inventory type");
    }
}






function display_players(){
    return PLAYER_TABLE.player_name;
}

function init_players(players){
    for(let i = 0; i < players.length; i++){
        handleNewPlayer(players[i]);
    }
    display_players();
};

const gmCommandCategories = {
    initFuncs: 0,
    timeFuncs: 1,
};

const playerCommandCategories = {
    facFunc: 1,
    invFunc: 2,
};


const facilityFunctions = {
    handleAddFacility,
    handleOrderByID,
};

const playerInventoryFunctions = {
    getPlayerInventoryItems,
};

const undoFunctions = {

};

const asGMInitFunctions = {
    init_players,
    display_players,
};

// const command = "!bastion @asGM cmd=init_players params=Storm Cloudstrike, Goon Lord"
init_players(["Storm"]);

let command = "!bastion @asPlayer cmd=handleAddFacility arcane_study Storm"
const fac5 = ["arcane_study","armory","barrack","food_garden","herb_garden","poison_garden","decorative_garden","library","sanctuary","smithy","storehouse","workshop"]


const order_names = ["CRAFT","RESEARCH","RECRUIT","HARVEST","EMPOWER","TRADE"];

function pnfo_helper(facility){
    let pairs = {};
    for (let idx = 0; idx < facility.length; idx++){
        const facility_id = facility[idx][1];
        const order_name = facility[idx][0]
        const facility_name = FAC_SPECIAL_NAMES[facility_id];
        pairs[order_name] = facility_name;
    };
    return pairs;
};
function getProductNamesFromOrder(order){
    const order_in_facility = SEQ_FAC_ORDERS_ARRAYS[SEQ_FAC_ORDERS_IDS[order.toUpperCase()]]
    const order_bulk = Object.entries(order_in_facility);
    const order_pairs_result = pnfo_helper(order_bulk)
    return order_pairs_result;
};

let count = 1_000_00;
while (count > 0){
    const randIDX = Math.floor(Math.random()*order_names.length);
    const rand_fac = Math.floor(Math.random()*fac5.length);
    const rand_order_name = Math.floor(Math.random()*23);
    getFacilityID(fac5[rand_fac]);
    handleAddFacility(fac5[rand_fac],"StorM");
    handleOrderByID("CRAFT",CRAFT_TYPE_NAMES_BY_IDS[rand_order_name],"StorM")

    log(getProductNamesFromOrder(order_names[randIDX]));
    count--;
};

function getOrderNameFromProduct(product){

};



// process.stdout.write('BASTION> ');
// process.stdin.on('data', (data) => {
//     const command = data.toString().trim();
//
//     if (command === 'quit' || command === 'exit') {
//         console.log('Exiting Bastion CLI');
//         process.exit(0);
//     }
//
//
//     if (command.startsWith("!bastion @asPlayer")){
//
//     };
//
//     if (command.startsWith("!bastion @asGM")){
//         const command_func = command.split("cmd=")[1].split(" params=")[0];
//         const params_part = command.split("params=")[1];
//         const command_params = params_part
//             ?   params_part.split(",").map(name => {
//             return name.trim().split(" ")[0].toUpperCase();
//         }) : null;
//         if(command_params){
//             log(asGMInitFunctions[command_func](command_params));
//         }else{
//             log(asGMInitFunctions[command_func]());
//         };
//     };
//
//     console.log(`Executing: ${command}`);
//
//     process.stdout.write('BASTION> ');
// });
