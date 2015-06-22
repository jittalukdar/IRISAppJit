//var BASE_URL = "http://localhost/iris/dev/";
var BASE_URL = "http://dev.wrctechnologies.com/irisdesign/dev/";

var html_body_back = '<input type="text" placeholder="Enter your keyword">' +
        '<a class="search" href="#">Post</a> <a class="cls" href="#"></a>';
// Regular Expression for Email.
var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
$(window).load(function () {
    $("#formSubmitReg1").click(function () {
        if (validateForm()) {
            var todo = "reg";
            var fname = $('#fname').val();
            var lname = $('#lname').val();
            var email = $('#email').val();
            var password = $('#password').val();
            callApiForRegistration(todo, fname, lname, email, password);
        }
    });
});

// REGISTRATION CODE
function validateForm() {
    var bool = true;
    if ($.trim($("#fname").val()) === "" || $.trim($("#fname").val().length) === 0) {
        $("#fname").addClass("error");
        $("#fname").focus();
        bool = false;
    } else if ($.trim($("#lname").val()) === "" || $.trim($("#lname").val().length) === 0) {
        $("#lname").addClass("error");
        $("#lname").focus();
        bool = false;
    } else if ($.trim($("#email").val()) === "" || $.trim($("#email").val().length) === 0) {
        $("#email").addClass("error");
        $("#email").focus();
        bool = false;
    } else if (!regex.test($("#email").val())) {
        $("#email").addClass("error");
        $("#email").focus();
        bool = false;
    }
//    else if (!checkUniqueEmail($("#email").val())) {
//        $("#email").addClass("error");
//        $("#email").focus();
//        navigator.notification.alert("Your email id must be unique", null, "Notification", "OK");
//        bool = false;
//    } 
    else if ($.trim($("#password").val()) === "" || $.trim($("#password").val().length) === 0) {
        $("#password").addClass("error");
        $("#password").focus();
        bool = false;
    } else if ($.trim($("#cpassword").val()) === "" || $.trim($("#cpassword").val().length) === 0) {
        $("#cpassword").addClass("error");
        $("#cpassword").focus();
        bool = false;
    } else if ($.trim($("#cpassword").val()) !== $.trim($("#password").val())) {
        $("#cpassword").addClass("error");
        $("#cpassword").focus();
        bool = false;
    } else {
        bool = true;
    }
    return bool;
}
function callApiForRegistration(todo, fname, lname, email, password) {
    $.ajax({
        url: BASE_URL + 'api/registration',
        type: "POST",
        data: {
            todo: todo,
            fname: fname,
            lname: lname,
            email: email,
            password: password
        },
        success: function (resp) {
            var data = $.parseJSON(resp);
            if (data.code == '200') {
                sessionStorage.setItem("uid", data.uid);
                location.href = 'selectinterest.html';
                if (data.toast !== "") {
                    navigator.notification.alert(data.toast, null, "Notification", "OK");
                }
            } else {
                navigator.notification.alert(data.error, null, "Notification", "OK");
            }
        }
    });
}
function getBankDetails() {
    $.ajax({
        url: BASE_URL + 'api/getSignUpBank',
        type: 'POST',
        data: $("#loginForm").serialize(),
        success: function (resp) {
            var obj = $.parseJSON(resp);
            if (obj.code == '200') {
                $("#signInBankName").text("SIGN IN WITH " + obj.bankname);
            } else {
                $("#signInBankName").text("SIGN IN WITH BANK OF AMERICA");
            }
        }
    });
}
function regEmailFunction() {
    onLoadRegEmailFunction();
    $("#formSubmitRegEmail").click(function () {
        if (validateRegWithEmailForm()) {
//            alert();
            var todo = "regwithbank";
            var fname = "Test";
            var lname = "Test";
            var email = $('#email').val();
            var username = "test";
            var password = $('#password').val();
            callApiForRegistration(todo, fname, lname, email, username, password);
        }
    });
}
function validateRegWithEmailForm() {
    var bool = true;

    if ($.trim($("#email").val()) === "" || $.trim($("#email").val().length) === 0) {
        $("#email").addClass("error");
        $("#email").focus();
        bool = false;
    } else if (!regex.test($("#email").val())) {
        $("#email").addClass("error");
        $("#email").focus();
        bool = false;
    }
//    else if (checkUniqueEmail($("#email").val()) == false) {
//        $("#email").addClass("error");
//        $("#email").focus();
//        navigator.notification.alert("Your email id must be unique", null, "Notification", "OK");
//        bool = false;
//    } 
    else {
        bool = true;
    }
    return bool;
}
function onLoadRegEmailFunction() {
    $.ajax({
        url: BASE_URL + 'api/getSignUpBankLogo',
        type: 'POST',
        data: $("#loginForm").serialize(),
        success: function (resp) {
            var obj = $.parseJSON(resp);
            if (obj.code == '200') {
                $("#bankimage").html('<img src="' + obj.banklogo + '" draggable="false" height="130" height="129"/>');
            } else {
                $("#signInBankName").text("SIGN IN WITH BANK OF AMERICA");
            }
        }
    });
}
// REGISTRATION CODE

