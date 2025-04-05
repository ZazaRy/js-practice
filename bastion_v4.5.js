const log = console.log;

const MAX_PLAYERS = 8;
const MAX_BASTION_FAC = 8;
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

const ERROR_HANDLER = {
    global_id: -1,
    gm_menu: {},
    gm_add_unreg_players: {
        max_reached: "Cannot add more players. Maximum of 8 players for game reached",
    },
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
            console.assert(typeof fac_name === 'string', "garden fac_name should be a string");
            const format_name = mut_underscore_and_cases_in_name(fac_name)
            return [-1,`You can only have one Garden Type. You currently own a ${format_name}`];
        },
        guildhall: (fac_name) => {
            console.assert(typeof fac_name === 'string', "guildhall fac_name should be a string");
            const format_name = mut_underscore_and_cases_in_name(fac_name)
            return [-1,`You can only have one Guildhall Type. You currently own a ${format_name}`];
        },
        fac_duplicate: (fac_name) => {
            console.assert(typeof fac_name === 'string', "fac_duplicate fac_name should be a string");
            const format_name = mut_underscore_and_cases_in_name(fac_name)
            return [-1,`You already own ${format_name}`];
        },
        fac_level_too_high: (fac_name,fac_level, bastion_tier_level) => {
            console.assert(typeof fac_name === 'string', "fac_level_too_high fac_name should be a string");
            console.assert(typeof fac_level === 'number', "fac_level_too_high fac_level should be a number");
            console.assert(typeof bastion_tier_level === 'number', "fac_level_too_high bastion_tier_level should be a number");
            const fac_formatted_name = mut_underscore_and_cases_in_name(fac_name)
            return [-1,`Cannot add ${fac_formatted_name} of level ${fac_level} when the Bastion's Tier Level is ${bastion_tier_level}`];
        },
        reached_max_for_level: (fac_name) => {
            const fac_formatted_name = mut_underscore_and_cases_in_name(fac_name);
            return [-1,`Cannot add ${fac_formatted_name}, because you reached the maximum number of facilities for this level.`];
        },

    },
    fac_remove: {},
    fac_view: {},
    fac_editview: {
    },
    ord_start: {
        already_queued: (prod_id) => {
            console.assert(typeof fac_level === 'number', "already_queued prod_id should be a number");
            const format_name = mut_underscore_and_cases_in_name(PRODS_BY_ID[prod_id].name)
            return [-1,`${format_name} Already In Queue`];
        },
    },
    ord_finish: {},
    ord_status: {
        no_active_orders: [-1,"You have no active orders"]
    },
    ord_history: {},
};



const BASTION_META = {
    active_tier: 0,
    fac_levels_for_tier: new Uint8Array([5,9,13,17]),
    fac_max_count_for_level: new Uint8Array([2,4,6,8]),

    gen_max_fac_count_for_level(){
        const idx_lookup = this.active_tier;
        const max_count_for_level = this.fac_max_count_for_level[idx_lookup];
        return max_count_for_level;
    },

    gen_max_fac_level_for_tier(){
        const idx_lookup = this.active_tier;
        const max_count_for_level = this.fac_levels_for_tier[idx_lookup];
        return max_count_for_level;
    },

    ACTIVE_TIER: {
    5: 0,
    9: 1,
    13: 2,
    17: 3,
    },
    mut_set_bastion_tier_level(level){
        this.active_tier = this.ACTIVE_TIER[level];
    },
};
Object.freeze(BASTION_META.ACTIVE_TIER);


function set_cur_bastion_lvl_and_av_to_add(level){
    const ACTIVE_TIER = {
        5: 0,
        9: 1,
        13: 2,
        17: 3,
    };
    BASTION_META.active_tier = ACTIVE_TIER[level];
};


