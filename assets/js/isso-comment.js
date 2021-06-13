(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/isso-comment"],{

/***/ "./js/isso-comment.js":
/*!****************************!*\
  !*** ./js/isso-comment.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var simplemde_dist_simplemde_min_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! simplemde/dist/simplemde.min.css */ "./node_modules/simplemde/dist/simplemde.min.css");
/* harmony import */ var simplemde_dist_simplemde_min_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(simplemde_dist_simplemde_min_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var simplemde__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! simplemde */ "./node_modules/simplemde/src/js/simplemde.js");
/* harmony import */ var simplemde__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(simplemde__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var timeago_js_lib_lang_vi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! timeago.js/lib/lang/vi */ "./node_modules/timeago.js/lib/lang/vi.js");
/* harmony import */ var timeago_js_lib_lang_vi__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(timeago_js_lib_lang_vi__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var timeago_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! timeago.js */ "./node_modules/timeago.js/esm/index.js");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! md5 */ "./node_modules/md5/md5.js");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(md5__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);







var host = 'https://comment.tenolife.com';
var postContext = window.postContext;
var simplemde = null;
var inlinemde = null;
var inlinemdeContainer = null;

var renderVotes = function renderVotes(votes) {};

var voteComment = function voteComment(item, vote) {
  var itemId = lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'id');

  if (lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isNull(itemId)) {
    return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.Deferred().resolve(item);
  }

  return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ajax({
    method: 'POST',
    url: host + '/id/' + itemId + '/' + vote,
    headers: {
      Accept: '*/*'
    },
    contentType: 'application/json',
    dataType: 'json'
  });
};

var removeInlineEditor = function removeInlineEditor() {
  if (!lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isNull(inlinemde)) {
    inlinemde.toTextArea();
    inlinemde = null;
  }

  if (!lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isNull(inlinemdeContainer)) {
    inlinemdeContainer.remove();
    inlinemdeContainer = null;
  }
};

var renderInlineReply = function renderInlineReply(element, parent) {
  removeInlineEditor();
  inlinemdeContainer = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div></div>');
  var editorElement = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<textarea></textarea>');
  inlinemdeContainer.append(editorElement);
  var submit = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<button class="m-button primary comment-editor-submit">Submit</button>');
  var close = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<button class="m-button comment-editor-clear">Close</button>');
  var toolbar = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div style="text-align: right; padding-top: 4px;"></div>');
  toolbar.append(submit).append(close);
  inlinemdeContainer.append(toolbar);
  element.append(inlinemdeContainer);
  inlinemde = new simplemde__WEBPACK_IMPORTED_MODULE_2___default.a({
    element: editorElement.get(0),
    status: false,
    toolbar: false
  });
  submit.on('click', function () {
    var value = inlinemde.value();

    if (!lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty(value)) {
      submitComment(value, element, lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(parent, 'id')).done(function () {
        return removeInlineEditor();
      });
    }
  });
  close.on('click', function () {
    return removeInlineEditor();
  });
};

var deleteComment = function deleteComment(element, item) {
  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ajax({
    method: 'DELETE',
    url: host + '/id/' + lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'id'),
    contentType: 'application/json',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    }
  }).done(function () {
    return element.remove();
  });
};

var hasCookie = function hasCookie(cookie) {
  return !lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty((document.cookie.match('(^|; )' + cookie + '=([^;]*)') || 0)[2]);
};

var renderComment = function renderComment(element, item) {
  var placeHolder = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="comment-placeholder"></div>');
  var avatar = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="comment-avatar"></div>');
  var emailHash = md5__WEBPACK_IMPORTED_MODULE_5___default()(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.toLower(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.trim(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(postContext, 'member.email'))));
  avatar.append('<img src="https://www.gravatar.com/avatar/' + emailHash + '?s=64&d=identicon&r=g"/>');
  placeHolder.append(avatar);
  var stack = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="comment-stack"></div>'); // show author and edit time

  var status = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="comment-status"></div>');

  var author = lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'author');

  status.append('<span class="comment-author">' + (lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty(author) ? 'Anonymous' : author) + '</span>');
  var date = new Date(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'created') * 1000);
  status.append('<span class="comment-modified">' + Object(timeago_js__WEBPACK_IMPORTED_MODULE_4__["format"])(date, document.documentElement.lang) + '</span>');
  stack.append(status); // show comment content

  var content = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="comment-content"></div>');
  content.append(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'text'));
  stack.append(content);
  var toolbar = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="comment-toolbar"></div>');
  var like = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<a href="#" class="comment-like icon-cool"/>');
  like.on('click', function () {
    voteComment(item, 'like').done(function (votes) {
      like.find('.comment-likes').html(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(votes, 'likes', 0));
    });
    return false;
  });
  toolbar.append(like);
  toolbar.append('<span class="comment-likes">' + lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'likes', 0) + '</span>');
  var dislike = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<a href="#" class="comment-dislike icon-tongue"/>');
  dislike.on('click', function () {
    voteComment(item, 'dislike').done(function (votes) {
      like.find('.comment-dislikes').html(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(votes, 'dislikes', 0));
    });
    return false;
  });
  toolbar.append(dislike);
  toolbar.append('<span class="comment-dislikes">' + lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'dislikes', 0) + '</span>');
  stack.append(toolbar);
  var childPlaceholder = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<div class="inline-reply"></div>');
  stack.append(childPlaceholder);

  if (!lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(postContext, 'member'))) {
    var reply = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<a href="#" class="comment-action">Reply</a>');
    toolbar.append(reply);
    reply.on('click', function () {
      renderInlineReply(childPlaceholder, item);
      return false;
    });
  }

  if (hasCookie("isso-" + lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'id'))) {
    var del = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<a href="#" class="comment-action">Delete</a>');
    toolbar.append(del);
    del.on('click', function () {
      deleteComment(placeHolder, item);
      return false;
    });
  }

  placeHolder.append(stack);
  element.append(placeHolder);
  return childPlaceholder;
};

