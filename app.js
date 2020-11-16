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
        percentageLabel: ".budget__expenses--percentage",
        containerDiv: ".container",
        expensePercentage: ".item__percentage",

    };
    var nodeListForeach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        // displayPercentages: (allPercentages) => {
        //     var elements = document.querySelectorAll(DOMstrings.expensePercentage);
        //     var elArr = Array.prototype.slice.call(elements);
        //     elArr.map((i, index) => {
        //         i.textContent = allPercentages[index];
        //     })
        // },
        displayPercentages: function(allPercentages) {
            var elements = document.querySelectorAll(
                DOMstrings.expensePercentage
            );
            nodeListForeach(elements, function(el, index) {
                el.textContent = allPercentages[index];
            });
        },
        getDOMstrings: () => {
            return DOMstrings;
        },
        clearFields: () => {

            var fields = document.querySelectorAll(DOMstrings.inputDescription + "," +
                DOMstrings.inputValue);
            console.log(fields);
            var fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);
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
            if (tusuv.huvi === 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
            }
            if (Number.isNaN(tusuv.huvi) === true)
                document.querySelector(DOMstrings.percentageLabel).textContent = 0;
            else if (tusuv.huvi > 0) document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";

        },
        deleteListItem: (id) => {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        addListItem: (item, type) => {
            var html, list;
            if (type === 'inc') {
                html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div></div></div>';
                list = DOMstrings.incomeList;
                console.log("inc baina");
            } else {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div>        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
        this.percentage = -1;
    }
    Expense.prototype.calcPercentange = function(totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = 0;
    }
    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
        calculatePercentages: () => {
            data.items.exp.forEach((i) => {
                i.calcPercentange(data.totals.inc);
            })
        },
        getPercentages: () => {
            var allPercentages = data.items.exp.map((i) => {
                return i.getPercentage();
            });
            return allPercentages;
        },
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
        deleteItem: (type, id) => {
            var ids = data.items[type].map((i) => i.id);
            var index = ids.indexOf(id);
            if (index !== -1)
                data.items[type].splice(index, 1);
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
        }

        uiController.clearFields();
        updateTusuv();
        // 4. Төсвийг тооцоолно
        // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    };
    var updateTusuv = () => {
        financeController.tusuvToostooloh();
        //console.log(financeController.tusuvToostooloh());
        var tusuv = financeController.tusviigAvah();
        uiController.tusviigUzuuleh(tusuv);
        financeController.calculatePercentages();
        var allPercentages = financeController.getPercentages();
        uiController.displayPercentages(allPercentages);
    }
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
        document.querySelector(DOM.containerDiv).addEventListener("click", (event) => {
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (id) {
                var type = id.split("-")[0];
                var itemid = parseInt(id.split("-")[1]);
            }
            financeController.deleteItem(type, itemid);
            uiController.deleteListItem(id);
            updateTusuv();
        })
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