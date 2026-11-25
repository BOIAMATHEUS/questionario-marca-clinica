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
  { s: ['elo', 'folha'], d: 'Uma equipe unida que faz o paciente crescer.' },
  { s: ['casa', 'coracao'], d: 'Um lugar seguro, com afeto.' },
  { s: ['porta', 'sol'], d: 'Abrir a porta para um novo começo.' },
  { s: ['onda', 'espiral'], d: 'Movimento e calma ao mesmo tempo.' },
];

const PALAVRAS = ['Acolhimento', 'Escuta', 'Ciência', 'Leveza', 'Coragem', 'Cuidado', 'Confiança', 'Clareza', 'Profundidade', 'Movimento', 'Pertencimento', 'Transformação', 'Segurança', 'Autonomia', 'Presença', 'Ética', 'Afeto', 'Equilíbrio', 'Recomeço', 'Colaboração', 'Humanidade', 'Calma'];

const NOMES_DIRECOES = [
  { id: 'conceito', nome: 'Uma ideia', ex: 'Travessia, Abrigo, Raiz, Elo, Clareira', d: 'Uma palavra que resume o que a clínica faz pelas pessoas.' },
  { id: 'natureza', nome: 'Natureza', ex: 'Ipê, Maré, Bambu, Sálvia, Aurora', d: 'Uma imagem da natureza que carrega um significado.' },
  { id: 'classico', nome: 'Grego ou latim', ex: 'Psyché, Ethos, Anima, Kairós, Logos', d: 'Palavras de origem antiga ligadas à mente e ao tempo.' },
  { id: 'lugar', nome: 'O lugar', ex: 'Casa Cambuí, Clínica Taquaral, Ateliê da Rua 7', d: 'O bairro, a rua ou a casa onde a clínica fica.' },
  { id: 'fundadores', nome: 'Os fundadores', ex: 'Clínica Moraes Lima, Instituto Prado Leme', d: 'O nome de quem fundou, como em escritórios e consultórios.' },
  { id: 'sigla', nome: 'Sigla ou nome curto', ex: 'CPI, Núcleo M, Espaço 3', d: 'Curto, fácil de lembrar, abre espaço para crescer.' },
];