const FAC_BY_NAMES = {
    length: 37,
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



const PRODS_BY_ID = {
    length: 50,

    // Product definitions with name, duration (in days), and cost (in gold)
    0: { name: "ARCANE_FOCUS", duration: 7, cost: 0 },
    1: { name: "BOOK", duration: 7, cost: 10 },
    2: { name: "ALCHEMIST_SUPPLIES", duration: 7, cost: 50 },
    3: { name: "CRAFT_POISON", duration: 7, cost: 50 },
    4: { name: "HOLY_WATER", duration: 7, cost: 0 },
    5: { name: "SACRED_FOCUS", duration: 7, cost: 0 },
    6: { name: "BOOK_REPLICA", duration: 7, cost: 0 },
    7: { name: "SPELL_SCROLL", duration: 7, cost: 50 },
    8: { name: "PAPERWORK", duration: 7, cost: 1 },
    9: { name: "ADVENTURING_GEAR", duration: 7, cost: 50 },
    10: { name: "MAGIC_ITEM_ARCANA", duration: 14, cost: 100 },
    11: { name: "MAGIC_ITEM_RELIC", duration: 14, cost: 100 },
    12: { name: "MAGIC_ITEM_ARMAMENT", duration: 14, cost: 100 },
    13: { name: "MAGIC_ITEM_IMPLEMENT", duration: 14, cost: 100 },
    14: { name: "STOCK_ARMORY", duration: 0, cost: 100 },
    15: { name: "TRADE_GOODS", duration: 7, cost: 500 },
    16: { name: "ANIMALS", duration: 7, cost: 50 },
    17: { name: "GAMBLING_HALL", duration: 7, cost: 0 },
    18: { name: "BASTION_DEFENDERS", duration: 0, cost: 0 },
    19: { name: "ADVENTURERS_GUILD_ASSIGNENT", duration: 8, cost: 0 },
    20: { name: "BAKERS_GUILD_ASSIGNENT", duration: 7, cost: 0 },
    21: { name: "BREWERS_GUILD_ASSIGNENT", duration: 7, cost: 0 },
    22: { name: "MASONS_GUILD_ASSIGNENT", duration: 10, cost: 0 },
    23: { name: "SHIPBUILDERS_GUILD_ASSIGNENT", duration: 10, cost: 1000 },
    24: { name: "THIEVES_GUILD_ASSIGNENT", duration: 8, cost: 0 },
    25: { name: "CREATURE", duration: 7, cost: 500 },
    26: { name: "SPELLCASTER", duration: 14, cost: 0 },
    27: { name: "LIEUTENANTS", duration: 7, cost: 0 },
    28: { name: "SOLDIERS", duration: 7, cost: 1 },
    29: { name: "PERFUME", duration: 7, cost: 0 },
    30: { name: "CANDLES", duration: 7, cost: 0 },
    31: { name: "FOOD_RATIONS", duration: 7, cost: 0 },
    32: { name: "HEALER_KIT", duration: 7, cost: 0 },
    33: { name: "HEALING_POTION", duration: 7, cost: 0 },
    34: { name: "ANTITOXIN", duration: 7, cost: 0 },
    35: { name: "BASIC_POISON", duration: 7, cost: 0 },
    36: { name: "HEALING_HERBS", duration: 7, cost: 0 },
    37: { name: "POISON", duration: 7, cost: 0 },
    38: { name: "TALISMAN", duration: 7, cost: 0 },
    39: { name: "HELPFUL_LORE", duration: 7, cost: 0 },
    40: { name: "TOPICAL_LORE", duration: 7, cost: 0 },
    41: { name: "INFORMATION_GATHERING", duration: 7, cost: 0 },
    42: { name: "LORE", duration: 7, cost: 0 },
    43: { name: "TRINKET_TROPHY", duration: 7, cost: 0 },
    44: { name: "ARCANE_RESILIENCE", duration: 7, cost: 0 },
    45: { name: "INNER_PEACE", duration: 7, cost: 0 },
    46: { name: "ELDRITCH_DISCOVERY", duration: 7, cost: 0 },
    47: { name: "FORTIFYING_RITES", duration: 7, cost: 0 },
    48: { name: "THEATRICAL_EVENT", duration: 21, cost: 0 },
    49: { name: "TRAINING", duration: 7, cost: 0 },

};

const PRODS_BY_NAME = Object.entries(PRODS_BY_ID).reduce((map,[id,obj]) => {
    map[obj.name] = parseInt(id);
    return map;
},{});



const FAC_SIZES = {
    0: {size: 4, name: "Cramped"},
    1: {size: 16, name: "Roomy"},
    2: {size: 32, name: "Vast"},
};

const ORDERS_BY_ID = {
    length: 5,
    0: "CRAFT",
    1: "TRADE",
    2: "RECRUIT",
    3: "HARVEST",
    4: "RESEARCH",
    5: "EMPOWER",
};

const FAC_INTRINSICS = {
    name: new Uint8Array(FAC_BY_NAMES.length),
    size: new Uint8Array(FAC_BY_NAMES.length),
    level: new Uint8Array(FAC_BY_NAMES.length),
    hirelings: new Uint8Array(FAC_BY_NAMES.length),
    order_type: new Uint8Array(FAC_BY_NAMES.length),
    upgradable: new Uint8Array(FAC_BY_NAMES.length),
    prods_contained: new BigUint64Array(FAC_BY_NAMES.length),
};

function filter_msb_in(mask){
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

function filter_lsb_in(mask){
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


function emit_facilityIDS_from_level(level){
    switch (level) {
        case 5:
            return new Uint8Array([
                FAC_BY_NAMES.ARCANE_STUDY, FAC_BY_NAMES.DECORATIVE_GARDEN, FAC_BY_NAMES.FOOD_GARDEN, FAC_BY_NAMES.HERB_GARDEN,
                FAC_BY_NAMES.POISON_GARDEN, FAC_BY_NAMES.SMITHY, FAC_BY_NAMES.BARRACK, FAC_BY_NAMES.STOREHOUSE, FAC_BY_NAMES.WORKSHOP,
                FAC_BY_NAMES.ARMORY, FAC_BY_NAMES.SANCTUARY, FAC_BY_NAMES.LIBRARY,
            ])
        case 9:
            return new Uint8Array([
                FAC_BY_NAMES.GAMING_HALL, FAC_BY_NAMES.GREENHOUSE, FAC_BY_NAMES.LABORATORY, FAC_BY_NAMES.SACRISTY, FAC_BY_NAMES.SCRIPTORIUM,
                FAC_BY_NAMES.STABLE, FAC_BY_NAMES.TELEPORTATION_CIRCLE, FAC_BY_NAMES.THEATER, FAC_BY_NAMES.TRAINING_AREA, FAC_BY_NAMES.TROPHY_ROOM,
            ])
        case 13:
            return new Uint8Array([
                FAC_BY_NAMES.ARCHIVE, FAC_BY_NAMES.MEDITATION_CHAMBER, FAC_BY_NAMES.MENAGERIE, FAC_BY_NAMES.OBSERVATORY, FAC_BY_NAMES.PUB,
                FAC_BY_NAMES.RELIQUARY,
            ])
        case 17:
            return new Uint8Array([
                FAC_BY_NAMES.DEMIPLANE, FAC_BY_NAMES.SANCTUM, FAC_BY_NAMES.WAR_ROOM, FAC_BY_NAMES.BAKERS_GUILD, FAC_BY_NAMES.MASONS_GUILD, FAC_BY_NAMES.BREWERS_GUILD,
                FAC_BY_NAMES.THIEVES_GUILD, FAC_BY_NAMES.ADVENTURERS_GUILD, FAC_BY_NAMES.SHIPBUILDERS_GUILD,
            ])
    }
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



// Resetting all prods_contained to 0n
for (let i = 0; i < FAC_INTRINSICS.prods_contained.length; i++) {
    FAC_INTRINSICS.prods_contained[i] = 0n;
}
// CRAFT FACILITIES (ORDER_TYPE 0)
// TODO: Should do BigInt() over the IDs in PRODS_BY_NAME[ID] in case I ever change the IDs.
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





const PLAYERS_REGISTRATION_TABLE = (() => {
    const data = new Proxy({
        0: {roll20_id: "", player_name: ""},
        1: {roll20_id: "", player_name: ""},
        2: {roll20_id: "", player_name: ""},
        3: {roll20_id: "", player_name: ""},
        4: {roll20_id: "", player_name: ""},
        5: {roll20_id: "", player_name: ""},
        6: {roll20_id: "", player_name: ""},
        7: {roll20_id: "", player_name: ""},

    },
        {
        success: (value) => {return Object.freeze({success: true, value})},
        // failure: (message) => {return Object.freeze({success: false, error: message})},
        get(registration, lookup){
                if(lookup === "GID"){return registration.GID};
                if(typeof Number(lookup) === 'number' && Number(lookup) in registration){
                    return this.success(registration[lookup])
                };
                if(typeof lookup === 'string'){
                    for (const key in registration){
                        if (registration[key]["player_name"] === lookup){
                            return this.success(key)
                        }
                    };
                };

                return false;
            },
        set(registration, key, newVal){
                if(key==="GID"){
                    registration.GID=newVal;
                    return true;
                };
                registration[key] = newVal;
                return true;
            },

        });
    return data
})();
Object.defineProperty(PLAYERS_REGISTRATION_TABLE, "GID",{
    value: 0,
    writable: true,
    enumerable: false,
});


function emit_array_from(mask){
    const l = filter_lsb_in(mask);
    const r = filter_msb_in(mask);
    let count = 0;
    const collect_non_zero = new Uint8Array(Number(r-l));
    for(let i = l; i < r; i++){
        collect_non_zero[count] = Number(i);
        count++;
    };
    return collect_non_zero;
};



function filter_facilityID_with_productID(product_id){
    console.assert(typeof product_id === 'number', "filter_facilityID_with_productID - product_id should be a number");


    const fac_length = FAC_BY_NAMES.length;
    const prod_length = PRODS_BY_ID.length;
    for(let fac_id = 0;fac_id<fac_length;fac_id++){
        for(let prod_id=product_id;prod_id<prod_length;prod_id++){
            if(FAC_INTRINSICS.prods_contained[fac_id] & (1n<<BigInt(product_id))){
                return fac_id
            };
        };
    };
};


function mut_add_player(player_name,roll20_id){
    console.assert(typeof player_name === 'string', "emit_player_to_registration - player_name should be a string");

    const max_players_reached = PLAYERS_REGISTRATION_TABLE.GID >= MAX_PLAYERS;
    if(max_players_reached){
        return ERROR_HANDLER.gm_add_unreg_players
    };

    const player_exists = PLAYERS_REGISTRATION_TABLE[player_name];
    if(player_exists.success){
        return `Player ${player_name} already exists`;
    };

    const current_gid = PLAYERS_REGISTRATION_TABLE.GID;
    PLAYERS_REGISTRATION_TABLE[current_gid] = {roll20_id: roll20_id, player_name: player_name};
    PLAYERS_REGISTRATION_TABLE.GID++;

    return `Player ${player_name} successfully added`

};


function mut_underscore_and_cases_in_name(name){
    console.assert(typeof name === 'string', `mut_underscore_and_cases_in_name Name ${name} is not a string`);
    return name
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};



function emit_uninited_field_maxint_u8(length){
    length += 9
    const uninited = new Uint8Array(length);
    const rem_idx = (length>>2) << 2;
    const rem = length % 4;
    for(let i = 3; i < length; i+=4){
        uninited[i-3] = 255;
        uninited[i-2] = 255;
        uninited[i-1] = 255;
        uninited[i] = 255;
    };
    if (rem > 0){
        for(let j = 0; j < rem; j++)
        uninited[j+rem_idx] = 255;
    };
    return uninited;
};

function gen_bastion_data_fields(){
    const length = MAX_PLAYERS * MAX_BASTION_FAC;

    return {
        fac_ids: emit_uninited_field_maxint_u8(length),
        fac_queued_products: emit_uninited_field_maxint_u8(length),
        fac_queue_elapsed: emit_uninited_field_maxint_u8(length),
    };

};


BASTION_META.mut_set_bastion_tier_level(5);
const FAC_MORE_THAN_ONCE_ALLOWED =
    (1<<FAC_BY_NAMES.BARRACK) | (1<<FAC_BY_NAMES.FOOD_GARDEN) | (1<<FAC_BY_NAMES.HERB_GARDEN) | (1<<FAC_BY_NAMES.POISON_GARDEN) | (1<<FAC_BY_NAMES.DECORATIVE_GARDEN) |
    (1<<FAC_BY_NAMES.STABLE) | (1<<FAC_BY_NAMES.TRAINING_AREA);


const PLAYERS_BASTION_INFO_TABLE = {
    ...gen_bastion_data_fields(),



    mut_add_facility(fac_id, player_id){
        console.assert(typeof fac_id === 'number', "mut_add_facility in PLAYERS_BASTION_INFO_TABLE - fac_id should be a number");
        console.assert(typeof player_id === 'number', "mut_add_facility in PLAYERS_BASTION_INFO_TABLE - player_id should be a number");
        const stride = player_id*MAX_BASTION_FAC;
        const stride_width = stride + MAX_BASTION_FAC;
        console.assert(stride_width > 0, "mut_add_facility in PLAYERS_BASTION_INFO_TABLE - stride_width has to be gt 0");

        const fac_name = FAC_BY_ID[fac_id];
        const fac_lvl = FAC_INTRINSICS.level[fac_id];
        const player_name = PLAYERS_REGISTRATION_TABLE[player_id]?.value?.player_name;
        console.assert(typeof player_name === 'string', "mut_add_facility from PLAYERS_REGISTRATION_TABLE - player_name should be a string")

        const bastion_max_fac_level_for_tier = BASTION_META.gen_max_fac_level_for_tier();;
        const bastion_max_fac_for_level = BASTION_META.gen_max_fac_count_for_level();
        const facility_level = FAC_INTRINSICS.level[fac_id];
        const current_player_fac_count = this.filter_player_total_fac_count(player_id);

        log("Player facility count: ", current_player_fac_count)
        if(current_player_fac_count >= bastion_max_fac_for_level){
            return ERROR_HANDLER.fac_add.reached_max_for_level(fac_name);
        }else if(bastion_max_fac_level_for_tier < facility_level){
            return ERROR_HANDLER.fac_add.fac_level_too_high(fac_name,fac_lvl,bastion_max_fac_level_for_tier);
        };


        //Check if facility can be added more than once.
        //This is used on the next for loop in the conditional if.
        let allowed_dupe = false;
        if(FAC_MORE_THAN_ONCE_ALLOWED & (1<<fac_id)){
            allowed_dupe = true;
        };

        for(let i = stride; i < stride_width; i++){
            //Facility already exists and is not allowed
            //as a duplicate facility.
            if(fac_id === this.fac_ids[i] && !allowed_dupe){
                return ERROR_HANDLER.fac_add.fac_duplicate(fac_name);
            };
        };

        return {fac_name: fac_name, player_name: player_name};
    },


    filter_player_total_fac_count(player_id){
        const stride = player_id * MAX_BASTION_FAC;
        const stride_width = stride + MAX_BASTION_FAC;
        let count = 0;
        for(let i = stride; i < stride_width; i++){
            if(this.fac_ids[i]!==255){
                log("Facility: ", this.fac_ids[i])
                count++;
            }
        };
        return count
    },



    filter_queued_orders_for(player_id){
        const stride = player_id * MAX_BASTION_FAC;
        const stride_width = stride + MAX_BASTION_FAC;
        for(let i = stride; i < stride_width; i++){
            if(this.fac_ids[i]!==255){
                count++;
            }
        };
        return count;
    },

};

log(mut_add_player("Storm"));
log(mut_add_player("Storm"));
mut_add_player("Octavius");
log(PLAYERS_BASTION_INFO_TABLE.mut_add_facility(FAC_BY_NAMES.ARMORY,0));




function construct_player_buttons_bylvl(player_id, fac_lvl){
    console.assert(typeof player_id === 'number', "construct_player_buttons_bylvl - player_id is not a number");
    console.assert(typeof fac_lvl === 'number', "construct_player_buttons_bylvl - fac_lvl is not a number");
    const facilities = []

    for (let i = 0; i < FAC_BY_NAMES.length;i++){
       if (FAC_INTRINSICS.level[i] === fac_lvl){
            const fac_name_formatted = mut_underscore_and_cases_in_name(FAC_BY_ID[i])
            facilities.push(
                {name: fac_name_formatted, command: `@fac_add ${i}`});
        };
    };
    return facilities;

};

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

        const fac_table = filter_facilities_in_player_bastion(player_id);


        log("fac_table", fac_table)

        const formatted_names = (() => {
            const collection_formatted = []
            for(let i = 0; i < fac_table.length;i++){
                const fac_id = fac_table[i]
                collection_formatted.push(mut_underscore_and_cases_in_name(FAC_BY_ID[fac_id]))
            };
            return collection_formatted;
        })();

        for (let i = 0; i < fac_table.length; i++){
            if(FAC_MORE_THAN_ONCE & (1n<<BigInt(fac_table[i]))){
                const fac_count = PLAYERS_FAC_DUPE_COUNT.filter_count_from(fac_table[i], player_id);
                for(let j = 0; j < fac_count; j++){
                    collected_buttons.push({name: `${formatted_names[i]}#0${j}`, command: '@fac_editview ' + (Number(fac_table[i]<<4)+j)});;
                };
                continue;
            };
            collected_buttons.push({name: formatted_names[i], command: '@fac_editview ' + fac_table[i]});
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
        console.assert(typeof fac_id==='number', "fac_add fac_id is not a number");
        console.assert(typeof player_id==='number', "fac_add Player ID is not a number!");

        const facility_result = PLAYERS_BASTION_INFO_TABLE.mut_add_facility(fac_id,player_id);

        if (facility_result[0] === -1){
            return facility_result;
        }
        const fac_name_unformatted = facility_result.fac_name;
        const fac_name_formatted = mut_underscore_and_cases_in_name(facility_result.fac_name);
        log("player name: ", facility_result.player_name)
        return {
            header: `Successfully added ${fac_name_formatted} to ${facility_result.player_name}`,
            buttons: [
                {name: `Go back to your facilities view`, command: "@fac_view"},
                {name: `View added facility ${fac_name_formatted}`, command: `@fac_editview ${FAC_BY_NAMES[fac_name_unformatted]}`},
            ],
        };
    },
    fac_editview: (fac_id, player_id) => {
        console.assert(typeof fac_id==='number', "fac_editview - fac_id is not a number!");
        console.assert(typeof player_id==='number', "fac_editview player_id is not a number!");


        if(fac_id>FAC_BY_NAMES.length){
            const fac_count = (fac_id%(1<<4)) + 1
            fac_id = fac_id >> 4;
            return;
        };

        const fac_name = FAC_BY_ID[fac_id];
        const formatted_name = mut_underscore_and_cases_in_name(fac_name);

        console.assert(typeof fac_player_orders!==BigInt, "fac_editview fac_player_orders is not BigInt")

        const fac_comp_buttons = [];
        const fac_prods = FAC_INTRINSICS.prods_contained[fac_id];
        const fac_mask_start = filter_lsb_in(fac_prods);
        const fac_mask_stop = filter_msb_in(fac_prods);

        for (let i = fac_mask_start; i <= fac_mask_stop; i++){
            if ((fac_prods & (1n<<i)) !== 0n){
                const format_order_name = mut_underscore_and_cases_in_name(PRODS_BY_ID[i].name);
                fac_comp_buttons.push({name: `Start order for ${format_order_name}`, command: `@ord_start ${i}`});
            };
        }


        const player_active_orders = emit_array_from(PLAYERS_BASTION_INFO_TABLE.orders_in_queue[player_id]);
        const player_mask_start = filter_lsb_in(player_active_orders);
        const player_mask_stop = filter_msb_in(player_active_orders);
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
            console.assert(typeof player_id === 'number',"PLAYERS_CMD_MAP.orders - player_id shoud be a number");
            const player_orders = PLAYERS_BASTION_INFO_TABLE.orders_in_queue[player_id];

            const valid_orders = emit_array_from(player_orders);



            if(valid_orders.length===0){
                return [
                    [{name:'No orders scheduled. Click to view facilities', command: '!bastion @facilities'}]
                ]
            };
            const prod_buttons = [];
            for (let i = 0; i < valid_orders.length; i++){
                const product_name = PRODS_BY_ID[valid_orders[i]].name;
                const fac_id = filter_facilityID_with_productID(valid_orders[i]);
                const fac_name = FAC_BY_ID[fac_id];
                const prod_name = mut_underscore_and_cases_in_name(product_name);
                const facility_origin_formatted = mut_underscore_and_cases_in_name(fac_name);
                prod_buttons.push({
                    name: `Product: ${prod_name} (Source: ${facility_origin_formatted})`, command: `@fac_editview ${FAC_BY_NAMES[fac_name]}`
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
    ord_start: (product_id, player_id) => {
        console.assert(typeof product_id==='number', "Product name is not a string");
        console.assert(typeof player_id==='number', "Player ID is not a number");

        const player_orders = PLAYERS_BASTION_INFO_TABLE.orders_in_queue[player_id];
        const fac_player_orders = emit_array_from(player_orders);

        log("player orders: ", fac_player_orders)
        if(fac_player_orders[0]===-1){return fac_player_orders};


        const prod_name = PRODS_BY_ID[product_id].name;
        const product_name_formatted = mut_underscore_and_cases_in_name(prod_name);
        const facility_origin_id = filter_facilityID_with_productID(product_id);

        for(let i = 0; i < fac_player_orders.length; i++){
            if((Number(fac_player_orders[i]) === product_id)){
                return ERROR_HANDLER.ord_start.already_queued(product_id)
            };
        };
        const started_order = mut_count_in_playerProducts(product_id, player_id);
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

        if(fac_player_orders[0] === -1 ){return fac_player_orders};

        const product_name_formatted = mut_underscore_and_cases_in_name(PRODS_BY_ID[product_id].name);
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
        const fac_player_orders = PLAYERS_BASTION_INFO_TABLE.orders_in_queue[player_id];

        log("Player orders: ", fac_player_orders);
        return [0];



        //Player has no active orders
        if(fac_player_orders.length===0){
            return ERROR_HANDLER.ord_status.no_active_orders;
        };

        const fac_player_orders_buttons = [];
        for (let i = 0; i < fac_player_orders.length; i++){
            const product_id = Number(fac_player_orders[i])
            const product_name_formatted = mut_underscore_and_cases_in_name(PRODS_BY_ID[product_id].name);
            fac_player_orders_buttons.push({name: `${product_name_formatted}`, command: null})
        };
        return {
            header: "Your Current Active Orders",
            buttons: fac_player_orders_buttons,
        }
    },
    //TODO: Finish ord_info
    ord_info: (prod_id) => {
        console.assert(typeof prod_id === 'number', "ord_info prod_id is not a number");
        const prod_info = PRODS_BY_ID[prod_id].name;
        return mut_underscore_and_cases_in_name(prod_info);

    },
    ord_info_effect: (effect_id) => {
        const ddb_link = SPECIAL_EFFECTS_DDB_LINKS[effect_id];
        return ddb_link;
    },
    fac_info: (fac_id) => {
        const facility_prods = FAC_INTRINSICS.prods_contained[fac_id];
        const prods_lower = filter_lsb_in(facility_prods);
        const prods_upper = filter_msb_in(facility_prods);
        const fac_name = mut_underscore_and_cases_in_name(FAC_BY_ID[fac_id]);
        const collect_info = [];
        for(let i = prods_lower; i <= prods_upper; i++){
            if((facility_prods & (1n<<i)) !== 0n){
                const formatted_prod_name = mut_underscore_and_cases_in_name(PRODS_BY_ID[i].name);
                const order_type = mut_underscore_and_cases_in_name(ORDERS_BY_ID[getFacilityOrderType(fac_id)])
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



function emit_html_menu_table(btn_list, gm_menu=false){
    console.assert(btn_list.buttons.length !== null, "emit_html_menu_table btn_list array is empty");
    console.assert(gm_menu !== Boolean, "emit_html_menu_table gm_menu is not a boolean");

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






const facility = FAC_BY_NAMES.DECORATIVE_GARDEN
const msg = {
    type: "api",
    content: `!bastion @fac_add 13`,
};




function handleMSG(){
    if(msg.type === "api" && msg.content.startsWith("!bastion @gm")){
    }else if(msg.type === "api" && msg.content.startsWith("!bastion ")){
        const parts = msg.content.split(" ");
        const command = parts[1].substring(1).trim();
        if(NAVIGATOR_MENU.has(command) || NAVIGATOR_FAC_OPS.has(command) || NAVIGATOR_FAC_ORDERS_OPS.has(command)){
            let player_view;
            let table_view_config;
            let fac_id;
            let prod_id;
            switch (command) {
                case 'menu':
                case 'facilities':
                    table_view_config = PLAYERS_CMD_MAP[command];
                    if (table_view_config[0] === -1){
                        return table_view_config[1];
                    }
                    player_view = emit_html_menu_table(table_view_config);
                    break
                case 'orders':
                    table_view_config = {
                        header: PLAYERS_CMD_MAP[command].header,
                        buttons: PLAYERS_CMD_MAP[command].buttons(0),
                    };
                    player_view = emit_html_menu_table(table_view_config);
                    break;
                case 'fac_lvl5':
                case 'fac_lvl9':
                case 'fac_lvl13':
                case 'fac_lvl17':
                    const fac_level = parseInt(command.split("lvl")[1]);
                    table_view_config = PLAYERS_CMD_MAP["fac_levels"](fac_level, 0)
                    player_view = emit_html_menu_table(table_view_config)
                    break;
                case 'fac_add':
                    fac_id = parseInt(parts[2])
                    table_view_config = PLAYERS_CMD_MAP["fac_add"](fac_id, 0);
                    if(table_view_config[0] === -1){
                        return table_view_config[1];
                    }
                    player_view = emit_html_menu_table(table_view_config)
                    break
                case 'fac_remove':
                case 'fac_view':
                    table_view_config = PLAYERS_CMD_MAP["fac_view"](0);

                    player_view = emit_html_menu_table(table_view_config);
                    break
                case 'fac_editview':
                    fac_id = parseInt(parts[2])
                    table_view_config = PLAYERS_CMD_MAP["fac_editview"](fac_id,0);
                    player_view = emit_html_menu_table(table_view_config)
                    break
                case 'fac_info':
                    fac_id = parseInt(parts[2])
                    table_view_config = PLAYERS_CMD_MAP["fac_info"](fac_id);
                    player_view = emit_html_menu_table(table_view_config)
                    break
                case 'ord_start':
                case 'ord_finish':
                    prod_id = parseInt(parts[2])
                    table_view_config = PLAYERS_CMD_MAP[command](prod_id,0);
                    if(table_view_config[0]===-1){
                        return table_view_config[1];
                    };
                    player_view = emit_html_menu_table(table_view_config);
                    log(table_view_config)
                    return
                case 'ord_history':
                case 'ord_info':
                    prod_id = parseInt(parts[2])
                    table_view_config = PLAYERS_CMD_MAP["ord_info"](prod_id);
                    if(table_view_config[0]===-1){
                        return table_view_config[1];
                    };

                    player_view = emit_html_menu_table(table_view_config);
                    break;
            }
            return player_view
        }else{
            return `Invalid command ${command}`;
        }
    }
};
log("Handler: ", handleMSG());







