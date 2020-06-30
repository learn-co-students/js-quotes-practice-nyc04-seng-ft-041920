fetchQuotes()
createNewQuote()


function fetchQuotes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(function(res){
        return res.json()
    })
    .then(function(quotesArray) {
        quotesArray.forEach(function(quoteObj) {
            renderQuote(quoteObj)
        })
    })
}

function renderQuote(quoteObj) {
    const quoteList = document.querySelector("#quote-list")
    const quoteLi = document.createElement("li")
    quoteLi.className = "quote-card"
    quoteLi.innerHTML += `
        <blockquote class="blockquote">
            <p class="mb-0">${quoteObj.quote}</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${getLikes(quoteObj)}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    `
    quoteList.append(quoteLi)

    const deleteButton = quoteLi.querySelector(".btn-danger")
    const likeButton = quoteLi.querySelector(".btn-success")
    deleteButton.addEventListener("click", function(e) {
        deleteQuote(quoteObj)
        quoteLi.remove()
    })

    const likeSpan = quoteLi.querySelector("span")

    likeButton.addEventListener("click", function(e) {
        const likeObj = {
            quoteId: quoteObj.id
        }
        postLike(likeObj)
        console.log(likeSpan.textContent)
        likeSpan.textContent = parseInt(likeSpan.textContent) + 1
    })
}

function createNewQuote() {
    const newQuoteForm = document.querySelector("#new-quote-form") 
    newQuoteForm.addEventListener("submit", function(e) {
        e.preventDefault()

        const newQuoteObj = {
            "quote": newQuoteForm.quote.value,
            "author": newQuoteForm.author.value,
        }

        postNewQuote(newQuoteObj)
    })
}

function postNewQuote(quoteObj) {
    configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(quoteObj)
    }

    fetch("http://localhost:3000/quotes", configObj)
    .then(function(res) {
        return res.json()
    })
    .then(function(newQuoteObj) {
        renderQuote(newQuoteObj)
    })
}

function postLike(likeObj) {
    configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(likeObj)
    }

    fetch("http://localhost:3000/likes", configObj)
    .then(function(res) {
        return res.json()
    })
    .then(function(newLikeObj) {
        console.log(newLikeObj)
    })
}

function deleteQuote(quoteObj) {
    configObj = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json" 
        }
    }

    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, configObj)
    .then(function(res) {
        return res.json()
    })
    .then(function(obj) {
    })  
}

function getLikes(quoteObj) {
    if(quoteObj.likes) {
        return quoteObj.likes.length
    }
    else {
        return 0
    }
}