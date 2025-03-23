const log = console.log;

    //     if (!state.MyBastion){
    //         state.MyBastion = {
    //         FAC_INTRINSICS: {
    //             name: new Uint8Array(37),
    //             size: new Uint8Array(37),
    //             hirelings: new Uint8Array(37),
    //             order_type: new Uint8Array(37),
    //             prods_contained: [],
    //         },
    //         PLAYERS_ROLL20_PID_LOCAL_GID_TABLE: {
    //             "": {roll20_id: "", local_gid: 0},
    //             "": {roll20_id: "", local_gid: 1},
    //             "": {roll20_id: "", local_gid: 2},
    //             "": {roll20_id: "", local_gid: 3},
    //             "": {roll20_id: "", local_gid: 4},
    //             "": {roll20_id: "", local_gid: 5},
    //             "": {roll20_id: "", local_gid: 6},
    //             "": {roll20_id: "", local_gid: 7},
    //         },
    //         PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE: {
    //             0: {roll20_id: "", player_name: ""},
    //             1: {roll20_id: "", player_name: ""},
    //             2: {roll20_id: "", player_name: ""},
    //             3: {roll20_id: "", player_name: ""},
    //             4: {roll20_id: "", player_name: ""},
    //             5: {roll20_id: "", player_name: ""},
    //             6: {roll20_id: "", player_name: ""},
    //             7: {roll20_id: "", player_name: ""},
    //         },
    //         PLAYERS_INFO_FACILITY_TABLE: {
    //             facilities: [],
    //             scheduled_orders: [],
    //         },
    //         PLAYERS_INFO_INVENTORY_TABLE: {
    //             items_name: new Uint8Array(47*8),
    //             items_count: new Uint8Array(47*8),
    //         },
    //         ROLL20_ID_LOOKUP: new Set(),
    //         BASTION_META: {
    //             current_level: 0,
    //         },
    //     }
    // }else{loadState()};
    //
    // };


const ERROR_IDS = {
    0: "gm_menu",
    1: "gm_add_unreg_players",
    2: "gm_remove_reg_players",
    3: "gm_timeskip",
    4: "menu",
    5: "facilities",
    6: "orders",
    7: "fac_lvl5",
    8: "fac_lvl9",
    9: "fac_lvl13",
    10: "fac_lvl17",
    11: "fac_add",
    12: "fac_remove",
    13: "fac_view",
    14: "fac_editview",
    15: "ord_start",
    16: "ord_finish",
    17: "ord_status",
    18: "ord_history",
    19: "garden",
    20: "guildhall",
    21: "fac_duplicate",
    22: "current_level_too_low",
};

const ERROR_IDS_REVERSE = Object.entries(ERROR_IDS).reduce((map, [id, name]) => {
    map[name] = id;
    return map;
},{})


const NAV_GM_MENU_ERRORS = {
   //TODO: Consider which gm commands can have erros
};


const MENAGERIE_CREATURES_ID = {
    APE: 0,
    BLACK_BEAR: 1,
    BROWN_BEAR: 2,
    CONSTRICTOR_SNAKE: 3,
    CROCODILE: 4,
    DIRE_WOLF: 5,
    GIANT_VULTURE: 6,
    HYENA: 7,
    JACKAL: 8,
    LION: 9,
    OWLBEAR: 10,
    PANTHER: 11,
    TIGER: 12,
};

const MENAGERIE_CREATURES_INFO = {
    size: [],
    cost: new Uint8Array(13),
};

//Small Menagerie Creatures
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.JACKAL] = "Small";

//Medium Menagerie Craetures
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.APE]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.BLACK_BEAR]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.HYENA]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.PANTHER]= "Medium";

//Large Menagerie Creatures
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.BROWN_BEAR]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.CONSTRICTOR_SNAKE]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.CROCODILE]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.DIRE_WOLF]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.GIANT_VULTURE]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.LION]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.OWLBEAR]=
MENAGERIE_CREATURES_INFO.size[MENAGERIE_CREATURES_ID.TIGER]= "Large";

//Menagerie Creatures Gold Costs

MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.HYENA]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.JACKAL]= 50;

MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.CONSTRICTOR_SNAKE]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.PANTHER]= 250;


MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.APE]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.BLACK_BEAR]= 500;

MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.BROWN_BEAR]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.DIRE_WOLF]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.GIANT_VULTURE]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.LION]=
MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.TIGER]= 1000;

MENAGERIE_CREATURES_INFO.cost[MENAGERIE_CREATURES_ID.OWLBEAR]= 3500;

const SPECIAL_EFFECTS_DDB_LINKS= {
    ARCANE_STUDY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#ArcaneStudy",
    ARCHIVE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Archive",
    ARMORY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Armory",
    BARRACK: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Barrack",
    DEMIPLANE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Demiplane",
    GAMING_HALL: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#GamingHall",
    GARDEN_GENERIC: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Garden",
    GREENHOUSE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Greenhouse",
    GUILDHALL_GENERIC: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Guildhall",
    LABORATORY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Laboratory",
    LIBRARY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Library",
    MEDITATION_CHAMBER: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#MeditationChamber",
    MENAGERIE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Menagerie",
    OBSERVATORY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Observatory",
    PUB: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Pub",
    RELIQUARY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Reliquary",
    SACRISTY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Sacristy",
    SANCTUARY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Sanctuary",
    SANCTUM: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Sanctum",
    SCRIPTORIUM: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Scriptorium",
    SMITHY: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Smithy",
    STABLE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Stable",
    STOREHOUSE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Storehouse",
    TELEPORTATION_CIRCLE: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#TeleportationCircle",
    THEATER: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Theater",
    TRAINING_AREA: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#TrainingArea",
    TROPHY_ROOM: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#TrophyRoom",
    WAR_ROOM: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#WarRoom",
    WORKSHOP: "https://www.dndbeyond.com/sources/dnd/dmg-2024/bastions#Workshop",
}




const ERROR_HANDLER = {
    global_id: -1,
    gm_menu: {},
    gm_add_unreg_players: {},
    gm_remove_reg_players: {},
    gm_timeskip: {},
    menu: {},
    facilities: {},
    orders: {},
    fac_lvl5: {},
    fac_lvl9: {},
    fac_lvl13: {},
    fac_lvl17: {},
    fac_add: {
        garden: (fac_name) => {
            return [-1,`You can only have one Garden Type. You currently own a ${fac_name}`];
        },
        guildhall: (fac_name) => {
            return [-1,`You can only have one Guildhall Type. You currently own a ${fac_name}`];
        },
        fac_duplicate: (fac_name) => {
            return [-1,`You already own ${fac_name}`];
        },
        current_level_too_low: (bastion_tier_level) => {
            return [-1,`Cannot add this facility. The Bastion's Tier Level is ${bastion_tier_level}`];
            },
        fac_level_too_high: (fac_name,fac_level, bastion_tier_level) => {
            return [-1,`Cannot add ${fac_name} of level ${fac_level} when the Bastion's Tier Level is ${bastion_tier_level}`];
        },
        reached_max_for_level: [-1,`You reached the maximum number of facilities for this level.`],

    },
    fac_remove: {},
    fac_view: {},
    fac_editview: {
    },
    ord_start: {},
    ord_finish: {},
    ord_status: {
        no_active_orders: [-1,"You have no active orders"]
    },
    ord_history: {},
};

const BASTION_META = {
    active_tier: 5,
    players_can_add_initalised: false,
    fac_levels_for_tier: new Uint8Array([5,9,13,17]),
    fac_max_for_level: new Uint8Array([2,4,6,8]),
    fac_av_to_add: null,
};

