import caseFile from "../../data/cases/vale-disappearance/case.json";
import entitiesFile from "../../data/cases/vale-disappearance/entities.json";
import evidenceFile from "../../data/cases/vale-disappearance/evidence.json";
import eventsFile from "../../data/cases/vale-disappearance/events.json";
import locationsFile from "../../data/cases/vale-disappearance/locations.json";

export type CaseLocaleCode = "en" | "pt-PT";

export type CanonicalCaseContent = {
  case: typeof caseFile;
  entities: Record<string, (typeof entitiesFile)[number]>;
  evidence: Record<string, (typeof evidenceFile)[number]>;
  events: Record<string, (typeof eventsFile)[number]>;
  locations: Record<string, (typeof locationsFile)[number]>;
};

export type CaseLocaleOverrides = {
  case?: {
    title?: string;
    tagline?: string;
    summary?: string;
    setting?: string;
    themes?: string[];
    canonicalQuestion?: string;
    canonicalOutcome?: string;
    statusLabel?: string;
  };
  entities?: Record<
    string,
    {
      name?: string;
      role?: string;
      summary?: string;
      description?: string;
      publicNotes?: string;
      hiddenNotes?: string;
    }
  >;
  evidence?: Record<
    string,
    {
      title?: string;
      sourceLabel?: string;
      summary?: string;
      content?: string;
    }
  >;
  events?: Record<
    string,
    {
      title?: string;
      description?: string;
    }
  >;
  locations?: Record<
    string,
    {
      name?: string;
      summary?: string;
      description?: string;
    }
  >;
};

export type LocalizedCaseContent = CanonicalCaseContent & {
  case: CanonicalCaseContent["case"] & { statusLabel: string };
};

function indexBy<T extends { slug?: string; code?: string }>(
  items: readonly T[],
  keySelector: (item: T) => string,
) {
  return Object.fromEntries(items.map((item) => [keySelector(item), item]));
}

const canonicalCaseContent: CanonicalCaseContent = {
  case: caseFile,
  entities: indexBy(entitiesFile, (entity) => entity.slug),
  evidence: indexBy(evidenceFile, (item) => item.code),
  events: indexBy(eventsFile, (event) => event.slug),
  locations: indexBy(locationsFile, (location) => location.slug),
};

