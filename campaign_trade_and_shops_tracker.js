const log = console.log;

const CITIES_TABLE = {
    CITIES_GID_TRACKER: 0,
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
    12: "",
    13: "",
    14: "",
    15: "",
    16: "",
    17: "",
    18: "",
    19: "",
    20: "",
    21: "",
    22: "",
    23: "",
    24: "",
    25: "",
    26: "",
    27: "",
    28: "",
    29: "",
    30: "",
    31: "",
};

function add_new_city(city_name){
    CITIES_TABLE[CITIES_TABLE.CITIES_GID_TRACKER] = city_name;
    CITIES_TABLE.CITIES_GID_TRACKER++;
};

const SHOPS_NAMES = {
    SHOPS_GID_TRACKER: 0,
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
    17: null,
    18: null,
    19: null,
};

const SHOPS_PER_CITY_CURRENT = {
    //City PK : Shops Count,
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0,
    31: 0,

};

const CITIES_OFFSET = 20;
const MAX_SHOPS_PER_CITY = 32;
const CITIES_SHOPS_IDS_TABLE = {
    shop_id: new Uint8Array(MAX_SHOPS_PER_CITY*CITIES_OFFSET),
    shop_type: new Uint8Array(MAX_SHOPS_PER_CITY*CITIES_OFFSET),
    shop_shopkeepers: new Uint8Array(MAX_SHOPS_PER_CITY*CITIES_OFFSET),
};


const SHOP_TYPES = {
    0: "ARMORSMITH",
    1: "WEAPONSMITH",
    2: "JEWELER",
    3: "ALCHEMIST",
    4: "HERBS",
};

function add_new_shops(shop_name,city_id){
    SHOPS_NAMES[SHOPS_NAMES.SHOPS_GID_TRACKER] = shop_name;
    const current_shops_count = SHOPS_PER_CITY_CURRENT[city_id];
    CITIES_SHOPS_IDS_TABLE.shop_id[(CITIES_OFFSET*city_id)+current_shops_count] = SHOPS_NAMES.SHOPS_GID_TRACKER;
    SHOPS_PER_CITY_CURRENT[city_id]++;
    SHOPS_NAMES.SHOPS_GID_TRACKER++;
};
log(CITIES_SHOPS_IDS_TABLE)

add_new_city("StormLand Paris");
add_new_city("The Promised Ocean");
add_new_shops("A",0);
add_new_shops("B",0);
add_new_shops("C",0);
add_new_shops("D",1);
log("Count: ", SHOPS_PER_CITY_CURRENT[0])

function getShopsFromCity(city_id){
    let shops = [];
    const city_name = CITIES_TABLE[city_id];
    const lower_bound = CITIES_OFFSET*city_id;
    const upper_bound = lower_bound + SHOPS_PER_CITY_CURRENT[city_id];
    for (let i = lower_bound; i < upper_bound;i++){
        log(i)
        const shop_id = CITIES_SHOPS_IDS_TABLE.shop_id[i];
        const shop_name = SHOPS_NAMES[shop_id];
        shops.push(shop_name);
    }
    return shops;
};

log(getShopsFromCity(1))
