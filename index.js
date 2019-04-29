const BOOKS_URL = "http://localhost:3000/books"
const ul = document.getElementById('list')
const showPanel = document.getElementById('show-panel')


fetch(BOOKS_URL)
  .then(resp => resp.json())
  .then(json => populationListPanel(json))

function populationListPanel(json) {
  json.forEach( (book) => {
    const li = document.createElement('li')
    li.textContent = book.title
    li.addEventListener('click', () => displayBook(book))
    ul.appendChild(li)
  })
}

function clearShowPanel() {
  while (showPanel.firstChild) {
    showPanel.firstChild.remove()
  }
}

function displayBook(book){
  clearShowPanel()

  const img = document.createElement('img')
  img.src = book.img_url
  showPanel.appendChild(img)

  const h2 = document.createElement('h2')
  h2.textContent = book.title
  showPanel.appendChild(h2)

  const p = document.createElement('p')
  p.textContent = book.description
  showPanel.appendChild(p)

  const users = document.createElement('ul')
  users.textContent = "User who like this title:"
  showPanel.appendChild(users)
  book.users.forEach( (user) => {
    const li = document.createElement('li')
    li.textContent = user.username
    users.appendChild(li)
  })

  const button = document.createElement('button')
  button.textContent = "Like"
  showPanel.appendChild(button)
  button.addEventListener('click', () => handleLike(book))
}

function handleLike(book) {
  makeBody(book)
  patchBook(book).then(json => displayBook(book))
}

function makeBody(book) {
  const index = book.users.map((user) => user.id).indexOf(1)
  if (index < 0 ) {
    book.users.push({"id":1, "username":"pouros"})
  } else {
    book.users.splice(index, 1)
  }
}

function patchBook(book) {
  return fetch(BOOKS_URL + "/" + book.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      users: book.users
    })
  })
  .then(resp => resp.json())
}
