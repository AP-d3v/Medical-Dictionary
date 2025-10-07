const fonts = document.querySelectorAll(".switcher-dropdown > p");
const selectedFont = document.getElementById("font-selected");
const fontSelector = document.getElementById("font-selector");
const fontsBox = document.getElementById("fonts-box");
const darkModeButton = document.getElementById("theme-button");
let isDark = false;
const searchButton = document.getElementById("search-icon"); 
const wordDisplay = document.getElementById("word-display");
const wordAudio = document.getElementById("word-audio")
const defBody = document.getElementById("definition-body");
const defHeading = document.getElementById("heading-container")



fonts.forEach(font =>{ 
    font.addEventListener("click", function(e){
        let font = e.target.textContent
        if (font === "Sans Serif"){
            document.documentElement.style.setProperty( '--font-family', 'sans-serif');
            selectedFont.textContent = 'Sans';
        }
        if (font === "Serif"){
            document.documentElement.style.setProperty( '--font-family', 'serif');
            selectedFont.textContent = 'Serif';
         }
         if (font === "Mono"){
            document.documentElement.style.setProperty( '--font-family', 'monospace');
            selectedFont.textContent = 'Mono';
         }
         
    });
});

fontSelector.addEventListener("mouseover", function(){
    fontsBox.style.display = 'flex';
});

fontSelector.addEventListener("mouseout", function(){
    fontsBox.style.display = 'none';
})

function leftOrRight(){
    
    if(!isDark){
        darkModeButton.classList.remove("slide-to-the-left");
        darkModeButton.classList.add("slide-to-the-right");
        document.documentElement.classList.add("dark-mode"); 
        
    } else {
        darkModeButton.classList.remove("slide-to-the-right");
        darkModeButton.classList.add("slide-to-the-left");
        document.documentElement.classList.remove("dark-mode"); 
        
    }

    isDark = !isDark
}

darkModeButton.addEventListener("click", leftOrRight
)