const ptPtOverrides: CaseLocaleOverrides = {
  case: {
    title: "Caso 01: O Desaparecimento de Vale",
    tagline: "O mar guardou o som. A cidade enterrou o resto.",
    summary:
      "Mara Vale, investigadora ambiental, desaparece depois de descobrir dados falsificados sobre a segurança das turbinas ligados à Blackwake Energy. O jogador reconstrói a noite, separa rumor de prova e decide se a verdade aponta para um desaparecimento, homicídio ou encobrimento após uma queda acidental.",
    setting:
      "Cidade costeira castigada pela tempestade, com uma central mareomotriz, estradas do porto e um arquivo municipal restrito.",
    themes: [
      "lucro contra segurança pública",
      "lealdade local contra verdade",
      "decomposição institucional escondida por dependência económica",
      "ambiguidade no motivo, clareza na responsabilidade",
    ],
    canonicalQuestion: "O que aconteceu a Mara Vale?",
    canonicalOutcome:
      "Mara morreu depois de um confronto coercivo; Elena Voss, o subagente Soren Pike e Tomas Reed participaram no encobrimento.",
    statusLabel: "rascunho",
  },
  entities: {
    "mara-vale": {
      role: "investigadora ambiental",
      summary: "Investigadora independente que descobre o escândalo da segurança das turbinas.",
      description:
        "Mara é metódica, isolada e cada vez mais alarmada à medida que percebe que os relatórios publicados não batem certo com os danos na costa.",
      publicNotes: "Figura teimosa, com reputação de jornalismo exaustivo.",
      hiddenNotes:
        "Guardou um pacote duplicado de provas num cacifo clandestino e planeava entregar o material a Jonah e a um regulador.",
    },
    "elena-voss": {
      role: "diretora de operações da Blackwake Energy",
      summary:
        "Executiva que descobre que os ficheiros foram copiados e ajuda a coordenar o encobrimento.",
      description:
        "Elena apresenta-se como alguém que protege a economia da cidade enquanto autoriza silenciosamente a eliminação e substituição de registos.",
      publicNotes: "Líder corporativa polida, focada na estabilidade e no emprego.",
      hiddenNotes:
        "Não ordenou o homicídio, mas tornou o encobrimento possível quando o confronto correu mal.",
    },
    "deputy-soren-pike": {
      role: "agente adjunto e guardião do arquivo",
      summary:
        "Agente local que obstrui o escrutínio externo e ajuda a enterrar o que vem a seguir.",
      description:
        "Pike é o ponto de pressão entre a autoridade municipal e os interesses da Blackwake. Sinaliza os pedidos de acesso de Mara, chega ao local e mais tarde arquiva o caso como desaparecimento.",
      publicNotes: "Prático, cansado e sempre perto da papelada oficial.",
      hiddenNotes:
        "Já tinha ajudado a retirar uma queixa de segurança anterior do fluxo de entrada.",
    },
    "tomas-reed": {
      role: "mestre do porto",
      summary:
        "O homem que organiza o encontro final e depois ajuda a mover provas.",
      description:
        "Tomas é leal ao porto e está exposto às consequências de um colapso da Blackwake, o que o torna fácil de pressionar e de comprometer.",
      publicNotes: "Um funcionário cívico cansado que mantém o porto a funcionar.",
      hiddenNotes:
        "Mente sobre o percurso nessa noite e discute se deve chamar ajuda depois da queda.",
    },
    "jonah-quill": {
      role: "jornalista local",
      summary:
        "Repórter que recebe parte do pacote de Mara e ajuda a estabelecer a cronologia.",
      description:
        "Jonah é uma das poucas pessoas em quem Mara confia o suficiente para fazer um briefing antes da publicação. É útil porque consegue ligar a trilha documental ao escrutínio público.",
      publicNotes: "Uma perturbação persistente para os responsáveis da cidade.",
      hiddenNotes:
        "Recebe apenas um pacote encriptado parcial depois de Mara desaparecer.",
    },
    "iris-fen": {
      role: "pescadora",
      summary:
        "Testemunha com uma declaração incompleta e medo de retaliação.",
      description:
        "Iris ouviu a discussão perto do caminho da falésia e mais tarde tenta corrigir o registo, mas a cópia oficial do arquivo já foi higienizada.",
      publicNotes: "Testemunha pouco fiável aos olhos da cidade.",
      hiddenNotes:
        "A declaração original mencionava duas vozes masculinas; a cópia do arquivo removeu uma delas.",
    },
    "blackwake-energy": {
      role: "empresa de infraestruturas mareomotrizes",
      summary:
        "A empresa por trás da central, dos relatórios de segurança e da pressão política para manter o caso em silêncio.",
      description:
        "A Blackwake depende do projeto das turbinas para a economia da cidade e usa essa alavanca para suprimir queixas e desviar o escrutínio.",
      publicNotes: "Empregador local e operador de infraestruturas.",
      hiddenNotes:
        "Os registos da empresa mostram dois relatórios de inspeção incompatíveis e uma entrada de registo apagada.",
    },
    "turbine-3": {
      role: "ativo industrial crítico",
      summary: "A unidade com o defeito de vibração oculto e a trilha forense mais forte.",
      description:
        "A Turbina 3 é o local onde a falha de segurança foi escondida, tornando-a o centro técnico do escândalo e não apenas um elemento de fundo.",
      publicNotes: "Uma das unidades do conjunto mareomotriz.",
      hiddenNotes:
        "A versão perigosa do relatório de inspeção avisa que a falha pode causar um colapso mecânico catastrófico perto do canal do porto.",
    },
  },
  evidence: {
    "EV-001": {
      title: "Excerto do Caderno de Campo",
      sourceLabel: "Mara Vale",
      summary:
        "Notas manuscritas a descrever anomalias marinhas e preocupação com relatórios falsificados.",
      content:
        "Mara regista zonas mortas perto do canal de descarga, um ruído de vibração invulgar da Turbina 3 e a suspeita de que o registo de segurança publicado está incompleto.",
    },
    "EV-002": {
      title: "Fotograma CCTV do Porto",
      sourceLabel: "Câmara do porto",
      summary: "Fotograma que mostra Mara a aproximar-se da estrada de serviço às 20:42.",
      content:
        "Um fotograma granulado apanha Mara sozinha, com o saco ao ombro, perto da estrada de serviço do porto pouco antes da janela do desaparecimento.",
    },
    "EV-003": {
      title: "Mensagem Telefónica de Tomas",
      sourceLabel: "Tomas Reed",
      summary: "Mensagem a convidar Mara para um encontro tardio.",
      content:
        "Tomas pede a Mara que se encontre com ele porque precisa de lhe dizer algo antes de ela publicar. A mensagem é calma, deliberada e está datada do dia anterior ao desaparecimento.",
    },
    "EV-004": {
      title: "Relatório Oficial de Pessoa Desaparecida",
      sourceLabel: "Subagente Pike",
      summary: "Relatório policial que enquadra o caso como desaparecimento e atrasa a busca.",
      content:
        "O relatório enfatiza a incerteza, classifica o caso como sensível e omite sinais mais fortes de ferimento ou de crime.",
    },
    "EV-005": {
      title: "Transcrição da Entrevista: Jonah Quill",
      sourceLabel: "Entrevista jornalística",
      summary:
        "Jonah explica que Mara tinha material publicável e temia interferência.",
      content:
        "Jonah confirma que Mara tinha material suficiente para uma reportagem e já tinha começado a perguntar como verificar a cadeia de custódia antes de ir a público.",
    },
    "EV-006": {
      title: "Conjunto de Fotografias Ambientais",
      sourceLabel: "Câmara da Mara",
      summary: "Peixes mortos e espuma química junto ao canal de descarga.",
      content:
        "As fotografias mostram danos ambientais que não batem com a mensagem pública de segurança da Blackwake.",
    },
    "EV-007": {
      title: "Memorando Interno de Manutenção",
      sourceLabel: "Blackwake",
      summary: "Memorando a instruir os funcionários para não falarem de manutenção.",
      content:
        "Os funcionários são instruídos a encaminhar qualquer pergunta sobre rondas de manutenção noturnas para a operação e a não discutir a manutenção das turbinas com terceiros.",
    },
    "EV-008": {
      title: "Relatório de Inspeção Duplicado A",
      sourceLabel: "Arquivo do contratante",
      summary: "Resumo estrutural seguro que contradiz a versão perigosa.",
      content:
        "Esta cópia do relatório diz que a turbina continua dentro de parâmetros seguros de funcionamento e que apenas necessita de manutenção de rotina.",
    },
    "EV-009": {
      title: "Relatório de Inspeção Duplicado B",
      sourceLabel: "Arquivo do contratante",
      summary: "Falha de vibração perigosa e aviso de reparação urgente.",
      content:
        "Esta versão avisa que a turbina pode falhar sob stress e que o canal do porto pode ser afetado se a falha não for tratada de imediato.",
    },
    "EV-010": {
      title: "Câmara de Trânsito da Viatura da Polícia",
      sourceLabel: "Câmara municipal da estrada",
      summary: "Viatura de Pike perto da Estrada do Farol às 21:11.",
      content:
        "O fotograma de trânsito contradiz a declaração posterior de Pike sobre onde estava durante a janela do desaparecimento.",
    },
    "EV-011": {
      title: "Registo de Chamadas",
      sourceLabel: "Registos telefónicos",
      summary: "Metadados a mostrar que Elena telefonou a Tomas às 21:20.",
      content:
        "A chamada dura quarenta e sete segundos e cai mesmo no meio da janela do confronto, ligando Elena à noite do desaparecimento.",
    },
    "EV-012": {
      title: "Declaração da Testemunha: Iris Fen",
      sourceLabel: "Testemunha do porto",
      summary: "Declaração a descrever uma discussão e duas vozes perto do caminho da falésia.",
      content:
        "Iris ouviu a discussão levada pelo vento desde o caminho da falésia e acreditou que havia dois homens a falar com Mara antes de o ruído parar.",
    },
    "EV-013": {
      title: "Declaração da Testemunha Redigida",
      sourceLabel: "Processo policial",
      summary: "A cópia oficial remove a referência à segunda voz masculina.",
      content:
        "A versão do arquivo tem uma redação no sítio onde deveria estar a segunda voz masculina, o que sugere que o registo foi alterado depois dos factos.",
    },
    "EV-014": {
      title: "Exportação do Registo de Acessos da Central",
      sourceLabel: "Central da Blackwake",
      summary: "Eliminação suspeita por volta das 22:02.",
      content:
        "Uma entrada de acesso desaparece da exportação e a eliminação coincide com o momento em que o encobrimento deixa de ser passivo e passa a ativo.",
    },
    "EV-015": {
      title: "Rascunho da Mensagem de Voz",
      sourceLabel: "Telemóvel da Mara",
      summary: "Mara diz que encontrou a peça que prova a intenção.",
      content:
        "O rascunho da mensagem de voz sugere que Mara acreditava ter prova não apenas de negligência, mas de encobrimento deliberado.",
    },
    "EV-016": {
      title: "Fragmento do Gravador",
      sourceLabel: "Fragmento de dispositivo recuperado",
      summary: "Áudio danificado com discussão, pedido do saco e um som de escorregão.",
      content:
        "O fragmento inclui um intercâmbio hostil, um pedido pelo saco e pelo gravador, e uma mudança brusca de apoio compatível com uma queda.",
    },
    "EV-017": {
      title: "Fotografias Forenses do Caminho da Falésia",
      sourceLabel: "Inspeção posterior",
      summary: "Barra de proteção partida, vestígios de sangue e ausência de marcas de arrasto.",
      content:
        "A cena sugere uma queda seguida da movimentação das provas, e não uma luta que continuou pelo chão.",
    },
    "EV-018": {
      title: "Recibo do Cacifo do Terminal de Ferry",
      sourceLabel: "Registos do terminal",
      summary: "Recibo que mostra que Mara criou um depósito clandestino no dia anterior.",
      content:
        "O recibo prova que Mara esperava entregar material de forma indireta e que já se tinha preparado para a possibilidade de interferência.",
    },
    "EV-019": {
      title: "Desencriptação Parcial do Pacote Encriptado",
      sourceLabel: "Jonah Quill",
      summary: "Pacote recuperado com registos selecionados da Blackwake e uma nota de capa inacabada.",
      content:
        "Jonah apenas consegue abrir parte do arquivo, mas os ficheiros coincidem com a trilha investigativa de Mara e mostram que ela estava a preparar um pacote publicável.",
    },
    "EV-020": {
      title: "Lacuna no Arquivo de Queixas Anteriores",
      sourceLabel: "Arquivo Municipal",
      summary: "Uma queixa histórica de segurança foi removida da entrada policial.",
      content:
        "A auditoria ao arquivo mostra uma lacuna anterior ao desaparecimento de Mara, ligando Pike a uma supressão mais antiga e reforçando a teoria do encobrimento institucional.",
    },
  },
  events: {
    "mara-starts-investigation": {
      title: "Mara Inicia a Investigação",
      description:
        "Mara começa a seguir a discrepância entre os danos marinhos e os dados de segurança publicados.",
    },
    "mara-meets-jonah": {
      title: "Mara Encontra Jonah",
      description:
        "Mara informa Jonah sobre o risco de publicação e pede-lhe que espere até a cadeia de custódia estar confirmada.",
    },
    "maintenance-memo-distributed": {
      title: "Memorando de Manutenção Distribuído",
      description:
        "A Blackwake diz aos funcionários para não falarem de manutenção nem das rondas noturnas.",
    },
    "duplicate-inspection-report-created": {
      title: "Criação dos Relatórios de Inspeção Duplicados",
      description:
        "Dois relatórios de inspeção contraditórios aparecem no arquivo do contratante.",
    },
    "dead-drop-prepared": {
      title: "Depósito Clandestino Preparado",
      description:
        "Mara guarda um pacote duplicado de provas num cacifo do terminal de ferry.",
    },
    "mara-leaves-flat": {
      title: "Mara Sai do Apartamento",
      description:
        "Mara sai de casa com o saco, o gravador e o telemóvel.",
    },
    "harbor-approach-seen": {
      title: "Mara Vista na Aproximação ao Porto",
      description:
        "A CCTV apanha Mara perto da estrada de serviço do porto.",
    },
    "pike-vehicle-near-lighthouse-road": {
      title: "Viatura de Pike na Estrada do Farol",
      description:
        "Os dados de trânsito colocam a viatura de patrulha de Pike na estrada do farol durante a janela crítica.",
    },
    "tomas-arrives-at-old-harbor": {
      title: "Tomas Chega ao Antigo Porto",
      description:
        "Tomas entra no perímetro antes do confronto.",
    },
    "elena-calls-tomas": {
      title: "Elena Liga a Tomas",
      description:
        "Elena liga a Tomas durante quarenta e sete segundos enquanto Mara está no caminho da falésia.",
    },
    "confrontation-on-cliff-path": {
      title: "Confronto no Caminho da Falésia",
      description:
        "A discussão escala e Pike exige o saco e o gravador de Mara.",
    },
    "mara-falls": {
      title: "Mara Cai",
      description:
        "Mara escorrega por cima da barreira para o patamar de manutenção inferior.",
    },
    "access-log-deleted": {
      title: "Registo de Acesso Apagado",
      description:
        "Uma entrada de acesso da central é removida depois de a cena ser controlada.",
    },
    "missing-person-report-filed": {
      title: "Queixa de Pessoa Desaparecida Apresentada",
      description:
        "Pike declara Mara como desaparecida em vez de ferida e a busca começa tarde demais.",
    },
  },
  locations: {
    "tidal-plant": {
      name: "Central Mareomotriz da Blackwake",
      summary:
        "Instalação industrial onde o conjunto mareomotriz é monitorizado e onde ficam os registos de segurança.",
      description:
        "A central fica na margem do canal do porto e é o centro do escândalo de segurança.",
    },
    "old-harbor": {
      name: "Antigo Porto",
      summary:
        "Zona histórica do porto onde Tomas trabalha e onde o encontro final começa.",
      description:
        "Um porto de trabalho estreito com estradas de serviço, portões perimetrais e iluminação cansada.",
    },
    "cliff-path": {
      name: "Caminho da Falésia",
      summary:
        "Caminho costeiro molhado sobre o canal da tempestade onde o confronto se torna físico.",
      description:
        "A barra de proteção, o patamar de manutenção inferior e a zona de escorregão são todos relevantes para a reconstrução forense.",
    },
    "lighthouse-road": {
      name: "Estrada do Farol",
      summary:
        "Estrada superior usada por viaturas de patrulha e um dos principais pontos de contradição na cronologia.",
      description:
        "A CCTV e os dados de trânsito colocam Pike nesta estrada no momento exato em que ele depois diz estar noutro sítio.",
    },
    "maras-rented-flat": {
      name: "Apartamento Arrendado da Mara",
      summary:
        "Casa temporária onde Mara organiza o pacote de provas e sai para o encontro final.",
      description:
        "O apartamento contém o caderno, os rastos do telemóvel e o sinal de que ela ainda estava ativamente a trabalhar no caso.",
    },
    "records-office": {
      name: "Arquivo Municipal",
      summary:
        "Ponto de acesso ao arquivo municipal onde Mara pede registos ambientais.",
      description:
        "Um estrangulamento burocrático que mostra como a cidade gere a informação e suprime queixas.",
    },
    "ferry-terminal-locker": {
      name: "Cacifo do Terminal de Ferry",
      summary:
        "Cacifo clandestino usado para guardar o pacote duplicado de provas de Mara.",
      description:
        "O recibo prova que Mara planeava publicar e temia que os ficheiros originais lhe fossem retirados.",
    },
  },
};

