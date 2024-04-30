const btn_refresh = document.querySelector(".btn_refresh");
const searchInput = document.querySelector(".search_input");
const transactionsList = document.querySelector(".list__view");
const transactionListSection = document.querySelector(".transactions-list");

let sortDateOrder = "desc";
let sortPriceOrder = "desc";

btn_refresh.addEventListener("click", () => buildForm());


  try {
    const allTrsnsactions = await axios
      .get("http://localhost:3000/transactions")
      .then((res) => {
       getTransaction();
        renderTransactionsList(res.data);
        searchInput.addEventListener("input", (e) => searchTransactions(e));
      });
  } catch {
    (err) => console.log(err);
  }

function renderTransactionsList(trsnsactions) {
  let htmlText = "";
  htmlText =showHead();

  if (trsnsactions.length>0) {
    trsnsactions.forEach((item) => {
      htmlText += showList(item);
      transactionsList.innerHTML = htmlText;
    });
  } else {
    transactionsList.innerHTML = htmlText;
    return;
  }

  const sortBtn = [...document.querySelectorAll(".Btn")];
  sortBtn.forEach((item) => {
    item.addEventListener("click", (e) => {
      sort(e);
    });
  });
}

function showHead() {
  return ` 
  <tr class="list__view-header">
    <th>ردیف</th>
    <th>نوع تراکنش</th>
    <th class="Btn" data-sortFilter="price">
      <span>مبلغ</span>
      <span class="chevron">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    </th>
    <th>شماره پیگیری</th>
    <th class="Btn" data-sortFilter="date">
      <span>تاریخ تراکنش</span>
      <span class="chevron">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    </th>
  </tr>`;
}

function  showList(tranceType) {
  let result = "";
  result = `           
      <tr class="list__view-item">
        <td>${tranceType.id}</td>`;
  result += `
        <td>${tranceType.price}</td>
        <td>${tranceType.refId}</td>
        <td>${new Date(tranceType.date).toLocaleString("fa-IR")}
        ${new Date(tranceType.date).tolocalTimeString("fa-IR" ,{
          hour: "2-digit",
          minute: "2-digit",
        })}</td>
        </tr>
        `;

  return result;
}

function getTransaction() {
  btn_refresh.classList.add("hidden");
  searchInput.classList.remove("hidden");
  transactionListSection.classList.remove("hidden");
 
}


async function searchTransactions(e) {
  e.preventDefault();
  const filter = e.target.value.trim();
  const newQuery = "http://localhost:3000/transactions?refId_like=" + filter;
  try {
    const filteredTrancaction = await axios.get(newQuery);
    {
      renderTransactionsList(filteredTrancaction.data);
    }
  } catch (err) {
    console.log(err);
  }
}


async function sort(e) {
  let url = "";
  let order = "";
  const sortFilter = e.target.dataset.sortfilter;
  order = setOrder(sortFilter);
  if (searchInput.value) {
    const searchValue = searchInput.value.trim();
    url = `http://localhost:3000/transactions?refId_like=${searchValue}&_sort=${sortFilter}&_order=${order}`;
  } else
    url = `http://localhost:3000/transactions?_sort=${sortFilter}&_order=${order}`;

  try {
    await axios.get(url).then((res) => {
      renderTransactionsList(res.data);
    });
  } catch {
    (err) => console.log(err);
  }
}

function setOrder(filter) {
  let order = "";
  if (filter === "price") {
    if (sortPriceOrder.includes("desc")) sortPriceOrder = "asc";
    else sortPriceOrder = "desc";
    order = sortPriceOrder;
  } else {
    if (sortDateOrder.includes("desc")) sortDateOrder = "asc";
    else sortDateOrder = "desc";
    order = sortDateOrder;
  }
  return order;
}

