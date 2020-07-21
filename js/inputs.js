// 3 classes available in this file - `Utils, Input, App`
const keys = ['amount', 'customer age', 'customer’s zip code', 'order', 'tenure'];
const conditions = ['==', '!=', '>', '<', '<=', '>=', 'in'];
const valueObj = {
    'amount': ['$2000', '$1000', '$1500'],
    'customer age': ['21', '22', '23'],
    'order': ['TV', 'Sofa', 'Cot'],
    'tenure': ['3 Months', '4 Months'],
    'customer’s zip code': ['500020', '6000028']
};
const conditionObj = {
    'default': ['==', '!=', '>', '<', '<=', '>='],
    'order': ['in', 'not in']
};

class Utils {

    constructor() {
        this.multiCondition  = ['in', 'not in'];
    }

    createElement(elem, attrs = {}, events = {}) {
        const element = document.createElement(elem);
        Object.keys(attrs).forEach(key => {
            if (key === 'className') {
                element.setAttribute('class', attrs.className);
            } else {
                element.setAttribute(key, attrs[key]);
            }
        });
        Object.keys(events).forEach(key => {
            element.addEventListener(key, events[key]);
        });
        return element;
    }

    emptyChild(parentElem) {
        // parentElem.innerHTML = '';
        while(parentElem.firstChild) {
            parentElem.removeChild(parentElem.firstChild);
        }
    }

    appendChild(parent, child) {
        parent.appendChild(child);
    }
}
class Input extends Utils {
    constructor(
            key = '', condition = '', value = '',
            keyOptions = [], conditionOptions = [], valueCondition = [],
            callback, currIdx, parentIdx
        ) {
        super();
        this.currIdx = currIdx;
        this.parentIdx = parentIdx;
        this.model = {
            key: {
                selectedValue: key,
                options: [...keyOptions]
            },
            condition: {
                selectedValue: condition,
                options: [...conditionOptions]
            },
            value: {
                selectedValue: value,
                options: [...valueCondition]
            }
        };
        this.callback = callback;
        this.parent = this.createElement('div');
        this.render();
    }

    render() {
        const { key, condition, value } = this.model;
        this.keySelect = this.createSelectOption('key', key.options, key.selectedValue);
        this.valueMultiple = this.multiCondition.includes(condition.selectedValue);
        this.conditionSelect = this.createSelectOption('condition', condition.options, condition.selectedValue);
        this.valueSelect = this.createSelectOption('value', value.options, value.selectedValue, this.valueMultiple);
        this.root = this.createRootElem(this.keySelect, this.conditionSelect, this.valueSelect);
        this.emptyChild(this.parent);
        this.parent.appendChild(this.root);
    }

    remove() {
        this.emptyChild(this.parent);
        this.parent.remove();
    }

    createRootElem(key, condition, value) {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(key);
        fragment.appendChild(condition);
        fragment.appendChild(value);
        return fragment;
    }

    setValue(key, val, first) {
        this.setSelectedValue(key, val);
        if (key === 'key' && !first) {
            const conditionDropdown = (conditionObj[val] || conditionObj['default']);
            this.model.condition.selectedValue = conditionDropdown[0];
            this.model.condition.options = conditionDropdown;

            this.model.value.selectedValue = valueObj[val][0];
            this.model.value.options = valueObj[val];
            this.render();
        }
        // console.log(this.model);
        this.callback({...this.getValue(), ref: this});
    }

    setSelectedValue(option, val) {
        let result = '';
        if (this.valueMultiple) {
            result = [];
            const options = (this.valueSelect && this.valueSelect.options) || [];
            for (let i = 0, iLen = options.length; i < iLen; i++) {
              const opt = options[i];
              if (opt.selected) result.push(opt.value || opt.text);
            }
        } else {
            result = val;
        }
        this.model[option].selectedValue = result;
    }

    getValue() {
        return {
            key: this.model.key.selectedValue,
            condition: this.model.condition.selectedValue,
            value: this.model.value.selectedValue,
        }
    }

