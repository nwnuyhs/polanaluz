(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(s){if(s.ep)return;s.ep=!0;const n=i(s);fetch(s.href,n)}})();/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.20.0
 * @author George Michael Brower
 * @license MIT
 */class B{constructor(t,i,o,s,n="div"){this.parent=t,this.object=i,this.property=o,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(n),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),B.nextNameID=B.nextNameID||0,this.$name.id=`lil-gui-name-${++B.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",a=>a.stopPropagation()),this.domElement.addEventListener("keyup",a=>a.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(o)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const i=this.parent.add(this.object,this.property,t);return i.name(this._name),this.destroy(),i}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class de extends B{constructor(t,i,o){super(t,i,o,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Tt(e){let t,i;return(t=e.match(/(#|0x)?([a-f0-9]{6})/i))?i=t[2]:(t=e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?i=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(i=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),i?"#"+i:!1}const fe={isPrimitive:!0,match:e=>typeof e=="string",fromHexString:Tt,toHexString:Tt},ht={isPrimitive:!0,match:e=>typeof e=="number",fromHexString:e=>parseInt(e.substring(1),16),toHexString:e=>"#"+e.toString(16).padStart(6,0)},me={isPrimitive:!1,match:e=>Array.isArray(e),fromHexString(e,t,i=1){const o=ht.fromHexString(e);t[0]=(o>>16&255)/255*i,t[1]=(o>>8&255)/255*i,t[2]=(o&255)/255*i},toHexString([e,t,i],o=1){o=255/o;const s=e*o<<16^t*o<<8^i*o<<0;return ht.toHexString(s)}},pe={isPrimitive:!1,match:e=>Object(e)===e,fromHexString(e,t,i=1){const o=ht.fromHexString(e);t.r=(o>>16&255)/255*i,t.g=(o>>8&255)/255*i,t.b=(o&255)/255*i},toHexString({r:e,g:t,b:i},o=1){o=255/o;const s=e*o<<16^t*o<<8^i*o<<0;return ht.toHexString(s)}},ge=[fe,ht,me,pe];function ve(e){return ge.find(t=>t.match(e))}class be extends B{constructor(t,i,o,s){super(t,i,o,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ve(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const n=Tt(this.$text.value);n&&this._setValueFromHexString(n)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const i=this._format.fromHexString(t);this.setValue(i)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class kt extends B{constructor(t,i,o){super(t,i,o,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class we extends B{constructor(t,i,o,s,n,a){super(t,i,o,"number"),this._initInput(),this.min(s),this.max(n);const c=a!==void 0;this.step(c?a:this._getImplicitStep(),c),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,i=!0){return this._step=t,this._stepExplicit=i,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let i=(t-this._min)/(this._max-this._min);i=Math.max(0,Math.min(i,1)),this.$fill.style.width=i*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const i=()=>{let p=parseFloat(this.$input.value);isNaN(p)||(this._stepExplicit&&(p=this._snap(p)),this.setValue(this._clamp(p)))},o=p=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+p),this.$input.value=this.getValue())},s=p=>{p.key==="Enter"&&this.$input.blur(),p.code==="ArrowUp"&&(p.preventDefault(),o(this._step*this._arrowKeyMultiplier(p))),p.code==="ArrowDown"&&(p.preventDefault(),o(this._step*this._arrowKeyMultiplier(p)*-1))},n=p=>{this._inputFocused&&(p.preventDefault(),o(this._step*this._normalizeMouseWheel(p)))};let a=!1,c,u,h,d,l;const g=5,m=p=>{c=p.clientX,u=h=p.clientY,a=!0,d=this.getValue(),l=0,window.addEventListener("mousemove",b),window.addEventListener("mouseup",v)},b=p=>{if(a){const _=p.clientX-c,W=p.clientY-u;Math.abs(W)>g?(p.preventDefault(),this.$input.blur(),a=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>g&&v()}if(!a){const _=p.clientY-h;l-=_*this._step*this._arrowKeyMultiplier(p),d+l>this._max?l=this._max-d:d+l<this._min&&(l=this._min-d),this._snapClampSetValue(d+l)}h=p.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",b),window.removeEventListener("mouseup",v)},S=()=>{this._inputFocused=!0},f=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",i),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",n,{passive:!1}),this.$input.addEventListener("mousedown",m),this.$input.addEventListener("focus",S),this.$input.addEventListener("blur",f)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(f,p,_,W,M)=>(f-p)/(_-p)*(M-W)+W,i=f=>{const p=this.$slider.getBoundingClientRect();let _=t(f,p.left,p.right,this._min,this._max);this._snapClampSetValue(_)},o=f=>{this._setDraggingStyle(!0),i(f.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",n)},s=f=>{i(f.clientX)},n=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",n)};let a=!1,c,u;const h=f=>{f.preventDefault(),this._setDraggingStyle(!0),i(f.touches[0].clientX),a=!1},d=f=>{f.touches.length>1||(this._hasScrollBar?(c=f.touches[0].clientX,u=f.touches[0].clientY,a=!0):h(f),window.addEventListener("touchmove",l,{passive:!1}),window.addEventListener("touchend",g))},l=f=>{if(a){const p=f.touches[0].clientX-c,_=f.touches[0].clientY-u;Math.abs(p)>Math.abs(_)?h(f):(window.removeEventListener("touchmove",l),window.removeEventListener("touchend",g))}else f.preventDefault(),i(f.touches[0].clientX)},g=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",l),window.removeEventListener("touchend",g)},m=this._callOnFinishChange.bind(this),b=400;let v;const S=f=>{if(Math.abs(f.deltaX)<Math.abs(f.deltaY)&&this._hasScrollBar)return;f.preventDefault();const _=this._normalizeMouseWheel(f)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(m,b)};this.$slider.addEventListener("mousedown",o),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",S,{passive:!1})}_setDraggingStyle(t,i="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${i}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:i,deltaY:o}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(i=0,o=-t.wheelDelta/120,o*=this._stepExplicit?1:10),i+-o}_arrowKeyMultiplier(t){let i=this._stepExplicit?1:10;return t.shiftKey?i*=10:t.altKey&&(i/=10),i}_snap(t){let i=0;return this._hasMin?i=this._min:this._hasMax&&(i=this._max),t-=i,t=Math.round(t/this._step)*this._step,t+=i,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class ye extends B{constructor(t,i,o,s){super(t,i,o,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(i=>{const o=document.createElement("option");o.textContent=i,this.$select.appendChild(o)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),i=this._values.indexOf(t);return this.$select.selectedIndex=i,this.$display.textContent=i===-1?t:this._names[i],this}}class Ae extends B{constructor(t,i,o){super(t,i,o,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var xe=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function Se(e){const t=document.createElement("style");t.innerHTML=e;const i=document.querySelector("head link[rel=stylesheet], head style");i?document.head.insertBefore(t,i):document.head.appendChild(t)}let Gt=!1;class zt{constructor({parent:t,autoPlace:i=t===void 0,container:o,width:s,title:n="Controls",closeFolders:a=!1,injectStyles:c=!0,touchStyles:u=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(n),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),u&&this.domElement.classList.add("allow-touch-styles"),!Gt&&c&&(Se(xe),Gt=!0),o?o.appendChild(this.domElement):i&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=a}add(t,i,o,s,n){if(Object(o)===o)return new ye(this,t,i,o);const a=t[i];switch(typeof a){case"number":return new we(this,t,i,o,s,n);case"boolean":return new de(this,t,i);case"string":return new Ae(this,t,i);case"function":return new kt(this,t,i)}console.error(`gui.add failed
	property:`,i,`
	object:`,t,`
	value:`,a)}addColor(t,i,o=1){return new be(this,t,i,o)}addFolder(t){const i=new zt({parent:this,title:t});return this.root._closeFolders&&i.close(),i}load(t,i=!0){return t.controllers&&this.controllers.forEach(o=>{o instanceof kt||o._name in t.controllers&&o.load(t.controllers[o._name])}),i&&t.folders&&this.folders.forEach(o=>{o._title in t.folders&&o.load(t.folders[o._title])}),this}save(t=!0){const i={controllers:{},folders:{}};return this.controllers.forEach(o=>{if(!(o instanceof kt)){if(o._name in i.controllers)throw new Error(`Cannot save GUI with duplicate property "${o._name}"`);i.controllers[o._name]=o.save()}}),t&&this.folders.forEach(o=>{if(o._title in i.folders)throw new Error(`Cannot save GUI with duplicate folder "${o._title}"`);i.folders[o._title]=o.save()}),i}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const i=this.$children.clientHeight;this.$children.style.height=i+"px",this.domElement.classList.add("transition");const o=n=>{n.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",o))};this.$children.addEventListener("transitionend",o);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(o=>o.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(i=>{t=t.concat(i.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(i=>{t=t.concat(i.foldersRecursive())}),t}}function Ee(e){let t=e>>>0||2654435769;return()=>{t=t+1831565813>>>0;let i=t;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function Lt(e){let t=e.trim().replace(/^#/,"");t.length===3&&(t=t.split("").map(o=>o+o).join(""));const i=parseInt(t.slice(0,6),16);return Number.isNaN(i)?[0,0,0]:[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255]}function q([e,t,i]){const o=s=>Math.round(x(s,0,1)*255).toString(16).padStart(2,"0");return`#${o(e)}${o(t)}${o(i)}`}const x=(e,t,i)=>Math.min(i,Math.max(t,e)),V=e=>e*Math.PI/180,Vt=e=>e.map(t=>t<=.04045?t/12.92:((t+.055)/1.055)**2.4);function _e(e){const t=x(e,1e3,4e4)/100;let i,o,s;return t<=66?(i=255,o=99.4708025861*Math.log(t)-161.1195681661,s=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307):(i=329.698727446*(t-60)**-.1332047592,o=288.1221695283*(t-60)**-.0755148492,s=255),[x(i,0,255)/255,x(o,0,255)/255,x(s,0,255)/255]}function Ht(e,t=0){const i=a=>{const c=Math.sin(a*127.1+t*311.7)*43758.5453;return c-Math.floor(c)},o=Math.floor(e),s=e-o,n=s*s*(3-2*s);return i(o)*(1-n)+i(o+1)*n}function Xt(e,t){const i=e.reduce((s,n)=>s+Math.max(0,n),0);if(i<=0)return 0;let o=t*i;for(let s=0;s<e.length;s++)if(o-=Math.max(0,e[s]),o<0)return s;return e.length-1}function $(e,t){if(t==null)return e;if(e===void 0)return t;if(Array.isArray(e)){if(!Array.isArray(t))return e;const i=e[e.length-1];return t.map((o,s)=>$(s<e.length?e[s]:i,o))}if(typeof e=="object"&&e!==null){if(typeof t!="object")return e;const i={...e};for(const[o,s]of Object.entries(t))i[o]=o in i?$(i[o],s):s;return i}return typeof t==typeof e?t:e}const O=e=>JSON.parse(JSON.stringify(e)),Rt={colors:["#e5262b","#f5c445","#2dc68b","#35b6e0","#2f5bd6","#d45bb0","#f08a2c"],weights:[3,3,3,1,.6,.4,1],white:.16,saturation:1.1},te={colors:["#7b5cff","#c04bd9","#ff6aa2","#ffb357","#5aa9ff"],weights:[3,2,2.5,2,1],white:.2,saturation:1},ee={colors:["#5b3df5","#b136e0","#ff3f86","#ff9f1c","#1fa8ff","#7a5cff"],weights:[3,2.5,2.5,1.6,1.4,2],white:.06,saturation:1.1},Pt=[{id:"polana",name:"Polana 原色",palette:Rt},{id:"polana-cool",name:"Polana 冷色（三角窗）",palette:{colors:["#35b6e0","#2f5bd6","#d45bb0","#9b6be0","#2dc68b","#f5c445"],weights:[3,2,3,1.5,1.5,1],white:.12,saturation:1.05}},{id:"ember",name:"暖阳（红橙黄）",palette:{colors:["#e5262b","#f08a2c","#f5c445","#ffdf8a"],weights:[3,3,3,1],white:.15,saturation:1.1}},{id:"aiknow",name:"aiknow 紫粉琥珀",palette:te},{id:"aiknow-vivid",name:"aiknow 浓彩（彩窗用）",palette:ee},{id:"microsoft",name:"微软蓝",palette:{colors:["#1e90ff","#36b4ff","#0f6fe0","#5cd0ff"],weights:[3,2,2,1.5],white:.08,saturation:1}},{id:"aiknow-blue",name:"aiknow 蓝紫",palette:{colors:["#2f54eb","#7b5cff","#c04bd9","#ff6aa2","#35b6e0"],weights:[3,3,2,1.5,1.5],white:.12,saturation:1}},{id:"huntnow",name:"Hunt Now 橙粉",palette:{colors:["#ff5a1f","#ff9a5a","#e8467c","#f5c445"],weights:[3,2,2.5,1.5],white:.12,saturation:1}}];function X(e={}){return{enabled:!0,mount:"free",kind:"slits",shape:"rect",x:.5,y:.5,distance:9,width:1.4,height:2.6,facing:0,slope:15,count:2,segments:7,fill:.55,frame:0,pieces:0,spread:0,gain:1,seed:0,...e}}const $t={theme:"dark",seed:21,sun:{azimuth:140,elevation:20,intensity:1.6,temperature:5600,softness:.7},windows:[X({x:.36,y:.5,count:4,fill:.42,width:2.6,height:2.6,segments:3,distance:8,slope:10,seed:1}),X({x:.74,y:.66,count:2,fill:.5,width:1.3,height:2.2,segments:3,distance:8,slope:10,seed:2,gain:.8})],palette:O(te),camera:{tilt:0,yaw:0,zoom:1},surface:{background:"#111214",texture:"stone",textureScale:.35,textureStrength:.35},look:{opacity:1,exposure:1.4,glow:.25,caustics:.45,shade:.05,fade:.1,vignette:.3,grain:.04},focus:{lift:.22,shadow:.85,rim:1.1,rimWidth:8,inside:.12},scene:{mode:"floor",wallDistance:6,sideWall:0,roomColor:"#2b2e6b",ambient:.35,haze:.5,windowGlow:1.2,bottomFade:0,panel:0,gloss:0,floor:!0,dust:0},motion:{mode:"drift",speed:1,amount:1,clouds:.25}},ke={theme:"light",surface:{background:"#f6f6f3",texture:"paper",textureScale:.6,textureStrength:.35},look:{exposure:1.1,glow:.2,shade:.06,vignette:.03,grain:.03}};function G(e,t,i,o,s={}){const n=$(O($t),o),a=$($(O(n),ke),s);return{id:e,name:t,desc:i,dark:n,light:a}}const Ce={seed:5,palette:O(ee),camera:{tilt:72,yaw:0,zoom:1},surface:{background:"#111214",texture:"none"},look:{exposure:1.2,glow:.2,vignette:.2,caustics:.3,grain:0},scene:{mode:"room",wallDistance:5,sideWall:0,roomColor:"#262a5c",ambient:.35,haze:.8,windowGlow:.9,bottomFade:.15,panel:1.8,gloss:.35,dust:.6},motion:{amount:.6}},Me={surface:{background:"#f6f6f3",texture:"none"},look:{exposure:1.05,vignette:.04,grain:0},sun:{intensity:2.6},palette:{saturation:1.35},scene:{roomColor:"#bdb5ec",ambient:.85,haze:1.1,windowGlow:1,bottomFade:.18,gloss:.25}},tt=e=>$(O(Ce),e),et=(e={})=>$(O(Me),e),J=e=>X({mount:"wall",kind:"panes",shape:"rect",width:1.7,height:2.3,count:2,segments:2,frame:.35,pieces:3,slope:0,...e}),st=[G("stained-rays-rl","彩窗 · 光芒（右 → 左）","Win10 式：右侧墙一扇彩色玻璃窗，光束呈扇形向左横扫整个画面，不落地，中心对准搜索框",tt({sun:{azimuth:15,elevation:3,intensity:1.6,temperature:5600,softness:.4},camera:{tilt:82,yaw:16,zoom:1},scene:{sideWall:4.5,floor:!1,haze:.42},windows:[J({mount:"side",x:.88,y:.46,width:2.2,height:2.2,spread:24,seed:1})]}),et({scene:{haze:1.4}})),G("stained-rays-lr","彩窗 · 光芒（左 → 右）","左侧墙一扇彩色玻璃窗，光束向右发散，横穿搜索框，地面落下彩色窗格",tt({sun:{azimuth:165,elevation:3,intensity:1.6,temperature:5600,softness:.4},camera:{tilt:82,yaw:-16,zoom:1},scene:{sideWall:-4.5,floor:!0,haze:.5},windows:[J({mount:"side",x:.14,y:.5,width:2.2,height:2.2,spread:24,seed:1})]}),et({scene:{haze:1.4}})),G("stained-pair","彩窗 · 双窗汇光","标题两侧各一扇彩色玻璃窗，两束光柱汇向搜索框，地面落下彩色窗格",tt({sun:{azimuth:90,elevation:24,intensity:1.6,temperature:5600,softness:.4},windows:[J({x:.12,y:.17,facing:40,seed:1}),J({x:.88,y:.17,facing:-40,seed:2})]}),et()),G("stained-side","彩窗 · 侧窗光柱","Win10 式：右侧墙上一扇彩色玻璃窗，带窗缝的光柱横穿房间，落在搜索框上",tt({sun:{azimuth:25,elevation:18,intensity:1.6,temperature:5600,softness:.4},camera:{tilt:78,yaw:18,zoom:1},scene:{sideWall:4.5},windows:[J({mount:"side",x:.84,y:.4,width:2.4,height:2.2,seed:1})]}),et()),G("stained-floor","彩窗 · 地面窗影","Win11 式：后墙左上一扇彩色玻璃窗，光柱落在搜索框左侧的地面，投出彩色窗格",tt({sun:{azimuth:122,elevation:22,intensity:1.6,temperature:5600,softness:.4},camera:{tilt:74,yaw:0,zoom:1},windows:[J({x:.1,y:.2,width:1.9,height:2,pieces:2,seed:3})]}),et()),G("microsoft-classic","微软蓝 · 经典","致敬 Windows 壁纸：纯净的 2×2 窗格、蓝色调，不加彩色碎片",tt({palette:{colors:["#1e90ff","#36b4ff","#0f6fe0","#5cd0ff"],weights:[3,2,2,1.5],white:.08,saturation:1},sun:{azimuth:25,elevation:18,intensity:1.6,temperature:6500,softness:.4},camera:{tilt:78,yaw:18,zoom:1},scene:{sideWall:4.5,roomColor:"#0b2a7a"},windows:[J({mount:"side",x:.84,y:.4,width:2.4,height:2.2,pieces:0,seed:1})]}),et({scene:{roomColor:"#9cc4ff"}})),G("beams","光束（地面）","几道细光束从左上方斜射，掠过搜索框，边缘彩光、身后落影",{}),G("polana-beams","Polana 光带（教堂地面）","参考：教堂地面上的长光带，红黄绿分节，斜看地面",{seed:7,sun:{azimuth:70,elevation:26,intensity:1.7,temperature:5400,softness:.9},windows:[X({x:.38,y:.72,count:2,width:2.2,height:3.2,segments:7,fill:.72,seed:1}),X({x:.8,y:.45,count:1,width:.7,height:2.6,segments:6,fill:.8,seed:2,gain:.9})],palette:O(Rt),camera:{tilt:36},surface:{background:"#221e1a",texture:"mosaic",textureScale:.05,textureStrength:.4},look:{exposure:1.5}}),G("polana-grid","Polana 格窗（教堂地面）","参考：底部三角窗投下成片的平行四边形彩色光斑",{seed:11,sun:{azimuth:118,elevation:32,intensity:1.7,softness:.7},windows:[X({kind:"grid",shape:"rect",x:.32,y:.6,count:4,segments:5,width:3.8,height:3.6,facing:-25,slope:0,frame:.5,distance:8,seed:3}),X({kind:"grid",shape:"triangle",x:.8,y:.38,count:4,segments:5,width:3,height:3.2,facing:-25,slope:0,frame:.5,distance:8,seed:4,gain:.85})],palette:{...O(Rt),weights:[4,1.5,4,1.5,.6,.6,.8],white:.1},camera:{tilt:36},surface:{background:"#221e1a",texture:"mosaic",textureScale:.05,textureStrength:.4},look:{exposure:1.3}})],ie=e=>st.find(t=>t.id===e),Fe={polana:"Polana original","polana-cool":"Polana cool (triangle windows)",ember:"Warm sun (red, orange, yellow)",aiknow:"aiknow violet, pink, amber","aiknow-vivid":"aiknow vivid (for stained windows)",microsoft:"Microsoft blue","aiknow-blue":"aiknow blue-violet",huntnow:"Hunt Now orange-pink"};Pt.forEach(e=>e.nameEn=Fe[e.id]??e.name);const Te={"stained-rays-rl":["Stained rays (right → left)","Windows 10 style: a stained-glass window on the right wall; beams fan out to the left across the whole page, centered on the search box"],"stained-rays-lr":["Stained rays (left → right)","A stained-glass window on the left wall; beams spread to the right across the search box and paint colored panes on the floor"],"stained-pair":["Twin windows","Two stained-glass windows beside the headline; both beams converge on the search box"],"stained-side":["Side window","Windows 10 style: a side-wall window; crisp beams with pane gaps cross the room and land on the search box"],"stained-floor":["Floor shadows","Windows 11 style: a back-wall window; light falls on the floor left of the search box"],"microsoft-classic":["Microsoft blue","A tribute to the Windows wallpaper: clean 2×2 panes in blue, no stained pieces"],beams:["Light beams (floor)","Thin beams slant in from the top left and sweep past the search box"],"polana-beams":["Polana beams (church floor)","Reference: long segmented beams of red, yellow and green on the church floor"],"polana-grid":["Polana grid (church floor)","Reference: parallelogram patches from the triangular windows"]};st.forEach(e=>{const t=Te[e.id];e.nameEn=(t==null?void 0:t[0])??e.name,e.descEn=(t==null?void 0:t[1])??e.desc});const E=512,y=4,qt=[1,.96,.86];function Le([e,t,i],o){const s=.2126*e+.7152*t+.0722*i;return[e,t,i].map(n=>x(s+(n-s)*o,0,1))}const Dt=(e,t)=>e.map(i=>x(i*t,0,1)),Ot=(e,t)=>e.map(i=>x(i+(1-i)*t,0,1));function Re(e,t){const i=e.colors.map(n=>Le(Lt(n),e.saturation)),o=e.colors.map((n,a)=>e.weights[a]??1);let s=-2;return()=>{if(t()<e.white&&s!==-1)return s=-1,qt;let n=Xt(o,t());for(let a=0;a<4&&n===s&&i.length>1;a++)n=Xt(o,t());return s=n,i[n]??qt}}function oe(e,t,i,o){const s=t.map(M=>M[0]),n=t.map(M=>M[1]),a=Math.min(...s),c=Math.max(...s),u=Math.min(...n),h=Math.max(...n),d=c-a,l=h-u;e.save(),e.beginPath(),t.forEach(([M,z],U)=>U?e.lineTo(M,z):e.moveTo(M,z)),e.closePath(),e.clip();const g=o()*Math.PI*2,m=(a+c)/2,b=(u+h)/2,v=Math.hypot(d,l)/2,S=e.createLinearGradient(m-Math.cos(g)*v,b-Math.sin(g)*v,m+Math.cos(g)*v,b+Math.sin(g)*v);S.addColorStop(0,q(Ot(i,.12+o()*.12))),S.addColorStop(.5+(o()-.5)*.4,q(i)),S.addColorStop(1,q(Dt(i,.72+o()*.15))),e.fillStyle=S,e.fillRect(a,u,d,l);const f=2+Math.floor(o()*3);for(let M=0;M<f;M++){const z=a+o()*d,U=u+o()*l,nt=Math.max(d,l)*(.2+o()*.45),I=e.createRadialGradient(z,U,0,z,U,nt),mt=o()<.6,at=.1+o()*.16;I.addColorStop(0,mt?`rgba(255,250,235,${at})`:`rgba(0,0,0,${at})`),I.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=I,e.fillRect(a,u,d,l)}const p=l>=d,_=3+Math.floor(o()*4);for(let M=0;M<_;M++){e.globalAlpha=.03+o()*.05,e.fillStyle=o()<.55?"#fffaf0":"#000";const z=.6+o()*1.6;p?e.fillRect(a+o()*d,u,z,l):e.fillRect(a,u+o()*l,d,z)}const W=Math.floor(o()*2);for(let M=0;M<W;M++)e.globalAlpha=.25+o()*.3,e.fillStyle="#fffaf0",e.beginPath(),e.arc(a+o()*d,u+o()*l,.8+o()*1.6,0,Math.PI*2),e.fill();e.restore()}function Pe(){const e=document.createElement("canvas");e.width=e.height=E;const t=e.getContext("2d");return t.fillStyle="#000",t.fillRect(0,0,E,E),[e,t]}function $e(e,t,i,o){const s=E-y*2,n=Math.max(1,Math.round(t.count)),a=s/n,c=Math.max(2,a*x(t.fill,.05,1)),u=x(t.frame,0,1)*10,h=Math.max(1,Math.round(t.segments));for(let d=0;d<n;d++){const l=y+a*d+(a-c)/2,g=Array.from({length:h},()=>.45+o()*1.1),m=g.reduce((f,p)=>f+p,0),b=[y],v=[y];let S=0;for(let f=0;f<h-1;f++){S+=g[f]/m*s;const p=(o()-.5)*Math.min(c*.5,s/h*.35);b.push(y+S-p),v.push(y+S+p)}b.push(E-y),v.push(E-y);for(let f=0;f<h;f++)oe(e,[[l,b[f]],[l+c,v[f]],[l+c,v[f+1]],[l,b[f+1]]],i(),o);if(u>0){e.strokeStyle="#000",e.lineWidth=u;for(let f=1;f<h;f++)e.beginPath(),e.moveTo(l,b[f]),e.lineTo(l+c,v[f]),e.stroke()}}}function We(e,t,i,o){const s=E-y*2,n=Math.max(1,Math.round(t.count)),a=Math.max(1,Math.round(t.segments)),c=s/n,u=s/a;if(e.save(),t.shape==="triangle")e.beginPath(),e.moveTo(E/2,y),e.lineTo(E-y,E-y),e.lineTo(y,E-y),e.closePath(),e.clip();else if(t.shape==="arch"){const d=s/2,l=Math.min(s*.35,s/2);e.beginPath(),e.moveTo(y,E-y),e.lineTo(y,y+l),e.ellipse(E/2,y+l,d,l,0,Math.PI,0),e.lineTo(E-y,E-y),e.closePath(),e.clip()}for(let d=0;d<a;d++)for(let l=0;l<n;l++){const g=y+l*c,m=y+d*u;oe(e,[[g,m],[g+c,m],[g+c,m+u],[g,m+u]],i(),o)}const h=Math.max(0,x(t.frame,0,1)*14);if(h>0){e.fillStyle="#000";for(let d=0;d<=n;d++)e.fillRect(y+d*c-h/2,0,h,E);for(let d=0;d<=a;d++)e.fillRect(0,y+d*u-h/2,E,h)}e.restore()}const se=24,ze=e=>x(e,0,1)*se*2/E;function De(e,t,i,o,s,n,a){e.save(),e.beginPath(),e.rect(t,i,o,s),e.clip();const c=e.createLinearGradient(t+o,i,t,i+s);c.addColorStop(0,q(Ot(n,.22))),c.addColorStop(.55,q(n)),c.addColorStop(1,q(Dt(n,.8))),e.fillStyle=c,e.fillRect(t,i,o,s);const u=t+o*(.25+a()*.3),h=e.createLinearGradient(u-o*.25,i,u+o*.25,i+s*.4);h.addColorStop(0,"rgba(255,255,255,0)"),h.addColorStop(.5,"rgba(255,255,255,0.13)"),h.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=h,e.fillRect(t,i,o,s),e.fillStyle="rgba(255,255,255,0.28)",e.fillRect(t,i,o,2),e.fillRect(t+o-2,i,2,s),e.restore()}function Oe(e,t,i,o){const s=t.map(v=>v[0]),n=t.map(v=>v[1]),a=Math.min(...s),c=Math.max(...s),u=Math.min(...n),h=Math.max(...n);e.save(),e.beginPath(),t.forEach(([v,S],f)=>f?e.lineTo(v,S):e.moveTo(v,S)),e.closePath(),e.clip();const d=-Math.PI/4+(o()-.5)*.6,l=(a+c)/2,g=(u+h)/2,m=Math.hypot(c-a,h-u)/2,b=e.createLinearGradient(l-Math.cos(d)*m,g+Math.sin(d)*m,l+Math.cos(d)*m,g-Math.sin(d)*m);b.addColorStop(0,q(Dt(i,.82))),b.addColorStop(1,q(Ot(i,.14))),e.fillStyle=b,e.fillRect(a,u,c-a,h-u),e.restore()}function Be(e,t,i,o,s,n,a,c){const u=n,h=Math.max(1,Math.round(n*s/o)),d=o/u*.28,l=s/h*.28,g=[];for(let b=0;b<=h;b++){g.push([]);for(let v=0;v<=u;v++){const S=v===0||v===u,f=b===0||b===h;g[b].push([t+v/u*o+(S?0:(c()-.5)*2*d),i+b/h*s+(f?0:(c()-.5)*2*l)])}}for(let b=0;b<h;b++)for(let v=0;v<u;v++){const S=[g[b][v],g[b][v+1],g[b+1][v+1],g[b+1][v]];Oe(e,S,a(),c),e.strokeStyle="rgba(0,0,0,0.85)",e.lineWidth=2.2,e.beginPath(),S.forEach(([f,p],_)=>_?e.lineTo(f,p):e.moveTo(f,p)),e.closePath(),e.stroke()}e.save(),e.beginPath(),e.rect(t,i,o,s),e.clip();const m=e.createLinearGradient(t,i,t+o,i+s);m.addColorStop(.3,"rgba(255,255,255,0)"),m.addColorStop(.45,"rgba(255,255,255,0.1)"),m.addColorStop(.6,"rgba(255,255,255,0)"),e.fillStyle=m,e.fillRect(t,i,o,s),e.fillStyle="rgba(255,255,255,0.25)",e.fillRect(t,i,o,2),e.fillRect(t+o-2,i,2,s),e.restore()}function Ne(e,t,i,o){const s=E-y*2,n=x(Math.round(t.count),1,4),a=x(Math.round(t.segments),1,4),c=s/n,u=s/a,h=x(t.frame,0,1)*se,d=Math.round(x(t.pieces??0,0,8));for(let l=0;l<a;l++)for(let g=0;g<n;g++){const m=y+g*c+h/2,b=y+l*u+h/2;d>0?Be(e,m,b,c-h,u-h,d,i,o):De(e,m,b,c-h,u-h,i(),o)}}function Ie(e,t,i){const[o,s]=Pe(),n=Ee(i*7919+e.seed*104729+17),a=Re(t,n);return e.kind==="panes"?Ne(s,e,a,n):e.kind==="grid"?We(s,e,a,n):$e(s,e,a,n),o}const R=4,Ge=24,Ve=`#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
vec2 p = P[gl_VertexID];
vUv = p * 0.5 + 0.5;
gl_Position = vec4(p, 0.0, 1.0);
}`,He=`#version 300 es
precision highp float;
precision highp sampler2DArray;
#define MAX_W ${R}
#define TAPS ${Ge}
#define PATTERN_SIZE 512.0
in vec2 vUv;
out vec4 outColor;
uniform sampler2DArray uPattern;
uniform float uAspect;
uniform vec3 uCamPos;
uniform vec3 uCamF;
uniform vec3 uCamR;
uniform vec3 uCamU;
uniform float uCamK;
uniform vec3 uL;
uniform vec3 uSunColor;
uniform float uSoft;
uniform int uCount;
uniform vec3 uWC[MAX_W];
uniform vec3 uWU[MAX_W];
uniform vec3 uWV[MAX_W];
uniform vec3 uWN[MAX_W];
uniform vec2 uWHalf[MAX_W];
uniform float uWGain[MAX_W];
uniform int uWMount[MAX_W];
uniform vec3 uWL[MAX_W];
uniform vec4 uWGrid[MAX_W];
#define PANES_BORDER 0.015625
uniform vec4 uWSrc[MAX_W];
uniform vec3 uBg;
uniform int uTexture;
uniform float uTexScale;
uniform float uTexStrength;
uniform int uTheme;
uniform float uOpacity;
uniform float uExposure;
uniform float uGlow;
uniform float uCaustics;
uniform float uSeed;
uniform float uShade;
uniform float uFade;
uniform float uVignette;
uniform float uGrain;
uniform float uTime;
uniform int uFocusOn;
uniform vec2 uFocusC;
uniform vec2 uFocusHalf;
uniform float uFocusR;
uniform float uFocusLift;
uniform float uFocusShadow;
uniform float uFocusRim;
uniform float uFocusRimW;
uniform float uFocusInside;
uniform vec4 uFocusS;
uniform vec2 uFocusSR;
uniform int uRoom;
uniform float uWallY;
uniform float uSideX;
uniform vec3 uRoomColor;
uniform float uAmbient;
uniform float uHaze;
uniform float uWinGlow;
uniform float uBottomFade;
uniform float uPanel;
uniform float uGloss;
uniform int uFloor;
uniform float uDust;
float hash21(vec2 p) {
p = fract(p * vec2(123.34, 456.21));
p += dot(p, p + 45.32);
return fract(p.x * p.y);
}
float vnoise(vec2 p) {
vec2 i = floor(p);
vec2 f = fract(p);
vec2 u = f * f * (3.0 - 2.0 * f);
float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
float s = 0.0, a = 0.5;
for (int i = 0; i < 4; i++) {
s += a * vnoise(p);
p = p * 2.03 + vec2(17.1, 9.2);
a *= 0.5;
}
return s / 0.9375;
}
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
vec2 vogel(int k, float rot) {
float r = sqrt((float(k) + 0.5) / float(TAPS));
float a = float(k) * 2.39996323 + rot;
return r * vec2(cos(a), sin(a));
}
vec3 tapPattern(int i, vec2 uv, float lod) {
vec2 a = abs(uv);
if (any(greaterThan(a, vec2(1.0)))) return vec3(0.0);
float e = exp2(lod) * 3.0 / PATTERN_SIZE;
vec2 m = 1.0 - smoothstep(vec2(1.0 - e), vec2(1.0), a);
vec2 tc = vec2(0.5 + 0.5 * uv.x, 0.5 - 0.5 * uv.y);
return textureLod(uPattern, vec3(tc, float(i)), lod).rgb * (m.x * m.y);
}
float caustic(vec2 q, float seed, float blur) {
if (uCaustics <= 0.0) return 1.0;
vec2 p = q * vec2(4.2, 1.9) + seed * 13.7;
vec2 warp = vec2(fbm(p * 0.6), fbm(p * 0.6 + 5.2));
float n = fbm(p + warp * 1.8);
float ridge = pow(1.0 - abs(n * 2.0 - 1.0), 5.0);
float body = fbm(p * 0.35 + 3.1) - 0.5;
float sharp = clamp(1.0 - blur * 5.0, 0.0, 1.0);
return max(0.0, 1.0 + uCaustics * (sharp * (ridge * 1.1 - 0.2) + body * 0.7));
}
float floorAlbedo(vec2 p) {
if (uTexture == 0 || uTexStrength <= 0.0) return 1.0;
vec2 q = p / max(uTexScale, 1e-3);
float w = max(fwidth(q.x), fwidth(q.y));
float v = 1.0;
if (uTexture == 1) {
vec2 id = floor(q);
vec2 f = fract(q);
float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
float grout = smoothstep(0.0, 0.07 + w, edge);
float h = hash21(id);
float tile = 0.8 + 0.3 * h - step(0.92, h) * 0.25;
tile *= 0.88 + 0.24 * fbm(q * 0.06);
v = tile * mix(0.8, 1.0, grout);
v = mix(v, 0.93 + 0.12 * fbm(q * 0.06), smoothstep(0.3, 0.8, w));
} else if (uTexture == 2) {
float s = 0.0;
for (int l = 0; l < 2; l++) {
vec2 qq = q * (l == 0 ? 1.0 : 2.7);
vec2 id = floor(qq);
vec2 c = vec2(hash21(id), hash21(id + 7.1));
float r = 0.12 + 0.22 * hash21(id + 3.3);
float d = length(fract(qq) - c);
float dot_ = 1.0 - smoothstep(r - max(w, 0.02), r, d);
s += dot_ * (hash21(id + 9.7) - 0.45) * (l == 0 ? 0.9 : 0.6);
}
v = 1.0 + s;
v = mix(v, 1.0, smoothstep(0.3, 0.8, w));
} else if (uTexture == 3) {
float fine = clamp(1.0 - w * 4.0, 0.0, 1.0);
v = 0.84 + 0.32 * fbm(q * 0.5) + (vnoise(q * 7.0) - 0.5) * 0.22 * fine;
float pit = step(0.965, hash21(floor(q * 3.0))) * (1.0 - smoothstep(0.08, 0.2, length(fract(q * 3.0) - 0.5)));
v -= pit * 0.35 * fine;
} else {
float fine = clamp(1.0 - w * 3.0, 0.0, 1.0);
v = 1.0 + (fbm(q * 0.7) - 0.5) * 0.08 + (vnoise(q * 22.0) - 0.5) * 0.08 * fine;
}
return mix(1.0, v, uTexStrength);
}
float sdRoundRect(vec2 p, vec2 b, float r) {
vec2 q = abs(p) - b + r;
return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void lightAt(vec3 P, float rot, bool occlude, out vec3 light, out vec3 halo) {
light = vec3(0.0);
halo = vec3(0.0);
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
vec3 N = uWN[i];
bool pointSrc = uWSrc[i].w > 0.0;
vec3 L = pointSrc ? normalize(uWSrc[i].xyz - P) : uWL[i];
float denom = dot(L, N);
if (abs(denom) < 1e-3) continue;
float t = dot(uWC[i] - P, N) / denom;
if (t <= 1e-3) continue;
vec3 d = P + t * L - uWC[i];
vec2 half_ = uWHalf[i];
vec2 q = vec2(dot(d, uWU[i]), dot(d, uWV[i]));
vec2 uv = q / half_;
float r = t * uSoft / max(abs(denom), 0.25);
vec2 ruv = vec2(r) / half_;
vec2 gr = vec2(r * 1.5 + 0.035) / half_;
vec2 reach = max(ruv, gr);
if (any(greaterThan(abs(uv) - reach, vec2(1.02)))) continue;
float lod = max(0.0, log2(max(max(ruv.x, ruv.y) * 0.5 * PATTERN_SIZE * 0.8, 1.0)));
float glod = max(0.0, log2(max(max(gr.x, gr.y) * 0.5 * PATTERN_SIZE * 1.0, 1.0)));
vec3 acc = vec3(0.0);
for (int k = 0; k < TAPS; k++) {
acc += tapPattern(i, uv + vogel(k, rot) * ruv, lod);
}
acc /= float(TAPS);
vec3 h = tapPattern(i, uv, glod);
for (int k = 0; k < 8; k++) {
float a = float(k) * 0.78539816;
h += tapPattern(i, uv + vec2(cos(a), sin(a)) * gr * 0.7, glod);
}
h /= 9.0;
float atten = uWGain[i] * exp(-uFade * t * 0.1);
if (pointSrc) {
vec3 dS = P - uWSrc[i].xyz;
atten *= min(uWSrc[i].w * uWSrc[i].w / dot(dS, dS), 1.5);
}
if (occlude && uFocusOn == 1) {
vec2 rel = P.xy - uFocusC;
if (sdRoundRect(rel, uFocusHalf, uFocusR) > 0.0) {
float lz = max(L.z, 0.05);
vec2 hp = rel + L.xy * (uFocusLift / lz);
float pen = uFocusLift * uSoft / lz * 2.5 + 0.02;
atten *= 1.0 - uFocusShadow * (1.0 - smoothstep(-pen, pen, sdRoundRect(hp, uFocusHalf, uFocusR)));
}
}
light += acc * caustic(q, uSeed + float(i) * 7.31, r) * atten;
halo += h * atten;
}
light *= uSunColor;
halo *= uSunColor;
}
void clipLin(float p, float q, inout float t0, inout float t1) {
if (abs(q) < 1e-8) {
if (p < 0.0) t1 = -1.0;
return;
}
float tc = -p / q;
if (q > 0.0) t0 = max(t0, tc); else t1 = min(t1, tc);
}
vec3 volPoint(int i, vec3 ro, vec3 rd, float tMax) {
vec3 Sx = uWSrc[i].xyz;
float D = uWSrc[i].w;
vec3 C = uWC[i], N = uWN[i], U = uWU[i], V = uWV[i];
vec2 half_ = uWHalf[i];
float cN = dot(C - Sx, N);
if (abs(cN) < 1e-5) return vec3(0.0);
float sg = sign(cN);
vec3 w0 = ro - Sx;
float n0 = dot(w0, N), n1 = dot(rd, N);
float T0 = 0.0, T1 = tMax;
clipLin(sg * n0 - abs(cN), sg * n1, T0, T1);
if (T1 <= T0) return vec3(0.0);
float su = dot(Sx - C, U), sv = dot(Sx - C, V);
vec2 a0 = vec2(su * n0 + cN * dot(w0, U), sv * n0 + cN * dot(w0, V));
vec2 a1 = vec2(su * n1 + cN * dot(rd, U), sv * n1 + cN * dot(rd, V));
vec4 grid = uWGrid[i];
bool panes = grid.w > 0.5;
float cols = panes ? grid.x : 1.0, rows = panes ? grid.y : 1.0, mu = panes ? grid.z : 0.0;
float bu = panes ? PANES_BORDER : 0.0;
float cwu = (2.0 - 2.0 * bu) / cols, chu = (2.0 - 2.0 * bu) / rows;
vec3 c = vec3(0.0);
for (int r = 0; r < 4; r++) {
if (float(r) >= rows) break;
for (int k = 0; k < 4; k++) {
if (float(k) >= cols) break;
float x0 = -1.0 + bu + float(k) * cwu + mu * 0.5;
float y1 = 1.0 - bu - float(r) * chu - mu * 0.5;
vec2 lo = vec2(x0, y1 - (chu - mu)) * half_;
vec2 hi = vec2(x0 + cwu - mu, y1) * half_;
float t0 = T0, t1 = T1;
for (int a = 0; a < 2; a++) {
clipLin(sg * (a0[a] - lo[a] * n0), sg * (a1[a] - lo[a] * n1), t0, t1);
clipLin(sg * (hi[a] * n0 - a0[a]), sg * (hi[a] * n1 - a1[a]), t0, t1);
}
if (t1 <= t0) continue;
float len = t1 - t0;
vec3 pc = vec3(0.0);
for (int m = 0; m < 4; m++) {
float t = t0 + len * (float(m) + 0.5) / 4.0;
vec2 uv = (a0 + a1 * t) / ((n0 + n1 * t) * half_);
vec3 X = ro + rd * t;
float dist2 = dot(X - Sx, X - Sx);
float fall = min(D * D / dist2, 1.5);
float phase = 0.55 + 1.2 * pow(max(dot(rd, normalize(Sx - X)), 0.0), 3.0);
pc += tapPattern(i, uv, 1.0) * fall * phase * exp(-uFade * sqrt(dist2) * 0.1);
}
c += pc / 4.0 * len;
}
}
return c * uWGain[i];
}
vec3 volBeams(vec3 ro, vec3 rd, float tMax, float jit) {
vec3 sum = vec3(0.0);
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
if (uWGain[i] <= 0.0) continue;
if (uWSrc[i].w > 0.0) {
sum += volPoint(i, ro, rd, tMax);
continue;
}
vec3 L = uWL[i];
vec3 N = uWN[i];
float denom = dot(L, N);
if (abs(denom) < 1e-3) continue;
vec2 half_ = uWHalf[i];
float s0 = dot(uWC[i] - ro, N) / denom;
float s1 = -dot(rd, N) / denom;
vec3 d0 = ro + s0 * L - uWC[i];
vec3 dd = rd + s1 * L;
vec2 A = vec2(dot(d0, uWU[i]), dot(d0, uWV[i])) / half_;
vec2 B = vec2(dot(dd, uWU[i]), dot(dd, uWV[i])) / half_;
float T0 = 0.0, T1 = tMax;
if (abs(s1) < 1e-6) {
if (s0 <= 0.0) continue;
} else {
float ts = -s0 / s1;
if (s1 > 0.0) T0 = max(T0, ts); else T1 = min(T1, ts);
}
if (T1 <= T0) continue;
float phase = 0.55 + 1.2 * pow(max(dot(rd, L), 0.0), 3.0);
vec4 grid = uWGrid[i];
vec3 c = vec3(0.0);
if (grid.w > 0.5) {
float cols = grid.x, rows = grid.y, mu = grid.z;
float cwu = (2.0 - 2.0 * PANES_BORDER) / cols;
float chu = (2.0 - 2.0 * PANES_BORDER) / rows;
for (int r = 0; r < 4; r++) {
if (float(r) >= rows) break;
for (int k = 0; k < 4; k++) {
if (float(k) >= cols) break;
float x0 = -1.0 + PANES_BORDER + float(k) * cwu + mu * 0.5;
float y1 = 1.0 - PANES_BORDER - float(r) * chu - mu * 0.5;
vec2 lo = vec2(x0, y1 - (chu - mu));
vec2 hi = vec2(x0 + cwu - mu, y1);
float t0 = T0, t1 = T1;
for (int a = 0; a < 2; a++) {
if (abs(B[a]) < 1e-6) {
if (A[a] < lo[a] || A[a] > hi[a]) t1 = -1.0;
continue;
}
float ta = (lo[a] - A[a]) / B[a], tb = (hi[a] - A[a]) / B[a];
t0 = max(t0, min(ta, tb));
t1 = min(t1, max(ta, tb));
}
if (t1 <= t0) continue;
float len = t1 - t0;
vec3 pc = vec3(0.0);
for (int m = 0; m < 3; m++) {
float t = t0 + len * (float(m) + 0.5) / 3.0;
pc += tapPattern(i, A + B * t, 1.0) * exp(-uFade * (s0 + s1 * t) * 0.1);
}
c += pc / 3.0 * len;
}
}
} else {
float t0 = T0, t1 = T1;
for (int k = 0; k < 2; k++) {
float a = A[k], b = B[k];
if (abs(b) < 1e-6) {
if (abs(a) > 1.0) t1 = -1.0;
continue;
}
float ta = (-1.0 - a) / b, tb = (1.0 - a) / b;
t0 = max(t0, min(ta, tb));
t1 = min(t1, max(ta, tb));
}
if (t1 <= t0) continue;
const int M = 10;
float len = t1 - t0;
for (int m = 0; m < M; m++) {
float t = t0 + len * (float(m) + jit) / float(M);
float sd = s0 + s1 * t;
float rr = sd * uSoft / max(abs(denom), 0.25);
float lod = max(0.0, log2(max(max(rr / half_.x, rr / half_.y) * 0.5 * PATTERN_SIZE * 0.8, 1.0))) + 1.0;
c += tapPattern(i, A + B * t, lod) * exp(-uFade * sd * 0.1);
}
c *= len / float(M);
}
sum += c * uWGain[i] * phase;
}
return sum * uSunColor;
}
void applyFocus(vec3 P, float rot, inout vec3 light, inout vec3 halo, inout float ao) {
vec2 rel = P.xy - uFocusC;
float boxD = sdRoundRect(rel, uFocusHalf, uFocusR);
ao *= 1.0 - uFocusShadow * 0.12 * exp(-max(boxD, 0.0) / (uFocusRimW * 3.0)) * step(0.0, boxD);
if (boxD < uFocusRimW * 8.0) {
vec3 l2, h2;
lightAt(vec3(P.xy, uFocusLift), rot, false, l2, h2);
l2 += h2 * 0.6;
if (boxD < 0.0) {
light = l2 * uFocusInside;
halo = vec3(0.0);
}
float rim = exp(-abs(boxD) / uFocusRimW) * (boxD < 0.0 ? 0.35 : 1.0);
light += l2 * rim * uFocusRim;
}
}
float panelSeams(vec2 p) {
if (uPanel <= 0.0) return 1.0;
vec2 q = p / uPanel;
vec2 f = abs(fract(q) - 0.5);
vec2 w = fwidth(q);
vec2 l = smoothstep(vec2(0.5) - w * 1.5 - 0.006, vec2(0.5), f);
return 1.0 - (uTheme == 1 ? 0.05 : 0.1) * max(l.x, l.y);
}
vec3 windowEmission(vec3 P, int surface, float lod) {
vec3 e = vec3(0.0);
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
if (uWMount[i] != surface) continue;
vec3 d = P - uWC[i];
vec2 half_ = uWHalf[i];
vec2 q = vec2(dot(d, uWU[i]), dot(d, uWV[i]));
vec2 uv = q / half_;
float g = uWGain[i];
float lift_ = 0.9 + 0.2 * clamp(uv.y * 0.5 + 0.5, 0.0, 1.0);
e += tapPattern(i, uv, lod) * g * lift_ * 0.6;
vec3 avg = textureLod(uPattern, vec3(0.5, 0.5, float(i)), 9.0).rgb * 2.0;
float sd = length(max(abs(q) - half_, 0.0));
e += avg * g * (exp(-sd * 5.0) * 0.3 + exp(-sd * 1.4) * 0.08) * (sd > 0.0 ? 1.0 : 0.3);
}
return e * uSunColor * uWinGlow;
}
float dustField(vec2 p, float t) {
float s = 0.0;
for (int l = 0; l < 3; l++) {
float fl = float(l);
float sc = 34.0 + fl * 22.0;
vec2 q = p * sc + vec2(t * (0.05 + 0.03 * fl), -t * (0.09 + 0.04 * fl)) * sc * 0.1;
vec2 id = floor(q);
vec2 f = fract(q);
float h = hash21(id + fl * 17.0);
if (h < 0.9) continue;
vec2 c = vec2(hash21(id + 3.1), hash21(id + 7.7)) * 0.6 + 0.2;
c += 0.12 * vec2(sin(t * 0.5 + h * 40.0), cos(t * 0.43 + h * 31.0));
float r = 0.07 + 0.08 * hash21(id + 9.2);
float tw = 0.55 + 0.45 * sin(t * (0.8 + h * 1.5) + h * 50.0);
s += smoothstep(r, r * 0.2, length(f - c)) * tw * (1.0 - fl * 0.25);
}
return s;
}
vec3 voidColor(vec3 dir) {
float lo = uTheme == 1 ? 0.82 : 0.3;
return uRoomColor * uAmbient * (lo + (1.0 - lo) * smoothstep(-0.45, 0.12, dir.z));
}
vec3 aces(vec3 x) {
return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
void main() {
vec2 ndc = vUv * 2.0 - 1.0;
vec3 dir = normalize(uCamF + ndc.x * uCamK * uAspect * uCamR + ndc.y * uCamK * uCamU);
float rot = ign(gl_FragCoord.xy) * 6.2831853;
vec3 col;
if (uRoom == 1) {
vec3 ro = uCamPos;
float tF = (uFloor == 1 && dir.z < -1e-5) ? -ro.z / dir.z : 1e6;
float tW = dir.y > 1e-5 ? (uWallY - ro.y) / dir.y : 1e6;
float tS = (uSideX != 0.0 && dir.x * uSideX > 1e-5) ? (uSideX - ro.x) / dir.x : 1e6;
if (uFloor == 0) {
if (tW < 1e5 && ro.z + dir.z * tW < 0.0) tW = 1e6;
if (tS < 1e5 && ro.z + dir.z * tS < 0.0) tS = 1e6;
}
float tH = min(tF, min(tW, tS));
bool miss = tH > 1e5;
if (miss) tH = 40.0;
int surface = miss ? 3 : (tH == tF ? 0 : (tH == tW ? 1 : 2));
vec3 P = ro + dir * tH;
vec3 light = vec3(0.0), halo = vec3(0.0);
if (!miss) lightAt(P, rot, false, light, halo);
float ao = 1.0;
float near = 0.0;
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
if (uWMount[i] == 0) continue;
near += uWGain[i] * exp(-length(P - uWC[i]) * 0.28);
}
float corner = 1.0;
if (surface == 0) corner = (1.0 - 0.45 * exp(-(uWallY - P.y) * 1.2)) * (uSideX != 0.0 ? 1.0 - 0.45 * exp(-abs(uSideX - P.x) * 1.2) : 1.0);
else if (surface != 3 && uFloor == 1) corner = 1.0 - 0.35 * exp(-P.z * 1.4);
vec3 ambient = uRoomColor * uAmbient * (0.7 + 0.45 * near) * corner * ao;
vec3 directAlb = mix(uRoomColor, vec3(1.0), 0.7);
if (surface == 0) {
float alb = floorAlbedo(P.xy);
col = ambient * alb + directAlb * alb * (light + halo * uGlow);
if (uGloss > 0.0) {
vec3 rr = vec3(dir.xy, -dir.z);
float tw = rr.y > 1e-5 ? (uWallY - P.y) / rr.y : 1e6;
float ts2 = (uSideX != 0.0 && rr.x * uSideX > 1e-5) ? (uSideX - P.x) / rr.x : 1e6;
float tr = min(tw, ts2);
if (tr < 1e5) {
vec3 Q = P + rr * tr;
vec3 refl = windowEmission(Q, tr == tw ? 1 : 2, 6.0);
float fres = 0.15 + 0.85 * pow(1.0 - abs(dir.z), 4.0);
col += refl * uGloss * fres * exp(-tr * 0.12) * 0.35;
}
}
} else if (surface == 3) {
col = voidColor(dir);
} else {
vec2 wp = surface == 1 ? P.xz : P.yz;
col = ambient * panelSeams(wp) + directAlb * (light + halo * uGlow) * 0.8 + windowEmission(P, surface, 1.6);
if (uFloor == 0) col = mix(voidColor(dir), col, smoothstep(0.0, 1.6, P.z));
}
if (uHaze > 0.0) {
float jit = hash21(gl_FragCoord.xy * 1.37 + 3.1);
vec3 vb = volBeams(ro, dir, min(tH, 60.0), jit) * uHaze * 0.25;
col += vb;
light += vb * 2.0;
if (uDust > 0.0) {
float lum = dot(vb, vec3(0.3, 0.5, 0.2));
col += normalize(vb + 1e-4) * 1.7 * dustField(vec2(vUv.x * uAspect, vUv.y), uTime) * uDust * min(lum * 6.0, 2.0);
}
}
if (uFocusOn == 1 && uFocusRim > 0.0) {
vec2 sp = vec2(vUv.x * uAspect, vUv.y);
float bd = sdRoundRect(sp - uFocusS.xy, uFocusS.zw, uFocusSR.x);
float rim = exp(-abs(bd) / uFocusSR.y) * (bd < 0.0 ? 0.4 : 1.0);
col += (light + halo * uGlow) * rim * uFocusRim * 0.5;
}
col = aces(col * uExposure);
} else {
float tc = -uCamPos.z / min(dir.z, -1e-4);
vec3 P = uCamPos + tc * dir;
P.z = 0.0;
vec3 light, halo;
lightAt(P, rot, true, light, halo);
float ao = 1.0;
if (uFocusOn == 1) applyFocus(P, rot, light, halo, ao);
float alb = floorAlbedo(P.xy);
float amb = 0.82 + 0.36 * fbm(P.xy * 0.18 + uSeed);
if (uTheme == 0) {
vec3 lit = (light + halo * uGlow) * alb * uExposure;
float m = max(max(lit.r, lit.g), lit.b);
vec3 tm = lit * (1.0 - exp(-m)) / max(m, 1e-4);
tm += (1.0 - tm) * smoothstep(1.1, 4.0, m) * 0.55;
col = uBg * alb * amb * ao + tm;
} else {
vec3 L = (light + halo * uGlow) * alb;
float m = max(max(L.r, L.g), L.b);
float cov = 1.0 - exp(-(L.r + L.g + L.b) * uExposure * 0.75);
vec3 chroma = pow(L / max(m, 1e-4), vec3(1.0 / 2.2));
vec3 bgS = pow(uBg, vec3(1.0 / 2.2)) * mix(1.0, alb, 0.6) * mix(1.0, amb, 0.04);
vec3 s = bgS * ao * (1.0 - uShade * (1.0 - cov)) * mix(vec3(1.0), chroma, cov * 0.78);
col = pow(s, vec3(2.2)) + uBg * cov * 0.04;
}
}
vec2 vq = ndc * vec2(uAspect, 1.0) / max(uAspect, 1.0);
col *= 1.0 - uVignette * smoothstep(0.35, 1.25, length(vq));
col = mix(uBg, col, uOpacity);
if (uBottomFade > 0.0) col = mix(uBg, col, smoothstep(0.0, uBottomFade, vUv.y));
col = mix(col * 12.92, 1.055 * pow(max(col, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, col));
float n = hash21(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5;
col += n * (1.0 / 255.0 + uGrain * 0.05);
outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`,Xe=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Ut=e=>{const t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},ot=Math.tan(V(25)),qe=4;function Ct(e,t){const i=V(e),o=V(x(t,-30,89));return[Math.cos(o)*Math.cos(i),Math.cos(o)*Math.sin(i),Math.sin(o)]}function Ue(e,t,i=0){const o=V(x(e,0,85)),s=qe/Math.max(t,.05)/ot,n=V(x(i,-60,60)),a=c=>[c[0]*Math.cos(n)+c[1]*Math.sin(n),-c[0]*Math.sin(n)+c[1]*Math.cos(n),c[2]];return{pos:a([0,-s*Math.sin(o),s*Math.cos(o)]),f:a([0,Math.sin(o),-Math.cos(o)]),r:a([1,0,0]),u:a([0,Math.cos(o),Math.sin(o)])}}function Yt(e,t,i,o){const s=i*2-1,n=1-o*2,a=[0,1,2].map(u=>e.f[u]+s*ot*t*e.r[u]+n*ot*e.u[u]),c=-e.pos[2]/Math.min(a[2],-1e-4);return[e.pos[0]+c*a[0],e.pos[1]+c*a[1],0]}function jt(e,t,i,o,s,n){const a=i*2-1,c=1-o*2,u=[0,1,2].map(d=>e.f[d]+a*ot*t*e.r[d]+c*ot*e.u[d]),h=(n-e.pos[s])/(Math.abs(u[s])<1e-5?1e-5:u[s]);return[0,1,2].map(d=>e.pos[d]+Math.max(h,0)*u[d])}const Ye=e=>JSON.stringify([e.seed,e.palette,e.windows.slice(0,R).map(t=>[t.kind,t.shape,t.count,t.segments,t.fill,t.frame,t.pieces,t.seed])]);class wt{constructor(t,i={},o={}){this.loc=new Map,this.lastPatternKey="",this.raf=0,this.lastFrame=0,this.time=0,this.dirty=!0,this.paused=!1,this.focus=null,this.visible=!0,this.pageVisible=!0,this.reducedMotion=!1,this.destroyed=!1,this.lost=!1,this.cleanups=[],this.canvas=t,this.config=$(O($t),i),this.opts={renderScale:o.renderScale??.5,maxDpr:o.maxDpr??2,fps:o.fps??30,respectReducedMotion:o.respectReducedMotion??!0,preserveDrawingBuffer:o.preserveDrawingBuffer??!1},this.initGL(),this.watch(),this.resize(),this.loop=this.loop.bind(this),this.raf=requestAnimationFrame(this.loop)}static supported(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}getConfig(){return O(this.config)}set(t){this.config=$(this.config,t),this.dirty=!0}setConfig(t){this.config=$(O($t),t),this.dirty=!0}setOptions(t){Object.assign(this.opts,t),this.resize()}setFocus(t){this.focus=t,this.dirty=!0}trackFocus(t){var a;if((a=this.untrack)==null||a.call(this),!t)return this.setFocus(null),()=>{};const i=parseFloat(getComputedStyle(t).borderTopLeftRadius)||0,o=()=>{const c=this.canvas.getBoundingClientRect(),u=t.getBoundingClientRect(),h=this.focus,d=u.left-c.left,l=u.top-c.top;h&&Math.abs(h.x-d)<.5&&Math.abs(h.y-l)<.5&&Math.abs(h.width-u.width)<.5&&Math.abs(h.height-u.height)<.5||this.setFocus({x:d,y:l,width:u.width,height:u.height,radius:i})},s=()=>o();s(),this.measureFocus=o;const n="ResizeObserver"in window?new ResizeObserver(s):null;return n==null||n.observe(t),n==null||n.observe(this.canvas),n==null||n.observe(document.documentElement),window.addEventListener("scroll",s,{passive:!0,capture:!0}),window.addEventListener("resize",s),this.untrack=()=>{n==null||n.disconnect(),window.removeEventListener("scroll",s,{capture:!0}),window.removeEventListener("resize",s),this.measureFocus=void 0,this.untrack=void 0},this.untrack}get currentTime(){return this.time}setTime(t){this.time=t,this.dirty=!0}pause(){this.paused=!0}play(){this.paused=!1}get isPaused(){return this.paused}get animating(){return this.config.motion.mode!=="static"&&!this.paused&&!(this.opts.respectReducedMotion&&this.reducedMotion)&&this.visible&&this.pageVisible&&!this.lost}async toBlob(t,i,o="image/png",s){const n=[this.canvas.width,this.canvas.height],a=this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE),c=Math.min(1,a/Math.max(t,i));this.canvas.width=Math.round(t*c),this.canvas.height=Math.round(i*c),this.render();const u=await new Promise((h,d)=>this.canvas.toBlob(l=>l?h(l):d(new Error("toBlob failed")),o,s));return[this.canvas.width,this.canvas.height]=n,this.dirty=!0,u}destroy(){var i,o,s;this.destroyed=!0,cancelAnimationFrame(this.raf),(i=this.untrack)==null||i.call(this),this.cleanups.forEach(n=>n()),(o=this.io)==null||o.disconnect(),(s=this.ro)==null||s.disconnect();const t=this.gl;t&&!t.isContextLost()&&(t.deleteTexture(this.tex),t.deleteProgram(this.program),t.deleteVertexArray(this.vao))}initGL(){const t=this.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:this.opts.preserveDrawingBuffer,powerPreference:"low-power"});if(!t)throw new Error("Polanaluz: 当前浏览器不支持 WebGL2");this.gl=t;const i=(s,n)=>{const a=t.createShader(s);if(t.shaderSource(a,n),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS))throw new Error("Polanaluz shader: "+t.getShaderInfoLog(a));return a},o=t.createProgram();if(t.attachShader(o,i(t.VERTEX_SHADER,Ve)),t.attachShader(o,i(t.FRAGMENT_SHADER,He)),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS))throw new Error("Polanaluz link: "+t.getProgramInfoLog(o));this.program=o,this.loc.clear(),this.vao=t.createVertexArray(),this.tex=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,this.tex),t.texStorage3D(t.TEXTURE_2D_ARRAY,Math.log2(E)+1,t.SRGB8_ALPHA8,E,E,R),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.lastPatternKey="",this.dirty=!0}watch(){var i;const t=(o,s,n)=>{o.addEventListener(s,n),this.cleanups.push(()=>o.removeEventListener(s,n))};t(this.canvas,"webglcontextlost",o=>{o.preventDefault(),this.lost=!0}),t(this.canvas,"webglcontextrestored",()=>{this.lost=!1,this.initGL()}),t(document,"visibilitychange",()=>{this.pageVisible=document.visibilityState==="visible"}),this.pageVisible=document.visibilityState!=="hidden","IntersectionObserver"in window&&(this.io=new IntersectionObserver(o=>{this.visible=o.some(s=>s.isIntersecting),this.visible&&(this.dirty=!0)}),this.io.observe(this.canvas)),"ResizeObserver"in window&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(this.canvas)),this.mq=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-reduced-motion: reduce)"),this.mq&&(this.reducedMotion=this.mq.matches,t(this.mq,"change",()=>{var o;this.reducedMotion=!!((o=this.mq)!=null&&o.matches),this.dirty=!0}))}resize(){const t=this.canvas.getBoundingClientRect(),i=Math.min(window.devicePixelRatio||1,this.opts.maxDpr),o=Math.max(1,Math.round(t.width*i*this.opts.renderScale)),s=Math.max(1,Math.round(t.height*i*this.opts.renderScale));(o!==this.canvas.width||s!==this.canvas.height)&&(this.canvas.width=o,this.canvas.height=s),this.dirty=!0}loop(t){if(!this.destroyed&&(this.raf=requestAnimationFrame(this.loop),!this.lost))if(this.animating){const i=this.lastFrame?(t-this.lastFrame)/1e3:0;if(i>0&&i<1e3/this.opts.fps/1e3-.002)return;this.time+=Math.min(i,.1),this.lastFrame=t,this.render()}else this.lastFrame=0,this.dirty&&this.visible&&this.render()}u(t){return this.loc.has(t)||this.loc.set(t,this.gl.getUniformLocation(this.program,t)),this.loc.get(t)}uploadPatterns(){const t=Ye(this.config);if(t===this.lastPatternKey)return;this.lastPatternKey=t;const i=this.gl;i.bindTexture(i.TEXTURE_2D_ARRAY,this.tex),this.config.windows.slice(0,R).forEach((o,s)=>{const n=Ie(o,this.config.palette,this.config.seed);i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,s,E,E,1,i.RGBA,i.UNSIGNED_BYTE,n)}),i.generateMipmap(i.TEXTURE_2D_ARRAY)}render(){var Nt;const t=this.gl,i=this.config;(Nt=this.measureFocus)==null||Nt.call(this),this.dirty=!1,this.uploadPatterns();const o=this.canvas.width,s=this.canvas.height,n=o/s;t.viewport(0,0,o,s),t.useProgram(this.program),t.bindVertexArray(this.vao),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D_ARRAY,this.tex),t.uniform1i(this.u("uPattern"),0);const a=Ue(i.camera.tilt,i.camera.zoom,i.camera.yaw??0);t.uniform1f(this.u("uAspect"),n),t.uniform3fv(this.u("uCamPos"),a.pos),t.uniform3fv(this.u("uCamF"),a.f),t.uniform3fv(this.u("uCamR"),a.r),t.uniform3fv(this.u("uCamU"),a.u),t.uniform1f(this.u("uCamK"),ot);const c=i.motion,u=c.mode!=="static",h=this.time*c.speed,d=u?c.amount*(5*Math.sin(h/47*Math.PI*2)+3*(Ht(h/23,1)-.5)):0,l=u?c.amount*2.2*Math.sin(h/61*Math.PI*2+1.3):0,g=u?1-c.clouds*.55*x(Ht(h/9,2)*1.6-.45,0,1):1,m=Ct(i.sun.azimuth+d,i.sun.elevation+l),b=Ct(i.sun.azimuth,i.sun.elevation);t.uniform3fv(this.u("uL"),m);const v=_e(i.sun.temperature),S=i.sun.intensity*g;t.uniform3f(this.u("uSunColor"),v[0]*S,v[1]*S,v[2]*S),t.uniform1f(this.u("uSoft"),Math.tan(V(Math.max(i.sun.softness,.05)/2)));const f=i.windows.slice(0,R),p=new Float32Array(R*3),_=new Float32Array(R*3),W=new Float32Array(R*3),M=new Float32Array(R*3),z=new Float32Array(R*2),U=new Float32Array(R),nt=new Int32Array(R),I=new Float32Array(R*3),mt=new Float32Array(R*4),at=new Float32Array(R*4),pt=i.scene.mode==="room";f.forEach((w,A)=>{z.set([Math.max(w.width,.01)/2,Math.max(w.height,.01)/2],A*2),U[A]=w.enabled?w.gain:0,w.kind==="panes"&&mt.set([x(Math.round(w.count),1,4),x(Math.round(w.segments),1,4),ze(w.frame),1],A*4),I.set(pt&&w.mount!=="free"?Ct(i.sun.azimuth+w.facing+d,i.sun.elevation+l):m,A*3);const j=P=>{const It=x(w.spread??0,0,120);if(It<=.1)return;const bt=Math.hypot(w.width,w.height)/2/Math.tan(V(It/2)),_t=[I[A*3],I[A*3+1],I[A*3+2]];at.set([P[0]+_t[0]*bt,P[1]+_t[1]*bt,P[2]+_t[2]*bt,bt],A*4)};if(pt&&w.mount==="wall"){const P=jt(a,n,w.x,w.y,1,i.scene.wallDistance);p.set(P,A*3),j(P),_.set([1,0,0],A*3),W.set([0,0,1],A*3),M.set([0,-1,0],A*3),nt[A]=1;return}if(pt&&w.mount==="side"&&i.scene.sideWall!==0){const P=jt(a,n,w.x,w.y,0,i.scene.sideWall);p.set(P,A*3),j(P),_.set([0,1,0],A*3),W.set([0,0,1],A*3),M.set([1,0,0],A*3),nt[A]=2;return}const gt=Yt(a,n,w.x,w.y),vt=[0,1,2].map(P=>gt[P]+w.distance*b[P]),K=V(i.sun.azimuth+x(w.facing,-75,75)),Q=V(x(w.slope,0,90)),rt=[Math.cos(K),Math.sin(K),0],lt=[-Math.sin(K),Math.cos(K),0],ct=Ut([-Math.sin(Q)*rt[0],-Math.sin(Q)*rt[1],Math.cos(Q)]),Et=Ut(Xe(lt,ct));p.set(vt,A*3),_.set(lt,A*3),W.set(ct,A*3),M.set(Et,A*3)}),t.uniform1i(this.u("uCount"),f.length),t.uniform3fv(this.u("uWC"),p),t.uniform3fv(this.u("uWU"),_),t.uniform3fv(this.u("uWV"),W),t.uniform3fv(this.u("uWN"),M),t.uniform2fv(this.u("uWHalf"),z),t.uniform1fv(this.u("uWGain"),U),t.uniform1iv(this.u("uWMount"),nt),t.uniform3fv(this.u("uWL"),I),t.uniform4fv(this.u("uWGrid"),mt),t.uniform4fv(this.u("uWSrc"),at);const D=i.scene;t.uniform1i(this.u("uRoom"),pt?1:0),t.uniform1f(this.u("uWallY"),D.wallDistance),t.uniform1f(this.u("uSideX"),D.sideWall),t.uniform3fv(this.u("uRoomColor"),Vt(Lt(D.roomColor))),t.uniform1f(this.u("uAmbient"),D.ambient),t.uniform1f(this.u("uHaze"),D.haze),t.uniform1f(this.u("uWinGlow"),D.windowGlow),t.uniform1f(this.u("uBottomFade"),D.bottomFade),t.uniform1f(this.u("uPanel"),D.panel),t.uniform1f(this.u("uGloss"),D.gloss??0),t.uniform1i(this.u("uFloor"),D.floor===!1?0:1),t.uniform1f(this.u("uDust"),D.dust??0),t.uniform3fv(this.u("uBg"),Vt(Lt(i.surface.background))),t.uniform1i(this.u("uTexture"),{none:0,mosaic:1,terrazzo:2,stone:3,paper:4}[i.surface.texture]??0),t.uniform1f(this.u("uTexScale"),i.surface.textureScale),t.uniform1f(this.u("uTexStrength"),i.surface.textureStrength),t.uniform1i(this.u("uTheme"),i.theme==="light"?1:0),t.uniform1f(this.u("uOpacity"),i.look.opacity),t.uniform1f(this.u("uExposure"),i.look.exposure),t.uniform1f(this.u("uGlow"),i.look.glow),t.uniform1f(this.u("uCaustics"),i.look.caustics),t.uniform1f(this.u("uSeed"),i.seed%1e3*.137),t.uniform1f(this.u("uShade"),i.look.shade),t.uniform1f(this.u("uFade"),i.look.fade),t.uniform1f(this.u("uVignette"),i.look.vignette),t.uniform1f(this.u("uGrain"),i.look.grain),t.uniform1f(this.u("uTime"),this.time);const k=this.focus,he=this.canvas.clientWidth||1,Y=this.canvas.clientHeight||1;if(k&&k.width>0&&k.height>0){const w=(Et,P)=>Yt(a,n,Et/he,P/Y),A=w(k.x,k.y),j=w(k.x+k.width,k.y+k.height),gt=k.x+k.width/2,vt=k.y+k.height/2,K=w(gt,vt),Q=w(gt+1,vt),rt=Math.hypot(Q[0]-K[0],Q[1]-K[1]),lt=Math.abs(j[0]-A[0])/2,ct=Math.abs(j[1]-A[1])/2;t.uniform1i(this.u("uFocusOn"),1),t.uniform2f(this.u("uFocusC"),(A[0]+j[0])/2,(A[1]+j[1])/2),t.uniform2f(this.u("uFocusHalf"),lt,ct),t.uniform1f(this.u("uFocusR"),Math.min(k.radius*rt,lt,ct)),t.uniform1f(this.u("uFocusLift"),i.focus.lift),t.uniform1f(this.u("uFocusShadow"),i.focus.shadow),t.uniform1f(this.u("uFocusRim"),i.focus.rim),t.uniform1f(this.u("uFocusRimW"),Math.max(i.focus.rimWidth,.5)*rt),t.uniform1f(this.u("uFocusInside"),i.focus.inside),t.uniform4f(this.u("uFocusS"),(k.x+k.width/2)/Y,1-(k.y+k.height/2)/Y,k.width/2/Y,k.height/2/Y),t.uniform2f(this.u("uFocusSR"),Math.min(k.radius,k.width/2,k.height/2)/Y,Math.max(i.focus.rimWidth,.5)/Y)}else t.uniform1i(this.u("uFocusOn"),0);t.drawArrays(t.TRIANGLES,0,3)}}const Kt=600;function Mt(e){var o;if(e==="dark"||e==="light")return e;const t=document.documentElement,i=t.dataset.mode??t.dataset.theme;return i==="dark"||i==="light"?i:t.classList.contains("dark")||(o=window.matchMedia)!=null&&o.call(window,"(prefers-color-scheme: dark)").matches?"dark":"light"}function je(){var e;return e=class extends HTMLElement{constructor(){super(),this.engine=null,this.bundle=null,this.theme="dark",this.cleanups=[],this.loadToken=0,this.root=this.attachShadow({mode:"open"}),this.root.innerHTML=`<style>
      :host { display: block; position: relative; overflow: hidden; contain: strict; }
      img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
      img { object-fit: cover; }
      canvas { opacity: 0; transition: opacity ${Kt}ms ease; }
      canvas.on { opacity: 1; }
      @media (prefers-reduced-motion: reduce) { canvas { transition: none; } }
    </style><img alt="" aria-hidden="true" decoding="async" /><canvas aria-hidden="true"></canvas>`,this.poster=this.root.querySelector("img"),this.canvas=this.root.querySelector("canvas")}set config(i){this.bundle=i,this.apply()}get config(){return this.bundle}get instance(){return this.engine}connectedCallback(){var n;const i=()=>{const a=Mt(this.getAttribute("theme"));a!==this.theme&&(this.theme=a,this.apply(!0))},o=new MutationObserver(i);o.observe(document.documentElement,{attributes:!0,attributeFilter:["data-mode","data-theme","class"]});const s=(n=window.matchMedia)==null?void 0:n.call(window,"(prefers-color-scheme: dark)");s==null||s.addEventListener("change",i),this.cleanups.push(()=>o.disconnect(),()=>s==null?void 0:s.removeEventListener("change",i)),this.theme=Mt(this.getAttribute("theme")),this.load()}disconnectedCallback(){var i,o;this.cleanups.forEach(s=>s()),this.cleanups=[],(i=this.focusWait)==null||i.disconnect(),(o=this.engine)==null||o.destroy(),this.engine=null}attributeChangedCallback(i,o,s){!this.isConnected||o===s||(i==="theme"&&(this.theme=Mt(s)),i==="preset"||i==="config-url"?this.load():this.apply(i==="theme"))}async load(){const i=++this.loadToken,o=this.getAttribute("config-url");if(o)try{const s=await(await fetch(o)).json();if(i!==this.loadToken)return;this.bundle=s}catch{console.warn("polana-luz: 配置读取失败",o)}else{const s=ie(this.getAttribute("preset")??"")??st[0];this.bundle={dark:s.dark,light:s.light,style:s.id}}this.apply()}apply(i=!1){var u;const o=this.bundle,s=this.getAttribute(this.theme==="dark"?"poster-dark":"poster-light");if(s&&this.poster.getAttribute("src")!==s&&(this.poster.src=s),this.poster.hidden=!s,!o)return;if(!(this.getAttribute("mode")!=="static"&&wt.supported())){(u=this.engine)==null||u.destroy(),this.engine=null,this.canvas.classList.remove("on");return}const a=this.theme==="dark"?o.dark:o.light,c=parseFloat(this.getAttribute("render-scale")??"")||.5;this.engine?i?(this.canvas.classList.remove("on"),setTimeout(()=>{var h;(h=this.engine)==null||h.setConfig(a),requestAnimationFrame(()=>this.canvas.classList.add("on"))},Kt/2)):(this.engine.setConfig(a),this.engine.setOptions({renderScale:c})):(this.engine=new wt(this.canvas,a,{renderScale:c}),requestAnimationFrame(()=>requestAnimationFrame(()=>this.canvas.classList.add("on")))),this.watchFocus()}watchFocus(){var s,n;(s=this.focusWait)==null||s.disconnect();const i=this.getAttribute("focus"),o=i?document.querySelector(i):null;(n=this.engine)==null||n.trackFocus(o),i&&!o&&(this.focusWait=new MutationObserver(()=>{var c,u;const a=document.querySelector(i);a&&((c=this.focusWait)==null||c.disconnect(),(u=this.engine)==null||u.trackFocus(a))}),this.focusWait.observe(document.body,{childList:!0,subtree:!0}))}},e.observedAttributes=["preset","config-url","theme","focus","mode","poster-dark","poster-light","render-scale"],e}function Ke(e="polana-luz"){typeof window>"u"||typeof customElements>"u"||customElements.get(e)||customElements.define(e,je())}Ke();const ne="polanaluz-lang";function Je(){var e;try{const t=new URLSearchParams(location.search).get("lang");if(t==="zh"||t==="en")return t;const i=localStorage.getItem(ne);if(i==="zh"||i==="en")return i}catch{}return(e=navigator.language)!=null&&e.toLowerCase().startsWith("zh")?"zh":"en"}let Z=Je();const r=(e,t)=>Z==="en"?t:e,it=e=>Object.fromEntries(e.map(([t,i,o])=>[r(t,i),o]));function ae(){document.documentElement.lang=Z==="en"?"en":"zh-CN",document.querySelectorAll("[data-en]").forEach(e=>{e.dataset.zh===void 0&&(e.dataset.zh=e.innerHTML),e.innerHTML=Z==="en"?e.dataset.en:e.dataset.zh}),document.querySelectorAll("[data-title-en]").forEach(e=>{e.dataset.titleZh===void 0&&(e.dataset.titleZh=e.title),e.title=Z==="en"?e.dataset.titleEn:e.dataset.titleZh})}function Ze(e){Z=e;try{localStorage.setItem(ne,e)}catch{}ae()}const re=4,Wt=e=>JSON.parse(JSON.stringify(e)),T=e=>document.getElementById(e);function yt(e,t="dark"){const i=ie(e)??st[0];return{style:i.id,theme:t,configs:{dark:Wt(i.dark),light:Wt(i.light)}}}function Qe(){var t,i;try{const o=location.hash.slice(1);if(o){const s=JSON.parse(decodeURIComponent(escape(atob(o))));if((t=s==null?void 0:s.configs)!=null&&t.dark&&s.configs.light){const n=yt(s.style,s.theme);return n.configs.dark=$(n.configs.dark,s.configs.dark),n.configs.light=$(n.configs.light,s.configs.light),n}}}catch{}const e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-color-scheme: light)").matches;return yt(st[0].id,e?"light":"dark")}let Jt=0;function ti(){clearTimeout(Jt),Jt=window.setTimeout(()=>{const e=btoa(unescape(encodeURIComponent(JSON.stringify(C))));history.replaceState(null,"","#"+e)},250)}let C=Qe();const dt=()=>C.configs[C.theme],ei=T("stage");if(!wt.supported())throw document.body.insertAdjacentHTML("beforeend",`<p class="unsupported">${r("当前浏览器不支持 WebGL2，无法预览。","This browser does not support WebGL2.")}</p>`),new Error("WebGL2 unsupported");const L=new wt(ei,dt(),{preserveDrawingBuffer:!0}),H=()=>{L.setConfig(dt()),document.documentElement.dataset.theme=C.theme,ti()};let F=null;function N(){const e=F?oi(F):null;F==null||F.destroy();const t=dt();F=new zt({title:C.theme==="dark"?r("参数 · 深色版","Settings · dark"):r("参数 · 浅色版","Settings · light"),width:300}),F.onChange(H);const i=F.addFolder(r("光源（太阳）","Light (sun)"));i.add(t.sun,"azimuth",0,360,1).name(r("方位角 °","Azimuth °")),i.add(t.sun,"elevation",-20,85,.5).name(r("高度角 °","Elevation °")),i.add(t.sun,"intensity",0,4,.05).name(r("强度","Intensity")),i.add(t.sun,"temperature",2800,8e3,50).name(r("色温 K","Temperature K")),i.add(t.sun,"softness",.1,10,.1).name(r("柔度","Softness")),t.windows.forEach((l,g)=>{const m=F.addFolder(`${r("窗户","Window")} ${g+1}`);m.add(l,"enabled").name(r("启用","Enabled")),m.add(l,"mount",it([["只投影","Projection only","free"],["后墙","Back wall","wall"],["侧墙","Side wall","side"]])).name(r("安装位置","Mount")).onFinishChange(N),m.add(l,"kind",it([["微软式窗格","Panes (Windows style)","panes"],["彩色网格窗","Stained grid","grid"],["光缝","Slits","slits"]])).name(r("窗型","Window type")).onFinishChange(N),l.kind==="grid"&&m.add(l,"shape",it([["矩形","Rectangle","rect"],["圆拱","Arch","arch"],["三角","Triangle","triangle"]])).name(r("外形","Shape")),m.add(l,"x",-.5,1.5,.01).name(r("落点 X","Target X")),m.add(l,"y",-.5,1.5,.01).name(r("落点 Y","Target Y")),m.add(l,"distance",1,30,.1).name(r("离窗距离","Distance")),m.add(l,"width",.1,8,.05).name(r("窗宽","Width")),m.add(l,"height",.1,8,.05).name(r("窗高","Height")),m.add(l,"facing",-75,75,1).name(l.mount==="free"?r("朝向偏转 °","Facing °"):r("光线偏转 °","Beam turn °")),m.add(l,"slope",0,90,1).name(r("窗面倾角 °","Slope °"));const b=l.kind==="panes";m.add(l,"count",1,b?4:l.kind==="grid"?16:12,1).name(l.kind==="slits"?r("光缝条数","Slits"):r("列数","Columns")),m.add(l,"segments",1,b?4:16,1).name(l.kind==="slits"?r("颜色分段","Segments"):r("行数","Rows")),b&&m.add(l,"pieces",0,8,1).name(r("格内彩色碎片","Stained pieces")),l.mount!=="free"&&m.add(l,"spread",0,90,.5).name(r("发散角 °","Spread °")),l.kind==="slits"&&m.add(l,"fill",.05,1,.01).name(r("缝宽比例","Slit fill")),m.add(l,"frame",0,1,.01).name(r("窗框粗细","Frame")),m.add(l,"gain",0,3,.05).name(r("亮度","Brightness")),m.add(l,"seed",0,999,1).name(r("图案种子","Pattern seed")),m.add({remove:()=>ai(g)},"remove").name(r("✕ 删除这组","✕ Remove")),m.close()}),t.windows.length<re&&F.add({add:ni},"add").name(r("＋ 添加窗户组","＋ Add window"));const o=F.addFolder(r("色彩","Color"));o.add({preset:""},"preset",Object.fromEntries([[r("（选择色板）","(choose a palette)"),""],...Pt.map(l=>[r(l.name,l.nameEn??l.name),l.id])])).name(r("色板预设","Palette")).onChange(l=>{const g=Pt.find(m=>m.id===l);g&&(dt().palette=Wt(g.palette),H(),N())}),t.palette.colors.forEach((l,g)=>{o.addColor(t.palette.colors,g).name(`${r("颜色","Color")} ${g+1}`),o.add(t.palette.weights,g,0,5,.1).name(`　${r("权重","Weight")} ${g+1}`)}),o.add(t.palette,"white",0,.8,.01).name(r("白玻璃比例","Clear glass")),o.add(t.palette,"saturation",0,1.6,.01).name(r("饱和度","Saturation")),o.add(t,"seed",0,9999,1).name(r("全局种子","Global seed")),o.close();const s=F.addFolder(r("场景","Scene"));s.add(t.scene,"mode",it([["地面俯视","Floor (top-down)","floor"],["房间","Room","room"]])).name(r("模式","Mode")),s.addColor(t.scene,"roomColor").name(r("房间色调","Room color")),s.add(t.scene,"ambient",0,2,.01).name(r("环境光","Ambient")),s.add(t.scene,"haze",0,3,.01).name(r("光柱浓度","Beam haze")),s.add(t.scene,"windowGlow",0,4,.05).name(r("窗户发光","Window glow")),s.add(t.scene,"wallDistance",1,20,.1).name(r("后墙距离","Back wall distance")),s.add(t.scene,"sideWall",-20,20,.1).name(r("侧墙（正右 负左 0无）","Side wall (+R −L 0 none)")),s.add(t.scene,"floor").name(r("地面","Floor")),s.add(t.scene,"dust",0,1,.01).name(r("浮尘","Dust")),s.add(t.scene,"panel",0,4,.05).name(r("墙面分缝","Wall panels")),s.add(t.scene,"gloss",0,1,.01).name(r("地面光泽","Floor gloss")),s.add(t.scene,"bottomFade",0,.6,.01).name(r("底部淡出","Bottom fade")),s.close();const n=F.addFolder(r("投影视角","Camera"));n.add(t.camera,"tilt",0,85,.5).name(r("俯视角 °","Tilt °")),n.add(t.camera,"yaw",-60,60,.5).name(r("偏航角 °","Yaw °")),n.add(t.camera,"zoom",.3,3,.01).name(r("缩放","Zoom")),n.close();const a=F.addFolder(r("地面","Surface"));a.addColor(t.surface,"background").name(r("背景色","Background")),a.add(t.surface,"texture",it([["无","None","none"],["纸张","Paper","paper"],["清水混凝土","Concrete","stone"],["马赛克","Mosaic","mosaic"],["水磨石","Terrazzo","terrazzo"]])).name(r("纹理","Texture")),a.add(t.surface,"textureScale",.02,1,.005).name(r("纹理尺寸","Texture scale")),a.add(t.surface,"textureStrength",0,1,.01).name(r("纹理强度","Texture strength")),a.close();const c=F.addFolder(r("画面","Look"));c.add(t.look,"opacity",0,1,.01).name(r("不透明度","Opacity")),c.add(t.look,"exposure",0,4,.05).name(r("曝光","Exposure")),c.add(t.look,"glow",0,2,.01).name(r("光晕","Glow")),c.add(t.look,"caustics",0,1.5,.01).name(r("玻璃纹理","Glass caustics")),t.theme==="light"&&c.add(t.look,"shade",0,.4,.005).name(r("环境阴影","Ambient shade")),c.add(t.look,"fade",0,2,.01).name(r("远端衰减","Fade")),c.add(t.look,"vignette",0,1,.01).name(r("暗角","Vignette")),c.add(t.look,"grain",0,1,.01).name(r("颗粒","Grain")),c.close();const u=F.addFolder(r("搜索框（焦点元素）","Search box (focus)"));u.add(t.focus,"lift",0,1,.01).name(r("悬浮高度","Lift")),u.add(t.focus,"shadow",0,1,.01).name(r("影子浓度","Shadow")),u.add(t.focus,"rim",0,3,.05).name(r("边缘受光","Rim light")),u.add(t.focus,"rimWidth",1,40,.5).name(r("边缘光宽度 px","Rim width px")),u.add(t.focus,"inside",0,1,.01).name(r("框内透光","Inner light"));const h=F.addFolder(r("动画","Animation"));h.add(t.motion,"mode",it([["静态","Static","static"],["缓慢漂移","Slow drift","drift"]])).name(r("模式","Mode")),h.add(t.motion,"speed",0,6,.05).name(r("速度","Speed")),h.add(t.motion,"amount",0,4,.05).name(r("幅度","Amount")),h.add(t.motion,"clouds",0,1,.01).name(r("云层明暗","Clouds")),h.close();const d=F.addFolder(r("渲染","Render"));d.add(ii,"renderScale",.25,1,.05).name(r("渲染分辨率","Render scale")).onChange(l=>L.setOptions({renderScale:l})),d.close(),e&&si(F,e)}const ii={renderScale:.5};function oi(e){return new Set(e.foldersRecursive().filter(t=>!t._closed).map(t=>t._title))}function si(e,t){e.foldersRecursive().forEach(i=>t.has(i._title)?i.open():i.close())}function ni(){for(const e of["dark","light"]){const t=C.configs[e].windows;t.length<re&&t.push(X({x:.5,y:.5,seed:t.length+1}))}H(),N()}function ai(e){for(const t of["dark","light"])C.configs[t].windows.splice(e,1);H(),N()}const At=T("style"),le=()=>At.innerHTML=st.map(e=>`<option value="${e.id}" title="${r(e.desc,e.descEn??e.desc)}">${r(e.name,e.nameEn??e.name)}</option>`).join("");le();function ft(){At.value=C.style,document.querySelectorAll("[data-theme]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.theme===C.theme))),T("play").textContent=L.isPaused?"▶":"❚❚"}At.onchange=()=>{C=yt(At.value,C.theme),H(),N(),ft()};document.querySelectorAll("[data-theme]").forEach(e=>{e.onclick=()=>{C.theme=e.dataset.theme,H(),N(),ft()}});T("play").onclick=()=>{L.isPaused?L.play():L.pause(),ft()};T("shuffle").onclick=()=>{const e=Math.floor(Math.random()*9999);C.configs.dark.seed=e,C.configs.light.seed=e,H(),F==null||F.controllersRecursive().forEach(t=>t.updateDisplay())};T("reset").onclick=()=>{C=yt(C.style,C.theme),H(),N(),ut(r("已恢复默认参数","Reset to defaults"))};function Ft(e,t){const i=document.createElement("a");i.href=URL.createObjectURL(e),i.download=t,i.click(),setTimeout(()=>URL.revokeObjectURL(i.href),4e3)}const Zt=()=>({name:"polanaluz",version:1,style:C.style,dark:C.configs.dark,light:C.configs.light});async function ri(e,t=1920,i=1080){const o=L.currentTime;L.trackFocus(null),L.setConfig(C.configs[e]),L.setTime(0);try{return await L.toBlob(t,i,"image/webp",.88)}finally{L.setConfig(dt()),L.setTime(o),Bt()}}async function li(e){if(e==="png"){const t=Math.round(Math.min(3840,window.innerWidth*2)),i=Math.round(t*window.innerHeight/window.innerWidth);return Ft(await L.toBlob(t,i),`polanaluz-${C.style}-${C.theme}-${t}x${i}.png`),ut(`${r("已导出","Exported")} ${t}×${i} PNG`)}if(e==="copy")try{return await navigator.clipboard.writeText(JSON.stringify(Zt(),null,2)),ut(r("已复制配置 JSON（含深色、浅色两版）","Config JSON copied (dark + light)"))}catch{return ut(r("复制失败：浏览器不允许访问剪贴板","Copy failed: clipboard access denied"))}if((e==="json"||e==="bundle")&&Ft(new Blob([JSON.stringify(Zt(),null,2)],{type:"application/json"}),"polanaluz.json"),e==="webp"||e==="bundle")for(const t of["dark","light"])Ft(await ri(t),`polanaluz-${t}.webp`);ut(e==="bundle"?r("已导出接入包：polanaluz.json、polanaluz-dark.webp、polanaluz-light.webp","Exported: polanaluz.json, polanaluz-dark.webp, polanaluz-light.webp"):r("已导出","Exported"))}const ce=T("export"),xt=T("export-menu"),St=e=>{xt.hidden=!e,ce.setAttribute("aria-expanded",String(e))};ce.onclick=e=>{e.stopPropagation(),St(xt.hidden)};xt.querySelectorAll("[data-export]").forEach(e=>{e.onclick=async()=>{St(!1),await li(e.dataset.export)}});document.addEventListener("click",e=>{!xt.hidden&&!e.target.closest(".menu")&&St(!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&St(!1)});const ci=(e,t,i)=>{T(e).onclick=()=>{const o=T(t);o.hidden=!o.hidden,T(e).setAttribute("aria-pressed",String(!o.hidden))}};ci("toggle-mock","mock");const Bt=()=>L.trackFocus(T("mock").hidden?null:T("mock-search"));T("toggle-mock").addEventListener("click",Bt);T("toggle-mock").setAttribute("aria-pressed","true");Bt();window.addEventListener("keydown",e=>{e.target.closest("input, select, textarea")||(e.code==="Space"?(e.preventDefault(),T("play").click()):(e.key==="r"||e.key==="R")&&T("shuffle").click())});let Qt=0;function ut(e){const t=T("toast");t.textContent=e,t.classList.add("show"),clearTimeout(Qt),Qt=window.setTimeout(()=>t.classList.remove("show"),2200)}const ue=()=>T("lang").textContent=Z==="en"?"中文":"EN";T("lang").onclick=()=>{Ze(Z==="en"?"zh":"en"),le(),N(),ft(),ue()};ae();ue();H();N();ft();window.polanaluz=L;
