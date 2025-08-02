const fonts = document.querySelectorAll(".switcher-dropdown > p");
const webpageSettings = document.querySelectorAll("*");
const selectedFont = document.getElementById("font-selected");
const fontSelector = document.getElementById("font-selector");
const fontsBox = document.getElementById("fonts-box");
const darkModeButton = document.getElementById("theme-button");
let isDark = false;

fonts.forEach(font =>{ 
    font.addEventListener("click", function(e){
        if (e.target.textContent === "Sans Serif"){
           webpageSettings.forEach(el => {el.style.fontFamily = "sans-serif"})
          selectedFont.textContent = 'Sans';
        }
        if (e.target.textContent === "Serif"){
            webpageSettings.forEach(el => {el.style.fontFamily = "serif"});
           selectedFont.textContent = 'Serif';
         }
         if (e.target.textContent === "Mono"){
            webpageSettings.forEach(el => {el.style.fontFamily = "monospace"});
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

darkModeButton.addEventListener("click", leftOrRight)
