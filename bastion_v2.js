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




const NUM_FACILITIES = 37;

const FACILITY_PROPERTIES = {
    hirelings: new Uint8Array(NUM_FACILITIES),
    size: new Uint8Array(NUM_FACILITIES),
    order: new Uint8Array(NUM_FACILITIES),
};
FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.GAMING_HALL] = FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.SANCTUARY] = 4;
FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.THEATER] = FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.TRAINING_AREA] = 4;

FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.WORKSHOP] = 3;

FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.SMITHY] = FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.MENAGERIE] = FACILITY_PROPERTIES.hirelings[FAC_SPECIAL_IDS.WAR_ROOM] = 2;


FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.DEMIPLANE] = FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.GAMING_HALL] = 32;
FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.BAKERS_GUILD] = FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.MASONS_GUILD] = 32;
FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.BREWERS_GUILD] = FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.ADVENTURERS_GUILD] = 32;
FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.SHIPBUILDERS_GUILD] = FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.THIEVES_GUILD] = 32;
FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.MENAGERIE] = FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.THEATER] = 32;
FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.TRAINING_AREA] = FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.WAR_ROOM] = 32;

FACILITY_PROPERTIES.size[FAC_SPECIAL_IDS.MEDITATION_CHAMBER] = 4;



FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.MEDITATION_CHAMBER] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.OBSERVATORY] = ORDER_IDS.EMPOWER;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.SANCTUM] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.THEATER] = ORDER_IDS.EMPOWER;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.TRAINING_AREA] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.DEMIPLANE] = ORDER_IDS.EMPOWER;

FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.ARCHIVE] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.LIBRARY] = ORDER_IDS.RESEARCH;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.TROPHY_ROOM] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.PUB] = ORDER_IDS.RESEARCH;


FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.FOOD_GARDEN] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.HERB_GARDEN] = ORDER_IDS.HARVEST;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.POISON_GARDEN] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.DECORATIVE_GARDEN] = ORDER_IDS.HARVEST;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.GREENHOUSE] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.RELIQUARY] = ORDER_IDS.HARVEST;

FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.BARRACK] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.MENAGERIE] = ORDER_IDS.RECRUIT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.TELEPORTATION_CIRCLE] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.WAR_ROOM] = ORDER_IDS.RECRUIT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.ADVENTURERS_GUILD] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.BAKERS_GUILD] = ORDER_IDS.RECRUIT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.BREWERS_GUILD] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.MASONS_GUILD] = ORDER_IDS.RECRUIT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.SHIPBUILDERS_GUILD] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.THIEVES_GUILD] = ORDER_IDS.RECRUIT;


FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.ARMORY] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.STOREHOUSE] = ORDER_IDS.TRADE;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.GAMING_HALL] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.STABLE] = ORDER_IDS.TRADE;

FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.ARCANE_STUDY] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.LABORATORY] = ORDER_IDS.CRAFT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.SACRISTY] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.SANCTUARY] = ORDER_IDS.CRAFT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.SCRIPTORIUM] = FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.SMITHY] = ORDER_IDS.CRAFT;
FACILITY_PROPERTIES.order[FAC_SPECIAL_IDS.WORKSHOP] = ORDER_IDS.CRAFT;
for (let idx = 0; idx < NUM_FACILITIES;idx++){
    if (FACILITY_PROPERTIES.hirelings[idx] === 0){
        FACILITY_PROPERTIES.hirelings[idx] = 1;
    };


    if (FACILITY_PROPERTIES.size[idx] === 0){
        FACILITY_PROPERTIES.size[idx] = 16;
    };
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

let PLAYER_ID = {};
const PLAYERS = {
    current_capacity: 0,
    next_available: 0,
    capacity: 8,
    players: [],
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
    PLAYER_ID[player_name] = PLAYERS.next_available-1;
    PLAYERS.next_available += 1;
    return PLAYERS;
};

function handleAwardGold(player_list, gold_amount){
    for (let idx = 0; idx < player_list.length; idx++){
        const player_id = PLAYER_ID[player_list[0]];
        PLAYERS_BASTION_TABLE[player_id] = gold_amount;
    };
    return `Players ${player_list} have all been awarded ${gold_amount}`;
};

const PLAYERS_BASTION_TABLE = {
    player_gold: [],
    player_currently_scheduled_orders: [[],[],[],[],[],[],[],[]],
    player_facilities: [[],[],[],[],[],[],[],[]],
    player_inventory_type: [[],[],[],[],[],[],[],[]],
};

handleNewPlayer("Storm")
handleNewPlayer("Cloudstrike")

function addPlayerSpecialFacility(facility_name, player_name){
    facility_name = facility_name.toUpperCase();
    const player_id = PLAYER_ID[player_name.toUpperCase()];
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







function handleOrderNameFacilityValidation(facility_name, order_type,order_name){
    const facility_id = FAC_SPECIAL_IDS[facility_name];
    const order_pair_type = SEQ_FAC_ORDERS_ARRAYS[ORDER_IDS[order_type]]
    log(order_pair_type)
    return facility_id === order_pair_type[order_name];
};


function handlePlayerHasFacilityValidation(facility_name, order_name,player_name){
    return order_facility_parent;

};

function handleOrder(facility_name, order_type, order_name, player_name){
    facility_name = facility_name.toUpperCase();
    player_name = player_name.toUpperCase();
    order_name = order_name.toUpperCase();
    order_type = order_type.toUpperCase();
    const validate_facility_order_pair = handleOrderNameFacilityValidation(facility_name,order_type, order_name);
    let fac_validation = false;
    const player_id = PLAYER_ID[player_name];
    for (let idx = 0; idx < PLAYERS_BASTION_TABLE.player_facilities[player_id].length;idx++){
        if (facility_name === PLAYERS_BASTION_TABLE.player_facilities[player_id][idx]){
            fac_validation = true;
        };
    };
    if(validate_facility_order_pair){
        if(fac_validation){
            const order_id = ORDER_IDS[order_type.toUpperCase()];
            switch (order_id) {
                case 0:
                    const craft_subtype = CRAFT_TYPE_CATEGORY_IDS[CRAFT_TYPE_CATEGORY_PAIRS[CRAFT_TYPE_IDS[order_name]]]
                    PLAYERS_BASTION_CRAFTING_INVENTORY[craft_subtype][player_id].push(order_name);
                    return `Player ${player_name} scheduled order ${order_type} for ${order_name}`
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;


                default:
                    log("Placeholder error handleOrder switch block");

            }

        }else{
            log(PLAYERS_BASTION_TABLE.player_facilities[player_id])
            return `Player ${player_name} does not have a ${facility_name}`;
        };
    }
    return `Facility ${facility_name} does not have order ${order_name}`;
};


addPlayerSpecialFacility("BARRACK","Storm");
addPlayerSpecialFacility("ARCANE_STUDY","Storm");
addPlayerSpecialFacility("LABORATORY","Storm");
addPlayerSpecialFacility("LABORATORY","Cloudstrike");
addPlayerSpecialFacility("SCRIPTORIUM","Cloudstrike");


handleOrder("ARCANE_STUDY","craft", "arcane_focus","Storm");
handleOrder("LABORATORY","craft", "craft_poison","Storm");
log(handleOrder("SCRIPTORIUM","craft", "book_replica","Cloudstrike"));
log(PLAYERS_BASTION_CRAFTING_INVENTORY)
