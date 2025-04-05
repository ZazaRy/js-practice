const log = console.log;

const facilities = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
};

const fac_intrinsics = {
    hirelings: new Uint8Array([1,2,3,4,5,6]),
};



const MAX_PLAYERS = 4;
const MAX_FACILITIES = 2;
const MAX_DUPE_FACS = 4;

const dupe_facs = (1<<facilities.B) | (1<<facilities.C) | (1<<facilities.D) | (1<<facilities.E);




const player_info = {
    facilities: new Uint8Array(MAX_PLAYERS*MAX_FACILITIES),


    fac_dupes_instances: {
        facilities: new Uint8Array(MAX_PLAYERS*MAX_FACILITIES),
        fac_current_hirelings: new Uint8Array(MAX_PLAYERS*MAX_FACILITIES),

        mut_count_in_current_hirelings(dupe_fac_id,player_id,count){
            const idx = (player_id * MAX_FACILITIES) + dupe_fac_id;
            log(this.fac_current_hirelings[idx])
            this.fac_current_hirelings[idx] += count;
            log(this.fac_current_hirelings[idx])
        },
    },

    mut_count_in_facs(fac_id,player_id){
        if(dupe_facs&(1<<fac_id)){
            const start = player_id * MAX_FACILITIES;
            const end = start + MAX_FACILITIES
            for(let dupe_id = start; dupe_id < end;dupe_id++){
                if(!this.fac_dupes_instances.facilities[dupe_id]){
                    this.fac_dupes_instances.facilities[dupe_id] = fac_id;
                    log(this.fac_dupes_instances.facilities[dupe_id])
                    break
                };
            };
        };
        this.facilities[player_id] |= (1<<fac_id)
    }

};



player_info.mut_count_in_facs(facilities.B,0)
player_info.mut_count_in_facs(facilities.B,0)
player_info.mut_count_in_facs(facilities.B,1)
player_info.mut_count_in_facs(facilities.B,1)
player_info.mut_count_in_facs(facilities.B,0)
player_info.mut_count_in_facs(facilities.B,0)
player_info.mut_count_in_facs(facilities.B,1)
player_info.mut_count_in_facs(facilities.B,1)
log(player_info)
// player_info.fac_dupes.mut_count_in_current_hirelings()
