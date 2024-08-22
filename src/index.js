const loginForm = document.getElementById('login')
function sanitizeInput(input){
    const regex = /^[a-zA-z.]+$/;
    let sanitizedInput = '';

    for (let i = 0; i <input.length; i++) {
        if (regex.test(input[i])) {
            sanitizedInput += input[i];
        }
    }
    return sanitizedInput
}
if(loginForm){
    document.getElementById('username').addEventListener('input', function(){
        const sanitizedValue = sanitizeInput(this.value);
        this.value = sanitizedValue;
    });
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;

        try{
            //post to API
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username:username
                })
            });
            //wait for response from API
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
}
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

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.selectable-button');
    const submitButton = document.getElementById('Submit');
    let selectedValue = '';

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedValue = this.getAttribute('data-value');
            sessionStorage.setItem('activity', selectedValue); // Store the selected value in sessionStorage
        });
    });

    if (submitButton) {
        submitButton.addEventListener('click', async function() {
            const activity = sessionStorage.getItem('activity');  // Retrieve the selected activity
            if (!activity) {
                alert("Please select an option before submitting");
                return;
            }

            const currentTimeStamp = new Date().toLocaleString();
            let username = sessionStorage.getItem('username');
            username = username.replace(/\./g, ' ');  // Replace dots with spaces
            const activitySelection = sessionStorage.getItem('activitySelection'); 

            const data = {
                timestamp: currentTimeStamp,
                name: username,
                operational: activitySelection,
                activity: activity
            };

            try {
                const response = await fetch('http://localhost:3000/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    console.log('Data submitted successfully');
                    console.log(data);
                    sessionStorage.clear();
                    window.location.href = 'index.html'; 
                } else {
                    console.error('Failed to submit data');
                }
            } catch (error) {
                console.error('Error submitting data', error);
            }
        });
    }
});
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