function get_current_bastion_tier(){
    return BASTION_META.active_tier;
};

function set_cur_bastion_lvl_and_av_to_add(level){
    const ACTIVE_TIER = {
        5: 0,
        9: 1,
        13: 2,
        17: 3,
    };
    BASTION_META.active_tier = ACTIVE_TIER[level];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < FAC_BY_NAMES.FAC_COUNT;j++){
            if(FAC_INTRINSICS.level[j] === level){
                BASTION_META.fac_av_to_add[i].add(j);
            };
        };
    }
};

const FAC_BY_NAMES = {
    FAC_COUNT: 37,
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
const FAC_BY_ID = Object.entries(FAC_BY_NAMES).reduce((map,[name,id]) => {
    map[id] = name;
    return map;
},{})

const FAC_MORE_THAN_ONE = new Set(
    [FAC_BY_NAMES.BARRACK,
    FAC_BY_NAMES.HERB_GARDEN,
    FAC_BY_NAMES.FOOD_GARDEN,
    FAC_BY_NAMES.DECORATIVE_GARDEN,
    FAC_BY_NAMES.POISON_GARDEN,
    FAC_BY_NAMES.STABLE,
    FAC_BY_NAMES.TRAINING_AREA,]
);

const FAC_PROD_IDS = {
    TOTAL_PRODS: 49,
    0: "ARCANE_FOCUS",
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
    18: "BASTION_DEFENDERS",
    19: "ADVENTURERS_GUILD_ASSIGNENT",
    20: "BAKERS_GUILD_ASSIGNENT",
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

const FAC_PROD_NAMES = Object.entries(FAC_PROD_IDS).reduce((map,[id,name]) => {
    map[name] = id;
    return map;
},{});

const FAC_PRODS_INTRINSICS = {
    base_gold: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS),
    base_output: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS),
    extra_reqs: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS),
    duration: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS),
};

// ARCANE STUDY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ARCANE_FOCUS] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ARCANE_FOCUS] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ARCANE_FOCUS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ARCANE_FOCUS] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.BOOK] = 10;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.BOOK] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.BOOK] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.BOOK] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.MAGIC_ITEM_ARCANA] = 100; // Varies by item
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.MAGIC_ITEM_ARCANA] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.MAGIC_ITEM_ARCANA] = 1; // Requires level 9+
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.MAGIC_ITEM_ARCANA] = 14; // Varies by item

// LABORATORY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ALCHEMIST_SUPPLIES] = 50; // Varies by item
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ALCHEMIST_SUPPLIES] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ALCHEMIST_SUPPLIES] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ALCHEMIST_SUPPLIES] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.CRAFT_POISON] = 50; // Half the poison's cost
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.CRAFT_POISON] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.CRAFT_POISON] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.CRAFT_POISON] = 7;

// SACRISTY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.HOLY_WATER] = 0; // Can add 100GP per 1d8 damage
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.HOLY_WATER] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.HOLY_WATER] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.HOLY_WATER] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.MAGIC_ITEM_RELIC] = 100; // Varies by item
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.MAGIC_ITEM_RELIC] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.MAGIC_ITEM_RELIC] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.MAGIC_ITEM_RELIC] = 14; // Varies by item

// SANCTUARY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.SACRED_FOCUS] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.SACRED_FOCUS] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.SACRED_FOCUS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.SACRED_FOCUS] = 7;

// SCRIPTORIUM PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.BOOK_REPLICA] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.BOOK_REPLICA] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.BOOK_REPLICA] = 1; // Requires a blank book
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.BOOK_REPLICA] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.SPELL_SCROLL] = 50; // Varies by spell level
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.SPELL_SCROLL] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.SPELL_SCROLL] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.SPELL_SCROLL] = 7; // Varies by spell level

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.PAPERWORK] = 1; // Per copy
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.PAPERWORK] = 50; // Up to 50 copies
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.PAPERWORK] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.PAPERWORK] = 7;

// SMITHY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ADVENTURING_GEAR] = 50; // Varies by item
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ADVENTURING_GEAR] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ADVENTURING_GEAR] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ADVENTURING_GEAR] = 7; // Varies by item

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.MAGIC_ITEM_ARMAMENT] = 100; // Varies by item
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.MAGIC_ITEM_ARMAMENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.MAGIC_ITEM_ARMAMENT] = 1; // Requires level 9+
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.MAGIC_ITEM_ARMAMENT] = 14; // Varies by item

// WORKSHOP PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.MAGIC_ITEM_IMPLEMENT] = 100; // Varies by item
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.MAGIC_ITEM_IMPLEMENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.MAGIC_ITEM_IMPLEMENT] = 1; // Requires level 9+
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.MAGIC_ITEM_IMPLEMENT] = 14; // Varies by item

// ARMORY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.STOCK_ARMORY] = 100; // +100GP per defender
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.STOCK_ARMORY] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.STOCK_ARMORY] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.STOCK_ARMORY] = 0; // Immediate effect

// STOREHOUSE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.TRADE_GOODS] = 500; // Up to 500GP at level 5
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.TRADE_GOODS] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.TRADE_GOODS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.TRADE_GOODS] = 7;

// STABLE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ANIMALS] = 50; // Varies by animal
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ANIMALS] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ANIMALS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ANIMALS] = 7;

// GAMING HALL PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.GAMBLING_HALL] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.GAMBLING_HALL] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.GAMBLING_HALL] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.GAMBLING_HALL] = 7;

// BARRACK PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.BASTION_DEFENDERS] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.BASTION_DEFENDERS] = 4; // Up to 4 defenders
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.BASTION_DEFENDERS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.BASTION_DEFENDERS] = 0; // Immediate

// GUILD ASSIGNMENTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ADVENTURERS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ADVENTURERS_GUILD_ASSIGNENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ADVENTURERS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ADVENTURERS_GUILD_ASSIGNENT] = 8; // 1d6+1 days

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.BAKERS_GUILD_ASSIGNENT] = 0; // 500GP payment received
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.BAKERS_GUILD_ASSIGNENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.BAKERS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.BAKERS_GUILD_ASSIGNENT] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.BREWERS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.BREWERS_GUILD_ASSIGNENT] = 50; // 50 barrels
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.BREWERS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.BREWERS_GUILD_ASSIGNENT] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.MASONS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.MASONS_GUILD_ASSIGNENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.MASONS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.MASONS_GUILD_ASSIGNENT] = 10; // Per wall square

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.SHIPBUILDERS_GUILD_ASSIGNENT] = 1000; // Varies by vehicle
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.SHIPBUILDERS_GUILD_ASSIGNENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.SHIPBUILDERS_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.SHIPBUILDERS_GUILD_ASSIGNENT] = 10; // 1 day per 1,000GP

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.THIEVES_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.THIEVES_GUILD_ASSIGNENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.THIEVES_GUILD_ASSIGNENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.THIEVES_GUILD_ASSIGNENT] = 8; // 1d6+1 days

// MENAGERIE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.CREATURE] = 500; // Varies by creature
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.CREATURE] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.CREATURE] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.CREATURE] = 7;

// TELEPORTATION CIRCLE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.SPELLCASTER] = 0; // May pay for spell components
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.SPELLCASTER] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.SPELLCASTER] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.SPELLCASTER] = 14; // Stays for 14 days

// WAR ROOM PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.LIEUTENANTS] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.LIEUTENANTS] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.LIEUTENANTS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.LIEUTENANTS] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.SOLDIERS] = 1; // 1GP per guard per day
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.SOLDIERS] = 100; // 100 guards or 20 mounted
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.SOLDIERS] = 1; // Requires lieutenant
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.SOLDIERS] = 7;

