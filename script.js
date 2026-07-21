
const exceptionForm = document.getElementById("exception-form");
const deliveryId = document.getElementById("delivery-id");
const customerName = document.getElementById("customer-name");
const issueType = document.getElementById("issue-type");
const notes = document.getElementById("notes");
const priorityOptions = document.querySelectorAll('input[name="priority"]');


const tableBody =document.getElementById("exception-table-body");

function handleSubmit(event){
    event.preventDefault();
    const enteredDeliveryId = deliveryId.value;
    const enteredCustomerName = customerName.value;
    const enteredIssuetype = issueType.value;
    const enteredNotes = notes.value;
    let selectedPriority = "";

    for (let option of priorityOptions){
        if(option.checked){
            selectedPriority = option.value;
            break;
        }
    }

    const rowData = [enteredDeliveryId,enteredCustomerName,enteredIssuetype,selectedPriority,"Open" ];
    const tableRow= document.createElement("tr");
    for (let data of rowData){
       
        const cell = document.createElement("td");

        
        if (data == "Open") {

            const badge = document.createElement("span");

            badge.textContent = "Open";

            badge.classList.add("status-open");

            cell.appendChild(badge);

        }
        else if (data == "Low" || data == "Medium" || data == "High") {

            const badge = document.createElement("span");
            badge.textContent = data;

            if (data == "Low") {
                badge.classList.add("priority-low");
            }
            else if (data == "Medium") {
                badge.classList.add("priority-medium");
            }
            else if (data == "High") {
                badge.classList.add("priority-high");
            }

            cell.appendChild(badge);
        }

    
        else {
            cell.textContent = data;
        }

        tableRow.appendChild(cell);

    } 
   
    const actions =document.createElement("td");
    const resolveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    actions.classList.add("actions-cell");

    resolveButton.textContent = "Resolve";
    resolveButton.classList.add("action-btn","resolve-btn");

    deleteButton.textContent = "Delete";
    deleteButton.classList.add("action-btn","delete-btn");

    actions.appendChild(resolveButton);
    actions.appendChild(deleteButton);
    tableRow.appendChild(actions);
    tableBody.appendChild(tableRow);
    updateStatistics();
    applyFilters();
    exceptionForm.reset();

}
exceptionForm.addEventListener("submit", handleSubmit);

tableBody.addEventListener("click", handleActions);

function handleActions(event) {

    if (event.target.classList.contains("delete-btn")) {

        const row = event.target.closest("tr");

        const confirmDelete = confirm("Are you sure you want to delete this exception?");

        if (confirmDelete) {
                row.remove();
                updateStatistics();
                applyFilters();
            }

        }

        else if (event.target.classList.contains("resolve-btn")){
            const row = event.target.closest("tr");
            const statusCell = row.children[4];
            statusCell.innerHTML = "";
            const badge = document.createElement("span");
            badge.textContent = "Resolved";
            badge.classList.add("status-resolved");
            statusCell.appendChild(badge);
            event.target.disabled = true;
            row.style.backgroundColor = "#f0fdf4";
            updateStatistics();
            applyFilters();
           
        }

}

const totalExceptions = document.getElementById("total-exceptions");
const openExceptions = document.getElementById("open-exceptions");
const resolvedExceptions = document.getElementById("resolved-exceptions");

function updateStatistics(){
    let total=0;
    let open=0;
    let resolved=0;

    for (let row of tableBody.children) {
        total=total+1;
        const statusCell = row.children[4].textContent;

        if (statusCell=="Open"){
            open=open+1;
        }
        else{
            resolved=resolved+1;
        }
    }

    totalExceptions.textContent = total;
    openExceptions.textContent = open;
    resolvedExceptions.textContent = resolved;
    
};

const filterIssue = document.getElementById("issue-filter");
const filterStatus = document.getElementById("status-filter");
const searchInput = document.getElementById("search-input");
filterIssue.addEventListener("change", applyFilters);
filterStatus.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);



function applyFilters(){
    const selectedIssue = filterIssue.value;
    const selectedStatus = filterStatus.value;
    const searchText = searchInput.value.toLowerCase();
    const recordCount = document.getElementById("record-count");
    let visibleRecords = 0;

    for (let row of tableBody.children) {
        
        const issueMatches =selectedIssue == "" ||row.children[2].textContent == selectedIssue;
        const statusMatches =selectedStatus == "" ||row.children[4].textContent == selectedStatus ;
        const delivery = row.children[0].textContent.toLowerCase();
        const customer = row.children[1].textContent.toLowerCase();
        const searchMatches =delivery.includes(searchText) ||customer.includes(searchText);
        if (issueMatches  && statusMatches && searchMatches ){
          row.style.display = ""; 
          visibleRecords++; 
        }
        
        else{
            row.style.display = "none";
        }
        recordCount.textContent = visibleRecords;
}
}
const helpButton = document.getElementById("help-button");

helpButton.addEventListener("click", () => {
    alert(
        "Delivery Exception Dashboard\n\n" +
        "• Fill the form to report a delivery exception.\n" +
        "• Use Resolve to mark an issue as completed.\n" +
        "• Use Delete to remove an exception.\n" +
        "• Use filters and search to quickly find records."
    );
});
