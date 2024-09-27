const apiURL = process.env.API_URL;
console.log(process.env)
async function fetchNames(query) {
    try {
        const response = await fetch(`${apiURL}/api/names`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        const names = await response.json();
        return names; // Return the names fetched from the API
        console.log(names)
    } catch (error) {
        console.error('Error fetching names:', error);
        return []; // Return an empty array if there's an error
    }
}

const input = document.getElementById('username');
const nameList = document.getElementById('name-list');

function filterNames(names, query) {
    if (!Array.isArray(names)) {
        console.error('Expected names to be an array, but got:', names);
        return [];
    }

    // Map to extract `username` and then filter
    const mappedNames = names.map(obj => obj.username);

    return mappedNames.filter(name => {
        if (typeof name !== 'string') {
            console.error('Expected each name to be a string, but got:', name);
            return false;
        }
        return name.toLowerCase().includes(query.toLowerCase());
    });
}

function showSuggestions(filteredNames) {
    nameList.innerHTML = ''; // Clear the previous suggestions
    if (filteredNames.length > 0) {
        nameList.style.display = 'block'; // Show the dropdown
        filteredNames.forEach(name => {
            const div = document.createElement('div');
            div.textContent = name;
            div.addEventListener('click', () => {
                input.value = name; // Set the input value to the clicked name
                nameList.style.display = 'none'; // Hide the dropdown
            });
            nameList.appendChild(div);
        });
    } else {
        nameList.style.display = 'none'; // Hide the dropdown if no matches found
    }
}

// Event listener for input field
input.addEventListener('input', async () => {
    const query = input.value;
    if (query.length > 0) {
        const names = await fetchNames(query); // Fetch names from the server
        const filteredNames = filterNames(names, query); // Filter names based on the input
        showSuggestions(filteredNames);
    } else {
        nameList.style.display = 'none'; // Hide the dropdown if input is empty
    }
});

// Hide the dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!input.contains(event.target) && !nameList.contains(event.target)) {
        nameList.style.display = 'none';
    }
});