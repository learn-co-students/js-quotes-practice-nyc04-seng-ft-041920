const quoteUl = document.querySelector("#quote-list");
let initialQuoteObj = null;
function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp => resp.json()).then(quoteObj => {
            initialQuoteObj = quoteObj
            quoteObj.forEach(quote => {
                renderQuote(quote);
            })
        })
}

fetchQuotes()
function renderQuote(quote) {
    const quoteLi = document.createElement('li');
    quoteLi.className = 'quote-card';
    quoteLi.dataset.id = quote.id;
    quoteLi.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`
    quoteUl.append(quoteLi);
    activateDelete()
    activateLikes()
}

function handleSubmission() {
    const newQuoteForm = document.querySelector('#new-quote-form');
    newQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const quote = e.target.quote.value;
        const author = e.target.author.value;
        const likes = []
        createQuote(quote, author, likes);
    })
}

handleSubmission()

function createQuote(quote, author, likes) {
    const fetchPayload = {
        quote: quote,
        author: author,
        likes: likes
    }
    const fetchObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchPayload)
    }

    fetch('http://localhost:3000/quotes?_embed=likes', fetchObj)
        .then(resp => resp.json()).then(renderQuote)
}

function activateDelete() {
    let deleteBtn = document.querySelectorAll('.btn-danger');
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.parentElement.parentElement.dataset.id);
            sendDelete(id)
            updateLi(id, 'delete')
        })
    })
}

function activateLikes() {
    let likeBtn = document.querySelectorAll('.btn-success');

    likeBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.parentElement.parentElement.dataset.id);
            commitLike(id)
            updateLi(id, 'like')
        })
    })
}

function updateLi(id, type) {

    const liList = document.querySelectorAll('li');

    liList.forEach(li => {
        if (parseInt(li.dataset.id) === id) {
            if (type === 'delete') {
                li.remove()
            } else {
                let Likes = parseInt(li.childNodes[1].children[3].innerText.slice(6).trim())

                li.childNodes[1].children[3].innerHTML = `Likes: ${Likes + 1}`
            }
        }
    })
}

function sendDelete(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
}



function commitLike(id) {
    let date = new Date()
    const fetchPayload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            quoteId: id,
            createdAt: date
        })
    }
    fetch('http://localhost:3000/likes', fetchPayload)
        .then(resp => resp.json()).then(json => json.render)
}