const STEPS = [
  { id: 'inicio', t: 'Começo', titulo: ['Vamos construir', 'a marca da clínica'] },

  { id: 'clinica', t: 'A clínica', num: '01', titulo: ['A clínica', 'e o nome'], lead: 'Comece pelo básico: como a clínica se chama, onde fica e por que ela existe.',
    blocks: [
      { type: 'nome' },
      { id: 'nome_sentido', type: 'textarea', label: 'O que esse nome significa para vocês?', help: 'Se ainda não há nome, conte o que gostariam que ele transmitisse.', ex: 'Clareira é o espaço aberto no meio da mata, onde a luz entra. Queremos ser esse respiro no meio da correria.' },
      { id: 'descritor', type: 'chips', label: 'Como a clínica se apresenta embaixo do nome?', help: 'Escolha uma ou escreva a de vocês.', options: ['Clínica de Psicologia', 'Psicologia e Saúde Mental', 'Centro de Psicologia', 'Instituto de Psicologia', 'Espaço de Psicoterapia', 'Psicologia Integrada'], outro: true, max: 1 },
      { id: 'por_que', type: 'textarea', label: 'Por que vocês decidiram abrir a clínica?', help: 'A história real, do jeito que contariam para um amigo.', ex: 'Depois de anos atendendo sozinhos em salas alugadas, quatro colegas da mesma turma decidiram juntar forças para oferecer um cuidado mais completo, com troca de casos entre a equipe.' },
      { id: 'cidade', type: 'text', label: 'Cidade e bairro', ex: 'Campinas, Cambuí' },
      { id: 'modalidade', type: 'chips', label: 'Como vão atender?', options: ['Presencial', 'Online', 'Os dois'], max: 1 },
      { id: 'inauguracao', type: 'text', label: 'Quando a clínica abre (ou abriu)?', ex: 'Março de 2027' },
      { id: 'instagram', type: 'text', label: '@ do Instagram, se já existir', ex: '@clinicaclareira' },
    ] },

  { id: 'equipe', t: 'A equipe', num: '02', titulo: ['Quem faz', 'a clínica'], lead: 'Uma clínica com equipe precisa de uma marca que seja maior que cada pessoa e acolha todo mundo que entrar depois.',
    blocks: [
      { id: 'tamanho', type: 'chips', label: 'Quantos profissionais começam com a clínica?', options: ['2 a 3', '4 a 6', '7 a 10', 'Mais de 10'], max: 1 },
      { id: 'crescer', type: 'chips', label: 'A ideia é crescer a equipe?', options: ['Sim, bastante', 'Aos poucos', 'Não, ficar desse tamanho'], max: 1 },
      { id: 'areas', type: 'chips', label: 'Quais áreas a clínica vai reunir?', help: 'Marque todas.', options: ['Psicologia clínica', 'Avaliação neuropsicológica', 'Psicopedagogia', 'Psiquiatria parceira', 'Fonoaudiologia', 'Terapia ocupacional', 'Nutrição', 'Supervisão e cursos'], outro: true },
      { id: 'abordagens', type: 'chips', label: 'Quais abordagens a equipe usa?', options: ['TCC', 'Psicanálise', 'Humanista / ACP', 'Gestalt', 'Sistêmica', 'Análise do Comportamento / ABA', 'ACT', 'DBT', 'Terapia do Esquema', 'EMDR', 'Junguiana', 'Fenomenológica'], outro: true },
      { id: 'marca_vs_pessoas', type: 'slider', label: 'Quem aparece mais na comunicação?', esq: 'A clínica', esqD: 'A marca vem na frente, os profissionais aparecem como equipe.', dir: 'Os profissionais', dirD: 'Cada psicólogo tem rosto e nome em destaque.' },
      { id: 'jeito_equipe', type: 'textarea', label: 'Como a equipe trabalha junta? O que isso muda para o paciente?', ex: 'Fazemos reunião de casos toda semana. Se a criança precisa de avaliação e os pais de terapia de casal, tudo acontece aqui, com quem já conversa entre si.' },
      { id: 'responsavel', type: 'text', label: 'Responsável técnico e CRP', help: 'Esse dado aparece no cartão, no Instagram e nos anúncios, como pede o Código de Ética.', ex: 'Ana Moraes, CRP 06/123456' },
    ] },

  { id: 'publico', t: 'Quem atendem', num: '03', titulo: ['Para quem', 'é a clínica'], lead: 'A marca precisa falar com quem vocês querem receber. Quanto mais claro, mais certeira fica.',
    blocks: [
      { id: 'publicos', type: 'chips', label: 'Quem vocês atendem?', help: 'Marque todos.', options: ['Crianças', 'Adolescentes', 'Adultos', 'Idosos', 'Casais', 'Famílias', 'Gestantes e puérperas', 'Neurodivergentes (TEA, TDAH)', 'LGBTQIAPN+', 'Empresas'], outro: true },
      { id: 'principal', type: 'text', label: 'Se tivesse que escolher um público principal, qual seria?', ex: 'Adultos de 25 a 45 anos, profissionais cansados, e as famílias deles.' },
      { id: 'queixas', type: 'textarea', label: 'Com o que as pessoas mais chegam?', ex: 'Ansiedade, esgotamento no trabalho, luto, conflitos no casamento, crianças com dificuldade na escola.' },
      { id: 'persona', type: 'textarea', label: 'Descreva um paciente típico', help: 'Idade, rotina, o que sente quando procura ajuda, o que pesa na decisão.', ex: 'Marina, 34, gerente, mãe de um menino de 6. Adiou a terapia por dois anos por falta de tempo e medo de ser julgada. Escolheu pela indicação de uma amiga e porque o Instagram parecia leve e sério ao mesmo tempo.' },
      { id: 'pagamento', type: 'chips', label: 'Atendimento', options: ['Particular', 'Convênio', 'Particular e convênio', 'Valor social também'], max: 1 },
      { id: 'faixa', type: 'slider', label: 'Como vocês se posicionam em preço na cidade?', esq: 'Acessível', esqD: 'Para muita gente, preço é decisivo.', dir: 'Premium', dirD: 'Atendimento exclusivo, valor mais alto.' },
      { id: 'canais', type: 'chips', label: 'Por onde os pacientes vão chegar?', options: ['Indicação', 'Google', 'Instagram', 'Convênio', 'Médicos e escolas', 'Empresas'], outro: true },
    ] },

  { id: 'essencia', t: 'Essência', num: '04', titulo: ['O que a clínica', 'é por dentro'], lead: 'Daqui sai o conceito da marca. Respondam sem pensar em design, só no que vocês acreditam.',
    blocks: [
      { id: 'frase', type: 'textarea', label: 'Em uma frase: o que a clínica faz pela vida de alguém?', ex: 'Ajuda pessoas cansadas a entenderem o que sentem e a voltarem a escolher a própria vida.' },
      { id: 'palavras', type: 'chips', label: 'Escolha até 3 palavras que são a cara da clínica', options: PALAVRAS, outro: true, max: 3 },
      { id: 'sentir', type: 'textarea', label: 'O que a pessoa deve sentir ao entrar na recepção?', ex: 'Alívio. Que pode respirar, que ninguém está com pressa e que está num lugar sério.' },
      { id: 'diferencial', type: 'textarea', label: 'O que vocês têm que as outras clínicas da cidade não têm?', ex: 'Equipe que se fala de verdade, avaliação e terapia no mesmo lugar e retorno para a família em linguagem simples.' },
      { id: 'nunca', type: 'chips', label: 'A clínica NUNCA pode parecer...', help: 'Marque o que deve ficar longe.', options: ['Hospital ou laboratório', 'Coach ou autoajuda', 'Infantil demais', 'Fria e distante', 'Mística ou esotérica', 'Luxo inacessível', 'Barata ou improvisada', 'Igual a todas as outras'], outro: true },
    ] },

  { id: 'personalidade', t: 'Personalidade', num: '05', titulo: ['Se a clínica', 'fosse uma pessoa'], lead: 'Arraste cada barra para o lado que mais combina. O meio vale como equilíbrio entre os dois.',
    blocks: [
      { id: 'p_acolhedora', type: 'slider', esq: 'Acolhedora', esqD: 'Abraço, conversa, café.', dir: 'Técnica', dirD: 'Precisão, método, dados.' },
      { id: 'p_classica', type: 'slider', esq: 'Clássica', esqD: 'Tradição, sobriedade.', dir: 'Contemporânea', dirD: 'Atual, fora do padrão.' },
      { id: 'p_leve', type: 'slider', esq: 'Leve', esqD: 'Sorriso, cor, respiro.', dir: 'Séria', dirD: 'Peso, formalidade.' },
      { id: 'p_delicada', type: 'slider', esq: 'Delicada', esqD: 'Traço fino, sutileza.', dir: 'Marcante', dirD: 'Traço forte, presença.' },
      { id: 'p_minimal', type: 'slider', esq: 'Minimalista', esqD: 'Pouco elemento, muito espaço.', dir: 'Detalhada', dirD: 'Textura, ilustração, camadas.' },
      { id: 'p_organica', type: 'slider', esq: 'Orgânica', esqD: 'Curvas, natureza, mão.', dir: 'Geométrica', dirD: 'Retas, grid, precisão.' },
      { id: 'p_quente', type: 'slider', esq: 'Quente', esqD: 'Terra, sol, pele.', dir: 'Fria', dirD: 'Azul, cinza, calma.' },
      { id: 'p_silenciosa', type: 'slider', esq: 'Silenciosa', esqD: 'Discreta, elegante.', dir: 'Expressiva', dirD: 'Chama atenção no feed.' },
    ] },

  { id: 'logo', t: 'Logo', num: '06', titulo: ['Logos que', 'inspiram'], lead: 'Referências reais de estúdios. Toquem em Amei, Talvez ou Não em cada uma e comente o que chamou atenção. Não precisa gostar de tudo: o que vocês rejeitam também me orienta.',
    blocks: [
      { id: 'tipos', type: 'tipos' },
      { id: 'galeria', type: 'galeria', cats: ['nome', 'simbolo', 'monograma', 'selo', 'organico', 'geometrico', 'sistema'] },
    ] },

  { id: 'simbolos', t: 'Símbolos', num: '07', titulo: ['Símbolos', 'e combinações'], lead: 'Estes desenhos são só exemplos de ideias, não o logo final. Marquem o que combina com a clínica. Se quiserem, mais abaixo dá para juntar dois ou três e ver uma ideia nova.',
    blocks: [
      { id: 'simb', type: 'simbolos' },
      { id: 'combo', type: 'combo' },
      { id: 'simbolo_ideia', type: 'textarea', label: 'Existe alguma imagem que tem a ver com a história de vocês?', help: 'Pode ser um objeto, um lugar, uma lembrança da equipe.', ex: 'A janela grande da sala de espera, que dá para um ipê. Todo mundo comenta dela.' },
    ] },

  { id: 'cores', t: 'Cores', num: '08', titulo: ['Cores que', 'contam a história'], lead: 'Oito propostas pensadas para uma clínica de psicologia, já aplicadas num cartão e num post. Avaliem cada uma e comentem.',
    blocks: [
      { id: 'paletas', type: 'paletas' },
      { id: 'cores_nao', type: 'chips', label: 'Alguma cor que vocês NÃO querem de jeito nenhum?', options: ['Vermelho', 'Laranja forte', 'Amarelo', 'Rosa', 'Roxo', 'Azul', 'Verde', 'Marrom', 'Preto', 'Cinza'], outro: true },
      { id: 'cores_sim', type: 'text', label: 'Alguma cor que precisa estar, por gosto ou história?', ex: 'Um verde, porque a sala tem muitas plantas.' },
    ] },

  { id: 'fontes', t: 'Letras', num: '09', titulo: ['Letras e', 'a fonte própria'], lead: 'Digite o nome da clínica e veja como ele fica em cada estilo. A fonte própria da marca vai nascer da direção escolhida aqui.',
    blocks: [
      { id: 'fontes', type: 'fontes' },
      { id: 'estilo_fonte', type: 'estilos', label: 'Para a fonte exclusiva da clínica, qual caminho agrada mais?' },
    ] },

  { id: 'clima', t: 'Clima', num: '10', titulo: ['O clima', 'das imagens'], lead: 'Ambientes que ajudam a imaginar como a marca vai se sentir no espaço e nas fotos.',
    blocks: [
      { id: 'galeria_amb', type: 'galeria', cats: ['ambiente'] },
      { id: 'imagens', type: 'chips', label: 'Que tipo de imagem combina com a clínica?', options: ['Fotos reais da equipe', 'Fotos do espaço', 'Ilustrações', 'Texturas e formas abstratas', 'Natureza e luz', 'Pouca imagem, mais tipografia'], outro: true },
    ] },

  { id: 'referencias', t: 'Suas refs', num: '11', titulo: ['Agora é', 'a vez de vocês'], lead: 'Mandem o que já têm: fotos do espaço, logo antigo, prints de marcas que gostam, rascunhos. E deixem os links de quem admiram.',
    blocks: [
      { id: 'upload', type: 'upload' },
      { id: 'links', type: 'links' },
      { id: 'admiram', type: 'textarea', label: 'Marcas que vocês admiram, de qualquer área', help: 'Café, roupa, hotel, outra clínica. Digam o porquê.', ex: 'Aesop, pela calma das lojas. Um hotel pequeno que visitamos, pela recepção que parece sala de estar.' },
      { id: 'concorrentes', type: 'textarea', label: 'Clínicas da cidade que vocês conhecem', help: 'Quais respeitam e de quais querem se diferenciar.', ex: 'A Clínica X é muito boa, mas a marca é fria, parece hospital. Queremos o oposto.' },
      { id: 'final', type: 'textarea', label: 'Algo que eu não perguntei e vocês querem dizer?', ex: 'Queremos que a marca funcione bem no Instagram, porque é lá que mais pessoas vão nos conhecer.' },
    ] },

  { id: 'envio', t: 'Envio', num: '12', titulo: ['Revisar', 'e enviar'] },
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
