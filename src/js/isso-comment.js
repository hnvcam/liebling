import 'simplemde/dist/simplemde.min.css'
import $ from 'jquery'
import SimpleMDE from 'simplemde'
import localeVi from 'timeago.js/lib/lang/vi'
import {format, register} from 'timeago.js'
import md5 from 'md5'
import _ from 'lodash'

const host = 'https://comment.tenolife.com'
const postContext = window.postContext
let simplemde = null
let inlinemde = null
let inlinemdeContainer = null

const renderVotes = votes => {

}

const voteComment = (item, vote) => {
    const itemId = _.get(item, 'id')
    if (_.isNull(itemId)) {
        return $.Deferred().resolve(item)
    }
    return $.ajax({
        method: 'POST',
        url: host + '/id/' + itemId + '/' + vote,
        headers: {
            Accept: '*/*'
        },
        contentType: 'application/json',
        dataType: 'json'
    })
}

const removeInlineEditor = () => {
    if (!_.isNull(inlinemde)) { 
        inlinemde.toTextArea()
        inlinemde = null
    }
    if (!_.isNull(inlinemdeContainer)) {
        inlinemdeContainer.remove()
        inlinemdeContainer = null
    }
}

const renderInlineReply = (element, parent) => {
    removeInlineEditor()

    inlinemdeContainer = $('<div></div>')
    const editorElement = $('<textarea></textarea>')
    inlinemdeContainer.append(editorElement)
    const submit = $('<button class="m-button primary comment-editor-submit">Submit</button>')
    const close = $('<button class="m-button comment-editor-clear">Close</button>')
    const toolbar = $('<div style="text-align: right; padding-top: 4px;"></div>')
    toolbar.append(submit).append(close)
    inlinemdeContainer.append(toolbar)
    element.append(inlinemdeContainer)

    inlinemde = new SimpleMDE({
        element: editorElement.get(0),
        status: false,
        toolbar: false
    })

    submit.on('click', () => {
        const value = inlinemde.value()
        if (!_.isEmpty(value)) {
            submitComment(value, element, _.get(parent, 'id'))
            .done(() => removeInlineEditor())
        }
    })
    close.on('click', () => removeInlineEditor())
}

const deleteComment = (element, item) => {
    $.ajax({
        method: 'DELETE',
        url: host + '/id/' + _.get(item, 'id'),
        contentType: 'application/json',
        dataType: 'json'
    }).done(() => element.remove())
}

const renderComment = (element, item) => {
    const placeHolder = $('<div class="comment-placeholder"></div>')
    const avatar = $('<div class="comment-avatar"></div>')
    const emailHash = md5(_.toLower(_.trim(_.get(postContext, 'member.email'))))
    avatar.append('<img src="https://www.gravatar.com/avatar/' 
        + emailHash 
        + '?s=64&d=identicon&r=g"/>')
    placeHolder.append(avatar)

    const stack = $('<div class="comment-stack"></div>')
    // show author and edit time
    const status = $('<div class="comment-status"></div>')
    const author = _.get(item, 'author')
    status.append('<span class="comment-author">' 
        + (_.isEmpty(author) ? 'Anonymous' : author) 
        + '</span>')
    const date = new Date(_.get(item, 'created') * 1000)
    status.append('<span class="comment-modified">' 
        + format(date, document.documentElement.lang) 
        + '</span>')  
    stack.append(status)
    
    // show comment content
    const content = $('<div class="comment-content"></div>')
    content.append(_.get(item, 'text'))
    stack.append(content)

    const toolbar = $('<div class="comment-toolbar"></div>')
    const like = $('<a href="#" class="comment-like icon-cool"/>')
    like.on('click', () => {
        voteComment(item, 'like')
        .done(votes => {
            like.find('.comment-likes').html(_.get(votes, 'likes', 0))
        })
        return false
    })
    toolbar.append(like)
    toolbar.append('<span class="comment-likes">' + _.get(item, 'likes', 0) + '</span>')
    const dislike = $('<a href="#" class="comment-dislike icon-tongue"/>')
    dislike.on('click', () => {
        voteComment(item, 'dislike')
        .done(votes => {
            like.find('.comment-dislikes').html(_.get(votes, 'dislikes', 0))
        })
        return false
    })
    toolbar.append(dislike)
    toolbar.append('<span class="comment-dislikes">' + _.get(item, 'dislikes', 0) + '</span>')
    stack.append(toolbar)
    const childPlaceholder = $('<div class="inline-reply"></div>')
    stack.append(childPlaceholder)
    
    if (!_.isEmpty(_.get(postContext, 'member'))) {
        const reply = $('<a href="#" class="comment-action">Reply</a>')
        toolbar.append(reply)
        reply.on('click', () => {
            renderInlineReply(childPlaceholder, item)
            return false
        })
    }

    if (_.isEqual(_.get(postContext, 'member.email'), _.get(item, 'email'))) {
        const del = $('<a href="#" class="comment-action">Delete</a>')
        toolbar.append(del)
        del.on('click', () => {
            deleteComment(placeHolder, item)
            return false
        })
    }

    placeHolder.append(stack)
    element.append(placeHolder)

    return childPlaceholder
}

const renderBlockComments = (element, items) => {
    if (_.isEmpty(items)) {
        return
    }

    const ul = $('<ul class="comment-block"></ul>')
    _.forEach(items, item => {
        const itemId = _.get(item, 'id')
        const li = $('<li class="comment-item"></li>')
        const childPlaceholder = renderComment(li, item)

        renderBlockComments(childPlaceholder, _.get(item, 'replies'))

        ul.append(li)
    })
    element.append(ul)
} 

const renderComments = comments => {
    if (_.isEmpty(comments)) {
        $('#isso-comments').append('<h3>No comments</h3>')
        return
    }
    renderBlockComments($('#isso-comments').first(), comments)
}

const loadComments = () => {
    $.ajax(host + '/?uri=' + encodeURIComponent(postContext.url))
    .done(data => {
        const all = _.groupBy(_.get(data, 'replies'), 'website')
        renderComments(_.get(all, 'null'))
        renderVotes(_.get(all, 'tenolife'))
    }).fail(() => {
        renderComments([])
        renderVotes([])
    })
}

const submitComment = (text, renderToElement, parent) => {
    const payload = {
        author: _.get(postContext, 'member.name'),
        email: _.get(postContext, 'member.email'),
        title: _.get(postContext, 'title'),
        parent,
        mode: 1,
        text
    }
    return $.ajax({
        type: 'POST',
        url: host + '/new?uri=' + encodeURIComponent(postContext.url),
        data: JSON.stringify(payload),
        contentType: 'application/json',
        dataType: 'json'
    }).done(item => renderBlockComments(renderToElement, [item]))
}

const initMardownEditor = () => {
    if (_.isNull(_.get(postContext, 'member'))) {
        return
    }

    simplemde = new SimpleMDE({
        element: $('.comment-editor').get(0),
        status: false
    })
    $('.comment-editor-submit').on('click', () => {
        const value = simplemde.value()
        if (!_.isEmpty(value)) {
            submitComment(value, $('#isso-comments').first())
            .done(() => {
                simplemde.value("")
            })
        }
    })
    $('.comment-editor-clear').on('click', () => {
        simplemde.value("");
    })
}

$(() => {
    register('vi', localeVi)
    initMardownEditor()
    loadComments()
})
