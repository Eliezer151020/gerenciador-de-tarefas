
const formulario = document.querySelector("#formulario");
const campo = document.querySelector("#tarefa");
const campoPrioridade = document.querySelector("#prioridade");

const lista = document.querySelector("#lista-tarefas");
const listaConcluidas = document.querySelector("#lista-concluidas");
const mensagemVazia = document.querySelector("#mensagem-vazia");
const resumo = document.querySelector("#resumo");

// ========================================
// FILTROS
// ========================================

const botoesFiltro = document.querySelectorAll(".filtro");

let filtroAtual = "todas";

// ========================================
// PRIORIDADES DISPONÍVEIS
// ========================================

const prioridades = {
    alta: "Alta",
    media: "Média",
    baixa: "Baixa"
};

// PESOS UTILIZADOS NA ORDENAÇÃO
const pesosPrioridade = {
    alta: 3,
    media: 2,
    baixa: 1
};

// ========================================
// CARREGAR TAREFAS SALVAS
// ========================================

let tarefas = [];

try {
    const salvas = JSON.parse(
        localStorage.getItem("tarefas") || "[]"
    );

    tarefas = Array.isArray(salvas) ? salvas : [];
} catch {
    tarefas = [];
}

// ========================================
// VALIDAR PRIORIDADE
// ========================================

function validarPrioridade(prioridade) {
    return Object.hasOwn(prioridades, prioridade)
        ? prioridade
        : "media";
}

// ========================================
// SALVAR TAREFAS
// ========================================

function salvarTarefas() {
    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );
}

// ========================================
// ETAPA 6 - ORDENAR POR PRIORIDADE
// ========================================

function ordenarTarefas(listaDeTarefas) {

    // CRIAR CÓPIA DO ARRAY ORIGINAL
    const listaOrdenada = [...listaDeTarefas];

    // ORDENAR DA MAIOR PARA A MENOR PRIORIDADE
    listaOrdenada.sort((a, b) => {

        const prioridadeA = validarPrioridade(
            a.prioridade
        );

        const prioridadeB = validarPrioridade(
            b.prioridade
        );

        const pesoA = pesosPrioridade[prioridadeA];
        const pesoB = pesosPrioridade[prioridadeB];

        return pesoB - pesoA;
    });

    return listaOrdenada;
}

// ========================================
// CRIAR ELEMENTO VISUAL DA TAREFA
// ========================================

