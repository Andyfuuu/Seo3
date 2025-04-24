
const gameData = {
    "genshin": {
        name: "原神",
        currency: "原石",
        pullCost: 160,
        characterPity: 90,
        weaponPity: 80,
        softPity: 75,
        baseRate: 0.6,
        rateUp: 50,
        packages: [
            {value: "6480", crystals: 6480, bonus: 1600, price: 3290},
            {value: "3280", crystals: 3280, bonus: 600, price: 1690},
            {value: "1980", crystals: 1980, bonus: 260, price: 990},
            {value: "980", crystals: 980, bonus: 110, price: 490},
            {value: "300", crystals: 300, bonus: 30, price: 170},
            {value: "60", crystals: 60, bonus: 0, price: 33}
        ]
    },
    "honkai-star-rail": {
        name: "崩壞：星穹鐵道",
        currency: "古老夢華",
        pullCost: 160,
        characterPity: 90,
        weaponPity: 80,
        softPity: 75,
        baseRate: 0.6,
        rateUp: 50,
        packages: [
            {value: "6480", crystals: 6480, bonus: 0, price: 3290},
            {value: "3280", crystals: 3280, bonus: 0, price: 1690},
            {value: "1980", crystals: 1980, bonus: 0, price: 990},
            {value: "980", crystals: 980, bonus: 0, price: 490},
            {value: "300", crystals: 300, bonus: 0, price: 170},
            {value: "60", crystals: 60, bonus: 0, price: 33}
        ]
    }
    // ... 省略部分，後續補齊
};



// --- 重構模組：處理特殊獎勵方案邏輯 ---
function updateBonusInput() {
    const selected = document.querySelector('input[name="special-bonus"]:checked').value;
    const bonusGroup = document.getElementById('custom-bonus-group');
    if (selected === 'custom') {
        bonusGroup.style.display = 'block';
    } else {
        bonusGroup.style.display = 'none';
    }
    updatePackageBonuses();
}

function updatePackageBonuses() {
    const selected = document.querySelector('input[name="special-bonus"]:checked').value;
    const customBonus = parseInt(document.getElementById('custom-bonus')?.value || 0);
    const game = document.getElementById('game').value;
    const gameInfo = gameData[game];

    gameInfo.packages.forEach(pkg => {
        if (selected === 'first') {
            pkg.bonus = pkg.bonus * 2;
        } else if (selected === 'custom') {
            pkg.bonus = customBonus;
        } else {
            pkg.bonus = getOriginalBonus(game, pkg.value);
        }
    });
}

function getOriginalBonus(game, value) {
    const originalData = {
        "genshin": {
            "6480": 1600, "3280": 600, "1980": 260, "980": 110, "300": 30, "60": 0
        },
        "blue-archive": {
            "6480": 1600, "3280": 600, "1980": 260, "980": 110, "300": 30, "60": 0
        },
        "fgo": {
            "167": 50, "86": 25, "55": 15, "41": 8, "12": 2, "1": 0
        }
    };
    return originalData[game]?.[value] || 0;
}

function calculateOfficialCost(currencyCost, packages) {
    let totalCost = 0;
    let remainingCurrency = currencyCost;

    const sortedPackages = [...packages].sort((a, b) => {
        const aTotal = a.crystals + a.bonus;
        const bTotal = b.crystals + b.bonus;
        return (bTotal / b.price) - (aTotal / a.price);
    });

    for (const pkg of sortedPackages) {
        const totalCrystals = pkg.crystals + pkg.bonus;
        while (remainingCurrency >= totalCrystals) {
            totalCost += pkg.price;
            remainingCurrency -= totalCrystals;
        }
    }

    if (remainingCurrency > 0) {
        const smallest = sortedPackages[sortedPackages.length - 1];
        totalCost += smallest.price;
    }

    return totalCost;
}

document.addEventListener('DOMContentLoaded', function () {
    updateBonusInput();
});
document.getElementById('special-bonus').addEventListener('change', updateBonusInput);