// DECORATIVE GARDEN PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.PERFUME] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.PERFUME] = 10; // Ten vials
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.PERFUME] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.PERFUME] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.CANDLES] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.CANDLES] = 10; // Ten candles
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.CANDLES] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.CANDLES] = 7;

// FOOD GARDEN PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.FOOD_RATIONS] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.FOOD_RATIONS] = 100; // 100 days of rations
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.FOOD_RATIONS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.FOOD_RATIONS] = 7;

// HERB GARDEN PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.HEALER_KIT] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.HEALER_KIT] = 10; // Ten kits
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.HEALER_KIT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.HEALER_KIT] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.HEALING_POTION] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.HEALING_POTION] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.HEALING_POTION] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.HEALING_POTION] = 7;

// POISON GARDEN PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ANTITOXIN] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ANTITOXIN] = 2; // Two vials
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ANTITOXIN] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ANTITOXIN] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.BASIC_POISON] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.BASIC_POISON] = 1; // One vial
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.BASIC_POISON] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.BASIC_POISON] = 7;

// GREENHOUSE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.HEALING_HERBS] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.HEALING_HERBS] = 1; // Greater healing potion
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.HEALING_HERBS] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.HEALING_HERBS] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.POISON] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.POISON] = 1; // One application
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.POISON] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.POISON] = 7;

// RELIQUARY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.TALISMAN] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.TALISMAN] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.TALISMAN] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.TALISMAN] = 7;

// ARCHIVE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.HELPFUL_LORE] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.HELPFUL_LORE] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.HELPFUL_LORE] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.HELPFUL_LORE] = 7;

// LIBRARY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.TOPICAL_LORE] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.TOPICAL_LORE] = 3; // Up to 3 pieces of info
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.TOPICAL_LORE] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.TOPICAL_LORE] = 7;

// PUB PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.INFORMATION_GATHERING] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.INFORMATION_GATHERING] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.INFORMATION_GATHERING] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.INFORMATION_GATHERING] = 7;

// TROPHY ROOM PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.LORE] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.LORE] = 3; // Up to 3 pieces of info
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.LORE] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.LORE] = 7;

FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.TRINKET_TROPHY] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.TRINKET_TROPHY] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.TRINKET_TROPHY] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.TRINKET_TROPHY] = 7;

// DEMIPLANE PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ARCANE_RESILIENCE] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ARCANE_RESILIENCE] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ARCANE_RESILIENCE] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ARCANE_RESILIENCE] = 7;

// MEDITATION CHAMBER PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.INNER_PEACE] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.INNER_PEACE] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.INNER_PEACE] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.INNER_PEACE] = 7;

// OBSERVATORY PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.ELDRITCH_DISCOVERY] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.ELDRITCH_DISCOVERY] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.ELDRITCH_DISCOVERY] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.ELDRITCH_DISCOVERY] = 7;

// SANCTUM PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.FORTIFYING_RITES] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.FORTIFYING_RITES] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.FORTIFYING_RITES] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.FORTIFYING_RITES] = 7;

// THEATER PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.THEATRICAL_EVENT] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.THEATRICAL_EVENT] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.THEATRICAL_EVENT] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.THEATRICAL_EVENT] = 21; // 14 days rehearsal + 7 performance

// TRAINING AREA PRODUCTS
FAC_PRODS_INTRINSICS.base_gold[FAC_PROD_NAMES.TRAINING] = 0;
FAC_PRODS_INTRINSICS.base_output[FAC_PROD_NAMES.TRAINING] = 1;
FAC_PRODS_INTRINSICS.extra_reqs[FAC_PROD_NAMES.TRAINING] = 0;
FAC_PRODS_INTRINSICS.duration[FAC_PROD_NAMES.TRAINING] = 7;

//Product Header's Mask
const HEADER_PROD_CRAFT = 1n << 55n;
const HEADER_PROD_TRADE = 1n << 54n;
const HEADER_PROD_RECRUIT = 1n << 53n;
const HEADER_PROD_HARVEST = 1n << 52n;
const HEADER_PROD_RESEARCH = 1n << 51n;
const HEADER_PROD_EMPOWER = 1n << 50n;


//Product Subtype's Mask
const COUNT_CRAFTABLES = 14n;
const COUNT_TRADEABLES = 4n;
const COUNT_RECRUITABLES = 11n;
const COUNT_HARVESTABLES = 10n;
const COUNT_RESEARCHABLES = 5n;
const COUNT_EMPOWERABLES = 6n;

const MASK_CRAFTABLES = ((1n << COUNT_CRAFTABLES)-1n);
const MASK_TRADEABLES = ((1n << COUNT_TRADEABLES)-1n) << COUNT_CRAFTABLES;
const MASK_RECRUITABLES = ((1n << COUNT_RECRUITABLES)-1n) << (COUNT_CRAFTABLES+COUNT_TRADEABLES);
const MASK_HARVESTABLES =  ((1n << COUNT_HARVESTABLES)-1n) << (COUNT_CRAFTABLES+COUNT_TRADEABLES+COUNT_RECRUITABLES);
const MASK_RESEARCHABLES = ((1n << COUNT_RESEARCHABLES)-1n) << (COUNT_CRAFTABLES+COUNT_TRADEABLES+COUNT_RECRUITABLES+COUNT_HARVESTABLES);
const MASK_EMPOWERABLES =  ((1n << COUNT_EMPOWERABLES)-1n) << (COUNT_CRAFTABLES+COUNT_TRADEABLES+COUNT_RECRUITABLES+COUNT_HARVESTABLES+COUNT_RESEARCHABLES);

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
    level: new Uint8Array(37),
    hirelings: new Uint8Array(37),
    order_type: new Uint8Array(37),
    prods_contained: new BigUint64Array(37),
};

// Assign level for each facility type
// Level 5 Facilities
FAC_INTRINSICS.level[0] = FAC_INTRINSICS.level[7] =
FAC_INTRINSICS.level[11] = FAC_INTRINSICS.level[21] =
FAC_INTRINSICS.level[22] = FAC_INTRINSICS.level[23] =
FAC_INTRINSICS.level[24] = FAC_INTRINSICS.level[28] =
FAC_INTRINSICS.level[3] = FAC_INTRINSICS.level[5] =
FAC_INTRINSICS.level[8] = FAC_INTRINSICS.level[6] = 5;

// Level 9 Facilities
FAC_INTRINSICS.level[9] = FAC_INTRINSICS.level[25] =
FAC_INTRINSICS.level[1] = FAC_INTRINSICS.level[2] =
FAC_INTRINSICS.level[4] = FAC_INTRINSICS.level[10] =
FAC_INTRINSICS.level[19] = FAC_INTRINSICS.level[35] =
FAC_INTRINSICS.level[36] = FAC_INTRINSICS.level[30] = 9;

// Level 13 Facilities
FAC_INTRINSICS.level[27] = FAC_INTRINSICS.level[32] =
FAC_INTRINSICS.level[18] = FAC_INTRINSICS.level[33] =
FAC_INTRINSICS.level[29] = FAC_INTRINSICS.level[26] = 13;

// Level 17 Facilities
FAC_INTRINSICS.level[31] = FAC_INTRINSICS.level[13] =
FAC_INTRINSICS.level[15] = FAC_INTRINSICS.level[14] =
FAC_INTRINSICS.level[16] = FAC_INTRINSICS.level[12] =
FAC_INTRINSICS.level[17] = FAC_INTRINSICS.level[34] =
FAC_INTRINSICS.level[20] = 17;




