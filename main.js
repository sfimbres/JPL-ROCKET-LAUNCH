// Initialize Values 
let velocity = 0;
let altitude = 0;
let count = 1;
let rocketChoice = "";
let launchpadChoice = "";
let dateChoice = "";
let info = document.getElementById("info");
let prompt = document.getElementById("prompt");
let container = document.getElementById("container");

//form for prompt1
let form1 = `
    <form id="form1">
        <select id="rocketlist" name="rocketlist">
        <select>
        <br>
        <button type="submit">SELECT</button>
    </form>
`;

//function to fetch rocket data from SpaceX API and populate data in an HTML form
function getRockets(){
    fetch("https://api.spacexdata.com/v4/rockets")
    .then((res) => res.json())
    .then((data) => {
        data.forEach(rocket => {
            let option = document.createElement("option");
            option.value = rocket.name;
            option.text = rocket.name;
            document.getElementById("rocketlist").appendChild(option);
        });
    }) 
}

//function to prompt user to select rocket
function prompt1(){
    prompt.innerHTML = "Select your rocket ...";
    container.innerHTML = form1;
    getRockets();
    document.getElementById("form1").addEventListener("submit", (e) => {
        e.preventDefault();
        rocketChoice = document.getElementById("rocketlist").value;
        next();
    });
}

//form for prompt 2
let form2 = `
    <form id="form2">
        <select id="padlist" name="padlist">
        <select>
        <br>
        <button type="submit">SELECT</button>
    </form>
`;

//function to fetch launchpad data from SpaceX API and populate data in an HTML form
function getLaunchpads(){
    fetch("https://api.spacexdata.com/v4/launchpads")
    .then((res) => res.json())
    .then((data) => {
        data.forEach(launchpad => {
            let option = document.createElement("option");
            option.value = launchpad.name;
            option.text = launchpad.name;
            document.getElementById("padlist").appendChild(option);
        });
    }) 
}

//function to prompt user to select launchpad
function prompt2(){
    prompt.innerHTML = "Select your launchpad ...";
    container.innerHTML = form2;
    getLaunchpads();
    document.getElementById("form2").addEventListener("submit", (e) => {
        e.preventDefault();
        launchpadChoice = document.getElementById("padlist").value;
        next();
    });
}

//form for prompt 3
let form3 = `
    <form id="form3">
        <input id="date" type="datetime-local" name="date" value="2023-05-20T08:30" />
        <br>
        <button type="submit">SELECT</button>
    </form>
`;

//function to prompt user to select time and date
function prompt3(){
    prompt.innerHTML = "Select launch time and date ...";
    container.innerHTML = form3;
    document.getElementById("form3").addEventListener("submit", (e) => {
        e.preventDefault();
        dateChoice = document.getElementById("date").value;

        let formattedDate = new Date(dateChoice).getTime();
        let currentTime = new Date().getTime();

        console.log(formattedDate - currentTime);
        console.log(formattedDate - currentTime < 300000);

        //check if 5+ minutes away
        if (formattedDate - currentTime < 300000){
            prompt.innerHTML = "Error - Invalid date...";
            dateChoice = "";
            setTimeout(prompt3, 1000);
        }
        
        else{
            next();
        }
    });
};

//function for 5 minute countdown
function startCountdown(){
    //format launch date
    let formattedDate = new Date(dateChoice).getTime();

    //countdown with 5 minutes left
    const timer = setInterval(() => {

        let currentTime = new Date().getTime();
        let difference = formattedDate - currentTime;

        let days = Math.floor(difference/(1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60))/(1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60))/1000);

        //check 5 minutes or under
        if ((days === 0) && (hours === 0)){
            if((minutes === 5 && seconds === 0) || minutes < 5){
                container.innerHTML = `<p class="countdown"> ${minutes}m ${seconds}s </p>`;
            }
        }

        if (difference < 0){
            clearInterval(timer);
            next();
        }
        
    }, 1000)
}

//function to initiate countdown
function prompt4(){
    prompt.innerHTML = "Countdown ...";
    container.innerHTML = `<p class="display"> *** countdown will start within 5 minutes of launchtime ***</p>`;
    info.innerHTML = `Launching: ${rocketChoice} | ${launchpadChoice} | ${dateChoice} `;
    startCountdown();
}

//helper function to update velocity w/ arbitrary numbers
function updateVelocity(){
    velocity = velocity + 57;
}

//helper function to update altitude w/ arbitrary numbers
function updateAltitude(){
    altitude = altitude + 153
}

//function to control 2 minute launch
function launch(){
    //format launch date
    let launchEnd = new Date(new Date().getTime() + 120000).getTime();

    const timer = setInterval(() => {
        
        let currentTime = new Date().getTime();
        let difference = launchEnd - currentTime;

        let minutes = Math.floor((difference % (1000 * 60 * 60))/(1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60))/1000);

        updateAltitude();
        updateVelocity();
        container.innerHTML = `<p class="display">Altitude: ${altitude} | Velocity: ${velocity} </p>`;

        if (difference < 0){
            clearInterval(timer);
            next();
        }
        
    }, 1000)
}

//function to update screen with launch information
function prompt5(){
    prompt.innerHTML = "Liftoff ...";
    container.innerHTML = `<p class="display">Altitude: ${altitude} | Velocity: ${velocity}</p>`;
    launch();
}

//functiom to display a successful launch
function prompt6(){
    prompt.innerHTML = "Mission Success";
    container.innerHTML = `<p class="display">Thank you for your time and consideration!</p>`;
}

//function to control which prompt is showing
function next(){
    //prompt for Rocket selection
    if (count === 1){
        count++;
        prompt1();
    } 
    //prompt for launchpad selection
    else if (count === 2){
        count++;
        prompt2();
    } 
    //prompt for date selection
    else if (count === 3){
        count++;
        prompt3();
    } 
    //do countdown
    else if (count === 4){
        count++;
        prompt4();
    } 
    //do launch
    else if (count === 5){
        count++;
        prompt5();
    } 
    //success
    else if (count === 6){
        count++;
        prompt6();
    } 
}

//function to begin prompts
function start() {
    setTimeout(next, 1000);
}

start();