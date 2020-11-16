// Дэлгэцтэй ажиллах контроллер
var uiController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        tusuvLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expesesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        getDOMstrings: () => {
            return DOMstrings;
        },
        clearFields: () => {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + "," +
                DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.map((val, index) => {
                val.value = '';
                if (index == 0)
                    val.focus();
            });
        },
        tusviigUzuuleh: (tusuv) => {
            document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
            document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalInc;
            if (tusuv.totalExp === 0)
                document.querySelector(DOMstrings.expesesLabel).textContent = tusuv.totalExp;
            else document.querySelector(DOMstrings.expesesLabel).textContent = "-" + tusuv.totalExp;
            if (tusuv.huvi === 0)
                document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
            else document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";

        },
        addListItem: (item, type) => {
            var html, list;
            if (type === 'inc') {
                html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div></div></div>';
                list = DOMstrings.incomeList;
                console.log("inc baina");
            } else {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div>        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                list = DOMstrings.expenseList;
                console.log("exp baina");
            }
            html = html.replace('%id%', item.id);
            html = html.replace('$$DESCRIPTION$$', item.description);
            html = html.replace('$$VALUE$$', item.value);
            document.querySelector(list).insertAdjacentHTML('beforeend', html);
        }

    };
})();

// Санхүүтэй ажиллах контроллер
var financeController = (() => {
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var calculateTotal = (type) => {
        var sum = 0;
        data.items[type].forEach(element => {
            sum = sum + element.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        tusuv: 0,
        huvi: 0,
    }
    return {
        tusuvToostooloh: () => {
            calculateTotal("inc");
            calculateTotal("exp");
            data.tusuv = data.totals.inc - data.totals.exp;
            data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        tusviigAvah: () => {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
        addItem: (type, desc, val) => {
            var item, id;
            if (data.items[type].length === 0) {
                id = 1;
            } else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }
            if (type === 'inc') {
                item = new Income(id, desc, val);
            } else {
                item = new Expense(id, desc, val);
            }
            data.items[type].push(item);
            return item;
        },
        data: function() {
            return data;
        }
    }

})();

// Програмын холбогч контроллер
var appController = (function(uiController, financeController) {


    var ctrlAddItem = () => {
        // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
        var input = uiController.getInput();
        console.log(input.type);
        if (input.description !== "" && Number.isNaN(input.value) !== true) {
            // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
            var item = financeController.addItem(input.type, input.description, input.value);
            console.log(financeController.data());

            // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана
            uiController.addListItem(item, input.type);
            financeController.tusuvToostooloh();
            //console.log(financeController.tusuvToostooloh());
            var tusuv = financeController.tusviigAvah();
            uiController.tusviigUzuuleh(tusuv);
        }
        uiController.clearFields();
        // 4. Төсвийг тооцоолно
        // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    };
    var setupEventLisreners = () => {
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener("click", function() {
            ctrlAddItem();
        });

        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }
    return {
        init: () => {
            setupEventLisreners();
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            })
        }
    }
})(uiController, financeController);

appController.init();