const elForm = document.querySelector('#ordenar');
const elOrder = document.querySelector('#orderBy');

elForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: sortTable,
        args: ['asc', elOrder.value]
    })
})

function sortTable(dir, n) {

    const elTables = document.getElementsByTagName("table");

    
    try {
        const elTableCaption = elTables.item(0).innerText
        if(elTableCaption != 'Lista de Frequências Homologadas'){
            alert('Esse script deve ser acionado na página de listagem de bolsistas de IC com Frequências Homologadas');
            return;
        }
    } catch (error) {
        alert('Esse script deve ser acionado na página de listagem de bolsistas de IC com Frequências Homologadas');
        return;
    }


    const elTable = elTables.item(1)

    var rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    switching = true;
    while (switching) {
        switching = false;
        rows = elTable.rows;

        for (i = 2; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            var texto = rows.item(i).getElementsByTagName("TD")[0].innerText
            x = rows.item(i).getElementsByTagName("td")[n];
            y = rows.item(i + 1).getElementsByTagName("td")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows.item(i).parentNode.insertBefore(rows.item(i + 1), rows.item(i));
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
