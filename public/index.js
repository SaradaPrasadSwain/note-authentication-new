const input = document.querySelector(".inputBox input");
const saveButton = document.querySelector("#saveid")
const appendDiv = document.querySelector(".appendDiv")

saveButton.addEventListener("click", ()=>{
    const inputValue = input.value;
    if(inputValue !== "") {
        const newList = document.createElement('div');
        newList.className = 'noteBox';
        newList.textContent = inputValue;
        appendDiv.appendChild(newList);
        input.value = "";
    } else{
        alert("please give input")
    };
    
})

input.addEventListener("keypress", (e)=>{
    if(e.key == "Enter"){
        saveButton.click();
    }
})