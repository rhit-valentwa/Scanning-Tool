var fs = require("fs"),
    spawn = require('child_process').spawn;

var data = fs.readFileSync(`${process.argv[2]}`, 'utf8');

var outputToTSV = true;

var itemsToReplace = [
    [/4>\./, ""],
    [/\./, ","],
    [/0000/, "000"]
];

function reverseString(string) {
    var splitString = string.split(""),
        reverseArray = splitString.reverse();
    return reverseArray.join("");
};
function displayNumberInFormal(number) {
    var string = number;
    if (string !== undefined) {
        string = reverseString(number.toString()).split("");
    }
    var output = "";
    if (number.toString().length > 3) {
        for (var i in string) {
            if (i % 3 == 0) {
                output += ",";
            }
            output += string[i];
        }
        output = output.slice(1, output.length)
        return reverseString(output);
    } else {
        return number;
    }
};
function alphabetize(a, b) {
    var name1 = a.name.toLowerCase(),
        name2 = b.name.toLowerCase();
    if (name1 < name2)
        return -1;
    if (name1 > name2)
        return 1;
    return 0;
};
function removeDuplicates() {
    var previousSale = {};
    for (var i in itemArray) {
        if (itemArray[i].price <= 50) {
            itemArray.splice(i, 1);
        } else if (previousSale.name === itemArray[i].name) {
            itemArray.splice(i, 1);
        }
        previousSale = itemArray[i];
    }
};

var totalSales = 0;
var totalSalesValue = 0;
var totalTaxValue = 0;
var totalItemAmounts = 0;
var itemArray = [];
var unprocessed = data;

unprocessed = unprocessed.replace(/DETAII\.S/g, "DETAILS");
unprocessed = unprocessed.replace(/DETAIlS/g, "DETAILS");
unprocessed = unprocessed.replace(/DETAllS/g, "DETAILS");
unprocessed = unprocessed.split("DETAILS");

var processedSaleSuccesses = 0;

var output = "";

