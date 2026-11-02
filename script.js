
const formulario = document.querySelector("#formulario");
const campo = document.querySelector("#tarefa");
const lista = document.querySelector("#lista-tarefas");
const listaConcluidas = document.querySelector("#lista-concluidas");
const mensagemVazia = document.querySelector("#mensagem-vazia");
const resumo = document.querySelector("#resumo");

let tarefas = [];

try {
    const salvas = JSON.parse(
        localStorage.getItem("tarefas") || "[]"
    );

    tarefas = Array.isArray(salvas) ? salvas : [];
} catch {
    tarefas = [];
}

// SALVAR AS TAREFAS
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// CRIAR ELEMENTO VISUAL
function criarItem(tarefa) {
    const item = document.createElement("li");
    item.className = "item-tarefa";

    if (tarefa.concluida) {
        item.classList.add("concluida");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;

    checkbox.addEventListener("change", () => {
        tarefa.concluida = checkbox.checked;
        salvarTarefas();
        mostrarTarefas();
    });

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    
    const editar = document.createElement("button");
    editar.textContent = "Editar";


    const excluir = document.createElement("button");
    excluir.textContent = "Excluir";

    excluir.addEventListener("click", () => {
        tarefas = tarefas.filter(t => t.id !== tarefa.id);
        salvarTarefas();
        mostrarTarefas();
    });

    item.append(checkbox, texto,editar, excluir);

    return item;
}

// ATUALIZAR AS LISTAS
function mostrarTarefas() {
    lista.replaceChildren();
    listaConcluidas.replaceChildren();

    tarefas.forEach(tarefa => {
        lista.appendChild(criarItem(tarefa));

        if (tarefa.concluida) {
            listaConcluidas.appendChild(criarItem(tarefa));
        }
    });

    mensagemVazia.hidden = tarefas.length > 0;

    const concluidas = tarefas.filter(t => t.concluida).length;

    resumo.textContent =
        `${tarefas.length} tarefas no total. ` +
        `${concluidas} concluídas. ` +
        `${tarefas.length - concluidas} pendentes.`;
}

// ADICIONAR TAREFA
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const texto = campo.value.trim();

    if (texto === "") {
        return;
    }

    tarefas.push({
        id: crypto.randomUUID(),
        texto: texto,
        concluida: false
    });

    salvarTarefas();
    mostrarTarefas();

    campo.value = "";
    campo.focus();
});

// NAVEGAÇÃO DO MENU
const links = document.querySelectorAll("#menu a");
const paginas = document.querySelectorAll(".pagina");

function abrirPagina(nome) {
    const existe = document.getElementById(nome);

    if (!existe || !existe.classList.contains("pagina")) {
        nome = "tarefas";
    }

    paginas.forEach(pagina => {
        pagina.hidden = pagina.id !== nome;
    });

    links.forEach(link => {
        link.classList.toggle(
            "ativo",
            link.dataset.pagina === nome
        );
    });
}

links.forEach(link => {
    link.addEventListener("click", () => {
        abrirPagina(link.dataset.pagina);
    });
});

window.addEventListener("hashchange", () => {
    abrirPagina(location.hash.substring(1));
});

// INICIALIZAÇÃO
abrirPagina(location.hash.substring(1) || "tarefas");
mostrarTarefas();
