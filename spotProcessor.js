var fs = require('fs');

var path = './output/2022-06-09'

var files = fs.readdirSync(path);

var reverseString = function(string){
    var splitString = string.split(""),
        reverseArray = splitString.reverse();
    return reverseArray.join("");
};

var displayNumberInFormal = function(number){
    var string = number;
    if(string !== undefined){
        string = reverseString(number.toString()).split("");
    }
    var output = "";
    if(number.toString().length > 3){  
        for(var i in string){
            if(i % 3 == 0){
                output += ",";
            }
                output += string[i];
        }
        output = output.slice(1,output.length)    
        return reverseString(output);
    }
    else {
        return number;
    }    
};

for(var i in files){
    
    var sales = fs.readFileSync(path + '/' + files[i]).toString().trim().split('\n');
    
    var totalTaxValue = 0;
    
    for(var a in sales){
        totalTaxValue += parseInt(sales[a].split('\t')[2]) * 0.035;
    }
    
    fs.appendFileSync(`/home/ubuntu/environment/guildData.txt`, `\n${files[i].replace(`FULLfolderCropped_`, ``).replace('.tsv', '')}:\n\t${displayNumberInFormal(Math.round(totalTaxValue))}\tSales: ${sales.length}`);
                    
}