var renderBlockComments = function renderBlockComments(element, items) {
  if (lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty(items)) {
    return;
  }

  var ul = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<ul class="comment-block"></ul>');

  lodash__WEBPACK_IMPORTED_MODULE_6___default.a.forEach(items, function (item) {
    var itemId = lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'id');

    var li = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<li class="comment-item"></li>');
    var childPlaceholder = renderComment(li, item);
    renderBlockComments(childPlaceholder, lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(item, 'replies'));
    ul.append(li);
  });

  element.append(ul);
};

var renderComments = function renderComments(comments) {
  if (lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty(comments)) {
    jquery__WEBPACK_IMPORTED_MODULE_1___default()('#isso-comments').append('<h3 id="isso-no-comment">No comments</h3>');
    return;
  }

  renderBlockComments(jquery__WEBPACK_IMPORTED_MODULE_1___default()('#isso-comments').first(), comments);
};

var loadComments = function loadComments() {
  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ajax(host + '/?uri=' + encodeURIComponent(postContext.url)).done(function (data) {
    var all = lodash__WEBPACK_IMPORTED_MODULE_6___default.a.groupBy(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(data, 'replies'), 'website');

    renderComments(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(all, 'null'));
    renderVotes(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(all, 'tenolife'));
  }).fail(function () {
    renderComments([]);
    renderVotes([]);
  });
};

var submitComment = function submitComment(text, renderToElement, parent) {
  var payload = {
    author: lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(postContext, 'member.name'),
    email: lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(postContext, 'member.email'),
    title: lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(postContext, 'title'),
    parent: parent,
    mode: 1,
    text: text
  };
  return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ajax({
    type: 'POST',
    url: host + '/new?uri=' + encodeURIComponent(postContext.url),
    data: JSON.stringify(payload),
    contentType: 'application/json',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    }
  }).done(function (item) {
    renderBlockComments(renderToElement, [item]);
    jquery__WEBPACK_IMPORTED_MODULE_1___default()('#isso-no-comment').remove();
  }).always(function (res, code, jqXHr) {
    return storeCookies(jqXHr);
  });
};

var storeCookies = function storeCookies(jqXHr) {
  var cookie1 = jqXHr.getResponseHeader('Set-Cookie');
  var cookie2 = jqXHr.getResponseHeader('X-Set-Cookie');
  document.cookie = cookie1;
  document.cookie = cookie2;
};

var initMardownEditor = function initMardownEditor() {
  if (lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isNull(lodash__WEBPACK_IMPORTED_MODULE_6___default.a.get(postContext, 'member'))) {
    return;
  }

  simplemde = new simplemde__WEBPACK_IMPORTED_MODULE_2___default.a({
    element: jquery__WEBPACK_IMPORTED_MODULE_1___default()('.comment-editor').get(0),
    status: false
  });
  jquery__WEBPACK_IMPORTED_MODULE_1___default()('.comment-editor-submit').on('click', function () {
    var value = simplemde.value();

    if (!lodash__WEBPACK_IMPORTED_MODULE_6___default.a.isEmpty(value)) {
      submitComment(value, jquery__WEBPACK_IMPORTED_MODULE_1___default()('#isso-comments').first()).done(function () {
        simplemde.value("");
      });
    }
  });
  jquery__WEBPACK_IMPORTED_MODULE_1___default()('.comment-editor-clear').on('click', function () {
    simplemde.value("");
  });
};

jquery__WEBPACK_IMPORTED_MODULE_1___default()(function () {
  Object(timeago_js__WEBPACK_IMPORTED_MODULE_4__["register"])('vi', timeago_js_lib_lang_vi__WEBPACK_IMPORTED_MODULE_3___default.a);
  initMardownEditor();
  loadComments();
});

/***/ }),

/***/ 5:
/*!**********************************!*\
  !*** multi ./js/isso-comment.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/camhoang/Workplace/liebling/src/js/isso-comment.js */"./js/isso-comment.js");


/***/ }),

/***/ 6:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[5,"/js/manifest","/js/vendor"]]]);