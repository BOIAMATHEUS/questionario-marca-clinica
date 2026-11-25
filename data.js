/* Conteúdo do questionário. Exemplos escritos para uma clínica inventada ("Clareira"). */

const PALETAS = [
  { id: 'salvia', nome: 'Sálvia e linho', clima: 'Calma, natural, respirável.', por: 'O verde acinzentado acalma sem parecer hospital. O linho deixa tudo quente.',
    cores: [['#F4F0E6', 'Linho', 34], ['#7E9077', 'Sálvia', 26], ['#D9DFCF', 'Névoa', 16], ['#34423A', 'Musgo', 16], ['#C58C62', 'Argila', 8]] },
  { id: 'terracota', nome: 'Terracota acolhedora', clima: 'Calor de casa, conversa sem pressa.', por: 'Tons de barro passam proximidade e afeto. O oliva equilibra e dá seriedade.',
    cores: [['#F7EEE4', 'Areia', 34], ['#B9684B', 'Terracota', 24], ['#E8C7AE', 'Pêssego', 16], ['#4A332A', 'Cacau', 16], ['#8C9A6C', 'Oliva', 10]] },
  { id: 'sereno', nome: 'Azul sereno', clima: 'Confiança, clareza, estabilidade.', por: 'O azul é a cor da confiança. Com areia ao lado, fica humano e não frio.',
    cores: [['#F1F4F3', 'Bruma', 34], ['#3E6D8B', 'Azul', 24], ['#AFC7D4', 'Céu', 16], ['#1E3342', 'Noite', 16], ['#E1B679', 'Areia', 10]] },
  { id: 'lavanda', nome: 'Lavanda e pedra', clima: 'Sensível, contemplativa, gentil.', por: 'O lilás fala de cuidado emocional. O cinza pedra segura para não ficar infantil.',
    cores: [['#F6F4F7', 'Pérola', 34], ['#8B7EA8', 'Lavanda', 24], ['#DAD3E6', 'Lilás', 16], ['#3A3447', 'Ameixa', 16], ['#B4C3A2', 'Chá verde', 10]] },
  { id: 'profundo', nome: 'Verde profundo e areia', clima: 'Sólida, madura, de confiança.', por: 'Verde escuro tem peso de instituição séria. A areia e o cobre deixam acolhedor.',
    cores: [['#F3EDE1', 'Papel', 34], ['#1F4C44', 'Floresta', 26], ['#D7C7A6', 'Areia', 16], ['#0F2521', 'Abismo', 14], ['#C27A4D', 'Cobre', 10]] },
  { id: 'neutros', nome: 'Neutros quentes', clima: 'Minimalista, elegante, silenciosa.', por: 'Quase sem cor: quem fala é a forma e a tipografia. Passa sofisticação.',
    cores: [['#F3EEE7', 'Off-white', 36], ['#8A7967', 'Taupe', 22], ['#CEC3B5', 'Pedra', 18], ['#2A2623', 'Grafite', 16], ['#A3805B', 'Caramelo', 8]] },
  { id: 'contraste', nome: 'Contraste contemporâneo', clima: 'Moderna, direta, com energia.', por: 'Azul cobalto e mostarda fogem do clichê da área e chamam atenção no feed.',
    cores: [['#F2EDE4', 'Creme', 34], ['#2E3AB0', 'Cobalto', 24], ['#F1B84A', 'Mostarda', 14], ['#16161C', 'Tinta', 18], ['#C9CCE8', 'Gelo', 10]] },
  { id: 'aurora', nome: 'Aurora suave', clima: 'Esperança, recomeço, delicadeza.', por: 'Damasco e ameixa lembram o nascer do dia, ideia de recomeço sem ser óbvia.',
    cores: [['#FBF5EE', 'Manhã', 34], ['#D99B6D', 'Damasco', 22], ['#F1D4B8', 'Pêssego', 16], ['#6A4E5D', 'Ameixa', 18], ['#9DB0A3', 'Eucalipto', 10]] },
];