function criarItem(tarefa) {

    const item = document.createElement("li");
    item.className = "item-tarefa";

    if (tarefa.concluida) {
        item.classList.add("concluida");
    }

    // ====================================
    // CHECKBOX
    // ====================================

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(tarefa.concluida);

    checkbox.setAttribute(
        "aria-label",
        `Marcar tarefa ${tarefa.texto} como concluída`
    );

    checkbox.addEventListener("change", () => {

        tarefa.concluida = checkbox.checked;

        salvarTarefas();
        mostrarTarefas();
    });

    // ====================================
    // TEXTO DA TAREFA
    // ====================================

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    // ====================================
    // INDICADOR DE PRIORIDADE
    // ====================================

    const prioridade = validarPrioridade(
        tarefa.prioridade
    );

    const indicador = document.createElement("span");

    indicador.className =
        `prioridade prioridade-${prioridade}`;

    indicador.textContent = prioridades[prioridade];

    indicador.setAttribute(
        "aria-label",
        `Prioridade ${prioridades[prioridade]}`
    );

    // ====================================
    // BOTÃO EDITAR
    // ====================================

    const editar = document.createElement("button");
    editar.type = "button";
    editar.textContent = "Editar";

    // ====================================
    // BOTÃO EXCLUIR
    // ====================================

    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.textContent = "Excluir";

    excluir.addEventListener("click", () => {

        tarefas = tarefas.filter(
            t => t.id !== tarefa.id
        );

        salvarTarefas();
        mostrarTarefas();
    });

    // ====================================
    // ADICIONAR ELEMENTOS
    // ====================================

    item.append(
        checkbox,
        texto,
        indicador,
        editar,
        excluir
    );

    // ========================================
    // EDITAR NOME E PRIORIDADE NA LISTA
    // ========================================

    editar.addEventListener("click", () => {

        // CAMPO DE EDIÇÃO DO NOME
        const inputEdicao = document.createElement("input");

        inputEdicao.type = "text";
        inputEdicao.value = tarefa.texto;
        inputEdicao.maxLength = 150;
        inputEdicao.className = "campo-edicao";

        inputEdicao.setAttribute(
            "aria-label",
            "Editar nome da tarefa"
        );

        // ====================================
        // SELETOR DE PRIORIDADE
        // ====================================

        const selectPrioridade = document.createElement("select");

        selectPrioridade.className = "prioridade-edicao";

        selectPrioridade.setAttribute(
            "aria-label",
            "Editar prioridade da tarefa"
        );

        const opcoes = [
            { valor: "alta", nome: "Alta" },
            { valor: "media", nome: "Média" },
            { valor: "baixa", nome: "Baixa" }
        ];

        opcoes.forEach(opcao => {

            const option = document.createElement("option");

            option.value = opcao.valor;
            option.textContent = opcao.nome;

            selectPrioridade.appendChild(option);
        });

        selectPrioridade.value = validarPrioridade(
            tarefa.prioridade
        );

        // ====================================
        // BOTÃO SALVAR
        // ====================================

        const salvar = document.createElement("button");
        salvar.type = "button";
        salvar.textContent = "Salvar";
        salvar.className = "botao-salvar";

        // ====================================
        // BOTÃO CANCELAR
        // ====================================

        const cancelar = document.createElement("button");
        cancelar.type = "button";
        cancelar.textContent = "Cancelar";
        cancelar.className = "botao-cancelar";

        // SUBSTITUIR OS ELEMENTOS VISUAIS
        texto.replaceWith(inputEdicao);
        indicador.replaceWith(selectPrioridade);

        // ESCONDER BOTÕES ANTIGOS
        editar.hidden = true;
        excluir.hidden = true;
        checkbox.disabled = true;

        // MOSTRAR BOTÕES DE EDIÇÃO
        item.append(salvar, cancelar);

        // POSICIONAR CURSOR
        inputEdicao.focus();
        inputEdicao.select();

        // ====================================
        // SALVAR ALTERAÇÕES
        // ====================================

        function salvarEdicao() {

            const novoTexto = inputEdicao.value.trim();

            if (novoTexto === "") {

                alert(
                    "O nome da tarefa não pode ficar vazio!"
                );

                inputEdicao.focus();
                return;
            }

            const novaPrioridade = validarPrioridade(
                selectPrioridade.value
            );

            // ATUALIZAR A TAREFA
            tarefa.texto = novoTexto;
            tarefa.prioridade = novaPrioridade;

            // SALVAR NO NAVEGADOR
            salvarTarefas();

            // ATUALIZAR E REORDENAR AS LISTAS
            mostrarTarefas();
        }

        // ====================================
        // CANCELAR EDIÇÃO
        // ====================================

        function cancelarEdicao() {
            mostrarTarefas();
        }

        // EVENTOS DOS BOTÕES
        salvar.addEventListener(
            "click",
            salvarEdicao
        );

        cancelar.addEventListener(
            "click",
            cancelarEdicao
        );

        // ====================================
        // ATALHOS DO TECLADO
        // ====================================

        inputEdicao.addEventListener("keydown", (evento) => {

            if (evento.key === "Enter") {

                evento.preventDefault();
                salvarEdicao();
            }

            if (evento.key === "Escape") {

                evento.preventDefault();
                cancelarEdicao();
            }
        });

        selectPrioridade.addEventListener(
            "keydown",
            (evento) => {

                if (evento.key === "Escape") {

                    evento.preventDefault();
                    cancelarEdicao();
                }
            }
        );
    });

    return item;
}

// ========================================
// VERIFICAR FILTROS
// ========================================

