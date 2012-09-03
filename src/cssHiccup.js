/*----------------------------------------------------------
MIT Style License
Projectname: cssHiccup
Copyright (C) 2011, Joe Ray Gregory 
----------------------------------------------------------*/

Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
}

var cssHiccup = function() { this.reloads = 0; this.cssFiles = this.getCSS(); };

cssHiccup.prototype = {
    /*****************************************************************
    ### options
    ----------------------------------------------------------
        @ return: -
        @ params: -
        @ used methods: newElement, formfield
        @ description: Builds up the Gui of CSS Hickup.
    ----------------------------------------------------------
    *****************************************************************/
    options: {
        interval: false,         //Saves the Interval Function
        speed: 1000,             //Update Speed in ms
        theme: '../src/cHred2011.css'   //Path to CSS Theme File 
    },
    /*****************************************************************
    ### init
    ----------------------------------------------------------
        @ return: -
        @ params: -
        @ used methods: buildGui
        @ description: Initilize CSS Hickup
    ----------------------------------------------------------
    *****************************************************************/
    init: function()
    {
        this.loadThemeCss(this.options.theme);
        this.buildGui();
    },
    /*****************************************************************
    ### loadThemeCss
    ----------------------------------------------------------
        @ return: -
        @ params:   - path: path to the css file
        @ used methods: newElement
        @ description: insert a new Stylesheet to the head 
    ----------------------------------------------------------
    *****************************************************************/
    loadThemeCss: function(path) {
        this.newElement('link', ['rel=stylesheet', 'href='+path, 'type=text/css'], document.getElementsByTagName('head')[0]);
    },
    /*****************************************************************
    ### checkItems
    ----------------------------------------------------------
        @ return: array
        @ params:   - data: Data Array
                    - attribute: Attribute that should be checked
                    - match: Attribute Value
        @ used methods: -
        @ description: check a data Array and store all valid elements to a new array 
    ----------------------------------------------------------
    *****************************************************************/
    checkItems: function(data, attribute, match) {
        var dataArr = [];
        for(var _i = 0; _i<data.length; _i++)
        {
            var _el = data[_i];
            if(_el.getAttribute(attribute) == match)
            {
                dataArr.push(_el);
            }
        }
        return dataArr;
    },
    /*****************************************************************
    ### getCSS
    ----------------------------------------------------------
        @ return: _css(DataArray)
        @ params: -
        @ used methods: checkItems
        @ description: Collect all CSS files with link tag
    ----------------------------------------------------------
    *****************************************************************/
    getCSS: function() {
        var _cssArr = document.getElementsByTagName('link');
            _css = this.checkItems(_cssArr, 'rel', 'stylesheet');
            return _css;
    },
    /*****************************************************************
    ### updateCSS
    ----------------------------------------------------------
        @ return: -
        @ params:   - data: Data Array
                    - attr: Attribute
        @ used methods: -
        @ description: Updates all CSS files
    ----------------------------------------------------------
    *****************************************************************/
    updateCSS: function(data, attr) {
        var _head = document.getElementsByTagName('head')[0];
        for(var _i = 0; _i<data.length; _i++)
        {
            var _el = data[_i];
            var _splitUrlParams = _el.getAttribute(attr).split('?');
            _el.setAttribute('href', _splitUrlParams[0]+'?reload='+this.reloads);
        }
        this.reloads++;
    },
    /*****************************************************************
    ### update
    ----------------------------------------------------------
        @ return: -
        @ params: -
        @ used methods: newElement, formfield
        @ description: Single update Event for CSS files
    ----------------------------------------------------------
    *****************************************************************/
    update: function() {
        this.updateCSS(this.cssFiles, 'href');
    },
    /*****************************************************************
    ### autoUpdate
    ----------------------------------------------------------
        @ return: -
        @ params: -
        @ used methods: newElement, formfield
        @ description: start autoupdating 
    ----------------------------------------------------------
    *****************************************************************/
    autoUpdate: function() {
        var _el = document.getElementById('rr-autoupdate'),
            _interval = document.getElementById('rr-interval');
        
        if(_el.checked) {
            this.options.interval = self.setInterval((function(self) {
                return function() {
                    self.update();
                }
            })(this),this.options.speed);
            _interval.removeAttribute('disabled');
        } else {
            this.cleatInterval();
            _interval.setAttribute('disabled', 'disabled');
        }
    },
    cleatInterval: function() {
        self.clearInterval(this.options.interval);
    },
    /*****************************************************************
    ### updateSpeed
    ----------------------------------------------------------
        @ return: -
        @ params: -
        @ used methods: autoUpdate, formfield
        @ description: Update the time of a reload
    ----------------------------------------------------------
    *****************************************************************/
    updateSpeed: function() {
        this.cleatInterval();
        this.options.speed = document.getElementById('rr-interval').value * 1000;
        this.autoUpdate();
    },
    /*****************************************************************
    ### buildGui
    ----------------------------------------------------------
        @ return: -
        @ params: -
        @ used methods: newElement, formfield
        @ description: Build up the gui of CSS Hickup.
    ----------------------------------------------------------
    *****************************************************************/
    buildGui: function() {
        /* Wrapping Elements Start */
        var _center = this.newElement('div', ['id=rr-center', 'class=rr'], document.body);
        var _wrap = this.newElement('div', ['id=rr-wrap', 'class=rr'], _center);
        /* Wrapping Elements End */
        /* Form Start */
        var _inner = this.newElement('form', ['id=rr-inner', 'class=rr'], _wrap);
        var _hl = this.newElement('div', ['class=rr-headline'], _inner),
            _span1 = this.newElement('span', ['class=txt-highlight1'], _hl, 'C'),
            _span2 = this.newElement('span', ['class=txt-highlight2'], _hl, 'S'),
            _span3 = this.newElement('span', ['class=txt-highlight3'], _hl, 'S'),
            _span4 = this.newElement('span', ['class=txt-highlight3'], _hl, 'Hiccup');
        /* Checkbox for Autoupdate */
        var _autoupdate = this.formfield('Set Autoupdate',['type=checkbox', 'class=rr-checkbox'],'rr-autoupdate',_inner, this.autoUpdate, 'click');
        /* Interval for Autoupdate */
        var _interval = this.comboBox('Set Interval', ['class=rr-select', 'disabled=disabled'], 'rr-interval', _inner, [1,3,5,8,10,13,15,18,20,30,40,60], this.updateSpeed, 'change');
        /* Button for Single Load Request */
        var _button = this.formfield(false,['type=button', 'class=rr-button', 'value=Load CSS'],'rr-submit',_inner, this.update, 'click');
    },
    /*****************************************************************
    ### formfield
    ----------------------------------------------------------
        @ return: -
        @ params:   - labelText = Text for the label
                    - options = Tag attributtes like class id and so on.
                    - elID = Id for form element, needed for the label relationship
                    - insert = Insert destination element
                    - event = Inherits the function that should be executed
        @ used methods: newElement
        @ description: Generates and insert a single element container to the Form
    ----------------------------------------------------------
    *****************************************************************/
    formfield: function(labelText, options, elID, insert, event, eventType) {
        event = event || false;
        options.push('id='+elID);
        var _wrapper = this.newElement('div', ['class=rr-formwrap'], insert);
        if(labelText) {
            var _label = this.newElement('label', ['class=formelelement', 'for='+elID], _wrapper, labelText);
        }
        var _input = this.newElement('input', options, _wrapper, false, event, eventType);
    },
    comboBox: function(labelText, options, elID, insert, optionsArr, event, eventType) {
        event = event || false;
        options.push('id='+elID);
        var _wrapper = this.newElement('div', ['class=rr-formwrap'], insert);
        if(labelText) {
            var _label = this.newElement('label', ['class=formelelement', 'for='+elID], _wrapper, labelText);
        }
        var _select = this.newElement('select', options, _wrapper, false, event, eventType);
        for(var _i = 0; _i<optionsArr.length;_i++) {
            var _option = this.newElement('option', ['value='+optionsArr[_i], 'name='+optionsArr[_i]], _select, optionsArr[_i]+' Sek.');
        }
    },
    newElement: function(type, param, insertElement, text, event, eventType) {
        text = text || false;
        event = event || false;
        eventType = eventType || false;
        var _element = document.createElement(type);
        if(param) {
            for(var _i = 0; _i<param.length;_i++)
            {
                var _el = param[_i].split('=');
                _element.setAttribute(_el[0], _el[1]);
            }
        } else {
            param = false;
        }
        if(text) {
            var textValue = document.createTextNode(text);
            _element.appendChild(textValue);
        }
        if(event) {
            switch(eventType) {
                case 'click':
                    _element.onclick = event.bind(this);
                break;
                case 'change':
                    _element.onchange = event.bind(this);
                break;
                default:
                    throw "Parameter eventType is empty!";
            }
            
        }
        return insertElement.appendChild(_element);
    }
}

var cssHiccup = new cssHiccup();
cssHiccup.init();