const FONTES = [
  { id: 'cormorant', nome: 'Serifa elegante', tit: "'Cormorant Garamond', serif", tw: 500, txt: "'Manrope', sans-serif", pares: 'Cormorant Garamond + Manrope', clima: 'Clássica, refinada, de tradição.' },
  { id: 'fraunces', nome: 'Serifa acolhedora', tit: "'Fraunces', serif", tw: 400, var: "'SOFT' 100, 'WONK' 0", txt: "'DM Sans', sans-serif", pares: 'Fraunces + DM Sans', clima: 'Calorosa, humana, com personalidade.' },
  { id: 'quicksand', nome: 'Arredondada leve', tit: "'Quicksand', sans-serif", tw: 600, txt: "'Nunito Sans', sans-serif", pares: 'Quicksand + Nunito Sans', clima: 'Suave, amigável, sem pontas.' },
  { id: 'outfit', nome: 'Geométrica moderna', tit: "'Outfit', sans-serif", tw: 500, txt: "'Inter', sans-serif", pares: 'Outfit + Inter', clima: 'Limpa, atual, organizada.' },
  { id: 'bricolage', nome: 'Grotesca contemporânea', tit: "'Bricolage Grotesque', sans-serif", tw: 600, txt: "'Instrument Sans', sans-serif", pares: 'Bricolage Grotesque + Instrument Sans', clima: 'Atual, com caráter, foge do óbvio.' },
  { id: 'instrument', nome: 'Editorial', tit: "'Instrument Serif', serif", tw: 400, txt: "'Figtree', sans-serif", pares: 'Instrument Serif + Figtree', clima: 'Elegante como revista, leve no texto.' },
  { id: 'gloock', nome: 'Serifa marcante', tit: "'Gloock', serif", tw: 400, txt: "'Work Sans', sans-serif", pares: 'Gloock + Work Sans', clima: 'Forte, memorável, com presença.' },
  { id: 'manuscrita', nome: 'Com toque à mão', tit: "'Fraunces', serif", tw: 300, var: "'SOFT' 100", txt: "'DM Sans', sans-serif", mao: "'Caveat', cursive", pares: 'Fraunces + Caveat + DM Sans', clima: 'Pessoal, próxima, como um bilhete.' },
];

const ESTILOS_FONTE = [
  { id: 'arredondada', nome: 'Arredondada', f: "'Quicksand', sans-serif", w: 600, d: 'Pontas suaves, transmite gentileza.' },
  { id: 'serifa', nome: 'Serifada suave', f: "'Fraunces', serif", w: 400, v: "'SOFT' 100", d: 'Tradição e calor ao mesmo tempo.' },
  { id: 'geometrica', nome: 'Geométrica', f: "'Outfit', sans-serif", w: 500, d: 'Círculos e retas, moderna e precisa.' },
  { id: 'humanista', nome: 'Traço humano', f: "'Instrument Serif', serif", w: 400, i: true, d: 'Parece desenhada à mão, com contraste.' },
];

