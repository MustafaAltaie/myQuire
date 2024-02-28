const noteList = document.getElementById('noteList');
const noteTitle = document.getElementById('noteTitle');
const textDocument = document.getElementById('textDocument');
const createNoteBtn = document.getElementById('createNoteBtn');
const colorList = ['#ff35b2', '#007fd4', '#ee3333', '#7141c5', '#ff6122df', '#50a095', '#996148', '#058c00', '#b57700'];
const notes = document.getElementsByClassName('note');
const nav = document.querySelector('nav');
const navBtns = nav.getElementsByTagName('p');
const imageFile = document.getElementById('imageFile');
const addImageBtn = document.getElementById('addImageBtn');
const addImageLinkText = document.getElementById('addImageLinkText');
const noteImagesWrapper = document.getElementById('noteImagesWrapper');
const addImageWrapper = document.getElementById('addImageWrapper');
const addTagWrapper = document.getElementById('addTagWrapper');
const addTagText = document.getElementById('addTagText');
const insertedTagWrapper = document.getElementById('insertedTagWrapper');
const fileTypes = 'JPEG, JPG, jpeg, jpg, BMP, bmp, PNG, png';
let noteTagList = [];
let browsedImageList = [];
let currentNavBtn = 'home';
let quireArray = [];

let quireData = JSON.parse(localStorage.getItem('quire'));
if(quireData != null){
    quireArray = quireData;
    quireArray.forEach(note => createNote(note));
}
// localStorage.clear()
//Nav buttons

nav.addEventListener('click', evt => {
    if(evt.target.tagName == 'P'){
        for(let i = 0; i < navBtns.length; i++)
        navBtns[i].classList.remove('activeNavButton');
        evt.target.classList.add('activeNavButton');
        currentNavBtn = evt.target.title;
    }
});
console.log(quireArray);

// Create notes
createNoteBtn.onclick = function() {
    let thisTitle;
    let thisContent;
    noteTitle.value? thisTitle = noteTitle.value : thisTitle = 'Note Title';
    textDocument.innerHTML? thisContent = textDocument.innerHTML : thisContent = 'Note Content, consectetur Lorem ipsum dolor adipisicing elit.';
    if(createNoteBtn.textContent == 'Create Note'){
        let utc = new Date().toLocaleString();
        let noteObject = {
            noteId: Date.now(),
            title: thisTitle,
            content: thisContent,
            images: browsedImageList,
            tags: noteTagList,
            createdDate: utc,
            isFavorite: false
        }
        createNote(noteObject);
        quireArray.push(noteObject);
        localStorage.setItem('quire', JSON.stringify(quireArray));
        setTimeout(() => {
            resetImageAndTagWrappers();
            updateModeF('', '', 'Create Note');
        }, 100);
        noteList.scrollTop = noteList.scrollHeight;
    } else {
        quireArray.find(note => {
            if(note.noteId == document.getElementById(currentNote).idAddress){
                note.title = thisTitle;
                note.content = thisContent;
                note.images = browsedImageList;
                note.tags = noteTagList;
            }
            localStorage.setItem('quire', JSON.stringify(quireArray));
        });
        document.getElementById(currentNote).noteTitle = noteTitle.value;
        document.getElementById(currentNote).noteContent = textDocument.innerHTML;
        document.getElementById(currentNote).querySelector('.noteTitle').textContent = noteTitle.value;
        document.getElementById(currentNote).querySelector('.noteContent').innerHTML = textDocument.innerHTML;
        updateModeF('', '', 'Create Note');
        textDocument.classList.remove('updateMode');
    }
}

