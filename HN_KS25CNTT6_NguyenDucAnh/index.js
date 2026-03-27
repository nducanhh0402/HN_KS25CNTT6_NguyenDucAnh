
let employees = JSON.parse(localStorage.getItem("employeeData")) || [];
let editingId = null; 
let searchQuery = "";

const tableBody = document.getElementById("tableBody");
const btnSubmit = document.getElementById("btnSubmit");
const formTitle = document.getElementById("formTitle");
const totalBadge = document.getElementById("totalBadge");
const emptyState = document.getElementById("emptyState");
const inputSearch = document.getElementById("inputSearch");

const inputName = document.getElementById("inputName");
const inputDob = document.getElementById("inputDob");
const inputEmail = document.getElementById("inputEmail");
const inputAddress = document.getElementById("inputAddress");

// HIỂN THỊ, TÌM KIẾM 
function renderTable() {
    const filteredEmployees = employees.filter(emp => {
        const nameMatch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || emailMatch;
    });

    tableBody.innerHTML = "";

    if (filteredEmployees.length === 0) {
        emptyState.style.display = "block";
        const msg = searchQuery !== "" 
            ? "Không tìm thấy nhân viên phù hợp." 
            : "Chưa có nhân viên nào. Hãy thêm nhân viên đầu tiên!";
        emptyState.querySelector("p").innerText = msg;
    } else {
        emptyState.style.display = "none";
        
        filteredEmployees.forEach((emp, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="td-name">${emp.fullName}</td>
                <td>${formatDateDisplay(emp.dob)}</td>
                <td class="td-email">${emp.email}</td>
                <td>${emp.address || "---"}</td>
                <td>
                    <div class="td-actions">
                        <button class="btn btn-sm btn-edit" onclick="prepareEdit('${emp.id}')">✏ Sửa</button>
                        <button class="btn btn-sm btn-delete" onclick="deleteEmployee('${emp.id}')">✕ Xóa</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    totalBadge.innerText = `${employees.length} nhân viên`;
    document.getElementById("listCount").innerText = `${filteredEmployees.length} kết quả`;
}

//THÊM, CẬP NHẬT 
btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();

    const nameValue = inputName.value.trim();
    const dobValue = inputDob.value;
    const emailValue = inputEmail.value.trim();
    const addrValue = inputAddress.value.trim();

    if (!nameValue || !dobValue || !emailValue) {
        alert("Vui lòng điền đầy đủ các trường có dấu (*)");
        return;
    }

    if (editingId) {
        const index = employees.findIndex(emp => emp.id === editingId);
        if (index !== -1) {
            employees[index] = { ...employees[index], 
                fullName: nameValue, 
                dob: dobValue, 
                email: emailValue, 
                address: addrValue 
            };
            alert("Cập nhật thành công!");
        }
        editingId = null;
    } else {
        const newEmployee = {
            id: "NV-" + Date.now(), // ID duy nhất dựa trên thời gian
            fullName: nameValue,
            dob: dobValue,
            email: emailValue,
            address: addrValue
        };
        employees.push(newEmployee);
        alert("Thêm nhân viên thành công!");
    }

    saveAndRefresh();
    resetForm();
});

function prepareEdit(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    editingId = id;
    inputName.value = emp.fullName;
    inputDob.value = emp.dob;
    inputEmail.value = emp.email;
    inputAddress.value = emp.address;

    formTitle.innerText = "Cập nhật nhân viên";
    btnSubmit.innerText = "Lưu thay đổi";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// XÓA 
function deleteEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    if (confirm(`Bạn có chắc muốn xóa nhân viên [${emp.fullName}] không?`)) {
        employees = employees.filter(e => e.id !== id);
        saveAndRefresh();
        alert("Xóa thành công!");
    }
}

// TÌM KIẾM 
inputSearch.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderTable(); // Vẽ lại bảng mỗi khi người dùng gõ phím
});

//HÀM HỖ TRỢ

function saveAndRefresh() {
    localStorage.setItem("employeeData", JSON.stringify(employees));
    renderTable();
}

function resetForm() {
    editingId = null;
    inputName.value = "";
    inputDob.value = "";
    inputEmail.value = "";
    inputAddress.value = "";
    formTitle.innerText = "Thêm nhân viên mới";
    btnSubmit.innerText = "Thêm nhân viên";
}

function formatDateDisplay(dateStr) {
    if (!dateStr) return "---";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

document.querySelector(".btn-secondary").addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
});

renderTable();