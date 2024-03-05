const circleWrapper = document.getElementById('circleWrapper');
const noteAnalysisNamesWrapper = document.getElementById('noteAnalysisNamesWrapper');
let counterSum = 0;

quireArray.forEach(note => counterSum += note.counter);

let analysingNoteArray = [];
let counterPrevNumbers = 0; // To sum the current val + all the previous ones >> 0 20%, 20 50% ,,, for the conic sake
let newCounterItem;

quireArray.forEach(note => {   // [10, 20, 50, 50]
    if(note.counter != 0){
        let thisNoteColor = document.getElementById(note.noteId + 'Note').color;
        let counter = Number(note.counter);
        let finalVal = counter / counterSum * 100;  // 10 / 130 * 100
        counterPrevNumbers += finalVal;
        newCounterItem = `${thisNoteColor} 0 ${counterPrevNumbers}%`; // ex. #a00 0 50%
        analysingNoteArray.push(newCounterItem);
        noteAnalysisNamesWrapper.innerHTML += `<p style='background:${thisNoteColor}'>${note.title} ${counter}</p>`;
    }
});

circleWrapper.style.background = `conic-gradient(${analysingNoteArray})`;