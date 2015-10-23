/**
 * Created by Himo 2015-10-19
 */

var notes = [];
var oldTitle;
var oldContent;
var index;
var oldHTML;
var editHTML;

var selected;

function loadPage() {
    if (typeof(Storage) !== "undefined") {
        loadNote();
    }
    else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

/* Load notes from localstorage, and render events like edit, collapse/expand, delete, remove all.. */
function loadNote(){

    if (localStorage.getItem("notes")) {

        notes = JSON.parse(localStorage.getItem("notes"));

        for( var i = notes.length - 1; i > -1; i-- ){
            $('.noteList').append(showNote(notes[i].title,notes[i].content,notes[i].time,i));
        }
        $('.removeAll').removeClass('hide');

        $('.icon-collapse').on('click', function () {
            $(this).addClass('hide');
            $(this).next().removeClass('hide');
            $(this).parent().prev().addClass('hide');
        });

        $('.icon-expand').on('click', function () {
            $(this).addClass('hide');
            $(this).prev().removeClass('hide');
            $(this).parent().prev().removeClass('hide');
        });

        /* Delete single note item */
        $('.icon-delete').on('click', function () {
            var delIndex = $(this).parent().parent().data('index');
            notes.splice(delIndex,1);

            localStorage.setItem("notes", JSON.stringify(notes));

            $('.noteList').empty();
            loadNote();
        });

        $('.icon-edit').on('click', function x() {
            oldTitle = $(this).parent().prev().prev().prev().text();
            oldContent = $(this).parent().prev().html();
            index = $(this).parent().parent().data('index');

            selected = $(this).parent().parent();
            selected.siblings().each(function () {
                $(this).children('.shadow').removeClass('hide');
            });

            oldHTML = selected.html();

            selected.empty();

            editHTML = '<form class="editForm">' +
                '<input type="text" class="editTitle" id="editTitle" value="' + oldTitle + '" /><br>' +
                '<textarea class="editContent" id="editContent">' + textareaConverter(oldContent) + '</textarea><br>' +
                '<button type="button" class="editBtn" id="editBtn">Edit</button> <button type="button" class="cancelBtn" id="cancelBtn">Cancel</button>' +
                '</form>';
            selected.append(editHTML);

            /* Save new edit to localstorage */
            $('.editBtn').on('click', function () {
                notes[index].title = $('.editTitle').val();
                notes[index].content = $('.editContent').val();
                notes[index].time = getNowFormatDate();

                try{
                    localStorage.setItem("notes", JSON.stringify(notes));
                }
                catch(e){
                    alert('Your browser does not support localstorage. If you are using safari, to use this note, you can: close the block funciton in Settings, or add this page to screen');
                }

                $('.noteList').empty();
                loadNote();
            });

            $('.cancelBtn').on('click', function () {
                $('.noteList').empty();
                loadNote();
            });
        });
    }
}

/* create html for showing each note node */
function showNote(title,content,time,index) {
    return '<div class="noteNode" data-index="' + index + '"><div class="shadow hide"></div>' +
        '<p class="noteTitle">' + title + '</p>'+
        '<p class="noteTime">Last edit: ' + time + '</p>' +
        '<p class="noteContent">' + enterConverter(content) + '</p>' +
        '<p class="icons"><span class="icon-edit"></span><span class="icon-collapse"></span><span class="icon-expand hide"></span><span class="icon-delete"></span></p></div>';
}

/* Constructor for Note object */
function Note_data (title,content,time) {
    this.title = title;
    this.content = content;
    this.time = time;
}

/* Submit new note to localstorage */
$('.submitBtn').on('click', function () {
    if($('.newContent').val() == ''){
        if( $('.alertMsg').length == 0){
            $('.inputForm').after('<span class="alertMsg"> Please enter the note content.</span>');
        }
    }
    else{
        if( $('.alertMsg').length != 0){ $('.alertMsg').remove(); }

        var data = new Note_data($('.newTitle').val(),$('.newContent').val(),getNowFormatDate());
        notes.push(data);

        try{
        localStorage.setItem("notes", JSON.stringify(notes));
        }
        catch(e){
            alert('Your browser does not support localstorage. If you are using safari, to use this note, you can: close the block funciton in Settings, or add this page to screen');
        }

        $('.newTitle').val('New Note Title');
        $('.newContent').val('');
        $('.noteList').empty();
        loadNote();
    }
});

/* Remove all notes in localstorage */
$('.removeAll').on('click',function(){
    localStorage.removeItem("notes");
    $('.removeAll').addClass('hide');
    $('.noteList').empty();
    notes = [];
    loadNote();
});

/* Convert content from textarea text to normal html text */
function enterConverter(content){
    var str = '';
    var tmp = content.split(/\n/);
    for(var i in tmp){
        str += tmp[i] + '<br>';
    }

    return str;
}

/* Convert content from html text to textarea text */
function textareaConverter(content){
    var str = '';
    var tmp = content.split('<br>');
    for(var i in tmp){
        str += tmp[i] + '\n';
    }

    return str.substring(0,str.length - 3);
}

/* Time formatter */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = format(date.getDate());
    var hour = format(date.getHours());
    var min = format(date.getMinutes());
    var sec = format(date.getSeconds());

    function format(time){
        if(time >= 0 && time <= 9){
            return '0' + time;
        }
        else return time;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    return date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hour + seperator2 + min
        + seperator2 + sec;
}

window.onload = loadPage();