function createNote(obj) {
    const note1 = document.createElement('div');
    note1.className = 'note';
    note1.id = obj.noteId + 'Note';
    note1.isFavorite = false;
    note1.idAddress = obj.noteId;
    note1.noteTitle = obj.title;
    note1.noteContent = obj.content;
    note1.noteDate = obj.createdDate;
    note1.imageList = obj.images;
    note1.tagList = obj.tags;
    note1.style.left = '-550px';
    const noteLeftPart = document.createElement('div');
    noteLeftPart.className = 'noteLeftPart';
    const deleteNote = document.createElement('div');
    deleteNote.className = 'deleteNote';
    deleteNote.onclick = () => {
        quireArray = quireArray.filter(note => note.noteId != obj.noteId);
        localStorage.setItem('quire', JSON.stringify(quireArray));
        deleteNote.remove(); //Important, Remove the trash button to avoid freezing note while cursor is over the delete button
        note1.classList.add('noteRemoved');
        setTimeout(() => {
            note1.remove();
            setTimeout(() => {
                setNoteColors();
            }, 300);
        }, 590);
    }
    deleteNote.id = obj.noteId;
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
    obj.title ? title.textContent = obj.title : title.textContent = 'Note Title'
    const content = document.createElement('p');
    content.className = 'noteContent';
    obj.content ? content.innerHTML = obj.content : content.innerHTML = 'Note Content, consectetur Lorem ipsum dolor adipisicing elit.'
    ttlCntntWrapper.appendChild(title);
    ttlCntntWrapper.appendChild(content);
    const starWrapper = document.createElement('div');
    starWrapper.className = 'starWrapper';
    starWrapper.id = obj.noteId + 'Star';
    const star = document.createElement('i');
    star.className = 'fas fa-star';
    if(obj.isFavorite == true){
        star.classList.add('favorited');
        note1.isFavorite = true;
    }
    starWrapper.onclick = () => {
        if(note1.isFavorite != true)
        star.classList.add('favorited');
        else star.classList.remove('favorited');
        note1.isFavorite = !note1.isFavorite;
        if(currentNavBtn == 'favorite'){
            showFavoriteNotes();
            starWrapper.style.marginLeft = '5px'; //Important, To avoid freezing note while cursor is over the star button
            setTimeout(() => {
                starWrapper.style.marginLeft = 'unset';
            });
        }
    }
    starWrapper.appendChild(star);
    note1.appendChild(noteLeftPart);
    note1.appendChild(ttlCntntWrapper);
    note1.appendChild(starWrapper);
    noteList.appendChild(note1);
    setTimeout(() => {
        note1.style.left = 0;
    });
    setTimeout(() => {
        note1.style.left = '-70px';
    }, 250);
    setNoteColors();
}


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

    if(evt.target.id == 'addTagBtn'){
        addTagF(addTagText.value);
    }
}

// Add tags

function addTagF(tag) {
    if(tag != '' && insertedTagWrapper.childElementCount < 5){
        insertedTagWrapper.style.display = 'flex';
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
            document.getElementById(currentNote).tagList = noteTagList;
        }
        tagP.classList.add('newAddedTag');
        setTimeout(() => {
            tagP.classList.remove('newAddedTag');
        });
        let addPerm = true;
        noteTagList.forEach(tags => {
            if(tags == tag) addPerm = false;
        });
        if(addPerm == true){
            noteTagList.push(tag);
            insertedTagWrapper.appendChild(tagP);
            document.getElementById(currentNote).tagList = noteTagList;
        }
        addTagText.value = '';
        addTagText.focus();
    }
}

addTagText.addEventListener('keypress', e => {
    if(e.key == 'Enter')
    addTagF(addTagText.value);
});


// Add image

addImageBtn.onclick = () => {
    if(addImageBtn.innerHTML != 'Add'){
        imageFile.value=''; 
        imageFile.click(); // Browse image locally
    } else {
        addImageF(addImageLinkText.value); // Add image link
    }
}

addImageLinkText.addEventListener('keypress', e => {
    if(e.key == 'Enter')
    addImageF(addImageLinkText.value);
});

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

function addImageF(img) {
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
            document.getElementById(currentNote).imageList = browsedImageList;
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
    addImageLinkText.value = '';
    addImageBtn.innerHTML = `Browse <i class="fas fa-folder-open"></i>`;
    document.getElementById(currentNote).imageList = browsedImageList;
}

function resetImageAndTagWrappers(){
    noteTagList = [];
    browsedImageList = [];
    while(insertedTagWrapper.lastChild)
    insertedTagWrapper.removeChild(insertedTagWrapper.lastChild);
    while(noteImagesWrapper.lastChild)
    noteImagesWrapper.removeChild(noteImagesWrapper.lastChild);
    insertedTagWrapper.style.display = 'none';
    noteImagesWrapper.style.display = 'none';
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
        resetImageAndTagWrappers();
        currentNote = evt.target.id;
        let noteTagListTemp = evt.target.tagList;
        let browsedImageListTemp = evt.target.imageList;
        noteTagListTemp.forEach(tag => {
            addTagF(tag);
        });
        browsedImageListTemp.forEach(img => {
            addImageF(img);
        });
    } else {
        textDocument.classList.remove('updateMode');
        updateModeF('', '', 'Create Note');
        resetImageAndTagWrappers();
    }
});

function updateModeF(title, content, btnText){
    noteTitle.value = title;
    textDocument.innerHTML = content;
    createNoteBtn.textContent = btnText;
}