function tarefaPassaFiltro(tarefa) {

    if (filtroAtual === "pendentes") {
        return !tarefa.concluida;
    }

    if (filtroAtual === "concluidas") {
        return Boolean(tarefa.concluida);
    }

    return true;
}

// ========================================
// ATUALIZAR E ORDENAR AS LISTAS
// ========================================

function mostrarTarefas() {

    // LIMPAR LISTAS
    lista.replaceChildren();
    listaConcluidas.replaceChildren();

    // ====================================
    // APLICAR FILTRO E ORDENAÇÃO
    // ====================================

    const tarefasFiltradas = ordenarTarefas(
        tarefas.filter(tarefaPassaFiltro)
    );

    // EXIBIR LISTA PRINCIPAL ORDENADA
    tarefasFiltradas.forEach(tarefa => {

        lista.appendChild(
            criarItem(tarefa)
        );
    });

    // ====================================
    // ORDENAR TAREFAS CONCLUÍDAS
    // ====================================

    const concluidasOrdenadas = ordenarTarefas(
        tarefas.filter(tarefa => tarefa.concluida)
    );

    concluidasOrdenadas.forEach(tarefa => {

        listaConcluidas.appendChild(
            criarItem(tarefa)
        );
    });

    // ====================================
    // MENSAGEM DE LISTA VAZIA
    // ====================================

    mensagemVazia.hidden = tarefasFiltradas.length > 0;

    if (tarefasFiltradas.length === 0) {

        if (filtroAtual === "pendentes") {

            mensagemVazia.textContent =
                "Nenhuma tarefa pendente.";

        } else if (filtroAtual === "concluidas") {

            mensagemVazia.textContent =
                "Nenhuma tarefa concluída.";

        } else {

            mensagemVazia.textContent =
                "Nenhuma tarefa adicionada.";
        }
    }

    // ====================================
    // CALCULAR ESTATÍSTICAS
    // ====================================

    const concluidas = tarefas.filter(
        tarefa => tarefa.concluida
    ).length;

    const pendentes = tarefas.length - concluidas;

    // ATUALIZAR RESUMO
    resumo.textContent =
        `${tarefas.length} tarefas no total. ` +
        `${concluidas} concluídas. ` +
        `${pendentes} pendentes.`;
}

// ========================================
// EVENTOS DOS FILTROS
// ========================================

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        filtroAtual = botao.dataset.filtro;

        // ATUALIZAR BOTÕES ATIVOS
        botoesFiltro.forEach(b => {

            const ativo = b === botao;

            b.classList.toggle(
                "ativo",
                ativo
            );

            b.setAttribute(
                "aria-pressed",
                String(ativo)
            );
        });

        // ATUALIZAR LISTA
        mostrarTarefas();
    });
});

// ========================================
// ADICIONAR NOVA TAREFA
// ========================================

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const texto = campo.value.trim();

    // VALIDAR NOME
    if (texto === "") {

        alert(
            "Digite uma tarefa antes de adicionar!"
        );

        campo.focus();
        return;
    }

    // OBTER PRIORIDADE SELECIONADA
    const prioridade = validarPrioridade(
        campoPrioridade.value
    );

    // CADASTRAR TAREFA
    tarefas.push({
        id: crypto.randomUUID(),
        texto: texto,
        prioridade: prioridade,
        concluida: false
    });

    // SALVAR E REORDENAR AS LISTAS
    salvarTarefas();
    mostrarTarefas();

    // LIMPAR FORMULÁRIO
    campo.value = "";
    campoPrioridade.value = "media";

    campo.focus();
});

// ========================================
// NAVEGAÇÃO DO MENU
// ========================================

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

// EVENTOS DOS LINKS
links.forEach(link => {

    link.addEventListener("click", () => {
        abrirPagina(link.dataset.pagina);
    });
});

// ALTERAÇÃO DA URL
window.addEventListener("hashchange", () => {

    abrirPagina(
        location.hash.substring(1)
    );
});

// ========================================
// INICIALIZAÇÃO
// ========================================

abrirPagina(
    location.hash.substring(1) || "tarefas"
);

mostrarTarefas();