// Resetting all prods_contained to 0n
for (let i = 0; i < FAC_INTRINSICS.prods_contained.length; i++) {
    FAC_INTRINSICS.prods_contained[i] = 0n;
}
// CRAFT FACILITIES (ORDER_TYPE 0)
// TODO: Should do BigInt() over the IDs in FAC_PROD_NAMES[ID] in case I ever change the IDs.
// Arcane Study
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.ARCANE_STUDY] |= (1n << 0n);  // Arcane Focus
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.ARCANE_STUDY] |= (1n << 1n);  // Book
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.ARCANE_STUDY] |= (1n << 10n); // Magic Item (Arcana)

// Laboratory
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.LABORATORY] |= (1n << 2n);  // Alchemist's Supplies
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.LABORATORY] |= (1n << 3n);  // Craft Poison

// Sacristy
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SACRISTY] |= (1n << 4n);  // Holy Water
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SACRISTY] |= (1n << 11n); // Magic Item (Relic)

// Sanctuary
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SANCTUARY] |= (1n << 5n);  // Sacred Focus

// Scriptorium
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SCRIPTORIUM] |= (1n << 6n);  // Book Replica
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SCRIPTORIUM] |= (1n << 7n);  // Spell Scroll
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SCRIPTORIUM] |= (1n << 8n);  // Paperwork

// Smithy
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SMITHY] |= (1n << 9n);  // Adventuring Gear (Smith's Tools)
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SMITHY] |= (1n << 12n); // Magic Item (Armament)

// Workshop
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.WORKSHOP] |= (1n << 9n);  // Adventuring Gear (Artisan's Tools)
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.WORKSHOP] |= (1n << 13n); // Magic Item (Implement)

// TRADE FACILITIES (ORDER_TYPE 1)
// Armory
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.ARMORY] |= (1n << 14n);  // Stock Armory

// Storehouse
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.STOREHOUSE] |= (1n << 15n);  // Trade Goods

// Gaming Hall
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.GAMING_HALL] |= (1n << 17n);  // Gambling Hall

// Stable
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.STABLE] |= (1n << 16n);  // Animals

// RECRUIT FACILITIES (ORDER_TYPE 2)
// Barrack
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.BARRACK] |= (1n << 18n);  // Bastion Defenders

// Adventurers' Guild
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.ADVENTURERS_GUILD] |= (1n << 19n);  // Adventurers' Guild Assignment

// Bakers' Guild
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.BAKERS_GUILD] |= (1n << 20n);  // Bakers' Guild Assignment

// Brewers' Guild
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.BREWERS_GUILD] |= (1n << 21n);  // Brewers' Guild Assignment

// Masons' Guild
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.MASONS_GUILD] |= (1n << 22n);  // Masons' Guild Assignment

// Shipbuilders' Guild
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SHIPBUILDERS_GUILD] |= (1n << 23n);  // Shipbuilders' Guild Assignment

// Thieves' Guild
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.THIEVES_GUILD] |= (1n << 24n);  // Thieves' Guild Assignment

// Menagerie
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.MENAGERIE] |= (1n << 25n);  // Creature

// Teleportation Circle
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.TELEPORTATION_CIRCLE] |= (1n << 26n);  // Spellcaster

// War Room
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.WAR_ROOM] |= (1n << 27n);  // Lieutenants
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.WAR_ROOM] |= (1n << 28n);  // Soldiers

// HARVEST FACILITIES (ORDER_TYPE 3)
// Food Garden
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.FOOD_GARDEN] |= (1n << 31n);  // Food Rations (Garden Growth)

// Herb Garden
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.HERB_GARDEN] |= (1n << 32n);  // Healer's Kit (Garden Growth)
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.HERB_GARDEN] |= (1n << 33n);  // Healing Potion (Garden Growth)

// Poison Garden
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.POISON_GARDEN] |= (1n << 34n);  // Antitoxin (Garden Growth)
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.POISON_GARDEN] |= (1n << 35n);  // Basic Poison (Garden Growth)

// Decorative Garden
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.DECORATIVE_GARDEN] |= (1n << 29n);  // Perfume (Garden Growth)
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.DECORATIVE_GARDEN] |= (1n << 30n);  // Candles (Garden Growth)

// Greenhouse
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.GREENHOUSE] |= (1n << 36n);  // Healing Herbs
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.GREENHOUSE] |= (1n << 37n);  // Poison

// Reliquary
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.RELIQUARY] |= (1n << 38n);  // Talisman

// RESEARCH FACILITIES (ORDER_TYPE 4)
// Archive
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.ARCHIVE] |= (1n << 39n);  // Helpful Lore

// Library
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.LIBRARY] |= (1n << 40n);  // Topical Lore

// Pub
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.PUB] |= (1n << 41n);  // Information Gathering

// Trophy Room
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.TROPHY_ROOM] |= (1n << 42n);  // Lore
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.TROPHY_ROOM] |= (1n << 43n);  // Trinket Trophy

// EMPOWER FACILITIES (ORDER_TYPE 5)
// Demiplane
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.DEMIPLANE] |= (1n << 44n);  // Arcane Resilience

// Meditation Chamber
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.MEDITATION_CHAMBER] |= (1n << 45n);  // Inner Peace

// Observatory
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.OBSERVATORY] |= (1n << 46n);  // Eldritch Discovery

// Sanctum
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.SANCTUM] |= (1n << 47n);  // Fortifying Rites

// Theater
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.THEATER] |= (1n << 48n);  // Theatrical Event

// Training Area
FAC_INTRINSICS.prods_contained[FAC_BY_NAMES.TRAINING_AREA] |= (1n << 49n);  // Training

// Initialize size values ( by ID )
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
FAC_INTRINSICS.order_type[FAC_BY_NAMES.ARCANE_STUDY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.LABORATORY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.SACRISTY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.SANCTUARY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.SCRIPTORIUM] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.SMITHY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.WORKSHOP] = 0;

// TRADE facilities (order_type 1)
FAC_INTRINSICS.order_type[FAC_BY_NAMES.ARMORY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.STOREHOUSE] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.GAMING_HALL] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.STABLE] = 1;

// RECRUIT facilities (order_type 2)
FAC_INTRINSICS.order_type[FAC_BY_NAMES.BARRACK] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.ADVENTURERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.BAKERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.BREWERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.MASONS_GUILD] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.SHIPBUILDERS_GUILD] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.THIEVES_GUILD] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.MENAGERIE] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.TELEPORTATION_CIRCLE] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.WAR_ROOM] = 2;

// HARVEST facilities (order_type 3)
FAC_INTRINSICS.order_type[FAC_BY_NAMES.FOOD_GARDEN] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.HERB_GARDEN] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.POISON_GARDEN] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.DECORATIVE_GARDEN] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.GREENHOUSE] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.RELIQUARY] = 3;

// RESEARCH facilities (order_type 4)
FAC_INTRINSICS.order_type[FAC_BY_NAMES.ARCHIVE] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.LIBRARY] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.PUB] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.TROPHY_ROOM] = 4;

// EMPOWER facilities (order_type 5)
FAC_INTRINSICS.order_type[FAC_BY_NAMES.DEMIPLANE] = FAC_INTRINSICS.order_type[FAC_BY_NAMES.MEDITATION_CHAMBER] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.OBSERVATORY] = FAC_INTRINSICS.order_type[FAC_BY_NAMES.SANCTUM] =
FAC_INTRINSICS.order_type[FAC_BY_NAMES.THEATER] = FAC_INTRINSICS.order_type[FAC_BY_NAMES.TRAINING_AREA] = 5;




