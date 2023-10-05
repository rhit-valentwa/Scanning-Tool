const fs = require("fs");

var sourceFile = fs.readFileSync(process.argv[2], 'utf8').split("\n");

var items = [];

for(var i = 0; i < sourceFile.length - 1; i++){
    var arr = sourceFile[i].split("\t");
    arr.unshift(parseInt(i));
    arr[1] = parseInt(arr[1].replace(/\"/g, ""));
    arr[3] = parseInt(arr[3].replace(/\"/g, ""));
    items.push(arr);
}
console.log(items)
for(var i = 0; i < items.length - 1; i++){
    //if item is not identical to previous item
    if(parseInt(i) + 1 < items.length - 1){
        
        var item = items[i];
        var nextItem = items[parseInt(i) + 1];
        
        if(item[1] !== nextItem[1] ||
           item[2] !== nextItem[2] ||
           item[3] !== nextItem[3]){
               console.log()
           }
    }
}