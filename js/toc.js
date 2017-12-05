(function($) {
    /**
     * 修改自: https://github.com/ekoooo/marked/blob/master/lib/marked.js#L957
     * @param toc
     * @param isClose
     * @returns {string}
     */
    function getTocHtml(toc, isClose) {
        var text,
            aHtml,
            nextToc,
            currentToc,
            currentDepth = 0;
        var out = '';
        
        var repeatStr = function(str, num) {
            return new Array(num + 1).join(str);
        };
        
        for(var i = 0, length = toc.length; i < length; i++) {
            currentToc = toc[i];
            nextToc = toc[i + 1];
            text = currentToc.text;
            
            aHtml = '<a href="#' + currentToc.id + '">' + text + '</a>';
            
            if(currentDepth < currentToc.depth) {
                out += repeatStr('<ul><li>', currentToc.depth - currentDepth) + aHtml;
            }else if(currentDepth === currentToc.depth) {
                out += '</li><li>' + aHtml;
            }else {
                out += repeatStr('</li></ul>', currentDepth - currentToc.depth) + '</li><li>' + aHtml;
            }
            
            currentDepth = currentToc.depth;
        }
    
        out += repeatStr('</li></ul>', currentDepth);
        
        return  '<div class="markdown-toc-box ' + (isClose ? '' : 'open') + '">' +
                    '<h2>' +
                        '<svg class="markdown-toc-book-ico" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"></path></svg>' +
                        ' Table of Contents' +
                    '</h2>' +
                    '<div class="markdown-toc-content">' +
                        out +
                    '</div>' +
                    '<span class="markdown-toc-toggle"></span>' +
                '</div>';
    }
    
    $.fn.toc = function() {
        $('.markdown-toc-box').unbind().remove();
        
        // 获取 h1 ~ h6
        var heads = $('article.markdown-body, .file-view.markdown').find('h1, h2, h3, h4, h5, h6');
        
        if(heads.length === 0) {
            return;
        }
        
        var toc = [];
        var index = 0;
        
        // 保存 toc 信息和插入对应的锚点
        heads.each(function () {
            toc.push({
                depth: Number(this['tagName'].toUpperCase().replace('H', '')),
                text: $(this).text(),
                id: 'markdown-anchor-' + (++index),
            });
        
            $(this).before('<span id="markdown-anchor-' + index + '"></span>');
        });
        
        // 插入页面中
        $('body').append(getTocHtml(toc, localStorage.getItem('markdown-toc-close') === '1'));
        
        // 关闭打开事件
        $('.markdown-toc-toggle').on('click', function () {
            var box = $('.markdown-toc-box');
    
            box.toggleClass('open');
            
            box.hasClass('open') ?
                localStorage.setItem('markdown-toc-close', '0') :
                localStorage.setItem('markdown-toc-close', '1');
        });
    }
})(jQuery);

var init = false;

chrome.runtime.onMessage.addListener(function(request) {
    var message = request.message;

    if(message && message.event === 'onUpdated') {
        // 因为点击 toc 定位会触发 onUpdated
        if(init && /((#markdown-anchor-)(\d)*)$/g.test(message.url)) {
            return;
        }
        $(document).toc();
        init = true;
    }
});