let PLAYERS_ROLL20_PID_LOCAL_GID_TABLE = {
    GID: 0,
    "": {roll20_id: "", local_gid: 0},
    "": {roll20_id: "", local_gid: 1},
    "": {roll20_id: "", local_gid: 2},
    "": {roll20_id: "", local_gid: 3},
    "": {roll20_id: "", local_gid: 4},
    "": {roll20_id: "", local_gid: 5},
    "": {roll20_id: "", local_gid: 6},
    "": {roll20_id: "", local_gid: 7},
};

let PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE = {
    0: {roll20_id: "", player_name: ""},
    1: {roll20_id: "", player_name: ""},
    2: {roll20_id: "", player_name: ""},
    3: {roll20_id: "", player_name: ""},
    4: {roll20_id: "", player_name: ""},
    5: {roll20_id: "", player_name: ""},
    6: {roll20_id: "", player_name: ""},
    7: {roll20_id: "", player_name: ""},
};

const ROLL20_ID_LOOKUP = new Set()


const MAX_PLAYERS = 8;
const PLAYERS_INFO_FACILITY_TABLE = {
    facilities: new BigUint64Array(MAX_PLAYERS),
    facilitie_count: new Uint8Array(MAX_PLAYERS),
    scheduled_orders: new BigUint64Array(MAX_PLAYERS),
    available_orders: new Uint8Array(MAX_PLAYERS),
};

if (!BASTION_META.players_can_add_initalised){
    const FAC_PLAYERS_AVAILABLE_TO_ADD = (() => {
        const accum = {
            0: new Set(),
            1: new Set(),
            2: new Set(),
            3: new Set(),
            4: new Set(),
            5: new Set(),
            6: new Set(),
            7: new Set(),
        };
        for (let i = 0; i < 8; i++){
            for(let j = 0; j < FAC_BY_NAMES.FAC_COUNT; j++){
                const bastion_tier_level = BASTION_META.active_tier;
                if(FAC_INTRINSICS.level[j] === bastion_tier_level){
                    accum[i].add(j);
                }
            }
        };
        return accum;
    })();
    BASTION_META.fac_av_to_add = FAC_PLAYERS_AVAILABLE_TO_ADD;
    BASTION_META.players_can_add_initalised = true;
};




const PLAYERS_INFO_INVENTORY_TABLE = {
    items_name: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS*MAX_PLAYERS),
    items_count: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS*MAX_PLAYERS),
};

const PLAYERS_RESOURCE_TABLE = {
    gold: new Uint32Array(MAX_PLAYERS),
};



function fmsb(mask){
    if(typeof mask !== 'bigint'){mask = BigInt(mask)}
    let msb = 0n;
    let i = 64n;
    while (i!=0n){
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
    if(typeof mask !== 'bigint'){mask = BigInt(mask)}
    let lsb = 0n;
    let max_search = 64;
    while((mask & (1n << lsb)) === 0n){
        if(max_search===0){break};
        lsb+=1n;
        max_search--;
    };
    return lsb;
};

function getPlayerGID(player_name){
    if(!(player_name in PLAYERS_ROLL20_PID_LOCAL_GID_TABLE)){return 'Player does not exist'}
    return PLAYERS_ROLL20_PID_LOCAL_GID_TABLE[player_name].local_gid;
};

function getPlayerNameByGID(gid){
    return PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE[gid].player_name;
};

function getPlayerNameByRoll20ID(roll20_playerid){
    for (let i = 0; i < 8; i++){
        if(PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE[i].roll20_id === roll20_playerid){
            return PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE[i].player_name;
        };
    };
};


function addPlayer(player_name, roll20_playerid){
    player_name = player_name.split(" ")[0];
    const gid = PLAYERS_ROLL20_PID_LOCAL_GID_TABLE.GID;
    if (gid >7){
        return "Max Players Capacity (8) reached";
    };
    if (!PLAYERS_ROLL20_PID_LOCAL_GID_TABLE[player_name]){
        PLAYERS_ROLL20_PID_LOCAL_GID_TABLE[player_name] = {roll20_id: roll20_playerid, local_gid: gid};
        PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE[gid] = {roll20_id: roll20_playerid, player_name: player_name};
        ROLL20_ID_LOOKUP.add(roll20_playerid);
        PLAYERS_ROLL20_PID_LOCAL_GID_TABLE.GID++;
    }else{
        return `${player_name} already exists`;
    };
    return `Player ${player_name} registered.`;
};

function getFacilityOrderType(fac_id){
    const order_id = FAC_INTRINSICS.order_type[fac_id];
    return order_id;
};



set_cur_bastion_lvl_and_av_to_add(9)
function add_facility(fac_id, player_id){
    console.assert(typeof player_id === 'number', "add_facility player_id is not a number")
    console.assert(typeof fac_id === 'number', "add_facility fac_id is not a number")
    // player_id = player_id.toString();
    const facility_level = FAC_INTRINSICS.level[fac_id];
    const facility_name = FAC_BY_ID[fac_id];

    const player_name = PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE[player_id].player_name;

    const validate_adding_facility = handle_and_validate_player_adding_facility(player_id, fac_id)
    if(!validate_adding_facility){
        const bastion_current_tier = get_current_bastion_tier();
        const bastion_fac_max_level = BASTION_META.fac_levels_for_tier[bastion_current_tier];
        if (facility_level > bastion_fac_max_level){
            return ERROR_HANDLER.fac_add.fac_level_too_high(facility_name,facility_level, bastion_fac_max_level)
        };


        if (PLAYERS_INFO_FACILITY_TABLE.facilitie_count[player_id] >= BASTION_META.fac_max_for_level[bastion_current_tier]){
            return ERROR_HANDLER.fac_add.reached_max_for_level;
        };

        const guilds_start_id = FAC_BY_NAMES.ADVENTURERS_GUILD;
        const guilds_end_id = FAC_BY_NAMES.THIEVES_GUILD;
        if (fac_id >= guilds_start_id && fac_id <= guilds_end_id){
            for (let i = BigInt(guilds_start_id); i <= BigInt(guilds_end_id); i++){
                if ((player_fac_mask & (1n << i)) && (i === BigInt(fac_id))){
                    return ERROR_HANDLER.fac_add.guildhall(facility_name)
                };
            };
        }

        const player_fac_mask = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id];
        if (!FAC_MORE_THAN_ONE.has(fac_id) && (player_fac_mask & 1n << BigInt(fac_id))!==0n){
            return ERROR_HANDLER.fac_add.fac_duplicate(facility_name)
        };
    };

    let fac_key_level;
    switch (facility_level) {
        case 5: fac_key_level = 'fac_perms_lvl_5'; break;
        case 9: fac_key_level = 'fac_perms_lvl_9'; break;
        case 13: fac_key_level = 'fac_perms_lvl_13'; break;
        case 17: fac_key_level = 'fac_perms_lvl_17'; break;
    };




    PLAYERS_INFO_FACILITY_TABLE[fac_key_level][player_id]++;
    PLAYERS_INFO_FACILITY_TABLE.facilitie_count[player_id]++;
    PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] |= 1n << BigInt(fac_id);


    return [facility_name, player_name];
};

function remove_facility(fac_id, player_id){
    PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] &= ~(1n << BigInt(fac_id));
    BASTION_META.fac_av_to_add[player_id].add(fac_id);
};

function playerHasOrderQueued(prod_id, player_id){
    console.assert(typeof player_id === 'number', `playerHasOrderQueued - player_id is not a number`);
    console.assert(typeof prod_id === 'number', `playerHasOrderQueued - prod_id is not a number`);

    if((PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id] & (1n<<BigInt(prod_id))) === 0n){
        return false;
    }
    return true;

};

