// Carrega os tweets do localStorage
function loadTweets() {
    const tweets = JSON.parse(localStorage.getItem("tweets")) || [];
    tweets.forEach(tweet => {
        addTweetToDOM(tweet.username, tweet.content, tweet.likes, tweet.id);
    });
}

// Adiciona um tweet ao DOM
function addTweetToDOM(username, content, likes = 0, id) {
    const newPost = document.createElement("div");
    newPost.className = "post";
    newPost.innerHTML = `
        <h2>${username}</h2>
        <p>${content}</p>
        <div class="post-actions">
            <button class="like-button" data-id="${id}">Curtir (${likes})</button>
            <button class="retweet-button" data-id="${id}">Retweetar</button>
            <button class="delete-button" data-id="${id}">Deletar</button>
        </div>`;

    //  para curtir
    newPost.querySelector(".like-button").addEventListener("click", function() {
        likes++;
        newPost.querySelector(".like-button").innerText = `Curtir (${likes})`;
        updateLikesInLocalStorage(id, likes);
    });

    //retweetar
    newPost.querySelector(".retweet-button").addEventListener("click", function() {
        const retweetContent = `Retweet de @${username}: ${content}`;
        const retweetUsername = document.getElementById("username").value.trim();
        if (retweetUsername === "") {
            alert("Por favor, insira seu nome de usuário.");
            return;
        }
        saveTweetToLocalStorage(retweetUsername, retweetContent);
        addTweetToDOM(retweetUsername, retweetContent);
    });

    // para deletar
    newPost.querySelector(".delete-button").addEventListener("click", function() {
        removeTweetFromLocalStorage(id);
        newPost.remove();
    });

    document.querySelector(".posts").prepend(newPost);
}

// Salva um tweet no localStorage
function saveTweetToLocalStorage(username, content) {
    const tweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const newTweet = { username, content, likes: 0, id: Date.now() };
    tweets.push(newTweet);
    localStorage.setItem("tweets", JSON.stringify(tweets));
}

// Atualiza o número de curtidas no localStorage
function updateLikesInLocalStorage(id, likes) {
    const tweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const updatedTweets = tweets.map(tweet => {
        if (tweet.id === id) {
            return { ...tweet, likes };
        }
        return tweet;
    });
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
}

// Remove um tweet do localStorage
function removeTweetFromLocalStorage(id) {
    const tweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const updatedTweets = tweets.filter(tweet => tweet.id !== id);
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
}

// Adiciona novo tweet
document.querySelector("button").addEventListener("click", function() {
    const usernameInput = document.getElementById("username");
    const textarea = document.querySelector("textarea");
    const username = usernameInput.value.trim();
    const tweetContent = textarea.value.trim();

    if (username === "") {
        alert("Por favor, insira seu nome de usuário.");
        return;
    }

    if (tweetContent !== "") {
        saveTweetToLocalStorage(username, tweetContent);
        addTweetToDOM(username, tweetContent);
        textarea.value = "";
    }
});

// Carrega tweets ao abrir a página
loadTweets();
