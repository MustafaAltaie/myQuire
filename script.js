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
let slideShow = document.getElementById('slideShow');
let imageViewWrapperSlide = document.getElementById('imageViewWrapperSlide');
let noteTagList = [];
let browsedImageList = [];
let currentNavBtn = 'home';
let quireArray = [];

let quireData = JSON.parse(localStorage.getItem('quire'));
console.log(quireData)
if(quireData != null && quireData.length != 0){
    quireArray = quireData;
    quireArray.forEach(note => createNote(note));
} else {
    let imgs = [
        'https://cdn.pixabay.com/photo/2014/08/15/11/29/beach-418742_1280.jpg',
        'https://cdn.pixabay.com/photo/2013/10/09/02/27/lake-192990_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/08/31/17/41/sunrise-1634197_1280.jpg',
        'https://cdn.pixabay.com/photo/2013/10/02/23/03/mountains-190055_1280.jpg',
        'https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'
    ];
    browsedImageList = imgs;
    let tags = ['Nature', 'Images', 'Paintings', 'Mountains'];
    noteTagList = tags;
    createNoteFirst('Note Title', 'Note Content, consectetur Lorem ipsum dolor adipisicing elit.');
    
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
    let thisTitle;
    let thisContent;
    noteTitle.value? thisTitle = noteTitle.value : thisTitle = 'Note Title';
    textDocument.innerHTML? thisContent = textDocument.innerHTML : thisContent = 'Note Content, consectetur Lorem ipsum dolor adipisicing elit.';
    if(createNoteBtn.textContent == 'Create Note'){
        createNoteFirst(thisTitle, thisContent);
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
        document.getElementById(currentNote).classList.remove('updateingNote');
        updateModeF('', '', 'Create Note');
        textDocument.classList.remove('updateMode');
    }
}

