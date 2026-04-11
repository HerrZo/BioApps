const { performance } = require('perf_hooks');

const progress = {
    station1: false, station2: true, station3: false,
    station5: true, station6: false, station7: false,
};

function original() {
    return {
        completed: Object.values(progress).filter(Boolean).length,
        total: Object.keys(progress).length
    };
}

function optimized() {
    let completed = 0;
    let total = 0;
    for (const key in progress) {
        total++;
        if (progress[key]) completed++;
    }
    return { completed, total };
}

const N = 1000000;

let start = performance.now();
for (let i = 0; i < N; i++) {
    original();
}
let end = performance.now();
const origTime = end - start;
console.log("Original:", origTime.toFixed(2), "ms");

start = performance.now();
for (let i = 0; i < N; i++) {
    optimized();
}
end = performance.now();
const optTime = end - start;
console.log("Optimized:", optTime.toFixed(2), "ms");

console.log(`Improvement: ${((origTime - optTime) / origTime * 100).toFixed(2)}% faster`);
