const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
categoryInput = popupBox.querySelector(".categoryInput"),
colorInput = popupBox.querySelector(".colorInput"),

addBtn = popupBox.querySelector("button");

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
              "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

const categories = localStorage.getItem('categoriasNotas');
let categoriasParsed;

if (categories) {
  categoriasParsed = new Map(JSON.parse(categories));
} else {
  categoriasParsed = new Map();
}


let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Añade nueva nota";
    addBtn.innerText = "Añadir nota";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let desc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="category" >
                            <div class="corner-background" style="background-color: ${note.color === undefined ? '#fff' : note.color} "></div>
                            <p>-${note.category === undefined ? 'Sin categoría' : note.category}-</p>
                        </div>
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${desc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${desc}')"><i class="uil uil-pen"></i>Editar</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Borrar</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("¿Estás seguro de borrar esta nota?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc, category) {
    let description = desc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    category.value = category;

    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();
    category = categoryInput.value.trim();
    color = colorInput.value.trim();
    console.log(color)
    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, category, color, date: ` ${day} de ${month}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        if (!categoriasParsed.has(category)) {
            categoriasParsed.set(category, []);
          }
        categoriasParsed.get(category).push(notes.length-1);
        console.log(categoriasParsed)
        const categoriasNotasJSON = JSON.stringify(Array.from(categoriasParsed.entries()));
        localStorage.setItem('categoriasNotas', categoriasNotasJSON);
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});

function initChart() {
const categoriasNotasJSON = localStorage.getItem('categoriasNotas');
let categoriasNotas;

if (categoriasNotasJSON) {
  categoriasNotas = new Map(JSON.parse(categoriasNotasJSON));
} else {
  categoriasNotas = new Map();
}

const labels = Array.from(categoriasNotas.keys());
const data = Array.from(categoriasNotas.values()).map(arr => arr.length);

const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Número de Notas',
      data: data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

}
initChart();

function initPieChart() {
const categoriasNotasJSON = localStorage.getItem('categoriasNotas');
let categoriasNotas;

if (categoriasNotasJSON) {
  categoriasNotas = new Map(JSON.parse(categoriasNotasJSON));
} else {
  categoriasNotas = new Map();
}

const labels = Array.from(categoriasNotas.keys());
const data = Array.from(categoriasNotas.values()).map(arr => arr.length);

const ctx = document.getElementById('myPieChart').getContext('2d');

const myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  }
});

}
initPieChart();
