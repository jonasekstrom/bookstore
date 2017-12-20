window.addEventListener('load', function(event) {
let apibtn = document.getElementById("apiBtn"),
    apiOutput = document.getElementById('apiOutput'),
    key,

    addbtn = document.getElementById("addBtn"),
    mylist = document.getElementById("mylist"),
    child = document.getElementById("empty"),
    title = document.getElementById('addTitle'),
    author = document.getElementById('addAuthor'),
    result = document.getElementById("result"),
    fail = 0,

    viewBtn = document.getElementById("viewBtn");


apibtn.addEventListener('click', function (event) {
    getKey();
});
addbtn.addEventListener('click', function (event) {
    event.preventDefault();
    addBook();
});
viewBtn.addEventListener('click', function (event) {
    viewBook();
});
mylist.addEventListener('click', function (event) {
    deleteBook();
});
  
    
function getKey() {
    let reqKey = new XMLHttpRequest();
    reqKey.open('GET', 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey', true);
    reqKey.onreadystatechange = function (event) {
        if (reqKey.readyState == 4 && reqKey.status == 200) {
            let outputKey = JSON.parse(reqKey.responseText);
            key = outputKey.key;
            apiOutput.innerHTML = `Recieved: ${key}`;
        }
    };
    reqKey.send();
}
    
function addBook() {
    let addBookReq = new XMLHttpRequest();
    addBookReq.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${key}&title=${title.value}&author=${author.value}`, true)
    addBookReq.onload = function () {
        if (addBookReq.status == 200 && addBookReq.readyState == 4) {
            let addBookOutputFail = JSON.parse(addBookReq.responseText);
            if (addBookOutputFail.status == "error") {
                fail = fail + 1;
                result.innerHTML = `Error: <br /> ${addBookOutputFail.message} <br />Failed: ${fail}`;
               
            } else {
                let addBookOutput = JSON.parse(addBookReq.responseText);
      
                let li = document.createElement('li');
                let bookTitle = document.createElement('span');
                let authorTitle = document.createElement('span');
                let idTitle = document.createElement('p');
                let del = document.createElement('button');

                bookTitle.textContent = title.value;
                authorTitle.textContent = author.value;
                idTitle.textContent = `ID: ${addBookOutput.id}`;
                del.textContent = "Delete";

                bookTitle.classList.add('cool', 'wrapspan');
                authorTitle.classList.add('cool', 'wrapspan');
                del.classList.add('deleteBook');

                li.appendChild(bookTitle);
                li.appendChild(authorTitle);
                li.appendChild(idTitle);
                li.appendChild(del);
                mylist.appendChild(li);

                mylist.style.display = "none";
                viewBtn.style.display = "block";
                result.innerHTML = `${title.value},<br /> ${author.value}<br /> Has been added! ID: ${addBookOutput.id}`;
                result.style.color = "#6cc0ac";
                result.backgroundColor = '#d7666b';
            }
        }
    };
    addBookReq.send();
}


function viewBook() {
    let viewBookReq = new XMLHttpRequest();
    viewBookReq.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${key}`, true);
    viewBookReq.onload = function () {
        let viewBookReqOutput = JSON.parse(viewBookReq.responseText);
        if (viewBookReqOutput.status == 'success') {
            let outputData = Array.from(viewBookReqOutput.data);
            for (i = 0; i < outputData.length; i++) {
                mylist.style.display = "block";

            }
        } else {
            fail = fail + 1;
            result.innerHTML = `Something went very wrong <br /> Please try again!<br />Failed: ${fail}`;
            result.style.color = "#d7666b";
        }
    };
    viewBookReq.send();
}



});

function deleteBook() {
    if (event.target.className == 'deleteBook') {
        let li = event.target.parentElement;
        mylist.removeChild(li);
    }
    if (mylist.children.length == 0) {
        viewBtn.style.display = "block";
        child.style.display = "block";
    }
}
