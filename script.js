const noteList = document.getElementById('noteList');
const noteTitle = document.getElementById('noteTitle');
const textDocument = document.getElementById('textDocument');
const createNoteBtn = document.getElementById('createNoteBtn');
const colorList = ['#ff35b2', '#007fd4', '#ee3333', '#7141c5', '#ff6122df', '#50a095', '#996148', '#058c00', '#b57700'];
const notes = document.getElementsByClassName('note');
const nav = document.querySelector('nav');
const navBtns = nav.getElementsByTagName('p');
let currentNavBtn = 'home';
let noteObject = {
    id: '',
    title: '',
    content: '',
    images: [],
    tags: [],
    createdDate: '',
}

//Nav buttons

nav.addEventListener('click', evt => {
    if(evt.target.tagName == 'P'){
        for(let i = 0; i < navBtns.length; i++)
        navBtns[i].classList.remove('activeNavButton');
        evt.target.classList.add('activeNavButton');
        currentNavBtn = evt.target.title;
    }
});


// Create notes
createNoteBtn.onclick = function() {
    if(createNoteBtn.textContent == 'Create Note')
    createNote();
    else{
        document.getElementById(currentNote).noteTitle = noteTitle.value;
        document.getElementById(currentNote).noteContent = textDocument.innerHTML;
        document.getElementById(currentNote).querySelector('.noteTitle').textContent = noteTitle.value;
        document.getElementById(currentNote).querySelector('.noteContent').innerHTML = textDocument.innerHTML;
        updateModeF('', '', 'Create Note');
        textDocument.classList.remove('updateMode');
    }
}

const createNote = () => {
    let id = Date.now() + Math.ceil(Math.random()*999);
    const note1 = document.createElement('div');
    note1.className = 'note';
    note1.id = id + 'Note';
    note1.isFavorite = false;
    note1.style.left = '-550px';
        const noteLeftPart = document.createElement('div');
        noteLeftPart.className = 'noteLeftPart';
            const deleteNote = document.createElement('div');
            deleteNote.className = 'deleteNote';
            deleteNote.id = id;
                const trash = document.createElement('i');
                trash.className = 'far fa-trash-alt';
            deleteNote.appendChild(trash);
            const div = document.createElement('div');
                const h1 = document.createElement('h1');
                h1.textContent = 30;
                const p = document.createElement('p');
                p.textContent = 'days old';
            div.appendChild(h1);
            div.appendChild(p);
        noteLeftPart.appendChild(deleteNote);
        noteLeftPart.appendChild(div);
        const ttlCntntWrapper = document.createElement('div');
        ttlCntntWrapper.className = 'ttlCntntWrapper';
            const title = document.createElement('h3');
            title.className = 'noteTitle';
            noteTitle.value ? title.textContent = noteTitle.value : title.textContent = 'Note Title'
            const content = document.createElement('p');
            content.className = 'noteContent';
            textDocument.innerHTML ? content.innerHTML = textDocument.innerHTML : content.innerHTML = 'Note Content, consectetur Lorem ipsum dolor adipisicing elit.'
        ttlCntntWrapper.appendChild(title);
        ttlCntntWrapper.appendChild(content);
        const starWrapper = document.createElement('div');
        starWrapper.className = 'starWrapper';
        starWrapper.id = id + 'Star';
            const star = document.createElement('i');
            star.className = 'fas fa-star';
        starWrapper.appendChild(star);
    note1.noteTitle = title.textContent;
    note1.noteContent = content.innerHTML;
    note1.appendChild(noteLeftPart);
    note1.appendChild(ttlCntntWrapper);
    note1.appendChild(starWrapper);
    noteList.appendChild(note1);
    noteList.scrollTop = noteList.scrollHeight;
    setTimeout(() => {
        document.getElementById(id + 'Note').style.left = 0;
    });
    setTimeout(() => {
        document.getElementById(id + 'Note').style.left = '-70px';
    }, 250);
    setNoteColors();
}
createNote();


// Delete notes

document.addEventListener('click', evt => {
    if(evt.target.className == 'deleteNote'){
        document.getElementById(evt.target.id).remove(); //Important, To avoid freezing note while cursor is over the delete button
        document.getElementById(evt.target.id + 'Note').classList.add('noteRemoved');
        setTimeout(() => {
            document.getElementById(evt.target.id + 'Note').remove();
            setTimeout(() => {
                setNoteColors();
            }, 300);
        }, 590);
    }
});


// Note border colors acording to their order

