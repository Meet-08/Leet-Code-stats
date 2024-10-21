const searchBtn = document.getElementById("searchBtn");
const userInput = document.getElementById("userInput");
const statsContainer = document.querySelector(".statsContainer");
const easyProgressCircle = document.querySelector(".easyProgress");
const mediumProgressCircle = document.querySelector(".mediumProgress");
const hardProgressCircle = document.querySelector(".hardProgress");
const easyLabel = document.getElementById("easyLabel");
const mediumLabel = document.getElementById("mediumLabel");
const hardLabel = document.getElementById("hardLabel");
const cardStatsContainer = document.querySelector(".statsCard");

function validateUsername(username) {
    if (username.trim() === "") {
        return false;
    }
    const regex = /^[a-zA-Z0-9_]{1,15}$/;
    return regex.test(username);
}

async function fetchUserData(username) {
    const url = "https://leetcode-api-faisalshohag.vercel.app/" + username;
    const user = "https://alfa-leetcode-api.onrender.com/" + username;
    try {
        searchBtn.textContent = "Searching...";
        searchBtn.disabled = true;
        searchBtn.style.cursor = "progress";
        statsContainer.style.visibility = "hidden";
        const responce = await fetch(url);
        const res = await fetch(user);
        const nameData = await res.json();
        const parseddata = await responce.json();
        if(nameData.username == null) throw new Error("");
        displayUserData(parseddata,nameData);
        statsContainer.style.visibility = "visible";

    } catch (error) {
        const e = document.createElement("p");
        e.textContent = "User data not found";
        statsContainer.append(e);
    }finally{
        searchBtn.textContent = "Search";
        searchBtn.disabled = false;
        searchBtn.style.cursor = "pointer";
        statsContainer.style.visibility = "visible";
    }
}

function updateProgress(solved,total,label,circle) {
    const progressDegree = Math.ceil((solved/total) * 100);
    circle.style.setProperty('--pro',`${progressDegree}%`);
    label.textContent = solved + "/" + total;
}

function displayUserData(parseddata,{name}) {
    const user = document.getElementById("myP");
    user.classList.add("user");
    user.textContent = `Username : ${name}`;
    statsContainer.prepend(user);
    const {totalEasy,totalHard,totalMedium,totalQuestions
           ,totalSubmissions,matchedUserStats           
          } = parseddata;

    const {acSubmissionNum} = matchedUserStats
    // index 0 = All , 1 = Easy , 2 = Medium , 3 = Hard
    updateProgress(acSubmissionNum[1].count,totalEasy,easyLabel,easyProgressCircle);
    updateProgress(acSubmissionNum[2].count,totalMedium,mediumLabel,mediumProgressCircle);
    updateProgress(acSubmissionNum[3].count,totalHard,hardLabel,hardProgressCircle);

    const cardData = [
        {label : `Overall Submissions`,value : totalSubmissions[0].submissions},
        {label : `Overall Easy Submissions`,value : totalSubmissions[1].submissions},
        {label : `Overall Medium Submissions`,value : totalSubmissions[2].submissions},
        {label : `Overall Hard Submissions`,value : totalSubmissions[3].submissions}
    ];

    cardStatsContainer.innerHTML = cardData.map(
        (data)=>
            `<div class ="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
            </div>`
        
    ).join("");

}

searchBtn.addEventListener("click",() => {
    const username = userInput.value;
    if (!validateUsername(username)) {
        alert("Invalid Username");
        return;
    }

    fetchUserData(username);
});