function start_order(prod_id,player_id){
    console.assert(typeof player_id === 'number', `start_order - player_id is not a number`);
    console.assert(typeof prod_id === 'number', `start_order - prod_id is not a number`);

    const facility_origin_id = FAC_BY_NAMES[getProductFacilityOrigin(prod_id)];
    if(!(facility_origin_id in FAC_PROD_IDS)){
        return `Product ${FAC_PROD_IDS[prod_id]} not found`;
    };
    const player_facilities = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id];
    const prod_req_gold = FAC_PROD_IDS[prod_id].cost_gold;
    if (prod_req_gold > PLAYERS_RESOURCE_TABLE.gold[player_id]){
        return `Order costs ${prod_req_gold} gold and you only have ${PLAYERS_RESOURCE_TABLE.gold[player_id]} gold`;
    };
    if((player_facilities & (1n<<BigInt(facility_origin_id)))!==0n){
        const check_order_exists = playerHasOrderQueued(prod_id,player_id);
        if(check_order_exists){
            return `Order for ${FAC_PROD_IDS[prod_id]} is already in queue`;
        };
        PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id] |= (1n << BigInt(prod_id));
        return 'Order Successfully Started';
    };
    return `Order wasn't started, because you don't have facility ${FAC_BY_ID[facility_origin_id]}`;
};

function finish_order(prod_id, player_id){
    console.assert(typeof player_id === 'number', `finish_order - player_id is not a number`);
    console.assert(typeof prod_id === 'number', `finish_order- prod_id is not a number`);

    const totals = FAC_PROD_IDS.TOTAL_PRODS;
    const id_offset = totals*player_id;
    PLAYERS_INFO_INVENTORY_TABLE.items_name[prod_id+id_offset] = prod_id;
    PLAYERS_INFO_INVENTORY_TABLE.items_count[prod_id+id_offset] += 1;
    PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id] &= ~(1n << BigInt(prod_id));
};

function view_player_active_orders(player_id){
    console.assert(typeof player_id === 'number', `view_player_active_orders - player_id is not a number`);

    const player_mask = PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id];
    const msb = fmsb(player_mask);
    let lsb = flsb(player_mask);
    let products = [];
    while (lsb<=msb){
        if ((player_mask & (1n<<lsb))!==0n){
            products.push(Number(lsb))
        };
        lsb++;
    };
    if(products.length===0){
        return ERROR_HANDLER.ord_status.no_active_orders;
    }
    return products;
};

function remove_underscores_and_fix_fac_upper_lower_case(name){
    console.assert(typeof name === 'string', `remove_underscores_and_fix_fac_upper_lower_case Name ${name} is not a string`);
    return name
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

function getProductFacilityOrigin(prod_id){
    console.assert(typeof prod_id === 'number', `getProductFacilityOrigin - prod_id is not bigint`);
    for(let i = 0n; i<FAC_INTRINSICS.prods_contained.length;i++){
        if ((FAC_INTRINSICS.prods_contained[i] & (1n<<BigInt(prod_id))) !== 0n){
            return FAC_BY_ID[i];
        };
    };
    return false;
};

function viewPlayerInventory(player_id){
    console.assert(typeof player_id === 'number', `viewPlayerInventory - player_id is not a number`);
    const total_prods = FAC_PROD_IDS.TOTAL_PRODS;
    const lower_bound = player_id*total_prods;
    const upper_bound = lower_bound + total_prods;
    let collect_names = [];
    let collect_count = [];
    for (let i = lower_bound; i <= upper_bound; i++){
        const norm_idx = i % FAC_PROD_IDS.TOTAL_PRODS;
       if (PLAYERS_INFO_INVENTORY_TABLE.items_name[lower_bound+norm_idx] !== 0){
            const prod_name = FAC_PROD_IDS[norm_idx];
            collect_names.push(prod_name)
        };
       if (PLAYERS_INFO_INVENTORY_TABLE.items_count[lower_bound+norm_idx] !== 0){
            const count = PLAYERS_INFO_INVENTORY_TABLE.items_count[lower_bound+norm_idx];
            collect_count.push(count);
        };

    };
    return [collect_names, collect_count];
};

function  viewPlayerFacilities(player_id){
    console.assert(typeof player_id === 'number', `viewPlayerFacilities - player_id is not a number`);
    const facilities = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id]
    const ubound = fmsb(facilities);
    const lbound = flsb(facilities);
    let collect_fac_data = [];
    for (let i = lbound; i <= ubound; i++){
        //I have to use 0n here because Roll20 is using  Node and it does not do proper type coercion
        //With Bun, locally, it's not need
        if ((facilities & (1n<<i))!==0n){
            collect_fac_data.push(FAC_BY_ID[i])
        };
    };
    return collect_fac_data;
};

//TODO: Rename since it's not really an adjacency list anymore.
const DM_CMD_MAP = {
    gm_menu: {
        header: "Main Menu - DM",
        buttons: [
                {name: "Add Unregistered Players", command: '@gm_add_unreg_players'},
                {name: "Remove Players From List", command: '@gm_remove_reg_players'},
                {name: "Time Skip", command: '@gm_timeskip'},
                {name: "Award Gold To Players", command: '@gm_award_gold'},

            ],
    },
    gm_award_gold: (gold_amount) => {


            const current_total_players = PLAYERS_ROLL20_PID_LOCAL_GID_TABLE.GID;
            for(let i = 0; i < current_total_players;i++){
                PLAYERS_RESOURCE_TABLE.gold[i] += gold_amount;
            };

    },
    gm_add_unreg_players: () =>  {
            const all_players = findObjs({
                type: "player",
            });
            const new_players = [];

            for (let i = 0; i < all_players.length; i++){
                if (!ROLL20_ID_LOOKUP.has(all_players[i].get("_id"))){
                    const player_name = all_players[i].get("displayname").split(" ")[0];
                    addPlayer(player_name, all_players[i].get("_id"))
                    const new_player_id = getPlayerGID(player_name);
                    new_players.push({name: player_name, command: `@gm_view_player ${new_player_id}`})
                }
            };
            if (new_players.length === 0){
                return {
                    header: "No New Players",
                    buttons: [{name: "All players are already registered", command: "@gm_menu"}],
                };
            };
        return {
            header: "New Players Added",
            buttons: new_players,
    }
    },

    gm_timeskip: {
        header: "Main Menu - DM",
        buttons: [
                    {name: "Add Players From List", command: '@gm_view_unreg_players'},
                ],
    },

};

//An addable facility is an addable facility in a set with facilities that can be added.
//If it can't be added anymore, then it is not in the set of addable facilities.
function handle_and_validate_player_adding_facility(player_id,fac_id){
    console.assert(typeof player_id === 'number', "construct_player_buttons_bylvl - player_id is not a number");
    console.assert(typeof fac_id === 'number', "construct_player_buttons_bylvl -  fac_id is not a number");
    const player_can_add = BASTION_META.fac_av_to_add[player_id].has(fac_id);
    if(player_can_add){
        if(FAC_MORE_THAN_ONE.has(fac_id)){
            return true;
        }else{
            BASTION_META.fac_av_to_add[player_id].delete(fac_id);
            return true;
        };
    }
    return false;
};




function construct_player_buttons_bylvl(player_id, fac_lvl){
    console.assert(typeof player_id === 'number', "construct_player_buttons_bylvl - player_id is not a number");
    const player_facilities = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id];
    const fac_buttons = [];
    const fac_count = BigInt(FAC_BY_NAMES.FAC_COUNT);
    for(let i = 0n; i < fac_count; i++){
        const fac_name = FAC_BY_NAMES[i]
        const can_have_multiples = FAC_MORE_THAN_ONE.has(fac_name);
        if (((player_facilities & (1n<<i))===0n) && (FAC_INTRINSICS.level[i]===fac_lvl)){
            const fac_name_formatted = remove_underscores_and_fix_fac_upper_lower_case(FAC_BY_ID[i]);
            fac_buttons.push(
                {name: `${fac_name_formatted}`, command: `@fac_add ${Number(i)}`}
            )
        };
    }
    if(fac_buttons.length>0){
        return fac_buttons;
    }
    return {
        buttons: [
            {name: `No facilities found. Go to your facilities`, command: `@fac_view ${player_id}`}
        ]
    }
};

