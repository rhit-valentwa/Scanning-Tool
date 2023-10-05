
const fs = require(`fs`),
      spawn = require('child_process').spawn;

const inputLocation = "/home/ubuntu/environment/data/input/",
      outputLocation = "/home/ubuntu/environment/data/output/",
      dataLocation = "/home/ubuntu/environment/processing/",
      historyLocation = "/home/ubuntu/environment/history/",
      printSettings = "ignore", //ignore | inherit
      files = fs.readdirSync(`${inputLocation}`);

var currentFolderNumber = 0;
var date = new Date().toISOString().slice(0, 10);

if(files.length === 0){
    console.log(`No videos detected in the ./data/input folder.`);
    console.log(`Exiting program.`);
    process.exit();
}

for(const file of files){
    if(file.endsWith(`.mp4`)){
        fs.renameSync(`${inputLocation}/${file}`, `${inputLocation}/${file.replace(/\s/g, "_")}`);
    }
}

function milToMin(m){
    var minutes = Math.floor(m / 60000);
    var seconds = ((m % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function processImages(folder){
    fs.readdir(`${dataLocation}${folder}/images`, function(err, items) {
        var time = Date.now();
        var filesPerFolder = Math.round(items.length / 4);
        var processors = [];
        var folderSetupProcess = spawn(`
            echo "Scanning ${folder.replace('ifc-', '')}:";
            
            echo "\tMoving images into equal sized folders...";
            
            cd ${dataLocation}${folder}/images;

            mkdir ${dataLocation}${folder}/folder0;
            mkdir ${dataLocation}${folder}/folder1;
            mkdir ${dataLocation}${folder}/folder2;
            mkdir ${dataLocation}${folder}/folder3;
            
            ls -1  |  sort -n | head -${filesPerFolder} | xargs -i mv \"{}\" ${dataLocation}${folder}/folder0;
            ls -1  |  sort -n | head -${filesPerFolder} | xargs -i mv \"{}\" ${dataLocation}${folder}/folder1;
            ls -1  |  sort -n | head -${filesPerFolder} | xargs -i mv \"{}\" ${dataLocation}${folder}/folder2;
            ls -1  |  sort -n | head -${items % 2 === 0 ? filesPerFolder : filesPerFolder - 1} | xargs -i mv \"{}\" ${dataLocation}${folder}/folder3;
        `, {
            stdio: 'inherit',
            shell: true
        });
        folderSetupProcess.on("exit", function(data){
            console.log("\tProcessing images...")
            for(var i = 0; i <= 3; i++){
                processors.push(spawn(`
                    ${console.log(`\t\tRunning OCR process ${i}`)}
                    
                    cd ${dataLocation}${folder}/folder${i};
                    for f in *.png;do cuneiform -l eng -f text -o $(basename $f .png).txt $f;done;
                    rm *.png;
                    cat *.txt > text${i}.doc;
                    rm *.txt;
                    mv text${i}.doc ${dataLocation}${folder};
                `, {
                    stdio: printSettings,
                    shell: true
                }));
            }
             
            console.log(`\t${milToMin(items.length * 69.805804)} estimated minutes...`);
            
            processors[processors.length - 1].on("exit", function(data){
                
                setTimeout(function(){
                    var textProcessor = spawn(`
                        echo "\tMerging doc files into a txt file..."
                        cd ${dataLocation}${folder};
                        cat *.doc > final.txt;
                        echo "\tConverting txt file into a tsv file...\n"
                        node /home/ubuntu/environment/processor.js ${dataLocation}${folder}/final.txt ${outputLocation} ${date} ${historyLocation} ${folder};
                        `, {
                            stdio: `inherit`,
                            shell: true
                        });
                        
                    textProcessor.on("exit", function(data){
                        if(currentFolderNumber !== files.length - 1){
                            processImages(fs.readdirSync(`${dataLocation}`)[currentFolderNumber = currentFolderNumber + 1]);
                        }
                          else {
                                var mergeFiles = spawn(`
                                echo "Merging tsv files..."
                                cd ${outputLocation}${date};
                                cat *.tsv > ${outputLocation}${date}.tsv
                                `, {
                                    stdio: `inherit`,
                                    shell: true
                                });
                                
                                mergeFiles.on("exit", function(data) {
                                    var finalProcess = spawn(`
                                        echo "Correcting scan spelling..."
                                        node spelling ${date} ${outputLocation}
                                        echo "Removing Duplicates..."
                                        node removeDuplicates ${outputLocation}${date}.tsv
                                    `, {
                                        stdio: `inherit`,
                                        shell: true
                                    }); 
                                    finalProcess.on("exit", function(data){
                                       console.log("Completed Processing.");
                                       process.exit(0); 
                                    });
                                });
                        }
                    });
                }, 5000);
            })
        });
    });
};

const setupProcess = spawn(`
        
        echo "Setting up...";
        
        rm -r ${dataLocation};
        rm -r ${outputLocation};
        
        mkdir ${outputLocation};
        mkdir ${historyLocation}sheets/${date}
        
        touch ${outputLocation}currentGuildData.txt
        
        echo "Creating folders for each video..."
        cd ${inputLocation}
        for f in *.mp4; do mkdir -p "${dataLocation}$f/images";done;

        echo "Breaking footage into photos..."
        cd ${inputLocation}
        for f in *.mp4; do ffmpeg -loglevel warning -i \"${inputLocation}$f\" \"${dataLocation}$f/images/thumb%04d.png\"; done;
        
        echo "Removing the .mp4 from the folder names...\n"
        cd ${dataLocation}
        rename 's/\.mp4//' *
      `, {
  stdio: 'inherit',
  shell: true
});

setupProcess.on("exit", function(data){
    processImages(fs.readdirSync(`${dataLocation}`)[currentFolderNumber]);
});