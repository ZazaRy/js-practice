const log = console.log;

    //     if (!state.MyBastion){
    //         state.MyBastion = {
    //         FAC_INTRINSICS: {
    //             name: new Uint8Array(37),
    //             size: new Uint8Array(37),
    //             hirelings: new Uint8Array(37),
    //             order_type: new Uint8Array(37),
    //             contains_prods: [],
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

    const BASTION_META = {
        current_level: 0,
    };

    function getCurrentBastionLevel(){
        return BASTION_META.current_level;
    };

    function set_current_bastion_level(level){
        BASTION_META.current_level = level;
    };

    const FAC_SPECIAL_IDS = {
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
    const FAC_SPECIAL_NAMES = Object.entries(FAC_SPECIAL_IDS).reduce((map,[name,id]) => {
        map[id] = name;
        return map;
    },{})



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
        contains_prods: new BigUint64Array(37),
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



    // Assign contains_prods for each facility type
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




    const PLAYERS_ROLL20_PID_LOCAL_GID_TABLE = {
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

    const PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE = {
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
        scheduled_orders: new BigUint64Array(MAX_PLAYERS),
        fac_perms_lvl_5: new Uint8Array(MAX_PLAYERS),
        fac_perms_lvl_9: new Uint8Array(MAX_PLAYERS),
        fac_perms_lvl_13: new Uint8Array(MAX_PLAYERS),
        fac_perms_lvl_17: new Uint8Array(MAX_PLAYERS),
        schedule_perm_mask: new Uint8Array(MAX_PLAYERS),
    };



    const PLAYERS_INFO_INVENTORY_TABLE = {
        items_name: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS*MAX_PLAYERS),
        items_count: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS*MAX_PLAYERS),
    };




    function fmsb(mask){
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
        let lsb = 0n;
        let max_search = 64;
        while((mask & (1n << lsb)) === 0n){
            if(max_search===0){break};
            lsb++;
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
        log(`New player and roll20 id ${player_name}, ${roll20_playerid}`);
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


    set_current_bastion_level(17)
    function add_facility(fac_id, player_id){
        const facility_level = FAC_INTRINSICS.level[fac_id];
        const facility_name = FAC_SPECIAL_NAMES[fac_id];
        const player_name = PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE[player_id].player_name;
        let fac_key_level;
        switch (facility_level) {
            case 5: fac_key_level = "fac_perms_lvl_5"; break;
            case 9: fac_key_level = "fac_perms_lvl_9"; break;
            case 13: fac_key_level = "fac_perms_lvl_13"; break;
            case 17: fac_key_level = "fac_perms_lvl_17"; break;
        };

        if (PLAYERS_INFO_FACILITY_TABLE[fac_key_level][player_id] >= 2){return `Player ${player_name} already has maximum facilities for level ${facility_level}`};


        const player_fac_mask = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id];

        //I am ont entirely convinced that this is worse or better than
        //taking care of Garden and Guildhall individually. The only two cases for this type of thing.
        if (fac_id >= 12 && fac_id <= 17){
            for (let i = 12n; i <= 17n; i++){
                if ((player_fac_mask & (1n << i)) && (i !== BigInt(fac_id))){
                    return `${player_name} already has a Guildhall`
                };
            };
        }
        else if (fac_id >= 21 && fac_id <= 24){
            for (let i = 21n; i <= 24n; i++){
                if ((player_fac_mask & (1n << i)) && (i !== BigInt(fac_id))){
                    return `${player_name} already has a Garden`
                };
            };
        }

        if ((player_fac_mask & 1n << BigInt(fac_id))!==0){
            return `${player_name} already has ${facility_name}`;
        };


        PLAYERS_INFO_FACILITY_TABLE[fac_key_level][player_id]++;
        PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] |= 1n << BigInt(fac_id);


        return `Facility ${facility_name} added to ${player_name}`;
    };

    function remove_facility(fac_id, player_id){
        PLAYERS_INFO_FACILITY_TABLE.facilities[player_id] &= ~(1n << BigInt(fac_id));
    };


    function start_order(prod_id,player_id){
        PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id] |= (1n << BigInt(prod_id));
    };

    function finish_order(prod_id, player_id){
        const totals = 49;
        const id_offset = totals*player_id;
        PLAYERS_INFO_INVENTORY_TABLE.items_name[prod_id+id_offset] = prod_id;
        PLAYERS_INFO_INVENTORY_TABLE.items_count[prod_id+id_offset] += 1;
        PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id] &= ~(1n << BigInt(prod_id));
    };

    function viewPlayerActiveOrders(player_id){
        const player_mask = PLAYERS_INFO_FACILITY_TABLE.scheduled_orders[player_id];
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
        const lower_bound = player_id*FAC_PROD_IDS.TOTAL_PRODS;
        const upper_bound = lower_bound + FAC_PROD_IDS.TOTAL_PRODS;
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
        const facilities = PLAYERS_INFO_FACILITY_TABLE.facilities[player_id]
        const ubound = fmsb(facilities);
        const lbound = flsb(facilities);
        let collect_fac_data = [];
        for (let i = lbound; i <= ubound; i++){
            //I have to use 0n here because Roll20 is using  Node and it does not do proper type coercion
            //With Bun, locally, it's not need
            if ((facilities & (1n<<i))!==0n){
                collect_fac_data.push(FAC_SPECIAL_NAMES[i])
            };
        };
        return collect_fac_data;
    };


    const CMD_DM_ADJ_LIST_TABLE = {
        gm_menu: {
            header: "Main Menu - DM",
            buttons: [
                        {name: "Add Unregistered Players", command: '@gm_add_unreg_players'},
                        {name: "Remove Players From List", command: '@gm_remove_reg_players'},
                        {name: "Time Skip", command: '@gm_timeskip'},

                    ],
        },
        gm_add_unreg_players: () =>  {
                    const all_players = findObjs({
                        type: "player",
                    });
                    const new_players = [];

                    for (let i = 0; i < all_players.length; i++){
                        if (!ROLL20_ID_LOOKUP.has(all_players[i].get("_id"))){
                            addPlayer(all_players[i].get("displayname"), all_players[i].get("_id"))
                            const new_player_id = getPlayerGID(all_players[i].get("displayname"));
                            new_players.push({name: all_players[i].get("displayname"), command: `@gm_view_player ${new_player_id}`})
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

    const CMD_ADJ_LIST_TABLE = {
        menu: {
            header: "Main Menu",
            buttons: [
                        {name: "Facilities List", command: '@facilities'},
                        {name: "Ongoing Orders", command: '@orders'},
                        {name: "Bastion Inventory", command: '@binventory'},
                        {name: "Bastion Help&Info", command: '@hni'},
                        {name: "View Facilities", command: '@view_facilities'},
                    ],
        },
        view_facilities: {
            header: "Your Facilities",
            buttons: (player_id) => {
                const collected_buttons = [];
                const fac_table = viewPlayerFacilities(player_id);
                const formatted_names = fac_table.map(facility_name => {
                    return facility_name.replace(/_/g," ")
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
                })
                for (let i = 0; i < fac_table.length; i++){
                    collected_buttons.push({name: formatted_names[i], command: '@view_facility ' + fac_table[i]})
                };
                return collected_buttons
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
        fac_lvl5: {
            header: "Level 5 Facilities",
            buttons:[
                        {name: "Arcane Study", command:"@add 0"},
                        {name: "Armory", command:"@add 7"},
                        {name: "Barrack", command:"@add 11"},
                        {name: "Food Garden", command:"@add 21"},
                        {name: "Herb Garden", command:"@add 22"},
                        {name: "Poison Garden", command:"@add 23"},
                        {name: "Decorative Garden", command:"@add 24"},
                        {name: "Library", command:"@add 28"},
                        {name: "Smithy", command:"@add 5"},
                        {name: "Storehouse", command:"@add 8"},
                        {name: "Workshop", command:"@add 6"}
                    ],
        },
        fac_lvl9: {
            header: "Level 9 Facilities",
            buttons:[
                        {name: "Gaming Hall", command:"@add 9"},
                        {name: "Greenhouse", command:"@add 25"},
                        {name: "Laboratory", command:"@add 1"},
                        {name: "Sacristy", command:"@add 2"},
                        {name: "Scriptorium", command:"@add 4"},
                        {name: "Stable", command:"@add 10"},
                        {name: "Teleportation Circle", command:"@add 19"},
                        {name: "Theater", command:"@add 35"},
                        {name: "Training Area", command:"@add 36"},
                        {name: "Trophy Room", command:"@add 30"}
                    ],
        },
        fac_lvl13: {
            header: "Level 13 Facilities",
            buttons:[
                        {name: "Archive", command:"@add 27"},
                        {name: "Meditation Chamber", command:"@add 32"},
                        {name: "Menagerie", command:"@add 18"},
                        {name: "Observatory", command:"@add 33"},
                        {name: "Pub", command:"@add 29"},
                        {name: "Reliquary", command:"@add 26"}
                    ],
        },
        fac_lvl17: {
            header: "Level 17 Facilities",
            buttons: [
                        {name: "Demiplane", command:"@add 31"},
                        {name: "Baker's Guild", command:"@add 13"},
                        {name: "Mason's Guild", command:"@add 15"},
                        {name: "Brewer's Guild", command:"@add 14"},
                        {name: "Shipbuilder's Guild", command:"@add 16"},
                        {name: "Adventurer's Guild", command:"@add 12"},
                        {name: "Thieve's Guild", command:"@add 17"},
                        {name: "Sanctum", command:"@add 34"},
                        {name: "War Room", command:"@add 20"}
            ],
        },
    };



    function createTableNavMenu(btn_list, gm_menu=false){
        let main_menu = "!bastion @menu";
        if (gm_menu){main_menu = "!bastion @gm_menu"};
        let table_HTML = '<table style="width:80%; margin:auto; border-collapse:collapse; background-color:#8a2be2;">';
        table_HTML += `<tr><th style="background-color:#8a2be2; padding:10px;border-bottom:2px solid; font-size:16px; text-align:center;">${btn_list.header}</th></tr>`;

        btn_list.buttons.forEach(option => {
            table_HTML += `<tr><td style="padding:8px; color:white; border-bottom:1px solid white; text-align:center;"><a style="background-color:#8a2be2; width:auto;height:auto; text-decoration:none; display:block" href="!bastion ${option.command}">${option.name}</a></td></tr>`;

        });
        table_HTML += '</table>';

        table_HTML += '<div style="text-align:center; margin-top:15px;">';
        table_HTML += `<a style="background-color:#8a2be2; color:white; padding:8px 15px; border-radius:5px; text-decoration:none;" href="${main_menu}">Return to Menu</a>`;
        table_HTML += '</div>'
        return table_HTML;
    };

    const NAVIGATOR_MAIN = new Set(["@menu", "@facilities", "@fac_lvl5", "@fac_lvl9", "@fac_lvl13", "@fac_lvl17"]);

    const NAVIGATOR_FAC_OPS = new Set(["@add_fac","@remove_fac","@view_fac"]);
    const NAVIGATOR_FAC_ORDERS_OPS = new Set(["@ord_start","@ord_finish","@ord_status","@ord_history"]);
    const NAVIGATOR_GM_MENU = new Set(["@gm_menu", "@gm_add_unreg_players", "@gm_remove_reg_players", "@gm_timeskip"]);

let command = "!bastion @add 1";

let cmd = command.split(" ")[1];

const state = {MyBastion: {
        FAC_INTRINSICS: {
            name: new Uint8Array(37),
            size: new Uint8Array(37),
            hirelings: new Uint8Array(37),
            order_type: new Uint8Array(37),
            contains_prods: [],
        },
        PLAYERS_ROLL20_PID_LOCAL_GID_TABLE: {
            "": {roll20_id: "", local_gid: 0},
            "": {roll20_id: "", local_gid: 1},
            "": {roll20_id: "", local_gid: 2},
            "": {roll20_id: "", local_gid: 3},
            "": {roll20_id: "", local_gid: 4},
            "": {roll20_id: "", local_gid: 5},
            "": {roll20_id: "", local_gid: 6},
            "": {roll20_id: "", local_gid: 7},
        },
        PLAYERS_ROLL20_PID_LOCAL_GID_REVERSE_TABLE: {
            0: {roll20_id: "", player_name: ""},
            1: {roll20_id: "", player_name: ""},
            2: {roll20_id: "", player_name: ""},
            3: {roll20_id: "", player_name: ""},
            4: {roll20_id: "", player_name: ""},
            5: {roll20_id: "", player_name: ""},
            6: {roll20_id: "", player_name: ""},
            7: {roll20_id: "", player_name: ""},
        },
        PLAYERS_INFO_FACILITY_TABLE: {
            facilities: [],
            scheduled_orders: [],
        },
        PLAYERS_INFO_INVENTORY_TABLE: {
            items_name: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS*MAX_PLAYERS),
            items_count: new Uint8Array(FAC_PROD_IDS.TOTAL_PRODS*MAX_PLAYERS),
        },
    }
}

function saveState(){
    for (let i = 0; i  < FAC_INTRINSICS.contains_prods.length; i++){
        state.MyBastion.FAC_INTRINSICS.contains_prods[i] = FAC_INTRINSICS.contains_prods[i].toString();
    };
    state.MyBastion.PLAYERS_INFO_FACILITY_TABLE.facilities =
        Array.from(PLAYERS_INFO_FACILITY_TABLE.facilities)
        .map(n => n.toString());

    state.MyBastion.PLAYERS_INFO_FACILITY_TABLE.scheduled_orders =
        Array.from(PLAYERS_INFO_FACILITY_TABLE.scheduled_orders)
        .map(n => n.toString());
};



cmd = command.split(" ")[1];
addPlayer("Storm");
log(add_facility(2,0))
log(add_facility(12,0))
log(add_facility(13,0))
log(add_facility(19,0))
command = "!bastion @gm_menu";
const parts = command.split(" ");

if (command.startsWith("!bastion @gm")){
    if(NAVIGATOR_GM_MENU.has(parts[1])){
        log(parts[1])
        const gm_menu_table = createTableNavMenu(CMD_DM_ADJ_LIST_TABLE[parts[1].substring(1)]);
        log(gm_menu_table)
    }

}
else if(command.startsWith("!bastion @")){

};