/* Ícones de linha desenhados para a página (viewBox 0 0 48 48). */
const SIMBOLOS = [
  { id: 'psi', nome: 'Letra Ψ (psi)', svg: '<text x="24" y="35" text-anchor="middle" font-size="32" font-family="Cormorant Garamond, serif" fill="currentColor" stroke="none">Ψ</text>' },
  { id: 'cerebro', nome: 'Cérebro', svg: '<path d="M24 10c-3-3-9-2-10 3-4 0-6 4-4 7-3 2-3 7 1 9 0 4 4 6 7 5 1 3 4 4 6 2V10z"/><path d="M24 10c3-3 9-2 10 3 4 0 6 4 4 7 3 2 3 7-1 9 0 4-4 6-7 5-1 3-4 4-6 2"/><path d="M18 18c2 0 3 2 3 4M30 18c-2 0-3 2-3 4M16 27c2-1 4 0 5 2M32 27c-2-1-4 0-5 2"/>' },
  { id: 'cabeca', nome: 'Cabeça de perfil', svg: '<path d="M30 40v-6h4l1-6 3-1-3-5c0-8-6-13-13-13S10 15 10 22c0 4 2 7 5 9v9"/><circle cx="24" cy="22" r="4"/>' },
  { id: 'borboleta', nome: 'Borboleta', svg: '<path d="M24 16v20"/><path d="M24 20c-3-8-14-11-15-5-1 5 6 9 15 7"/><path d="M24 20c3-8 14-11 15-5 1 5-6 9-15 7"/><path d="M24 24c-6 0-12 4-10 9 2 4 8 1 10-5"/><path d="M24 24c6 0 12 4 10 9-2 4-8 1-10-5"/><path d="M24 16l-3-5M24 16l3-5"/>' },
  { id: 'arvore', nome: 'Árvore', svg: '<path d="M24 42V24"/><path d="M24 30l-6-5M24 27l6-5"/><path d="M24 26c-9 0-14-5-12-11 1-5 6-7 9-5 1-5 9-5 10 0 4-1 8 3 6 8-1 6-6 8-13 8z"/>' },
  { id: 'folha', nome: 'Folha ou broto', svg: '<path d="M24 42V22"/><path d="M24 26c-10 0-14-8-13-14 8 0 13 5 13 14z"/><path d="M24 22c0-9 6-14 14-13 1 7-4 13-14 13z"/>' },
  { id: 'quebra', nome: 'Quebra-cabeça', svg: '<path d="M10 14h9c-1-5 7-5 6 0h9v8c5-1 5 7 0 6v8h-8c1 5-7 5-6 0h-10v-9c5 1 5-7 0-6z"/>' },
  { id: 'maos', nome: 'Mãos', svg: '<path d="M8 30c4-1 8-1 11 1l6 2c2 1 1 4-1 3l-6-1"/><path d="M8 38l8-1 10 2c2 0 4-1 6-2l9-7c2-2 0-4-2-3l-8 5"/><path d="M27 21c-3-3-8-1-6 4 1 3 6 6 6 6s5-3 6-6c2-5-3-7-6-4z"/>' },
  { id: 'coracao', nome: 'Coração', svg: '<path d="M24 38S9 29 9 19c0-5 4-8 8-8 3 0 5 2 7 4 2-2 4-4 7-4 4 0 8 3 8 8 0 10-15 19-15 19z"/>' },
  { id: 'casa', nome: 'Casa ou abrigo', svg: '<path d="M9 22L24 10l15 12"/><path d="M13 19v19h22V19"/><path d="M21 38v-9h6v9"/>' },
  { id: 'onda', nome: 'Onda ou água', svg: '<path d="M6 20c4-4 8-4 12 0s8 4 12 0 8-4 12 0"/><path d="M6 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0"/><path d="M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0"/>' },
  { id: 'sol', nome: 'Sol nascendo', svg: '<path d="M6 34h36"/><path d="M14 34a10 10 0 0 1 20 0"/><path d="M24 14v5M12 20l3 3M36 20l-3 3M8 28h3M37 28h3"/>' },
  { id: 'porta', nome: 'Porta ou caminho', svg: '<path d="M14 40V12a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v28"/><path d="M10 40h28"/><path d="M14 10l10 4v26"/><circle cx="21" cy="27" r="1" fill="currentColor"/>' },
  { id: 'elo', nome: 'Elos ou círculos unidos', svg: '<circle cx="18" cy="24" r="9"/><circle cx="30" cy="24" r="9"/>' },
  { id: 'espiral', nome: 'Espiral', svg: '<path d="M24 24c0-2 2-3 3-2 2 1 2 4 0 5-3 2-7 0-7-4 0-4 4-7 8-6 5 1 8 6 6 11-2 6-9 8-14 6-6-3-8-10-5-16"/>' },
  { id: 'abstrato', nome: 'Forma abstrata própria', svg: '<path d="M12 30c0-10 8-18 18-18 4 0 6 3 6 6 0 10-8 18-18 18-4 0-6-3-6-6z"/><circle cx="31" cy="31" r="5"/>' },
];

const COMBOS = [
  { s: ['psi', 'folha'], d: 'A letra da psicologia que vira planta: ciência que cresce.' },
  { s: ['cabeca', 'folha'], d: 'A mente que floresce.' },
  { s: ['elo', 'folha'], d: 'O vínculo que faz crescer.' },
  { s: ['casa', 'coracao'], d: 'Um lugar seguro, com afeto.' },
  { s: ['porta', 'sol'], d: 'Abrir a porta para um novo começo.' },
  { s: ['onda', 'espiral'], d: 'Movimento e calma ao mesmo tempo.' },
];

