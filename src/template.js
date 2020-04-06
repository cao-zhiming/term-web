import { errorHandle } from './utils';

export default class Template {
    constructor(term) {
        this.term = term;
        const { container, width, height, pixelRatio, borderRadius, boxShadow, recorder } = term.options;

        this.$container = container;
        if (typeof term.options.container === 'string') {
            this.$container = document.querySelector(term.options.container);
        }

        errorHandle(
            term.constructor.instances.every((ins) => ins.template.$container !== this.$container),
            'Cannot mount multiple instances on the same dom element, please destroy the previous instance first.',
        );

        this.$container.classList.add('term-container');
        this.$container.style.width = `${width}px`;
        this.$container.style.height = `${height}px`;

        this.$canvas = document.createElement('canvas');
        this.$canvas.classList.add('term-canvas');
        this.$canvas.width = width * pixelRatio;
        this.$canvas.height = height * pixelRatio;
        this.$container.appendChild(this.$canvas);

        this.$textarea = document.createElement('textarea');
        this.$textarea.classList.add('term-textarea');
        this.$container.appendChild(this.$textarea);

        this.$main = document.createElement('div');
        this.$main.classList.add('term-main');
        this.$container.appendChild(this.$main);

        this.$scrollbar = document.createElement('div');
        this.$scrollbar.classList.add('term-scrollbar');
        this.$scrollbar.style.height = '0';
        this.$main.appendChild(this.$scrollbar);

        if (recorder) {
            this.$recorder = document.createElement('div');
            this.$recorder.classList.add('term-recorder');
            this.$recorder.innerHTML = `
                <div class="term-recorder-l">
                    <div class="term-size">0m</div>
                    <div class="term-duration">0s</div>
                </div>
                <div class="term-recorder-r">
                    <div class="term-start"></div>
                    <div class="term-end"></div> 
                </div>
            `;
            this.Size = this.$recorder.querySelector('.term-size');
            this.duration = this.$recorder.querySelector('.term-duration');
            this.start = this.$recorder.querySelector('.term-start');
            this.end = this.$recorder.querySelector('.term-end');
            this.$container.appendChild(this.$recorder);
        }

        if (!document.getElementById('term-ui-style')) {
            this.$style = document.createElement('style');
            this.$style.id = 'term-ui-style';
            this.$style.textContent = [
                '.term-container{position:relative;}',
                '.term-container ::-webkit-scrollbar{width:5px;}',
                '.term-container ::-webkit-scrollbar-thumb{background-color:#666;border-radius:5px;}',
                '.term-container ::-webkit-scrollbar-thumb:hover{background-color:#ccc;}',
                `.term-canvas{width:100%;height:100%;border-radius:${borderRadius}px;box-shadow:${boxShadow};}`,
                '.term-textarea{position:absolute;width:20px;height:20px;opacity:0;pointer-events:none;user-select:none;}',
                '.term-main{position:absolute;width:100%;right:0;left:0; overflow: auto;}',
                '.term-main:hover{cursor:text}',
                '.term-recorder{position:absolute;right:0;top:0;}',
            ].join('');
            document.head.appendChild(this.$style);
        }
    }

    destroy() {
        this.$container.innerHTML = '';
        if (!this.term.constructor.instances.length) {
            document.head.removeChild(this.$style);
        }
    }
}
