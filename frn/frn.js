function round(num, decimal) {
    decimal = (!decimal ? 1 : decimal);
    return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

function sqroot(X) {
    return Math.sqrt(X);
}

function outdatedResults() {
    resultsDiv.classList.add('outdated');
}

function calcFrn() {
    const frequency = parseFloat(document.getElementById('frequency').value);
    const distance = parseFloat(document.getElementById('distance').value) * 1000;
    const frn_100_elem = document.getElementById('frn_100');
    const frn_80_elem = document.getElementById('frn_80');
    const frn_60_elem = document.getElementById('frn_60');
    const frn_result = document.getElementById('frn_result');
    const resultsDiv = document.getElementById('resultsDiv');


    const frnzone100 = 17.3 * sqroot(distance / (frequency * 4));
    const frnzone80 = 0.8 * frnzone100;
    const frnzone60 = 0.6 * frnzone100;

    frn_100_elem.innerHTML = round(frnzone100) + ' m';
    frn_80_elem.innerHTML = round(frnzone80) + ' m';
    frn_60_elem.innerHTML = round(frnzone60) + ' m';

    frn_result.classList.remove('hidden');
    resultsDiv.classList.remove('outdated');

}
