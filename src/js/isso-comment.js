import 'simplemde/dist/simplemde.min.css'
import $ from 'jquery'
import SimpleMDE from 'simplemde'
import localeVi from 'timeago.js/lib/lang/vi'
import {format, register} from 'timeago.js'
import _ from 'lodash'

const host = 'https://comment.tenolife.com'
const authority = 'comment.tenolife.com'
const postContext = window.postContext
let simplemde = null

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
        contentType: 'application/json',
        dataType: 'json',
        authority
    })
}

const renderComment = (element, item) => {
    const placeHolder = $('<div class="comment-placeholder"></div>')
    const avatar = $('<div class="comment-avatar"></div>')
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

    placeHolder.append(stack)
    
    element.append(placeHolder)
}

const renderBlockComments = (element, items, parentMap) => {
    if (_.isEmpty(items)) {
        return
    }

    const ul = $('<ul class="comment-block"></ul>')
    _.forEach(items, item => {
        const itemId = _.get(item, 'id')
        const li = $('<li class="comment-item"></li>')
        renderComment(li, item)
        
        // find all children of this comment and render it
        const children = _.get(parentMap, itemId)
        renderBlockComments(li, children, parentMap)

        ul.prepend(li)
    })
    element.prepend(ul)
} 

const renderComments = comments => {
    if (_.isEmpty(comments)) {
        $('#isso-comments').append('<h3>No comments</h3>')
        return
    }

    const groupedComments = _.groupBy(comments, 'parent')
    const rootComments = _.get(groupedComments, 'null')
    renderBlockComments($('#isso-comments').first(),rootComments, groupedComments)
}

const loadComments = () => {
    $.ajax(host + '/?uri=' + encodeURIComponent(postContext.url) + '&nested_limit=5')
    .done(data => {
        const all = _.groupBy(_.get(data, 'replies'), 'website')
        renderComments(_.get(all, 'null'))
        renderVotes(_.get(all, 'tenolife'))
    }).fail(() => {
        renderComments([])
        renderVotes([])
    })
}

const submitComment = text => {
    const payload = {
        author: _.get(postContext, 'member.name'),
        email: _.get(postContext, 'member.email'),
        title: _.get(postContext, 'title'),
        parent: null,
        mode: 1,
        text
    }
    return $.ajax({
        type: 'POST',
        url: host + '/new?uri=' + encodeURIComponent(postContext.url),
        data: JSON.stringify(payload),
        contentType: 'application/json',
        dataType: 'json',
        authority
    }).done(item => renderBlockComments($('#isso-comments').first(), [item], {}))
}

const initMardownEditor = () => {
    simplemde = new SimpleMDE({
        element: $('.comment-editor').get(0),
        status: false
    })
    $('.comment-editor-submit').on('click', () => {
        const value = simplemde.value()
        if (!_.isEmpty(value)) {
            submitComment(value)
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
