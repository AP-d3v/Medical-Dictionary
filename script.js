const fonts = document.querySelectorAll(".switcher-dropdown > p");
const selectedFont = document.getElementById("font-selected");
const fontSelector = document.getElementById("font-selector");
const fontsBox = document.getElementById("fonts-box");
const darkModeButton = document.getElementById("theme-button");
let isDark = false;
const searchButton = document.getElementById("search-icon"); 
const wordDisplay = document.getElementById("word-display");
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
        document.body.classList.add("dark-mode"); 
        
    } else {
        darkModeButton.classList.remove("slide-to-the-right");
        darkModeButton.classList.add("slide-to-the-left");
        document.body.classList.remove("dark-mode"); 
        
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
        populateHeaderDisplay(data)
    }
    
    catch(error){ 
        console.error(`Could not fetch definition${error}`);
    }
    
}



searchButton.addEventListener("click", function(e){
    e.preventDefault();
    searchTerm = document.getElementById("search-bar").value;
    fetchDefintion(searchTerm);
    wordDisplay.innerHTML = ''


})

function  populateHeaderDisplay(data){
    
    //populate title and pronuctiation 
    const wordTitle = document.createElement("h1");   
    wordTitle.textContent = data[0].hwi.hw.replace(/\*/g,"");
    wordDisplay.appendChild(wordTitle);
    const wordPronounceText = document.createElement("p");
    wordPronounceText.textContent = data[0].hwi.prs[0].mw;
    wordDisplay.appendChild(wordPronounceText);

    //button 
    fetch("Assets/Images/icon-play.svg")
    .then(res => res.text())
    .then(svgData => {
        const buttonSVG = document.createElement("div");
        buttonSVG.innerHTML = svgData;
        wordDisplay.appendChild(buttonSVG);
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

            fetch(`https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${audioFile}.mp3`)
            .then(res => res.blob())
            .then(audio => new Audio(URL.createObjectURL(audio)).play())
        })

    });






}