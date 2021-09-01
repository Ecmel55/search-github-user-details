const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)

        createUserCard(data)
        getRepos(username)
    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('User not found <br> Kulanıcı Bulanamadı')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')

        addReposToCard(data)
    } catch(err) {
        createErrorCard('Problem fetching repos <br> Hata! Proje getirilemiyor')
    }
}

function createUserCard(user) {
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
    <div> 
        <a href="${user.html_url}" target="_blank"><img src="${user.avatar_url}" alt="${user.name}" class="avatar"></a>
    </div>
    <div class="user-info">
        <a href="${user.html_url}" target="_blank" style="color:#fff"><h2>${userID}</h2></a>
      ${userBio}
      <div class="created">
      <p> Creation date / oluşturulma tarihi: ${user.created_at}
      </div>
      <ul>
        <li>${user.followers} <strong>Followers <br> Takipçiler</strong><center></li>
        <li>${user.following} <strong>Following <br> Takip Edilen</strong></li>
        <li>${user.public_repos} <strong>Repos <br> Projeler</strong></li>
      </ul>

      <div id="repos"></div>
    </div>
  </div>
    `
    main.innerHTML = cardHTML
    
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }
})

