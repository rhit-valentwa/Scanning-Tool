var fs = require("fs");

var correctionsDirectory = fs.readdirSync(`./data/corrections`),
    correctionsTSV = fs.readFileSync(`./data/corrections/${correctionsDirectory[0]}`, "utf8").split(`\n`),
    corrections = [];
for(var i in correctionsTSV){
    if(correctionsTSV[i] !== ""){
        var line = correctionsTSV[i].split(`\t`);
        corrections.push({wrong: escapeRegExp(line[0].replace(/"/g, "").toLowerCase()), right: escapeRegExp(line[1].replace(`\r`, ``))});
    }
}

corrections.shift();

var dataTSV = fs.readFileSync(process.argv[3] + process.argv[2] + ".tsv", "utf8").split(`\n`),
    items = [];

for(var i = 0; i < dataTSV.length - 1; i++){
    var line = dataTSV[i].split(`\t`);
    items.push({amount: parseInt(line[0]), name: escapeRegExp(line[1].replace(/"/g, "").toLowerCase()), displayName: escapeRegExp(line[1]).replace(/"/g, ""), price: parseInt(line[2].replace(/,/g, ``)), guild: line[3].replace(`\r`, ``)});
}

var correctionsCount = 0,
    removalCount = 0,
    output = "",
    output1 = "";

var alphabet = "abcdefghijklmnopqrstuvwxyz";

var characterToArrayPosition = function(character) {
    character = character.toLowerCase();
    for (var z = 0; z < alphabet.length; z++) {
        if (character == alphabet[z]) {
            return z;
        }
    }
    return 26;
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]"/g, '\\$&'); // $& means the whole matched string
}

var temp = [
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[]
];

for (var i = 0; i < corrections.length; i++) {
    temp[characterToArrayPosition(corrections[i].wrong.trim().substring(0, 1))].push(corrections[i]);
}

corrections = temp;

for (var i = 0; i < items.length - 1; i++) {

    var object = items[i],
        position = characterToArrayPosition(object.name.trim().substring(0, 1)),
        wasCorrected = false,
        shouldDelete = false;

    if (corrections[position] !== []) {
        for (var a = 0; a < corrections[position].length; a++) {
            if (object.name == corrections[position][a].wrong) {
                object.name = escapeRegExp(corrections[position][a].right);
                correctionsCount++;
                if (object.name.toUpperCase().trim() !== "DELETE") {
                    wasCorrected = true;
                    break;
                }
                else {
                    shouldDelete = true;
                    removalCount++;
                    break;
                }
            }
        }
        if (wasCorrected === false){
            object.name = object.displayName;
        }

    }

    if (shouldDelete === false) {
        output += `\"${object.amount}\"\t\"${object.name.toString().trim().replace(/"/g, "")}\"\t\"${object.price}\"\t\"${object.guild.toString().trim()}\"\n`;
    }

    if (wasCorrected !== true && shouldDelete == false) {
        output1 += `\"${object.amount}\"\t\"${object.name.toString().trim().replace(/"/g, "")}\"\t\"${object.price}\"\t\"${object.guild.toString().trim()}\"\n`;
    }
}




console.log(`Spelling Correction:\n \tTotal Items: ${items.length}\n \tNumber of Corrections: ${correctionsCount}\n \tNumber of Removals: ${removalCount}\n \tPrecentage Corrected: ${((correctionsCount / items.length).toFixed(3) * 100)}%\n`);

fs.writeFileSync(`${process.argv[3]}${process.argv[2]}.tsv`, output);
fs.writeFileSync(`${process.argv[3]}output2.tsv`, output1);