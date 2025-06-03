const input = document.querySelector(".inputBox input");
const saveButton = document.querySelector("#saveid");
const appendDiv = document.querySelector(".appendDiv");


saveButton.addEventListener("click", ()=>{
    const inputValue = input.value;
    if(inputValue !== ""){
        fetch("/notes", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: inputValue})
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            const newList = document.createElement('div');
            newList.className = 'noteBox';

            const span = document.createElement('div')
            span.textContent = inputValue;

            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'deleteBtn';

            newList.appendChild(span);
            newList.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", ()=>{
                fetch(`/notes/${data.noteId}`, {
                    method: 'DELETE',
                    headers: {
                        'content-type' : 'application/json'
                    }
                })
                .then( response => {
                    return response.json();
                })
                .then(data => {
                    newList.remove();
                })

            })

            appendDiv.appendChild(newList);
            input.value = "";
        })

    }

})

// saveButton.addEventListener("click", ()=>{
//     const inputValue = input.value;
//     if(inputValue !== "") {
//         const newList = document.createElement('div');
//         newList.className = 'noteBox';

//         const span = document.createElement('div')
//         span.textContent = inputValue;


//         const deleteBtn = document.createElement('Button')
//         deleteBtn.textContent = 'Delete';
//         deleteBtn.className = 'deleteBtn'

//         newList.appendChild(span);
//         newList.appendChild(deleteBtn);

//         deleteBtn.addEventListener("click", ()=>{
//                 newList.remove();
//             })

//         appendDiv.appendChild(newList);
//         input.value = "";
//     }
    
// })

input.addEventListener("keypress", (e)=>{
    if(e.key == "Enter"){
        saveButton.click();
        e.preventDefault();
    }
})


fetch('/api/notes')
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.forEach(note => {
            const newList = document.createElement('div');
            newList.className = 'noteBox';

            const span = document.createElement('div')
            span.textContent = note.data;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'deleteBtn';

            newList.appendChild(span);
            newList.appendChild(deleteBtn)

            deleteBtn.addEventListener("click", ()=>{
                fetch(`/notes/${note._id}`, {
                    method: 'DELETE',
                    headers: {
                        'content-type' : 'application/json'
                    }
                })
                .then( response => {
                    return response.json();
                })
                .then(data => {
                    newList.remove();
                })

            })

            appendDiv.appendChild(newList);
            input.value = "";
        })
    })

