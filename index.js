function loadBookedDays(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const bookedDays = JSON.parse(xhr.responseText);
                callback(bookedDays);
            } else {
                console.error('Ошибка при получении данных из файла');
                callback([]);
            }
        }
    };
    xhr.open('GET', 'booked_days.json', true);
    xhr.send();
}

//добавление стилей к забронированным дням
function applyBookedDaysStyles(bookedDays) {
    dayElements.forEach(dayElement => {
        const dayNumber = parseInt(dayElement.textContent);
        if (bookedDays.includes(dayNumber)) {
            dayElement.classList.add('reserved');
            dayElement.setAttribute('title', "Забронирован")
        }
    });
}


const backgroundColor = 'rgb(108, 172, 7)';
const dayElements = document.querySelectorAll('td:not(.other-month)');
const bookButton = document.querySelector('button');

function handleDayClick(event) {
    const dayElement = event.currentTarget;
    if (!dayElement.classList.contains('reserved')) {
        if (dayElement.style.backgroundColor === backgroundColor) {
            dayElement.style.backgroundColor = '';
            dayElement.style.color = '';
            dayElement.setAttribute('title', "Свободен");
        } else {
            dayElement.style.backgroundColor = backgroundColor;
            dayElement.style.color = 'white';
            dayElement.setAttribute('title', "Выбран");
        }

        const anyActive = Array.from(dayElements).some(element => element.style.backgroundColor === backgroundColor);
        bookButton.style.display = anyActive ? 'block' : 'none';
    }
}

loadBookedDays(function (bookedDays) {
    applyBookedDaysStyles(bookedDays);
});

dayElements.forEach(dayElement => {
    dayElement.addEventListener('click', handleDayClick);
});

const freeDays = document.querySelectorAll('td:not(.reserved)');
freeDays.forEach(day => {
    day.setAttribute('title', 'Свободен');
});


function sendReservationRequest(selectedDays) {
    const successfullyBooked = document.querySelector('.booking-container p');
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                successfullyBooked.style.display = 'block'
                bookButton.style.display = 'none'
                setTimeout(function () {
                    location.reload();
                }, 3000);

            }
        }
    };

    xhr.open('POST', 'app.php');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({selectedDays}));
}


bookButton.addEventListener('click', function () {
    const selectedDays = Array.from(dayElements)
        .filter(dayElement => dayElement.style.backgroundColor === backgroundColor)
        .map(dayElement => parseInt(dayElement.textContent));
    sendReservationRequest(selectedDays);
});