    createSelectOption(name, options = [], selectedValue, multiple) {
        const selectList = document.createElement("select");
        if (multiple) {
            selectList.setAttribute('multiple', multiple);
            selectList.addEventListener('click', (e) => this.setValue(selectList.name, e.target.value));
        } else {
            selectList.addEventListener('change', (e) => this.setValue(selectList.name, e.target.value));
        }
        selectList.name = name;
        for (let i = 0; i < options.length; i++) {
            const option = document.createElement("option");
            option.value = options[i];
            option.text = options[i];
            option.selected = selectedValue.includes(option.value); // need to change includes may cause issue
            selectList.appendChild(option);
        }
        return selectList;
    }
}

class App extends Utils {
    constructor(modeldata = [[]]) {
        super();
        this.callback = this.callback.bind(this);
        this.modeldata = [...modeldata];
        this.app = document.getElementById('app');
        this.getData = document.getElementById('get');
        this.addAndCondition = document.getElementById('addAndCondition');
        this.addAndCondition.addEventListener('click', () => {
            const len = this.modeldata.length - 1;
            if (this.modeldata[len].length > 0) {
                this.modeldata.push([]);
                this.render(this.modeldata);
            }
        });
        this.getData.addEventListener('click', () => {
            console.log(this.modeldata);
        });
        this.render(this.modeldata);
    }

    callback(e) {
        const {key, condition, value} = e;
        const input = this.modeldata[e.ref.parentIdx][e.ref.currIdx];
        input.key = key;
        input.condition = condition;
        input.value = value;
        // const div = this.createElement('div');
        // const h1 = this.createElement('h1');
        // h1.innerText = 'fsdafads';
        // div.appendChild(h1);
        // e.ref.conditionSelect.replaceWith(div);
    };

    createNewInput(selectedKey = '', selectedCondition = '', selectedValue = '',  callback, currIdx, parentIdx) {
        selectedKey = selectedKey || keys[0];
        const conditionDropdown = (conditionObj[selectedKey] || conditionObj['default']);
        selectedCondition = selectedCondition || conditionDropdown[0];
        selectedValue = selectedValue || valueObj[selectedKey][0];
        this.modeldata[parentIdx][currIdx] = {key: selectedKey, condition: selectedCondition, value: selectedValue};
        return new Input(selectedKey, selectedCondition, selectedValue, keys, conditionDropdown, valueObj[selectedKey], callback, currIdx, parentIdx);
    };

    createInputDom(key, condition, value, inIdx, topIdx, callback = this.callback) {
        const innerDiv = this.createElement('div', { 'data-condition' : 'orCondition', 'data-parent-idx': topIdx,'data-idx': inIdx, className: 'or-condition'});
        const newInput = this.createNewInput(key, condition, value, callback, inIdx, topIdx);
        innerDiv.appendChild(newInput.parent);
        const removeButton = this.createElement('button', {className: 'remove'}, {
            click: () => {
                this.modeldata[topIdx].splice(inIdx, 1);
                // innerDiv.remove();
                this.render(this.modeldata);
            }
        });
        removeButton.innerText = 'X';
        innerDiv.appendChild(removeButton);
        return innerDiv;
    }

    render(_data) {
        this.emptyChild(this.app);
        const outerDiv = this.createElement('div', { className: 'rules-wrapper'});
        _data.forEach((orConditionss, topIdx) => {
            const andConditionDivs = this.createElement('div', { 'data-condition' : 'andCondition', 'data-idx': topIdx, className: 'and-condition'});
            const styleDiv = this.createElement('div', { className: 'style-wrapper'});
            andConditionDivs.appendChild(styleDiv);
            orConditionss.forEach((orCondition, inIdx) => {
                const { key, condition, value } = orCondition;
                const selectDiv = this.createInputDom(key, condition, value, inIdx, topIdx);
                styleDiv.appendChild(selectDiv);
            });
            outerDiv.appendChild(andConditionDivs);
            const addOrButton = this.createElement('button', { className: 'add'}, {
                click: () => {
                    const selectDiv = this.createInputDom('', '', '', this.modeldata[topIdx].length, topIdx);
                    styleDiv.appendChild(selectDiv);
                }
            });
            addOrButton.innerText = '+ Add AND condition';
            andConditionDivs.appendChild(addOrButton);
        });
        this.app.appendChild(outerDiv);
    }
}