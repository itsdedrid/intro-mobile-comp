function formatMonth(month) {
    switch (month) {
        case "Jan":
            return 'มกราคม'
        case "Feb":
            return 'กุมภาพันธ์'
        case "Mar":
            return 'มีนาคม'
        case "Apr":
            return 'เมษายน'
        case "May":
            return 'พฤษภาคม'
        case "Jun":
            return 'มิถุนายน'
        case "Jul":
            return 'กรกฎาคม'
        case "Aug":
            return 'สิงหาคม'
        case "Sep":
            return 'กันยายน'
        case "Oct":
            return 'ตุลาคม'
        case "Nov":
            return 'พฤศจิกายน'
        case "Dec":
            return 'ธันวาคม'
        default:
            return 'Error'
    }
}

async function getDate() {
    let date = await fetch('https://learningportal.ocsc.go.th/learningspaceapi/localdatetime')
    .then((response) => {
        let res = response.json().then((data) => {
            console.log('fetchDate: ', data.datetime)
            return data.datetime
        })

        return res
    })
    .catch((error) => {
        console.log('ERROR: ', 'ระบบเครือข่ายล้มเหลว')
        return 'Error: ระบบเครือข่ายล้มเหลว'
    })
    .finally(() => {
        console.log('End of fetch')
    })
    let dateObject = new Date(date)

    let formatDate = dateObject.toDateString().split(' ').slice(1)
    let month = formatMonth(formatDate[0])
    let day = formatDate[1]
    let year = formatDate[2]

    let formatTime = dateObject.toTimeString().split(' ')[0]
    console.log('formatDate: ', formatDate)
    document.getElementById('demo').innerHTML = 'วันที่ ' + day + ' ' + month + ' ' + year + ' เวลา ' + formatTime + ' น.'
}

function fetchDate() {
    setInterval(getDate, 1000)
}

function changeColor() {
    let element = document.body
    element.classList.toggle('dark-mode')
}

let textBoxCount = 1; // เริ่มต้นที่ช่องรายได้ 1 ช่อง

function addTextBox() {
    if (textBoxCount < 3) {
        textBoxCount++;
        let newInput = document.createElement('input');
        newInput.type = 'number';
        newInput.id = 'income' + textBoxCount;
        newInput.className = 'income-input';
        newInput.placeholder = 'รายได้ที่ ' + textBoxCount;
        newInput.oninput = calculateTotalIncome;
        document.getElementById('incomeDiv').appendChild(newInput);
    }
}

function removeTextBox() {
    if (textBoxCount > 1) {
        let inputToRemove = document.getElementById('income' + textBoxCount);
        inputToRemove.remove();
        textBoxCount--;
        calculateTotalIncome();
    }
}

function calculateTotalIncome() {
    let total = 0;
    document.querySelectorAll('.income-input').forEach(input => {
        // if input.value is negative, set it to 0
        if (parseInt(input.value) < 0) {
            input.value = 0;
        }
        total += input.value ? parseInt(input.value) : 0;
    });
    document.getElementById('totalIncome').value = total;
    calculateTax(total);
}

function calculateTax(income) {
    let tax = 0, taxRate = 0;
    
    if (income <= 150000) {
        tax = 0;
        taxRate = 0;
    } else if (income <= 300000) {
        tax = (income - 150000) * 0.05;
        taxRate = 5;
    } else if (income <= 500000) {
        tax = 7500 + (income - 300000) * 0.1;
        taxRate = 10;
    } else if (income <= 750000) {
        tax = 27500 + (income - 500000) * 0.15;
        taxRate = 15;
    } else if (income <= 1000000) {
        tax = 65000 + (income - 750000) * 0.2;
        taxRate = 20;
    } else if (income <= 2000000) {
        tax = 115000 + (income - 1000000) * 0.25;
        taxRate = 25;
    } else if (income <= 5000000) {
        tax = 365000 + (income - 2000000) * 0.3;
        taxRate = 30;
    } else {
        tax = 1265000 + (income - 5000000) * 0.35;
        taxRate = 35;
    }

    document.getElementById('totalTax').value = taxRate;
    document.getElementById('totalTaxAmount').value = tax;
}