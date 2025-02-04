const form = document.querySelector("form");
const expenseList = document.querySelector("ul");

const expense = document.getElementById("expense");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");

  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  if (!expense.value || !category.value || !amount.value) {
    alert("Preencha todos os campos!");
    return;
  }

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  addExpense(newExpense);
};

function addExpense(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `
        <small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}
        `;

    const removeExpense = document.createElement("img");
    removeExpense.classList.add("remove-icon");
    removeExpense.setAttribute("src", "img/remove.svg");
    removeExpense.setAttribute("alt", "remover");

    expenseInfo.append(expenseName, expenseCategory);
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeExpense);
    expenseList.append(expenseItem);

    updateTotal();
    clearForm();
  } catch (error) {
    alert("Ocorreu um erro ao adicionar o gasto. Tente novamente.");
    console.log(error);
  }
}

function updateTotal() {
  try {
    const items = expenseList.children;

    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    for (let i = 0; i < items.length; i++) {
      const itemAmount = items[i].querySelector(".expense-amount");

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      total += Number(value);
    }

    expenseTotal.innerHTML = `<small>R$</small>${formatCurrencyBRL(
      total
    ).replace("R$", "")}`;
  } catch (error) {
    alert("Ocorreu um erro ao atualizar o total. Tente novamente.");
    console.log(error);
  }
}

expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");

    item.remove();
  }

  updateTotal();
});

function clearForm() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