const PALAVRAS = ['Acolhimento', 'Escuta', 'Ciência', 'Leveza', 'Coragem', 'Cuidado', 'Confiança', 'Clareza', 'Profundidade', 'Movimento', 'Pertencimento', 'Transformação', 'Segurança', 'Autonomia', 'Presença', 'Ética', 'Afeto', 'Equilíbrio', 'Recomeço', 'Vínculo', 'Humanidade', 'Calma'];

const NOMES_DIRECOES = [
  { id: 'conceito', nome: 'Uma ideia', ex: 'Travessia, Abrigo, Raiz, Elo, Clareira', d: 'Uma palavra que resume o que a clínica faz pelas pessoas.' },
  { id: 'natureza', nome: 'Natureza', ex: 'Ipê, Maré, Bambu, Sálvia, Aurora', d: 'Uma imagem da natureza que carrega um significado.' },
  { id: 'classico', nome: 'Grego ou latim', ex: 'Psyché, Ethos, Anima, Kairós, Logos', d: 'Palavras antigas ligadas à mente e ao tempo.' },
  { id: 'lugar', nome: 'O lugar', ex: 'Casa da Ponte, Espaço Centro, Ateliê da Rua 7', d: 'O bairro, a rua ou a casa onde a clínica fica.' },
  { id: 'fundador', nome: 'O seu nome', ex: 'Clínica Vinicius Prado, Espaço Prado', d: 'Seu sobrenome, como em escritórios e consultórios.' },
  { id: 'sigla', nome: 'Sigla ou nome curto', ex: 'CPV, Núcleo M, Espaço 3', d: 'Curto, fácil de lembrar e de escrever.' },
];