function setNoteColors() {
    let counter = 0;
    for (let i = 0; i < noteList.childElementCount; i++){
        noteList.children[i].style.borderTop = 'solid 15px ' + colorList[counter];
        noteList.children[i].querySelector('h1').style.color = colorList[counter];
        noteList.children[i].querySelector('h3').style.color = colorList[counter];
        noteList.children[i].querySelector('i').style.color = colorList[counter];
        counter ++;
        if (counter >= colorList.length) counter = 0;
    }
}


// Star button clicked. Note favorite toggle

document.addEventListener('click', evt => {
    if(evt.target.className == 'starWrapper'){
        let note = evt.target.id.slice(0, evt.target.id.length - 4) + 'Note';
        let noteId = document.getElementById(note);
        if(noteId.isFavorite != true){
            document.getElementById(evt.target.id).querySelector('i').classList.add('favorited');
        } else {
            document.getElementById(evt.target.id).querySelector('i').classList.remove('favorited');
        }
        noteId.isFavorite = !noteId.isFavorite;
        if(currentNavBtn == 'favorite'){
            showFavoriteNotes();
            evt.target.style.marginLeft = '5px'; //Important, To avoid freezing note while cursor is over the star button
            setTimeout(() => {
                evt.target.style.marginLeft = 'unset';
            });
        }
    }
});


// Plipping through the sections

let currentSection;

function showSection (id) {
    if(currentSection){
        document.getElementById(currentSection).style.display = 'none';
        document.getElementById(currentSection).className = '';
    }
    document.getElementById(id).style.display = 'block';
    setTimeout(() => {
        document.getElementById(id).className = 'showenSection';
        currentSection = id;
    });
}
showSection('home');


// Move magnifier

let moveMagnPermit = false;
let initX = 0;
let initY = 0;
let magnifierParent;
const magnifier = document.getElementById('magnifier');
const searchTitle = document.getElementById('searchTitle');

document.addEventListener('mousedown', evt => {
    if(evt.target.id == 'magnifier'){
        moveMagnPermit = true;
        magnifierParent = magnifier.parentNode;
        initX = magnifierParent.offsetLeft - evt.clientX + magnifier.offsetLeft + magnifier.offsetWidth/2;
        initY = magnifierParent.offsetTop - evt.clientY + magnifier.offsetTop + magnifier.offsetHeight/2;
        magnifier.style.transition = 'unset';
    }
});

document.addEventListener('mousemove', evt => {
    if(moveMagnPermit == true){
        magnifier.style.left = evt.clientX - magnifierParent.offsetLeft - magnifier.offsetWidth/2 + initX + 'px';
        magnifier.style.top = evt.clientY - magnifierParent.offsetTop - magnifier.offsetHeight/2 + initY + 'px';
    }
});

document.addEventListener('mouseup', evt => {
    if(moveMagnPermit == true){
        moveMagnPermit = false;
        magnifier.style.left = '250px';
        magnifier.style.top = '10px';
        magnifier.style.transition = '0.3s';
    }
});


// Home section

const addImageWrapper = document.getElementById('addImageWrapper');
const addTagWrapper = document.getElementById('addTagWrapper');
const addTagText = document.getElementById('addTagText');
const insertedTagWrapper = document.getElementById('insertedTagWrapper');


document.onmousedown = evt => {
    if(evt.target.id == 'addImagesBtn' || evt.target.parentNode.id == 'addImageWrapper'
    || evt.target.parentNode.id == 'noteImagesWrapper')
    addImageWrapper.style.display = 'flex';
    else addImageWrapper.style.display = 'none';

    if(evt.target.id == 'addTagsBtn' || evt.target.parentNode.id == 'addTagWrapperSmall' ||
    evt.target.id == 'insertedTagWrapper' || evt.target.parentNode.id == 'insertedTagWrapper'){
        addTagWrapper.style.display = 'flex';
        addTagText.focus();
    }
    else addTagWrapper.style.display = 'none';

    if(evt.target.id == 'addTagBtn')
    addTagF(addTagText.value);
}

// Add tags

let noteTagList = [];

const addTagF = (tag) => {
    if(tag != '' && insertedTagWrapper.childElementCount < 5){
        insertedTagWrapper.style.display = 'flex';
        noteTagList.push(tag);
        const tagP = document.createElement('button');
        tagP.innerHTML = tag + '<i class="fas fa-backspace"></i>';
        tagP.onclick = () => {
            tagP.classList.add('newRemovedag');
            setTimeout(() => {
                tagP.remove();
                if(insertedTagWrapper.childElementCount == 0)
                insertedTagWrapper.style.display = 'none';
            }, 200);
            noteTagList = noteTagList.filter(tag => tag != tagP.innerHTML.split('<')[0]);
        }
        tagP.classList.add('newAddedTag');
        setTimeout(() => {
            tagP.classList.remove('newAddedTag');
        });
        insertedTagWrapper.appendChild(tagP);
        addTagText.value = '';
        addTagText.focus();
    }
}

