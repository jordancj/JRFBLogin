const loginForm = document.getElementById('login');
function sanitizeInput(input) {
    const regex = /^[a-zA-z.]+$/;
    let sanitizedInput = '';

    for (let i = 0; i < input.length; i++) {
        if (regex.test(input[i])) {
            sanitizedInput += input[i];
        }
    }
    return sanitizedInput;
}

if (loginForm) {
    document.getElementById('username').addEventListener('input', function () {
        const sanitizedValue = sanitizeInput(this.value);
        this.value = sanitizedValue;
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;

        try {
            const response = await fetch('https://jrfblogin-a8dhhtczbwabe8at.australiaeast-01.azurewebsites.net/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username: username })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sessionStorage.setItem('authToken', data.token);
                sessionStorage.setItem('username', username);
                window.location.href = "Selection.html";
            } else {
                alert("Invalid username, usernames must be between 3 and 20 characters and only contain a full stop. Please try again.");
            }
        } catch (error) {
            alert('An error has occurred, please try again');
        }
    });
}

document.querySelectorAll('.activity button').forEach(button => {
    button.addEventListener('click', function (event) {
        const value = event.target.getAttribute('data-value');
        sessionStorage.setItem('activitySelection', value);
        if (value === 'Operational') {
            window.location.href = "Operational.html";
        } else if (value === 'Non-Operational') {
            window.location.href = "NonOperational.html";
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.selectable-button');
    const submitButton = document.getElementById('Submit');
    let selectedValue = '';

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedValue = '';
                sessionStorage.removeItem('activity');
            } else {
                buttons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedValue = this.getAttribute('data-value');
                sessionStorage.setItem('activity', selectedValue);
            }
        });
    });

    if (submitButton) {
        submitButton.addEventListener('click', async function () {
            const activity = sessionStorage.getItem('activity');
            if (!activity) {
                alert("Please select an option before submitting");
                return;
            }
            const backdate = document.getElementById('inputDate').value;
            let currentTimeStamp;
            if (backdate) {
                currentTimeStamp = new Date(backdate);
                currentTimeStamp.setHours(0, 0, 0, 0);
            } else {
                currentTimeStamp = new Date();
            }

            let username = sessionStorage.getItem('username');
            username = username.replace(/\./g, ' '); // Replace dots with spaces
            const activitySelection = sessionStorage.getItem('activitySelection');

            const data = {
                timestamp: currentTimeStamp,
                name: username,
                operational: activitySelection,
                activity: activity
            };

            try {
                const response = await fetch('https://jrfblogin-a8dhhtczbwabe8at.australiaeast-01.azurewebsites.net/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                    showPopup("Successful!", "success")
                } else {
                    alert('Failed to submit data, please try again.');
                    window.location.href = 'index.html';
                }
            } catch (error) {
                alert('Error submitting data, please try again.');
                console.error(error.message)
            }
        });
    }
});

function showPopup(message, type){
    const popup = documernt.getElementById("popup");

    popup.textContent = message;
    popup.className = `popup ${type}`
    popup.style.display = block;

    setTimeout(() => {
        popup.style.display = none;
    },  4000);

}

function goBack() {
    window.history.back();
}