//TODO: Rename since it's not really an adjacency list anymore.
const PLAYERS_CMD_MAP = {
    menu: {
        header: "Main Menu",
        buttons: [
                    {name: "Facilities List", command: '@facilities'},
                    {name: "Ongoing Orders", command: '@orders'},
                    {name: "Bastion Inventory", command: '@binventory'},
                    {name: "Bastion Help&Info", command: '@hni'},
                    {name: "View Facilities", command: '@fac_view'},
                ],
    },
    fac_view: (player_id) => {
        const collected_buttons = [];

        const fac_table = viewPlayerFacilities(player_id);
        const formatted_names = fac_table.map(facility_name => {
            return remove_underscores_and_fix_fac_upper_lower_case(facility_name)
        })
        for (let i = 0; i < fac_table.length; i++){
            collected_buttons.push({name: formatted_names[i], command: '@fac_editview ' + fac_table[i]})
        };

        if (fac_table.length === 0){
            return {
                header: "You Have No Facilities Yet",
                buttons: [{name: "Go to facilities list", command: '@facilities'}],
            };
        };

        return {
            header: "Your Facilities",
            buttons: collected_buttons,
        }
    },
    facilities:{
        header: "Facilities By Level",
        buttons:[
                    {name: "Level 5", command:"@fac_lvl5"},
                    {name: "Level 9", command:"@fac_lvl9"},
                    {name: "Level 13", command:"@fac_lvl13"},
                    {name: "Level 17", command:"@fac_lvl17"},
                ],
    },
    fac_levels: (fac_level, player_id) => {
        return {
            header: `Vieweing Level ${fac_level} Facilities`,
            buttons: construct_player_buttons_bylvl(player_id, fac_level)
        }
    },
    fac_add: (fac_id,player_id) => {
        console.assert(typeof fac_id==='number', "Facility name is not a string!");
        console.assert(typeof player_id==='number', "Player ID is not a number!");

        const facility_result = add_facility(fac_id,player_id);
        if (!facility_result){
            return facility_result;
        };
        const fac_name_unformatted = facility_result[0];
        const fac_name_formatted = remove_underscores_and_fix_fac_upper_lower_case(facility_result[0]);
        return {
            header: `Successfully added ${fac_name_formatted} to ${facility_result[1]}`,
            buttons: [
                {name: `Go back to your facilities view`, command: "@fac_view"},
                {name: `View added facility ${fac_name_formatted}`, command: `@fac_editview ${FAC_BY_NAMES[fac_name_unformatted]}`},
            ],
        }
    },
    fac_editview: (fac_id, player_id) => {
        console.assert(typeof fac_name==='string', "Facility name is not a string!");
        console.assert(typeof player_id==='number', "Player ID is not a number!");

        const fac_name = FAC_BY_ID[fac_id];
        const formatted_name = remove_underscores_and_fix_fac_upper_lower_case(fac_name);

        console.assert(typeof fac_player_orders!==BigInt, "fac_editview fac_player_orders is not BigInt")

        const fac_comp_buttons = [];
        const fac_prods = FAC_INTRINSICS.prods_contained[fac_id];
        const fac_mask_start = flsb(fac_prods);
        const fac_mask_stop = fmsb(fac_prods);

        for (let i = fac_mask_start; i <= fac_mask_stop; i++){
            if ((fac_prods & (1n<<i)) !== 0n){
                const format_order_name = remove_underscores_and_fix_fac_upper_lower_case(FAC_PROD_IDS[i]);
                fac_comp_buttons.push({name: `Start order for ${format_order_name}`, command: `@ord_start ${FAC_PROD_IDS[i]}`});
            };
        }

        const player_active_orders = view_player_active_orders(player_id)
        if(player_active_orders[0]!==-1){
            for (let i = player_mask_start; i <= player_mask_stop; i++ ){
                fac_comp_buttons.push({
                    name: `Active Order: ${player_active_orders[i]}`
                });
            }
        }else{
            fac_comp_buttons.push({
                name: player_active_orders[1]
            })
        }

        return {
            header: `Currently Viewing ${formatted_name}`,
            buttons: fac_comp_buttons,
        };
    },
    orders:{
        header: 'Your Current Orders',
        buttons: (player_id) => {
            console.assert(typeof player_id === 'number',"CMD_ADJ_LIST_TABLE.orders: Player ID is not a number!");
            const player_orders = view_player_active_orders(player_id);

            if(player_orders.length===0){
                return [
                    [{name:'No orders scheduled. Click to view facilities', command: '!bastion @facilities'}]
                ]
            };
            const prod_buttons = [];
            for (let i = 0; i < player_orders.length; i++){
                const prod_name = remove_underscores_and_fix_fac_upper_lower_case(FAC_PROD_IDS[player_orders[i]]);
                const facility_origin_formatted = remove_underscores_and_fix_fac_upper_lower_case(getProductFacilityOrigin(player_orders[i]));
                const facility_origin_unformatted = getProductFacilityOrigin(player_orders[i]);
                prod_buttons.push({
                    name: `Product: ${prod_name} Facility: ${facility_origin_formatted}`, command: `@fac_editview ${FAC_BY_NAMES[facility_origin_unformatted]}`
                });
            }
            console.assert(prod_buttons.length > 0, "orders - buttons prod_buttons is empty")
            return prod_buttons;
        },
    },
    //Not using product id as param here, because in fac_editview I am doing @ord_start + fac name
    //since I am using this on roll20, and I am tired dealing with it not handling big ints.
    //Everything works locally but then I have to adjust on roll20, so I'll instead just deal with the result
    //and convert internally in the function's scope into their ids.
    ord_start: (product_name, player_id) => {
        console.assert(typeof product_name==='string', "Product name is not a string");
        console.assert(typeof player_id==='number', "Player ID is not a number");

        const product_id = FAC_PROD_NAMES[product_name];
        const fac_player_orders = view_player_active_orders(player_id);
        if(fac_player_orders.length>0){return null};
        const product_name_formatted = remove_underscores_and_fix_fac_upper_lower_case(FAC_PROD_IDS[product_id]);
        for(let i = 0; i < fac_player_orders.length; i++){
            if((Number(fac_player_orders[i]) === product_id)){
                return {
                    header: `${product_name_formatted} Already Scheduled`,
                    buttons: [{
                        name: `Click to complete order and start a new one`, command: `@ord_finish ${product_id} ${player_id}`,
                        name: `Return to Orders Status`, command: `@ord_status ${product_id} ${player_id}`,
                    }],
                };
            };
        };
        const started_order = start_order(product_id, player_id);
        if(!started_order){
            return started_order;
        };

        return {
            header: `Scheduled Order For ${product_name_formatted}`,
            buttons: [{
                name:`Return to Orders Status` , command: `@ord_status ${product_id} ${player_id}`,
            }]
        };
    },
    ord_finish: (product_id, player_id) => {
        const fac_player_orders = view_player_active_orders(player_id);

        //Player has no active orders
        if(fac_player_orders.length>0){return null};

        const product_name_formatted = remove_underscores_and_fix_fac_upper_lower_case(FAC_PROD_IDS[product_id]);
        for(let i=0; i < fac_player_orders?.length; i++){
            if(Number(fac_player_orders[i]) !== product_id){
                return {
                    header: `${product_name_formatted} Not Found As Scheduled`,
                    buttons: [{
                        name: `Click to start order for ${product_name_formatted}`, command: `@ord_start ${product_id} ${player_id}`,
                        name: `Return to Orders Status`, command: `@ord_status ${product_id} ${player_id}`,
                    }]
                };
            };
        };
        finish_order(product_id, player_id);
        return {
            header: `Order ${product_name_formatted} completed`,
            buttons: [{
                name: `Return to Orders Status`, command: `@ord_status ${product_id} ${player_id}`,
            }]
        }
    },
    ord_status: (player_id) => {
        console.assert(typeof player_id==='number', "ord_status Player ID is not a number");
        const fac_player_orders = view_player_active_orders(player_id);

        //Player has no active orders
        if(fac_player_orders.length>0){
            return ERROR_HANDLER.ord_status.no_active_orders;
        };

        const fac_player_orders_buttons = [];
        for (let i = 0; i < fac_player_orders.length; i++){
            const product_id = Number(fac_player_orders[i])
            const product_name_formatted = remove_underscores_and_fix_fac_upper_lower_case(FAC_PROD_IDS[product_id]);
            fac_player_orders_buttons.push({name: `${product_name_formatted}`, command: null})
        };
        return {
            header: "Your Current Active Orders",
            buttons: fac_player_orders_buttons,
        }
    },
    ord_info: (prod_id) => {
        console.assert(typeof prod_id === 'number', "ord_info prod_id is not a number");
        const prod_info = FAC_PROD_IDS[prod_id];
        return remove_underscores_and_fix_fac_upper_lower_case(prod_info);

    },
    ord_info_effect: (effect_id) => {
        const ddb_link = SPECIAL_EFFECTS_DDB_LINKS[effect_id];
        return ddb_link;
    },
    fac_info: (fac_id) => {
        const facility_prods = FAC_INTRINSICS.prods_contained[fac_id];
        const prods_lower = flsb(facility_prods);
        const prods_upper = fmsb(facility_prods);
        const fac_name = remove_underscores_and_fix_fac_upper_lower_case(FAC_BY_ID[fac_id]);
        const collect_info = [];
        for(let i = prods_lower; i <= prods_upper; i++){
            if((facility_prods & (1n<<i)) !== 0n){
                const formatted_prod_name = remove_underscores_and_fix_fac_upper_lower_case(FAC_PROD_IDS[i]);
                const order_type = remove_underscores_and_fix_fac_upper_lower_case(ORDER_TYPES[getFacilityOrderType(fac_id)])
                collect_info.push({name: `${formatted_prod_name} (Order: ${order_type})`, command: `!bastion @ord_info ${Number(i)}`})
            }
        };
        console.assert(collect_info.length !== 0, "fac_info collect_info array is empty")
        return {
            header: `${fac_name} Orders`,
            buttons: collect_info,
        };
    },

};