export const caseCanonicalLocale: CanonicalCaseContent = canonicalCaseContent;
export const casePtPtOverrides = ptPtOverrides;

export const caseLocales: Record<
  CaseLocaleCode,
  CanonicalCaseContent | (CanonicalCaseContent & { case: CanonicalCaseContent["case"] & { statusLabel: string } })
> = {
  en: caseCanonicalLocale,
  "pt-PT": {
    ...canonicalCaseContent,
    case: {
      ...canonicalCaseContent.case,
      ...ptPtOverrides.case,
      statusLabel: ptPtOverrides.case?.statusLabel ?? canonicalCaseContent.case.status,
    },
    entities: Object.fromEntries(
      Object.entries(canonicalCaseContent.entities).map(([slug, entity]) => [
        slug,
        {
          ...entity,
          ...(ptPtOverrides.entities?.[slug] ?? {}),
        },
      ]),
    ),
    evidence: Object.fromEntries(
      Object.entries(canonicalCaseContent.evidence).map(([code, item]) => [
        code,
        {
          ...item,
          ...(ptPtOverrides.evidence?.[code] ?? {}),
        },
      ]),
    ),
    events: Object.fromEntries(
      Object.entries(canonicalCaseContent.events).map(([slug, event]) => [
        slug,
        {
          ...event,
          ...(ptPtOverrides.events?.[slug] ?? {}),
        },
      ]),
    ),
    locations: Object.fromEntries(
      Object.entries(canonicalCaseContent.locations).map(([slug, location]) => [
        slug,
        {
          ...location,
          ...(ptPtOverrides.locations?.[slug] ?? {}),
        },
      ]),
    ),
  },
};

export function getValeDisappearanceLocale(locale: CaseLocaleCode) {
  return caseLocales[locale];
}
