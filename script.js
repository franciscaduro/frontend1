const API_URL = 'http://localhost:3000/alunos';
const CURSOS_URL = 'http://localhost:3000/cursos';


let idParaEliminar = null;


async function carregarCursos() {
  const res = await fetch(CURSOS_URL);
  const cursos = await res.json();

  
  const selectCurso = document.getElementById('curso');
  selectCurso.innerHTML = '<option value="">Selecione um curso</option>';
  cursos.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nomeDoCurso;
    selectCurso.appendChild(option);
  });

  
  const editarCurso = document.getElementById('editarCurso');
  editarCurso.innerHTML = '<option value="">Selecione um curso</option>';
  cursos.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nomeDoCurso;
    editarCurso.appendChild(option);
  });
}
carregarCursos();


document.getElementById('adicionarAluno').addEventListener('submit', async (e) => {
  e.preventDefault();

  
  const anoCurricular = parseInt(document.getElementById('anoCurricular').value);
  if (anoCurricular < 1 || anoCurricular > 3) {
    return;
  }

  
  const idadeValor = parseInt(document.getElementById('idade').value);
  if (idadeValor < 17 || idadeValor > 70) {
    return;
  }

  
  const aluno = {
    nome: document.getElementById('nome').value,
    apelido: document.getElementById('apelido').value,
    curso: parseInt(document.getElementById('curso').value),
    anoCurricular: anoCurricular,
    idade: idadeValor
  };

  
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno)
  });

  
  document.getElementById('adicionarAluno').reset();
  alert('Aluno adicionado com sucesso!');
 
});


document.getElementById('pesquisarBotao').addEventListener('click', pesquisarAluno);


async function pesquisarAluno() {
  document.getElementById('resultadoTitulo').style.display = 'block';
  const nomeTermo = document.getElementById('pesquisarNome').value.toLowerCase();
  const apelidoTermo = document.getElementById('pesquisarApelido').value.toLowerCase();

  
  const res = await fetch(API_URL);
  const alunos = await res.json();

  
  const cursosRes = await fetch(CURSOS_URL);
  const cursos = await cursosRes.json();

  
  const resultado = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(nomeTermo) &&
    aluno.apelido.toLowerCase().includes(apelidoTermo)
  );

 
  const resultadoDiv = document.getElementById('resultadoPesquisa');
  resultadoDiv.innerHTML = '';

  if (resultado.length === 0) {
    resultadoDiv.innerHTML = '<p>Aluno não encontrado.</p>';
    return;
  }

  resultado.forEach(aluno => {
    const nomeCurso = cursos.find(curso => parseInt(curso.id) === aluno.curso)?.nomeDoCurso || 'Curso desconhecido';

    const alunoDiv = document.createElement('div');
    alunoDiv.innerHTML = `
      <p>
        ${aluno.nome} ${aluno.apelido} - Curso: ${nomeCurso} - Ano: ${aluno.anoCurricular} - Idade: ${aluno.idade}
      </p>
<div class="botoes">
    <button class="editar" onclick='editarAluno(${JSON.stringify(aluno)})'>Editar</button>
    <button class="eliminar" onclick='apagarAluno("${aluno.id}")'>Eliminar</button>
  </div>
`;
    resultadoDiv.appendChild(alunoDiv);
  });
}


async function editarAluno(aluno) {
  
  document.getElementById('confirmarEliminacao').style.display = 'none';
  idParaEliminar = null;

  
  document.getElementById('editarTitulo').style.display = 'block';
  document.getElementById('editarAluno').style.display = 'block';

  
  document.getElementById('editarId').value = aluno.id;
  document.getElementById('editarNome').value = aluno.nome;
  document.getElementById('editarApelido').value = aluno.apelido;
  document.getElementById('editarCurso').value = aluno.curso;
  document.getElementById('editarAnoCurricular').value = aluno.anoCurricular;
  document.getElementById('editarIdade').value = aluno.idade;
}


document.getElementById('editarAluno').addEventListener('submit', async (e) => {
  e.preventDefault();

  
  const novoAnoCurricular = parseInt(document.getElementById('editarAnoCurricular').value);
  if (novoAnoCurricular < 1 || novoAnoCurricular > 3) {
    return;
  }

 
  const novaIdade = parseInt(document.getElementById('editarIdade').value);
  if (novaIdade < 17 || novaIdade > 70) {
    return;
  }

  
  const alunoAtualizado = {
    nome: document.getElementById('editarNome').value,
    apelido: document.getElementById('editarApelido').value,
    curso: parseInt(document.getElementById('editarCurso').value),
    anoCurricular: novoAnoCurricular,
    idade: novaIdade
  };

  const alunoId = document.getElementById('editarId').value;


  await fetch(`${API_URL}/${alunoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alunoAtualizado)
  });

  alert('Aluno atualizado com sucesso!');

 
  document.getElementById('editarAluno').reset();
  document.getElementById('editarAluno').style.display = 'none';
  document.getElementById('editarTitulo').style.display = 'none';
  pesquisarAluno();
});


document.getElementById('cancelarEdicao').addEventListener('click', () => {
  
  document.getElementById('editarAluno').reset();
  document.getElementById('editarAluno').style.display = 'none';
  document.getElementById('editarTitulo').style.display = 'none';
});


async function apagarAluno(id) {
 
  document.getElementById('editarAluno').style.display = 'none';
  document.getElementById('editarTitulo').style.display = 'none';

 
  idParaEliminar = id;

  document.getElementById('confirmarEliminacao').style.display = 'block';
  
}

document.getElementById('botaoConfirmarEliminacao').addEventListener('click', async () => {
  if (!idParaEliminar) return;

  await fetch(`${API_URL}/${idParaEliminar}`, { method: 'DELETE' });

  alert('Aluno eliminado com sucesso!');
  idParaEliminar = null;

  
  document.getElementById('confirmarEliminacao').style.display = 'none';
  pesquisarAluno();
});


document.getElementById('botaoCancelarEliminacao').addEventListener('click', () => {
  idParaEliminar = null;
  document.getElementById('confirmarEliminacao').style.display = 'none';
});
