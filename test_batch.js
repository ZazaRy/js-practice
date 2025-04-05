const mylist = [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,20,21,22,23,24];
const log = console.log;

function batchBy4(arr){
    const batch_range = Math.floor(arr.length/4);
    const idx = batch_range * 4;
    const remaining = arr.length % 4;
    for (let i = 0; i < batch_range;i++){
        log(arr[i*4])
        log(arr[(i*4)+1])
        log(arr[(i*4)+2])
        log(arr[(i*4)+3])
    };
    if(remaining>0){
        for (let j = 0; j < remaining; j++){
            log(arr[idx+j]);
        };
    };
};




