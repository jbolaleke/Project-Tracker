
document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('projectName').value;
    const status = document.getElementById('status').value;
    const cost = parseFloat(document.getElementById('cost').value);
    const margin = parseFloat(document.getElementById('margin').value);
    const distributor = document.getElementById('distributor').value;
    const contractor = document.getElementById('contractor').value;
    const date = new Date(document.getElementById('date').value);
    const notes = document.getElementById('notes').value;

    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    const container = document.getElementById('projectsContainer');
    let monthSection = document.getElementById(monthKey);

    if (!monthSection) {
        monthSection = document.createElement('div');
        monthSection.id = monthKey;
        monthSection.innerHTML = `<h2>${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}</h2>
            <table><thead><tr>
            <th>Project Name</th><th>Status</th><th>Cost</th><th>Margin</th>
            <th>Distributor</th><th>Contractor</th><th>Notes</th></tr></thead><tbody></tbody></table>
            <div class="summary"></div>`;
        container.appendChild(monthSection);
    }

    const row = document.createElement('tr');
    row.className = status.replace(/ /g, '\\ ');
    const cells = [name, status, cost.toLocaleString(), margin.toLocaleString(), distributor, contractor, notes];
    cells.forEach((text, i) => {
        const cell = document.createElement('td');
        cell.textContent = text;
        cell.classList.add('editable');
        cell.addEventListener('click', () => {
            const newText = prompt('Edit value:', cell.textContent);
            if (newText !== null) {
                cell.textContent = newText;
                updateSummary(monthSection);
            }
        });
        row.appendChild(cell);
    });

    monthSection.querySelector('tbody').appendChild(row);
    updateSummary(monthSection);
    document.getElementById('projectForm').reset();
});

function updateSummary(section) {
    const rows = section.querySelectorAll('tbody tr');
    let total = 0, won = 0, lostDollars = 0, wonMargin = 0;
    rows.forEach(row => {
        const status = row.children[1].textContent;
        const cost = parseFloat(row.children[2].textContent.replace(/,/g, '')) || 0;
        const margin = parseFloat(row.children[3].textContent.replace(/,/g, '')) || 0;
        if (status !== 'TBD') total++;
        if (status === 'Won') {
            won++;
            wonMargin += margin;
        }
        if (status === 'Lost' || status === 'Should Have Won') {
            lostDollars += cost;
        }
    });
    const winPercent = total ? ((won / total) * 100).toFixed(2) : '0.00';
    section.querySelector('.summary').innerHTML = `
        Total Projects: ${total}<br>
        Won: ${won}<br>
        Win %: ${winPercent}%<br>
        Dollars Lost: \$${lostDollars.toLocaleString()}<br>
        Margin from Won Projects: \$${wonMargin.toLocaleString()}
    `;
}