function createNoteFirst(title, content, images, tags){
    let utc = new Date().toLocaleString();
    let noteObject = {
        noteId: Date.now(),
        title: title,
        content: content,
        images: browsedImageList,
        tags: noteTagList,
        createdDate: utc,
        isFavorite: false,
        counter: 0
    }
    createNote(noteObject);
    quireArray.push(noteObject);
    localStorage.setItem('quire', JSON.stringify(quireArray));
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
        quireArray.find(note => {
            if(note.noteId == note1.idAddress){
                note.isFavorite = !note.isFavorite;
                localStorage.setItem('quire', JSON.stringify(quireArray));
            }
        });
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
    for(let i = 0; i < notes.length; i++)
    notes[i].classList.remove('updateingNote');
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
            if(currentNote)
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
            if(currentNote)
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
    noteImagesWrapper.style.display = 'flex';
    const wrapper = document.createElement('div');
    wrapper.onclick = () => {
        wrapper.classList.add('newRemovedImage');
        setTimeout(() => {
            wrapper.remove();
            if(noteImagesWrapper.childElementCount == 0)
            noteImagesWrapper.style.display = 'none';
        }, 200);
        browsedImageList = browsedImageList.filter(image => image != img);
        document.getElementById(currentNote).imageList = browsedImageList;
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
    let addPerm = true;
    browsedImageList.forEach(imgs => {
        if(imgs == img) addPerm = false;
    });
    if(addPerm == true){
        browsedImageList.push(img);
        noteImagesWrapper.appendChild(wrapper);
        if(currentNote)
        document.getElementById(currentNote).imageList = browsedImageList;
    }
    addImageLinkText.value = '';
    addImageBtn.innerHTML = `Browse <i class="fas fa-folder-open"></i>`;
    if(currentNote)
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
const noteViewTitle = document.getElementById('noteViewTitle');
const noteViewContent = document.getElementById('noteViewContent');
let currentNote;

noteList.addEventListener('click', evt => {
    if(evt.target.className == 'note' && currentNavBtn == 'favorite'
    || evt.target.className == 'note' && currentNavBtn == 'notesView'){
        noteViewTitle.textContent = evt.target.noteTitle;
        noteViewContent.textContent = evt.target.noteContent;
        while(imageViewWrapperSlide.firstChild)
        imageViewWrapperSlide.removeChild(imageViewWrapperSlide.firstChild);
        const imgList = evt.target.imageList;
        imgList.forEach(img => createViewImages(img));
        while(slideShow.firstChild)
        slideShow.removeChild(slideShow.firstChild);
        hangingImagesLength();
        hangingImagesSize = ((5 - hangingImageLength) + 5) * 24;
        setHangingImages();
        setHangingImagesStyle();
        while(tagsViewWrapper.firstChild)
        tagsViewWrapper.removeChild(tagsViewWrapper.firstChild);
        const tagList = evt.target.tagList;
        tagList.forEach(tag => createViewTags(tag));
        imageViewWrapperSlide.style.left = '0px';
        quireArray.find(note => {
            if(note.noteId + 'Note' == evt.target.id){
                note.counter ++;
                localStorage.setItem('quire', JSON.stringify(quireArray));
            }
        });
    }
    else if(evt.target.className == 'note' && currentNavBtn == 'home'){
        textDocument.classList.add('updateMode');
        updateModeF(evt.target.noteTitle, evt.target.noteContent, 'Save Changes');
        resetImageAndTagWrappers();
        currentNote = evt.target.id;
        for(let i = 0; i < notes.length; i++)
        notes[i].classList.remove('updateingNote');
        evt.target.classList.add('updateingNote');
        let noteTagListTemp = evt.target.tagList;
        let imageListTemp = evt.target.imageList;
        noteTagListTemp.forEach(tag => {
            addTagF(tag);
        });
        imageListTemp.forEach(img => {
            addImageF(img);
        });
    } else {
        textDocument.classList.remove('updateMode');
        if(currentNote)
        document.getElementById(currentNote).classList.remove('updateingNote');
        updateModeF('', '', 'Create Note');
        resetImageAndTagWrappers();
    }
});

function updateModeF(title, content, btnText){
    noteTitle.value = title;
    textDocument.innerHTML = content;
    createNoteBtn.textContent = btnText;
    if(title == '')
    currentNote = undefined;
}


// Notes view section

// Drag the images slide bar
let slideMovePermit = false;
let notesView = document.getElementById('notesView');
let notesViewLeftWidth;
let slideInitX;

document.addEventListener('mousedown', evt => {
    if(evt.target.id == 'imageViewWrapperSlide'
    || evt.target.parentNode.id == 'imageViewWrapperSlide'){
        slideMovePermit = true;
        slideInitX = evt.clientX - imageViewWrapperSlide.offsetLeft - imageViewWrapperSlide.offsetWidth/2;
    }
});

document.addEventListener('mousemove', evt => {
    if(slideMovePermit == true && imageViewWrapperSlide.offsetWidth > document.getElementById('imageViewWrapper').offsetWidth){
        imageViewWrapperSlide.style.left = evt.clientX - imageViewWrapperSlide.offsetWidth/2 - slideInitX + 'px';
        if(imageViewWrapperSlide.offsetLeft + imageViewWrapperSlide.offsetWidth < notesView.offsetWidth - 80 - 50){ // 80 for right padding value of the section
            imageViewWrapperSlide.style.left = imageViewWrapperSlide.offsetLeft + imageViewWrapperSlide.offsetWidth - imageViewWrapperSlide.offsetWidth + 50 + 'px';
            slideMovePermit = false;
        }
        else if(imageViewWrapperSlide.offsetLeft > 0)
        imageViewWrapperSlide.style.left = '0px';
    }
});

document.addEventListener('mouseup', () => {
    if(slideMovePermit == true)
    slideMovePermit = false;
});

// Set the hanging images and tags
const imageView = document.getElementsByClassName('imageView');
if(notes.length != 0){
    noteViewTitle.textContent = notes[0].noteTitle;
    noteViewContent.textContent = notes[0].noteContent;
    let imgList = notes[0].imageList;
    imgList.forEach(img => createViewImages(img));
    let tagList = notes[0].tagList;
    tagList.forEach(tag => createViewTags(tag));
}

// Create hanging and slide images
let hangingImage = document.getElementsByClassName('hangingImages');
let hangingImageLength;
function hangingImagesLength(){
    if(imageView.length > 5)
    hangingImageLength = 5;
    else hangingImageLength = imageView.length;
}
hangingImagesLength();
let leftCounter = 10;
let hangingImagesSize = ((5 - hangingImageLength) + 5) * 24;  // ((maxLength - length) + maxLength) * 24  ,,, 5 and 24 is const

function createViewImages(image){
    const imageView = document.createElement('div');
    imageView.className = 'imageView';
        const image1 = document.createElement('img');
        image1.src = image;
        image1.alt = 'Image';
    imageView.appendChild(image1);
    imageViewWrapperSlide.appendChild(imageView);
}

// Create tags
function createViewTags(tag){
    const tag1 = document.createElement('p');
    tag1.textContent = '# ' + tag;
    document.getElementById('tagsViewWrapper').appendChild(tag1);
}

function setHangingImages(){
    for(let i = 0; i < hangingImageLength; i++){
        const hangingImages = document.createElement('div');
        hangingImages.className = 'hangingImages';
            const image = document.createElement('img');
            image.src = imageView[i].children[0].src;
            image.alt = 'Image';
        hangingImages.appendChild(image);
        slideShow.appendChild(hangingImages);
        hangingImage[i].style.width = hangingImagesSize + 'px';
        hangingImage[i].style.height = hangingImagesSize + 'px';
    }
}
setHangingImages();

function setHangingImagesStyle() {
    if (hangingImageLength == 5 || hangingImageLength == 4){
        for(let i = 0; i < hangingImageLength; i++){
            if(i % 2 == 0)
            hangingImage[i].style.top = '260px';
            else
            hangingImage[i].style.top = '70px';
            hangingImage[i].style.left = leftCounter + 'px';
            leftCounter += 90;
            if(leftCounter > 90*hangingImageLength)
            leftCounter = 10;
        }
    } else if (hangingImageLength == 3){
        for(let i = 0; i < hangingImageLength; i++){
            if(i % 2 == 0)
            hangingImage[i].style.top = '250px';
            else
            hangingImage[i].style.top = '30px';
            hangingImage[i].style.left = leftCounter + 'px';
            leftCounter += 150;
            if(leftCounter > 150*hangingImageLength)
            leftCounter = 10;
        }
    } else if (hangingImageLength == 2){
        for(let i = 0; i < hangingImageLength; i++){
            if(i % 2 == 0)
            hangingImage[i].style.top = '80px';
            else
            hangingImage[i].style.top = '140px';
            hangingImage[i].style.left = leftCounter + 'px';
            leftCounter += 270;
            if(leftCounter > 270*hangingImageLength)
            leftCounter = 10;
        }
    } else if (hangingImageLength == 1){
        hangingImage[0].style.top = '50%';
        hangingImage[0].style.left = '50%';
        hangingImage[0].style.transform = 'translate(-50%, -50%)';
    }
}