// SELECT INTEREST CODE
function callSelectInterest() {
    if (sessionStorage.getItem("login")) {
        location.href = "dashboard.html";
    } else {
        fetchInterests();
    }
}
function fetchInterests() {
    $.ajax({
        url: BASE_URL + 'api/fetchInterestMaster',
        type: "POST",
        data: {
            todo: "fetch"
        },
        success: function (resp) {
            var data = $.parseJSON(resp);
            var output = "";
            for (var i = 0; i < data.length; i++) {
                output += '<li id="' + data[i].topic_id + '"><a href="#" onclick="addClassInterests(' + data[i].topic_id + ')">' + data[i].topic_name + '</a></li>';
            }
            $("#interests").html(output);
            var uid = '<input type="hidden" id="uid" name="uid" value="' + sessionStorage.getItem("uid") + '">';
            $("#selInt").append(uid);
        }
    });

    $("#done").click(function () {
        $.ajax({
            url: BASE_URL + 'api/insertRegisteredUsersChoice',
            type: "POST",
            data: $("#selectedForm").serialize(),
            success: function (resp) {
                var data = $.parseJSON(resp);
                if (data.code == "200") {
                    location.href = 'dashboard.html';
                } else {
                    navigator.notification.alert(data.error, null, "Notification", "OK");
                }
            }
        });
    });
}
function addClassInterests(id) {
    var hiddenField = "";
    if ($("#" + id).hasClass("act")) {
        $("#" + id).removeClass("act");
        $("#hf" + id).remove();
    } else {
        hiddenField = '<input type="hidden" id="hf' + id + '" name="selectedInterests[]" value="' + id + '">';
        $("#selInt").append(hiddenField);
        $("#" + id).addClass("act");
    }
}
// SELECT INTEREST CODE

// LOGIN CODE
function loginFunctions() {
    getBankDetails();
    $('.logsin').click(function () {
        if (validateLoginForm()) {
            fetchLoginData();
        }
    });
}
function validateLoginForm() {
    var bool = true;
    if ($.trim($("#email").val()) === "" || $.trim($("#email").val().length) === 0) {
        $("#email").addClass("error");
        $("#email").focus();
        bool = false;
    } else if (!regex.test($("#email").val())) {
        $("#email").addClass("error");
        $("#email").focus();
        bool = false;
    } else if ($.trim($("#password").val()) === "" || $.trim($("#password").val().length) === 0) {
        $("#password").addClass("error");
        $("#password").focus();
        bool = false;
    } else {
        bool = true;
    }
    return bool;
}
function fetchLoginData() {
    $.ajax({
        url: BASE_URL + 'api',
        type: 'POST',
        data: $("#loginForm").serialize(),
        success: function (resp) {
            var obj = $.parseJSON(resp);
            if (obj.code == '100') {
                sessionStorage.setItem("uid", obj.uid);
                location.href = 'dashboard.html';
            } else {
                navigator.notification.alert("Sorry wrong username or password. Please try again.", null, "Notification", "OK");
                $('#username').addClass('error');
                $('#username').focus();
            }
        }
    });
}

// LOGIN CODE

// DASHBOARD FUNCTIONS
function dashboardFunctions() {
    checkUserSession();
}
// DASHBOARD FUNCTIONS