for (var i = 0; i < unprocessed.length; i++) {

    var seller,
        buyer;

    if (unprocessed[i] !== undefined) {
        var raw = unprocessed[i].trim().split(".");
        raw.pop();
        var taxes = raw[1];
        raw.pop();
        if (raw[raw.length - 1] !== undefined) {
            var sale = unprocessed[i].trim().split("sold")[1];
            seller = unprocessed[i].trim().split("sold")[0].trim();
            if (sale !== undefined) {
                sale = sale.trim();
                sale = sale.replace(/\stor\s/g, " to ");
                sale = sale.replace(/\sfar\s/, " to ");

                sale = sale.replace(/\sfo\s/g, " to ");
                sale = sale.replace(/\sta\s/, " to ");
                sale = sale.replace(/\sIo\s/, " to ");
                sale = sale.replace(/\sro\s/, " to ");
                sale = sale.replace(/\stO\s/, " to ");
                sale = sale.replace(/\sEor\s/, " to ");

                var amount = sale.split(" ")[0],
                    item = sale.substring(amount.length, sale.split(/\sto\s/)[0].length).trim();
                buyer = sale.substring(sale.search(/\sto\s/) + 3, sale.search(/\sfor\s/)).trim();


                amount = amount.replace(/l/g, "1");
                amount = amount.replace(/t/g, "1");
                amount = amount.replace(/T/g, "1");
                amount = amount.replace(/I/g, "1");
                amount = amount.replace(/i/g, "1");
                amount = amount.replace(/B/g, "8");
                amount = amount.replace(/\)/g, "1");
                amount = amount.replace(/J/g, "1");
                amount = amount.replace(/'/g, "1");
                amount = amount.replace(/S/g, "5");
                amount = amount.replace(/D/g, "0");

                item = item.replace(/\|/g, "1");
                item = item.replace(/\n/g, " ");
                item = item.replace(/\sot\s/, "of");
                item = item.replace(/\sMotit\s/, " Motif ");
                item = item.replace(/Nlotif/, " Motif ");

                item = item.replace(/Crating\s/, " Crafting ");
                item = item.replace(/Cratting\s/, " Crafting ");
                item = item.replace(/Crofting/, " Crafting ");


                item = item.replace(/\sStaf\s/, " Staff ");
                item = item.replace(/Stat\s/, " Staff ");
                item = item.replace(/Statt\s/, " Staff ");
                item = item.replace(/Statf\s/, " Staff ");

                item = item.replace(/0/g, "D");
                item = item.replace(/5/g, "S");
                item = item.replace(/2/g, "Z");
                item = item.replace(/]/g, "J");
                item = item.replace(/6/g, "G");

                item = item.replace(/\s\s/g, " ");
                item = item.replace(/\t/g, " ");

                item = item.replace(/Nl/, "M");
                item = item.replace(/Nt/, "M");
                item = item.replace(/NL/, "M");
                item = item.replace(/1/g, "t");
                item = item.replace(/\(/, "C");

                item = item.replace(/cooled\s/, "");
                item = item.replace(/IN/, "M");
                item = item.replace(/Matif/, "Motif");

                item = item.replace(/7/, "Z");

                item = item.trim();


                if (sale.replace(/\n/g, " ").split(" for ")[1] !== undefined) {
                    var price = sale.replace(/\n/g, " ").split(" for ")[1].trim().split(" ")[0].trim();

                    price = price.split(`\n`)[0];

                    var firstHalf = price.split(`,`)[0],
                        secondHalf = price.split(`,`)[1];

                    var thirdPiece = price.split(`,`)[2];

                    firstHalf = firstHalf.replace(/PJ\./, "");
                    firstHalf = firstHalf.replace(/\./, "");
                    firstHalf = firstHalf.replace(/®/g, "");

                    firstHalf = firstHalf.replace(/i/g, "");
                    firstHalf = firstHalf.replace(/t/g, "");
                    firstHalf = firstHalf.replace(/P/g, "");

                    firstHalf = firstHalf.replace(/~/g, "");
                    firstHalf = firstHalf.replace(/w/g, "");
                    firstHalf = firstHalf.replace(/r/g, "");

                    firstHalf = firstHalf.replace(/\//g, "");
                    firstHalf = firstHalf.replace(/N/g, "");
                    firstHalf = firstHalf.replace(/'/g, "");

                    firstHalf = firstHalf.replace(/J/g, "");
                    firstHalf = firstHalf.replace(/>/g, "");
                    firstHalf = firstHalf.replace(/u/g, "");

                    firstHalf = firstHalf.replace(/Q/g, "0");
                    firstHalf = firstHalf.replace(/ir/g, "");
                    firstHalf = firstHalf.replace(/OOO/g, "000");
                    firstHalf = firstHalf.replace(/J/g, "");
                    firstHalf = firstHalf.replace(/>/g, "");
                    firstHalf = firstHalf.replace(/u/g, "");


                    firstHalf = firstHalf.substring(0, 4);

                    if (secondHalf !== undefined) {
                        if (secondHalf.length > 3) {
                            secondHalf = secondHalf.substring(0, 3);
                        }
                    }
                    if (thirdPiece !== undefined) {
                        if (thirdPiece.length > 3) {
                            thirdPiece = thirdPiece.substring(0, 3);
                        }
                    }



                    var price = 0;
                    if (secondHalf === undefined) {
                        price = firstHalf;
                    } else if (secondHalf !== undefined && thirdPiece === undefined) {
                        price = firstHalf + secondHalf;
                    } else {
                        price = firstHalf + secondHalf + thirdPiece;
                    }


                    if (secondHalf === undefined && firstHalf.length === 4 && firstHalf.charAt(firstHalf.length - 1) === "0") {
                        taxes = taxes.trim();
                        taxes = taxes.split(" ")[0];

                        var taxString = "";

                        var acceptedCharacters = "0123456789".split("");

                        var taxCharacterArray = taxes.split("");

                        for (var a in taxCharacterArray) {
                            if (!isNaN(parseInt(taxCharacterArray[a]))) {
                                taxString += taxCharacterArray[a];
                            }
                        }

                        if (taxString.charAt(taxString.length - 1) === "0") {
                            taxString = taxString.substring(0, taxString.length - 1);
                        }
                        price = Math.round(parseInt(taxString) / 0.035);
                    }

                    if (!isNaN(parseInt(price))) {
                        processedSaleSuccesses++;
                    }

                    amount = amount.replace(/\n/g, "");
                    if (amount.trim().length <= 4) {
                        if (!isNaN(parseInt(price))) {
                            itemArray.push({
                                name: item,
                                amount: amount,
                                price: price,
                                seller: seller,
                                buyer: buyer,
                                suggestions: []
                            });
                            totalSalesValue += parseInt(price);
                            totalItemAmounts += parseInt(amount);
                        }
                    }

                }
            }
        }
    }
    totalTaxValue = Math.round(parseInt(totalSalesValue) * 0.035);
}

var fullScan = JSON.parse(JSON.stringify(itemArray));

for (var i = 0; i < 9; i++) {
    removeDuplicates();
}

var guildName = process.argv[6];

guildName = guildName.replace(`ifc-`, ``);
guildName = guildName.replace(`.mp4`, ``);

for (var a in itemArray) {
    var object = itemArray[a];
    if (Number.isInteger(parseInt(object.amount)) && Number.isInteger(parseInt(object.price))) {
        if (outputToTSV) {
            output += `${object.amount}\t${object.name}\t${object.price}\t${guildName}\n`;
        } else {
            output += `${object.amount} ${object.name} ${object.price}\n`;
        }
    }
}

var fullOutput = ``;

for (var a in fullScan) {
    var object = fullScan[a];
    if (Number.isInteger(parseInt(object.amount)) && Number.isInteger(parseInt(object.price))) {
        if (outputToTSV) {
            fullOutput += `${object.amount}\t${object.name}\t${object.price}\t${guildName}\n`;
        } else {
            fullOutput += `${object.amount} ${object.name} ${object.price}\n`;
        }
        totalSales++;
    }
}

var finalOutput = ``;

finalOutput = output;

try {
    if (!fs.existsSync(`${process.argv[3]}${process.argv[4]}/`)) {
        fs.mkdirSync(`${process.argv[3]}${process.argv[4]}/`);
    }
} catch (err) {

}

fs.appendFileSync(`${process.argv[5]}taxes/guildData.txt`, `\n${process.argv[6].replace(`ifc-`, ``)}${process.argv[4]}:\n\t${displayNumberInFormal(totalTaxValue)}\tSales: ${processedSaleSuccesses}`);
fs.appendFileSync(`${process.argv[3]}currentGuildData.txt`, `\n${process.argv[6].replace(`ifc-`, ``)}${process.argv[4]}:\n\t${displayNumberInFormal(totalTaxValue)}\tSales: ${processedSaleSuccesses}`);

fs.writeFileSync(`${process.argv[3]}${process.argv[4]}/FULL${process.argv[6]}${process.argv[4]}.tsv`, fullOutput, function(error) {
    if (error) throw error;
});
fs.writeFileSync(`${process.argv[5]}sheets/${process.argv[4]}/FULL${process.argv[6]}${process.argv[4]}.tsv`, fullOutput, function(error) {
    if (error) throw error;
});