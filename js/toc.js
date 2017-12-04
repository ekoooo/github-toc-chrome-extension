(function($) {
    /**
     * 修改自: https://github.com/ekoooo/marked/blob/master/lib/marked.js#L957
     * @param toc
     * @returns {string}
     */
    function getTocHtml(toc, isClose) {
        let text,
            aHtml,
            nextToc,
            currentToc,
            currentDepth = 0;
        let out = '';
        
        let repeatStr = function(str, num) {
            return new Array(num + 1).join(str);
        };
        
        for(let i = 0, length = toc.length; i < length; i++) {
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
                    '<div class="markdown-toc-content">' +
                        '<h2>Table of Contents</h2>' + out +
                    '</div>' +
                    '<span class="markdown-toc-toggle"></span>' +
                '</div>';
    }
    
    $.fn.toc = function() {
        // 获取 h1 ~ h6
        let heads = $('article.markdown-body').find('h1, h2, h3, h4, h5, h6');

        let toc = [];
        let index = 0;
    
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
        if(toc.length) {
            $('body').append(getTocHtml(toc, localStorage.getItem('markdown-toc-close') === '1'));
        }
        
        // 关闭打开事件
        $('.markdown-toc-toggle').on('click', function () {
            let box = $('.markdown-toc-box');
            let toggle = $('.markdown-toc-toggle');
    
            box.toggleClass('open');
            
            box.hasClass('open') ?
                localStorage.setItem('markdown-toc-close', '0') :
                localStorage.setItem('markdown-toc-close', '1');
        });
    };
})(jQuery);

$(document).toc();