const STEPS = [
  { id: 'inicio', t: 'Começo' },

  { id: 'clinica', t: 'A clínica', num: '01', min: 5, titulo: ['A clínica', 'e o nome'], lead: 'Comece pelo básico: como a clínica vai se chamar, onde vai ficar e por que ela vai existir.',
    blocks: [
      { type: 'nome' },
      { id: 'nome_sentido', type: 'textarea', label: 'O que esse nome significa para você?', help: 'Se ainda não tem nome, conte o que gostaria que ele transmitisse.', ex: 'Clareira é o espaço aberto no meio da mata, onde a luz entra. Quero que a clínica seja esse respiro no meio da correria.' },
      { id: 'descritor', type: 'chips', label: 'Como a clínica vai se apresentar embaixo do nome?', help: 'Escolha uma ou escreva a sua.', options: ['Clínica de Psicologia', 'Psicologia e Saúde Mental', 'Centro de Psicologia', 'Espaço de Psicoterapia', 'Consultório de Psicologia', 'Psicologia Clínica'], outro: true, max: 1 },
      { id: 'por_que', type: 'textarea', label: 'Por que você decidiu abrir a clínica?', help: 'A história real, do jeito que contaria para um amigo.', ex: 'Depois de anos atendendo em salas alugadas, quero um espaço meu, com a minha cara, onde o paciente se sinta em casa desde a recepção.' },
      { id: 'abordagens', type: 'chips', label: 'Quais abordagens a clínica pretende oferecer?', help: 'Marque todas, inclusive as que você pensa em trazer mais para a frente.', options: ['TCC', 'Psicanálise', 'Humanista / ACP', 'Gestalt', 'Sistêmica', 'Análise do Comportamento', 'ACT', 'Terapia do Esquema', 'EMDR', 'Junguiana'], outro: true },
      { id: 'servicos', type: 'chips', label: 'Que serviços você pretende ter?', help: 'Marque o que já está nos planos.', options: ['Psicoterapia individual', 'Terapia de casal', 'Terapia familiar', 'Atendimento infantil', 'Avaliação psicológica', 'Orientação de pais', 'Grupos terapêuticos', 'Palestras e empresas'], outro: true },
      { id: 'endereco', type: 'textarea', label: 'Qual vai ser o endereço da clínica?', help: 'Rua, número e bairro em Itatiba. Se ainda não estiver fechado, conte a região que você está pensando.', ex: 'Rua das Flores, 120, Centro, Itatiba. Casa térrea com jardim na frente.' },
      { id: 'modalidade', type: 'chips', label: 'Como você vai atender?', options: ['Presencial', 'Online', 'Os dois'], max: 1 },
      { id: 'inauguracao', type: 'text', label: 'Quando a clínica deve abrir?', ex: 'Março de 2027' },
      { id: 'instagram', type: 'text', label: '@ do Instagram, se já tiver criado', ex: '@clinicaclareira' },
    ] },

  { id: 'publico', t: 'Público', num: '02', min: 4, titulo: ['Para quem', 'é a clínica'], lead: 'A marca precisa falar com quem você quer receber. Quanto mais claro, mais certeira ela fica.',
    blocks: [
      { id: 'publicos', type: 'chips', label: 'Quem você pretende atender?', help: 'Marque todos.', options: ['Crianças', 'Adolescentes', 'Adultos', 'Idosos', 'Casais', 'Famílias', 'Gestantes e puérperas', 'Neurodivergentes', 'LGBTQIAPN+', 'Empresas'], outro: true },
      { id: 'principal', type: 'text', label: 'Se tivesse que escolher um público principal, qual seria?', ex: 'Adultos de 25 a 45 anos, profissionais cansados.' },
      { id: 'queixas', type: 'textarea', label: 'Com o que você imagina que as pessoas vão chegar?', ex: 'Ansiedade, esgotamento no trabalho, luto, conflitos no relacionamento.' },
      { id: 'persona', type: 'textarea', label: 'Descreva o paciente que você quer receber', help: 'Idade, rotina, o que sente quando procura ajuda, o que pesa na decisão.', ex: 'Marina, 34 anos, gerente e mãe de um menino de 6. Adia a terapia há dois anos por falta de tempo e medo de ser julgada. Vai escolher pela indicação de uma amiga e porque o Instagram parece leve e sério ao mesmo tempo.' },
      { id: 'pagamento', type: 'chips', label: 'Como pretende cobrar?', options: ['Particular', 'Convênio', 'Particular e convênio', 'Com valor social também'], max: 1 },
      { id: 'faixa', type: 'slider', label: 'Como você quer se posicionar em preço em Itatiba?', esq: 'Acessível', esqD: 'Para muita gente, o preço decide.', dir: 'Premium', dirD: 'Atendimento exclusivo, valor mais alto.' },
      { id: 'canais', type: 'chips', label: 'Por onde você imagina que os pacientes vão chegar?', options: ['Indicação', 'Google', 'Instagram', 'Convênio', 'Médicos e escolas', 'Empresas'], outro: true },
    ] },

  { id: 'essencia', t: 'Essência', num: '03', min: 4, titulo: ['O que a clínica', 'vai ser por dentro'], lead: 'Daqui sai o conceito da marca. Responda sem pensar em design, só no que você acredita.',
    blocks: [
      { id: 'frase', type: 'textarea', label: 'Em uma frase: o que a clínica vai fazer pela vida de alguém?', ex: 'Ajudar pessoas cansadas a entenderem o que sentem e a voltarem a escolher a própria vida.' },
      { id: 'palavras', type: 'chips', label: 'Escolha até 3 palavras que são a cara da clínica', options: PALAVRAS, outro: true, max: 3 },
      { id: 'sentir', type: 'textarea', label: 'O que a pessoa deve sentir ao entrar na clínica?', ex: 'Alívio. Que pode respirar, que ninguém está com pressa e que está num lugar sério.' },
      { id: 'diferencial', type: 'textarea', label: 'O que a sua clínica vai ter que as outras de Itatiba não têm?', ex: 'Escuta sem pressa, horário pontual, retorno claro para a família e um espaço que parece casa, não consultório.' },
      { id: 'nunca', type: 'chips', label: 'A clínica nunca pode parecer...', help: 'Marque o que deve ficar longe.', options: ['Hospital ou laboratório', 'Coach ou autoajuda', 'Infantil demais', 'Fria e distante', 'Mística ou esotérica', 'Luxo inacessível', 'Barata ou improvisada', 'Igual a todas as outras'], outro: true },
    ] },

  { id: 'personalidade', t: 'Personalidade', num: '04', min: 2, titulo: ['Se a clínica', 'fosse uma pessoa'], lead: 'Arraste cada barra para o lado que mais combina. Ficar no meio também é uma resposta.',
    blocks: [
      { id: 'p_acolhedora', type: 'slider', esq: 'Acolhedora', esqD: 'Abraço, conversa, café.', dir: 'Técnica', dirD: 'Precisão, método, dados.' },
      { id: 'p_classica', type: 'slider', esq: 'Clássica', esqD: 'Tradição, sobriedade.', dir: 'Atual', dirD: 'Moderna, fora do padrão.' },
      { id: 'p_leve', type: 'slider', esq: 'Leve', esqD: 'Sorriso, cor, respiro.', dir: 'Séria', dirD: 'Peso, formalidade.' },
      { id: 'p_delicada', type: 'slider', esq: 'Delicada', esqD: 'Traço fino, sutileza.', dir: 'Marcante', dirD: 'Traço forte, presença.' },
      { id: 'p_minimal', type: 'slider', esq: 'Minimalista', esqD: 'Pouco elemento, muito espaço.', dir: 'Detalhada', dirD: 'Textura, ilustração, camadas.' },
      { id: 'p_organica', type: 'slider', esq: 'Orgânica', esqD: 'Curvas, natureza, mão.', dir: 'Geométrica', dirD: 'Retas, grid, precisão.' },
      { id: 'p_quente', type: 'slider', esq: 'Quente', esqD: 'Terra, sol, pele.', dir: 'Fria', dirD: 'Azul, cinza, calma.' },
      { id: 'p_silenciosa', type: 'slider', esq: 'Discreta', esqD: 'Silenciosa, elegante.', dir: 'Expressiva', dirD: 'Chama atenção no feed.' },
    ] },

  { id: 'logo', t: 'Logo', num: '05', min: 6, titulo: ['Logos que', 'inspiram'], lead: 'Referências reais de estúdios de design. Marque Amei, Talvez ou Não em cada uma e comente o que chamou atenção. O que você rejeita também me ajuda.',
    blocks: [
      { id: 'tipos', type: 'tipos' },
      { id: 'galeria', type: 'galeria', cats: ['nome', 'simbolo', 'monograma', 'selo', 'organico', 'geometrico', 'sistema'] },
      { id: 'up_logo', type: 'upload', mini: true, opc: true, label: 'Tem algum logo que você gosta? Mande aqui', help: 'Prints de logos de qualquer marca ou área. Escreva o que chamou atenção em cada um.', exc: 'Logo de uma cafeteria de Campinas. Gosto de como a letra é arredondada e simples.' },
    ] },

  { id: 'simbolos', t: 'Símbolos', num: '06', min: 3, titulo: ['Símbolos', 'e ideias'], lead: 'Estes desenhos são exemplos de ideias, não o logo final. Marque o que combina com a clínica.',
    blocks: [
      { id: 'simb', type: 'simbolos' },
      { id: 'combo', type: 'combo' },
      { id: 'simbolo_ideia', type: 'textarea', label: 'Existe alguma imagem ligada à sua história?', help: 'Um objeto, um lugar, uma lembrança.', ex: 'O ipê que vou plantar na frente da clínica. Ou a janela grande da sala de espera.' },
    ] },

  { id: 'cores', t: 'Cores', num: '07', min: 3, titulo: ['Cores que', 'contam a história'], lead: 'Oito propostas pensadas para uma clínica de psicologia, já aplicadas num cartão e num post. Avalie cada uma e comente.',
    blocks: [
      { id: 'paletas', type: 'paletas' },
      { id: 'minhapaleta', type: 'minhapaleta', opc: true, label: 'Quer montar a sua própria paleta?', help: 'Toque no + para adicionar uma cor e escolha o tom. Dá para usar até 6 cores.' },
      { id: 'up_cores', type: 'upload', mini: true, opc: true, label: 'Mande um print de algo com cores que você gosta', help: 'Uma foto, um lugar, uma roupa, um post. Qualquer coisa que tenha a sensação certa.', exc: 'Foto de uma pousada na serra. Gosto do verde escuro com a madeira e o linho cru.' },
      { id: 'cores_nao', type: 'chips', label: 'Alguma cor que você não quer de jeito nenhum?', options: ['Vermelho', 'Laranja forte', 'Amarelo', 'Rosa', 'Roxo', 'Azul', 'Verde', 'Marrom', 'Preto', 'Cinza'], outro: true },
      { id: 'cores_sim', type: 'text', label: 'Alguma cor que precisa estar, por gosto ou história?', ex: 'Um verde, porque a sala vai ter muitas plantas.' },
    ] },

  { id: 'fontes', t: 'Letras', num: '08', min: 3, titulo: ['Letras e', 'a fonte própria'], lead: 'Digite o nome da clínica e veja como ele fica em cada estilo. A fonte própria da marca nasce da direção escolhida aqui.',
    blocks: [
      { id: 'fontes', type: 'fontes' },
      { id: 'estilo_fonte', type: 'estilos', label: 'Para a fonte exclusiva da clínica, qual caminho agrada mais?' },
      { id: 'up_fontes', type: 'upload', mini: true, opc: true, label: 'Tem alguma letra que você gosta? Mande de inspiração', help: 'Print de uma placa, embalagem, revista, logo ou site. Pode ser só um detalhe que chamou atenção.', exc: 'Letreiro de uma livraria. Gosto da letra fina e alta, parece calma e elegante.' },
      { id: 'fonte_nome', type: 'text', opc: true, label: 'Sabe o nome de alguma fonte que você gosta?', ex: 'Gosto da letra do Spotify e da do Airbnb.' },
    ] },

  { id: 'clima', t: 'Clima', num: '09', min: 2, titulo: ['O clima', 'das imagens'], lead: 'Ambientes reais que ajudam a imaginar como a marca vai se sentir no espaço e nas fotos.',
    blocks: [
      { id: 'galeria_amb', type: 'galeria', cats: ['ambiente'] },
      { id: 'imagens', type: 'chips', label: 'Que tipo de imagem combina com a clínica?', options: ['Fotos minhas', 'Fotos do espaço', 'Ilustrações', 'Texturas e formas', 'Natureza e luz', 'Pouca imagem, mais texto'], outro: true },
    ] },

  { id: 'referencias', t: 'Suas refs', num: '10', min: 4, titulo: ['Agora é', 'a sua vez'], lead: 'Mande o que já tem: fotos do espaço, prints de marcas que você gosta, rascunhos. E deixe os links de quem você admira.',
    blocks: [
      { id: 'upload', type: 'upload' },
      { id: 'links', type: 'links' },
      { id: 'admiram', type: 'textarea', label: 'Marcas que você admira, de qualquer área', help: 'Café, roupa, hotel, outra clínica. Diga o porquê.', ex: 'Aesop, pela calma das lojas. Um hotel pequeno que visitei, pela recepção que parece sala de estar.' },
      { id: 'concorrentes', type: 'textarea', label: 'Clínicas de Itatiba e região que você conhece', help: 'Quais você respeita e de quais quer se diferenciar.', ex: 'A Clínica X é muito boa, mas a marca é fria e parece hospital. Quero o oposto.' },
      { id: 'final', type: 'textarea', label: 'Algo que eu não perguntei e você quer dizer?', ex: 'Quero que a marca funcione bem no Instagram, porque é lá que mais gente vai me conhecer.' },
    ] },

  { id: 'envio', t: 'Envio', num: '11', titulo: ['Revisar', 'e enviar'] },
];

const CATS = {
  nome: { t: 'Só o nome', d: 'O nome desenhado com cuidado, sem símbolo.' },
  simbolo: { t: 'Símbolo e nome', d: 'Um desenho próprio ao lado do nome.' },
  monograma: { t: 'Monograma', d: 'Iniciais combinadas num sinal único.' },
  selo: { t: 'Selo ou emblema', d: 'Tudo dentro de uma forma, como um carimbo.' },
  organico: { t: 'Orgânico', d: 'Curvas, natureza e traço de mão.' },
  geometrico: { t: 'Geométrico', d: 'Formas simples, retas e círculos.' },
  sistema: { t: 'Marca aplicada', d: 'A identidade inteira em uso: cartão, papelaria, Instagram.' },
  ambiente: { t: 'Ambientes', d: 'Clima de espaço e de foto.' },
};