addTagText.addEventListener('keypress', e => {
    if(e.key == 'Enter'){
        addTagF(addTagText.value);
    }
});

// Add image

const imageFile = document.getElementById('imageFile');
const addImageBtn = document.getElementById('addImageBtn');
const addImageLinkText = document.getElementById('addImageLinkText');
const noteImagesWrapper = document.getElementById('noteImagesWrapper');
const fileTypes = 'JPEG, JPG, jpeg, jpg, BMP, bmp, PNG, png';
let browsedImageList = [];

addImageBtn.onclick = () => {
    if(addImageBtn.innerHTML != 'Add'){
        imageFile.value=''; 
        imageFile.click(); // Browse image locally
    } else {
        addImageF(addImageLinkText.value); // Add image link
    }
}

// Add image locally
imageFile.onchange = (evt) => {
    let file = evt.target.files[0];
    if(fileTypes.includes(file.type.split('/')[1])){
        let url = URL.createObjectURL(file);
        addImageF(url);
    } else {
        alert('File type is not an image');
    }
}

addImageLinkText.oninput = () => {
    if(addImageLinkText.value == ''){
        addImageBtn.innerHTML = `Browse <i class="fas fa-folder-open"></i>`;
    } else {
        addImageBtn.innerHTML = `Add`;
    }
}

const addImageF = (img) => {
    browsedImageList.push(img);
    noteImagesWrapper.style.display = 'flex';
    const wrapper = document.createElement('div');
    wrapper.onclick = () => {
        wrapper.classList.add('newRemovedImage');
        setTimeout(() => {
            wrapper.remove();
            if(noteImagesWrapper.childElementCount == 0)
            noteImagesWrapper.style.display = 'none';
            browsedImageList = browsedImageList.filter(image => image != img);
        }, 200);
    };
    wrapper.classList.add('newAddedImage');
    setTimeout(() => {
        wrapper.classList.remove('newAddedImage');
    });
    const image = document.createElement('img');
    image.src = img;
    image.alt = 'Image';
    const del = document.createElement('h1');
    del.textContent = 'X';
    wrapper.appendChild(image);
    wrapper.appendChild(del);
    noteImagesWrapper.appendChild(wrapper);
}


// Search section

const searchText = document.getElementById('searchText');

searchText.addEventListener('input', () => {
    let inputText = searchText.value.toLowerCase();
    for(let i = 0; i < notes.length; i++){
        let title = notes[i].noteTitle.toLowerCase();
        let content = notes[i].noteContent.toLowerCase();
        if(title.includes(inputText) || content.includes(inputText))
            notes[i].style.display = 'flex';
        else
            notes[i].style.display = 'none';
    }
});


// Favorite section

nav.addEventListener('click', evt => {
    if(evt.target.tagName == 'P'){
        if(evt.target.id == 'favoriteNav'){
            for(let i = 0; i < notes.length; i++)
            notes[i].style.display = 'flex';
            showFavoriteNotes();
        }
        else
        showAllNotes();
    }
});

function showFavoriteNotes() {
    for(let i = 0; i < notes.length; i++)
    if(notes[i].isFavorite == false){
        notes[i].classList.add('noteRemoved');
        setTimeout(() => {
            notes[i].style.display = 'none';
        }, 590);
    }
}

function showAllNotes() {
    for(let i = 0; i < notes.length; i++){
        notes[i].style.display = 'flex';
        setTimeout(() => {
            notes[i].classList.remove('noteRemoved');
        }, 500);
    }
}

// Displaying notes
const contentDemo = document.getElementById('contentDemo');
const noteTitleDemo = document.getElementById('noteTitleDemo');
let currentNote;

noteList.addEventListener('click', evt => {
    if(evt.target.className == 'note' && currentNavBtn == 'favorite'){
        noteTitleDemo.value = evt.target.noteTitle;
        contentDemo.innerHTML = evt.target.noteContent;
    }
    else if(evt.target.className == 'note' && currentNavBtn == 'home'){
        textDocument.classList.add('updateMode');
        updateModeF(evt.target.noteTitle, evt.target.noteContent, 'Save Changes');
        currentNote = evt.target.id;
    } else {
        textDocument.classList.remove('updateMode');
        updateModeF('', '', 'Create Note');
    }
});

function updateModeF(title, content, btnText){
    noteTitle.value = title;
    textDocument.innerHTML = content;
    createNoteBtn.textContent = btnText;
}