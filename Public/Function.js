document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;

    try{

        const response = await fetch('https://jrfblogin-a8dhhtczbwabe8at.australiaeast-01.azurewebsites.net/login', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username:username
            })
        });
        const data = await response.json();

        if (response.ok && data.success){
            sessionStorage.setItem('authToken', data.token);
            console.log(data.token)
            console.log('Authentication successful:', data);
            sessionStorage.setItem('username', username);
            window.location.href = "Selection.html";
        }else{
            console.error('Authentication failed: ', data.statusText);
            alert("Invalid username, usernames must be between 3 and 20 characters and only contain a full stop no special characters. Please try again");
        }
    } catch(error) {
        console.error('Error:', error);
        alert('An error has occured, please try again');
    }
});

document.querySelectorAll('.activity button').forEach(button =>{
    button.addEventListener('click', function(event){
        const value = event.target.getAttribute('data-value');
        console.log(value)
        sessionStorage.setItem('activitySelection', value);
        if (value == 'Operational'){
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