function createTableNavMenu(btn_list, gm_menu=false){
    console.assert(btn_list.buttons.length > 0, "createTableNavMenu btn_list array is empty");
    console.assert(gm_menu !== Boolean, "createTableNavMenu gm_menu is not a boolean");

    let main_menu = "@menu";
    if (gm_menu){main_menu = "@gm_menu"};

    let table_HTML = '<table style="width:80%; margin:auto; border-collapse:collapse; background-color:#8a2be2;">';
    table_HTML += `<tr><th style="background-color:#8a2be2; padding:10px;border-bottom:2px solid; font-size:16px; text-align:center;">${btn_list.header}</th></tr>`;
    const buttons = btn_list.buttons;
    const length = btn_list.buttons.length;

    for (let i = 0; i < length;i++){
        if(!btn_list.buttons[i].hasOwnProperty("command")){
            table_HTML += `<tr><td style="padding:8px; color:white; border-bottom:1px solid white; text-align:center;"><p style="background-color:#8a2be2; width:auto;height:auto; text-decoration:none; display:block">${buttons[i].name}</p></td></tr>`;
            continue
        }
        table_HTML += `<tr><td style="padding:8px; color:white; border-bottom:1px solid white; text-align:center;"><a style="background-color:#8a2be2; width:auto;height:auto; text-decoration:none; display:block" href="!bastion ${buttons[i].command}">${buttons[i].name}</a></td></tr>`;
    }

    table_HTML += '</table>';

    table_HTML += '<div style="text-align:center; margin-top:15px;">';
    table_HTML += `<a style="background-color:#8a2be2; color:white; padding:8px 15px; border-radius:5px; text-decoration:none;" href="!bastion ${main_menu}">Return to Menu</a>`;
    table_HTML += '</div>'
    return table_HTML;
};


//TODO: Add more GM commands / remove unnecessary ones ( maybe automatically add players the first time they login ).
const NAVIGATOR_GM_MENU = new Set(["gm_menu", "gm_add_unreg_players", "gm_remove_reg_players", "gm_timeskip", "gm_award_gold"]);

const NAVIGATOR_MENU = new Set(["menu", "facilities", "orders", "fac_lvl5", "fac_lvl9", "fac_lvl13", "fac_lvl17"]);
const NAVIGATOR_FAC_OPS = new Set(["fac_add","fac_remove","fac_view","fac_editview","fac_info"]);
const NAVIGATOR_FAC_ORDERS_OPS = new Set(["ord_start","ord_finish","ord_status","ord_history","ord_info"]);



addPlayer("Storm");
add_facility(FAC_BY_NAMES.SMITHY,0);
add_facility(FAC_BY_NAMES.DECORATIVE_GARDEN,0);
log(add_facility(FAC_BY_NAMES.WAR_ROOM,0));
log(start_order(4,0))


const msg = {
    type: "api",
    content: "!bastion @fac_lvl5 0"
};



function handleMSG(){
    if(msg.type === "api" && msg.content.startsWith("!bastion @gm")){
    }else if(msg.type === "api" && msg.content.startsWith("!bastion ")){
        const parts = msg.content.split(" ");
        const command = parts[1].substring(1).trim();
        if(NAVIGATOR_MENU.has(command) || NAVIGATOR_FAC_OPS.has(command) || NAVIGATOR_FAC_ORDERS_OPS.has(command)){
            let player_view;
            let table_view_config;
            switch (command) {
                case 'menu':
                case 'facilities':
                    table_view_config = PLAYERS_CMD_MAP[command];
                    if (table_view_config[0] === -1){
                        return table_view_config[1];
                    }
                    player_view = createTableNavMenu(table_view_config);
                    break;
                case 'orders':
                    table_view_config = {
                        header: PLAYERS_CMD_MAP[command].header,
                        buttons: PLAYERS_CMD_MAP[command].buttons(0),
                    };
                    player_view = createTableNavMenu(table_view_config);
                    break;
                case 'fac_lvl5':
                case 'fac_lvl9':
                case 'fac_lvl13':
                case 'fac_lvl17':
                    const fac_level = parseInt(command.split("lvl")[1]);
                    table_view_config = PLAYERS_CMD_MAP["fac_levels"](fac_level, 0)
                    player_view = createTableNavMenu(table_view_config)
                    break;
                case 'fac_add':
                case 'fac_remove':
                case 'fac_view':
                case 'fac_editview':
                case 'fac_info':
                case 'ord_start':
                case 'ord_finish':
                case 'ord_history':
                case 'ord_info':
                    break;
            }
            return player_view
        }else{
            return `Invalid command ${command}`;
        }
    }
};
log("Handler: ", handleMSG());