// GROUP FUNCTONS
function groupFunction() {
    checkUserSession();
    $(window).bind('deviceready load', function () {
        fetchPublicGroups();
        fetchPrivateGroups();
        $("#btnCamera").bind("touchstart click", function () {
            getPictureFromCamera();
        });
        $("#btnGallery").bind("touchstart click", function () {
            getPictureFromGallery();
        });
    });
}
function createGroup() {
    if (validateGroup()) {
        $("#uid").val(sessionStorage.getItem("uid"));
        $.ajax({
            url: BASE_URL + 'api/createGroup',
            type: 'POST',
            data: $("#createGroupForm").serialize(),
            success: function (resp) {
                var data = $.parseJSON(resp);
//                navigator.notification.alert(data.toast, null, "Notification", "OK");
//                location.href = "publicgroup.html";
                window.location.reload();
            }
        });
    }
}
function validateGroup() {
    var bool = true;
    if ($.trim($("#group_name").val()) === "" || $.trim($("#group_name").val().length) === 0) {
        $("#group_name").addClass("error");
        $("#group_name").focus();
        bool = false;
    } else if ($.trim($("#group_content").val()) === "" || $.trim($("#group_content").val().length) === 0) {
        $("#group_content").addClass("error");
        $("#group_content").focus();
        bool = false;
    } else {
        bool = true;
    }
    return bool;
}
function fetchPublicGroups() {
    $.ajax({
        url: BASE_URL + 'api/fetchUsersPublicGroups',
        type: 'POST',
        data: "uid=" + sessionStorage.getItem("uid"),
        success: function (resp) {
            console.log(resp);
            var data = $.parseJSON(resp);
            var groupListAppend = "";
            var j = 1;
            for (var i = 0; i < data.length; i++) {
                groupListAppend += constructGroupList(j, data[i].group_id, data[i].group_name, data[i].group_content, data[i].group_image);
                j++;
            }
            $("#groupsDisplay").append(groupListAppend);
        }
    });
}
function fetchPrivateGroups() {
    $.ajax({
        url: BASE_URL + 'api/fetchUsersPrivateGroups',
        type: 'POST',
        data: "uid=" + sessionStorage.getItem("uid"),
        success: function (resp) {
            console.log(resp);
            var data = $.parseJSON(resp);
            var groupListAppend = "";
            var j = 1;
            for (var i = 0; i < data.length; i++) {
                groupListAppend += constructGroupList(j, data[i].group_id, data[i].group_name, data[i].group_content, data[i].group_image);
                j++;
            }
            $("#groupsDisplayPrivate").append(groupListAppend);
        }
    });
}
function constructGroupList(i, group_id, groupName, groupContent, groupImage) {
    var div = "";
    if (i == 1) {
        div += '<div class="row">';
    }
    div += '<div class="col-md-4">' +
            '<article>' +
            '<header>' + groupName + '</header>' +
            '<div class="blog-image">' +
            '<a href="javascript:void();" onclick="viewGroupDetails(' + group_id + ')"><img alt="" src="data:image/jpeg;base64,' + groupImage + '" class="img-responsive">' +
            '<div class="row text-center groupbtn">' +
            '<div class="col-sm-4"><a href="#" class="groupsbtn">FOLLOW</a></div>' +
            '<div class="col-sm-4"><a href="#" class="groupsbtn">JOIN</a></div>' +
            '<div class="col-sm-4"><a href="#" class="groupsbtn">223</a></div>' +
            '</div>' +
            '</div>' +
            '<div class="card-body blog-text">' +
            '<p>' + groupContent + '</p>' +
            '</div>' +
            '</article>' +
            '</div>';
    if (i % 3 == 0) {
        div += '</div>';
        div += '<div class="row">';
    }
    return div;
}
function viewGroupDetails(group_id) {
    sessionStorage.setItem("gid", group_id);
    location.href = "group_details.html";
}
// GROUP FUNCTONS

