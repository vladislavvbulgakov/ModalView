/* global $ */

Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}

function noop() {}

function _createModalFooter(buttons = []) {
    if(buttons.length === 0) {
        return document.createElement('div')
    }
    const wrap = document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn => {
        const $btn  = document.createElement('button')
        $btn.textContent = btn.text 
        $btn.classList.add('btn') 
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.onclick = btn.handler || noop
        
        wrap.appendChild($btn)
    })
     
    return wrap
}

function _createModal(options) {
    const modal = document.createElement('div')
    modal.classList.add('vmodal') 
    modal.insertAdjacentHTML('afterbegin', `   
            <div class="modal-overlay" data-close="true">
                <div class="modal-window" style = "width: ${options.width}">
                    <div class="modal-header">
                        <span class = "modal-title">${options.title || 'Окно'}</span>
                        ${options.closable ? `<span class = "modal-close" data-close="true">&times;</span>` : ''}
                    </div>
                    <div class="modal-body" data-content = "true">${options.content || ''}
                    </div>
                </div>
            </div>
    `)
    const footer = _createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal 
}
/*
* options
* title: string - передаём в модальное окно title и он применялся для элемента +
* closable: boolean - если true, то крестик показывается, если false, то нет +
* content: string - динамический контент в формате HTML, тобиж то наполнение, которое должно попадать в модальное окно +
* width: string ('400px') - динамическая ширина модального окна +
* destroy(): void - должен убирать из DOM дерева модальное окно, а также удалять все слушатели (полностью удалить модальное окно) +
* при нажатии на крестик модальное окно закрывается (с анимацией) +
* при нажатии на пустое пространство модальное окно должно закрываться (с анимацией) +
* setContent(html: string): void | PUBLIC +
* ------------------
* onClose(): void
* onOpen(): void
* beforeClose(): boolean | если true, то модальное окно можно закрыть, если false, то нельзя
* ------------------
* animate.css
*/


$.modal = function (options) {
    const ANIMATION_SPEED = 200;
    const $modal = _createModal(options);
    
    let isClosing = false
    let isDestroyed = false
    const modal = {
        open() {
            if(isDestroyed) {
                return console.log('Modal is destroyed')
            }
            if (!isClosing && !$modal.classList.contains('open')) {
                $modal.classList.add('open');
            }
        },
        close() {
            if (isClosing) return;

            isClosing = true;
            $modal.classList.remove('open');
            $modal.classList.add('hide');

            setTimeout(() => {
                $modal.classList.remove('hide');
                isClosing = false;
                if(typeof options.onClose === 'function') {
                    options.onClose()
                }
            }, ANIMATION_SPEED);
        },
    }
    
    const listener = event => {
        if (event.target.dataset.close){
            modal.close()
        }
    }

    $modal.addEventListener('click', listener)


    return Object.assign(modal, {
        destroy() {
            $modal.remove()
            $modal.removeEventListener('click', listener)
            isDestroyed = true
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        }
    })
};
