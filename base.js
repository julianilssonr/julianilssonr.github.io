let page;
const btn = document.querySelector(".btn");
btn.addEventListener("click", async function () {
    document.getElementById("WelcomeText").style.display = "none";
    const url = getURL();
    removeOldPage(page);
    getPictures(url, 1);
});

function getURL() {
    const input = document.getElementById("search").value;
    if (input == "") {
        document.getElementById("gallery").innerHTML = "<p>You have to enter a search word.</p>";

    }
    else {
        document.getElementById("gallery").innerHTML = "";
    }
    let perPage;
    if (document.getElementById("perPage1").checked == true) {
        perPage = "10";
    }
    else if (document.getElementById("perPage2").checked == true) {
        perPage = "20";
    }
    else if (document.getElementById("perPage3").checked == true) {
        perPage = "40";
    }
    else {
        perPage = "20";
    }
    const url = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=9b810e28a7c40517a6fb2ea12dad20b4&text=${input}&per_page=${perPage}&sort=relevance&format=json&nojsoncallback=1`;
    return url;
}

async function getPictures(url, page) {
    let getApi;
    if (page == 1) {
        getApi = await fetch(url);
    }
    else {
        getApi = await fetch(url + "&page=" + page);
    }

    const jsonData = await getApi.json();

    let size;
    if (document.getElementById("size1").checked == true) {
        size = "_w";
    }
    else if (document.getElementById("size2").checked == true) {
        size = "_c";
    }
    else if (document.getElementById("size3").checked == true) {
        size = "_b";
    }
    else {
        size = "";
    }

    for (let picture of jsonData.photos.photo) {
        let img = document.createElement("img");
        let id = picture.id;
        let server = picture.server;
        let secret = picture.secret;
        let farm = picture.farm;

        const URL_2 = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}${size}.jpg`;
        img.setAttribute("src", URL_2);
        img.classList.add("imgSearch");
        img.addEventListener("click", function () {
            const body = document.getElementById("lightBox");
            body.classList.add("lightboxActive");
            const imgTag = document.getElementById("currentImg");
            imgTag.src = img.src;
            let exitBtn = document.createElement("button");
            exitBtn.innerText = "X";
            document.getElementById("lightBox").append(exitBtn);
            exitBtn.addEventListener("click", function () {
                imgTag.src = "";
                exitBtn.remove();
                body.classList.remove("lightboxActive");
            });
        });
        document.getElementById("gallery").append(img);
    };

    if (page != 1) {
        var btnPast = document.createElement("button");
        btnPast.setAttribute("id", "btn2");
        btnPast.innerHTML = "Past Page";
        document.getElementById("buttonSection").appendChild(btnPast);
        btnPast.addEventListener("click", async function () {
            removeOldPage(page);
            const url = getURL();
            page--;
            getPictures(url, page);
        });
    }

    var btnNext = document.createElement("button");
    btnNext.setAttribute("id", "btn3");
    btnNext.innerHTML = "Next Page";
    document.getElementById("buttonSection").appendChild(btnNext);
    btnNext.addEventListener("click", async function () {
        removeOldPage(page);
        page++;
        const url = getURL();
        getPictures(url, page);
    });
};

function removeOldPage(page) {
    var oldPictures = document.getElementsByClassName("imgSearch");
    if (oldPictures.length > 0) {
        const count = oldPictures.length - 1;
        for (let i = count; i >= 0; i--) {
            oldPictures[i].remove();
        }

    }
    var btn3 = document.getElementById("btn3");
    if (btn3 != null) {
        btn3.remove();
    }
    var btn2 = document.getElementById("btn2");
    if (btn2 != null) {
        btn2.remove();
    }
};