// GROUP POST FUNCTIONS
function groupPostFunctions() {
    fetchCustomGroupPost();
}
function customPost() {
    var post_title = $("#post_title").val();
    var post_content = $("#post_content").val();
    $.ajax({
        url: BASE_URL + 'api/customUserPost',
        type: 'POST',
        dataType: 'JSON',
        async: true,
        data: {
            post_title: post_title,
            post_content: post_content,
            group_id: sessionStorage.getItem("gid"),
            user_id: sessionStorage.getItem("uid")
        },
        success: function (resp) {
            //alert(resp);
            $('.exploewsearch').html(html_body_back);
            $('.exploewsearch').addClass('exploe2');
            $("#post_title").val("");
            $("#post_content").val("");
            fetchCustomGroupPost();
        }
    });
}
function fetchCustomGroupPost() {
    $.ajax({
        url: BASE_URL + 'api/fetchCustomGroupPosts',
        type: 'POST',
        dataType: 'JSON',
        async: true,
        data: {
            group_id: sessionStorage.getItem("gid"),
            user_id: sessionStorage.getItem("uid")
        },
        success: function (resp) {
            for (var i = 0; i < resp.length; i++) {
                $("#groupDetails").prepend(constructGroupDetailsDiv(i, resp[i].feed_title, resp[i].feed_desc, resp[i].user_name, resp[i].feed_date, resp[i].comment_count, resp[i].likes, resp[i].comment)).fadeIn("slow");
            }
        }
    });
}
function constructGroupDetailsDiv(i, feedTitle, feedDesc, fullName, feedDate, commentCount, likesCount, comments) {
    var html = "";
    html += '<div class="card feedbox">' +
            '<div class="row">' +
            '<div class="col-md-3">' +
            '<div class="card-body">' +
            '<article class="style-default-bright">' +
            '<div> <img alt="" src="img/modules/obama.png" class="img-responsive"> </div>' +
            '</article>' +
            '</div>' +
            '</div>' +
            '<div class="col-md-9 newsfeed newsfeed2 padright" id="newsfeed' + i + '">' +
            '<div class="card-body">' +
            '<a href="#">' +
            '<h2>' + feedTitle + '</h2>' +
            '<div class="text-default-light">Posted by <span class="name_post">' + fullName + '</span> <span class="post_time">' + feedDate + '</span> <a href="#">' + commentCount + ' comments <i class="fa fa-comment-o"></i></a></div>' +
            '<p id="desc' + i + '">' + feedDesc + '</p>' +
            '</a>';
    if (commentCount > 0) {
        html += '<hr>' +
                '<h4 style="color:#0080db;">Comment <small>(<a href="postdetails.html">see all comments</a>)</small></h4>' +
                '<ul class="list-comments">';
        for (var j = 0; j < comments.length; j++) {
            html += '<li>' +
                    '<div class="card">' +
                    '<div class="comment-avatar"><img src="img/modules/avatar4.jpg" alt=""></div>' +
                    '<div class="card-body">' +
                    '<h4 class="comment-title">' + comments[j].fullname + '<small>' + comments[j].feed_date + ' at ' + comments[j].feed_time + '</small></h4>' +
                    '<p style="margin-bottom:0;">' + comments[j].feed_comment + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
        }
        html += '</ul>';
    }
    html += '<hr style="margin:0;">' +
            '<div class="options2">' +
            '<ul>' +
            '<li><a title="" class="like active" href="#"> + ' + likesCount + '</a> </li>' +
            '<li><a title="" class="share" href="#"></a> </li>' +
            '<li><a id="bulb' + i + '" class="bulb2" href="javascript:void(0);" onclick="hideOptions(' + i + ')"></a> </li>' +
            '</ul>' +
            '</div>' +
            '<div class="options3" id="options' + i + '">' +
            '<ul>' +
            '<li><a title="" class="list" href="docs_temp.html"></a> </li>' +
            '<li><a title="" class="music" href="pdf_temp.html"></a> </li>' +
            '<li><a title="" class="tv" href="ppt_temp.html"></a> </li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    return html;

}
// GROUP POST FUNCTIONS

// COMMON FUNCTIONS
function checkUserSession() {
    if (null != sessionStorage.getItem("uid")) {
        sessionStorage.setItem("login", "true");
    } else {
        location.href = "index.html";
    }
}
function logout() {
    sessionStorage.clear();
    location.href = "index.html";
}
function hideOptions(id) {
    $('#options' + id).css('display', 'none');
    $('#newsfeed' + id).removeClass('padright');
    $("#bulb" + id).removeAttr("onclick");
    $("#bulb" + id).attr("onclick", "showOptions(" + id + ")");
}
function showOptions(id) {
    $('#options' + id).css('display', 'block');
    $('#newsfeed' + id).addClass('padright');
    $("#bulb" + id).removeAttr("onclick");
    $("#bulb" + id).attr("onclick", "hideOptions(" + id + ")");
}
function checkUniqueEmail(email) {
    $.ajax({
        url: BASE_URL + 'api/checkUniqueEmail',
        type: 'POST',
        data: {email: email},
        success: function (resp) {
//            console.log(resp);
            if (resp == 0) {
                return true;
            } else {
                return false;
            }
        }
    });
}

// IMAGE UPLOAD ON IOS
function getPictureFromCamera() {
    // var imageData;
    navigator.camera.getPicture(function (data) {
        $("#imageGallery")
                .attr('src', 'data:image/jpeg;base64,' + data)
                .css("display", "block");
        $("#imageRaw").val(data);
    }, function (error) {
        console.log("Error " + error);
    }, {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        targetWidth: 640,
        targetHeight: 426
    });
    return true;
}
function getPictureFromGallery() {
    navigator.camera.getPicture(function (data) {
        $("#imageGallery")
                .attr('src', 'data:image/jpeg;base64,' + data)
                .css("display", "block");
        $("#imageRaw").val(data);
    }, function (error) {
        console.log("Error " + error);
    }, {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        targetWidth: 640,
        targetHeight: 426,
        mediaType: Camera.MediaType.PICTURE
    });
    return true;
}
