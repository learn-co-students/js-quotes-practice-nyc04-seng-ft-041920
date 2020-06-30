const likesUrl = 'http://localhost:3000/quotes?_embed=likes'
const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

/**Initial Fetch */
fetch(likesUrl)
  .then(r => r.json())
  .then(renderQuotes)


/**Render Helper */
function renderQuotes(quotesArr){
  quotesArr.forEach(quote => {
    renderQuote(quote)
  });
}

function renderQuote(quote){
  const card = document.createElement('li')
  card.className = 'quote-card'

  card.innerHTML += `
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${getLikes(quote)}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>
  `
  const likeBtn = card.querySelector('.btn-success')
  const deleteBtn = card.querySelector('.btn-danger')

  likeBtn.addEventListener('click', function _func(e){
    likeQuote(quote, e)
  })
  deleteBtn.addEventListener('click', function _func(e){deleteQuote(quote,e)})
  quoteList.append(card)
}



function likeQuote(quote, e){
  const likes = {
    "quoteId": quote.id
  }
  updateLike(likes)
  e.target.querySelector('span').innerText = quote.likes.length + 1
}

function deleteQuote(quote,e){
  
  deleteQuoteReq(quote)
  e.target.closest('.quote-card').remove()
}
/**Event Listener */

newQuoteForm.addEventListener('submit', e => {
  e.preventDefault()
  const newQuote = {
    "quote": newQuoteForm.quote.value,
    "author": newQuoteForm.author.value,
  }
  createQuote(newQuote)
})

function createQuote(quote){
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
  .then(r => r.json())
  .then(data => {
    console.log('Success:', data);
    renderQuote(data)
  })
}

function deleteQuoteReq(quote){
  fetch('http://localhost:3000/quotes/'+quote.id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(r => r.json())
  .then(data => {
    console.log('Deleted:', data);
  })
}

function updateLike(likes){
  fetch('http://localhost:3000/likes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(likes)
  })
  .then(r => r.json())
  .then(data => {
    console.log('likes:', data);
  })
}

function getLikes(quote){
  if(quote.likes){
    return quote.likes.length
  }else{
    return 0
  }
}