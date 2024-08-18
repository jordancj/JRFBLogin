document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;

    try{

        const response = await fetch('https://jrfblogin-a8dhhtczbwabe8at.australiaeast-01.azurewebsites.net', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:username
            })
        });
        if (response.ok){
            const result = await response.json();
            console.log('Authentication successful:', result);
            sessionStorage.setItem('username', username);
            window.location.href = "Selection.html";
        }else{
            console.error('Authentication failed: ', response.statusText);
            alert("Invalid username, usernames must be between 3 and 20 characters and only contain a full stop no special characters. Please try again");
        }
    } catch(error) {
        console.error('Error:', error);
        alert('An error has occured, please try again');
    }
});

document.querySelectorAll('.activity').forEach(button =>{
    button.addEventListener('click', function(event){
        const value = event.target.getAttribute('data-value');
        sessionStorage.setItem('activitySelection', value);
        if (value == 'operational'){
            window.location.href = "Operational.html"
        }
        else if(value == 'Non-Operational'){
            window.location.href = "NonOperational.html"

        }
    })
})

function operationalPage(){
    window.location.href = "Operational.html";

}
function nonOperationalPage(){
    window.location.href = "NonOperational.html";

}

function homePage(){
    window.location.href = "index.html"

}

function goBack(){
    window.history.back();

}
