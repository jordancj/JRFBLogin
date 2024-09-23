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

            const currentTimeStamp = Date.now();  // Get Unix timestamp in milliseconds
            let username = sessionStorage.getItem('username');
            username = username.replace(/\./g, ' ');  // Replace dots with spaces
            const activitySelection = sessionStorage.getItem('activitySelection'); 

            const data = {
                timestamp: currentTimeStamp,  // Unix timestamp
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

function goBack() {
    window.history.back();
}
