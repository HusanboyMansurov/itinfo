async function getAuthors() {
  let accessToken = localStorage.getItem("accessToken");
  console.log("accessToken:", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("accessTokenExpTime:", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol");
    } else {
      console.log("Access token vaqti chiqib ketdi");
      accessToken = await refreshTokenFunc();
      console.log("NewAccessToken:", accessToken);
    }
  }

  fetch("http://45.130.148.227:3030/api/author/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    mode: "cors", //keyin o'rgataman
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed with status: " + response.status);
      }
    })
    .then((author) => {
      console.log(author.data);
      displayAuthor(author.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayAuthor(authors) {
  const authorList = document.getElementById("author-list");
  authors.forEach((author) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${author.first_name} ${author.last_name} - ${author.email}`;
    authorList.appendChild(listItem);
  });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

async function refreshTokenFunc() {
  try {
    const response = await fetch(
      "http://45.130.148.227:3030/api/author/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.error && data.error == "jwt expired") {
      console.log("Refresh tokkenni ham vaqti chiqib ketdi");
      return window.location.replace("/login");
    }
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log("RefreshToken:", error);
    return window.location.replace("/login");
  }
}