async function fetchDefintion(term) {
    try{
        const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/medical/json/${term}?key=2c7d3381-21ad-49ba-bb5f-85041697b51a`);
        if(!response.ok){
            throw new Error(`HTTP error: ${response.status}`)
        }
        const data = await response.json();
        console.log(data);
        try{
            populateHeaderDisplay(data);
            populateDefinitionBody(data);
        }
        catch{

            console.log("not a full definition, tryinhg alternate function");
            if(Object.hasOwn(data[0], 'hwi')){
                populateDefinitionBody(data);
            } else{
                dontHaveTerm(data);
            }
        }
        
    }
    
    catch(error){ 
        console.error(`Not a main definition${error}`);
    }
    
}



searchButton.addEventListener("click", function(e){
    e.preventDefault();
    searchTerm = document.getElementById("search-bar").value;
    fetchDefintion(searchTerm);
    wordDisplay.innerHTML = '';
    wordAudio.innerHTML = '';
    defBody.innerHTML = '';




})

function  populateHeaderDisplay(data){
    
    //populate title and pronuctiation 
    const wordTitle = document.createElement("h1");   
    wordTitle.textContent = data[0].hwi.hw.replace(/\*/g,"").charAt(0).toUpperCase() + data[0].hwi.hw.replace(/\*/g,"").slice(1);
    wordTitle.classList.add("title")
    wordDisplay.appendChild(wordTitle);
    const wordPronounceText = document.createElement("p");
    wordPronounceText.textContent = data[0].hwi.prs[0].mw;  //bug here with similar words without prs key 
    wordPronounceText.classList.add("pronounce");
    wordDisplay.appendChild(wordPronounceText);

    //button 
    fetch("Assets/Images/icon-play.svg")
    .then(res => res.text())
    .then(svgData => {
        const buttonSVG = document.createElement("div");
        buttonSVG.innerHTML = svgData;
        wordAudio.appendChild(buttonSVG);
        const svg = buttonSVG.querySelector("svg");
        const buttonSVGCircle = buttonSVG.querySelector("circle");
        const buttonSVGTriangle = buttonSVG.querySelector("path");
        
        svg.addEventListener("mouseover",function(){
            buttonSVGCircle.setAttribute("fill", "#8a2be2")
            buttonSVGCircle.setAttribute("opacity", "100%")
            buttonSVGTriangle.setAttribute("fill", "#ffffff")
        })

        svg.addEventListener("mouseout", function(){
            buttonSVGCircle.setAttribute("fill","#A445ED");
            buttonSVGCircle.setAttribute("opacity", ".25");
            buttonSVGTriangle.setAttribute("fill", "#A445ED")

        })

        svg.addEventListener("click", function(){
            const audioFile = data[0].hwi.prs[0].sound.audio
            let subdir;
            if(audioFile.startsWith("bix")){
                subdir = "bix";
            } else if(audioFile.startsWith("gg")){
               subdir = "gg";
            } else if(/^[0-9\p{P}]/u.test(audioFile)){
                subdir = "number";
            } else{
                subdir = audioFile[0];
            }

            const audio = new Audio(`https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${audioFile}.mp3`)
            audio.play()
        })

    });

}

function populateDefinitionBody(data){
    const mainHeadWordDef = data[0].shortdef;
    let partOfSpeach = document.createElement("h2");
    partOfSpeach.textContent = data[0].fl;
    defBody.appendChild(partOfSpeach);
    partOfSpeach.classList.add("part-of-speach");
    const meaningLabel = document.createElement("p");
    meaningLabel.textContent = "Meaning";
    meaningLabel.classList.add("meaning-label");
    defBody.appendChild(meaningLabel);
    const mainDefList =  document.createElement("ul");
    defBody.appendChild(mainDefList);
    
    for (def of mainHeadWordDef){
        const definition = document.createElement("li");
        definition.textContent = def.charAt(0).toUpperCase() + def.slice(1);
        mainDefList.appendChild(definition);
    } 
    
    let firstIteration = true 

    for (i = 1; i < data.length; i++) {
        const wordMatch = data[0].hwi.hw.replace(/\*/g,"")
        if (wordMatch != data[i].hwi.hw){
            continue
        }
        if (firstIteration){
            let partOfSpeach = document.createElement("h2");
            partOfSpeach.textContent = data[i].fl;
            defBody.appendChild(partOfSpeach);
            partOfSpeach.classList.add("part-of-speach");
            const meaningLabel = document.createElement("p");
            meaningLabel.classList.add("meaning-label");
            meaningLabel.textContent = "Meaning";
            defBody.appendChild(meaningLabel);
            firstIteration = false;

        }

        const altDefList = document.createElement("ul");
        defBody.appendChild(altDefList);
        const altHeadWordDef = data[i].shortdef;
        for (def of altHeadWordDef){
            const definition = document.createElement("li");
            definition.textContent = def.charAt(0).toUpperCase() + def.slice(1);
            altDefList.appendChild(definition);
        }

    }
}

function dontHaveTerm(data){
    const didYouMean = document.createElement("span");
    wordDisplay.appendChild(didYouMean);
    didYouMean.textContent = "Did you Mean? ";
    for(i = 0; i < data.length; i++){
        const possibleWrd = document.createElement("span");
        wordDisplay.appendChild(possibleWrd);
        possibleWrd.classList.add("possible-word");
        possibleWrd.textContent = `${data[i]}`;
        possibleWrd.addEventListener("click", function(e){
            e.preventDefault();
            searchTerm = possibleWrd.textContent;
            fetchDefintion(searchTerm);
            wordDisplay.innerHTML = '';
            wordAudio.innerHTML = '';
            defBody.innerHTML = '';
        })
        const spacing = document.createElement("span");
        wordDisplay.appendChild(spacing);
        spacing.textContent = ` `
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
  fetchDefintion("nurse").then(() => {
  const firstList = document.querySelector('ul');
  if (firstList) {
    const customDef = document.createElement("li");
    customDef.classList.add("custom-def")
    customDef.textContent = "\"My sister is an ED nurse who rapidly stabilizes trauma patients and coordinates care with physicians and other healthcare professionals\"";
    firstList.appendChild(customDef);
  }
})

});